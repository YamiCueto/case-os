import { Injectable, inject } from '@angular/core';
import { StorageProvider } from './storage.provider.interface';
import { StorageNamespaceService } from '../services/storage-namespace.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProvider implements StorageProvider {
  private namespaceService = inject(StorageNamespaceService);

  private resolveKey(key: string): string {
    if (key.startsWith('case_u_') || key.startsWith('case_guest:')) {
      return key;
    }
    return `${this.namespaceService.getActivePrefix()}${key}`;
  }

  get<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const resolved = this.resolveKey(key);
      const item = localStorage.getItem(resolved);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error('Error parsing LocalStorage item', e);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const resolved = this.resolveKey(key);
      localStorage.setItem(resolved, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting LocalStorage item', e);
    }
  }

  remove(key: string): void {
    if (typeof localStorage === 'undefined') return;
    const resolved = this.resolveKey(key);
    localStorage.removeItem(resolved);
  }

  /**
   * Safe scoped clear:
   * Elimina ÚNICAMENTE las claves correspondientes al namespace activo.
   * Nunca invoca localStorage.clear() global.
   */
  clear(): void {
    if (typeof localStorage === 'undefined') return;
    const prefix = this.namespaceService.getActivePrefix();
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }

  // Métodos de acceso directo sin resolución de prefijo (para colas y migraciones)
  getRaw<T>(exactKey: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const item = localStorage.getItem(exactKey);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }

  setRaw<T>(exactKey: string, value: T): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(exactKey, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting raw LocalStorage item', e);
    }
  }

  removeRaw(exactKey: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(exactKey);
  }
}
