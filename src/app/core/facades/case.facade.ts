import { Injectable } from '@angular/core';
import { ContextInput } from '../context/context.models';
import { ContextBuilder } from '../engines/context/context.builder';
import { KnowledgeRetrievalEngine } from '../engines/retrieval/retrieval.engine';
import { SearchResult } from '../engines/retrieval/retrieval.models';

/**
 * The unified entry point for UI components (like the Command Palette) to interact with CASE OS.
 * 
 * It shields the Presentation layer from knowing about Engines, Context Builders, or Retrievers.
 * The UI simply submits raw inputs and receives structured knowledge.
 */
@Injectable({ providedIn: 'root' })
export class CaseFacade {
  constructor(
    private readonly retrievalEngine: KnowledgeRetrievalEngine
  ) {}

  /**
   * Processes a raw user intention from the UI and returns relevant knowledge.
   * 
   * Orchestrates the core flow:
   * 1. Translates ContextInput into a rich KnowledgeContext via the pure ContextBuilder.
   * 2. Delegates to the RetrievalEngine with the inferred intent.
   * 3. (Future) Delegates to AI Provider Layer if the intent is AI_CONTEXT.
   */
  async processIntent(input: ContextInput, query?: string): Promise<readonly SearchResult[]> {
    // 1. Build context purely
    const context = ContextBuilder.build(input);

    // 2. Prepare request
    const request = {
      intent: context.inferredIntent,
      query,
      context
    };

    // 3. Retrieve
    return this.retrievalEngine.retrieve(request);
  }
}
