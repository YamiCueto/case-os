import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../../core/models/course.models';
import { UserProgressService } from '../../../core/services/user-progress.service';
import { CaseButtonComponent, CaseBadgeComponent } from '../../../core/ui/components';

/**
 * LessonFooterComponent — CASE Academy
 * 
 * Pie técnico de Living Documentation:
 * - Marcación de completitud respetando UserProgressService.
 * - Enlaces directos a Demo y Lab relacionados.
 * - Navegación fluida a lección anterior y siguiente.
 */
@Component({
  selector: 'app-lesson-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, CaseButtonComponent, CaseBadgeComponent],
  templateUrl: './lesson-footer.component.html',
  styleUrl: './lesson-footer.component.css'
})
export class LessonFooterComponent {
  private userProgressService = inject(UserProgressService);

  @Input({ required: true }) lessonId!: string;
  @Input() nextLesson?: Lesson;
  @Input() previousLesson?: Lesson;
  @Input() relatedDemo?: { title: string; path: string; description?: string; };
  @Input() relatedLab?: { title: string; path: string; duration?: string; };

  readonly progress = this.userProgressService.getProgress();

  readonly isCompleted = computed(() => {
    return this.progress().completedLessons.includes(this.lessonId);
  });

  markCompleted(): void {
    if (!this.isCompleted()) {
      this.userProgressService.markLessonAsCompleted(this.lessonId);
    }
  }
}
