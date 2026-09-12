-- ============================================================================
-- MIGRACIÓN FASE 1 CORREGIDA: IDENTIDAD, CATÁLOGO, INSCRIPCIÓN Y PROGRESO
-- Archivo: supabase/migrations/20260910113000_init_case_os_phase1.sql
-- ============================================================================

-- 1. Esquema y funciones de utilidad
grant usage on schema public to anon, authenticated, service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- 2. Tabla Profiles
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    display_name text not null default 'Learner',
    avatar_url text,
    role text not null default 'student' check (role in ('student', 'instructor', 'issuer', 'admin')),
    preferred_language text not null default 'es',
    timezone text not null default 'UTC',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SELECT restringido estrictamente al propio usuario
create policy "profiles_select_own" on public.profiles
    for select to authenticated
    using ((select auth.uid()) = id);

-- UPDATE restringido al propio usuario
create policy "profiles_update_own" on public.profiles
    for update to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

create trigger trg_profiles_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();

-- Trigger Google OAuth (SECURITY DEFINER con search_path explícito)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_display_name text;
    v_avatar_url text;
begin
    v_display_name := nullif(trim(coalesce(
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name',
        new.raw_user_meta_data ->> 'user_name',
        split_part(new.email, '@', 1),
        'Learner'
    )), '');

    if v_display_name is not null then
        v_display_name := substr(v_display_name, 1, 100);
    else
        v_display_name := 'Learner';
    end if;

    v_avatar_url := nullif(trim(coalesce(
        new.raw_user_meta_data ->> 'avatar_url',
        new.raw_user_meta_data ->> 'picture'
    )), '');

    insert into public.profiles (id, email, display_name, avatar_url, updated_at)
    values (new.id, new.email, v_display_name, v_avatar_url, now())
    on conflict (id) do update set
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

    return new;
end;
$$;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- 3. Preferencias del Usuario (con soporte para tombstone sync)
create table if not exists public.user_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    favorites jsonb not null default '[]'::jsonb, -- [{ id, deleted, updated_at }]
    history jsonb not null default '[]'::jsonb,   -- [{ path, title, visited_at }]
    theme text not null default 'dark',
    updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;
create policy "prefs_all_own" on public.user_preferences
    for all to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create trigger trg_user_preferences_updated_at
    before update on public.user_preferences
    for each row execute function public.set_updated_at();

-- 4. Catálogo Versionado (Proyección de Git)
create table if not exists public.program_versions (
    id uuid primary key default gen_random_uuid(),
    slug text not null,
    version text not null,
    title text not null,
    status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    constraint uq_program_version unique (slug, version)
);

create table if not exists public.learning_units (
    id text primary key, -- c1, c2, l1, d1...
    module_id text not null, -- m1, m2...
    type text not null check (type in ('LESSON', 'DEMO', 'LAB', 'CAPSTONE')),
    created_at timestamptz not null default now()
);

create table if not exists public.learning_unit_versions (
    id uuid primary key default gen_random_uuid(),
    unit_id text not null references public.learning_units(id) on delete cascade,
    version text not null default '1.0.0',
    path text not null,
    title text not null,
    git_commit_hash text,
    created_at timestamptz not null default now(),
    constraint uq_unit_version unique (unit_id, version)
);

create table if not exists public.program_units (
    program_version_id uuid not null references public.program_versions(id) on delete cascade,
    unit_version_id uuid not null references public.learning_unit_versions(id) on delete restrict,
    display_order integer not null check (display_order > 0),
    prerequisites text[] not null default '{}',
    primary key (program_version_id, unit_version_id)
);

-- Trigger de Inmutabilidad Integral del Catálogo
create or replace function public.prevent_published_catalog_mutation()
returns trigger
language plpgsql
as $$
declare
    v_status_old text;
    v_status_new text;
