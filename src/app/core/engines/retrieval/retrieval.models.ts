import { KnowledgeNode, SearchCandidate } from '../../knowledge/knowledge.models';
import { KnowledgeProvider } from '../../knowledge/knowledge-provider.interface';

/**
 * Structured evidence explaining why a node was matched or scored.
 * Used for AI Engine explanations and UI rendering.
 */
export interface SearchEvidence {
  readonly strategy: string; // e.g., 'TitleMatch', 'SemanticMatch'
  readonly weight: number;
  readonly matchedValue: string; // Structured value, not a raw human sentence
}

/**
 * Encapsulates the entire reasoning behind a search result.
 */
export interface SearchExplanation {
  readonly breakdown: readonly SearchEvidence[];
  readonly confidence: number;
}

/**
 * DTO representing a candidate that has been hydrated and scored by the Retrieval Engine.
 */
export interface ScoredCandidate {
  readonly candidate: SearchCandidate;
  readonly node: KnowledgeNode; // Hydrated node
  readonly score: number;
  readonly explanation: SearchExplanation;
}

/**
 * DTO representing a candidate that has been fully ranked.
 */
export interface RankedCandidate extends ScoredCandidate {
  readonly rank: number;
}

/**
 * Final output of the Knowledge Retrieval Engine.
 * It contains the fully hydrated node and its explanation.
 */
export interface SearchResult {
  readonly nodeId: string;
  readonly providerId: string;
  readonly canonicalId?: string;
  readonly node: KnowledgeNode;
  readonly explanation: SearchExplanation;
}

/**
 * An abstraction over the origin of KnowledgeProviders.
 * Prevents the Retrieval Engine from being tightly coupled to the KnowledgeRegistry.
 */
export interface KnowledgeSource {
  getProviders(): readonly KnowledgeProvider[];
}
