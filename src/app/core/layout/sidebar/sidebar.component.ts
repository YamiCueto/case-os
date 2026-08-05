import { Component, inject, signal } from '@angular/core';
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
    <aside class="h-screen bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300"
           [ngClass]="isCollapsed() ? 'w-20' : 'w-64'">
      
      <!-- HEADER & TOGGLE -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <span *ngIf="!isCollapsed()" class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 px-2 truncate">
          CASE Academy
        </span>
        <span *ngIf="isCollapsed()" class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 px-2">
          C
        </span>
        
        <button (click)="toggleCollapse()" class="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 transition-colors" title="Colapsar menú">
          <!-- Ícono de hamburguesa o flechas -->
          <svg *ngIf="!isCollapsed()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <svg *ngIf="isCollapsed()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <nav class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
        <!-- GLOBAL NAVIGATION -->
        <div class="p-4 space-y-1">
          
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'Dashboard' : ''">
            <span class="text-lg">🏠</span> 
            <span *ngIf="!isCollapsed()">Dashboard</span>
          </a>

          <div class="pt-4 pb-1" *ngIf="!isCollapsed()">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Academy</p>
          </div>
          
          <a routerLink="/academy/home" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'Home' : ''">
            <span class="text-lg">🎓</span> 
            <span *ngIf="!isCollapsed()">Home</span>
          </a>
          
          <a routerLink="/academy/roadmap" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'Roadmap' : ''">
            <span class="text-lg">🗺️</span> 
            <span *ngIf="!isCollapsed()">Roadmap</span>
          </a>
          
          <a routerLink="/plan-dev-detallado" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'Temario Detallado' : ''">
            <span class="text-lg">📚</span> 
            <span *ngIf="!isCollapsed()">Temario Detallado</span>
          </a>

          <div class="pt-4 pb-1" *ngIf="!isCollapsed()">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Recursos</p>
          </div>
          
          <a routerLink="/library" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'CASE Library' : ''">
            <span class="text-lg">📚</span> 
            <span *ngIf="!isCollapsed()">CASE Library</span>
          </a>
          
          <a routerLink="/labs" routerLinkActive="bg-indigo-900/40 text-indigo-300 border-indigo-500/50" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent transition-colors font-medium text-sm group"
             [title]="isCollapsed() ? 'CASE Labs' : ''">
            <span class="text-lg">🧪</span> 
            <span *ngIf="!isCollapsed()">CASE Labs</span>
          </a>
          
          <div class="pt-4 pb-1" *ngIf="!isCollapsed()">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-600 truncate">Próximamente</p>
          </div>
          
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm group"
             [title]="isCollapsed() ? 'Agents' : ''">
            <span class="text-lg opacity-50">🤖</span> 
            <span *ngIf="!isCollapsed()">Agents</span>
          </a>
          
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm group"
             [title]="isCollapsed() ? 'Framework' : ''">
            <span class="text-lg opacity-50">🧩</span> 
            <span *ngIf="!isCollapsed()">Framework</span>
          </a>
        </div>

        <!-- ACADEMY MODULES (Contextual / Navigation) -->
        <div class="border-t border-slate-800 bg-slate-950 mt-auto flex-shrink-0" *ngIf="!isCollapsed()">
          <div *ngFor="let mod of modules" class="flex flex-col">
            <div class="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between group cursor-pointer">
              <p class="text-[11px] font-bold uppercase tracking-wider text-indigo-400 truncate">{{ mod.title }}</p>
              <span class="text-slate-600 text-xs">{{ mod.lessons.length }}</span>
            </div>
            
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
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
            US
          </div>
          <div class="flex flex-col min-w-0" *ngIf="!isCollapsed()">
            <span class="text-sm font-bold text-slate-200 truncate">User</span>
            <span class="text-xs text-slate-500 truncate">Free Tier</span>
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
  
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  isCurrentLesson(lessonId: string): boolean {
    return this.context()?.currentLesson?.id === lessonId;
  }
}
