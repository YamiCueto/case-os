import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StepStatusType = 'pending' | 'in_progress' | 'completed' | 'failed';
export type StepExecutorType = 'TOOL' | 'RUNTIME' | 'MODEL';

interface InspectorStep {
  id: string;
  action: string;
  description: string;
  executor: StepExecutorType;
  status: StepStatusType;
  dependsOn: string[];
  observation?: string;
}

@Component({
  selector: 'app-exp-plan-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Plan Inspector">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">visibility</span>
          <span>Experiencia 02 · Plan Inspector</span>
        </div>
        <h3 class="exp-title">El Plan como Estado Observable de Software</h3>
        <p class="exp-subtitle">
          Inspecciona cómo el runtime en Python evalúa las dependencias de cada paso,
          actualiza sus estados de forma determinista y deriva la completitud final sin confiar en booleanos mutables.
        </p>
      </header>

      <!-- Encabezado del Plan Activo -->
      <div class="plan-header-card">
        <div class="plan-goal-row">
          <span class="plan-tag">META ACTIVA (GOAL)</span>
          <span class="plan-goal-text">"Auditar incidentes recientes y correlacionar con último despliegue"</span>
        </div>
        <div class="plan-meta-row">
          <div class="plan-meta-item">
            <span class="meta-label">Revisión:</span>
            <span class="meta-value">v1 (Inicial)</span>
          </div>
          <div class="plan-meta-item">
            <span class="meta-label">Total Pasos:</span>
            <span class="meta-value">{{ steps.length }}</span>
          </div>
          <div class="plan-meta-item">
            <span class="meta-label">is_completed (Derivado):</span>
            <span class="meta-status" [class.meta-status--done]="isPlanCompleted" [class.meta-status--pending]="!isPlanCompleted">
              {{ isPlanCompleted ? 'TRUE (100% Pasos Completos)' : 'FALSE (En Progreso)' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Barra de Acciones del Runtime -->
      <div class="control-bar">
        <button
          type="button"
          class="btn-step"
          [disabled]="isPlanCompleted || isStepping"
          (click)="advanceNextStep()"
        >
          <span class="material-symbols-outlined btn-icon">
            {{ isStepping ? 'autorenew' : 'play_arrow' }}
          </span>
          <span>{{ getButtonLabel() }}</span>
        </button>

        <button
          type="button"
          class="btn-reset"
          (click)="resetPlan()"
          [disabled]="isStepping"
        >
          <span class="material-symbols-outlined btn-icon">restart_alt</span>
          <span>Reiniciar Plan</span>
        </button>
      </div>

      <!-- Lista de Pasos del Plan -->
      <div class="steps-container">
        @for (step of steps; track step.id) {
          <div class="plan-step-card" [attr.data-status]="step.status">
            <div class="step-left">
              <div class="step-id-badge" [attr.data-status]="step.status">
                {{ step.id }}
              </div>
              <div class="step-status-indicator" [attr.data-status]="step.status">
                <span class="status-dot"></span>
                <span class="status-name">{{ step.status | uppercase }}</span>
              </div>
            </div>

            <div class="step-center">
              <div class="step-headline">
                <span class="step-action-code">{{ step.action }}</span>
                <span class="step-executor-tag" [attr.data-executor]="step.executor">
                  {{ step.executor }}
                </span>
                @if (step.dependsOn.length > 0) {
                  <span class="step-deps">
                    depends_on: [{{ step.dependsOn.join(', ') }}]
                  </span>
                } @else {
                  <span class="step-deps step-deps--none">sin dependencias</span>
                }
              </div>
              <p class="step-desc">{{ step.description }}</p>

              @if (step.observation) {
                <div class="observation-box">
                  <span class="obs-title">Observación de retorno:</span>
                  <code class="obs-code">{{ step.observation }}</code>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Mensaje Pedagógico -->
      <div class="footer-note">
        <span class="material-symbols-outlined note-icon">rule</span>
        <span>
          <strong>Gobernanza del Runtime:</strong> El modelo propone la lista inicial de pasos, pero es el software
          quien valida que las dependencias de S3 (S1 y S2) estén resueltas antes de autorizar su ejecución.
        </span>
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

    .plan-header-card {
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .plan-goal-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .plan-tag {
      font-size: 0.72rem;
      color: #818cf8;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .plan-goal-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--case-text-primary, #f8fafc);
    }

    .plan-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding-top: 10px;
      border-top: 1px solid var(--case-border-subtle, #232530);
    }

    .plan-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
    }

    .meta-label {
      color: var(--case-text-muted, #94a3b8);
    }

    .meta-value {
      color: var(--case-text-primary, #f8fafc);
      font-weight: 600;
    }

    .meta-status {
      font-weight: 700;
      font-size: 0.8rem;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .meta-status--pending {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .meta-status--done {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }

    .control-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-step {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: #6366f1;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
    }

    .btn-step:hover:not(:disabled) {
      background: #4f46e5;
    }

    .btn-step:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--case-surface-1, #121318);
      color: var(--case-text-muted, #94a3b8);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
    }

    .btn-reset:hover:not(:disabled) {
      color: var(--case-text-primary, #f8fafc);
      border-color: #4b5563;
    }

    .btn-icon {
      font-size: 1.15rem;
    }

    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .plan-step-card {
      display: flex;
      gap: 16px;
      padding: 14px 16px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    @media (max-width: 600px) {
      .plan-step-card {
        flex-direction: column;
        gap: 8px;
      }
    }

    .plan-step-card[data-status="in_progress"] {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
    }

    .plan-step-card[data-status="completed"] {
      border-color: rgba(52, 211, 153, 0.4);
    }

    .step-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 90px;
    }

    @media (max-width: 600px) {
      .step-left {
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
      }
    }

    .step-id-badge {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--case-text-primary, #f8fafc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .step-id-badge[data-status="completed"] {
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
    }

    .step-id-badge[data-status="in_progress"] {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
    }

    .step-status-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      font-weight: 700;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .step-status-indicator[data-status="pending"] {
      color: #94a3b8;
    }
    .step-status-indicator[data-status="pending"] .status-dot {
      background: #64748b;
    }

    .step-status-indicator[data-status="in_progress"] {
      color: #818cf8;
    }
    .step-status-indicator[data-status="in_progress"] .status-dot {
      background: #818cf8;
      animation: pulse 1.2s infinite;
    }

    .step-status-indicator[data-status="completed"] {
      color: #34d399;
    }
    .step-status-indicator[data-status="completed"] .status-dot {
      background: #34d399;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .step-center {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .step-headline {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .step-action-code {
      font-family: monospace;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
    }

    .step-executor-tag {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-family: monospace;
    }

    .step-executor-tag[data-executor="TOOL"] {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
    }

    .step-executor-tag[data-executor="RUNTIME"] {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .step-executor-tag[data-executor="MODEL"] {
      background: rgba(217, 70, 239, 0.15);
      color: #e879f9;
    }

    .step-deps {
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: monospace;
    }

    .step-deps--none {
      color: #64748b;
      font-style: italic;
    }

    .step-desc {
      margin: 0;
      font-size: 0.85rem;
      color: var(--case-text-muted, #94a3b8);
      line-height: 1.4;
    }

    .observation-box {
      margin-top: 4px;
      padding: 8px 10px;
      background: rgba(0, 0, 0, 0.25);
      border-left: 2px solid #34d399;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .obs-title {
      font-size: 0.72rem;
      color: #34d399;
      font-weight: 700;
    }

    .obs-code {
      font-family: monospace;
      font-size: 0.8rem;
      color: #e2e8f0;
      word-break: break-all;
    }

    .footer-note {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
      font-size: 0.82rem;
      color: var(--case-text-muted, #94a3b8);
    }

    .note-icon {
      color: #818cf8;
      font-size: 1.15rem;
      flex-shrink: 0;
    }
  `]
})
export class ExpPlanInspectorComponent {
  isStepping = false;

  steps: InspectorStep[] = [
    {
      id: 'S1',
      action: 'get_recent_incidents',
      description: 'Consultar incidentes críticos registrados en las últimas 24 horas.',
      executor: 'TOOL',
      status: 'pending',
      dependsOn: []
    },
    {
      id: 'S2',
      action: 'get_latest_deployment',
      description: 'Obtener metadatos, timestamp y servicios del despliegue más reciente.',
      executor: 'TOOL',
      status: 'pending',
      dependsOn: []
    },
    {
      id: 'S3',
      action: 'correlate_incidents_with_deployment',
      description: 'Cruzar determinísticamente timestamps y microservicios sin llamar al LLM.',
      executor: 'RUNTIME',
      status: 'pending',
      dependsOn: ['S1', 'S2']
    },
    {
      id: 'S4',
      action: 'generate_incident_recommendation',
      description: 'Sintetizar hallazgos del cruce y redactar recomendación técnica de guardia.',
      executor: 'MODEL',
      status: 'pending',
      dependsOn: ['S3']
    }
  ];

  get isPlanCompleted(): boolean {
    return this.steps.length > 0 && this.steps.every(s => s.status === 'completed');
  }

  getButtonLabel(): string {
    if (this.isPlanCompleted) {
      return 'Plan Completado';
    }
    if (this.isStepping) {
      return 'Ejecutando paso...';
    }
    const nextStep = this.getNextExecutableStep();
    return nextStep ? `Ejecutar Paso [${nextStep.id}]` : 'Comprobando dependencias...';
  }

  constructor(private cdr: ChangeDetectorRef) {}

  getNextExecutableStep(): InspectorStep | undefined {
    const completedIds = this.steps.filter(s => s.status === 'completed').map(s => s.id);
    return this.steps.find(s => s.status === 'pending' && s.dependsOn.every(dep => completedIds.includes(dep)));
  }

  advanceNextStep(): void {
    const next = this.getNextExecutableStep();
    if (!next) return;

    this.isStepping = true;
    next.status = 'in_progress';
    this.steps = [...this.steps];
    this.cdr.markForCheck();

    setTimeout(() => {
      next.status = 'completed';
      if (next.id === 'S1') {
        next.observation = 'status="success", count=1, incident="INC-881" (service="billing-api", latency=4200ms)';
      } else if (next.id === 'S2') {
        next.observation = 'status="success", version="v3.1.2", service="billing-api", deployed_at="18:15:00Z"';
      } else if (next.id === 'S3') {
        next.observation = 'status="success", correlation=true (billing-api afectado 15 min después del deploy v3.1.2)';
      } else if (next.id === 'S4') {
        next.observation = 'status="success", recommendation="Rollback preventivo inmediato a v3.1.1 para billing-api."';
      }
      this.isStepping = false;
      this.steps = [...this.steps];
      this.cdr.markForCheck();
    }, 150);
  }

  resetPlan(): void {
    this.steps.forEach(s => {
      s.status = 'pending';
      s.observation = undefined;
    });
    this.isStepping = false;
    this.steps = [...this.steps];
    this.cdr.markForCheck();
  }
}
