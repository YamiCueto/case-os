import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type SimPhase = 'START' | 'TOOL_CALL' | 'OBSERVATION' | 'COMPLETED' | 'DISPOSED';

interface StateSnapshot {
  runId: string;
  sessionId: string;
  subjectId: string;
  iteration: number;
  messagesCount: number;
  lastObservation: string | null;
  terminationReason: string | null;
  memoryStatus: 'IN_RAM' | 'DESTROYED';
}

@Component({
  selector: 'app-exp-execution-state-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-inspector" role="region" aria-label="Simulador Execution State Inspector">
      <!-- Header -->
      <div class="exp-header">
        <div class="exp-header__title-group">
          <span class="material-symbols-outlined exp-header__icon" aria-hidden="true">data_array</span>
          <div>
            <div class="exp-header__title">Execution State Inspector</div>
            <div class="exp-header__subtitle">Ciclo de vida de la información volátil durante una ejecución agéntica</div>
          </div>
        </div>
        <div class="exp-phase-badge" [attr.data-phase]="currentPhase">
          <span class="phase-dot"></span>
          <span>{{ getPhaseLabel() }}</span>
        </div>
      </div>

      <!-- Controls & Stepper -->
      <div class="stepper-bar">
        <button
          type="button"
          class="step-btn"
          [class.step-btn--active]="currentPhase === 'START'"
          (click)="setPhase('START')"
        >
          1. Run Start
        </button>
        <button
          type="button"
          class="step-btn"
          [class.step-btn--active]="currentPhase === 'TOOL_CALL'"
          (click)="setPhase('TOOL_CALL')"
        >
          2. Tool Call
        </button>
        <button
          type="button"
          class="step-btn"
          [class.step-btn--active]="currentPhase === 'OBSERVATION'"
          (click)="setPhase('OBSERVATION')"
        >
          3. Observation
        </button>
        <button
          type="button"
          class="step-btn"
          [class.step-btn--active]="currentPhase === 'COMPLETED'"
          (click)="setPhase('COMPLETED')"
        >
          4. Loop Exit
        </button>
        <button
          type="button"
          class="step-btn step-btn--danger"
          [class.step-btn--active]="currentPhase === 'DISPOSED'"
          (click)="setPhase('DISPOSED')"
        >
          5. State Disposed
        </button>
      </div>

      <!-- Main Visualizer Grid -->
      <div class="inspector-grid">
        <!-- Panel Izquierdo: Dataclass en Memoria -->
        <div class="dataclass-card" [class.dataclass-card--disposed]="currentPhase === 'DISPOSED'">
          <div class="dataclass-card__header">
            <span class="dataclass-card__title">
              <code>ExecutionState</code> (RAM Stack)
            </span>
            <span class="status-chip" [class.status-chip--dead]="currentPhase === 'DISPOSED'">
              {{ currentPhase === 'DISPOSED' ? 'DEALLOCATED / NONE' : 'ACTIVE IN RAM' }}
            </span>
          </div>

          @if (currentPhase !== 'DISPOSED') {
            <div class="code-terminal">
              <div class="code-row"><span class="c-field">run_id</span>: <span class="c-str">"{{ snapshot.runId }}"</span></div>
              <div class="code-row"><span class="c-field">session_id</span>: <span class="c-str">"{{ snapshot.sessionId }}"</span></div>
              <div class="code-row"><span class="c-field">subject_id</span>: <span class="c-str">"{{ snapshot.subjectId }}"</span></div>
              <div class="code-row"><span class="c-field">iteration</span>: <span class="c-num">{{ snapshot.iteration }}</span></div>
              <div class="code-row"><span class="c-field">messages</span>: <span class="c-dim">[{{ snapshot.messagesCount }} turnos en contexto]</span></div>
              <div class="code-row">
                <span class="c-field">last_observation</span>:
                @if (snapshot.lastObservation) {
                  <span class="c-obj">{{ snapshot.lastObservation }}</span>
                } @else {
                  <span class="c-null">None</span>
                }
              </div>
              <div class="code-row">
                <span class="c-field">termination_reason</span>:
                @if (snapshot.terminationReason) {
                  <span class="c-str">"{{ snapshot.terminationReason }}"</span>
                } @else {
                  <span class="c-null">None</span>
                }
              </div>
            </div>
          } @else {
            <div class="disposed-view">
              <span class="material-symbols-outlined disposed-icon" aria-hidden="true">delete_sweep</span>
              <div class="disposed-title">Variable <code>state</code> fuera de alcance</div>
              <div class="disposed-desc">
                Al terminar la función, las referencias locales salen de alcance. Si ningún otro objeto conserva una referencia al <code>ExecutionState</code>, éste queda elegible para liberación/recolección. Ningún puntero conserva los mensajes ni el estado de trabajo.
              </div>
            </div>
          }
        </div>

        <!-- Panel Derecho: Explicación Operacional -->
        <div class="narrative-card">
          <div class="narrative-badge">{{ getNarrativeHeading() }}</div>
          <p class="narrative-text">{{ getNarrativeText() }}</p>

          <div class="narrative-callout">
            <span class="material-symbols-outlined callout-icon" aria-hidden="true">info</span>
            <span>{{ getNarrativeCallout() }}</span>
          </div>
        </div>
      </div>

      <!-- Quiz Diagnóstico Interactivo -->
      <div class="quiz-section">
        <div class="quiz-header">
          <span class="material-symbols-outlined quiz-icon" aria-hidden="true">psychology</span>
          <span class="quiz-title">Pregunta de Ingeniería: ¿Qué sobrevive entre turnos?</span>
        </div>
        <p class="quiz-question">
          Si el usuario pregunta a continuación: <em>"¿Y a qué transportadora fue asignado?"</em> (omitiendo el código de pedido <code>ORD-4091</code>), ¿cómo puede el agente saber a qué pedido se refiere?
        </p>

        <div class="quiz-options">
          @for (opt of quizOptions; track opt.id) {
            <button
              type="button"
              class="quiz-option-btn"
              [class.quiz-option-btn--selected]="selectedOption === opt.id"
              [class.quiz-option-btn--correct]="answered && opt.correct"
              [class.quiz-option-btn--wrong]="answered && selectedOption === opt.id && !opt.correct"
              (click)="selectOption(opt.id)"
            >
              <span class="opt-letter">{{ opt.id }}</span>
              <span class="opt-text">{{ opt.text }}</span>
            </button>
          }
        </div>

        @if (answered) {
          <div class="quiz-feedback" [class.quiz-feedback--correct]="isCorrect()" [class.quiz-feedback--wrong]="!isCorrect()">
            <div class="feedback-title">
              <span class="material-symbols-outlined" aria-hidden="true">{{ isCorrect() ? 'check_circle' : 'cancel' }}</span>
              <span>{{ isCorrect() ? 'Diagnóstico de Arquitectura Impecable' : 'Punto Ciego Detectado' }}</span>
            </div>
            <p class="feedback-desc">{{ getFeedbackText() }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .exp-inspector {
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      padding: var(--case-space-5, 20px);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .exp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
    }

    .exp-header__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .exp-header__icon {
      font-size: 1.6rem;
      color: var(--case-accent, #6366f1);
    }

    .exp-header__title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8f8f2);
    }

    .exp-header__subtitle {
      font-size: 0.8rem;
      color: var(--case-text-muted, #71717a);
    }

    .exp-phase-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      font-size: 0.75rem;
      font-family: var(--case-font-mono, monospace);
      color: var(--case-color-info, #38bdf8);
    }

    .phase-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--case-color-info, #38bdf8);
      box-shadow: 0 0 6px var(--case-color-info, #38bdf8);
    }

    .stepper-bar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .step-btn {
      flex: 1;
      min-width: 100px;
      padding: 8px 12px;
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      color: var(--case-text-secondary, #a1a1aa);
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .step-btn:hover {
      background: var(--case-surface-3, #21222c);
      color: var(--case-text-primary, #ffffff);
    }

    .step-btn--active {
      background: var(--case-accent-subtle, rgba(99, 102, 241, 0.15));
      border-color: var(--case-accent, #6366f1);
      color: var(--case-accent, #6366f1);
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.2);
    }

    .step-btn--danger.step-btn--active {
      background: rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
      color: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
    }

    .inspector-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;
    }

    @media (max-width: 850px) {
      .inspector-grid {
        grid-template-columns: 1fr;
      }
    }

    .dataclass-card {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 220px;
      transition: all 0.3s ease;
    }

    .dataclass-card--disposed {
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.04);
    }

    .dataclass-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
      padding-bottom: 8px;
    }

    .dataclass-card__title code {
      color: var(--case-color-info, #38bdf8);
      font-size: 0.85rem;
    }

    .status-chip {
      font-size: 0.68rem;
      font-family: var(--case-font-mono, monospace);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-chip--dead {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .code-terminal {
      font-family: var(--case-font-mono, monospace);
      font-size: 0.8rem;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .c-field { color: #f8f8f2; font-weight: 600; }
    .c-str { color: #f1fa8c; }
    .c-num { color: #bd93f9; }
    .c-dim { color: #6272a4; }
    .c-obj { color: #50fa7b; }
    .c-null { color: #ff5555; }

    .disposed-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px 16px;
      gap: 10px;
    }

    .disposed-icon {
      font-size: 2.4rem;
      color: #ef4444;
    }

    .disposed-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #ef4444;
    }

    .disposed-desc {
      font-size: 0.78rem;
      color: var(--case-text-muted, #71717a);
      max-width: 360px;
      line-height: 1.4;
    }

    .narrative-card {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
    }

    .narrative-badge {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--case-accent, #6366f1);
    }

    .narrative-text {
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--case-text-secondary, #a1a1aa);
      margin: 0;
    }

    .narrative-callout {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--case-surface-1, #13141c);
      border-left: 3px solid var(--case-accent, #6366f1);
      border-radius: 4px;
      font-size: 0.78rem;
      color: var(--case-text-muted, #71717a);
      line-height: 1.4;
    }

    .callout-icon {
      font-size: 1.1rem;
      color: var(--case-accent, #6366f1);
      flex-shrink: 0;
    }

    .quiz-section {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .quiz-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .quiz-icon {
      color: var(--case-color-warning, #f59e0b);
      font-size: 1.3rem;
    }

    .quiz-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--case-text-primary, #ffffff);
    }

    .quiz-question {
      font-size: 0.85rem;
      color: var(--case-text-secondary, #a1a1aa);
      margin: 0;
      line-height: 1.4;
    }

    .quiz-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quiz-option-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 6px;
      color: var(--case-text-secondary, #a1a1aa);
      text-align: left;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .quiz-option-btn:hover {
      background: var(--case-surface-3, #21222c);
      color: var(--case-text-primary, #ffffff);
    }

    .quiz-option-btn--selected {
      border-color: var(--case-accent, #6366f1);
      background: rgba(99, 102, 241, 0.1);
      color: #ffffff;
    }

    .quiz-option-btn--correct {
      border-color: #10b981 !important;
      background: rgba(16, 185, 129, 0.15) !important;
      color: #10b981 !important;
    }

    .quiz-option-btn--wrong {
      border-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.15) !important;
      color: #ef4444 !important;
    }

    .opt-letter {
      font-family: var(--case-font-mono, monospace);
      font-weight: 700;
      font-size: 0.85rem;
      padding: 2px 6px;
      background: var(--case-surface-2, #181920);
      border-radius: 4px;
      border: 1px solid var(--case-border, #282a36);
    }

    .quiz-feedback {
      padding: 12px 14px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .quiz-feedback--correct {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
    }

    .quiz-feedback--wrong {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .feedback-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .feedback-desc {
      font-size: 0.8rem;
      margin: 0;
      color: var(--case-text-secondary, #a1a1aa);
      line-height: 1.4;
    }
  `]
})
export class ExpExecutionStateInspectorComponent {
  currentPhase: SimPhase = 'START';
  selectedOption: string | null = null;
  answered = false;

  readonly snapshot: StateSnapshot = {
    runId: 'run_94b1f6a',
    sessionId: 'sess_order_desk_01',
    subjectId: 'USR-101',
    iteration: 0,
    messagesCount: 1,
    lastObservation: null,
    terminationReason: null,
    memoryStatus: 'IN_RAM'
  };

  readonly quizOptions = [
    {
      id: 'A',
      text: 'El historial se conserva porque el modelo de lenguaje retiene los datos en su memoria interna permanente.',
      correct: false
    },
    {
      id: 'B',
      text: 'Ninguna información sobrevive en memoria RAM salvo que el runtime la transfiera deliberadamente a un MemoryStore.',
      correct: true
    },
    {
      id: 'C',
      text: 'Python preserva automáticamente las variables locales entre distintas ejecuciones de run_agent_v2().',
      correct: false
    }
  ];

  setPhase(phase: SimPhase): void {
    this.currentPhase = phase;
    switch (phase) {
      case 'START':
        this.snapshot.iteration = 0;
        this.snapshot.messagesCount = 1;
        this.snapshot.lastObservation = null;
        this.snapshot.terminationReason = null;
        this.snapshot.memoryStatus = 'IN_RAM';
        break;
      case 'TOOL_CALL':
        this.snapshot.iteration = 1;
        this.snapshot.messagesCount = 2;
        this.snapshot.lastObservation = null;
        this.snapshot.terminationReason = null;
        this.snapshot.memoryStatus = 'IN_RAM';
        break;
      case 'OBSERVATION':
        this.snapshot.iteration = 1;
        this.snapshot.messagesCount = 3;
        this.snapshot.lastObservation = '{"status": "ready_to_ship", "order_id": "ORD-4091"}';
        this.snapshot.terminationReason = null;
        this.snapshot.memoryStatus = 'IN_RAM';
        break;
      case 'COMPLETED':
        this.snapshot.iteration = 2;
        this.snapshot.messagesCount = 5;
        this.snapshot.lastObservation = '{"carrier": "DHL", "tracking": "TRK-901"}';
        this.snapshot.terminationReason = 'final_answer';
        this.snapshot.memoryStatus = 'IN_RAM';
        break;
      case 'DISPOSED':
        this.snapshot.memoryStatus = 'DESTROYED';
        break;
    }
  }

  getPhaseLabel(): string {
    switch (this.currentPhase) {
      case 'START': return 'Fase 1: State Asignado en RAM';
      case 'TOOL_CALL': return 'Fase 2: Modelo propone herramienta';
      case 'OBSERVATION': return 'Fase 3: Observación alimentada a messages';
      case 'COMPLETED': return 'Fase 4: Meta completada en runtime';
      case 'DISPOSED': return 'Fase 5: Fin de ámbito (Referencias liberadas)';
    }
  }

  getNarrativeHeading(): string {
    switch (this.currentPhase) {
      case 'START': return 'Paso 1: Asignación de ExecutionState';
      case 'TOOL_CALL': return 'Paso 2: Inferencia del Modelo';
      case 'OBSERVATION': return 'Paso 3: Mutación del Estado Local';
      case 'COMPLETED': return 'Paso 4: Término de la Ejecución';
      case 'DISPOSED': return 'Paso 5: Ámbito Local Concluido';
    }
  }

  getNarrativeText(): string {
    switch (this.currentPhase) {
      case 'START':
        return 'Al invocar el agente, se crea un objeto ExecutionState con un run_id único y los identificadores de session_id y subject_id. Este estado vive únicamente en el frame local de la función.';
      case 'TOOL_CALL':
        return 'El modelo evalúa la consulta inicial y emite un ToolCall. El runtime incrementa iteration=1 y anexa la propuesta estructurada al arreglo messages.';
      case 'OBSERVATION':
        return 'La CPU ejecuta la función Python y el resultado se inyecta como mensaje de rol "tool". La propiedad last_observation se actualiza para la siguiente decisión.';
      case 'COMPLETED':
        return 'El modelo genera la síntesis final tras observar los resultados. Se fija termination_reason="final_answer" y el bucle while concluye exitosamente.';
      case 'DISPOSED':
        return 'Al retornar la función, las referencias locales salen de alcance. Si ningún otro objeto conserva una referencia al ExecutionState, éste queda elegible para liberación/recolección. Si el usuario envía otro mensaje en 5 segundos, el agente no recordará el pedido sin un MemoryStore.';
    }
  }

  getNarrativeCallout(): string {
    switch (this.currentPhase) {
      case 'START': return 'run_id correlaciona esta ejecución puntual; subject_id determina el propietario.';
      case 'TOOL_CALL': return 'El modelo propone texto; el software decide qué variables de estado mutan.';
      case 'OBSERVATION': return 'El contexto crece con cada vuelta; messages acumula entradas y salidas.';
      case 'COMPLETED': return 'El agente resolvió la meta, pero su historial sigue cautivo en una variable efímera.';
      case 'DISPOSED': return 'Principio L04: Execution State es transitorio; para sobrevivir necesita un MemoryStore.';
    }
  }

  selectOption(id: string): void {
    this.selectedOption = id;
    this.answered = true;
  }

  isCorrect(): boolean {
    return this.selectedOption === 'B';
  }

  getFeedbackText(): string {
    if (this.isCorrect()) {
      return 'Exacto. En software soberano, el modelo no conserva memoria biológica ni bases de datos ocultas. Si queremos que el agente recuerde el identificador entre turnos, el runtime debe extraer explícitamente esa entidad y guardarla en un MemoryStore indexado por session_id y subject_id.';
    }
    return 'Respuesta incorrecta. Ni el LLM retiene memoria permanente entre llamadas desconectadas, ni Python conserva variables locales de funciones que ya retornaron. Solo un sistema explícito de MemoryStore gestionado por el backend puede proporcionar continuidad.';
  }
}
