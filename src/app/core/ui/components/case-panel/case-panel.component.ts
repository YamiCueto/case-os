import { Component, Input } from '@angular/core';

export type PanelElevation = 0 | 1 | 2 | 3;
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * CasePanel — CASE UI Library
 *
 * Base container component. Communicates depth through surface elevation.
 * No shadows — depth is purely tonal per CASE design principles.
 *
 * Usage:
 *   <case-panel elevation="1" padding="md">
 *     Content here
 *   </case-panel>
 */
@Component({
  selector: 'case-panel',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    :host {
      display: block;
      border-radius: var(--case-radius-md);
      border: var(--case-border-width) solid var(--case-border);
      overflow: hidden;
      transition: border-color var(--case-transition-fast);
    }

    /* — Elevation (tonal) — */
    :host([elevation="0"]) { background-color: var(--case-surface-0); }
    :host([elevation="1"]) { background-color: var(--case-surface-1); }
    :host([elevation="2"]) { background-color: var(--case-surface-2); }
    :host([elevation="3"]) { background-color: var(--case-surface-3); }

    /* — Padding — */
    :host([padding="none"]) { padding: 0; }
    :host([padding="sm"])   { padding: var(--case-space-3); }
    :host([padding="md"])   { padding: var(--case-space-4); }
    :host([padding="lg"])   { padding: var(--case-space-6); }

    /* — No border option — */
    :host([border="false"]) { border-color: transparent; }

    /* — Interactive (hoverable) — */
    :host([interactive]) {
      cursor: pointer;
      transition:
        background-color var(--case-transition-fast),
        border-color var(--case-transition-fast);
    }
    :host([interactive]:hover) {
      background-color: var(--case-surface-4);
      border-color: var(--case-border-strong);
    }
  `],
  host: {
    '[attr.elevation]': 'elevation',
    '[attr.padding]': 'padding',
    '[attr.border]': 'border',
    '[attr.interactive]': 'interactive || null',
  }
})
export class CasePanelComponent {
  @Input() elevation: PanelElevation = 1;
  @Input() padding: PanelPadding = 'md';
  @Input() border = true;
  @Input() interactive = false;
}
