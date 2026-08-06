import { Injectable, computed, inject, signal } from '@angular/core';
import { Command, CommandCategory } from './command.model';
import { CommandDispatcherService } from './command-dispatcher.service';

/**
 * CommandRegistryService — Command Platform
 * 
 * La única fuente de verdad para los comandos del sistema.
 * Es un Manifest (al igual que WorkspaceRegistry) y nunca ejecuta lógica.
 */
@Injectable({
  providedIn: 'root'
})
export class CommandRegistryService {
  private dispatcher = inject(CommandDispatcherService);
  
  // Usamos un signal para mantener la lista global de comandos.
  private registry = signal<Command[]>([]);

  // Selectores tipados por categoría
  readonly commands = computed(() => this.registry());
  readonly navigationCommands = computed(() => this.registry().filter(c => c.category === CommandCategory.Navigation));
  readonly workspaceCommands = computed(() => this.registry().filter(c => c.category === CommandCategory.Workspace));
  readonly systemCommands = computed(() => this.registry().filter(c => c.category === CommandCategory.System));

  constructor() {
    this.registerCoreCommands();
  }

  /**
   * Registra uno o múltiples comandos en la plataforma.
   */
  register(commands: Command | Command[]) {
    const toAdd = Array.isArray(commands) ? commands : [commands];
    this.registry.update(current => {
      // Evitar duplicados por ID
      const newCommands = toAdd.filter(c => !current.some(existing => existing.id === c.id));
      return [...current, ...newCommands];
    });
  }

  /**
   * Elimina un comando del registry (útil cuando se desmonta un workspace).
   */
  unregister(id: string) {
    this.registry.update(current => current.filter(c => c.id !== id));
  }

  /**
   * Búsqueda agnóstica de comandos (preparado para la Command Palette).
   */
  search(query: string): Command[] {
    if (!query) return this.registry();
    
    const lowerQuery = query.toLowerCase();
    return this.registry().filter(c => {
      if (c.label.toLowerCase().includes(lowerQuery)) return true;
      if (c.description?.toLowerCase().includes(lowerQuery)) return true;
      if (c.keywords?.some(k => k.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }

  /**
   * Delega la ejecución del comando al Dispatcher.
   */
  execute(id: string) {
    const command = this.registry().find(c => c.id === id);
    if (command) {
      this.dispatcher.execute(command);
    } else {
      console.warn(`[CommandRegistry] Comando no encontrado: ${id}`);
    }
  }

  // --- Bootstrapping Inicial ---
  private registerCoreCommands() {
    this.register([
      {
        id: 'nav.dashboard',
        label: 'Ir al Workspace',
        icon: 'grid_view',
        category: CommandCategory.Navigation,
        route: '/dashboard',
        keywords: ['home', 'inicio', 'desktop']
      },
      {
        id: 'nav.academy',
        label: 'Ir a Academy',
        icon: 'school',
        category: CommandCategory.Navigation,
        route: '/academy/home',
        keywords: ['curso', 'aprender', 'clases']
      },
      {
        id: 'system.commandPalette',
        label: 'Abrir Command Palette',
        category: CommandCategory.System,
        commandId: 'system.toggleCommandPalette',
        shortcut: ['ctrl', 'k']
      }
    ]);
  }
}
