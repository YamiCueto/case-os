import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Modelos vs Sistemas (c3)
 * Módulo 01 — Fundamentos de IA
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c3',
  sections: [
    {
      id: 'capacidad-modelo-vs-sistema',
      title: '01. Modelos vs Sistemas',
      subtitle: 'Especialización, límites y la necesidad de un exoesqueleto de software',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un modelo de lenguaje desnudo es incapaz de operar en entornos de producción. Para resolver problemas de ingeniería, el LLM debe estar envuelto y gobernado por un sistema determinista.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Capacidad del Modelo',
            subtitle: 'El Cerebro (Inteligencia Cruda)',
            icon: '🧠',
            badge: 'Modelo Crudo',
            points: [
              'Conocimiento congelado y capacidades lingüísticas derivadas de sus pesos de entrenamiento.',
              'Genera texto, traduce, resume y razona sobre patrones existentes.',
              'Sabe programar algoritmos estándar (hasta su fecha de corte).',
              'NO conoce la hora actual, APIs privadas ni el estado dinámico de tu base de datos.'
            ]
          },
          right: {
            title: 'Capacidad del Sistema',
            subtitle: 'El Exoesqueleto (Ingeniería de Software)',
            icon: '⚙️',
            badge: 'Sistema Orquestado',
            active: true,
            points: [
              'El modelo integrado y protegido por código determinista (como CASE OS).',
              'Recupera información fresca y contextualizada en tiempo de ejecución (RAG).',
              'Ejecuta herramientas, calculadoras, consultas SQL y valida esquemas de salida.',
              'Este es el sistema que diseñamos, testeamos y aseguramos los Ingenieros de Software.'
            ]
          }
        }
      ]
    },
    {
      id: 'mecanica-de-las-alucinaciones',
      title: '02. Alucinaciones: Por Qué Ocurren',
      subtitle: 'La alucinación como característica estadística y cómo defenderse',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Una "alucinación" no es un error de código ni un bug imprevisto: es una propiedad intrínseca del motor de predicción estadística. Cuando el modelo carece del dato exacto en su contexto, predice la palabra que matemáticamente suena más plausible, aunque no sea factual.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Defensas de Ingeniería contra la Alucinación',
          items: [
            'Contexto Duro (Grounding / RAG): Inyectar la información factual verificada directamente en el prompt antes de que el modelo comience a inferir.',
            'Citas y Evidencia Obligatoria: Forzar al modelo a referenciar el fragmento exacto de la documentación o código del que extrajo la respuesta.',
            'System Prompts Restrictivos: Instruir explícitamente: "Si la respuesta no se encuentra en el contexto provisto, responde únicamente: \'Información no disponible\'."',
            'Validación en Código: Implementar esquemas estrictos de validación (Zod / JSON Schema) antes de aceptar cualquier salida en los pipelines del sistema.'
          ]
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Principio de Verificación de Sistemas',
          message: 'Nunca confíes en la memoria paramétrica del modelo para datos críticos de negocio o lógica financiera. La certeza factual y la integridad de las operaciones las garantiza el Sistema mediante recuperación y validación determinista.'
        }
      ]
    },
    {
      id: 'preparacion-para-la-practica',
      title: '03. De la Teoría a la Práctica',
      subtitle: 'Consolidación del bloque fundacional',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos completado los tres pilares de fundamentos: probabilidad frente a determinismo, la anatomía de los tokens/inferencia, y la diferencia crítica entre modelo crudo y sistema orquestado. Es momento de experimentar con estas piezas en las actividades prácticas del módulo.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd1',
          title: 'Demo 01 — Token Playground',
          description: 'Experimenta en tiempo real con la tokenización, visualiza cómo el modelo segmenta oraciones complejas y calcula estimaciones de costos.',
          path: '/academy/modules/m01-ai-foundations/demo-token-playground',
          actionLabel: 'Abrir Token Playground'
        },
        {
          type: 'LAB_REF',
          labId: 'l1',
          title: 'Laboratorio 01 — Analizar una Rutina Legacy',
          description: 'Aplica el modelo mental aprendido en tu propio entorno local. Audita una rutina de código existente, separa lógica determinista de oportunidades de IA y elabora tu primer Risk & Opportunity Assessment.',
          path: '/academy/modules/m01-ai-foundations/lab-01-legacy-routine',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 01'
        }
      ]
    }
  ]
};
