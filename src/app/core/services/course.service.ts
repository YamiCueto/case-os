import { Injectable, signal } from '@angular/core';
import { COURSE_CONFIG } from '../config/course.config';
import { AcademyModule, CourseConfig, Lesson, NavigationSection } from '../models/course.models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private config = signal<CourseConfig>(COURSE_CONFIG);

  constructor() {}

  getModules(): AcademyModule[] {
    return this.config().modules;
  }

  getSidebarSections(): NavigationSection[] {
    return this.config().sidebar;
  }

  getModuleById(id: string): AcademyModule | undefined {
    return this.config().modules.find(m => m.id === id);
  }

  getLessonByPath(path: string): Lesson | undefined {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    for (const module of this.config().modules) {
      const lesson = module.lessons.find(l => l.path === normalizedPath);
      if (lesson) return lesson;
    }
    return undefined;
  }

  getModuleByLesson(lessonId: string): AcademyModule | undefined {
    return this.config().modules.find(m => m.lessons.some(l => l.id === lessonId));
  }

  getAdjacentLessons(lessonId: string): { previous?: Lesson, next?: Lesson } {
    const module = this.getModuleByLesson(lessonId);
    if (!module) return {};

    const index = module.lessons.findIndex(l => l.id === lessonId);
    if (index === -1) return {};

    return {
      previous: index > 0 ? module.lessons[index - 1] : undefined,
      next: index < module.lessons.length - 1 ? module.lessons[index + 1] : undefined
    };
  }
}
