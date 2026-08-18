import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_01_DOCUMENT } from './lesson-01.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent,
  CaseButtonComponent
} from '../../../../core/ui/components';

/**
 * Lesson01Anatomy — CASE Academy
 * Módulo 03 · Ingeniería de Contexto — Lección 01 (c7)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-01-anatomy',
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
  templateUrl: './lesson-01-anatomy.html',
  styleUrl: './lesson-01-anatomy.css'
})
export class Lesson01Anatomy implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m03-context-engineering/lesson-01-anatomy');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m3');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c7');

  readonly relatedDemo = {
    title: 'Demo 03 — Diseñar el Contexto',
    path: '/academy/modules/m03-context-engineering/demo-engineer-context',
    description: 'Simulador interactivo de presupuestos de tokens y Minimum Useful Context.'
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
