import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AgentStage = 'decision' | 'tools' | 'loop' | 'state' | 'guardrails';

@Component({
  selector: 'app-agent-building-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="building-map">
      <div class="building-map__title">Anatomía del Agente</div>
      <div class="building-map__nodes">
        <div class="map-node" [class.map-node--active]="stage === 'decision'" [class.map-node--passed]="isPassed('decision')">
          <span class="material-symbols-outlined map-icon">alt_route</span>
          <span class="map-label">Decision</span>
        </div>
        
        <div class="map-connector" [class.map-connector--active]="isPassed('decision')"></div>
        
        <div class="map-node" [class.map-node--active]="stage === 'tools'" [class.map-node--passed]="isPassed('tools')">
          <span class="material-symbols-outlined map-icon">handyman</span>
          <span class="map-label">Tools</span>
        </div>
        
        <div class="map-connector" [class.map-connector--active]="isPassed('tools')"></div>
        
        <div class="map-node" [class.map-node--active]="stage === 'loop'" [class.map-node--passed]="isPassed('loop')">
          <span class="material-symbols-outlined map-icon">loop</span>
          <span class="map-label">Loop</span>
        </div>
        
        <div class="map-connector" [class.map-connector--active]="isPassed('loop')"></div>
        
        <div class="map-node" [class.map-node--active]="stage === 'state'" [class.map-node--passed]="isPassed('state')">
          <span class="material-symbols-outlined map-icon">memory</span>
          <span class="map-label">State</span>
        </div>
        
        <div class="map-connector" [class.map-connector--active]="isPassed('state')"></div>
        
        <div class="map-node" [class.map-node--active]="stage === 'guardrails'" [class.map-node--passed]="isPassed('guardrails')">
          <span class="material-symbols-outlined map-icon">shield</span>
          <span class="map-label">Guardrails</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .building-map {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: var(--case-space-5);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
      margin-bottom: var(--case-space-6);
    }
    
    .building-map__title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .building-map__nodes {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .map-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--case-text-disabled);
      transition: all 0.3s ease;
      opacity: 0.5;
    }

    .map-node--passed {
      color: var(--case-color-success);
      opacity: 0.8;
    }

    .map-node--active {
      color: var(--case-accent);
      opacity: 1;
      transform: scale(1.1);
    }

    .map-icon {
      font-size: 2rem;
      background: var(--case-surface-1);
      padding: 12px;
      border-radius: 50%;
      border: 2px solid currentColor;
    }

    .map-node--active .map-icon {
      background: var(--case-accent-subtle);
      box-shadow: 0 0 10px var(--case-accent-subtle);
    }

    .map-label {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .map-connector {
      flex: 1;
      height: 2px;
      background: var(--case-border-strong);
      margin: 0 12px;
      margin-bottom: 24px;
      transition: background 0.3s ease;
    }

    .map-connector--active {
      background: var(--case-color-success);
    }

    @media (max-width: 768px) {
      .building-map__nodes {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .map-node {
        flex-direction: row;
        width: 100%;
      }
      .map-connector {
        width: 2px;
        height: 20px;
        margin: 0 0 0 23px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transform: none !important;
      }
    }
  `]
})
export class AgentBuildingMapComponent {
  @Input() stage: AgentStage = 'decision';

  private readonly stages: AgentStage[] = ['decision', 'tools', 'loop', 'state', 'guardrails'];

  isPassed(current: AgentStage): boolean {
    const currentIndex = this.stages.indexOf(current);
    const stageIndex = this.stages.indexOf(this.stage);
    return currentIndex < stageIndex;
  }
}
