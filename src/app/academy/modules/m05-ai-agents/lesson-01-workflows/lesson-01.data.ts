import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — Flujos de Trabajo vs Agentes (c13)
 * Módulo 05 — Agentes de IA
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c13',
  sections: [
    {
      id: 'escalera-de-autonomia',
      title: '01. La Escalera de la Autonomía',
      subtitle: 'La autonomía es un costo operacional, no un objetivo por sí mismo',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En ingeniería de software con IA, la autonomía no es un objetivo, es un costo. Mientras más autonomía otorgas a un modelo, menor es tu control sobre la ejecución, la latencia y los costos económicos.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla Arquitectónica: Least Autonomy Necessary',
          message: 'Construye utilizando siempre el nivel más bajo de autonomía que resuelva de forma robusta tu caso de uso.'
        }
      ]
    },
    {
      id: 'deterministic-workflow',
      title: '02. Nivel 1: Flujo Determinista (Static Pipeline)',
      subtitle: 'Cero autonomía, control absoluto',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'El código dicta la secuencia estricta. El LLM es solo una función determinista dentro del pipeline:'
        },
        {
          type: 'CODE',
          filename: 'static-pipeline-sequence.txt',
          language: 'text',
          code: `User Input ──► App Code (Validation) ──► LLM (Extraction/Transform) ──► App Code (Persist/Response)`
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Características del Pipeline Estático',
          items: [
            'Predictibilidad: Máxima (100% control del flujo en código).',
            'Costo y Latencia: Mínima (1 sola llamada al LLM).',
            'Casos de Uso: Clasificación, Extracción RAG, Traducción, Resúmenes estructurados.'
          ]
        }
      ]
    },
    {
      id: 'tools-vs-agent-loop',
      title: '03. Nivel 2: Tool-Using vs Nivel 3: Agent Loop',
      subtitle: 'Otorgando capacidad de decisión acotada vs ciclo interactivo',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: '2. Tool-Using Workflow',
            subtitle: 'Decisión Acotada (Single-Step)',
            icon: '🛠️',
            badge: 'Tool-Using',
            points: [
              'El LLM recibe una petición y una lista de herramientas.',
              'Decide qué herramienta usar y propone los parámetros.',
              'El software ejecuta la herramienta y termina (NO orquesta el ciclo).',
              'Útil para: Interfaces de búsqueda, ejecución de un solo comando (ej. "Apaga las luces").'
            ]
          },
          right: {
            title: '3. Agent Loop (ReAct)',
            subtitle: 'Multi-Step Orchestration',
            icon: '🔄',
            badge: 'Ciclo Agéntico',
            active: true,
            points: [
              'El LLM decide usar una herramienta; el sistema la ejecuta y devuelve el resultado.',
              'El LLM evalúa la observación y decide el siguiente paso iterativamente.',
              'Se repite hasta alcanzar el objetivo final.',
              'Útil para: Tareas donde los pasos dependen del resultado anterior (Research, Debugging).'
            ]
          }
        }
      ]
    },
    {
      id: 'autonomous-agent-y-conclusion',
      title: '04. Nivel 4: Agente Autónomo',
      subtitle: 'El extremo de la escalera: la caja negra total',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Riesgo de la Autonomía Extrema',
          message: 'Un agente verdaderamente autónomo recibe un objetivo general ("Maximiza las ventas") y decide por sí mismo qué workflows iniciar, qué herramientas descubrir y cuándo detenerse, a menudo ejecutándose en background por horas. Son impredecibles y difíciles de evaluar. La mayoría de los sistemas empresariales se benefician de mantener la autonomía acotada y utilizar workflows deterministas siempre que sea suficiente.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Arquitectura Agéntica',
          items: [
            'La autonomía introduce no-determinismo: aplícala solo donde las ramas de decisión no puedan codificarse en reglas deterministas.',
            'Prefiere Tool-Using Workflows sobre Agent Loops si el número de pasos es conocido de antemano.',
            'A mayor grado de autonomía, más estrictos deben ser los límites de seguridad y monitoreo FinOps.'
          ]
        }
      ]
    }
  ]
};
