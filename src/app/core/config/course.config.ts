import { CourseConfig } from '../models/course.models';

export const COURSE_CONFIG: CourseConfig = {
  modules: [
    {
      id: 'm1',
      title: '01. Fundamentos de IA',
      order: 1,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🧠',
      description: 'Fundamentos de Inteligencia Artificial para Ingeniería de Software',
      lessons: [
        {
          id: 'c1',
          title: 'Lección 01 — De Código a Probabilidad',
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
          title: 'Lección 02 — Anatomía de la Inferencia',
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
          title: 'Lección 03 — Modelos vs Sistemas',
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
          id: 'd1',
          title: 'Demo 01 — Token Playground',
          order: 4,
          duration: '15 min',
          difficulty: 'BEGINNER',
          icon: '🎮',
          tags: ['Demo', 'Interactive'],
          prerequisites: ['c3'],
          path: '/academy/modules/m01-ai-foundations/demo-token-playground',
          type: 'DEMO',
          objectives: ['Experimentar empíricamente con la tokenización'],
          resources: []
        },
        {
          id: 'l1',
          title: 'Laboratorio 01 — Analizar una Rutina Legacy',
          order: 5,
          duration: '60 min',
          difficulty: 'INTERMEDIATE',
          icon: '🔬',
          tags: ['Lab', 'Real Engineering'],
          prerequisites: ['d1'],
          path: '/academy/modules/m01-ai-foundations/lab-01-legacy-routine',
          type: 'LAB',
          objectives: ['Analizar código legacy real y separar lógica determinista de probabilística'],
          resources: []
        }
      ]
    },
    {
      id: 'm2',
      title: '02. Ingeniería de Prompts',
      order: 2,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '💬',
      description: 'Ingeniería de instrucciones robustas y reproducibles',
      lessons: [
        {
          id: 'c4',
          title: 'Lección 01 — Comportamiento Confiable',
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
          title: 'Lección 02 — Patrones de Razonamiento',
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
          title: 'Lección 03 — Salidas Estructuradas',
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
          id: 'd2',
          title: 'Demo 02 — Diseñar la Instrucción',
          order: 4,
          duration: '15 min',
          difficulty: 'INTERMEDIATE',
          icon: '🎮',
          tags: ['Demo', 'Interactive'],
          type: 'DEMO',
          prerequisites: ['c6'],
          path: '/academy/modules/m02-prompt-engineering/demo-engineer-instruction',
          objectives: ['Observar la diferencia entre instrucciones ambiguas y acorraladas en un pipeline'],
          resources: []
        },
        {
          id: 'l2',
          title: 'Laboratorio 02 — Diseñar un Contrato de Instrucción para IA',
          order: 5,
          duration: '60 min',
          difficulty: 'INTERMEDIATE',
          icon: '🔬',
          tags: ['Lab', 'Real Engineering'],
          type: 'LAB',
          prerequisites: ['d2'],
          path: '/academy/modules/m02-prompt-engineering/lab-02-engineer-instruction-contract',
          objectives: ['Construir un contrato de instrucciones determinista para una tarea de modernización real'],
          resources: []
        }
      ]
    },
    {
      id: 'm3',
      title: '03. Ingeniería de Contexto',
      order: 3,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🧠',
      description: 'Diseño e inyección de contexto dinámico (El modelo recibe lo que seleccionas, no la app entera)',
      lessons: [
        {
          id: 'c7',
          title: 'Lección 01 — Anatomía del Contexto',
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
          title: 'Lección 02 — Ensamblaje y Priorización',
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
          title: 'Lección 03 — Compresión y Validación',
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
          id: 'd3',
          title: 'Demo 03 — Diseñar el Contexto',
          order: 4,
          duration: '15 min',
          difficulty: 'ADVANCED',
          icon: '🎮',
          tags: ['Demo', 'Interactive'],
          type: 'DEMO',
          prerequisites: ['c9'],
          path: '/academy/modules/m03-context-engineering/demo-engineer-context',
          objectives: ['Experimentar con presupuestos de tokens, ruido e información indispensable'],
          resources: []
        },
        {
          id: 'l3',
          title: 'Laboratorio 03 — Construir el Contexto Mínimo Útil',
          order: 5,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Real Engineering'],
          type: 'LAB',
          prerequisites: ['d3'],
          path: '/academy/modules/m03-context-engineering/lab-03-build-minimum-useful-context',
          objectives: ['Construir un Context Manifest justificado para una tarea real de modernización corporativa'],
          resources: []
        }
      ]
    },
    {
      id: 'm4',
      title: '04. Recuperación y RAG',
      order: 4,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🔍',
      description: 'Recuperación de conocimiento y evaluación (Precision/Recall)',
      lessons: [
        {
          id: 'c10',
          title: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
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
          title: 'Lección 02 — La Tubería RAG',
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
          title: 'Lección 03 — Evaluación de la Recuperación',
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
          id: 'd4',
          title: 'Demo 04 — Construir la Recuperación',
          order: 4,
          duration: '15 min',
          difficulty: 'ADVANCED',
          icon: '🎮',
          tags: ['Demo', 'Interactive'],
          type: 'DEMO',
          prerequisites: ['c12'],
          path: '/academy/modules/m04-retrieval-rag/demo-build-retrieval',
          objectives: ['Simular generación de candidatos, Top-K y el dilema Precision vs. Recall'],
          resources: []
        },
        {
          id: 'l4',
          title: 'Laboratorio 04 — Diseñar una Estrategia de Recuperación',
          order: 5,
          duration: '60 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Real Engineering'],
          type: 'LAB',
          prerequisites: ['d4'],
          path: '/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy',
          objectives: ['Diseñar una especificación formal de búsqueda y un benchmark de evaluación de 5 queries'],
          resources: []
        }
      ]
    },
    {
      id: 'm5',
      title: '05. Agentes de IA',
      order: 5,
      state: 'LIVE',
      duration: '4 lecciones',
      icon: '🤖',
      description: 'Workflows, Tool-calling y el Agent Loop',
      lessons: [
        {
          id: 'c13',
          title: 'Lección 01 — Flujos de Trabajo vs Agentes',
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
          title: 'Lección 02 — Llamada de Herramientas',
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
          title: 'Lección 03 — El Bucle del Agente',
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
          id: 'c-m5-l04',
          title: 'Lección 04 — Estado y Memoria',
          order: 4,
          duration: '35 min',
          difficulty: 'ADVANCED',
          icon: 'L4',
          tags: ['State', 'Memory', 'Lifecycle'],
          prerequisites: ['c15'],
          path: '/academy/modules/m05-ai-agents/lesson-04-state-memory',
          objectives: ['Comprender la separación entre Execution State, Session Memory y Persistent Memory, implementando hydrate y write-back con aislamiento por subject_id'],
          resources: []
        },
        {
          id: 'c-m5-l05',
          title: 'Lección 05 — Planificación y Descomposición de Tareas',
          order: 5,
          duration: '35 min',
          difficulty: 'ADVANCED',
          icon: 'L5',
          tags: ['Planning', 'Decomposition', 'Replanning'],
          prerequisites: ['c-m5-l04'],
          path: '/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition',
          objectives: ['Comprender la transición de agentes reactivos a planificados, modelando el plan como estructura observable de software (Goal, Steps, Status, Executor) y gobernando ejecución y replanning bajo Least Autonomy Necessary'],
          resources: []
        },
        {
          id: 'c-m5-l06',
          title: 'Lección 06 — Guardrails & Human-in-the-Loop',
          order: 6,
          duration: '35 min',
          difficulty: 'ADVANCED',
          icon: 'L6',
          tags: ['Guardrails', 'HITL', 'Security', 'Budgets'],
          prerequisites: ['c-m5-l05'],
          path: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl',
          objectives: ['Comprender que capacidad no implica autoridad, implementando ToolPolicy determinista, ActionProposal con binding SHA-256 sobre serialización determinista, compuerta formal Human-in-the-Loop (PAUSED_FOR_APPROVAL), revalidación de precondiciones, aprobación de un solo uso con protección anti-replay y BudgetController con disyuntores'],
          resources: []
        },
        {
          id: 'c-m5-l07',
          title: 'Lección 07 — Observabilidad y Evaluación Agéntica',
          order: 7,
          duration: '35 min',
          difficulty: 'ADVANCED',
          icon: 'L7',
          tags: ['Observability', 'Tracing', 'Evaluation', 'Golden Cases'],
          prerequisites: ['c-m5-l06'],
          path: '/academy/modules/m05-ai-agents/lesson-07-observability-evaluation',
          objectives: ['Convertir corridas opacas en trayectorias estructuradas mediante Structured Agent Tracing (TraceEvent, InMemoryTraceCollector, sequence_no monotónico), evaluar agentes con Golden Cases deterministas (Outcome vs Trajectory) y detectar regresiones automáticamente con AgentEvaluator'],
          resources: []
        },
        {
          id: 'd5',
          title: 'Demo 05 — El Bucle del Agente',
          order: 8,
          duration: '15 min',
          difficulty: 'ADVANCED',
          icon: '🎮',
          tags: ['Demo', 'Interactive'],
          type: 'DEMO',
          prerequisites: ['c-m5-l07'],
          path: '/academy/modules/m05-ai-agents/demo-agent-loop',
          objectives: ['Operar un ciclo de toma de decisiones (Intent -> Action -> Observation) manualmente'],
          resources: []
        },
        {
          id: 'l5',
          title: 'Laboratorio 05 — Agent Engineering Capstone',
          order: 9,
          duration: '60–90 min',
          difficulty: 'ADVANCED',
          icon: '🔬',
          tags: ['Lab', 'Capstone', 'Real Engineering'],
          type: 'LAB',
          prerequisites: ['d5'],
          path: '/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow',
          objectives: ['Construir un agente operacional integrando decisión, herramientas, bucle, estado, planificación adaptativa, compuerta de políticas, HITL con revalidación y trazabilidad estructurada'],
          resources: []
        }
      ]
    },
    {
      id: 'm6',
      title: '06. Model Context Protocol',
      order: 6,
      state: 'LIVE',
      duration: '4 lecciones · 1 lab',
      icon: '🔌',
      description: 'Estandarizando la interoperabilidad AI-datos y conectando agentes con herramientas reales',
      lessons: [
        {
          id: 'c-m6-l01',
          title: 'Lección 01 — ¿Qué es MCP y por qué necesitamos utilizarlo?',
          order: 1,
          duration: '35 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L1',
          tags: ['MCP', 'Architecture', 'N×M', 'Host-Client-Server'],
          prerequisites: ['l5'],
          path: '/academy/modules/m06-mcp/lesson-01-que-es-mcp',
          objectives: ['Comprender la crisis de integración N×M, la diferencia entre Tool Calling y MCP, la arquitectura Host-Client-Server y el ciclo de vida de peticiones'],
          resources: []
        },
        {
          id: 'c-m6-l02',
          title: 'Lección 02 — Los Servidores MCP más Útiles',
          order: 2,
          duration: '40 min',
          difficulty: 'INTERMEDIATE',
          icon: 'L2',
          tags: ['Servers', 'GitHub', 'Filesystem', 'Playwright', 'Databases'],
          prerequisites: ['c-m6-l01'],
          path: '/academy/modules/m06-mcp/lesson-02-servidores-utiles',
          objectives: ['Analizar, comparar y configurar los servidores MCP esenciales: GitHub, Filesystem, Playwright, PostgreSQL, Jira y Custom Servers bajo Least Privilege'],
          resources: []
        },
        {
          id: 'c-m6-l03',
          title: 'Lección 03 — Configuración y Utilización Práctica',
          order: 3,
          duration: '40 min',
          difficulty: 'ADVANCED',
          icon: 'L3',
          tags: ['Config', 'stdio', 'Streamable HTTP', 'JSON-RPC', 'HITL'],
          prerequisites: ['c-m6-l02'],
          path: '/academy/modules/m06-mcp/lesson-03-configuracion-practica',
          objectives: ['Dominar transportes stdio y Streamable HTTP, mcp_config.json, ciclo JSON-RPC 2.0, compuertas Human-in-the-Loop y diagnóstico de problemas de runtime'],
          resources: []
        },
        {
          id: 'c-m6-l04',
          title: 'Lección 04 — MCP Integrado con Agentes de IA',
          order: 4,
          duration: '45 min',
          difficulty: 'EXPERT',
          icon: 'L4',
          tags: ['Agents', 'Multi-MCP', 'Orchestration', 'Guardrails'],
          prerequisites: ['c-m6-l03'],
          path: '/academy/modules/m06-mcp/lesson-04-agentes-mcp',
          objectives: ['Conectar agentes V2-V6 de M05 con múltiples servidores MCP coordinados para resolver tickets reales de software con validación E2E'],
          resources: []
        },
        {
          id: 'l-m6-lab',
          title: 'Laboratorio 06 — Construcción de una Integración MCP',
          order: 5,
          duration: '90 min',
          difficulty: 'EXPERT',
          icon: '🔬',
          tags: ['Lab', 'Capstone', 'Real Engineering', 'Final'],
          type: 'LAB',
          prerequisites: ['c-m6-l04'],
          path: '/academy/modules/m06-mcp/lab-06-integracion-mcp',
          objectives: ['Integrar un servidor MCP útil con el agente existente, documentar arquitectura, herramientas, errores y culminar el programa formativo al 24 de octubre de 2026'],
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
