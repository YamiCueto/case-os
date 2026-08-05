import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CourseService } from './course.service';
import { CourseContext } from '../models/course.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationContextService {
  private router = inject(Router);
  private courseService = inject(CourseService);

  private contextSignal = signal<CourseContext | null>(null);

  constructor() {
    // Escuchar cambios de ruta para derivar el contexto actual
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects.split('?')[0]; // ignorar query params
        
        const lesson = this.courseService.getLessonByPath(url);
        if (lesson) {
          const module = this.courseService.getModuleByLesson(lesson.id);
          const adjacents = this.courseService.getAdjacentLessons(lesson.id);
          
          this.contextSignal.set({
            currentLesson: lesson,
            module: module,
            previousLesson: adjacents.previous,
            nextLesson: adjacents.next
          });
        } else {
          // No es una lección
          this.contextSignal.set(null);
        }
      });
  }

  getContext() {
    return this.contextSignal.asReadonly();
  }
}
