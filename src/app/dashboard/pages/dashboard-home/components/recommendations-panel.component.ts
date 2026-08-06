import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LABS_CONFIG } from '../../../../labs/config/labs.config';
import { CasePanelComponent } from '../../../../core/ui/components/case-panel/case-panel.component';

@Component({
  selector: 'app-recommendations-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, CasePanelComponent],
  template: `
    <div class="recs-panel">
      <h2 class="recs-panel__title">Recomendado para ti</h2>

      <case-panel [elevation]="1" padding="none">
        <div class="recs-list" role="list">
          
          @for (lab of recommendedLabs; track lab.id) {
            <a [routerLink]="'/labs/' + lab.slug" class="recs-item" role="listitem">
              
              <div class="recs-item__icon-wrapper">
                <span class="material-symbols-outlined recs-item__icon" aria-hidden="true">
                  science
                </span>
              </div>
              
              <div class="recs-item__content">
                <span class="recs-item__title">{{ lab.title }}</span>
                <span class="recs-item__desc">{{ lab.description }}</span>
              </div>

            </a>
          }

        </div>
      </case-panel>
    </div>
  `,
  styles: [`
    .recs-panel {
      margin-bottom: var(--case-space-6);
    }
    
    .recs-panel__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wide);
      margin-bottom: var(--case-space-3);
    }

    .recs-list {
      display: flex;
      flex-direction: column;
    }

    .recs-item {
      display: flex;
      align-items: center;
      gap: var(--case-space-3);
      padding: var(--case-space-3) var(--case-space-4);
      border-bottom: var(--case-border-width) solid var(--case-border);
      text-decoration: none;
      transition: background-color var(--case-transition-fast);
      cursor: pointer;
    }
    .recs-item:last-child {
      border-bottom: none;
    }
    .recs-item:hover {
      background-color: var(--case-state-hover);
    }

    .recs-item__icon-wrapper {
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

    .recs-item__icon {
      font-size: var(--case-icon-sm);
      color: var(--case-accent);
    }

    .recs-item__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .recs-item__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recs-item__desc {
      font-family: var(--case-font-sans);
      font-size: 11px;
      color: var(--case-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class RecommendationsPanelComponent {
  // Solo toma los primeros 3 laboratorios como recomendación por ahora
  readonly recommendedLabs = LABS_CONFIG.slice(0, 3);
}
