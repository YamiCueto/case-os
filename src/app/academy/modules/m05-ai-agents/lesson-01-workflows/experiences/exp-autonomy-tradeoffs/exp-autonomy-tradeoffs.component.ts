import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseProgressBarComponent, CaseCalloutComponent, CasePanelComponent } from '../../../../../../core/ui/components';

type AutonomyLevel = 'workflow' | 'routed' | 'agent';

interface Metrics {
  predictability: number; 
  flexibility: number;    
  cost: number;
  latency: number;
  risk: number;
  description: string;
}

@Component({
  selector: 'app-exp-autonomy-tradeoffs',
  standalone: true,
  imports: [CommonModule, FormsModule, CaseProgressBarComponent, CaseCalloutComponent, CasePanelComponent],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">El Costo de la Autonomía</h3>
        <p class="exp-subtitle">Ajusta el nivel de autonomía y observa cómo cambian los 5 indicadores operativos.</p>
      </div>

      <case-callout variant="info" message="Indicadores comparativos con propósito pedagógico. No representan benchmarks ni mediciones reales."></case-callout>

      <case-panel [elevation]="1" padding="md">
        <div class="slider-container">
          <label>Nivel de Autonomía</label>
          <input type="range" min="0" max="2" [ngModel]="sliderValue()" (ngModelChange)="updateSlider($event)" class="autonomy-slider">
          <div class="slider-labels">
            <span [class.active]="sliderValue() === 0">Deterministic</span>
            <span [class.active]="sliderValue() === 1">Model-Routed</span>
            <span [class.active]="sliderValue() === 2">Agent Loop</span>
          </div>
        </div>
      </case-panel>

      <case-panel [elevation]="2" padding="md" class="metrics-area">
        <div class="description-card">
          <h4>{{ getTitle() }}</h4>
          <p>{{ currentMetrics().description }}</p>
        </div>

        <div class="metric-grid">
          <div class="metric-group">
            <h5>Capacidades (Más alto = mejor)</h5>
            <div class="metric-item">
              <case-progress-bar [value]="currentMetrics().predictability" [max]="100" height="sm" variant="success" label="Predictibilidad ({{ currentMetrics().predictability }}%)"></case-progress-bar>
            </div>
            <div class="metric-item">
              <case-progress-bar [value]="currentMetrics().flexibility" [max]="100" height="sm" variant="accent" label="Flexibilidad ({{ currentMetrics().flexibility }}%)"></case-progress-bar>
            </div>
          </div>

          <div class="metric-group">
            <h5>Costos (Más alto = peor)</h5>
            <div class="metric-item">
              <case-progress-bar [value]="currentMetrics().cost" [max]="100" height="sm" variant="warning" label="Costo Relativo"></case-progress-bar>
            </div>
            <div class="metric-item">
              <case-progress-bar [value]="currentMetrics().latency" [max]="100" height="sm" variant="warning" label="Latencia Relativa"></case-progress-bar>
            </div>
            <div class="metric-item">
              <case-progress-bar [value]="currentMetrics().risk" [max]="100" height="sm" variant="error" label="Riesgo Operacional ({{ currentMetrics().risk }}%)"></case-progress-bar>
            </div>
          </div>
        </div>
      </case-panel>
    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
      padding: var(--case-space-6);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }
    
    .exp-header h3 { margin: 0 0 8px 0; color: var(--case-text-primary); }
    .exp-header p { margin: 0; color: var(--case-text-secondary); }

    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .slider-container label {
      font-weight: 600;
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.85rem;
    }
    
    .autonomy-slider {
      width: 100%;
      cursor: pointer;
      accent-color: var(--case-accent);
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--case-text-disabled);
      font-family: var(--case-font-mono);
    }
    .slider-labels span.active {
      color: var(--case-accent);
      font-weight: bold;
    }

    .metrics-area {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .description-card {
      background: var(--case-surface-3);
      padding: 16px;
      border-radius: var(--case-radius-md);
      border-left: 4px solid var(--case-accent);
    }
    .description-card h4 { margin: 0 0 8px 0; color: var(--case-text-primary); font-family: var(--case-font-mono); }
    .description-card p { margin: 0; color: var(--case-text-secondary); font-size: 0.95rem; line-height: 1.5; }

    .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    @media (max-width: 768px) {
      .metric-grid { grid-template-columns: 1fr; }
    }

    .metric-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .metric-group h5 {
      margin: 0 0 8px 0;
      color: var(--case-text-secondary);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--case-border);
      padding-bottom: 4px;
    }

    .metric-item {
      display: block;
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
export class ExpAutonomyTradeoffsComponent {
  sliderValue = signal<number>(0);

  private readonly metricsMap: Record<number, Metrics> = {
    0: {
      predictability: 95,
      flexibility: 10,
      cost: 5,
      latency: 5,
      risk: 10,
      description: 'El flujo está hardcoded. Sabemos exactamente qué pasará en cada paso. Cero tokens gastados en ruteo, respuesta inmediata. Poca flexibilidad ante variaciones inesperadas.'
    },
    1: {
      predictability: 80,
      flexibility: 50,
      cost: 30,
      latency: 35,
      risk: 30,
      description: 'El LLM decide el camino inicial. Pagamos el costo y latencia de UNA llamada al modelo por ticket. El riesgo aumenta ligeramente si el LLM clasifica mal, pero la ejecución sigue siendo un workflow determinista.'
    },
    2: {
      predictability: 30,
      flexibility: 95,
      cost: 90,
      latency: 90,
      risk: 85,
      description: 'El Agente decide en bucle. Alta flexibilidad para resolver problemas inéditos, pero latencia y costos pueden aumentar conforme incorporamos más inferencias, tool calls y decisiones durante la ejecución. Riesgo de entrar en loops infinitos o desviarse del objetivo.'
    }
  };

  currentMetrics = computed(() => {
    return this.metricsMap[this.sliderValue()];
  });

  updateSlider(val: number) {
    this.sliderValue.set(Number(val));
  }

  getTitle(): string {
    if (this.sliderValue() === 0) return 'Deterministic Workflow';
    if (this.sliderValue() === 1) return 'Model-Routed Workflow';
    return 'Agent Loop';
  }
}
