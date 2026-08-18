import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Llamada de Herramientas (c14)
 * Módulo 05 — Agentes de IA
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c14',
  sections: [
    {
      id: 'desmitificando-tool-calling',
      title: '01. Desmitificando el "Uso de Herramientas"',
      subtitle: 'El modelo propone. El software ejecuta.',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un error común es creer que el LLM mágicamente "ejecuta" código o hace peticiones HTTP a la web. En realidad, un LLM es solo un motor de texto. Nunca toca el mundo exterior.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Contrato de Function Calling',
          message: 'Llamada de Herramientas (o Function Calling) es simplemente un acuerdo de comunicación estructurada entre el modelo probabilístico y tu código determinista: le pasas al LLM una lista de funciones que tu código puede hacer; si cree necesaria una, pausa la generación de texto y devuelve un JSON pidiendo ejecutarla. Tu código valida, ejecuta la función real, y le devuelve el resultado.'
        }
      ]
    },
    {
      id: 'flujo-operacional-tool-calling',
      title: '02. El Flujo Operacional en 3 Pasos',
      subtitle: 'Cómo se ve la interacción modelo-código en la práctica',
      blocks: [
        {
          type: 'EXAMPLE',
          title: 'Secuencia Operacional de Tool Calling',
          content: [
            '1. User Intent & Tool Schemas -> Model: El usuario pide "¿Qué clima hace en Madrid?". Envías esto al LLM junto con la definición JSON Schema de getWeather(city).',
            '2. Tool Call Proposal -> Application: El LLM responde con un mensaje estructurado indicando: "Propongo llamar a getWeather con el parámetro city=\'Madrid\'".',
            '3. Validation & Execution -> Observation: Tu aplicación intercepta la propuesta, ejecuta la llamada HTTP real, y devuelve la respuesta ("24 grados, soleado") al modelo.'
          ],
          caption: 'El modelo actúa como tomador de decisiones; el software conserva el control total de ejecución.'
        }
      ]
    },
    {
      id: 'conexion-con-m02-schemas',
      title: '03. Tool Definition Schema (Conexión con M02)',
      subtitle: 'JSON Schemas al rescate',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: '¿Recuerdas cómo en el Módulo 02 forzábamos salidas estructuradas? Llamada de Herramientas es exactamente la misma tecnología aplicada a la invocación de funciones.'
        },
        {
          type: 'CODE',
          filename: 'tool-definition-schema.json',
          language: 'json',
          code: `{
  "name": "sendEmail",
  "description": "Envía un correo electrónico. Úsalo cuando el usuario solicite notificar a alguien.",
  "parameters": {
    "type": "object",
    "properties": {
      "to": { "type": "string", "description": "Email del destinatario" },
      "body": { "type": "string", "description": "Cuerpo del mensaje" }
    },
    "required": ["to", "body"]
  }
}`
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Manejo de Errores de Validación',
          message: 'El modelo usa este contrato para construir la propuesta. Si tu código necesita un email válido y el modelo propone un nombre, tu código debe capturar el error y devolverlo al modelo como observación para que corrija su propuesta.'
        }
      ]
    },
    {
      id: 'de-tool-calling-al-loop',
      title: '04. Conclusión: De Tool-Calling al Loop',
      subtitle: 'El nacimiento del Agente',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Encadenamiento de Herramientas',
          items: [
            'Un flujo simple de Tool-Calling ejecuta una sola herramienta y termina.',
            'Para tareas complejas ("Analiza las ventas con getSales(), busca la causa con searchKnowledge() y envía el reporte con sendEmail()"), necesitamos encadenar múltiples llamadas de forma dinámica.',
            'Aquí es donde introducimos el Agent Loop.'
          ]
        }
      ]
    }
  ]
};
