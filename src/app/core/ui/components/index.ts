/**
 * CASE UI Library — Barrel Export
 * Sprint 2 — Primitive UI Components
 *
 * Import from this file to consume the CASE UI Library:
 *   import { CaseButtonComponent, CasePanelComponent } from '@core/ui/components';
 *
 * All components:
 *   - Are Angular standalone
 *   - Consume only CASE Design System tokens (CSS custom properties)
 *   - Have zero hardcoded colors, fonts, or spacing
 *   - Are fully accessible (ARIA, focus-visible, keyboard navigation)
 *   - Have no external dependencies beyond @angular/core and @angular/router
 */

// Actions
export { CaseButtonComponent }     from './case-button/case-button.component';
export { CaseIconButtonComponent } from './case-icon-button/case-icon-button.component';

// Layout
export { CasePanelComponent }      from './case-panel/case-panel.component';
export { CaseDividerComponent }    from './case-divider/case-divider.component';

// Content
export { CaseBadgeComponent }      from './case-badge/case-badge.component';
export { CaseProgressBarComponent } from './case-progress-bar/case-progress-bar.component';
export { CaseTabsComponent }       from './case-tabs/case-tabs.component';
export { CaseBreadcrumbComponent } from './case-breadcrumb/case-breadcrumb.component';
export { CaseEmptyStateComponent } from './case-empty-state/case-empty-state.component';
export { CaseSkeletonComponent }   from './case-skeleton/case-skeleton.component';
export { CaseCodeBlockComponent }  from './case-code-block/case-code-block.component';
export { CaseCalloutComponent }    from './case-callout/case-callout.component';

// Types
export type { ButtonVariant, ButtonSize, ButtonType } from './case-button/case-button.component';
export type { IconButtonSize, IconButtonVariant }     from './case-icon-button/case-icon-button.component';
export type { PanelElevation, PanelPadding }          from './case-panel/case-panel.component';
export type { BadgeVariant }                          from './case-badge/case-badge.component';
export type { ProgressVariant, ProgressHeight }       from './case-progress-bar/case-progress-bar.component';
export type { CaseTab }                               from './case-tabs/case-tabs.component';
export type { BreadcrumbItem }                        from './case-breadcrumb/case-breadcrumb.component';
export type { SkeletonVariant }                       from './case-skeleton/case-skeleton.component';
export type { CalloutVariant }                        from './case-callout/case-callout.component';
