# CASE Library Architecture (Engine)

## 1. Visión General
La **CASE Library** no es una simple pantalla, es una instancia del **Catalog Engine** genérico de la academia. Este motor está diseñado para ser la fundación de todas las futuras bibliotecas (Agentes, Prompts, Plantillas, Contextos, Checklists). 

Su propósito es desacoplar completamente la **Presentación (Angular)** del **Contenido (Datos)**.

## 2. Principio "Static First"
Toda la arquitectura inicial está diseñada para ser compatible con **GitHub Pages** (entorno sin servidor ni base de datos):
- **Cero Backend:** Los datos viven en archivos estáticos (`.ts` / `.json`).
- **Abstracción Estricta:** Los componentes de UI acceden a los datos **exclusivamente a través de Servicios**. Los componentes nunca importan los archivos de configuración directamente.
- **Preparado para Evolución:** La interfaz del repositorio (`ResourceRepository`) usa Signals o flujos asíncronos para simular comportamiento de red. El día de mañana, sustituir el origen de datos estático por una llamada a una API REST (o Firebase/Supabase) requerirá modificar únicamente el Servicio, con **cero impacto** en los componentes visuales.

## 3. Dominio Extensible (Preparado para IA)
El modelo principal es `Resource`. No está atado a ser solo un "Prompt".
Está diseñado para soportar metadatos avanzados:
- Atributos estándar: Título, descripción, dificultad, tecnología.
- Extensibilidad: Un mapa clave-valor `metadata: Record<string, any>` permite inyectar campos arbitrarios sin romper los tipos (ej. versión de modelo, tokens estimados).
- Preparación para Vectores: Se incluye un campo opcional `embeddingId` para futuras implementaciones de búsqueda semántica o integraciones con bases de datos vectoriales (RAG).

## 4. Contratos (Interfaces)
Se define una interfaz genérica `ResourceRepository` que debe ser implementada por cualquier servicio que provea recursos (ej. `LibraryService`).

```typescript
export interface ResourceRepository<T extends Resource> {
  getAll(): Signal<T[]>;
  getById(id: string): T | undefined;
  search(query: string): T[];
  filter(criteria: ResourceFilter): T[];
}
```

Al utilizar este contrato, garantizamos que Angular confíe en la abstracción y no en la implementación concreta.
