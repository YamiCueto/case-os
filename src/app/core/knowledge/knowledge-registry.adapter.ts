import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KnowledgeRegistry, RegistryEvent } from './knowledge-registry';

/**
 * Angular Adapter for the Knowledge Registry.
 * 
 * Bridges the pure TypeScript `KnowledgeRegistry` into the Angular Dependency Injection system.
 * It also exposes the pure callback events as an RxJS Observable (`events$`) 
 * for idiomatic Angular consumption, without contaminating the Core with RxJS.
 */
@Injectable({
  providedIn: 'root'
})
export class KnowledgeRegistryAdapter extends KnowledgeRegistry implements OnDestroy {
  private readonly eventsSubject = new Subject<RegistryEvent>();
  
  /**
   * Observable stream of lifecycle events (ProviderRegistered, ProviderRemoved, etc.).
   */
  public readonly events$: Observable<RegistryEvent> = this.eventsSubject.asObservable();

  private unsubscribeFn: () => void;

  constructor() {
    super();
    // Bridge the pure TS callback into RxJS
    this.unsubscribeFn = this.subscribe((event) => {
      this.eventsSubject.next(event);
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
    this.eventsSubject.complete();
    this.clear(); // Free up memory when the root context is destroyed
  }
}
