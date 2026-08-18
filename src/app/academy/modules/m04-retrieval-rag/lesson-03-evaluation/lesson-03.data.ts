import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Evaluación de la Recuperación (c12)
 * Módulo 04 — Recuperación y RAG
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c12',
  sections: [
    {
      id: 'medir-antes-de-generar',
      title: '01. Medir antes de Generar',
      subtitle: '¿Cómo sabemos si nuestro buscador recupera el conocimiento correcto?',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Si el Retrieval falla, el RAG fallará inexorablemente ("Garbage in, garbage out"). Antes de evaluar si el modelo escribe con buena prosa, debemos evaluar con métricas formales si estamos inyectando los documentos correctos.'
        },
        {
          type: 'EXAMPLE',
          title: 'Ciclo de Evaluación de Information Retrieval',
          content: [
            '1. Retrieve (🔍) ──► Ejecutar la consulta vectorial y extraer candidatos Top-K.',
            '2. Measure (📏) ──► Calcular métricas de calidad y cobertura (Precision, Recall, Hit Rate).',
            '3. Evaluate (📈) ──► Realizar Failure Analysis de los casos donde la respuesta no estuvo en el Top-K.',
            '4. Improve (🛠️) ──► Ajustar tamaño de chunking, modelo de embedding, filtros o incorporar Reranking.'
          ],
          caption: 'El benchmark cuantitativo de retrieval es la base de todo sistema RAG de nivel de producción.'
        }
      ]
    },
    {
      id: 'precision-vs-recall',
      title: '02. Precision & Recall: Las Métricas de Oro',
      subtitle: 'Calidad de señal vs Cobertura de conocimiento',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Precision@K (Calidad de Señal)',
            subtitle: '¿Cuántos de los recuperados son útiles?',
            icon: '🎯',
            badge: 'Calidad',
            points: [
              '"De todos los documentos que recuperé, ¿cuántos eran realmente útiles?"',
              'Alta Precisión = Cero ruido inyectado al LLM.',
              'Si recuperas 5 documentos y los 5 aportan a la respuesta, tienes 100% de Precision.',
              'Si recuperas 5 y solo 1 sirve, tu Precision es del 20% (el 80% restante es distracción).'
            ]
          },
          right: {
            title: 'Recall@K (Cobertura)',
            subtitle: '¿Cuántos de los existentes logré traer?',
            icon: '🌐',
            badge: 'Cobertura',
            active: true,
            points: [
              '"De todos los documentos útiles que EXISTEN en la base de datos, ¿cuántos logré recuperar?"',
              'Alto Recall = No te pierdes la aguja en el pajar.',
              'Si la base de datos contiene 3 documentos clave y trajiste los 3, tu Recall es del 100%.',
              'Si solo trajiste 1 de los 3, tu Recall es del 33%.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Trade-off Fundamental de Retrieval',
          message: 'Para subir el Recall al 100% bastaría con extraer toda la base de datos (Top-K = Infinito). Pero tu Precision colapsaría a cero, quebrarías el presupuesto de tokens (Context Budget) y provocarías Attention Collapse en el modelo. El balance entre Precision y Recall define el éxito del pipeline.'
        }
      ]
    },
    {
      id: 'hit-rate-y-reranking',
      title: '03. Hit Rate & Reranking (Cross-Encoders)',
      subtitle: 'Importa QUÉ recuperas, y en QUÉ ORDEN se posiciona',
      blocks: [
        {
          type: 'EXAMPLE',
          title: 'Métricas Operativas y Técnicas de Reordenamiento',
          content: [
            'Hit Rate: Métrica binaria simple: ¿El documento que contiene la respuesta correcta apareció dentro del Top-K? (Sí o No). Es ideal para suites de tests automatizados continuos (ej. "En el 88% de las 100 queries de prueba se recuperó el chunk correcto").',
            'Reranking (Cross-Encoders): El LLM presta mayor atención a los primeros documentos (Lost in the Middle). La arquitectura moderna recupera un Top-50 rápido con Embeddings ligeros, y aplica un modelo Cross-Encoder pesado para reordenar con precisión milimétrica los Top-5 finales que se inyectan al prompt.'
          ],
          caption: 'El patrón Two-Stage Retrieval (Bi-Encoder + Cross-Encoder) maximiza el Hit Rate manteniendo un contexto compacto.'
        }
      ]
    },
    {
      id: 'del-concepto-a-la-practica-m04',
      title: '04. Del Concepto a la Práctica: Módulo 04',
      subtitle: 'Experimentación con Top-K y diseño de estrategias de búsqueda',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos cubierto los fundamentos de embeddings y bases vectoriales, la arquitectura de ingestión e inferencia RAG, y el marco cuantitativo de evaluación con Precision, Recall, Hit Rate y Reranking. Es momento de pasar a la práctica interactiva.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd4',
          title: 'Demo 04 — Construir la Recuperación',
          description: 'Explora un pipeline de recuperación basado en similitud cosenoidal. Experimenta cómo variar el parámetro Top-K altera el balance entre Precision@K y Hit Rate.',
          path: '/academy/modules/m04-retrieval-rag/demo-build-retrieval',
          actionLabel: 'Probar Demo 04'
        },
        {
          type: 'LAB_REF',
          labId: 'l4',
          title: 'Laboratorio 04 — Diseñar una Estrategia de Recuperación',
          description: 'Diseña una especificación formal de búsqueda y un benchmark de evaluación de 5 queries corporativas para una tarea de modernización real.',
          path: '/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 04'
        }
      ]
    }
  ]
};
