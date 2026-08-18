import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Compresión y Validación (c9)
 * Módulo 03 — Ingeniería de Contexto
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c9',
  sections: [
    {
      id: 'presupuesto-de-tokens',
      title: '01. El Presupuesto de Tokens',
      subtitle: 'Comprimir no es truncar. Es destilar.',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Todo modelo tiene una ventana máxima de tokens (ej. 128k) y un costo por token de entrada. Tratar de enviarlo todo no solo es caro, también vuelve lento al sistema. La compresión técnica busca maximizar la densidad de información útil por token.'
        },
        {
          type: 'EXAMPLE',
          title: 'Pipeline Completo de Ingeniería de Contexto',
          content: [
            '1. Raw Context (🗂️) ──► Captura de estado en bases de datos, sesión y RAG.',
            '2. Select (🧲) ──► Filtrado estricto por relevancia, recencia y redundancia.',
            '3. Assemble (🧩) ──► Estructuración con etiquetas XML y delimitadores semánticos.',
            '4. Compress (🗜️) ──► Destilación técnica y eliminación de ruido estructural.',
            '5. Validate (✅) ──► Comprobación de límites de presupuesto antes de llamar a la API.'
          ],
          caption: 'El ciclo completo garantiza que el modelo reciba la máxima señal con el mínimo costo y latencia.'
        }
      ]
    },
    {
      id: 'tecnicas-de-compresion',
      title: '02. Técnicas de Compresión',
      subtitle: 'Truncar es para amateurs; destilar es para ingenieros',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Truncation (Evitar)',
            subtitle: 'Corte Ciego de Strings',
            icon: '✂️',
            badge: 'Frágil',
            points: [
              'Cortar un string a los primeros 4000 caracteres.',
              'Rompe el formato (ej. corta JSON por la mitad o código a mitad de función).',
              'Destruye XML tags y pierde la información más reciente ubicada al final.',
              'Provoca errores de sintaxis y alucinaciones en el modelo.'
            ]
          },
          right: {
            title: 'Distillation (Ideal)',
            subtitle: 'Limpieza y Resumen Estructurado',
            icon: '🗜️',
            badge: 'Ingeniería Robusta',
            active: true,
            points: [
              'Usar código para limpiar el contexto: eliminar campos null o vacíos de un JSON.',
              'Remover clases CSS y scripts irrelevantes si se inyecta HTML.',
              'Resumir el historial de conversación con un modelo rápido y económico antes de llamar al modelo pesado.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Oro de la Compresión',
          message: 'Nunca trunques texto sin respetar los límites sintácticos del formato. La compresión efectiva elimina ruido estructural (HTML/JSON boilerplate) y preserva la semántica factual.'
        }
      ]
    },
    {
      id: 'realidad-de-la-inferencia',
      title: '03. Validación de Contexto',
      subtitle: 'La promesa vacía y la realidad de los sistemas probabilísticos',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'Concepto de Ingeniería de Sistemas',
          message: 'Un contexto perfectamente seleccionado, ensamblado, priorizado y comprimido NO garantiza una respuesta correcta. Simplemente hace que el sistema probabilístico tenga las mejores condiciones matemáticas posibles para producirla.'
        },
        {
          type: 'PARAGRAPH',
          text: 'La validación del Context Payload te asegura que no fallaste por falta de información. Si el LLM falla con un contexto perfecto, el problema está en las capacidades del modelo (Model) o en sus reglas (Instruction).'
        }
      ]
    },
    {
      id: 'del-concepto-a-la-practica-m03',
      title: '04. Del Concepto a la Práctica: Módulo 03',
      subtitle: 'Es hora de construir el contexto en código',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos cubierto los tres pilares de Context Engineering: la anatomía del contexto con las 6 fuentes de verdad, los criterios de ensamblaje con XML, y las técnicas de destilación y presupuesto de tokens. Es momento de pasar a la práctica interactiva.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd3',
          title: 'Demo 03 — Diseñar el Contexto',
          description: 'Experimenta interactivamente con presupuestos de tokens, fuentes de contexto indispensables y eliminación de basura o promociones para alcanzar el Minimum Useful Context.',
          path: '/academy/modules/m03-context-engineering/demo-engineer-context',
          actionLabel: 'Probar Demo 03'
        },
        {
          type: 'LAB_REF',
          labId: 'l3',
          title: 'Laboratorio 03 — Construir el Contexto Mínimo Útil',
          description: 'Construye un Context Manifest justificado para una tarea real de modernización corporativa. Diseña el pipeline de selección, ensamblaje y compresión en tu entorno local.',
          path: '/academy/modules/m03-context-engineering/lab-03-build-minimum-useful-context',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 03'
        }
      ]
    }
  ]
};
