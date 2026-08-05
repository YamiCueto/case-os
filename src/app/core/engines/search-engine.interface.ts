import { KnowledgeResource, KnowledgeFilter } from '../models/knowledge.models';

/**
 * Contrato para motores de búsqueda de la academia.
 * Define la capacidad de realizar filtrado, ranking, y búsqueda de similares.
 */
export interface SearchEngine {
  /**
   * Ejecuta una búsqueda y devuelve los recursos ordenados por relevancia.
   */
  search(resources: KnowledgeResource[], filter: KnowledgeFilter): KnowledgeResource[];

  /**
   * Obtiene recursos relacionados basados en similitud de tags, tecnologías, etc.
   * Útil para sistemas de recomendación básicos sin IA.
   */
  getRelated(targetId: string, allResources: KnowledgeResource[], limit?: number): KnowledgeResource[];
}
