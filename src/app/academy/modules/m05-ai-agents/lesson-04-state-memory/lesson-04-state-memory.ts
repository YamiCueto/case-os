import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_04_DOCUMENT } from './lesson-04.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonOutlineComponent } from '../../../components/lesson-outline/lesson-outline.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent,
  CaseBadgeComponent
} from '../../../../core/ui/components';
import { ExperienceRegistryComponent } from '../shared/experiences/experience-registry.component';
import { AgentBuildingMapComponent } from '../shared/components/agent-building-map/agent-building-map.component';

/**
 * Lesson04StateMemory — CASE Academy
 * Módulo 05 · Agentes de IA — Lección 04 (c-m5-l04)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-04-state-memory',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeaderComponent,
    LessonOutlineComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent,
    CaseBadgeComponent,
    ExperienceRegistryComponent,
    AgentBuildingMapComponent
  ],
  templateUrl: './lesson-04-state-memory.html',
  styleUrl: './lesson-04-state-memory.css'
})
export class Lesson04StateMemory implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_04_DOCUMENT;

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m05-ai-agents/lesson-04-state-memory');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m5');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c-m5-l04');

  readonly workshopGuideFileName = 'M05-L04-taller-agent-v3.md';
  readonly workshopGuideFilePath = 'docs/M05-L04-taller-agent-v3.md';
  downloadSuccess = false;

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }

  downloadWorkshopGuide(): void {
    const link = document.createElement('a');
    link.href = this.workshopGuideFilePath;
    link.download = this.workshopGuideFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.downloadSuccess = true;
    setTimeout(() => {
      this.downloadSuccess = false;
    }, 4000);
  }
}
