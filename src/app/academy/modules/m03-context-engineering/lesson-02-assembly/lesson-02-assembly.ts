import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_02_DOCUMENT } from './lesson-02.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';

/**
 * Lesson02Assembly — CASE Academy
 * Módulo 03 · Ingeniería de Contexto — Lección 02 (c8)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-02-assembly',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeaderComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent
  ],
  templateUrl: './lesson-02-assembly.html',
  styleUrl: './lesson-02-assembly.css'
})
export class Lesson02Assembly implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_02_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m03-context-engineering/lesson-02-assembly');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m3');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c8');

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
