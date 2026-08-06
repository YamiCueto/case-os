import { KnowledgeNode } from '../../knowledge/knowledge.models';
import { RetrievalRequest } from '../../context/context.models';
import { SearchEvidence, ScoredCandidate, RankedCandidate } from './retrieval.models';

/**
 * Strategy for evaluating a node against a search request.
 * e.g., TitleMatchStrategy, SemanticEmbeddingStrategy, TagMatchStrategy.
 */
export interface RetrievalStrategy {
  readonly id: string;
  
  /**
   * Evaluates the node and returns evidence if it matches.
   * Returns null if the strategy yields no relevant score for this node.
   */
  score(node: KnowledgeNode, request: RetrievalRequest): Promise<SearchEvidence | null> | SearchEvidence | null;
}

/**
 * Strategy for ordering candidates.
 * e.g., PopularityRanking, LearningPathRanking, AI Reranking.
 */
export interface RankingStrategy {
  readonly id: string;
  
  /**
   * Sorts and re-ranks the candidates based on custom logic.
   */
  rank(candidates: readonly ScoredCandidate[], request: RetrievalRequest): Promise<readonly RankedCandidate[]> | readonly RankedCandidate[];
}

/**
 * Registry for managing dynamic Retrieval Strategies.
 */
export class RetrievalStrategyRegistry {
  private readonly strategies = new Map<string, RetrievalStrategy>();

  register(strategy: RetrievalStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  getStrategies(): readonly RetrievalStrategy[] {
    return Array.from(this.strategies.values());
  }
}

/**
 * Registry for managing dynamic Ranking Strategies.
 */
export class RankingStrategyRegistry {
  private readonly strategies = new Map<string, RankingStrategy>();

  register(strategy: RankingStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  getStrategies(): readonly RankingStrategy[] {
    return Array.from(this.strategies.values());
  }
}
