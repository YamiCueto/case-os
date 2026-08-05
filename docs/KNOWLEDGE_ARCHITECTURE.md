# Arquitectura del CASE Knowledge Engine

Este documento define las restricciones y patrones arquitectónicos del **Knowledge Engine**, el núcleo del que beben características como CASE Library, CASE Labs, y futuros catálogos.

## Principio Principal: "Static First"

Toda la aplicación debe ser compatible con GitHub Pages en su iteración actual, pero debe estar blindada para una evolución transparente a Backends o Modelos RAG.

## Diagrama de Capas (Contrato Oficial)

El producto implementa un patrón de abstracción agresivo:

```text
Presentation (Componentes Angular: Pages, Micro-Components)
       ↓
Application Services (Orquestadores: LibraryService, SearchEngine)
       ↓
Repository (Contratos genéricos: KnowledgeRepository)
       ↓
Storage Provider (Persistencia de usuario: StorageProvider)
       ↓
Data Source (Archivos ts, LocalStorage, IndexedDB, REST API)
```

## Evolución Tecnológica (Roadmap del Motor)

La interfaz de usuario nunca debe verse afectada por el crecimiento del motor de datos. 

1. **Static Config (Completado):** Archivos TypeScript como "Base de Datos".
2. **Local Storage (Completado):** Persistencia de preferencias del usuario.
3. **REST API (Pendiente):** Migración del Repository a llamadas HTTP (ej. Supabase o Spring Boot).
4. **Vector Search (Pendiente):** Utilización de \`embeddingId\` para búsqueda por similitud de contenido.
5. **RAG (Pendiente):** Generación de respuestas basadas en el contexto del recurso.
6. **AI Agents (Pendiente):** Ejecución autónoma de tareas basadas en los repositorios.

## Dominio Reutilizable

Todos los recursos se basan en \`KnowledgeResource\`. Cualquier módulo (Library, Labs, Playbooks) instanciará su propio repositorio respetando esta estructura, que está lista para internacionalización (i18n) e Inteligencia Artificial desde el día uno.
