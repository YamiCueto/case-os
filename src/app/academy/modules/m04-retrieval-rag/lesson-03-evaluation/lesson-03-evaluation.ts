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
 * Lesson03Evaluation — CASE Academy
 * Módulo 04 · Recuperación y RAG — Lección 03 (c12)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-evaluation',
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
  templateUrl: './lesson-03-evaluation.html',
  styleUrl: './lesson-03-evaluation.css'
})
export class Lesson03Evaluation implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m04-retrieval-rag/lesson-03-evaluation');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m4');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c12');

  readonly relatedDemo = {
    title: 'Demo 04 — Construir la Recuperación',
    path: '/academy/modules/m04-retrieval-rag/demo-build-retrieval',
    description: 'Simulador interactivo de Top-K, Precision@K y Hit Rate.'
  };

  readonly relatedLab = {
    title: 'Lab 04 — Diseñar una Estrategia de Recuperación',
    path: '/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy',
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
