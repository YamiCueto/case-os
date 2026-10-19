import {
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstructorAuthService } from '../../services/instructor-auth.service';

@Component({
  selector: 'app-instructor-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor-auth-modal.component.html',
  styleUrls: ['./instructor-auth-modal.component.css']
})
export class InstructorAuthModalComponent implements AfterViewInit, OnDestroy {
  private authService = inject(InstructorAuthService);
  private elRef = inject(ElementRef);

  @Output() unlocked = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  password = signal<string>('');
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined' && document.body) {
      document.body.appendChild(this.elRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (
      typeof document !== 'undefined' &&
      this.elRef.nativeElement.parentElement === document.body
    ) {
      document.body.removeChild(this.elRef.nativeElement);
    }
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    const pwd = this.password().trim();
    if (!pwd) {
      this.errorMessage.set('Por favor, ingresa la contraseña.');
      return;
    }

    const success = this.authService.unlock(pwd);
    if (success) {
      this.errorMessage.set('');
      this.password.set('');
      this.unlocked.emit();
    } else {
      this.errorMessage.set('Contraseña de instructor incorrecta. Intenta nuevamente.');
    }
  }

  onCancel(): void {
    this.errorMessage.set('');
    this.password.set('');
    this.cancelled.emit();
  }
}
