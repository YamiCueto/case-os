export interface M04Term {
  id: string;
  spanish: string;
  english: string;
  definition: string;
  teachingHint: string;
}

/** Términos visibles compartidos por las experiencias pedagógicas de M04. */
export const M04_TERMINOLOGY = {
  embeddings: {
    id: 'embeddings',
    spanish: 'Representaciones vectoriales',
    english: 'Embeddings',
    definition: 'Listas de números que permiten comparar el significado de textos.',
    teachingHint: 'No guardan palabras; representan relaciones de significado.'
  },
  vectorDatabase: {
    id: 'vector-database',
    spanish: 'Base de datos vectorial',
    english: 'Vector database',
    definition: 'Sistema que almacena representaciones vectoriales para buscar elementos similares.',
    teachingHint: 'Guarda vectores y metadatos; no redacta respuestas.'
  },
  chunking: {
    id: 'chunking',
    spanish: 'Fragmentación',
    english: 'Chunking',
    definition: 'División de un documento en fragmentos manejables sin perder su idea principal.',
    teachingHint: 'Un fragmento demasiado grande trae ruido; uno muy pequeño puede perder contexto.'
  },
  retrieval: {
    id: 'retrieval',
    spanish: 'Recuperación',
    english: 'Retrieval',
    definition: 'Búsqueda de candidatos útiles para responder una consulta.',
    teachingHint: 'Recuperar candidatos no equivale a tener una respuesta final.'
  },
  query: {
    id: 'query',
    spanish: 'Consulta',
    english: 'Query',
    definition: 'Pregunta o necesidad que inicia la búsqueda.',
    teachingHint: 'La consulta se transforma para poder compararla con los documentos indexados.'
  },
  contextBuild: {
    id: 'context-build',
    spanish: 'Construcción de contexto',
    english: 'Context building',
    definition: 'Ensamblaje de la pregunta con la evidencia recuperada antes de llamar al LLM.',
    teachingHint: 'Es el puente entre recuperar información y generar una respuesta.'
  },
  precision: {
    id: 'precision',
    spanish: 'Precisión',
    english: 'Precision',
    definition: 'Proporción de resultados recuperados que realmente son útiles.',
    teachingHint: 'Mide calidad de señal entre lo que trajimos.'
  },
  recall: {
    id: 'recall',
    spanish: 'Cobertura',
    english: 'Recall',
    definition: 'Proporción de resultados útiles existentes que logramos recuperar.',
    teachingHint: 'Mide cuánto conocimiento útil logramos encontrar.'
  }
} satisfies Record<string, M04Term>;

export function formatM04Term(term: M04Term): string {
  return `${term.spanish} (${term.english})`;
}
