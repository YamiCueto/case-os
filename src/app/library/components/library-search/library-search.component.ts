import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-search.component.html'
})
export class LibrarySearchComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }
}
