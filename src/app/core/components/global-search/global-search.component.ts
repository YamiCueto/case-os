import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalSearchService } from '../../services/global-search.service';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Trigger Button -->
    <button 
      (click)="openSearch()"
      class="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors w-64">
      <span class="text-sm">🔍 Buscar en CASE...</span>
      <span class="ml-auto flex gap-1">
        <kbd class="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">Ctrl</kbd>
        <kbd class="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">K</kbd>
      </span>
    </button>

    <!-- Modal Backdrop -->
    <div *ngIf="isOpen()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]">
      <!-- Omnibox Modal -->
      <div 
        class="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        (click)="$event.stopPropagation()">
        
        <!-- Input Header -->
        <div class="flex items-center px-4 py-3 border-b border-slate-800">
          <span class="text-slate-400 text-xl mr-3">🔍</span>
          <input 
            #searchInput
            type="text" 
            placeholder="Buscar librerías, labs, prompts..."
            class="flex-1 bg-transparent text-white outline-none placeholder:text-slate-600 text-lg"
            [value]="searchService.getQuery()()"
            (input)="onInput($event)"
            autofocus>
          <button (click)="closeSearch()" class="px-2 py-1 text-slate-500 hover:text-white rounded bg-slate-900 text-xs font-bold border border-slate-800">
            ESC
          </button>
        </div>

        <!-- Resultados -->
        <div class="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          
          <div *ngIf="searchService.getQuery()().length > 0 && searchService.getResults()().length === 0" class="p-8 text-center text-slate-500">
            No se encontraron resultados para "{{ searchService.getQuery()() }}"
          </div>

          <div 
            *ngFor="let result of searchService.getResults()()" 
            (click)="navigate(result.url)"
            class="p-4 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors group flex flex-col gap-1 mb-1">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ result.icon || '📄' }}</span>
              <span class="text-white font-medium group-hover:text-indigo-400 transition-colors">{{ result.title }}</span>
              <span class="ml-auto px-2 py-0.5 bg-slate-900 text-slate-400 rounded text-[10px] uppercase font-bold border border-slate-800">
                {{ result.type }}
              </span>
            </div>
            <p class="text-slate-500 text-sm pl-8 line-clamp-1">{{ result.description }}</p>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class GlobalSearchComponent {
  isOpen = signal(false);
  searchService = inject(GlobalSearchService);
  private router = inject(Router);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleSearch();
    }
    if (event.key === 'Escape' && this.isOpen()) {
      this.closeSearch();
    }
  }

  toggleSearch() {
    this.isOpen.set(!this.isOpen());
    if (!this.isOpen()) {
      this.searchService.clear();
    }
  }

  openSearch() {
    this.isOpen.set(true);
  }

  closeSearch() {
    this.isOpen.set(false);
    this.searchService.clear();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchService.search(input.value);
  }

  navigate(url: string) {
    this.closeSearch();
    this.router.navigateByUrl(url);
  }
}
