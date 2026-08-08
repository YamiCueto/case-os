import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lesson-03-sistemas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-03-sistemas.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class Lesson03Sistemas {
  currentSlide = signal(0);
  totalSlides = 3;

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
