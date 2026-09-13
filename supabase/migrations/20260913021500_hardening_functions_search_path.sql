-- ============================================================================
-- MIGRACIÓN HARDENING POST-FASE 1: SEARCH_PATH Y PRIVILEGIOS RPC
-- Archivo: supabase/migrations/20260913021500_hardening_functions_search_path.sql
-- ============================================================================

-- 1. Fijar search_path inmutable en las 4 funciones de trigger de CASE OS
--    (Resuelve Supabase Linter 0011: function_search_path_mutable)
alter function public.set_updated_at() set search_path = '';
alter function public.prevent_published_catalog_mutation() set search_path = '';
alter function public.verify_unit_in_program() set search_path = '';
alter function public.verify_learning_state_unit() set search_path = '';

-- 2. Revocar privilegios de ejecución pública y cliente sobre rls_auto_enable()
--    (Resuelve Supabase Linter 0028 y 0029: rpc anon/authenticated executable.
--     El event trigger interno 'ensure_rls' opera como postgres y no se ve afectado).
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
