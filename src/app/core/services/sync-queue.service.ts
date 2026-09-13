import { Injectable, inject } from '@angular/core';
import {
  SyncQueueItem,
  SyncEntityType,
  SyncStatus,
  StorageNamespace,
  FavoriteItem,
  HistoryItem,
  getStorageNamespace
} from '../models/sync.model';
import { StorageNamespaceService } from './storage-namespace.service';
import { LocalStorageProvider } from '../storage/local-storage.provider';
import { SupabaseService } from './supabase.service';
import { EnrollmentService } from './enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class SyncQueueService {
  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);
  private supabaseService = inject(SupabaseService);
  private enrollmentService = inject(EnrollmentService);

  private isProcessing = false;
  private maxRetries = 3;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.supabaseService.canSynchronize()) {
          this.processQueue();
        }
      });
    }

    // Al completar la inicialización de sesión en SupabaseService
    this.supabaseService.onSessionInit?.(async (userId: string, gen: number) => {
      if (
        this.supabaseService.currentAuthGeneration() !== gen ||
        this.activeUserId !== userId
      ) {
        return;
      }

      if (!this.supabaseService.canSynchronize()) {
        this.updateGlobalStatus();
        return;
      }

      const queue = this.getQueueForUser(userId);
      if (queue.length > 0) {
        await this.processQueue();
      }

      if (
        this.supabaseService.currentAuthGeneration() === gen &&
        this.activeUserId === userId
      ) {
        this.updateGlobalStatus();
      }
    });

    this.namespaceService.onReset(() => {
      this.isProcessing = false;
      const expectedUserId = this.activeUserId;
      const expectedGen = this.supabaseService.currentAuthGeneration();

      if (!expectedUserId) {
        this.updateGlobalStatus();
        return;
      }

      queueMicrotask(async () => {
        if (
          this.supabaseService.currentAuthGeneration() !== expectedGen ||
          this.activeUserId !== expectedUserId
        ) {
          return;
        }

        if (!this.supabaseService.canSynchronize()) {
          this.updateGlobalStatus();
          return;
        }

        const queue = this.getQueueForUser(expectedUserId);
        if (queue.length > 0) {
          await this.processQueue();
        }

        if (
          this.supabaseService.currentAuthGeneration() === expectedGen &&
          this.activeUserId === expectedUserId
        ) {
          this.updateGlobalStatus();
        }
      });
    });
  }

  recalculateGlobalStatus(): void {
    this.updateGlobalStatus();
  }

  private get activeUserId(): string | null {
    return this.namespaceService.currentUserId();
  }

  enqueue<T>(entityType: SyncEntityType, id: string, action: 'insert' | 'update' | 'upsert' | 'delete', payload: T): void {
    const userId = this.activeUserId;
    const queue = this.getQueueForUser(userId);
    const existingIndex = queue.findIndex(item => item.id === id && item.entityType === entityType);

    const queueItem: SyncQueueItem<T> = {
      id,
      entityType,
      action,
      payload,
      enqueuedAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending'
    };

    if (existingIndex >= 0) {
      queue[existingIndex] = queueItem as SyncQueueItem<unknown>;
    } else {
      queue.push(queueItem as SyncQueueItem<unknown>);
    }

    this.saveQueueForUser(userId, queue);

    // Si el usuario puede sincronizar y está online, procesar de inmediato
    if (this.supabaseService.canSynchronize()) {
      this.supabaseService.setSyncStatus('syncing');
      queueMicrotask(() => this.processQueue());
    } else if (this.supabaseService.isPasswordRecovery()) {
      this.supabaseService.setSyncStatus('local');
    }
  }

  getQueue(): SyncQueueItem[] {
    return this.getQueueForUser(this.activeUserId);
  }

  getQueueForUser(userId: string | null): SyncQueueItem[] {
    const ns = getStorageNamespace(userId);
    const raw = this.storage.getRaw<SyncQueueItem[]>(ns.queueKey);
    return Array.isArray(raw) ? raw : [];
  }

  saveQueueForUser(userId: string | null, queue: SyncQueueItem[]): void {
    const ns = getStorageNamespace(userId);
    this.storage.setRaw(ns.queueKey, queue);
  }

  removeItem(id: string, entityType: SyncEntityType): void {
    this.removeItemForUser(this.activeUserId, id, entityType);
  }

  removeItemForUser(userId: string | null, id: string, entityType: SyncEntityType): void {
    const queue = this.getQueueForUser(userId).filter(item => !(item.id === id && item.entityType === entityType));
    this.saveQueueForUser(userId, queue);
    if (this.activeUserId === userId) {
      this.updateGlobalStatus();
    }
  }

  updateItemStatus(id: string, entityType: SyncEntityType, status: SyncStatus, errorMsg?: string): void {
    this.updateItemStatusForUser(this.activeUserId, id, entityType, status, errorMsg);
  }

  updateItemStatusForUser(userId: string | null, id: string, entityType: SyncEntityType, status: SyncStatus, errorMsg?: string): void {
    const queue = this.getQueueForUser(userId);
    const item = queue.find(q => q.id === id && q.entityType === entityType);
    if (item) {
      item.status = status;
      if (errorMsg) {
        item.lastError = errorMsg;
        item.retryCount += 1;
      }
      this.saveQueueForUser(userId, queue);
    }
    if (this.activeUserId === userId) {
      this.updateGlobalStatus();
    }
  }

  moveToDeadletter(id: string, entityType: SyncEntityType, errorMsg: string): void {
    this.moveToDeadletterForUser(this.activeUserId, id, entityType, errorMsg);
  }

  moveToDeadletterForUser(userId: string | null, id: string, entityType: SyncEntityType, errorMsg: string): void {
    const queue = this.getQueueForUser(userId);
    const index = queue.findIndex(q => q.id === id && q.entityType === entityType);
    if (index >= 0) {
      const [item] = queue.splice(index, 1);
      item.status = 'error';
      item.lastError = errorMsg;

      const deadletter = this.getDeadletterForUser(userId);
      deadletter.push(item);
      this.saveDeadletterForUser(userId, deadletter);
      this.saveQueueForUser(userId, queue);
    }
    if (this.activeUserId === userId) {
      this.updateGlobalStatus();
    }
  }

  getDeadletter(): SyncQueueItem[] {
    return this.getDeadletterForUser(this.activeUserId);
  }

  getDeadletterForUser(userId: string | null): SyncQueueItem[] {
    const ns = getStorageNamespace(userId);
    const raw = this.storage.getRaw<SyncQueueItem[]>(ns.deadletterKey);
    return Array.isArray(raw) ? raw : [];
  }

  saveDeadletterForUser(userId: string | null, deadletter: SyncQueueItem[]): void {
    const ns = getStorageNamespace(userId);
    this.storage.setRaw(ns.deadletterKey, deadletter);
  }

  clearQueue(): void {
    const ns = getStorageNamespace(this.activeUserId);
    this.storage.removeRaw(ns.queueKey);
    this.updateGlobalStatus();
  }

  clearDeadletter(): void {
    const ns = getStorageNamespace(this.activeUserId);
    this.storage.removeRaw(ns.deadletterKey);
    this.updateGlobalStatus();
  }

  private updateGlobalStatus(): void {
    if (this.supabaseService.isPasswordRecovery() || !this.supabaseService.isAuthenticated()) {
      this.supabaseService.setSyncStatus('local');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.supabaseService.setSyncStatus('offline');
      return;
    }

    const deadletter = this.getDeadletter();
    if (deadletter.length > 0) {
      this.supabaseService.setSyncStatus('error');
      return;
    }

    const queue = this.getQueue();
    if (queue.length > 0) {
      this.supabaseService.setSyncStatus('syncing');
      return;
    }

    this.supabaseService.setSyncStatus('synced');
  }

  /**
   * Procesador robusto de cola de sincronización con reintentos y aislamiento por authGeneration.
   */
  async processQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isProcessing) return { processed: 0, failed: 0 };

    if (!this.supabaseService.canSynchronize()) {
      this.updateGlobalStatus();
      return { processed: 0, failed: 0 };
    }

    const client = this.supabaseService.client;
    const user = this.supabaseService.currentUser();
    const expectedUserId = user?.id;
    const expectedGen = this.supabaseService.currentAuthGeneration();

    if (!client || !user || !expectedUserId) {
      this.updateGlobalStatus();
      return { processed: 0, failed: 0 };
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.supabaseService.setSyncStatus('offline');
      return { processed: 0, failed: 0 };
    }

    this.isProcessing = true;
    this.supabaseService.setSyncStatus('syncing');

    let processedCount = 0;
    let failedCount = 0;

    try {
      const items = [...this.getQueueForUser(expectedUserId)];

      for (const item of items) {
        // Verificar aislamiento de cuenta antes de cada despacho
        if (
          this.supabaseService.currentAuthGeneration() !== expectedGen ||
          this.supabaseService.currentUser()?.id !== expectedUserId
        ) {
          break;
        }

        try {
          const success = await this.dispatchItem(item, expectedUserId, expectedGen);

          // Si la cuenta cambió durante el despacho asíncrono, abortar sin tocar las colas del nuevo usuario
          if (
            this.supabaseService.currentAuthGeneration() !== expectedGen ||
            this.supabaseService.currentUser()?.id !== expectedUserId
          ) {
            break;
          }

          if (success) {
            this.removeItemForUser(expectedUserId, item.id, item.entityType);
            processedCount++;
          } else {
            failedCount++;
            if (item.retryCount >= this.maxRetries) {
              this.moveToDeadletterForUser(expectedUserId, item.id, item.entityType, item.lastError || 'Límite de reintentos excedido');
            } else {
              this.updateItemStatusForUser(expectedUserId, item.id, item.entityType, 'pending', item.lastError);
            }
          }
        } catch (err: unknown) {
          if (
            this.supabaseService.currentAuthGeneration() !== expectedGen ||
            this.supabaseService.currentUser()?.id !== expectedUserId
          ) {
            break;
          }
          failedCount++;
          const msg = err instanceof Error ? err.message : 'Fallo en despacho';
          if (item.retryCount >= this.maxRetries) {
            this.moveToDeadletterForUser(expectedUserId, item.id, item.entityType, msg);
          } else {
            this.updateItemStatusForUser(expectedUserId, item.id, item.entityType, 'pending', msg);
          }
        }
      }
    } finally {
      this.isProcessing = false;
      if (
        this.supabaseService.currentAuthGeneration() === expectedGen &&
        this.supabaseService.currentUser()?.id === expectedUserId
      ) {
        this.updateGlobalStatus();
      }
    }

    return { processed: processedCount, failed: failedCount };
  }

  private async dispatchItem(item: SyncQueueItem, userId: string, gen: number): Promise<boolean> {
    const client = this.supabaseService.client;
    if (!client) return false;

    switch (item.entityType) {
      case 'unit_progress': {
        const payload = item.payload as {
          lessonId: string;
          declared_completed: boolean;
          declared_at: string;
          imported_from_guest?: boolean;
        };

        const enrollment = await this.enrollmentService.ensureActiveEnrollment(userId, gen);
        if (!enrollment) {
          item.lastError = 'No se pudo resolver inscripción activa';
          return false;
        }

        const unitMap = await this.enrollmentService.getUnitVersionMap(enrollment.programVersionId);
        const unitVersionId = unitMap.get(payload.lessonId);
        if (!unitVersionId) {
          item.lastError = `La unidad ${payload.lessonId} no pertenece al programa inscrito`;
          return false;
        }

        const { error } = await client.from('unit_progress').upsert({
          enrollment_id: enrollment.enrollmentId,
          unit_version_id: unitVersionId,
          declared_completed: payload.declared_completed,
          declared_at: payload.declared_at,
          imported_from_guest: payload.imported_from_guest || false
        }, { onConflict: 'enrollment_id,unit_version_id' });

        if (error) {
          item.lastError = error.message;
          return false;
        }
        return true;
      }

      case 'learning_state': {
        const payload = item.payload as { lessonId?: string; path: string };
        const enrollment = await this.enrollmentService.ensureActiveEnrollment(userId, gen);
        if (!enrollment) {
          item.lastError = 'No se pudo resolver inscripción activa para cursor';
          return false;
        }

        let unitVersionId: string | null = null;
        if (payload.lessonId) {
          const unitMap = await this.enrollmentService.getUnitVersionMap(enrollment.programVersionId);
          unitVersionId = unitMap.get(payload.lessonId) || null;
        }

        const { error } = await client.from('learning_state').upsert({
          enrollment_id: enrollment.enrollmentId,
          last_visited_unit_version_id: unitVersionId,
          last_visited_path: payload.path,
          updated_at: new Date().toISOString()
        }, { onConflict: 'enrollment_id' });

        if (error) {
          item.lastError = error.message;
          return false;
        }
        return true;
      }

      case 'user_preferences': {
        const payload = item.payload as { favorites: FavoriteItem[]; history: HistoryItem[] };

        // Resolver conflictos leyendo el estado remoto actual
        const { data: remotePrefs } = await client
          .from('user_preferences')
          .select('favorites, history')
          .eq('user_id', userId)
          .maybeSingle();

        // 1. Merge CRDT LWW para favoritos
        const mergedFavoritesMap = new Map<string, FavoriteItem>();
        if (remotePrefs && Array.isArray(remotePrefs.favorites)) {
          for (const rf of remotePrefs.favorites as unknown as FavoriteItem[]) {
            if (rf.id) mergedFavoritesMap.set(rf.id, rf);
          }
        }
        for (const lf of payload.favorites) {
          const existing = mergedFavoritesMap.get(lf.id);
          if (!existing || new Date(lf.updated_at) >= new Date(existing.updated_at)) {
            mergedFavoritesMap.set(lf.id, lf);
          }
        }

        // 2. Merge de historial por path más reciente
        const historyMap = new Map<string, HistoryItem>();
        if (remotePrefs && Array.isArray(remotePrefs.history)) {
          for (const rh of remotePrefs.history as unknown as HistoryItem[]) {
            if (rh.path) historyMap.set(rh.path, rh);
          }
        }
        for (const lh of payload.history) {
          const existing = historyMap.get(lh.path);
          if (!existing || new Date(lh.visited_at) >= new Date(existing.visited_at)) {
            historyMap.set(lh.path, lh);
          }
        }

        const mergedFavorites = Array.from(mergedFavoritesMap.values());
        const mergedHistory = Array.from(historyMap.values())
          .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime())
          .slice(0, 20);

        const { error } = await client.from('user_preferences').upsert({
          user_id: userId,
          favorites: mergedFavorites as any,
          history: mergedHistory as any,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        if (error) {
          item.lastError = error.message;
          return false;
        }
        return true;
      }

      case 'learning_activity': {
        const payload = item.payload as {
          activity_type: 'ACADEMY' | 'LIBRARY' | 'LABS' | 'DASHBOARD' | 'OTHER';
          entity_id: string;
          title: string;
          route: string;
        };

        const { error } = await client.from('learning_activities').insert({
          user_id: userId,
          activity_type: payload.activity_type,
          entity_id: payload.entity_id,
          title: payload.title,
          route: payload.route
        });

        if (error) {
          item.lastError = error.message;
          return false;
        }
        return true;
      }

      default:
        return true;
    }
  }
}
