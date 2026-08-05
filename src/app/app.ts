import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationContextService } from './core/services/navigation-context.service';
import { LearningProgressService } from './core/services/learning-progress.service';

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
  // Inicialización de servicios core de monitoreo de rutas
  private navContextService = inject(NavigationContextService);
  private learningProgress = inject(LearningProgressService);
}
