import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — Anatomía del Contexto (c7)
 * Módulo 03 — Ingeniería de Contexto
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c7',
  sections: [
    {
      id: 'ilusion-de-omnisciencia',
      title: '01. La Ilusión de Omnisciencia',
      subtitle: 'El modelo no ve tu aplicación; solo ve lo que decides enviarle',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Como humanos, al interactuar con una interfaz asumimos que el modelo "sabe" qué página estamos viendo, qué usuario somos o qué datos acabamos de guardar. Esto es falso: un LLM en producción es una API stateless (sin memoria) donde cada inferencia arranca desde cero.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Paradigma Base de Context Engineering',
          message: 'Ingeniería de Contexto no es "escribir párrafos largos en el prompt". Es el proceso arquitectónico de capturar el estado dinámico de tu aplicación y transformarlo en texto estructurado antes de tocar la API del LLM.'
        }
      ]
    },
    {
      id: 'seis-fuentes-de-verdad',
      title: '02. Las Seis Fuentes de Verdad',
      subtitle: 'El mapa de orígenes de información en un sistema de IA',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Para alimentar un modelo en tiempo de ejecución, el sistema de software extrae información de seis fuentes distintas:'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Taxonomía de Fuentes de Contexto',
          items: [
            '1. Static Context: Reglas de negocio fijas, directivas del sistema (System Prompts). No cambian entre peticiones.',
            '2. User Context: Perfil, permisos, preferencias o ubicación del usuario ejecutando la acción.',
            '3. Application State: Datos de la pantalla actual (ej. "El usuario está viendo la factura #1024").',
            '4. Retrieved Context: Conocimiento dinámico inyectado desde bases vectoriales (RAG) o búsquedas tradicionales.',
            '5. Tool Context: Resultados de funciones que el modelo acaba de ejecutar en background.',
            '6. Conversation Context: El historial de mensajes previos (que a menudo es el que más basura acumula).'
          ]
        }
      ]
    },
    {
      id: 'disponible-vs-util',
      title: '03. Disponible vs. Útil',
      subtitle: 'El síndrome de Diógenes en el Prompt',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'El error de ingeniería más común es concatenar las seis fuentes de contexto sin discriminar y enviarlas al LLM.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Contexto Disponible',
            subtitle: 'Todo lo Accesible',
            icon: '🚨',
            badge: 'Sobrecarga / Ruido',
            points: [
              'Toda la información a la que tu backend tiene acceso en bases de datos y sesiones.',
              'El perfil completo de BD del usuario, los 50 mensajes previos, todo el contenido de la página actual.',
              'Satura la ventana de contexto, encarece la inferencia y diluye la atención del modelo.'
            ]
          },
          right: {
            title: 'Contexto Útil',
            subtitle: 'Lo Estrictamente Necesario',
            icon: '🎯',
            badge: 'Mínimo Indispensable',
            active: true,
            points: [
              '¿Qué información necesita realmente el modelo para resolver ESTA tarea puntual?',
              'Si la tarea es resumir un ticket, no necesitas su historial de compras de hace 2 años.',
              'Maximiza la densidad de señal y minimiza el riesgo de alucinación.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Pregunta Fundamental',
          message: '"Si le dieras esta misma información (y nada más) a un colega humano recién contratado... ¿podría resolver el problema?" Si la respuesta es no, te falta contexto útil. Si la respuesta es "se confundiría con tanta información", tienes demasiada basura disponible.'
        }
      ]
    },
    {
      id: 'cierre-anatomia',
      title: '04. Conclusión: Hacia el Ensamblaje',
      subtitle: 'De la identificación de fuentes a la arquitectura de inyección',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Anatomía de Contexto',
          items: [
            'Los LLMs son stateless: el estado de la aplicación debe ser reconstruido e inyectado explícitamente en cada llamada.',
            'Distingue siempre entre lo que tu sistema TIENE disponible y lo que la tarea específica NECESITA.',
            'El exceso de contexto degrada la atención del modelo (Attention Dilution).'
          ]
        },
        {
          type: 'DEMO_REF',
          demoId: 'd3',
          title: 'Demo 03 — Diseñar el Contexto',
          description: 'Experimenta con presupuestos de tokens, fuentes de contexto indispensables y eliminación de ruido para alcanzar el Minimum Useful Context.',
          path: '/academy/modules/m03-context-engineering/demo-engineer-context',
          actionLabel: 'Probar Demo 03'
        }
      ]
    }
  ]
};
