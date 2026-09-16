import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PolicyDecisionType = 'ALLOW' | 'REQUIRE_APPROVAL' | 'BLOCK';
export type RiskLevelType = 'LOW' | 'MEDIUM' | 'CRITICAL';

export interface CatalogTool {
  id: string;
  name: string;
  category: string;
  schemaArgs: string;
  inRegistry: boolean;
  decision: PolicyDecisionType;
  riskLevel: RiskLevelType;
  reason: string;
  constraints: string;
  simulatedPayload: Record<string, unknown>;
}

@Component({
  selector: 'app-exp-permission-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-card" role="region" aria-label="Experiencia Interactiva: Frontera de Permisos">
      <header class="exp-header">
        <div class="exp-badge">
          <span class="material-symbols-outlined exp-badge-icon" aria-hidden="true">security</span>
          <span>Experiencia 01 · Permission Boundary</span>
        </div>
        <h3 class="exp-title">Capacidad vs Autoridad: Tool Registry vs Tool Policy</h3>
        <p class="exp-subtitle">
          Descubre por qué una herramienta registrada en el runtime no está automáticamente autorizada.
          El <code class="exp-code-inline">TOOL_REGISTRY</code> define qué funciones existen, mientras que la
          <code class="exp-code-inline">ToolPolicy</code> decide de forma determinista si la acción se permite (<code class="exp-code-inline">ALLOW</code>),
          se suspende para supervisión humana (<code class="exp-code-inline">REQUIRE_APPROVAL</code>) o se bloquea (<code class="exp-code-inline">BLOCK</code>).
        </p>
      </header>

      <!-- Selector de Vista Conceptual -->
      <div class="view-mode-selector" role="tablist" aria-label="Modo de visualización conceptual">
        <button
          type="button"
          role="tab"
          class="mode-tab"
          [class.mode-tab--active]="activeView === 'registry'"
          [attr.aria-selected]="activeView === 'registry'"
          (click)="activeView = 'registry'"
        >
          <span class="material-symbols-outlined tab-icon">library_books</span>
          <span>1. Tool Registry (Capacidad Técnica)</span>
        </button>

        <button
          type="button"
          role="tab"
          class="mode-tab"
          [class.mode-tab--active]="activeView === 'policy'"
          [attr.aria-selected]="activeView === 'policy'"
          (click)="activeView = 'policy'"
        >
          <span class="material-symbols-outlined tab-icon">policy</span>
          <span>2. Tool Policy (Frontera de Autoridad)</span>
        </button>

        <button
          type="button"
          role="tab"
          class="mode-tab"
          [class.mode-tab--active]="activeView === 'evaluator'"
          [attr.aria-selected]="activeView === 'evaluator'"
          (click)="activeView = 'evaluator'"
        >
          <span class="material-symbols-outlined tab-icon">tune</span>
          <span>3. Evaluador en Runtime (Live Test)</span>
        </button>
      </div>

      <!-- VISTA 1: TOOL REGISTRY -->
      @if (activeView === 'registry') {
        <div class="view-panel" role="tabpanel">
          <div class="panel-banner panel-banner--info">
            <span class="material-symbols-outlined banner-icon">info</span>
            <div>
              <strong>TOOL_REGISTRY responde: "¿Existe esta función y cuál es su schema?"</strong>
              <p>Todas estas herramientas están implementadas en Python y compiladas. Para el modelo todas son "llamables".</p>
            </div>
          </div>

          <div class="tools-grid">
            @for (tool of tools; track tool.id) {
              <div class="tool-card" [class.tool-card--selected]="selectedTool.id === tool.id" (click)="selectTool(tool)">
                <div class="tool-card__header">
                  <span class="tool-name">{{ tool.name }}</span>
                  <span class="badge-registry">REGISTRADA</span>
                </div>
                <div class="tool-card__schema">
                  <span class="schema-label">Args Schema:</span>
                  <code>{{ tool.schemaArgs }}</code>
                </div>
                <div class="tool-card__footer">
                  <span class="category-tag">{{ tool.category }}</span>
                  <button type="button" class="btn-inspect">Inspeccionar</button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- VISTA 2: TOOL POLICY -->
      @if (activeView === 'policy') {
        <div class="view-panel" role="tabpanel">
          <div class="panel-banner panel-banner--warning">
            <span class="material-symbols-outlined banner-icon">gavel</span>
            <div>
              <strong>ToolPolicy responde: "¿Puede ejecutarse en este contexto y bajo qué condiciones?"</strong>
              <p>El software aplica la regla de <em>Least Autonomy Necessary</em>. Cada tool tiene una única PolicyDecision determinista.</p>
            </div>
          </div>

          <div class="policy-matrix-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>Herramienta</th>
                  <th>Riesgo Potencial</th>
                  <th>Decisión de Política</th>
                  <th>Restricciones Operacionales</th>
                  <th>Comportamiento en Runtime</th>
                </tr>
              </thead>
              <tbody>
                @for (tool of tools; track tool.id) {
                  <tr [class.row-selected]="selectedTool.id === tool.id" (click)="selectTool(tool)">
                    <td class="col-tool">
                      <code>{{ tool.name }}</code>
                    </td>
                    <td>
                      <span class="risk-badge" [attr.data-risk]="tool.riskLevel">
                        {{ tool.riskLevel }}
                      </span>
                    </td>
                    <td>
                      <span class="decision-badge" [attr.data-decision]="tool.decision">
                        {{ tool.decision }}
                      </span>
                    </td>
                    <td class="col-constraints">{{ tool.constraints }}</td>
                    <td class="col-behavior">{{ tool.reason }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- VISTA 3: LIVE EVALUATOR -->
      @if (activeView === 'evaluator') {
        <div class="view-panel" role="tabpanel">
          <div class="evaluator-layout">
            <!-- Columna Izquierda: Selección de Herramienta -->
            <div class="eval-selector-col">
              <span class="col-label">1. Selecciona la acción propuesta por el modelo:</span>
              <div class="eval-tool-list">
                @for (tool of tools; track tool.id) {
                  <button
                    type="button"
                    class="eval-tool-btn"
                    [class.eval-tool-btn--active]="selectedTool.id === tool.id"
                    (click)="selectTool(tool)"
                  >
                    <span class="btn-tool-name">{{ tool.name }}</span>
                    <span class="mini-tag" [attr.data-decision]="tool.decision">{{ tool.decision }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Columna Derecha: Resultado del PolicyEvaluator -->
            <div class="eval-result-col">
              <span class="col-label">2. Evaluación determinista del software (PolicyEvaluator):</span>

              <div class="eval-result-card" [attr.data-decision]="selectedTool.decision">
                <div class="result-header">
                  <div class="result-title-group">
                    <span class="material-symbols-outlined result-icon">
                      {{ getDecisionIcon(selectedTool.decision) }}
                    </span>
                    <div>
                      <span class="result-subtitle">Dictamen de Política:</span>
                      <h4 class="result-decision-title">{{ selectedTool.decision }}</h4>
                    </div>
                  </div>
                  <span class="risk-pill" [attr.data-risk]="selectedTool.riskLevel">
                    RIESGO: {{ selectedTool.riskLevel }}
                  </span>
                </div>

                <div class="result-body">
                  <div class="detail-row">
                    <span class="detail-key">Herramienta:</span>
                    <code class="detail-val">{{ selectedTool.name }}</code>
                  </div>
                  <div class="detail-row">
                    <span class="detail-key">Argumentos Propuestos:</span>
                    <pre class="detail-pre"><code>{{ getFormattedPayload(selectedTool.simulatedPayload) }}</code></pre>
                  </div>
                  <div class="detail-row">
                    <span class="detail-key">Regla de Negocio / Restricción:</span>
                    <span class="detail-text">{{ selectedTool.constraints }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-key">Acción del Runtime:</span>
                    <span class="detail-verdict">{{ selectedTool.reason }}</span>
                  </div>
                </div>

                <div class="result-footer" [attr.data-decision]="selectedTool.decision">
                  @switch (selectedTool.decision) {
                    @case ('ALLOW') {
                      <div class="footer-msg">
                        <span class="material-symbols-outlined msg-icon">check_circle</span>
                        <span><strong>ALLOW:</strong> La herramienta se ejecuta de inmediato en el runtime sin detener el ciclo ni requerir confirmación humana.</span>
                      </div>
                    }
                    @case ('REQUIRE_APPROVAL') {
                      <div class="footer-msg">
                        <span class="material-symbols-outlined msg-icon">pause_circle</span>
                        <span><strong>REQUIRE_APPROVAL:</strong> El runtime suspende la ejecución (<code class="exp-code-inline">PAUSED_FOR_APPROVAL</code>), genera un <code class="exp-code-inline">ActionProposal</code> con fingerprint SHA-256 determinista y espera al supervisor.</span>
                      </div>
                    }
                    @case ('BLOCK') {
                      <div class="footer-msg">
                        <span class="material-symbols-outlined msg-icon">block</span>
                        <span><strong>BLOCK:</strong> Bloqueo estricto antes de cualquier compuerta. El modelo NO puede saltarse esta barrera y el humano NO tiene botón de override en la política base.</span>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Axioma de Cierre -->
      <footer class="exp-footer">
        <div class="axiom-banner">
          <span class="material-symbols-outlined axiom-icon">balance</span>
          <p class="axiom-text">
            <strong>Principio Fundamental:</strong> <em>"Que una acción sea técnicamente posible (existe en registry) y lógicamente correcta según el plan, no significa que el agente esté autorizado a ejecutarla."</em> Los guardrails reales residen en código determinista, no en súplicas dentro del system prompt.
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

    /* Tabs Selector */
    .view-mode-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
      padding-bottom: 8px;
    }

    .mode-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--case-surface-2, #1a1c26);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-md, 8px);
      color: var(--case-text-secondary, #94a3b8);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-tab:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #c7d2fe;
    }

    .mode-tab--active {
      background: #4f46e5;
      border-color: #6366f1;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.35);
    }

    .tab-icon {
      font-size: 1.1rem;
    }

    /* Panels */
    .view-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .panel-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .panel-banner--info {
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #bae6fd;
    }

    .panel-banner--warning {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #fde68a;
    }

    .banner-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Tools Grid */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .tool-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: var(--case-surface-2, #181922);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tool-card:hover {
      border-color: #6366f1;
      transform: translateY(-1px);
    }

    .tool-card--selected {
      border-color: #818cf8;
      background: rgba(99, 102, 241, 0.08);
      box-shadow: 0 0 0 1px #818cf8;
    }

    .tool-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .tool-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      color: #38bdf8;
    }

    .badge-registry {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .tool-card__schema {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.75rem;
    }

    .schema-label {
      color: var(--case-text-muted, #71717a);
    }

    .tool-card__schema code {
      font-family: 'JetBrains Mono', monospace;
      color: #cbd5e1;
      background: rgba(0, 0, 0, 0.2);
      padding: 4px;
      border-radius: 4px;
      word-break: break-all;
    }

    .tool-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }

    .category-tag {
      font-size: 0.7rem;
      color: #a1a1aa;
    }

    .btn-inspect {
      font-size: 0.75rem;
      padding: 3px 8px;
      background: transparent;
      border: 1px solid var(--case-border, #3f3f46);
      color: #d4d4d8;
      border-radius: 4px;
      cursor: pointer;
    }

    /* Policy Table */
    .policy-matrix-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
    }

    .policy-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
      text-align: left;
    }

    .policy-table th {
      background: var(--case-surface-2, #1a1c26);
      padding: 10px 14px;
      color: #cbd5e1;
      font-weight: 600;
      border-bottom: 1px solid var(--case-border, #282a36);
      white-space: nowrap;
    }

    .policy-table td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      vertical-align: middle;
    }

    .policy-table tr {
      cursor: pointer;
      transition: background 0.15s;
    }

    .policy-table tr:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .policy-table tr.row-selected {
      background: rgba(99, 102, 241, 0.1);
    }

    .col-tool code {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
      font-weight: 600;
    }

    .col-constraints {
      font-size: 0.75rem;
      color: #cbd5e1;
    }

    .col-behavior {
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    .risk-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .risk-badge[data-risk="LOW"] {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .risk-badge[data-risk="MEDIUM"] {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .risk-badge[data-risk="CRITICAL"] {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .decision-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .decision-badge[data-decision="ALLOW"] {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      border: 1px solid #22c55e;
    }

    .decision-badge[data-decision="REQUIRE_APPROVAL"] {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
      border: 1px solid #f59e0b;
    }

    .decision-badge[data-decision="BLOCK"] {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border: 1px solid #ef4444;
    }

    /* Evaluator Layout */
    .evaluator-layout {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .evaluator-layout {
        grid-template-columns: 1fr;
      }
    }

    .col-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--case-text-secondary, #94a3b8);
      margin-bottom: 8px;
      display: block;
    }

    .eval-tool-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .eval-tool-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: var(--case-surface-2, #1a1c26);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      cursor: pointer;
      color: #f1f5f9;
      transition: all 0.15s ease;
      text-align: left;
    }

    .eval-tool-btn:hover {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
    }

    .eval-tool-btn--active {
      border-color: #818cf8;
      background: rgba(99, 102, 241, 0.16);
      box-shadow: 0 0 0 1px #818cf8;
    }

    .btn-tool-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .mini-tag {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mini-tag[data-decision="ALLOW"] {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }

    .mini-tag[data-decision="REQUIRE_APPROVAL"] {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    .mini-tag[data-decision="BLOCK"] {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    /* Result Card */
    .eval-result-card {
      display: flex;
      flex-direction: column;
      background: var(--case-surface-2, #181922);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      overflow: hidden;
    }

    .eval-result-card[data-decision="ALLOW"] {
      border-color: rgba(34, 197, 94, 0.4);
    }

    .eval-result-card[data-decision="REQUIRE_APPROVAL"] {
      border-color: rgba(245, 158, 11, 0.4);
    }

    .eval-result-card[data-decision="BLOCK"] {
      border-color: rgba(239, 68, 68, 0.4);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .result-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .result-icon {
      font-size: 1.75rem;
    }

    .eval-result-card[data-decision="ALLOW"] .result-icon {
      color: #22c55e;
    }

    .eval-result-card[data-decision="REQUIRE_APPROVAL"] .result-icon {
      color: #f59e0b;
    }

    .eval-result-card[data-decision="BLOCK"] .result-icon {
      color: #ef4444;
    }

    .result-subtitle {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      display: block;
    }

    .result-decision-title {
      font-size: 1.1rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.05em;
    }

    .eval-result-card[data-decision="ALLOW"] .result-decision-title {
      color: #4ade80;
    }

    .eval-result-card[data-decision="REQUIRE_APPROVAL"] .result-decision-title {
      color: #fbbf24;
    }

    .eval-result-card[data-decision="BLOCK"] .result-decision-title {
      color: #f87171;
    }

    .risk-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .risk-pill[data-risk="LOW"] {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .risk-pill[data-risk="MEDIUM"] {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }

    .risk-pill[data-risk="CRITICAL"] {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }

    .result-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      font-size: 0.8rem;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-key {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .detail-val {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
    }

    .detail-pre {
      margin: 0;
      padding: 8px 12px;
      background: #0f1015;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #e2e8f0;
      overflow-x: auto;
    }

    .detail-text {
      color: #e2e8f0;
    }

    .detail-verdict {
      color: #cbd5e1;
      font-style: italic;
    }

    .result-footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .footer-msg {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .msg-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .eval-result-card[data-decision="ALLOW"] .result-footer {
      background: rgba(34, 197, 94, 0.08);
      color: #bbf7d0;
    }

    .eval-result-card[data-decision="REQUIRE_APPROVAL"] .result-footer {
      background: rgba(245, 158, 11, 0.08);
      color: #fef08a;
    }

    .eval-result-card[data-decision="BLOCK"] .result-footer {
      background: rgba(239, 68, 68, 0.08);
      color: #fecaca;
    }

    /* Axioma Footer */
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
export class ExpPermissionBoundaryComponent {
  activeView: 'registry' | 'policy' | 'evaluator' = 'evaluator';

  readonly tools: CatalogTool[] = [
    {
      id: 'tool-1',
      name: 'read_account_balance',
      category: 'Lectura / Idempotente',
      schemaArgs: '{ account_id: string }',
      inRegistry: true,
      decision: 'ALLOW',
      riskLevel: 'LOW',
      constraints: 'Solo cuentas activas del dominio cliente.',
      reason: 'Lectura idempotente segura sin efectos colaterales. Se ejecuta automáticamente.',
      simulatedPayload: { account_id: 'ACC-8831' }
    },
    {
      id: 'tool-2',
      name: 'update_ticket_priority',
      category: 'Modificación Reversible',
      schemaArgs: '{ ticket_id: string, priority: "LOW"|"HIGH" }',
      inRegistry: true,
      decision: 'ALLOW',
      riskLevel: 'MEDIUM',
      constraints: 'Restricción de rol: agente autorizado de soporte.',
      reason: 'Mutación reversible de metadata. Permitida directamente bajo política operativa.',
      simulatedPayload: { ticket_id: 'TCK-2041', priority: 'HIGH' }
    },
    {
      id: 'tool-3',
      name: 'transfer_funds',
      category: 'Mutación Financiera',
      schemaArgs: '{ from_acc: string, to_acc: string, amount: number }',
      inRegistry: true,
      decision: 'REQUIRE_APPROVAL',
      riskLevel: 'CRITICAL',
      constraints: 'amount <= 500000; cuentas auditadas.',
      reason: 'Efecto colateral irreversible con impacto financiero. Requiere compuerta de aprobación humana formal.',
      simulatedPayload: { from_acc: 'ACC-8831', to_acc: 'ACC-4492', amount: 250000 }
    },
    {
      id: 'tool-4',
      name: 'delete_production_cluster',
      category: 'Destrucción de Infraestructura',
      schemaArgs: '{ cluster_id: string, force: boolean }',
      inRegistry: true,
      decision: 'BLOCK',
      riskLevel: 'CRITICAL',
      constraints: 'Prohibición absoluta en entorno de producción.',
      reason: 'Política de tolerancia cero. Bloqueo determinista en software sin compuerta ni override humano.',
      simulatedPayload: { cluster_id: 'k8s-prod-primary', force: true }
    },
    {
      id: 'tool-5',
      name: 'search_knowledge_base',
      category: 'Búsqueda / RAG',
      schemaArgs: '{ query: string, top_k: number }',
      inRegistry: true,
      decision: 'ALLOW',
      riskLevel: 'LOW',
      constraints: 'top_k <= 10; índice público/interno.',
      reason: 'Recuperación de información de solo lectura. Permitida sin pausa.',
      simulatedPayload: { query: 'política de devoluciones', top_k: 5 }
    }
  ];

  selectedTool: CatalogTool = this.tools[2]; // Default a transfer_funds para impacto pedagógico

  selectTool(tool: CatalogTool): void {
    this.selectedTool = tool;
  }

  getDecisionIcon(decision: PolicyDecisionType): string {
    switch (decision) {
      case 'ALLOW': return 'check_circle';
      case 'REQUIRE_APPROVAL': return 'pause_circle';
      case 'BLOCK': return 'block';
    }
  }

  getFormattedPayload(payload: Record<string, unknown>): string {
    return JSON.stringify(payload, null, 2);
  }
}
