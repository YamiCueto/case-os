# Timeline Pedagógico · M05 L07 — Observabilidad y Evaluación Agéntica

## Estructura Temporal de la Sesión (120 min)

Esta lección completa la **Engineering & Control Layer** (**Agent v5 → Agent v6**), introduciendo Structured Agent Tracing (`TraceEvent`, `sequence_no` monotónico, `InMemoryTraceCollector`, sanitización previa al `emit()`), evaluación agéntica determinista (`RunSummary.from_events()`, `EvaluationCase`, `AgentEvaluator`) y la distinción rigurosa entre Outcome y Trajectory como dimensiones independientes de la calidad del agente.

---

### Opción A: Sesión Intensiva Única (120 min)

| Intervalo | Bloque Temático | Dinámica / Actividades | Hito Clave |
|---|---|---|---|
| **00–10 min** | **Recap L06 y el Problema de la Caja Negra** | Recordar Agent v5 con guardrails, HITL y disyuntores. Plantear el problema detonante: el agente está gobernado, pero si falla a las 3 AM, ¿qué evidencia estructurada tienes de lo que hizo? | Estudiantes entienden que una respuesta final correcta no garantiza una corrida admisible. |
| **10–30 min** | **Structured Agent Tracing vs Logging** | Diferenciar `logger.info()` de `TraceEvent` tipado con `run_id`, `sequence_no` monotónico, `iteration`, `step_id` y payload sanitizado. Exploración interactiva de `exp-trace-explorer`. | Desmitificación: un `logger.info("Tool called")` no permite reconstruir la trayectoria de 1,000 corridas paralelas por `run_id`. |
| **30–50 min** | **Outcome vs Trajectory: Las Dos Dimensiones** | Caso de dos corridas con respuesta final idéntica: una con 4 iteraciones y 0 fallos, otra con 9 iteraciones y 2 fallos recuperados. En producción con 100,000 req/día, la segunda es un desastre financiero. Exploración de `exp-run-comparison`. | Estudiantes aprenden a evaluar trayectoria, no solo output final. |
| **50–70 min** | **Golden Cases, EvaluationCase y Detección de Regresiones** | Presentar `EvaluationCase` (expected_outcome, expected_tools, expected_tool_sequence, require_hitl, max_allowed_iterations). Mostrar cómo `AgentEvaluator` ejecuta aserciones sobre `TraceEvent`s sin LLM-as-a-Judge. Exploración de `exp-evaluation-lab`. | Estudiantes ejecutan 5 Golden Cases y detectan automáticamente una regresión inyectada. |
| **70–90 min** | **Sanitización y RunSummary Derivado** | Modelar `_SENSITIVE_KEYS` y por qué la redacción ocurre antes de `emit()`. Presentar `RunSummary.from_events()` como única fuente de verdad: `iterations` = `len({e.iteration...})`, no `max()`. | Comprender que el `TraceCollector` nunca ve contraseñas ni tokens. |
| **90–110 min** | **Taller Práctico: De Agent v5 a Agent v6** | Codificación colaborativa en grupos de estudio. Ejecución y validación de los Casos I1 a I5 en terminal. | 100% de los grupos ejecutan los tests I1 a I5 con aserciones verdes. |
| **110–115 min** | **Módulo Completo: Engineering & Control Layer Cerrada** | Reconciliación del Pipeline completo L01–L07. Agent v6 encarna los 7 principios del Agent Engineering. | Visualización del mapa completo: Decision → Tools → Loop → State → Planning → Guardrails → Observability. |
| **115–120 min** | **Cierre y Puente a Lab 05** | Puente pedagógico: el agente está construido, gobernado y observable. Ahora el estudiante lo lleva a su propio dominio de negocio. | Conexión natural con Lab 05 (Capstone: Diseñar un Flujo de Trabajo Agéntico). |

---

### Opción B: Sesión Desdoblada (2 Bloques de 60 min)

#### Bloque 1: Tracing Estructurado y la Paradoja de la Respuesta Final (60 min)
- **00–15 min:** La caja negra de Agent v5 y por qué una respuesta final correcta no garantiza una corrida admisible.
- **15–30 min:** `TraceEvent` con `run_id`, `sequence_no` monotónico, `EventType` y sanitización previa al `emit()`. `exp-trace-explorer` interactivo.
- **30–45 min:** Outcome vs Trajectory: dos corridas, misma respuesta, trayectorias incompatibles con producción. `exp-run-comparison`.
- **45–60 min:** `InMemoryTraceCollector`, `RunSummary.from_events()` derivado y por qué no se usa `max(iteration)`.

#### Bloque 2: Evaluación Determinista, Taller Agent v6 y Cierre del Módulo (60 min)
- **00–15 min:** `EvaluationCase` (Outcome vs Trajectory), `AgentEvaluator`, detección automática de regresiones con `assertion_failures`. LLM-as-a-Judge solo como complemento nunca sustituto.
- **15–45 min:** Taller 07: implementación de `emit()`, `TraceCollector`, `RunSummary` y Golden Cases I1–I5 en Python.
- **45–55 min:** Auditoría en consola de I3 (HITL sequence), I4 (Policy zero-tolerance) e I5 (Regression detection variante B).
- **55–60 min:** Cierre del módulo: Agent v6 completa la Engineering & Control Layer. Apertura hacia Lab 05 Capstone.

---

## Puntos de Control y Evaluación para el Docente

1. **¿El estudiante equipara Structured Agent Tracing con `logger.info()`?**
   - *Intervención:* Pedir que muestre cómo filtraría por `run_id` todos los eventos de una corrida específica entre 100,000 peticiones simultáneas usando solo texto libre de consola.
2. **¿Usa `max(iteration)` para calcular el número de iteraciones?**
   - *Intervención:* Preguntar qué pasa si una iteración se salta por un `continue` o una excepción controlada. Demostrar que `len({e.iteration for e in events if e.iteration})` es más robusto.
3. **¿Afirma que LLM-as-a-Judge puede reemplazar las aserciones de política?**
   - *Intervención:* Preguntar: *"Si el LLM Judge aprueba una corrida semánticamente fluida, pero `TOOL_CALLED: delete_production_database` aparece en la traza, ¿es una corrida admisible?"*
4. **¿Inventa un Score Global 0-100?**
   - *Intervención:* Exigir que defina exactamente qué ponderación tiene la dimensión de `policy_violations` y demostrar que un "98/100" con una violación de política no es aceptable en producción.
5. **¿Emite `TraceEvent`s con datos sensibles en el payload antes de sanitizar?**
   - *Intervención:* Verificar que `_SENSITIVE_KEYS` y `sanitize_payload()` actúan ANTES de `TraceCollector.emit()`. El collector nunca ve contraseñas ni tokens.
6. **¿El `sequence_no` es monotónico dentro del `run_id`?**
   - *Intervención:* Ejecutar `seqs = [e.sequence_no for e in sorted(events, key=...)]` y verificar que `seqs[i] > seqs[i-1]` para todo `i`. Un `sequence_no` decreciente hace inútil la reconstrucción del orden causal.
