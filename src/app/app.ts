import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MobileHeaderComponent } from './core/layout/mobile-header/mobile-header.component';
import { BreadcrumbComponent } from './core/layout/breadcrumb/breadcrumb.component';
import { ClassMetadataComponent } from './core/layout/class-metadata/class-metadata.component';
import { ClassNavigationComponent } from './core/layout/class-navigation/class-navigation.component';
import { NavigationContextService } from './core/services/navigation-context.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, CommonModule,
    SidebarComponent, MobileHeaderComponent, BreadcrumbComponent,
    ClassMetadataComponent, ClassNavigationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // NavigationContextService se inyecta a nivel raíz para que comience a escuchar eventos del router
  // de forma temprana, aunque el layout principal es ultra-liviano.
  private navContextService = inject(NavigationContextService);
}
