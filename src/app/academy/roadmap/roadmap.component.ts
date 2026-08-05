import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Roadmap de Carrera"></app-coming-soon>'
})
export class RoadmapComponent {}
