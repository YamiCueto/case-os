import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lesson-01-workflows',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-01-workflows.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class Lesson01Workflows {
  currentSlide = signal(0);
  totalSlides = 4;

  nextSlide() {
    if (this.currentSlide() < this.totalSlides - 1) {
      this.currentSlide.update(v => v + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update(v => v - 1);
    }
  }
}
