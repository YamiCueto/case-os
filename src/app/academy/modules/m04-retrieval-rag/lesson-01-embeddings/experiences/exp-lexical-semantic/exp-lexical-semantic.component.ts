import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  tokens: string[]; // For lexical match simulation
  concept: string; // For semantic match simulation
}

interface SearchResult {
  doc: SearchDocument;
  score: number;
  explanation: string;
}

@Component({
  selector: 'app-exp-lexical-semantic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Experimento: Léxico vs Semántico</h3>
        <p class="exp-subtitle">Observa cómo cada motor clasifica los mismos documentos según la query.</p>
      </div>
      
      <div class="exp-controls">
        <label for="query-input" class="exp-label">Prueba con diferentes intenciones:</label>
        <div class="exp-search-box">
          <input 
            id="query-input"
            type="text" 
            class="exp-input"
            [value]="query()"
            (input)="updateQuery($event)"
            placeholder="Escribe una query..."
          />
        </div>
        <div class="exp-suggestions">
          <span class="exp-suggestion-label">Sugerencias:</span>
          @for (sugg of suggestions; track sugg) {
            <button class="exp-suggestion-btn" (click)="setQuery(sugg)">{{ sugg }}</button>
          }
        </div>
      </div>

      <div class="exp-comparison">
        <!-- BM25 Column -->
        <div class="exp-column">
          <div class="exp-column-header">
            <h4>Búsqueda Léxica (Simulación BM25)</h4>
            <span class="exp-badge">Busca palabras exactas</span>
          </div>
          <div class="exp-results">
            @for (res of lexicalResults(); track res.doc.id) {
              <div class="exp-card" [class.exp-card--match]="res.score > 0">
                <div class="exp-card-score">{{ (res.score * 100).toFixed(0) }}%</div>
                <div class="exp-card-content">
                  <div class="exp-card-title">{{ res.doc.title }}</div>
                  <div class="exp-card-text" [innerHTML]="highlightLexical(res.doc.content, query())"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Semantic Column -->
        <div class="exp-column">
          <div class="exp-column-header">
            <h4>Búsqueda Semántica (Embeddings)</h4>
            <span class="exp-badge exp-badge--semantic">Busca significados</span>
          </div>
          <div class="exp-results">
            @for (res of semanticResults(); track res.doc.id) {
              <div class="exp-card" [class.exp-card--match]="res.score > 0.5">
                <div class="exp-card-score">{{ (res.score * 100).toFixed(0) }}%</div>
                <div class="exp-card-content">
                  <div class="exp-card-title">{{ res.doc.title }}</div>
                  <div class="exp-card-text">{{ res.doc.content }}</div>
                  @if (res.score > 0.5) {
                    <div class="exp-card-explanation">Conexión: {{ res.explanation }}</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-6);
      padding: var(--case-space-6);
      font-family: var(--case-font-sans);
      background: var(--case-surface-2);
      color: var(--case-text-primary);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }
    .exp-header {
      border-bottom: 1px solid var(--case-border);
      padding-bottom: var(--case-space-4);
    }
    .exp-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: var(--case-text-primary);
    }
    .exp-subtitle {
      color: var(--case-text-secondary);
      margin: 0;
      font-size: 0.9rem;
    }
    .exp-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .exp-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--case-text-primary);
    }
    .exp-input {
      width: 100%;
      padding: 12px;
      background: var(--case-surface-1);
      color: var(--case-text-primary);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      font-size: 1rem;
    }
    .exp-input:focus {
      outline: 2px solid var(--case-accent);
      outline-offset: -1px;
    }
    .exp-input::placeholder {
      color: var(--case-text-muted);
    }
    .exp-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-top: 4px;
    }
    .exp-suggestion-label {
      font-size: 0.8rem;
      color: var(--case-text-secondary);
    }
    .exp-suggestion-btn {
      background: var(--case-surface-3);
      color: var(--case-text-primary);
      border: 1px solid var(--case-border);
      padding: 4px 10px;
      border-radius: var(--case-radius-pill);
      font-size: 0.8rem;
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-suggestion-btn:hover {
      background: var(--case-state-hover);
    }
    .exp-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--case-space-6);
    }
    @media (max-width: 768px) {
      .exp-comparison {
        grid-template-columns: 1fr;
      }
    }
    .exp-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--case-surface-3);
      padding: 16px;
      border-radius: var(--case-radius-md);
      border: 1px solid var(--case-border);
    }
    .exp-column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--case-border);
      padding-bottom: 8px;
    }
    .exp-column-header h4 {
      margin: 0;
      font-size: 1rem;
      color: var(--case-text-primary);
    }
    .exp-badge {
      font-size: 0.7rem;
      background: var(--case-color-info-bg);
      color: var(--case-color-info);
      padding: 2px 6px;
      border-radius: var(--case-radius);
      font-weight: 600;
    }
    .exp-badge--semantic {
      background: var(--case-color-success-bg);
      color: var(--case-color-success);
    }
    .exp-results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .exp-card {
      display: flex;
      gap: 12px;
      background: var(--case-surface-4);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      padding: 12px;
      opacity: 0.6;
      transition: var(--case-transition);
    }
    .exp-card--match {
      opacity: 1;
      border-left: 4px solid var(--case-accent);
      background: var(--case-surface-5);
    }
    .exp-card-score {
      font-weight: bold;
      color: var(--case-text-secondary);
      min-width: 45px;
    }
    .exp-card-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .exp-card-title {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--case-text-primary);
    }
    .exp-card-text {
      font-size: 0.85rem;
      color: var(--case-text-secondary);
    }
    .exp-card-explanation {
      font-size: 0.75rem;
      color: var(--case-color-success);
      background: var(--case-color-success-bg);
      padding: 4px 8px;
      border-radius: var(--case-radius);
      margin-top: 4px;
      display: inline-block;
    }
    ::ng-deep .lexical-highlight {
      background: var(--case-accent-muted);
      color: var(--case-accent);
      font-weight: bold;
    }
  `]
})
export class ExpLexicalSemanticComponent {
  query = signal('guardar plata todos los meses');

  suggestions = [
    'guardar plata todos los meses',
    'Factura #100245',
    'financiar mis estudios',
    'comprar una casa'
  ];

  documents: SearchDocument[] = [
    {
      id: 'doc1',
      title: 'Ahorro programado',
      content: 'Guarda dinero todos los meses con una tasa preferencial para el futuro.',
      tokens: ['guarda', 'dinero', 'todos', 'los', 'meses', 'con', 'una', 'tasa', 'preferencial', 'para', 'el', 'futuro', 'ahorro', 'programado'],
      concept: 'savings'
    },
    {
      id: 'doc2',
      title: 'Crédito de vivienda',
      content: 'Financiación para la compra de tu casa propia con beneficios.',
      tokens: ['financiación', 'para', 'la', 'compra', 'de', 'tu', 'casa', 'propia', 'con', 'beneficios', 'crédito', 'vivienda'],
      concept: 'mortgage'
    },
    {
      id: 'doc3',
      title: 'Crédito educativo',
      content: 'Préstamo para estudiar y financiar tu matrícula universitaria.',
      tokens: ['préstamo', 'para', 'estudiar', 'y', 'financiar', 'tu', 'matrícula', 'universitaria', 'crédito', 'educativo'],
      concept: 'education_loan'
    },
    {
      id: 'doc4',
      title: 'Factura #100245',
      content: 'Cobro por servicios de intermediación del periodo anterior.',
      tokens: ['cobro', 'por', 'servicios', 'de', 'intermediación', 'del', 'periodo', 'anterior', 'factura', '100245'],
      concept: 'invoice'
    },
    {
      id: 'doc5',
      title: 'Canales de atención',
      content: 'Líneas telefónicas y sucursales físicas para tus consultas.',
      tokens: ['líneas', 'telefónicas', 'y', 'sucursales', 'físicas', 'para', 'tus', 'consultas', 'canales', 'atención'],
      concept: 'support'
    }
  ];

  // Map user intents to concepts for simulation
  conceptMappings: Record<string, { concept: string, score: number, exp: string }[]> = {
    'ahorro': [{ concept: 'savings', score: 0.95, exp: '"plata" ≈ "dinero" / "ahorro"' }],
    'guardar': [{ concept: 'savings', score: 0.85, exp: 'Intención de acumular capital' }],
    'plata': [{ concept: 'savings', score: 0.80, exp: 'Sinónimo de dinero' }],
    'estudio': [{ concept: 'education_loan', score: 0.92, exp: '"estudios" ≈ "estudiar" / "matrícula"' }],
    'educacion': [{ concept: 'education_loan', score: 0.90, exp: 'Campo semántico relacionado' }],
    'universidad': [{ concept: 'education_loan', score: 0.85, exp: 'Contexto educativo' }],
    'financiar': [{ concept: 'education_loan', score: 0.70, exp: 'Intención de crédito' }, { concept: 'mortgage', score: 0.65, exp: 'Intención de crédito' }],
    'casa': [{ concept: 'mortgage', score: 0.95, exp: 'Relacionado a vivienda' }],
    'hogar': [{ concept: 'mortgage', score: 0.90, exp: 'Sinónimo de casa/vivienda' }],
    'comprar': [{ concept: 'mortgage', score: 0.70, exp: 'Intención de adquisición' }],
    'factura': [{ concept: 'invoice', score: 0.85, exp: 'Término administrativo general' }] // Semantically, a specific invoice ID is hard
  };

  updateQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  setQuery(q: string) {
    this.query.set(q);
  }

  // --- Lexical Simulation (TF-IDF / BM25 simplified) ---
  lexicalResults = computed(() => {
    const q = this.query().toLowerCase();
    const qTokens = q.replace(/[^\w\sáéíóú]/g, '').split(/\s+/).filter(t => t.length > 2);
    
    let results: SearchResult[] = this.documents.map(doc => {
      let score = 0;
      let matched = 0;
      qTokens.forEach(qt => {
        if (doc.tokens.some(dt => dt.includes(qt) || qt.includes(dt))) {
          score += 0.3; // arbitrary TF weight
          matched++;
        }
      });
      // Exact ID matching simulation
      if (q.includes('100245') && doc.id === 'doc4') score += 0.9;

      return { doc, score: Math.min(score, 1), explanation: `Coincidencia en ${matched} palabras` };
    });

    return results.sort((a, b) => b.score - a.score);
  });

  // --- Semantic Simulation (Embeddings Cosine Similarity simplified) ---
  semanticResults = computed(() => {
    const q = this.query().toLowerCase();
    const qTokens = q.replace(/[^\w\sáéíóú]/g, '').split(/\s+/).filter(t => t.length > 2);
    
    let results: SearchResult[] = this.documents.map(doc => {
      let score = 0.1; // Base small similarity
      let explanation = 'Baja afinidad conceptual';

      qTokens.forEach(qt => {
        // Find mapped concepts
        for (const [key, maps] of Object.entries(this.conceptMappings)) {
          if (qt.includes(key) || key.includes(qt)) {
            const match = maps.find(m => m.concept === doc.concept);
            if (match && match.score > score) {
              score = match.score;
              explanation = match.exp;
            }
          }
        }
      });

      // Semantic struggles with exact IDs unless memorized
      if (q.includes('100245') && doc.id === 'doc4') {
        score = 0.4;
        explanation = 'Los embeddings generalizan números específicos';
      }

      return { doc, score, explanation };
    });

    return results.sort((a, b) => b.score - a.score);
  });

  highlightLexical(content: string, query: string): string {
    if (!query) return content;
    const qTokens = query.toLowerCase().replace(/[^\w\sáéíóú]/g, '').split(/\s+/).filter(t => t.length > 2);
    let highlighted = content;
    qTokens.forEach(qt => {
      const regex = new RegExp(`(${qt})`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="lexical-highlight">$1</span>');
    });
    return highlighted;
  }
}
