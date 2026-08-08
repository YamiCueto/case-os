import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rag-metrics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rag-metrics.html',
  styleUrls: ['../../../shared-presentation.css']
})
export class RagMetrics {
}
