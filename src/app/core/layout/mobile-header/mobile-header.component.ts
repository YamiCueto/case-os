import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-header.component.html'
})
export class MobileHeaderComponent {
  private courseService = inject(CourseService);
  
  mobileMenuOpen = signal(false);
  sections = this.courseService.getSidebarSections();
  modules = this.courseService.getModules();

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
