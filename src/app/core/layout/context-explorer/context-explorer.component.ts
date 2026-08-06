import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceRegistryService } from '../workspace-registry/workspace-registry.service';
import { CaseIconButtonComponent } from '../../ui/components/case-icon-button/case-icon-button.component';

/**
 * ContextExplorerComponent — CASE Shell
 * Sprint 4 — Context Explorer (Functional)
 *
 * Generic renderer fed entirely by WorkspaceRegistryService.
 * Contains NO knowledge of Academy, Library, or Labs.
 * Only knows how to render: sections → items → active states.
 *
 * Collapse state managed via internal Signal (Sprint 5 will expose this
 * through the WorkspaceRegistry for external control if needed).
 */
@Component({
  selector: 'app-context-explorer',
  standalone: true,
  imports: [RouterModule, CaseIconButtonComponent],
  template: `
    <aside
      class="explorer"
      [class.explorer--collapsed]="collapsed()"
      aria-label="Explorador de contexto"
    >

      <!-- ── Header ── -->
      <div class="explorer__header">
        @if (!collapsed()) {
          <span class="explorer__header-title">
            @if (config()) {
              <span class="material-symbols-outlined explorer__header-icon" aria-hidden="true">
                {{ config()!.icon }}
              </span>
              {{ config()!.label }}
            } @else {
              Explorer
            }
          </span>
        }
        <case-icon-button
          [icon]="collapsed() ? 'panel_open' : 'panel_close'"
          [tooltip]="collapsed() ? 'Expandir' : 'Colapsar'"
          size="sm"
          variant="ghost"
          (click)="toggleCollapse()"
        />
      </div>

      <!-- ── Body ── -->
      <div class="explorer__body" [attr.aria-hidden]="collapsed()">

        @if (!collapsed()) {

          @if (config(); as explorerConfig) {
            <!-- Render workspace sections and items -->
            @for (section of explorerConfig.config.sections; track section.id) {
              <div class="explorer__section">

                <!-- Section title (optional) -->
                @if (section.title) {
                  <div class="explorer__section-header">
                    <span class="explorer__section-title">{{ section.title }}</span>
                  </div>
                }

                <!-- Section items -->
                @for (item of section.items; track item.id) {
                  @if (item.path && !item.isLocked) {
                    <!-- Navigable item -->
                    <a
                      [routerLink]="item.path"
                      routerLinkActive="explorer__item--active"
                      class="explorer__item"
                      [class.explorer__item--child]="(item.depth ?? 0) > 0"
                      [style.--item-depth]="item.depth ?? 0"
                      [attr.title]="item.label"
                      [attr.aria-current]="item.isActive ? 'page' : null"
                    >
                      @if (item.icon) {
                        <span class="material-symbols-outlined explorer__item-icon" aria-hidden="true">
                          {{ item.icon }}
                        </span>
                      }
                      <span class="explorer__item-label">{{ item.label }}</span>
                    </a>
                  } @else if (item.isLocked) {
                    <!-- Locked item -->
                    <span
                      class="explorer__item explorer__item--locked"
                      [class.explorer__item--child]="(item.depth ?? 0) > 0"
                      [style.--item-depth]="item.depth ?? 0"
                      aria-disabled="true"
                    >
                      @if (item.icon) {
                        <span class="material-symbols-outlined explorer__item-icon" aria-hidden="true">
                          {{ item.icon }}
                        </span>
                      }
                      <span class="explorer__item-label">{{ item.label }}</span>
                      <span class="material-symbols-outlined explorer__item-lock" aria-label="Bloqueado">
                        lock
                      </span>
                    </span>
                  } @else {
                    <!-- Non-navigable label (future feature placeholder) -->
                    <span
                      class="explorer__item explorer__item--label"
                      [class.explorer__item--child]="(item.depth ?? 0) > 0"
                      [style.--item-depth]="item.depth ?? 0"
                    >
                      @if (item.icon) {
                        <span class="material-symbols-outlined explorer__item-icon" aria-hidden="true">
                          {{ item.icon }}
                        </span>
                      }
                      <span class="explorer__item-label">{{ item.label }}</span>
                    </span>
                  }
                }
              </div>
            }

          } @else {
            <!-- No explorer for current workspace (Dashboard, unknown) -->
            <div class="explorer__empty">
              <span class="material-symbols-outlined explorer__empty-icon" aria-hidden="true">
                grid_view
              </span>
              <p class="explorer__empty-text">
                Selecciona un Workspace para navegar su contenido.
              </p>
            </div>
          }

        }
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    /* ── Panel ─────────────────────────────────────────────────────────── */
    .explorer {
      display: flex;
      flex-direction: column;
      width: var(--case-explorer-width);
      height: 100%;
      background-color: var(--case-surface-1);
      border-right: var(--case-border-width) solid var(--case-border);
      overflow: hidden;
      transition:
        width var(--case-transition-slow),
        border-color var(--case-transition-slow);
    }

    .explorer--collapsed {
      width: 0;
      border-right-color: transparent;
    }

    /* ── Header ─────────────────────────────────────────────────────────── */
    .explorer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--case-row-height-md);
      padding: 0 var(--case-space-2) 0 var(--case-space-3);
      border-bottom: var(--case-border-width) solid var(--case-border);
      flex-shrink: 0;
      background-color: var(--case-surface-1);
      position: sticky;
      top: 0;
      z-index: 1;
      overflow: hidden;
      white-space: nowrap;
    }

    .explorer__header-title {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-2);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-secondary);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wider);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .explorer__header-icon {
      font-size: var(--case-icon-xs);
      color: var(--case-text-muted);
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
    }

    /* ── Body ────────────────────────────────────────────────────────────── */
    .explorer__body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--case-space-2) 0;
      scrollbar-width: thin;
      scrollbar-color: var(--case-border-strong) transparent;
    }
    .explorer__body::-webkit-scrollbar       { width: 4px; }
    .explorer__body::-webkit-scrollbar-track { background: transparent; }
    .explorer__body::-webkit-scrollbar-thumb {
      background: var(--case-border-strong);
      border-radius: var(--case-radius-pill);
    }

    /* ── Sections ────────────────────────────────────────────────────────── */
    .explorer__section {
      margin-bottom: var(--case-space-1);
    }

    .explorer__section-header {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 0 var(--case-space-3);
      margin-top: var(--case-space-3);
      margin-bottom: var(--case-space-px);
    }

    .explorer__section-title {
      font-family: var(--case-font-sans);
      font-size: 10px;
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-muted);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wider);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Items ───────────────────────────────────────────────────────────── */
    .explorer__item {
      display: flex;
      align-items: center;
      gap: var(--case-space-2);
      height: var(--case-row-height);     /* 28px */
      padding-right: var(--case-space-3);
      padding-left: calc(var(--case-space-3) + (var(--item-depth, 0) * 16px));
      border-left: 2px solid transparent;
      color: var(--case-text-secondary);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-regular);
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition:
        background-color var(--case-transition-fast),
        color var(--case-transition-fast),
        border-color var(--case-transition-fast);
    }

    a.explorer__item:hover {
      background-color: var(--case-state-hover);
      color: var(--case-text-primary);
    }

    /* Active item — 2px left border accent */
    .explorer__item--active {
      background-color: var(--case-accent-subtle) !important;
      color: var(--case-text-primary) !important;
      border-left-color: var(--case-accent) !important;
      font-weight: var(--case-weight-medium) !important;
    }

    /* Child items — indented */
    .explorer__item--child {
      font-size: var(--case-text-xs);
    }

    /* Locked items */
    .explorer__item--locked {
      opacity: var(--case-opacity-muted);
      cursor: not-allowed;
    }

    /* Non-navigable label */
    .explorer__item--label {
      cursor: default;
      color: var(--case-text-muted);
    }

    /* Item icon */
    .explorer__item-icon {
      font-size: var(--case-icon-xs);
      flex-shrink: 0;
      color: var(--case-text-muted);
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
      transition: color var(--case-transition-fast);
    }
    .explorer__item--active .explorer__item-icon,
    a.explorer__item:hover .explorer__item-icon {
      color: var(--case-text-secondary);
    }

    /* Item label — truncates */
    .explorer__item-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Lock icon */
    .explorer__item-lock {
      font-size: var(--case-icon-xs);
      color: var(--case-text-disabled);
      flex-shrink: 0;
      margin-left: auto;
    }

    /* ── Empty state ─────────────────────────────────────────────────────── */
    .explorer__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--case-space-3);
      padding: var(--case-space-8) var(--case-space-4);
      text-align: center;
    }
    .explorer__empty-icon {
      font-size: var(--case-icon-xl);
      color: var(--case-text-disabled);
      font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;
    }
    .explorer__empty-text {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      color: var(--case-text-muted);
      line-height: var(--case-leading-relaxed);
      margin: 0;
    }
  `]
})
export class ContextExplorerComponent {
  private registry = inject(WorkspaceRegistryService);

  /** The current workspace config from the registry */
  readonly config = this.registry.explorerConfig;

  /** Collapse state — managed locally */
  readonly collapsed = signal(false);

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }
}
