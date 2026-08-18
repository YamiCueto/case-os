import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_03_DOCUMENT } from './lesson-03.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent,
  CaseButtonComponent
} from '../../../../core/ui/components';

/**
 * Lesson03Security — CASE Academy
 * Módulo 08 · IA en Producción — Lección 03 (c24)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-security',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LessonHeaderComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent,
    CaseButtonComponent
  ],
  templateUrl: './lesson-03-security.html',
  styleUrls: ['./lesson-03-security.css']
})
export class Lesson03Security implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m08-production/lesson-03-security');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m8');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c24');

  readonly relatedDemo = {
    title: 'Demo 08 — La Tubería de Evaluación',
    path: '/academy/modules/m08-production/demo-eval-pipeline',
    description: 'Simulador de evaluación multinivel y detección de False Passes.'
  };

  readonly relatedLab = {
    title: 'Lab 08 — Diseñar un Protocolo de IA en Producción',
    path: '/academy/modules/m08-production/lab-08-production-ai-protocol',
    duration: '90 min'
  };

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }
}
