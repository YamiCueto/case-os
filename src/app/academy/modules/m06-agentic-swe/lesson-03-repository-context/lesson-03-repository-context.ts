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
 * Lesson03RepositoryContext — CASE Academy
 * Módulo 06 · Ingeniería de Software Agéntica — Lección 03 (c18)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-repository-context',
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
  templateUrl: './lesson-03-repository-context.html',
  styleUrls: ['./lesson-03-repository-context.css']
})
export class Lesson03RepositoryContext implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m06-agentic-swe/lesson-03-repository-context');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c18');

  readonly relatedDemo = {
    title: 'Demo 06 — El Cambio Asistido por IA',
    path: '/academy/modules/m06-agentic-swe/demo-ai-coder',
    description: 'Simulador interactivo del perímetro de contexto y generación de parches.'
  };

  readonly relatedLab = {
    title: 'Lab 06 — Diseñar un Protocolo de Ingeniería de Software Agéntica',
    path: '/academy/modules/m06-agentic-swe/lab-06-agentic-swe-protocol',
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
