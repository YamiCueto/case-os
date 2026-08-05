import { Signal } from '@angular/core';
import { KnowledgeResource, KnowledgeFilter } from '../models/knowledge.models';

/**
 * Contrato base para repositorios de conocimiento genéricos.
 * Cualquier fuente de datos (estática, API, Firebase) debe implementar esta interfaz.
 */
export interface KnowledgeRepository<T> {
  getAll(): Signal<T[]>;
  getById(id: string): T | undefined;
  getBySlug(slug: string): T | undefined;
  
  // Delegación a la base de datos (si aplica), o fetch all para el SearchEngine
  fetchInitialData(): void;
}
