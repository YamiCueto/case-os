import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonBlock } from '../../models/lesson-document.models';
import { CaseBadgeComponent } from '../../../core/ui/components';

/**
 * LessonComparisonComponent — CASE Academy
 * 
 * Renderizador de matrices de comparación técnica y cambios de paradigma (ej. Software Determinista vs Probabilístico).
 */
@Component({
  selector: 'app-lesson-comparison',
  standalone: true,
  imports: [CommonModule, CaseBadgeComponent],
  templateUrl: './lesson-comparison.component.html',
  styleUrl: './lesson-comparison.component.css'
})
export class LessonComparisonComponent {
  @Input({ required: true }) comparison!: ComparisonBlock;
}
