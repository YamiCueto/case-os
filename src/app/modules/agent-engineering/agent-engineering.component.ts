import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-agent-engineering',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Agent Engineering"></app-coming-soon>'
})
export class AgentEngineeringComponent {}
