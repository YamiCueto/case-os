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

        <!-- ACADEMY MODULES (Contextual / Navigation) -->
        <div class="border-t border-slate-800 bg-slate-950 mt-auto flex-shrink-0">
          <div *ngFor="let mod of modules" class="flex flex-col">
            <!-- Module Header (Clickable to expand/collapse if we wanted, but here we'll just show it or expand if active) -->
            <div class="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between group cursor-pointer">
              <p class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 truncate">{{ mod.title }}</p>
              <span class="text-slate-600 text-xs">{{ mod.lessons.length }} clases</span>
            </div>
            
            <!-- Lessons List (Always visible for now so user can navigate, or conditionally visible if we want it strictly contextual, but user wants to navigate to them) -->
            <!-- If the user wants to navigate to them, we should show them. Let's show the active module expanded, and if no module is active, maybe show the first one or all collapsed? -->
            <!-- Wait, the simplest is to always show the lessons of the modules, or just the active one? The user said "sigo sin poder ver las clases... para navegar a ellas". So they want to see them. Let's render them. -->
            <div class="space-y-0.5 p-2" [ngClass]="{'hidden': context()?.module?.id !== mod.id && context()?.module}">
              <a *ngFor="let lesson of mod.lessons"
                 [routerLink]="lesson.path"
                 routerLinkActive="bg-indigo-900/40 text-indigo-300"
                 class="flex items-center gap-3 px-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors text-xs font-medium relative group"
                 [title]="lesson.title">
                
                <span class="w-1.5 h-1.5 rounded-full shrink-0" 
                      [ngClass]="{
                        'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]': isCurrentLesson(lesson.id),
                        'bg-slate-700': !isCurrentLesson(lesson.id)
                      }"></span>
                
                <span class="truncate" [ngClass]="{'text-indigo-200': isCurrentLesson(lesson.id)}">{{ lesson.title }}</span>
              </a>
            </div>
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
  private courseService = inject(CourseService);
  
  context = this.navContext.getContext();
  modules = this.courseService.getModules();

  isCurrentLesson(lessonId: string): boolean {
    return this.context()?.currentLesson?.id === lessonId;
  }
}
