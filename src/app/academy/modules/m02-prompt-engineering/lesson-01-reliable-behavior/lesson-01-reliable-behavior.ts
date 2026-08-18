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
 * Lesson01ReliableBehavior — CASE Academy
 * Módulo 02 · Ingeniería de Prompts — Lección 01 (c4)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-01-reliable-behavior',
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
  templateUrl: './lesson-01-reliable-behavior.html',
  styleUrl: './lesson-01-reliable-behavior.css'
})
export class Lesson01ReliableBehavior implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m2');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c4');

  readonly relatedDemo = {
    title: 'Demo 02 — Diseñar la Instrucción',
    path: '/academy/modules/m02-prompt-engineering/demo-engineer-instruction',
    description: 'Simulador interactivo de contratos de instrucciones y parsers.'
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
