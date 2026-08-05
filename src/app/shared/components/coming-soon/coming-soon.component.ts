import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  templateUrl: './coming-soon.component.html'
})
export class ComingSoonComponent {
  @Input() sectionName: string = 'Esta sección';
  @Input() description: string = 'Estamos construyendo esta parte de la academia.';
}
