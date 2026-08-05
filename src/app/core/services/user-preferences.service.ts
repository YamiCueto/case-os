import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageProvider } from '../storage/local-storage.provider';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private storage = inject(LocalStorageProvider);
  private readonly FAVORITES_KEY = 'case_platform_favorites';
  private readonly HISTORY_KEY = 'case_platform_history';

  private favoritesSignal = signal<Set<string>>(new Set());
  private historySignal = signal<string[]>([]); // URLs o IDs recientes

  constructor() {
    this.loadFavorites();
    this.loadHistory();
  }

  // --- Favoritos (Globales) ---
  private loadFavorites() {
    const saved = this.storage.get<string[]>(this.FAVORITES_KEY);
    if (saved) {
      this.favoritesSignal.set(new Set(saved));
    }
  }

  private saveFavorites(favorites: Set<string>) {
    this.storage.set(this.FAVORITES_KEY, Array.from(favorites));
  }

  getFavorites() {
    return this.favoritesSignal.asReadonly();
  }

  isFavorite(id: string): boolean {
    return this.favoritesSignal().has(id);
  }

  toggleFavorite(id: string) {
    const current = new Set(this.favoritesSignal());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.favoritesSignal.set(current);
    this.saveFavorites(current);
  }

  // --- Historial de Navegación ---
  private loadHistory() {
    const saved = this.storage.get<string[]>(this.HISTORY_KEY);
    if (saved) {
      this.historySignal.set(saved);
    }
  }

  addToHistory(path: string) {
    const current = this.historySignal().filter(p => p !== path);
    current.unshift(path); // Agregar al inicio
    if (current.length > 20) {
      current.pop(); // Mantener solo los últimos 20
    }
    this.historySignal.set(current);
    this.storage.set(this.HISTORY_KEY, current);
  }

  getHistory() {
    return this.historySignal.asReadonly();
  }
}
