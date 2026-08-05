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
        this.updateContext(event.urlAfterRedirects.split('?')[0]);
      });

    // Evaluar inmediatamente la ruta actual (útil para F5 o cargas directas si el evento ya pasó)
    setTimeout(() => {
      if (this.router.url) {
        this.updateContext(this.router.url.split('?')[0]);
      }
    }, 0);
  }

  private updateContext(url: string) {
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
  }

  getContext() {
    return this.contextSignal.asReadonly();
  }
}
