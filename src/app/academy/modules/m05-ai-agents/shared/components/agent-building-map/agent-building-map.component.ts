import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AgentStage = 'decision' | 'tools' | 'loop' | 'state' | 'planning' | 'guardrails' | 'observability';

interface MapNodeDef {
  key: AgentStage;
  label: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-agent-building-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="building-map" role="region" aria-label="Mapa de Arquitectura del Agente">
      <div class="building-map__header">
        <div class="building-map__title-group">
          <span class="material-symbols-outlined building-map__badge-icon" aria-hidden="true">account_tree</span>
          <span class="building-map__title">Anatomía del Agente · Agent Engineering</span>
        </div>
        <div class="building-map__status-pill" [attr.data-stage]="stage">
          <span class="status-dot"></span>
          <span class="status-text">{{ getStagePillLabel() }}</span>
        </div>
      </div>

      <!-- CAPA 1: CORE AGENT (Mecanismo Operacional) -->
      <div class="map-layer map-layer--core">
        <div class="map-layer__header">
          <span class="map-layer__tag">Capa 1: Core Agent</span>
          <span class="map-layer__desc">Mecanismo operacional de decisión, herramientas, bucle, memoria y plan</span>
        </div>

        <div class="building-map__nodes">
          @for (node of coreNodes; track node.key; let last = $last) {
            <div
              class="map-node"
              [class.map-node--active]="stage === node.key"
              [class.map-node--passed]="isPassed(node.key)"
              [class.map-node--future]="isFuture(node.key)"
              [attr.aria-current]="stage === node.key ? 'step' : null"
            >
              <div class="map-icon-wrapper">
                <span class="material-symbols-outlined map-icon" aria-hidden="true">{{ node.icon }}</span>
                @if (isPassed(node.key)) {
                  <span class="material-symbols-outlined map-check-badge" aria-hidden="true">check</span>
                }
              </div>
              <span class="map-label">{{ node.label }}</span>
              @if (node.badge) {
                <span class="map-subbadge">{{ node.badge }}</span>
              }
            </div>

            @if (!last) {
              <div
                class="map-connector"
                [class.map-connector--active]="isPassed(node.key)"
                aria-hidden="true"
              ></div>
            }
          }
        </div>
      </div>

      <!-- CAPA 2: ENGINEERING & CONTROL (Gobernanza y Confiabilidad) -->
      <div class="map-layer map-layer--control">
        <div class="map-layer__header">
          <span class="map-layer__tag map-layer__tag--control">Capa 2: Control & Governance</span>
          <span class="map-layer__desc">Envolvente de salvaguardas, aprobación humana, trazas y evaluación</span>
        </div>

        <div class="building-map__nodes building-map__nodes--control">
          @for (node of controlNodes; track node.key; let last = $last) {
            <div
              class="map-node"
              [class.map-node--active]="stage === node.key"
              [class.map-node--passed]="isPassed(node.key)"
              [class.map-node--future]="isFuture(node.key)"
              [attr.aria-current]="stage === node.key ? 'step' : null"
            >
              <div class="map-icon-wrapper">
                <span class="material-symbols-outlined map-icon" aria-hidden="true">{{ node.icon }}</span>
                @if (isPassed(node.key)) {
                  <span class="material-symbols-outlined map-check-badge" aria-hidden="true">check</span>
                }
              </div>
              <span class="map-label">{{ node.label }}</span>
              @if (node.badge) {
                <span class="map-subbadge">{{ node.badge }}</span>
              }
            </div>

            @if (!last) {
              <div
                class="map-connector"
                [class.map-connector--active]="isPassed(node.key)"
                aria-hidden="true"
              ></div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .building-map {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4, 16px);
      padding: var(--case-space-5, 20px);
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      margin-bottom: var(--case-space-6, 24px);
    }

    .building-map__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
    }

