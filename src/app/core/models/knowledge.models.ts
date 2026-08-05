/**
 * Tipos de recursos soportados por el motor de catálogo (Knowledge Engine).
 */
export type KnowledgeType = 
  | 'PROMPT' 
  | 'ARCHITECTURE' 
  | 'CHECKLIST' 
  | 'TEMPLATE' 
  | 'AGENT' 
  | 'CONTEXT'
  | 'LAB'
  | 'COURSE';

export type KnowledgeDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type KnowledgeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DEPRECATED';

/**
 * Soporte para Internacionalización (i18n).
 */
export type LocalizedString = string | Record<string, string>;

/**
 * Modelo base genérico para el Knowledge Engine.
 * Diseñado para soportar múltiples catálogos (Library, Labs, Courses)
 * y prepararse para IA (Embeddings, RAG, Búsqueda Semántica).
 */
export interface KnowledgeResource {
  // Identificadores y Versionado
  id: string;
  slug: string;
  version: string;
  status: KnowledgeStatus;
  
  // Metadatos Temporales y Autoría
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  author?: string;

  // Clasificación Core
  type: KnowledgeType;
  difficulty: KnowledgeDifficulty;
  
  // Contenido Principal (i18n ready)
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString; // Usualmente Markdown
  summary?: LocalizedString; // Resumen corto para IA o tarjetas
  
  // Metadatos de Indexación y Relación
  technologies: string[];
  tags: string[];
  keywords?: string[]; // Palabras clave ocultas para el Search Engine
  aliases?: string[];  // Nombres alternativos (ej. "Clean Architecture" para "Hexagonal")
  
  // Grafos y Relaciones (Para el SearchEngine y UI)
  relatedIds?: string[];
  
  // Preparación para IA (Vector Search / RAG)
  embeddingId?: string;
  
  // Extensibilidad sin romper el contrato
  metadata?: Record<string, any>;
}

/**
 * Criterios de filtrado genéricos para el Knowledge Engine.
 */
export interface KnowledgeFilter {
  type?: KnowledgeType[];
  difficulty?: KnowledgeDifficulty[];
  technologies?: string[];
  tags?: string[];
  searchTerm?: string;
}
