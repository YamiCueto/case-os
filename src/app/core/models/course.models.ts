export type ModuleState = 'LIVE' | 'LOCKED' | 'COMING_SOON';
export type LessonDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: string; // e.g., '2 hrs'
  difficulty: LessonDifficulty;
  icon: string;
  tags: string[];
  prerequisites: string[]; // IDs of prerequisite lessons
  path: string; // The existing legacy path or new path
  type?: 'LESSON' | 'DEMO' | 'LAB';
  objectives?: string[];
  resources?: { title: string; url: string; }[];
}

export interface CourseContext {
  module?: AcademyModule;
  currentLesson?: Lesson;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
}

export interface AcademyModule {
  id: string;
  title: string;
  order: number;
  state: ModuleState;
  duration: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  state?: ModuleState;
  badge?: string;
  children?: NavigationItem[]; // For classes inside modules
}

export interface CourseConfig {
  modules: AcademyModule[];
  sidebar: NavigationSection[];
}
