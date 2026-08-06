> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# Arquitectura del CASE Knowledge Engine

Este documento define las restricciones y patrones arquitectÃ³nicos del **Knowledge Engine**, el nÃºcleo del que beben caracterÃ­sticas como CASE Library, CASE Labs, y futuros catÃ¡logos.

## Principio Principal: "Static First"

Toda la aplicaciÃ³n debe ser compatible con GitHub Pages en su iteraciÃ³n actual, pero debe estar blindada para una evoluciÃ³n transparente a Backends o Modelos RAG.

## Diagrama de Capas (Contrato Oficial)

El producto implementa un patrÃ³n de abstracciÃ³n agresivo:

```text
Presentation (Componentes Angular: Pages, Micro-Components)
       â†“
Application Services (Orquestadores: LibraryService, SearchEngine)
       â†“
Repository (Contratos genÃ©ricos: KnowledgeRepository)
       â†“
Storage Provider (Persistencia de usuario: StorageProvider)
       â†“
Data Source (Archivos ts, LocalStorage, IndexedDB, REST API)
```

## EvoluciÃ³n TecnolÃ³gica (Roadmap del Motor)

La interfaz de usuario nunca debe verse afectada por el crecimiento del motor de datos. 

1. **Static Config (Completado):** Archivos TypeScript como "Base de Datos".
2. **Local Storage (Completado):** Persistencia de preferencias del usuario.
3. **REST API (Pendiente):** MigraciÃ³n del Repository a llamadas HTTP (ej. Supabase o Spring Boot).
4. **Vector Search (Pendiente):** UtilizaciÃ³n de \`embeddingId\` para bÃºsqueda por similitud de contenido.
5. **RAG (Pendiente):** GeneraciÃ³n de respuestas basadas en el contexto del recurso.
6. **AI Agents (Pendiente):** EjecuciÃ³n autÃ³noma de tareas basadas en los repositorios.

## Dominio Reutilizable

Todos los recursos se basan en \`KnowledgeResource\`. Cualquier mÃ³dulo (Library, Labs, Playbooks) instanciarÃ¡ su propio repositorio respetando esta estructura, que estÃ¡ lista para internacionalizaciÃ³n (i18n) e Inteligencia Artificial desde el dÃ­a uno.