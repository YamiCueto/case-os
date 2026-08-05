import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationContextService } from '../../services/navigation-context.service';

@Component({
  selector: 'app-class-metadata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-metadata.component.html'
})
export class ClassMetadataComponent {
  private navContext = inject(NavigationContextService);
  context = this.navContext.getContext();
}
