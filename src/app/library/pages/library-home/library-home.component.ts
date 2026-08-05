import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { KnowledgeResource, KnowledgeFilter, KnowledgeType, KnowledgeDifficulty } from '../../../core/models/knowledge.models';
import { LibraryFiltersComponent, ActiveFilters } from '../../components/library-filters/library-filters.component';
import { LibrarySearchComponent } from '../../components/library-search/library-search.component';
import { ResourceCardComponent } from '../../components/resource-card/resource-card.component';

@Component({
  selector: 'app-library-home',
  standalone: true,
  imports: [
    CommonModule,
    LibraryFiltersComponent,
    LibrarySearchComponent,
    ResourceCardComponent
  ],
  templateUrl: './library-home.component.html'
})
export class LibraryHomeComponent {
  private libraryService = inject(LibraryService);
  private router = inject(Router);

  private currentFilter = signal<KnowledgeFilter>({});

  resources = computed(() => {
    return this.libraryService.filter(this.currentFilter());
  });

  onSearch(term: string) {
    this.currentFilter.update(f => ({ ...f, searchTerm: term }));
  }

  onFilterChange(filters: ActiveFilters) {
    this.currentFilter.update(f => ({
      ...f,
      type: filters.types as KnowledgeType[],
      difficulty: filters.difficulties as KnowledgeDifficulty[]
    }));
  }

  openDetail(resource: KnowledgeResource) {
    this.router.navigate(['/library', resource.slug]);
  }
}
