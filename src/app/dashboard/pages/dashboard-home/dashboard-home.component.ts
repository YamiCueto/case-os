import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearningProgressService, Activity } from '../../../core/services/learning-progress.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto space-y-8">
      
      <!-- Welcome Header -->
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight">Tu Área de Trabajo</h1>
          <p class="text-slate-400 text-lg mt-2">Continuemos donde lo dejaste.</p>
        </div>
      </div>

      <!-- Continuar (Última Actividad) -->
      <div class="space-y-4" *ngIf="lastActivity() as last">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          ⚡ Continuar
        </h2>
        <div class="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shadow-inner">
              {{ getIconForType(last.type) }}
            </div>
            <div>
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{{ last.type }}</div>
              <h3 class="text-2xl font-bold text-white">{{ last.title }}</h3>
            </div>
          </div>
          <a [routerLink]="last.route" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shrink-0 whitespace-nowrap shadow-lg shadow-indigo-500/20">
            Retomar →
          </a>
        </div>
      </div>

      <!-- Historial Reciente -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2 mt-8">
          🕒 Actividad Reciente
        </h2>
        
        <div *ngIf="recentHistory().length === 0" class="text-slate-500 py-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800/50 border-dashed">
          Aún no hay actividad registrada. Explora la Academia para comenzar.
        </div>

        <div *ngIf="recentHistory().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a *ngFor="let activity of recentHistory() | slice:1:7" 
             [routerLink]="activity.route"
             class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
            
            <div class="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-xl shrink-0 border border-slate-800 group-hover:scale-110 transition-transform">
              {{ getIconForType(activity.type) }}
            </div>
            
            <div class="min-w-0">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{{ activity.type }}</div>
              <h4 class="text-white font-semibold text-sm truncate">{{ activity.title }}</h4>
              <p class="text-slate-500 text-xs mt-1">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  `
})
export class DashboardHomeComponent {
  private progressService = inject(LearningProgressService);

  // Filtramos la última actividad para que "Continuar" sugiera contenido real 
  // (clases, labs, recursos) y no el Dashboard u hojas de ruta genéricas.
  get lastActivity() {
    return () => {
      const history = this.progressService.getRecentHistory()();
      return history.find(a => 
        a.type !== 'DASHBOARD' && 
        !(a.type === 'ACADEMY' && (a.entityId === 'home' || a.entityId === 'roadmap' || a.entityId.includes('plan'))) &&
        !(a.type === 'LIBRARY' && a.entityId === 'library') &&
        !(a.type === 'LABS' && a.entityId === 'labs')
      ) || null;
    };
  }
  
  recentHistory = this.progressService.getRecentHistory();

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'ACADEMY': '🎓',
      'LIBRARY': '📚',
      'LABS': '🧪',
      'DASHBOARD': '🏠'
    };
    return icons[type] || '📄';
  }

  formatTime(timestamp: number): string {
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const diffDays = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.round((timestamp - Date.now()) / (1000 * 60));
        return rtf.format(diffMins, 'minute');
      }
      return rtf.format(diffHours, 'hour');
    }
    
    return rtf.format(diffDays, 'day');
  }
}
