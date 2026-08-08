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
    
    let rawResponse = '';
    
    // Nivel 0: Success total (Schema estricto + Constraints)
    if (prompt.includes('json') && prompt.includes('{') && prompt.includes('schema') && prompt.includes('severity')) {
      rawResponse = `{"vulnerability": "Missing validation", "severity": "HIGH", "fix": "Check if user.name exists"}`;
    } 
    // Nivel 2: Parseable pero inválido (Le pide JSON pero sin estructura estricta)
    else if (prompt.includes('json') && (prompt.includes('only') || prompt.includes('sin markdown'))) {
      rawResponse = `{"error_encontrado": "Falta validar el nombre", "refactors": "muchos", "lineas_malas": [2, 3]}`;
    }
    // Nivel 1: Unparseable (No acorrala al modelo)
    else {
      rawResponse = `Aquí tienes el análisis en JSON:\n\`\`\`json\n{"vulnerability": "Missing validation", "severity": "HIGH", "fix": "Check if user.name exists"}\n\`\`\`\n¡Espero que te sirva!`;
    }

    try {
      const parsed = JSON.parse(rawResponse);
      
      // Simulador de validación Zod/Pydantic
      const hasValidSchema = parsed.vulnerability !== undefined && parsed.severity !== undefined && parsed.fix !== undefined;

      if (hasValidSchema) {
        this.testResult.set({
          rawOutput: rawResponse,
          isValidJson: true,
          parsedData: parsed
        });
      } else {
        this.testResult.set({
          rawOutput: rawResponse,
          isValidJson: false,
          errorMsg: 'ValidationError: Missing required properties "vulnerability", "severity", "fix". (Parseable but Invalid Contract)'
        });
      }

    } catch (e: any) {
      this.testResult.set({
        rawOutput: rawResponse,
        isValidJson: false,
        errorMsg: 'SyntaxError: Unexpected token. Expected a valid JSON object. (Unparseable)'
      });
    }
  }
}
