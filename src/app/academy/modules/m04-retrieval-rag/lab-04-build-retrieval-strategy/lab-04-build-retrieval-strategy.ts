import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CaseBadgeComponent } from '../../../../core/ui/components/case-badge/case-badge.component';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson } from '../../../../core/models/course.models';

@Component({
  selector: 'app-lab-04-build-retrieval-strategy',
  standalone: true,
  imports: [CommonModule, RouterModule, CaseBadgeComponent],
  templateUrl: './lab-04-build-retrieval-strategy.html',
  styleUrls: ['./lab-04-build-retrieval-strategy.css', '../../../../shared-presentation.css']
})
export class Lab04BuildRetrievalStrategy implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(
    '/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy'
  );

  readonly guideFileName = 'M04-LAB04-guia-colab-retrieval.md';
  readonly guideFilePath = 'docs/M04-LAB04-guia-colab-retrieval.md';
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

  downloadActivityGuide(): void {
    const link = document.createElement('a');
    link.href = this.guideFilePath;
    link.download = this.guideFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.downloadSuccess = true;
    setTimeout(() => {
      this.downloadSuccess = false;
    }, 4000);
  }
}
