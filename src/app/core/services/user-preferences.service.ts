import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageProvider } from '../storage/local-storage.provider';
import { StorageNamespaceService } from './storage-namespace.service';
import { SupabaseService } from './supabase.service';
import { FavoriteItem, HistoryItem } from '../models/sync.model';
import { SyncQueueService } from './sync-queue.service';

const PREFS_FAVORITES_KEY = 'user_favorites_tombstones';
const PREFS_HISTORY_KEY = 'user_history_entries';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);
  private supabaseService = inject(SupabaseService);
  private syncQueueService = inject(SyncQueueService);

  private favoritesMapSignal = signal<Map<string, FavoriteItem>>(new Map());
  private favoritesSignal = signal<Set<string>>(new Set());
  private historySignal = signal<string[]>([]);

  constructor() {
    this.reloadPreferences();

    // Reset reactivo en memoria al cambiar de cuenta
    this.namespaceService.onReset(() => {
      this.reloadPreferences();
    });
  }

  reloadPreferences(): void {
    this.loadFavorites();
    this.loadHistory();

    if (this.supabaseService.isAuthenticated()) {
      this.fetchRemotePreferences();
    }
  }

  // --- Favoritos con Tombstones y Marcas Temporales ---
  private loadFavorites(): void {
    const raw = this.storage.get<FavoriteItem[]>(PREFS_FAVORITES_KEY);
    const map = new Map<string, FavoriteItem>();
    const activeSet = new Set<string>();

    if (Array.isArray(raw)) {
      for (const item of raw) {
        map.set(item.id, item);
        if (!item.deleted) {
          activeSet.add(item.id);
        }
      }
    } else {
      // Migración desde formato plano anterior si existe
      const legacy = this.storage.get<string[]>('case_platform_favorites');
      if (Array.isArray(legacy)) {
        const now = new Date().toISOString();
        for (const id of legacy) {
          map.set(id, { id, deleted: false, updated_at: now });
          activeSet.add(id);
        }
        this.saveFavoritesToStorage(map);
      }
    }

    this.favoritesMapSignal.set(map);
    this.favoritesSignal.set(activeSet);
  }

  private saveFavoritesToStorage(map: Map<string, FavoriteItem>): void {
    const array = Array.from(map.values());
    this.storage.set(PREFS_FAVORITES_KEY, array);
  }

  getFavorites() {
    return this.favoritesSignal.asReadonly();
  }

  isFavorite(id: string): boolean {
    return this.favoritesSignal().has(id);
  }

  toggleFavorite(id: string): void {
    const map = new Map(this.favoritesMapSignal());
    const existing = map.get(id);
    const now = new Date().toISOString();

    if (existing && !existing.deleted) {
      // Borrado lógico (tombstone) con marca temporal
      map.set(id, { id, deleted: true, updated_at: now });
    } else {
      // Alta o reactivación
      map.set(id, { id, deleted: false, updated_at: now });
    }

    this.favoritesMapSignal.set(map);

    const activeSet = new Set<string>();
    for (const item of map.values()) {
      if (!item.deleted) activeSet.add(item.id);
    }
    this.favoritesSignal.set(activeSet);
    this.saveFavoritesToStorage(map);

    if (this.supabaseService.isAuthenticated()) {
      const history = this.storage.get<HistoryItem[]>(PREFS_HISTORY_KEY) || [];
      this.syncQueueService.enqueue('user_preferences', 'prefs', 'upsert', {
        favorites: Array.from(map.values()),
        history
      });
    }
  }

  // --- Historial de Navegación con Marcas Temporales ---
  private loadHistory(): void {
    const raw = this.storage.get<HistoryItem[]>(PREFS_HISTORY_KEY);
    if (Array.isArray(raw)) {
      this.historySignal.set(raw.map(r => r.path));
    } else {
      const legacy = this.storage.get<string[]>('case_platform_history');
      if (Array.isArray(legacy)) {
        this.historySignal.set(legacy);
      } else {
        this.historySignal.set([]);
      }
    }
  }

  addToHistory(path: string, title: string = path): void {
    const raw = this.storage.get<HistoryItem[]>(PREFS_HISTORY_KEY) || [];
    const now = new Date().toISOString();

    const filtered = raw.filter(item => item.path !== path);
    filtered.unshift({ path, title, visited_at: now });

    const trimmed = filtered.slice(0, 20);
    this.storage.set(PREFS_HISTORY_KEY, trimmed);
    this.historySignal.set(trimmed.map(t => t.path));

    if (this.supabaseService.isAuthenticated()) {
      const favorites = Array.from(this.favoritesMapSignal().values());
      this.syncQueueService.enqueue('user_preferences', 'prefs', 'upsert', {
        favorites,
        history: trimmed
      });
    }
  }

  getHistory() {
    return this.historySignal.asReadonly();
  }

  /**
   * Consulta e incorpora el estado remoto con control de concurrencia y merge CRDT.
   * Totalmente protegido contra carreras multiusuario mediante authGeneration.
   */
  private async fetchRemotePreferences(): Promise<void> {
    const client = this.supabaseService.client;
    const user = this.supabaseService.currentUser();
    const expectedUserId = user?.id;
    const expectedGen = this.supabaseService.currentAuthGeneration();

    if (!client || !user || !expectedUserId) return;

    try {
      const { data, error } = await client
        .from('user_preferences')
        .select('favorites, history')
        .eq('user_id', expectedUserId)
        .maybeSingle();

      // Descartar si el usuario cambió antes de la respuesta
      if (
        this.supabaseService.currentAuthGeneration() !== expectedGen ||
        this.supabaseService.currentUser()?.id !== expectedUserId
      ) {
        return;
      }

      if (error || !data) return;

      // 1. Merge CRDT LWW para Favoritos
      if (Array.isArray(data.favorites)) {
        const localMap = new Map(this.favoritesMapSignal());
        for (const remoteItem of data.favorites as unknown as FavoriteItem[]) {
          if (!remoteItem.id) continue;
          const localItem = localMap.get(remoteItem.id);
          if (!localItem || new Date(remoteItem.updated_at) >= new Date(localItem.updated_at)) {
            localMap.set(remoteItem.id, remoteItem);
          }
        }
        this.favoritesMapSignal.set(localMap);
        const active = new Set<string>();
        for (const item of localMap.values()) {
          if (!item.deleted) active.add(item.id);
        }
        this.favoritesSignal.set(active);
        this.saveFavoritesToStorage(localMap);
      }

      // 2. Incorporación y merge del Historial Remoto
      if (Array.isArray(data.history)) {
        const localHistory = this.storage.get<HistoryItem[]>(PREFS_HISTORY_KEY) || [];
        const historyMap = new Map<string, HistoryItem>();

        for (const rh of data.history as unknown as HistoryItem[]) {
          if (rh.path) historyMap.set(rh.path, rh);
        }

        for (const lh of localHistory) {
          const existing = historyMap.get(lh.path);
          if (!existing || new Date(lh.visited_at) >= new Date(existing.visited_at)) {
            historyMap.set(lh.path, lh);
          }
        }

        const mergedHistory = Array.from(historyMap.values())
          .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime())
          .slice(0, 20);

        this.storage.set(PREFS_HISTORY_KEY, mergedHistory);
        this.historySignal.set(mergedHistory.map(h => h.path));
      }
    } catch {
      // Fallo de red silencioso conservando el estado local
    }
  }
}
