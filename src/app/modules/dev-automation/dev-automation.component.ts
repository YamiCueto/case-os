import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-dev-automation',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Dev Automation"></app-coming-soon>'
})
export class DevAutomationComponent {}
