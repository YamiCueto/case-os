-- ============================================================================
-- MIGRACIÓN: PRIVILEGIOS DE PUBLICADOR DE CATÁLOGO PARA service_role
-- Archivo: supabase/migrations/20260913024731_grant_catalog_publisher_privileges.sql
-- ============================================================================
-- Otorga a service_role los privilegios mínimos necesarios para ejecutar
-- el flujo de publicación del catálogo (scripts/publish-catalog.mjs).
--
-- ALCANCE DELIBERADO:
--   - Solo service_role recibe estos privilegios.
--   - anon y authenticated NO reciben privilegios sobre estas tablas aquí.
--   - Las políticas RLS existentes se mantienen inalteradas; service_role
--     opera con bypass RLS (comportamiento nativo de Supabase) y no requiere
--     políticas propias para estas operaciones administrativas.
-- ============================================================================

-- Lectura y creación de versiones del programa (DRAFT → PUBLISHED via RPC)
grant select, insert
    on public.program_versions
    to service_role;

-- Registro idempotente de unidades de aprendizaje (upsert por id)
grant select, insert, update
    on public.learning_units
    to service_role;

-- Registro idempotente de versiones de unidad (upsert por unit_id, version)
grant select, insert, update
    on public.learning_unit_versions
    to service_role;

-- Gestión completa de la malla curricular del borrador (incluyendo purga de DRAFT previos)
grant select, insert, update, delete
    on public.program_units
    to service_role;

-- Ejecución del procedimiento atómico de cierre con bloqueo coordinado
grant execute
    on function public.publish_program_version(uuid)
    to service_role;
