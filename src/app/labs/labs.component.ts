import { Component } from '@angular/core';
import { ComingSoonComponent } from '../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="CASE Labs"></app-coming-soon>'
})
export class LabsComponent {}
