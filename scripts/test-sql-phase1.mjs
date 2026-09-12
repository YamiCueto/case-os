import fs from 'node:fs';
import { Client } from 'pg';

/**
 * Script de validación estructural y suite de pruebas para la Migración Fase 1.
 *
 * REQUISITO DE ENTORNO PARA PRUEBAS DINÁMICAS:
 * - TEST_DATABASE_URL debe apuntar EXCLUSIVAMENTE a una instancia de Supabase Local
 *   (iniciada mediante `supabase start` con Postgres en el puerto 54322) o una base Supabase
 *   aislada de pruebas.
 * - Un motor PostgreSQL genérico/vainilla NO es suficiente porque la migración depende de:
 *   1. Esquema y tabla auth.users
 *   2. Función de contexto auth.uid()
 *   3. Roles de seguridad de Supabase: anon, authenticated, service_role
 * - NUNCA ejecutar contra el proyecto remoto de producción (gqvqmuefdsxlllqsrgqz).
 *
 * Si TEST_DATABASE_URL no está configurada, se ejecuta la verificación estática de integridad
 * DDL/RLS y se declara explícitamente la omisión de las pruebas dinámicas.
 */
const migrationFile = 'supabase/migrations/20260910113000_init_case_os_phase1.sql';

console.log('=== Suite de Verificación de Migración SQL Fase 1 ===');

