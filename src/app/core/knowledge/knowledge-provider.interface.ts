import { KnowledgeNode, SearchResult } from './knowledge.models';

/**
 * Standard capabilities a KnowledgeProvider can declare.
 */
export type ProviderCapability =
  | 'search'
  | 'hydration'
  | 'streaming'
  | 'aiContext'
  | string;

/**
 * Indicates the operational health of a KnowledgeProvider.
 */
export type ProviderStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';

/**
 * The contract that every Workspace or Data Source must implement to inject its 
 * content into the Knowledge Platform.
 * 
 * NOTE: This contract uses pure Promises by design to maintain neutrality 
 * from any framework (like RxJS or Angular), ensuring the core remains 
 * scalable and usable by Node workers or Edge environments. 
 * In the future, the `search` signature may evolve to `AsyncIterable` if streaming is required.
 */
export interface KnowledgeProvider {
  /**
   * Unique identifier for the provider.
   * e.g., 'case.academy', 'case.library', 'case.labs'
   */
  readonly id: string;

  /**
   * Human readable name for the provider.
   * e.g., 'Academy', 'Library', 'Labs'
   */
  readonly name: string;

  /**
   * Version of the provider, enabling multiple providers for the same domain 
   * (e.g., StaticProvider vs RESTProvider vs RAGProvider).
   */
  readonly version: string;

  /**
   * Priority for resolving conflicts or ordering results.
   */
  readonly priority: number;

  /**
   * Capabilities supported by this provider.
   */
  readonly capabilities: readonly ProviderCapability[];

  /**
   * Operational health status of the provider (for observability/resilience).
   */
  readonly status?: ProviderStatus;

  /**
   * Resolves a specific KnowledgeNode by its ID.
   * Used by the system to lazily hydrate search results or traverse context.
   * 
   * @param id The unique identifier of the node within this provider.
   * @returns A promise resolving to the KnowledgeNode, or null if not found.
   */
  getNode(id: string): Promise<KnowledgeNode | null>;

  /**
   * Performs a search against this provider's domain.
   * Returns references (SearchResults) rather than full objects to keep memory usage low.
   * 
   * @param query The search query string.
   * @returns A promise resolving to an array of SearchResult DTOs.
   */
  search(query: string): Promise<readonly SearchResult[]>;
}
