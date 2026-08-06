/**
 * Known types of semantic relationships between knowledge nodes.
 */
export type KnowledgeRelationType = 
  | 'requires'
  | 'recommends'
  | 'extends'
  | 'implements'
  | 'references'
  | 'generatedBy'
  | 'prerequisite'
  | 'next'
  | 'previous'
  | string; // Open to custom types registered by Workspaces

/**
 * Represents a semantic relationship between two nodes in the knowledge graph.
 */
export interface KnowledgeRelation {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: KnowledgeRelationType;
  readonly weight?: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Standard capabilities a KnowledgeNode can declare.
 */
export type KnowledgeCapability =
  | 'searchable'
  | 'recommendable'
  | 'indexable'
  | 'aiContext'
  | 'embeddable'
  | 'favoriteable'
  | 'shareable'
  | string;

/**
 * A standard pointer/reference to any KnowledgeNode across the OS.
 * Enables delayed resolution and prevents hardcoding objects or loose IDs.
 */
export interface KnowledgeReference {
  readonly providerId: string;
  readonly nodeId: string;
}

/**
 * The fundamental entity of the Knowledge Platform.
 * Represents any piece of knowledge across the operating system (e.g., Course, Lab, Prompt).
 * Nodes are strictly immutable to prevent unintended mutations by Engines.
 */
export interface KnowledgeNode {
  readonly id: string;
  readonly kind: string; // Open string instead of enum to allow dynamic Workspaces to register new kinds
  readonly title: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly aliases?: readonly string[];
  readonly relations?: readonly KnowledgeRelation[]; // Enables the Context Engine to traverse the graph
  readonly metadata?: Record<string, unknown>; // Open metadata, strictly unknown by the Core
  readonly capabilities?: readonly KnowledgeCapability[];
}

/**
 * Represents the exact property and index range of a search match.
 */
export interface SearchMatch {
  readonly property: string; // e.g., 'title', 'description', 'tags'
  readonly indices: readonly [number, number][]; // [startIndex, endIndex] of the match
}

/**
 * Represents a highlighted snippet for a search match.
 */
export interface SearchHighlight {
  readonly property: string;
  readonly snippet: string; // HTML or Markdown snippet with highlighted terms
}

/**
 * Data Transfer Object (DTO) returned by the Search Engine.
 * It does not own the knowledge; it only holds references to the Node.
 */
export interface SearchResult {
  readonly nodeId: string;
  readonly providerId: string;
  readonly score: number; // Relevance score
  readonly reason?: string; // AI Explanation of why this result matched (e.g., 'Coincide con tags')
  readonly matches?: readonly SearchMatch[];
  readonly highlights?: readonly SearchHighlight[];
}
