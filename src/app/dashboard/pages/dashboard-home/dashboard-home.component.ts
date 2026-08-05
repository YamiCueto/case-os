import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { UserStatsService } from '../../../core/services/user-stats.service';
import { LibraryService } from '../../../library/services/library.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto space-y-8">
      
      <!-- Welcome Header -->
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight">Bienvenido de vuelta</h1>
          <p class="text-slate-400 text-lg mt-2">Aquí tienes un resumen de tu actividad en CASE Academy.</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div class="text-slate-400 font-medium mb-1 flex items-center gap-2"><span class="text-xl">📚</span> Recursos Vistos</div>
          <div class="text-4xl font-bold text-white">{{ stats.getStats()().totalResourcesViewed }}</div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div class="text-slate-400 font-medium mb-1 flex items-center gap-2"><span class="text-xl">🧪</span> Labs Completados</div>
          <div class="text-4xl font-bold text-white">{{ stats.getStats()().completedLabs }}</div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div class="text-slate-400 font-medium mb-1 flex items-center gap-2"><span class="text-xl">⭐</span> Favoritos</div>
          <div class="text-4xl font-bold text-white">{{ prefs.getFavorites()().size }}</div>
        </div>
      </div>

      <!-- Favoritos Globales -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
          ⭐ Tus Favoritos
        </h2>
        
        <div *ngIf="favoriteResources().length === 0" class="text-slate-500 py-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800/50 border-dashed">
          Aún no has guardado ningún recurso favorito. Explora la <a routerLink="/library" class="text-indigo-400 hover:underline">Library</a> o los <a routerLink="/labs" class="text-indigo-400 hover:underline">Labs</a>.
        </div>

        <div *ngIf="favoriteResources().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let res of favoriteResources()" 
               class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-800 transition-colors cursor-pointer group"
               [routerLink]="['/library', res.slug]">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-2xl group-hover:scale-110 transition-transform">{{ getIconForType(res.type) }}</span>
                <span class="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold">{{ res.type }}</span>
              </div>
              <h3 class="text-white font-bold text-lg mb-1">{{ res.title }}</h3>
              <p class="text-slate-400 text-sm line-clamp-2">{{ res.description }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardHomeComponent {
  prefs = inject(UserPreferencesService);
  stats = inject(UserStatsService);
  private libraryService = inject(LibraryService);

  get favoriteResources() {
    return () => {
      const favIds = this.prefs.getFavorites()();
      const allRes = this.libraryService.getAllResources()();
      return allRes.filter((r: any) => favIds.has(r.id));
    };
  }

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'PROMPT': '💬',
      'ARCHITECTURE': '🏗️',
      'CHECKLIST': '✅',
      'TEMPLATE': '📄',
      'AGENT': '🤖',
      'CONTEXT': '🧠',
      'LAB': '🧪'
    };
    return icons[type] || '📄';
  }
}
