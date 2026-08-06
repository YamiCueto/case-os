export enum CommandCategory {
  Navigation = 'Navigation',
  Workspace = 'Workspace',
  Search = 'Search',
  Learning = 'Learning',
  System = 'System',
  Developer = 'Developer'
}

/**
 * Representa un comando dentro de la plataforma (ej. "Continuar curso", "Buscar laboratorios").
 * Es puramente declarativo y no contiene lógica de ejecución directa.
 */
export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: CommandCategory;
  keywords?: string[];
  shortcut?: string[]; // Ej: ['meta', 'k'], ['ctrl', 'shift', 'p']
  commandId?: string; // ID interno para que el dispatcher sepa qué hacer si no es una ruta
  route?: string; // Ruta a navegar si el comando es de navegación
  workspace?: string; // ID del workspace al que pertenece (opcional)
  enabled?: boolean;
}
