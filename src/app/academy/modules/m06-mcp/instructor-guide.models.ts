/**
 * Modelo canónico para los datos y timelines de la Guía del Instructor en CASE OS.
 */

export interface TimelineBlock {
  id: string;
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  topic: string;
  objective: string;
  explanationGuide: string[];
  suggestedScript: string;
  platformSectionRef: string;
  playgroundRef?: {
    name: string;
    actionSteps: string[];
  };
  checkQuestion: {
    question: string;
    expectedAnswer: string;
  };
  transition: string;
}

export interface LessonInstructorGuide {
  lessonId: string;
  lessonTitle: string;
  sessionDate: string;
  sessionTimeTotal: number;
  sessionNumber: string;
  blocks: TimelineBlock[];
}
