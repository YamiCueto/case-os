import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';

export interface CaseTab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

/**
 * CaseTabs — CASE UI Library
 *
 * Horizontal tab bar with a 2px accent indicator on the active tab.
 * Supports icon + label, badge count, and disabled states.
 * Can be controlled externally (activeTab input) or managed internally.
 *
 * Usage:
 *   <case-tabs
 *     [tabs]="[{ id: 'code', label: 'Code', icon: 'code' }]"
 *     activeTab="code"
 *     (tabChange)="onTabChange($event)"
 *   />
 */
@Component({
  selector: 'case-tabs',
  standalone: true,
  template: `
    <div class="case-tabs" role="tablist">
      @for (tab of tabs; track tab.id) {
        <button
          class="case-tabs__tab"
          [class.case-tabs__tab--active]="activeTab === tab.id"
          [class.case-tabs__tab--disabled]="tab.disabled"
          [disabled]="tab.disabled || null"
          role="tab"
          [attr.aria-selected]="activeTab === tab.id"
          [attr.aria-controls]="'panel-' + tab.id"
          [id]="'tab-' + tab.id"
          (click)="selectTab(tab)"
        >
          @if (tab.icon) {
            <span class="material-symbols-outlined case-tabs__icon" aria-hidden="true">{{ tab.icon }}</span>
          }
          <span class="case-tabs__label">{{ tab.label }}</span>
          @if (tab.badge !== undefined && tab.badge !== null) {
            <span class="case-tabs__badge">{{ tab.badge }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .case-tabs {
      display: flex;
      align-items: stretch;
      border-bottom: var(--case-border-width) solid var(--case-border);
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .case-tabs::-webkit-scrollbar { display: none; }

    .case-tabs__tab {
      display: inline-flex;
      align-items: center;
      gap: var(--case-space-2);
      padding: 0 var(--case-space-4);
      height: 36px;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--case-text-secondary);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      cursor: pointer;
      transition:
        color var(--case-transition-fast),
        border-color var(--case-transition-fast),
        background-color var(--case-transition-fast);
      white-space: nowrap;
      position: relative;
      /* offset to overlap the container's border-bottom */
      margin-bottom: -1px;
      border-radius: 0;
      flex-shrink: 0;
    }

    .case-tabs__tab:hover:not(:disabled):not(.case-tabs__tab--active) {
      color: var(--case-text-primary);
      background-color: var(--case-state-hover);
    }

    .case-tabs__tab--active {
      color: var(--case-text-primary);
      border-bottom-color: var(--case-accent);
    }

    .case-tabs__tab--disabled {
      opacity: var(--case-opacity-disabled);
      cursor: not-allowed;
    }

    .case-tabs__tab:focus-visible {
      outline: 2px solid var(--case-accent);
      outline-offset: -2px;
    }

    .case-tabs__icon {
      font-size: var(--case-icon-sm);
    }

    .case-tabs__badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 16px;
      padding: 0 var(--case-space-1);
      border-radius: var(--case-radius-pill);
      background-color: var(--case-surface-4);
      color: var(--case-text-muted);
      font-family: var(--case-font-mono);
      font-size: 10px;
      font-weight: var(--case-weight-medium);
    }

    .case-tabs__tab--active .case-tabs__badge {
      background-color: var(--case-accent-muted);
      color: var(--case-accent);
    }
  `]
})
export class CaseTabsComponent {
  @Input() tabs: CaseTab[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tab: CaseTab): void {
    if (tab.disabled) return;
    this.tabChange.emit(tab.id);
  }
}
