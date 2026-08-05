import { Component, Input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-block.component.html'
})
export class CodeBlockComponent {
  @Input({ required: true }) code!: string;
  @Input() language: string = '';

  copySuccess = signal(false);

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }
}