begin
    if tg_table_name = 'program_versions' then
        if tg_op = 'DELETE' then
            if old.status in ('PUBLISHED', 'ARCHIVED') then
                raise exception 'No se puede eliminar una versión de programa publicada o archivada (id: %)', old.id;
            end if;
            return old;
        end if;

        if tg_op = 'UPDATE' then
            if old.status in ('PUBLISHED', 'ARCHIVED') then
                if new.status = 'DRAFT' then
                    raise exception 'No se puede revertir un programa publicado o archivado a borrador (id: %)', old.id;
                end if;
                if (new.slug <> old.slug or new.version <> old.version or new.title <> old.title
                    or new.created_at is distinct from old.created_at
                    or new.published_at is distinct from old.published_at) then
                    raise exception 'No se pueden alterar los metadatos o fechas históricas de un programa publicado o archivado (id: %)', old.id;
                end if;
            end if;
            return new;
        end if;
    end if;

    if tg_table_name = 'program_units' then
        if tg_op in ('DELETE', 'UPDATE') then
            select status into v_status_old from public.program_versions where id = old.program_version_id;
            if v_status_old in ('PUBLISHED', 'ARCHIVED') then
                raise exception 'No se pueden retirar o mover unidades de un programa publicado o archivado (id: %)', old.program_version_id;
            end if;
        end if;

        if tg_op in ('INSERT', 'UPDATE') then
            select status into v_status_new from public.program_versions where id = new.program_version_id;
            if v_status_new in ('PUBLISHED', 'ARCHIVED') then
                raise exception 'No se pueden agregar unidades a un programa ya publicado o archivado (id: %)', new.program_version_id;
            end if;
        end if;

        return coalesce(new, old);
    end if;

    if tg_table_name = 'learning_unit_versions' then
        if tg_op in ('UPDATE', 'DELETE') then
            if exists (
                select 1
                from public.program_units pu
                join public.program_versions pv on pv.id = pu.program_version_id
                where pu.unit_version_id = old.id
                  and pv.status in ('PUBLISHED', 'ARCHIVED')
            ) then
                raise exception 'No se puede modificar ni eliminar una versión de unidad vinculada a un programa publicado o archivado (id: %)', old.id;
            end if;
        end if;
        return coalesce(new, old);
    end if;

    if tg_table_name = 'learning_units' then
        if tg_op = 'UPDATE' then
            if exists (
                select 1
                from public.learning_unit_versions luv
                join public.program_units pu on pu.unit_version_id = luv.id
                join public.program_versions pv on pv.id = pu.program_version_id
                where luv.unit_id = old.id
                  and pv.status in ('PUBLISHED', 'ARCHIVED')
            ) then
                if (new.id <> old.id or new.module_id <> old.module_id or new.type <> old.type or new.created_at is distinct from old.created_at) then
                    raise exception 'No se pueden alterar los metadatos históricos de la unidad (id: %) vinculada a un programa publicado o archivado', old.id;
                end if;
            end if;
        end if;

        if tg_op = 'DELETE' then
            if exists (
                select 1
                from public.learning_unit_versions luv
                join public.program_units pu on pu.unit_version_id = luv.id
                join public.program_versions pv on pv.id = pu.program_version_id
                where luv.unit_id = old.id
                  and pv.status in ('PUBLISHED', 'ARCHIVED')
            ) then
                raise exception 'No se puede eliminar una unidad (id: %) vinculada a un programa publicado o archivado', old.id;
            end if;
            return old;
        end if;

        return coalesce(new, old);
    end if;

    return coalesce(new, old);
end;
$$;

create trigger trg_protect_program_versions
    before update or delete on public.program_versions
    for each row execute function public.prevent_published_catalog_mutation();

create trigger trg_protect_program_units
    before insert or update or delete on public.program_units
    for each row execute function public.prevent_published_catalog_mutation();

create trigger trg_protect_learning_unit_versions
    before update or delete on public.learning_unit_versions
    for each row execute function public.prevent_published_catalog_mutation();

create trigger trg_protect_learning_units
    before update or delete on public.learning_units
    for each row execute function public.prevent_published_catalog_mutation();

