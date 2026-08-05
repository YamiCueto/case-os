import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../core/models/resource.models';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-card.component.html'
})
export class ResourceCardComponent {
  @Input({ required: true }) resource!: Resource;
  @Output() viewDetail = new EventEmitter<Resource>();

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

  onViewClick() {
    this.viewDetail.emit(this.resource);
  }
}
