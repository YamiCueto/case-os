# M04 · Lección 03 — Evaluación de la recuperación

**Duración sugerida en vivo:** aproximadamente 2 horas.
**Pregunta guía:** «¿Cómo sabemos si el sistema recuperó la evidencia correcta antes de pedir una respuesta al LLM?»

## Conceptos para explicar

- **Precisión (precision):** de los resultados que trajimos, cuántos sí eran útiles.
- **Cobertura (recall):** de todos los resultados útiles que existían, cuántos logramos traer.
- **Top-K:** número de candidatos que permitimos pasar a la siguiente etapa.
- **Reordenamiento (reranking):** volver a ordenar los candidatos para poner primero los más adecuados.

## Timeline

| Tiempo | Conducción |
| --- | --- |
| 17:00–17:15 | Recupera la diferencia entre candidatos y respuesta final. |
| 17:15–17:35 | Explica precisión y cobertura con una búsqueda de cinco documentos. |
| 17:35–18:00 | Equipos calculan una métrica simple a partir de resultados marcados como útiles o no útiles. |
| 18:00–18:15 | Pausa y puesta en común. |
| 18:15–18:40 | Varía Top-K y pregunta qué mejora y qué empeora. |
| 18:40–19:00 | Conecta métricas, reordenamiento y Demo 04. |

## Qué observar y qué significa

Observen que aumentar Top-K puede incrementar cobertura, pero también introducir ruido y bajar precisión. El resultado no busca un número universalmente correcto: muestra que una estrategia se evalúa según la tarea y un conjunto de casos de prueba.

## Ejercicio

Da cinco candidatos y marca tres como útiles. Pide calcular precisión cuando Top-K es 2 y cuando es 5. Pregunta cuál elegirían para un asistente que debe responder con pocas fuentes confiables y por qué.
