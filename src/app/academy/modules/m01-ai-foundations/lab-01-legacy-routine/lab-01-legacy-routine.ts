import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RoutineElement {
  id: string;
  label: string;
  classification: 'PENDING' | 'DETERMINISTIC' | 'PROBABILISTIC';
}

@Component({
  selector: 'app-lab-01-legacy-routine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lab-01-legacy-routine.html',
  styleUrls: ['./lab-01-legacy-routine.css', '../../../../shared-presentation.css']
})
export class Lab01LegacyRoutine {
  // Interaction state for the mental classification process
  elements = signal<RoutineElement[]>([
    { id: 'e1', label: 'Cálculo de impuestos locales', classification: 'PENDING' },
    { id: 'e2', label: 'Extracción de datos del PDF adjunto', classification: 'PENDING' },
    { id: 'e3', label: 'Validación de saldo en cuenta', classification: 'PENDING' },
    { id: 'e4', label: 'Categorización del motivo del gasto', classification: 'PENDING' }
  ]);

  classify(id: string, type: 'DETERMINISTIC' | 'PROBABILISTIC') {
    this.elements.update(items => 
      items.map(item => item.id === id ? { ...item, classification: type } : item)
    );
  }
}
