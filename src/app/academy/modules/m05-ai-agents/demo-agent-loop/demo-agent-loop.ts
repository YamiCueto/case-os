import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type IterationStatus = 'pending' | 'acting' | 'done';
export type SimStatus = 'RUNNING' | 'AWAITING_SIDE_EFFECT' | 'SUCCESS' | 'MAX_ITERATIONS_REACHED';

export interface TraceEntry {
  step: number;
  // LLM proposes a DECISION (intent only — not execution)
  decision: string;
  // Runtime executes an ACTION (only after decision is accepted)
  actionTaken?: string;
  // What the environment returned
  observation?: string;
  // How state changed after the observation
  stateUpdate?: string;
  // Whether this is a final-answer decision (no tool call)
  isFinalAnswer?: boolean;
  // Whether this action has an external side effect
  isExternalEffect?: boolean;
  // Whether this tool call was irrelevant to goal
  isIrrelevant?: boolean;
}

@Component({
  selector: 'app-demo-agent-loop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-agent-loop.html',
  styleUrls: [
    './demo-agent-loop.css',
    '../../../../shared-presentation.css'
  ]
})
export class DemoAgentLoop {
  readonly maxIterations = 5;
  readonly goal = 'Encontrar la política de reembolso de viajes y enviarla por correo a manager@empresa.com.';

  currentStep = signal(1);
  status = signal<SimStatus>('RUNNING');

  // Accumulated observations visible in the state panel
  accumulatedObservations = signal<string[]>([]);

  // Controls whether the "External Side Effect" pause screen is shown
  pendingExternalEffect = signal(false);

  // Full execution trace shown in the terminal panel
  history = signal<TraceEntry[]>([
    {
      step: 1,
      decision: 'Necesito encontrar la política de reembolso de viajes. Propondré searchKnowledge().',
    }
  ]);

  hasSearched = signal(false);
  hasEmailConfirmed = signal(false);

  // ── Tool executions ───────────────────────────────────────────────────────

  executeSearch() {
    if (this.status() !== 'RUNNING') return;

    const obs = 'Documento encontrado: "El reembolso de viáticos tiene un límite de $50/día para comidas (factura obligatoria). Los vuelos deben ser en clase turista."';
    const stateUpd = 'reimbursement_policy añadida al contexto de observaciones.';

    this._completeCurrentEntry(
      'searchKnowledge(query="travel reimbursement policy")',
      obs,
      stateUpd,
      false, false, false
    );
    this.hasSearched.set(true);
    this.accumulatedObservations.update(o => [...o, '📄 reimbursement_policy: encontrada']);
    this._prepareNextStep();
  }

  executeMath() {
    if (this.status() !== 'RUNNING') return;

    const obs = 'Result: 250 — Cálculo completado. Esta observación no avanza el objetivo actual (encontrar y enviar la política).';
    const stateUpd = 'Cálculo almacenado. Sin progreso hacia el objetivo. Esta iteración consumió 1 de 5 permitidas.';

    this._completeCurrentEntry(
      'calculateMath(expression="50 * 5")',
      obs,
      stateUpd,
      false, false, true
    );
    this.accumulatedObservations.update(o => [...o, '🔢 math_result: 250 (irrelevante para el objetivo)']);
    this._prepareNextStep();
  }

  executeEmail() {
    if (this.status() !== 'RUNNING') return;

    if (!this.hasSearched()) {
      // No policy retrieved yet → email body lacks context
      const obs = 'Error: El cuerpo del correo no contiene los detalles de la política. El agente debe recuperar la política antes de redactar el mensaje.';
      const stateUpd = 'sendEmail bloqueado por el runtime: contexto requerido ausente. Recuperación de la política pendiente.';
      this._completeCurrentEntry(
        'sendEmail(to="manager@empresa.com", body="Here is the policy.")',
        obs,
        stateUpd,
        false, false, false
      );
      this.accumulatedObservations.update(o => [...o, '✉️ email: fallido (contexto ausente)']);
      this._prepareNextStep();
    } else {
      // Policy is available → trigger external side effect boundary
      this._completeCurrentEntry(
        'sendEmail(to="manager@empresa.com", body="Reimbursement limit $50/day, receipts required, economy class.")',
        undefined, undefined,
        false, true, false
      );
      this.pendingExternalEffect.set(true);
      this.status.set('AWAITING_SIDE_EFFECT');
    }
  }

