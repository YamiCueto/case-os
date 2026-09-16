import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 07 — Observabilidad y Evaluación (c-m5-l07)
 * Módulo 05 — Agentes de IA
 * Enfoque: Evolución acumulativa de Agent v5 a Agent v6 mediante Structured Agent Tracing,
 * TraceEvent con sequence_no monotónico, InMemoryTraceCollector, sanitización previa al emit,
 * RunSummary derivado de trazas, EvaluationCase (Outcome vs Trajectory), AgentEvaluator determinista.
 */
export const LESSON_07_DOCUMENT: LessonDocument = {
  lessonId: 'c-m5-l07',
  sections: [
    {
      id: 'problema-caja-negra',
      title: '01. El Problema: El Agente Gobernado Que Nadie Puede Auditar',
      subtitle: 'Por qué una respuesta final correcta no garantiza que el agente operó de forma eficiente, segura y conforme',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En L06 dotamos a Agent v5 de PolicyEvaluator, ActionProposal con binding SHA-256, compuerta Human-in-the-Loop, revalidación de precondiciones, aprobación de un solo uso con anti-replay y BudgetController con disyuntores. El agente está gobernado. Pero si falla en producción a las 3 AM, ¿qué evidencia estructurada tienes de lo que hizo? La paradoja de la respuesta final: un agente puede completar su ejecución y emitir una respuesta sintácticamente correcta mientras esconde fallas críticas que solo se detectan analizando su trayectoria completa.'
        },
        {
          type: 'CALLOUT',
          variant: 'caution',
          title: 'La Paradoja de la Respuesta Final',
          message: 'Un agente que consulta 8 veces la misma base de datos, falla 3 veces y gasta 10× más tokens y latencia puede dar exactamente la misma respuesta final que uno eficiente. Evaluado solo por su output, es indistinguible. Evaluado por su trayectoria, es un desastre operacional. En producción con 100,000 peticiones diarias, la diferencia es la quiebra financiera del sistema.'
        },
        {
          type: 'PARAGRAPH',
          text: 'L07 introduce la capa de Observabilidad y Evaluación que convierte corridas opacas en trayectorias estructuradas e inspeccionables, y convierte esas trayectorias en evidencia medible, reproducible y comparable. Esta es la segunda y última pieza de la Engineering & Control Layer (Capa 2): Agent v5 (Guardrails & HITL) + Agent v6 (Observability & Evaluation).'
        }
      ]
    },
    {
      id: 'observabilidad-vs-logging',
      title: '02. Structured Agent Tracing ≠ Logging de Consola',
      subtitle: 'La diferencia entre registrar mensajes operacionales y modelar la trayectoria agéntica como estructura analizable',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'El logging operacional (logger.info("Tool called")) produce texto no estructurado pensado para ojos humanos ocasionales. No permite agregaciones por run_id, correlación causal entre eventos, aserciones programáticas sobre la trayectoria ni detección automática de regresiones. El Structured Agent Tracing produce TraceEvents tipados con identificadores unívocos, timestamps ISO 8601, sequence_no monotónicos, referencias de paso y payloads analizables por software.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Logging Operacional',
            subtitle: 'Mensajes de texto para diagnóstico humano',
            badge: 'logger.info()',
            points: [
              'logger.info("Tool called successfully") — texto libre no estructurado.',
              'Sin run_id de correlación: ¿a cuál de 1,000 corridas paralelas pertenece este mensaje?',
              'Imposible ejecutar aserciones programáticas: assert tool_called_before_approval.',
              'Válido y necesario para diagnóstico operacional. No equivale a tracing agéntico.'
            ]
          },
          right: {
            title: 'Structured Agent Tracing',
            subtitle: 'Trayectoria agéntica tipada e inspeccionable',
            badge: 'TraceEvent',
            points: [
              'TraceEvent(event_type=TOOL_CALLED, run_id="run-abc", sequence_no=7, payload={...}).',
              'run_id correlaciona todos los eventos de una corrida específica.',
              'sequence_no monotónico permite reconstruir el orden exacto de decisiones.',
              'Consultas deterministas: ¿se invocó TOOL_CALLED después de APPROVAL_DECIDED?'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'info',
          title: 'Sin OpenTelemetry como Dependencia Base',
          message: 'En L07 el runtime corre en Python estándar en un único proceso local. La base conceptual es el rastreo estructurado en memoria (InMemoryTraceCollector), 100% determinista y offline. OpenTelemetry se presenta como la evolución natural hacia M07/M08 cuando los pasos del agente involucren microservicios remotos o múltiples agentes distribuidos. No introducimos librerías pesadas ni infraestructura externa como dependencia obligatoria.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'trace-explorer'
        }
      ]
    },
    {
      id: 'outcome-vs-trajectory',
      title: '03. Outcome vs Trajectory: Las Dos Dimensiones de la Evaluación',
      subtitle: 'Por qué juzgar un agente solo por su respuesta final es tan insuficiente como juzgar un cirujano por si el paciente sobrevivió',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'La evaluación agéntica rigurosa exige medir dos dimensiones independientes: el Outcome (¿qué obtuvo el agente?) y la Trajectory (¿cómo llegó a ese resultado?). Una respuesta final correcta no implica una corrida admisible. Una corrida que terminó en approval_rejected limpiamente puede ser un éxito rotundo de gobernanza. Evaluation ≠ Subjective Vibes: no se juzga al agente leyendo su última respuesta.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'run-comparison'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Sin Score Mágico Global',
          message: 'Se rechaza la invención de un "Agent Score 0-100" arbitrario que mezcle sin rigor latencia con seguridad. Se evalúan dimensiones independientes: Task Success Rate, Tool Selection Accuracy, Policy Compliance (0 violaciones toleradas), Human Escalation Rate, Iteration Efficiency y Tool Failure Rate. Cada métrica tiene semántica precisa y no se colapsan en un número opaco.'
        }
      ]
    },
    {
      id: 'evaluacion-determinista',
      title: '04. Golden Cases, Evaluador Determinista y Detección de Regresiones',
      subtitle: 'Cómo versionar un agente con suites de prueba que detectan automáticamente cuando una nueva versión rompe un comportamiento previamente correcto',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'El AgentEvaluator no inspecciona el estado final del ExecutionState en aislamiento. Ejecuta aserciones deterministas sobre la lista completa de TraceEvents: ¿se invocó la herramienta correcta?, ¿en el orden correcto?, ¿precedió APPROVAL_REQUESTED a TOOL_CALLED?, ¿quedó trazada la revalidación post-approval? Esta suite de Golden Cases permite detectar automáticamente regresiones cuando se modifica el prompt, el plan o la lógica del agente.'
        },
        {
          type: 'CALLOUT',
          variant: 'info',
          title: 'LLM-as-a-Judge: Solo Complementario',
          message: 'En producción, LLM-as-a-Judge puede medir fluidez o relevancia semántica en salidas abiertas. En L07, la base obligatoria de la suite es 100% aserciones de software deterministas en Python. LLM-as-a-Judge jamás sustituye las aserciones de políticas, seguridad y orden de ejecución. Una evaluación semántica que aprueba una corrida que violó BLOCK de política no es aceptable como evaluación de seguridad.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'evaluation-lab'
        }
      ]
    },
    {
      id: 'taller-agent-v6',
      title: '05. Taller Práctico: De Agent v5 a Agent v6 en Python',
      subtitle: 'Evolución guiada incorporando TraceEvent, InMemoryTraceCollector, sanitización, RunSummary derivado y Golden Cases I1–I5',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En el Taller 07 tomarás tu Agent v5 de L06 y construirás Agent v6. Preservarás íntegros tus guardrails, tu compuerta HITL, tu planificador y tu bucle. Agregarás EventType, TraceEvent con sequence_no monotónico, InMemoryTraceCollector, sanitización previa al emit(), RunSummary.from_events() y AgentEvaluator con 5 Golden Cases. Validarás los Casos I1 a I5.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Key Insights de Agent v6 y Evaluación Agéntica',
          items: [
            'Preservación de Casos A–H: Herramientas (L02), bucle (L03), memoria aislada (L04), planificador con replanning (L05) y guardrails con HITL (L06) continúan íntegros.',
            'Caso I1 (Trace Completeness): Toda corrida emite eventos mínimos obligatorios (RUN_STARTED, PLAN_CREATED, TOOL_CALLED, RUN_TERMINATED) con run_id consistente y sequence_no monotónico dentro de ese run_id.',
            'Caso I2 (Tool Trajectory): El orden cronológico de TOOL_CALLED reflejan la secuencia lógica del plan. Ninguna herramienta prohibida aparece en la traza.',
            'Caso I3 (HITL Sequence): La compuerta queda trazada como APPROVAL_REQUESTED → APPROVAL_DECIDED → POLICY_EVALUATED(post_approval_revalidation) → TOOL_CALLED. REJECT nunca genera TOOL_CALLED.',
            'Caso I4 (Policy Zero-Tolerance): POLICY_EVALUATED(BLOCK) → RUN_TERMINATED(policy_blocked). TOOL_CALLED jamás existe después de un BLOCK.',
            'Caso I5 (Regression Detection): El AgentEvaluator + Golden Cases detecta automáticamente regresiones con assertion_failures legibles. 5/5 PASS en Variante A; al menos 1 regresión detectada en Variante B defectuosa.',
            'Sanitización previa: Secrets y PII se redactan ANTES de llegar a TraceCollector.emit(). El collector nunca ve contraseñas ni tokens.',
            'RunSummary derivado: from_events() es la única fuente de verdad. iterations usa len({e.iteration...}) para contar iteraciones observadas, no max().'
          ]
        }
      ]
    }
  ]
};
