import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_02_DOCUMENT } from './lesson-02.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent,
  CaseButtonComponent
} from '../../../../core/ui/components';

/**
 * Lesson02Inferencia — CASE Academy
 * Módulo 01 · Fundamentos de IA — Lección 02 (c2)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-02-inferencia',
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
  templateUrl: './lesson-02-inferencia.html',
  styleUrl: './lesson-02-inferencia.css'
})
export class Lesson02Inferencia implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_02_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m01-ai-foundations/lesson-02-inferencia');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m1');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c2');

  readonly relatedDemo = {
    title: 'Token Playground',
    path: '/academy/modules/m01-ai-foundations/demo-token-playground',
    description: 'Simulador interactivo de segmentación de tokens y calculadora de costos.'
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
