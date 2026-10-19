import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'case_os_instructor_unlocked';
const INSTRUCTOR_PASSWORD = 'soyelprofe';

@Injectable({
  providedIn: 'root'
})
export class InstructorAuthService {
  private unlockedSignal = signal<boolean>(this.checkInitialState());
  readonly isUnlocked = this.unlockedSignal.asReadonly();

  private checkInitialState(): boolean {
    try {
      return (
        sessionStorage.getItem(STORAGE_KEY) === 'true' ||
        localStorage.getItem(STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  }

  unlock(password: string): boolean {
    if (password === INSTRUCTOR_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // En caso de modo incógnito o storage deshabilitado
      }
      this.unlockedSignal.set(true);
      return true;
    }
    return false;
  }

  lock(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
    this.unlockedSignal.set(false);
  }
}
