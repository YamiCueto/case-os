import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaseButtonComponent,
  CasePanelComponent,
  CaseCalloutComponent
} from '../../../../../../core/ui/components';

interface ToolClassificationItem {
  id: string;
  name: string;
  signature: string;
  description: string;
  expectedType: 'read' | 'side-effect' | 'no-tool';
  feedback?: {
    isCorrect: boolean;
    explanation: string;
  };
}

@Component({
  selector: 'app-exp-tool-anatomy',
  standalone: true,
  imports: [
    CommonModule,
    CaseButtonComponent,
    CasePanelComponent,
    CaseCalloutComponent
  ],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Anatomía de una Tool: De Función Python a Schema</h3>
        <p class="exp-subtitle">
          Una función de Python es código ejecutable por tu CPU. Un Tool Schema es una especificación declarativa para que el modelo aprenda cuándo y cómo solicitar su ejecución.
        </p>
      </div>

      <!-- Tab Switcher: Function vs Schema -->
      <case-panel [elevation]="1" padding="md" class="tabs-panel">
        <div class="anatomy-view-header">
          <span class="anatomy-tag">Inspección de Anatomía</span>
          <div class="view-toggles">
            <case-button
              [variant]="activeTab() === 'schema' ? 'primary' : 'secondary'"
              size="sm"
              (click)="setActiveTab('schema')">
              Tool Schema (JSON Schema)
            </case-button>
            <case-button
              [variant]="activeTab() === 'python' ? 'primary' : 'secondary'"
              size="sm"
              (click)="setActiveTab('python')">
              Función en Python (Runtime)
            </case-button>
          </div>
        </div>

        @if (activeTab() === 'schema') {
          <div class="code-view schema-view">
            <div class="code-header">
              <span class="code-lang">JSON SCHEMA</span>
              <span class="code-badge">Lo que ve el LLM en el contexto</span>
            </div>
            <pre class="code-content"><code>{{ schemaCode }}</code></pre>
            <div class="schema-anatomy-legend">
              <div class="legend-item">
                <span class="legend-dot name-dot"></span>
                <strong>name:</strong> Identificador unívoco que el modelo incluirá en <code>tool_calls[].function.name</code>.
              </div>
              <div class="legend-item">
                <span class="legend-dot desc-dot"></span>
                <strong>description:</strong> Prompt engineering puro. El modelo lee este texto para decidir si la herramienta resuelve la intención del usuario.
              </div>
              <div class="legend-item">
                <span class="legend-dot params-dot"></span>
                <strong>parameters:</strong> Esquema tipado (JSON Schema) que restringe y guía los argumentos esperados.
              </div>
            </div>
          </div>
        } @else {
          <div class="code-view python-view">
            <div class="code-header">
              <span class="code-lang">PYTHON 3.11+</span>
              <span class="code-badge">Lo que ejecuta tu proceso local</span>
            </div>
            <pre class="code-content"><code>{{ pythonCode }}</code></pre>
            <div class="schema-anatomy-legend">
              <div class="legend-item">
                <span class="legend-dot exec-dot"></span>
                <strong>Firma y tipos:</strong> Funciones normales sin dependencias de frameworks ni decoradores mágicos.
              </div>
              <div class="legend-item">
                <span class="legend-dot control-dot"></span>
                <strong>Control determinista:</strong> Tu código decide si conecta a PostgreSQL, invoca una API REST o aplica validaciones.
              </div>
            </div>
          </div>
        }
      </case-panel>

      <!-- Interactive Classification: Read vs Side-Effect vs No-Tool -->
      <div class="exercise-section">
        <div class="exercise-header">
          <div class="exercise-title-row">
            <span class="material-symbols-outlined icon-accent" aria-hidden="true">tune</span>
            <h4 class="exercise-title">Clasificación Operacional de Capacidades</h4>
          </div>
          <p class="exercise-subtitle">
            Antes de exponer tools a un modelo, debes distinguir entre operaciones de lectura inocuas, operaciones con efectos colaterales (side effects) y peticiones donde no se debe invocar ninguna herramienta.
          </p>
        </div>

        <div class="items-grid">
          @for (item of items(); track item.id) {
            <case-panel
              [elevation]="1"
              padding="md"
              class="item-card"
              [class.card-success]="item.feedback?.isCorrect"
              [class.card-error]="item.feedback && !item.feedback.isCorrect">
              
              <div class="item-card-header">
                <code class="tool-name">{{ item.name }}</code>
                <span class="tool-sig">{{ item.signature }}</span>
              </div>
              <p class="tool-desc">{{ item.description }}</p>

              <div class="action-buttons" [class.actions-locked]="item.feedback?.isCorrect">
                <case-button
                  variant="secondary"
                  size="sm"
                  [disabled]="item.feedback?.isCorrect || false"
                  (click)="classify(item.id, 'read')">
                  Lectura (Idempotente)
                </case-button>
                <case-button
                  variant="secondary"
                  size="sm"
                  [disabled]="item.feedback?.isCorrect || false"
                  (click)="classify(item.id, 'side-effect')">
                  Side Effect (Mutación)
                </case-button>
                <case-button
                  variant="secondary"
                  size="sm"
                  [disabled]="item.feedback?.isCorrect || false"
                  (click)="classify(item.id, 'no-tool')">
                  No requiere tool
                </case-button>
              </div>

              @if (item.feedback) {
                <div class="item-feedback" aria-live="polite">
                  <span class="material-symbols-outlined feedback-icon" aria-hidden="true">
                    {{ item.feedback.isCorrect ? 'check_circle' : 'info' }}
                  </span>
                  <span class="feedback-text">{{ item.feedback.explanation }}</span>
                </div>
              }
            </case-panel>
          }
        </div>
      </div>

      <case-callout
        variant="rule"
        title="Principio de Menor Privilegio en Tools"
        message="Las tools con side effects (cancelar, cobrar, modificar estado) nunca deben ejecutarse sin validación estricta de argumentos y políticas de autorización en tu backend. El modelo puede proponer argumentos inválidos o ser inducido por prompt injection.">
      </case-callout>
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

    .exp-header h3 {
      margin: 0 0 8px 0;
      color: var(--case-text-primary);
      font-size: 1.25rem;
    }

    .exp-header p {
      margin: 0;
      color: var(--case-text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .tabs-panel {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
    }

    .anatomy-view-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: var(--case-space-3);
      border-bottom: 1px solid var(--case-border);
    }

    .anatomy-tag {
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--case-text-secondary);
    }

    .view-toggles {
      display: flex;
      gap: 8px;
    }

    .code-view {
      background: var(--case-surface-1);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      overflow: hidden;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: var(--case-surface-3);
      border-bottom: 1px solid var(--case-border);
    }

    .code-lang {
      font-family: var(--case-font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--case-accent);
    }

    .code-badge {
      font-size: 0.75rem;
      color: var(--case-text-secondary);
    }

    .code-content {
      margin: 0;
      padding: 16px;
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--case-text-primary);
      overflow-x: auto;
    }

    .schema-anatomy-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px;
      background: var(--case-surface-2);
      border-top: 1px solid var(--case-border);
      font-size: 0.85rem;
      color: var(--case-text-secondary);
    }

    .legend-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.4;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }

    .name-dot { background: var(--case-accent); }
    .desc-dot { background: var(--case-color-info); }
    .params-dot { background: var(--case-color-warning); }
    .exec-dot { background: var(--case-color-success); }
    .control-dot { background: var(--case-accent); }

    .exercise-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 8px;
    }

    .exercise-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .exercise-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-accent {
      color: var(--case-accent);
      font-size: 1.3rem;
    }

    .exercise-title {
      margin: 0;
      font-size: 1.1rem;
      color: var(--case-text-primary);
    }

    .exercise-subtitle {
      margin: 0;
      font-size: 0.9rem;
      color: var(--case-text-secondary);
      line-height: 1.4;
    }

    .items-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .item-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.2s ease;
    }

    .card-success {
      border-color: var(--case-color-success) !important;
      background: var(--case-color-success-bg) !important;
    }

    .card-error {
      border-color: var(--case-color-warning) !important;
      background: var(--case-color-warning-bg) !important;
    }

    .item-card-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
    }

    .tool-name {
      font-family: var(--case-font-mono);
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--case-accent);
    }

    .tool-sig {
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      color: var(--case-text-secondary);
    }

    .tool-desc {
      margin: 0;
      font-size: 0.9rem;
      color: var(--case-text-primary);
      line-height: 1.4;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .actions-locked {
      opacity: 0.65;
      pointer-events: none;
    }

    .item-feedback {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--case-border);
      font-size: 0.88rem;
      line-height: 1.4;
    }

    .card-success .item-feedback {
      color: var(--case-color-success);
      border-top-color: rgba(16, 185, 129, 0.25);
    }

    .card-error .item-feedback {
      color: var(--case-text-primary);
      border-top-color: rgba(245, 158, 11, 0.25);
    }

    .feedback-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    }
  `]
})
export class ExpToolAnatomyComponent {
  activeTab = signal<'schema' | 'python'>('schema');

  readonly schemaCode = `{
  "type": "function",
  "function": {
    "name": "get_order_status",
    "description": "Consulta el estado logístico actual de un pedido mediante su identificador único ORD-XXXX.",
    "parameters": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "string",
          "description": "Código del pedido a consultar (ej: ORD-4091)"
        }
      },
      "required": ["order_id"]
    }
  }
}`;

  readonly pythonCode = `def get_order_status(order_id: str) -> dict:
    normalized_id = order_id.strip().upper()
    order = database.query_order(normalized_id)
    if not order:
        return {"error": "Pedido no encontrado", "order_id": normalized_id}
    return {
        "order_id": normalized_id,
        "status": order.status,
        "eta": order.estimated_delivery
    }`;

  items = signal<ToolClassificationItem[]>([
    {
      id: 'tool_1',
      name: 'get_order_status',
      signature: '(order_id: str) -> dict',
      description: 'Consulta el estado actual de entrega y tracking de un pedido existente.',
      expectedType: 'read'
    },
    {
      id: 'tool_2',
      name: 'cancel_order',
      signature: '(order_id: str, reason: str) -> dict',
      description: 'Cancela la orden en la base de datos de producción y emite solicitud de reembolso a la pasarela.',
      expectedType: 'side-effect'
    },
    {
      id: 'tool_3',
      name: 'pregunta_conceptual',
      signature: '"¿Qué diferencia hay entre envío estándar y exprés?"',
      description: 'El usuario solicita una explicación de conceptos generales explicados en los términos de servicio.',
      expectedType: 'no-tool'
    },
    {
      id: 'tool_4',
      name: 'calculate_discount',
      signature: '(order_id: str, coupon: str) -> dict',
      description: 'Calcula el monto neto con descuento sin modificar el saldo ni efectuar cobros.',
      expectedType: 'read'
    }
  ]);

  setActiveTab(tab: 'schema' | 'python') {
    this.activeTab.set(tab);
  }

  classify(itemId: string, selected: 'read' | 'side-effect' | 'no-tool') {
    this.items.update(current =>
      current.map(item => {
        if (item.id !== itemId) return item;

        const isCorrect = item.expectedType === selected;
        let explanation = '';

        if (isCorrect) {
          if (selected === 'read') {
            explanation = '¡Correcto! Es una operación idempotente de lectura: no altera el estado del sistema ni genera efectos secundarios.';
          } else if (selected === 'side-effect') {
            explanation = '¡Exacto! Esta herramienta muta el estado persistente y dispara transacciones financieras. Requiere validación estricta y autorización previa en el runtime.';
          } else {
            explanation = '¡Perfecto! Esta consulta no requiere consultar APIs ni modificar datos; el modelo debe responder con razonamiento y conocimiento existente sin activar ninguna tool.';
          }
        } else {
          if (item.expectedType === 'read') {
            explanation = 'No es correcto. Esta función solo consulta y retorna datos; no modifica el estado ni produce efectos colaterales permanentes.';
          } else if (item.expectedType === 'side-effect') {
            explanation = 'No es correcto. Cancelar pedidos o emitir reembolsos modifica bases de datos y procesadores de pago: es un Side Effect crítico.';
          } else {
            explanation = 'No es correcto. No hay necesidad de invocar herramientas cuando la solicitud es explicativa o conceptual.';
          }
        }

        return {
          ...item,
          feedback: { isCorrect, explanation }
        };
      })
    );
  }
}
