import { Component, inject, computed } from '@angular/core';
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

  // ViewModel para la UI
  viewModules = computed(() => {
    return this.modules.map(mod => {
      const lessonCount = mod.lessons?.filter(l => l.type === 'LESSON' || !l.type).length || 0;
      const demoCount = mod.lessons?.filter(l => l.type === 'DEMO').length || 0;
      const labCount = mod.lessons?.filter(l => l.type === 'LAB').length || 0;

      // Determine state for UI styling (completed logic is simplified for demo)
      let uiState = mod.state === 'LIVE' ? 'CURRENT' : (mod.state === 'LOCKED' ? 'LOCKED' : 'NEXT');
      if (mod.state === 'LIVE' && mod.order < 9 && this.progress().completionPercentage > (mod.order * 10)) {
         uiState = 'COMPLETED'; // Just a visual mock for the demo progression
      }

      return {
        ...mod,
        formattedOrder: mod.order.toString().padStart(2, '0'),
        lessonCount,
        demoCount,
        labCount,
        uiState
      };
    });
  });

  lastModuleTitle = computed(() => {
    const p = this.progress();
    if (!p.lastVisitedLessonId) return null;
    const allMods = this.modules;
    for (const m of allMods) {
      if (m.lessons?.some(l => l.id === p.lastVisitedLessonId)) {
        return m.title;
      }
    }
    return null;
  });
}
