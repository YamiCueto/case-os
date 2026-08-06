import { Injectable, signal } from '@angular/core';

export type OverlayType = 'commandPalette' | 'dialog' | 'drawer' | 'inspector' | 'quickView' | 'aiChat';

/**
 * OverlayManagerService — Command Platform
 * 
 * Abstracción genérica para gestionar el estado de ventanas superpuestas (overlays).
 * Evita que la plataforma nazca acoplada únicamente a la Command Palette.
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayManagerService {
  
  // Estado genérico para overlays activos. Clave: tipo de overlay, Valor: si está abierto.
  private overlays = signal<Record<OverlayType, boolean>>({
    commandPalette: false,
    dialog: false,
    drawer: false,
    inspector: false,
    quickView: false,
    aiChat: false
  });

  constructor() {}

  isOpen(type: OverlayType): boolean {
    return this.overlays()[type];
  }

  open(type: OverlayType): void {
    this.overlays.update(state => ({ ...state, [type]: true }));
  }

  close(type: OverlayType): void {
    this.overlays.update(state => ({ ...state, [type]: false }));
  }

  toggle(type: OverlayType): void {
    this.overlays.update(state => ({ ...state, [type]: !state[type] }));
  }

  closeAll(): void {
    this.overlays.set({
      commandPalette: false,
      dialog: false,
      drawer: false,
      inspector: false,
      quickView: false,
      aiChat: false
    });
  }

  // Helper específico para Command Palette dado su uso frecuente
  isCommandPaletteOpen() {
    return this.isOpen('commandPalette');
  }

  toggleCommandPalette() {
    this.toggle('commandPalette');
  }
}