    .building-map__title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .building-map__badge-icon {
      font-size: 1.25rem;
      color: var(--case-accent, #6366f1);
    }

    .building-map__title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8f8f2);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .building-map__status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--case-radius-full, 9999px);
      background: var(--case-surface-3, #21222c);
      border: 1px solid var(--case-border, #282a36);
      font-size: 0.75rem;
      font-family: var(--case-font-mono, monospace);
      color: var(--case-text-secondary, #a1a1aa);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--case-accent, #6366f1);
      box-shadow: 0 0 8px var(--case-accent, #6366f1);
    }

    .map-layer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px 16px;
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: var(--case-radius-md, 8px);
    }

    .map-layer--control {
      background: rgba(99, 102, 241, 0.03);
      border-color: rgba(99, 102, 241, 0.15);
    }

    .map-layer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    .map-layer__tag {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--case-color-info, #38bdf8);
      padding: 2px 8px;
      background: rgba(56, 189, 248, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }

    .map-layer__tag--control {
      color: var(--case-color-warning, #f59e0b);
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.2);
    }

    .map-layer__desc {
      font-size: 0.75rem;
      color: var(--case-text-muted, #71717a);
    }

    .building-map__nodes {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .building-map__nodes--control {
      justify-content: flex-start;
      gap: 24px;
    }

    .map-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      color: var(--case-text-disabled, #52525b);
      transition: all 0.25s ease;
      opacity: 0.55;
      text-align: center;
      min-width: 64px;
    }

    .map-icon-wrapper {
      position: relative;
      display: inline-flex;
    }

    .map-node--passed {
      color: var(--case-color-success, #10b981);
      opacity: 0.85;
    }

    .map-node--active {
      color: var(--case-accent, #6366f1);
      opacity: 1;
      transform: translateY(-2px);
    }

    .map-icon {
      font-size: 1.6rem;
      background: var(--case-surface-2, #181920);
      padding: 10px;
      border-radius: 50%;
      border: 2px solid currentColor;
      transition: all 0.25s ease;
    }

    .map-node--active .map-icon {
      background: rgba(99, 102, 241, 0.15);
      border-color: var(--case-accent, #6366f1);
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }

    .map-check-badge {
      position: absolute;
      bottom: -2px;
      right: -2px;
      font-size: 0.9rem;
      background: var(--case-color-success, #10b981);
      color: #ffffff;
      border-radius: 50%;
      padding: 2px;
      border: 2px solid var(--case-surface-1, #13141c);
    }

    .map-label {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: -0.2px;
    }

    .map-node--active .map-label {
      color: var(--case-text-primary, #ffffff);
      font-weight: 700;
    }

    .map-subbadge {
      font-size: 0.65rem;
      font-family: var(--case-font-mono, monospace);
      color: var(--case-text-muted, #71717a);
      background: var(--case-surface-3, #21222c);
      padding: 1px 6px;
      border-radius: 4px;
    }

    .map-connector {
      flex: 1;
      height: 2px;
      background: var(--case-border-strong, #323444);
      margin: 0 8px;
      margin-bottom: 22px;
      transition: background 0.3s ease;
    }

    .map-connector--active {
      background: var(--case-color-success, #10b981);
    }

    @media (max-width: 900px) {
      .building-map__nodes {
        flex-wrap: wrap;
        gap: 12px;
      }
      .map-connector {
        display: none;
      }
      .map-node {
        flex: 1 1 30%;
        min-width: 90px;
        flex-direction: row;
        text-align: left;
        gap: 10px;
        background: var(--case-surface-2, #181920);
        padding: 8px 10px;
        border-radius: 6px;
      }
      .map-icon {
        font-size: 1.2rem;
        padding: 6px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transform: none !important;
      }
    }
  `]
})
export class AgentBuildingMapComponent {
  @Input() stage: AgentStage = 'decision';

  readonly coreNodes: MapNodeDef[] = [
    { key: 'decision', label: 'Decision', icon: 'alt_route', badge: 'L01' },
    { key: 'tools', label: 'Tools', icon: 'handyman', badge: 'L02 · Agent v1' },
    { key: 'loop', label: 'Loop', icon: 'loop', badge: 'L03 · Agent v2' },
    { key: 'state', label: 'State & Memory', icon: 'memory', badge: 'L04 · Agent v3' },
    { key: 'planning', label: 'Planning', icon: 'schema', badge: 'L05 · Agent v4' }
  ];

  readonly controlNodes: MapNodeDef[] = [
    { key: 'guardrails', label: 'Guardrails & HITL', icon: 'shield', badge: 'L06 · Agent v5' },
    { key: 'observability', label: 'Observability & Eval', icon: 'query_stats', badge: 'L07 · Agent v6' }
  ];

  private readonly stageOrder: AgentStage[] = [
    'decision',
    'tools',
    'loop',
    'state',
    'planning',
    'guardrails',
    'observability'
  ];

  isPassed(current: AgentStage): boolean {
    const currentIndex = this.stageOrder.indexOf(current);
    const activeIndex = this.stageOrder.indexOf(this.stage);
    return currentIndex < activeIndex;
  }

  isFuture(current: AgentStage): boolean {
    const currentIndex = this.stageOrder.indexOf(current);
    const activeIndex = this.stageOrder.indexOf(this.stage);
    return currentIndex > activeIndex;
  }

  getStagePillLabel(): string {
    switch (this.stage) {
      case 'decision':
        return 'L01 · Least Autonomy Necessary';
      case 'tools':
        return 'L02 · Agent v1 (Tool Calling)';
      case 'loop':
        return 'L03 · Agent v2 (Agent Loop)';
      case 'state':
        return 'L04 · Agent v3 (State & Memory)';
      case 'planning':
        return 'L05 · Agent v4 (Planning)';
      case 'guardrails':
        return 'L06 · Agent v5 (Guardrails & HITL)';
      case 'observability':
        return 'L07 · Agent v6 (Observability & Eval)';
      default:
        return 'Agent Engineering';
    }
  }
}
