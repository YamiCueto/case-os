import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RunMetric {
  label: string;
  runA: string | number;
  runB: string | number;
  winner: 'A' | 'B' | 'tie';
}

@Component({
  selector: 'app-exp-run-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Run Comparison">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">compare_arrows</span>
          <span>Experiencia 02 · Run Comparison</span>
        </div>
        <h3 class="exp-title">Outcome vs Trajectory: Misma Respuesta, Diferente Agente</h3>
        <p class="exp-subtitle">
          Dos corridas producen exactamente la misma respuesta final. Pero su trayectoria las hace
          radicalmente distintas en producción. ¿Cuál pondrías con 100,000 peticiones diarias?
        </p>
        <div class="sim-badge" id="sim-disclaimer">
          <span class="material-symbols-outlined sim-icon">science</span>
          SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS
        </div>
      </header>

      <!-- Respuesta Final Compartida -->
      <div class="shared-outcome">
        <div class="outcome-icon-row">
          <span class="material-symbols-outlined outcome-icon">task_alt</span>
          <span class="outcome-label">Respuesta Final de Ambas Corridas (idéntica)</span>
        </div>
        <div class="outcome-response">
          <code>"El saldo disponible de la cuenta C-001 es <strong>$1,250,000 COP</strong>. Transferencia TX-9981 completada."</code>
        </div>
        <p class="outcome-sub">
          Evaluando solo la respuesta final: <strong>ambas son indistinguibles</strong>. 
          Evaluando la trayectoria: son mundos aparte.
        </p>
      </div>

      <!-- Tabs de vista -->
      <div class="view-tabs" role="tablist">
        <button type="button" role="tab" class="view-tab" [class.view-tab--active]="activeView === 'metrics'"
          [attr.aria-selected]="activeView === 'metrics'" (click)="activeView = 'metrics'" id="tab-metrics">
          <span class="material-symbols-outlined">analytics</span>
          <span>Métricas de Trayectoria</span>
        </button>
        <button type="button" role="tab" class="view-tab" [class.view-tab--active]="activeView === 'timeline'"
          [attr.aria-selected]="activeView === 'timeline'" (click)="activeView = 'timeline'" id="tab-timeline">
          <span class="material-symbols-outlined">timeline</span>
          <span>Timeline Comparado</span>
        </button>
        <button type="button" role="tab" class="view-tab" [class.view-tab--active]="activeView === 'verdict'"
          [attr.aria-selected]="activeView === 'verdict'" (click)="activeView = 'verdict'" id="tab-verdict">
          <span class="material-symbols-outlined">gavel</span>
          <span>Veredicto de Producción</span>
        </button>
      </div>

      <!-- VISTA 1: Métricas -->
      @if (activeView === 'metrics') {
        <div class="view-panel" role="tabpanel">
          <div class="run-headers">
            <div class="run-header run-header--a">
              <span class="material-symbols-outlined run-icon">rocket_launch</span>
              <div>
                <span class="run-name">Run A — Eficiente</span>
                <span class="run-id">run-efficient-a1b2</span>
              </div>
            </div>
            <div class="run-header run-header--b">
              <span class="material-symbols-outlined run-icon">hourglass_bottom</span>
              <div>
                <span class="run-name">Run B — Con Fallos Recuperados</span>
                <span class="run-id">run-inefficient-x7y8</span>
              </div>
            </div>
          </div>

          <div class="metrics-table">
            @for (metric of metrics; track metric.label) {
              <div class="metric-row" [class.metric-row--winner-a]="metric.winner === 'A'"
                [class.metric-row--winner-b]="metric.winner === 'B'">
                <span class="metric-label">{{ metric.label }}</span>
                <span class="metric-val metric-val--a" [class.metric-val--winner]="metric.winner === 'A'">
                  @if (metric.winner === 'A') {
                    <span class="material-symbols-outlined winner-icon">emoji_events</span>
                  }
                  {{ metric.runA }}
                </span>
                <span class="metric-sep">vs</span>
                <span class="metric-val metric-val--b" [class.metric-val--loser]="metric.winner === 'A'"
                  [class.metric-val--winner]="metric.winner === 'B'">
                  {{ metric.runB }}
                  @if (metric.winner === 'B') {
                    <span class="material-symbols-outlined winner-icon">emoji_events</span>
                  }
                </span>
              </div>
            }
          </div>
        </div>
      }

      <!-- VISTA 2: Timeline Comparado -->
      @if (activeView === 'timeline') {
        <div class="view-panel" role="tabpanel">
          <div class="timeline-compare">
            <div class="timeline-col">
              <div class="tc-header tc-header--a">Run A — 4 Iteraciones</div>
              @for (step of timelineA; track step.label) {
                <div class="tc-row" [attr.data-type]="step.type">
                  <span class="tc-dot"></span>
                  <div class="tc-content">
                    <span class="tc-label">{{ step.label }}</span>
                    @if (step.note) { <span class="tc-note">{{ step.note }}</span> }
                  </div>
                  <span class="tc-dur">{{ step.dur }}</span>
                </div>
              }
              <div class="tc-total tc-total--a">Total: 420ms · 3 tools · 0 fallos</div>
            </div>

            <div class="tc-divider" aria-hidden="true">vs</div>

            <div class="timeline-col">
              <div class="tc-header tc-header--b">Run B — 9 Iteraciones</div>
              @for (step of timelineB; track step.label) {
                <div class="tc-row" [attr.data-type]="step.type">
                  <span class="tc-dot"></span>
                  <div class="tc-content">
                    <span class="tc-label">{{ step.label }}</span>
                    @if (step.note) { <span class="tc-note">{{ step.note }}</span> }
                  </div>
                  <span class="tc-dur">{{ step.dur }}</span>
                </div>
              }
              <div class="tc-total tc-total--b">Total: 1,280ms · 7 tools · 2 fallos</div>
            </div>
          </div>
        </div>
      }

      <!-- VISTA 3: Veredicto -->
      @if (activeView === 'verdict') {
        <div class="view-panel" role="tabpanel">
          <div class="verdict-question">
            <span class="material-symbols-outlined vq-icon">help</span>
            <p class="vq-text">
              Con <strong>100,000 peticiones diarias</strong> procesando consultas de saldo bancario, 
              ¿cuál de las dos corridas pondrías en producción?
            </p>
          </div>

          <div class="verdict-cards">
            <div class="verdict-card verdict-card--a" id="verdict-run-a">
              <div class="vc-header">
                <span class="material-symbols-outlined vc-icon">check_circle</span>
                <span class="vc-name">Run A — Admisible</span>
              </div>
              <ul class="vc-list">
                <li>4 iteraciones (dentro de la cota de eficiencia)</li>
                <li>3 llamadas a herramientas, 0 fallos recuperados</li>
                <li>420ms de latencia total</li>
                <li>$0.0042 USD por petición <span class="sim-label">(ilustrativo)</span></li>
                <li>Diaria a 100K req: ~$420 USD <span class="sim-label">(ilustrativo)</span></li>
              </ul>
            </div>
            <div class="verdict-card verdict-card--b" id="verdict-run-b">
              <div class="vc-header">
                <span class="material-symbols-outlined vc-icon">cancel</span>
                <span class="vc-name">Run B — No Admisible</span>
              </div>
              <ul class="vc-list">
                <li>9 iteraciones (2.25× más que Run A)</li>
                <li>7 llamadas a herramientas, 2 fallos recuperados</li>
                <li>1,280ms de latencia (3× Run A)</li>
                <li>$0.0168 USD por petición <span class="sim-label">(ilustrativo)</span></li>
                <li>Diaria a 100K req: ~$1,680 USD <span class="sim-label">(ilustrativo)</span></li>
              </ul>
            </div>
          </div>

          <div class="verdict-axiom">
            <span class="material-symbols-outlined va-icon">balance</span>
            <p class="va-text">
              <strong>Principio:</strong> La evaluación agéntica rigurosa requiere medir ambas dimensiones:
              <em>Outcome</em> (¿obtuvo la respuesta correcta?) y <em>Trajectory</em> (¿cómo llegó a ella?).
              Evaluar solo el Outcome es técnicamente insuficiente para sistemas en producción.
            </p>
          </div>
        </div>
      }
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
      color: var(--case-text-primary, #f8f8f2);
      box-sizing: border-box;
    }

    .exp-header { display: flex; flex-direction: column; gap: 8px; }

    .exp-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      width: fit-content;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .exp-badge-icon { font-size: 1rem; }

    .exp-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
    .exp-subtitle { font-size: 0.875rem; color: var(--case-text-secondary, #a0a0b0); margin: 0; line-height: 1.5; }

    .exp-code-inline {
      padding: 2px 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #93c5fd;
    }

    .sim-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      width: fit-content;
      background: rgba(245,158,11,0.1);
      border: 1px solid rgba(245,158,11,0.3);
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      color: #fbbf24;
      letter-spacing: 0.05em;
    }

    .sim-icon { font-size: 0.9rem; }

    /* Shared outcome */
    .shared-outcome {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px 16px;
      background: rgba(16,185,129,0.06);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 8px;
    }

    .outcome-icon-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .outcome-icon { color: #34d399; font-size: 1.1rem; }
    .outcome-label { font-size: 0.75rem; font-weight: 700; color: #6ee7b7; text-transform: uppercase; letter-spacing: 0.05em; }

    .outcome-response {
      padding: 10px 12px;
      background: rgba(0,0,0,0.25);
      border-radius: 6px;
      font-size: 0.85rem;
      color: #e2e8f0;
    }

    .outcome-response code { font-family: inherit; }
    .outcome-sub { font-size: 0.78rem; color: #64748b; margin: 0; }

    /* Tabs */
    .view-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
      padding-bottom: 8px;
    }

    .view-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: var(--case-surface-2, #1a1c26);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-tab:hover { background: rgba(99,102,241,0.08); color: #c7d2fe; }
    .view-tab--active { background: #4f46e5; border-color: #6366f1; color: #fff; }

    .view-tab .material-symbols-outlined { font-size: 1rem; }

    .view-panel { display: flex; flex-direction: column; gap: 14px; animation: fadeIn 0.2s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Metrics */
    .run-headers {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .run-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
    }

    .run-header--a { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); }
    .run-header--b { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); }

    .run-icon { font-size: 1.4rem; }
    .run-header--a .run-icon { color: #34d399; }
    .run-header--b .run-icon { color: #f87171; }

    .run-name { display: block; font-size: 0.82rem; font-weight: 700; }
    .run-header--a .run-name { color: #6ee7b7; }
    .run-header--b .run-name { color: #fca5a5; }

    .run-id {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      color: #52525b;
    }

    .metrics-table {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      overflow: hidden;
    }

    .metric-row {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.82rem;
    }

    .metric-row:last-child { border-bottom: none; }

    .metric-label { color: #94a3b8; font-weight: 600; }
    .metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .metric-val--a { color: #34d399; }
    .metric-val--b { color: #94a3b8; }
    .metric-val--winner { font-weight: 800; }
    .metric-val--loser { color: #f87171; }

    .metric-sep { color: #52525b; font-size: 0.75rem; }

    .winner-icon { font-size: 0.9rem; color: #fbbf24; }

    /* Timeline Compare */
    .timeline-compare {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: start;
    }

    .timeline-col { display: flex; flex-direction: column; gap: 4px; }

    .tc-header {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 8px;
    }

    .tc-header--a { background: rgba(16,185,129,0.12); color: #34d399; }
    .tc-header--b { background: rgba(239,68,68,0.1); color: #f87171; }

    .tc-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 5px 0;
    }

    .tc-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #52525b;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .tc-row[data-type="tool"] .tc-dot { background: #38bdf8; }
    .tc-row[data-type="model"] .tc-dot { background: #818cf8; }
    .tc-row[data-type="fail"] .tc-dot { background: #f87171; }
    .tc-row[data-type="plan"] .tc-dot { background: #f59e0b; }
    .tc-row[data-type="lifecycle"] .tc-dot { background: #34d399; }

    .tc-content { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .tc-label { font-size: 0.75rem; color: #cbd5e1; }
    .tc-note { font-size: 0.68rem; color: #f87171; }
    .tc-dur { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #64748b; white-space: nowrap; }

    .tc-total {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-top: 8px;
      text-align: center;
    }

    .tc-total--a { background: rgba(16,185,129,0.08); color: #34d399; }
    .tc-total--b { background: rgba(239,68,68,0.08); color: #f87171; }

    .tc-divider {
      align-self: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #52525b;
      padding: 0 4px;
      padding-top: 48px;
    }

    /* Verdict */
    .verdict-question {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 16px;
      background: rgba(245,158,11,0.06);
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: 8px;
    }

    .vq-icon { font-size: 1.4rem; color: #f59e0b; flex-shrink: 0; }
    .vq-text { font-size: 0.875rem; color: #e2e8f0; margin: 0; line-height: 1.5; }

    .verdict-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .verdict-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 8px;
    }

    .verdict-card--a {
      background: rgba(16,185,129,0.08);
      border: 1px solid rgba(16,185,129,0.3);
    }

    .verdict-card--b {
      background: rgba(239,68,68,0.06);
      border: 1px solid rgba(239,68,68,0.2);
    }

    .vc-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .vc-icon { font-size: 1.2rem; }
    .verdict-card--a .vc-icon { color: #34d399; }
    .verdict-card--b .vc-icon { color: #f87171; }

    .vc-name { font-size: 0.82rem; font-weight: 700; }
    .verdict-card--a .vc-name { color: #6ee7b7; }
    .verdict-card--b .vc-name { color: #fca5a5; }

    .vc-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .vc-list li::before { content: '• '; color: #52525b; }
    .sim-label { font-size: 0.65rem; color: #52525b; }

    .verdict-axiom {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: rgba(99,102,241,0.07);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 8px;
    }

    .va-icon { font-size: 1.1rem; color: #818cf8; flex-shrink: 0; margin-top: 1px; }
    .va-text { font-size: 0.8rem; color: #c7d2fe; margin: 0; line-height: 1.5; }

    @media (max-width: 768px) {
      .run-headers, .verdict-cards { grid-template-columns: 1fr; }
      .timeline-compare { grid-template-columns: 1fr; }
      .tc-divider { display: none; }
    }
  `]
})
export class ExpRunComparisonComponent {
  activeView: 'metrics' | 'timeline' | 'verdict' = 'metrics';

  readonly metrics: RunMetric[] = [
    { label: 'Iteraciones totales', runA: 4, runB: 9, winner: 'A' },
    { label: 'Llamadas a herramientas', runA: 3, runB: 7, winner: 'A' },
    { label: 'Fallos de herramientas', runA: 0, runB: 2, winner: 'A' },
    { label: 'Latencia total', runA: '420ms', runB: '1,280ms', winner: 'A' },
    { label: 'Tokens (ilustrativo)', runA: '384', runB: '1,022', winner: 'A' },
    { label: 'Costo/req (ilustrativo)', runA: '$0.0042', runB: '$0.0168', winner: 'A' },
    { label: 'Compuerta HITL activada', runA: 'Sí', runB: 'Sí', winner: 'tie' },
    { label: 'Respuesta final correcta', runA: '✓', runB: '✓', winner: 'tie' },
  ];

  readonly timelineA = [
    { label: 'RUN_STARTED', type: 'lifecycle', dur: '0ms', note: '' },
    { label: 'PLAN_CREATED (S0, S1)', type: 'plan', dur: '42ms', note: '' },
    { label: 'MODEL_CALLED + TOOL_CALLED: read_account_balance', type: 'tool', dur: '305ms', note: '' },
    { label: 'APPROVAL_REQUESTED + APPROVAL_DECIDED (APPROVE)', type: 'lifecycle', dur: '12s', note: '' },
    { label: 'POLICY_EVALUATED (post_approval_revalidation)', type: 'plan', dur: '3ms', note: '' },
    { label: 'TOOL_CALLED: transfer_funds → TX-9981', type: 'tool', dur: '70ms', note: '' },
    { label: 'RUN_TERMINATED (plan_completed)', type: 'lifecycle', dur: '0ms', note: '' },
  ];

  readonly timelineB = [
    { label: 'RUN_STARTED', type: 'lifecycle', dur: '0ms', note: '' },
    { label: 'PLAN_CREATED (S0, S1)', type: 'plan', dur: '45ms', note: '' },
    { label: 'TOOL_CALLED: read_account_balance', type: 'tool', dur: '310ms', note: '' },
    { label: 'TOOL_RETURNED — FALLO transitorio', type: 'fail', dur: '290ms', note: 'Fallo #1: timeout de red' },
    { label: 'PLAN_REVISED → reintentar S0', type: 'plan', dur: '22ms', note: '' },
    { label: 'TOOL_CALLED: read_account_balance (reintento)', type: 'tool', dur: '315ms', note: '' },
    { label: 'TOOL_CALLED: read_account_balance (validación extra)', type: 'tool', dur: '290ms', note: '' },
    { label: 'TOOL_CALLED: read_account_balance (redundante)', type: 'tool', dur: '310ms', note: 'Llamada innecesaria' },
    { label: 'APPROVAL_REQUESTED + APPROVAL_DECIDED (APPROVE)', type: 'lifecycle', dur: '12s', note: '' },
    { label: 'POLICY_EVALUATED (post_approval_revalidation)', type: 'plan', dur: '3ms', note: '' },
    { label: 'TOOL_CALLED: transfer_funds → FALLO transitorio', type: 'fail', dur: '250ms', note: 'Fallo #2: error de red' },
    { label: 'TOOL_CALLED: transfer_funds (reintento) → TX-9981', type: 'tool', dur: '95ms', note: '' },
    { label: 'RUN_TERMINATED (plan_completed)', type: 'lifecycle', dur: '0ms', note: '' },
  ];
}
