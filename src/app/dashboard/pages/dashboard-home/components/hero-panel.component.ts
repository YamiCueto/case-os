import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningProgressService } from '../../../../core/services/learning-progress.service';
import { WorkspaceRegistryService } from '../../../../core/layout/workspace-registry/workspace-registry.service';

@Component({
  selector: 'app-hero-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-panel">
      <div class="hero-panel__content">
        <h1 class="hero-panel__greeting">Engineering Workspace</h1>
        <p class="hero-panel__subtitle">
          Buenos días. Tienes {{ pendingActivitiesCount() }} actividades pendientes y has explorado {{ labsExploredCount() }} laboratorios.
        </p>
      </div>
      
      <!-- Opcional: algún gráfico o indicador visual usando tokens -->
      <div class="hero-panel__illustration" aria-hidden="true">
        <span class="material-symbols-outlined hero-panel__icon">terminal</span>
      </div>
    </div>
  `,
  styles: [`
    .hero-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--case-space-6);
      background: linear-gradient(135deg, var(--case-surface-2) 0%, var(--case-surface-1) 100%);
      border: var(--case-border-width) solid var(--case-border);
      border-radius: var(--case-radius-lg);
      margin-bottom: var(--case-space-6);
    }
    .hero-panel__content {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-2);
    }
    .hero-panel__greeting {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-2xl);
      font-weight: var(--case-weight-bold);
      color: var(--case-text-primary);
      margin: 0;
      letter-spacing: var(--case-tracking-tight);
    }
    .hero-panel__subtitle {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-base);
      color: var(--case-text-secondary);
      margin: 0;
    }
    .hero-panel__illustration {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background-color: var(--case-accent-subtle);
      border-radius: var(--case-radius-lg);
      border: var(--case-border-width) solid var(--case-accent);
    }
    .hero-panel__icon {
      font-size: 32px;
      color: var(--case-accent);
    }
  `]
})
export class HeroPanelComponent {
  private progressService = inject(LearningProgressService);
  private registry = inject(WorkspaceRegistryService);

  // Derivando algo de data dummy pero reactiva para que el dashboard no luzca vacío
  readonly pendingActivitiesCount = computed(() => {
    // Solo un cálculo dummy basado en workspaces habilitados
    return this.registry.workspaces().filter(w => w.metadata.enabled).length * 2;
  });

  readonly labsExploredCount = computed(() => {
    return this.progressService.getRecentHistory()().filter(a => a.type === 'LABS').length;
  });
}
