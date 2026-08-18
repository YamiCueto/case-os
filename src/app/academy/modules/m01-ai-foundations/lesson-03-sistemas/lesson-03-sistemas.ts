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
 * Lesson03Sistemas — CASE Academy
 * Módulo 01 · Fundamentos de IA — Lección 03 (c3)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-sistemas',
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
  templateUrl: './lesson-03-sistemas.html',
  styleUrl: './lesson-03-sistemas.css'
})
export class Lesson03Sistemas implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m01-ai-foundations/lesson-03-sistemas');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m1');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c3');

  readonly relatedDemo = {
    title: 'Demo 01 — Token Playground',
    path: '/academy/modules/m01-ai-foundations/demo-token-playground',
    description: 'Simulador interactivo de tokenización y costos.'
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
