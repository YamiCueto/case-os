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
 * Lesson03CaseStudy — CASE Academy
 * Módulo 09 · Arquitectura de IA — Lección 03 (c27)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-03-case-study',
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
  templateUrl: './lesson-03-case-study.html',
  styleUrls: ['./lesson-03-case-study.css']
})
export class Lesson03CaseStudy implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m09-architecture/lesson-03-case-study');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m9');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c27');

  readonly relatedDemo = {
    title: 'Demo 09 — Arquitectura bajo Demanda',
    path: '/academy/modules/m09-architecture/demo-architecture-builder',
    description: 'Constructor interactivo de arquitecturas GenAI desacopladas.'
  };

  readonly relatedLab = {
    title: 'Lab 09 — Plano de Arquitectura de Modernización con IA',
    path: '/academy/modules/m09-architecture/lab-09-architecture-blueprint',
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
