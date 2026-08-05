import { Injectable, signal, Signal } from '@angular/core';
import { LabDefinition } from '../models/lab.models';
import { KnowledgeRepository } from '../services/knowledge-repository.interface';
import { LABS_CONFIG } from '../../labs/config/labs.config';

@Injectable({
  providedIn: 'root'
})
export class StaticLabRepository implements KnowledgeRepository<LabDefinition> {
  private labsSignal = signal<LabDefinition[]>([]);

  constructor() {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    this.labsSignal.set(LABS_CONFIG);
  }

  getAll(): Signal<LabDefinition[]> {
    return this.labsSignal.asReadonly();
  }

  getById(id: string): LabDefinition | undefined {
    return this.labsSignal().find(l => l.id === id);
  }

  getBySlug(slug: string): LabDefinition | undefined {
    return this.labsSignal().find(l => l.slug === slug);
  }
}
