import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationContextService } from '../../services/navigation-context.service';

@Component({
  selector: 'app-class-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './class-navigation.component.html'
})
export class ClassNavigationComponent {
  private navContext = inject(NavigationContextService);
  context = this.navContext.getContext();
}
