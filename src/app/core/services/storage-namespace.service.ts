import { Injectable, signal, computed } from '@angular/core';
import { StorageNamespace, getStorageNamespace } from '../models/sync.model';

@Injectable({
  providedIn: 'root'
})
export class StorageNamespaceService {
  private readonly userIdSignal = signal<string | null>(null);

  readonly currentUserId = this.userIdSignal.asReadonly();
  readonly namespace = computed<StorageNamespace>(() => getStorageNamespace(this.userIdSignal()));

  private resetListeners: Array<() => void> = [];

  constructor() {
    this.migrateLegacyKeys();
  }

  setActiveUser(userId: string | null): void {
    if (this.userIdSignal() !== userId) {
      this.userIdSignal.set(userId);
      this.notifyReset();
    }
  }

  getActivePrefix(): string {
    return this.namespace().prefix;
  }

  onReset(callback: () => void): () => void {
    this.resetListeners.push(callback);
    return () => {
      this.resetListeners = this.resetListeners.filter(cb => cb !== callback);
    };
  }

  private notifyReset(): void {
    for (const listener of this.resetListeners) {
      try {
        listener();
      } catch (e) {
        console.error('Error executing storage reset listener', e);
      }
    }
  }

  /**
   * Migración de arranque seguro:
   * Convierte claves preexistentes un-namespaced (`case_platform_*` y `case_lab_exec_*`)
   * al namespace `case_guest:*` sin pérdida de datos.
   */
  private migrateLegacyKeys(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const guestNs = getStorageNamespace(null);

      // 1. Claves directas de la plataforma
      const directMappings: Record<string, string> = {
        'case_platform_learning_progress': guestNs.activitiesKey,
        'case_platform_stats': guestNs.statsKey,
        'case_platform_favorites': `${guestNs.prefix}favorites_legacy`,
        'case_platform_history': `${guestNs.prefix}history_legacy`
      };

      for (const [legacyKey, newKey] of Object.entries(directMappings)) {
        const item = localStorage.getItem(legacyKey);
        if (item && !localStorage.getItem(newKey)) {
          localStorage.setItem(newKey, item);
          localStorage.removeItem(legacyKey);
        }
      }

      // 2. Claves de ejecución de laboratorios: case_lab_exec_<labId>
      const keysToMigrate: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('case_lab_exec_')) {
          keysToMigrate.push(key);
        }
      }

      for (const legacyKey of keysToMigrate) {
        const labId = legacyKey.replace('case_lab_exec_', '');
        const targetKey = `${guestNs.labExecPrefix}${labId}`;
        if (!localStorage.getItem(targetKey)) {
          const val = localStorage.getItem(legacyKey);
          if (val) {
            localStorage.setItem(targetKey, val);
          }
        }
        localStorage.removeItem(legacyKey);
      }
    } catch (e) {
      console.warn('Advertencia durante la migración de claves legacy de almacenamiento:', e);
    }
  }
}
