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
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🧠',
      description: 'Diseño e inyección de contexto dinámico (El modelo recibe lo que seleccionas, no la app entera)',
      lessons: [
        {
          id: 'c7',
          title: 'Lesson 01 — Anatomy of Context',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['State', 'Context Sources'],
          prerequisites: ['l2'],
          path: '/academy/modules/m03-context-engineering/lesson-01-anatomy',
          objectives: ['Identificar las 6 fuentes de contexto y distinguir útil vs disponible'],
          resources: []
        },
        {
          id: 'c8',
          title: 'Lesson 02 — Assembly & Prioritization',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['Assembly', 'Priority'],
          prerequisites: ['c7'],
          path: '/academy/modules/m03-context-engineering/lesson-02-assembly',
          objectives: ['Priorizar contexto por relevancia, recencia y redundancia'],
          resources: []
        },
        {
          id: 'c9',
          title: 'Lesson 03 — Compression & Validation',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Compression', 'Budget'],
          prerequisites: ['c8'],
          path: '/academy/modules/m03-context-engineering/lesson-03-compression',
          objectives: ['Comprimir contexto preservando densidad de información'],
          resources: []
        },
        {
          id: 'l3',
          title: 'Lab 03 — Engineer the Context',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c9'],
          path: '/labs/engineer-context',
          objectives: ['Seleccionar un payload de contexto mínimo viable bajo un budget estricto'],
          resources: []
        }
      ]
    },
    {
      id: 'm4',
      title: '04. Retrieval & RAG',
      order: 4,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🔍',
      description: 'Recuperación de conocimiento y evaluación (Precision/Recall)',
      lessons: [
        {
          id: 'c10',
          title: 'Lesson 01 — Embeddings & Vector Databases',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Embeddings', 'Vectors'],
          prerequisites: ['l3'],
          path: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings',
          objectives: ['Entender cómo representamos conocimiento para poder buscarlo'],
          resources: []
        },
        {
          id: 'c11',
          title: 'Lesson 02 — The RAG Pipeline',
          order: 2,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L2',
          tags: ['RAG', 'Pipeline'],
          prerequisites: ['c10'],
          path: '/academy/modules/m04-retrieval-rag/lesson-02-pipeline',
          objectives: ['Convertir la búsqueda en contexto útil para un LLM'],
          resources: []
        },
        {
          id: 'c12',
          title: 'Lesson 03 — Retrieval Evaluation',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Evaluation', 'Metrics'],
          prerequisites: ['c11'],
          path: '/academy/modules/m04-retrieval-rag/lesson-03-evaluation',
          objectives: ['Medir y evaluar si nuestro retrieval funciona correctamente'],
          resources: []
        },
        {
          id: 'l4',
          title: 'Lab 04 — Build Retrieval',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c12'],
          path: '/labs/build-retrieval',
          objectives: ['Construir un motor de recuperación simulado y evaluar el Top-K'],
          resources: []
        }
      ]
    },
    {
      id: 'm5',
      title: '05. AI Agents',
      order: 5,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🤖',
      description: 'Workflows, Tool-calling y el Agent Loop',
      lessons: [
        {
          id: 'c13',
          title: 'Lesson 01 — Workflows vs Agents',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Workflows', 'Autonomy'],
          prerequisites: ['l4'],
          path: '/academy/modules/m05-ai-agents/lesson-01-workflows',
          objectives: ['Aplicar el principio de Least Autonomy Necessary'],
          resources: []
        },
        {
          id: 'c14',
          title: 'Lesson 02 — Tool Calling',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['Tools', 'Contracts'],
          prerequisites: ['c13'],
          path: '/academy/modules/m05-ai-agents/lesson-02-tool-calling',
          objectives: ['Entender el contrato entre modelo que propone y software que ejecuta'],
          resources: []
        },
        {
          id: 'c15',
          title: 'Lesson 03 — The Agent Loop',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['ReAct', 'Loop'],
          prerequisites: ['c14'],
          path: '/academy/modules/m05-ai-agents/lesson-03-agent-loop',
          objectives: ['Comprender el ciclo operacional de Action -> Observation'],
          resources: []
        },
        {
          id: 'l5',
          title: 'Lab 05 — The Agent Loop',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c15'],
          path: '/labs/agent-loop',
          objectives: ['Operar un ciclo ReAct manualmente con herramientas'],
          resources: []
        }
      ]
    },
    {
      id: 'm6',
      title: '06. Agentic Software Engineering',
      order: 6,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '💻',
      description: 'Cómo los agentes están transformando la programación',
      lessons: [
        {
          id: 'c16',
          title: 'Lesson 01 — From Completion to Agents',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Code', 'Agentic'],
          prerequisites: ['l5'],
          path: '/academy/modules/m06-agentic-swe/lesson-01-agentic-coding',
          objectives: ['Comprender la evolución hacia Agentic Coding'],
          resources: []
        },
        {
          id: 'c17',
          title: 'Lesson 02 — Human-Agent Collaboration',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['HitL', 'Verification'],
          prerequisites: ['c16'],
          path: '/academy/modules/m06-agentic-swe/lesson-02-human-collaboration',
          objectives: ['Desplazar el trabajo humano hacia especificación y revisión'],
          resources: []
        },
        {
          id: 'c18',
          title: 'Lesson 03 — Repository Context',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Context', 'IDE'],
          prerequisites: ['c17'],
          path: '/academy/modules/m06-agentic-swe/lesson-03-repository-context',
          objectives: ['Entender cómo un IDE moderno construye el contexto'],
          resources: []
        },
        {
          id: 'l6',
          title: 'Lab 06 — The Context-Aware Coder',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c18'],
          path: '/labs/ai-coder',
          objectives: ['Experimentar el impacto del contexto en la generación de código'],
          resources: []
        }
      ]
    },
    {
      id: 'm7',
      title: '07. Model Context Protocol',
      order: 7,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🔌',
      description: 'Estandarizando la interoperabilidad AI-datos',
      lessons: [
        {
          id: 'c19',
          title: 'Lesson 01 — The N x M Problem',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Integration', 'Architecture'],
          prerequisites: ['l6'],
          path: '/academy/modules/m07-mcp/lesson-01-nxm-problem',
          objectives: ['Comprender la crisis de integración fragmentada'],
          resources: []
        },
        {
          id: 'c20',
          title: 'Lesson 02 — MCP Architecture',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['Host', 'Client', 'Server'],
          prerequisites: ['c19'],
          path: '/academy/modules/m07-mcp/lesson-02-architecture',
          objectives: ['Diferenciar Host, Client y Server y los transportes modernos'],
          resources: []
        },
        {
          id: 'c21',
          title: 'Lesson 03 — Primitives',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Resources', 'Tools', 'Prompts'],
          prerequisites: ['c20'],
          path: '/academy/modules/m07-mcp/lesson-03-primitives',
          objectives: ['Entender Resources vs Tools'],
          resources: []
        },
        {
          id: 'l7',
          title: 'Lab 07 — The Universal Connector',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c21'],
          path: '/labs/mcp-connector',
          objectives: ['Experimentar el descubrimiento de capacidades MCP'],
          resources: []
        }
      ]
    },
    {
      id: 'm8',
      title: '08. Production AI',
      order: 8,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🛡️',
      description: 'Evaluación, seguridad y observabilidad de sistemas',
      lessons: [
        {
          id: 'c22',
          title: 'Lesson 01 — The Production Gap',
          order: 1,
          duration: '30 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['Evaluation', 'Vibes'],
          prerequisites: ['l7'],
          path: '/academy/modules/m08-production/lesson-01-production-gap',
          objectives: ['Dejar atrás la evaluación basada en vibras'],
          resources: []
        },
        {
          id: 'c23',
          title: 'Lesson 02 — Evaluation Hierarchy',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['Deterministic', 'LLM-as-a-judge'],
          prerequisites: ['c22'],
          path: '/academy/modules/m08-production/lesson-02-evaluation',
          objectives: ['Entender la jerarquía de evaluación y datasets dorados'],
          resources: []
        },
        {
          id: 'c24',
          title: 'Lesson 03 — Security & Constraints',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Security', 'Boundaries'],
          prerequisites: ['c23'],
          path: '/academy/modules/m08-production/lesson-03-security',
          objectives: ['Identificar fronteras de seguridad y restricciones operativas'],
          resources: []
        },
        {
          id: 'l8',
          title: 'Lab 08 — The Eval Pipeline',
          order: 4,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Practice'],
          prerequisites: ['c24'],
          path: '/labs/eval-pipeline',
          objectives: ['Diseñar una rúbrica de evaluación y detectar falsos positivos'],
          resources: []
        }
      ]
    },
    {
      id: 'm9',
      title: '09. AI Architecture',
      order: 9,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🏗️',
      description: 'Arquitectura de sistemas GenAI desacoplados',
      lessons: [
        {
          id: 'c25',
          title: 'Lesson 01 — The Monolith Trap',
          order: 1,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L1',
          tags: ['Architecture', 'Monolith'],
          prerequisites: ['l8'],
          path: '/academy/modules/m09-architecture/lesson-01-monolith',
          objectives: ['Comprender que el modelo es una dependencia, no la arquitectura'],
          resources: []
        },
        {
          id: 'c26',
          title: 'Lesson 02 — Decoupled Capabilities',
          order: 2,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L2',
          tags: ['Capabilities', 'Boundaries'],
          prerequisites: ['c25'],
          path: '/academy/modules/m09-architecture/lesson-02-capabilities',
          objectives: ['Diseñar basándose en requerimientos, no en el hype'],
          resources: []
        },
        {
          id: 'c27',
          title: 'Lesson 03 — CASE OS Case Study',
          order: 3,
          duration: '30 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Case Study', 'Trade-offs'],
          prerequisites: ['c26'],
          path: '/academy/modules/m09-architecture/lesson-03-case-study',
          objectives: ['Estudiar CASE OS como un ejemplo de arquitectura modular'],
          resources: []
        },
        {
          id: 'l9',
          title: 'Lab 09 — The Architecture Blueprint',
          order: 4,
          duration: '60 min',
          difficulty: 'EXPERT',
          icon: '🔬',
          tags: ['Lab', 'Design'],
          prerequisites: ['c27'],
          path: '/labs/architecture-blueprint',
          objectives: ['Seleccionar capacidades arquitectónicas evaluando trade-offs'],
          resources: []
        }
      ]
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
