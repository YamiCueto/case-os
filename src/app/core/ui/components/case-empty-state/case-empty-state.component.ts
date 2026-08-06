import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * CaseEmptyState — CASE UI Library
 *
 * Empty state placeholder. Used when a list or workspace has no content.
 * Supports an optional CTA — either a router link or a button action.
 *
 * Usage:
 *   <case-empty-state
 *     icon="science"
 *     title="No hay labs activos"
 *     message="Explora los labs disponibles para comenzar."
 *     ctaLabel="Ver Labs"
 *     ctaPath="/labs"
 *   />
 *
 *   <case-empty-state
 *     icon="inbox"
 *     title="Sin actividad reciente"
 *     ctaLabel="Empezar ahora"
 *     (ctaClick)="onStart()"
 *   />
 */
@Component({
  selector: 'case-empty-state',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="case-empty">
      @if (icon) {
        <div class="case-empty__icon" aria-hidden="true">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </div>
      }
      <h3 class="case-empty__title">{{ title }}</h3>
      @if (message) {
        <p class="case-empty__message">{{ message }}</p>
      }
      @if (ctaLabel) {
        <div class="case-empty__cta">
          @if (ctaPath) {
            <a [routerLink]="ctaPath" class="case-empty__btn">
              {{ ctaLabel }}
            </a>
          } @else {
            <button type="button" class="case-empty__btn" (click)="ctaClick.emit()">
              {{ ctaLabel }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .case-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--case-space-3);
      padding: var(--case-space-10) var(--case-space-6);
      text-align: center;
    }

    .case-empty__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--case-radius-md);
      background-color: var(--case-surface-3);
      border: var(--case-border-width) solid var(--case-border);
    }
    .case-empty__icon .material-symbols-outlined {
      font-size: var(--case-icon-xl);
      color: var(--case-text-muted);
    }

    .case-empty__title {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-md);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-primary);
      margin: 0;
    }

    .case-empty__message {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      color: var(--case-text-secondary);
      line-height: var(--case-leading-relaxed);
      margin: 0;
      max-width: 320px;
    }

    .case-empty__cta {
      margin-top: var(--case-space-1);
    }

    .case-empty__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 0 var(--case-space-4);
      border-radius: var(--case-radius);
      border: var(--case-border-width) solid var(--case-border);
      background-color: transparent;
      color: var(--case-text-primary);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      cursor: pointer;
      text-decoration: none;
      transition:
        background-color var(--case-transition-fast),
        border-color var(--case-transition-fast);
    }
    .case-empty__btn:hover {
      background-color: var(--case-state-hover);
      border-color: var(--case-border-strong);
    }
    .case-empty__btn:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }
  `]
})
export class CaseEmptyStateComponent {
  @Input() icon?: string;
  @Input({ required: true }) title!: string;
  @Input() message?: string;
  @Input() ctaLabel?: string;
  @Input() ctaPath?: string;
  @Output() ctaClick = new EventEmitter<void>();
}
