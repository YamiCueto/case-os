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
  CaseButtonComponent,
  CaseBadgeComponent
} from '../../../../core/ui/components';

/**
 * Lesson01Probabilidad — CASE Academy
 * Módulo 01 · Fundamentos de IA — Lección 01 (c1)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-01-probabilidad',
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
  templateUrl: './lesson-01-probabilidad.html',
  styleUrl: './lesson-01-probabilidad.css'
})
export class Lesson01Probabilidad implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m01-ai-foundations/lesson-01-probabilidad');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m1');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c1');

  readonly relatedDemo = {
    title: 'Token Playground',
    path: '/academy/modules/m01-ai-foundations/demo-token-playground',
    description: 'Simulador determinista para comprender segmentación y costos de tokens.'
  };

  readonly relatedLab = {
    title: 'Lab 01 — Analizar una Rutina Legacy',
    path: '/academy/modules/m01-ai-foundations/lab-01-legacy-routine',
    duration: '60 min'
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
