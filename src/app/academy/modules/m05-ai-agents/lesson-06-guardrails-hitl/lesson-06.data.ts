import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 06 — Guardrails & Human-in-the-Loop (c-m5-l06)
 * Módulo 05 — Agentes de IA
 * Enfoque: Evolución acumulativa de Agent v4 a Agent v5 mediante PolicyDecision, RiskLevel,
 * ToolPolicy sin ambigüedad, ActionProposal con binding SHA-256 sobre serialización determinista, revalidación de precondiciones,
 * aprobación de un solo uso con protección anti-replay, pause/resume formal y BudgetController.
 */
export const LESSON_06_DOCUMENT: LessonDocument = {
  lessonId: 'c-m5-l06',
  sections: [
    {
      id: 'problema-capacidad-vs-autoridad',
      title: '01. El Problema Detonante: Capacidad no Implica Autoridad',
      subtitle: 'Por qué un agente con un plan impecable puede carecer de legitimidad para ejecutarlo',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En la Lección 05 dotamos a Agent v4 de planificación determinista, seguimiento de dependencias topológicas y replanning estructurado. Sin embargo, este grado de autonomía detona el dilema fundamental de la ingeniería de control agéntico: que una acción sea técnicamente posible en el catálogo de herramientas y lógicamente correcta según el plan, no significa que el agente esté autorizado a ejecutarla.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Guardrails Reales ≠ Instrucciones en el System Prompt',
          message: 'Decirle al modelo en su system prompt "por favor no borres bases de datos" o "no transfieras más de $10,000" NO constituye una frontera de seguridad confiable. Un modelo probabilístico puede sufrir de jailbreaks, alucinaciones o confusiones semánticas. En Agent Engineering, los guardrails son políticas de software deterministas ejecutadas en el runtime en Python antes de despachar cualquier herramienta.'
        },
        {
          type: 'PARAGRAPH',
          text: 'L06 marca el ingreso pleno a la Capa 2 de nuestra arquitectura: la Engineering & Control Layer. Mientras el Core Agent (Decisión, Herramientas, Bucle, Memoria y Planificación) intenta resolver la tarea encomendada, la Capa de Control impone las fronteras operativas: qué está permitido (ALLOW), qué está terminantemente bloqueado (BLOCK) y qué requiere autorización humana previa (REQUIRE_APPROVAL).'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'permission-boundary'
        }
      ]
    },
    {
      id: 'politica-herramientas-sin-ambiguedad',
      title: '02. ToolPolicy, RiskLevel y Validación de Negocio',
      subtitle: 'Separación rigurosa entre esquema sintáctico y autorización operativa determinista',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Para evitar estados contradictorios (como permitir una herramienta y a la vez requerir aprobación de forma ambigua), el runtime modela la política de herramientas mediante una única PolicyDecision determinista por contexto, complementada con metadatos de severidad operacional (RiskLevel).'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Validación de Esquema (Schema Validation)',
            subtitle: 'Contrato sintáctico de entrada / tipos de datos',
            badge: 'Sintaxis y Tipos',
            points: [
              'Valida que amount sea un número de punto flotante positivo.',
              'Valida que account_id sea un string no vacío con formato ISO.',
              'TOOL_REGISTRY responde únicamente: "¿Existe esta función y sus tipos coinciden?".',
              'Completamente ciego ante el impacto financiero, la autorización de negocio o el estado del usuario.'
            ]
          },
          right: {
            title: 'Validación de Política (Policy Validation)',
            subtitle: 'Regla de negocio, límites de seguridad y autorización',
            badge: 'Autoridad y Negocio',
            points: [
              'Valida que amount <= 500,000 COP según el límite operativo del turno.',
              'Valida que la cuenta origen no esté en lista negra ni congelada judicialmente.',
              'PolicyEvaluator responde: "¿Puede ejecutarse esta llamada en este contexto?".',
              'Un payload 100% válido para el esquema puede resultar en BLOCK o REQUIRE_APPROVAL bajo la política de software.'
            ]
          }
        },
        {
          type: 'PARAGRAPH',
          text: 'Adoptamos la estrategia de Allowlist como frontera primaria: una herramienta no está autorizada por el simple hecho de existir en el código. Si no está explícitamente habilitada en la ToolPolicy con decisión ALLOW o aprobada en una compuerta humana, el runtime la intercepta de forma preventiva.'
        }
      ]
    },
    {
      id: 'human-in-the-loop-action-binding',
      title: '03. Human-in-the-Loop, Action Binding y la Semántica TOCTOU',
      subtitle: 'Transición formal a PAUSED_FOR_APPROVAL, hash SHA-256 sobre serialización determinista, consumo único y revalidación',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Cuando la política dictamina REQUIRE_APPROVAL, la ejecución no se detiene con un improvisado input("Y/N") en la consola. El runtime ejecuta una transición de estado formal a PAUSED_FOR_APPROVAL, generando un artefacto estructurado denominado ActionProposal que captura un snapshot estructurado de los parámetros y liga su integridad mediante action_fingerprint.'
        },
        {
          type: 'CALLOUT',
          variant: 'caution',
          title: 'Action Binding ≠ Solución Completa a TOCTOU (Time-of-Check to Time-of-Use)',
          message: 'El action_fingerprint (digest SHA-256 sobre serialización JSON determinista) garantiza que la acción despachada sea exactamente la aprobada por el humano, previniendo mutaciones de parámetros. Sin embargo, el fingerprint verifica la integridad de la acción propuesta, NO el estado del mundo exterior. Entre la aprobación humana y la ejecución, el saldo puede haberse agotado o la cuenta pudo ser congelada. Por tanto, el runtime SIEMPRE revalida la política y las precondiciones vigentes antes de ejecutar.'
        },
        {
          type: 'PARAGRAPH',
          text: 'La aprobación humana es estrictamente de un solo uso. Una vez despachada con éxito la herramienta, el runtime marca el registro como consumido (consumed=True) y registra el identificador en consumed_proposal_ids. Cualquier intento posterior de reutilizar la misma aprobación para una segunda llamada es interceptado de inmediato como approval_replay_detected.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'human-approval-gate'
        }
      ]
    },
    {
      id: 'budget-controller-circuit-breakers',
      title: '04. Control Operacional de Presupuestos y Disyuntores',
      subtitle: 'Límites duros de iteraciones, llamadas a herramientas y fallos consecutivos (Circuit Breakers)',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Incluso con un plan válido y herramientas autorizadas, un agente autónomo puede quedar atrapado en un bucle repetitivo o experimentar fallos en cadena que agoten recursos. El BudgetController impone techos operativos innegociables en software para salvaguardar la infraestructura y el presupuesto de la organización.'
        },
        {
          type: 'CALLOUT',
          variant: 'info',
          title: 'Diferencia Crítica: REJECT Humano vs BLOCK de Software',
          message: 'BLOCK es una proscripción determinista del software dictaminada antes de cualquier compuerta humana (ej. borrar cluster de producción); el supervisor humano no tiene botón de override en la política base. REJECT es la decisión tomada por un revisor humano sobre una propuesta válida que requería aprobación; inyecta una observación de rechazo permitiendo al planificador buscar una alternativa segura o finalizar de forma controlada.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'budget-circuit-breaker'
        }
      ]
    },
    {
      id: 'taller-agent-v5',
      title: '05. Taller Práctico: De Agent v4 a Agent v5 en Python',
      subtitle: 'Evolución guiada de tu base de código para incorporar PolicyEvaluator, compuertas de aprobación y Casos H1 a H6',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En el Taller 06 tomarás tu script funcional de Agent v4 (L05) y construirás Agent v5. Preservarás tus herramientas, tu bucle, tu almacenamiento de memoria y tu planificador intactos: agregarás PolicyDecision, ToolPolicy, ActionProposal, ApprovalRecord, el BudgetController y validarás los seis escenarios de control.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Key Insights de Agent v5 y Gobernanza de Autoridad',
          items: [
            'Preservación de Casos A–G: Las herramientas de catálogo (L02), el bucle con paradas duras (L03), la memoria aislada (L04) y el grafo de pasos del plan (L05) continúan ejecutándose íntegros.',
            'Caso H1 (ALLOW): Operación de bajo riesgo autorizada directamente que se ejecuta sin suspender el ciclo.',
            'Caso H2 (REQUIRE_APPROVAL / APPROVE): Mutación crítica que genera ActionProposal, pasa a PAUSED_FOR_APPROVAL, recibe APPROVE con fingerprint coincidente y precondiciones vigentes, se ejecuta exactamente una vez y se marca como consumida (consumed=True).',
            'Caso H3 (REQUIRE_APPROVAL / REJECT): El supervisor humano deniega la acción; la herramienta NUNCA se ejecuta, se inyecta la observación de rechazo y el planificador replanifica o culmina limpiamente.',
            'Caso H4 (BLOCK): Intento de acción proscrita por política; bloqueada preventivamente en software sin compuerta ni anulación humana.',
            'Caso H5a & H5b (Action Mutation & Replay Protection): Detección de disparidad de huellas ante mutación de argumentos ($250,000 -> $900,000) y rechazo inmediato ante intentos de reutilizar una aprobación ya consumida (approval_replay_detected).',
            'Caso H6 (Budget & Circuit Breakers): Superación del umbral operativo de llamadas a herramientas; el disyuntor se activa de forma segura con termination_reason="budget_exceeded".'
          ]
        }
      ]
    }
  ]
};
