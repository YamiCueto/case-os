# ADR 0005: Knowledge Retrieval Pipeline

## Contexto
Siguiendo la decisión de centralizar el ecosistema a través del `KnowledgeRegistry` (ADR-0004), surge la necesidad de consultar dicho ecosistema.
Tradicionalmente, esto se implementa como un `SearchEngine` monolítico que itera sobre los proveedores, junta resultados y los ordena ciegamente. Sin embargo, en CASE OS, la recuperación de conocimiento debe abarcar búsquedas léxicas, semánticas (vectores), y recomendaciones por contexto.
Si acoplamos todo en una sola clase, agregar capacidades de IA o embeddings requerirá modificar profundamente la lógica core. Además, la deduplicación y el ranking de resultados exigen un flujo estructurado y verificable en cada paso.

## Decisión
Se decidió diseñar el motor de recuperación como un **Knowledge Retrieval Engine** basado en un **Pipeline Inmutable y Componible**, soportado por el patrón **Estrategia (Strategy)**.

### El Pipeline (Immutable Stages)
Cada etapa del pipeline toma un DTO inmutable y genera otro nuevo, nunca mutando el anterior:
1. **Collect:** Llama a los Providers y obtiene DTOs mínimos (`SearchCandidate`).
2. **Lazy Hydration:** Solo hidrata (obtiene el `KnowledgeNode`) de los candidatos más prometedores o necesarios, manteniendo la memoria baja.
3. **Score:** Aplica dinámicamente estrategias para desglosar por qué un nodo es relevante.
4. **Merge & Deduplicate:** Consolida candidatos duplicados (usando el `canonicalId`) que provengan de distintos Providers.
5. **Rank:** Aplica estrategias de ordenamiento (ej. Learning Path Ranking).
6. **Result:** Devuelve `SearchResult` con una explicación estructurada (`SearchExplanation`), no con texto humano o un "score mágico".

### Strategies & Registries
- **RetrievalStrategy:** Clases registrables dinámicamente que puntúan características (ej. `TagsStrategy`, `RelationsStrategy`, `EmbeddingStrategy`).
- **RankingStrategy:** Clases registrables que definen el ordenamiento final.

### KnowledgeSource Abstraction
El Engine no dependerá del `KnowledgeRegistry` directamente, sino de una abstracción genérica `KnowledgeSource`, lo cual permite inyectar registries, bases de datos RAG o endpoints remotos sin cambiar el pipeline.

## Consecuencias

### Positivas
- **Extensibilidad Pura:** Agregar búsqueda semántica con vectores de embeddings es tan simple como registrar un nuevo `RetrievalStrategy`.
- **Trazabilidad (Explainable AI):** Al utilizar `SearchExplanation` estructurado, la UI (o el AI Engine) podrá decirle exactamente al usuario por qué se le recomendó un recurso.
- **Rendimiento:** El *Lazy Hydration* previene que el motor colapse la memoria al traer cientos de nodos irrelevantes de la base de datos.
- **Deduplicación Conceptual:** `canonicalId` asegura que, si dos Workspaces proveen el mismo recurso (ej. un mismo Prompt), la plataforma lo unifique en un solo resultado enriquecido.

### Negativas / Riesgos
- **Sobreingeniería Inicial:** Es considerablemente más complejo que un simple mapeo de texto; requiere la creación de pipelines, múltiples DTOs intermedios y registros de estrategias antes de ver la primera búsqueda funcionar en pantalla.
- **Curva de Aprendizaje:** Comprender la inmutabilidad y la composición del pipeline exigirá que los desarrolladores estudien la arquitectura antes de implementar una nueva estrategia de ordenamiento.
