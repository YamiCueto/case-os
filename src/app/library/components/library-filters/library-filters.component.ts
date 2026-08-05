import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActiveFilters {
  types: string[];
  difficulties: string[];
}

@Component({
  selector: 'app-library-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-filters.component.html'
})
export class LibraryFiltersComponent {
  @Output() filterChange = new EventEmitter<ActiveFilters>();

  availableTypes = ['PROMPT', 'ARCHITECTURE', 'CHECKLIST', 'TEMPLATE', 'CONTEXT'];
  availableDifficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  activeTypes = new Set<string>();
  activeDifficulties = new Set<string>();

  toggleType(type: string) {
    if (this.activeTypes.has(type)) {
      this.activeTypes.delete(type);
    } else {
      this.activeTypes.add(type);
    }
    this.emitChange();
  }

  toggleDifficulty(diff: string) {
    if (this.activeDifficulties.has(diff)) {
      this.activeDifficulties.delete(diff);
    } else {
      this.activeDifficulties.add(diff);
    }
    this.emitChange();
  }

  clearFilters() {
    this.activeTypes.clear();
    this.activeDifficulties.clear();
    this.emitChange();
  }

  private emitChange() {
    this.filterChange.emit({
      types: Array.from(this.activeTypes),
      difficulties: Array.from(this.activeDifficulties)
    });
  }
}
