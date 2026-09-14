import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Llamada de Herramientas (c14)
 * Módulo 05 — Agentes de IA
 * Enfoque: Agent v1 — Tool Calling y la frontera de ejecución en Python.
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c14',
  sections: [
    {
      id: 'desmitificando-tool-calling',
      title: '01. Desmitificando Tool Calling: El Modelo Propone, el Software Ejecuta',
      subtitle: 'La frontera crítica entre el compilador probabilístico y tu CPU',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un error recurrente en ingeniería de software es suponer que un modelo con capacidades de herramientas "se conecta a internet" o "invoca directamente una base de datos". En realidad, un LLM es un motor puramente predictivo: no posee sockets de red, credenciales ni punteros de memoria. Jamás toca el mundo exterior.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Axioma Inviolable de Tool Calling',
          message: 'Llamada de Herramientas (Function Calling) es un protocolo de comunicación estructurada: el software expone una lista declarativa de schemas; el modelo, al detectar una necesidad operativa, detiene la generación de texto natural y emite un JSON estructurado solicitando la ejecución. La aplicación local valida, ejecuta la función real en su propio runtime y retorna la observación al modelo.'
        },
        {
          type: 'PARAGRAPH',
          text: 'Una función en Python es código imperativo que ejecuta instrucciones en la CPU. En contraste, un Tool Schema es una especificación declarativa escrita en JSON Schema que le explica al LLM qué hace la función, qué parámetros espera y qué tipo de datos devuelve. Escribir descripciones de tools es Prompt Engineering estricto (M02) dirigido a guiar la inferencia probabilística.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'tool-anatomy'
        }
      ]
    },
    {
      id: 'ciclo-de-7-fases',
      title: '02. Tool Calling Inspector: El Ciclo Completo de 7 Fases',
      subtitle: 'Trazabilidad paso a paso desde el prompt hasta la respuesta final',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Para implementar un agente robusto sin frameworks opacos, cada ingeniero debe ser capaz de rastrear con precisión los siete saltos que ocurren en cada turno de llamada de herramientas:'
        },
        {
          type: 'EXAMPLE',
          title: 'Secuencia de los 7 Hops Operacionales',
          content: [
            '1. USER: El usuario envía una consulta que requiere datos frescos o acciones externas.',
            '2. MODEL: El LLM procesa los mensajes y evalúa los Tool Schemas disponibles.',
            '3. TOOL SELECTED: El modelo emite una señal de parada y genera el nombre de la herramienta requerida.',
            '4. ARGUMENTS: El modelo genera los parámetros en formato JSON conforme al schema.',
            '5. EXECUTION: El runtime en Python intercepta la propuesta, valida los tipos y ejecuta la función real.',
            '6. TOOL RESULT: El resultado de la función se empaqueta como un mensaje de rol "tool" con su tool_call_id.',
            '7. MODEL RESPONSE: El modelo lee la observación inyectada y redacta la respuesta final en lenguaje natural.'
          ],
          caption: 'Nótese que entre el paso 4 y 6, el modelo está en pausa: la aplicación es la soberana de la ejecución.'
        },
        {
          type: 'PARAGRAPH',
          text: 'Tan importante como saber invocar una herramienta es saber cuándo abstenerse. Un modelo bien calibrado no debe emitir tool calls ante saludos, solicitudes de aclaración conceptual o tareas que se resuelven mediante puro razonamiento dentro de la ventana de contexto.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'tool-calling-inspector'
        }
      ]
    },
    {
      id: 'frontera-de-ejecucion-side-effects',
      title: '03. Frontera de Seguridad: Tools de Lectura vs. Side Effects',
      subtitle: 'Validación en runtime y manejo de mutaciones de estado',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'En un entorno de producción, las herramientas se dividen en dos categorías fundamentales con implicaciones operativas radicalmente distintas:'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Tools de Lectura (Idempotentes)',
            subtitle: 'Operaciones de Consulta',
            badge: 'Bajo Riesgo',
            points: [
              'Consultar stock, tracking logístico o base de conocimiento.',
              'Riesgo operacional bajo: si falla un parámetro, no altera datos.',
              'Validación en Python: tipado de argumentos y existencia del registro.',
              'Idempotencia: segura para reintentos automáticos sin efectos colaterales.'
            ]
          },
          right: {
            title: 'Tools con Side Effects (Mutaciones)',
            subtitle: 'Acciones Transaccionales',
            badge: 'Riesgo Crítico',
            points: [
              'Cancelar pedidos, autorizar reembolsos o enviar correos a clientes.',
              'Riesgo crítico: muta bases de datos o dispara transacciones financieras.',
              'Validación en Python: autorización, verificación de estado y políticas comerciales.',
              'Idempotencia: requiere tokens de idempotencia y comprobación estricta.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Prompt no es una Frontera de Seguridad',
          message: 'Escribir en el system prompt "nunca reembolses más de 100 dólares" es una defensa frágil que colapsa ante prompt injection. La restricción de 100 dólares debe estar codificada en el software de Python dentro de la función execute_refund. Never trust LLM output.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'tool-boundary'
        }
      ]
    },
    {
      id: 'agent-v1-y-su-limitacion',
      title: '04. Agent v1: Implementación en Python y su Límite Operacional',
      subtitle: 'El nacimiento práctico de nuestro primer agente y el puente hacia L03',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Con el mecanismo de Tool Calling construido en Python puro, hemos creado oficialmente Agent v1 — Tool Calling: un asistente capaz de enriquecer sus respuestas e interactuar con sistemas de backend.'
        },
        {
          type: 'CODE',
          filename: 'agent_v1_tool_calling.py',
          language: 'python',
          code: `import json
from openai import OpenAI

client = OpenAI()

def execute_agent_v1(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    first_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=TOOLS_SCHEMAS
    )

    message = first_response.choices[0].message
    tool_calls = message.tool_calls

    if not tool_calls:
        return message.content or ""

    messages.append(message)

    for tool_call in tool_calls:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        executor = TOOL_REGISTRY[name]
        result = executor(**args)

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        })

    final_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return final_response.choices[0].message.content or ""`
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Limitación Deliberada de Agent v1',
          message: 'Observa la anatomía de execute_agent_v1: ejecuta las herramientas solicitadas exactamente UNA vez y luego pide la respuesta final. ¿Qué ocurre si la herramienta consultar_inventario devuelve "Agotado en almacén central" y el modelo necesita invocar una segunda herramienta buscar_almacenes_regionales? Agent v1 se detiene porque carece de un bucle de realimentación continua. Esa limitación da origen directo a la Lección 03: El Agent Loop.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Key Insights de Ingeniería — Agent v1',
          items: [
            'Un LLM nunca ejecuta código ni invoca APIs directamente: propone una llamada estructurada en JSON y el software conserva la soberanía de ejecución.',
            'Un Tool Schema consta de name, description y parameters estructurados en JSON Schema. La descripción es prompt engineering técnico que orienta al modelo.',
            'El ciclo completo consta de 7 fases: User -> Model -> Tool Selection -> Arguments -> Python Execution -> Tool Result -> Final Response.',
            'Las herramientas con side effects (cancelaciones, pagos, mutaciones) requieren validación transaccional en el backend, no sugerencias en el prompt.',
            'Agent v1 resuelve problemas de un solo turno de herramientas. Para encadenar acciones dinámicas basadas en descubrimientos en runtime, requerimos un Agent Loop (L03).'
          ]
        }
      ]
    }
  ]
};
