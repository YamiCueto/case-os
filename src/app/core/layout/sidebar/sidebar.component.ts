import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationContextService } from '../../services/navigation-context.service';
import { CourseService } from '../../services/course.service';
import { UserStatsService } from '../../services/user-stats.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <span class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          CASE Academy
        </span>
      </div>
      
      <nav class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <!-- GLOBAL NAVIGATION -->
        <div class="p-4 space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">🏠</span> Dashboard
          </a>

          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Academy</p>
          </div>
          <a routerLink="/academy/home" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">🎓</span> Home
          </a>
          <a routerLink="/academy/roadmap" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">🗺️</span> Roadmap
          </a>
          <a routerLink="/plan-dev-detallado" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">📚</span> Temario Detallado
          </a>

          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Recursos</p>
          </div>
          <a routerLink="/library" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">📚</span> CASE Library
          </a>
          <a routerLink="/labs" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm">
            <span class="text-lg">🧪</span> CASE Labs
          </a>
          
          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-600">Próximamente</p>
          </div>
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm">
            <span class="text-lg opacity-50">🤖</span> Agents
          </a>
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm">
            <span class="text-lg opacity-50">🧩</span> Framework
          </a>
        </div>

        <!-- CONTEXTUAL NAVIGATION (Only visible if inside a module/lesson) -->
        <div *ngIf="context()?.module as activeModule" class="border-t border-slate-800 p-4 bg-slate-950 mt-auto">
          <p class="px-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">{{ activeModule.title }}</p>
          <div class="space-y-1">
            <a *ngFor="let lesson of activeModule.lessons"
               [routerLink]="lesson.path"
               routerLinkActive="bg-indigo-900/40 text-indigo-300"
               class="flex items-center gap-3 px-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors text-xs font-medium relative group"
               [title]="lesson.title">
              
              <!-- Indicator of completion/current -->
              <span class="w-1.5 h-1.5 rounded-full shrink-0" 
                    [ngClass]="{
                      'bg-indigo-500': isCurrentLesson(lesson.id),
                      'bg-slate-600': !isCurrentLesson(lesson.id)
                    }"></span>
              
              <span class="truncate">{{ lesson.title }}</span>
            </a>
          </div>
        </div>

      </nav>

      <div class="p-4 border-t border-slate-800 shrink-0">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            US
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-slate-200">User</span>
            <span class="text-xs text-slate-500">Free Tier</span>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private navContext = inject(NavigationContextService);
  context = this.navContext.getContext();

  isCurrentLesson(lessonId: string): boolean {
    return this.context()?.currentLesson?.id === lessonId;
  }
}
