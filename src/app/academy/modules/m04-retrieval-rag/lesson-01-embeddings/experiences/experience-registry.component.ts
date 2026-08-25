import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpLexicalSemanticComponent } from './exp-lexical-semantic/exp-lexical-semantic.component';
import { ExpEmbeddings2dComponent } from './exp-embeddings-2d/exp-embeddings-2d.component';
import { ExpCosineSimilarityComponent } from './exp-cosine-similarity/exp-cosine-similarity.component';
import { ExpNearestNeighborsComponent } from './exp-nearest-neighbors/exp-nearest-neighbors.component';
import { ExpHnswNavigationComponent } from './exp-hnsw-navigation/exp-hnsw-navigation.component';
import { ExpHybridSearchComponent } from './exp-hybrid-search/exp-hybrid-search.component';
import { ExpRetrievalDecisionComponent } from './exp-retrieval-decision/exp-retrieval-decision.component';

@Component({
  selector: 'app-experience-registry',
  standalone: true,
  imports: [
    CommonModule,
    ExpLexicalSemanticComponent,
    ExpEmbeddings2dComponent,
    ExpCosineSimilarityComponent,
    ExpNearestNeighborsComponent,
    ExpHnswNavigationComponent,
    ExpHybridSearchComponent,
    ExpRetrievalDecisionComponent
  ],
  template: `
    <div class="experience-container">
      @switch (experienceId) {
        @case ('lexical-semantic-search') {
          <app-exp-lexical-semantic />
        }
        @case ('embeddings-2d') {
          <app-exp-embeddings-2d />
        }
        @case ('cosine-similarity') {
          <app-exp-cosine-similarity />
        }
        @case ('nearest-neighbors') {
          <app-exp-nearest-neighbors />
        }
        @case ('hnsw-navigation') {
          <app-exp-hnsw-navigation />
        }
        @case ('hybrid-search') {
          <app-exp-hybrid-search />
        }
        @case ('retrieval-decision') {
          <app-exp-retrieval-decision />
        }
        @default {
          <div class="experience-error">Experiencia no encontrada: {{ experienceId }}</div>
        }
      }
    </div>
  `,
  styles: [`
    .experience-container {
      margin: var(--case-space-6) 0;
      border: 1px solid var(--case-border, #e2e8f0);
      border-radius: var(--case-radius-lg, 8px);
      background: var(--case-surface-1, #ffffff);
      overflow: hidden;
    }
    .experience-error {
      padding: var(--case-space-4, 16px);
      color: var(--case-text-danger, #ef4444);
    }
  `]
})
export class ExperienceRegistryComponent {
  @Input({ required: true }) experienceId!: string;
}
