import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

/**
 * CaseBreadcrumb — CASE UI Library
 *
 * Slash-separated navigation path. Last item is always the current page (no link).
 * Respects keyboard navigation and ARIA landmark.
 *
 * Usage:
 *   <case-breadcrumb [items]="[
 *     { label: 'Academy', path: '/academy/home' },
 *     { label: 'Módulo 1' },
 *     { label: 'Clase 3: Migración Legacy' }
 *   ]" />
 */
@Component({
  selector: 'case-breadcrumb',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="case-breadcrumb" aria-label="Breadcrumb">
      <ol class="case-breadcrumb__list">
        @for (item of items; track item.label; let last = $last) {
          <li class="case-breadcrumb__item">
            @if (!last && item.path) {
              <a [routerLink]="item.path" class="case-breadcrumb__link">
                @if (item.icon) {
                  <span class="material-symbols-outlined case-breadcrumb__icon" aria-hidden="true">{{ item.icon }}</span>
                }
                {{ item.label }}
              </a>
            } @else if (!last) {
              <span class="case-breadcrumb__link case-breadcrumb__link--no-route">{{ item.label }}</span>
            } @else {
              <span class="case-breadcrumb__current" aria-current="page">
                @if (item.icon) {
                  <span class="material-symbols-outlined case-breadcrumb__icon" aria-hidden="true">{{ item.icon }}</span>
                }
                {{ item.label }}
              </span>
            }
            @if (!last) {
              <span class="case-breadcrumb__separator" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .case-breadcrumb { }

    .case-breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .case-breadcrumb__item {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-1);
    }

    .case-breadcrumb__link {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-1);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-secondary);
      text-decoration: none;
      transition: color var(--case-transition-fast);
    }
    .case-breadcrumb__link:hover {
      color: var(--case-text-primary);
    }
    .case-breadcrumb__link--no-route {
      cursor: default;
    }
    .case-breadcrumb__link:focus-visible {
      outline: 2px solid var(--case-accent);
      border-radius: var(--case-radius-sm);
      outline-offset: 2px;
    }

    .case-breadcrumb__current {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-1);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-primary);
    }

    .case-breadcrumb__separator {
      font-family: var(--case-font-mono);
      font-size: var(--case-text-xs);
      color: var(--case-text-muted);
      margin: 0 var(--case-space-1);
      user-select: none;
      -webkit-user-select: none;
    }

    .case-breadcrumb__icon {
      font-size: var(--case-icon-xs);
    }
  `]
})
export class CaseBreadcrumbComponent {
  @Input({ required: true }) items: BreadcrumbItem[] = [];
}
