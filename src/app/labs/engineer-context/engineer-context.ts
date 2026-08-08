import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContextItem {
  id: string;
  label: string;
  description: string;
  size: number;
  selected: boolean;
  isRequired: boolean;
}

@Component({
  selector: 'app-engineer-context',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './engineer-context.html',
  styleUrls: ['../../shared-presentation.css']
})
export class EngineerContextLab {
  
  maxBudget = 100;

  items = signal<ContextItem[]>([
    { id: 'user', label: 'User State', description: 'User role, permissions, and ID', size: 10, selected: false, isRequired: true },
    { id: 'app', label: 'Application State', description: 'Current screen is "Invoice #552"', size: 15, selected: false, isRequired: true },
    { id: 'history', label: 'Conversation History', description: 'Last 50 messages from the user', size: 55, selected: false, isRequired: false },
    { id: 'history_recent', label: 'Recent Conversation', description: 'Last 2 messages', size: 15, selected: false, isRequired: true },
    { id: 'rag', label: 'Retrieved Knowledge', description: 'Vector search results for "invoice cancelation"', size: 30, selected: false, isRequired: true },
    { id: 'noise', label: 'Marketing Data', description: 'Latest promotional campaign details', size: 25, selected: false, isRequired: false }
  ]);

  currentUsage = computed(() => {
    return this.items().filter(i => i.selected).reduce((acc, curr) => acc + curr.size, 0);
  });

  budgetExceeded = computed(() => this.currentUsage() > this.maxBudget);
  
  progressWidth = computed(() => {
    const p = (this.currentUsage() / this.maxBudget) * 100;
    return p > 100 ? 100 : p;
  });

  isSuccess = computed(() => {
    if (this.budgetExceeded()) return false;
    const requiredSelected = this.items().filter(i => i.isRequired && i.selected).length;
    const totalRequired = this.items().filter(i => i.isRequired).length;
    const noisySelected = this.items().filter(i => !i.isRequired && i.selected).length;
    
    return requiredSelected === totalRequired && noisySelected === 0;
  });

  toggleSelection(item: ContextItem) {
    this.items.update(currentItems => {
      return currentItems.map(i => {
        if (i.id === item.id) {
          return { ...i, selected: !i.selected };
        }
        return i;
      });
    });
  }
}