  confirmExternalEffect() {
    // Instructor/student acknowledges the side effect and allows execution
    const obs = 'Correo enviado correctamente a manager@empresa.com.';
    const stateUpd = 'Goal state updated: email_sent=true. Todas las tareas requeridas completadas.';

    this.history.update(h => {
      const last = h[h.length - 1];
      last.observation = obs;
      last.stateUpdate = stateUpd;
      return [...h];
    });

    this.hasEmailConfirmed.set(true);
    this.pendingExternalEffect.set(false);
    this.status.set('RUNNING');
    this.accumulatedObservations.update(o => [...o, '✉️ email: enviado a manager@empresa.com']);
    this._prepareNextStep();
  }

  cancelExternalEffect() {
    // Student decides NOT to confirm — good teaching moment
    const obs = 'Ejecución cancelada por el operador. El agente propuso esta acción; el runtime requirió confirmación explícita antes de proceder.';
    const stateUpd = 'email_sent=false. El agente deberá razonar sobre la cancelación en la siguiente iteración.';

    this.history.update(h => {
      const last = h[h.length - 1];
      last.observation = obs;
      last.stateUpdate = stateUpd;
      return [...h];
    });

    this.pendingExternalEffect.set(false);
    this.status.set('RUNNING');
    this.accumulatedObservations.update(o => [...o, '🚫 email: cancelado por el operador']);
    this._prepareNextStep();
  }

  finishLoop() {
    if (this.status() !== 'RUNNING') return;

    if (this.hasSearched() && this.hasEmailConfirmed()) {
      this._completeCurrentEntry(
        '— Final Answer —',
        'Encontré la política de reembolso de viajes y la envié exitosamente a manager@empresa.com.',
        'Terminal state: goal achieved. Loop finalizado por decisión del agente.',
        true, false, false
      );
      this.status.set('SUCCESS');
    } else {
      // Premature termination
      this._completeCurrentEntry(
        '— Final Answer (Premature) —',
        'ERROR: El agente intentó terminar antes de completar todas las sub-tareas requeridas.',
        'Terminal state: goal NOT achieved. Esto demuestra la ausencia de una condición de parada correcta.',
        true, false, false
      );
      this.status.set('SUCCESS');
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private _completeCurrentEntry(
    action: string,
    obs: string | undefined,
    stateUpd: string | undefined,
    isFinalAnswer: boolean,
    isExternalEffect: boolean,
    isIrrelevant: boolean
  ) {
    this.history.update(h => {
      const last = h[h.length - 1];
      last.actionTaken = action;
      last.observation = obs;
      last.stateUpdate = stateUpd;
      last.isFinalAnswer = isFinalAnswer;
      last.isExternalEffect = isExternalEffect;
      last.isIrrelevant = isIrrelevant;
      return [...h];
    });
  }

  private _prepareNextStep() {
    if (this.status() !== 'RUNNING') return;

    // Check MAX_ITERATIONS
    if (this.currentStep() >= this.maxIterations) {
      this.history.update(h => [
        ...h,
        {
          step: this.currentStep() + 1,
          decision: 'MAX_ITERATIONS_REACHED — El runtime detuvo el bucle. No se evaluarán más decisiones.',
        }
      ]);
      this.status.set('MAX_ITERATIONS_REACHED');
      return;
    }

    this.currentStep.update(s => s + 1);

    let nextDecision = '';
    if (!this.hasSearched()) {
      nextDecision = 'Todavía necesito encontrar la política de reembolso de viajes. Propondré searchKnowledge().';
    } else if (!this.hasEmailConfirmed()) {
      nextDecision = 'La política está disponible en el contexto. Siguiente paso: redactar y enviar el correo a manager@empresa.com. Propondré sendEmail().';
    } else {
      nextDecision = 'El correo fue enviado correctamente. Todas las tareas completadas. Propondré Final Answer para terminar el bucle.';
    }

    this.history.update(h => [
      ...h,
      { step: this.currentStep(), decision: nextDecision }
    ]);
  }

  resetLab() {
    this.currentStep.set(1);
    this.status.set('RUNNING');
    this.hasSearched.set(false);
    this.hasEmailConfirmed.set(false);
    this.pendingExternalEffect.set(false);
    this.accumulatedObservations.set([]);
    this.history.set([
      {
        step: 1,
        decision: 'Necesito encontrar la política de reembolso de viajes y enviarla a manager@empresa.com. Propondré searchKnowledge().',
      }
    ]);
  }
}
