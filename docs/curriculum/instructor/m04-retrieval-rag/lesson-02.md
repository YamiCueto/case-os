# Lesson 02 — The RAG Pipeline

## 1. Propósito de la clase
Articular la arquitectura completa de RAG, enfocándose en su naturaleza de tubería (pipeline). Enseñar la Regla de Oro: **El proceso de Retrieval recupera candidatos, pero NO decide automáticamente qué merece entrar al contexto final.**

## 2. Qué debe aprender el estudiante
- Diseñar la tubería paso a paso: `Knowledge Source → Retrieval Candidates → Evaluation → Selection → Context Assembly → Validation`.
- Distinguir el proceso de "Ingesta" (Offline) del proceso de "Consulta" (Online).
- Entender que los candidatos devueltos por la base de datos deben ser re-evaluados (Re-ranking o filtrado) antes de ser inyectados en el LLM.

## 3. Conceptos fundamentales

### 3.1 El Pipeline de Consulta (Online RAG)
No consiste en "buscar y pasar al LLM". Consta de etapas defensivas.

#### Concept Analogy: El Pipeline de RAG
- **Analogía cotidiana:** Un casting de actores para una película.
- **Mapeo:** 
  - *Knowledge Source:* La base de datos de todos los actores del país.
  - *Retrieval Candidates:* El director de casting hace una búsqueda rápida y llama a 20 actores que encajan físicamente (Búsqueda Vectorial).
  - *Evaluation & Selection:* El director hace audiciones para quedarse solo con los 3 mejores (Re-ranking/Filtrado).
  - *Context Assembly:* El director presenta esos 3 al productor (El LLM) junto con las instrucciones del papel.
- **Límite de la analogía:** Un actor se adapta a la audición; los documentos estáticos no cambian. El LLM (productor) está obligado a fabricar una respuesta utilizando únicamente los documentos (actores) que el ensamblador le proporcionó, independientemente de si el ensamblador hizo un mal trabajo en la selección.
- **Traducción técnica:** Flujo secuencial de *Query Expansion -> Vector Search (Top K) -> Re-ranking -> Context Manifest Assembly -> LLM Generation*.
- **Ejemplo aplicado a SWE:** El usuario pregunta "¿Cómo levanto el entorno de staging?". El sistema busca y extrae 10 documentos (Candidatos). Pasa esos 10 por un modelo de re-ranking que descarta 8 documentos obsoletos (Selección). Toma los 2 documentos finales, los comprime y los inyecta en el Prompt (Assembly). El LLM responde correctamente (Validation).

### 3.2 Ingesta y Fragmentación (Chunking)
Para que el motor de búsqueda encuentre información útil, los documentos originales deben partirse en piezas digeribles ("chunks") antes de ser convertidos a vectores.

#### Concept Analogy: Chunking
- **Analogía cotidiana:** Cortar una pizza para comerla.
- **Mapeo:** La pizza entera es el documento original (ej. un libro de 500 páginas). Las porciones son los *chunks*.
- **Límite de la analogía:** Cortar una rebanada de pizza no afecta su sabor. Pero cortar un documento por la mitad del párrafo destruye el significado semántico para el vector.
- **Traducción técnica:** División de texto basada en tokens, caracteres o fronteras semánticas (ej. `\n\n` o encabezados de Markdown).
- **Ejemplo aplicado a SWE:** Ingerir un PDF gigante no sirve de nada. Un buen pipeline de RAG hace *parsing* del PDF, separa los párrafos respetando los títulos, y genera un embedding por cada párrafo.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Configuro el Vector DB para que me devuelva los 5 documentos más similares, los meto directo al prompt, y la IA resolverá el resto."*
**Consecuencia:** El Vector DB devolverá a menudo documentos redundantes, o documentos que tienen similitud matemática pero dicen cosas opuestas. Si omites el paso de **Selección/Evaluación** y envías todo directo, romperás la regla del Contexto Mínimo Útil (M03), saturando al modelo con ruido y provocando alucinaciones por conflicto de información.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** No contratas al primer candidato que cruza la puerta; revisas su currículum, y si no sirve, lo descartas.
- **Mecanismo:** El Retrieval devuelve un *Top-K* de resultados basados en similitud matemática cruda. La Evaluación/Selección (ej. mediante un modelo Cross-Encoder ligero) evalúa la relevancia real del documento frente a la *query* específica del usuario, descartando los falsos positivos antes del ensamblaje.
- **Consecuencia de ingeniería:** El código de tu backend RAG es mucho más complejo que un `SELECT`. Involucra bucles de filtrado (guardrails) y lógica de negocio antes de siquiera invocar la API generativa.

## 6. Ejemplo técnico
**Flujo RAG Peligroso:**
`User Query -> Vector DB Search (k=5) -> LLM Prompt -> Answer`

**Flujo RAG de Ingeniería Robusta:**
`User Query -> Query Rewriting -> Vector DB Search (k=20) -> BM25 Search (k=20) -> Merge & Deduplicate -> Cross-Encoder Re-rank (Top 5) -> Filter Outdated -> Context Assembly (Top 3) -> LLM Prompt -> Answer`

## 7. Ejemplo aplicado a Software Engineering
Sistema de soporte a desarrolladores internos (Chatbot de Slack). Un ingeniero pregunta: "Error OOM en el microservicio Payment". El sistema hace *Retrieval* de tickets pasados. Encuentra 15. Pasa por el paso de *Selection*, eliminando los tickets que no tienen la etiqueta "Resolved". Ensambla los 3 tickets resueltos en el contexto. El LLM resume la solución correcta.

## 8. Errores conceptuales frecuentes
- **"El LLM hace el RAG"**: Falso. RAG es un patrón arquitectónico de tu backend. El LLM es solo el eslabón final (el *Generador*).
- **"Chunking fijo"**: Partir todo el texto rígidamente en 500 caracteres corta palabras a la mitad, rompiendo los vectores. Hay que usar partidores semánticos (ej. Recursive Character Text Splitter).

## 9. Preguntas para el grupo
- "Si nuestro RAG devuelve información contradictoria (un documento dice A y el otro B), ¿quién debe decidir la verdad? ¿El LLM en el prompt, o el pipeline en el paso de Evaluación antes de enviárselo al LLM?" (Idealmente el pipeline, priorizando por recencia o fuente autorizada).
- "¿Por qué hacer RAG es fundamentalmente un problema de pipelines de datos y no un problema de 'Inteligencia Artificial' pura?"

## 10. Mini ejercicio
Muestra en pizarra los componentes desordenados: `Context Assembly`, `Vector DB`, `LLM`, `User Query`, `Re-ranker`, `Chunking`. Pide al grupo que dibuje la arquitectura conectando los bloques en el orden correcto para un flujo Online vs un flujo Offline (Ingesta).

## 11. Demo relacionada
*(Demo 04).*

## 12. Discusión
Retrieval genera candidatos. Context Engineering (M03) decide cuáles se usan. Prompt Engineering (M02) le dice al modelo qué hacer con ellos. Esta es la Trinidad de la ingeniería de software con LLMs.

## 13. Preparación para la siguiente clase
"El pipeline que diseñamos se ve increíble en la pizarra. Pero cuando llegue a producción, ¿cómo sabemos si el buscador está devolviendo los documentos correctos o pura basura? Necesitamos medirlo objetivamente. En la próxima clase aprenderemos a evaluar Retrieval usando métricas reales de Data Science."
