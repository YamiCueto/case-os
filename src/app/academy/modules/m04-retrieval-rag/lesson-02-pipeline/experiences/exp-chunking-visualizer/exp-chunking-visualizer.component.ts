import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChunkSegment {
  text: string;
  isOverlapStart: boolean;
  isOverlapEnd: boolean;
  isMiddle: boolean;
}

interface Chunk {
  id: number;
  segments: ChunkSegment[];
}

@Component({
  selector: 'app-exp-chunking-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exp-chunking">
      <div class="exp-chunking__header">
        <span class="material-symbols-outlined" style="color: var(--case-accent)">cut</span>
        <h3 class="exp-chunking__title">Visualizador de Chunking & Overlap</h3>
      </div>
      
      <p class="exp-chunking__disclaimer">
        <strong>Nota didáctica:</strong> Esta visualización simplifica el proceso utilizando caracteres en lugar de tokens para que podamos observar fácilmente cómo se forman los chunks. No representa una implementación universal, ya que los sistemas reales usan tokenizadores y estrategias más avanzadas.
      </p>

      <div class="exp-chunking__controls">
        <div class="control-group">
          <label class="control-label">
            Chunk Size (caracteres): <span class="control-value">{{ chunkSize() }}</span>
          </label>
          <input type="range" min="30" max="250" [ngModel]="chunkSize()" (ngModelChange)="updateChunkSize($event)" class="control-slider">
        </div>
        
        <div class="control-group">
          <label class="control-label">
            Overlap (caracteres): <span class="control-value">{{ overlap() }}</span>
          </label>
          <input type="range" min="0" max="100" [ngModel]="overlap()" (ngModelChange)="updateOverlap($event)" class="control-slider">
        </div>

        <div class="control-metrics">
          <div class="metric">
            <span class="metric-label">Chunks Generados</span>
            <span class="metric-value">{{ chunks().length }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Reutilización (Overlap / Size)</span>
            <span class="metric-value">{{ overlapRatio() | percent:'1.0-0' }}</span>
          </div>
        </div>
      </div>

      <div class="exp-chunking__preview">
        @for (chunk of chunks(); track chunk.id) {
          <div class="chunk-card">
            <div class="chunk-card__header">Chunk {{ chunk.id + 1 }}</div>
            <div class="chunk-card__content">
              @for (segment of chunk.segments; track $index) {
                <span [class.overlap-start]="segment.isOverlapStart" [class.overlap-end]="segment.isOverlapEnd">
                  {{ segment.text }}
                </span>
              }
            </div>
          </div>
        }
      </div>

      <div class="exp-chunking__tradeoffs">
        <h4>Observaciones pedagógicas</h4>
        @if (overlapRatio() === 0) {
          <div class="tradeoff-card tradeoff-card--warning">
            <strong>Overlap = 0 (Caso A):</strong> Los chunks están completamente separados sin contexto compartido. Puede perderse contexto entre los límites de los fragmentos, cortando oraciones críticas por la mitad.
          </div>
        } @else if (overlapRatio() > 0 && overlapRatio() <= 0.35) {
          <div class="tradeoff-card tradeoff-card--success">
            <strong>Overlap moderado (Caso B):</strong> Existe contexto compartido. Las ideas cortadas en un chunk pueden completarse en el siguiente, ayudando a conservar el contexto semántico entre segmentos.
          </div>
        } @else {
          <div class="tradeoff-card tradeoff-card--danger">
            <strong>Overlap alto (Caso C):</strong> Hay demasiado contenido repetido. El contexto compartido es excesivo, lo que aumenta la redundancia y el costo de almacenamiento/procesamiento sin aportar valor real.
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./exp-chunking-visualizer.component.css']
})
export class ExpChunkingVisualizerComponent {
  readonly sourceText = `Política de Vacaciones y Descanso: Los colaboradores de la compañía tienen derecho a 15 días hábiles de vacaciones remuneradas por cada año de servicio cumplido. Las solicitudes deben realizarse a través del portal de Recursos Humanos con al menos un mes de anticipación para asegurar la continuidad operativa del equipo. El límite establecido para la acumulación de vacaciones es de 5 días hábiles para el siguiente período; cualquier exceso no tomado se perderá automáticamente al cierre del año fiscal. Adicionalmente, se otorgan 3 días libres por motivos personales (personal days), los cuales no son acumulables.`;

  chunkSize = signal(90);
  overlap = signal(20);

  updateChunkSize(val: number) {
    this.chunkSize.set(Number(val));
    if (this.overlap() >= this.chunkSize()) {
      this.overlap.set(Math.floor(this.chunkSize() * 0.8));
    }
  }

  updateOverlap(val: number) {
    let newVal = Number(val);
    if (newVal >= this.chunkSize()) {
      newVal = Math.floor(this.chunkSize() * 0.8);
    }
    this.overlap.set(newVal);
  }

  overlapRatio = computed(() => {
    return this.overlap() / this.chunkSize();
  });

  chunks = computed(() => {
    const text = this.sourceText;
    const size = this.chunkSize();
    const ov = this.overlap();
    
    let result: Chunk[] = [];
    let i = 0;
    let id = 0;

    while (i < text.length) {
      let end = i + size;
      let chunkText = text.substring(i, end);
      
      let segments: ChunkSegment[] = [];
      
      const hasPrevOverlap = i > 0 && ov > 0;
      const hasNextOverlap = end < text.length && ov > 0;
      
      if (hasPrevOverlap && hasNextOverlap && chunkText.length <= ov * 2) {
         segments.push({ text: chunkText, isOverlapStart: true, isMiddle: false, isOverlapEnd: false });
      } else {
        if (hasPrevOverlap) {
          segments.push({ 
            text: chunkText.substring(0, ov), 
            isOverlapStart: true, 
            isOverlapEnd: false, 
            isMiddle: false 
          });
        }
        
        let midStart = hasPrevOverlap ? ov : 0;
        let midEnd = hasNextOverlap ? chunkText.length - ov : chunkText.length;
        
        if (midStart < midEnd) {
          segments.push({ 
            text: chunkText.substring(midStart, midEnd), 
            isOverlapStart: false, 
            isOverlapEnd: false, 
            isMiddle: true 
          });
        }
        
        if (hasNextOverlap) {
          segments.push({ 
            text: chunkText.substring(midEnd), 
            isOverlapStart: false, 
            isOverlapEnd: true, 
            isMiddle: false 
          });
        }
      }
      
      result.push({ id, segments });
      id++;
      
      if (end >= text.length) break;
      i = end - ov;
    }
    
    return result;
  });
}
