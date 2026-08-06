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
  readonly canonicalId?: string; // Used to deduplicate identical knowledge across different providers
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
 * Raw DTO returned by a KnowledgeProvider during the Collection phase.
 * Contains only minimal references. The engine will hydrate and score this candidate later.
 */
export interface SearchCandidate {
  readonly nodeId: string;
  readonly providerId: string;
}
