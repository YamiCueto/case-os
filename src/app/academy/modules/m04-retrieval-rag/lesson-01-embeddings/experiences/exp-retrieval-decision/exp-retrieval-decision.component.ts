import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type Strategy = 'lexical' | 'semantic' | 'hybrid';

interface Scenario {
  id: string;
  description: string;
  query: string;
  bestStrategy: Strategy;
  feedback: Record<Strategy, string>;
}

@Component({
  selector: 'app-exp-retrieval-decision',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Decisión Arquitectónica</h3>
        <p class="exp-subtitle">Como ingeniero, debes elegir la mejor estrategia de recuperación para cada escenario.</p>
      </div>

      <div class="exp-content">
        <!-- Scenarios list (left) -->
        <div class="exp-scenarios">
          @for (s of scenarios; track s.id; let i = $index) {
            <div 
              class="exp-scenario-card"
              [class.active]="currentScenarioIndex() === i"
              [class.completed]="isCompleted(s.id)"
              (click)="selectScenario(i)">
              
              <div class="exp-scenario-icon">
                @if (isCompleted(s.id)) {
                  <span class="material-symbols-outlined text-green">check_circle</span>
                } @else {
                  <span class="exp-scenario-num">{{ i + 1 }}</span>
                }
              </div>
              <div class="exp-scenario-title">Escenario {{ i + 1 }}</div>
            </div>
          }
        </div>

        <!-- Current Scenario details (right) -->
        <div class="exp-details">
          @if (currentScenario()) {
            <div class="exp-query-box">
              <span class="exp-query-label">El usuario busca:</span>
              <span class="exp-query-text">"{{ currentScenario()!.query }}"</span>
              <p class="exp-query-context">{{ currentScenario()!.description }}</p>
            </div>

            <div class="exp-question">
              <h4>¿Qué estrategia implementarías?</h4>
              
              <div class="exp-options">
                <button 
                  class="exp-option-btn" 
                  [class.selected]="selectedStrategy() === 'lexical'"
                  (click)="makeDecision('lexical')">
                  <div class="exp-opt-title">Búsqueda Léxica (BM25)</div>
                  <div class="exp-opt-desc">Coincidencia exacta de palabras</div>
                </button>
                
                <button 
                  class="exp-option-btn" 
                  [class.selected]="selectedStrategy() === 'semantic'"
                  (click)="makeDecision('semantic')">
                  <div class="exp-opt-title">Búsqueda Semántica</div>
                  <div class="exp-opt-desc">Embeddings y Similitud Coseno</div>
                </button>
                
                <button 
                  class="exp-option-btn" 
                  [class.selected]="selectedStrategy() === 'hybrid'"
                  (click)="makeDecision('hybrid')">
                  <div class="exp-opt-title">Búsqueda Híbrida (RRF)</div>
                  <div class="exp-opt-desc">Combina Léxica y Semántica</div>
                </button>
              </div>
            </div>

            <!-- Feedback Panel -->
            @if (feedbackMessage()) {
              <div class="exp-feedback" [class.success]="isCorrect()">
                <div class="exp-feedback-icon">
                  <span class="material-symbols-outlined">{{ isCorrect() ? 'verified' : 'info' }}</span>
                </div>
                <div class="exp-feedback-content">
                  <h4>{{ isCorrect() ? 'Decisión correcta' : 'Piénsalo de nuevo' }}</h4>
                  <p>{{ feedbackMessage() }}</p>
                  
                  @if (isCorrect() && currentScenarioIndex() < scenarios.length - 1) {
                    <button class="exp-btn exp-btn-primary mt-2" (click)="nextScenario()">Siguiente escenario</button>
                  } @else if (isCorrect()) {
                    <div class="exp-completion-badge mt-2">
                      <span class="material-symbols-outlined">emoji_events</span> ¡Has completado todos los escenarios!
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
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
    .exp-title { margin: 0 0 4px 0; color: var(--case-text-primary); }
    .exp-subtitle { margin: 0; color: var(--case-text-secondary); }

    .exp-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: var(--case-space-6);
      margin-top: var(--case-space-4);
    }
    @media (max-width: 768px) {
      .exp-content { grid-template-columns: 1fr; }
    }

    .exp-scenarios {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .exp-scenario-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: var(--case-space-3);
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-scenario-card:hover { background: var(--case-surface-4); }
    .exp-scenario-card.active {
      background: var(--case-surface-4);
      border-color: var(--case-color-info);
      box-shadow: 0 0 0 1px var(--case-color-info);
    }
    .exp-scenario-title {
      color: var(--case-text-primary);
    }
    .exp-scenario-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
    }
    .exp-scenario-num {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      background: var(--case-surface-5);
      color: var(--case-text-primary);
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .active .exp-scenario-num { background: var(--case-color-info); color: var(--case-text-on-accent); }
    .text-green { color: var(--case-color-success); }

    .exp-details {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-6);
    }

    .exp-query-box {
      background: var(--case-surface-3);
      border-left: 4px solid var(--case-color-info);
      padding: var(--case-space-4);
      border-radius: var(--case-radius);
    }
    .exp-query-label {
      font-size: 0.85rem;
      color: var(--case-text-secondary);
      display: block;
      margin-bottom: 4px;
    }
    .exp-query-text {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--case-text-primary);
      display: block;
      margin-bottom: 8px;
    }
    .exp-query-context {
      margin: 0;
      font-size: 0.9rem;
      color: var(--case-text-secondary);
    }

    .exp-question h4 { margin: 0 0 12px 0; color: var(--case-text-primary); }
    .exp-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .exp-option-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      padding: var(--case-space-4);
      background: var(--case-surface-1);
      border: 2px solid var(--case-border);
      border-radius: var(--case-radius-lg);
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-option-btn:hover { border-color: var(--case-border-strong); background: var(--case-surface-3); }
    .exp-option-btn.selected {
      border-color: var(--case-color-info);
      background: var(--case-surface-4);
    }
    .exp-opt-title { font-weight: bold; font-size: 0.95rem; margin-bottom: 4px; color: var(--case-text-primary); }
    .exp-opt-desc { font-size: 0.8rem; color: var(--case-text-secondary); }

    .exp-feedback {
      display: flex;
      gap: 16px;
      background: var(--case-color-error-bg);
      border: 1px solid var(--case-color-error);
      padding: var(--case-space-4);
      border-radius: var(--case-radius-md);
      color: var(--case-color-error);
      margin-top: 8px;
      animation: slideIn 0.3s ease-out;
    }
    .exp-feedback.success {
      background: var(--case-color-success-bg);
      border-color: var(--case-color-success);
      color: var(--case-color-success);
    }
    .exp-feedback h4 { margin: 0 0 8px 0; }
    .exp-feedback p { margin: 0; font-size: 0.9rem; color: var(--case-text-primary); }
    
    .mt-2 { margin-top: 16px; }
    .exp-btn {
      padding: 8px 16px;
      border-radius: var(--case-radius);
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-btn-primary { background: var(--case-color-success); color: var(--case-text-on-accent); }
    .exp-btn-primary:hover { background: var(--case-color-success-hover, #15803d); }
    
    .exp-completion-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--case-color-success-bg);
      color: var(--case-color-success);
      border-radius: var(--case-radius);
      font-weight: bold;
      font-size: 0.9rem;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ExpRetrievalDecisionComponent {

  scenarios: Scenario[] = [
    {
      id: 's1',
      query: 'Factura #100245',
      description: 'El usuario busca un documento específico de cobro en el historial.',
      bestStrategy: 'lexical',
      feedback: {
        lexical: '¡Correcto! Los IDs alfanuméricos y códigos exactos son el caso de uso perfecto para BM25. La coincidencia debe ser exacta.',
        semantic: 'Los embeddings son pésimos para buscar números o códigos exactos. "100245" y "100246" podrían tener vectores similares, devolviendo la factura equivocada.',
        hybrid: 'Aunque funcionaría, es un gasto innecesario de cómputo (embeddings) para un problema de coincidencia exacta.'
      }
    },
    {
      id: 's2',
      query: 'Quiero ahorrar para comprar una vivienda',
      description: 'El usuario expresa una necesidad abierta, sin conocer el nombre técnico del producto ("Cuenta Ahorro Programado Vivienda").',
      bestStrategy: 'semantic',
      feedback: {
        lexical: 'BM25 fallará si el documento oficial no contiene las palabras exactas "ahorrar" o "vivienda" (ej. si dice "Acumulación de capital para fines hipotecarios").',
        semantic: '¡Correcto! La intención del usuario coincide conceptualmente con los productos de ahorro y crédito hipotecario, incluso si no usa las mismas palabras.',
        hybrid: 'Es una buena opción, pero en consultas puramente conversacionales, la semántica por sí sola suele ser suficiente y más eficiente.'
      }
    },
    {
      id: 's3',
      query: 'Error de timeout en la base de datos SQL Server',
      description: 'Un desarrollador buscando documentación técnica en la base de conocimiento de la empresa.',
      bestStrategy: 'hybrid',
      feedback: {
        lexical: 'Falla porque "timeout" puede aparecer en muchos contextos, y "error de base de datos" requiere comprensión semántica.',
        semantic: 'Falla porque "SQL Server" es un término muy específico que podría diluirse en el embedding comparado con otros motores de DB.',
        hybrid: '¡Correcto! La semántica entiende el contexto del problema (error de conexión), mientras que la léxica asegura que los resultados incluyan específicamente "SQL Server".'
      }
    }
  ];

  currentScenarioIndex = signal(0);
  selectedStrategy = signal<Strategy | null>(null);
  
  completedScenarios = signal<Set<string>>(new Set());

  currentScenario = computed(() => this.scenarios[this.currentScenarioIndex()]);
  
  feedbackMessage = computed(() => {
    const strategy = this.selectedStrategy();
    const scenario = this.currentScenario();
    if (!strategy || !scenario) return null;
    return scenario.feedback[strategy];
  });

  isCorrect = computed(() => {
    const strategy = this.selectedStrategy();
    const scenario = this.currentScenario();
    if (!strategy || !scenario) return false;
    return strategy === scenario.bestStrategy;
  });

  isCompleted(id: string): boolean {
    return this.completedScenarios().has(id);
  }

  selectScenario(index: number) {
    this.currentScenarioIndex.set(index);
    this.selectedStrategy.set(null);
  }

  makeDecision(strategy: Strategy) {
    this.selectedStrategy.set(strategy);
    if (strategy === this.currentScenario().bestStrategy) {
      const updated = new Set(this.completedScenarios());
      updated.add(this.currentScenario().id);
      this.completedScenarios.set(updated);
    }
  }

  nextScenario() {
    if (this.currentScenarioIndex() < this.scenarios.length - 1) {
      this.currentScenarioIndex.set(this.currentScenarioIndex() + 1);
      this.selectedStrategy.set(null);
    }
  }
}
