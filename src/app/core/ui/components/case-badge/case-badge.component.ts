import { Component, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';

/**
 * CaseBadge — CASE UI Library
 *
 * Compact label. Uses JetBrains Mono by default for technical content.
 * Use for: language tags, version numbers, status labels, categories.
 *
 * Usage:
 *   <case-badge>TypeScript</case-badge>
 *   <case-badge variant="success">LIVE</case-badge>
 *   <case-badge variant="warning" [mono]="false">Próximamente</case-badge>
 */
@Component({
  selector: 'case-badge',
  standalone: true,
  template: `
    @if (dot) {
      <span class="case-badge__dot" aria-hidden="true"></span>
    }
    <span class="case-badge__label"><ng-content /></span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-1);
      padding: 2px var(--case-space-2);
      border-radius: var(--case-radius);
      font-family: var(--case-font-mono);
      font-size: var(--case-text-xs);
      font-weight: var(--case-weight-medium);
      letter-spacing: var(--case-tracking-wide);
      line-height: 1.5;
      white-space: nowrap;
      border: var(--case-border-width) solid transparent;
    }

    /* — Mono toggle — */
    :host([mono="false"]) {
      font-family: var(--case-font-sans);
      letter-spacing: var(--case-tracking-normal);
    }

    /* — Pill shape — */
    :host([pill]) {
      border-radius: var(--case-radius-pill);
    }

    /* — Variants — */
    :host([variant="default"]) {
      background-color: var(--case-surface-3);
      color: var(--case-text-secondary);
      border-color: var(--case-border);
    }
    :host([variant="accent"]) {
      background-color: var(--case-accent-muted);
      color: var(--case-accent);
      border-color: var(--case-accent);
    }
    :host([variant="success"]) {
      background-color: var(--case-color-success-bg);
      color: var(--case-color-success);
      border-color: var(--case-color-success);
    }
    :host([variant="warning"]) {
      background-color: var(--case-color-warning-bg);
      color: var(--case-color-warning);
      border-color: var(--case-color-warning);
    }
    :host([variant="error"]) {
      background-color: var(--case-color-error-bg);
      color: var(--case-color-error);
      border-color: var(--case-color-error);
    }
    :host([variant="info"]) {
      background-color: var(--case-color-info-bg);
      color: var(--case-color-info);
      border-color: var(--case-color-info);
    }

    /* — Dot — */
    .case-badge__dot {
      width: 6px;
      height: 6px;
      border-radius: var(--case-radius-pill);
      flex-shrink: 0;
      background-color: currentColor;
    }

    .case-badge__label {
      display: inline;
    }
  `],
  host: {
    '[attr.variant]': 'variant',
    '[attr.mono]': 'mono',
    '[attr.pill]': 'pill || null',
  }
})
export class CaseBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() mono = true;
  @Input() pill = false;
  @Input() dot = false;
}
