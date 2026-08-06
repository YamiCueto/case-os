import { SearchRequest } from '../../context/context.models';

/**
 * A standard, composable stage within the Knowledge Retrieval Pipeline.
 * 
 * Pipeline stages are strictly immutable. They take an input type `TIn` and 
 * return a brand new output type `TOut` without modifying the original.
 */
export interface PipelineStage<TIn, TOut> {
  readonly name: string;
  execute(input: TIn, request: SearchRequest): Promise<TOut> | TOut;
}

/**
 * An orchestrator that chains multiple pipeline stages together sequentially.
 */
export class RetrievalPipeline<TInitial, TFinal> {
  private readonly stages: PipelineStage<any, any>[] = [];

  /**
   * Adds a new stage to the pipeline.
   * Note: TypeScript cannot easily guarantee generic type chaining at runtime for dynamic arrays,
   * so type-safety relies on the builder or the specific engine implementation.
   */
  addStage<TNext>(stage: PipelineStage<any, TNext>): this {
    this.stages.push(stage);
    return this;
  }

  /**
   * Executes the entire pipeline sequentially.
   */
  async run(initialInput: TInitial, request: SearchRequest): Promise<TFinal> {
    let currentData: any = initialInput;
    for (const stage of this.stages) {
      currentData = await stage.execute(currentData, request);
    }
    return currentData as TFinal;
  }
}
