import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cosine-similarity',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cosine-similarity.html',
  styleUrls: ['../../../shared-presentation.css']
})
export class CosineSimilarity {
}
