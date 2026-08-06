/**
 * Represents a relationship between two nodes in the knowledge graph.
 */
export interface KnowledgeNodeRelation {
  type: string; // e.g. 'depends_on', 'relates_to', 'part_of', 'prerequisite_of'
  targetId: string;
}

/**
 * The fundamental entity of the Knowledge Platform.
 * Represents any piece of knowledge across the operating system (e.g., Course, Lab, Prompt).
 */
export interface KnowledgeNode {
  id: string;
  kind: string; // Open string instead of enum to allow dynamic Workspaces to register new kinds
  title: string;
  description?: string;
  tags?: string[];
  aliases?: string[];
  relations?: KnowledgeNodeRelation[]; // Enables the Context Engine to traverse the graph
  metadata?: Record<string, any>;
  capabilities?: string[];
}

/**
 * Represents the exact property and index range of a search match.
 */
export interface SearchMatch {
  property: string; // e.g., 'title', 'description', 'tags'
  indices: [number, number][]; // [startIndex, endIndex] of the match
}

/**
 * Represents a highlighted snippet for a search match.
 */
export interface SearchHighlight {
  property: string;
  snippet: string; // HTML or Markdown snippet with highlighted terms
}

/**
 * Data Transfer Object (DTO) returned by the Search Engine.
 * It does not own the knowledge; it only holds references to the Node.
 */
export interface SearchResult {
  nodeId: string;
  providerId: string;
  score: number; // Relevance score
  matches?: SearchMatch[];
  highlights?: SearchHighlight[];
}
