import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { KnowledgeResource } from '../../../core/models/knowledge.models';
import { MarkdownViewerComponent } from '../../components/markdown-viewer/markdown-viewer.component';
import { FavoriteButtonComponent } from '../../components/favorite-button/favorite-button.component';

@Component({
  selector: 'app-resource-detail-page',
  standalone: true,
  imports: [CommonModule, MarkdownViewerComponent, FavoriteButtonComponent],
  templateUrl: './resource-detail.component.html'
})
export class ResourceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private libraryService = inject(LibraryService);

  resource = signal<KnowledgeResource | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const found = this.libraryService.getBySlug(slug);
        if (found) {
          this.resource.set(found);
        } else {
          this.router.navigate(['/library']);
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/library']);
  }

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'PROMPT': '💬',
      'ARCHITECTURE': '🏗️',
      'CHECKLIST': '✅',
      'TEMPLATE': '📄',
      'AGENT': '🤖',
      'CONTEXT': '🧠',
      'CONCEPT': '📖'
    };
    return icons[type] || '📄';
  }

  getRelatedResources(relatedIds?: string[]): KnowledgeResource[] {
    if (!relatedIds || relatedIds.length === 0) return [];
    return relatedIds
      .map(id => this.libraryService.getById(id))
      .filter((r): r is KnowledgeResource => r !== undefined);
  }

  navigateToResource(res: KnowledgeResource) {
    if (res.type === 'CONCEPT') {
      this.router.navigate(['/library/glossary'], { queryParams: { term: res.slug } });
    } else {
      this.router.navigate(['/library', res.slug]);
    }
  }

  navigateToAcademy(route?: string) {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }
}
