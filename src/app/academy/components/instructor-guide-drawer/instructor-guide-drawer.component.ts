import { Component, Input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonInstructorGuide, TimelineBlock } from '../../modules/m06-mcp/instructor-guide.models';
import { InstructorAuthService } from '../../services/instructor-auth.service';
import { InstructorAuthModalComponent } from '../instructor-auth-modal/instructor-auth-modal.component';

@Component({
  selector: 'app-instructor-guide-drawer',
  standalone: true,
  imports: [CommonModule, InstructorAuthModalComponent],
  templateUrl: './instructor-guide-drawer.component.html',
  styleUrl: './instructor-guide-drawer.component.css'
})
export class InstructorGuideDrawerComponent {
  private authService = inject(InstructorAuthService);

  @Input({ required: true }) guide!: LessonInstructorGuide;

  isOpen = signal<boolean>(false);
  isAuthModalOpen = signal<boolean>(false);
  currentBlockIndex = signal<number>(0);
  showExpectedAnswer = signal<boolean>(false);

  readonly isUnlocked = this.authService.isUnlocked;

  currentBlock = computed<TimelineBlock>(() => {
    return this.guide.blocks[this.currentBlockIndex()] || this.guide.blocks[0];
  });

  onTriggerClick(): void {
    if (this.authService.isUnlocked()) {
      // Si ya está desbloqueado, abre directamente la ventana de segundo monitor
      this.openPopoutWindow();
    } else {
      // Primer clic: solicita la contraseña soyelprofe
      this.isAuthModalOpen.set(true);
    }
  }

  onAuthSuccess(): void {
    this.isAuthModalOpen.set(false);
    // Si la contraseña es correcta, abrir directamente la vista independiente
    this.openPopoutWindow();
  }

  onAuthCancelled(): void {
    this.isAuthModalOpen.set(false);
  }

  lockAccess(): void {
    this.authService.lock();
    this.closeDrawer();
  }

  toggleDrawer(): void {
    this.isOpen.update(v => !v);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  goToBlock(index: number): void {
    if (index >= 0 && index < this.guide.blocks.length) {
      this.currentBlockIndex.set(index);
      this.showExpectedAnswer.set(false);
    }
  }

  nextBlock(): void {
    if (this.currentBlockIndex() < this.guide.blocks.length - 1) {
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

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openPopoutWindow(): void {
    const popoutUrl = `${window.location.origin}/#/academy/instructor-view/${this.guide.lessonId}`;
    const windowFeatures = 'width=760,height=960,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
    window.open(popoutUrl, `InstructorGuide_${this.guide.lessonId}`, windowFeatures);
  }
}
