import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonSection } from '../../models/lesson-document.models';

/**
 * LessonOutlineComponent — CASE Academy
 * 
 * Componente compartido para navegación intra-documento (Table of Contents).
 * Resuelve el conflicto entre HashLocationStrategy y la navegación de fragmentos,
 * interceptando el evento para realizar smooth scroll en el contenedor principal
 * (#workspace-canvas) sin alterar la ruta del Router ni provocar saltos erróneos.
 */
@Component({
  selector: 'app-lesson-outline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="living-doc__outline" aria-label="Índice de la lección">
      <span class="living-doc__outline-label">ÍNDICE DE LA LECCIÓN:</span>
      <div class="living-doc__outline-items">
        @for (sec of sections; track sec.id) {
          <a
            class="living-doc__outline-link"
            role="button"
            tabindex="0"
            (click)="scrollToSection(sec.id)"
            (keydown.enter)="scrollToSection(sec.id)"
            (keydown.space)="scrollToSection(sec.id); $event.preventDefault()">
            {{ sec.title }}
          </a>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .living-doc__outline {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-2);
      padding: var(--case-space-3) var(--case-space-4);
      background-color: var(--case-surface-1);
      border: var(--case-border-width) solid var(--case-border);
      border-radius: var(--case-radius);
      margin-bottom: var(--case-space-8);
    }

    .living-doc__outline-label {
      font-family: var(--case-font-mono);
      font-size: 10px;
      font-weight: var(--case-weight-semibold);
      color: var(--case-text-muted);
      letter-spacing: var(--case-tracking-wider);
    }

    .living-doc__outline-items {
      display: flex;
      flex-wrap: wrap;
      gap: var(--case-space-2);
    }

    .living-doc__outline-link {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-xs);
      color: var(--case-text-secondary);
      text-decoration: none;
      padding: 3px var(--case-space-2);
      border-radius: var(--case-radius-sm);
      background-color: var(--case-surface-2);
      border: var(--case-border-width) solid var(--case-border);
      cursor: pointer;
      line-height: inherit;
      text-align: left;
      font-weight: inherit;
      transition:
        color var(--case-transition-fast),
        border-color var(--case-transition-fast),
        background-color var(--case-transition-fast);
    }

    .living-doc__outline-link:hover {
      color: var(--case-text-primary);
      border-color: var(--case-border-strong);
      background-color: var(--case-surface-3);
    }

    .living-doc__outline-link:focus-visible {
      color: var(--case-text-primary);
      border-color: var(--case-border-strong);
      background-color: var(--case-surface-3);
      outline: 2px solid var(--case-primary, #6366f1);
      outline-offset: 1px;
    }

    @media (prefers-reduced-motion: reduce) {
      .living-doc__outline-link {
        transition: none;
      }
    }
  `]
})
export class LessonOutlineComponent {
  @Input({ required: true }) sections!: LessonSection[];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      // Mejora de accesibilidad: mover foco al encabezado de la sección si existe
      const heading = element.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }
}
