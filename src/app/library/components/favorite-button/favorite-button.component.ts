import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggle()"
      class="p-2 rounded-full transition-colors flex items-center justify-center hover:bg-slate-800"
      [title]="isFav() ? 'Quitar de favoritos' : 'Añadir a favoritos'"
    >
      <span class="text-xl" [class.opacity-40]="!isFav()" [class.grayscale]="!isFav()">⭐</span>
    </button>
  `
})
export class FavoriteButtonComponent {
  @Input({ required: true }) resourceId!: string;
  private prefs = inject(UserPreferencesService);

  isFav = computed(() => this.prefs.getFavorites()().has(this.resourceId));

  toggle() {
    this.prefs.toggleFavorite(this.resourceId);
  }
}
