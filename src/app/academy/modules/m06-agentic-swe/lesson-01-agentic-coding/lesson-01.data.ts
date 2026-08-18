import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — De la Autocompletación a los Agentes (c16)
 * Módulo 06 — Ingeniería de Software Agéntica
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c16',
  sections: [
    {
      id: 'de-autocompletacion-a-agentes',
      title: '01. De la Autocompletación a los Agentes',
      subtitle: 'La evolución de la asistencia generativa en ingeniería de software',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Los modelos no se convirtieron súbitamente en "mejores programadores" por arte de magia. La transición hacia el Agentic Coding ocurre porque aprendimos a rodear a estos modelos probabilísticos con infraestructuras deterministas robustas.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Concepto Clave de Agentic SWE',
          message: 'El código no es más que lógica altamente estructurada. Los LLMs son excelentes en esto, pero su verdadero poder productivo surge cuando los conectamos a contexto, herramientas y ciclos de feedback.'
        }
      ]
    },
    {
      id: 'el-salto-evolutivo',
      title: '02. El Salto Evolutivo en la Programación con IA',
      subtitle: 'De la predicción de líneas al bucle autónomo',
      blocks: [
        {
          type: 'EXAMPLE',
          title: 'Línea de Evolución Tecnológica',
          content: [
            '1. Code Completion (Copilot inicial): El modelo predice las siguientes líneas basado únicamente en el archivo actual.',
            '2. Code Generation (ChatGPT): El modelo genera un componente completo o script a partir de una instrucción aislada en lenguaje natural.',
            '3. Codebase Context (IDE RAG): El prompt se inyecta con recuperación contextual (RAG) sobre todo el repositorio para respetar tipos y convenciones.',
            '4. Agentic Coding (Sistemas Modernos): El modelo busca contexto activamente (Tool Use), propone código, ejecuta tests, lee errores del compilador y se autocorrige en un Agent Loop.'
          ],
          caption: 'Agentic Coding traslada al modelo de un autocompletador pasivo a un agente iterativo activo.'
        }
      ]
    },
    {
      id: 'suma-de-partes-m03-m04-m05',
      title: '03. Es la Suma de sus Partes (M03 + M04 + M05)',
      subtitle: 'La arquitectura detrás de un asistente agéntico de desarrollo',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Un asistente de desarrollo agéntico (como Cursor, Claude Code o Devin) no es un "modelo mágico especial". Es la orquestación coordinada de las piezas estudiadas a lo largo de este programa:'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Infraestructura de Soporte',
            subtitle: 'Contexto & Recuperación',
            icon: '🧠',
            badge: 'M03 + M04',
            points: [
              'Context Engineering (M03): El sistema decide qué archivos, librerías, dependencias y diagnósticos incluir en el prompt sin exceder el budget.',
              'Retrieval & RAG (M04): Busca fragmentos de código, definiciones de tipos y documentación similar mediante embeddings o índices sintácticos.'
            ]
          },
          right: {
            title: 'Bucle de Ejecución Agéntica',
            subtitle: 'Orquestación & Feedback',
            icon: '🔄',
            badge: 'M05 Agent Loop',
            active: true,
            points: [
              'Agent Loop (M05): El sistema propone un parche de código (Action).',
              'Ejecuta el linter o suite de tests en background (Tool).',
              'Lee el stacktrace o mensaje de error del compilador (Observation).',
              'Itera y ajusta la solución hasta que los tests pasen.'
            ]
          }
        }
      ]
    },
    {
      id: 'rol-del-humano-y-conclusion',
      title: '04. El Rol del Humano en la Era Agéntica',
      subtitle: 'El desplazamiento del trabajo hacia especificación y verificación',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Desplazamiento del Trabajo',
          message: 'Al igual que los compiladores nos liberaron de escribir código máquina, el Agentic Coding nos está liberando de la sintaxis repetitiva. Pero el modelo sigue siendo probabilístico: no "entiende" los objetivos de negocio ni la arquitectura global. Requiere especificación estricta y, sobre todo, verificación humana rigurosa.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Fundamentos de Ingeniería de Software Agéntica',
          items: [
            'Agentic SWE combina Context Engineering, Retrieval y Agent Loops en un entorno de desarrollo.',
            'El valor de la ingeniería se desplaza de la mecanografía de código hacia la especificación formal de requerimientos y el diseño de suites de tests.',
            'La verificación automática y humana es la única garantía de corrección en sistemas probabilísticos.'
          ]
        }
      ]
    }
  ]
};
