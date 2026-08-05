import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-context-engineering',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Context Engineering"></app-coming-soon>'
})
export class ContextEngineeringComponent {}
