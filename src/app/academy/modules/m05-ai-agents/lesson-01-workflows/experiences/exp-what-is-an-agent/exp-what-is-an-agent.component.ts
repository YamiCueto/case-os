import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseButtonComponent, CasePanelComponent } from '../../../../../../core/ui/components';

interface Scenario {
  id: string;
  description: string;
  correctType: 'llm' | 'workflow' | 'tool' | 'agent';
  feedback?: {
    isCorrect: boolean;
    message: string;
  };
}

@Component({
  selector: 'app-exp-what-is-an-agent',
  standalone: true,
  imports: [CommonModule, CaseButtonComponent, CasePanelComponent],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Taxonomía Operacional: Evaluando Autonomía</h3>
        <p class="exp-subtitle">Lee cada caso y determina el nivel de autonomía empleado en la solución.</p>
      </div>

      <div class="scenarios-list">
        @for (scenario of scenarios(); track scenario.id) {
          <case-panel [elevation]="1" padding="md" [class.success-panel]="scenario.feedback?.isCorrect" [class.error-panel]="scenario.feedback && !scenario.feedback.isCorrect">
            <p class="scenario-desc">{{ scenario.description }}</p>
            
            <div class="scenario-actions" [class.disabled]="scenario.feedback?.isCorrect">
              <case-button variant="secondary" (click)="classify(scenario.id, 'llm')" [disabled]="scenario.feedback?.isCorrect || false">
                LLM Call
              </case-button>
              <case-button variant="secondary" (click)="classify(scenario.id, 'workflow')" [disabled]="scenario.feedback?.isCorrect || false">
                Workflow Determinista
              </case-button>
              <case-button variant="secondary" (click)="classify(scenario.id, 'tool')" [disabled]="scenario.feedback?.isCorrect || false">
                Tool-Using / Model-Routed
              </case-button>
              <case-button variant="secondary" (click)="classify(scenario.id, 'agent')" [disabled]="scenario.feedback?.isCorrect || false">
                Agent Loop
              </case-button>
            </div>
            
            @if (scenario.feedback) {
              <div class="scenario-feedback" aria-live="polite">
                <span class="material-symbols-outlined" aria-hidden="true">{{ scenario.feedback.isCorrect ? 'check_circle' : 'cancel' }}</span>
                <span>{{ scenario.feedback.message }}</span>
              </div>
            }
          </case-panel>
        }
      </div>
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

    .scenarios-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .success-panel {
      border-color: var(--case-color-success) !important;
      background-color: var(--case-color-success-bg) !important;
    }
    
    .error-panel {
      border-color: var(--case-color-error) !important;
      background-color: var(--case-color-error-bg) !important;
    }

    .scenario-desc {
      margin: 0 0 16px 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--case-text-primary);
    }

    .scenario-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .scenario-actions.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .scenario-feedback {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--case-border);
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.9rem;
    }
    
    .success-panel .scenario-feedback { color: var(--case-color-success); border-top-color: rgba(16, 185, 129, 0.2); }
    .error-panel .scenario-feedback { color: var(--case-color-error); border-top-color: rgba(239, 68, 68, 0.2); }

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
export class ExpWhatIsAnAgentComponent {
  scenarios = signal<Scenario[]>([
    {
      id: 's0',
      description: 'El usuario envía un texto a un modelo para que resuma su contenido. El modelo genera el resumen y se lo entrega de vuelta al usuario.',
      correctType: 'llm',
    },
    {
      id: 's0b',
      description: 'Un script de Python lee un correo, extrae el remitente usando expresiones regulares (regex) y lo guarda en una base de datos PostgreSQL.',
      correctType: 'workflow',
    },
    {
      id: 's1',
      description: 'El modelo decide que necesita buscar en la base de datos de tickets. Devuelve un JSON solicitando la ejecución de `search_tickets`. El sistema extrae el JSON, ejecuta la consulta SQL, y envía esos tickets crudos al usuario por email.',
      correctType: 'tool',
    },
    {
      id: 's2',
      description: 'El modelo usa `search_tickets` para obtener los errores reportados. El sistema le inyecta el resultado de vuelta al prompt del modelo (como una observación). El modelo lee los tickets, nota que falta un log específico, y decide llamar a `fetch_logs` antes de finalizar.',
      correctType: 'agent',
    }
  ]);

  classify(scenarioId: string, answer: 'llm' | 'workflow' | 'tool' | 'agent') {
    this.scenarios.update(current => {
      return current.map(s => {
        if (s.id === scenarioId) {
          const isCorrect = s.correctType === answer;
          let message = '';
          
          if (isCorrect) {
            if (s.id === 's0') message = 'Correcto. Esto es una simple llamada al modelo (User -> LLM -> Response).';
            if (s.id === 's0b') message = 'Correcto. Es un flujo determinista, controlado 100% por reglas en código rígido.';
            if (s.id === 's1') message = 'Correcto. El modelo decidió usar una herramienta o enrutar, pero el sistema completó el trabajo de forma predecible sin volver a preguntarle al modelo. NO hubo retroalimentación (Loop).';
            if (s.id === 's2') message = '¡Exacto! El resultado de la primera herramienta detonó una nueva decisión del modelo. Esto es un Agent Loop clásico.';
          } else {
            if (answer === 'agent' && s.correctType === 'tool') {
              message = 'Incorrecto. Algunas herramientas/frameworks pueden denominarlo agente, pero CASE separa Tool-Using Workflow de Agent Loop para hacer visible si la observación produce o no una nueva ronda de decisión. Aquí no la hubo.';
            } else if (s.id === 's0') message = 'Incorrecto. No hay herramientas externas, ciclos, ni control de flujo en código involucrado, solo generación de texto.';
            else if (s.id === 's0b') message = 'Incorrecto. No interviene ningún LLM en las decisiones de ruteo ni en el procesamiento del lenguaje aquí.';
            else if (s.id === 's1') message = 'Incorrecto. Observa bien dónde termina el flujo: la ejecución termina en el sistema/usuario, no regresa al modelo.';
            else if (s.id === 's2') message = 'Incorrecto. Nota que el modelo evalúa el resultado de la primera herramienta y toma una SEGUNDA decisión iterativa basándose en su nueva "observación".';
          }

          return { ...s, feedback: { isCorrect, message } };
        }
        return s;
      });
    });
  }
}
