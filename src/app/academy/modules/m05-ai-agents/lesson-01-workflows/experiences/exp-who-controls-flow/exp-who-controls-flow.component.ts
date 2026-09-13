import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseButtonComponent, CaseBadgeComponent, CasePanelComponent } from '../../../../../../core/ui/components';

@Component({
  selector: 'app-exp-who-controls-flow',
  standalone: true,
  imports: [CommonModule, CaseButtonComponent, CaseBadgeComponent, CasePanelComponent],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">¿Quién controla el flujo?</h3>
        <p class="exp-subtitle">Simula el procesamiento de un ticket usando reglas estrictas (Workflow Determinista) vs extracción semántica (Model-Routed Workflow).</p>
      </div>

      <div class="ticket-input-area">
        <label>Ticket entrante del usuario (ambiguo / complejo):</label>
        <div class="ticket-input">
          "Quiero devolver el producto porque me cobraron dos veces, pero perdí el número de orden y mi app se cierra sola."
        </div>
      </div>

      <div class="split-view">
        <!-- Deterministic Flow -->
        <case-panel [elevation]="1" padding="md" class="flow-panel">
          <div class="flow-header">
            <h4>Flujo Determinista</h4>
            <case-badge variant="info">Excelente para flujos conocidos</case-badge>
          </div>
          <p class="flow-desc">Rápido, 100% predecible y seguro. Falla cuando el input se desvía de los casos previstos por el programador en el código.</p>
          
          <case-button variant="secondary" (click)="runDeterministic()" [disabled]="isRunningDet()" class="run-btn">
            Ejecutar Reglas IF-ELSE
          </case-button>

          <div class="flow-visualization">
            <div class="node" [class.node--active]="detState() === 'checking'" [class.node--passed]="detState() === 'failed'">
              <code>if (text.includes('devolver'))</code>
            </div>
            <div class="arrow" [class.arrow--active]="detState() === 'checking'">↓</div>
            <div class="node" [class.node--active]="detState() === 'checking_order'" [class.node--passed]="detState() === 'failed'">
              <code>if (hasOrderNumber(text))</code>
            </div>
            <div class="arrow" [class.arrow--active]="detState() === 'checking_order'">↓</div>
            
            @if (detState() === 'failed') {
              <div class="node node--error bounce-in">
                <span class="material-symbols-outlined">error</span>
                Error: Falta número de orden. Ticket descartado o requiere humano.
              </div>
            } @else {
              <div class="node node--empty">Esperando ejecución...</div>
            }
          </div>
        </case-panel>

        <!-- Model-Routed Flow -->
        <case-panel [elevation]="1" padding="md" class="flow-panel">
          <div class="flow-header">
            <h4>Model-Routed Workflow</h4>
            <case-badge variant="accent">Útil para clasificación semántica</case-badge>
          </div>
          <p class="flow-desc">El LLM interpreta la ambigüedad y extrae intención. Luego, el software vuelve a tomar el control para ejecutar la acción de forma determinista.</p>
          
          <case-button variant="primary" (click)="runModelRouted()" [disabled]="isRunningModel()" class="run-btn">
            Enrutar con LLM
          </case-button>

          <div class="flow-visualization">
            <div class="node node--llm" [class.node--active]="modelState() === 'thinking'" [class.node--passed]="modelState() === 'routed'">
              <span class="material-symbols-outlined icon-spin" *ngIf="modelState() === 'thinking'">sync</span>
              <code>llm.generate(prompt)</code>
            </div>
            <div class="arrow" [class.arrow--active]="modelState() === 'thinking'">↓</div>
            
            @if (modelState() === 'routed') {
              <div class="node node--success bounce-in" style="text-align: left;">
                <strong>Output JSON:</strong><br/>
                <code>
                  &#123;<br/>
                  &nbsp;&nbsp;"intent": "multiple_issues",<br/>
                  &nbsp;&nbsp;"sub_intents": ["refund", "billing_error", "tech_bug"],<br/>
                  &nbsp;&nbsp;"missing_data": ["order_number"],<br/>
                  &nbsp;&nbsp;"action": "route_to_human_tier_2"<br/>
                  &#125;
                </code>
              </div>
            } @else {
              <div class="node node--empty">Esperando ejecución...</div>
            }
          </div>
        </case-panel>
      </div>

      @if (detState() === 'failed' && modelState() === 'routed') {
        <div class="exp-conclusion slide-up">
          <span class="material-symbols-outlined text-info">lightbulb</span>
          <p><strong>Observación:</strong> Ningún nivel es universalmente mejor. El flujo determinista falló aquí porque el input era complejo, pero para casos simples (ej. "quiero restablecer mi password"), es superior por su costo y velocidad. En el Model-Routed, <strong>el modelo propone/rutea. El software ejecuta.</strong></p>
        </div>
      }
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
    
    .exp-header h3 { margin: 0 0 8px 0; color: var(--case-text-primary); }
    .exp-header p { margin: 0; color: var(--case-text-secondary); }

    .ticket-input-area {
      background: var(--case-surface-1);
      padding: 16px;
      border-radius: var(--case-radius-md);
      border: 1px dashed var(--case-border-strong);
    }
    .ticket-input-area label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ticket-input {
      margin-top: 8px;
      font-style: italic;
      color: var(--case-text-primary);
      font-size: 1.1rem;
    }

    .split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 768px) {
      .split-view { grid-template-columns: 1fr; }
    }

    .flow-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }

    .flow-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .flow-header h4 { margin: 0; font-size: 1.1rem; }

    .flow-desc {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
      color: var(--case-text-secondary);
      min-height: 60px;
    }

    .run-btn { margin-top: 8px; align-self: flex-start; }

    .flow-visualization {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-height: 200px;
    }

    .node {
      padding: 12px 16px;
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius);
      width: 100%;
      text-align: center;
      transition: transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
      font-family: var(--case-font-mono);
      font-size: 0.85rem;
    }

    .node--empty {
      background: transparent;
      border-style: dashed;
      color: var(--case-text-disabled);
    }

    .node--active {
      border-color: var(--case-accent);
      background: var(--case-accent-subtle);
      color: var(--case-text-on-accent);
      transform: scale(1.05);
      box-shadow: 0 0 15px var(--case-accent-subtle);
    }

    .node--passed {
      border-color: var(--case-border-strong);
      opacity: 0.7;
    }

    .node--llm {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .node--error {
      background: var(--case-color-error-bg);
      border-color: var(--case-color-error);
      color: var(--case-color-error);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .node--success {
      background: var(--case-color-success-bg);
      border-color: var(--case-color-success);
      color: var(--case-color-success);
    }

    .arrow {
      color: var(--case-text-disabled);
      font-weight: bold;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .arrow--active {
      color: var(--case-accent);
      transform: scale(1.5);
    }

    .icon-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
    
    .bounce-in {
      animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .exp-conclusion {
      margin-top: 16px;
      padding: 16px;
      background: var(--case-color-info-bg);
      border-left: 4px solid var(--case-color-info);
      border-radius: var(--case-radius);
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .exp-conclusion p { margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--case-text-primary); }
    .text-info { color: var(--case-color-info); }
    
    .slide-up {
      animation: slideUp 0.4s ease-out forwards;
    }
    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transform: none !important;
      }
    }
  `]
})
export class ExpWhoControlsFlowComponent {
  detState = signal<'idle' | 'checking' | 'checking_order' | 'failed'>('idle');
  modelState = signal<'idle' | 'thinking' | 'routed'>('idle');

  isRunningDet = signal(false);
  isRunningModel = signal(false);

  runDeterministic() {
    this.isRunningDet.set(true);
    this.detState.set('checking');
    
    setTimeout(() => {
      this.detState.set('checking_order');
      
      setTimeout(() => {
        this.detState.set('failed');
        this.isRunningDet.set(false);
      }, 800);
      
    }, 800);
  }

  runModelRouted() {
    this.isRunningModel.set(true);
    this.modelState.set('thinking');
    
    setTimeout(() => {
      this.modelState.set('routed');
      this.isRunningModel.set(false);
    }, 1500);
  }
}
