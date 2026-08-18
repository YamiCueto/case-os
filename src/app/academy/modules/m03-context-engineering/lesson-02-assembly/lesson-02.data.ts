import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Ensamblaje y Priorización (c8)
 * Módulo 03 — Ingeniería de Contexto
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c8',
  sections: [
    {
      id: 'concatenacion-ingenua',
      title: '01. El Problema de la Concatenación Ingenua',
      subtitle: 'No todo cabe. No todo importa. No todo debe enviarse.',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Cuando un desarrollador empieza con IA, construye el contexto así: context = history + user + search_results. A medida que la aplicación crece, esto satura la ventana de contexto, aumenta la latencia y degrada la atención del modelo (Attention Collapse).'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'Fenómeno Lost in the Middle',
          message: 'Los LLMs sufren un fenómeno donde prestan mucha atención al principio del prompt (instrucciones) y al final (input reciente), pero "olvidan" o ignoran los datos amontonados en el medio. Más contexto no significa mayor inteligencia. Significa mayor distracción.'
        }
      ]
    },
    {
      id: 'criterios-de-seleccion',
      title: '02. Criterios de Selección',
      subtitle: 'Decidiendo qué pasa a la inferencia',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'El Assembly es el proceso de construir el Context Payload de forma deliberada usando 3 reglas fundamentales:'
        },
        {
          type: 'EXAMPLE',
          title: 'Los 3 Filtros de Priorización de Contexto',
          content: [
            '1. Relevancia (Relevance): Si el usuario pregunta por el clima, descartar inmediatamente los resultados de RAG sobre políticas de la empresa.',
            '2. Recencia (Recency): En el historial de chat (Conversation Context), los últimos 3 mensajes valen más que el mensaje 45 de hace dos horas.',
            '3. Redundancia (Redundancy): No envíes la biografía completa del usuario en cada petición si la tarea es solo "corregir ortografía".'
          ],
          caption: 'Priorizar significa filtrar y descartar información antes de la serialización del payload.'
        }
      ]
    },
    {
      id: 'assembly-template',
      title: '03. Assembly Template',
      subtitle: 'Estructurando el Payload Final mediante XML Tags',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Una vez priorizada la información, debe inyectarse utilizando marcas sintácticas claras (Markdown o XML Tags). Un payload ensamblado debe verse como un documento técnico estructurado, no como un chat.'
        },
        {
          type: 'CODE',
          filename: 'structured-payload.xml',
          language: 'xml',
          code: `<system_instructions>
Eres un agente de soporte nivel 2...
</system_instructions>

<application_state current_page="/billing">
user_plan: "premium"
outstanding_invoices: 0
</application_state>

<knowledge_context>
[Snippet 1: Política de reembolsos (Score: 0.92)]
[Snippet 2: Tiempos de cancelación (Score: 0.88)]
</knowledge_context>

<user_input>
Quiero cancelar mi suscripción.
</user_input>`
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Estructura de Contexto',
          message: 'Los delimitadores XML permiten al modelo desambiguar inequívocamente entre instrucciones del sistema, datos de aplicación, conocimiento recuperado y la petición del usuario, protegiendo al sistema contra inyecciones accidentales de contexto.'
        }
      ]
    },
    {
      id: 'presupuesto-y-compresion',
      title: '04. Conclusión: El Presupuesto de Tokens',
      subtitle: 'Hacia la compresión',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Budget de Tokens & Próximos Pasos',
          items: [
            'Incluso con Assembly y Prioritization, es posible que el payload final exceda el presupuesto técnico (la ventana de tokens) o el presupuesto económico (lo que estás dispuesto a pagar por inferencia).',
            'Ahí entra el último paso de la ingeniería del contexto: La Compresión.'
          ]
        }
      ]
    }
  ]
};
