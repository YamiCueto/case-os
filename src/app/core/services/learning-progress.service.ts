import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LocalStorageProvider } from '../storage/local-storage.provider';

export interface Activity {
  id: string;
  type: 'ACADEMY' | 'LIBRARY' | 'LABS' | 'DASHBOARD' | 'OTHER';
  entityId: string;
  title: string;
  route: string;
  timestamp: number;
  metadata?: any;
}

const STORAGE_KEY = 'case_platform_learning_progress';

@Injectable({
  providedIn: 'root'
})
export class LearningProgressService {
  private router = inject(Router);
  private storage = inject(LocalStorageProvider);

  private historySignal = signal<Activity[]>([]);

  constructor() {
    this.loadHistory();
    this.setupAutoCapture();
  }

  private loadHistory() {
    const data = this.storage.get<Activity[]>(STORAGE_KEY);
    if (data) {
      this.historySignal.set(data);
    }
  }

  private saveHistory(history: Activity[]) {
    this.storage.set(STORAGE_KEY, history);
    this.historySignal.set(history);
  }

  private setupAutoCapture() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects.split('?')[0];
        const activity = this.inferActivityFromUrl(url);
        
        if (activity) {
          this.logActivity(activity);
        }
      });
  }

  private inferActivityFromUrl(url: string): Omit<Activity, 'id' | 'timestamp'> | null {
    const segments = url.split('/').filter(s => s.length > 0);
    if (segments.length === 0) return null;

    const firstSegment = segments[0];

    // Generic formatting for titles
    const formatTitle = (slug: string) => {
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    if (firstSegment === 'dashboard') {
      return {
        type: 'DASHBOARD',
        entityId: 'dashboard',
        title: 'Dashboard',
        route: url
      };
    }

    if (firstSegment === 'library') {
      const slug = segments[1];
      if (!slug) return null; // Ignore home library page to focus on actual learning resources, or log it if needed
      return {
        type: 'LIBRARY',
        entityId: slug,
        title: formatTitle(slug),
        route: url
      };
    }

    if (firstSegment === 'labs') {
      const slug = segments[1];
      if (!slug) return null;
      return {
        type: 'LABS',
        entityId: slug,
        title: formatTitle(slug),
        route: url
      };
    }

    if (firstSegment.startsWith('clase') || firstSegment.includes('plan') || firstSegment === 'academy') {
      // Academy routes
      const entityId = segments[segments.length - 1]; // last segment
      return {
        type: 'ACADEMY',
        entityId: entityId,
        title: formatTitle(entityId),
        route: url
      };
    }

    return null;
  }

  logActivity(data: Omit<Activity, 'id' | 'timestamp'>) {
    const currentHistory = this.historySignal();
    
    const newActivity: Activity = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    // Prevent immediate duplicate logging (e.g. rapid reloads)
    if (currentHistory.length > 0) {
      const last = currentHistory[0];
      if (last.route === newActivity.route && (newActivity.timestamp - last.timestamp < 10000)) {
        return; // debounce
      }
    }

    const updatedHistory = [newActivity, ...currentHistory].slice(0, 50); // Keep last 50
    this.saveHistory(updatedHistory);
  }

  getRecentHistory() {
    return this.historySignal.asReadonly();
  }

  getLastActivity() {
    return () => {
      const history = this.historySignal();
      return history.length > 0 ? history[0] : null;
    };
  }
}
