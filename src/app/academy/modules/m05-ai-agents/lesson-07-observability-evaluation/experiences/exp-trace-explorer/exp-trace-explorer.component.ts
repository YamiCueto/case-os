import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TraceEventRow {
  event_id: string;
  run_id: string;
  timestamp: string;
  event_type: string;
  sequence_no: number;
  iteration: number | null;
  step_id: string | null;
  payload: Record<string, unknown>;
  category: 'lifecycle' | 'model' | 'tool' | 'plan' | 'policy' | 'hitl' | 'error';
  duration_label?: string;
}

type TraceFilter = 'ALL' | 'MODEL' | 'TOOL' | 'PLAN' | 'POLICY' | 'HITL' | 'ERROR';

@Component({
  selector: 'app-exp-trace-explorer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Trace Explorer">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">query_stats</span>
          <span>Experiencia 01 · Trace Explorer</span>
        </div>
        <h3 class="exp-title">Anatomía Temporal de una Corrida Agéntica</h3>
        <p class="exp-subtitle">
          Explora la trayectoria completa de Agent v6 como una secuencia estructurada de
          <code class="exp-code-inline">TraceEvent</code>s correlacionados por
          <code class="exp-code-inline">run_id</code>. Cada evento tiene
          <code class="exp-code-inline">sequence_no</code> monotónico, tipo, iteración y payload inspeccionable.
          Aquí el <code class="exp-code-inline">logging.info()</code> no llega.
        </p>
      </header>

      <!-- Selector de filtro por facetas -->
      <div class="filter-bar" role="tablist" aria-label="Filtro de eventos por faceta">
        @for (f of filters; track f.id) {
          <button
            type="button"
            role="tab"
            class="filter-tab"
            [class.filter-tab--active]="activeFilter === f.id"
            [attr.aria-selected]="activeFilter === f.id"
            [attr.data-cat]="f.id"
            (click)="activeFilter = f.id"
            [id]="'filter-tab-' + f.id.toLowerCase()"
          >
            <span class="material-symbols-outlined tab-icon">{{ f.icon }}</span>
            <span>{{ f.label }}</span>
            <span class="filter-count">{{ getFilterCount(f.id) }}</span>
          </button>
        }
      </div>

      <!-- Timeline Waterfall -->
      <div class="timeline-container" role="tabpanel">
        <div class="timeline-header">
          <span class="th-col th-seq">#</span>
          <span class="th-col th-type">Event Type</span>
          <span class="th-col th-iter">Iter</span>
          <span class="th-col th-step">Step</span>
          <span class="th-col th-time">Timestamp</span>
          <span class="th-col th-dur">Latencia</span>
        </div>

        <div class="timeline-body">
          @for (event of filteredEvents; track event.event_id) {
            <div
              class="timeline-row"
              [class.timeline-row--active]="selectedEvent?.event_id === event.event_id"
              [attr.data-cat]="event.category"
              (click)="selectEvent(event)"
              role="button"
              [attr.aria-label]="'Inspeccionar evento ' + event.event_type"
            >
              <span class="td-col td-seq">{{ event.sequence_no }}</span>
              <span class="td-col td-type">
                <span class="event-type-badge" [attr.data-cat]="event.category">
                  {{ event.event_type }}
                </span>
              </span>
              <span class="td-col td-iter">{{ event.iteration ?? '—' }}</span>
              <span class="td-col td-step">{{ event.step_id ?? '—' }}</span>
              <span class="td-col td-time">{{ event.timestamp }}</span>
              <span class="td-col td-dur">
                @if (event.duration_label) {
                  <span class="dur-pill">{{ event.duration_label }}</span>
                } @else {
                  <span class="dur-na">—</span>
                }
              </span>
            </div>
          }

          @if (filteredEvents.length === 0) {
            <div class="empty-trace">
              <span class="material-symbols-outlined empty-icon">filter_list_off</span>
              <span>No hay eventos de tipo <strong>{{ activeFilter }}</strong> en esta corrida.</span>
            </div>
          }
        </div>
      </div>

      <!-- Panel lateral: Inspector de TraceEvent -->
      @if (selectedEvent) {
        <div class="event-inspector" id="event-inspector-panel">
          <div class="inspector-header">
            <span class="material-symbols-outlined inspector-icon">data_object</span>
            <span class="inspector-title">TraceEvent Inspector</span>
            <span class="inspector-badge" [attr.data-cat]="selectedEvent.category">
              {{ selectedEvent.event_type }}
            </span>
          </div>

          <div class="inspector-fields">
            <div class="field-row">
              <span class="field-key">event_id</span>
              <code class="field-val">{{ selectedEvent.event_id }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">run_id</span>
              <code class="field-val run-id-highlight">{{ selectedEvent.run_id }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">timestamp</span>
              <code class="field-val">{{ selectedEvent.timestamp }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">event_type</span>
              <code class="field-val">{{ selectedEvent.event_type }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">sequence_no</span>
              <code class="field-val seq-highlight">{{ selectedEvent.sequence_no }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">iteration</span>
              <code class="field-val">{{ selectedEvent.iteration ?? 'null' }}</code>
            </div>
            <div class="field-row">
              <span class="field-key">step_id</span>
              <code class="field-val">{{ selectedEvent.step_id ?? 'null' }}</code>
            </div>
            <div class="field-row field-row--full">
              <span class="field-key">payload</span>
              <pre class="field-pre"><code>{{ formatPayload(selectedEvent.payload) }}</code></pre>
            </div>
          </div>

          <div class="inspector-callout">
            <span class="material-symbols-outlined callout-icon">lightbulb</span>
            <p class="callout-text">{{ getEventInsight(selectedEvent.event_type) }}</p>
          </div>
        </div>
      }

      <!-- Footer: Principio de correlación -->
      <footer class="exp-footer">
        <div class="correlation-banner">
          <div class="correlation-pill">
            <span class="material-symbols-outlined corr-icon">link</span>
            <span class="corr-label">run_id</span>
            <code class="corr-val">{{ runId }}</code>
          </div>
          <p class="correlation-text">
            Todos los <strong>{{ allEvents.length }} eventos</strong> comparten exactamente el mismo
            <code class="exp-code-inline">run_id</code>. Esto es el hilo conductor del Structured Agent Tracing:
            cualquier sistema de análisis puede reconstruir la trayectoria completa de esta corrida
            filtrando por un único identificador.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .exp-card {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4, 16px);
      padding: var(--case-space-5, 20px);
      background: var(--case-surface-1, #12131a);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      color: var(--case-text-primary, #f8f8f2);
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
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #34d399;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .exp-badge-icon { font-size: 1rem; }

    .exp-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--case-text-primary, #ffffff);
    }

    .exp-subtitle {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--case-text-secondary, #a0a0b0);
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

    /* Filter bar */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
      padding-bottom: 10px;
    }

    .filter-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--case-surface-2, #1a1c26);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 20px;
      color: var(--case-text-secondary, #94a3b8);
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tab:hover { background: rgba(16, 185, 129, 0.08); color: #6ee7b7; }
    .filter-tab--active {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10b981;
      color: #34d399;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.2);
    }
    .filter-tab[data-cat="MODEL"].filter-tab--active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #818cf8; }
    .filter-tab[data-cat="TOOL"].filter-tab--active { background: rgba(56,189,248,0.15); border-color: #38bdf8; color: #7dd3fc; }
    .filter-tab[data-cat="PLAN"].filter-tab--active { background: rgba(245,158,11,0.15); border-color: #f59e0b; color: #fbbf24; }
    .filter-tab[data-cat="POLICY"].filter-tab--active { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #f87171; }
    .filter-tab[data-cat="HITL"].filter-tab--active { background: rgba(168,85,247,0.15); border-color: #a855f7; color: #c084fc; }
    .filter-tab[data-cat="ERROR"].filter-tab--active { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #f87171; }

    .tab-icon { font-size: 0.95rem; }
    .filter-count {
      font-size: 0.7rem;
      background: rgba(255,255,255,0.1);
      padding: 1px 5px;
      border-radius: 10px;
    }

    /* Timeline */
    .timeline-container {
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      overflow: hidden;
      max-height: 340px;
      display: flex;
      flex-direction: column;
    }

    .timeline-header {
      display: grid;
      grid-template-columns: 40px 1fr 50px 70px 140px 80px;
      gap: 0;
      background: var(--case-surface-2, #1a1c26);
      border-bottom: 1px solid var(--case-border, #282a36);
      padding: 8px 12px;
    }

    .th-col {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--case-text-muted, #71717a);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .timeline-body {
      overflow-y: auto;
      flex: 1;
    }

    .timeline-row {
      display: grid;
      grid-template-columns: 40px 1fr 50px 70px 140px 80px;
      gap: 0;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      cursor: pointer;
      transition: background 0.15s;
      align-items: center;
    }

    .timeline-row:hover { background: rgba(255,255,255,0.03); }
    .timeline-row--active { background: rgba(16,185,129,0.08) !important; border-left: 2px solid #10b981; }

    .td-col { font-size: 0.78rem; }

    .td-seq {
      font-family: 'JetBrains Mono', monospace;
      color: var(--case-text-muted, #71717a);
      font-size: 0.72rem;
    }

    .td-iter, .td-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .td-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      color: #64748b;
    }

    .event-type-badge {
      display: inline-flex;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.03em;
    }

    .event-type-badge[data-cat="lifecycle"] { background: rgba(16,185,129,0.15); color: #34d399; }
    .event-type-badge[data-cat="model"] { background: rgba(99,102,241,0.15); color: #818cf8; }
    .event-type-badge[data-cat="tool"] { background: rgba(56,189,248,0.15); color: #38bdf8; }
    .event-type-badge[data-cat="plan"] { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .event-type-badge[data-cat="policy"] { background: rgba(239,68,68,0.12); color: #f87171; }
    .event-type-badge[data-cat="hitl"] { background: rgba(168,85,247,0.15); color: #c084fc; }
    .event-type-badge[data-cat="error"] { background: rgba(239,68,68,0.2); color: #ef4444; }

    .dur-pill {
      display: inline-flex;
      padding: 1px 6px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
      border-radius: 4px;
      font-size: 0.68rem;
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
    }

    .dur-na { color: #3f3f46; font-size: 0.72rem; }

    .empty-trace {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px;
      color: #52525b;
      font-size: 0.85rem;
    }
    .empty-icon { font-size: 1.5rem; }

    /* Inspector */
    .event-inspector {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: var(--case-surface-2, #181922);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 8px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .inspector-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding-bottom: 10px;
    }

    .inspector-icon { font-size: 1.2rem; color: #34d399; }

    .inspector-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f1f5f9;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .inspector-badge {
      margin-left: auto;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .inspector-badge[data-cat="lifecycle"] { background: rgba(16,185,129,0.2); color: #34d399; }
    .inspector-badge[data-cat="model"] { background: rgba(99,102,241,0.2); color: #818cf8; }
    .inspector-badge[data-cat="tool"] { background: rgba(56,189,248,0.2); color: #38bdf8; }
    .inspector-badge[data-cat="plan"] { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .inspector-badge[data-cat="policy"] { background: rgba(239,68,68,0.15); color: #f87171; }
    .inspector-badge[data-cat="hitl"] { background: rgba(168,85,247,0.2); color: #c084fc; }

    .inspector-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .field-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .field-row--full { grid-column: 1 / -1; }

    .field-key {
      font-size: 0.65rem;
      font-weight: 700;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .field-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #e2e8f0;
      background: rgba(0,0,0,0.2);
      padding: 3px 6px;
      border-radius: 4px;
    }

    .run-id-highlight { color: #34d399; }
    .seq-highlight { color: #818cf8; font-weight: 700; }

    .field-pre {
      margin: 0;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      padding: 10px 12px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #94a3b8;
      white-space: pre;
    }

    .inspector-callout {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 6px;
    }

    .callout-icon { font-size: 1rem; color: #818cf8; flex-shrink: 0; margin-top: 1px; }
    .callout-text { font-size: 0.78rem; color: #c7d2fe; margin: 0; line-height: 1.4; }

    /* Footer */
    .exp-footer { margin-top: 4px; }

    .correlation-banner {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px;
      background: rgba(16,185,129,0.06);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 8px;
    }

    .correlation-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.3);
      border-radius: 9999px;
      width: fit-content;
    }

    .corr-icon { font-size: 0.9rem; color: #34d399; }
    .corr-label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
    .corr-val { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #34d399; }
    .correlation-text { font-size: 0.8rem; color: var(--case-text-secondary, #94a3b8); margin: 0; line-height: 1.5; }

    @media (max-width: 768px) {
      .timeline-header, .timeline-row {
        grid-template-columns: 30px 1fr 40px;
      }
      .th-col:nth-child(4), .td-col:nth-child(4),
      .th-col:nth-child(5), .td-col:nth-child(5),
      .th-col:nth-child(6), .td-col:nth-child(6) { display: none; }
      .inspector-fields { grid-template-columns: 1fr; }
    }
  `]
})
export class ExpTraceExplorerComponent {
  activeFilter: TraceFilter = 'ALL';
  selectedEvent: TraceEventRow | null = null;

  readonly runId = 'run-abc-9f3e2d';

  readonly filters = [
    { id: 'ALL' as TraceFilter, label: 'Todos', icon: 'format_list_bulleted' },
    { id: 'MODEL' as TraceFilter, label: 'Model', icon: 'smart_toy' },
    { id: 'TOOL' as TraceFilter, label: 'Tool', icon: 'handyman' },
    { id: 'PLAN' as TraceFilter, label: 'Plan', icon: 'schema' },
    { id: 'POLICY' as TraceFilter, label: 'Policy', icon: 'policy' },
    { id: 'HITL' as TraceFilter, label: 'HITL', icon: 'supervisor_account' },
    { id: 'ERROR' as TraceFilter, label: 'Error', icon: 'error' },
  ];

  readonly allEvents: TraceEventRow[] = [
    { event_id: 'evt-001a2b3c', run_id: this.runId, timestamp: '14:02:31.001Z', event_type: 'RUN_STARTED', sequence_no: 1, iteration: null, step_id: null, category: 'lifecycle', payload: { goal: 'Verificar saldo y transferir $250,000 COP', agent_version: 'v6' } },
    { event_id: 'evt-002d4e5f', run_id: this.runId, timestamp: '14:02:31.043Z', event_type: 'PLAN_CREATED', sequence_no: 2, iteration: 1, step_id: null, category: 'plan', payload: { revision: 1, steps: ['S0: read_account_balance', 'S1: transfer_funds'], goal: 'Verificar saldo y transferir' }, duration_label: '42ms' },
    { event_id: 'evt-003g6h7i', run_id: this.runId, timestamp: '14:02:31.085Z', event_type: 'STEP_STARTED', sequence_no: 3, iteration: 1, step_id: 'S0', category: 'plan', payload: { step_id: 'S0', tool: 'read_account_balance', executor: 'TOOL' } },
    { event_id: 'evt-004j8k9l', run_id: this.runId, timestamp: '14:02:31.090Z', event_type: 'MODEL_CALLED', sequence_no: 4, iteration: 1, step_id: 'S0', category: 'model', payload: { tokens_simulated: 128, cost_simulated: 0.0013 }, duration_label: '—' },
    { event_id: 'evt-005m0n1o', run_id: this.runId, timestamp: '14:02:31.312Z', event_type: 'MODEL_RETURNED', sequence_no: 5, iteration: 1, step_id: 'S0', category: 'model', payload: { response_type: 'tool_call', proposed_tool: 'read_account_balance' }, duration_label: '222ms' },
    { event_id: 'evt-006p2q3r', run_id: this.runId, timestamp: '14:02:31.315Z', event_type: 'POLICY_EVALUATED', sequence_no: 6, iteration: 1, step_id: 'S0', category: 'policy', payload: { tool_name: 'read_account_balance', decision: 'ALLOW', risk_level: 'LOW' } },
    { event_id: 'evt-007s4t5u', run_id: this.runId, timestamp: '14:02:31.318Z', event_type: 'TOOL_CALLED', sequence_no: 7, iteration: 1, step_id: 'S0', category: 'tool', payload: { tool_name: 'read_account_balance', args: { account_id: 'C-001' } } },
    { event_id: 'evt-008v6w7x', run_id: this.runId, timestamp: '14:02:31.401Z', event_type: 'TOOL_RETURNED', sequence_no: 8, iteration: 1, step_id: 'S0', category: 'tool', payload: { tool_name: 'read_account_balance', success: true, result_summary: '{ balance: 1250000 }' }, duration_label: '83ms' },
    { event_id: 'evt-009y8z9a', run_id: this.runId, timestamp: '14:02:31.404Z', event_type: 'STEP_COMPLETED', sequence_no: 9, iteration: 1, step_id: 'S0', category: 'plan', payload: { step_id: 'S0', status: 'COMPLETED' } },
    { event_id: 'evt-010b0c1d', run_id: this.runId, timestamp: '14:02:31.407Z', event_type: 'STEP_STARTED', sequence_no: 10, iteration: 2, step_id: 'S1', category: 'plan', payload: { step_id: 'S1', tool: 'transfer_funds', executor: 'TOOL' } },
    { event_id: 'evt-011e2f3g', run_id: this.runId, timestamp: '14:02:31.412Z', event_type: 'MODEL_CALLED', sequence_no: 11, iteration: 2, step_id: 'S1', category: 'model', payload: { tokens_simulated: 156, cost_simulated: 0.0016 } },
    { event_id: 'evt-012h4i5j', run_id: this.runId, timestamp: '14:02:31.651Z', event_type: 'MODEL_RETURNED', sequence_no: 12, iteration: 2, step_id: 'S1', category: 'model', payload: { response_type: 'tool_call', proposed_tool: 'transfer_funds' }, duration_label: '239ms' },
    { event_id: 'evt-013k6l7m', run_id: this.runId, timestamp: '14:02:31.654Z', event_type: 'POLICY_EVALUATED', sequence_no: 13, iteration: 2, step_id: 'S1', category: 'policy', payload: { tool_name: 'transfer_funds', decision: 'REQUIRE_APPROVAL', risk_level: 'MEDIUM' } },
    { event_id: 'evt-014n8o9p', run_id: this.runId, timestamp: '14:02:31.658Z', event_type: 'APPROVAL_REQUESTED', sequence_no: 14, iteration: 2, step_id: 'S1', category: 'hitl', payload: { tool_name: 'transfer_funds', fingerprint_prefix: 'a3f8d921b4c0', proposal_id: 'prop-8f2e' } },
    { event_id: 'evt-015q0r1s', run_id: this.runId, timestamp: '14:02:44.201Z', event_type: 'APPROVAL_DECIDED', sequence_no: 15, iteration: 2, step_id: 'S1', category: 'hitl', payload: { decision: 'APPROVE', proposal_id: 'prop-8f2e' }, duration_label: '12.5s' },
    { event_id: 'evt-016t2u3v', run_id: this.runId, timestamp: '14:02:44.205Z', event_type: 'POLICY_EVALUATED', sequence_no: 16, iteration: 2, step_id: 'S1', category: 'policy', payload: { phase: 'post_approval_revalidation', tool_name: 'transfer_funds', preconditions_valid: true } },
    { event_id: 'evt-017w4x5y', run_id: this.runId, timestamp: '14:02:44.208Z', event_type: 'TOOL_CALLED', sequence_no: 17, iteration: 2, step_id: 'S1', category: 'tool', payload: { tool_name: 'transfer_funds', args: { amount: 250000, to_account: 'C-002' } } },
    { event_id: 'evt-018z6a7b', run_id: this.runId, timestamp: '14:02:44.350Z', event_type: 'TOOL_RETURNED', sequence_no: 18, iteration: 2, step_id: 'S1', category: 'tool', payload: { tool_name: 'transfer_funds', success: true, result_summary: '{ tx_id: "TX-9981" }' }, duration_label: '142ms' },
    { event_id: 'evt-019c8d9e', run_id: this.runId, timestamp: '14:02:44.354Z', event_type: 'STEP_COMPLETED', sequence_no: 19, iteration: 2, step_id: 'S1', category: 'plan', payload: { step_id: 'S1', status: 'COMPLETED' } },
    { event_id: 'evt-020f0g1h', run_id: this.runId, timestamp: '14:02:44.360Z', event_type: 'RUN_TERMINATED', sequence_no: 20, iteration: null, step_id: null, category: 'lifecycle', payload: { termination_reason: 'plan_completed', duration_ms: 13359 }, duration_label: '13.36s' },
  ];

  get filteredEvents(): TraceEventRow[] {
    if (this.activeFilter === 'ALL') return this.allEvents;
    const catMap: Record<TraceFilter, string> = {
      ALL: '', MODEL: 'model', TOOL: 'tool', PLAN: 'plan', POLICY: 'policy', HITL: 'hitl', ERROR: 'error'
    };
    return this.allEvents.filter(e => e.category === catMap[this.activeFilter]);
  }

  getFilterCount(filter: TraceFilter): number {
    if (filter === 'ALL') return this.allEvents.length;
    const catMap: Record<TraceFilter, string> = {
      ALL: '', MODEL: 'model', TOOL: 'tool', PLAN: 'plan', POLICY: 'policy', HITL: 'hitl', ERROR: 'error'
    };
    return this.allEvents.filter(e => e.category === catMap[filter]).length;
  }

  selectEvent(event: TraceEventRow): void {
    this.selectedEvent = this.selectedEvent?.event_id === event.event_id ? null : event;
  }

  formatPayload(payload: Record<string, unknown>): string {
    return JSON.stringify(payload, null, 2);
  }

  getEventInsight(eventType: string): string {
    const insights: Record<string, string> = {
      'RUN_STARTED': 'Punto de entrada de la corrida. El run_id generado aquí correlacionará todos los eventos subsiguientes. En producción, este UUID es el identificador primario para búsqueda en cualquier backend de telemetría.',
      'PLAN_CREATED': 'El planificador descompuso la meta en pasos con dependencias topológicas. Este evento registra la estructura observable del plan antes de ejecutar el primer paso.',
      'STEP_STARTED': 'El scheduler del plan seleccionó el siguiente paso ejecutable (dependencias satisfechas). El step_id correlaciona todos los eventos de esta fase del plan.',
      'MODEL_CALLED': 'Invocación al modelo probabilístico. Los valores de tokens y costo son SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS para el contexto del taller.',
      'MODEL_RETURNED': 'El modelo retornó una propuesta de acción (tool_call) o una respuesta final. El runtime de software toma el control de la ejecución aquí.',
      'POLICY_EVALUATED': 'El PolicyEvaluator determinista evalúa la acción propuesta. Si phase=post_approval_revalidation, indica la revalidación de precondiciones después de una aprobación HITL.',
      'APPROVAL_REQUESTED': 'El runtime suspendió la ejecución formalmente (PAUSED_FOR_APPROVAL) y registró el ActionProposal. El fingerprint_prefix es los primeros 16 hex del SHA-256 completo.',
      'APPROVAL_DECIDED': 'El supervisor humano emitió una decisión sobre el ActionProposal. Un APPROVE no implica ejecución inmediata: sigue la revalidación de precondiciones.',
      'TOOL_CALLED': 'La herramienta fue despachada por el runtime de software. Los argumentos sensibles fueron sanitizados antes de llegar a este evento.',
      'TOOL_RETURNED': 'El tool retornó un resultado. success=false indica un fallo controlado que el runtime puede manejar (reintentar, replanificar o escalar).',
      'STEP_COMPLETED': 'El paso del plan alcanzó su estado terminal. El scheduler del plan evaluará qué pasos se desbloquean a continuación.',
      'RUN_TERMINATED': 'Estado terminal de la corrida. El termination_reason es canónico: plan_completed, policy_blocked, budget_exceeded, approval_rejected, etc.',
      'PLAN_REVISED': 'El planificador generó una nueva revisión del plan (replanning). El historial de revisiones anteriores se conserva en plan_history.',
      'BUDGET_CHECKED': 'El BudgetController evaluó si la corrida puede continuar bajo los límites operativos configurados.',
      'ERROR': 'Excepción o fallo no recuperable. Este evento dispara el análisis de la causa raíz contra el trace completo.',
    };
    return insights[eventType] ?? 'Evento de la trayectoria agéntica. Haz clic en otro evento para ver su insight pedagógico.';
  }
}
