# Guía Docente · M05 L05 — Planning & Task Decomposition

## 00. Ficha Técnica de la Lección

- **Módulo:** 05 — Agentes de IA
- **Lección:** 05 — Planificación y Descomposición de Tareas (`c-m5-l05`)
- **Duración:** 120 minutos (Sesión Intensiva) o 2 bloques de 60 min (Sesión Desdoblada)
- **Evolución del Agente:** Agent v3 (State & Memory) ──► **Agent v4 (Planning & Task Decomposition)**
- **Prerrequisito Estricto:** `c-m5-l04` (Lección 04 — Estado y Memoria y Taller 04 de Agent v3)
- **Casos de Validación del Taller:** Casos A–F (No-regresión) + **Caso G1** (Planificación Estructurada), **Caso G2** (Replanning con Conservación de Historial e Invariante de Meta) y **Caso G3** (Detección de Deadlock / `no_executable_steps`).

---

## 01. Propósito Pedagógico y Tesis Central

En las lecciones anteriores construimos un agente capaz de decidir (L01), invocar herramientas bajo contrato de tipado (L02), iterar en un bucle autónomo con paradas duras (L03) y retener memoria persistente con aislamiento estricto por `subject_id` (L04).

Sin embargo, Agent v3 sigue operando de forma esencialmente **reactiva**:
```text
Observación ──► Siguiente Decisión ──► Tool ──► Observación ──► Siguiente Decisión
```

### El Problema Detonante
Cuando al agente se le encomienda una meta compuesta (*"Audita los incidentes recientes, correlaciónalos con el último despliegue y genera una recomendación para el equipo de guardia"*), un agente puramente reactivo carece de una representación explícita del plan global:
1. No mantiene un modelo estructurado de qué pasos faltan ni qué dependencias existen entre ellos.
2. Puede seleccionar herramientas alternativas tras observar un error, pero carece de un mapa global y tipado de su progreso.
3. El riesgo de desvío de plan (*plan drift*) o conclusiones apresuradas aumenta a medida que crece la complejidad.

### La Tesis Central
> **"Planning convierte una meta compleja en una estructura de datos observable de software (`Plan`) que el runtime puede validar, inspeccionar, seguir y actualizar mediante replanning sin perder de vista el objetivo original."**

---

## 02. Reglas Pedagógicas Inviolables de L05

1. **Planning ≠ Chain-of-Thought:**
   - La planificación agéntica **no es** pedirle al modelo *"piensa paso a paso"* o *"muéstrame tu razonamiento interno"* en prosa libre dentro de un string de texto.
   - Enseñar la diferencia explícitamente: Chain-of-Thought es estocástico, no observable como estado de software y no gobernable por el runtime. Planning es una **estructura de datos externa, tipada y observable** (`Plan`, `PlanStep`, `StepStatus`, `StepExecutor`).
   - *"El plan es datos, no pensamiento oculto."*

2. **PlanStep ≠ Tool Call (Diversidad de Ejecutores):**
   - Evitar enseñar que cada paso de un plan equivale a invocar una herramienta.
   - Descomponer en tres tipos de ejecutores (`StepExecutor`):
     - `TOOL`: Invocación a función externa registrada en `TOOL_REGISTRY`.
     - `RUNTIME`: Transformación algorítmica local determinista en CPU (cruces de datos, ordenamientos, filtros) sin costo de tokens.
     - `MODEL`: Inferencia o síntesis textual de alto nivel solicitada al LLM.
   - Esto prepara la base para L06 (*Guardrails*), donde se auditará qué ejecutores conllevan efectos secundarios y requieren aprobación humana.

3. **Invariante de Meta en Replanning:**
   - Replanificar ante contingencias significa generar una nueva revisión (`revision = 2`), conservando la revisión previa en `plan_history` como snapshot inmutable independiente.
   - El replanning puede modificar pasos, dependencias, ejecutores y rutas alternativas, pero **nunca puede alterar silenciosamente la meta (`goal`) original**. Si la meta cambia, debe provenir del usuario o de una instrucción deliberada de la aplicación.

4. **Completitud Derivada, Semántica de SKIPPED y Parada Segura:**
   - Evitar dos fuentes de verdad: el plan no tiene un booleano mutable `completed`. Su completitud es una propiedad derivada: todos los pasos deben estar en `COMPLETED` o válidamente `SKIPPED` (con `skip_reason` formal o `required=False`). Un paso crítico omitido sin autorización no satisface el plan.
   - Separación estricta de fallas:
     - *Validation-Time Failure:* Ciclos estáticos o dependencias inexistentes son rechazados por `PlanValidator` antes de ejecutar (`PlanValidationError`). El plan no entra al runtime.
     - *Runtime Stall:* Si un paso previo falla sin ruta de replanning y los pasos pendientes quedan bloqueados, el runtime emite una detención limpia: `termination_reason = "no_executable_steps"`.

5. **Least Autonomy Necessary:**
   - No todo problema requiere un planner. Para tareas atómicas de un solo paso, un agente reactivo o un workflow fijo es superior en costo y latencia. La planificación se justifica cuando la meta exige orden, dependencias y contingencia observable.

---

## 03. Anatomía del Plan en Software

