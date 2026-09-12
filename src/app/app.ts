import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationContextService } from './core/services/navigation-context.service';
import { LearningProgressService } from './core/services/learning-progress.service';
import { LocalStorageProvider } from './core/storage/local-storage.provider';
import { StorageNamespaceService } from './core/services/storage-namespace.service';
import { GuestClaimService } from './core/services/guest-claim.service';
import { UserProgressService } from './core/services/user-progress.service';
import { UserPreferencesService } from './core/services/user-preferences.service';
import { SyncQueueService } from './core/services/sync-queue.service';
import { SupabaseService } from './core/services/supabase.service';
import { EnrollmentService } from './core/services/enrollment.service';
import { CourseService } from './core/services/course.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Inicialización de servicios core de monitoreo de rutas
  private navContextService = inject(NavigationContextService);
  private learningProgress = inject(LearningProgressService);

  private storage = inject(LocalStorageProvider);
  private namespaceService = inject(StorageNamespaceService);
  private guestClaim = inject(GuestClaimService);
  private userProgress = inject(UserProgressService);
  private userPrefs = inject(UserPreferencesService);
  private syncQueue = inject(SyncQueueService);
  private supabaseService = inject(SupabaseService);
  private enrollmentService = inject(EnrollmentService);
  private courseService = inject(CourseService);

  constructor() {
    if (typeof window !== 'undefined') {
      (window as any).__caseServices = {
        storage: this.storage,
        namespace: this.namespaceService,
        guestClaim: this.guestClaim,
        userProgress: this.userProgress,
        userPrefs: this.userPrefs,
        syncQueue: this.syncQueue,
        supabase: this.supabaseService,
        enrollment: this.enrollmentService,
        course: this.courseService
      };
    }
  }
}
