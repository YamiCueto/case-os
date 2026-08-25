import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RankItem {
  id: string;
  title: string;
  bm25Rank: number | null;
  vectorRank: number | null;
}

@Component({
  selector: 'app-exp-hybrid-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Búsqueda Híbrida y RRF</h3>
        <p class="exp-subtitle">Reciprocal Rank Fusion (RRF) combina inteligentemente rankings en lugar de scores crudos.</p>
      </div>

      <div class="exp-scenario">
        <strong>Query:</strong> "Quiero un crédito educativo para mi hijo"
      </div>

      <div class="exp-layout">
        
        <!-- BM25 List -->
        <div class="exp-list-col">
          <div class="exp-list-header">
            <h4>Búsqueda Léxica (BM25)</h4>
            <span class="exp-badge">Busca palabras</span>
          </div>
          <div class="exp-list">
            @for (item of bm25Ranking(); track item.id; let i = $index) {
              <div class="exp-rank-card" [class.highlight]="hoveredId() === item.id" (mouseenter)="hoveredId.set(item.id)" (mouseleave)="hoveredId.set(null)">
                <div class="exp-rank-number">{{ i + 1 }}</div>
                <div class="exp-rank-content">
                  <div class="exp-rank-title">{{ item.title }}</div>
                  <div class="exp-rank-score">Score RRF: 1/{{ 60 + i + 1 }} = {{ (1 / (60 + i + 1)).toFixed(4) }}</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Semantic List -->
        <div class="exp-list-col">
          <div class="exp-list-header">
            <h4>Búsqueda Semántica</h4>
            <span class="exp-badge exp-badge--semantic">Busca concepto</span>
          </div>
          <div class="exp-list">
            @for (item of vectorRanking(); track item.id; let i = $index) {
              <div class="exp-rank-card" [class.highlight]="hoveredId() === item.id" (mouseenter)="hoveredId.set(item.id)" (mouseleave)="hoveredId.set(null)">
                <div class="exp-rank-number">{{ i + 1 }}</div>
                <div class="exp-rank-content">
                  <div class="exp-rank-title">{{ item.title }}</div>
                  <div class="exp-rank-score">Score RRF: 1/{{ 60 + i + 1 }} = {{ (1 / (60 + i + 1)).toFixed(4) }}</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- RRF Fusion List -->
        <div class="exp-list-col exp-list-col--final">
          <div class="exp-list-header">
            <h4>Ranking Híbrido Final (RRF)</h4>
            <span class="exp-badge exp-badge--fusion">RRF Fusion</span>
          </div>
          <div class="exp-list">
            @for (item of rrfRanking(); track item.doc.id; let i = $index) {
              <div class="exp-rank-card exp-rank-card--final" [class.highlight]="hoveredId() === item.doc.id" (mouseenter)="hoveredId.set(item.doc.id)" (mouseleave)="hoveredId.set(null)">
                <div class="exp-rank-number">{{ i + 1 }}</div>
                <div class="exp-rank-content">
                  <div class="exp-rank-title">{{ item.doc.title }}</div>
                  <div class="exp-rank-score">Score Total: {{ item.score.toFixed(4) }}</div>
                  <div class="exp-rank-math">
                    = {{ formatRRF(item.doc.bm25Rank) }} + {{ formatRRF(item.doc.vectorRank) }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

      <div class="exp-callout">
        <span class="material-symbols-outlined">lightbulb</span>
        <span><strong>Fórmula RRF:</strong> <code>Score = 1 / (60 + Rank_BM25) + 1 / (60 + Rank_Vector)</code>. Los documentos que aparecen altos en <strong>ambas</strong> listas obtienen un score combinado mucho mayor. Pasa el ratón sobre un documento para ver dónde aparece en cada motor.</span>
      </div>
    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
      padding: var(--case-space-6);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }
    .exp-title { margin: 0 0 4px 0; color: var(--case-text-primary); }
    .exp-subtitle { margin: 0; color: var(--case-text-secondary); }

    .exp-scenario {
      background: var(--case-surface-3);
      padding: var(--case-space-3) var(--case-space-4);
      border: 1px dashed var(--case-border-strong);
      border-radius: var(--case-radius-md);
      font-family: var(--case-font-mono);
      font-size: 1rem;
      color: var(--case-text-primary);
    }

    .exp-layout {
      display: grid;
      grid-template-columns: 1fr 1fr 1.2fr;
      gap: var(--case-space-4);
      margin-top: var(--case-space-2);
    }
    @media (max-width: 900px) {
      .exp-layout { grid-template-columns: 1fr; }
    }

    .exp-list-col {
      display: flex;
      flex-direction: column;
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
      overflow: hidden;
    }
    .exp-list-col--final {
      background: var(--case-color-success-bg);
      border-color: var(--case-color-success);
    }

    .exp-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--case-space-3) var(--case-space-4);
      border-bottom: 2px solid var(--case-border);
      background: var(--case-surface-4);
    }
    .exp-list-col--final .exp-list-header {
      border-bottom: 2px solid var(--case-color-success);
      background: transparent;
    }
    
    .exp-list-header h4 { margin: 0; font-size: 0.95rem; color: var(--case-text-primary); }
    
    .exp-badge {
      font-size: 0.7rem;
      background: var(--case-color-info-bg);
      color: var(--case-color-info);
      padding: 2px 6px;
      border-radius: var(--case-radius);
      font-weight: 600;
    }
    .exp-badge--semantic { background: var(--case-color-warning-bg); color: var(--case-color-warning); }
    .exp-badge--fusion { background: var(--case-color-success-bg); color: var(--case-color-success); }

    .exp-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: var(--case-space-3);
    }

    .exp-rank-card {
      display: flex;
      gap: 12px;
      background: var(--case-surface-4);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      padding: 10px;
      transition: var(--case-transition);
      opacity: 0.8;
    }
    .exp-rank-card.highlight {
      opacity: 1;
      border-color: var(--case-color-info);
      background: var(--case-surface-5);
      transform: translateY(-2px);
    }
    
    .exp-rank-card--final {
      background: var(--case-surface-4);
      border-color: var(--case-border);
    }
    .exp-rank-card--final.highlight {
      border-color: var(--case-color-success);
    }

    .exp-rank-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--case-surface-1);
      border-radius: var(--case-radius);
      font-weight: bold;
      font-size: 0.85rem;
      color: var(--case-text-secondary);
    }
    
    .exp-rank-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .exp-rank-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--case-text-primary);
    }
    .exp-rank-score {
      font-size: 0.75rem;
      color: var(--case-text-secondary);
      font-family: var(--case-font-mono);
    }
    .exp-rank-math {
      font-size: 0.7rem;
      color: var(--case-text-muted);
      font-family: var(--case-font-mono);
      margin-top: 2px;
    }

    .exp-callout {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: var(--case-color-info-bg);
      border: 1px solid var(--case-color-info);
      padding: var(--case-space-4);
      border-radius: var(--case-radius-md);
      margin-top: var(--case-space-3);
      color: var(--case-text-primary);
      font-size: 0.85rem;
    }
    .exp-callout .material-symbols-outlined { color: var(--case-color-info); }
  `]
})
export class ExpHybridSearchComponent {
  
  hoveredId = signal<string | null>(null);

  // Note: RRF uses (1 / (k + rank)). k is typically 60.
  // Rank is 1-indexed.
  
  documents: RankItem[] = [
    { id: 'd1', title: 'Crédito Educativo Tradicional', bm25Rank: 1, vectorRank: 2 },
    { id: 'd2', title: 'Seguro Educativo para Hijos', bm25Rank: null, vectorRank: 1 }, // High semantic match (hijo + educacion)
    { id: 'd3', title: 'Crédito de Libre Inversión', bm25Rank: 2, vectorRank: 4 }, // Matches "credito"
    { id: 'd4', title: 'Educación Financiera para Niños', bm25Rank: null, vectorRank: 3 }, // Semantic link
    { id: 'd5', title: 'Requisitos Crédito Educativo', bm25Rank: 3, vectorRank: 5 }, // Exact phrase match
  ];

  bm25Ranking = computed(() => {
    return this.documents.filter(d => d.bm25Rank !== null).sort((a, b) => a.bm25Rank! - b.bm25Rank!);
  });

  vectorRanking = computed(() => {
    return this.documents.filter(d => d.vectorRank !== null).sort((a, b) => a.vectorRank! - b.vectorRank!);
  });

  rrfRanking = computed(() => {
    const k_rrf = 60;
    
    const fusion = this.documents.map(doc => {
      let score = 0;
      if (doc.bm25Rank !== null) {
        score += 1 / (k_rrf + doc.bm25Rank);
      }
      if (doc.vectorRank !== null) {
        score += 1 / (k_rrf + doc.vectorRank);
      }
      return { doc, score };
    });

    return fusion.sort((a, b) => b.score - a.score);
  });

  formatRRF(rank: number | null): string {
    if (rank === null) return '0';
    return (1 / (60 + rank)).toFixed(4);
  }
}
