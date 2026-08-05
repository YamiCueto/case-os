import { Injectable, signal, Signal } from '@angular/core';
import { KnowledgeResource } from '../models/knowledge.models';
import { KnowledgeRepository } from '../services/knowledge-repository.interface';
import { LIBRARY_CONFIG } from '../../library/config/library.config';

@Injectable({
  providedIn: 'root'
})
export class StaticKnowledgeRepository implements KnowledgeRepository<KnowledgeResource> {
  private resourcesSignal = signal<KnowledgeResource[]>([]);

  constructor() {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    // Aquí podríamos simular asincronía si fuera necesario.
    this.resourcesSignal.set(LIBRARY_CONFIG);
  }

  getAll(): Signal<KnowledgeResource[]> {
    return this.resourcesSignal.asReadonly();
  }

  getById(id: string): KnowledgeResource | undefined {
    return this.resourcesSignal().find(r => r.id === id);
  }

  getBySlug(slug: string): KnowledgeResource | undefined {
    return this.resourcesSignal().find(r => r.slug === slug);
  }
}
