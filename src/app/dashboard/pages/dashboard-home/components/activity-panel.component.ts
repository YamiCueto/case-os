import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearningProgressService, Activity } from '../../../../core/services/learning-progress.service';
import { CasePanelComponent } from '../../../../core/ui/components/case-panel/case-panel.component';

@Component({
  selector: 'app-activity-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, CasePanelComponent],
  template: `
    <div class="activity-panel">
      <h2 class="activity-panel__title">Actividad Reciente</h2>

      <case-panel [elevation]="1" padding="none">
        
        @if (recentHistory().length === 0) {
          <div class="activity-panel__empty">
            No hay actividad reciente registrada en el Workspace.
          </div>
        } @else {
          <div class="activity-list" role="list">
            
            @for (activity of recentHistory() | slice:0:8; track activity.id) {
              <a [routerLink]="activity.route" class="activity-item" role="listitem">
                
                <div class="activity-item__icon-wrapper">
                  <span class="material-symbols-outlined activity-item__icon" aria-hidden="true">
                    {{ getIconForType(activity.type) }}
                  </span>
                </div>
                
                <div class="activity-item__content">
                  <span class="activity-item__title">{{ activity.title }}</span>
                  <div class="activity-item__meta">
                    <span class="activity-item__type">{{ activity.type }}</span>
                    <span class="activity-item__dot" aria-hidden="true">•</span>
                    <span class="activity-item__time">{{ formatTime(activity.timestamp) }}</span>
                  </div>
                </div>

                <div class="activity-item__action">
                  <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </div>

              </a>
            }

          </div>
        }

      </case-panel>
    </div>
  `,
  styles: [`
    .activity-panel {
      margin-bottom: var(--case-space-6);
    }
    
    .activity-panel__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wide);
      margin-bottom: var(--case-space-3);
    }

    .activity-panel__empty {
      padding: var(--case-space-6);
      text-align: center;
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      color: var(--case-text-muted);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--case-space-3);
      padding: var(--case-space-3) var(--case-space-4);
      border-bottom: var(--case-border-width) solid var(--case-border);
      text-decoration: none;
      transition: background-color var(--case-transition-fast);
      cursor: pointer;
    }
    .activity-item:last-child {
      border-bottom: none;
    }
    .activity-item:hover {
      background-color: var(--case-state-hover);
    }

    .activity-item__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--case-radius-sm);
      background-color: var(--case-surface-2);
      border: var(--case-border-width) solid var(--case-border);
      flex-shrink: 0;
    }

    .activity-item__icon {
      font-size: var(--case-icon-sm);
      color: var(--case-text-secondary);
    }

    .activity-item__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* truncate fix */
    }

    .activity-item__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-item__meta {
      display: flex;
      align-items: center;
      gap: var(--case-space-2);
      font-family: var(--case-font-sans);
      font-size: 11px;
      color: var(--case-text-muted);
    }

    .activity-item__type {
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wider);
    }

    .activity-item__dot {
      font-size: 8px;
    }

    .activity-item__action {
      display: flex;
      align-items: center;
      color: var(--case-text-disabled);
      transition: color var(--case-transition-fast);
    }
    .activity-item:hover .activity-item__action {
      color: var(--case-text-secondary);
    }
  `]
})
export class ActivityPanelComponent {
  private progressService = inject(LearningProgressService);
  
  // Ignoramos Dashboard visits en la lista de actividad
  readonly recentHistory = computed(() => {
    return this.progressService.getRecentHistory()().filter(a => a.type !== 'DASHBOARD');
  });

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'ACADEMY': 'school',
      'LIBRARY': 'library_books',
      'LABS': 'science',
    };
    return icons[type] || 'article';
  }

  formatTime(timestamp: number): string {
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const diffDays = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.round((timestamp - Date.now()) / (1000 * 60));
        return rtf.format(diffMins, 'minute');
      }
      return rtf.format(diffHours, 'hour');
    }
    
    return rtf.format(diffDays, 'day');
  }
}
