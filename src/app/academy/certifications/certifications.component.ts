import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [ComingSoonComponent],
  template: '<app-coming-soon sectionName="Certificaciones"></app-coming-soon>'
})
export class CertificationsComponent {}
