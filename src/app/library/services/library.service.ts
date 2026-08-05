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
}
