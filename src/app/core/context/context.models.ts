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
 * Encapsulates the user's current environment/state.
 * Shared across the Search Engine, Context Engine, and AI Engine.
 */
export interface SearchContext {
  readonly workspace?: string;
  readonly locale?: string;
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
 * Search is no longer a plain text string; it is an intention.
 */
export interface SearchRequest {
  readonly query: string;
  readonly filters?: SearchFilters;
  readonly context?: SearchContext;
  readonly pagination?: SearchPagination;
  readonly options?: SearchOptions;
}