Presenta en la pizarra la estructura de datos que gobierna al agente:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PLAN (Revisión 1) · Goal: "Auditar incidentes y correlacionar"         │
├────────────────────────────────────────────────────────────────────────┤
│ S1 [TOOL]    get_recent_incidents          │ Status: COMPLETED ✅      │
│ S2 [TOOL]    get_latest_deployment         │ Status: FAILED ❌ (503)   │
│ S3 [RUNTIME] correlate_with_deployment     │ Status: PENDING (dep S1,S2│
│ S4 [MODEL]   generate_recommendation       │ Status: PENDING (dep S3)  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                  [FALLO DETECTADO EN S2 POR RUNTIME]
                                    │
                                    ▼ Snapshot archivado en plan_history[0]
┌────────────────────────────────────────────────────────────────────────┐
│ PLAN (Revisión 2) · Goal: "Auditar incidentes y correlacionar" (IGUAL) │
├────────────────────────────────────────────────────────────────────────┤
│ S1  [TOOL]    get_recent_incidents         │ Status: COMPLETED (conserv│
│ S2  [TOOL]    get_latest_deployment        │ Status: FAILED (histórico)│
│ S2b [TOOL]    get_deployment_from_cache    │ Status: PENDING 🆕        │
│ S3  [RUNTIME] correlate_with_deployment    │ Status: PENDING (dep S1,S2│
│ S4  [MODEL]   generate_recommendation      │ Status: PENDING (dep S3)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 04. Guía de Experiencias Interactivas en CASE OS

Dirige a los estudiantes a explorar las tres herramientas interactivas de la plataforma:

1. **`exp-reactive-vs-planned` (Reactivo vs Planificado):**
   - Muestra lado a lado dos trayectorias de resolución ante la misma meta.
   - El agente reactivo da saltos erráticos, consulta herramientas desconectadas y concluye sin evidencia sólida.
   - El agente planificador emite su estructura previa, avanza paso a paso y produce un reporte robusto.

2. **`exp-plan-inspector` (Inspección del Plan en Tiempo Real):**
   - Tablero visual interactivo donde el alumno pulsa *"Ejecutar siguiente paso"* y observa cómo el runtime transiciona los estados: `PENDING` ──► `IN_PROGRESS` ──► `COMPLETED`.
   - Permite verificar dependencias y ver qué observación deja cada herramienta en la memoria del plan.

3. **`exp-replanning-simulator` (Simulador de Contingencia):**
   - El paso S2 falla intencionalmente con un error `503 Gateway Timeout`.
   - El estudiante elige entre:
     - *Reintentar ciegamente:* Desperdicia presupuesto y vuelve a fallar.
     - *Abortar:* Deja la tarea inconclusa.
     - *Replanificar con software:* Se archiva la Revisión 1 en el historial y se despliega la Revisión 2 con `S2b` alternativo.

---

## 05. Taller Práctico: De Agent v3 a Agent v4 (60–75 min)

Guía a los alumnos a través del documento canónico [`taller-05-agent-v4.md`](file:///c:/Users/YAMI/Documents/projects/curso-ia-generativa/docs/curriculum/workshops/m05-ai-agents/taller-05-agent-v4.md):

### Hito 1: Modelo de datos tipado (15 min)
- Implementar `StepStatus`, `StepExecutor`, `PlanStep` y `Plan` con `is_completed` y `clone()`.

### Hito 2: `PlanValidator` y `MockPlanner` (15 min)
- Asegurar que `PlanValidator` rechace metas vacías, pasos vacíos, identificadores duplicados, dependencias inexistentes y ciclos estáticos antes de entrar al runtime (`PlanValidationError`).
- En `MockPlanner.replan()`, certificar la invariante: `assert new_plan.goal == current_plan.goal`.

### Hito 3 y 4: `run_agent_v4()` con gobernanza de dependencias (20 min)
- Implementar la selección del siguiente paso ejecutable.
- Implementar la detección de runtime stall (`no_executable_steps`) cuando pasos pendientes quedan bloqueados sin alternativa.
- Implementar la captura de fallos, el archivado de snapshots en `state.plan_history` y la activación de la nueva revisión.

### Hito 5: Batería de Pruebas (Casos G1, G2, G3 y Semántica) (15 min)
- **Validation-Time Test:** `PlanValidator` rechaza un plan con ciclo estático inicial antes de ejecución.
- **Semántica de SKIPPED:** Un paso crítico (`required=True`) sin `skip_reason` formal NO permite que `is_completed` sea `True`.
- **Caso G1:** Plan de 4 pasos completado ordenadamente en Revisión 1.
- **Caso G2:** Fallo en S2, conservación de Revisión 1 en `plan_history[0]`, ejecución de S2b en Revisión 2 y éxito final con meta idéntica (`rev1.goal == rev2.goal`).
- **Caso G3 (Runtime Stall):** Paso fallido sin alternativa bloquea pasos dependientes, provocando detención segura con `termination_reason = "no_executable_steps"`.

---

## 06. Cierre Pedagógico y Puente hacia L06

### Pregunta de Cierre para el Salón
> *"Ya tenemos un agente que usa herramientas (L02), itera en bucle (L03), recuerda preferencias (L04) y planifica metas complejas con contingencias (L05). Pero supongamos que el planificador propone: `Paso 3 [TOOL]: delete_production_database` o `Paso 2 [TOOL]: transfer_funds(amount=50000)`. Que el agente haya elaborado un plan impecable, ¿significa que el software debe ejecutarlo a ciegas?"*

### Conexión con L06 (Guardrails & Human-in-the-Loop)
> **"Tener un plan no otorga autoridad operacional. En la Lección 06 construiremos la Capa 2: Guardrails, Circuit Breakers y Compuertas de Aprobación Humana (HITL) para garantizar que ninguna acción de riesgo se ejecute sin supervisión soberana."**
