import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationContextService } from './core/services/navigation-context.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // NavigationContextService se inyecta a nivel raíz para que comience a escuchar eventos del router
  // de forma temprana, aunque el layout principal es ultra-liviano.
  private navContextService = inject(NavigationContextService);
}
