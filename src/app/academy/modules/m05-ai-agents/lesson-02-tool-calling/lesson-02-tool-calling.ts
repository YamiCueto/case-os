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
 * Lesson02ToolCalling — CASE Academy
 * Módulo 05 · Agentes de IA — Lección 02 (c14)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-02-tool-calling',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeaderComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent
  ],
  templateUrl: './lesson-02-tool-calling.html',
  styleUrl: './lesson-02-tool-calling.css'
})
export class Lesson02ToolCalling implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_02_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m05-ai-agents/lesson-02-tool-calling');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m5');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c14');

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
