import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 04 — Estado y Memoria (c-m5-l04)
 * Módulo 05 — Agentes de IA
 * Enfoque: Evolución acumulativa de Agent v2 a Agent v3 mediante ExecutionState y MemoryStore.
 */
export const LESSON_04_DOCUMENT: LessonDocument = {
  lessonId: 'c-m5-l04',
  sections: [
    {
      id: 'problema-amnesia-agent-v2',
      title: '01. El Problema Detonante: La Amnesia de Agent v2',
      subtitle: 'La desaparición del estado al retornar la función y la necesidad de memoria',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En la lección anterior construimos Agent v2, dotando al modelo de un bucle de control (Agent Loop) gobernado en software con límite duro de vueltas (max_iterations). Ese diseño permitió resolver con elegancia consultas dependientes de múltiples pasos. Sin embargo, Agent v2 padece de una limitación arquitectónica crítica: amnesia total entre ejecuciones independientes.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Estado Local Desaparece con la Función',
          message: 'Cuando ejecutas run_agent_v2() y la función retorna su respuesta en texto, las referencias locales salen de alcance. Si ningún otro objeto conserva una referencia al ExecutionState, éste queda elegible para liberación/recolección. Si el usuario envía a continuación una pregunta dependiente ("¿Y a qué hora llega?"), la nueva ejecución arranca desde cero, desconociendo de qué pedido, cliente o entidad se estaba hablando.'
        },
        {
          type: 'PARAGRAPH',
          text: '¿Por qué ocurre esto? Porque confundir el "estado transitorio de ejecución" con la "memoria de la aplicación" es uno de los errores más costosos en Agent Engineering. Para dotar al agente de continuidad, debemos separar formalmente lo que vive durante una corrida de lo que sobrevive a lo largo del tiempo.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'execution-state-inspector'
        }
      ]
    },
    {
      id: 'state-vs-memory-anatomia',
      title: '02. Execution State vs Memory Store: Anatomía y Alcance',
      subtitle: 'Diferenciando el scratchpad transitorio, la memoria de sesión y la memoria persistente',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Para resolver la amnesia sin caer en soluciones mágicas, descomponemos la información del agente en tres niveles ontológicos estrictos, gobernados por tres identificadores de alcance: run_id, session_id y subject_id.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Execution State (Volátil / Intra-run)',
            subtitle: 'Alcance: run_id en contexto de session_id y subject_id',
            badge: 'Efímero en RAM',
            points: [
              'Contiene las variables de trabajo mientras el bucle while está activo.',
              'Almacena run_id, session_id, subject_id, messages, iteration, last_observation y termination_reason.',
              'Nace cuando inicia la llamada al agente y sale de alcance al retornar.',
              'No sobrevive a la siguiente consulta del usuario (queda elegible para liberación).'
            ]
          },
          right: {
            title: 'Memory Store (Continuidad Duradera)',
            subtitle: 'Alcance: session_id & subject_id',
            badge: 'Soberanía del Backend',
            points: [
              'Session Memory: Vincula turnos consecutivos en la misma sesión.',
              'Persistent Memory: Almacena hechos estables autorizados del subject_id.',
              'Sobrevive a la finalización de run_agent() y a reinicios del servidor.',
              'Gobernado estrictamente por el backend en software, nunca por el LLM.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'Axiomas No Negociables de Memoria en CASE Academy',
          message: '1. Context Window ≠ Memory Store (la ventana es lo que el modelo recibe hoy; la memoria es lo que la aplicación puede recuperar mañana).\n2. Chat History ≠ Memory System (acumular logs no es recordar; es inflar tokens ciegamente).\n3. Memory Store ≠ RAG Knowledge Base (RAG recupera conocimiento externo corporativo de M04; la memoria recupera hechos derivados de la interacción previa con el subject).'
        },
        {
          type: 'PARAGRAPH',
          text: '¿Qué ocurre si simplemente acumulamos todos los mensajes turno tras turno en un arreglo infinito? La ventana de contexto explota en tokens, la latencia se dispara y el costo de inferencia se vuelve prohibitivo. La memoria estructurada permite mantener el crecimiento del contexto acotado, controlado y mucho más predecible.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'context-vs-memory'
        }
      ]
    },
    {
      id: 'politicas-de-memoria-ciclo-de-vida',
      title: '03. Políticas de Memoria: Hydration, Write-Back y Scope',
      subtitle: 'Decidiendo en software qué leer, qué escribir, qué podar y qué descartar',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Memoria no consiste en guardar todo. Guardar ciegamente cada observación de base de datos o stack trace satura el contexto con basura irrelevante. Peor aún: guardar datos sin un subject_id explícito genera contaminación cruzada entre usuarios diferentes.'
        },
        {
          type: 'EXAMPLE',
          title: 'El Ciclo de Vida en Agent v3: Hydrate ──► Loop ──► Write-Back',
          content: [
            '1. HYDRATION (Antes del Loop): El backend toma la consulta, consulta MemoryStore con session_id y subject_id, inyecta hechos relevantes y construye el ExecutionState.',
            '2. AGENT LOOP (Durante la Ejecución): El modelo decide y ejecuta herramientas trabajando sobre state.messages y state.iteration.',
            '3. WRITE-BACK (Después del Loop): Al emitirse la respuesta final, la función write_back() clasifica la información según MemoryPolicy y actualiza el MemoryStore.',
            '4. AISLAMIENTO ESTRICTO: MemoryStore nunca devuelve memoria de un subject_id a otro subject_id diferente.'
          ],
          caption: 'Arquitectura de software para la gestión determinista de memoria en Python.'
        },
        {
          type: 'CALLOUT',
          variant: 'caution',
          title: 'Peligro Crítico: Contaminación Cruzada y Fuga de Contexto',
          message: 'Si el Usuario A (subject "USR-101") consulta un cliente confidencial en la Sesión 1, y el Usuario B (subject "USR-202") inicia la Sesión 2 preguntando "¿quién es mi cliente?", un MemoryStore mal diseñado sin subject_id filtraría los datos del Usuario A al Usuario B. El scope es un requisito arquitectónico inquebrantable.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'memory-policy-matrix'
        }
      ]
    },
    {
      id: 'taller-practico-agent-v3',
      title: '04. Taller práctico — Evoluciona Agent v2 a Agent v3',
      subtitle: 'Implementación colaborativa en Python de ExecutionState, MemoryStore y Casos F1/F2',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En este taller no empezarás un proyecto nuevo. Tomarás el repositorio de tu grupo de estudio con Agent v2 (L03) y lo evolucionarás a Agent v3: introduciendo ExecutionState tipado, MemoryStore con almacenamiento en memoria/JSON, y validando los Casos F1 (Continuidad de Sesión) y F2 (Continuidad Persistente y Aislamiento).'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Reglas de Evolución de Agent v2 a Agent v3',
          items: [
            'Conserva tu dominio, datos en memoria, tools, schemas, registry y pruebas A–E intactas.',
            'Crea la clase @dataclass ExecutionState con run_id, session_id, subject_id, messages, iteration, last_observation y termination_reason.',
            'Implementa MemoryStore con métodos explícitos search(subject_id, session_id) y save(item).',
            'Sustituye variables locales desestructuradas en run_agent_v3() por el objeto tipado exec_state.',
            'Implementa hydrate() antes del while y write_back() después de obtener la respuesta final.',
            'Verifica que el Caso F1 recuerde el pedido en el segundo turno sin repetir el código ORD-4091.',
            'Verifica que el Caso F2 valide la frontera de memoria en search() y hydrate_context() para comprobar que Laura no hereda la memoria de Carlos.'
          ]
        }
      ]
    }
  ]
};
