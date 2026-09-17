import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CircuitState = 'CLOSED' | 'OPEN';

export interface BudgetLogEntry {
  iteration: number;
  action: string;
  toolCallsCount: number;
  failuresCount: number;
  tokensConsumed: number;
  costUSD: number;
  status: 'SUCCESS' | 'FAILURE' | 'CIRCUIT_TRIPPED';
  note: string;
}

@Component({
  selector: 'app-exp-budget-circuit-breaker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Presupuestos y Disyuntores">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">speed</span>
          <span>Experiencia 03 · Budget & Circuit Breakers</span>
        </div>
        <h3 class="exp-title">Control Operacional de Presupuestos y Disyuntores</h3>
        <p class="exp-subtitle">
          Configura límites estrictos de ingeniería en el <code class="exp-code-inline">BudgetController</code>.
          Si el agente excede el presupuesto de iteraciones, llamadas a herramientas o fallos consecutivos,
          el disyuntor se activa (<code class="exp-code-inline">CIRCUIT OPEN</code>) y detiene la corrida de forma segura.
        </p>
      </header>

      <!-- Panel de Configuración de Presupuestos -->
      <div class="budget-config-grid">
        <div class="config-card">
          <div class="config-header">
            <span class="material-symbols-outlined config-icon">repeat</span>
            <span class="config-title">Máx Iteraciones</span>
          </div>
          <div class="config-val-group">
            <span class="config-number">{{ maxIterations }}</span>
            <span class="config-unit">ciclos</span>
          </div>
        </div>

        <div class="config-card">
          <div class="config-header">
            <span class="material-symbols-outlined config-icon">build_circle</span>
            <span class="config-title">Máx Tool Calls</span>
          </div>
          <div class="config-val-group">
            <span class="config-number">{{ maxToolCalls }}</span>
            <span class="config-unit">llamadas</span>
          </div>
        </div>

        <div class="config-card">
          <div class="config-header">
            <span class="material-symbols-outlined config-icon">error_outline</span>
            <span class="config-title">Umbral de Fallos</span>
          </div>
          <div class="config-val-group">
            <span class="config-number">{{ maxFailures }}</span>
            <span class="config-unit">consecutivos</span>
          </div>
        </div>

        <div class="config-card config-card--status" [attr.data-circuit]="circuitState">
          <div class="config-header">
            <span class="material-symbols-outlined config-icon">
              {{ circuitState === 'CLOSED' ? 'power' : 'power_off' }}
            </span>
            <span class="config-title">Estado Disyuntor</span>
          </div>
          <div class="config-val-group">
            <span class="circuit-pill" [attr.data-circuit]="circuitState">
              {{ circuitState === 'CLOSED' ? 'CLOSED (NORMAL)' : 'OPEN (TRIPPED)' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Medidores en Tiempo Real -->
      <div class="meters-container">
        <!-- Barra Iteraciones -->
        <div class="meter-item">
          <div class="meter-header">
            <span>Iteraciones: <strong>{{ currentIteration }} / {{ maxIterations }}</strong></span>
            <span>{{ (currentIteration / maxIterations) * 100 | number:'1.0-0' }}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" [style.width.%]="(currentIteration / maxIterations) * 100" [class.meter-fill--danger]="currentIteration >= maxIterations"></div>
          </div>
        </div>

        <!-- Barra Tool Calls -->
        <div class="meter-item">
          <div class="meter-header">
            <span>Tool Calls: <strong>{{ currentToolCalls }} / {{ maxToolCalls }}</strong></span>
            <span>{{ (currentToolCalls / maxToolCalls) * 100 | number:'1.0-0' }}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" [style.width.%]="(currentToolCalls / maxToolCalls) * 100" [class.meter-fill--danger]="currentToolCalls >= maxToolCalls"></div>
          </div>
        </div>

        <!-- Barra Fallos Consecutivos -->
        <div class="meter-item">
          <div class="meter-header">
            <span>Fallos Consecutivos: <strong>{{ consecutiveFailures }} / {{ maxFailures }}</strong></span>
            <span>{{ (consecutiveFailures / maxFailures) * 100 | number:'1.0-0' }}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill meter-fill--amber" [style.width.%]="(consecutiveFailures / maxFailures) * 100" [class.meter-fill--danger]="consecutiveFailures >= maxFailures"></div>
          </div>
        </div>
      </div>

      <!-- Contadores Ilustrativos Rotulados Didácticamente -->
      <div class="didactic-counters">
        <div class="didactic-badge-strip">
          <span class="material-symbols-outlined strip-icon">info</span>
          <span>SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS (NO CONSTITUYEN PRECIOS OFICIALES)</span>
        </div>
        <div class="counters-row">
          <div class="counter-box">
            <span class="counter-lbl">Tokens Estimados Consumidos:</span>
            <span class="counter-val">{{ estimatedTokens | number }} tokens</span>
          </div>
          <div class="counter-box">
            <span class="counter-lbl">Costo Operacional Estimado:</span>
            <span class="counter-val">\${{ estimatedCostUSD | number:'1.4-4' }} USD</span>
          </div>
          <div class="counter-box">
            <span class="counter-lbl">Motivo de Terminación:</span>
            <code class="counter-val counter-val--term">{{ terminationReason || 'EN_PROGRESO' }}</code>
          </div>
        </div>
      </div>

      <!-- Controles del Runtime -->
      <div class="runtime-controls">
        <button
          type="button"
          class="btn-control btn-control--success"
          [disabled]="circuitState === 'OPEN'"
          (click)="advanceNormalStep()"
        >
          <span class="material-symbols-outlined btn-icon">play_arrow</span>
          <span>1. Ejecutar Iteración Normal (Tool Exitosa)</span>
        </button>

        <button
          type="button"
          class="btn-control btn-control--warning"
          [disabled]="circuitState === 'OPEN'"
          (click)="injectToolFailure()"
        >
          <span class="material-symbols-outlined btn-icon">bug_report</span>
          <span>2. Inyectar Fallo de Herramienta</span>
        </button>

        <button
          type="button"
          class="btn-control btn-control--danger"
          [disabled]="circuitState === 'OPEN'"
          (click)="triggerBudgetOverrun()"
        >
          <span class="material-symbols-outlined btn-icon">flash_on</span>
          <span>3. Provocar Exceso de Presupuesto</span>
        </button>

        <button
          type="button"
          class="btn-control btn-control--reset"
          (click)="resetDashboard()"
        >
          <span class="material-symbols-outlined btn-icon">restart_alt</span>
          <span>Reiniciar</span>
        </button>
      </div>

      <!-- Bitácora de Pasos del Runtime -->
      <div class="audit-log-section">
        <h4 class="log-title">Trazabilidad Operacional del Runtime:</h4>
        <div class="log-table-wrapper">
          <table class="log-table">
            <thead>
              <tr>
                <th>Iteración</th>
                <th>Acción Ejecutada</th>
                <th>Tool Calls</th>
                <th>Fallos</th>
                <th>Tokens (Ilustrativos)</th>
                <th>Estado</th>
                <th>Diagnóstico del Disyuntor</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of history; track entry.iteration) {
                <tr [attr.data-status]="entry.status">
                  <td class="col-num">#{{ entry.iteration }}</td>
                  <td class="col-action"><code>{{ entry.action }}</code></td>
                  <td>{{ entry.toolCallsCount }}</td>
                  <td>{{ entry.failuresCount }}</td>
                  <td>{{ entry.tokensConsumed }}</td>
                  <td>
                    <span class="status-pill" [attr.data-status]="entry.status">
                      {{ entry.status }}
                    </span>
                  </td>
                  <td class="col-note">{{ entry.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Axioma de Cierre -->
      <footer class="exp-footer">
        <div class="axiom-banner">
          <span class="material-symbols-outlined axiom-icon">shield</span>
          <p class="axiom-text">
            <strong>Protección Operativa:</strong> El <code class="exp-code-inline">BudgetController</code> impide que un agente con razonamiento circular o dependencias rotas entre en bucles infinitos que disparen costos o saturen servicios. Cuando el disyuntor se abre, la corrida termina limpiamente con <code class="exp-code-inline">termination_reason = "budget_exceeded"</code>.
          </p>
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
      box-sizing: border-box;
      width: 100%;
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

    /* Config Grid */
    .budget-config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }

    .config-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      background: #181924;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .config-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .config-icon {
      font-size: 1.1rem;
      color: #818cf8;
    }

    .config-val-group {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .config-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
    }

    .config-unit {
      font-size: 0.75rem;
      color: #64748b;
    }

    .circuit-pill {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .circuit-pill[data-circuit="CLOSED"] {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid #22c55e;
      color: #4ade80;
    }

    .circuit-pill[data-circuit="OPEN"] {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #f87171;
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
      from { box-shadow: 0 0 4px #ef4444; }
      to { box-shadow: 0 0 14px #ef4444; }
    }

    /* Meters */
    .meters-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      background: #161722;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .meter-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .meter-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #cbd5e1;
    }

    .meter-track {
      height: 8px;
      background: #0f1016;
      border-radius: 4px;
      overflow: hidden;
    }

    .meter-fill {
      height: 100%;
      background: #4f46e5;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .meter-fill--amber {
      background: #f59e0b;
    }

    .meter-fill--danger {
      background: #ef4444 !important;
    }

    /* Didactic Counters */
    .didactic-counters {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: rgba(56, 189, 248, 0.05);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 8px;
    }

    .didactic-badge-strip {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.68rem;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.04em;
    }

    .strip-icon {
      font-size: 0.95rem;
    }

    .counters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .counter-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .counter-lbl {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .counter-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #f1f5f9;
    }

    .counter-val--term {
      color: #f59e0b;
    }

    /* Runtime Controls */
    .runtime-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .btn-control {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }

    .btn-control:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-control--success {
      background: #16a34a;
      color: #ffffff;
    }
    .btn-control--success:hover:not(:disabled) {
      background: #15803d;
    }

    .btn-control--warning {
      background: #d97706;
      color: #ffffff;
    }
    .btn-control--warning:hover:not(:disabled) {
      background: #b45309;
    }

    .btn-control--danger {
      background: #dc2626;
      color: #ffffff;
    }
    .btn-control--danger:hover:not(:disabled) {
      background: #b91c1c;
    }

    .btn-control--reset {
      background: #27272a;
      color: #cbd5e1;
      border: 1px solid #3f3f46;
      margin-left: auto;
    }
    .btn-control--reset:hover {
      background: #3f3f46;
      color: #ffffff;
    }

    .btn-icon {
      font-size: 1rem;
    }

    /* Audit Log Table */
    .audit-log-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .log-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #cbd5e1;
      margin: 0;
    }

    .log-table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .log-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
      text-align: left;
    }

    .log-table th {
      background: #181924;
      padding: 8px 12px;
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 1px solid var(--case-border, #282a36);
      white-space: nowrap;
    }

    .log-table td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }

    .col-num {
      font-family: 'JetBrains Mono', monospace;
      color: #818cf8;
      font-weight: 700;
    }

    .col-action code {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
    }

    .col-note {
      color: #94a3b8;
    }

    .status-pill {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 700;
    }

    .status-pill[data-status="SUCCESS"] {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .status-pill[data-status="FAILURE"] {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }

    .status-pill[data-status="CIRCUIT_TRIPPED"] {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    /* Footer */
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

    .axiom-text {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1.45;
      color: #c7d2fe;
    }
  `]
})
export class ExpBudgetCircuitBreakerComponent {
  readonly maxIterations = 5;
  readonly maxToolCalls = 4;
  readonly maxFailures = 2;

  currentIteration = 1;
  currentToolCalls = 1;
  consecutiveFailures = 0;
  circuitState: CircuitState = 'CLOSED';

  // Contadores didácticos ilustrativos
  estimatedTokens = 1240;
  estimatedCostUSD = 0.0037;
  terminationReason: string | null = null;

  history: BudgetLogEntry[] = [
    {
      iteration: 1,
      action: 'read_account_balance(ACC-8831)',
      toolCallsCount: 1,
      failuresCount: 0,
      tokensConsumed: 1240,
      costUSD: 0.0037,
      status: 'SUCCESS',
      note: 'Tool ejecutada con éxito. Presupuesto operativo dentro de rangos normales.'
    }
  ];

  advanceNormalStep(): void {
    if (this.circuitState === 'OPEN') return;

    this.currentIteration++;
    this.currentToolCalls++;
    this.consecutiveFailures = 0; // reset on success
    this.estimatedTokens += 950;
    this.estimatedCostUSD += 0.0028;

    const check = this.checkCircuitLimits();
    if (!check.ok) {
      this.tripCircuit(check.reason);
      return;
    }

    this.history.push({
      iteration: this.currentIteration,
      action: `fetch_transaction_ledger(page=${this.currentIteration})`,
      toolCallsCount: this.currentToolCalls,
      failuresCount: this.consecutiveFailures,
      tokensConsumed: this.estimatedTokens,
      costUSD: this.estimatedCostUSD,
      status: 'SUCCESS',
      note: 'Iteración completada con éxito. Presupuesto remanente suficiente.'
    });
  }

  injectToolFailure(): void {
    if (this.circuitState === 'OPEN') return;

    this.currentIteration++;
    this.currentToolCalls++;
    this.consecutiveFailures++;
    this.estimatedTokens += 1100;
    this.estimatedCostUSD += 0.0033;

    const check = this.checkCircuitLimits();
    if (!check.ok) {
      this.tripCircuit(check.reason);
      return;
    }

    this.history.push({
      iteration: this.currentIteration,
      action: 'validate_audit_rules(rule="strict_kyc")',
      toolCallsCount: this.currentToolCalls,
      failuresCount: this.consecutiveFailures,
      tokensConsumed: this.estimatedTokens,
      costUSD: this.estimatedCostUSD,
      status: 'FAILURE',
      note: `Herramienta falló (HTTP 503). Conteo de fallos consecutivos: ${this.consecutiveFailures}/${this.maxFailures}.`
    });
  }

  triggerBudgetOverrun(): void {
    if (this.circuitState === 'OPEN') return;

    // Disparar exceso deliberado
    this.currentIteration = this.maxIterations;
    this.currentToolCalls = this.maxToolCalls;
    this.estimatedTokens += 2800;
    this.estimatedCostUSD += 0.0084;

    this.tripCircuit('budget_exceeded');
  }

  private checkCircuitLimits(): { ok: boolean; reason: string } {
    if (this.currentIteration >= this.maxIterations) {
      return { ok: false, reason: 'budget_exceeded' };
    }
    if (this.currentToolCalls >= this.maxToolCalls) {
      return { ok: false, reason: 'budget_exceeded' };
    }
    if (this.consecutiveFailures >= this.maxFailures) {
      return { ok: false, reason: 'too_many_failures' };
    }
    return { ok: true, reason: '' };
  }

  private tripCircuit(reason: string): void {
    this.circuitState = 'OPEN';
    this.terminationReason = reason;

    this.history.push({
      iteration: this.currentIteration,
      action: 'BudgetController.trip_circuit()',
      toolCallsCount: this.currentToolCalls,
      failuresCount: this.consecutiveFailures,
      tokensConsumed: this.estimatedTokens,
      costUSD: this.estimatedCostUSD,
      status: 'CIRCUIT_TRIPPED',
      note: `¡DISYUNTOR ACTIVADO! Motivo de terminación: ${reason}. Se cancelan llamadas futuras para proteger recursos.`
    });
  }

  resetDashboard(): void {
    this.currentIteration = 1;
    this.currentToolCalls = 1;
    this.consecutiveFailures = 0;
    this.circuitState = 'CLOSED';
    this.estimatedTokens = 1240;
    this.estimatedCostUSD = 0.0037;
    this.terminationReason = null;
    this.history = [
      {
        iteration: 1,
        action: 'read_account_balance(ACC-8831)',
        toolCallsCount: 1,
        failuresCount: 0,
        tokensConsumed: 1240,
        costUSD: 0.0037,
        status: 'SUCCESS',
        note: 'Tool ejecutada con éxito. Presupuesto operativo dentro de rangos normales.'
      }
    ];
  }
}
