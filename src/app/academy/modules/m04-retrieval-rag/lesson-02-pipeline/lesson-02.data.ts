import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — La Tubería RAG (c11)
 * Módulo 04 — Recuperación y RAG
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c11',
  sections: [
    {
      id: 'conectando-busqueda-llm',
      title: '01. La Tubería RAG (Retrieval-Augmented Generation)',
      subtitle: 'Conectando la búsqueda con el modelo en tiempo real',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'El Retrieval por sí solo es simplemente un motor de búsqueda. RAG (Retrieval-Augmented Generation) es el patrón arquitectónico que toma los resultados de esa búsqueda y los inyecta como Contexto Útil en el LLM en tiempo real para generar respuestas fundamentadas y libres de alucinaciones.'
        },
        {
          type: 'EXAMPLE',
          title: 'Flujo Arquitectónico del Pipeline RAG',
          content: [
            '1. Collect & Embed (📚) ──► Ingestión, fragmentación e indexación offline de la biblioteca de documentos.',
            '2. Search (🔍) ──► Recuperación online de los fragmentos más afines a la consulta del usuario.',
            '3. Assemble Context (🧩) ──► Estructuración del prompt aplicando reglas de relevancia y presupuesto (M03).',
            '4. Generate (🧠) ──► El LLM sintetiza la respuesta final operando estrictamente sobre el contexto inyectado.'
          ],
          caption: 'RAG convierte un modelo estático y genérico en un sistema experto con conocimiento corporativo actualizado.'
        }
      ]
    },
    {
      id: 'fase-1-ingestion',
      title: '02. Fase 1: Ingestión (Offline)',
      subtitle: 'Preparando la biblioteca de conocimiento antes de la inferencia',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Antes de que el usuario envíe una sola consulta, el sistema debe procesar y estructurar la documentación interna (PDFs, wikis, bases de código, logs):'
        },
        {
          type: 'COMPARISON',
          left: {
            title: '1. Chunking Estratégico',
            subtitle: 'Fragmentación Lógica',
            icon: '🔪',
            badge: 'Preprocesamiento',
            points: [
              'No podemos enviar documentos extensos enteros al modelo de embedding.',
              'Se dividen en fragmentos lógicos ("Chunks") de unos 300 a 500 tokens.',
              'Se añade un solapamiento controlado (overlap de ~50 tokens) para no cortar oraciones o ideas a mitad de camino.'
            ]
          },
          right: {
            title: '2. Embedding & Indexing',
            subtitle: 'Vectorización & Almacenamiento',
            icon: '🤖',
            badge: 'Vector DB',
            active: true,
            points: [
              'Cada Chunk es procesado por un modelo de embedding (ej. text-embedding-3-small).',
              'Se almacena el vector junto con su metadata original (URL, título, autor, fecha, permisos).',
              'La metadata permite aplicar filtros deterministas durante la búsqueda.'
            ]
          }
        }
      ]
    },
    {
      id: 'fase-2-inference',
      title: '03. Fase 2: Inferencia (Online)',
      subtitle: 'El ciclo de ejecución en tiempo real',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'El Proceso Online de 3 Pasos',
          items: [
            '1. Search (Retrieval): El usuario envía un Query. Convertimos el Query en un vector y extraemos los Top-K vectores más cercanos de la Vector DB.',
            '2. Assemble (Context Engineering): Tomamos el texto de los chunks recuperados y los inyectamos en un template estructurado (XML / Markdown), aplicando las restricciones de presupuesto de tokens aprendidas en el Módulo 03.',
            '3. Generate: Enviamos el prompt ensamblado al LLM (con Temp: 0.0) para que redacte la respuesta basándose estrictamente en los datos inyectados.'
          ]
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Conexión M03 → M04',
          message: 'En el Módulo 03 seleccionábamos manualmente el estado de la aplicación para ensamblar el prompt. En RAG, automatizamos esa selección utilizando geometría espacial (Retrieval). Sin embargo, la regla de oro se mantiene: si el motor de búsqueda recupera documentos irrelevantes, inyectará ruido en el contexto y provocará alucinaciones.'
        }
      ]
    },
    {
      id: 'cierre-pipeline',
      title: '04. Conclusión: Calidad de Contexto en RAG',
      subtitle: 'Garbage in, garbage out',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Garantías del Pipeline RAG',
          items: [
            'RAG no elimina el trabajo de Context Engineering: lo automatiza.',
            'La calidad de la respuesta generada está acotada superiormente por la calidad de los chunks recuperados.',
            'Para asegurar que el sistema no falle, es indispensable medir y evaluar el retrieval de forma aislada.'
          ]
        }
      ]
    }
  ]
};
