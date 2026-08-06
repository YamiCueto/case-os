import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Layout panels
import { HeroPanelComponent } from './components/hero-panel.component';
import { ContinuePanelComponent } from './components/continue-panel.component';
import { QuickActionsPanelComponent } from './components/quick-actions-panel.component';
import { ActivityPanelComponent } from './components/activity-panel.component';
import { RecommendationsPanelComponent } from './components/recommendations-panel.component';

/**
 * DashboardHomeComponent — CASE Shell
 * Sprint 6 — Engineering Workspace
 *
 * Serves as the main hub/desktop for the engineer.
 * Composes sub-panels without containing business logic itself.
 */
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroPanelComponent,
    ContinuePanelComponent,
    QuickActionsPanelComponent,
    ActivityPanelComponent,
    RecommendationsPanelComponent
  ],
  template: `
    <div class="workspace-layout">
      <!-- Top section (Full width) -->
      <app-hero-panel />
      <app-continue-panel />

      <!-- Content grid (Two columns) -->
      <div class="workspace-grid">
        
        <!-- Left column (Primary Content) -->
        <div class="workspace-grid__main">
          <app-quick-actions-panel />
          <app-activity-panel />
        </div>

        <!-- Right column (Secondary/Contextual) -->
        <div class="workspace-grid__side">
          <app-recommendations-panel />
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: var(--case-space-6);
      /* Restringimos el ancho máximo para legibilidad, similar a VS Code Home */
      max-width: 1280px;
      margin: 0 auto;
    }

    .workspace-layout {
      display: flex;
      flex-direction: column;
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--case-space-6);
      align-items: start;
    }

    /* Fallback para pantallas pequeñas si es necesario */
    @media (max-width: 1024px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardHomeComponent {}
