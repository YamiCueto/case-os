import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutStateService {
  // Inicialmente cerrado en móviles (<= 768px), abierto en Desktop
  readonly sidebarOpen = signal<boolean>(
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