-- Función transaccional de publicación con bloqueo coordinado
create or replace function public.publish_program_version(p_program_version_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_status text;
    v_unit_count int;
begin
    -- 1. Bloqueo exclusivo a nivel de fila sobre la versión del programa
    select status into v_status
    from public.program_versions
    where id = p_program_version_id
    for update;

    if not found then
        raise exception 'Programa no encontrado: %', p_program_version_id;
    end if;

    if v_status in ('PUBLISHED', 'ARCHIVED') then
        raise exception 'El programa ya se encuentra en estado %', v_status;
    end if;

    -- 2. Bloqueo coordinado sobre las filas de la malla y unidades para evitar carreras
    perform 1
    from public.program_units
    where program_version_id = p_program_version_id
    for update;

    perform 1
    from public.learning_unit_versions luv
    join public.program_units pu on pu.unit_version_id = luv.id
    where pu.program_version_id = p_program_version_id
    for update;

    perform 1
    from public.learning_units lu
    join public.learning_unit_versions luv on luv.unit_id = lu.id
    join public.program_units pu on pu.unit_version_id = luv.id
    where pu.program_version_id = p_program_version_id
    for update;

    select count(*) into v_unit_count
    from public.program_units
    where program_version_id = p_program_version_id;

    if v_unit_count = 0 then
        raise exception 'No se puede publicar un programa sin unidades de aprendizaje asociadas.';
    end if;

    -- 3. Transición atómica de estado
    update public.program_versions
    set status = 'PUBLISHED',
        published_at = coalesce(published_at, now())
    where id = p_program_version_id;
end;
$$;

alter table public.program_versions enable row level security;
alter table public.learning_units enable row level security;
alter table public.learning_unit_versions enable row level security;
alter table public.program_units enable row level security;

create policy "catalog_read_all" on public.program_versions for select to authenticated, anon using (true);
create policy "units_read_all" on public.learning_units for select to authenticated, anon using (true);
create policy "unit_versions_read_all" on public.learning_unit_versions for select to authenticated, anon using (true);
create policy "program_units_read_all" on public.program_units for select to authenticated, anon using (true);

-- 5. Inscripciones y Progreso Declarado
create table if not exists public.enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    program_version_id uuid not null references public.program_versions(id) on delete restrict,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'COMPLETED', 'PAUSED')),
    enrolled_at timestamptz not null default now(),
    constraint uq_user_enrollment unique (user_id, program_version_id)
);

alter table public.enrollments enable row level security;

create policy "enrollments_select_own" on public.enrollments
    for select to authenticated using ((select auth.uid()) = user_id);

-- Solo auto-inscripción con ACTIVE y en programas PUBLISHED
create policy "enrollments_insert_own" on public.enrollments
    for insert to authenticated
    with check (
        (select auth.uid()) = user_id
        and status = 'ACTIVE'
        and exists (
            select 1 from public.program_versions pv
            where pv.id = program_version_id
              and pv.status = 'PUBLISHED'
        )
    );

-- Progreso Declarado vinculado a Inscripción y Versión de Unidad
create table if not exists public.unit_progress (
    id uuid primary key default gen_random_uuid(),
    enrollment_id uuid not null references public.enrollments(id) on delete cascade,
    unit_version_id uuid not null references public.learning_unit_versions(id) on delete restrict,
    declared_completed boolean not null default false,
    declared_at timestamptz,
    imported_from_guest boolean not null default false,
    updated_at timestamptz not null default now(),
    constraint uq_enrollment_unit_version unique (enrollment_id, unit_version_id),
    constraint chk_declared_consistency check (
        (declared_completed = true and declared_at is not null) or
        (declared_completed = false and declared_at is null)
    )
);

-- Validación de pertenencia: la unidad debe pertenecer a la malla del programa
create or replace function public.verify_unit_in_program()
returns trigger
language plpgsql
as $$
declare
    v_program_version_id uuid;
    v_exists boolean;
begin
    select program_version_id into v_program_version_id
    from public.enrollments where id = new.enrollment_id;

    select exists(
        select 1 from public.program_units
        where program_version_id = v_program_version_id
          and unit_version_id = new.unit_version_id
    ) into v_exists;

    if not v_exists then
        raise exception 'La unidad % no pertenece al programa inscrito %', new.unit_version_id, v_program_version_id;
    end if;

    return new;
