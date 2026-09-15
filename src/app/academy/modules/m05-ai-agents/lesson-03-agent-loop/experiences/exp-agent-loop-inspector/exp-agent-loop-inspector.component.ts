import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CasePanelComponent,
  CaseBadgeComponent
} from '../../../../../../core/ui/components';

interface LoopIteration {
  number: number;
  label: string;
  badge: string;
  inputMessagesCount: number;
  modelActionType: 'tool_call' | 'final_answer';
  selectedTool?: string;
  argumentsJson?: string;
  pythonExecutionOutput?: string;
  observationRoleTool?: string;
  outputMessagesCount: number;
  terminationReason: string;
  modelExplanation: string;
  rawMessagesState: Array<{ role: string; content: string | null; extra?: string }>;
}

@Component({
  selector: 'app-exp-agent-loop-inspector',
  standalone: true,
  imports: [
    CommonModule,
    CasePanelComponent,
    CaseBadgeComponent
  ],
  template: `
    <div class="exp-container" role="region" aria-label="Inspector del Agent Loop e Iteraciones">
      <div class="exp-header">
        <div class="exp-badge-row">
          <case-badge variant="accent" [mono]="true" [dot]="true">EXPERIENCIA 02</case-badge>
          <span class="exp-tag">Ciclo de Control</span>
        </div>
        <h3 class="exp-title">Agent Loop Inspector: Trazabilidad Iteración a Iteración</h3>
        <p class="exp-subtitle">
          Observa cómo el runtime en Python gobierna el ciclo <code>Decision ──► Action ──► Observation ──► Next Decision</code> hasta que el modelo emite su respuesta final.
        </p>
      </div>

      <!-- Mental Model Cycle Diagram -->
      <case-panel [elevation]="1" padding="md" class="flow-diagram-panel">
        <div class="diagram-title">
          <span class="material-symbols-outlined" aria-hidden="true">sync</span>
          <span>Flujo de Control del Agent Loop</span>
        </div>

        <div class="cycle-nodes-row">
          <div class="cycle-node" [class.cycle-node--active]="isNodeActive('model')">
            <span class="node-label">MODEL</span>
            <span class="node-sub">Inferencia HTTP</span>
          </div>
          <span class="cycle-arrow" aria-hidden="true">→</span>
          <div class="cycle-node cycle-node--decision" [class.cycle-node--active]="isNodeActive('decision')">
            <span class="node-label">¿ToolCall?</span>
            <span class="node-sub">finish_reason</span>
          </div>
          <span class="cycle-arrow" aria-hidden="true">→</span>
          <div class="cycle-node" [class.cycle-node--active]="isNodeActive('action')">
            <span class="node-label">PYTHON</span>
            <span class="node-sub">Validate & Exec</span>
          </div>
          <span class="cycle-arrow" aria-hidden="true">→</span>
          <div class="cycle-node" [class.cycle-node--active]="isNodeActive('obs')">
            <span class="node-label">OBSERVATION</span>
            <span class="node-sub">role: "tool"</span>
          </div>
          <span class="cycle-arrow" aria-hidden="true">↩</span>
        </div>
      </case-panel>

      <!-- Iteration Selector Bar -->
      <div class="iterations-selector">
        <span class="selector-label">Selecciona Iteración:</span>
        <div class="iteration-buttons">
          @for (it of iterations; track it.number) {
            <button
              type="button"
              class="iteration-nav-btn"
              [class.iteration-nav-btn--active]="activeIteration().number === it.number"
              (click)="setIteration(it.number)"
              [attr.aria-pressed]="activeIteration().number === it.number"
            >
              <span class="nav-it-num">Iteración {{ it.number }}</span>
              <span class="nav-it-desc">{{ it.label }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Main Inspector Card -->
      <case-panel [elevation]="2" padding="lg" class="inspector-card">

        <!-- Inspector Card Header -->
        <div class="inspector-card-header">
          <div class="header-left">
            <div class="iteration-pill">
              <span class="it-num">#{{ activeIteration().number }}</span>
              <span class="it-title">{{ activeIteration().label }}</span>
            </div>
            <case-badge [variant]="activeIteration().modelActionType === 'final_answer' ? 'success' : 'accent'" [mono]="true">
              {{ activeIteration().badge }}
            </case-badge>
          </div>

          <div class="header-right">
            <button
              type="button"
              class="toggle-raw-btn"
              [class.toggle-raw-btn--active]="showRawMessages()"
              (click)="toggleRawMessages()"
            >
              <span class="material-symbols-outlined" aria-hidden="true">data_object</span>
              <span>{{ showRawMessages() ? 'Ver Resumen Visual' : 'Ver Estado (messages)' }}</span>
            </button>
          </div>
        </div>

        @if (!showRawMessages()) {
          <!-- Visual Inspector Grid -->
          <div class="inspector-grid">

            <!-- Left Column: Step Details -->
            <div class="inspector-col">

              <!-- Substep 1: Inferencia Model -->
              <div class="phase-box">
                <div class="phase-header">
                  <span class="phase-badge phase-badge--model">1. DECISION (MODEL)</span>
                  <span class="phase-meta">{{ activeIteration().inputMessagesCount }} mensajes de entrada</span>
                </div>
                <div class="phase-content">
                  @if (activeIteration().modelActionType === 'tool_call') {
                    <div class="tool-call-preview">
                      <span class="tool-call-label">Propuesta de Herramienta:</span>
                      <code class="tool-name">{{ activeIteration().selectedTool }}</code>
                      <pre class="json-code"><code>{{ activeIteration().argumentsJson }}</code></pre>
                    </div>
                  } @else {
                    <div class="final-answer-preview">
                      <span class="final-badge">Respuesta Final Sintetizada (finish_reason: "stop")</span>
                      <blockquote class="final-text">
                        "El pedido ORD-4091 se encuentra listo para despacho. Ha sido asignado a Servientrega con guía SE-992144 y entrega estimada en 24 horas."
                      </blockquote>
                    </div>
                  }
                  <p class="phase-note">{{ activeIteration().modelExplanation }}</p>
                </div>
              </div>

              <!-- Substep 2: Python Action & Observation (if tool_call) -->
              @if (activeIteration().modelActionType === 'tool_call') {
                <div class="phase-box">
                  <div class="phase-header">
                    <span class="phase-badge phase-badge--runtime">2. ACTION & OBSERVATION (PYTHON)</span>
                    <span class="phase-meta">Ejecución en CPU</span>
                  </div>
                  <div class="phase-content">
                    <div class="runtime-exec-preview">
                      <span class="runtime-label">Resultado devuelto por la función Python:</span>
                      <pre class="json-code json-code--obs"><code>{{ activeIteration().pythonExecutionOutput }}</code></pre>
                    </div>
                    <div class="injected-msg">
                      <span class="injected-tag">Inyectado en historial:</span>
                      <code>role: "tool" | tool_call_id: "call_00{{ activeIteration().number }}"</code>
                    </div>
                  </div>
                </div>
              }

            </div>

            <!-- Right Column: Status Summary -->
            <div class="inspector-col inspector-col--summary">

              <div class="summary-card">
                <h5 class="summary-title">Estado del Runtime en esta Vuelta</h5>

                <div class="summary-row">
                  <span class="summary-k">Historial de Entrada:</span>
                  <span class="summary-v">{{ activeIteration().inputMessagesCount }} mensajes</span>
                </div>

                <div class="summary-row">
                  <span class="summary-k">Historial Acumulado:</span>
                  <span class="summary-v">{{ activeIteration().outputMessagesCount }} mensajes</span>
                </div>

                <div class="summary-row">
                  <span class="summary-k">Acción del Modelo:</span>
                  <span class="summary-v summary-v--badge">
                    {{ activeIteration().modelActionType === 'tool_call' ? 'Tool Call (Continuar)' : 'Final Answer (Detener)' }}
                  </span>
                </div>

                <div class="summary-row">
                  <span class="summary-k">Condición de Parada:</span>
                  <span class="summary-v" [class.summary-v--final]="activeIteration().modelActionType === 'final_answer'">
                    {{ activeIteration().terminationReason }}
                  </span>
                </div>

                <div class="cycle-decision-prompt">
                  <div class="cd-title">¿Quién decide el siguiente paso?</div>
                  <p class="cd-desc">
                    El modelo solicita <em>{{ activeIteration().modelActionType === 'tool_call' ? activeIteration().selectedTool : 'cerrar la tarea' }}</em>, pero el código Python evalúa si continúa en el bucle <code>while</code>.
                  </p>
                </div>
              </div>

              <!-- Navigation helper -->
              <div class="step-nav-bar">
                <button
                  type="button"
                  class="nav-step-btn"
                  [disabled]="activeIteration().number === 1"
                  (click)="prevIteration()"
                >
                  ← Iteración Anterior
                </button>
                <button
                  type="button"
                  class="nav-step-btn nav-step-btn--primary"
                  [disabled]="activeIteration().number === iterations.length"
                  (click)="nextIteration()"
                >
                  Siguiente Iteración →
                </button>
              </div>

            </div>

          </div>
        } @else {
          <!-- Raw Messages State Inspector -->
          <div class="raw-messages-view">
            <div class="raw-header">
              <span class="raw-title">Array <code>messages</code> acumulado al cierre de la Iteración {{ activeIteration().number }}</span>
              <span class="raw-count">{{ activeIteration().rawMessagesState.length }} mensajes en contexto</span>
            </div>

            <div class="messages-list">
              @for (msg of activeIteration().rawMessagesState; track $index) {
                <div class="raw-message-item" [class.raw-message-item--tool]="msg.role === 'tool'" [class.raw-message-item--assistant]="msg.role === 'assistant'">
                  <div class="raw-msg-header">
                    <span class="msg-index">#{{ $index + 1 }}</span>
                    <span class="msg-role" [attr.data-role]="msg.role">{{ msg.role.toUpperCase() }}</span>
                    @if (msg.extra) {
                      <span class="msg-extra">{{ msg.extra }}</span>
                    }
                  </div>
                  <pre class="msg-body"><code>{{ msg.content }}</code></pre>
                </div>
              }
            </div>
          </div>
        }

      </case-panel>

    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 24px 0;
      font-family: inherit;
    }

    .exp-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
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

    /* Flow Diagram Panel */
    .flow-diagram-panel {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
    }

    .diagram-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent-primary, #38bdf8);
      margin-bottom: 14px;
    }

    .cycle-nodes-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .cycle-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 6px;
      min-width: 100px;
      text-align: center;
      transition: all 0.2s ease;
    }

    .cycle-node--decision {
      border-color: rgba(234, 179, 8, 0.4);
      background: rgba(234, 179, 8, 0.08);
    }

    .cycle-node--active {
      border-color: var(--accent-primary, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
    }

    .node-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    .node-sub {
      font-size: 0.72rem;
      color: var(--text-tertiary, #94a3b8);
    }

    .cycle-arrow {
      color: var(--text-tertiary, #64748b);
      font-size: 1.1rem;
      font-weight: bold;
    }

    /* Iteration Selector */
    .iterations-selector {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .selector-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-tertiary, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .iteration-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .iteration-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 8px;
      color: var(--text-primary, #f8fafc);
      cursor: pointer;
      font-family: inherit;
      text-align: left;
      transition: all 0.2s ease;
    }

    .iteration-nav-btn:hover {
      background: rgba(51, 65, 85, 0.6);
      border-color: rgba(56, 189, 248, 0.35);
    }

    .iteration-nav-btn--active {
      border-color: var(--accent-primary, #38bdf8);
      background: rgba(56, 189, 248, 0.12);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
    }

    .nav-it-num {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    .nav-it-desc {
      font-size: 0.76rem;
      color: var(--text-secondary, #94a3b8);
    }

    /* Inspector Card */
    .inspector-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 10px;
    }

    .inspector-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .iteration-pill {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .it-num {
      background: var(--accent-primary, #38bdf8);
      color: #0f172a;
      font-weight: 800;
      font-size: 0.82rem;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .it-title {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-primary, #f8fafc);
    }

    .toggle-raw-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.25);
      color: var(--text-secondary, #cbd5e1);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-raw-btn:hover {
      color: var(--text-primary, #f8fafc);
      border-color: var(--accent-primary, #38bdf8);
    }

    .toggle-raw-btn--active {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent-primary, #38bdf8);
      color: var(--accent-primary, #38bdf8);
    }

    /* Inspector Grid */
    .inspector-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 20px;
    }

    .inspector-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .phase-box {
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .phase-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .phase-badge {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .phase-badge--model {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .phase-badge--runtime {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .phase-meta {
      font-size: 0.76rem;
      color: var(--text-tertiary, #94a3b8);
    }

    .tool-call-preview {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tool-call-label, .runtime-label {
      font-size: 0.8rem;
      color: var(--text-tertiary, #94a3b8);
      font-weight: 600;
    }

    .tool-name {
      font-family: var(--font-mono, monospace);
      font-size: 0.9rem;
      color: #38bdf8;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px 8px;
      border-radius: 4px;
      width: fit-content;
    }

    .json-code {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px;
      padding: 8px 12px;
      margin: 0;
      font-family: var(--font-mono, monospace);
      font-size: 0.82rem;
      color: #f1f5f9;
      overflow-x: auto;
    }

    .json-code--obs {
      color: #86efac;
    }

    .final-answer-preview {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .final-badge {
      font-size: 0.78rem;
      font-weight: 700;
      color: #22c55e;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .final-text {
      margin: 0;
      padding: 10px 14px;
      background: rgba(34, 197, 94, 0.08);
      border-left: 3px solid #22c55e;
      border-radius: 4px;
      color: #f8fafc;
      font-size: 0.92rem;
      line-height: 1.55;
    }

    .phase-note {
      margin: 0;
      font-size: 0.84rem;
      color: var(--text-secondary, #94a3b8);
      line-height: 1.45;
    }

    .injected-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .injected-tag {
      color: var(--text-tertiary, #94a3b8);
      font-weight: 600;
    }

    .injected-msg code {
      font-family: var(--font-mono, monospace);
      font-size: 0.78rem;
      color: #c084fc;
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Summary Card */
    .summary-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .summary-title {
      margin: 0 0 4px 0;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 0.84rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.08);
      padding-bottom: 6px;
    }

    .summary-k {
      color: var(--text-tertiary, #94a3b8);
    }

    .summary-v {
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
    }

    .summary-v--final {
      color: #22c55e;
    }

    .cycle-decision-prompt {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 4px;
    }

    .cd-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--accent-primary, #38bdf8);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .cd-desc {
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-secondary, #94a3b8);
      line-height: 1.4;
    }

    /* Navigation helper */
    .step-nav-bar {
      display: flex;
      gap: 10px;
    }

    .nav-step-btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.2);
      color: var(--text-secondary, #cbd5e1);
      font-size: 0.82rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-step-btn:hover:not(:disabled) {
      background: rgba(51, 65, 85, 0.8);
      color: var(--text-primary, #f8fafc);
    }

    .nav-step-btn--primary {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.4);
      color: var(--accent-primary, #38bdf8);
      font-weight: 600;
    }

    .nav-step-btn--primary:hover:not(:disabled) {
      background: var(--accent-primary, #38bdf8);
      color: #0f172a;
    }

    .nav-step-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Raw Messages View */
    .raw-messages-view {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .raw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.84rem;
      color: var(--text-tertiary, #94a3b8);
    }

    .raw-count {
      font-weight: 600;
      color: var(--accent-primary, #38bdf8);
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .raw-message-item {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .raw-message-item--assistant {
      border-left: 3px solid #38bdf8;
    }

    .raw-message-item--tool {
      border-left: 3px solid #c084fc;
      background: rgba(192, 132, 252, 0.05);
    }

    .raw-msg-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.76rem;
    }

    .msg-index {
      color: #64748b;
      font-family: var(--font-mono, monospace);
    }

    .msg-role {
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      background: rgba(148, 163, 184, 0.2);
      color: #f1f5f9;
    }

    .msg-role[data-role="user"] {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
    }

    .msg-role[data-role="assistant"] {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }

    .msg-role[data-role="tool"] {
      background: rgba(192, 132, 252, 0.2);
      color: #c084fc;
    }

    .msg-extra {
      color: #94a3b8;
      font-family: var(--font-mono, monospace);
    }

    .msg-body {
      margin: 0;
      font-family: var(--font-mono, monospace);
      font-size: 0.8rem;
      color: #cbd5e1;
      white-space: pre-wrap;
      word-break: break-all;
    }

    @media (max-width: 860px) {
      .inspector-grid {
        grid-template-columns: 1fr;
      }
      .iteration-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExpAgentLoopInspectorComponent {
  readonly iterations: LoopIteration[] = [
    {
      number: 1,
      label: 'Paso 1: Consultar Orden',
      badge: 'ToolCall 1',
      inputMessagesCount: 1,
      modelActionType: 'tool_call',
      selectedTool: 'get_order_status',
      argumentsJson: JSON.stringify({ order_id: 'ORD-4091' }, null, 2),
      pythonExecutionOutput: JSON.stringify({
        order_id: 'ORD-4091',
        status: 'ready_to_ship',
        carrier_id: 'CARRIER-SERV'
      }, null, 2),
      outputMessagesCount: 3,
      terminationReason: 'En progreso (continúa el bucle while)',
      modelExplanation: 'El modelo recibe únicamente el mensaje inicial del usuario. Evalúa los Tool Schemas y determina que primero debe comprobar el estado de preparación de la orden.',
      rawMessagesState: [
        {
          role: 'user',
          content: 'Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada.'
        },
        {
          role: 'assistant',
          content: 'null',
          extra: 'tool_calls: [get_order_status(order_id="ORD-4091")]'
        },
        {
          role: 'tool',
          content: '{"order_id": "ORD-4091", "status": "ready_to_ship", "carrier_id": "CARRIER-SERV"}',
          extra: 'tool_call_id: "call_001"'
        }
      ]
    },
    {
      number: 2,
      label: 'Paso 2: Consultar Transportadora',
      badge: 'ToolCall 2',
      inputMessagesCount: 3,
      modelActionType: 'tool_call',
      selectedTool: 'get_shipping_provider',
      argumentsJson: JSON.stringify({ order_id: 'ORD-4091' }, null, 2),
      pythonExecutionOutput: JSON.stringify({
        carrier: 'Servientrega',
        tracking: 'SE-992144',
        eta: '24 horas'
      }, null, 2),
      outputMessagesCount: 5,
      terminationReason: 'En progreso (continúa el bucle while)',
      modelExplanation: 'El modelo recibe los 3 mensajes acumulados. Lee la observación {"status": "ready_to_ship"} y deduce que debe ejecutar la segunda acción: averiguar la transportadora asignada.',
      rawMessagesState: [
        {
          role: 'user',
          content: 'Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada.'
        },
        {
          role: 'assistant',
          content: 'null',
          extra: 'tool_calls: [get_order_status(order_id="ORD-4091")]'
        },
        {
          role: 'tool',
          content: '{"order_id": "ORD-4091", "status": "ready_to_ship", "carrier_id": "CARRIER-SERV"}',
          extra: 'tool_call_id: "call_001"'
        },
        {
          role: 'assistant',
          content: 'null',
          extra: 'tool_calls: [get_shipping_provider(order_id="ORD-4091")]'
        },
        {
          role: 'tool',
          content: '{"carrier": "Servientrega", "tracking": "SE-992144", "eta": "24 horas"}',
          extra: 'tool_call_id: "call_002"'
        }
      ]
    },
    {
      number: 3,
      label: 'Paso 3: Síntesis Final',
      badge: 'Final Answer',
      inputMessagesCount: 5,
      modelActionType: 'final_answer',
      outputMessagesCount: 6,
      terminationReason: 'Terminación Normal (Final Answer generada)',
      modelExplanation: 'El modelo recibe los 5 mensajes con toda la evidencia necesaria (orden lista + guía y transportadora). No solicita más herramientas; emite texto en lenguaje natural y finaliza.',
      rawMessagesState: [
        {
          role: 'user',
          content: 'Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada.'
        },
        {
          role: 'assistant',
          content: 'null',
          extra: 'tool_calls: [get_order_status(order_id="ORD-4091")]'
        },
        {
          role: 'tool',
          content: '{"order_id": "ORD-4091", "status": "ready_to_ship", "carrier_id": "CARRIER-SERV"}',
          extra: 'tool_call_id: "call_001"'
        },
        {
          role: 'assistant',
          content: 'null',
          extra: 'tool_calls: [get_shipping_provider(order_id="ORD-4091")]'
        },
        {
          role: 'tool',
          content: '{"carrier": "Servientrega", "tracking": "SE-992144", "eta": "24 horas"}',
          extra: 'tool_call_id: "call_002"'
        },
        {
          role: 'assistant',
          content: 'El pedido ORD-4091 se encuentra listo para despacho. Ha sido asignado a Servientrega con guía SE-992144 y entrega estimada en 24 horas.'
        }
      ]
    }
  ];

  activeIteration = signal<LoopIteration>(this.iterations[0]);
  showRawMessages = signal<boolean>(false);

  setIteration(num: number): void {
    const it = this.iterations.find(i => i.number === num);
    if (it) {
      this.activeIteration.set(it);
    }
  }

  nextIteration(): void {
    const current = this.activeIteration().number;
    if (current < this.iterations.length) {
      this.setIteration(current + 1);
    }
  }

  prevIteration(): void {
    const current = this.activeIteration().number;
    if (current > 1) {
      this.setIteration(current - 1);
    }
  }

  toggleRawMessages(): void {
    this.showRawMessages.update(v => !v);
  }

  isNodeActive(node: 'model' | 'decision' | 'action' | 'obs'): boolean {
    const it = this.activeIteration();
    if (node === 'model' || node === 'decision') return true;
    if (it.modelActionType === 'final_answer') return false;
    return true;
  }
}
