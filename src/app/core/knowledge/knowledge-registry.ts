import { KnowledgeNode, KnowledgeReference } from './knowledge.models';
import { KnowledgeProvider } from './knowledge-provider.interface';

/**
 * Core events emitted by the Knowledge Registry for observability.
 */
export type RegistryEvent = 
  | { type: 'ProviderRegistered', providerId: string }
  | { type: 'ProviderRemoved', providerId: string }
  | { type: 'RegistryCleared' };

export type RegistryEventListener = (event: RegistryEvent) => void;

/**
 * The KnowledgeRegistry acts as the sole coordinator for KnowledgeProviders.
 * 
 * Responsibilities:
 * - Register and manage the lifecycle of Providers.
 * - Resolve nodes securely using KnowledgeReferences.
 * - Broadcast lifecycle events.
 * 
 * What it DOES NOT do:
 * - It does NOT search or index.
 * - It does NOT calculate relevance scores.
 * - It does NOT generate embeddings.
 * 
 * NOTE: This is a pure TypeScript class, completely framework-agnostic.
 */
export class KnowledgeRegistry {
  private readonly providers = new Map<string, KnowledgeProvider>();
  private readonly listeners = new Set<RegistryEventListener>();

  /**
   * Registers a new KnowledgeProvider.
   * Throws an error if the provider ID is already registered.
   */
  register(provider: KnowledgeProvider): void {
    if (this.providers.has(provider.id)) {
      throw new Error(`KnowledgeProvider with ID '${provider.id}' is already registered.`);
    }
    this.providers.set(provider.id, provider);
    this.emit({ type: 'ProviderRegistered', providerId: provider.id });
  }

  /**
   * Removes a provider by its ID.
   */
  unregister(id: string): void {
    if (this.providers.has(id)) {
      this.providers.delete(id);
      this.emit({ type: 'ProviderRemoved', providerId: id });
    }
  }

  /**
   * Replaces an existing provider or registers it if it doesn't exist.
   * Useful for dynamic plugin loading or hot-swapping providers.
   */
  replace(provider: KnowledgeProvider): void {
    this.providers.set(provider.id, provider);
    this.emit({ type: 'ProviderRegistered', providerId: provider.id });
  }

  /**
   * Clears all registered providers.
   */
  clear(): void {
    this.providers.clear();
    this.emit({ type: 'RegistryCleared' });
  }

  /**
   * Retrieves a specific provider by ID.
   */
  getProvider(id: string): KnowledgeProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Returns a readonly array of all registered providers.
   */
  getProviders(): readonly KnowledgeProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Resolves a knowledge node strictly via a KnowledgeReference.
   * Prevents arbitrary or loose ID resolution.
   */
  async resolveNode(ref: KnowledgeReference): Promise<KnowledgeNode | null> {
    const provider = this.getProvider(ref.providerId);
    if (!provider) {
      return null;
    }
    return provider.getNode(ref.nodeId);
  }

  /**
   * Subscribes to lifecycle events of the registry.
   * @returns A teardown function to unsubscribe.
   */
  subscribe(listener: RegistryEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: RegistryEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}
