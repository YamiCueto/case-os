import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lab-02-engineer-instruction-contract',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lab-02-engineer-instruction-contract.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class Lab02EngineerInstructionContract {
  currentStep = signal<number>(1);
  highestStep = signal<number>(1);

  // Paso 1
  problemStatement = signal('');
  
  // Paso 2
  contractIntent = signal('');
  contractRestrictions = signal('');
  contractInput = signal('');
  contractOutput = signal('');
  contractFallback = signal('');
  contractValidation = signal('');

  // Paso 3
  exampleValid = signal('');
  exampleEdge = signal('');

  // Paso 4 & 5: Validador de Bolsillo
  expectedJsonSample = signal('{\n  "clave": "valor_esperado"\n}');
  rawLlmOutput = signal('');
  
  validationResult = signal<{
    status: 'none' | 'invalid_json' | 'valid_with_markdown' | 'missing_keys' | 'wrong_types' | 'valid';
    message: string;
    parsed?: any;
  }>({ status: 'none', message: '' });

  // Paso 5: Checkbox de finalización para la prueba de resistencia
  step5Tested = signal(false);

  // Paso 6
  correctionFail = signal('');
  correctionFix = signal('');
  correctionReason = signal('');

  // Computeds para habilitar botones de "Siguiente"
  step1Valid = computed(() => this.problemStatement().trim().length >= 10);
  
  step2Valid = computed(() => 
    this.contractIntent().trim().length >= 5 &&
    this.contractRestrictions().trim().length >= 5 &&
    this.contractInput().trim().length >= 5 &&
    this.contractOutput().trim().length >= 5 &&
    this.contractFallback().trim().length >= 5 &&
    this.contractValidation().trim().length >= 5
  );

  step3Valid = computed(() => 
    this.exampleValid().trim().length >= 5 &&
    this.exampleEdge().trim().length >= 5
  );

  // Permitir avanzar si la validación fue exitosa
  step4Valid = computed(() => this.validationResult().status === 'valid');
  
  step5Valid = computed(() => this.step5Tested());

  step6Valid = computed(() => 
    this.correctionFail().trim().length >= 5 &&
    this.correctionFix().trim().length >= 5 &&
    this.correctionReason().trim().length >= 5
  );

  goToStep(step: number) {
    if (step <= this.highestStep()) {
      this.currentStep.set(step);
    }
  }

  nextStep() {
    const next = this.currentStep() + 1;
    if (next > this.highestStep()) {
      this.highestStep.set(next);
    }
    this.currentStep.set(next);
  }

  validateOutput() {
    const raw = this.rawLlmOutput().trim();
    const sample = this.expectedJsonSample().trim();

    if (!raw) {
      this.validationResult.set({ status: 'none', message: 'No hay salida para validar.' });
      return;
    }

    // 1. Detectar markdown
    const hasMarkdown = raw.includes('```');

    // 2. Intentar parsear
    let parsedRaw: any;
    try {
      let cleaned = raw;
      if (hasMarkdown) {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          cleaned = match[1];
        } else {
          cleaned = raw.replace(/```(json)?/g, '').trim();
        }
      }
      parsedRaw = JSON.parse(cleaned);
      
      if (hasMarkdown) {
         this.validationResult.set({
           status: 'valid_with_markdown',
           message: 'El JSON es estructuralmente válido, pero contiene bloques Markdown (```). Esto romperá JSON.parse() nativo en el código de tu aplicación.',
           parsed: parsedRaw
         });
         return;
      }
    } catch (e) {
      this.validationResult.set({
        status: 'invalid_json',
        message: 'La salida no es un JSON válido. Contiene texto adicional libre, sintaxis incorrecta o está incompleta.'
      });
      return;
    }

    // 3. Comprobar contra el esquema de muestra (si existe)
    if (sample) {
      let parsedSample: any;
      try {
        parsedSample = JSON.parse(sample);
      } catch (e) {
        this.validationResult.set({
          status: 'none',
          message: 'Error en la herramienta: Tu "Esquema Esperado (Muestra)" no es un JSON válido. Por favor, corrígelo para poder comparar.'
        });
        return;
      }

      const missingKeys: string[] = [];
      const wrongTypes: string[] = [];

      if (typeof parsedSample === 'object' && parsedSample !== null && !Array.isArray(parsedSample)) {
        for (const key of Object.keys(parsedSample)) {
          if (!parsedRaw.hasOwnProperty(key)) {
            missingKeys.push(key);
          } else {
            const expectedType = typeof parsedSample[key];
            const actualType = typeof parsedRaw[key];
            if (expectedType !== actualType && parsedRaw[key] !== null) {
              wrongTypes.push(`${key} (esperaba ${expectedType}, recibió ${actualType})`);
            }
          }
        }
      }

      if (missingKeys.length > 0) {
        this.validationResult.set({
          status: 'missing_keys',
          message: `El JSON es válido, pero le faltan campos definidos en tu contrato: ${missingKeys.join(', ')}.`,
          parsed: parsedRaw
        });
        return;
      }

      if (wrongTypes.length > 0) {
         this.validationResult.set({
          status: 'wrong_types',
          message: `El JSON tiene todos los campos requeridos, pero con tipos incorrectos: ${wrongTypes.join(', ')}.`,
          parsed: parsedRaw
        });
        return;
      }
    }

    // 4. Todo correcto
    this.validationResult.set({
      status: 'valid',
      message: 'Esta salida cumple las condiciones estructurales definidas y es compatible con el esquema esperado.',
      parsed: parsedRaw
    });
  }

  generateContractOnly(): string {
    return `CONTRATO DE INSTRUCCIONES
=========================

[Role]
${this.contractIntent()}

[Constraints]
${this.contractRestrictions()}

[Input]
${this.contractInput()}

[Output format]
${this.contractOutput()}

[Failure conditions]
${this.contractFallback()}

[Validation]
${this.contractValidation()}

[Examples]
- Success:
${this.exampleValid()}
- Edge case:
${this.exampleEdge()}
`;
  }

  generateFullReport(): string {
    return `# Lab 02 — AI Instruction Contract

## 1. Problema
${this.problemStatement()}

## 2. Contrato Reutilizable
\`\`\`text
${this.generateContractOnly()}
\`\`\`

## 3. Pruebas de Resistencia y Corrección
**¿Qué falló al intentar romper el contrato?**
${this.correctionFail()}

**¿Qué modificaste en el contrato para solucionarlo?**
${this.correctionFix()}

**¿Por qué este cambio soluciona el problema de raíz?**
${this.correctionReason()}

## 4. Validación
El contrato final superó exitosamente el validador estricto estructural.
`;
  }
  
  copyContractToClipboard() {
    navigator.clipboard.writeText(this.generateContractOnly());
    alert('¡Contrato copiado al portapapeles! Ahora puedes probarlo en tu IDE local.');
  }

  downloadLabReport() {
    const reportContent = this.generateFullReport();
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab-02-evidencia.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
