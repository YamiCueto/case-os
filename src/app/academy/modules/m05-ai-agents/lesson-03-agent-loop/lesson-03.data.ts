import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — El Bucle del Agente (c15)
 * Módulo 05 — Agentes de IA
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c15',
  sections: [
    {
      id: 'corazon-del-agente',
      title: '01. El Corazón del Agente: Action ──► Observation ──► State',
      subtitle: 'Un agente es un modelo metido dentro de un bucle de control de software',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un agente no es un LLM súper-inteligente. Un agente es simplemente un modelo metido dentro de un bucle (Loop) en tu código. Este bucle operacional se conoce frecuentemente por el patrón ReAct (Reason + Act), pero lo crucial no es el "Thought" interno, sino la capacidad de actuar y observar las consecuencias.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Bucle Operacional Básico',
          message: 'El código le da un objetivo al LLM. El LLM propone una Acción. El código la ejecuta deterministamente y le devuelve la Observación. Con esta nueva información acumulada en el contexto, el LLM propone la siguiente acción, hasta que decide que tiene suficiente información para dar la Respuesta Final.'
        }
      ]
    },
    {
      id: 'ciclo-en-accion-trace',
      title: '02. El Ciclo Agéntico en Acción',
      subtitle: 'Resolviendo consultas complejas mediante trazas operacionales',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Analicemos cómo el loop resuelve la petición: "¿Qué clima hace hoy en Madrid? Mándale el reporte a Juan":'
        },
        {
          type: 'CODE',
          filename: 'agent-loop-execution-trace.txt',
          language: 'text',
          code: `[Step 1] LLM Action:         call getWeather(city="Madrid")
         Code Observation:   "24 grados, parcialmente nublado"

[Step 2] LLM Action:         call searchKnowledge(query="email de Juan")
         Code Observation:   "juan@empresa.com"

[Step 3] LLM Action:         call sendEmail(to="juan@empresa.com", body="En Madrid hace 24 grados...")
         Code Observation:   "Success: Email sent"

[Step 4] LLM Action:         Return Final Answer ("He consultado el clima y enviado el reporte a Juan.")`
        }
      ]
    },
    {
      id: 'guardrails-operacionales',
      title: '03. Guardrails Operacionales',
      subtitle: 'Previniendo bucles infinitos y colapso de presupuesto',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Los Agent Loops son potentes, pero si una herramienta falla o el LLM se confunde, pueden entrar en un loop infinito (ej. intentar llamar a search() repetidamente con el mismo error).'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Max Iterations',
            subtitle: 'Límite Duro de Control',
            icon: '🛑',
            badge: 'Límite Crítico',
            points: [
              'El código DEBE forzar un límite duro (ej. max_steps = 10).',
              'Si el agente no ha terminado en 10 ciclos, se aborta.',
              'Se devuelve un error claro y controlado al usuario en lugar de colapsar el sistema.'
            ]
          },
          right: {
            title: 'Cost & Latency Control',
            subtitle: 'Monitoreo FinOps del Loop',
            icon: '💸',
            badge: 'Monitoreo FinOps',
            active: true,
            points: [
              'Cada iteración del loop consume tokens adicionales de entrada y salida.',
              'Se debe monitorear el crecimiento acumulativo del contexto.',
              'Controlar el impacto en latencia y costos económicos por petición.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Oro de Guardrails Agénticos',
          message: 'Nunca ejecutes un Agent Loop sin un límite superior de iteraciones (max_steps), timeouts por herramienta y validación estricta de parámetros en el código interceptor.'
        }
      ]
    },
    {
      id: 'del-concepto-a-la-practica-m05',
      title: '04. Del Concepto a la Práctica: Módulo 05',
      subtitle: 'Orquestando la autonomía en código',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos cubierto la escalera de autonomía (Least Autonomy Necessary), el contrato de Tool Calling con esquemas JSON, y el ciclo operacional Action ──► Observation con guardrails de control de flujo. Es hora de pasar a la práctica interactiva.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd5',
          title: 'Demo 05 — El Bucle del Agente',
          description: 'Opera un ciclo de toma de decisiones (Intent ──► Action ──► Observation) manualmente. Experimenta con fallos de herramientas y límites de iteraciones para prevenir bucles infinitos.',
          path: '/academy/modules/m05-ai-agents/demo-agent-loop',
          actionLabel: 'Probar Demo 05'
        },
        {
          type: 'LAB_REF',
          labId: 'l5',
          title: 'Laboratorio 05 — Diseñar un Flujo de Trabajo Agéntico',
          description: 'Justifica el grado de autonomía necesario para un problema legacy corporativo y diseña la especificación formal del agente con contratos de herramientas y guardrails.',
          path: '/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 05'
        }
      ]
    }
  ]
};
