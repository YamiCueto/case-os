import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalSearchComponent } from '../../components/global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, GlobalSearchComponent],
  template: `
    <header class="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 relative shadow-sm">
      <div class="flex items-center gap-4">
        <!-- Puedes poner breadcrumbs aquí si gustas -->
      </div>
      
      <div class="flex flex-1 max-w-2xl justify-center">
        <app-global-search></app-global-search>
      </div>

      <div class="flex items-center gap-4">
        <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-900 text-slate-400 transition-colors">
          🔔
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {}
