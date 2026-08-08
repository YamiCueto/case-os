import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Iteration {
  step: number;
  intent: string;
  actionTaken?: string;
  observation?: string;
  stateUpdate?: string;
}

@Component({
  selector: 'app-demo-agent-loop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-agent-loop.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoAgentLoop {
  maxIterations = 5;
  currentStep = signal(1);
  status = signal<'RUNNING' | 'SUCCESS' | 'FAILED'>('RUNNING');
  
  history = signal<Iteration[]>([
    {
      step: 1,
      intent: 'Goal: Find the travel reimbursement policy and email it to manager@empresa.com. Status: Initializing.',
    }
  ]);

  hasSearched = signal(false);
  hasEmailed = signal(false);

  executeSearch() {
    if (this.status() !== 'RUNNING') return;
    
    this.addObservation(
      'call tool: searchKnowledge(query="política reembolso viajes")',
      'Found Document: "Los reembolsos de viaje tienen un límite de $50 diarios para comidas y requieren factura obligatoria. Los vuelos deben ser en clase turista."',
      'Context loaded. Next step: format and send email.'
    );
    this.hasSearched.set(true);
    this.prepareNextStep();
  }

  executeMath() {
    if (this.status() !== 'RUNNING') return;
    
    this.addObservation(
      'call tool: calculateMath(expression="50 * 5")',
      'Result: 250',
      'Calculation stored in context.'
    );
    this.prepareNextStep();
  }

  executeEmail() {
    if (this.status() !== 'RUNNING') return;
    
    if (!this.hasSearched()) {
      this.addObservation(
        'call tool: sendEmail(to="manager@empresa.com", body="Aquí está la política.")',
        'Error: Message body lacks details. Guardrail activated (Missing required context).',
        'Email failed. Must retrieve policy first.'
      );
    } else {
      this.addObservation(
        'call tool: sendEmail(to="manager@empresa.com", body="Límite $50 diarios, requiere factura, clase turista.")',
        'Success: Email sent to manager@empresa.com',
        'Goal achieved. Ready to terminate loop.'
      );
      this.hasEmailed.set(true);
    }
    this.prepareNextStep();
  }

  finishLoop() {
    if (this.status() !== 'RUNNING') return;
    
    if (this.hasSearched() && this.hasEmailed()) {
      this.addObservation('Final Answer (Return)', 'He buscado la política y enviado el resumen al manager.', 'Terminal state reached successfully.');
      this.status.set('SUCCESS');
    } else {
      this.addObservation('Final Answer (Return)', 'SYSTEM ERROR: Agent attempted to terminate before completing required sub-tasks.', 'Terminal state reached with failure.');
      this.status.set('FAILED');
    }
  }

  private addObservation(action: string, obs: string, state: string) {
    this.history.update(h => {
      const current = h[h.length - 1];
      current.actionTaken = action;
      current.observation = obs;
      current.stateUpdate = state;
      return [...h];
    });
  }

  private prepareNextStep() {
    if (this.status() !== 'RUNNING') return;

    if (this.currentStep() >= this.maxIterations && !this.hasEmailed()) {
      this.history.update(h => [
        ...h,
        { step: this.currentStep() + 1, intent: 'SYSTEM HALTED: Max iterations reached (5/5). Loop terminated to prevent runaway execution.' }
      ]);
      this.status.set('FAILED');
      return;
    }

    if (this.status() === 'RUNNING') {
      this.currentStep.update(s => s + 1);
      
      let nextIntent = '';
      if (!this.hasSearched()) {
        nextIntent = 'Decision: Must search for travel reimbursement policy.';
      } else if (this.hasSearched() && !this.hasEmailed()) {
        nextIntent = 'Decision: Must compose and send email to manager@empresa.com with policy details.';
      } else if (this.hasEmailed()) {
        nextIntent = 'Decision: Send final response to user and terminate loop.';
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
        intent: 'Goal: Find the travel reimbursement policy and email it to manager@empresa.com. Status: Initializing.',
      }
    ]);
  }
}
