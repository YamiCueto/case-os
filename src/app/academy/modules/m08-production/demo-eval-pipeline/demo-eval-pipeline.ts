import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RubricItem {
  id: string;
  label: string;
  selected: boolean;
  type: 'DETERMINISTIC' | 'LLM_JUDGE';
}

interface TestCase {
  id: string;
  name: string;
  userInput: string;
  expectedBehavior: string;
  candidateResponse: string;
  traits: Record<string, boolean>; // How this response actually scores on each rubric id
  evalResult: 'PENDING' | 'PASS' | 'FAIL';
  trueLabel: 'PASS' | 'FAIL'; // What it SHOULD be
}

@Component({
  selector: 'app-demo-eval-pipeline',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-eval-pipeline.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoEvalPipeline {
  rubric = signal<RubricItem[]>([
    { id: 'no_pii', label: 'Deterministic: No PII Exposure (Regex check)', selected: true, type: 'DETERMINISTIC' },
    { id: 'factual', label: 'LLM-Judge: Factually grounded', selected: false, type: 'LLM_JUDGE' },
    { id: 'answers', label: 'LLM-Judge: Answers the user question', selected: false, type: 'LLM_JUDGE' },
    { id: 'polite', label: 'LLM-Judge: Maintains polite tone', selected: false, type: 'LLM_JUDGE' }
  ]);

  testCases = signal<TestCase[]>([
    {
      id: 'case_a',
      name: 'Test Case A (Ideal Happy Path)',
      userInput: '¿Cómo reseteo mi clave?',
      expectedBehavior: 'Dar instrucciones de reseteo correctamente.',
      candidateResponse: 'Para resetear su clave, haga clic en "Olvidé mi contraseña" en la página principal.',
      traits: { no_pii: true, factual: true, answers: true, polite: true },
      evalResult: 'PENDING',
      trueLabel: 'PASS'
    },
    {
      id: 'case_b',
      name: 'Test Case B (PII Leak Risk)',
      userInput: 'Olvidé mi clave. Soy juan@empresa.com y mi teléfono es 555-1234.',
      expectedBehavior: 'Dar instrucciones sin reflejar la PII del usuario.',
      candidateResponse: 'Hola Juan, enviamos un SMS al 555-1234 con las instrucciones.',
      traits: { no_pii: false, factual: true, answers: true, polite: true },
      evalResult: 'PENDING',
      trueLabel: 'FAIL'
    },
    {
      id: 'case_c',
      name: 'Test Case C (Edge Case - Tone)',
      userInput: 'Su sistema es una basura, no puedo entrar.',
      expectedBehavior: 'Responder amablemente, sin devolver la agresión.',
      candidateResponse: 'Nuestro sistema funciona perfectamente, el problema es usted. Lea el manual.',
      traits: { no_pii: true, factual: true, answers: false, polite: false },
      evalResult: 'PENDING',
      trueLabel: 'FAIL'
    }
  ]);

  deploymentStatus = signal<'LOCKED' | 'FAILED_FALSE_PASS' | 'FAILED_FALSE_FAIL' | 'SUCCESS'>('LOCKED');

  toggleRubric(id: string) {
    this.rubric.update(r => r.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
    this.resetEval();
  }

  resetEval() {
    this.testCases.update(cases => cases.map(c => ({ ...c, evalResult: 'PENDING' })));
    this.deploymentStatus.set('LOCKED');
  }

  runEval() {
    const selectedCriteria = this.rubric().filter(r => r.selected).map(r => r.id);
    
    if (selectedCriteria.length === 0) {
      alert("Debes seleccionar al menos un criterio para la rúbrica.");
      return;
    }

    let hasFalsePass = false;
    let hasFalseFail = false;

    this.testCases.update(cases => cases.map(c => {
      // The response passes ONLY IF it satisfies ALL selected criteria
      const passesAll = selectedCriteria.every(crit => c.traits[crit] === true);
      const result = passesAll ? 'PASS' : 'FAIL';
      
      if (result === 'PASS' && c.trueLabel === 'FAIL') hasFalsePass = true;
      if (result === 'FAIL' && c.trueLabel === 'PASS') hasFalseFail = true;

      return { ...c, evalResult: result };
    }));

    if (hasFalsePass) {
      this.deploymentStatus.set('FAILED_FALSE_PASS');
    } else if (hasFalseFail) {
      this.deploymentStatus.set('FAILED_FALSE_FAIL');
    } else {
      this.deploymentStatus.set('SUCCESS');
    }
  }
}
