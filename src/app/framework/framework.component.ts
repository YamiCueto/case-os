import { Component } from '@angular/core';
import { ComingSoonComponent } from '../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-framework',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Framework CASE"></app-coming-soon>'
})
export class FrameworkComponent {}
