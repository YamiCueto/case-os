import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageProvider } from '../storage/local-storage.provider';

export interface UserStats {
  completedLabs: number;
  totalResourcesViewed: number;
  firstSessionDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  private storage = inject(LocalStorageProvider);
  private readonly STATS_KEY = 'case_platform_stats';

  private statsSignal = signal<UserStats>({
    completedLabs: 0,
    totalResourcesViewed: 0,
    firstSessionDate: new Date().toISOString()
  });

  constructor() {
    this.loadStats();
  }

  private loadStats() {
    const saved = this.storage.get<UserStats>(this.STATS_KEY);
    if (saved) {
      this.statsSignal.set(saved);
    } else {
      this.saveStats(this.statsSignal());
    }
  }

  private saveStats(stats: UserStats) {
    this.storage.set(this.STATS_KEY, stats);
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
