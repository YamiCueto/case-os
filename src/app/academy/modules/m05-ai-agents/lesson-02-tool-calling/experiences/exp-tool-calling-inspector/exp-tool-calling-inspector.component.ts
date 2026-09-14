import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaseButtonComponent,
  CaseBadgeComponent,
  CasePanelComponent
} from '../../../../../../core/ui/components';

export type StepPhase =
  | 'user'
  | 'model_reasoning'
  | 'tool_selected'
  | 'arguments'
  | 'execution'
  | 'tool_result'
  | 'model_response';

export interface StepInfo {
  phase: StepPhase;
  label: string;
  icon: string;
  owner: 'USER' | 'MODEL' | 'PYTHON RUNTIME';
  ownerType: 'user' | 'model' | 'runtime';
  title: string;
  description: string;
  payloadType: string;
  payloadContent: string;
  insight: string;
}

export interface Scenario {
  id: string;
  name: string;
  badge: string;
  userInput: string;
  hasToolCall: boolean;
  steps: StepInfo[];
}

@Component({
  selector: 'app-exp-tool-calling-inspector',
  standalone: true,
  imports: [
    CommonModule,
    CaseButtonComponent,
    CaseBadgeComponent,
    CasePanelComponent
  ],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <div class="header-badges">
          <case-badge variant="accent">Experiencia Central</case-badge>
          <case-badge variant="info">Inspección de 7 Fases</case-badge>
        </div>
        <h3 class="exp-title">Tool Calling Inspector: El Ciclo de 7 Fases</h3>
        <p class="exp-subtitle">
          Inspecciona paso a paso la frontera entre el modelo probabilístico y tu runtime determinista en Python. Comprueba cómo el LLM propone la llamada mientras tu código conserva el control total de ejecución.
        </p>
      </div>

      <!-- Scenario Selector -->
      <div class="scenarios-bar">
        <span class="bar-label">Escenario a simular:</span>
        <div class="scenario-chips">
          @for (s of scenarios; track s.id) {
            <case-button
              [variant]="selectedScenarioId() === s.id ? 'primary' : 'secondary'"
              size="sm"
              (click)="selectScenario(s.id)">
              {{ s.name }}
            </case-button>
          }
        </div>
      </div>

      <!-- User Query Display -->
      <div class="user-query-card">
        <div class="query-header">
          <span class="material-symbols-outlined query-icon" aria-hidden="true">chat</span>
          <span class="query-label">Prompt del Usuario en {{ currentScenario().name }}:</span>
        </div>
        <div class="query-text">
          "{{ currentScenario().userInput }}"
        </div>
      </div>

      <!-- 7-Phase Pipeline Stepper -->
      <div class="pipeline-stepper" role="tablist" aria-label="Fases del flujo de Tool Calling">
        @for (step of currentScenario().steps; track step.phase; let idx = $index) {
          <button
            type="button"
            role="tab"
            class="step-node"
            [class.step-node--active]="currentStepIndex() === idx"
            [class.step-node--passed]="currentStepIndex() > idx"
            [attr.aria-selected]="currentStepIndex() === idx"
            (click)="goToStep(idx)">
            <div class="step-icon-circle">
              <span class="material-symbols-outlined" aria-hidden="true">{{ step.icon }}</span>
            </div>
            <span class="step-num">{{ idx + 1 }}</span>
            <span class="step-name">{{ step.label }}</span>
          </button>
          @if (idx < currentScenario().steps.length - 1) {
            <div
              class="step-connector"
              [class.step-connector--active]="currentStepIndex() > idx">
            </div>
          }
        }
      </div>

      <!-- Active Phase Inspector Detail -->
      <case-panel [elevation]="2" padding="md" class="inspector-card">
        <div class="phase-meta-bar">
          <div class="phase-info">
            <span class="phase-order">Fase {{ currentStepIndex() + 1 }} de {{ currentScenario().steps.length }}</span>
            <h4 class="phase-title">{{ currentStep().title }}</h4>
          </div>
          <div class="owner-pill" [class]="'owner-pill--' + currentStep().ownerType">
            <span class="owner-dot"></span>
            <span>Control: <strong>{{ currentStep().owner }}</strong></span>
          </div>
        </div>

        <p class="phase-desc">{{ currentStep().description }}</p>

        <!-- Payload Inspector -->
        <div class="payload-box">
          <div class="payload-bar">
            <span class="payload-type">{{ currentStep().payloadType }}</span>
            <span class="payload-status">
              @if (currentStep().ownerType === 'runtime') {
                <span class="status-runtime">Ejecutando en CPU local</span>
              } @else if (currentStep().ownerType === 'model') {
                <span class="status-model">Inferencia probabilística</span>
              } @else {
                <span class="status-user">Entrada del cliente</span>
              }
            </span>
          </div>
          <pre class="payload-pre"><code>{{ currentStep().payloadContent }}</code></pre>
        </div>

        <!-- Architectural Insight Callout -->
        <div class="insight-box">
          <span class="material-symbols-outlined insight-icon" aria-hidden="true">lightbulb</span>
          <div class="insight-content">
            <strong>Insight de Arquitectura:</strong> {{ currentStep().insight }}
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="controls-bar">
          <div class="step-quick-status">
            Paso <strong>{{ currentStepIndex() + 1 }}</strong>/{{ currentScenario().steps.length }}: {{ currentStep().label }}
          </div>
          <div class="control-buttons">
            <case-button
              variant="secondary"
              size="sm"
              [disabled]="currentStepIndex() === 0"
              (click)="prevStep()">
              ← Anterior
            </case-button>
            <case-button
              variant="secondary"
              size="sm"
              (click)="resetSteps()">
              Reiniciar
            </case-button>
            <case-button
              variant="primary"
              size="sm"
              [disabled]="currentStepIndex() === currentScenario().steps.length - 1"
              (click)="nextStep()">
              Siguiente →
            </case-button>
          </div>
        </div>
      </case-panel>
    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-5);
      padding: var(--case-space-6);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }

    .exp-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .header-badges {
      display: flex;
      gap: 8px;
    }

    .exp-title {
      margin: 4px 0 0 0;
      color: var(--case-text-primary);
      font-size: 1.3rem;
    }

    .exp-subtitle {
      margin: 0;
      color: var(--case-text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .scenarios-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 10px 14px;
      background: var(--case-surface-1);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
    }

    .bar-label {
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--case-text-secondary);
      text-transform: uppercase;
    }

    .scenario-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .user-query-card {
      background: var(--case-surface-1);
      border: 1px solid var(--case-border);
      border-left: 4px solid var(--case-accent);
      border-radius: var(--case-radius-md);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .query-header {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--case-text-secondary);
      font-size: 0.8rem;
      font-family: var(--case-font-mono);
      text-transform: uppercase;
    }

    .query-icon {
      font-size: 1rem;
      color: var(--case-accent);
    }

    .query-text {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--case-text-primary);
      font-style: italic;
    }

    /* Pipeline Stepper */
    .pipeline-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      overflow-x: auto;
      padding: 12px 4px;
      gap: 4px;
    }

    .step-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--case-radius);
      transition: transform 0.2s ease, opacity 0.2s ease;
      color: var(--case-text-disabled);
      min-width: 80px;
    }

    .step-node:hover {
      color: var(--case-text-secondary);
      transform: translateY(-2px);
    }

    .step-node--passed {
      color: var(--case-color-success);
    }

    .step-node--active {
      color: var(--case-accent);
      transform: scale(1.08);
    }

    .step-icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--case-surface-1);
      border: 2px solid currentColor;
      transition: all 0.2s ease;
    }

    .step-node--active .step-icon-circle {
      background: var(--case-accent-subtle);
      box-shadow: 0 0 12px var(--case-accent-subtle);
    }

    .step-num {
      font-size: 0.7rem;
      font-family: var(--case-font-mono);
      font-weight: 700;
      opacity: 0.8;
    }

    .step-name {
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: var(--case-border-strong);
      margin-bottom: 24px;
      min-width: 16px;
      transition: background 0.3s ease;
    }

    .step-connector--active {
      background: var(--case-color-success);
    }

    /* Inspector Card */
    .inspector-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--case-surface-1);
    }

    .phase-meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--case-border);
    }

    .phase-order {
      font-family: var(--case-font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--case-text-muted);
    }

    .phase-title {
      margin: 2px 0 0 0;
      font-size: 1.15rem;
      color: var(--case-text-primary);
    }

    .owner-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--case-radius-full);
      font-size: 0.8rem;
      font-family: var(--case-font-mono);
      border: 1px solid var(--case-border);
    }

    .owner-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .owner-pill--user {
      background: var(--case-surface-2);
      color: var(--case-text-primary);
    }
    .owner-pill--user .owner-dot { background: var(--case-text-secondary); }

    .owner-pill--model {
      background: var(--case-color-info-bg);
      border-color: var(--case-color-info);
      color: var(--case-color-info);
    }
    .owner-pill--model .owner-dot { background: var(--case-color-info); }

    .owner-pill--runtime {
      background: var(--case-color-success-bg);
      border-color: var(--case-color-success);
      color: var(--case-color-success);
    }
    .owner-pill--runtime .owner-dot { background: var(--case-color-success); }

    .phase-desc {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--case-text-secondary);
    }

    /* Payload Box */
    .payload-box {
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      overflow: hidden;
    }

    .payload-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 14px;
      background: var(--case-surface-3);
      border-bottom: 1px solid var(--case-border);
    }

    .payload-type {
      font-family: var(--case-font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--case-accent);
      text-transform: uppercase;
    }

    .payload-status {
      font-size: 0.75rem;
      font-family: var(--case-font-mono);
    }

    .status-runtime { color: var(--case-color-success); font-weight: 600; }
    .status-model { color: var(--case-color-info); font-weight: 600; }
    .status-user { color: var(--case-text-secondary); }

    .payload-pre {
      margin: 0;
      padding: 14px;
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--case-text-primary);
      overflow-x: auto;
      max-height: 260px;
    }

    /* Insight Box */
    .insight-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: var(--case-color-info-bg);
      border-left: 4px solid var(--case-color-info);
      border-radius: var(--case-radius);
      font-size: 0.9rem;
      line-height: 1.45;
      color: var(--case-text-primary);
    }

    .insight-icon {
      color: var(--case-color-info);
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--case-border);
    }

    .step-quick-status {
      font-size: 0.85rem;
      color: var(--case-text-secondary);
      font-family: var(--case-font-mono);
    }

    .control-buttons {
      display: flex;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .pipeline-stepper {
        justify-content: flex-start;
      }
      .step-node {
        min-width: 70px;
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
export class ExpToolCallingInspectorComponent {
  selectedScenarioId = signal<string>('scenario_order');
  currentStepIndex = signal<number>(0);

  readonly scenarios: Scenario[] = [
    {
      id: 'scenario_order',
      name: '1. Consulta de Pedido (Read-Only)',
      badge: 'Read Tool',
      userInput: '¿Dónde está mi pedido ORD-4091? Lo necesito hoy.',
      hasToolCall: true,
      steps: [
        {
          phase: 'user',
          label: 'USER',
          icon: 'person',
          owner: 'USER',
          ownerType: 'user',
          title: 'Paso 1: Emisión de la Petición',
          description: 'El usuario envía su mensaje en lenguaje natural solicitando información no estática.',
          payloadType: 'Prompt Entrante',
          payloadContent: `messages = [\n  {"role": "user", "content": "¿Dónde está mi pedido ORD-4091? Lo necesito hoy."}\n]`,
          insight: 'El modelo no tiene acceso a bases de datos ni información en tiempo real sin una llamada externa.'
        },
        {
          phase: 'model_reasoning',
          label: 'MODEL',
          icon: 'psychology',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 2: Evaluación Probabilística con Schemas',
          description: 'El modelo recibe la conversación junto con la lista de herramientas disponibles (tools). Determina que responder texto libre tendría menor probabilidad que invocar get_order_status.',
          payloadType: 'Petición enviada al LLM',
          payloadContent: `tools = [\n  {\n    "type": "function",\n    "function": {\n      "name": "get_order_status",\n      "description": "Consulta el estado logístico de un pedido ORD-XXXX",\n      "parameters": {"type": "object", "properties": {"order_id": {"type": "string"}}, "required": ["order_id"]}\n    }\n  }\n]\nresponse = client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)`,
          insight: 'El LLM nunca recibe punteros a funciones ni sockets de red. Solo recibe JSON Schemas declarativos.'
        },
        {
          phase: 'tool_selected',
          label: 'TOOL SELECTED',
          icon: 'check_box',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 3: Selección de Herramienta por el Modelo',
          description: 'El modelo emite un stop token especial y genera una estructura tool_calls indicando qué herramienta desea que el software invoque.',
          payloadType: 'Respuesta Estructurada del Modelo',
          payloadContent: `tool_call = response.choices[0].message.tool_calls[0]\n# tool_call.id = "call_99ax1"\n# tool_call.function.name = "get_order_status"`,
          insight: 'El LLM no ejecutó la función: simplemente generó el nombre de la función como token estructurado.'
        },
        {
          phase: 'arguments',
          label: 'ARGUMENTS',
          icon: 'data_object',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 4: Construcción de Argumentos en JSON',
          description: 'El modelo serializa los argumentos requeridos siguiendo el JSON Schema de la herramienta seleccionada.',
          payloadType: 'Argumentos Generados por el LLM',
          payloadContent: `tool_call.function.arguments = '{"order_id": "ORD-4091"}'\n\n# En Python:\nargs = json.loads(tool_call.function.arguments)\nassert "order_id" in args`,
          insight: 'Los argumentos generados por el LLM son texto sin validar hasta que tu código los analiza y comprueba.'
        },
        {
          phase: 'execution',
          label: 'EXECUTION',
          icon: 'terminal',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 5: Ejecución Controlada en Runtime Python',
          description: '¡Frontera Crítica! El modelo entra en pausa. Tu código local intercepta tool_call, valida los parámetros y ejecuta la función real con acceso a PostgreSQL o APIs.',
          payloadType: 'Ejecución en Proceso Python',
          payloadContent: `tool_name = tool_call.function.name\nif tool_name == "get_order_status":\n    # Ejecución determinista en CPU local / Base de Datos:\n    raw_result = get_order_status(order_id=args["order_id"])`,
          insight: 'Tu aplicación es la soberana de la ejecución. Si la orden no pertenece al usuario o el ID es malicioso, Python rechaza la acción.'
        },
        {
          phase: 'tool_result',
          label: 'TOOL RESULT',
          icon: 'output',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 6: Inyección de la Observación (Tool Message)',
          description: 'El runtime empaqueta la salida de la función en un mensaje con role: "tool" y el tool_call_id correspondiente.',
          payloadType: 'Mensaje de Observación (Role: Tool)',
          payloadContent: `tool_message = {\n  "role": "tool",\n  "tool_call_id": "call_99ax1",\n  "name": "get_order_status",\n  "content": json.dumps({\n    "order_id": "ORD-4091",\n    "status": "en_reparto",\n    "courier": "ExpressEnvios",\n    "eta": "16:30",\n    "ubicacion": "Centro de Distribución Norte"\n  })\n}\nmessages.append(response.choices[0].message)\nmessages.append(tool_message)`,
          insight: 'La respuesta de la función se convierte en nuevo contexto (observación) inyectado al modelo.'
        },
        {
          phase: 'model_response',
          label: 'MODEL RESPONSE',
          icon: 'smart_toy',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 7: Síntesis de la Respuesta Final',
          description: 'El modelo lee la observación estructurada y genera la respuesta conversacional definitiva para el usuario.',
          payloadType: 'Respuesta Final al Usuario',
          payloadContent: `final_response = client.chat.completions.create(model="gpt-4o-mini", messages=messages)\n\n# Salida:\n"Tu pedido ORD-4091 se encuentra actualmente en reparto con ExpressEnvios. La entrega estimada es a las 16:30 desde el Centro de Distribución Norte."`,
          insight: 'El ciclo se completa: el usuario recibe una respuesta precisa basada en datos reales sin haber expuesto la base de datos al LLM.'
        }
      ]
    },
    {
      id: 'scenario_cancellation',
      name: '2. Cancelación con Side-Effect',
      badge: 'Side Effect',
      userInput: 'Cancela de inmediato mi orden ORD-8812 por duplicidad.',
      hasToolCall: true,
      steps: [
        {
          phase: 'user',
          label: 'USER',
          icon: 'person',
          owner: 'USER',
          ownerType: 'user',
          title: 'Paso 1: Petición de Mutación de Estado',
          description: 'El usuario solicita una acción destructiva con efecto financiero colateral.',
          payloadType: 'Prompt Entrante',
          payloadContent: `messages = [\n  {"role": "user", "content": "Cancela de inmediato mi orden ORD-8812 por duplicidad."}\n]`,
          insight: 'Toda acción con efectos colaterales exige una capa de autorización previa en el backend.'
        },
        {
          phase: 'model_reasoning',
          label: 'MODEL',
          icon: 'psychology',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 2: Detección de Intención de Cancelación',
          description: 'El modelo reconoce la necesidad de modificar el estado persistente y selecciona la tool cancel_order.',
          payloadType: 'Evaluación del LLM',
          payloadContent: `Target tool: cancel_order(order_id, reason)\nModel emits function_call proposal instead of saying "ya cancelé".`,
          insight: 'El modelo no puede cancelar nada por sí mismo; solo puede solicitar la cancelación con argumentos.'
        },
        {
          phase: 'tool_selected',
          label: 'TOOL SELECTED',
          icon: 'check_box',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 3: Emisión de Solicitud estructurada',
          description: 'El LLM genera la propuesta con el identificador cancel_order.',
          payloadType: 'Propuesta de Herramienta',
          payloadContent: `tool_calls: [{\n  "id": "call_canc_01",\n  "type": "function",\n  "function": {"name": "cancel_order"}\n}]`,
          insight: 'Esto es una propuesta técnica, no una orden administrativa irrevocable.'
        },
        {
          phase: 'arguments',
          label: 'ARGUMENTS',
          icon: 'data_object',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 4: Extracción de Parámetros de Negocio',
          description: 'El modelo extrae order_id y reason desde el lenguaje natural.',
          payloadType: 'Argumentos de Cancelación',
          payloadContent: `{"order_id": "ORD-8812", "reason": "duplicidad"}`,
          insight: 'Python debe comprobar si la orden existe y si su estado logístico aún permite cancelación.'
        },
        {
          phase: 'execution',
          label: 'EXECUTION',
          icon: 'terminal',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 5: Validación Transaccional en Backend',
          description: 'El backend verifica políticas comerciales, inicia la transacción en DB y emite el reembolso.',
          payloadType: 'Llamada Transaccional en Python',
          payloadContent: `result = cancel_order(order_id="ORD-8812", reason="duplicidad")\n# Base de datos actualizada: status = CANCELLED\n# Pasarela de pagos: Reembolso $85.00 encolado`,
          insight: 'Si la orden ya fue despachada, el backend devuelve un error controlado sin romper el sistema.'
        },
        {
          phase: 'tool_result',
          label: 'TOOL RESULT',
          icon: 'output',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 6: Confirmación del Resultado de la Mutación',
          description: 'El backend reporta el código de autorización y confirmación de reembolso al modelo.',
          payloadType: 'Observación de Cancelación',
          payloadContent: `{"order_id": "ORD-8812", "status": "cancelled", "refund_id": "ref_9011", "amount": 85.0}`,
          insight: 'El modelo ahora cuenta con hechos verificados y confirmados por la base de datos.'
        },
        {
          phase: 'model_response',
          label: 'MODEL RESPONSE',
          icon: 'smart_toy',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 7: Confirmación al Usuario',
          description: 'El modelo redacta el mensaje final de confirmación con los datos devueltos por el backend.',
          payloadType: 'Respuesta al Usuario',
          payloadContent: `"Tu orden ORD-8812 ha sido cancelada con éxito. Hemos procesado el reembolso por $85.00 bajo el comprobante ref_9011."`,
          insight: 'El usuario recibe un resultado veraz porque la acción fue ejecutada por software determinista.'
        }
      ]
    },
    {
      id: 'scenario_reasoning',
      name: '3. Pregunta Conceptual (Cuándo NO llamar Tool)',
      badge: 'No Tool Needed',
      userInput: '¿Cuál es la política general de garantías de la tienda?',
      hasToolCall: false,
      steps: [
        {
          phase: 'user',
          label: 'USER',
          icon: 'person',
          owner: 'USER',
          ownerType: 'user',
          title: 'Paso 1: Consulta Conceptual',
          description: 'El usuario hace una pregunta general de políticas que se encuentra en las instrucciones del sistema o conocimiento general.',
          payloadType: 'Prompt Entrante',
          payloadContent: `messages = [\n  {"role": "user", "content": "¿Cuál es la política general de garantías de la tienda?"}\n]`,
          insight: 'No todas las preguntas requieren llamadas a APIs o bases de datos.'
        },
        {
          phase: 'model_reasoning',
          label: 'MODEL',
          icon: 'psychology',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 2: Evaluación y Decisión de Omitir Tools',
          description: 'El modelo compara las herramientas disponibles (get_order_status, cancel_order) y determina que ninguna coincide con la consulta.',
          payloadType: 'Evaluación de Tools en el LLM',
          payloadContent: `tools = [get_order_status, cancel_order]\nMatch Score: Ninguna herramienta requerida.\nDecisión: Responder directamente con texto conversacional.`,
          insight: 'Un buen modelo entrenado para Function Calling sabe cuándo abstenerse de llamar tools innecesarias.'
        },
        {
          phase: 'tool_selected',
          label: 'TOOL BYPASS',
          icon: 'block',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 3: Bypass de Tool Call',
          description: 'El modelo genera choices[0].message.tool_calls como None o vacío. No se propone ninguna función.',
          payloadType: 'Estado de Tool Calls',
          payloadContent: `response.choices[0].message.tool_calls = None\nresponse.choices[0].finish_reason = "stop"`,
          insight: 'Ahorramos latencia y llamadas de backend innecesarias cuando la consulta no es operacional.'
        },
        {
          phase: 'arguments',
          label: 'SIN PARÁMETROS',
          icon: 'check',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 4: Sin Argumentos',
          description: 'No hay JSON Schema involucrado ni parámetros que parsear.',
          payloadType: 'Argumentos',
          payloadContent: `N/A - Paso omitido limpiamente`,
          insight: 'La aplicación continúa inmediatamente sin invocar la capa de ejecución.'
        },
        {
          phase: 'execution',
          label: 'SIN EJECUCIÓN',
          icon: 'power_off',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 5: Sin Ejecución en Runtime',
          description: 'Python detecta que no hay tool_calls y no toca la base de datos.',
          payloadType: 'Estado del Runtime',
          payloadContent: `if not response.choices[0].message.tool_calls:\n    return response.choices[0].message.content`,
          insight: 'Cero costo de cómputo en tus bases de datos o servicios externos.'
        },
        {
          phase: 'tool_result',
          label: 'SIN OBSERVACIÓN',
          icon: 'check',
          owner: 'PYTHON RUNTIME',
          ownerType: 'runtime',
          title: 'Paso 6: Sin Inyección de Tool Messages',
          description: 'No hay mensajes intermedios que inyectar al historial.',
          payloadType: 'Historial',
          payloadContent: `messages.append(response.choices[0].message)`,
          insight: 'La interacción se resolvió en una única llamada al modelo.'
        },
        {
          phase: 'model_response',
          label: 'MODEL RESPONSE',
          icon: 'smart_toy',
          owner: 'MODEL',
          ownerType: 'model',
          title: 'Paso 7: Respuesta Inmediata al Usuario',
          description: 'El texto generado en el primer turno se entrega directamente al usuario.',
          payloadType: 'Respuesta Conversacional',
          payloadContent: `"Nuestra política contempla 30 días de garantía directa para cambios por defectos de fábrica y 1 año con el fabricante original."`,
          insight: 'El sistema fue eficiente: invocó herramientas cuando era necesario y respondió con razonamiento cuando no lo era.'
        }
      ]
    }
  ];

  currentScenario = computed(() => {
    return this.scenarios.find(s => s.id === this.selectedScenarioId()) || this.scenarios[0];
  });

  currentStep = computed(() => {
    const steps = this.currentScenario().steps;
    const idx = Math.min(this.currentStepIndex(), steps.length - 1);
    return steps[idx];
  });

  selectScenario(id: string) {
    this.selectedScenarioId.set(id);
    this.currentStepIndex.set(0);
  }

  goToStep(index: number) {
    if (index >= 0 && index < this.currentScenario().steps.length) {
      this.currentStepIndex.set(index);
    }
  }

  nextStep() {
    if (this.currentStepIndex() < this.currentScenario().steps.length - 1) {
      this.currentStepIndex.update(i => i + 1);
    }
  }

  prevStep() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  resetSteps() {
    this.currentStepIndex.set(0);
  }
}
