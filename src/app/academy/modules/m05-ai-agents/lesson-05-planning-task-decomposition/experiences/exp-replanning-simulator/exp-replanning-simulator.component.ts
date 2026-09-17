import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SimStep {
  id: string;
  action: string;
  executor: string;
  status: 'completed' | 'failed' | 'pending';
  dependsOn: string[];
  note?: string;
}

@Component({
  selector: 'app-exp-replanning-simulator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Simulador de Replanning">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">alt_route</span>
          <span>Experiencia 03 · Contingencias & Replanning</span>
        </div>
        <h3 class="exp-title">Simulador de Replanning y Conservación de Historia</h3>
        <p class="exp-subtitle">
          Experimenta qué ocurre cuando una herramienta falla en mitad de la ejecución.
          Descubre cómo el runtime archiva la <strong>Revisión 1</strong> en el historial inmutable
          y genera la <strong>Revisión 2</strong> con una ruta alternativa preservando la meta original.
        </p>
      </header>

      <!-- Estado Operacional Actual -->
      <div class="status-summary-bar">
        <div class="summary-col">
          <span class="summary-label">Objetivo Invariable:</span>
          <span class="summary-val">"Auditar incidentes y correlacionar con despliegue"</span>
        </div>
        <div class="summary-col">
          <span class="summary-label">Fase Actual:</span>
          <span class="summary-val summary-val--phase">
            @switch (simPhase) {
              @case ('initial') { Paso S1 completado · Listo para S2 }
              @case ('failed_s2') { Contingencia detectada en S2 (503 Error) }
              @case ('blind_retry') { Reintento fallido · Presupuesto consumido }
              @case ('aborted') { Tarea cancelada sin alcanzar la meta }
              @case ('replanned') { Revisión 2 activa · Contingencia superada }
            }
          </span>
        </div>
      </div>

      <!-- Pestañas de Historial de Revisiones (Aparece tras replanificar) -->
      @if (simPhase === 'replanned') {
        <div class="revision-tabs" role="tablist">
          <button
            type="button"
            class="rev-tab"
            [class.rev-tab--active]="activeTab === 'rev1'"
            (click)="activeTab = 'rev1'"
            role="tab"
            [attr.aria-selected]="activeTab === 'rev1'"
          >
            <span class="material-symbols-outlined rev-icon">history</span>
            <span>Revisión 1 (Snapshot en plan_history[0])</span>
          </button>
          <button
            type="button"
            class="rev-tab"
            [class.rev-tab--active]="activeTab === 'rev2'"
            (click)="activeTab = 'rev2'"
            role="tab"
            [attr.aria-selected]="activeTab === 'rev2'"
          >
            <span class="material-symbols-outlined rev-icon">published_with_changes</span>
            <span>Revisión 2 (Plan Activo con S2b)</span>
          </button>
        </div>
      }

      <!-- Renderizador del Plan según la Fase o Pestaña -->
      <div class="plan-view">
        <div class="plan-view-header">
          <span class="plan-view-title">
            {{ activeTab === 'rev1' ? 'SNAPSHOT HISTÓRICO: REVISIÓN 1' : 'PLAN DE EJECUCIÓN: REVISIÓN ' + currentRevisionNumber }}
          </span>
          <span class="plan-rev-badge">
            {{ activeTab === 'rev1' ? 'Archivado en plan_history' : 'current_plan activo' }}
          </span>
        </div>

        <div class="steps-grid">
          @for (step of displayedSteps; track step.id) {
            <div class="sim-step-card" [attr.data-status]="step.status">
              <div class="sim-step-badge" [attr.data-status]="step.status">
                {{ step.id }}
              </div>
              <div class="sim-step-body">
                <div class="sim-step-top">
                  <span class="sim-step-action">{{ step.action }}</span>
                  <span class="sim-step-exec">{{ step.executor }}</span>
                  <span class="sim-step-status-pill" [attr.data-status]="step.status">
                    {{ step.status | uppercase }}
                  </span>
                </div>
                @if (step.note) {
                  <p class="sim-step-note" [class.sim-step-note--error]="step.status === 'failed'">
                    {{ step.note }}
                  </p>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Panel de Control Interactivo -->
      <div class="action-dock">
        @if (simPhase === 'initial') {
          <button type="button" class="btn-action btn-action--trigger" (click)="triggerFailure()">
            <span class="material-symbols-outlined">play_circle</span>
            <span>Ejecutar Paso S2 (Provocar fallo 503 en Gateway)</span>
          </button>
        }

        @if (simPhase === 'failed_s2' || simPhase === 'blind_retry') {
          <div class="decision-group">
            <span class="decision-prompt">S2 falló con 503 Gateway Timeout. ¿Qué estrategia debe adoptar el runtime?</span>
            <div class="decision-buttons">
              <button type="button" class="btn-choice btn-choice--warn" (click)="blindRetry()">
                <span class="material-symbols-outlined">replay</span>
                <span>Reintentar a ciegas (Sin plan)</span>
              </button>
              <button type="button" class="btn-choice btn-choice--danger" (click)="abortTask()">
                <span class="material-symbols-outlined">cancel</span>
                <span>Abortar corrida</span>
              </button>
              <button type="button" class="btn-choice btn-choice--primary" (click)="replanWithHistory()">
                <span class="material-symbols-outlined">auto_fix_high</span>
                <span>Replanificar con Software (S2b Cache)</span>
              </button>
            </div>
          </div>
        }

        @if (simPhase === 'aborted' || simPhase === 'replanned') {
          <div class="conclusion-bar">
            <div class="conclusion-text">
              @if (simPhase === 'replanned') {
                <span class="conclusion-success">
                  ✅ <strong>Éxito agéntico:</strong> S1 no se repitió, S2b obtuvo los datos del cache,
                  y la meta original ("Auditar incidentes...") se completó con termination_reason="plan_completed".
                </span>
              } @else {
                <span class="conclusion-failure">
                  ❌ <strong>Tarea abortada:</strong> La meta quedó incumplida y el usuario no recibió respuesta útil.
                </span>
              }
            </div>
            <button type="button" class="btn-reset" (click)="resetSimulation()">
              <span class="material-symbols-outlined">restart_alt</span>
              <span>Reiniciar Simulación</span>
            </button>
          </div>
        }
      </div>

      <!-- Axioma de Replanning -->
      <div class="axiom-footer">
        <span class="material-symbols-outlined axiom-icon">verified</span>
        <span>
          <strong>Invariante de Meta y Conservación de Historia:</strong>
          Replanificar nunca significa olvidar. En el Taller 05, la <code>Revision 1</code> permanece
          intacta en <code>plan_history[0]</code> para auditoría, y la meta (<code>goal</code>) se mantiene
          idéntica entre revisiones: el agente cambia su ruta táctica, no su propósito estratégico.
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

    .status-summary-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 14px;
      padding: 12px 16px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
    }

    .summary-col {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .summary-label {
      font-size: 0.75rem;
      color: var(--case-text-muted, #94a3b8);
      text-transform: uppercase;
    }

    .summary-val {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--case-text-primary, #f8fafc);
    }

    .summary-val--phase {
      color: #818cf8;
    }

    .revision-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .rev-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      color: var(--case-text-muted, #94a3b8);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 40px;
    }

    .rev-tab:hover {
      color: var(--case-text-primary, #f8fafc);
      border-color: #6366f1;
    }

    .rev-tab--active {
      background: rgba(99, 102, 241, 0.15);
      border-color: #6366f1;
      color: #818cf8;
    }

    .rev-icon {
      font-size: 1.1rem;
    }

    .plan-view {
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .plan-view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
      flex-wrap: wrap;
      gap: 6px;
    }

    .plan-view-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
      letter-spacing: 0.5px;
    }

    .plan-rev-badge {
      font-size: 0.72rem;
      padding: 2px 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      color: #94a3b8;
      font-weight: 600;
    }

    .steps-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sim-step-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 8px;
    }

    .sim-step-card[data-status="failed"] {
      border-color: rgba(248, 113, 113, 0.4);
      background: rgba(248, 113, 113, 0.05);
    }

    .sim-step-card[data-status="completed"] {
      border-color: rgba(52, 211, 153, 0.3);
    }

    .sim-step-badge {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--case-text-primary, #f8fafc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .sim-step-badge[data-status="completed"] {
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
    }

    .sim-step-badge[data-status="failed"] {
      background: rgba(248, 113, 113, 0.2);
      color: #f87171;
    }

    .sim-step-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
    }

    .sim-step-top {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sim-step-action {
      font-family: monospace;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8fafc);
    }

    .sim-step-exec {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-family: monospace;
      font-weight: 600;
    }

    .sim-step-status-pill {
      margin-left: auto;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .sim-step-status-pill[data-status="completed"] {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }

    .sim-step-status-pill[data-status="failed"] {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }

    .sim-step-status-pill[data-status="pending"] {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
    }

    .sim-step-note {
      margin: 0;
      font-size: 0.8rem;
      color: var(--case-text-muted, #94a3b8);
    }

    .sim-step-note--error {
      color: #f87171;
      font-family: monospace;
    }

    .action-dock {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-action--trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      background: #ef4444;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 48px;
    }

    .btn-action--trigger:hover {
      background: #dc2626;
    }

    .decision-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .decision-prompt {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--case-text-primary, #f8fafc);
    }

    .decision-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    @media (max-width: 680px) {
      .decision-buttons {
        grid-template-columns: 1fr;
      }
    }

    .btn-choice {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
    }

    .btn-choice--warn {
      background: rgba(251, 191, 36, 0.12);
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
    }
    .btn-choice--warn:hover {
      background: rgba(251, 191, 36, 0.2);
    }

    .btn-choice--danger {
      background: rgba(248, 113, 113, 0.12);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #f87171;
    }
    .btn-choice--danger:hover {
      background: rgba(248, 113, 113, 0.2);
    }

    .btn-choice--primary {
      background: #6366f1;
      border: 1px solid #6366f1;
      color: #ffffff;
    }
    .btn-choice--primary:hover {
      background: #4f46e5;
    }

    .conclusion-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 14px 16px;
      background: var(--case-surface-1, #121318);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .conclusion-text {
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .conclusion-success {
      color: #34d399;
    }

    .conclusion-failure {
      color: #f87171;
    }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: transparent;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 6px;
      color: var(--case-text-muted, #94a3b8);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 40px;
    }

    .btn-reset:hover {
      color: var(--case-text-primary, #f8fafc);
      border-color: #6366f1;
    }

    .axiom-footer {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: rgba(52, 211, 153, 0.08);
      border: 1px solid rgba(52, 211, 153, 0.25);
      border-radius: 8px;
      font-size: 0.82rem;
      color: var(--case-text-primary, #f8fafc);
      line-height: 1.5;
    }

    .axiom-icon {
      color: #34d399;
      font-size: 1.2rem;
      flex-shrink: 0;
      margin-top: 2px;
    }
  `]
})
export class ExpReplanningSimulatorComponent {
  simPhase: 'initial' | 'failed_s2' | 'blind_retry' | 'aborted' | 'replanned' = 'initial';
  activeTab: 'rev1' | 'rev2' = 'rev2';

  readonly rev1Steps: SimStep[] = [
    {
      id: 'S1',
      action: 'get_recent_incidents',
      executor: 'TOOL',
      status: 'completed',
      dependsOn: [],
      note: 'Observación: INC-881 en billing-api (crítico).'
    },
    {
      id: 'S2',
      action: 'get_latest_deployment',
      executor: 'TOOL',
      status: 'failed',
      dependsOn: [],
      note: 'Error 503: Service Unavailable (Deployment Gateway Timeout).'
    },
    {
      id: 'S3',
      action: 'correlate_incidents_with_deployment',
      executor: 'RUNTIME',
      status: 'pending',
      dependsOn: ['S1', 'S2'],
      note: 'Bloqueado por fallo en dependencia S2.'
    },
    {
      id: 'S4',
      action: 'generate_incident_recommendation',
      executor: 'MODEL',
      status: 'pending',
      dependsOn: ['S3'],
      note: 'En espera de resolución del plan.'
    }
  ];

  readonly rev2Steps: SimStep[] = [
    {
      id: 'S1',
      action: 'get_recent_incidents',
      executor: 'TOOL',
      status: 'completed',
      dependsOn: [],
      note: 'Preservado de Revisión 1 (No se repite la llamada).'
    },
    {
      id: 'S2',
      action: 'get_latest_deployment',
      executor: 'TOOL',
      status: 'failed',
      dependsOn: [],
      note: 'Histórico: Falló con 503 en corrida anterior.'
    },
    {
      id: 'S2b',
      action: 'get_deployment_from_cache',
      executor: 'TOOL',
      status: 'completed',
      dependsOn: [],
      note: 'Paso alternativo generado por Replanner: Datos recuperados de caché local.'
    },
    {
      id: 'S3',
      action: 'correlate_incidents_with_deployment',
      executor: 'RUNTIME',
      status: 'completed',
      dependsOn: ['S1', 'S2b'],
      note: 'Cruce algorítmico ejecutado con éxito usando S2b.'
    },
    {
      id: 'S4',
      action: 'generate_incident_recommendation',
      executor: 'MODEL',
      status: 'completed',
      dependsOn: ['S3'],
      note: 'Recomendación generada: Rollback a v3.1.1 para billing-api.'
    }
  ];

  get currentRevisionNumber(): number {
    return this.simPhase === 'replanned' ? 2 : 1;
  }

  get displayedSteps(): SimStep[] {
    if (this.simPhase === 'replanned') {
      return this.activeTab === 'rev1' ? this.rev1Steps : this.rev2Steps;
    }
    if (this.simPhase === 'failed_s2' || this.simPhase === 'blind_retry' || this.simPhase === 'aborted') {
      return this.rev1Steps;
    }
    // initial
    return [
      {
        id: 'S1',
        action: 'get_recent_incidents',
        executor: 'TOOL',
        status: 'completed',
        dependsOn: [],
        note: 'Observación: INC-881 en billing-api.'
      },
      {
        id: 'S2',
        action: 'get_latest_deployment',
        executor: 'TOOL',
        status: 'pending',
        dependsOn: [],
        note: 'Listo para invocar gateway de despliegues.'
      },
      {
        id: 'S3',
        action: 'correlate_incidents_with_deployment',
        executor: 'RUNTIME',
        status: 'pending',
        dependsOn: ['S1', 'S2']
      },
      {
        id: 'S4',
        action: 'generate_incident_recommendation',
        executor: 'MODEL',
        status: 'pending',
        dependsOn: ['S3']
      }
    ];
  }

  triggerFailure(): void {
    this.simPhase = 'failed_s2';
  }

  blindRetry(): void {
    this.simPhase = 'blind_retry';
  }

  abortTask(): void {
    this.simPhase = 'aborted';
  }

  replanWithHistory(): void {
    this.simPhase = 'replanned';
    this.activeTab = 'rev2';
  }

  resetSimulation(): void {
    this.simPhase = 'initial';
    this.activeTab = 'rev2';
  }
}
