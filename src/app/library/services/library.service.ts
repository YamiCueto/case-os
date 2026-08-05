import { Injectable, signal, Signal } from '@angular/core';
import { Resource, ResourceFilter } from '../../core/models/resource.models';
import { ResourceRepository } from '../../core/services/resource-repository.interface';
import { LIBRARY_CONFIG } from '../config/library.config';

@Injectable({
  providedIn: 'root'
})
export class LibraryService implements ResourceRepository<Resource> {
  // Inicialmente vacío, se llenará con la configuración estática en el Sprint 1
  private resourcesSignal = signal<Resource[]>([]);

  constructor() {
    this.resourcesSignal.set(LIBRARY_CONFIG);
  }

  getAll(): Signal<Resource[]> {
    return this.resourcesSignal.asReadonly();
  }

  getById(id: string): Resource | undefined {
    return this.resourcesSignal().find(r => r.id === id);
  }

  filter(criteria: ResourceFilter): Resource[] {
    let results = this.resourcesSignal();

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      results = results.filter(r => 
        r.title.toLowerCase().includes(term) || 
        r.description.toLowerCase().includes(term)
      );
    }

    if (criteria.type && criteria.type.length > 0) {
      results = results.filter(r => criteria.type!.includes(r.type));
    }

    if (criteria.difficulty && criteria.difficulty.length > 0) {
      results = results.filter(r => criteria.difficulty!.includes(r.difficulty));
    }

    if (criteria.technologies && criteria.technologies.length > 0) {
      results = results.filter(r => 
        r.technologies.some(t => criteria.technologies!.includes(t))
      );
    }

    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(r => 
        r.tags.some(t => criteria.tags!.includes(t))
      );
    }

    return results;
  }
}
