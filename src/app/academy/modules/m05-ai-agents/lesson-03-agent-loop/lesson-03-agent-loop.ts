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
 * Lesson03AgentLoop — CASE Academy
 * Módulo 05 · Agentes de IA — Lección 03 (c15)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-agent-loop',
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
  templateUrl: './lesson-03-agent-loop.html',
  styleUrls: ['./lesson-03-agent-loop.css']
})
export class Lesson03AgentLoop implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m05-ai-agents/lesson-03-agent-loop');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m5');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c15');

  readonly relatedDemo = {
    title: 'Demo 05 — El Bucle del Agente',
    path: '/academy/modules/m05-ai-agents/demo-agent-loop',
    description: 'Simulador del ciclo operacional Intent -> Action -> Observation.'
  };

  readonly relatedLab = {
    title: 'Lab 05 — Diseñar un Flujo de Trabajo Agéntico',
    path: '/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow',
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
