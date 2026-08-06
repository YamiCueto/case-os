import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearningProgressService, Activity } from '../../../../core/services/learning-progress.service';
import { CasePanelComponent } from '../../../../core/ui/components/case-panel/case-panel.component';
import { CaseButtonComponent } from '../../../../core/ui/components/case-button/case-button.component';

@Component({
  selector: 'app-continue-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, CasePanelComponent, CaseButtonComponent],
  template: `
    <div class="continue-panel" *ngIf="lastActivity() as last">
      <h2 class="continue-panel__title">Última Actividad</h2>
      
      <case-panel [elevation]="2" padding="md">
        <div class="continue-card">
          <div class="continue-card__icon-wrapper">
            <span class="material-symbols-outlined continue-card__icon">{{ getIconForType(last.type) }}</span>
          </div>
          
          <div class="continue-card__content">
            <span class="continue-card__type">{{ last.type }}</span>
            <h3 class="continue-card__entity">{{ last.title }}</h3>
            <span class="continue-card__time">{{ formatTime(last.timestamp) }}</span>
          </div>
          
          <div class="continue-card__action">
            <case-button 
              variant="primary" 
              size="md" 
              iconLeft="play_arrow"
              [routerLink]="last.route">
              Retomar
            </case-button>
          </div>
        </div>
      </case-panel>
    </div>
  `,
  styles: [`
    .continue-panel {
      margin-bottom: var(--case-space-6);
    }
    
    .continue-panel__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wide);
      margin-bottom: var(--case-space-3);
    }

    .continue-card {
      display: flex;
      align-items: center;
      gap: var(--case-space-4);
    }
    
    .continue-card__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background-color: var(--case-surface-2);
      border-radius: var(--case-radius);
      border: var(--case-border-width) solid var(--case-border);
      flex-shrink: 0;
    }
    
    .continue-card__icon {
      font-size: var(--case-icon-md);
      color: var(--case-text-secondary);
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    
    .continue-card__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .continue-card__type {
      font-family: var(--case-font-mono);
      font-size: var(--case-text-xs);
      color: var(--case-text-muted);
      letter-spacing: var(--case-tracking-wider);
    }
    
    .continue-card__entity {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-lg);
      font-weight: var(--case-weight-bold);
      color: var(--case-text-primary);
      margin: 0;
    }

    .continue-card__time {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      color: var(--case-text-muted);
    }
    
    .continue-card__action {
      flex-shrink: 0;
    }
  `]
})
export class ContinuePanelComponent {
  private progressService = inject(LearningProgressService);

  readonly lastActivity = computed(() => {
    const history = this.progressService.getRecentHistory()();
    return history.find(a => 
      a.type !== 'DASHBOARD' && 
      !(a.type === 'ACADEMY' && (a.entityId === 'home' || a.entityId === 'roadmap' || a.entityId.includes('plan'))) &&
      !(a.type === 'LIBRARY' && a.entityId === 'library') &&
      !(a.type === 'LABS' && a.entityId === 'labs')
    ) || null;
  });

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'ACADEMY': 'school',
      'LIBRARY': 'library_books',
      'LABS': 'science',
      'DASHBOARD': 'grid_view'
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
