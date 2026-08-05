import { Injectable, Inject, Optional, signal, computed } from '@angular/core';
import { SearchProvider, SearchResult, SEARCH_PROVIDERS } from './search-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  private searchQuery = signal<string>('');
  private searchResults = signal<SearchResult[]>([]);

  // Inyectamos todos los proveedores registrados en el módulo base
  constructor(@Optional() @Inject(SEARCH_PROVIDERS) private providers: SearchProvider[]) {
    if (!this.providers) {
      this.providers = []; // Fallback por si no hay ninguno registrado aún
    }
  }

  async search(query: string) {
    this.searchQuery.set(query);
    
    if (!query || query.trim().length < 2) {
      this.searchResults.set([]);
      return;
    }

    const allPromises = this.providers.map(async provider => {
      try {
        // Soporta tanto retornos síncronos como promesas
        const results = await provider.search(query, 5); 
        return results;
      } catch (err) {
        console.error(`Error en proveedor de búsqueda [${provider.providerName}]:`, err);
        return [];
      }
    });

    const resultsArray = await Promise.all(allPromises);
    
    // Aplanar y ordenar resultados (por ahora simple flatten)
    const flatResults = resultsArray.flat();
    this.searchResults.set(flatResults);
  }

  getResults() {
    return this.searchResults.asReadonly();
  }

  getQuery() {
    return this.searchQuery.asReadonly();
  }

  clear() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
}
