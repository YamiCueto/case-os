import { Injectable, inject, signal, computed, Signal } from '@angular/core';
import { KnowledgeResource, KnowledgeFilter } from '../../core/models/knowledge.models';
import { StaticKnowledgeRepository } from '../../core/repositories/static-knowledge.repository';
import { StaticSearchEngine } from '../../core/engines/static-search.engine';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  // Inyección de abstracciones concretas
  // TODO: En Angular avanzado, inyectaríamos el Token de la interfaz
  private repository = inject(StaticKnowledgeRepository);
  private searchEngine = inject(StaticSearchEngine);

  // Expone los recursos usando el contrato del SearchEngine y el Repository
  filter(criteria: KnowledgeFilter): KnowledgeResource[] {
    const allResources = this.repository.getAll()();
    return this.searchEngine.search(allResources, criteria);
  }

  getAllResources(): Signal<KnowledgeResource[]> {
    return this.repository.getAll();
  }

  getById(id: string): KnowledgeResource | undefined {
    return this.repository.getById(id);
  }

  getBySlug(slug: string): KnowledgeResource | undefined {
    return this.repository.getBySlug(slug);
  }

  getRelated(slug: string, limit = 3): KnowledgeResource[] {
    const resource = this.getBySlug(slug);
    if (!resource) return [];
    
    const allResources = this.repository.getAll()();
    return this.searchEngine.getRelated(resource.id, allResources, limit);
  }

  /**
   * Proyección especializada para el Glosario Canónico (/library/glossary).
   * Retorna recursos de tipo CONCEPT ordenados alfabéticamente, con soporte de filtrado por módulo y búsqueda.
   */
  getGlossaryTerms(options?: { searchTerm?: string; moduleId?: string }): KnowledgeResource[] {
    const allResources = this.repository.getAll()();
    let concepts = allResources.filter(r => r.type === 'CONCEPT');

    if (options?.searchTerm && options.searchTerm.trim().length > 0) {
      concepts = this.searchEngine.search(concepts, { searchTerm: options.searchTerm });
    }

    if (options?.moduleId && options.moduleId !== 'ALL') {
      concepts = concepts.filter(r => r.metadata?.moduleId === options.moduleId);
    }

    return concepts.sort((a, b) => {
      const titleA = typeof a.title === 'string' ? a.title : (a.title?.['es'] || '');
      const titleB = typeof b.title === 'string' ? b.title : (b.title?.['es'] || '');
      return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
    });
  }

  /**
   * Proyección para el catálogo de recursos de ingeniería (/library).
   * Por defecto excluye conceptos del glosario para mantener el foco en artefactos prácticos.
   */
  getEngineeringResources(criteria: KnowledgeFilter = {}): KnowledgeResource[] {
    const allResources = this.repository.getAll()();
    // Si no se especificó un filtro de tipo, excluimos CONCEPT para la vista de ingeniería
    const engineeringCriteria: KnowledgeFilter = {
      ...criteria,
      type: criteria.type && criteria.type.length > 0
        ? criteria.type
        : ['PROMPT', 'ARCHITECTURE', 'CHECKLIST', 'TEMPLATE', 'CONTEXT']
    };
    return this.searchEngine.search(allResources, engineeringCriteria);
  }
}
