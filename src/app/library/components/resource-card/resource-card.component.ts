import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeResource } from '../../../core/models/knowledge.models';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule, FavoriteButtonComponent],
  templateUrl: './resource-card.component.html'
})
export class ResourceCardComponent {
  @Input({ required: true }) resource!: KnowledgeResource;
  @Output() viewDetail = new EventEmitter<KnowledgeResource>();

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
