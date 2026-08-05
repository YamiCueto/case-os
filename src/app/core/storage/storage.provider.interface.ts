/**
 * Contrato de persistencia abstracto.
 * Permite cambiar de LocalStorage a IndexedDB o una API REST
 * sin modificar ningún servicio de la aplicación.
 */
export interface StorageProvider {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}
