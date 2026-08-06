import { KnowledgeReference, KnowledgeRelation } from '../knowledge/knowledge.models';

/**
 * Standard filters for searching and retrieving knowledge.
 */
export interface SearchFilters {
  readonly providers?: readonly string[];
  readonly kinds?: readonly string[];
  readonly tags?: readonly string[];
  readonly workspace?: string;
}

/**
 * Indicates the user's implicit or explicit intention when issuing a command.
 * Allows the Context Engine to decide how to build the context.
 */
export enum RetrievalIntent {
  SEARCH = 'SEARCH',
  NAVIGATION = 'NAVIGATION',
  LEARNING = 'LEARNING',
  RECOMMENDATION = 'RECOMMENDATION',
  AI_CONTEXT = 'AI_CONTEXT'
}

/**
 * Pure input received from the UI/Facade, devoid of Angular state.
 */
export interface ContextInput {
  readonly activeNode?: KnowledgeReference;
  readonly workspace?: string;
  readonly history?: readonly KnowledgeReference[];
  readonly command?: string;
  readonly selection?: readonly KnowledgeReference[];
}

/**
 * Encapsulates the user's rich environment/state.
 * Constructed purely by the Context Engine.
 */
export interface KnowledgeContext {
  readonly activeNode?: KnowledgeReference;
  readonly workspace?: string;
  readonly history: readonly KnowledgeReference[];
  readonly inferredIntent: RetrievalIntent;
  readonly semanticNeighborhood?: readonly KnowledgeReference[];
  readonly activeRelations?: readonly KnowledgeRelation[];
}

/**
 * Paginates search results.
 */
export interface SearchPagination {
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Extensibility options for retrieval algorithms.
 */
export interface SearchOptions {
  readonly strict?: boolean;
}

/**
 * The unified contract for initiating a knowledge retrieval request.
 * Completely orchestrates how the Retrieval Engine will execute strategies.
 */
export interface RetrievalRequest {
  readonly query?: string;
  readonly intent: RetrievalIntent;
  readonly context: KnowledgeContext;
  readonly filters?: SearchFilters;
  readonly pagination?: SearchPagination;
  readonly options?: SearchOptions;
}
