import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationContextService } from '../../services/navigation-context.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  private navContext = inject(NavigationContextService);
  context = this.navContext.getContext();
}
