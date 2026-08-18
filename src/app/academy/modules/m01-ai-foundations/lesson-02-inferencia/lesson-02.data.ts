import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Anatomía de la Inferencia (c2)
 * Módulo 01 — Fundamentos de IA
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c2',
  sections: [
    {
      id: 'anatomia-del-token',
      title: '01. ¿Qué es un Token?',
      subtitle: 'La unidad fundamental de cómputo en modelos de lenguaje',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un modelo de lenguaje no procesa palabras completas ni caracteres individuales: opera exclusivamente sobre tokens. Un token es un fragmento de texto estadístico (una sílaba, una palabra corta o un símbolo).'
        },
        {
          type: 'EXAMPLE',
          title: 'Ejemplo de Segmentación de Tokens',
          content: [
            'La frase "Ingeniería de software" se segmenta en sub-palabras: ["Ingen", "ier", "ía", " de", " software"].',
            'Cada token es mapeado a un identificador numérico (ID) dentro del vocabulario del modelo antes de ingresar a los tensores de cómputo.'
          ],
          caption: 'Por eso los LLMs tienen dificultades con anagramas o conteo de letras: procesan fragmentos estadísticos, no caracteres aislados.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Reglas de Tokenización en Ingeniería',
          items: [
            'En inglés, 1 token equivale aproximadamente a ¾ de una palabra (100 tokens ≈ 75 palabras).',
            'En español, código fuente y lenguajes no latinos, cada palabra suele dividirse en múltiples tokens, aumentando el costo y la latencia.',
            'El modelo convierte estos tokens en IDs enteros para procesarlos matemáticamente mediante operaciones matriciales.'
          ]
        }
      ]
    },
    {
      id: 'ventana-de-contexto',
      title: '02. La Ventana de Contexto',
      subtitle: 'La memoria de trabajo de la inferencia',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Todo modelo tiene un límite máximo de tokens que puede procesar simultáneamente en una sola llamada. Este límite incluye estrictamente la suma de los tokens del prompt de entrada más los tokens de la respuesta generada.'
        },
        {
          type: 'EXAMPLE',
          title: 'Evolución de Límites de Context Window',
          content: [
            'GPT-3 (Legacy): 4K tokens de contexto.',
            'Claude 3 / GPT-4o: 128K – 200K tokens de contexto.',
            'Gemini 1.5 Pro / 2.0: Hasta 2 Millones de tokens de contexto.'
          ],
          caption: 'Una ventana más amplia permite mayor información, pero incrementa el tiempo de procesamiento y el costo de cada llamada.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Restricción de Ingeniería de Contexto',
          message: 'Inyectar cientos de miles de tokens en cada petición incrementa la latencia y los costos de computación. Context Engineering consiste en seleccionar, ensamblar y priorizar únicamente el contexto mínimo indispensable para resolver la tarea.'
        }
      ]
    },
    {
      id: 'temperatura-y-sampling',
      title: '03. Temperatura y Sampling',
      subtitle: 'Controlando la distribución probabilística en tiempo de ejecución',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Al predecir el siguiente token, el LLM calcula una distribución de probabilidad para todos los tokens posibles de su vocabulario. La Temperatura manipula matemáticamente esas probabilidades antes del muestreo (sampling).'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Temperatura Baja (0.0 – 0.2)',
            subtitle: 'Determinismo & Extracción',
            icon: '🎯',
            badge: 'Temp: 0.0',
            points: [
              'El modelo selecciona casi siempre el token con mayor probabilidad matemática (ArgMax).',
              'Respuestas consistentes, estructuradas, repetitivas y reproducibles.',
              'Ideal para: Pipelines RAG, generación de código, esquemas JSON y validación.'
            ]
          },
          right: {
            title: 'Temperatura Alta (0.7 – 1.0+)',
            subtitle: 'Creatividad & Variabilidad',
            icon: '🎨',
            badge: 'Temp: 0.8+',
            active: true,
            points: [
              'Se suaviza la curva de distribución, permitiendo que tokens con menor probabilidad sean seleccionados.',
              'Respuestas variadas, creativas y con mayor divergencia semántica.',
              'Ideal para: Lluvia de ideas, redacción exploratoria y generación de alternativas.'
            ]
          }
        }
      ]
    },
    {
      id: 'economia-de-la-inferencia',
      title: '04. Economía de la Inferencia',
      subtitle: 'FinOps para ingenieros de Inteligencia Artificial',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'En arquitecturas de producción con APIs comerciales, el costo de cómputo se divide en dos fases con dinámicas de procesamiento totalmente diferentes:'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Input Tokens (Prompt)',
            subtitle: 'Procesamiento en Paralelo',
            icon: '📥',
            badge: 'Input',
            points: [
              'Se procesan simultáneamente en la GPU en una sola pasada matricial.',
              'Menor latencia de procesamiento y menor costo por millón de tokens.',
              'Optimizables mediante filtrado de contexto, compresión y Prompt Caching.'
            ]
          },
          right: {
            title: 'Output Tokens (Generación)',
            subtitle: 'Procesamiento Auto-regresivo',
            icon: '📤',
            badge: 'Output (Costoso)',
            active: true,
            points: [
              'Se generan de forma estrictamente secuencial, token por token.',
              'Cuestan típicamente entre 3x y 5x más por millón de tokens que el input.',
              'Determinan directamente la latencia de respuesta visible por el usuario.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Optimización de Costos',
          message: 'Diseñar prompts que fuercen respuestas concisas y estructuradas (JSON estricto sin explicaciones conversacionales) no solo elimina la fragilidad del parsing; reduce sustancialmente el costo operativo y la latencia del sistema.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd1',
          title: 'Demo 01 — Token Playground',
          description: 'Comprueba empíricamente cómo el texto se segmenta en tokens, compara la densidad de tokens entre inglés y español y calcula los costos de inferencia en tiempo real.',
          path: '/academy/modules/m01-ai-foundations/demo-token-playground',
          actionLabel: 'Experimentar en Token Playground'
        }
      ]
    }
  ]
};
