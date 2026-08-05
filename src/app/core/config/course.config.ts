import { CourseConfig } from '../models/course.models';

export const COURSE_CONFIG: CourseConfig = {
  modules: [
    {
      id: 'm1',
      title: 'Módulo 1 · IA Generativa',
      order: 1,
      state: 'LIVE',
      duration: '12 semanas',
      icon: '🧠',
      description: 'Fundamentos de IA Generativa para Ingeniería de Software',
      lessons: [
        {
          id: 'c1',
          title: 'Fundamentos GenIA',
          order: 1,
          duration: '2 hrs',
          difficulty: 'BEGINNER',
          icon: 'C1',
          tags: ['Prompt Engineering', 'LLMs'],
          prerequisites: [],
          path: '/clase1-dev-fundamentos',
          objectives: ['Entender los conceptos básicos de la IA Generativa', 'Aprender técnicas de Prompt Engineering'],
          resources: [{ title: 'Documentación OpenAI', url: '#' }]
        },
        {
          id: 'c2',
          title: 'Spring Boot con IA',
          order: 2,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C2',
          tags: ['Spring Boot', 'Java'],
          prerequisites: ['c1'],
          path: '/clase2-dev-spring-boot',
          objectives: ['Integrar IA en aplicaciones Spring Boot', 'Crear endpoints inteligentes'],
          resources: [{ title: 'Spring AI Guide', url: '#' }]
        },
        {
          id: 'c3',
          title: 'Migración VB6 Legacy',
          order: 3,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C3',
          tags: ['VB6', 'Refactoring'],
          prerequisites: ['c2'],
          path: '/clase3-dev-migracion-legacy',
          objectives: ['Analizar código VB6 legado', 'Estrategias de migración asistidas por IA'],
          resources: [{ title: 'Guía de Migración', url: '#' }]
        },
        {
          id: 'c4',
          title: 'APIs REST & Swagger',
          order: 4,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C4',
          tags: ['API', 'Swagger'],
          prerequisites: ['c3'],
          path: '/clase4-dev-integracion-apis',
          objectives: ['Diseñar APIs RESTful', 'Documentar APIs con Swagger/OpenAPI'],
          resources: [{ title: 'Swagger UI Docs', url: '#' }]
        },
        {
          id: 'c5',
          title: 'Unit Testing & TDD',
          order: 5,
          duration: '2 hrs',
          difficulty: 'ADVANCED',
          icon: 'C5',
          tags: ['TDD', 'JUnit'],
          prerequisites: ['c4'],
          path: '/clase5-dev-testing-avanzado',
          objectives: ['Aplicar TDD en proyectos Java', 'Generar tests con IA'],
          resources: [{ title: 'JUnit 5 User Guide', url: '#' }]
        },
        {
          id: 'c6',
          title: 'Componentes Angular',
          order: 6,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C6',
          tags: ['Angular', 'Frontend'],
          prerequisites: ['c5'],
          path: '/clase6-dev-modulo-angular',
          objectives: ['Crear componentes Angular reutilizables', 'Arquitectura frontend orientada a componentes'],
          resources: [{ title: 'Angular Docs', url: '#' }]
        },
        {
          id: 'c7',
          title: 'Modernización Frontend',
          order: 7,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C7',
          tags: ['Angular', 'UI'],
          prerequisites: ['c6'],
          path: '/clase7-dev-frontend-legacy',
          objectives: ['Modernizar interfaces de usuario legadas', 'Integración de TailwindCSS'],
          resources: [{ title: 'TailwindCSS Docs', url: '#' }]
        },
        {
          id: 'c8',
          title: 'Estado & RxJS',
          order: 8,
          duration: '2 hrs',
          difficulty: 'ADVANCED',
          icon: 'C8',
          tags: ['RxJS', 'State Management'],
          prerequisites: ['c7'],
          path: '/clase8-dev-estado-rxjs',
          objectives: ['Manejo de estado complejo con RxJS', 'Patrones reactivos'],
          resources: [{ title: 'Learn RxJS', url: '#' }]
        },
        {
          id: 'c9',
          title: 'Testing E2E Devs',
          order: 9,
          duration: '2 hrs',
          difficulty: 'ADVANCED',
          icon: 'C9',
          tags: ['E2E', 'Cypress', 'Playwright'],
          prerequisites: ['c8'],
          path: '/clase9-dev-testing-e2e',
          objectives: ['Escribir tests E2E con Cypress/Playwright', 'Automatizar pruebas en CI'],
          resources: [{ title: 'Playwright Docs', url: '#' }]
        },
        {
          id: 'c10',
          title: 'Spring AI & RAG',
          order: 10,
          duration: '2 hrs',
          difficulty: 'EXPERT',
          icon: 'C10',
          tags: ['Spring AI', 'RAG'],
          prerequisites: ['c9'],
          path: '/clase10-dev-fastapi',
          objectives: ['Implementar RAG con Spring AI', 'Procesamiento de documentos y embeddings'],
          resources: [{ title: 'Spring AI Reference', url: '#' }]
        },
        {
          id: 'c11',
          title: 'Angular UI Legacy',
          order: 11,
          duration: '2 hrs',
          difficulty: 'INTERMEDIATE',
          icon: 'C11',
          tags: ['Angular', 'Legacy'],
          prerequisites: ['c10'],
          path: '/clase11-dev-lambda-serverless',
          objectives: ['Integrar Angular con APIs Serverless', 'Despliegue y optimización'],
          resources: [{ title: 'AWS Serverless', url: '#' }]
        },
        {
          id: 'c12',
          title: 'Proyecto Integrador',
          order: 12,
          duration: '4 hrs',
          difficulty: 'EXPERT',
          icon: 'C12',
          tags: ['Full Stack', 'Capstone'],
          prerequisites: ['c11'],
          path: '/clase12-dev-proyecto-final',
          objectives: ['Completar el proyecto integrador', 'Presentar la solución completa (Frontend + Backend + IA)'],
          resources: [{ title: 'Rúbrica de Proyecto', url: '#' }]
        }
      ]
    },
    {
      id: 'm2',
      title: 'Módulo 2 · Context Engineering',
      order: 2,
      state: 'LOCKED',
      duration: '8 semanas',
      icon: '🧠',
      description: 'Gestión avanzada de contexto para IAs',
      lessons: []
    },
    {
      id: 'm3',
      title: 'Módulo 3 · Agent Engineering',
      order: 3,
      state: 'LOCKED',
      duration: '8 semanas',
      icon: '🤖',
      description: 'Creación y orquestación de agentes',
      lessons: []
    },
    {
      id: 'm4',
      title: 'Módulo 4 · Dev Automation',
      order: 4,
      state: 'LOCKED',
      duration: '6 semanas',
      icon: '⚡',
      description: 'Automatización de pipelines y despliegues',
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
        },
        {
          id: 'plan-estudio',
          title: 'Plan de Estudio DEV',
          icon: '📌',
          path: '/plan-dev-detallado',
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
