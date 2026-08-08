import { CourseConfig } from '../models/course.models';

export const COURSE_CONFIG: CourseConfig = {
  modules: [
    {
      id: 'm1',
      title: '01. AI Foundations',
      order: 1,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🧠',
      description: 'Fundamentos de Inteligencia Artificial para Ingeniería de Software',
      lessons: [
        {
          id: 'c1',
          title: 'Lesson 01 — De Código a Probabilidad',
          order: 1,
          duration: '30 min',
          difficulty: 'BEGINNER',
          icon: 'L1',
          tags: ['AI', 'Foundations'],
          prerequisites: [],
          path: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad',
          objectives: ['Entender el cambio mental hacia los modelos probabilísticos'],
          resources: []
        },
        {
          id: 'c2',
          title: 'Lesson 02 — Anatomía de la Inferencia',
          order: 2,
          duration: '30 min',
          difficulty: 'BEGINNER',
          icon: 'L2',
          tags: ['Tokens', 'Context', 'Temperature'],
          prerequisites: ['c1'],
          path: '/academy/modules/m01-ai-foundations/lesson-02-inferencia',
          objectives: ['Entender tokens, ventana de contexto y parámetros de inferencia'],
          resources: []
        },
        {
          id: 'c3',
          title: 'Lesson 03 — Modelos vs Sistemas',
          order: 3,
          duration: '30 min',
          difficulty: 'BEGINNER',
          icon: 'L3',
          tags: ['Systems', 'Hallucinations'],
          prerequisites: ['c2'],
          path: '/academy/modules/m01-ai-foundations/lesson-03-sistemas',
          objectives: ['Distinguir entre modelo crudo y sistema orquestado'],
          resources: []
        },
        {
          id: 'l1',
          title: 'Lab 01 — Token Playground',
          order: 4,
          duration: '60 min',
          difficulty: 'BEGINNER',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c3'],
          path: '/labs/token-playground',
          objectives: ['Experimentar empíricamente con la tokenización'],
          resources: []
        }
      ]
    },
    {
      id: 'm2',
      title: '02. Prompt Engineering',
      order: 2,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '💬',
      description: 'Ingeniería de instrucciones robustas y reproducibles',
      lessons: [
        {
          id: 'c4',
          title: 'Lesson 01 — Reliable Behavior',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Prompting', 'Zero-Shot', 'Few-Shot'],
          prerequisites: ['l1'],
          path: '/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior',
          objectives: ['Aprender a diseñar instrucciones que produzcan comportamiento reproducible'],
          resources: []
        },
        {
          id: 'c5',
          title: 'Lesson 02 — Reasoning Patterns',
          order: 2,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L2',
          tags: ['CoT', 'Reasoning'],
          prerequisites: ['c4'],
          path: '/academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns',
          objectives: ['Aplicar patrones de razonamiento estructurado (Chain of Thought)'],
          resources: []
        },
        {
          id: 'c6',
          title: 'Lesson 03 — Structured Outputs',
          order: 3,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L3',
          tags: ['JSON', 'Schemas'],
          prerequisites: ['c5'],
          path: '/academy/modules/m02-prompt-engineering/lesson-03-structured-outputs',
          objectives: ['Forzar salidas estructuradas y esquemas de validación'],
          resources: []
        },
        {
          id: 'l2',
          title: 'Lab 02 — Engineer the Instruction',
          order: 4,
          duration: '60 min',
          difficulty: 'INTERMEDIATE',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c6'],
          path: '/labs/engineer-instruction',
          objectives: ['Iterar una instrucción para asegurar el parsing de JSON'],
          resources: []
        }
      ]
    },
    {
      id: 'm3',
      title: '03. Context Engineering',
      order: 3,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🪟',
      description: 'Gestión avanzada, ensamblado y compresión de contexto',
      lessons: []
    },
    {
      id: 'm4',
      title: '04. Retrieval & RAG',
      order: 4,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🔍',
      description: 'Recuperación de conocimiento y evaluación (Precision/Recall)',
      lessons: []
    },
    {
      id: 'm5',
      title: '05. AI Agents',
      order: 5,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🤖',
      description: 'Workflows, Tool-calling y el Agent Loop',
      lessons: []
    },
    {
      id: 'm6',
      title: '06. Agentic Software Engineering',
      order: 6,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '⚙️',
      description: 'Desarrollo de software colaborativo humano-agente',
      lessons: []
    },
    {
      id: 'm7',
      title: '07. Model Context Protocol',
      order: 7,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🔌',
      description: 'Estandarización universal de capacidades y contexto',
      lessons: []
    },
    {
      id: 'm8',
      title: '08. Production AI',
      order: 8,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🏭',
      description: 'Evaluación, Costos, Caching y Seguridad',
      lessons: []
    },
    {
      id: 'm9',
      title: '09. AI Architecture',
      order: 9,
      state: 'LOCKED',
      duration: 'TBD',
      icon: '🏛️',
      description: 'Diseño arquitectónico de sistemas y Reasoning Platforms',
      lessons: []
    }
  ],
  sidebar: [
    {
      title: 'Principal',
      items: [
        {
          id: 'home',
          title: 'Academy Home',
          icon: '🏠',
          path: '/academy/home',
          state: 'LIVE'
        }
      ]
    },
    {
      title: 'Academia',
      items: [
        {
          id: 'roadmap',
          title: 'Roadmap de Carrera',
          icon: '🗺️',
          path: '/academy/roadmap',
          state: 'COMING_SOON'
        },
        {
          id: 'certifications',
          title: 'Certificaciones',
          icon: '📜',
          path: '/academy/certifications',
          state: 'COMING_SOON'
        }
      ]
    },
    {
      title: 'Recursos',
      items: [
        {
          id: 'library',
          title: 'CASE Library',
          icon: '📚',
          path: '/library',
          state: 'COMING_SOON'
        },
        {
          id: 'labs',
          title: 'CASE Labs',
          icon: '🔬',
          path: '/labs',
          state: 'COMING_SOON'
        },
        {
          id: 'framework',
          title: 'Framework CASE',
          icon: '🏗️',
          path: '/framework',
          state: 'COMING_SOON'
        }
      ]
    },
    {
      title: 'Módulos',
      items: [] // Se popularizará iterando modules desde el config en la UI, o se pueden mapear acá dependiendo del diseño del CourseService.
    }
  ]
};
