import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CaseIconButtonComponent } from '../../ui/components/case-icon-button/case-icon-button.component';
import { CaseBreadcrumbComponent } from '../../ui/components/case-breadcrumb/case-breadcrumb.component';
import { WorkspaceRegistryService } from '../workspace-registry/workspace-registry.service';

/**
 * WorkspaceTopBar — CASE Shell
 * Sprint 5 — Workspace Consolidation
 *
 * Fixed 40px bar at the top of the Workspace.
 * Consumes breadcrumbs dynamically from WorkspaceRegistryService.
 */
@Component({
  selector: 'app-workspace-topbar',
  standalone: true,
  imports: [RouterModule, CaseIconButtonComponent, CaseBreadcrumbComponent],
  template: `
    <header class="topbar" role="banner">

      <!-- Brand -->
      <a routerLink="/dashboard" class="topbar__brand" aria-label="CASE Engineering Workspace — Ir al inicio">
        <div class="topbar__brand-mark" aria-hidden="true">
          <span class="material-symbols-outlined">terminal</span>
        </div>
        <span class="topbar__brand-name">CASE</span>
      </a>

      <!-- Divider -->
      <div class="topbar__divider" aria-hidden="true"></div>

      <!-- Breadcrumbs (Dynamic from Registry) -->
      <div class="topbar__breadcrumb" aria-label="Ruta de navegación">
        <case-breadcrumb [items]="breadcrumbs()" />
      </div>

      <!-- Spacer -->
      <div class="topbar__spacer" aria-hidden="true"></div>

      <!-- Global actions -->
      <div class="topbar__actions" role="toolbar" aria-label="Acciones globales">

        <!-- Search trigger — connected in Sprint 6 (Command Palette) -->
        <button
          class="topbar__search-trigger"
          type="button"
          title="Búsqueda global (Ctrl+K)"
          aria-label="Abrir búsqueda global"
          aria-keyshortcuts="Control+K"
        >
          <span class="material-symbols-outlined" aria-hidden="true">search</span>
          <span class="topbar__search-hint" aria-hidden="true">
            <kbd>⌘</kbd><kbd>K</kbd>
          </span>
        </button>

        <div class="topbar__actions-divider" aria-hidden="true"></div>

        <!-- Notifications — placeholder -->
        <case-icon-button
          icon="notifications"
          tooltip="Notificaciones"
          size="md"
          variant="ghost"
        />

        <!-- User — placeholder -->
        <button class="topbar__user" type="button" title="Cuenta de usuario" aria-label="Cuenta de usuario">
          <div class="topbar__avatar" aria-hidden="true">US</div>
        </button>

      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      height: var(--case-topbar-height);
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: var(--case-z-raised);
    }

    /* ── TopBar container ── */
    .topbar {
      display: flex;
      align-items: center;
      height: 100%;
      background-color: var(--case-surface-1);
      border-bottom: var(--case-border-width) solid var(--case-border);
      padding: 0 var(--case-space-3);
      gap: 0;
    }

    /* ── Brand ── */
    .topbar__brand {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-2);
      text-decoration: none;
      color: var(--case-text-primary);
      padding: 0 var(--case-space-2);
      border-radius: var(--case-radius);
      transition: background-color var(--case-transition-fast);
      flex-shrink: 0;
    }
    .topbar__brand:hover {
      background-color: var(--case-state-hover);
    }
    .topbar__brand:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }

    .topbar__brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: var(--case-radius);
      background-color: var(--case-accent);
    }
    .topbar__brand-mark .material-symbols-outlined {
      font-size: 14px;
      color: var(--case-text-on-accent);
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
    }

    .topbar__brand-name {
      font-family: var(--case-font-mono);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-primary);
      letter-spacing: var(--case-tracking-wide);
    }

    /* ── Dividers ── */
    .topbar__divider {
      width: var(--case-border-width);
      height: 16px;
      background-color: var(--case-border);
      margin: 0 var(--case-space-3);
      flex-shrink: 0;
    }

    /* ── Breadcrumb area ── */
    .topbar__breadcrumb {
      display: flex;
      align-items: center;
      min-width: 0;
      /* CaseBreadcrumb component handles its own internal typography and spacing */
    }

    /* ── Spacer ── */
    .topbar__spacer {
      flex: 1;
    }

    /* ── Actions ── */
    .topbar__actions {
      display: flex;
      align-items: center;
      gap: var(--case-space-1);
      flex-shrink: 0;
    }

    .topbar__actions-divider {
      width: var(--case-border-width);
      height: 16px;
      background-color: var(--case-border);
      margin: 0 var(--case-space-1);
    }

    /* Search trigger */
    .topbar__search-trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-2);
      height: 28px;
      padding: 0 var(--case-space-3);
      border-radius: var(--case-radius);
      border: var(--case-border-width) solid var(--case-border);
      background-color: var(--case-surface-2);
      color: var(--case-text-muted);
      cursor: pointer;
      transition:
        background-color var(--case-transition-fast),
        border-color var(--case-transition-fast),
        color var(--case-transition-fast);
    }
    .topbar__search-trigger:hover {
      background-color: var(--case-surface-3);
      border-color: var(--case-border-strong);
      color: var(--case-text-secondary);
    }
    .topbar__search-trigger:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }
    .topbar__search-trigger .material-symbols-outlined {
      font-size: var(--case-icon-sm);
    }

    .topbar__search-hint {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--case-font-mono);
      font-size: 10px;
      color: var(--case-text-muted);
      background-color: var(--case-surface-3);
      border: var(--case-border-width) solid var(--case-border-strong);
      border-radius: var(--case-radius-sm);
      padding: 0 3px;
      min-width: 14px;
      height: 14px;
    }

    /* User avatar */
    .topbar__user {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--case-radius-pill);
      border: none;
      background-color: transparent;
      cursor: pointer;
      padding: 0;
      transition: background-color var(--case-transition-fast);
    }
    .topbar__user:hover {
      background-color: var(--case-state-hover);
    }
    .topbar__user:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: 2px;
    }

    .topbar__avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: var(--case-radius-pill);
      background-color: var(--case-accent-muted);
      border: var(--case-border-width) solid var(--case-border-accent);
      color: var(--case-accent);
      font-family: var(--case-font-mono);
      font-size: 9px;
      font-weight: var(--case-weight-bold);
      letter-spacing: var(--case-tracking-wide);
    }
  `]
})
export class WorkspaceTopBarComponent {
  private registry = inject(WorkspaceRegistryService);

  readonly breadcrumbs = this.registry.breadcrumbs;
}
