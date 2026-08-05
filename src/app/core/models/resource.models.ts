/**
 * Tipos de recursos soportados por el motor de catálogo.
 * Diseñado para ser extensible a futuros casos de uso de IA.
 */
export type ResourceType = 
  | 'PROMPT' 
  | 'ARCHITECTURE' 
  | 'CHECKLIST' 
  | 'TEMPLATE' 
  | 'AGENT' 
  | 'CONTEXT';

export type ResourceDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

/**
 * Modelo base genérico para cualquier recurso dentro de la plataforma.
 * Preparado para soportar capacidades avanzadas (como búsqueda semántica).
 */
export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  
  // Clasificación
  difficulty: ResourceDifficulty;
  technologies: string[]; // ej. ['Angular', 'Spring Boot', 'OpenAI']
  tags: string[];         // ej. ['Testing', 'Refactoring', 'RAG']
  
  // Contenido principal (usualmente renderizado como Markdown)
  content: string;
  
  // Metadatos extensibles para evitar rigidez en el modelo
  // Puede almacenar: version, estimatedTokens, author, etc.
  metadata?: Record<string, any>;
  
  // Campo futuro: Referencia para integración con Vector DB o búsqueda semántica
  embeddingId?: string;
}

/**
 * Criterios de filtrado genéricos para repositorios.
 */
export interface ResourceFilter {
  type?: ResourceType[];
  difficulty?: ResourceDifficulty[];
  technologies?: string[];
  tags?: string[];
  searchTerm?: string;
}
