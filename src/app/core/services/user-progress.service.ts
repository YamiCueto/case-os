import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageProvider } from '../storage/local-storage.provider';
import { StorageNamespaceService } from './storage-namespace.service';
import { SupabaseService } from './supabase.service';
import { CourseService } from './course.service';
import { EnrollmentService } from './enrollment.service';
import { SyncQueueService } from './sync-queue.service';

export interface UserProgress {
  completionPercentage: number;
  lastVisitedLessonId?: string;
  lastVisitedLessonTitle?: string;
  lastVisitedLessonPath?: string;
  completedLessons: string[]; // array of canonical unit IDs (c1, l1, etc.)
}

const PROGRESS_KEY = 'completed_lessons';
const STATE_KEY = 'learning_state';

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {
  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);
  private supabaseService = inject(SupabaseService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private syncQueueService = inject(SyncQueueService);

  private totalUnits = signal<number>(this.courseService.getTotalUnitsCount());

  private progress = signal<UserProgress>({
    completionPercentage: 0,
    lastVisitedLessonId: undefined,
    lastVisitedLessonTitle: undefined,
    lastVisitedLessonPath: undefined,
    completedLessons: []
  });

  constructor() {
    this.reloadProgress();

    // Limpieza y recarga en memoria al alternar cuenta o cerrar sesión
    this.namespaceService.onReset(() => {
      this.totalUnits.set(this.courseService.getTotalUnitsCount());
      this.reloadProgress();
    });
  }

  reloadProgress(): void {
    const savedLessons = this.storage.get<string[]>(PROGRESS_KEY) || [];
    const savedState = this.storage.get<{ id?: string; title?: string; path?: string }>(STATE_KEY);
    const total = this.totalUnits() > 0 ? this.totalUnits() : this.courseService.getTotalUnitsCount();

    this.progress.set({
      completionPercentage: savedLessons.length > 0 ? Math.min(100, Math.round((savedLessons.length / total) * 100)) : 0,
      lastVisitedLessonId: savedState?.id,
      lastVisitedLessonTitle: savedState?.title,
      lastVisitedLessonPath: savedState?.path,
      completedLessons: savedLessons
    });

    if (this.supabaseService.canSynchronize()) {
      this.fetchRemoteProgress();
    }
  }

  getProgress() {
    return this.progress.asReadonly();
  }

  markLessonAsCompleted(lessonId: string): void {
    const total = this.totalUnits() > 0 ? this.totalUnits() : this.courseService.getTotalUnitsCount();

    this.progress.update(p => {
      const completed = new Set(p.completedLessons);
      completed.add(lessonId);
      const updatedLessons = Array.from(completed);
      const percentage = Math.min(100, Math.round((updatedLessons.length / total) * 100));

      this.storage.set(PROGRESS_KEY, updatedLessons);

      return {
        ...p,
        completionPercentage: percentage,
        completedLessons: updatedLessons
      };
    });

    if (this.supabaseService.isAuthenticated()) {
      // Encolar a través del procesador de sincronización con reintentos
      this.syncQueueService.enqueue('unit_progress', lessonId, 'upsert', {
        lessonId,
        declared_completed: true,
        declared_at: new Date().toISOString(),
        imported_from_guest: false
      });
    }
  }

  setLastVisitedLesson(lessonId: string, title: string, path: string): void {
    this.progress.update(p => ({
      ...p,
      lastVisitedLessonId: lessonId,
      lastVisitedLessonTitle: title,
      lastVisitedLessonPath: path
    }));

    this.storage.set(STATE_KEY, { id: lessonId, title, path });

    if (this.supabaseService.isAuthenticated()) {
      this.syncQueueService.enqueue('learning_state', 'cursor', 'upsert', {
        lessonId,
        path
      });
    }
  }

  /**
   * Sincronización remota segura protegida por authGeneration y vinculada estrictamente
   * a la inscripción activa del programa publicado correspondiente.
   */
  private async fetchRemoteProgress(): Promise<void> {
    const client = this.supabaseService.client;
    const user = this.supabaseService.currentUser();
    const expectedUserId = user?.id;
    const expectedGen = this.supabaseService.currentAuthGeneration();

    if (!client || !user || !expectedUserId) return;

    try {
      // 1. Resolver inscripción activa para el programa publicado
      const enrollment = await this.enrollmentService.ensureActiveEnrollment(expectedUserId, expectedGen);

      if (
        this.supabaseService.currentAuthGeneration() !== expectedGen ||
        this.supabaseService.currentUser()?.id !== expectedUserId
      ) {
        return;
      }

      if (!enrollment) return;

      this.totalUnits.set(enrollment.totalUnitsCount);

      // 2. Consultar progreso declarado ÚNICAMENTE para esta inscripción específica
      const { data, error } = await client
        .from('unit_progress')
        .select('declared_completed, learning_unit_versions!inner(unit_id)')
        .eq('enrollment_id', enrollment.enrollmentId)
        .eq('declared_completed', true);

      if (
        this.supabaseService.currentAuthGeneration() !== expectedGen ||
        this.supabaseService.currentUser()?.id !== expectedUserId
      ) {
        return;
      }

      if (error || !data) {
        console.warn('Error consultando progreso remoto:', error?.message);
        return;
      }

      const remoteLessonIds: string[] = [];
      for (const item of data as any[]) {
        if (item.learning_unit_versions?.unit_id) {
          remoteLessonIds.push(item.learning_unit_versions.unit_id);
        }
      }

      // 3. Consultar cursor de navegación remoto
      const { data: stateData, error: stateError } = await client
        .from('learning_state')
        .select('last_visited_path, learning_unit_versions(unit_id)')
        .eq('enrollment_id', enrollment.enrollmentId)
        .maybeSingle();

      if (
        this.supabaseService.currentAuthGeneration() !== expectedGen ||
        this.supabaseService.currentUser()?.id !== expectedUserId
      ) {
        return;
      }

      const total = enrollment.totalUnitsCount;

      this.progress.update(p => {
        const merged = Array.from(new Set([...p.completedLessons, ...remoteLessonIds]));
        this.storage.set(PROGRESS_KEY, merged);

        let newLessonId = p.lastVisitedLessonId;
        let newPath = p.lastVisitedLessonPath;

        if (stateData && !stateError && !newPath) {
          newPath = stateData.last_visited_path || undefined;
          newLessonId = (stateData.learning_unit_versions as any)?.unit_id || undefined;
          if (newPath) {
            this.storage.set(STATE_KEY, { id: newLessonId, title: p.lastVisitedLessonTitle, path: newPath });
          }
        }

        return {
          ...p,
          completedLessons: merged,
          completionPercentage: Math.min(100, Math.round((merged.length / total) * 100)),
          lastVisitedLessonId: newLessonId,
          lastVisitedLessonPath: newPath
        };
      });
    } catch (e) {
      console.warn('Fallo en sincronización de progreso remoto:', e);
    }
  }
}
