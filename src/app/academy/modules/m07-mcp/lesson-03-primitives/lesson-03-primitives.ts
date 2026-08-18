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
 * Lesson03Primitives — CASE Academy
 * Módulo 07 · Model Context Protocol — Lección 03 (c21)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-primitives',
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
  templateUrl: './lesson-03-primitives.html',
  styleUrls: ['./lesson-03-primitives.css']
})
export class Lesson03Primitives implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m07-mcp/lesson-03-primitives');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m7');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c21');

  readonly relatedDemo = {
    title: 'Demo 07 — El Conector Universal',
    path: '/academy/modules/m07-mcp/demo-mcp-connector',
    description: 'Simulación de descubrimiento de capacidades MCP y Least Privilege.'
  };

  readonly relatedLab = {
    title: 'Lab 07 — Mapear una Integración Legacy a MCP',
    path: '/academy/modules/m07-mcp/lab-07-map-integration-to-mcp',
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
