import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { UserProgressService } from '../../core/services/user-progress.service';
import {
  CasePanelComponent,
  CaseBadgeComponent,
  CaseProgressBarComponent,
  CaseButtonComponent,
  BadgeVariant
} from '../../core/ui/components';

export interface ViewModule {
  id: string;
  title: string;
  order: number;
  formattedOrder: string;
  description: string;
  state: 'LIVE' | 'COMING_SOON' | 'LOCKED';
  uiState: 'COMPLETED' | 'CURRENT' | 'NEXT' | 'LOCKED';
  badgeVariant: BadgeVariant;
  badgeLabel: string;
  badgeIcon: string;
  iconName: string;
  lessonCount: number;
  demoCount: number;
  labCount: number;
  firstLessonPath?: string;
}

const MODULE_ICONS: Record<string, string> = {
  m1: 'terminal',
  m2: 'format_quote',
  m3: 'account_tree',
  m4: 'database',
  m5: 'smart_toy',
  m6: 'code',
  m7: 'integration_instructions',
  m8: 'shield',
  m9: 'architecture'
};

/**
 * HomeComponent — CASE Academy
 * Phase 2 — Visual Evolution of Academy Home
 *
 * Provides a high-density, engineering-first overview of the curriculum M01–M09,
 * active learning session, and overall progress.
 * Consumes strictly CASE Design System primitives and tokens.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CasePanelComponent,
    CaseBadgeComponent,
    CaseProgressBarComponent,
    CaseButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);
  
  readonly modules = this.courseService.getModules();
  readonly progress = this.userProgressService.getProgress();

  readonly totalModules = computed(() => this.modules.length);

  readonly totalLessonsCount = computed(() => {
    return this.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  });

  // ViewModel reactivo para la interfaz
  readonly viewModules = computed<ViewModule[]>(() => {
    const prog = this.progress();
    return this.modules.map(mod => {
      const lessonCount = mod.lessons?.filter(l => l.type === 'LESSON' || !l.type).length || 0;
      const demoCount = mod.lessons?.filter(l => l.type === 'DEMO').length || 0;
      const labCount = mod.lessons?.filter(l => l.type === 'LAB').length || 0;

      // Determinación de estado basada en la configuración real y progreso
      let uiState: 'COMPLETED' | 'CURRENT' | 'NEXT' | 'LOCKED' =
        mod.state === 'LIVE' ? 'CURRENT' : (mod.state === 'LOCKED' ? 'LOCKED' : 'NEXT');

      if (mod.state === 'LIVE' && mod.order < 9 && prog.completionPercentage > (mod.order * 10)) {
        uiState = 'COMPLETED';
      }

      let badgeVariant: BadgeVariant = 'default';
      let badgeLabel = 'BLOQUEADO';
      let badgeIcon = 'lock';

      if (uiState === 'COMPLETED') {
        badgeVariant = 'success';
        badgeLabel = 'COMPLETADO';
        badgeIcon = 'check';
      } else if (uiState === 'CURRENT') {
        badgeVariant = 'accent';
        badgeLabel = 'EN CURSO';
        badgeIcon = 'radio_button_checked';
      } else if (uiState === 'NEXT') {
        badgeVariant = 'default';
        badgeLabel = 'SIGUIENTE';
        badgeIcon = 'arrow_forward';
      }

      return {
        id: mod.id,
        title: mod.title,
        order: mod.order,
        formattedOrder: mod.order.toString().padStart(2, '0'),
        description: mod.description,
        state: mod.state,
        uiState,
        badgeVariant,
        badgeLabel,
        badgeIcon,
        iconName: MODULE_ICONS[mod.id] || 'terminal',
        lessonCount,
        demoCount,
        labCount,
        firstLessonPath: mod.lessons?.[0]?.path
      };
    });
  });

  readonly completedModulesCount = computed(() => {
    return this.viewModules().filter(m => m.uiState === 'COMPLETED').length;
  });

  readonly lastModuleTitle = computed(() => {
    const p = this.progress();
    if (!p.lastVisitedLessonId) return null;
    for (const m of this.modules) {
      if (m.lessons?.some(l => l.id === p.lastVisitedLessonId)) {
        return m.title;
      }
    }
    return null;
  });
}
