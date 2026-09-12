import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaseIconButtonComponent } from '../../ui/components/case-icon-button/case-icon-button.component';
import { CaseBreadcrumbComponent } from '../../ui/components/case-breadcrumb/case-breadcrumb.component';
import { WorkspaceRegistryService } from '../workspace-registry/workspace-registry.service';
import { LayoutStateService } from '../layout-state.service';
import { SupabaseService } from '../../services/supabase.service';
import { GuestClaimService } from '../../services/guest-claim.service';

/**
 * WorkspaceTopBar — CASE Shell
 * Sprint 5 & Supabase Auth Integration
 *
 * Fixed 40px bar at the top of the Workspace.
 * Integrated with Google OAuth and Storage Namespace isolation.
 */
@Component({
  selector: 'app-workspace-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, CaseIconButtonComponent, CaseBreadcrumbComponent],
  template: `
    <header class="topbar" role="banner">

      <!-- Mobile Menu Toggle -->
      <div class="topbar__mobile-menu">
        <case-icon-button
          icon="menu"
          tooltip="Menú"
          size="sm"
          variant="ghost"
          (click)="toggleMenu()"
        />
      </div>

      <!-- Brand -->
      <a routerLink="/dashboard" class="topbar__brand" aria-label="CASE OS — Engineering Workspace">
        <div class="topbar__brand-mark" aria-hidden="true">
          <span class="material-symbols-outlined">terminal</span>
        </div>
        <span class="topbar__brand-name">CASE OS</span>
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

        <!-- Search trigger -->
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

        <!-- Sync Status Indicator -->
        <div class="topbar__sync-badge" [title]="supabase.syncStatusLabel">
          <span class="topbar__sync-dot" [class.topbar__sync-dot--connected]="supabase.isAuthenticated()"></span>
          <span class="topbar__sync-text">{{ supabase.isAuthenticated() ? 'Sincronizado' : 'Modo Local' }}</span>
        </div>

        <div class="topbar__actions-divider" aria-hidden="true"></div>

        <!-- User profile / Auth button -->
        <div class="topbar__user-container">
          @if (supabase.isAuthenticated()) {
            <button
              class="topbar__user"
              type="button"
              [title]="supabase.userDisplayName()"
              aria-label="Cuenta de usuario"
              (click)="toggleUserMenu()"
            >
              @if (supabase.userAvatarUrl()) {
                <img [src]="supabase.userAvatarUrl()" [alt]="supabase.userDisplayName()" class="topbar__avatar-img" />
              } @else {
                <div class="topbar__avatar" aria-hidden="true">
                  {{ (supabase.userDisplayName().slice(0, 2) || 'US') | uppercase }}
                </div>
              }
            </button>
          } @else {
            <button
              class="topbar__login-btn"
              type="button"
              (click)="loginWithGoogle()"
              [disabled]="supabase.authLoading()"
            >
              <span class="material-symbols-outlined">login</span>
              <span>Google</span>
            </button>
          }

          <!-- User Dropdown Menu -->
          @if (isUserMenuOpen()) {
            <div class="topbar__user-menu" (mouseleave)="closeUserMenu()">
              <div class="topbar__user-header">
                <div class="topbar__user-name">{{ supabase.userDisplayName() }}</div>
                <div class="topbar__user-email">{{ supabase.currentUser()?.email }}</div>
              </div>

              <!-- Guest Claim Alert inside menu if guest data detected -->
              @if (guestClaim.hasGuestData()) {
                <div class="topbar__claim-banner">
                  <span class="material-symbols-outlined">cloud_sync</span>
                  <div class="topbar__claim-info">
                    <strong>Progreso local previo</strong>
                    <span>Tienes lecciones en este navegador.</span>
                  </div>
                  <button
                    class="topbar__claim-btn"
                    (click)="claimGuestData()"
                    [disabled]="guestClaim.isImporting()"
                  >
                    {{ guestClaim.isImporting() ? 'Vinculando...' : 'Vincular' }}
                  </button>
                </div>
              }

              <div class="topbar__menu-divider"></div>

              <div class="topbar__menu-item topbar__menu-item--static">
                <span class="material-symbols-outlined">sync</span>
                <span>{{ supabase.syncStatusLabel }}</span>
              </div>

              <button class="topbar__menu-item topbar__menu-item--action" (click)="logout()">
                <span class="material-symbols-outlined">logout</span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          }
        </div>

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

    .topbar {
      display: flex;
      align-items: center;
      height: 100%;
      background-color: var(--case-surface-1);
      border-bottom: var(--case-border-width) solid var(--case-border);
      padding: 0 var(--case-space-3);
      gap: 0;
    }

    .topbar__mobile-menu {
      display: none;
      margin-right: var(--case-space-1);
    }
    
    @media (max-width: 768px) {
      .topbar__mobile-menu {
        display: block;
      }
      .topbar__brand-name {
        display: none;
      }
    }

    .topbar__brand {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-2);
      text-decoration: none;
      color: var(--case-text-primary);
      flex-shrink: 0;
      border-radius: var(--case-radius-sm);
      padding: 2px 4px;
      transition: background-color var(--case-transition-fast);
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
      width: 20px;
      height: 20px;
      border-radius: var(--case-radius-sm);
      background-color: var(--case-accent);
      color: var(--case-accent-contrast, #fff);
    }
    .topbar__brand-mark .material-symbols-outlined {
      font-size: 14px;
    }

    .topbar__brand-name {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-bold);
      letter-spacing: var(--case-tracking-wide);
      color: var(--case-text-primary);
    }

    .topbar__divider {
      width: var(--case-border-width);
      height: 16px;
      background-color: var(--case-border);
      margin: 0 var(--case-space-3);
      flex-shrink: 0;
    }

    .topbar__breadcrumb {
      flex-shrink: 1;
      min-width: 0;
      overflow: hidden;
    }

    .topbar__spacer {
      flex: 1;
    }

    .topbar__actions {
      display: flex;
      align-items: center;
      gap: var(--case-space-2);
      flex-shrink: 0;
    }

    .topbar__actions-divider {
      width: var(--case-border-width);
      height: 16px;
      background-color: var(--case-border);
      margin: 0 var(--case-space-1);
    }

    /* Sync badge */
    .topbar__sync-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: var(--case-radius-pill);
      background-color: var(--case-surface-2);
      border: var(--case-border-width) solid var(--case-border);
      font-family: var(--case-font-mono);
      font-size: 10px;
      color: var(--case-text-muted);
    }
    .topbar__sync-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #eab308;
    }
    .topbar__sync-dot--connected {
      background-color: #22c55e;
      box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
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

    /* User actions */
    .topbar__user-container {
      position: relative;
    }

    .topbar__login-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      padding: 0 10px;
      border-radius: var(--case-radius);
      border: 1px solid var(--case-accent);
      background-color: transparent;
      color: var(--case-accent);
      font-family: var(--case-font-sans);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--case-transition-fast);
    }
    .topbar__login-btn:hover {
      background-color: var(--case-accent-muted);
    }
    .topbar__login-btn .material-symbols-outlined {
      font-size: 16px;
    }

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

    .topbar__avatar-img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--case-border);
    }

    /* Dropdown User Menu */
    .topbar__user-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      background-color: var(--case-surface-1);
      border: 1px solid var(--case-border-strong);
      border-radius: var(--case-radius);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      padding: 8px 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
    }

    .topbar__user-header {
      padding: 8px 14px;
    }
    .topbar__user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--case-text-primary);
    }
    .topbar__user-email {
      font-size: 11px;
      color: var(--case-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topbar__claim-banner {
      margin: 6px 10px;
      padding: 8px;
      background-color: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--case-radius-sm);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .topbar__claim-banner .material-symbols-outlined {
      color: var(--case-accent);
      font-size: 18px;
    }
    .topbar__claim-info strong {
      font-size: 11px;
      display: block;
      color: var(--case-text-primary);
    }
    .topbar__claim-info span {
      font-size: 10px;
      color: var(--case-text-muted);
    }
    .topbar__claim-btn {
      align-self: flex-end;
      padding: 3px 8px;
      font-size: 10px;
      background-color: var(--case-accent);
      color: #fff;
      border: none;
      border-radius: var(--case-radius-sm);
      cursor: pointer;
    }

    .topbar__menu-divider {
      height: 1px;
      background-color: var(--case-border);
      margin: 6px 0;
    }

    .topbar__menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      font-size: 12px;
      color: var(--case-text-secondary);
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    .topbar__menu-item .material-symbols-outlined {
      font-size: 16px;
    }
    .topbar__menu-item--action {
      cursor: pointer;
      transition: background-color var(--case-transition-fast);
    }
    .topbar__menu-item--action:hover {
      background-color: var(--case-state-hover);
      color: var(--case-text-primary);
    }
    .topbar__menu-item--static {
      color: var(--case-text-muted);
      font-size: 11px;
    }
  `]
})
export class WorkspaceTopBarComponent {
  private registry = inject(WorkspaceRegistryService);
  private layoutState = inject(LayoutStateService);
  readonly supabase = inject(SupabaseService);
  readonly guestClaim = inject(GuestClaimService);

  readonly breadcrumbs = this.registry.breadcrumbs;
  readonly isUserMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.layoutState.toggleSidebar();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  async loginWithGoogle(): Promise<void> {
    await this.supabase.signInWithGoogle();
  }

  async logout(): Promise<void> {
    this.closeUserMenu();
    await this.supabase.signOut();
  }

  async claimGuestData(): Promise<void> {
    await this.guestClaim.importGuestProgress();
  }
}
