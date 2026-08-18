import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Patrones de Razonamiento (c5)
 * Módulo 02 — Ingeniería de Prompts
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c5',
  sections: [
    {
      id: 'structured-problem-solving',
      title: '01. Structured Problem Solving',
      subtitle: 'Estructurando el pensamiento del modelo frente a problemas complejos',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un LLM predice el siguiente token basándose en el contexto previo. Si le pides una respuesta compleja directamente (Zero-Shot), debe generar la respuesta final de inmediato sin espacio para descomponer la lógica. Esto suele causar alucinaciones o análisis superficiales.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Petición Directa (Frágil)',
            subtitle: 'Zero-Shot Directo',
            icon: '❌',
            badge: 'Frágil',
            points: [
              'Input: "¿Es este código seguro? [Código de 500 líneas]"',
              'Output: "Sí, parece seguro."',
              'El modelo adivina la conclusión sin generar tokens intermedios de análisis, omitiendo vectores de ataque sutiles.'
            ]
          },
          right: {
            title: 'Descomposición Estructurada',
            subtitle: 'Razonamiento Guiado',
            icon: '✅',
            badge: 'Robusto',
            active: true,
            points: [
              'Flujo: Decomposition → Intermediate structure → Verification → Final answer.',
              'Obliga al modelo a desglosar el flujo de datos y sanitización antes de emitir un veredicto.',
              'Genera un espacio de tokens que sirve de contexto para la predicción final.'
            ]
          }
        }
      ]
    },
    {
      id: 'chain-of-thought',
      title: '02. Chain of Thought (CoT)',
      subtitle: 'La navaja suiza del razonamiento en LLMs',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'CoT es el patrón de razonamiento más extendido. Consiste en instruir al modelo explícitamente a pensar paso a paso. No es magia: es obligar al modelo a generar tokens intermedios de razonamiento que luego formarán parte del contexto para predecir con alta probabilidad la respuesta final correcta.'
        },
        {
          type: 'CODE',
          filename: 'zero-shot-cot.prompt',
          language: 'text',
          code: `Analiza la siguiente vulnerabilidad en el código.
Antes de dar un veredicto, piensa paso a paso:
1. Identifica el flujo de datos de entrada.
2. Identifica si hay sanitización.
3. Evalúa el impacto potencial.
Finalmente, genera tu reporte.`
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'Aviso de Costos y Latencia (FinOps)',
          message: 'CoT consume más tokens de salida (mayor costo y latencia auto-regresiva). No uses CoT para extraer un Regex o formatear un JSON simple. Usa CoT exclusivamente cuando el problema requiera evaluación, comparación o síntesis lógica compleja.'
        }
      ]
    },
    {
      id: 'descomposicion-de-problemas',
      title: '03. Descomposición de Problemas (Least-to-Most)',
      subtitle: 'Divide y vencerás en tareas de gran escala',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'A veces, Chain of Thought no es suficiente porque la tarea es demasiado amplia para una sola inferencia. Necesitas Structured Problem Solving (Least-to-Most prompting): forzar al modelo a generar un plan de acción y luego usar código para ejecutar cada paso iterativamente.'
        },
        {
          type: 'CODE',
          filename: 'least-to-most-plan.prompt',
          language: 'text',
          code: `Tarea: Migrar este módulo Angular 1.x a Angular 17.
Primero, lista los pasos exactos que tomarías (componentes, servicios, dependencias).
No escribas código aún, solo el plan estructurado de migración.`
        }
      ]
    },
    {
      id: 'seleccion-de-patron',
      title: '04. Conclusión: Cuándo Pensar y Cuándo Actuar',
      subtitle: 'Criterios de selección para el arquitecto de software',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Matriz de Selección de Patrón',
          items: [
            'Extracción / Transformación simple: No uses CoT. Ejecuta directo (Zero-Shot o Few-Shot) para minimizar latencia y costo.',
            'Lógica / Análisis de Código / Auditoría: Usa Chain of Thought para forzar generación de tokens intermedios de verificación.',
            'Tareas Complejas / Refactorizaciones masivas: Usa Descomposición (Least-to-Most) generando primero el plan de acción sin código.'
          ]
        }
      ]
    }
  ]
};
