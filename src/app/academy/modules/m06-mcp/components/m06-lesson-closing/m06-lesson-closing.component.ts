import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CommonPitfall {
  title: string;
  solution: string;
}

export interface GroupQuestion {
  question: string;
  expectedAnswer: string;
}

export interface SynthesisInfo {
  summary: string;
  transitionText?: string;
}

export interface NextLessonLink {
  id: string;
  title: string;
  path: string;
}

@Component({
  selector: 'app-m06-lesson-closing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './m06-lesson-closing.component.html',
  styleUrls: ['./m06-lesson-closing.component.css']
})
export class M06LessonClosingComponent {
  @Input() pitfalls: CommonPitfall[] = [];
  @Input() questions: GroupQuestion[] = [];
  @Input() synthesis?: SynthesisInfo;
  @Input() nextLesson?: NextLessonLink;
  @Input() sectionTitlePitfalls: string = 'Errores Comunes y Malas Prácticas en MCP';
  @Input() sectionTitleQuestions: string = 'Comprobación: Preguntas de Activación al Grupo';
  @Input() sectionTitleSynthesis: string = 'Síntesis y Próximo Paso';

  // Estados de revelación por índice
  revealedSolutions = signal<Record<number, boolean>>({});
  revealedAnswers = signal<Record<number, boolean>>({});

  toggleSolution(index: number): void {
    this.revealedSolutions.update(state => ({
      ...state,
      [index]: !state[index]
    }));
  }

  isSolutionRevealed(index: number): boolean {
    return !!this.revealedSolutions()[index];
  }

  expandAllSolutions(): void {
    const next: Record<number, boolean> = {};
    this.pitfalls.forEach((_, i) => (next[i] = true));
    this.revealedSolutions.set(next);
  }

  collapseAllSolutions(): void {
    this.revealedSolutions.set({});
  }

  toggleAnswer(index: number): void {
    this.revealedAnswers.update(state => ({
      ...state,
      [index]: !state[index]
    }));
  }

  isAnswerRevealed(index: number): boolean {
    return !!this.revealedAnswers()[index];
  }

  showAllAnswers(): void {
    const next: Record<number, boolean> = {};
    this.questions.forEach((_, i) => (next[i] = true));
    this.revealedAnswers.set(next);
  }

  hideAllAnswers(): void {
    this.revealedAnswers.set({});
  }
}
