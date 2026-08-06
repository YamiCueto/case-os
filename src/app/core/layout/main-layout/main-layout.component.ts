import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceTopBarComponent } from '../workspace-topbar/workspace-topbar.component';
import { GlobalNavComponent } from '../global-nav/global-nav.component';
import { ContextExplorerComponent } from '../context-explorer/context-explorer.component';
import { CommandPaletteComponent } from '../../command/command-palette/command-palette.component';

/**
 * MainLayoutComponent — CASE Shell
 * Sprint 3 — Workspace Shell
 *
 * Composes the Engineering Workspace.
 * Knows nothing about Academy, Library, Labs, or Dashboard.
 * Only assembles: TopBar + GlobalNav + Explorer + Canvas (router-outlet).
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────┐
 * │ WorkspaceTopBar (40px)                               │
 * ├──────┬───────────────┬──────────────────────────────┤
 * │  48px│    240px      │       flex-1                 │
 * │ Nav  │  Explorer     │  Workspace Canvas            │
 * │      │  (collapsible)│  <router-outlet>             │
 * └──────┴───────────────┴──────────────────────────────┘
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    WorkspaceTopBarComponent,
    GlobalNavComponent,
    ContextExplorerComponent,
    CommandPaletteComponent
  ],
  template: `
    <div class="workspace">

      <!-- Region 1: Top Bar — always visible -->
      <app-workspace-topbar />

      <!-- Region 2: Workspace Body — fills remaining height -->
      <div class="workspace__body">

        <!-- Region 2a: Global Navigation — 48px, permanent -->
        <app-global-nav />

        <!-- Region 2b: Context Explorer — 240px, collapsible -->
        <app-context-explorer />

        <!-- Region 2c: Workspace Canvas — all page content renders here -->
        <main class="workspace__canvas" id="workspace-canvas" role="main">
          <router-outlet />
        </main>

      </div>

      <!-- Command Platform Overlay -->
      <app-command-palette />
    </div>
  `,
  styles: [`
    /* ── Root workspace ── */
    .workspace {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--case-surface-0);
      overflow: hidden;
    }

    /* ── Body: horizontal 3-column row ── */
    .workspace__body {
      display: flex;
      flex: 1;
      min-height: 0;   /* critical: allows flex children to scroll independently */
      overflow: hidden;
    }

    /* ── Canvas: all routed content ── */
    .workspace__canvas {
      flex: 1;
      min-width: 0;    /* prevents flex blowout */
      overflow-y: auto;
      overflow-x: hidden;
      background-color: var(--case-surface-0);
      /* Thin custom scrollbar */
      scrollbar-width: thin;
      scrollbar-color: var(--case-border-strong) transparent;
    }
    .workspace__canvas::-webkit-scrollbar { width: 4px; }
    .workspace__canvas::-webkit-scrollbar-track { background: transparent; }
    .workspace__canvas::-webkit-scrollbar-thumb {
      background: var(--case-border-strong);
      border-radius: var(--case-radius-pill);
    }

    /* View entry animation — applied to all direct children of router-outlet */
    :host ::ng-deep .workspace__canvas > * {
      animation: case-fade-in var(--case-duration-enter) var(--case-ease-out) both;
    }
  `]
})
export class MainLayoutComponent {}
