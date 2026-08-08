# ADR 0007: Framework Freeze & Content-Driven Architecture

## Contexto
Durante las fases iniciales de CASE OS, se construyó una infraestructura profunda: Workspace Platform, Command Platform y Knowledge Platform (Registry, Retrieval Engine, Context Engine). Esta arquitectura fundacional garantizó un diseño modular, puro y capaz de escalar hacia capacidades de Inteligencia Artificial (AI Provider Layer).
Sin embargo, seguir construyendo motores o abstracciones (como el AI Provider Layer) en este punto resultaría en un sistema excesivamente ingenieril sin conocimiento real que lo justifique o lo valide. La plataforma necesita demostrar su valor como sistema operativo educativo y herramienta de productividad antes de seguir expandiéndose a nivel arquitectónico.

## Decisión
Se declara un **Framework Freeze** para la arquitectura fundacional de CASE OS.
A partir de este hito:
1. **No se crearán nuevas abstracciones** (Engines, Registries, Facades) a menos que el contenido (clases, laboratorios, librerías) lo vuelva estrictamente necesario.
2. **El AI Provider Layer queda pospuesto** hasta que exista suficiente contexto estructurado en la plataforma que justifique su consumo.
3. El paradigma de desarrollo pasa a ser **Content-Driven**: el código nuevo debe estar directamente relacionado con poblar de conocimiento a Academy, Library y Labs, y la única arquitectura permitida será la que integre este contenido con la `Knowledge Platform` existente.

## Consecuencias

### Positivas
- **Foco en el Producto:** Se valida la hipótesis de que CASE OS sirve para aprender e investigar, inyectando un currículum real (ej. IA Generativa).
- **Validación Orgánica de la Arquitectura:** Al conectar el contenido real con el `KnowledgeRegistry` y la `CaseFacade`, cualquier deficiencia o exceso arquitectónico saldrá a la luz empíricamente.
- **Prevención de Sobreingeniería:** Se evita construir interfaces o motores de inferencia (IA) para escenarios que en la práctica podrían resolverse con simple navegación semántica (Context Engine).

### Negativas / Riesgos
- **Pausa en Capacidades LLM:** Al posponer la capa de IA, la plataforma seguirá operando temporalmente como un LMS ultra-avanzado sin integración nativa con OpenAI/Anthropic.
- **Acoplamiento de Contenido:** Si el contenido se maqueta rápidamente (ej. archivos estáticos en vez de un headless CMS o markdown puro), podríamos incurrir en deuda técnica para su renderizado.
