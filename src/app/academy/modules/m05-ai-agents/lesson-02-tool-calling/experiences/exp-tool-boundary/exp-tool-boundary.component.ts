import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaseButtonComponent,
  CaseBadgeComponent,
  CasePanelComponent
} from '../../../../../../core/ui/components';

interface SimulationCase {
  id: string;
  name: string;
  badge: string;
  badgeVariant: 'success' | 'warning' | 'error';
  proposedArguments: string;
  validationOutcome: 'passed' | 'schema_error' | 'permission_denied';
  validationMessage: string;
  executionResult: string;
  didExecute: boolean;
  takeaway: string;
}

@Component({
  selector: 'app-exp-tool-boundary',
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
        <h3 class="exp-title">Frontera de Ejecución: Validación en Runtime y Side Effects</h3>
        <p class="exp-subtitle">
          El modelo puede generar argumentos sintácticamente válidos pero semánticamente erróneos o no autorizados. Tu capa de backend debe validar antes de ejecutar cualquier llamada real.
        </p>
      </div>

      <!-- Case Selection Buttons -->
      <div class="case-selection-row">
        <span class="selection-label">Selecciona una propuesta del modelo:</span>
        <div class="case-buttons">
          @for (c of cases; track c.id) {
            <case-button
              [variant]="selectedCaseId() === c.id ? 'primary' : 'secondary'"
              size="sm"
              (click)="selectCase(c.id)">
              {{ c.name }}
            </case-button>
          }
        </div>
      </div>

      <!-- Simulation Sandbox Panel -->
      <case-panel [elevation]="1" padding="md" class="sandbox-panel">
        <div class="sandbox-header">
          <div class="header-left">
            <span class="tool-tag">Tool invocada: <code>cancel_order</code></span>
            <case-badge [variant]="activeCase().badgeVariant">{{ activeCase().badge }}</case-badge>
          </div>
          <span class="sandbox-owner">Validación ejecutada por: <strong>Python Backend</strong></span>
        </div>

        <div class="sandbox-grid">
          <!-- Model Proposal Side -->
          <div class="sandbox-col">
            <div class="col-title">
              <span class="material-symbols-outlined col-icon" aria-hidden="true">psychology</span>
              <span>Propuesta Generada por el LLM</span>
            </div>
            <pre class="code-box"><code>{{ activeCase().proposedArguments }}</code></pre>
          </div>

          <!-- Runtime Interceptor Side -->
          <div class="sandbox-col">
            <div class="col-title">
              <span class="material-symbols-outlined col-icon" aria-hidden="true">security</span>
              <span>Evaluación del Backend en Python</span>
            </div>
            <div
              class="validation-card"
              [class.validation-success]="activeCase().validationOutcome === 'passed'"
              [class.validation-warning]="activeCase().validationOutcome === 'schema_error'"
              [class.validation-error]="activeCase().validationOutcome === 'permission_denied'">
              <div class="validation-status-row">
                <span class="material-symbols-outlined status-icon" aria-hidden="true">
                  {{
                    activeCase().validationOutcome === 'passed'
                      ? 'verified'
                      : activeCase().validationOutcome === 'schema_error'
                      ? 'warning'
                      : 'gpp_bad'
                  }}
                </span>
                <strong>{{ activeCase().validationMessage }}</strong>
              </div>
              <p class="validation-detail">
                Estado de ejecución en DB: 
                <strong>{{ activeCase().didExecute ? 'EJECUTADO CON ÉXITO' : 'EJECUCIÓN BLOQUEADA' }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- Tool Result Output to be returned to LLM -->
        <div class="result-box">
          <div class="result-header">
            <span class="result-title">Tool Result (Observación devuelta al modelo):</span>
            <span class="result-tag">Role: "tool"</span>
          </div>
          <pre class="result-code"><code>{{ activeCase().executionResult }}</code></pre>
        </div>

        <div class="takeaway-banner">
          <span class="material-symbols-outlined takeaway-icon" aria-hidden="true">school</span>
          <span><strong>Regla de Ingeniería:</strong> {{ activeCase().takeaway }}</span>
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

    .case-selection-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .selection-label {
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--case-text-secondary);
      text-transform: uppercase;
    }

    .case-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sandbox-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--case-surface-1);
    }

    .sandbox-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--case-border);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tool-tag {
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
      color: var(--case-text-secondary);
    }

    .tool-tag code {
      color: var(--case-accent);
      font-weight: 700;
    }

    .sandbox-owner {
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      color: var(--case-text-secondary);
    }

    .sandbox-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .sandbox-grid {
        grid-template-columns: 1fr;
      }
    }

    .sandbox-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .col-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--case-text-secondary);
    }

    .col-icon {
      font-size: 1.1rem;
      color: var(--case-accent);
    }

    .code-box {
      margin: 0;
      padding: 14px;
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--case-text-primary);
      height: 100%;
      min-height: 110px;
    }

    .validation-card {
      padding: 14px;
      border-radius: var(--case-radius-md);
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
      min-height: 110px;
      border: 1px solid var(--case-border);
    }

    .validation-success {
      background: var(--case-color-success-bg);
      border-color: var(--case-color-success);
      color: var(--case-color-success);
    }

    .validation-warning {
      background: var(--case-color-warning-bg);
      border-color: var(--case-color-warning);
      color: var(--case-color-warning);
    }

    .validation-error {
      background: var(--case-color-error-bg);
      border-color: var(--case-color-error);
      color: var(--case-color-error);
    }

    .validation-status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }

    .status-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .validation-detail {
      margin: 0;
      font-size: 0.85rem;
      color: var(--case-text-secondary);
      line-height: 1.4;
    }

    .result-box {
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      overflow: hidden;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--case-surface-3);
      border-bottom: 1px solid var(--case-border);
      font-family: var(--case-font-mono);
      font-size: 0.75rem;
    }

    .result-title {
      font-weight: 600;
      color: var(--case-text-secondary);
    }

    .result-tag {
      color: var(--case-accent);
      font-weight: 700;
    }

    .result-code {
      margin: 0;
      padding: 12px 14px;
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--case-text-primary);
      overflow-x: auto;
    }

    .takeaway-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: var(--case-surface-3);
      border-radius: var(--case-radius-md);
      font-size: 0.9rem;
      line-height: 1.45;
      color: var(--case-text-primary);
      border: 1px solid var(--case-border);
    }

    .takeaway-icon {
      color: var(--case-accent);
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 1px;
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
export class ExpToolBoundaryComponent {
  selectedCaseId = signal<string>('case_valid');

  readonly cases: SimulationCase[] = [
    {
      id: 'case_valid',
      name: 'Caso 1: Argumentos Válidos (Happy Path)',
      badge: 'Válido y Autorizado',
      badgeVariant: 'success',
      proposedArguments: `{\n  "order_id": "ORD-7719",\n  "reason": "solicitud_cliente"\n}`,
      validationOutcome: 'passed',
      validationMessage: 'Schema verificado y política de cancelación aprobada (pedido en estado PENDIENTE).',
      executionResult: `{\n  "success": true,\n  "order_id": "ORD-7719",\n  "status": "cancelled",\n  "refund_status": "processed",\n  "auth_ref": "REF-99201"\n}`,
      didExecute: true,
      takeaway: 'Cuando el schema y las reglas de negocio coinciden, el backend ejecuta la mutación y retorna la confirmación oficial al modelo.'
    },
    {
      id: 'case_schema_error',
      name: 'Caso 2: Argumento Malformado por el Modelo',
      badge: 'Fallo de Schema',
      badgeVariant: 'warning',
      proposedArguments: `{\n  "id_pedido": 7719,\n  "motivo": null\n}`,
      validationOutcome: 'schema_error',
      validationMessage: 'Error de validación: Se esperaba "order_id" (string) y "reason" (string no nulo).',
      executionResult: `{\n  "error": "invalid_arguments",\n  "expected_schema": {"order_id": "str", "reason": "str"},\n  "received": {"id_pedido": 7719, "motivo": null},\n  "message": "Falta parámetro obligatorio 'order_id'"\n}`,
      didExecute: false,
      takeaway: 'El backend nunca debe colapsar con excepciones no controladas. Retornar el error como Tool Result permite que el modelo informe al usuario o reintente la llamada.'
    },
    {
      id: 'case_unauthorized',
      name: 'Caso 3: Intento No Autorizado / Fuera de Política',
      badge: 'Rechazo de Autorización',
      badgeVariant: 'error',
      proposedArguments: `{\n  "order_id": "ORD-3310",\n  "reason": "prompt_injection_override"\n}`,
      validationOutcome: 'permission_denied',
      validationMessage: 'Rechazo por regla de negocio: ORD-3310 ya fue entregada hace 45 días. Política vence a los 30 días.',
      executionResult: `{\n  "error": "policy_violation",\n  "order_id": "ORD-3310",\n  "status": "DELIVERED",\n  "delivered_days_ago": 45,\n  "policy_limit_days": 30,\n  "message": "Cancelación fuera de plazo comercial"\n}`,
      didExecute: false,
      takeaway: 'Ningún prompt persuasivo del usuario puede vulnerar las reglas del backend. El software es la única barrera de seguridad infranqueable.'
    }
  ];

  activeCase = signal<SimulationCase>(this.cases[0]);

  selectCase(id: string) {
    this.selectedCaseId.set(id);
    const found = this.cases.find(c => c.id === id);
    if (found) {
      this.activeCase.set(found);
    }
  }
}