end;
$$;

create trigger trg_verify_unit_in_program
    before insert or update on public.unit_progress
    for each row execute function public.verify_unit_in_program();

create trigger trg_unit_progress_updated_at
    before update on public.unit_progress
    for each row execute function public.set_updated_at();

alter table public.unit_progress enable row level security;

create policy "unit_progress_own" on public.unit_progress
    for all to authenticated
    using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.user_id = (select auth.uid())))
    with check (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.user_id = (select auth.uid())));

-- 6. Cursor de Navegación (validado por programa)
create table if not exists public.learning_state (
    enrollment_id uuid primary key references public.enrollments(id) on delete cascade,
    last_visited_unit_version_id uuid references public.learning_unit_versions(id) on delete set null,
    last_visited_path text,
    updated_at timestamptz not null default now()
);

create or replace function public.verify_learning_state_unit()
returns trigger
language plpgsql
as $$
declare
    v_program_version_id uuid;
    v_valid boolean;
begin
    if new.last_visited_unit_version_id is not null then
        select program_version_id into v_program_version_id
        from public.enrollments where id = new.enrollment_id;

        select exists(
            select 1 from public.program_units
            where program_version_id = v_program_version_id
              and unit_version_id = new.last_visited_unit_version_id
        ) into v_valid;

        if not v_valid then
            raise exception 'El cursor apunta a una unidad (%) ajena al programa inscrito (%)',
                new.last_visited_unit_version_id, v_program_version_id;
        end if;
    end if;
    return new;
end;
$$;

create trigger trg_verify_learning_state_unit
    before insert or update on public.learning_state
    for each row execute function public.verify_learning_state_unit();

create trigger trg_learning_state_updated_at
    before update on public.learning_state
    for each row execute function public.set_updated_at();

alter table public.learning_state enable row level security;

create policy "learning_state_own" on public.learning_state
    for all to authenticated
    using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.user_id = (select auth.uid())))
    with check (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.user_id = (select auth.uid())));

-- 7. Actividad Personal de Navegación
create table if not exists public.learning_activities (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    activity_type text not null check (activity_type in ('ACADEMY', 'LIBRARY', 'LABS', 'DASHBOARD', 'OTHER')),
    entity_id text not null,
    title text not null,
    route text not null,
    created_at timestamptz not null default now()
);

alter table public.learning_activities enable row level security;

create policy "activities_own" on public.learning_activities
    for all to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- ============================================================================
-- 8. REVOCACIÓN TOTAL Y RECONSTRUCCIÓN EXPLÍCITA DE PRIVILEGIOS
-- ============================================================================
revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.user_preferences from public, anon, authenticated;
revoke all on table public.program_versions from public, anon, authenticated;
revoke all on table public.learning_units from public, anon, authenticated;
revoke all on table public.learning_unit_versions from public, anon, authenticated;
revoke all on table public.program_units from public, anon, authenticated;
revoke all on table public.enrollments from public, anon, authenticated;
revoke all on table public.unit_progress from public, anon, authenticated;
revoke all on table public.learning_state from public, anon, authenticated;
revoke all on table public.learning_activities from public, anon, authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.prevent_published_catalog_mutation() from public, anon, authenticated;
revoke all on function public.publish_program_version(uuid) from public, anon, authenticated;
revoke all on function public.verify_unit_in_program() from public, anon, authenticated;
revoke all on function public.verify_learning_state_unit() from public, anon, authenticated;

-- Grants de Estudiante Autenticado (authenticated)
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url, preferred_language, timezone) on public.profiles to authenticated;

grant select, insert, update, delete on public.user_preferences to authenticated;

grant select on public.program_versions to authenticated, anon;
grant select on public.learning_units to authenticated, anon;
grant select on public.learning_unit_versions to authenticated, anon;
grant select on public.program_units to authenticated, anon;

grant select, insert on public.enrollments to authenticated;
grant select, insert, update on public.unit_progress to authenticated;
grant select, insert, update on public.learning_state to authenticated;
grant select, insert, delete on public.learning_activities to authenticated;
