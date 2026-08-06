import { Component, Input } from '@angular/core';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'default' | 'ghost';

/**
 * CaseIconButton — CASE UI Library
 *
 * Icon-only button. Compact interactive element for toolbars and actions.
 * Always include a tooltip for accessibility.
 *
 * Usage:
 *   <case-icon-button icon="close" tooltip="Cerrar panel" />
 *   <case-icon-button icon="add" size="sm" [active]="true" />
 */
@Component({
  selector: 'case-icon-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled || null"
      [attr.title]="tooltip"
      [attr.aria-label]="tooltip || icon"
      type="button"
    >
      <span class="material-symbols-outlined" aria-hidden="true">{{ icon }}</span>
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }

    .case-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--case-radius);
      border: var(--case-border-width) solid transparent;
      background: transparent;
      color: var(--case-text-secondary);
      cursor: pointer;
      transition:
        background-color var(--case-transition-fast),
        color var(--case-transition-fast);
      flex-shrink: 0;
    }

    /* — Sizes — */
    .case-icon-btn--sm  { width: 24px; height: 24px; }
    .case-icon-btn--sm  .material-symbols-outlined { font-size: var(--case-icon-xs); }
    .case-icon-btn--md  { width: 28px; height: 28px; }
    .case-icon-btn--md  .material-symbols-outlined { font-size: var(--case-icon-sm); }
    .case-icon-btn--lg  { width: 32px; height: 32px; }
    .case-icon-btn--lg  .material-symbols-outlined { font-size: var(--case-icon-md); }

    /* — Variants — */
    .case-icon-btn--default:hover:not(:disabled) {
      background-color: var(--case-state-hover);
      color: var(--case-text-primary);
    }
    .case-icon-btn--ghost {
      color: var(--case-text-muted);
    }
    .case-icon-btn--ghost:hover:not(:disabled) {
      background-color: var(--case-state-hover);
      color: var(--case-text-secondary);
    }

    /* — Active state — */
    .case-icon-btn--active {
      color: var(--case-accent) !important;
      background-color: var(--case-accent-subtle) !important;
    }

    /* — Disabled — */
    .case-icon-btn:disabled {
      opacity: var(--case-opacity-disabled);
      cursor: not-allowed;
    }

    /* — Focus — */
    .case-icon-btn:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }
  `]
})
export class CaseIconButtonComponent {
  @Input({ required: true }) icon!: string;
  @Input() tooltip?: string;
  @Input() size: IconButtonSize = 'md';
  @Input() variant: IconButtonVariant = 'default';
  @Input() disabled = false;
  @Input() active = false;

  get buttonClass(): string {
    return [
      'case-icon-btn',
      `case-icon-btn--${this.size}`,
      `case-icon-btn--${this.variant}`,
      this.active ? 'case-icon-btn--active' : '',
    ].filter(Boolean).join(' ');
  }
}
