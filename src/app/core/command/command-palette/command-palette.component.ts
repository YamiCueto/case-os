import { Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayManagerService } from '../overlay-manager.service';
import { CommandRegistryService } from '../command-registry.service';
import { CommandDispatcherService } from '../command-dispatcher.service';

/**
 * CommandPaletteComponent — Command Platform
 * 
 * Interfaz de búsqueda y ejecución rápida de comandos. 
 * Componente "tonto": no conoce lógica de negocio. Depende puramente 
 * de la triada Registry/Dispatcher/OverlayManager.
 */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop desenfocado -->
      <div class="case-palette-backdrop" (click)="close()"></div>
      
      <!-- Contenedor Modal -->
      <div class="case-palette-modal" role="dialog" aria-modal="true" aria-label="Command Palette">
        
        <!-- Search Input Header -->
        <div class="case-palette-header">
          <span class="material-symbols-outlined case-palette-search-icon" aria-hidden="true">search</span>
          <input 
            #searchInput
            type="text" 
            class="case-palette-input"
            placeholder="Buscar comandos..."
            [value]="query()"
            (input)="onInput($event)"
            (keydown)="onKeydown($event)"
            autocomplete="off"
            spellcheck="false"
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            [attr.aria-activedescendant]="activeDescendantId()"
          />
        </div>

        <!-- Resultados -->
        <div class="case-palette-content">
          @if (results().length > 0) {
            <ul id="command-palette-listbox" class="case-palette-list" role="listbox">
              
              @for (cmd of results(); track cmd.id; let idx = $index) {
                <li 
                  [id]="'cmd-option-' + idx"
                  class="case-palette-item"
                  [class.is-selected]="idx === selectedIndex()"
                  role="option"
                  [attr.aria-selected]="idx === selectedIndex()"
                  (click)="execute(idx)"
                  (mouseenter)="selectedIndex.set(idx)"
                >
                  
                  <div class="case-palette-item__icon-wrapper">
                    <span class="material-symbols-outlined" aria-hidden="true">
                      {{ cmd.icon || 'terminal' }}
                    </span>
                  </div>
                  
                  <div class="case-palette-item__content">
                    <span class="case-palette-item__label">{{ cmd.label }}</span>
                    @if (cmd.description) {
                      <span class="case-palette-item__desc">{{ cmd.description }}</span>
                    }
                  </div>
                  
                  <!-- Atajos (si tiene) -->
                  @if (cmd.shortcut && cmd.shortcut.length > 0) {
                    <div class="case-palette-item__shortcut">
                      @for (key of cmd.shortcut; track key) {
                        <kbd class="case-kbd">{{ key === 'ctrl' ? '⌘' : key }}</kbd>
                      }
                    </div>
                  } @else {
                    <div class="case-palette-item__category">
                      {{ cmd.category || 'Command' }}
                    </div>
                  }
                </li>
              }
              
            </ul>
          } @else {
            <!-- Empty State -->
            <div class="case-palette-empty">
              <span class="material-symbols-outlined case-palette-empty-icon" aria-hidden="true">search_off</span>
              <p>No se encontraron comandos para "{{ query() }}"</p>
            </div>
          }
        </div>

        <!-- Footer / Shortcuts -->
        <div class="case-palette-footer">
          <div class="case-palette-hints">
            <span class="case-palette-hint"><kbd class="case-kbd">↑</kbd><kbd class="case-kbd">↓</kbd> navegar</span>
            <span class="case-palette-hint"><kbd class="case-kbd">↵</kbd> ejecutar</span>
            <span class="case-palette-hint"><kbd class="case-kbd">esc</kbd> cerrar</span>
          </div>
        </div>
        
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Backdrop desenfocado */
    .case-palette-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--case-surface-backdrop);
      backdrop-filter: blur(4px);
      z-index: 100;
      animation: case-fade-in var(--case-duration-fast) var(--case-ease-out) both;
    }

    /* Modal Principal */
    .case-palette-modal {
      position: fixed;
      top: 15vh; /* Se asoma desde la parte superior 15% */
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 720px; /* Topado a 720px como VS Code */
      background-color: var(--case-surface-1);
      border: var(--case-border-width) solid var(--case-border);
      border-radius: var(--case-radius-lg);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--case-border-strong);
      z-index: 101;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: case-scale-in var(--case-duration-fast) var(--case-ease-out) both;
    }

    /* Header Input */
    .case-palette-header {
      display: flex;
      align-items: center;
      padding: 0 var(--case-space-4);
      border-bottom: var(--case-border-width) solid var(--case-border);
      background-color: var(--case-surface-1);
    }

    .case-palette-search-icon {
      color: var(--case-text-muted);
      font-size: var(--case-icon-md);
      margin-right: var(--case-space-3);
    }

    .case-palette-input {
      flex: 1;
      height: 56px;
      background: transparent;
      border: none;
      color: var(--case-text-primary);
      font-family: var(--case-font-sans);
      font-size: var(--case-text-lg);
      outline: none;
    }
    .case-palette-input::placeholder {
      color: var(--case-text-disabled);
    }

    /* Content Area */
    .case-palette-content {
      max-height: 50vh; /* Altura máxima con virtualización (scroll) */
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--case-border-strong) transparent;
    }
    .case-palette-content::-webkit-scrollbar { width: 6px; }
    .case-palette-content::-webkit-scrollbar-track { background: transparent; }
    .case-palette-content::-webkit-scrollbar-thumb {
      background: var(--case-border-strong);
      border-radius: var(--case-radius-pill);
    }

    /* List */
    .case-palette-list {
      list-style: none;
      padding: var(--case-space-2);
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    /* List Item */
    .case-palette-item {
      display: flex;
      align-items: center;
      gap: var(--case-space-3);
      padding: var(--case-space-3);
      border-radius: var(--case-radius);
      cursor: pointer;
      border-left: 2px solid transparent;
      transition: background-color var(--case-transition-fast);
    }

    /* Hover & Selected (Keyboard) State */
    .case-palette-item:hover,
    .case-palette-item.is-selected {
      background-color: var(--case-surface-2);
    }
    
    .case-palette-item.is-selected {
      border-left-color: var(--case-accent);
    }

    .case-palette-item__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: var(--case-text-secondary);
    }

    .case-palette-item__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .case-palette-item__label {
      font-family: var(--case-font-sans);
      font-size: var(--case-text-sm);
      font-weight: var(--case-weight-medium);
      color: var(--case-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .case-palette-item__desc {
      font-family: var(--case-font-sans);
      font-size: 11px;
      color: var(--case-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .case-palette-item__category {
      font-family: var(--case-font-mono);
      font-size: 10px;
      color: var(--case-text-disabled);
      text-transform: uppercase;
      letter-spacing: var(--case-tracking-wide);
    }

    .case-palette-item__shortcut {
      display: flex;
      gap: 4px;
    }

    /* KBD tokens */
    .case-kbd {
      font-family: var(--case-font-mono);
      font-size: 10px;
      padding: 2px 4px;
      border-radius: 4px;
      background-color: var(--case-surface-3);
      color: var(--case-text-secondary);
      border: 1px solid var(--case-border-strong);
      box-shadow: 0 1px 0 rgba(0,0,0,0.2);
    }

    /* Empty State */
    .case-palette-empty {
      padding: var(--case-space-8) var(--case-space-4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--case-text-muted);
      font-family: var(--case-font-sans);
    }
    .case-palette-empty-icon {
      font-size: 48px;
      margin-bottom: var(--case-space-3);
      opacity: 0.5;
    }

    /* Footer */
    .case-palette-footer {
      padding: var(--case-space-2) var(--case-space-4);
      background-color: var(--case-surface-0);
      border-top: var(--case-border-width) solid var(--case-border);
      display: flex;
      justify-content: flex-end;
    }

    .case-palette-hints {
      display: flex;
      gap: var(--case-space-4);
    }

    .case-palette-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: var(--case-font-sans);
      font-size: 11px;
      color: var(--case-text-muted);
    }
  `]
})
export class CommandPaletteComponent {
  private overlayManager = inject(OverlayManagerService);
  private registry = inject(CommandRegistryService);
  private dispatcher = inject(CommandDispatcherService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Estado Reactivo Local
  readonly isOpen = computed(() => this.overlayManager.isCommandPaletteOpen());
  readonly query = signal('');
  readonly selectedIndex = signal(0);

  // Computado de resultados directo del Registry sin filtros manuales locales
  readonly results = computed(() => {
    return this.registry.search(this.query());
  });

  readonly activeDescendantId = computed(() => {
    return this.results().length > 0 ? `cmd-option-${this.selectedIndex()}` : null;
  });

  constructor() {
    // Effect: resetear query y enfocar input al abrir
    effect(() => {
      if (this.isOpen()) {
        this.query.set('');
        this.selectedIndex.set(0);
        // Focus diferido para asegurar que está en el DOM
        setTimeout(() => {
          this.searchInput?.nativeElement.focus();
        });
      }
    });

    // Effect: asegurar que selectedIndex se mantenga dentro del límite de los resultados (cuando se acorta la lista)
    effect(() => {
      const resultsCount = this.results().length;
      if (resultsCount === 0) {
        this.selectedIndex.set(-1);
      } else if (this.selectedIndex() >= resultsCount) {
        this.selectedIndex.set(resultsCount - 1);
      }
    });
  }

  // --- Handlers ---

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
    // Reiniciar selección al inicio en cada nueva búsqueda
    this.selectedIndex.set(0); 
  }

  onKeydown(event: KeyboardEvent) {
    const count = this.results().length;
    if (count === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update(i => (i + 1) % count);
      this.scrollToSelected();
    } 
    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update(i => (i - 1 + count) % count);
      this.scrollToSelected();
    }
    else if (event.key === 'Enter') {
      event.preventDefault();
      this.execute(this.selectedIndex());
    }
  }

  execute(index: number) {
    if (index >= 0 && index < this.results().length) {
      const command = this.results()[index];
      // DELEGACIÓN PURA: Solo llamar al dispatcher
      this.dispatcher.execute(command);
    }
  }

  close() {
    this.overlayManager.close('commandPalette');
  }

  // --- Utils ---

  private scrollToSelected() {
    setTimeout(() => {
      const selectedEl = document.getElementById(`cmd-option-${this.selectedIndex()}`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }
}
