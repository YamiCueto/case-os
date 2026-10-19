import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ALL_INSTRUCTOR_GUIDES } from '../../modules/m06-mcp/instructor-guides.data';
import { LessonInstructorGuide, TimelineBlock } from '../../modules/m06-mcp/instructor-guide.models';
import { InstructorAuthService } from '../../services/instructor-auth.service';
import { InstructorAuthModalComponent } from '../../components/instructor-auth-modal/instructor-auth-modal.component';

@Component({
  selector: 'app-instructor-view',
  standalone: true,
  imports: [CommonModule, RouterModule, InstructorAuthModalComponent],
  templateUrl: './instructor-view.component.html',
  styleUrl: './instructor-view.component.css'
})
export class InstructorViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(InstructorAuthService);

  readonly allGuides = ALL_INSTRUCTOR_GUIDES;
  readonly availableGuideKeys = Object.keys(ALL_INSTRUCTOR_GUIDES);
  readonly isUnlocked = this.authService.isUnlocked;

  selectedLessonId = signal<string>('c-m6-l01');
  currentBlockIndex = signal<number>(0);
  showExpectedAnswer = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);

  guide = computed<LessonInstructorGuide>(() => {
    return this.allGuides[this.selectedLessonId()] || this.allGuides['c-m6-l01'];
  });

  currentBlock = computed<TimelineBlock>(() => {
    return this.guide().blocks[this.currentBlockIndex()] || this.guide().blocks[0];
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('lessonId');
      if (id && this.allGuides[id]) {
        this.selectedLessonId.set(id);
        this.currentBlockIndex.set(0);
        this.showExpectedAnswer.set(false);
      }
    });
  }

  selectLesson(id: string): void {
    if (this.allGuides[id]) {
      this.selectedLessonId.set(id);
      this.currentBlockIndex.set(0);
      this.showExpectedAnswer.set(false);
    }
  }

  goToBlock(index: number): void {
    if (index >= 0 && index < this.guide().blocks.length) {
      this.currentBlockIndex.set(index);
      this.showExpectedAnswer.set(false);
    }
  }

  nextBlock(): void {
    if (this.currentBlockIndex() < this.guide().blocks.length - 1) {
      this.currentBlockIndex.update(i => i + 1);
      this.showExpectedAnswer.set(false);
    }
  }

  prevBlock(): void {
    if (this.currentBlockIndex() > 0) {
      this.currentBlockIndex.update(i => i - 1);
      this.showExpectedAnswer.set(false);
    }
  }

  toggleAnswer(): void {
    this.showExpectedAnswer.update(v => !v);
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen.set(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen.set(false);
      }).catch(() => {});
    }
  }

  lockSession(): void {
    this.authService.lock();
  }
}
