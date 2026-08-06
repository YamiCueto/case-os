import { Component, Input } from '@angular/core';

/**
 * CaseDivider — CASE UI Library
 *
 * 1px separator. Strictly 1px — thicker borders are a design violation.
 * Use for visual separation of sections, never for major layout divisions.
 *
 * Usage:
 *   <case-divider />
 *   <case-divider orientation="vertical" />
 *   <case-divider [subtle]="true" />
 */
@Component({
  selector: 'case-divider',
  standalone: true,
  template: ``,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
    }

    /* — Horizontal (default) — */
    :host([orientation="horizontal"]),
    :host(:not([orientation])) {
      width: 100%;
      height: 1px;
      background-color: var(--case-border);
    }

    /* — Vertical — */
    :host([orientation="vertical"]) {
      width: 1px;
      height: 100%;
      align-self: stretch;
      background-color: var(--case-border);
    }

    /* — Subtle (less visible) — */
    :host([subtle]) {
      background-color: var(--case-border-subtle);
    }

    /* — Strong (more visible) — */
    :host([strong]) {
      background-color: var(--case-border-strong);
    }
  `],
  host: {
    '[attr.orientation]': 'orientation',
    '[attr.subtle]': 'subtle || null',
    '[attr.strong]': 'strong || null',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation',
  }
})
export class CaseDividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() subtle = false;
  @Input() strong = false;
}
