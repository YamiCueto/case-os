# Timeline Pedagógico · M05 L05 — Planning & Task Decomposition

## Estructura Temporal de la Sesión (120 min)

Esta lección enseña la transición de agentes reactivos a planificados (**Agent v3 → Agent v4**), formalizando el plan como estructura observable de software gobernada por el runtime.

---

### Opción A: Sesión Intensiva Única (120 min)

| Intervalo | Bloque Temático | Dinámica / Actividades | Hito Clave |
|---|---|---|---|
| **00–10 min** | **Recap y Problema Detonante** | Recordar Agent v3 (L04). Demostrar la limitación de la reactividad pura ante metas compuestas de múltiples pasos dependientes. | Estudiantes identifican la necesidad de representar explícitamente el progreso y las dependencias. |
| **10–30 min** | **Reactive vs Planned & Least Autonomy** | Análisis del tradeoff. Demostración interactiva con `exp-reactive-vs-planned`. Principio: no toda tarea necesita un planificador. | Reconocimiento de cuándo un plan agrega valor y cuándo genera sobrecosto innecesario. |
| **30–50 min** | **El Plan como Estructura de Software** | Diferenciar formalmente Planning de Chain-of-Thought ("piensa paso a paso"). Presentar `Plan`, `PlanStep`, `StepStatus`, `StepExecutor` y `PlanValidator`. | Desmitificación del razonamiento oculto: "El plan es datos, no monólogo interno". |
| **50–70 min** | **Inspección del Plan y Transiciones** | Exploración guiada de `exp-plan-inspector`. Análisis de cómo el runtime gobierna el estado de cada paso (`PENDING` → `IN_PROGRESS` → `COMPLETED`). | Comprensión de la soberanía del software sobre el avance del plan. |
| **70–90 min** | **Contingencias y Replanning** | Simulación de fallo en paso intermedio con `exp-replanning-simulator`. Introducción de snapshots inmutables en `plan_history`, invariante de meta y detección de deadlocks (`no_executable_steps`). | Comprender que replanificar no es borrar el pasado ni cambiar el objetivo. |
| **90–115 min** | **Taller Práctico: De Agent v3 a Agent v4** | Codificación colaborativa en grupos de estudio (`taller-05-agent-v4.md`). Implementación y validación de los Casos G1, G2 y G3. | 100% de los grupos ejecutan los tests G1, G2 y G3 en consola con aserciones verdes. |
| **115–120 min** | **Cierre y Puente a L06** | Pregunta de cierre: si un plan propone borrar la base de datos o transferir fondos, ¿el agente tiene autoridad para ejecutarlo? Presentación de Guardrails y HITL. | Conexión natural con la Capa de Control y Gobierno de L06. |

---

### Opción B: Sesión Desdoblada (2 Bloques de 60 min)

#### Bloque 1: Arquitectura y Modelado del Plan (60 min)
- **00–15 min:** La ceguera del agente reactivo ante tareas dependientes.
- **15–30 min:** `exp-reactive-vs-planned` y el principio de Least Autonomy Necessary.
- **30–45 min:** Modelado del plan en software vs Chain-of-Thought estocástico.
- **45–60 min:** `exp-plan-inspector` y diseño del validador estructural (`PlanValidator`).

#### Bloque 2: Contingencias, Taller Agent v4 y Puente a Guardrails (60 min)
- **00–15 min:** Replanning con conservación de historia, invariante de meta y `exp-replanning-simulator`.
- **15–45 min:** Taller 05: Implementación de `run_agent_v4()`, Casos G1, G2 y G3 en Python.
- **45–55 min:** Auditoría de resultados, inspección de snapshots y detección de `no_executable_steps`.
- **55–60 min:** Conexión con L06: Autoridad vs Planificación (Guardrails & Human-in-the-Loop).

---

## Puntos de Control y Evaluación para el Docente

1. **¿El estudiante confunde Chain-of-Thought con Planning?**
   - *Verificación:* Pedirle que señale dónde vive el plan. Si responde "en los tokens de pensamiento del LLM", corregir inmediatamente: el plan vive en una instancia de `Plan` en la memoria del programa.
2. **¿El replanning borra las revisiones previas?**
   - *Verificación:* Inspeccionar que `state.plan_history` contenga el snapshot de la Revisión 1 tras un fallo en S2.
3. **¿El replanning preserva la meta original?**
   - *Verificación:* Asegurar que `revision1.goal == revision2.goal`.
4. **¿Todos los pasos son tratados como Tool Calls?**
   - *Verificación:* Confirmar que el código use `StepExecutor.RUNTIME` para operaciones locales en CPU y `StepExecutor.MODEL` para redacción de reportes.
5. **¿Distingue entre validación previa y estancamiento en runtime?**
   - *Verificación:* `PlanValidator` rechaza ciclos estáticos antes de ejecutar (`PlanValidationError`), mientras que `no_executable_steps` ocurre en tiempo de corrida cuando un paso falla sin alternativa de replanning y bloquea los pasos subsiguientes.
6. **¿Comprende la semántica estricta de SKIPPED?**
   - *Verificación:* Confirmar que omitir un paso crítico (`required=True`) sin `skip_reason` autorizado no permite que `Plan.is_completed` sea `True`.
