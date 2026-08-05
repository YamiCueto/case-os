import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../core/models/resource.models';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-detail.component.html'
})
export class ResourceDetailComponent {
  @Input({ required: true }) resource!: Resource;
  @Output() close = new EventEmitter<void>();

  copySuccess = false;

  onClose() {
    this.close.emit();
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.resource.content);
      this.copySuccess = true;
      setTimeout(() => this.copySuccess = false, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  }

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'PROMPT': '💬',
      'ARCHITECTURE': '🏗️',
      'CHECKLIST': '✅',
      'TEMPLATE': '📄',
      'AGENT': '🤖',
      'CONTEXT': '🧠'
    };
    return icons[type] || '📄';
  }
}
