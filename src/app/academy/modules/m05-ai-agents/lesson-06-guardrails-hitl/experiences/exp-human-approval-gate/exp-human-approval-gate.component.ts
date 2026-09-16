import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GateExecutionStatus = 'IDLE' | 'RUNNING' | 'PAUSED_FOR_APPROVAL' | 'EXECUTING' | 'RESUMED' | 'REJECTED' | 'BLOCKED';

export interface ActionProposalData {
  proposal_id: string;
  run_id: string;
  step_id: string;
  tool_name: string;
  arguments: {
    from_acc: string;
    to_acc: string;
    amount: number;
  };
  risk_level: 'CRITICAL';
  reason: string;
  created_at: string;
  action_fingerprint: string;
}

export interface ApprovalRecordData {
  proposal_id: string;
  action_fingerprint: string;
  decision: 'APPROVE' | 'REJECT';
  reviewer_id: string;
  justification: string | null;
  decided_at: string;
  consumed: boolean;
  consumed_at: string | null;
}

@Component({
  selector: 'app-exp-human-approval-gate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Compuerta de Aprobación Humana">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">verified_user</span>
          <span>Experiencia 02 · Human Approval Gate</span>
        </div>
        <h3 class="exp-title">Compuerta de Aprobación, Action Binding y Precondiciones</h3>
        <p class="exp-subtitle">
          Supervisa el ciclo de autorización real: suspensión formal (<code class="exp-code-inline">PAUSED_FOR_APPROVAL</code>),
          binding estricto con hash SHA-256 sobre serialización determinista, revalidación de precondiciones y consumo único con protección anti-replay.
        </p>
      </header>

      <!-- Estado Actual del Runtime -->
      <div class="runtime-status-bar" [attr.data-status]="status">
        <div class="status-indicator">
          <span class="status-pulse"></span>
          <span class="status-label">ESTADO DEL RUNTIME:</span>
          <span class="status-value">{{ getStatusBadge(status) }}</span>
        </div>
        <div class="status-meta">
          <span><strong>Run ID:</strong> run_m05_l06_889</span>
          <span><strong>Paso Activo:</strong> S3 (transfer_funds)</span>
        </div>
      </div>

      <!-- Área de Flujo y Tarjeta de Propuesta -->
      <div class="gate-workspace">
        @if (status === 'IDLE') {
          <div class="idle-placeholder">
            <span class="material-symbols-outlined idle-icon">play_circle</span>
            <h4>Agente en espera de ejecución</h4>
            <p>El planificador descompuso la tarea: S1 (consultar deuda) y S2 (validar contrato) ya se completaron. S3 es la mutación financiera.</p>
            <button type="button" class="btn-primary" (click)="startStepS3()">
              <span class="material-symbols-outlined btn-icon">arrow_forward</span>
              <span>Iniciar Paso S3 (transfer_funds)</span>
            </button>
          </div>
        }

        @if (status !== 'IDLE') {
          <!-- Tarjeta de Propuesta Formal (ActionProposal) -->
          <div class="proposal-card" [class.proposal-card--paused]="status === 'PAUSED_FOR_APPROVAL'">
            <div class="proposal-header">
              <div class="proposal-title-group">
                <span class="material-symbols-outlined proposal-icon">assignment_late</span>
                <div>
                  <span class="proposal-tag">ACTION PROPOSAL FORMAL</span>
                  <h4 class="proposal-id">{{ proposal.proposal_id }}</h4>
                </div>
              </div>
              <span class="risk-pill">RIESGO CRÍTICO</span>
            </div>

            <div class="proposal-body">
              <div class="prop-grid">
                <div class="prop-field">
                  <span class="field-lbl">Herramienta:</span>
                  <code class="field-val highlight-tool">{{ proposal.tool_name }}</code>
                </div>
                <div class="prop-field">
                  <span class="field-lbl">Motivo de Aprobación:</span>
                  <span class="field-val">{{ proposal.reason }}</span>
                </div>
              </div>

              <!-- Argumentos Estructurados -->
              <div class="payload-box">
                <span class="box-title">Argumentos Propuestos por el Modelo:</span>
                <pre class="json-code"><code>{{ getFormattedArgs() }}</code></pre>
              </div>

              <!-- Action Binding / Fingerprint -->
              <div class="fingerprint-box">
                <div class="fp-header">
                  <span class="material-symbols-outlined fp-icon">fingerprint</span>
                  <span class="fp-title">Action Fingerprint (SHA-256 Determinista):</span>
                  <button type="button" class="btn-toggle-fp" (click)="showFullFp = !showFullFp">
                    {{ showFullFp ? 'Ver abreviado' : 'Ver hash 64-hex completo' }}
                  </button>
                </div>
                <div class="fp-code-wrap">
                  <code class="fp-code">
                    {{ showFullFp ? proposal.action_fingerprint : (proposal.action_fingerprint | slice:0:16) + '...' }}
                  </code>
                </div>
                <span class="fp-note">
                  Enlaza exactamente <code class="exp-code-inline">tool_name</code> y argumentos ordenados. Cualquier mutación alterará este hash.
                </span>
              </div>
            </div>

            <!-- Panel de Acciones del Supervisor Humano -->
            @if (status === 'PAUSED_FOR_APPROVAL') {
              <div class="human-actions-panel">
                <div class="reviewer-badge">
                  <span class="material-symbols-outlined rev-icon">shield_person</span>
                  <span>Supervisor Autenticado: <strong>security_operator_72</strong></span>
                </div>

                <div class="approval-buttons">
                  <button type="button" class="btn-approve" (click)="handleApprove()">
                    <span class="material-symbols-outlined btn-icon">thumb_up</span>
                    <span>APROBAR (APPROVE)</span>
                  </button>

                  <button type="button" class="btn-reject" (click)="handleReject()">
                    <span class="material-symbols-outlined btn-icon">thumb_down</span>
                    <span>RECHAZAR (REJECT)</span>
                  </button>
                </div>

                <!-- Pruebas de Ataque y Límites de Seguridad -->
                <div class="attack-simulations">
                  <span class="sim-title">Pruebas Didácticas de Límites de Autorización:</span>
                  <div class="sim-buttons">
                    <button type="button" class="btn-sim btn-sim--mutate" (click)="simulateMutation()">
                      <span class="material-symbols-outlined btn-icon">edit_attributes</span>
                      <span>1. Sabotaje TOCTOU: Mutar monto a $900,000</span>
                    </button>

                    <button type="button" class="btn-sim btn-sim--precondition" (click)="simulatePreconditionFailure()">
                      <span class="material-symbols-outlined btn-icon">lock</span>
                      <span>2. Fallo de Precondición: Congelar Cuenta</span>
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Registro de Aprobación Generado -->
            @if (approvalRecord) {
              <div class="approval-record-card" [attr.data-decision]="approvalRecord.decision">
                <div class="record-header">
                  <span class="material-symbols-outlined rec-icon">
                    {{ approvalRecord.decision === 'APPROVE' ? 'verified' : 'cancel' }}
                  </span>
                  <div>
                    <span class="rec-title">APPROVAL RECORD (Inmutable):</span>
                    <span class="rec-id">Decision: <strong>{{ approvalRecord.decision }}</strong> por {{ approvalRecord.reviewer_id }}</span>
                  </div>
                  <span class="consumed-badge" [class.consumed-badge--active]="approvalRecord.consumed">
                    {{ approvalRecord.consumed ? 'CONSUMIDA (1/1)' : 'NO CONSUMIDA' }}
                  </span>
                </div>

                <div class="record-body">
                  <span><strong>Action Fingerprint sellado:</strong> <code>{{ approvalRecord.action_fingerprint | slice:0:16 }}...</code></span>
                  @if (approvalRecord.consumed) {
                    <span><strong>Consumida en:</strong> {{ approvalRecord.consumed_at }}</span>
                  }
                  @if (approvalRecord.justification) {
                    <span><strong>Justificación:</strong> {{ approvalRecord.justification }}</span>
                  }
                </div>

                <!-- Botón de prueba de Replay -->
                @if (approvalRecord.consumed) {
                  <div class="replay-test-row">
                    <button type="button" class="btn-replay" (click)="simulateReplay()">
                      <span class="material-symbols-outlined btn-icon">replay</span>
                      <span>Intentar Reutilizar Aprobación (Ataque Replay)</span>
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Banner de Alerta / Diagnóstico del Runtime -->
            @if (feedbackBanner) {
              <div class="feedback-banner" [attr.data-type]="feedbackBanner.type">
                <span class="material-symbols-outlined banner-icon">{{ feedbackBanner.icon }}</span>
                <div class="banner-content">
                  <h5 class="banner-heading">{{ feedbackBanner.title }}</h5>
                  <p class="banner-msg">{{ feedbackBanner.message }}</p>
                </div>
              </div>
            }

            <!-- Barra de Reinicio -->
            <div class="gate-footer">
              <button type="button" class="btn-reset" (click)="resetGate()">
                <span class="material-symbols-outlined btn-icon">refresh</span>
                <span>Reiniciar Simulación</span>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Axioma de Autorización -->
      <footer class="exp-footer">
        <div class="axiom-banner">
          <span class="material-symbols-outlined axiom-icon">verified</span>
          <div class="axiom-text-group">
            <strong>Invariante de Seguridad:</strong>
            <em>"El humano aprueba una acción concreta con parámetros exactos, no una intención abstracta."</em>
            El fingerprint SHA-256 detecta manipulaciones en los argumentos, pero no protege contra cambios en el estado del mundo exterior: el runtime siempre revalida las precondiciones operacionales inmediatamente antes de despachar la acción.
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .exp-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: var(--case-surface-1, #12131a);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 12px;
      color: #f8f8f2;
      width: 100%;
      box-sizing: border-box;
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
      width: fit-content;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .exp-badge-icon {
      font-size: 1rem;
    }

    .exp-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: #ffffff;
    }

    .exp-subtitle {
      font-size: 0.875rem;
      line-height: 1.5;
      color: #94a3b8;
      margin: 0;
    }

    .exp-code-inline {
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #93c5fd;
    }

    /* Runtime Status Bar */
    .runtime-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 16px;
      background: #181924;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      font-size: 0.8rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #94a3b8;
    }

    .runtime-status-bar[data-status="RUNNING"] .status-pulse {
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }

    .runtime-status-bar[data-status="PAUSED_FOR_APPROVAL"] .status-pulse {
      background: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
      animation: blink 1.2s infinite ease-in-out;
    }

    .runtime-status-bar[data-status="RESUMED"] .status-pulse {
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }

    .runtime-status-bar[data-status="BLOCKED"] .status-pulse,
    .runtime-status-bar[data-status="REJECTED"] .status-pulse {
      background: #ef4444;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .status-label {
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .status-value {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #ffffff;
    }

    .status-meta {
      display: flex;
      gap: 16px;
      color: #94a3b8;
      font-size: 0.75rem;
    }

    /* Workspace */
    .gate-workspace {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .idle-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 36px 20px;
      background: #161720;
      border: 1px dashed var(--case-border, #3f3f46);
      border-radius: 10px;
      text-align: center;
      gap: 10px;
    }

    .idle-icon {
      font-size: 2.5rem;
      color: #818cf8;
    }

    .idle-placeholder h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #f1f5f9;
    }

    .idle-placeholder p {
      margin: 0;
      font-size: 0.85rem;
      color: #94a3b8;
      max-width: 540px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 10px 20px;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }

    /* Proposal Card */
    .proposal-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 18px;
      background: #181a24;
      border: 1px solid #2e3040;
      border-radius: 10px;
      animation: fadeIn 0.2s ease-in-out;
    }

    .proposal-card--paused {
      border-color: #f59e0b;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.15);
    }

    .proposal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    .proposal-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .proposal-icon {
      font-size: 1.8rem;
      color: #f59e0b;
    }

    .proposal-tag {
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
      display: block;
    }

    .proposal-id {
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.05rem;
      color: #f1f5f9;
    }

    .risk-pill {
      font-size: 0.7rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      letter-spacing: 0.05em;
    }

    .proposal-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .prop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .prop-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .field-lbl {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .field-val {
      font-size: 0.85rem;
      color: #e2e8f0;
    }

    .highlight-tool {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
      font-weight: 700;
    }

    .payload-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .box-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .json-code {
      margin: 0;
      padding: 10px 14px;
      background: #0d0e14;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #a5f3fc;
      overflow-x: auto;
    }

    .fingerprint-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      background: rgba(99, 102, 241, 0.06);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
    }

    .fp-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .fp-icon {
      font-size: 1.2rem;
      color: #818cf8;
    }

    .fp-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: #c7d2fe;
    }

    .btn-toggle-fp {
      margin-left: auto;
      background: transparent;
      border: 1px solid #4f46e5;
      color: #a5b4fc;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
    }

    .fp-code-wrap {
      padding: 6px 10px;
      background: #0a0b10;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      overflow-x: auto;
    }

    .fp-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #34d399;
      letter-spacing: 0.03em;
    }

    .fp-note {
      font-size: 0.72rem;
      color: #94a3b8;
      line-height: 1.35;
    }

    /* Supervisor Panel */
    .human-actions-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      background: rgba(245, 158, 11, 0.06);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 8px;
    }

    .reviewer-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: #fde68a;
    }

    .rev-icon {
      font-size: 1.2rem;
      color: #f59e0b;
    }

    .approval-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-approve {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #16a34a;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-approve:hover {
      background: #15803d;
      transform: translateY(-1px);
    }

    .btn-reject {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #dc2626;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-reject:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    /* Attack Simulations */
    .attack-simulations {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px dashed rgba(245, 158, 11, 0.2);
      padding-top: 12px;
    }

    .sim-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #cbd5e1;
    }

    .sim-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-sim {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      background: #232534;
      border: 1px solid #3f3f46;
      border-radius: 6px;
      color: #e2e8f0;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-sim:hover {
      border-color: #f59e0b;
      color: #fde68a;
    }

    /* Approval Record Card */
    .approval-record-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      background: #11131c;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .approval-record-card[data-decision="APPROVE"] {
      border-color: #22c55e;
    }

    .approval-record-card[data-decision="REJECT"] {
      border-color: #ef4444;
    }

    .record-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rec-icon {
      font-size: 1.5rem;
    }

    .approval-record-card[data-decision="APPROVE"] .rec-icon {
      color: #22c55e;
    }

    .approval-record-card[data-decision="REJECT"] .rec-icon {
      color: #ef4444;
    }

    .rec-title {
      font-size: 0.7rem;
      color: #94a3b8;
      display: block;
    }

    .rec-id {
      font-size: 0.85rem;
      color: #f1f5f9;
    }

    .consumed-badge {
      margin-left: auto;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
    }

    .consumed-badge--active {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .record-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.78rem;
      color: #cbd5e1;
    }

    .replay-test-row {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 8px;
    }

    .btn-replay {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      color: #fca5a5;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-replay:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    /* Feedback Banner */
    .feedback-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      border-radius: 8px;
      font-size: 0.8rem;
      line-height: 1.45;
    }

    .feedback-banner[data-type="success"] {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #bbf7d0;
    }

    .feedback-banner[data-type="error"] {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fecaca;
    }

    .feedback-banner[data-type="warning"] {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fef08a;
    }

    .banner-heading {
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .banner-msg {
      margin: 0;
    }

    /* Footer & Reset */
    .gate-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 8px;
    }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: transparent;
      border: 1px solid #3f3f46;
      border-radius: 6px;
      color: #94a3b8;
      font-size: 0.75rem;
      cursor: pointer;
    }

    .btn-reset:hover {
      color: #ffffff;
      border-color: #6366f1;
    }

    .exp-footer {
      border-top: 1px solid var(--case-border-subtle, #232530);
      padding-top: 12px;
    }

    .axiom-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
    }

    .axiom-icon {
      font-size: 1.3rem;
      color: #818cf8;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .axiom-text-group {
      font-size: 0.8rem;
      line-height: 1.45;
      color: #c7d2fe;
    }

    .axiom-text-group strong {
      color: #ffffff;
    }
  `]
})
export class ExpHumanApprovalGateComponent {
  status: GateExecutionStatus = 'IDLE';
  showFullFp = false;

  // Propuesta de referencia
  readonly expectedFingerprint = '9f8a4e12c5b3d789e023456789abcdef0123456789abcdef0123456789abcdef';

  proposal: ActionProposalData = {
    proposal_id: 'PROP-9942',
    run_id: 'run_m05_l06_889',
    step_id: 'S3',
    tool_name: 'transfer_funds',
    arguments: {
      from_acc: 'ACC-8831',
      to_acc: 'ACC-4492',
      amount: 250000
    },
    risk_level: 'CRITICAL',
    reason: 'Transferencia de fondos por $250,000 COP a cuenta receptora auditada.',
    created_at: '2026-09-15T21:12:00Z',
    action_fingerprint: this.expectedFingerprint
  };

  approvalRecord: ApprovalRecordData | null = null;
  feedbackBanner: { type: 'success' | 'error' | 'warning'; icon: string; title: string; message: string } | null = null;

  startStepS3(): void {
    this.status = 'PAUSED_FOR_APPROVAL';
    this.feedbackBanner = {
      type: 'warning',
      icon: 'pause_circle',
      title: 'Transición Formal: PAUSED_FOR_APPROVAL',
      message: 'PolicyEvaluator dictaminó REQUIRE_APPROVAL. El agente suspende la ejecución y conserva el contexto intacto (current_plan, step S3, run_id). No se ejecutará código hasta recibir autorización del revisor.'
    };
  }

  handleApprove(): void {
    // 1. Anti-replay check
    if (this.approvalRecord && this.approvalRecord.consumed) {
      this.status = 'BLOCKED';
      this.feedbackBanner = {
        type: 'error',
        icon: 'error',
        title: 'Replay Protection Violation',
        message: 'La aprobación ya fue consumida previamente. Replay denegado.'
      };
      return;
    }

    // 2. Action Fingerprint Verification
    const currentFp = this.proposal.action_fingerprint;
    if (currentFp !== this.expectedFingerprint) {
      this.status = 'BLOCKED';
      this.feedbackBanner = {
        type: 'error',
        icon: 'gpm_bad',
        title: 'Fallo de Integridad: FINGERPRINT_MISMATCH',
        message: 'Los argumentos de la acción a ejecutar no coinciden con la huella aprobada. La acción mutada no puede ser autorizada por la aprobación previa.'
      };
      return;
    }

    // 3. Simulación de ejecución con éxito
    const record: ApprovalRecordData = {
      proposal_id: this.proposal.proposal_id,
      action_fingerprint: this.proposal.action_fingerprint,
      decision: 'APPROVE',
      reviewer_id: 'security_operator_72',
      justification: 'Transferencia autorizada conforme al protocolo de liquidación.',
      decided_at: new Date().toISOString(),
      consumed: true,
      consumed_at: new Date().toISOString()
    };

    this.approvalRecord = record;
    this.status = 'RESUMED';
    this.feedbackBanner = {
      type: 'success',
      icon: 'check_circle',
      title: 'Ejecución Autorizada: RUNNING → COMPLETED',
      message: 'Fingerprint verificado (SHA-256 coincide), precondiciones válidas, tool ejecutada exactamente una vez. La aprobación fue consumida (consumed=True) y registrada en el historial.'
    };
  }

  handleReject(): void {
    const record: ApprovalRecordData = {
      proposal_id: this.proposal.proposal_id,
      action_fingerprint: this.proposal.action_fingerprint,
      decision: 'REJECT',
      reviewer_id: 'security_operator_72',
      justification: 'Monto excede el umbral automático autorizado para este turno.',
      decided_at: new Date().toISOString(),
      consumed: false,
      consumed_at: null
    };

    this.approvalRecord = record;
    this.status = 'REJECTED';
    this.feedbackBanner = {
      type: 'warning',
      icon: 'cancel',
      title: 'Acción Rechazada por Revisor Humano',
      message: 'La herramienta transfer_funds NUNCA fue ejecutada. El rechazo se convierte en una observación que el planificador utilizará para replanificar una alternativa o finalizar limpiamente.'
    };
  }

  simulateMutation(): void {
    // Intento de alteración de parámetros post-propuesta: amount = 900000
    this.proposal.arguments.amount = 900000;
    // La nueva huella cambia completamente
    this.proposal.action_fingerprint = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    this.status = 'BLOCKED';

    this.feedbackBanner = {
      type: 'error',
      icon: 'security_update_warning',
      title: 'Sabotaje TOCTOU Detectado: FINGERPRINT_MISMATCH',
      message: 'Se intentó despachar transfer_funds(amount=900000) con la aprobación emitida para amount=250000. El runtime comparó las huellas SHA-256 deterministas, detectó discrepancia y bloqueó la ejecución de inmediato.'
    };
  }

  simulatePreconditionFailure(): void {
    // El fingerprint coincide, pero la cuenta fue congelada en el core bancario
    this.status = 'BLOCKED';
    this.feedbackBanner = {
      type: 'error',
      icon: 'lock_person',
      title: 'Revalidación de Precondición Fallida (TOCTOU Real)',
      message: 'El fingerprint coincide con la propuesta, pero el runtime revalidó el estado externo antes de ejecutar y detectó que la cuenta ACC-8831 fue CONGELADA durante la espera de aprobación. El fingerprint no protege contra cambios en el mundo exterior; la ejecución fue cancelada.'
    };
  }

  simulateReplay(): void {
    if (this.approvalRecord?.consumed) {
      this.feedbackBanner = {
        type: 'error',
        icon: 'replay_circle_filled',
        title: 'Ataque de Replay Interceptado: APPROVAL_REPLAY_DETECTED',
        message: 'Se intentó reutilizar el ApprovalRecord de PROP-9942 para una segunda ejecución. El runtime verificó consumed == True y denegó la llamada. Las aprobaciones son estrictamente de un solo uso.'
      };
    }
  }

  resetGate(): void {
    this.status = 'IDLE';
    this.showFullFp = false;
    this.approvalRecord = null;
    this.feedbackBanner = null;
    this.proposal.arguments.amount = 250000;
    this.proposal.action_fingerprint = this.expectedFingerprint;
  }

  getStatusBadge(status: GateExecutionStatus): string {
    switch (status) {
      case 'IDLE': return 'EN ESPERA (IDLE)';
      case 'RUNNING': return 'RUNNING';
      case 'PAUSED_FOR_APPROVAL': return 'PAUSED_FOR_APPROVAL';
      case 'EXECUTING': return 'EXECUTING (1-SHOT)';
      case 'RESUMED': return 'COMPLETED (RESUMED)';
      case 'REJECTED': return 'REJECTED_BY_HUMAN';
      case 'BLOCKED': return 'BLOCKED_BY_GUARDRAIL';
    }
  }

  getFormattedArgs(): string {
    return JSON.stringify(this.proposal.arguments, null, 2);
  }
}
