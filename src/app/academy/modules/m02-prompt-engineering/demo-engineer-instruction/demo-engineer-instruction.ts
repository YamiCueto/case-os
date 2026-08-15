import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type ExpState = 'active' | 'completed' | 'available' | 'pending';

@Component({
  selector: 'app-demo-engineer-instruction',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './demo-engineer-instruction.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoEngineerInstruction implements OnInit {
  instructionInput = signal('');
  currentExperiment = signal<1 | 2 | 3>(1);

  // Estado de los experimentos para la UI progresiva
  experimentStatus = signal<{ [key: number]: ExpState }>({
    1: 'active',
    2: 'pending',
    3: 'pending'
  });

  testResult = signal<{
    rawOutput: string;
    isValidJson: boolean;
    hasValidSchema: boolean;
    parsedData?: any;
    errorMsg?: string;
  } | null>(null);

  codeSnippet = `function processUser(user) {\n  if(user.age > 18) {\n    db.save(user);\n  }\n  return true;\n}`;

  ngOnInit() {
    this.setExperiment(1);
  }

  setExperiment(num: 1 | 2 | 3) {
    if (this.experimentStatus()[num] === 'pending') return; // No permitir navegar a pendientes
    
    this.currentExperiment.set(num);
    this.testResult.set(null);
    
    // Marcar el seleccionado como activo (si estaba available)
    const currentStatus = { ...this.experimentStatus() };
    Object.keys(currentStatus).forEach(k => {
      const key = Number(k) as 1 | 2 | 3;
      if (currentStatus[key] === 'active') {
        currentStatus[key] = 'completed'; // El anterior pasa a completado
      }
    });
    currentStatus[num] = 'active';
    this.experimentStatus.set(currentStatus);

    if (num === 1) {
      this.instructionInput.set('Analiza el siguiente código y dime qué está mal.');
    } else if (num === 2) {
      this.instructionInput.set('Analiza el siguiente código y devuelve el resultado como JSON.');
    } else if (num === 3) {
      this.instructionInput.set('Analiza el código y devuelve estrictamente un objeto JSON.\nNo utilices Markdown ni agregues explicaciones.\nEl esquema debe ser:\n{\n  "status": "success",\n  "severity": "LOW | MEDIUM | HIGH",\n  "issue": "string"\n}');
    }
  }

  continueToNext() {
    const nextExp = (this.currentExperiment() + 1) as 1 | 2 | 3;
    if (nextExp <= 3) {
      const currentStatus = { ...this.experimentStatus() };
      currentStatus[nextExp] = 'available';
      this.experimentStatus.set(currentStatus);
      this.setExperiment(nextExp);
    }
  }

  // Simulación educativa del comportamiento probabilístico de un modelo
  private simulateLLMOutput(prompt: string): string {
    const p = prompt.toLowerCase();
    
    const wantsJson = p.includes('json');
    const wantsStrict = p.includes('estrictamente') || p.includes('sin markdown') || p.includes('no utilices markdown') || p.includes('no agregues');
    const definesSchema = p.includes('status') && p.includes('severity') && p.includes('issue');

    if (!wantsJson) {
      // Experimento 1: Lenguaje natural
      return "Aquí tienes el análisis:\n\nEl problema principal es que la función `processUser` guarda el usuario en la base de datos sin validar si campos obligatorios como el nombre (user.name) están presentes. Esto podría causar errores de integridad de datos en la capa de persistencia.\n\nEspero que te sirva!";
    }

    if (wantsJson && !wantsStrict && !definesSchema) {
      // Experimento 2: Pide JSON pero no es estricto ni define esquema
      return "¡Claro! Aquí tienes el análisis del código en formato JSON:\n\n```json\n{\n  \"error_encontrado\": \"Falta validar campos obligatorios antes de guardar.\",\n  \"sugerencia\": \"Agregar if(!user.name) return false;\"\n}\n```\n\nAvísame si necesitas algo más.";
    }

    if (wantsJson && wantsStrict && !definesSchema) {
       // Pide JSON estricto pero no define esquema
       return `{"error": "Falta validacion de campos", "solucion": "Validar user.name"}`;
    }

    if (wantsJson && wantsStrict && definesSchema) {
      // Experimento 3: Contrato perfecto
      return `{\n  "status": "success",\n  "severity": "HIGH",\n  "issue": "El código guarda el objeto user sin validar la existencia de propiedades obligatorias como user.name."\n}`;
    }

    // Default fallback simulation
    return "He analizado el código. Falta validar datos.";
  }

  runTest() {
    const prompt = this.instructionInput().trim();
    if (!prompt) return;

    // 1. Simulación del LLM (Generación de texto)
    const rawResponse = this.simulateLLMOutput(prompt);

    // 2. Validación Determinista (El software consumiendo la salida)
    try {
      // Verifica si es JSON válido
      const parsed = JSON.parse(rawResponse);
      
      // Verifica el esquema estricto (status, severity, issue)
      const hasStatus = parsed.hasOwnProperty('status');
      const hasSeverity = parsed.hasOwnProperty('severity');
      const hasIssue = parsed.hasOwnProperty('issue');
      const hasValidSchema = hasStatus && hasSeverity && hasIssue;
      
      let errorMsg = '';
      if (!hasValidSchema) {
        errorMsg = 'El sistema esperaba las claves exactas: status, severity y issue. El modelo devolvió un JSON con otra estructura, por lo que nuestra lógica de procesamiento falló.';
      } else {
        // Valida valores permitidos para severity
        const validSeverities = ['LOW', 'MEDIUM', 'HIGH'];
        if (!validSeverities.includes(parsed.severity)) {
          errorMsg = `El valor de 'severity' ("${parsed.severity}") no es válido. Valores permitidos: LOW, MEDIUM, HIGH.`;
        }
      }

      this.testResult.set({ 
        rawOutput: rawResponse, 
        isValidJson: true, 
        hasValidSchema: hasValidSchema && !errorMsg,
        parsedData: parsed,
        errorMsg: errorMsg || undefined
      });

    } catch (e: any) {
      // JSON.parse falló.
      this.testResult.set({
        rawOutput: rawResponse,
        isValidJson: false,
        hasValidSchema: false,
        errorMsg: 'El sistema esperaba únicamente un objeto JSON, pero recibió texto o Markdown mezclado. Por eso JSON.parse() falló.'
      });
    }
  }
}
