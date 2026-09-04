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
      title: '01. Medir antes de generar',
      subtitle: '¿Cómo sabemos si nuestro buscador recupera el conocimiento correcto?',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Si la recuperación (retrieval) falla, RAG tendrá evidencia insuficiente o incorrecta. Antes de evaluar la redacción del modelo, debemos medir si estamos inyectando los documentos adecuados.'
        },
        {
          type: 'EXAMPLE',
      title: 'Ciclo de evaluación de recuperación de información (information retrieval)',
          content: [
            '1. Recuperar (retrieve) 🔍 ──► Ejecutar la consulta vectorial y extraer candidatos Top-K.',
            '2. Medir (measure) 📏 ──► Calcular precisión (precision), cobertura (recall) y tasa de aciertos (hit rate).',
            '3. Evaluar (evaluate) 📈 ──► Analizar los casos donde la respuesta no apareció dentro de Top-K.',
            '4. Mejorar (improve) 🛠️ ──► Ajustar fragmentación (chunking), modelo de representaciones vectoriales, filtros o reordenamiento (reranking).'
          ],
          caption: 'Una referencia cuantitativa de recuperación (retrieval) permite mejorar RAG con evidencia.'
        }
      ]
    },
    {
      id: 'precision-vs-recall',
      title: '02. Precisión y cobertura (precision & recall)',
      subtitle: 'Calidad de señal vs Cobertura de conocimiento',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
      title: 'Precisión@K (precision@K): calidad de señal',
            subtitle: '¿Cuántos de los recuperados son útiles?',
            icon: '🎯',
            badge: 'Calidad',
            points: [
              '"De todos los documentos que recuperé, ¿cuántos eran realmente útiles?"',
              'Alta precisión significa poco ruido inyectado al LLM.',
              'Si recuperas 5 documentos y los 5 aportan a la respuesta, tienes 100% de precisión.',
              'Si recuperas 5 y solo 1 sirve, tu precisión es del 20%; el resto es distracción.'
            ]
          },
          right: {
      title: 'Cobertura@K (recall@K): conocimiento encontrado',
            subtitle: '¿Cuántos de los existentes logré traer?',
            icon: '🌐',
            badge: 'Cobertura',
            active: true,
            points: [
              '"De todos los documentos útiles que EXISTEN en la base de datos, ¿cuántos logré recuperar?"',
              'Alta cobertura significa que no dejas fuera evidencia útil.',
              'Si la base de datos contiene 3 documentos clave y trajiste los 3, tu cobertura es del 100%.',
              'Si solo trajiste 1 de los 3, tu cobertura es del 33%.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
      title: 'El equilibrio fundamental de la recuperación (retrieval)',
          message: 'Para subir la cobertura (recall) al 100% bastaría con extraer toda la base de datos. Pero la precisión (precision) bajaría, excederías el presupuesto de contexto (context budget) y aumentarías el riesgo de colapso de atención (attention collapse). El equilibrio depende de la tarea.'
        }
      ]
    },
    {
      id: 'hit-rate-y-reranking',
      title: '03. Tasa de acierto y reordenamiento (hit rate & reranking)',
      subtitle: 'Importa QUÉ recuperas, y en QUÉ ORDEN se posiciona',
      blocks: [
        {
          type: 'EXAMPLE',
      title: 'Métricas operativas y técnicas de reordenamiento',
          content: [
            'Tasa de aciertos (hit rate): métrica binaria. ¿El documento con la respuesta apareció dentro de Top-K? Es útil para pruebas automatizadas continuas.',
            'Reordenamiento (reranking): después de recuperar candidatos, un segundo modelo puede ordenar mejor los primeros resultados antes de inyectarlos al prompt.'
          ],
          caption: 'La recuperación en dos etapas (two-stage retrieval) puede elevar la tasa de aciertos manteniendo un contexto compacto.'
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
          text: 'Hemos cubierto representaciones vectoriales (embeddings), bases de datos vectoriales, la tubería RAG y la evaluación con precisión, cobertura, tasa de aciertos y reordenamiento. Es momento de pasar a la práctica interactiva.'
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
