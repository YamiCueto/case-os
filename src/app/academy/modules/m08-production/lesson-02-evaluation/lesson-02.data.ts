import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Jerarquía de Evaluación (c23)
 * Módulo 08 — IA en Producción
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c23',
  sections: [
    {
      id: 'no-todo-es-llm-as-a-judge',
      title: '01. Jerarquía de Evaluación: No todo es LLM-as-a-Judge',
      subtitle: 'Estructuración en embudo: de lo exacto a lo semántico',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un error común en Producción es utilizar un LLM para evaluar todo. Esto es lento, costoso y propenso a errores (un LLM evaluando mal a otro LLM). La evaluación debe estructurarse como un embudo defensivo, desde comprobaciones baratas y exactas hasta revisiones humanas costosas.'
        }
      ]
    },
    {
      id: 'embudo-de-evaluacion-5-capas',
      title: '02. El Embudo de Evaluación: Las Cinco Capas de Defensa',
      subtitle: 'Balance de costo, latencia y fidelidad en pruebas',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Las 5 Capas de la Jerarquía de Evaluación',
          items: [
            '1. Deterministic Checks (Code/Regex): Verificaciones exactas (JSON válido, longitud < 500 caracteres, status codes). Costo: $0. Latencia: < 1ms.',
            '2. Structured / Rule-based Evaluation: Coincidencia de esquemas TypeScript/DB, palabras prohibidas, presencia de campos obligatorios. Costo: Casi nulo.',
            '3. Semantic Evaluation (Embeddings): Similitud del significado (+90% Cosine Similarity) contra una respuesta de referencia. Costo: Bajo.',
            '4. LLM-as-a-Judge: Usar un LLM fuerte (ej. Claude 3.5 Sonnet / GPT-4) para evaluar criterios abstractos de un modelo rápido (amabilidad, fidelidad al contexto). Costo: Alto.',
            '5. Human Evaluation: Revisión manual de casos límite o auditorías estadísticas aleatorias. Costo: Extremadamente alto. No escalable.'
          ]
        }
      ]
    },
    {
      id: 'golden-datasets-y-regresion',
      title: '03. Golden Datasets & Regression Testing',
      subtitle: 'El equivalente a las suites de Unit Tests en software tradicional',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: '¿Qué pasa si cambias tu System Prompt para corregir un bug, o si tu proveedor actualiza el modelo subyacente? ¿Cómo sabes que no rompiste otra funcionalidad existente?'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Golden Dataset (Conjunto de Datos Dorado)',
          message: 'Un Golden Dataset es un conjunto cerrado de 10 a 100 casos de prueba reales (User Input) junto con su comportamiento esperado (Expected Behavior). Cada vez que modificas el prompt o cambias de modelo, corres el dataset completo por tu Jerarquía de Evaluación para detectar regresiones automáticamente.'
        }
      ]
    },
    {
      id: 'precision-y-errores-del-juez',
      title: '04. Precisión y Errores: Cuando el Juez se Equivoca',
      subtitle: 'Riesgos de Falsos Positivos y Falsos Negativos en LLM-as-a-Judge',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Falso Positivo (False Pass)',
            subtitle: 'Falla de Seguridad / Calidad',
            icon: '🚨',
            badge: 'High Risk',
            points: [
              'El evaluador aprueba una respuesta que en realidad es incorrecta, alucinada o maliciosa.',
              'Un fallo o brecha de seguridad llega silenciosamente a producción.',
              'Requiere endurecer las rúbricas y añadir checks deterministas previos.'
            ]
          },
          right: {
            title: 'Falso Negativo (False Fail)',
            subtitle: 'Falla de Disponibilidad / UX',
            icon: '⚠️',
            badge: 'Over-Strict',
            active: true,
            points: [
              'El evaluador rechaza una respuesta perfectamente válida por ser excesivamente estricto o inflexible.',
              'Genera reintentos innecesarios, aumento de latencia y degradación de servicio.',
              'Requiere calibrar los umbrales de evaluación con muestras representativas.'
            ]
          }
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Calibración de Evaluadores',
          items: [
            'Toda métrica de LLM-as-a-Judge debe ser validada contra un benchmark humano inicial para medir su tasa de False Pass y False Fail.',
            'Los checks deterministas (Capa 1 y 2) deben filtrar el 80% de los errores obvios antes de invocar evaluadores semánticos.'
          ]
        }
      ]
    }
  ]
};
