import { Injectable } from '@angular/core';
import { StorageProvider } from './storage.provider.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProvider implements StorageProvider {
  
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error('Error parsing LocalStorage item', e);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting LocalStorage item', e);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
