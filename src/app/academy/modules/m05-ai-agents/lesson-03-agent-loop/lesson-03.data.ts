import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — El Agent Loop (c15)
 * Módulo 05 — Agentes de IA
 * Enfoque: Evolución acumulativa de Agent v1 a Agent v2 mediante el bucle de control.
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c15',
  sections: [
    {
      id: 'problema-detonante-agent-v1',
      title: '01. El Problema Detonante: Por Qué Agent v1 se Detiene',
      subtitle: 'La limitación silenciosa de la arquitectura lineal de un solo turno',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En la lección anterior dotamos al modelo de su primera capacidad operativa: Tool Calling. Construimos Agent v1 y comprobamos que el modelo propone una herramienta, nuestro código en Python la ejecuta en la CPU y el resultado se le devuelve al modelo para sintetizar una respuesta. Pero Agent v1 tiene una limitación arquitectónica silenciosa: es estrictamente lineal y de un solo turno de herramientas.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Límite Operacional de Agent v1',
          message: 'Agent v1 fue diseñado esperando que la segunda inferencia siempre devuelva una respuesta final en lenguaje natural. Si una meta compleja requiere dos pasos dependientes donde el segundo depende de lo descubierto por el primero, el modelo propondrá con total lógica una segunda herramienta. Sin embargo, el runtime lineal colapsa porque no tiene código para capturarla ni para continuar iterando.'
        },
        {
          type: 'PARAGRAPH',
          text: 'Cuando el usuario solicita: "Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada", el modelo ejecuta get_order_status, recibe la observación "ready_to_ship" y emite un segundo ToolCall solicitando get_shipping_provider. El modelo no falló: el software falló porque el runtime no sabe continuar.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'why-agent-v1-stops'
        }
      ]
    },
    {
      id: 'agent-loop-mental-model',
      title: '02. El Ciclo de Control: Agent Loop e Inspector de Iteraciones',
      subtitle: 'El modelo propone el siguiente paso; el runtime en software gobierna el ciclo',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Para resolver tareas dependientes no creamos un modelo nuevo ni introducimos frameworks opacos. Transformamos la arquitectura del runtime sustituyendo la llamada fija por un Agent Loop: un bucle de control en software gobernado por el ciclo Decision ──► Action ──► Observation ──► Next Decision.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Modelo No Queda Corriendo',
          message: 'Un LLM es una función matemática sin estado expuesta tras una API HTTP. Nunca digas que el modelo "queda corriendo en bucle". Cada iteración del Agent Loop es una llamada HTTP independiente: en cada vuelta, Python valida la propuesta, ejecuta la función en la CPU, anexa la observación al historial de mensajes y comanda una nueva inferencia.'
        },
        {
          type: 'PARAGRAPH',
          text: '¿Quién decide si todavía queda trabajo por hacer? El modelo emite una propuesta indicando si requiere más herramientas (finish_reason="tool_calls") o si puede responder (finish_reason="stop"). Pero nuestro software es el soberano absoluto: evalúa la validez, acumula la evidencia en el contexto y decide si autoriza la siguiente vuelta.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'agent-loop-inspector'
        }
      ]
    },
    {
      id: 'condiciones-de-parada',
      title: '03. Condiciones de Parada y Soberanía del Software',
      subtitle: 'Terminación normal vs. aborto controlado: previniendo bucles infinitos y sobrecostos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'En ingeniería de software, un bucle while sin condiciones de terminación deterministas es un defecto crítico de diseño. En sistemas agénticos, donde cada vuelta consume dinero real en tokens de API y tiempo de respuesta, las condiciones de parada son obligatorias:'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Terminación Normal (Final Answer)',
            subtitle: 'Condición Semántica',
            badge: 'Éxito',
            points: [
              'El modelo determina que la evidencia acumulada es suficiente.',
              'Emite finish_reason="stop" con texto en lenguaje natural en content.',
              'El bucle concluye limpiamente y retorna el resultado al usuario.',
              'Es la salida esperada en flujos nominales sin errores de herramientas.'
            ]
          },
          right: {
            title: 'Terminación Forzada (Max Iterations)',
            subtitle: 'Condición de Software',
            badge: 'Salvaguarda Crítica',
            points: [
              'El runtime en Python impone un contador duro (ej. max_iterations=5).',
              'Previene bucles infinitos si una API externa devuelve errores cíclicos.',
              'Protege el presupuesto de API y los recursos de memoria del servidor.',
              'Aborta la ejecución con un mensaje controlado de diagnóstico.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'La Regla de Oro de los Agent Loops',
          message: 'Nunca ejecutes un Agent Loop sin el parámetro max_iterations codificado en el software. Un LLM está pre-entrenado para intentar resolver siempre la tarea y, ante un error recurrente, puede insistir en llamar la misma herramienta fallida indefinidamente. La responsabilidad de detener el sistema pertenece al código, no a la IA.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'stop-conditions'
        }
      ]
    },
    {
      id: 'taller-practico-agent-v2',
      title: '04. Taller práctico — Evoluciona Agent v1 a Agent v2',
      subtitle: 'Transferencia técnica en grupos de estudio: transforma tu Agent v1 lineal en un Agent v2 iterativo con Caso D multi-step',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'No crees un proyecto nuevo. Toma el código funcional de Agent v1 que tu grupo construyó en L02 y evoluciónalo: conserva tu dominio, tus datos en memoria, tus herramientas y tus esquemas JSON. Reemplaza la segunda inferencia terminal por run_agent_v2(), integra un Agent Loop con max_iterations y demuestra que tu agente puede resolver consultas multi-step dependientes.'
        },
        {
          type: 'EXAMPLE',
          title: 'Ficha Técnica del Taller Práctico',
          content: [
            'Modalidad: Trabajo colaborativo en grupos de estudio (2 a 3 personas por equipo).',
            'Punto de partida: Proyecto funcional de Agent v1 de L02 (mismo dominio y herramientas).',
            'Duración recomendada: 60 a 75 minutos de programación activa e instrumentación.',
            'Modo A (Camino Base): Simulación determinista con MockModelProvider v2, 100% biblioteca estándar de Python.',
            'Modo B (Proveedor Opcional): Adapter desacoplado compatible con OpenAI para probar razonamiento real.',
            'Entregable: Código ejecutable de Agent v2 con bucle iterativo, límite max_iterations, instrumentación por iteración en consola y Caso D multi-step probado.'
          ],
          caption: 'La guía descargable contiene el checklist de migración, el scaffolding de MockModelProvider v2 y el código completo del Agent Loop.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Arquitectura Acumulativa: Qué se Conserva vs. Qué se Agrega',
          message: 'Se conserva intacto: ModelProvider, MockModelProvider (v2), Tools de tu grupo, Tool Schemas, TOOL_REGISTRY, execute_tool_call() y las pruebas de regresión A, B y C. Se agrega: el bucle while, la condición max_iterations, la instrumentación de iteraciones [ITERATION X] y el nuevo Caso D multi-step.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Hitos Técnicos a Completar por el Grupo de Estudio',
          items: [
            '1. Preservación & Scaffolding: Conservar run_agent_v1() como referencia histórica y declarar run_agent_v2(user_query, provider, max_iterations=5).',
            '2. Implementación del Loop: Construir el ciclo while con evaluación de response.tool_calls, despacho en CPU y realimentación de observaciones.',
            '3. Regresión L02: Verificar que las pruebas Caso A (Tool 1), Caso B (Tool 2) y Caso C (sin tools) sigan resolviéndose exitosamente en Agent v2.',
            '4. Caso D Multi-Step: Diseñar y ejecutar una consulta compuesta en tu dominio propio que exija dos pasos dependientes secuenciales.',
            '5. Salvaguarda Operacional: Ejecutar el Caso D con max_iterations=1 y constatar el aborto controlado del runtime en consola.',
            '6. Puente hacia L04: Descubrir que messages vive solo en memoria RAM durante la función, formulando la necesidad de persistencia para State & Memory.'
          ]
        }
      ]
    }
  ]
};
