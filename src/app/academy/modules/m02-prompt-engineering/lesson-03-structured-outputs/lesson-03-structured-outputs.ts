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
 * Lesson03StructuredOutputs — CASE Academy
 * Módulo 02 · Ingeniería de Prompts — Lección 03 (c6)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-structured-outputs',
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
  templateUrl: './lesson-03-structured-outputs.html',
  styleUrl: './lesson-03-structured-outputs.css'
})
export class Lesson03StructuredOutputs implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m02-prompt-engineering/lesson-03-structured-outputs');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m2');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c6');

  readonly relatedDemo = {
    title: 'Demo 02 — Diseñar la Instrucción',
    path: '/academy/modules/m02-prompt-engineering/demo-engineer-instruction',
    description: 'Simulador interactivo de esquemas y parsing en backend.'
  };

  readonly relatedLab = {
    title: 'Lab 02 — Diseñar un Contrato de Instrucción para IA',
    path: '/academy/modules/m02-prompt-engineering/lab-02-engineer-instruction-contract',
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
