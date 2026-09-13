import { Injectable, inject, signal, effect } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { LocalStorageProvider } from '../storage/local-storage.provider';
import { StorageNamespaceService } from './storage-namespace.service';
import { getStorageNamespace } from '../models/sync.model';
import { CourseService } from './course.service';
import { EnrollmentService } from './enrollment.service';
import { UserProgressService } from './user-progress.service';

export interface FailedImportItem {
  lessonId: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuestClaimService {
  private supabaseService = inject(SupabaseService);
  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private userProgressService = inject(UserProgressService, { optional: true });

  readonly hasGuestData = signal<boolean>(false);
  readonly isImporting = signal<boolean>(false);
  readonly importError = signal<string | null>(null);
  readonly lastImportCount = signal<number>(0);
  readonly failedLessons = signal<FailedImportItem[]>([]);

  private readonly guestNs = getStorageNamespace(null);
  private readonly GUEST_LESSONS_KEY = `${this.guestNs.prefix}completed_lessons`;

  constructor() {
    effect(() => {
      const isAuth = this.supabaseService.isAuthenticated();
      this.isImporting.set(false);
      this.importError.set(null);
      if (isAuth) {
        this.checkGuestData();
      } else {
        this.hasGuestData.set(false);
      }
    });

    this.namespaceService.onReset(() => {
      this.isImporting.set(false);
      this.importError.set(null);
    });
  }

  checkGuestData(): boolean {
    const guestLessons = this.getGuestLessons();
    const hasData = guestLessons.length > 0;
    this.hasGuestData.set(hasData);
    return hasData;
  }

  getGuestLessons(): string[] {
    const list = this.storage.getRaw<string[]>(this.GUEST_LESSONS_KEY);
    return Array.isArray(list) ? list : [];
  }

  /**
   * Importa datos de invitado por lotes confirmados.
   * Elimina ÚNICAMENTE los elementos confirmados que fueron efectivamente persistidos.
   * Cualquier elemento fallido, unidad inexistente o cambio concurrente permanece en guest storage.
   * Toda la operación está protegida por authGeneration y currentUserId.
   */
  async importGuestProgress(): Promise<{ success: boolean; importedCount: number; failedCount: number }> {
    const client = this.supabaseService.client;
    const user = this.supabaseService.currentUser();
    const currentUserId = user?.id;
    const expectedGen = this.supabaseService.currentAuthGeneration();

    if (!client || !user || !currentUserId) {
      this.importError.set('No hay sesión de usuario activa para asociar el progreso.');
      return { success: false, importedCount: 0, failedCount: 0 };
    }

    // 1. Snapshot inmutable de los elementos a importar
    const snapshotIds = [...this.getGuestLessons()];
    if (snapshotIds.length === 0) {
      this.hasGuestData.set(false);
      return { success: true, importedCount: 0, failedCount: 0 };
    }

    this.isImporting.set(true);
    this.importError.set(null);
    this.failedLessons.set([]);

    try {
      // 2. Resolver o auto-inscribir al usuario en la versión publicada del programa
      const enrollmentInfo = await this.enrollmentService.ensureActiveEnrollment(currentUserId, expectedGen);

      if (this.supabaseService.currentAuthGeneration() !== expectedGen || this.supabaseService.currentUser()?.id !== currentUserId) {
        return { success: false, importedCount: 0, failedCount: 0 };
      }

      if (!enrollmentInfo) {
        const errorMsg = 'No se pudo resolver ni crear una inscripción activa en el programa publicado.';
        this.importError.set(errorMsg);
        const allFailed = snapshotIds.map(id => ({ lessonId: id, reason: errorMsg }));
        this.failedLessons.set(allFailed);
        return { success: false, importedCount: 0, failedCount: snapshotIds.length };
      }

      const { enrollmentId, programVersionId } = enrollmentInfo;

      // 3. Mapear las unidades válidas del programa publicado
      const unitMap = await this.enrollmentService.getUnitVersionMap(programVersionId);

      if (this.supabaseService.currentAuthGeneration() !== expectedGen || this.supabaseService.currentUser()?.id !== currentUserId) {
        return { success: false, importedCount: 0, failedCount: 0 };
      }

      if (unitMap.size === 0) {
        const msg = 'No se encontraron unidades en la versión publicada del programa.';
        this.importError.set(msg);
        return { success: false, importedCount: 0, failedCount: snapshotIds.length };
      }

      // 5. Intentar persistir cada lección individualmente
      const confirmedImportedIds: string[] = [];
      const failedItems: FailedImportItem[] = [];

      for (const lessonId of snapshotIds) {
        if (this.supabaseService.currentAuthGeneration() !== expectedGen || this.supabaseService.currentUser()?.id !== currentUserId) {
          return { success: false, importedCount: confirmedImportedIds.length, failedCount: failedItems.length };
        }

        const unitVersionId = unitMap.get(lessonId);
        if (!unitVersionId) {
          // Unidad inexistente o no incluida en esta versión de programa
          // Se conserva en almacenamiento de invitado y se reporta
          failedItems.push({
            lessonId,
            reason: `La unidad '${lessonId}' no existe en la versión publicada del programa.`
          });
          continue;
        }

        const { error: upsertErr } = await client
          .from('unit_progress')
          .upsert({
            enrollment_id: enrollmentId,
            unit_version_id: unitVersionId,
            declared_completed: true,
            declared_at: new Date().toISOString(),
            imported_from_guest: true
          }, { onConflict: 'enrollment_id,unit_version_id' });

        if (this.supabaseService.currentAuthGeneration() !== expectedGen || this.supabaseService.currentUser()?.id !== currentUserId) {
          return { success: false, importedCount: confirmedImportedIds.length, failedCount: failedItems.length };
        }

        if (upsertErr) {
          failedItems.push({
            lessonId,
            reason: `Error al persistir: ${upsertErr.message}`
          });
        } else {
          confirmedImportedIds.push(lessonId);
        }
      }

      // 6. Verificación final de generación antes de alterar almacenamiento local
      if (this.supabaseService.currentAuthGeneration() !== expectedGen || this.supabaseService.currentUser()?.id !== currentUserId) {
        return { success: false, importedCount: confirmedImportedIds.length, failedCount: failedItems.length };
      }

      // 7. Eliminación estrictamente conservativa: se eliminan ÚNICAMENTE los IDs confirmados
      const latestGuestLessons = this.getGuestLessons();
      const remainingLessons = latestGuestLessons.filter(id => !confirmedImportedIds.includes(id));

      if (remainingLessons.length > 0) {
        this.storage.setRaw(this.GUEST_LESSONS_KEY, remainingLessons);
        this.hasGuestData.set(true);
      } else {
        this.storage.removeRaw(this.GUEST_LESSONS_KEY);
        this.hasGuestData.set(false);
      }

      this.lastImportCount.set(confirmedImportedIds.length);
      this.failedLessons.set(failedItems);

      // 8. Hidratación y recarga reactiva inmediata de UserProgressService
      if (confirmedImportedIds.length > 0 && this.userProgressService) {
        this.userProgressService.reloadProgress();
      }

      if (failedItems.length > 0) {
        this.importError.set(
          `${failedItems.length} unidad(es) no pudieron importarse y se mantienen pendientes en almacenamiento local.`
        );
      }

      return {
        success: failedItems.length === 0,
        importedCount: confirmedImportedIds.length,
        failedCount: failedItems.length
      };
    } catch (err: unknown) {
      if (this.supabaseService.currentAuthGeneration() === expectedGen && this.supabaseService.currentUser()?.id === currentUserId) {
        const msg = err instanceof Error ? err.message : 'Error imprevisto durante la importación';
        this.importError.set(msg);
      }
      return { success: false, importedCount: 0, failedCount: snapshotIds.length };
    } finally {
      this.isImporting.set(false);
    }
  }

  dismissPrompt(): void {
    this.hasGuestData.set(false);
  }
}
