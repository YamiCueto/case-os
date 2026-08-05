import { Injectable } from '@angular/core';
import { KnowledgeResource, KnowledgeFilter } from '../models/knowledge.models';
import { SearchEngine } from './search-engine.interface';

@Injectable({
  providedIn: 'root'
})
export class StaticSearchEngine implements SearchEngine {

  search(resources: KnowledgeResource[], criteria: KnowledgeFilter): KnowledgeResource[] {
    let results = [...resources];

    // 1. Full-Text Search Básico
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      results = results.filter(r => 
        this.getLocalizedString(r.title).toLowerCase().includes(term) || 
        this.getLocalizedString(r.description).toLowerCase().includes(term) ||
        r.tags.some(t => t.toLowerCase().includes(term)) ||
        r.technologies.some(t => t.toLowerCase().includes(term)) ||
        (r.keywords && r.keywords.some(k => k.toLowerCase().includes(term)))
      );
    }

    // 2. Filtros estrictos
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

    // Pendiente: Scoring simple si hay searchTerm para priorizar título sobre descripción.
    return results;
  }

  getRelated(targetId: string, allResources: KnowledgeResource[], limit = 3): KnowledgeResource[] {
    const target = allResources.find(r => r.id === targetId);
    if (!target) return [];

    // Calcula una puntuación de similitud
    const scored = allResources
      .filter(r => r.id !== targetId)
      .map(r => {
        let score = 0;
        // Misma categoría
        if (r.type === target.type) score += 2;
        // Tecnologías en común
        const sharedTech = r.technologies.filter(t => target.technologies.includes(t));
        score += sharedTech.length * 3;
        // Tags en común
        const sharedTags = r.tags.filter(t => target.tags.includes(t));
        score += sharedTags.length * 2;
        // Dificultad
        if (r.difficulty === target.difficulty) score += 1;

        return { resource: r, score };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(s => s.resource);
  }

  private getLocalizedString(value: string | Record<string, string>): string {
    if (typeof value === 'string') return value;
    // Asumimos 'es' como idioma por defecto
    return value['es'] || Object.values(value)[0] || '';
  }
}
