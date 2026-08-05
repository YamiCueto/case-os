import { Injectable, signal } from '@angular/core';

export interface UserProgress {
  completionPercentage: number;
  lastVisitedLessonId?: string;
  lastVisitedLessonTitle?: string;
  lastVisitedLessonPath?: string;
  completedLessons: string[]; // array of lesson IDs
}

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {
  // Inicialmente devuelve datos mock, pero su diseño reactivo con signals
  // permite sustituirlo fácilmente por IndexedDB o una API en el futuro sin modificar componentes.
  private progress = signal<UserProgress>({
    completionPercentage: 25,
    lastVisitedLessonId: 'c3',
    lastVisitedLessonTitle: 'Migración VB6 Legacy',
    lastVisitedLessonPath: '/clase3-dev-migracion-legacy',
    completedLessons: ['c1', 'c2']
  });

  getProgress() {
    return this.progress.asReadonly();
  }

  // Métodos que a futuro persistirían estado
  markLessonAsCompleted(lessonId: string) {
    this.progress.update(p => {
      const completed = new Set(p.completedLessons);
      completed.add(lessonId);
      return {
        ...p,
        completedLessons: Array.from(completed)
      };
    });
  }

  setLastVisitedLesson(lessonId: string, title: string, path: string) {
    this.progress.update(p => ({
      ...p,
      lastVisitedLessonId: lessonId,
      lastVisitedLessonTitle: title,
      lastVisitedLessonPath: path
    }));
  }
}
