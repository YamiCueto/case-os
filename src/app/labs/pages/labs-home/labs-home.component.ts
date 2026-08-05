import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StaticLabRepository } from '../../../core/repositories/static-lab.repository';
import { LabDefinition } from '../../../core/models/lab.models';

@Component({
  selector: 'app-labs-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs-home.component.html'
})
export class LabsHomeComponent {
  private labRepo = inject(StaticLabRepository);
  private router = inject(Router);

  labs = computed(() => this.labRepo.getAll()());

  openLab(lab: LabDefinition) {
    this.router.navigate(['/labs', lab.slug]);
  }
}
