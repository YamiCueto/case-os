# ADR 0006: Context Before Intelligence

## Contexto
El avance de CASE OS hacia la Inteligencia Artificial (AI Provider Layer) plantea un desafío crítico: ¿Cómo aseguramos que la IA reciba la información correcta para razonar sin que la interfaz de usuario deba armar consultas complejas? 
Si la UI envía directamente un input al LLM, o si el LLM debe navegar libremente el Grafo de Conocimiento, se pierde eficiencia, predecibilidad y seguridad. Además, múltiples motores de IA (OpenAI, Anthropic) tendrían que implementar lógica repetida de recuperación de CASE OS.

## Decisión
Adoptamos el principio **Context Before Intelligence** y creamos el **Knowledge Context Engine**. CASE OS ahora se consolida como una **Reasoning Platform** (Plataforma de Razonamiento).

El flujo queda definido de la siguiente manera:
1. **Intención:** La UI captura una entrada agnóstica (`ContextInput`) y la delega al `CaseFacade`.
2. **Contexto:** El `ContextBuilder` (función pura) deduce el propósito del usuario (`RetrievalIntent`) y construye el `KnowledgeContext`.
3. **Recuperación:** Si se requiere información, el `KnowledgeRetrievalEngine` ejecuta sus estrategias inmutables basándose en el Contexto construido.
4. **Inteligencia:** (Futuro) El AI Provider Layer recibe un `KnowledgeContext` rico y pre-procesado, dedicándose exclusivamente a generar respuestas en base a la información que CASE OS ya recopiló, filtró y organizó.

### El Grafo como Abstracción
Para navegar semánticamente (ej. buscar el siguiente laboratorio que requiere este prompt), el motor no dependerá de implementaciones concretas como `KnowledgeRegistry` ni de un LLM. El dominio define una interfaz `KnowledgeGraph` que, junto con un `GraphNavigator`, recorrerá el conocimiento y devolverá `SemanticPath`s estructurados.

## Consecuencias

### Positivas
- **Desacoplamiento Absoluto del AI Layer:** Mañana podemos cambiar de proveedor de LLM en cuestión de minutos, porque la verdadera "inteligencia de recuperación y contexto" vive en Typescript en el Core de CASE OS, no en los embeddings de OpenAI.
- **UI "Tonta":** La interfaz (Angular/Command Palette) se limita a recopilar clics y teclas, pasando DTOs a la Fachada.
- **Reusabilidad:** El Contexto es útil incluso sin IA. Puede usarse para sugerir el siguiente curso, auto-completar comandos, etc.
- **Rendimiento y Testabilidad:** El `ContextBuilder` es una función completamente determinista, lo que hace su batería de tests trivial y ultra veloz.

### Negativas / Riesgos
- **Orquestación Compleja:** Introducir un `CaseFacade` y un pipeline de contexto antes de la búsqueda añade latencia lógica y requiere un profundo entendimiento arquitectónico por parte de nuevos desarrolladores, quienes verán múltiples clases y DTOs intermedios antes de llegar al resultado final.
