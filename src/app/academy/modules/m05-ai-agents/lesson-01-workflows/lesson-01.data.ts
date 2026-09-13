import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — Flujos de Trabajo vs Agentes (c13)
 * Módulo 05 — Agentes de IA
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c13',
  sections: [
    {
      id: 'la-frontera',
      title: '01. La Frontera de la Autonomía',
      subtitle: 'Cuando el código ya no sabe cuál es el siguiente paso',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Hasta ahora, en M04 (RAG), nuestro código decidía cuándo buscar información. Teníamos un flujo determinista donde la consulta pasaba por un proceso de recuperación y terminaba en el modelo. Pero, ¿qué ocurre cuando la capacidad necesaria depende de información descubierta en tiempo de ejecución?'
        },
        {
          type: 'PARAGRAPH',
          text: 'En lugar de controlar rígidamente el flujo, comenzamos a permitir que el modelo participe en la decisión del siguiente paso, siempre dentro de los límites definidos por el software. Identificar correctamente cuándo delegar esta decisión es la habilidad fundacional para construir sistemas basados en IA.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'what-is-an-agent'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Taxonomía Operacional en CASE',
          items: [
            'Tool-Using Workflow: El modelo decide usar una herramienta. El sistema la ejecuta, entrega el resultado al usuario y termina. NO hay realimentación.',
            'Agent Loop: El resultado de la herramienta regresa al modelo, quien evalúa la nueva observación y decide si necesita ejecutar otra acción o finalizar.'
          ]
        }
      ]
    },
    {
      id: 'control-de-flujo',
      title: '02. ¿Quién controla el flujo?',
      subtitle: 'El paso del IF-ELSE al ruteo semántico',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'El primer paso hacia la autonomía no es un agente complejo, sino un "Model-Routed Workflow". En lugar de hardcodear reglas de negocio rígidas que fallan ante variaciones inesperadas, usamos la capacidad de clasificación del LLM para determinar qué herramienta o subsistema debe ejecutarse a continuación.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'who-controls-flow'
        },
        {
          type: 'CODE',
          filename: 'model_router.py',
          language: 'python',
          description: 'Estructura de un Model-Routed Workflow. El modelo toma la decisión, pero el código controla rígidamente la ejecución posterior.',
          code: `# 1. El modelo evalúa el contexto y devuelve un JSON con su decisión
response = llm.generate(
    prompt=router_prompt,
    response_format={"type": "json_object"}
)
intent = response.get("intent")

# 2. El flujo determinista recupera el control
if intent == "technical_support":
    return route_to_support_workflow(user_data)
elif intent == "refund":
    return execute_refund_workflow(user_data)
else:
    return fallback_workflow()`
        }
      ]
    },
    {
      id: 'cuanta-autonomia',
      title: '03. ¿Cuánta autonomía necesitas?',
      subtitle: 'La autonomía es un costo operacional, no un objetivo por sí mismo',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Construir un Agente completo (Agent Loop) introduce no-determinismo. Un agente recibe un objetivo general, descubre información y decide por sí mismo qué workflows iniciar y cuándo detenerse. Esto reduce la predictibilidad y aumenta los costos y riesgos operativos.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'autonomy-tradeoffs'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla Arquitectónica: Least Autonomy Necessary',
          message: 'Construye utilizando siempre el nivel más bajo de autonomía que resuelva de forma robusta tu caso de uso. Prefiere un flujo determinista; si falla, delega el enrutamiento al modelo (Model-Routed); y reserva el ciclo agéntico (Agent Loop) solo para problemas abiertos que requieran investigación iterativa.'
        }
      ]
    }
  ]
};
