import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CasePanelComponent,
  CaseCalloutComponent,
  CaseBadgeComponent
} from '../../../../../../core/ui/components';

interface DiagnosisOption {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

@Component({
  selector: 'app-exp-why-agent-v1-stops',
  standalone: true,
  imports: [
    CommonModule,
    CasePanelComponent,
    CaseCalloutComponent,
    CaseBadgeComponent
  ],
  template: `
    <div class="exp-container" role="region" aria-label="Diagnóstico interactivo: Por qué se detiene Agent v1">
      <div class="exp-header">
        <div class="exp-badge-row">
          <case-badge variant="accent" [mono]="true" [dot]="true">EXPERIENCIA 01</case-badge>
          <span class="exp-tag">Problema Detonante</span>
        </div>
        <h3 class="exp-title">El Límite de Agent v1: ¿Por Qué se Detiene a Mitad de Camino?</h3>
        <p class="exp-subtitle">
          Analiza qué ocurre cuando un usuario formula una solicitud compuesta de dos pasos dependientes frente a la arquitectura lineal de Agent v1.
        </p>
      </div>

      <!-- User Query Card -->
      <case-panel [elevation]="1" padding="md" class="query-card">
        <div class="query-header">
          <span class="material-symbols-outlined query-icon" aria-hidden="true">chat</span>
          <span class="query-label">Solicitud Compuesta del Usuario:</span>
        </div>
        <blockquote class="query-text">
          "Consulta el estado del pedido <strong>ORD-4091</strong> y, si está listo para despacho, consulta qué transportadora tiene asignada."
        </blockquote>
      </case-panel>

      <!-- Visual Execution Flow of Agent v1 -->
      <div class="trace-timeline" aria-label="Línea de tiempo de ejecución en Agent v1">

        <!-- Step 1 -->
        <div class="trace-step trace-step--success">
          <div class="step-badge">1</div>
          <div class="step-card">
            <div class="step-header">
              <span class="step-entity step-entity--model">MODEL (Inferencia 1)</span>
              <case-badge variant="success" [mono]="true">tool_calls</case-badge>
            </div>
            <div class="step-body">
              <code>get_order_status(order_id="ORD-4091")</code>
              <p class="step-note">El LLM evalúa los schemas disponibles y solicita la herramienta de consulta de orden.</p>
            </div>
          </div>
        </div>

        <div class="step-arrow" aria-hidden="true">↓</div>

        <!-- Step 2 -->
        <div class="trace-step trace-step--success">
          <div class="step-badge">2</div>
          <div class="step-card">
            <div class="step-header">
              <span class="step-entity step-entity--runtime">PYTHON RUNTIME</span>
              <case-badge variant="default" [mono]="true">ejecución local</case-badge>
            </div>
            <div class="step-body">
              <code>Observation: {{ '{"status": "ready_to_ship", "carrier_id": "CARRIER-SERV"}' }}</code>
              <p class="step-note">Python ejecuta la función real en CPU y anexa la observación al historial de mensajes.</p>
            </div>
          </div>
        </div>

        <div class="step-arrow" aria-hidden="true">↓</div>

        <!-- Step 3 -->
        <div class="trace-step trace-step--success">
          <div class="step-badge">3</div>
          <div class="step-card">
            <div class="step-header">
              <span class="step-entity step-entity--model">MODEL (Inferencia 2)</span>
              <case-badge variant="success" [mono]="true">tool_calls</case-badge>
            </div>
            <div class="step-body">
              <code>get_shipping_provider(order_id="ORD-4091")</code>
              <p class="step-note">El modelo lee que el estado es <em>"ready_to_ship"</em> y deduce que debe llamar a la segunda herramienta.</p>
            </div>
          </div>
        </div>

        <div class="step-arrow step-arrow--break" aria-hidden="true">✕</div>

        <!-- Step 4: The Breakpoint -->
        <div class="trace-step trace-step--broken">
          <div class="step-badge step-badge--error">!</div>
          <div class="step-card step-card--broken">
            <div class="step-header">
              <span class="step-entity step-entity--runtime">PYTHON RUNTIME (Agent v1)</span>
              <case-badge variant="error" [mono]="true">COLAPSO LINEAL</case-badge>
            </div>
            <div class="step-body">
              <div class="code-fault">
                <span class="code-line code-line--dim"># Código real de run_agent_v1():</span>
                <span class="code-line">second_response = provider.generate(messages=messages, tools=TOOLS_SCHEMAS)</span>
                <span class="code-line code-line--fault">return second_response.content or ""  # ◄── ¡Es None! Se detiene aquí.</span>
              </div>
              <p class="step-error-desc">
                Agent v1 asumió que la segunda llamada siempre devolvería texto final en <code>content</code>. Al recibir otro <code>ToolCall</code>, el runtime no tiene código para despacharlo ni para volver a llamar al modelo.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Interactive Diagnostic Quiz -->
      <case-panel [elevation]="2" padding="lg" class="diagnostic-panel">
        <h4 class="diagnostic-title">
          <span class="material-symbols-outlined" aria-hidden="true">psychology_alt</span>
          Pregunta de Diagnóstico Arquitectónico: ¿Dónde está la causa raíz del problema?
        </h4>
        <p class="diagnostic-prompt">
          Selecciona la opción que explica con precisión por qué la solicitud no pudo completarse:
        </p>

        <div class="options-grid">
          @for (opt of options; track opt.id) {
            <button
              type="button"
              class="option-btn"
              [class.option-btn--selected]="selectedOption()?.id === opt.id"
              [class.option-btn--correct]="selectedOption()?.id === opt.id && opt.isCorrect"
              [class.option-btn--incorrect]="selectedOption()?.id === opt.id && !opt.isCorrect"
              (click)="selectOption(opt)"
              [attr.aria-pressed]="selectedOption()?.id === opt.id"
            >
              <span class="option-letter">{{ opt.letter }}</span>
              <span class="option-text">{{ opt.text }}</span>
            </button>
          }
        </div>

        @if (selectedOption()) {
          <div class="feedback-area" role="alert" aria-live="polite">
            <case-callout
              [variant]="selectedOption()!.isCorrect ? 'rule' : 'warning'"
              [title]="selectedOption()!.isCorrect ? '¡Diagnóstico de Ingeniería Correcto!' : 'Diagnóstico Impreciso'"
              [message]="selectedOption()!.explanation"
            />
          </div>
        }
      </case-panel>

      <!-- Key Engineering Takeaway -->
      <div class="takeaway-banner">
        <div class="takeaway-icon">
          <span class="material-symbols-outlined" aria-hidden="true">lightbulb</span>
        </div>
        <div class="takeaway-content">
          <h5 class="takeaway-title">Axioma Central de L03</h5>
          <p class="takeaway-text">
            <strong>El modelo no falló.</strong> El modelo actuó con impecable precisión al proponer la segunda tool.
            <strong>El software falló porque el runtime no sabe continuar.</strong> Para resolver tareas multi-step dependientes, el runtime debe gobernar un <em>Agent Loop</em>.
          </p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 24px 0;
      font-family: inherit;
    }

    .exp-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
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

    .query-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
    }

    .query-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: var(--accent-primary, #38bdf8);
      font-weight: 600;
      font-size: 0.85rem;
    }

    .query-icon {
      font-size: 1.1rem;
    }

    .query-text {
      margin: 0;
      font-size: 1.05rem;
      color: var(--text-primary, #f8fafc);
      line-height: 1.6;
      font-style: italic;
      border-left: 3px solid var(--accent-primary, #38bdf8);
      padding-left: 14px;
    }

    /* Trace Timeline */
    .trace-timeline {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .trace-step {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      width: 100%;
    }

    .step-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent-primary, #38bdf8);
      border: 1px solid rgba(56, 189, 248, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
      margin-top: 6px;
    }

    .step-badge--error {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.5);
    }

    .step-card {
      flex: 1;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .step-card--broken {
      border: 1px solid rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.05);
    }

    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .step-entity {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .step-entity--model {
      color: #38bdf8;
    }

    .step-entity--runtime {
      color: #a78bfa;
    }

    .step-body code {
      font-family: var(--font-mono, monospace);
      font-size: 0.875rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 3px 8px;
      border-radius: 4px;
      color: #f1f5f9;
      display: inline-block;
      margin-bottom: 4px;
    }

    .step-note {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary, #94a3b8);
      line-height: 1.4;
    }

    .step-arrow {
      font-size: 1.25rem;
      color: var(--text-tertiary, #64748b);
      line-height: 1;
    }

    .step-arrow--break {
      color: #ef4444;
      font-weight: bold;
      font-size: 1.5rem;
    }

    .code-fault {
      display: flex;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.45);
      padding: 10px 14px;
      border-radius: 6px;
      border-left: 3px solid #ef4444;
      font-family: var(--font-mono, monospace);
      font-size: 0.82rem;
      gap: 4px;
      overflow-x: auto;
    }

    .code-line--dim {
      color: #64748b;
    }

    .code-line--fault {
      color: #fca5a5;
      font-weight: 600;
    }

    .step-error-desc {
      margin: 6px 0 0 0;
      font-size: 0.85rem;
      color: #f87171;
      line-height: 1.45;
    }

    /* Diagnostic Quiz Panel */
    .diagnostic-panel {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 10px;
    }

    .diagnostic-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 8px 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    .diagnostic-title .material-symbols-outlined {
      color: var(--accent-primary, #38bdf8);
    }

    .diagnostic-prompt {
      margin: 0 0 16px 0;
      font-size: 0.9rem;
      color: var(--text-secondary, #94a3b8);
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .option-btn {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 8px;
      color: var(--text-primary, #f8fafc);
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      font-size: 0.9rem;
      line-height: 1.45;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      background: rgba(51, 65, 85, 0.6);
      border-color: rgba(56, 189, 248, 0.4);
    }

    .option-letter {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(148, 163, 184, 0.15);
      color: var(--text-primary, #f8fafc);
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .option-btn--selected {
      border-color: var(--accent-primary, #38bdf8);
      background: rgba(56, 189, 248, 0.1);
    }

    .option-btn--correct {
      border-color: #22c55e !important;
      background: rgba(34, 197, 94, 0.12) !important;
    }

    .option-btn--correct .option-letter {
      background: #22c55e;
      color: #0f172a;
    }

    .option-btn--incorrect {
      border-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.12) !important;
    }

    .option-btn--incorrect .option-letter {
      background: #ef4444;
      color: #ffffff;
    }

    .feedback-area {
      margin-top: 16px;
    }

    /* Takeaway Banner */
    .takeaway-banner {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 8px;
    }

    .takeaway-icon {
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    .takeaway-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .takeaway-title {
      margin: 0;
      font-size: 0.92rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .takeaway-text {
      margin: 0;
      font-size: 0.92rem;
      color: var(--text-primary, #f8fafc);
      line-height: 1.55;
    }

    @media (max-width: 640px) {
      .trace-step {
        gap: 10px;
      }
      .step-badge {
        width: 26px;
        height: 26px;
        font-size: 0.75rem;
      }
      .step-card {
        padding: 10px 12px;
      }
    }
  `]
})
export class ExpWhyAgentV1StopsComponent {
  readonly options: DiagnosisOption[] = [
    {
      id: 'opt-a',
      letter: 'A',
      text: 'Tool A falló o arrojó un error que impidió continuar la ejecución.',
      isCorrect: false,
      explanation: 'Incorrecto. Tool A (get_order_status) se ejecutó en Python con total éxito y devolvió {"status": "ready_to_ship", "carrier_id": "CARRIER-SERV"}. La herramienta funcionó perfectamente.'
    },
    {
      id: 'opt-b',
      letter: 'B',
      text: 'El modelo de lenguaje no sabe usar tools complejas y se confundió.',
      isCorrect: false,
      explanation: 'Incorrecto. El modelo leyó que el estado era "ready_to_ship" y dedujo exactamente la siguiente acción lógica: solicitar get_shipping_provider(order_id="ORD-4091"). El modelo tomó la decisión correcta.'
    },
    {
      id: 'opt-c',
      letter: 'C',
      text: 'Falta un Tool Schema o una descripción en el prompt del sistema.',
      isCorrect: false,
      explanation: 'Incorrecto. Los schemas de ambas herramientas están declarados en TOOLS_SCHEMAS. El modelo conocía la herramienta y emitió los parámetros con la sintaxis exacta.'
    },
    {
      id: 'opt-d',
      letter: 'D',
      text: 'El runtime dejó de procesar decisiones: esperaba texto final en vez de otra tool.',
      isCorrect: true,
      explanation: '¡Exacto! En L02 programamos run_agent_v1() asumiendo que la segunda inferencia siempre contendría la respuesta final en lenguaje natural. Cuando el modelo devolvió otro ToolCall para consultar la transportadora, el runtime simplemente leyó second_response.content (que era nulo) y finalizó. El modelo no falló: el runtime no sabe continuar.'
    }
  ];

  selectedOption = signal<DiagnosisOption | null>(null);

  selectOption(option: DiagnosisOption): void {
    this.selectedOption.set(option);
  }
}
