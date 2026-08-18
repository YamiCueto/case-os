import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CalloutVariant = 'rule' | 'info' | 'warning' | 'caution';

/**
 * CaseCalloutComponent — CASE Design System
 * 
 * Componente para renderizar llamadas de atención técnicas, reglas de ingeniería,
 * avisos de consumo y security boundaries consumiendo tokens semánticos oficiales.
 */
@Component({
  selector: 'case-callout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-callout.component.html',
  styleUrl: './case-callout.component.css'
})
export class CaseCalloutComponent {
  @Input() variant: CalloutVariant = 'rule';
  @Input() title?: string;
  @Input() message?: string;
  @Input() icon?: string;

  readonly effectiveIcon = computed(() => {
    if (this.icon) return this.icon;
    switch (this.variant) {
      case 'rule':
        return 'psychology';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'caution':
        return 'gpp_maybe';
      default:
        return 'info';
    }
  });

  readonly effectiveDefaultTitle = computed(() => {
    if (this.title) return this.title;
    switch (this.variant) {
      case 'rule':
        return 'Regla de Ingeniería';
      case 'warning':
        return 'Advertencia Técnica';
      case 'caution':
        return 'Security Boundary';
      default:
        return undefined;
    }
  });
}
