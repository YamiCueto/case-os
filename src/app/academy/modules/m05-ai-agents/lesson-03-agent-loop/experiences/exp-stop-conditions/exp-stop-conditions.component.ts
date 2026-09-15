import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CasePanelComponent,
  CaseCalloutComponent,
  CaseBadgeComponent
} from '../../../../../../core/ui/components';

interface TaskScenario {
  id: string;
  name: string;
  description: string;
  stepsRequired: number;
  hasFailingTool: boolean;
}

@Component({
  selector: 'app-exp-stop-conditions',
  standalone: true,
  imports: [
    CommonModule,
    CasePanelComponent,
    CaseCalloutComponent,
    CaseBadgeComponent
  ],
  template: `
    <div class="exp-container" role="region" aria-label="Condiciones de Parada del Agent Loop">
      <div class="exp-header">
        <div class="exp-badge-row">
          <case-badge variant="accent" [mono]="true" [dot]="true">EXPERIENCIA 03</case-badge>
          <span class="exp-tag">Control de Software</span>
        </div>
        <h3 class="exp-title">Condiciones de Parada: Gobernanza del Runtime vs. Bucle Infinito</h3>
        <p class="exp-subtitle">
          Experimenta cómo el parámetro <code>max_iterations</code> previene el consumo descontrolado y protege la estabilidad de tu sistema.
        </p>
      </div>

      <!-- Controls Grid -->
      <case-panel [elevation]="1" padding="md" class="controls-panel">
        <div class="controls-grid">

          <!-- Scenario Picker -->
          <div class="control-group">
            <span class="control-label">1. Selecciona el Escenario de Tarea:</span>
            <div class="scenario-buttons">
              @for (sc of scenarios; track sc.id) {
                <button
                  type="button"
                  class="scenario-btn"
                  [class.scenario-btn--active]="selectedScenario().id === sc.id"
                  (click)="selectScenario(sc)"
                  [attr.aria-pressed]="selectedScenario().id === sc.id"
                >
                  <span class="sc-name">{{ sc.name }}</span>
                  <span class="sc-desc">{{ sc.description }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Max Iterations Picker -->
          <div class="control-group">
            <span class="control-label">2. Configura <code>max_iterations</code> en el Runtime:</span>
            <div class="limit-buttons">
              @for (lim of limitOptions; track lim) {
                <button
                  type="button"
                  class="limit-btn"
                  [class.limit-btn--active]="selectedMaxIterations() === lim"
                  (click)="setMaxIterations(lim)"
                  [attr.aria-pressed]="selectedMaxIterations() === lim"
                >
                  <span class="limit-num">{{ lim }}</span>
                  <span class="limit-txt">{{ lim === 1 ? 'vuelta' : 'vueltas' }}</span>
                </button>
              }
            </div>
          </div>

        </div>
      </case-panel>

      <!-- Simulation Output Card -->
      <case-panel [elevation]="2" padding="lg" class="simulation-card">

        <div class="simulation-header">
          <div class="sim-title-group">
            <span class="material-symbols-outlined sim-icon" aria-hidden="true">terminal</span>
            <h4 class="sim-title">Resultado de la Ejecución en el Runtime</h4>
          </div>

          <div class="sim-badge-group">
            <case-badge [variant]="simResult().badgeVariant" [mono]="true">
              {{ simResult().badgeLabel }}
            </case-badge>
          </div>
        </div>

        <!-- Progress Track -->
        <div class="progress-track" aria-label="Progreso de iteraciones">
          <div class="progress-steps-row">
            @for (step of simResult().steps; track step.iterationNumber) {
              <div class="step-prog-item" [class.step-prog-item--aborted]="step.isAborted" [class.step-prog-item--final]="step.isFinal">
                <div class="step-circle">
                  @if (step.isAborted) {
                    <span class="material-symbols-outlined">close</span>
                  } @else if (step.isFinal) {
                    <span class="material-symbols-outlined">check</span>
                  } @else {
                    <span>{{ step.iterationNumber }}</span>
                  }
                </div>
                <div class="step-info">
                  <span class="step-title">Iteración {{ step.iterationNumber }}</span>
                  <span class="step-action">{{ step.actionDesc }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Terminal Output Log -->
        <div class="terminal-box">
          <div class="terminal-bar">
            <span class="term-dot term-dot--red"></span>
            <span class="term-dot term-dot--yellow"></span>
            <span class="term-dot term-dot--green"></span>
            <span class="term-title">runtime_console.log</span>
          </div>
          <pre class="terminal-content"><code>{{ simResult().terminalLog }}</code></pre>
        </div>

        <!-- Outcome Callout -->
        <div class="outcome-callout">
          <case-callout
            [variant]="simResult().calloutVariant"
            [title]="simResult().calloutTitle"
            [message]="simResult().calloutMessage"
          />
        </div>

      </case-panel>

      <!-- Reflection Box -->
      <case-panel [elevation]="1" padding="md" class="reflection-panel">
        <h5 class="reflection-title">
          <span class="material-symbols-outlined" aria-hidden="true">help_outline</span>
          Pregunta de Arquitectura: ¿Por qué el runtime debe imponer el límite y no el modelo?
        </h5>
        <p class="reflection-text">
          Porque los <strong>límites operacionales</strong> (presupuesto económico, latencia máxima, prevención de loops infinitos) pertenecen a la <strong>frontera de ingeniería de software</strong>, jamás a un modelo probabilístico. El modelo intenta complacer al usuario y puede reintentar indefinidamente una llamada rota; el software es quien debe garantizar que el proceso no colapse.
        </p>
      </case-panel>

    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 24px 0;
      font-family: inherit;
    }

    .exp-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .exp-badge-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .exp-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-tertiary, #94a3b8);
      font-weight: 600;
    }

    .exp-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .exp-subtitle {
      font-size: 0.938rem;
      color: var(--text-secondary, #94a3b8);
      margin: 0;
      line-height: 1.5;
    }

    /* Controls Panel */
    .controls-panel {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 20px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .control-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-tertiary, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .control-label code {
      color: var(--accent-primary, #38bdf8);
      font-family: var(--font-mono, monospace);
    }

    .scenario-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .scenario-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 6px;
      color: var(--text-primary, #f8fafc);
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .scenario-btn:hover {
      background: rgba(51, 65, 85, 0.6);
      border-color: rgba(56, 189, 248, 0.35);
    }

    .scenario-btn--active {
      border-color: var(--accent-primary, #38bdf8);
      background: rgba(56, 189, 248, 0.12);
    }

    .sc-name {
      font-size: 0.875rem;
      font-weight: 700;
    }

    .sc-desc {
      font-size: 0.78rem;
      color: var(--text-secondary, #94a3b8);
    }

    .limit-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .limit-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 6px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 6px;
      color: var(--text-primary, #f8fafc);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .limit-btn:hover {
      background: rgba(51, 65, 85, 0.6);
      border-color: rgba(56, 189, 248, 0.35);
    }

    .limit-btn--active {
      border-color: var(--accent-primary, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
    }

    .limit-num {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent-primary, #38bdf8);
    }

    .limit-txt {
      font-size: 0.72rem;
      color: var(--text-secondary, #94a3b8);
    }

    /* Simulation Card */
    .simulation-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 10px;
    }

    .simulation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .sim-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sim-icon {
      color: var(--accent-primary, #38bdf8);
    }

    .sim-title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    /* Progress Track */
    .progress-track {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(148, 163, 184, 0.12);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 16px;
    }

    .progress-steps-row {
      display: flex;
      align-items: center;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .step-prog-item {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .step-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: var(--accent-primary, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .step-prog-item--final .step-circle {
      background: rgba(34, 197, 94, 0.2);
      border-color: #22c55e;
      color: #22c55e;
    }

    .step-prog-item--aborted .step-circle {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      color: #ef4444;
    }

    .step-info {
      display: flex;
      flex-direction: column;
    }

    .step-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    .step-action {
      font-size: 0.74rem;
      color: var(--text-secondary, #94a3b8);
    }

    /* Terminal */
    .terminal-box {
      background: #090d16;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .terminal-bar {
      background: rgba(30, 41, 59, 0.7);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }

    .term-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .term-dot--red { background: #ef4444; }
    .term-dot--yellow { background: #eab308; }
    .term-dot--green { background: #22c55e; }

    .term-title {
      margin-left: 8px;
      font-size: 0.72rem;
      color: #64748b;
      font-family: var(--font-mono, monospace);
    }

    .terminal-content {
      margin: 0;
      padding: 14px 16px;
      font-family: var(--font-mono, monospace);
      font-size: 0.82rem;
      color: #cbd5e1;
      line-height: 1.55;
      overflow-x: auto;
      max-height: 240px;
      white-space: pre-wrap;
    }

    .outcome-callout {
      margin-top: 12px;
    }

    /* Reflection Panel */
    .reflection-panel {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 8px;
    }

    .reflection-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--accent-primary, #38bdf8);
    }

    .reflection-text {
      margin: 0;
      font-size: 0.88rem;
      color: var(--text-primary, #f8fafc);
      line-height: 1.55;
    }

    @media (max-width: 800px) {
      .controls-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExpStopConditionsComponent {
  readonly scenarios: TaskScenario[] = [
    {
      id: 'sc-multistep',
      name: 'Caso D: Tarea Multi-Step (2 herramientas)',
      description: 'Requiere get_order_status ──► get_shipping_provider ──► Final Answer (3 vueltas).',
      stepsRequired: 3,
      hasFailingTool: false
    },
    {
      id: 'sc-singlestep',
      name: 'Caso A: Consulta Simple (1 herramienta)',
      description: 'Requiere get_order_status ──► Final Answer (2 vueltas).',
      stepsRequired: 2,
      hasFailingTool: false
    },
    {
      id: 'sc-looping',
      name: 'Riesgo Crítico: Herramienta en Fallo (Error 503)',
      description: 'La API externa falla repetidamente y el LLM insiste en reintentar sin parar.',
      stepsRequired: 99,
      hasFailingTool: true
    }
  ];

  readonly limitOptions = [1, 2, 3, 5];

  selectedScenario = signal<TaskScenario>(this.scenarios[0]);
  selectedMaxIterations = signal<number>(3);

  selectScenario(sc: TaskScenario): void {
    this.selectedScenario.set(sc);
  }

  setMaxIterations(lim: number): void {
    this.selectedMaxIterations.set(lim);
  }

  simResult = computed(() => {
    const sc = this.selectedScenario();
    const maxIter = this.selectedMaxIterations();

    const steps: Array<{ iterationNumber: number; actionDesc: string; isFinal: boolean; isAborted: boolean }> = [];
    let log = '';

    if (sc.id === 'sc-multistep') {
      // Step 1
      if (maxIter >= 1) {
        steps.push({ iterationNumber: 1, actionDesc: 'Tool: get_order_status', isFinal: false, isAborted: false });
        log += `[ITERATION 1] Model -> get_order_status(order_id="ORD-4091")\n[EXECUTION] Python ejecuta -> {"status": "ready_to_ship"}\n`;
      }
      // Step 2
      if (maxIter >= 2) {
        steps.push({ iterationNumber: 2, actionDesc: 'Tool: get_shipping_provider', isFinal: false, isAborted: false });
        log += `\n[ITERATION 2] Model -> get_shipping_provider(order_id="ORD-4091")\n[EXECUTION] Python ejecuta -> {"carrier": "Servientrega", "tracking": "SE-992144"}\n`;
      }
      // Step 3
      if (maxIter >= 3) {
        steps.push({ iterationNumber: 3, actionDesc: 'Final Answer', isFinal: true, isAborted: false });
        log += `\n[ITERATION 3] Model -> Final Answer (finish_reason="stop")\n"El pedido ORD-4091 se encuentra listo para despacho asignado a Servientrega..."\n`;
      }

      if (maxIter < 3) {
        steps.push({ iterationNumber: maxIter + 1, actionDesc: 'ABORT: max_iterations', isFinal: false, isAborted: true });
        log += `\n[STOPPED] Limite max_iterations=${maxIter} alcanzado. Runtime interrumpe el ciclo.`;
        return {
          badgeLabel: 'ABORTADO POR RUNTIME',
          badgeVariant: 'warning' as const,
          steps,
          terminalLog: log,
          calloutVariant: 'warning' as const,
          calloutTitle: `Límite Operacional Alcanzado (max_iterations=${maxIter})`,
          calloutMessage: `La tarea requería 3 iteraciones pero el límite en Python estaba fijado en ${maxIter}. El runtime detuvo el proceso limpiamente evitando bucles infinitos, pero la respuesta quedó incompleta.`
        };
      } else {
        return {
          badgeLabel: 'FINAL ANSWER',
          badgeVariant: 'success' as const,
          steps,
          terminalLog: log,
          calloutVariant: 'rule' as const,
          calloutTitle: 'Terminación Normal Exitosa',
          calloutMessage: 'El modelo completó ambos pasos dependientes y concluyó con finish_reason="stop" en la iteración 3, dentro del límite de seguridad establecido.'
        };
      }
    } else if (sc.id === 'sc-singlestep') {
      // Single step task
      if (maxIter >= 1) {
        steps.push({ iterationNumber: 1, actionDesc: 'Tool: get_order_status', isFinal: false, isAborted: false });
        log += `[ITERATION 1] Model -> get_order_status(order_id="ORD-4091")\n[EXECUTION] Python ejecuta -> {"status": "en_camino"}\n`;
      }
      if (maxIter >= 2) {
        steps.push({ iterationNumber: 2, actionDesc: 'Final Answer', isFinal: true, isAborted: false });
        log += `\n[ITERATION 2] Model -> Final Answer (finish_reason="stop")\n"El pedido ORD-4091 se encuentra en camino."\n`;
      }

      if (maxIter < 2) {
        steps.push({ iterationNumber: 2, actionDesc: 'ABORT: max_iterations', isFinal: false, isAborted: true });
        log += `\n[STOPPED] Limite max_iterations=${maxIter} alcanzado.`;
        return {
          badgeLabel: 'ABORTADO POR RUNTIME',
          badgeVariant: 'warning' as const,
          steps,
          terminalLog: log,
          calloutVariant: 'warning' as const,
          calloutTitle: 'Abortado por Límite de Iteraciones (1 vuelta)',
          calloutMessage: 'Incluso una tarea simple requiere al menos 2 iteraciones: una para la herramienta y otra para la síntesis final del modelo.'
        };
      } else {
        return {
          badgeLabel: 'FINAL ANSWER',
          badgeVariant: 'success' as const,
          steps,
          terminalLog: log,
          calloutVariant: 'rule' as const,
          calloutTitle: 'Terminación Normal Exitosa',
          calloutMessage: 'Tarea resuelta exitosamente en 2 vueltas (Herramienta + Respuesta Final).'
        };
      }
    } else {
      // Looping / failing scenario
      for (let i = 1; i <= maxIter; i++) {
        steps.push({ iterationNumber: i, actionDesc: 'Reintento fallido 503', isFinal: false, isAborted: false });
        log += `[ITERATION ${i}] Model -> callExternalApi()\n[EXECUTION] Python -> {"error": "503 Service Unavailable"}\n`;
      }
      steps.push({ iterationNumber: maxIter + 1, actionDesc: 'CORTE DE SEGURIDAD', isFinal: false, isAborted: true });
      log += `\n[STOPPED] LIMITE DURO ALCANZADO (max_iterations=${maxIter}). Runtime salva el sistema de bucle infinito.`;

      return {
        badgeLabel: 'SALVAGUARDA ACTIVADA',
        badgeVariant: 'error' as const,
        steps,
        terminalLog: log,
        calloutVariant: 'warning' as const,
        calloutTitle: `Salvaguarda Activa: Bucle Infinito Evitado en ${maxIter} vueltas`,
        calloutMessage: `La herramienta remota falló continuamente. El LLM continuaba reintentando. Gracias al límite estricto max_iterations=${maxIter} en Python, el runtime abortó la ejecución salvando tu tarjeta de crédito y memoria del servidor.`
      };
    }
  });
}
