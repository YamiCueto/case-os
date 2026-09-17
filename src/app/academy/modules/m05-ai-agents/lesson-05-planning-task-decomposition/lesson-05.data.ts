import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 05 — Planificación y Descomposición de Tareas (c-m5-l05)
 * Módulo 05 — Agentes de IA
 * Enfoque: Evolución acumulativa de Agent v3 a Agent v4 mediante Plan, PlanStep, MockPlanner,
 * gobernanza del runtime, salida segura no_executable_steps e historial inmutable de revisiones.
 */
export const LESSON_05_DOCUMENT: LessonDocument = {
  lessonId: 'c-m5-l05',
  sections: [
    {
      id: 'problema-agente-reactivo',
      title: '01. El Problema Detonante: La Ceguera del Agente Reactivo',
      subtitle: 'Por qué un bucle reactivo paso a paso colapsa ante metas compuestas con dependencias',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En las lecciones anteriores dotamos a nuestro agente de un bucle de control (Agent Loop en L03) y de memoria persistente gobernada por software (State & Memory en L04). Sin embargo, Agent v3 sigue siendo esencialmente reactivo: tras cada observación decide únicamente cuál es la siguiente llamada inmediata, sin una visión panorámica de lo que falta, de lo que ya completó ni de las dependencias que condicionan el éxito.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Planning ≠ Chain-of-Thought (El Plan es Datos, No Pensamiento Oculto)',
          message: 'Planificar no es pedirle al LLM "piensa paso a paso" o "muestra tu razonamiento interno" en un bloque de texto libre. Ese enfoque produce prosa desestructurada imposible de auditar, controlar o interrumpir por software. En Agent Engineering, el plan es un modelo de datos observable y tipado (Goal, Steps, Status, Executor) gobernado por el runtime en Python.'
        },
        {
          type: 'PARAGRAPH',
          text: 'Cuando el usuario formula una meta de múltiples fases ("Auditar incidentes recientes, correlacionar con el último despliegue y emitir recomendación"), un agente puramente reactivo es propenso al desvío de plan (plan drift), invocando herramientas desconectadas o concluyendo apresuradamente sin evidencia suficiente.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'reactive-vs-planned'
        }
      ]
    },
    {
      id: 'anatomia-plan-datos',
      title: '02. El Plan como Estructura de Software y Diversidad de Ejecutores',
      subtitle: 'Separación ontológica: Goal, PlanStep, StepStatus y StepExecutor (TOOL / RUNTIME / MODEL)',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Para transformar una intención abstracta en un proceso confiable, el runtime descompone la meta en un grafo observable de unidades de trabajo (PlanStep). Cada paso define quién lo ejecuta, de qué otros pasos depende y cuál es su estado operacional en cada ciclo.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Agente Reactivo (Agent v3)',
            subtitle: 'Decisión local sin representación del plan global',
            badge: 'Decisión Local Inmediata',
            points: [
              'No mantiene una representación explícita del plan global (Goal + Steps + Dependencias + Progreso).',
              'Evalúa únicamente (contexto + última observación) -> siguiente acción en cada ciclo.',
              'Puede seleccionar alternativas ante errores, pero carece de un mapa global y tipado de su trayectoria.',
              'Apropiado para consultas directas o flujos atómicos sin dependencias complejas (Least Autonomy Necessary).'
            ]
          },
          right: {
            title: 'Agente Planificador (Agent v4)',
            subtitle: 'Mantiene Goal + Steps + Dependencias + Progreso',
            badge: 'Grafo Observable Tipado',
            points: [
              'Descompone la meta en un modelo formal observable (Plan, PlanStep, depends_on, revision).',
              'El software valida dependencias topológicas antes de autorizar la ejecución de cada paso.',
              'Distingue ejecutores: TOOL (APIs externas), RUNTIME (cálculo determinista en CPU), MODEL (síntesis LLM).',
              'Completitud derivada (is_completed): requiere que todos los pasos estén resueltos o válidamente omitidos (SKIPPED).'
            ]
          }
        },
        {
          type: 'PARAGRAPH',
          text: 'Un error pedagógico común es asumir que todo paso de un plan equivale a una llamada a herramienta (Tool Call). En Agent v4 formalizamos el enum StepExecutor para distinguir operaciones externas de red (TOOL), transformaciones algorítmicas locales en CPU deterministas sin costo de tokens (RUNTIME), y tareas de redacción o inferencia cualitativa (MODEL).'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'plan-inspector'
        }
      ]
    },
    {
      id: 'runtime-governance-replanning',
      title: '03. Gobernanza del Runtime, Contingencias y la Invariante de Meta',
      subtitle: 'Resolución de dependencias, detección de deadlocks (no_executable_steps) y replanning con historia',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'El modelo propone el plan, pero es el software soberano quien controla la ejecución: valida la ausencia de dependencias inexistentes o reflexivas, selecciona qué paso ejecutar según sus prerrequisitos y detecta de forma inmediata si existe un bloqueo irresoluble.'
        },
        {
          type: 'CALLOUT',
          variant: 'caution',
          title: 'Invariante de Meta y Conservación de Historia en Replanning',
          message: 'Replanificar no es borrar el pasado ni empezar de cero. Ante un fallo en S2 (ej. 503 Service Unavailable), el runtime archiva un snapshot inmutable de la Revisión 1 en state.plan_history y activa la Revisión 2 con un paso alternativo (S2b). Invariante absoluta: el replanning puede alterar pasos, orden y estrategias, pero JAMÁS puede modificar silenciosamente la meta (goal) original asignada por el usuario.'
        },
        {
          type: 'PARAGRAPH',
          text: 'Diferenciamos dos niveles de control: a nivel de validación previa (PlanValidator), los ciclos estáticos y dependencias rotas se detectan y rechazan antes de iniciar la ejecución (PlanValidationError). A nivel de runtime, si un paso falla de forma irrecuperable y los pasos subsiguientes dependen de él sin alternativa válida de replanning, el software detecta el estancamiento (Runtime Stall) y concluye con termination_reason="no_executable_steps", evitando bloqueos ciegos.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'replanning-simulator'
        }
      ]
    },
    {
      id: 'taller-agent-v4',
      title: '04. Taller Práctico: De Agent v3 a Agent v4 en Python',
      subtitle: 'Evolución guiada de tu base de código para incorporar PlanValidator, MockPlanner y los Casos G1, G2 y G3',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En el Taller 05 tomarás tu script funcional de Agent v3 (L04) y construirás Agent v4. No descartarás tu dominio, tus herramientas ni tu MemoryStore: agregarás las estructuras Plan, PlanStep, StepStatus y StepExecutor, gobernarás las transiciones y validarás los tres casos clave de planificación.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Key Insights de Planificación y Agent v4',
          items: [
            'Preservación de Casos A–F: Las herramientas de catálogo (L02), el bucle con paradas duras (L03) y la memoria aislada con hydrate y write-back (L04) continúan operando íntegros.',
            'Caso G1 (Planificación Estructurada): Meta de 4 pasos dependientes con ejecutores TOOL, RUNTIME y MODEL. Verificación de ejecución secuencial ordenada y completitud derivada (is_completed).',
            'Caso G2 (Replanning con Snapshot Histórico): Fallo provocado en S2 (503). La Revisión 1 queda archivada inmutable en plan_history, S1 no se repite, S2b se completa en Revisión 2 y se cumple revision1.goal == revision2.goal.',
            'Caso G3 (Runtime Stall / no_executable_steps): Cuando un paso falla de forma no recuperable y los pasos pendientes dependen de él sin alternativa válida, el runtime detecta la imposibilidad de avanzar y activa la detención segura termination_reason="no_executable_steps".'
          ]
        }
      ]
    }
  ]
};
