import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo-engineer-instruction',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './demo-engineer-instruction.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoEngineerInstruction {
  instructionInput = signal('');

  testResult = signal<{
    rawOutput: string;
    isValidJson: boolean;
    parsedData?: any;
    errorMsg?: string;
  } | null>(null);

  codeSnippet = `function processUser(user) {\n  if(user.age > 18) {\n    db.save(user); // No valida si user.name existe\n  }\n  return true;\n}`;

  runTest() {
    const prompt = this.instructionInput().toLowerCase();
    let rawResponse = '';

    if (prompt.includes('json') && prompt.includes('{') && prompt.includes('schema') && prompt.includes('severity')) {
      rawResponse = `{"vulnerability": "Missing validation", "severity": "HIGH", "fix": "Check if user.name exists"}`;
    } else if (prompt.includes('json') && (prompt.includes('only') || prompt.includes('sin markdown'))) {
      rawResponse = `{"error_encontrado": "Falta validar el nombre", "refactors": "muchos", "lineas_malas": [2, 3]}`;
    } else {
      rawResponse = "Aqui tienes el analisis en JSON:\n```json\n{\"vulnerability\": \"Missing validation\", \"severity\": \"HIGH\", \"fix\": \"Check if user.name exists\"}\n```\nEspero que te sirva!";
    }

    try {
      const parsed = JSON.parse(rawResponse);
      const hasValidSchema = parsed.vulnerability !== undefined && parsed.severity !== undefined && parsed.fix !== undefined;

      if (hasValidSchema) {
        this.testResult.set({ rawOutput: rawResponse, isValidJson: true, parsedData: parsed });
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
