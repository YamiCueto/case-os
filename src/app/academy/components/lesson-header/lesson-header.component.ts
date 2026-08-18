import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../../core/models/course.models';
import { CaseBadgeComponent, BadgeVariant } from '../../../core/ui/components';

/**
 * LessonHeaderComponent — CASE Academy
 * 
 * Cabecera técnica unificada para Living Technical Documentation.
 * Presenta metadata curricular (duración, dificultad, tags, objetivos)
 * consumiendo el contrato oficial de Lesson.
 */
@Component({
  selector: 'app-lesson-header',
  standalone: true,
  imports: [CommonModule, CaseBadgeComponent],
  templateUrl: './lesson-header.component.html',
  styleUrl: './lesson-header.component.css'
})
export class LessonHeaderComponent {
  @Input({ required: true }) lesson!: Lesson;
  @Input() moduleTitle?: string;
  @Input() subtitle?: string;

  readonly difficultyVariant = computed<BadgeVariant>(() => {
    switch (this.lesson?.difficulty) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'accent';
      case 'ADVANCED':
        return 'warning';
      case 'EXPERT':
        return 'error';
      default:
        return 'default';
    }
  });
}
