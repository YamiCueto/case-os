import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Capacidades Desacopladas (c26)
 * Módulo 09 — Arquitectura de IA
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c26',
  sections: [
    {
      id: 'capacidades-desacopladas-intro',
      title: '01. Capacidades Desacopladas: Arquitectura bajo Demanda',
      subtitle: 'Diseño impulsado por requisitos, no por el hype tecnológico',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un error común es asumir que todo sistema moderno debe incorporar obligatoriamente RAG, Agentes autónomos, MCP y Grafos de Conocimiento. La arquitectura real debe surgir exclusivamente de los requisitos concretos del problema.'
        },
        {
          type: 'CODE',
          filename: 'requirements-driven-pipeline.txt',
          language: 'text',
          code: `Requirements (Requisitos de Negocio)
      │
      ▼
Capabilities (Capacidades necesarias)
      │
      ▼
Boundaries (Fronteras de aislamiento)
      │
      ▼
Interfaces (Contratos formales)
      │
      ▼
Implementation (Código concreto)`
        }
      ]
    },
    {
      id: 'least-autonomy-necessary-principio',
      title: '02. Least Autonomy Necessary: El Principio Rector',
      subtitle: 'La autonomía introduce varianza y riesgo operacional',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Autonomía Mínima Necesaria',
          message: 'Como aprendimos en M05, la autonomía es un costo operacional, no un trofeo. Úsala solo si el problema lo exige con claridad:'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Criterios de Selección Arquitectónica',
          items: [
            'Si el flujo es predecible y secuencial: NO uses un Agente; usa un Workflow determinista.',
            'Si los datos cambian con poca frecuencia: NO uses RAG dinámico pesado; usa caché o inyección estática.',
            'Si integras un único sistema local estático: NO necesitas MCP; una llamada directa tipada es superior.',
            'Si el requerimiento puede resolverse con código determinista: NO introduzcas un LLM.'
          ]
        }
      ]
    },
    {
      id: 'capacidades-como-bloques-aislados',
      title: '03. Construyendo el Puzzle: Capacidades como Bloques Independientes',
      subtitle: 'Memoria, Acción y Evaluación protegidas por fronteras',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Memoria & Contexto',
            subtitle: 'Capacidad de Recuperación',
            icon: '🧠',
            badge: 'Interface search()',
            points: [
              'Bases vectoriales o APIs de búsqueda semántica.',
              'Expone una interfaz estándar independiente de la tecnología subyacente (Pinecone, PGVector, memoria).',
              'Aislada tras un Context Boundary que filtra y enmascara datos sensibles.'
            ]
          },
          right: {
            title: 'Acción & Evaluación',
            subtitle: 'Capacidad de Ejecución y Control',
            icon: '🛡️',
            badge: 'Tool & Eval Boundaries',
            active: true,
            points: [
              'Herramientas protegidas por Tool Boundaries con validación de esquemas y Human-in-the-Loop.',
              'Pipeline de evaluación CI/CD actuando como middleware de calidad para mitigar alucinaciones.',
              'Monitoreo de observabilidad desacoplado del motor de inferencia.'
            ]
          }
        }
      ]
    },
    {
      id: 'hacia-el-caso-de-estudio-real',
      title: '04. De la Teoría a la Práctica: Hacia el Caso de Estudio',
      subtitle: 'Evaluando decisiones arquitectónicas en sistemas en producción',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos establecido los fundamentos de la arquitectura GenAI moderna: desacoplar al proveedor, instanciar capacidades únicamente bajo demanda y aislar cada bloque con fronteras seguras.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Puente a la Lección Final',
          message: 'En la siguiente lección analizaremos cómo se construyó la propia plataforma CASE OS Academy utilizando —y omitiendo deliberadamente— estas estrategias como un caso de estudio real de ingeniería.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Invariantes de Arquitectura de IA',
          items: [
            'La simplicidad arquitectónica es una virtud de ingeniería de software.',
            'Cada componente añadido (RAG, Agentes, MCP) debe justificarse con un requerimiento que no pueda resolverse de forma más simple.',
            'Las fronteras limpias permiten evolucionar el sistema componente por componente sin fricción.'
          ]
        }
      ]
    }
  ]
};
