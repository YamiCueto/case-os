# Knowledge Platform (Core Domain)

This module represents the **Knowledge Platform** of CASE OS. It is entirely agnostic of Angular, RxJS, and any specific presentation layer or Workspaces.

## Architectural Flow

The architecture follows a strict declarative pipeline:

```text
KnowledgeNode
        ↓
KnowledgeProvider
        ↓
KnowledgeRegistry
        ↓
SearchEngine
        ↓
ContextEngine
        ↓
RecommendationEngine
        ↓
AI Provider Engine
```

> **IMPORTANT:** The `AI Provider Engine` and `SearchEngine` DO NOT consume Workspaces (like Academy, Library, or Labs) directly. They exclusively consume the `KnowledgeRegistry`, which acts as the single source of truth for the entire OS.

## Core Entities

- **KnowledgeNode**: The fundamental entity representing any piece of knowledge (Course, Lab, Document, etc.). It is strictly **immutable** (`readonly`).
- **KnowledgeRelation**: Semantic connections between nodes (e.g., `requires`, `recommends`), enabling the Context Engine to traverse the graph.
- **KnowledgeProvider**: The contract that Workspaces must implement to inject their content into the registry. Uses pure `Promise` to remain framework-agnostic.
- **SearchResult**: A lightweight DTO returning references (`nodeId`, `providerId`) to avoid memory bloat and enforce deferred resolution (lazy hydration).
