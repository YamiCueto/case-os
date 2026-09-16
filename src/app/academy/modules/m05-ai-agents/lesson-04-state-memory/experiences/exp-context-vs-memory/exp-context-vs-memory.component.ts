import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TurnMetrics {
  turn: number;
  strategyATokens: number;
  strategyBTokens: number;
  strategyAMessages: number;
  strategyBMessages: number;
  retainedMemoriesCount: number;
  description: string;
}

@Component({
  selector: 'app-exp-context-vs-memory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-context" role="region" aria-label="Simulador Context Window vs Memory Store">
      <!-- Header -->
      <div class="exp-header">
        <div class="exp-header__title-group">
          <span class="material-symbols-outlined exp-header__icon" aria-hidden="true">tune</span>
          <div>
            <div class="exp-header__title">Context Window vs Memory Store</div>
            <div class="exp-header__subtitle">Control de explosión de tokens: Acumular todo vs Contexto acotado con memoria</div>
          </div>
        </div>
        <div class="strategy-badge">
          Turno seleccionado: <strong>Turno {{ currentMetrics.turn }}</strong>
        </div>
      </div>

      <!-- Disclaimer de Simulación Didáctica -->
      <div class="simulation-disclaimer">
        <span class="material-symbols-outlined disclaimer-icon" aria-hidden="true">info</span>
        <span>
          <strong>SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS:</strong> Las cifras mostradas representan un escenario pedagógico para ilustrar la diferencia de orden de magnitud entre acumular todo y usar memoria acotada. El consumo real de tokens depende del tokenizer, modelo, system prompt, schemas de herramientas y recuerdos recuperados.
        </span>
      </div>

      <!-- Selector de Turnos -->
      <div class="turn-selector">
        <span class="selector-label">Simular avance de conversación:</span>
        <div class="selector-buttons">
          @for (m of turnSeries; track m.turn) {
            <button
              type="button"
              class="turn-btn"
              [class.turn-btn--active]="selectedTurn === m.turn"
              (click)="setTurn(m.turn)"
            >
              Turno {{ m.turn }}
            </button>
          }
        </div>
      </div>

      <!-- Comparativa Lado a Lado -->
      <div class="strategies-grid">
        <!-- Estrategia A: Acumulación Ciega -->
        <div class="strategy-card strategy-card--naive">
          <div class="strategy-card__header">
            <div class="strategy-tag strategy-tag--naive">Estrategia A: Acumular Todo</div>
            <span class="material-symbols-outlined icon-alert" aria-hidden="true">warning</span>
          </div>
          <div class="strategy-metric">
            <span class="metric-num">{{ currentMetrics.strategyATokens | number }}</span>
            <span class="metric-unit">tokens inyectados</span>
          </div>

          <div class="token-bar-wrapper">
            <div class="token-bar token-bar--naive" [style.width.%]="getBarWidthA()"></div>
          </div>

          <ul class="strategy-specs">
            <li><strong>Mensajes en contexto:</strong> {{ currentMetrics.strategyAMessages }} turnos completos</li>
            <li><strong>Latencia por turno:</strong> Proporcional a la ventana en expansión</li>
            <li><strong>Riesgo:</strong> Desbordamiento de ventana + atención diluida por ruido</li>
          </ul>

          <div class="strategy-state-box">
            <div class="box-title">Ventana enviada al LLM:</div>
            <div class="box-content box-content--bloat">
              [Mensaje 1 (hola)] → [Tool Call 1] → [Observación 12kb] → [Mensaje 2] → ... → [Mensaje {{ currentMetrics.turn }}]
            </div>
          </div>
        </div>

        <!-- Estrategia B: Contexto Acotado + Memoria Estructurada -->
        <div class="strategy-card strategy-card--smart">
          <div class="strategy-card__header">
            <div class="strategy-tag strategy-tag--smart">Estrategia B: Contexto Acotado + Memoria</div>
            <span class="material-symbols-outlined icon-check" aria-hidden="true">verified</span>
          </div>
          <div class="strategy-metric">
            <span class="metric-num text-success">{{ currentMetrics.strategyBTokens | number }}</span>
            <span class="metric-unit">tokens inyectados</span>
          </div>

          <div class="token-bar-wrapper">
            <div class="token-bar token-bar--smart" [style.width.%]="getBarWidthB()"></div>
          </div>

          <ul class="strategy-specs">
            <li><strong>Ventana activa:</strong> Últimos 4 mensajes (sliding window)</li>
            <li><strong>Hechos recuperados:</strong> {{ currentMetrics.retainedMemoriesCount }} recuerdos seleccionados</li>
            <li><strong>Resultado:</strong> Crecimiento controlado, acotado y más predecible</li>
          </ul>

          <div class="strategy-state-box">
            <div class="box-title">Ventana enviada al LLM:</div>
            <div class="box-content box-content--clean">
              <span class="mem-pill">[MEMORIA: cliente='C-17', plan='pro']</span> + [Turno {{ currentMetrics.turn - 1 }}] + [Turno {{ currentMetrics.turn }}]
            </div>
          </div>
        </div>
      </div>

      <!-- Nota de Arquitectura Clave -->
      <div class="axiom-banner">
        <div class="axiom-banner__header">
          <span class="material-symbols-outlined" aria-hidden="true">lightbulb</span>
          <span class="axiom-title">Axioma de Ingeniería M05</span>
        </div>
        <p class="axiom-quote">
          <em>"Context is what the model receives now. Memory is what the application can retrieve later."</em>
        </p>
        <p class="axiom-desc">
          La memoria recuperada <strong>también consume tokens</strong>, por lo que el consumo no es matemáticamente plano; sin embargo, al sustituir cientos de mensajes de ruido acumulado por un bloque compacto de hechos verificados, mantenemos el crecimiento de la ventana <strong>acotado, controlado y mucho más predecible</strong>.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .exp-context {
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      padding: var(--case-space-5, 20px);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .exp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
    }

    .exp-header__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .exp-header__icon {
      font-size: 1.6rem;
      color: var(--case-color-info, #38bdf8);
    }

    .exp-header__title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8f8f2);
    }

    .exp-header__subtitle {
      font-size: 0.8rem;
      color: var(--case-text-muted, #71717a);
    }

    .strategy-badge {
      font-size: 0.78rem;
      color: var(--case-text-secondary, #a1a1aa);
      background: var(--case-surface-2, #181920);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--case-border, #282a36);
    }

    .strategy-badge strong {
      color: var(--case-accent, #6366f1);
    }

    .simulation-disclaimer {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 6px;
      font-size: 0.76rem;
      line-height: 1.45;
      color: var(--case-text-secondary, #a1a1aa);
    }

    .simulation-disclaimer strong {
      color: var(--case-color-info, #38bdf8);
    }

    .disclaimer-icon {
      font-size: 1.1rem;
      color: var(--case-color-info, #38bdf8);
      flex-shrink: 0;
      margin-top: 1px;
    }

    .turn-selector {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .selector-label {
      font-size: 0.82rem;
      color: var(--case-text-secondary, #a1a1aa);
      font-weight: 600;
    }

    .selector-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .turn-btn {
      padding: 6px 12px;
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 6px;
      color: var(--case-text-secondary, #a1a1aa);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .turn-btn:hover {
      background: var(--case-surface-3, #21222c);
      color: #ffffff;
    }

    .turn-btn--active {
      background: var(--case-accent, #6366f1);
      border-color: var(--case-accent, #6366f1);
      color: #ffffff;
      font-weight: 700;
    }

    .strategies-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 850px) {
      .strategies-grid {
        grid-template-columns: 1fr;
      }
    }

    .strategy-card {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .strategy-card--naive {
      border-color: rgba(239, 68, 68, 0.25);
    }

    .strategy-card--smart {
      border-color: rgba(16, 185, 129, 0.25);
    }

    .strategy-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .strategy-tag {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .strategy-tag--naive {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .strategy-tag--smart {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .icon-alert { color: #ef4444; font-size: 1.2rem; }
    .icon-check { color: #10b981; font-size: 1.2rem; }

    .strategy-metric {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .metric-num {
      font-size: 1.8rem;
      font-weight: 800;
      font-family: var(--case-font-mono, monospace);
      color: #ef4444;
    }

    .metric-num.text-success {
      color: #10b981;
    }

    .metric-unit {
      font-size: 0.78rem;
      color: var(--case-text-muted, #71717a);
    }

    .token-bar-wrapper {
      width: 100%;
      height: 8px;
      background: var(--case-surface-1, #13141c);
      border-radius: 4px;
      overflow: hidden;
    }

    .token-bar {
      height: 100%;
      transition: width 0.3s ease;
    }

    .token-bar--naive {
      background: #ef4444;
    }

    .token-bar--smart {
      background: #10b981;
    }

    .strategy-specs {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.8rem;
      color: var(--case-text-secondary, #a1a1aa);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .strategy-specs strong {
      color: var(--case-text-primary, #ffffff);
    }

    .strategy-state-box {
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border-subtle, #232530);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .box-title {
      font-size: 0.7rem;
      font-family: var(--case-font-mono, monospace);
      color: var(--case-text-muted, #71717a);
      text-transform: uppercase;
    }

    .box-content {
      font-family: var(--case-font-mono, monospace);
      font-size: 0.74rem;
      line-height: 1.4;
      word-break: break-word;
    }

    .box-content--bloat {
      color: #ffb86c;
    }

    .box-content--clean {
      color: #8be9fd;
    }

    .mem-pill {
      background: rgba(99, 102, 241, 0.2);
      color: var(--case-accent, #6366f1);
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 700;
    }

    .axiom-banner {
      background: rgba(99, 102, 241, 0.06);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .axiom-banner__header {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--case-accent, #6366f1);
    }

    .axiom-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .axiom-quote {
      font-size: 0.9rem;
      color: var(--case-text-primary, #ffffff);
      margin: 0;
      font-weight: 600;
    }

    .axiom-desc {
      font-size: 0.8rem;
      color: var(--case-text-secondary, #a1a1aa);
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class ExpContextVsMemoryComponent {
  selectedTurn = 10;

  readonly turnSeries: TurnMetrics[] = [
    {
      turn: 1,
      strategyATokens: 950,
      strategyBTokens: 950,
      strategyAMessages: 2,
      strategyBMessages: 2,
      retainedMemoriesCount: 0,
      description: 'Consulta inicial del pedido ORD-4091.'
    },
    {
      turn: 5,
      strategyATokens: 5800,
      strategyBTokens: 1400,
      strategyAMessages: 10,
      strategyBMessages: 4,
      retainedMemoriesCount: 1,
      description: 'Consultas sucesivas sobre estado, transportadora y fecha estimada.'
    },
    {
      turn: 10,
      strategyATokens: 14200,
      strategyBTokens: 1750,
      strategyAMessages: 20,
      strategyBMessages: 4,
      retainedMemoriesCount: 2,
      description: 'El contexto de A ya supera 14k tokens de logs e historiales pasados.'
    },
    {
      turn: 20,
      strategyATokens: 31000,
      strategyBTokens: 2100,
      strategyAMessages: 40,
      strategyBMessages: 4,
      retainedMemoriesCount: 3,
      description: 'Estrategia A roza el límite de contexto con costos disparados.'
    },
    {
      turn: 30,
      strategyATokens: 48500,
      strategyBTokens: 2350,
      strategyAMessages: 60,
      strategyBMessages: 4,
      retainedMemoriesCount: 3,
      description: 'Estrategia A colapsa por costo y ruido; Estrategia B se mantiene acotada.'
    }
  ];

  get currentMetrics(): TurnMetrics {
    return this.turnSeries.find(t => t.turn === this.selectedTurn) || this.turnSeries[2];
  }

  setTurn(turn: number): void {
    this.selectedTurn = turn;
  }

  getBarWidthA(): number {
    return Math.min(100, Math.round((this.currentMetrics.strategyATokens / 50000) * 100));
  }

  getBarWidthB(): number {
    return Math.min(100, Math.round((this.currentMetrics.strategyBTokens / 50000) * 100));
  }
}
