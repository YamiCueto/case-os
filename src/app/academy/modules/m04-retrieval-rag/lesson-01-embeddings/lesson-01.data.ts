import { LessonDocument } from '../../../models/lesson-document.models';

export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c10',
  sections: [
    {
      id: 'lexical-vs-semantic-search',
      title: '01. El problema: palabras frente a significado',
      subtitle: 'Representando conocimiento matemático en espacios multidimensionales',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Durante décadas buscamos información por coincidencia de palabras clave (Búsqueda Léxica). Si buscas "crédito", el sistema busca la palabra exacta. Pero si el usuario dice "necesito financiación", no encuentra el documento. La búsqueda semántica resuelve esto traduciendo significado a geometría.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'lexical-semantic-search'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Conclusión del Experimento',
          items: [
            'BM25 (Léxico) es excelente para buscar códigos exactos o términos muy específicos.',
            'Vector Search (Semántico) brilla cuando el usuario describe su intención sin usar los términos técnicos del negocio.'
          ]
        }
      ]
    },
    {
      id: 'que-es-un-embedding',
      title: '02. Representaciones vectoriales (Embeddings)',
      subtitle: 'Traduciendo significado a vectores geométricos',
      blocks: [
        {
          type: 'PARAGRAPH',
      text: 'Una representación vectorial (embedding) es una lista ordenada de números que aproxima el significado de un texto en un espacio de muchas dimensiones.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'embeddings-2d'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Concepto Clave de Embeddings',
          message: 'Textos con significados similares tendrán vectores con valores numéricos muy próximos, sin importar que no compartan palabras idénticas.'
        }
      ]
    },
    {
      id: 'similitud-coseno',
      title: '03. Medir similitud (cosine similarity)',
      subtitle: 'Álgebra lineal para comparar intenciones',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Para saber qué tan parecidos son dos conceptos, medimos el ángulo entre sus vectores usando la Similitud Coseno.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'cosine-similarity'
        }
      ]
    },
    {
      id: 'nearest-neighbors',
      title: '04. Recuperación Top-K (Top-K retrieval)',
      subtitle: 'Encontrando los vecinos más cercanos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Dado un vector de consulta (ej. "Quiero ahorrar"), buscamos recuperar los K documentos más cercanos en el espacio vectorial (Top-K).'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'nearest-neighbors'
        }
      ]
    },
    {
      id: 'hnsw-navigation',
      title: '05. Índice HNSW (approximate nearest neighbors)',
      subtitle: 'Búsqueda sub-lineal a gran escala',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Buscar exhaustivamente el Top-K contra millones de vectores toma demasiado tiempo. HNSW (Hierarchical Navigable Small World) crea un índice en forma de grafo para navegar rápidamente.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'hnsw-navigation'
        }
      ]
    },
    {
      id: 'hybrid-search-y-conclusion',
      title: '06. Búsqueda híbrida (hybrid search)',
      subtitle: 'Combinando BM25 con Embeddings',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'La búsqueda semántica puede fallar buscando códigos específicos ("Resolución 2024-5"). Usamos Reciprocal Rank Fusion (RRF) para combinar los rankings de BM25 y Vector Search.'
        },
        {
          type: 'EXPERIENCE',
          experienceId: 'hybrid-search'
        }
      ]
    },
    {
      id: 'retrieval-decision',
      title: '07. Ejercicio de Integración',
      subtitle: 'Diseñando el buscador para analistas',
      blocks: [
        {
          type: 'EXPERIENCE',
          experienceId: 'retrieval-decision'
        }
      ]
    },
    {
      id: 'taller-practico-python',
      title: '08. Taller Práctico: Demo en Python',
      subtitle: 'Guía paso a paso para ejecutar embeddings, similitud coseno y Top-K en local',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Lleva la teoría a la práctica en tu propia terminal. Este taller práctico utiliza Sentence Transformers (all-MiniLM-L6-v2) y scikit-learn para transformar frases a vectores numéricos de 384 dimensiones, comparar similitudes y construir un buscador semántico interactivo sin depender de APIs de pago ni claves externas.'
        },
        {
          type: 'CALLOUT',
          variant: 'info',
          title: 'Guía del Aprendiz para la Sesión en Vivo',
          message: 'Descarga el archivo markdown demo_embeddings_python_clase.md. Contiene el entorno virtual (.venv), comandos pip, explicaciones para la clase y los 5 scripts ejecutables.'
        }
      ]
    }
  ]
};
