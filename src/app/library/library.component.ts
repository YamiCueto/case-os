import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryService } from './services/library.service';
import { Resource, ResourceFilter, ResourceType, ResourceDifficulty } from '../core/models/resource.models';
import { LibraryFiltersComponent, ActiveFilters } from './components/library-filters/library-filters.component';
import { LibrarySearchComponent } from './components/library-search/library-search.component';
import { ResourceCardComponent } from './components/resource-card/resource-card.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    LibraryFiltersComponent,
    LibrarySearchComponent,
    ResourceCardComponent,
    ResourceDetailComponent
  ],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private libraryService = inject(LibraryService);

  // Filtros activos
  private currentFilter = signal<ResourceFilter>({});

  // Recursos derivados reactivamente de los filtros activos
  resources = computed(() => {
    return this.libraryService.filter(this.currentFilter());
  });

  // Estado del modal de detalle
  selectedResource = signal<Resource | null>(null);

  onSearch(term: string) {
    this.currentFilter.update(f => ({ ...f, searchTerm: term }));
  }

  onFilterChange(filters: ActiveFilters) {
    this.currentFilter.update(f => ({
      ...f,
      type: filters.types as ResourceType[],
      difficulty: filters.difficulties as ResourceDifficulty[]
    }));
  }

  openDetail(resource: Resource) {
    this.selectedResource.set(resource);
  }

  closeDetail() {
    this.selectedResource.set(null);
  }
}
