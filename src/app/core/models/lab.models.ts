import { KnowledgeDifficulty } from './knowledge.models';

export type LabType = 'GUIDED' | 'PRACTICE' | 'CHALLENGE' | 'CAPSTONE' | 'ASSESSMENT';
export type LabStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Representa un paso individual dentro de un laboratorio.
 */
export interface LabStep {
  id: string;
  title: string;
  content: string; // Markdown content para las instrucciones
  
  // Referencias al Knowledge Engine
  requiredResources?: string[]; // Arrays de slugs o IDs
  optionalResources?: string[];
  
  // Criterios de éxito y hints
  outputs?: string[];
  validationHints?: string[];
}

/**
 * Definición estática e inmutable de un laboratorio.
 */
export interface LabDefinition {
  id: string;
  slug: string;
  version: string;
  status: LabStatus;
  
  type: LabType;
  difficulty: KnowledgeDifficulty;
  
  title: string;
  description: string;
  estimatedTime: number; // en minutos
  
  prerequisites?: string[]; // Referencias a otros Labs o Conocimientos
  technologies: string[];
  
  steps: LabStep[];
}

/**
 * Estado de la ejecución de un Lab para un usuario.
 */
export interface LabExecution {
  labId: string;
  userId: string; // Para el futuro, actualmente puede ser 'local-user'
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStepId?: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Progreso detallado del usuario por paso.
 */
export interface LabProgress {
  executionId: string; // Link a LabExecution
  stepId: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  completedAt?: string;
}
