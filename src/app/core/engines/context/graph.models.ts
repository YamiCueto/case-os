import { KnowledgeNode, KnowledgeReference, KnowledgeRelation } from '../../knowledge/knowledge.models';

/**
 * Expressive representation of a path traversed through the Knowledge Graph.
 * Useful for Explainable AI or UI breadcrumbs during Semantic Navigation.
 */
export interface SemanticPath {
  readonly nodes: readonly KnowledgeNode[];
  readonly relations: readonly KnowledgeRelation[];
  readonly weight: number;
  readonly explanation: string;
}

/**
 * Pure abstraction over the underlying graph database or registry.
 * The Context Engine depends on this interface, shielding it from implementation details
 * like KnowledgeRegistry, Neo4j, or remote graph endpoints.
 */
export interface KnowledgeGraph {
  /**
   * Resolves a reference to a concrete node.
   */
  resolve(ref: KnowledgeReference): Promise<KnowledgeNode | null>;

  /**
   * Retrieves the immediate semantic neighbors of a node.
   */
  neighbors(nodeId: string, depth?: number): Promise<readonly KnowledgeNode[]>;

  /**
   * Retrieves the raw relations defined on a node.
   */
  relations(nodeId: string): Promise<readonly KnowledgeRelation[]>;
}
