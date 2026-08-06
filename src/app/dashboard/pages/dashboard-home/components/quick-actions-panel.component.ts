import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkspaceRegistryService } from '../../../../core/layout/workspace-registry/workspace-registry.service';
import { CasePanelComponent } from '../../../../core/ui/components/case-panel/case-panel.component';
import { CaseButtonComponent } from '../../../../core/ui/components/case-button/case-button.component';

@Component({
  selector: 'app-quick-actions-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, CasePanelComponent, CaseButtonComponent],
  template: `
    <div class="quick-actions">
      <h2 class="quick-actions__title">Workspaces</h2>
      
      <div class="quick-actions__grid">
        @for (ws of quickActionWorkspaces(); track ws.id) {
          <case-panel [elevation]="1" padding="md" class="qa-card" [class.qa-card--disabled]="ws.metadata.comingSoon">
            
            <div class="qa-card__header">
              <div class="qa-card__icon-wrapper">
                <span class="material-symbols-outlined qa-card__icon" aria-hidden="true">{{ ws.icon }}</span>
              </div>
              <span class="qa-card__label">{{ ws.label }}</span>
              @if (ws.metadata.comingSoon) {
                <span class="qa-card__badge">Próximamente</span>
              }
            </div>

            @if (ws.primaryAction && !ws.metadata.comingSoon) {
              <div class="qa-card__action">
                <case-button 
                  [variant]="ws.primaryAction.primary ? 'primary' : 'secondary'"
                  size="sm"
                  [iconLeft]="ws.primaryAction.icon"
                  [routerLink]="ws.primaryAction.route"
                  class="qa-card__button"
                >
                  {{ ws.primaryAction.label }}
                </case-button>
              </div>
            } @else if (!ws.metadata.comingSoon) {
               <!-- Default fallback navigation -->
              <div class="qa-card__action">
                <case-button 
                  variant="secondary"
                  size="sm"
                  [routerLink]="ws.route"
                  class="qa-card__button"
                >
                  Abrir
                </case-button>
              </div>
            }

          </case-panel>
        }
      </div>
    </div>
  `,
  styles: [`
    .quick-actions {
      margin-bottom: var(--case-space-6);
    }
    
    .quick-actions__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wide);
      margin-bottom: var(--case-space-3);
    }

    .quick-actions__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--case-space-4);
    }

    .qa-card {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
      height: 100%;
    }

    .qa-card--disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .qa-card__header {
      display: flex;
      align-items: center;
      gap: var(--case-space-3);
    }

    .qa-card__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--case-radius);
      background-color: var(--case-surface-2);
      border: var(--case-border-width) solid var(--case-border);
    }

    .qa-card__icon {
      font-size: var(--case-icon-sm);
      color: var(--case-text-secondary);
    }

    .qa-card__label {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-base);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-primary);
    }

    .qa-card__badge {
      font-family: var(--case-font-mono);
      font-size: 10px;
      padding: 2px 6px;
      border-radius: var(--case-radius-pill);
      background-color: var(--case-surface-3);
      border: var(--case-border-width) solid var(--case-border-strong);
      color: var(--case-text-muted);
      margin-left: auto;
    }

    .qa-card__action {
      margin-top: auto;
    }

    .qa-card__button {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class QuickActionsPanelComponent {
  private registry = inject(WorkspaceRegistryService);

  readonly quickActionWorkspaces = computed(() => {
    // Excluir el Dashboard en sí, y Workspaces escondidos.
    return this.registry.workspaces()
      .filter(w => w.id !== 'dashboard' && !w.metadata.hidden)
      .sort((a, b) => {
        // Enforce coming soon at the bottom
        if (a.metadata.comingSoon && !b.metadata.comingSoon) return 1;
        if (!a.metadata.comingSoon && b.metadata.comingSoon) return -1;
        return a.order - b.order;
      });
  });
}
