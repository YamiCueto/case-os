import { Component, Input } from '@angular/core';

export type ProgressVariant = 'accent' | 'success' | 'warning' | 'error';
export type ProgressHeight = 'xs' | 'sm' | 'md';

/**
 * CaseProgressBar — CASE UI Library
 *
 * Linear progress indicator. Height 2px (xs) for subtle indicators,
 * 4px (sm) for standard use. No animations — progress is always determinate.
 *
 * Usage:
 *   <case-progress-bar [value]="7" [max]="12" />
 *   <case-progress-bar [value]="3" [max]="12" height="sm" variant="success" />
 */
@Component({
  selector: 'case-progress-bar',
  standalone: true,
  template: `
    @if (label) {
      <div class="case-progress__header">
        <span class="case-progress__label">{{ label }}</span>
        <span class="case-progress__value">{{ value }}/{{ max }}</span>
      </div>
    }
    <div
      class="case-progress__track"
      [class]="trackClass"
      role="progressbar"
      [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max"
      [attr.aria-label]="label || 'Progress'"
    >
      <div class="case-progress__fill" [class]="fillClass" [style.width.%]="percent"></div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .case-progress__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--case-space-2);
    }
    .case-progress__label {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-secondary);
    }
    .case-progress__value {
      font-family: var(--case-font-mono);
      font-size: var(--case-text-xs);
      color: var(--case-text-muted);
    }

    .case-progress__track {
      width: 100%;
      border-radius: var(--case-radius-pill);
      background-color: var(--case-surface-4);
      overflow: hidden;
    }

    /* Heights */
    .case-progress__track--xs { height: 2px; }
    .case-progress__track--sm { height: 4px; }
    .case-progress__track--md { height: 6px; }

    .case-progress__fill {
      height: 100%;
      border-radius: var(--case-radius-pill);
      transition: width var(--case-transition-slow);
    }

    /* Fill variants */
    .case-progress__fill--accent  { background-color: var(--case-accent); }
    .case-progress__fill--success { background-color: var(--case-color-success); }
    .case-progress__fill--warning { background-color: var(--case-color-warning); }
    .case-progress__fill--error   { background-color: var(--case-color-error); }
  `]
})
export class CaseProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() height: ProgressHeight = 'xs';
  @Input() variant: ProgressVariant = 'accent';
  @Input() label?: string;

  get percent(): number {
    if (this.max === 0) return 0;
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  get trackClass(): string {
    return `case-progress__track--${this.height}`;
  }

  get fillClass(): string {
    return `case-progress__fill--${this.variant}`;
  }
}
