import { Signal } from '@angular/core';
import { Resource, ResourceFilter } from '../models/resource.models';

/**
 * Contrato base para repositorios de recursos.
 * Cualquier fuente de datos (estática o API futura) debe implementar esta interfaz.
 * Esto garantiza el desacoplamiento total entre Angular UI y la capa de datos.
 */
export interface ResourceRepository<T extends Resource> {
  /** Obtiene todos los recursos como una señal reactiva */
  getAll(): Signal<T[]>;
  
  /** Busca un recurso específico por ID */
  getById(id: string): T | undefined;
  
  /** Filtra los recursos base según criterios específicos */
  filter(criteria: ResourceFilter): T[];
}
