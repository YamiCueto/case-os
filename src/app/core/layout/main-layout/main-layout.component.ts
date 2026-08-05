import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-300 font-sans">
      
      <!-- Navegación Lateral -->
      <app-sidebar></app-sidebar>

      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-w-0">
        
        <!-- Header con Buscador Global -->
        <app-header></app-header>
        
        <!-- Vista Dinámica (Dashboard, Library, Labs) -->
        <main class="flex-1 overflow-y-auto custom-scrollbar relative">
          <router-outlet></router-outlet>
        </main>
        
      </div>
      
    </div>
  `
})
export class MainLayoutComponent {}
