import { Injectable, signal, effect, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type AuthView = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'SET_NEW_PASSWORD' | 'CHECK_EMAIL';

@Injectable({
  providedIn: 'root'
})
export class AuthUiService {
  private supabase = inject(SupabaseService);

  readonly isOpen = signal<boolean>(false);
  readonly view = signal<AuthView>('SIGN_IN');

  constructor() {
    effect(() => {
      const isRecovery = this.supabase.isPasswordRecovery();
      if (isRecovery) {
        this.open('SET_NEW_PASSWORD');
      }
    }, { allowSignalWrites: true });
  }

  open(view: AuthView = 'SIGN_IN'): void {
    this.supabase.clearAuthError();
    this.view.set(view);
    this.isOpen.set(true);
  }

  close(): void {
    if (this.supabase.authLoading()) {
      return;
    }
    // Prevent closing if we are forced into password recovery
    if (this.supabase.isPasswordRecovery()) {
      return;
    }
    this.supabase.clearAuthError();
    this.isOpen.set(false);
  }

  changeView(view: AuthView): void {
    this.supabase.clearAuthError();
    this.view.set(view);
  }
}
