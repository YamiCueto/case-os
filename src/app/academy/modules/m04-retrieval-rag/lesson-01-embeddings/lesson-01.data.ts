import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — Embeddings y Bases de Datos Vectoriales (c10)
 * Módulo 04 — Recuperación y RAG
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c10',
  sections: [
    {
      id: 'lexical-vs-semantic-search',
      title: '01. Búsqueda Léxica vs Búsqueda Semántica',
      subtitle: 'Representando conocimiento matemático en espacios multidimensionales',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Durante décadas buscamos información por coincidencia de palabras clave (Búsqueda Léxica). Si buscas "perro", el sistema busca la palabra exacta "perro". Pero si buscas "cachorro", no encuentra el documento. La búsqueda semántica resuelve esto traduciendo significado a geometría.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Búsqueda Léxica (Keyword Matching)',
            subtitle: 'Inverted Index & Coincidencia Exacta',
            icon: '🔎',
            badge: 'Léxico Tradicional',
            points: [
              'Mecanismo: TF-IDF, BM25, Inverted Index.',
              'Busca coincidencia exacta de caracteres o raíces de palabras.',
              'Falla en: Sinónimos ("perro" vs "cachorro"), errores ortográficos y comprensión del concepto global.',
              'Excelente para: Códigos de error exactos, números de factura, IDs y nombres propios.'
            ]
          },
          right: {
            title: 'Búsqueda Semántica (Vectorial)',
            subtitle: 'Geometría & Similitud Cosenoidal',
            icon: '🧠',
            badge: 'Embeddings',
            active: true,
            points: [
              'Mecanismo: Modelos de Embedding y Vector Databases.',
              'Traduce oraciones a vectores matemáticos densos (ej. 1536 dimensiones).',
              'Éxito en: Entender que "perro" y "cachorro" o "banco central" y "reserva federal" apuntan al mismo concepto geométrico.',
              'Falla en: Búsquedas con identificadores numéricos exactos o cadenas alfanuméricas.'
            ]
          }
        }
      ]
    },
    {
      id: 'que-es-un-embedding',
      title: '02. ¿Qué es un Embedding?',
      subtitle: 'Traduciendo significado a vectores geométricos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Un Embedding es una lista ordenada de números en coma flotante (un vector denso) que captura y representa el significado semántico de un texto dentro de un espacio vectorial de cientos o miles de dimensiones.'
        },
        {
          type: 'CODE',
          filename: 'vector-embeddings-representation.txt',
          language: 'text',
          code: `"El banco central subió las tasas" 
-> [0.012, -0.453, 0.892, ..., 0.111]

"La reserva federal incrementó el interés" 
-> [0.014, -0.450, 0.890, ..., 0.110]

"Me senté en el banco del parque"
-> [-0.881, 0.221, -0.104, ..., 0.992]`
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Concepto Clave de Embeddings',
          message: 'Textos con significados similares tendrán vectores con valores numéricos muy próximos, sin importar que no compartan palabras idénticas. En sistemas reales de ingeniería, estos vectores son producidos por modelos especializados (ej. text-embedding-3-small) y comparados mediante operaciones de álgebra lineal.'
        }
      ]
    },
    {
      id: 'similitud-y-vector-databases',
      title: '03. Similarity & Vector Databases',
      subtitle: 'Encontrando la aguja en el pajar a escala de milisegundos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Para recuperar conocimiento útil, necesitamos medir cuán cerca se encuentra la consulta del usuario respecto a millones de documentos almacenados.'
        },
        {
          type: 'EXAMPLE',
          title: 'Mecanismos de Búsqueda Vectorial',
          content: [
            'Cosine Similarity: Operación geométrica estándar para comparar el ángulo entre dos vectores. Produce un Score de -1.0 a 1.0 (cuanto más cercano a 1.0, mayor afinidad semántica).',
            'Vector Databases (Pinecone, Weaviate, pgvector): Motores especializados que indexan millones de vectores utilizando algoritmos de grafos aproximados (HNSW) para responder queries en milisegundos sin calcular la distancia contra toda la base de datos.'
          ],
          caption: 'El índice HNSW (Hierarchical Navigable Small World) permite búsqueda por vecinos más cercanos en tiempo sub-lineal.'
        }
      ]
    },
    {
      id: 'hybrid-search-y-conclusion',
      title: '04. Búsqueda Híbrida: Lo Mejor de Ambos Mundos',
      subtitle: 'Combinando BM25 con Embeddings para producción',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Límite de la Búsqueda Semántica Pura',
          message: 'La búsqueda semántica pura es deficiente buscando números de serie, códigos de producto o números de factura ("Factura #10024" vs "Factura #10025"). En arquitecturas de producción reales se utiliza Búsqueda Híbrida: ejecutar BM25 (Léxico) + Embeddings (Semántico) en paralelo y fusionar los resultados con algoritmos como Reciprocal Rank Fusion (RRF).'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Recuperación Vectorial',
          items: [
            'Los embeddings capturan la semántica profunda pero pierden precisión en términos técnicos exactos.',
            'Las bases de datos vectoriales optimizan la recuperación aproximada mediante índices HNSW.',
            'La Búsqueda Híbrida (BM25 + Vector) es el estándar de la industria para evitar puntos ciegos.'
          ]
        }
      ]
    }
  ]
};
