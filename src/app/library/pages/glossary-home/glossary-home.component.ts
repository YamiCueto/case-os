import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LibraryService } from '../../services/library.service';
import { KnowledgeResource } from '../../../core/models/knowledge.models';
import { MarkdownViewerComponent } from '../../components/markdown-viewer/markdown-viewer.component';

export interface ModuleFilterOption {
  id: string;
  label: string;
  shortLabel: string;
}

@Component({
  selector: 'app-glossary-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownViewerComponent],
  templateUrl: './glossary-home.component.html'
})
export class GlossaryHomeComponent implements OnInit, OnDestroy {
  private libraryService = inject(LibraryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchTerm = signal<string>('');
  selectedModule = signal<string>('ALL');
  expandedTermId = signal<string | null>(null);

  private searchSubject = new Subject<string>();
  private sub = new Subscription();

  moduleOptions: ModuleFilterOption[] = [
    { id: 'ALL', label: 'Todos los Módulos', shortLabel: 'Todos' },
    { id: 'm1', label: 'M01 · Fundamentos', shortLabel: 'M01' },
    { id: 'm2', label: 'M02 · Prompts', shortLabel: 'M02' },
    { id: 'm3', label: 'M03 · Contexto', shortLabel: 'M03' },
    { id: 'm4', label: 'M04 · Retrieval & RAG', shortLabel: 'M04' },
    { id: 'm5', label: 'M05 · Agentes de IA', shortLabel: 'M05' }
  ];

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Términos filtrados reactivamente
  filteredTerms = computed(() => {
    return this.libraryService.getGlossaryTerms({
      searchTerm: this.searchTerm(),
      moduleId: this.selectedModule()
    });
  });

  // Agrupamiento por letra inicial para navegación A–Z
  groupedTerms = computed(() => {
    const terms = this.filteredTerms();
    const groups = new Map<string, KnowledgeResource[]>();

    for (const term of terms) {
      const titleStr = typeof term.title === 'string' ? term.title : (term.title?.['es'] || '');
      const firstChar = titleStr.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups.has(letter)) {
        groups.set(letter, []);
      }
      groups.get(letter)!.push(term);
    }

    return groups;
  });

  // Conjunto de letras activas para estilizar la barra A–Z
  activeLetters = computed(() => {
    return new Set(this.groupedTerms().keys());
  });

  ngOnInit() {
    // Debounce de búsqueda reactiva
    this.sub.add(
      this.searchSubject.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(term => {
        this.searchTerm.set(term);
      })
    );

    // Detección de parámetros de consulta iniciales
    this.sub.add(
      this.route.queryParamMap.subscribe(params => {
        const query = params.get('q');
        if (query) {
          this.searchTerm.set(query);
        }

        const mod = params.get('module');
        if (mod && this.moduleOptions.some(m => m.id === mod)) {
          this.selectedModule.set(mod);
        }

        const termSlug = params.get('term');
        if (termSlug) {
          setTimeout(() => {
            this.scrollToTerm(termSlug);
          }, 300);
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSearchInput(val: string) {
    this.searchSubject.next(val);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.selectedModule.set('ALL');
  }

  selectModule(moduleId: string) {
    this.selectedModule.set(moduleId);
  }

  toggleExpand(termId: string) {
    this.expandedTermId.update(current => (current === termId ? null : termId));
  }

  /**
   * Navegación segura compatible con Angular HashLocationStrategy.
   * NO muta window.location.hash para evitar que Angular interprete la letra como una ruta.
   */
  scrollToLetter(letter: string) {
    if (!this.activeLetters().has(letter)) return;
    const targetElement = document.getElementById(`letter-${letter}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTerm(termSlug: string) {
    const term = this.filteredTerms().find(t => t.slug === termSlug || t.id === termSlug);
    if (term) {
      this.expandedTermId.set(term.id);
      const targetElement = document.getElementById(`term-${term.slug}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  navigateToAcademy(academyRoute?: string) {
    if (academyRoute) {
      this.router.navigateByUrl(academyRoute);
    }
  }

  navigateToLibrary() {
    this.router.navigate(['/library']);
  }

  getRelatedTerms(relatedIds?: string[]): KnowledgeResource[] {
    if (!relatedIds || relatedIds.length === 0) return [];
    return relatedIds
      .map(id => this.libraryService.getById(id))
      .filter((res): res is KnowledgeResource => res !== undefined && res.type === 'CONCEPT');
  }

  selectRelatedTerm(term: KnowledgeResource) {
    const titleStr = typeof term.title === 'string' ? term.title : (term.title?.['es'] || '');
    this.searchTerm.set(titleStr);
    this.expandedTermId.set(term.id);
  }
}
