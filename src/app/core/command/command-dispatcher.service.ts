import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Command } from './command.model';
import { OverlayManagerService } from './overlay-manager.service';

/**
 * CommandDispatcherService — Command Platform
 * 
 * Responsable de orquestar la ejecución real de un comando basándose en 
 * su definición declarativa (rutas, IDs, apertura de overlays).
 * El Registry nunca ejecuta lógica; delega al Dispatcher.
 */
@Injectable({
  providedIn: 'root'
})
export class CommandDispatcherService {
  private router = inject(Router);
  private overlayManager = inject(OverlayManagerService);

  execute(command: Command): void {
    if (command.enabled === false) {
      console.warn(`[CommandDispatcher] El comando ${command.id} está deshabilitado.`);
      return;
    }

    console.log(`[CommandDispatcher] Ejecutando comando: ${command.id}`);

    // Siempre cerramos la Command Palette al ejecutar una acción
    if (this.overlayManager.isCommandPaletteOpen()) {
      this.overlayManager.close('commandPalette');
    }

    // 1. Navegación
    if (command.route) {
      this.router.navigateByUrl(command.route);
      return;
    }

    // 2. Acciones del Sistema (Ej: toggleTheme, logout, etc) mapeadas por ID
    if (command.commandId) {
      this.handleSystemCommand(command.commandId);
      return;
    }

    console.warn(`[CommandDispatcher] El comando ${command.id} no definió route ni commandId operables.`);
  }

  private handleSystemCommand(commandId: string) {
    // Por ahora hay pocos comandos de sistema, pero aquí se enrutarán
    switch (commandId) {
      case 'system.toggleCommandPalette':
        this.overlayManager.toggle('commandPalette');
        break;
      // Añadir casos futuros aquí o emitir eventos a un EventBus
      default:
        console.warn(`[CommandDispatcher] No hay handler registrado para commandId: ${commandId}`);
    }
  }
}
