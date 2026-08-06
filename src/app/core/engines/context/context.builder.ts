import { ContextInput, KnowledgeContext, RetrievalIntent } from '../../context/context.models';

/**
 * Pure, deterministic builder responsible for deducing the actual 
 * user's intent and translating simple UI interactions into a rich KnowledgeContext.
 * 
 * It has no side effects, no injections, and relies on no external state,
 * making it trivially testable.
 */
export class ContextBuilder {
  /**
   * Translates the raw UI ContextInput into a KnowledgeContext.
   */
  static build(input: ContextInput): KnowledgeContext {
    const intent = this.inferIntent(input);

    return {
      activeNode: input.activeNode,
      workspace: input.workspace,
      history: input.history ?? [],
      inferredIntent: intent,
      semanticNeighborhood: [], // Will be hydrated by GraphNavigator if needed
      activeRelations: []
    };
  }

  /**
   * Deterministic heuristic logic to infer what the user actually wants.
   */
  private static inferIntent(input: ContextInput): RetrievalIntent {
    if (input.command?.startsWith('/ask') || input.command?.startsWith('/ai')) {
      return RetrievalIntent.AI_CONTEXT;
    }
    
    if (input.command?.startsWith('/learn')) {
      return RetrievalIntent.LEARNING;
    }

    if (input.activeNode && !input.command) {
      return RetrievalIntent.NAVIGATION;
    }

    if (!input.command && input.activeNode && input.history?.length) {
      return RetrievalIntent.RECOMMENDATION;
    }

    return RetrievalIntent.SEARCH;
  }
}
