import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_01_DOCUMENT } from './lesson-01.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';

/**
 * Lesson01Workflows — CASE Academy
 * Módulo 05 · Agentes de IA — Lección 01 (c13)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-01-workflows',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeaderComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent
  ],
  templateUrl: './lesson-01-workflows.html',
  styleUrl: './lesson-01-workflows.css'
})
export class Lesson01Workflows implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m05-ai-agents/lesson-01-workflows');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m5');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c13');

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
