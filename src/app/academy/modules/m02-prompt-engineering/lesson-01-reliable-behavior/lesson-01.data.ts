import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — Comportamiento Confiable (c4)
 * Módulo 02 — Ingeniería de Prompts
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c4',
  sections: [
    {
      id: 'mito-del-prompt-perfecto',
      title: '01. El Mito del "Prompt Perfecto"',
      subtitle: 'Determinismo absoluto vs Comportamiento reproducible',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'La ingeniería de prompts para sistemas de software no consiste en descubrir palabras mágicas, sino en diseñar restricciones reproducibles.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Determinismo Absoluto',
            subtitle: 'Mito Frecuente',
            icon: '❌',
            badge: 'Falso',
            points: [
              'Pensar que si encuentras las "palabras mágicas", el LLM se convertirá en una función matemática determinista.',
              'Asumir que la misma entrada en lenguaje natural garantizará una salida idéntica sin variación.',
              'Falso: es un motor estadístico; siempre existirá varianza en las probabilidades.'
            ]
          },
          right: {
            title: 'Comportamiento Reproducible',
            subtitle: 'Enfoque de Ingeniería',
            icon: '✅',
            badge: 'Enfoque CASE',
            active: true,
            points: [
              'Aceptar la variabilidad intrínseca y diseñar restricciones (constraints) que acorralen al modelo.',
              'Asegurar que cualquier variación semántica caiga dentro de tu caso de uso aceptable.',
              'Establecer contratos de entrada/salida comprobables por código.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Ingeniería de Prompts',
          message: 'El Prompt Engineering no busca eliminar la probabilidad; busca reducir su desviación estándar. Queremos resultados confiables, restringidos y reproducibles para nuestros pipelines de software.'
        }
      ]
    },
    {
      id: 'zero-shot-vs-few-shot',
      title: '02. Zero-Shot vs Few-Shot Prompting',
      subtitle: 'Mostrando en lugar de explicando',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'La forma en que estructuramos las instrucciones determina la probabilidad de que el modelo adopte el formato exacto requerido por el sistema.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Zero-Shot Prompting',
            subtitle: 'Instrucción sin Ejemplos',
            badge: 'Básico / Frágil',
            points: [
              'Pedirle algo al modelo sin proporcionarle ejemplos del formato esperado.',
              'Funciona para tareas universales, pero fracasa cuando necesitas contratos estrictos de salida.',
              'El modelo suele añadir texto conversacional innecesario ("¡Claro! Aquí tienes:") que rompe los parsers.'
            ]
          },
          right: {
            title: 'Few-Shot Prompting',
            subtitle: 'Alineación por Ejemplos',
            badge: 'Robusto',
            active: true,
            points: [
              'Proveer ejemplos directos del comportamiento deseado dentro del contexto del prompt.',
              'Alinea los pesos del modelo hacia la tarea y formato exacto.',
              'El modelo completa el patrón sin introducir charla conversacional.'
            ]
          }
        },
        {
          type: 'CODE',
          filename: 'zero-shot-fragil.prompt',
          language: 'text',
          code: 'Extrae las entidades de este texto y devuélvelas en formato JSON.'
        },
        {
          type: 'CODE',
          filename: 'few-shot-robusto.prompt',
          language: 'text',
          code: `Input: "Compré manzanas"
Output: ["manzanas"]

Input: "Se cayó el servidor AWS"
Output:`
        }
      ]
    },
    {
      id: 'restricciones-negativas',
      title: '03. Negative Constraints',
      subtitle: 'Lo que NO debe hacer es tan importante como lo que SÍ',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Los LLMs sufren de complacencia (sycophancy) y tienden a justificar sus respuestas. Para un flujo automatizado en producción, necesitamos cortar esa tendencia de raíz.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Instrucción Débil (NO USAR)',
            subtitle: 'Sugerencia Permisiva',
            icon: '⚠️',
            badge: 'Débil',
            points: [
              '"Intenta no incluir texto antes del JSON."',
              'El modelo lee "incluir texto" y lo interpreta como sugerencia o contexto activo.',
              'Alta tasa de fallo en casos borde.'
            ]
          },
          right: {
            title: 'Contrato Estricto (SÍ USAR)',
            subtitle: 'Negative Constraint',
            icon: '🛡️',
            badge: 'Estricto',
            active: true,
            points: [
              '"WARNING: Return ONLY valid JSON. Do not include markdown formatting. Any text outside the JSON structure will cause a system crash."',
              'Corta la generación auto-regresiva conversacional y prioriza el token de apertura JSON.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Concepto de Ingeniería de Software',
          message: 'Las negative constraints (como NO EXPLANATION) reducen la probabilidad de desviación, pero NO garantizan matemáticamente el cumplimiento. La garantía definitiva se logra mediante validación determinista externa en tu código (Zod / JSON Schema).'
        }
      ]
    },
    {
      id: 'conclusion-y-sintesis',
      title: '04. Conclusión & Resumen de Ingeniería',
      subtitle: 'Hacia un comportamiento predecible de sistema',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Comportamiento Confiable',
          items: [
            'Abandona la ilusión de convertir un modelo probabilístico en una función matemática pura mediante palabras mágicas.',
            'Reduce la desviación estándar mediante reglas explícitas en el System Prompt y ejemplos Few-Shot en el contexto.',
            'Aplica restricciones negativas estrictas ("Return ONLY...") para proteger el parser de tu aplicación.',
            'Asegura el pipeline con validación determinista en el backend.'
          ]
        },
        {
          type: 'DEMO_REF',
          demoId: 'd2',
          title: 'Demo 02 — Diseñar la Instrucción',
          description: 'Comprueba cómo las instrucciones ambiguas rompen el pipeline de backend y cómo las restricciones y ejemplos aseguran el parseo.',
          path: '/academy/modules/m02-prompt-engineering/demo-engineer-instruction',
          actionLabel: 'Probar Demo 02'
        }
      ]
    }
  ]
};
