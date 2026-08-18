import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CaseCodeBlockComponent — CASE Design System
 * 
 * Componente canónico para renderizar fragmentos de código, prompts estructurados
 * y especificaciones técnicas con soporte de copiado al portapapeles y estilo JetBrains Mono.
 */
@Component({
  selector: 'case-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-code-block.component.html',
  styleUrl: './case-code-block.component.css'
})
export class CaseCodeBlockComponent {
  @Input({ required: true }) code!: string;
  @Input() language = 'text';
  @Input() filename?: string;
  @Input() lineNumbers = false;
  @Input() copyable = true;

  copySuccess = signal(false);

  async copyToClipboard(): Promise<void> {
    if (!this.code) return;
    try {
      await navigator.clipboard.writeText(this.code);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  }
}
