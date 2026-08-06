import { Injectable, inject, OnDestroy } from '@angular/core';
import { CommandRegistryService } from './command-registry.service';
import { OverlayManagerService } from './overlay-manager.service';
import { fromEvent, Subscription, filter } from 'rxjs';

/**
 * ShortcutService — Command Platform
 * 
 * Se encarga única y exclusivamente de capturar combinaciones de teclas 
 * a nivel de documento y delegar su resolución al Registry.
 * NO ejecuta acciones de enrutamiento ni lógica de dominio directamente.
 */
@Injectable({
  providedIn: 'root'
})
export class ShortcutService implements OnDestroy {
  private registry = inject(CommandRegistryService);
  private overlayManager = inject(OverlayManagerService);
  private subscription = new Subscription();

  constructor() {
    this.listenToKeyboard();
  }

  private listenToKeyboard() {
    // Escuchar el evento keydown globalmente
    this.subscription.add(
      fromEvent<KeyboardEvent>(document, 'keydown').subscribe(event => {
        this.handleKeyboardEvent(event);
      })
    );
  }

  private handleKeyboardEvent(event: KeyboardEvent) {
    // Si estamos en un input y no es una tecla de control combinada, ignorar
    if (this.isFocusingInput(event) && !event.ctrlKey && !event.metaKey && event.key !== 'Escape') {
      return;
    }

    // Caso especial: Escape para cerrar overlays activos.
    if (event.key === 'Escape') {
      if (this.overlayManager.isCommandPaletteOpen()) {
        this.overlayManager.close('commandPalette');
        event.preventDefault();
        return;
      }
      // Expandible a Dialogs, Drawers, etc.
    }

    const pressedShortcut = this.extractShortcut(event);
    if (!pressedShortcut.length) return;

    // Buscar en el Registry un comando que tenga este atajo exacto
    const match = this.registry.commands().find(c => {
      if (!c.shortcut) return false;
      return this.shortcutsMatch(c.shortcut, pressedShortcut);
    });

    if (match) {
      event.preventDefault();
      this.registry.execute(match.id);
    }
  }

  private isFocusingInput(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return target.tagName === 'INPUT' || 
           target.tagName === 'TEXTAREA' || 
           target.isContentEditable;
  }

  private extractShortcut(event: KeyboardEvent): string[] {
    const keys: string[] = [];
    if (event.ctrlKey || event.metaKey) keys.push('ctrl'); // unificamos ctrl y meta (mac)
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    
    // Evitar meter modificadores sueltos
    if (event.key !== 'Control' && event.key !== 'Meta' && event.key !== 'Shift' && event.key !== 'Alt') {
      keys.push(event.key.toLowerCase());
    }
    
    return keys;
  }

  private shortcutsMatch(defined: string[], pressed: string[]): boolean {
    if (defined.length !== pressed.length) return false;
    
    // Normalizar para comparación (ej. meta === ctrl)
    const normalize = (key: string) => key === 'meta' ? 'ctrl' : key.toLowerCase();
    
    const dNorm = defined.map(normalize).sort();
    const pNorm = pressed.map(normalize).sort();
    
    return dNorm.every((val, index) => val === pNorm[index]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
