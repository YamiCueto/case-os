import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceRegistryService } from '../workspace-registry/workspace-registry.service';

/**
 * GlobalNavComponent — CASE Shell
 * Sprint 5 — Workspace Consolidation
 *
 * Permanent 48px vertical navigation rail. Icon-only.
 * Driven entirely by WorkspaceRegistryService.
 *
 * Contains ZERO hardcoded workspaces.
 * Reacts to `metadata.enabled`, `metadata.comingSoon`, and `order`.
 */
@Component({
  selector: 'app-global-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="global-nav" role="navigation" aria-label="Navegación principal">

      <!-- Primary workspaces (Enabled & Not Coming Soon) -->
      <ul class="global-nav__list" role="list">
        @for (item of primaryWorkspaces(); track item.id) {
          <li class="global-nav__item" role="listitem">
            <a
              [routerLink]="item.route"
              routerLinkActive="global-nav__link--active"
              [routerLinkActiveOptions]="item.id === 'dashboard' ? { exact: true } : {}"
              class="global-nav__link"
              [attr.title]="item.label"
              [attr.aria-label]="item.label"
            >
              <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
            </a>
          </li>
        }
      </ul>

      <!-- Divider -->
      @if (comingSoonWorkspaces().length > 0) {
        <div class="global-nav__divider" aria-hidden="true"></div>
      }

      <!-- Coming soon workspaces -->
      <ul class="global-nav__list" role="list">
        @for (item of comingSoonWorkspaces(); track item.id) {
          <li class="global-nav__item" role="listitem">
            <span
              class="global-nav__link global-nav__link--coming-soon"
              [attr.title]="item.label + ' — Próximamente'"
              [attr.aria-label]="item.label + ' — Próximamente'"
              [attr.aria-disabled]="true"
              role="link"
            >
              <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
            </span>
          </li>
        }
      </ul>

    </nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      width: var(--case-global-nav-width);
      flex-shrink: 0;
      background-color: var(--case-surface-1);
      border-right: var(--case-border-width) solid var(--case-border);
      overflow: hidden;
      overflow-y: auto;
      scrollbar-width: none;
    }
    :host::-webkit-scrollbar { display: none; }

    /* ── Nav container ── */
    .global-nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--case-space-2) 0;
      gap: var(--case-space-1);
    }

    /* ── Item lists ── */
    .global-nav__list {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--case-space-px);
    }

    .global-nav__item {
      position: relative;
    }

    /* ── Divider ── */
    .global-nav__divider {
      height: var(--case-border-width);
      background-color: var(--case-border);
      margin: var(--case-space-2) var(--case-space-3);
    }

    /* ── Link (base) ── */
    .global-nav__link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: var(--case-row-height-lg);   /* 40px */
      border: none;
      border-left: 2px solid transparent;
      background: transparent;
      color: var(--case-text-secondary);
      cursor: pointer;
      text-decoration: none;
      transition:
        color var(--case-transition-fast),
        background-color var(--case-transition-fast);
      position: relative;
    }

    .global-nav__link:hover:not(.global-nav__link--coming-soon) {
      background-color: var(--case-state-hover);
      color: var(--case-text-primary);
    }

    .global-nav__link:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: -2px;
      border-radius: var(--case-radius-sm);
    }

    /* ── Material icon sizing ── */
    .global-nav__link .material-symbols-outlined {
      font-size: var(--case-icon-md);    /* 20px */
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
      transition: font-variation-settings var(--case-transition-fast);
    }

    /* ── Active state: 2px left accent line ── */
    .global-nav__link--active {
      color: var(--case-text-primary);
      background-color: var(--case-accent-subtle);
      border-left-color: var(--case-accent);
    }
    .global-nav__link--active .material-symbols-outlined {
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
    }

    /* ── Coming Soon ── */
    .global-nav__link--coming-soon {
      opacity: var(--case-opacity-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }
  `]
})
export class GlobalNavComponent {
  private registry = inject(WorkspaceRegistryService);

  readonly primaryWorkspaces = computed(() => {
    return this.registry.workspaces()
      .filter(w => !w.metadata.comingSoon && !w.metadata.hidden)
      .sort((a, b) => a.order - b.order);
  });

  readonly comingSoonWorkspaces = computed(() => {
    return this.registry.workspaces()
      .filter(w => w.metadata.comingSoon && !w.metadata.hidden)
      .sort((a, b) => a.order - b.order);
  });
}
