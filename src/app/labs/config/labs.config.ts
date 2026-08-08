import { LabDefinition } from '../../core/models/lab.models';

/**
 * LABS_CONFIG — Modelo Legacy (vacío intencionalmente)
 *
 * Los Labs legacy (Refactorización + Code Review Asistido) han sido eliminados
 * del producto. El nuevo modelo es Real Engineering Labs, cuyos playbooks
 * son componentes Angular estáticos bajo academy/modules/<mX>/lab-XX-*.
 *
 * Este array se mantiene vacío para no romper los consumidores existentes
 * (StaticLabRepository, WorkspaceRegistryService) mientras se completa
 * la migración progresiva M02–M09.
 */
export const LABS_CONFIG: LabDefinition[] = [];
