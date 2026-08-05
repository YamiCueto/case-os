import { InjectionToken } from '@angular/core';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string; // Ej: 'PROMPT', 'LAB', 'COURSE'
  url: string; // Ruta a la que navegar
  icon?: string;
  tags?: string[];
}

export interface SearchProvider {
  /**
   * Identificador del proveedor (ej: 'LIBRARY', 'LABS')
   */
  providerName: string;

  /**
   * Ejecuta una búsqueda y devuelve los resultados.
   * @param query El término de búsqueda
   * @param maxResults Máximo de resultados a devolver (opcional)
   */
  search(query: string, maxResults?: number): Promise<SearchResult[]>;
}

// Token de Inyección múltiple para que Angular recoja todos los proveedores registrados
export const SEARCH_PROVIDERS = new InjectionToken<SearchProvider[]>('SEARCH_PROVIDERS');
