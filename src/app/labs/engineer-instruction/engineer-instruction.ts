import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-engineer-instruction',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './engineer-instruction.html',
  styleUrls: ['../../shared-presentation.css']
})
export class EngineerInstructionLab {
  instructionInput = signal('');
  
  testResult = signal<{
    rawOutput: string;
    isValidJson: boolean;
    parsedData?: any;
    errorMsg?: string;
  } | null>(null);

  // Un código de ejemplo defectuoso
  codeSnippet = `function processUser(user) {
  if(user.age > 18) {
    db.save(user); // No valida si user.name existe
  }
  return true;
}`;

  runTest() {
    const prompt = this.instructionInput().toLowerCase();
    
    // Simulamos un comportamiento determinista frágil de un LLM basado en el prompt
    let rawResponse = '';
    
    if (prompt.includes('json') && prompt.includes('{') && prompt.includes('schema')) {
      // Buen prompt (muy simplificado para el lab)
      if (prompt.includes('only') || prompt.includes('sin markdown') || prompt.includes('estricto')) {
         rawResponse = `{"vulnerability": "Missing validation", "severity": "HIGH", "fix": "Check if user.name exists"}`;
      } else {
         rawResponse = `Aquí tienes el análisis:\n\`\`\`json\n{"vulnerability": "Missing validation", "severity": "HIGH", "fix": "Check if user.name exists"}\n\`\`\`\n¡Espero que te sirva!`;
      }
    } else {
      rawResponse = `El código tiene un problema. No está validando el campo user.name antes de guardarlo en la base de datos. Deberías añadir un if(user.name). La severidad es alta.`;
    }

    // Intentamos parsear simulando nuestro backend
    try {
      // Intento ingenuo de parseo directo
      const parsed = JSON.parse(rawResponse);
      this.testResult.set({
        rawOutput: rawResponse,
        isValidJson: true,
        parsedData: parsed
      });
    } catch (e: any) {
      this.testResult.set({
        rawOutput: rawResponse,
        isValidJson: false,
        errorMsg: 'SyntaxError: Unexpected token. Expected a valid JSON object.'
      });
    }
  }
}
