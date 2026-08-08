import { Component, signal } from '@angular/core';
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
  selector: 'app-demo-architecture-builder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-architecture-builder.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoArchitectureBuilder {
  components = signal<ArchitectureComponent[]>([
    { id: 'model', name: 'LLM Engine', icon: '🧠', description: 'Ejecuta clasificación y generación determinista.', selected: true, costImpact: 'LOW', latencyImpact: 'LOW' },
    { id: 'rag', name: 'Retrieval Pipeline (RAG)', icon: '📚', description: 'Inyecta páginas relevantes de políticas al prompt.', selected: false, costImpact: 'MEDIUM', latencyImpact: 'MEDIUM' },
    { id: 'eval', name: 'Evaluation Gate', icon: '🛡️', description: 'Previene regresiones antes del despliegue.', selected: false, costImpact: 'LOW', latencyImpact: 'LOW' },
    { id: 'agent', name: 'Agent Loop', icon: '🤖', description: 'Toma decisiones dinámicas y rutea tareas autónomamente.', selected: false, costImpact: 'HIGH', latencyImpact: 'HIGH' },
    { id: 'mcp', name: 'MCP Client (Tools)', icon: '🔌', description: 'Expone APIs externas al modelo.', selected: false, costImpact: 'MEDIUM', latencyImpact: 'MEDIUM' }
  ]);

  evalResult = signal<'PENDING' | 'SUCCESS' | 'FAILED_COMPLEXITY' | 'FAILED_MISSING'>('PENDING');
  feedbackMessage = signal<string>('');

  toggleComponent(id: string) {
    if (id === 'model') return; // Core, no se puede quitar
    this.components.update(comps => comps.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    this.evalResult.set('PENDING');
  }

  evaluateArchitecture() {
    const selectedIds = this.components().filter(c => c.selected).map(c => c.id);
    
    const hasRAG = selectedIds.includes('rag');
    const hasEval = selectedIds.includes('eval');
    const hasAgent = selectedIds.includes('agent');
    const hasMCP = selectedIds.includes('mcp');

    // M09 Principle: Requirements -> Constraints -> Capabilities -> Boundaries -> Architecture
    if (!hasRAG || !hasEval) {
      this.evalResult.set('FAILED_MISSING');
      this.feedbackMessage.set('Arquitectura Incompleta: El caso de uso requiere consultar 500 páginas (necesitas Retrieval/RAG). Además, enviar esto a producción sin controles de regresión (necesitas Evaluation) es inseguro.');
      return;
    }

    if (hasAgent || hasMCP) {
      this.evalResult.set('FAILED_COMPLEXITY');
      let msg = 'Sobreingeniería detectada (Violación de Least Complexity): ';
      if (hasAgent) msg += 'El flujo es determinista y no requiere decisiones dinámicas autónomas, un Agente disparará tu latencia a >3s. ';
      if (hasMCP) msg += 'El requerimiento especifica que NO hay acciones en APIs externas, por lo que MCP es innecesario. ';
      this.feedbackMessage.set(msg);
      return;
    }

    this.evalResult.set('SUCCESS');
    this.feedbackMessage.set('¡Arquitectura Aprobada! Has resuelto el problema de negocio usando solo las capacidades necesarias, respetando el límite de latencia y presupuesto. No architectural capability without a requirement.');
  }
}
