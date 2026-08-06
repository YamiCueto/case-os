import { Component, Input } from '@angular/core';

export type SkeletonVariant = 'line' | 'block' | 'circle';

/**
 * CaseSkeleton — CASE UI Library
 *
 * Loading placeholder with shimmer animation.
 * Use to preserve layout while content loads.
 *
 * Usage:
 *   <case-skeleton variant="line" width="80%" />
 *   <case-skeleton variant="block" width="100%" height="120px" />
 *   <case-skeleton variant="circle" width="32px" height="32px" />
 *
 *   <!-- Multiple lines -->
 *   <case-skeleton [lines]="3" />
 */
@Component({
  selector: 'case-skeleton',
  standalone: true,
  template: `
    @if (lines > 1) {
      <div class="case-skeleton__lines">
        @for (_ of lineArray; track $index; let last = $last) {
          <div
            class="case-skeleton case-skeleton--line"
            [style.width]="last ? '60%' : '100%'"
          ></div>
        }
      </div>
    } @else {
      <div
        class="case-skeleton"
        [class]="skeletonClass"
        [style.width]="width"
        [style.height]="height"
      ></div>
    }
  `,
  styles: [`
    :host { display: block; }

    .case-skeleton__lines {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-2);
    }

    .case-skeleton {
      background: linear-gradient(
        90deg,
        var(--case-surface-3) 0%,
        var(--case-surface-4) 40%,
        var(--case-surface-3) 80%
      );
      background-size: 200% 100%;
      animation: case-shimmer 1.5s ease-in-out infinite;
      border-radius: var(--case-radius);
    }

    /* — Variants — */
    .case-skeleton--line {
      height: 14px;
      border-radius: var(--case-radius-sm);
    }
    .case-skeleton--block {
      border-radius: var(--case-radius-md);
      min-height: 80px;
    }
    .case-skeleton--circle {
      border-radius: var(--case-radius-pill);
    }
  `]
})
export class CaseSkeletonComponent {
  @Input() variant: SkeletonVariant = 'line';
  @Input() width = '100%';
  @Input() height = '14px';
  /** Render N lines (ignores variant/width/height when > 1) */
  @Input() lines = 1;

  get skeletonClass(): string {
    return `case-skeleton--${this.variant}`;
  }

  get lineArray(): number[] {
    return Array.from({ length: this.lines });
  }
}
