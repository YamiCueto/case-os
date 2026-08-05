import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { UserProgressService } from '../../core/services/user-progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);
  
  modules = this.courseService.getModules();
  progress = this.userProgressService.getProgress();
}
