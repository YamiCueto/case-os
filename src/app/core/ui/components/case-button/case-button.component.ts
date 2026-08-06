import { Component, Input, HostBinding } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * CaseButton — CASE UI Library
 *
 * Primary action button. Three variants: primary, secondary, ghost.
 * Only the primary variant uses the accent color.
 *
 * Usage:
 *   <case-button variant="primary" iconLeft="add">New Lab</case-button>
 *   <case-button variant="secondary" size="sm">Cancel</case-button>
 */
@Component({
  selector: 'case-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled || null"
      [attr.type]="type"
      [attr.aria-disabled]="disabled"
    >
      @if (iconLeft) {
        <span class="case-btn__icon" aria-hidden="true">
          <span class="material-symbols-outlined">{{ iconLeft }}</span>
        </span>
      }
      <span class="case-btn__label"><ng-content /></span>
      @if (iconRight) {
        <span class="case-btn__icon" aria-hidden="true">
          <span class="material-symbols-outlined">{{ iconRight }}</span>
        </span>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }
    :host([fullWidth]) { display: flex; width: 100%; }

    .case-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--case-space-2);
      border-radius: var(--case-radius);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      letter-spacing: var(--case-tracking-normal);
      cursor: pointer;
      transition:
        background-color var(--case-transition-fast),
        color var(--case-transition-fast),
        border-color var(--case-transition-fast),
        opacity var(--case-transition-fast);
      border: var(--case-border-width) solid transparent;
      white-space: nowrap;
      line-height: 1;
      user-select: none;
      -webkit-user-select: none;
      text-decoration: none;
    }

    /* — Sizes — */
    .case-btn--sm  { height: 28px; padding: 0 var(--case-space-3); }
    .case-btn--md  { height: 32px; padding: 0 var(--case-space-4); }

    /* — Variants — */
    .case-btn--primary {
      background-color: var(--case-accent);
      color: var(--case-text-on-accent);
      border-color: var(--case-accent);
    }
    .case-btn--primary:hover:not(:disabled) {
      background-color: var(--case-accent-hover);
      border-color: var(--case-accent-hover);
    }

    .case-btn--secondary {
      background-color: transparent;
      color: var(--case-text-primary);
      border-color: var(--case-border);
    }
    .case-btn--secondary:hover:not(:disabled) {
      background-color: var(--case-state-hover);
      border-color: var(--case-border-strong);
    }

    .case-btn--ghost {
      background-color: transparent;
      color: var(--case-text-secondary);
      border-color: transparent;
    }
    .case-btn--ghost:hover:not(:disabled) {
      background-color: var(--case-state-hover);
      color: var(--case-text-primary);
    }

    /* — States — */
    .case-btn:disabled {
      opacity: var(--case-opacity-disabled);
      cursor: not-allowed;
    }
    .case-btn:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }

    /* — Icon — */
    .case-btn__icon {
      display: flex;
      align-items: center;
    }
    .case-btn__icon .material-symbols-outlined {
      font-size: var(--case-icon-sm);
    }
  `]
})
export class CaseButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: ButtonType = 'button';
  @Input() iconLeft?: string;
  @Input() iconRight?: string;

  get buttonClass(): string {
    return ['case-btn', `case-btn--${this.variant}`, `case-btn--${this.size}`]
      .join(' ');
  }
}
