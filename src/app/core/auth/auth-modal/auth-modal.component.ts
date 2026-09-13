import { Component, HostListener, computed, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUiService, AuthView } from '../../services/auth-ui.service';
import { SupabaseService } from '../../services/supabase.service';
import { mapAuthError } from '../auth-error.mapper';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (authUi.isOpen()) {
      <div class="auth-modal-backdrop" (click)="onBackdropClick($event)">
        <div class="auth-modal-container" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" (keydown)="onTrapFocus($event)" #modalContainer>

          <!-- Header -->
          <div class="auth-modal-header">
            <h2 id="auth-modal-title" class="auth-modal-title">{{ modalTitle() }}</h2>
            @if (canCloseNormal()) {
              <button class="auth-modal-close" (click)="close()" [disabled]="isLoading()" aria-label="Cerrar modal">
                <span class="material-symbols-outlined">close</span>
              </button>
            }
          </div>

          <!-- Body -->
          <div class="auth-modal-body">

            <!-- Global Error Banner -->
            @if (mappedError()) {
              <div class="auth-modal-error" role="alert">
                <span class="material-symbols-outlined">error</span>
                <span>{{ mappedError() }}</span>
              </div>
            }

            <!-- Views -->
            @switch (authUi.view()) {

              <!-- SIGN IN -->
              @case ('SIGN_IN') {
                <button class="auth-btn auth-btn--google" (click)="signInWithGoogle()" [disabled]="isLoading()">
                  <span class="material-symbols-outlined">login</span>
                  Continuar con Google
                </button>

                <div class="auth-divider">
                  <span>o usando correo</span>
                </div>

                <form [formGroup]="signInForm" (ngSubmit)="onSignInSubmit()">
                  <div class="auth-form-group">
                    <label for="signin-email">Correo electrónico</label>
                    <input id="signin-email" type="email" formControlName="email" placeholder="tu@correo.com" [attr.disabled]="isLoading() ? true : null" #firstInput>
                  </div>
                  <div class="auth-form-group">
                    <label for="signin-password">Contraseña</label>
                    <input id="signin-password" type="password" formControlName="password" placeholder="••••••••" [attr.disabled]="isLoading() ? true : null">
                  </div>

                  <div class="auth-form-actions">
                    <button type="button" class="auth-link" (click)="changeView('FORGOT_PASSWORD')" [disabled]="isLoading()">
                      ¿Olvidaste tu contraseña?
                    </button>
                    <button type="submit" class="auth-btn auth-btn--primary" [disabled]="signInForm.invalid || isLoading()">
                      Iniciar sesión
                    </button>
                  </div>
                </form>

                <div class="auth-modal-footer">
                  <span>¿No tienes cuenta?</span>
                  <button type="button" class="auth-link" (click)="changeView('SIGN_UP')" [disabled]="isLoading()">Regístrate</button>
                </div>
              }

              <!-- SIGN UP -->
              @case ('SIGN_UP') {
                <form [formGroup]="signUpForm" (ngSubmit)="onSignUpSubmit()">
                  <div class="auth-form-group">
                    <label for="signup-name">Nombre completo (opcional)</label>
                    <input id="signup-name" type="text" formControlName="name" placeholder="Tu nombre" [attr.disabled]="isLoading() ? true : null" #firstInput>
                  </div>
                  <div class="auth-form-group">
                    <label for="signup-email">Correo electrónico</label>
                    <input id="signup-email" type="email" formControlName="email" placeholder="tu@correo.com" [attr.disabled]="isLoading() ? true : null">
                  </div>
                  <div class="auth-form-group">
                    <label for="signup-password">Contraseña</label>
                    <input id="signup-password" type="password" formControlName="password" placeholder="••••••••" [attr.disabled]="isLoading() ? true : null">
                  </div>

                  <div class="auth-form-actions">
                    <button type="submit" class="auth-btn auth-btn--primary auth-btn--full" [disabled]="signUpForm.invalid || isLoading()">
                      Crear cuenta
                    </button>
                  </div>
                </form>

                <div class="auth-modal-footer">
                  <span>¿Ya tienes cuenta?</span>
                  <button type="button" class="auth-link" (click)="changeView('SIGN_IN')" [disabled]="isLoading()">Inicia sesión</button>
                </div>
              }

              <!-- FORGOT PASSWORD -->
              @case ('FORGOT_PASSWORD') {
                <p class="auth-modal-desc">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form [formGroup]="forgotForm" (ngSubmit)="onForgotSubmit()">
                  <div class="auth-form-group">
                    <label for="forgot-email">Correo electrónico</label>
                    <input id="forgot-email" type="email" formControlName="email" placeholder="tu@correo.com" [attr.disabled]="isLoading() ? true : null" #firstInput>
                  </div>

                  <div class="auth-form-actions">
                    <button type="submit" class="auth-btn auth-btn--primary auth-btn--full" [disabled]="forgotForm.invalid || isLoading()">
                      Enviar enlace de recuperación
                    </button>
                  </div>
                </form>

                <div class="auth-modal-footer">
                  <button type="button" class="auth-link" (click)="changeView('SIGN_IN')" [disabled]="isLoading()">Volver a inicio de sesión</button>
                </div>
              }

              <!-- SET NEW PASSWORD -->
              @case ('SET_NEW_PASSWORD') {
                <p class="auth-modal-desc">
                  Estás restableciendo tu contraseña. Ingresa una nueva contraseña segura.
                </p>

                <form [formGroup]="setNewPasswordForm" (ngSubmit)="onSetNewPasswordSubmit()">
                  <div class="auth-form-group">
                    <label for="set-password">Nueva contraseña</label>
                    <input id="set-password" type="password" formControlName="password" placeholder="••••••••" [attr.disabled]="isLoading() ? true : null" #firstInput>
                  </div>
                  <div class="auth-form-group">
                    <label for="set-password-confirm">Confirmar contraseña</label>
                    <input id="set-password-confirm" type="password" formControlName="confirmPassword" placeholder="••••••••" [attr.disabled]="isLoading() ? true : null">
                  </div>

                  <div class="auth-form-actions auth-form-actions--stacked">
                    <button type="submit" class="auth-btn auth-btn--primary auth-btn--full" [disabled]="setNewPasswordForm.invalid || isLoading() || passwordsMismatch">
                      Guardar nueva contraseña
                    </button>

                    @if (isRecoveryMode()) {
                      <button type="button" class="auth-btn auth-btn--ghost auth-btn--full" (click)="cancelRecoveryAndSignOut()" [disabled]="isLoading()">
                        Cancelar recuperación y cerrar sesión
                      </button>
                    }
                  </div>
                </form>
              }

              <!-- CHECK EMAIL CONFIRMATION (SIGN UP) -->
              @case ('CHECK_EMAIL_CONFIRMATION') {
                <div class="auth-modal-success-state">
                  <span class="material-symbols-outlined auth-success-icon">mark_email_unread</span>
                  <p class="auth-modal-desc">
                    Revisa tu correo para confirmar/activar tu cuenta.
                  </p>
                  <button type="button" class="auth-btn auth-btn--primary auth-btn--full" (click)="close()" #firstInput>
                    Entendido
                  </button>
                </div>
              }

              <!-- PASSWORD RESET EMAIL SENT (FORGOT PASSWORD) -->
              @case ('PASSWORD_RESET_EMAIL_SENT') {
                <div class="auth-modal-success-state">
                  <span class="material-symbols-outlined auth-success-icon">mark_email_unread</span>
                  <p class="auth-modal-desc">
                    Si la solicitud es válida, revisa tu correo para continuar con el restablecimiento de contraseña.
                  </p>
                  <button type="button" class="auth-btn auth-btn--primary auth-btn--full" (click)="close()" #firstInput>
                    Entendido
                  </button>
                </div>
              }
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .auth-modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .auth-modal-container {
      background-color: var(--case-surface-1);
      border: 1px solid var(--case-border-strong);
      border-radius: var(--case-radius-lg);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 420px;
      padding: var(--case-space-5);
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
      animation: modalFadeIn var(--case-transition-normal) ease-out;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .auth-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .auth-modal-title {
      margin: 0;
      font-size: var(--case-text-lg);
      font-weight: var(--case-weight-bold);
      color: var(--case-text-primary);
    }

    .auth-modal-desc {
      font-size: var(--case-text-sm);
      color: var(--case-text-secondary);
      margin-bottom: var(--case-space-4);
      line-height: 1.5;
    }

    .auth-modal-close {
      background: none;
      border: none;
      color: var(--case-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: var(--case-radius-sm);
      transition: background-color var(--case-transition-fast), color var(--case-transition-fast);
    }
    .auth-modal-close:hover:not(:disabled) {
      background-color: var(--case-surface-3);
      color: var(--case-text-primary);
    }

    .auth-modal-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--case-radius);
      color: #f87171;
      font-size: var(--case-text-sm);
      margin-bottom: var(--case-space-4);
    }
    .auth-modal-error .material-symbols-outlined {
      font-size: 18px;
    }

    .auth-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: var(--case-space-4);
    }
    .auth-form-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--case-text-secondary);
    }
    .auth-form-group input {
      background-color: var(--case-surface-2);
      border: 1px solid var(--case-border);
      color: var(--case-text-primary);
      padding: 10px 12px;
      border-radius: var(--case-radius);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      outline: none;
      transition: border-color var(--case-transition-fast);
    }
    .auth-form-group input:focus {
      border-color: var(--case-accent);
      background-color: var(--case-surface-1);
    }
    .auth-form-group input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--case-space-2);
    }
    .auth-form-actions--stacked {
      flex-direction: column;
      gap: var(--case-space-3);
    }

    .auth-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: var(--case-radius);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--case-transition-fast);
      border: none;
    }
    .auth-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-btn--full {
      width: 100%;
    }
    .auth-btn--primary {
      background-color: var(--case-accent);
      color: #ffffff;
    }
    .auth-btn--primary:hover:not(:disabled) {
      background-color: var(--case-accent-muted);
    }
    .auth-btn--google {
      width: 100%;
      background-color: var(--case-surface-2);
      border: 1px solid var(--case-border);
      color: var(--case-text-primary);
      margin-bottom: var(--case-space-4);
    }
    .auth-btn--google:hover:not(:disabled) {
      background-color: var(--case-surface-3);
      border-color: var(--case-border-strong);
    }
    .auth-btn--ghost {
      background-color: transparent;
      border: 1px solid var(--case-border);
      color: var(--case-text-secondary);
    }
    .auth-btn--ghost:hover:not(:disabled) {
      background-color: var(--case-surface-2);
      color: var(--case-text-primary);
    }

    .auth-divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--case-text-muted);
      font-size: 11px;
      margin-bottom: var(--case-space-4);
    }
    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--case-border);
    }
    .auth-divider span {
      padding: 0 10px;
    }

    .auth-link {
      background: none;
      border: none;
      color: var(--case-text-muted);
      font-size: 12px;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      transition: color var(--case-transition-fast);
    }
    .auth-link:hover:not(:disabled) {
      color: var(--case-text-primary);
    }

    .auth-modal-footer {
      margin-top: var(--case-space-5);
      padding-top: var(--case-space-4);
      border-top: 1px solid var(--case-border);
      display: flex;
      justify-content: center;
      gap: 6px;
      font-size: 12px;
      color: var(--case-text-secondary);
    }

    .auth-modal-success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--case-space-4);
    }
    .auth-success-icon {
      font-size: 48px;
      color: var(--case-accent);
    }
  `]
})
export class AuthModalComponent {
  readonly authUi = inject(AuthUiService);
  readonly supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);

  @ViewChild('firstInput') firstInput?: ElementRef<HTMLElement>;
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;

  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.authUi.isOpen()) {
        this.previousActiveElement = document.activeElement as HTMLElement;
        setTimeout(() => {
          this.focusFirstInput();
        }, 100);
      } else {
        if (this.previousActiveElement) {
          const el = this.previousActiveElement;
          this.previousActiveElement = null;
          setTimeout(() => el.focus(), 0);
        }
      }
    });
  }

  // Forms
  signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  signUpForm: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  setNewPasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  });

  // Computed state
  isLoading = computed(() => this.supabase.authLoading());
  isRecoveryMode = computed(() => this.supabase.isPasswordRecovery());

  // Custom mapped error
  mappedError = computed(() => mapAuthError(this.supabase.authError()));

  modalTitle = computed(() => {
    switch (this.authUi.view()) {
      case 'SIGN_IN': return 'Iniciar sesión';
      case 'SIGN_UP': return 'Crear cuenta';
      case 'FORGOT_PASSWORD': return 'Recuperar contraseña';
      case 'SET_NEW_PASSWORD': return 'Nueva contraseña';
      case 'CHECK_EMAIL_CONFIRMATION': return 'Revisa tu correo';
      case 'PASSWORD_RESET_EMAIL_SENT': return 'Revisa tu correo';
      default: return 'Autenticación';
    }
  });

  canCloseNormal = computed(() => {
    return !this.isLoading() && !this.isRecoveryMode();
  });

  get passwordsMismatch(): boolean {
    if (this.authUi.view() !== 'SET_NEW_PASSWORD') return false;
    const p1 = this.setNewPasswordForm.get('password')?.value;
    const p2 = this.setNewPasswordForm.get('confirmPassword')?.value;
    return p1 !== p2;
  }

  private focusFirstInput() {
    setTimeout(() => {
      this.firstInput?.nativeElement?.focus();
    }, 100);
  }

  changeView(view: AuthView) {
    this.authUi.changeView(view);
    this.resetForms();
    this.focusFirstInput();
  }

  resetForms() {
    this.signInForm.reset();
    this.signUpForm.reset();
    this.forgotForm.reset();
    this.setNewPasswordForm.reset();
  }

  close() {
    if (this.canCloseNormal() || this.authUi.view() === 'CHECK_EMAIL_CONFIRMATION' || this.authUi.view() === 'PASSWORD_RESET_EMAIL_SENT') {
      this.authUi.close();
      this.resetForms();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.authUi.isOpen()) {
      this.close();
    }
  }

  onTrapFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (this.modalContainer) {
      const focusableElements = this.modalContainer.nativeElement.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      const elementsArray = Array.from(focusableElements).filter(
        el => !(el as HTMLInputElement).disabled
      ) as HTMLElement[];

      if (elementsArray.length === 0) return;

      const firstElement = elementsArray[0];
      const lastElement = elementsArray[elementsArray.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    }
  }

  onBackdropClick(event: MouseEvent) {
    // Only close if clicking exactly on the backdrop (not its children)
    if ((event.target as HTMLElement).classList.contains('auth-modal-backdrop')) {
      this.close();
    }
  }

  async signInWithGoogle() {
    if (this.isLoading()) return;
    await this.supabase.signInWithGoogle();
  }

  async onSignInSubmit() {
    if (this.signInForm.invalid || this.isLoading()) return;
    const { email, password } = this.signInForm.value;
    const { error } = await this.supabase.signInWithPassword(email, password);
    if (!error) {
      this.close();
    }
  }

  async onSignUpSubmit() {
    if (this.signUpForm.invalid || this.isLoading()) return;
    const { name, email, password } = this.signUpForm.value;
    const { data, error } = await this.supabase.signUpWithEmail(email, password, name);
    if (!error) {
      // Check if session was created automatically or if confirmation is required
      if (data?.session) {
        this.close();
      } else {
        this.changeView('CHECK_EMAIL_CONFIRMATION');
      }
    }
  }

  async onForgotSubmit() {
    if (this.forgotForm.invalid || this.isLoading()) return;
    const { email } = this.forgotForm.value;
    const { error } = await this.supabase.resetPasswordForEmail(email);
    if (!error) {
      this.changeView('PASSWORD_RESET_EMAIL_SENT');
    }
  }

  async onSetNewPasswordSubmit() {
    if (this.setNewPasswordForm.invalid || this.isLoading() || this.passwordsMismatch) return;
    const { password } = this.setNewPasswordForm.value;
    const { error } = await this.supabase.updateUserPassword(password);
    if (!error) {
      this.authUi.close(); // forcefully close, because recovery state is cleared
      this.resetForms();
    }
  }

  async cancelRecoveryAndSignOut() {
    if (this.isLoading()) return;
    await this.supabase.signOut();
    // After signOut, isPasswordRecovery becomes false and we can close normally.
    this.authUi.close();
    this.resetForms();
  }
}
