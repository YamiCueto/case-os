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
      title: '01. La tubería RAG (retrieval-augmented generation)',
      subtitle: 'Conectando la búsqueda con el modelo en tiempo real',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
      text: 'La recuperación (retrieval) por sí sola es un motor de búsqueda. RAG (retrieval-augmented generation) toma sus resultados y los añade como contexto útil al LLM para producir respuestas fundamentadas. No elimina por sí mismo el riesgo de error: la calidad del contexto sigue importando.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'rag-pipeline-explorer'
        }
      ]
    },
    {
      id: 'fase-1-ingestion',
      title: '02. Fase 1: preparación e ingestión (offline)',
      subtitle: 'Preparando la biblioteca de conocimiento antes de la inferencia',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Antes de que el usuario envíe una sola consulta, el sistema debe procesar y estructurar la documentación interna (PDFs, wikis, bases de código, logs):'
        },
        {
          type: 'COMPARISON',
          left: {
      title: '1. Fragmentación estratégica (chunking)',
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
      title: '2. Representaciones vectoriales e indexación (embeddings & indexing)',
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
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'chunking-overlap'
        }
      ]
    },
    {
      id: 'fase-2-inference',
      title: '03. Fase 2: respuesta e inferencia (online)',
      subtitle: 'El ciclo de ejecución en tiempo real',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
      title: 'El proceso de respuesta en tres pasos',
          items: [
            '1. Búsqueda (search) y recuperación (retrieval): el usuario envía una consulta (query). La convertimos en vector y extraemos los vectores Top-K más cercanos de la base de datos vectorial (vector database).',
            '2. Ensamblaje (context engineering): tomamos los fragmentos recuperados y los añadimos a una plantilla estructurada (XML o Markdown), respetando el presupuesto de tokens aprendido en M03.',
            '3. Generación (generate): enviamos el prompt ensamblado al LLM para que redacte una respuesta basada en los datos inyectados.'
          ]
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Conexión M03 → M04',
          message: 'En M03 seleccionábamos manualmente el estado de la aplicación para ensamblar el prompt. En RAG automatizamos esa selección mediante recuperación (retrieval). La regla de oro se mantiene: si el motor encuentra documentos irrelevantes, inyectará ruido en el contexto y aumentará el riesgo de respuestas no fundamentadas.'
        }
      ]
    },
    {
      id: 'cierre-pipeline',
      title: '04. Conclusión: calidad del contexto en RAG',
      subtitle: 'La calidad de la entrada condiciona la calidad de la respuesta',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Lo que una tubería RAG sí y no garantiza',
          items: [
            'RAG no elimina la ingeniería de contexto (context engineering): automatiza parte de la selección.',
            'La calidad de la respuesta generada depende de la calidad de los fragmentos recuperados.',
            'Para evaluar el sistema, conviene medir la recuperación (retrieval) de forma aislada.'
          ]
        }
      ]
    },
    {
      id: 'taller-celulas-rag',
      title: '05. Taller por Células: Mini Tubería RAG en Python',
      subtitle: 'Construcción local paso a paso: Chunking, Embeddings, Retrieval y Context Assembly',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'RAG no empieza en el LLM: empieza preparando y recuperando contexto de alta calidad. En esta actividad práctica en equipo, cada célula construirá una mini tubería RAG completa en Python, dividiendo documentos con solapamiento, vectorizando fragmentos, recuperando el Top-K y ensamblando el contexto final.'
        },
        {
          type: 'CALLOUT',
          variant: 'info',
          title: 'Guía de Trabajo de la Célula',
          message: 'Descarga el archivo M04-L02-demo-rag-python-por-celulas.md. Contiene las instrucciones paso a paso, la base de conocimiento (knowledge_base.txt), los 4 scripts modulares y la demo unificada demo_rag.py.'
        }
      ]
    }
  ]
};
