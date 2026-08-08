import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ArchitectureComponent {
  id: string;
  name: string;
  icon: string;
  description: string;
  selected: boolean;
  costImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  latencyImpact: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './architecture-blueprint.html',
  styleUrls: ['./architecture-blueprint.css']
})
export class ArchitectureBlueprintLab {
  components = signal<ArchitectureComponent[]>([
    { id: 'provider', name: 'Model Router (Abstraction)', icon: '🔄', description: 'Abstrae el SDK del LLM para evitar vendor lock-in.', selected: true, costImpact: 'LOW', latencyImpact: 'LOW' },
    { id: 'rag', name: 'RAG Pipeline (Context Builder)', icon: '📚', description: 'Inyecta memoria y datos privados al prompt.', selected: false, costImpact: 'MEDIUM', latencyImpact: 'MEDIUM' },
    { id: 'agent', name: 'Agent Loop (Autonomy)', icon: '🤖', description: 'Permite al modelo iterar y tomar decisiones dinámicas.', selected: false, costImpact: 'HIGH', latencyImpact: 'HIGH' },
    { id: 'mcp', name: 'MCP Client (Tools)', icon: '🔌', description: 'Conecta con sistemas externos estandarizados.', selected: false, costImpact: 'MEDIUM', latencyImpact: 'MEDIUM' },
    { id: 'eval', name: 'Eval Pipeline (Security)', icon: '🛡️', description: 'Frena falsos positivos y detecta regresiones.', selected: false, costImpact: 'LOW', latencyImpact: 'MEDIUM' }
  ]);

  evalResult = signal<'PENDING' | 'SUCCESS' | 'FAILED_COMPLEXITY' | 'FAILED_MISSING'>('PENDING');
  feedbackMessage = signal<string>('');

  toggleComponent(id: string) {
    if (id === 'provider') return; // Core, no se puede quitar
    this.components.update(comps => comps.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    this.evalResult.set('PENDING');
  }

  evaluateArchitecture() {
    const selectedIds = this.components().filter(c => c.selected).map(c => c.id);
    
    // Requirements: Private Knowledge (needs RAG), Deterministic (No Agent), No External APIs (No MCP), Prod Ready (needs Eval).
    const hasRAG = selectedIds.includes('rag');
    const hasEval = selectedIds.includes('eval');
    const hasAgent = selectedIds.includes('agent');
    const hasMCP = selectedIds.includes('mcp');

    if (!hasRAG || !hasEval) {
      this.evalResult.set('FAILED_MISSING');
      this.feedbackMessage.set('Te faltan componentes críticos. Para leer un manual de 500 páginas necesitas RAG. Para desplegar a producción con bajo riesgo, necesitas un Eval Pipeline.');
      return;
    }

    if (hasAgent || hasMCP) {
      this.evalResult.set('FAILED_COMPLEXITY');
      let msg = 'Has introducido complejidad innecesaria. ';
      if (hasAgent) msg += 'Un ciclo autónomo (Agent) es excesivo para un resumen determinista, encarece la latencia y el costo. ';
      if (hasMCP) msg += 'Integraste MCP, pero los requisitos establecen que NO hay APIs de terceros. ';
      this.feedbackMessage.set(msg + 'Recuerda: Architecture on Demand.');
      return;
    }

    this.evalResult.set('SUCCESS');
    this.feedbackMessage.set('¡Excelente! Has diseñado un sistema con RAG para el manual, lo proteges con un Eval Pipeline, y mantienes el modelo abstraído. Todo sin añadir la sobrecarga de un Agente o MCP innecesarios. Has dominado el diseño por requerimientos.');
  }
}