if (!fs.existsSync(migrationFile)) {
  console.error(`Error: Archivo de migración ${migrationFile} no encontrado.`);
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf8');

// 1. Verificación Estática de Integridad DDL y RLS
console.log('\n--- 1. Verificación Estática DDL / RLS ---');
const checks = [
  {
    name: 'Privacidad de perfiles (SELECT propio)',
    pattern: /create policy "profiles_select_own"[\s\S]*?using \(\(select auth\.uid\(\)\) = id\)/,
  },
  {
    name: 'Privilegios de columna en profiles (Sin rol)',
    pattern: /grant update \(display_name, avatar_url, preferred_language, timezone\) on public\.profiles to authenticated/,
  },
  {
    name: 'Inmutabilidad de versiones de programa',
    pattern: /create trigger trg_protect_program_versions[\s\S]*?before update or delete on public\.program_versions/,
  },
  {
    name: 'Inmutabilidad de unidades de programa',
    pattern: /create trigger trg_protect_program_units[\s\S]*?before insert or update or delete on public\.program_units/,
  },
  {
    name: 'Inmutabilidad de versiones de unidad de aprendizaje',
    pattern: /create trigger trg_protect_learning_unit_versions[\s\S]*?before update or delete on public\.learning_unit_versions/,
  },
  {
    name: 'Inmutabilidad de metadatos históricos de unidades',
    pattern: /create trigger trg_protect_learning_units[\s\S]*?before update or delete on public\.learning_units/,
  },
  {
    name: 'Función transaccional de publicación coordinada (FOR UPDATE)',
    pattern: /create or replace function public\.publish_program_version[\s\S]*?for update/,
  },
  {
    name: 'Inscripción condicionada a status PUBLISHED',
    pattern: /status = 'PUBLISHED'/,
  },
  {
    name: 'Validación de pertenencia en unit_progress',
    pattern: /create trigger trg_verify_unit_in_program[\s\S]*?before insert or update on public\.unit_progress/,
  },
  {
    name: 'Validación de pertenencia en learning_state',
    pattern: /create trigger trg_verify_learning_state_unit[\s\S]*?before insert or update on public\.learning_state/,
  },
  {
    name: 'Triggers de updated_at conectados',
    pattern: /trg_user_preferences_updated_at[\s\S]*?trg_unit_progress_updated_at[\s\S]*?trg_learning_state_updated_at/,
  },
  {
    name: 'Revocación integral de privilegios predeterminados',
    pattern: /revoke all on table public\.profiles from public, anon, authenticated;/,
  }
];

let allStaticPassed = true;
for (const check of checks) {
  const passed = check.pattern.test(sql);
  if (passed) {
    console.log(`[PASS] ${check.name}`);
  } else {
    console.error(`[FAIL] ${check.name}`);
    allStaticPassed = false;
  }
}

if (!allStaticPassed) {
  console.error('\nErrores en la verificación estructural del SQL.');
  process.exit(1);
}

console.log('\n[RESUMEN ESTÁTICO] 12/12 comprobaciones de integridad superadas.');

// 2. Ejecución Dinámica contra Supabase Local / Aislado (si existe TEST_DATABASE_URL)
const testDbUrl = process.env.TEST_DATABASE_URL;

if (!testDbUrl) {
  console.log('\n--- 2. Pruebas Dinámicas en Base de Datos ---');
  console.log('[ESTADO] TEST_DATABASE_URL no configurada.');
  console.log('[LIMITACIÓN TÉCNICA EXPLÍCITA] Pruebas dinámicas SQL omitidas.');
  console.log('Un PostgreSQL genérico NO es suficiente: se requiere una instancia de Supabase local');
  console.log('(iniciada con `supabase start`) o base aislada que provea auth.users, auth.uid() y roles Supabase.');
  console.log('El proyecto remoto CASE OS (gqvqmuefdsxlllqsrgqz) NO fue modificado ni consultado.');
  console.log('Para ejecutar pruebas dinámicas contra Supabase local:');
  console.log('  TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres npm run test:sql\n');
  process.exit(0);
}

async function runDynamicTests() {
  console.log('\n--- 2. Pruebas Dinámicas en Supabase Aislado ---');
  console.log(`Conectando a base de datos de pruebas...`);

  const client = new Client({ connectionString: testDbUrl });
  await client.connect();

  try {
    // 2.1 Comprobar o aplicar migración
    const checkTable = await client.query(`
      select exists (
        select from information_schema.tables
        where table_schema = 'public' and table_name = 'profiles'
      );
    `);
    if (!checkTable.rows[0].exists) {
      console.log('Aplicando archivo de migración...');
      await client.query(sql);
      console.log('[PASS] Migración DDL aplicada sin errores.');
    } else {
      console.log('[PASS] Migración DDL verificada (esquema activo en Supabase local).');
    }

    // Identificador único para garantizar que cada corrida de pruebas sea 100% aislada e idempotente
    const runId = Math.random().toString(36).slice(2, 7);
    const emptyProgSlug = `prog-empty-${runId}`;
    const progSlug = `prog-test-${runId}`;
    const unitId = `c-test-${runId}`;
    const draftProgSlug = `prog-draft-${runId}`;
    const otherProgSlug = `prog-other-${runId}`;
    const otherUnitId = `c-other-${runId}`;

    // 2.2 P1.12: Distinción entre Denegación por Grants vs Filtrado por RLS
    console.log('\nEjecutando P1.12: Denegación por Grants vs Filtrado RLS...');
    try {
      await client.query(`set role anon; select * from public.profiles;`);
      console.error('[FAIL] P1.12: El rol anon pudo consultar profiles (debió denegar permisos por falta de grant).');
      process.exit(1);
    } catch (err) {
      if (err.code === '42501') {
        console.log('[PASS] P1.12 (Grants): Denegación estricta 42501 permission denied para anon en profiles.');
      } else {
        console.error('[FAIL] P1.12: Error inesperado:', err.message);
        process.exit(1);
      }
    } finally {
      await client.query('reset role;');
    }

    // 2.3 Suite Dinámica 1: publish_program_version no permite publicar dos veces ni un programa vacío
    console.log('\nEjecutando D1: Validación de publicación y rechazo de programa vacío...');
    const emptyProgId = (await client.query(`
      insert into public.program_versions (slug, version, title, status)
      values ('${emptyProgSlug}', '1.0.0', 'Programa Vacío', 'DRAFT')
      returning id;
    `)).rows[0].id;

    try {
      await client.query(`select public.publish_program_version('${emptyProgId}');`);
      console.error('[FAIL] D1.1: Se permitió publicar un programa vacío sin unidades.');
      process.exit(1);
    } catch (err) {
      console.log('[PASS] D1.1: Publicación de programa vacío rechazada correctamente:', err.message);
    }

    const progId = (await client.query(`
      insert into public.program_versions (slug, version, title, status)
      values ('${progSlug}', '1.0.0', 'Programa Test', 'DRAFT')
      returning id;
    `)).rows[0].id;

    await client.query(`
      insert into public.learning_units (id, module_id, type)
      values ('${unitId}', 'm1', 'LESSON');
    `);

    const unitVerId = (await client.query(`
      insert into public.learning_unit_versions (unit_id, version, path, title)
      values ('${unitId}', '1.0.0', '/path', 'Leccion Test')
      returning id;
    `)).rows[0].id;

    await client.query(`
      insert into public.program_units (program_version_id, unit_version_id, display_order, prerequisites)
      values ('${progId}', '${unitVerId}', 1, '{}');
    `);

    // Publicación coordinada atómica
    await client.query(`select public.publish_program_version('${progId}');`);
    console.log('[PASS] D1.2: Publicación coordinada publish_program_version() ejecutada exitosamente.');

    // Publicación repetida debe fallar
    try {
      await client.query(`select public.publish_program_version('${progId}');`);
      console.error('[FAIL] D1.3: Publicación repetida debió ser rechazada.');
      process.exit(1);
    } catch (err) {
      console.log('[PASS] D1.3: Publicación repetida rechazada correctamente:', err.message);
    }

    // Helper para ejecutar consultas como un usuario autenticado específico con RLS activo
    async function asUser(userId, fn) {
      await client.query(`set role authenticated;`);
      await client.query(`select set_config('request.jwt.claim.sub', $1, false);`, [userId]);
      await client.query(`select set_config('request.jwt.claims', $1, false);`, [JSON.stringify({ sub: userId, role: 'authenticated' })]);
      try {
        return await fn();
      } finally {
        await client.query(`reset role;`);
        await client.query(`select set_config('request.jwt.claim.sub', '', false);`);
        await client.query(`select set_config('request.jwt.claims', '', false);`);
      }
    }

    // Crear dos usuarios de prueba en auth.users y perfiles
    const userA = '11111111-1111-1111-1111-111111111111';
    const userB = '22222222-2222-2222-2222-222222222222';

    await client.query(`
      insert into auth.users (id, email, role, aud)
      values ('${userA}', 'usera@case.os', 'authenticated', 'authenticated'),
             ('${userB}', 'userb@case.os', 'authenticated', 'authenticated')
      on conflict (id) do nothing;
    `);

    // 2.4 Suite Dinámica 2: Un estudiante no puede modificar catálogo publicado
    console.log('\nEjecutando D2: Estudiante no puede modificar catálogo publicado ni metadatos...');
    await asUser(userA, async () => {
      try {
        await client.query(`update public.program_versions set title = 'Hack' where id = '${progId}';`);
        console.error('[FAIL] D2.1: El estudiante pudo ejecutar UPDATE en program_versions.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D2.1: Estudiante bloqueado de UPDATE en program_versions:', err.message);
      }

      try {
        await client.query(`update public.learning_units set module_id = 'm9' where id = '${unitId}';`);
        console.error('[FAIL] D2.2: El estudiante pudo ejecutar UPDATE en learning_units.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D2.2: Estudiante bloqueado de UPDATE en learning_units:', err.message);
      }

      try {
        await client.query(`delete from public.program_units where program_version_id = '${progId}';`);
        console.error('[FAIL] D2.3: El estudiante pudo ejecutar DELETE en program_units.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D2.3: Estudiante bloqueado de DELETE en program_units:', err.message);
      }
    });

    // Inmutabilidad histórica ante superusuario/admin
    try {
      await client.query(`update public.learning_units set module_id = 'm2' where id = '${unitId}';`);
      console.error('[FAIL] D2.4: Modificación histórica de learning_units debió ser rechazada por trigger.');
      process.exit(1);
    } catch (err) {
      console.log('[PASS] D2.4: Modificación de metadato histórico de unidad rechazada por trigger:', err.message);
    }

    try {
      await client.query(`update public.program_versions set created_at = now() - interval '1 day' where id = '${progId}';`);
      console.error('[FAIL] D2.5: Modificación histórica de created_at debió ser rechazada.');
      process.exit(1);
    } catch (err) {
      console.log('[PASS] D2.5: Modificación histórica de fecha de programa rechazada por trigger:', err.message);
    }

    // 2.5 Suite Dinámica 3: No se puede inscribir en un programa DRAFT
    console.log('\nEjecutando D3: Rechazo de inscripción en programas en estado DRAFT...');
    const draftProgId = (await client.query(`
      insert into public.program_versions (slug, version, title, status)
      values ('${draftProgSlug}', '1.0.0', 'Programa Borrador', 'DRAFT')
      returning id;
    `)).rows[0].id;

    await asUser(userA, async () => {
      try {
        await client.query(`
          insert into public.enrollments (user_id, program_version_id, status)
          values ('${userA}', '${draftProgId}', 'ACTIVE');
        `);
        console.error('[FAIL] D3.1: Estudiante pudo inscribirse en un programa en estado DRAFT.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D3.1: Inscripción en programa DRAFT rechazada por RLS:', err.message);
      }
    });

    // Inscripción válida en programa PUBLISHED
    const enrollAId = (await asUser(userA, async () => {
      const res = await client.query(`
        insert into public.enrollments (user_id, program_version_id, status)
        values ('${userA}', '${progId}', 'ACTIVE')
        returning id;
      `);
      return res.rows[0].id;
    }));
    console.log('[PASS] D3.2: Inscripción de User A en programa PUBLISHED exitosa:', enrollAId);

    // 2.6 Suite Dinámica 4: unit_progress y learning_state solo aceptan unidades del programa inscrito
    console.log('\nEjecutando D4: unit_progress y learning_state solo aceptan unidades del programa inscrito...');
    // Crear un segundo programa publicado con su propia unidad
    const otherProgId = (await client.query(`
      insert into public.program_versions (slug, version, title, status)
      values ('${otherProgSlug}', '1.0.0', 'Otro Programa', 'DRAFT')
      returning id;
    `)).rows[0].id;

    await client.query(`
      insert into public.learning_units (id, module_id, type)
      values ('${otherUnitId}', 'm1', 'LESSON');
    `);

    const otherUnitVerId = (await client.query(`
      insert into public.learning_unit_versions (unit_id, version, path, title)
      values ('${otherUnitId}', '1.0.0', '/path-other', 'Lección Otro Programa')
      returning id;
    `)).rows[0].id;

    await client.query(`
      insert into public.program_units (program_version_id, unit_version_id, display_order, prerequisites)
      values ('${otherProgId}', '${otherUnitVerId}', 1, '{}');
    `);

    await client.query(`select public.publish_program_version('${otherProgId}');`);

    // Intentar registrar progreso en progId usando otherUnitVerId (ajena a la inscripción)
    await asUser(userA, async () => {
      try {
        await client.query(`
          insert into public.unit_progress (enrollment_id, unit_version_id, declared_completed, declared_at)
          values ('${enrollAId}', '${otherUnitVerId}', true, now());
        `);
        console.error('[FAIL] D4.1: Se permitió registrar progreso con unidad ajena al programa inscrito.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D4.1: unit_progress con unidad ajena rechazado por trigger:', err.message);
      }

      try {
        await client.query(`
          insert into public.learning_state (enrollment_id, last_visited_unit_version_id)
          values ('${enrollAId}', '${otherUnitVerId}');
        `);
        console.error('[FAIL] D4.2: Se permitió actualizar learning_state con unidad ajena al programa inscrito.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D4.2: learning_state con unidad ajena rechazado por trigger:', err.message);
      }

      // Registro legítimo de unidad correspondiente al programa inscrito
      await client.query(`
        insert into public.unit_progress (enrollment_id, unit_version_id, declared_completed, declared_at)
        values ('${enrollAId}', '${unitVerId}', true, now());
      `);
      console.log('[PASS] D4.3: unit_progress con unidad perteneciente al programa registrado exitosamente.');

      await client.query(`
        insert into public.learning_state (enrollment_id, last_visited_unit_version_id)
        values ('${enrollAId}', '${unitVerId}');
      `);
      console.log('[PASS] D4.4: learning_state con unidad perteneciente al programa registrado exitosamente.');
    });

    // 2.7 Suite Dinámica 5: Aislamiento total entre usuarios (Usuario A vs Usuario B)
    console.log('\nEjecutando D5: Aislamiento estricto entre Usuario A y Usuario B...');
    // Crear datos para Usuario B como superusuario
    const enrollBId = (await client.query(`
      insert into public.enrollments (user_id, program_version_id, status)
      values ('${userB}', '${progId}', 'ACTIVE')
      returning id;
    `)).rows[0].id;

    await client.query(`
      insert into public.user_preferences (user_id, favorites, history)
      values ('${userB}', '[{"id":"fav-b","updated_at":"2026-09-12"}]'::jsonb, '[{"path":"/b"}]'::jsonb)
      on conflict (user_id) do nothing;
    `);

    await client.query(`
      insert into public.learning_activities (user_id, activity_type, entity_id, title, route)
      values ('${userB}', 'ACADEMY', 'act-b', 'Actividad B', '/academy');
    `);

    // Probar lecturas y escrituras cruzadas ejecutadas por Usuario A
    await asUser(userA, async () => {
      // D5.1: A intenta leer perfil de B
      const profB = await client.query(`select * from public.profiles where id = '${userB}';`);
      if (profB.rows.length !== 0) {
        console.error('[FAIL] D5.1: Usuario A pudo leer el perfil de Usuario B.');
        process.exit(1);
      }
      console.log('[PASS] D5.1: Usuario A recibe 0 filas al consultar perfil de Usuario B.');

      // D5.2: A intenta modificar perfil de B
      const updateProfB = await client.query(`update public.profiles set display_name = 'Hacked' where id = '${userB}';`);
      if (updateProfB.rowCount !== 0) {
        console.error('[FAIL] D5.2: Usuario A pudo modificar el perfil de Usuario B.');
        process.exit(1);
      }
      console.log('[PASS] D5.2: UPDATE de A sobre perfil de B afecta 0 filas.');

      // D5.3: A intenta leer preferencias de B
      const prefsB = await client.query(`select * from public.user_preferences where user_id = '${userB}';`);
      if (prefsB.rows.length !== 0) {
        console.error('[FAIL] D5.3: Usuario A pudo leer preferencias de Usuario B.');
        process.exit(1);
      }
      console.log('[PASS] D5.3: Usuario A recibe 0 filas al consultar preferencias de Usuario B.');

      // D5.4: A intenta escribir en preferencias de B
      try {
        await client.query(`insert into public.user_preferences (user_id, favorites, history) values ('${userB}', '[]', '[]');`);
        console.error('[FAIL] D5.4: Usuario A pudo insertar preferencias con user_id de B.');
        process.exit(1);
      } catch (err) {
        console.log('[PASS] D5.4: Inserción de A con user_id de B rechazada por RLS:', err.message);
      }

      // D5.5: A intenta leer el progreso de B
      const progB = await client.query(`
        select up.* from public.unit_progress up
        join public.enrollments e on e.id = up.enrollment_id
        where e.user_id = '${userB}';
      `);
      if (progB.rows.length !== 0) {
        console.error('[FAIL] D5.5: Usuario A pudo consultar el progreso de Usuario B.');
        process.exit(1);
      }
      console.log('[PASS] D5.5: Usuario A recibe 0 filas al consultar progreso de Usuario B.');

      // D5.6: A intenta leer actividades de B
      const actB = await client.query(`select * from public.learning_activities where user_id = '${userB}';`);
      if (actB.rows.length !== 0) {
        console.error('[FAIL] D5.6: Usuario A pudo consultar actividades de aprendizaje de Usuario B.');
        process.exit(1);
      }
      console.log('[PASS] D5.6: Usuario A recibe 0 filas al consultar actividades de Usuario B.');
    });

    console.log('\n[SUCCESS] Todas las pruebas dinámicas de aislamiento, integridad y catálogo superadas exitosamente.');
  } finally {
    await client.end();
  }
}

runDynamicTests().catch(err => {
  console.error('Error durante la ejecución dinámica de SQL:', err);
  process.exit(1);
});
