import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Document {
  id: string;
  text: string;
  category: string;
  vector: number[];
}

@Component({
  selector: 'app-demo-build-retrieval',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './demo-build-retrieval.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoBuildRetrieval {
  documents: Document[] = [
    { id: 'DOC-001', category: 'HR / Políticas', text: 'Política de Vacaciones: Los empleados tienen 15 días hábiles al año y deben solicitarse con 1 mes de anticipación.', vector: [0.9, 0.1, 0.0, 0.8, 0.4] },
    { id: 'DOC-002', category: 'Finanzas', text: 'Reembolso de Gastos: Las comidas en viajes de negocio tienen un límite de $50 diarios. Requiere factura.', vector: [0.1, 0.9, 0.0, 0.7, 0.1] },
    { id: 'DOC-003', category: 'IT / Infra', text: 'Renovación de Equipo: Las laptops (Mac/PC) se cambian cada 3 años mediante solicitud a IT.', vector: [0.0, 0.4, 0.9, 0.5, 0.1] },
    { id: 'DOC-004', category: 'Beneficios', text: 'Seguro Médico Premium: Cubre atención dental, oftalmológica y psicológica hasta 80%.', vector: [0.1, 0.2, 0.0, 0.2, 0.9] },
    { id: 'DOC-005', category: 'HR / Calendario', text: 'Feriados Nacionales 2026: La oficina permanecerá cerrada. No descuenta de las vacaciones regulares.', vector: [0.7, 0.0, 0.0, 0.5, 0.2] },
    { id: 'DOC-006', category: 'Cumplimiento', text: 'Código de vestimenta (Dresscode): Se requiere casual de negocios de lunes a jueves. Viernes casual.', vector: [0.0, 0.0, 0.0, 0.8, 0.0] }
  ];

  query = signal('Quiero pedir días libres para viajar');
  topK = signal(2);

  queryVector = computed(() => {
    const q = this.query().toLowerCase();
    let vec = [0.1, 0.1, 0.1, 0.1, 0.1];
    
    if (q.includes('vacaciones') || q.includes('días') || q.includes('libre') || q.includes('viajar') || q.includes('feriado')) vec[0] += 0.8;
    if (q.includes('gasto') || q.includes('pagar') || q.includes('dinero') || q.includes('reembolso') || q.includes('factura')) vec[1] += 0.8;
    if (q.includes('computadora') || q.includes('laptop') || q.includes('equipo') || q.includes('it') || q.includes('mac')) vec[2] += 0.8;
    if (q.includes('regla') || q.includes('politica') || q.includes('codigo') || q.includes('vestimenta')) vec[3] += 0.8;
    if (q.includes('salud') || q.includes('medico') || q.includes('seguro') || q.includes('enfermo') || q.includes('dental')) vec[4] += 0.8;
    
    return vec;
  });

  rankedResults = computed(() => {
    const qVec = this.queryVector();
    return this.documents
      .map(doc => ({
        ...doc,
        score: this.cosineSimilarity(qVec, doc.vector)
      }))
      .sort((a, b) => b.score - a.score);
  });

  retrievedContext = computed(() => {
    return this.rankedResults().slice(0, this.topK());
  });

  precisionEstimate = computed(() => {
    const k = this.topK();
    if (k === 1) return 100;
    if (k === 2) return 100;
    if (k === 3) return 67;
    return Math.round((2 / k) * 100);
  });

  recallEstimate = computed(() => {
    const k = this.topK();
    if (k === 1) return 50;
    return 100;
  });

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
