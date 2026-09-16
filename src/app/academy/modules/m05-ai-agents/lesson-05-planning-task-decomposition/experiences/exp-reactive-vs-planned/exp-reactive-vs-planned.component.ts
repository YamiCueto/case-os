import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrajectoryStep {
  stepNum: number;
  label: string;
  executor: string;
  detail: string;
  status: 'ok' | 'drift' | 'redundant' | 'missing';
}

@Component({
  selector: 'app-exp-reactive-vs-planned',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Reactivo vs Planificado">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">compare_arrows</span>
          <span>Experiencia 01 · Trayectorias Agénticas</span>
        </div>
        <h3 class="exp-title">Agente Reactivo vs Agente Planificador</h3>
        <p class="exp-subtitle">
          Observa cómo se comportan dos arquitecturas ante la misma meta compuesta de ingeniería:
          <em>"Auditar incidentes recientes, correlacionar con el último despliegue y emitir recomendación."</em>
        </p>
      </header>

      <!-- Panel de Control y Selector de Modo -->
      <div class="mode-selector" role="group" aria-label="Selector de estrategia">
        <button
          type="button"
          class="mode-btn"
          [class.mode-btn--active]="activeMode === 'reactive'"
          (click)="selectMode('reactive')"
          aria-pressed="activeMode === 'reactive'"
        >
          <span class="material-symbols-outlined mode-btn__icon">psychology_alt</span>
          <div class="mode-btn__text">
            <span class="mode-btn__title">Agente Reactivo (Agent v3)</span>
            <span class="mode-btn__desc">Decisión local paso a paso sin representación explícita del plan global</span>
          </div>
        </button>

        <button
          type="button"
          class="mode-btn"
          [class.mode-btn--active]="activeMode === 'planned'"
          (click)="selectMode('planned')"
          aria-pressed="activeMode === 'planned'"
        >
          <span class="material-symbols-outlined mode-btn__icon">schema</span>
          <div class="mode-btn__text">
            <span class="mode-btn__title">Agente Planificador (Agent v4)</span>
            <span class="mode-btn__desc">Mantiene Goal + Steps + Dependencias + Progreso en modelo observable</span>
          </div>
        </button>
      </div>

      <!-- Métricas Resumen -->
      <div class="metrics-grid">
        <div class="metric-box">
          <span class="metric-label">Pasos Ejecutados</span>
          <span class="metric-value" [class.metric-value--warn]="activeMode === 'reactive'">
            {{ activeMode === 'reactive' ? '5 iteraciones' : '4 pasos ordenados' }}
          </span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Riesgo de Plan Drift</span>
          <span class="metric-value" [class.metric-value--danger]="activeMode === 'reactive'" [class.metric-value--success]="activeMode === 'planned'">
            {{ activeMode === 'reactive' ? 'Alto (Desvío / Reintentos)' : 'Bajo (Grafo Validado)' }}
          </span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Completitud del Objetivo</span>
          <span class="metric-value" [class.metric-value--warn]="activeMode === 'reactive'" [class.metric-value--success]="activeMode === 'planned'">
            {{ activeMode === 'reactive' ? 'Incompleta (Faltó correlación)' : '100% Satisfactoria' }}
          </span>
        </div>
      </div>

      <!-- Visualización de la Trayectoria -->
      <div class="trajectory-board">
        <div class="board-header">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span class="board-title">
              Trayectoria Operacional — {{ activeMode === 'reactive' ? 'Modo Reactivo (Decisión Local)' : 'Modo Planificado (Secuencia Observable)' }}
            </span>
            <span class="sim-disclaimer-badge">SIMULACIÓN DIDÁCTICA / ESCENARIO ILUSTRATIVO</span>
          </div>
          <span class="board-pill" [class.board-pill--reactive]="activeMode === 'reactive'" [class.board-pill--planned]="activeMode === 'planned'">
            {{ activeMode === 'reactive' ? 'Loop Reactivo' : 'Plan v1 Gobernado' }}
          </span>
        </div>

        <div class="steps-timeline">
          @for (step of currentTrajectory; track step.stepNum) {
            <div class="step-card" [attr.data-status]="step.status">
              <div class="step-index">
                <span>{{ step.stepNum }}</span>
              </div>
              <div class="step-body">
                <div class="step-meta">
                  <span class="step-label">{{ step.label }}</span>
                  <span class="step-executor-badge">{{ step.executor }}</span>
                  <span class="step-tag" [attr.data-tag]="step.status">
                    @switch (step.status) {
                      @case ('ok') { Óptimo }
                      @case ('drift') { Desvío }
                      @case ('redundant') { Redundante }
                      @case ('missing') { Conclusión apresurada }
                    }
                  </span>
                </div>
                <p class="step-detail">{{ step.detail }}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Axioma de Ingeniería y Tradeoff -->
      <div class="insight-banner">
        <span class="material-symbols-outlined insight-icon">info</span>
        <div class="insight-content">
          <strong>Principio de Least Autonomy Necessary en Planificación:</strong>
          <p>
            No toda tarea requiere un planner. Para consultas atómicas directas (<em>"¿Cuál es el saldo del pedido X?"</em>),
            el modo reactivo o un workflow determinista es superior en costo y latencia. La planificación se justifica cuando la meta
            involucra <strong>dependencias cruzadas, múltiples herramientas y necesidad de contingencia auditable</strong>.
          </p>
          <p style="margin-top: 8px; font-size: 0.8rem; color: var(--case-text-muted, #94a3b8);">
            <em>Nota pedagógica:</em> La trayectoria y métricas presentadas corresponden a una <strong>simulación didáctica / escenario ilustrativo</strong>. Un agente reactivo también puede seleccionar herramientas alternativas tras un error; la distinción clave es que no mantiene un modelo tipado del plan global en su estado.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exp-card {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      padding: 24px;
      margin: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .exp-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .exp-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 999px;
      color: #818cf8;
      font-size: 0.8rem;
      font-weight: 600;
      width: fit-content;
    }

    .exp-badge-icon {
      font-size: 1rem;
    }

    .exp-title {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
    }

    .exp-subtitle {
      margin: 0;
      font-size: 0.95rem;
      color: var(--case-text-muted, #94a3b8);
      line-height: 1.5;
    }

    .mode-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    @media (max-width: 640px) {
      .mode-selector {
        grid-template-columns: 1fr;
      }
    }

    .mode-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      min-height: 48px;
    }

    .mode-btn:hover {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
    }

    .mode-btn--active {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.12);
      box-shadow: 0 0 0 1px #6366f1;
    }

    .mode-btn__icon {
      font-size: 1.75rem;
      color: #818cf8;
      flex-shrink: 0;
    }

    .mode-btn__text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .mode-btn__title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--case-text-primary, #f8fafc);
    }

    .mode-btn__desc {
      font-size: 0.8rem;
      color: var(--case-text-muted, #94a3b8);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .metric-box {
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 0.78rem;
      color: var(--case-text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
    }

    .metric-value--warn {
      color: #fbbf24;
    }

    .metric-value--danger {
      color: #f87171;
    }

    .metric-value--success {
      color: #34d399;
    }

    .trajectory-board {
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
    }

    .board-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--case-text-primary, #f8fafc);
    }

    .sim-disclaimer-badge {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--case-text-muted, #94a3b8);
      font-weight: 700;
      border: 1px solid var(--case-border, #282a36);
    }

    .board-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .board-pill--reactive {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .board-pill--planned {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }

    .steps-timeline {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step-card {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
      align-items: flex-start;
      transition: all 0.2s ease;
    }

    .step-index {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      color: var(--case-text-primary, #f8fafc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .step-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .step-label {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
    }

    .step-executor-badge {
      font-size: 0.72rem;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-family: monospace;
      font-weight: 600;
    }

    .step-tag {
      font-size: 0.72rem;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
      margin-left: auto;
    }

    .step-tag[data-tag="ok"] {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }

    .step-tag[data-tag="drift"] {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }

    .step-tag[data-tag="redundant"] {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .step-tag[data-tag="missing"] {
      background: rgba(217, 70, 239, 0.15);
      color: #e879f9;
    }

    .step-detail {
      margin: 0;
      font-size: 0.82rem;
      color: var(--case-text-muted, #94a3b8);
      line-height: 1.4;
    }

    .insight-banner {
      display: flex;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 8px;
      align-items: flex-start;
    }

    .insight-icon {
      color: #818cf8;
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .insight-content {
      font-size: 0.85rem;
      color: var(--case-text-primary, #f8fafc);
      line-height: 1.5;
    }

    .insight-content p {
      margin: 4px 0 0 0;
      color: var(--case-text-muted, #94a3b8);
    }
  `]
})
export class ExpReactiveVsPlannedComponent {
  activeMode: 'reactive' | 'planned' = 'reactive';

  readonly reactiveTrajectory: TrajectoryStep[] = [
    {
      stepNum: 1,
      label: 'get_recent_incidents',
      executor: 'TOOL',
      detail: 'Consulta incidentes de las últimas 24h. Obtiene INC-881 (crítico en billing-api).',
      status: 'ok'
    },
    {
      stepNum: 2,
      label: 'get_order_status (ORD-991)',
      executor: 'TOOL',
      detail: 'Plan Drift: El modelo ve un mensaje en contexto y consulta un pedido que no forma parte del incidente.',
      status: 'drift'
    },
    {
      stepNum: 3,
      label: 'get_recent_incidents',
      executor: 'TOOL',
      detail: 'Llamada redundante: Al no tener memoria de su plan, vuelve a consultar la misma lista de incidentes.',
      status: 'redundant'
    },
    {
      stepNum: 4,
      label: 'generate_recommendation',
      executor: 'MODEL',
      detail: 'Conclusión incompleta: Redacta una recomendación genérica sin haber consultado jamás el despliegue.',
      status: 'missing'
    }
  ];

  readonly plannedTrajectory: TrajectoryStep[] = [
    {
      stepNum: 1,
      label: 'S1: get_recent_incidents',
      executor: 'TOOL',
      detail: 'Paso 1 del Plan: Consulta incidentes críticos. Observación: INC-881 en billing-api.',
      status: 'ok'
    },
    {
      stepNum: 2,
      label: 'S2: get_latest_deployment',
      executor: 'TOOL',
      detail: 'Paso 2 del Plan: Consulta despliegues. Observación: versión v3.1.2 en billing-api hace 15 min.',
      status: 'ok'
    },
    {
      stepNum: 3,
      label: 'S3: correlate_incidents_with_deployment',
      executor: 'RUNTIME',
      detail: 'Paso 3 del Plan: Cruce algorítmico determinista en CPU local. Coincidencia temporal y de servicio confirmada.',
      status: 'ok'
    },
    {
      stepNum: 4,
      label: 'S4: generate_incident_recommendation',
      executor: 'MODEL',
      detail: 'Paso 4 del Plan: Síntesis final informada por S3. Recomienda rollback inmediato de v3.1.2.',
      status: 'ok'
    }
  ];

  get currentTrajectory(): TrajectoryStep[] {
    return this.activeMode === 'reactive' ? this.reactiveTrajectory : this.plannedTrajectory;
  }

  selectMode(mode: 'reactive' | 'planned'): void {
    this.activeMode = mode;
  }
}
