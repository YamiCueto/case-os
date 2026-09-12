import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageProvider } from '../storage/local-storage.provider';
import { StorageNamespaceService } from './storage-namespace.service';

export interface UserStats {
  completedLabs: number;
  totalResourcesViewed: number;
  firstSessionDate: string;
}

const STATS_KEY = 'user_platform_stats';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);

  private statsSignal = signal<UserStats>({
    completedLabs: 0,
    totalResourcesViewed: 0,
    firstSessionDate: new Date().toISOString()
  });

  constructor() {
    this.loadStats();

    // Reset reactivo en memoria al cambiar de cuenta
    this.namespaceService.onReset(() => {
      this.loadStats();
    });
  }

  private loadStats() {
    const saved = this.storage.get<UserStats>(STATS_KEY);
    if (saved) {
      this.statsSignal.set(saved);
    } else {
      const initial: UserStats = {
        completedLabs: 0,
        totalResourcesViewed: 0,
        firstSessionDate: new Date().toISOString()
      };
      this.statsSignal.set(initial);
      this.saveStats(initial);
    }
  }

  private saveStats(stats: UserStats) {
    this.storage.set(STATS_KEY, stats);
  }

  getStats() {
    return this.statsSignal.asReadonly();
  }

  incrementLabsCompleted() {
    this.statsSignal.update(s => {
      const updated = { ...s, completedLabs: s.completedLabs + 1 };
      this.saveStats(updated);
      return updated;
    });
  }

  incrementResourcesViewed() {
    this.statsSignal.update(s => {
      const updated = { ...s, totalResourcesViewed: s.totalResourcesViewed + 1 };
      this.saveStats(updated);
      return updated;
    });
  }
}
