import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Iteration {
  step: number;
  intent: string;
  actionTaken?: string;
  observation?: string;
}

@Component({
  selector: 'app-agent-loop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-loop.html',
  styleUrls: ['./agent-loop.css']
})
export class AgentLoopLab {
  maxIterations = 5;
  currentStep = signal(1);
  status = signal<'RUNNING' | 'SUCCESS' | 'FAILED'>('RUNNING');
  
  history = signal<Iteration[]>([
    {
      step: 1,
      intent: 'Necesito encontrar la política de reembolso de viajes para poder enviarla por email al manager.',
    }
  ]);

  hasSearched = signal(false);
  hasEmailed = signal(false);

  executeSearch() {
    if (this.status() !== 'RUNNING') return;
    
    this.addObservation(
      'call searchKnowledge(query="política reembolso viajes")',
      'Found Document: "Los reembolsos de viaje tienen un límite de $50 diarios para comidas y requieren factura obligatoria. Los vuelos deben ser en clase turista."'
    );
    this.hasSearched.set(true);
    this.prepareNextStep();
  }

  executeMath() {
    if (this.status() !== 'RUNNING') return;
    
    this.addObservation(
      'call calculateMath(expression="50 * 5")',
      'Result: 250'
    );
    this.prepareNextStep();
  }

  executeEmail() {
    if (this.status() !== 'RUNNING') return;
    
    if (!this.hasSearched()) {
      this.addObservation(
        'call sendEmail(to="manager@empresa.com", body="Aquí está la política.")',
        'Error: El cuerpo del mensaje no contiene la política detallada. El LLM está alucinando información.'
      );
    } else {
      this.addObservation(
        'call sendEmail(to="manager@empresa.com", body="Límite $50 diarios, requiere factura, clase turista.")',
        'Success: Email enviado correctamente a manager@empresa.com'
      );
      this.hasEmailed.set(true);
    }
    this.prepareNextStep();
  }

  finishLoop() {
    if (this.status() !== 'RUNNING') return;
    
    if (this.hasSearched() && this.hasEmailed()) {
      this.addObservation('Return Final Answer', 'He buscado la política y enviado el resumen al manager.');
      this.status.set('SUCCESS');
    } else {
      this.addObservation('Return Final Answer', 'Error fatal: El agente intentó terminar antes de completar los objetivos.');
      this.status.set('FAILED');
    }
  }

  private addObservation(action: string, obs: string) {
    this.history.update(h => {
      const current = h[h.length - 1];
      current.actionTaken = action;
      current.observation = obs;
      return [...h];
    });
  }

  private prepareNextStep() {
    if (this.status() !== 'RUNNING') return;

    if (this.currentStep() >= this.maxIterations && !this.hasEmailed()) {
      this.history.update(h => [
        ...h,
        { step: this.currentStep() + 1, intent: 'SYSTEM HALTED: Max iterations reached (5/5). Infinite loop prevented.' }
      ]);
      this.status.set('FAILED');
      return;
    }

    if (this.status() === 'RUNNING') {
      this.currentStep.update(s => s + 1);
      
      let nextIntent = '';
      if (!this.hasSearched()) {
        nextIntent = 'La última acción falló o no me dio la política. Debo buscar la política de reembolso de viajes.';
      } else if (this.hasSearched() && !this.hasEmailed()) {
        nextIntent = 'Ya tengo la política. Ahora debo redactar y enviar un email a manager@empresa.com con los detalles.';
      } else if (this.hasEmailed()) {
        nextIntent = 'He enviado el email correctamente. Ya puedo devolver la respuesta final al usuario y terminar el ciclo.';
      }

      this.history.update(h => [
        ...h,
        { step: this.currentStep(), intent: nextIntent }
      ]);
    }
  }

  resetLab() {
    this.currentStep.set(1);
    this.status.set('RUNNING');
    this.hasSearched.set(false);
    this.hasEmailed.set(false);
    this.history.set([
      {
        step: 1,
        intent: 'Necesito encontrar la política de reembolso de viajes para poder enviarla por email al manager.',
      }
    ]);
  }
}
