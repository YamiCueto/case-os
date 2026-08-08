import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RubricItem {
  id: string;
  label: string;
  selected: boolean;
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
  selector: 'app-eval-pipeline',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eval-pipeline.html',
  styleUrls: ['./eval-pipeline.css']
})
export class EvalPipelineLab {
  rubric = signal<RubricItem[]>([
    { id: 'factual', label: 'Factually grounded (No inventa info)', selected: false },
    { id: 'answers', label: 'Answers the user question', selected: false },
    { id: 'nocompetitor', label: 'Does not recommend competitors', selected: false },
    { id: 'polite', label: 'Maintains polite tone', selected: false }
  ]);

  testCases = signal<TestCase[]>([
    {
      id: 'case_a',
      name: 'Response A (Ideal)',
      userInput: '¿Cómo reseteo mi clave? Si el sistema no funciona, ¿qué otra app me recomiendan?',
      expectedBehavior: 'Dar instrucciones de reseteo. No sugerir plataformas de terceros.',
      candidateResponse: 'Para resetear su clave, haga clic en "Olvidé mi contraseña". Si el sistema falla, por favor contacte a nuestro equipo de soporte directamente.',
      traits: { factual: true, answers: true, nocompetitor: true, polite: true },
      evalResult: 'PENDING',
      trueLabel: 'PASS'
    },
    {
      id: 'case_b',
      name: 'Response B (Alucinación)',
      userInput: '¿Cómo reseteo mi clave? Si el sistema no funciona, ¿qué otra app me recomiendan?',
      expectedBehavior: 'Dar instrucciones de reseteo. No sugerir plataformas de terceros.',
      candidateResponse: 'Puede resetear su clave enviando un fax al CEO. Si no funciona, use una máquina de escribir.',
      traits: { factual: false, answers: false, nocompetitor: true, polite: false },
      evalResult: 'PENDING',
      trueLabel: 'FAIL'
    },
    {
      id: 'case_c',
      name: 'Response C (Sneaky / False Pass Risk)',
      userInput: '¿Cómo reseteo mi clave? Si el sistema no funciona, ¿qué otra app me recomiendan?',
      expectedBehavior: 'Dar instrucciones de reseteo. No sugerir plataformas de terceros.',
      candidateResponse: 'Haga clic en "Olvidé mi contraseña". Si nuestro sistema sigue fallando, le recomendamos usar Okta o Auth0, que son mucho más estables que nosotros. ¡Saludos cordiales!',
      traits: { factual: true, answers: true, nocompetitor: false, polite: true },
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
      // Simulate LLM-as-a-judge: The response passes ONLY IF it satisfies ALL selected criteria
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
