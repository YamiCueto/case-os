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
      id: 'taller-practico-agent-v1',
      title: '04. Taller práctico — Construye tu primer Agent v1',
      subtitle: 'Transferencia técnica en grupos de estudio: diseña, implementa e inspecciona tu propio Agent v1 en Python',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Las secciones anteriores demostraron el protocolo de Tool Calling, el flujo de los 7 hops y la soberanía del software en la frontera de ejecución. En este taller práctico, los grupos de estudio pasan de la observación a la construcción: elegirán su propio dominio operativo, implementarán dos herramientas reales en Python, redactarán sus Tool Schemas en JSON Schema, inspeccionarán la trazabilidad completa en consola y descubrirán el límite estructural que da origen a L03.'
        },
        {
          type: 'EXAMPLE',
          title: 'Ficha Técnica del Taller Práctico',
          content: [
            'Modalidad: Trabajo colaborativo en grupos de estudio (2 a 3 personas por equipo).',
            'Duración recomendada: 60 a 75 minutos (hasta 90 minutos con setup inicial de Python).',
            'Modo A (Camino Base): 100% estándar en Python, sin API keys, sin dependencias externas ni costo.',
            'Modo B (Proveedor Opcional): Adapter desacoplado compatible con OpenAI para probar inferencia probabilística real.',
            'Entregable: Proyecto Python ejecutable en dominio propio con mínimo 2 tools, dispatcher, 3 casos probados y límite operacional documentado.'
          ],
          caption: 'No se requiere experiencia avanzada en Python. La guía descargable detalla la preparación del entorno desde cero.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Principio Rector del Taller',
          message: 'El grupo no debe repetir la teoría ni limitarse a leer código terminado. El LLM propone la llamada de herramientas, pero Python ejecuta la lógica en la CPU. Cada grupo debe comprobar en terminal que el modelo se detiene en finish_reason="tool_calls" y que el software backend es el único soberano de la ejecución.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Hitos Técnicos a Completar por el Grupo de Estudio',
          items: [
            '1. Setup & Baseline: Crear el entorno virtual .venv y verificar la ejecución inicial con MockModelProvider en Modo A (biblioteca estándar).',
            '2. Dominio Propio: Modelar un propósito operativo, dos funciones en Python con sus Tool Schemas y análisis de la frontera entre lectura y mutaciones (side effects).',
            '3. Inspección 7 Hops: Conectar las herramientas a TOOL_REGISTRY y verificar en consola la secuencia de los 7 hops operacionales.',
            '4. Diagnóstico de Schema: Experimentar cómo una descripción ambigua degrada la selección probabilística de la herramienta.',
            '5. Límite Hacia L03: Probar una meta compuesta de dos pasos dependientes y constatar por qué Agent v1 requiere un Agent Loop para continuar.'
          ]
        }
      ]
    }
  ]
};
