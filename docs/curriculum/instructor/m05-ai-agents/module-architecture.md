# M05 — Agent Engineering Architecture

Documento maestro de calibración y arquitectura pedagógica para el Módulo 05 de CASE Academy: **Agent Engineering**.

---

## 1. Objetivo del módulo

M05 evoluciona de ser una introducción a conceptos agénticos básicos (*Decision, Tools, Loop, State, Guardrails*) hacia una disciplina rigurosa de **Agent Engineering**.

Un agente no es un ente autónomo que "razona como un humano" ni un wrapper alrededor de un prompt. En el estándar de CASE Academy, un agente es:

> **Un sistema de software determinista en cuyo bucle de ejecución se integran llamadas probabilísticas a modelos de lenguaje para resolver tareas no mapeables a flujos estáticos, gobernado por barreras de software, contratos estrictos, memoria estructurada, supervisión humana e instrumentación completa.**

Al concluir el módulo, un estudiante debe estar capacitado para analizar cualquier arquitectura agéntica de la industria y responder con criterio técnico irrefutable las **14 preguntas fundamentales de ingeniería**:

1. **¿Dónde está la decisión?** — Identificar qué parte del flujo es decidida probabilísticamente por el LLM y qué parte está forzada deterministamente por el código.
2. **¿Por qué esto necesita autonomía?** — Demostrar por qué un pipeline lineal (*Fixed Pipeline*) o una máquina de estados finitos (*State Machine*) fracasan ante la variabilidad del problema.
3. **¿Qué tools existen?** — Definir las herramientas expuestas como contratos estrictos en JSON Schema, con semántica clara y tipado riguroso.
4. **¿Quién ejecuta?** — Confirmar que el modelo solo propone llamadas en texto (`finish_reason="tool_calls"`) y que el backend de software en CPU es el soberano que valida y ejecuta.
5. **¿Dónde está el loop?** — Localizar el bucle `while` que alimenta las observaciones de vuelta al contexto del modelo hasta alcanzar un estado terminal.
6. **¿Cómo termina?** — Identificar los criterios de parada explícitos (meta cumplida, `max_iterations`, agotamiento de tokens, timeout, error irrecuperable).
7. **¿Qué estado conserva?** — Distinguir el estado de ejecución volátil (*Execution State*) acumulado durante la resolución de una tarea.
8. **¿Qué memoria persiste?** — Trazar qué información sobrevive entre turnos de conversación (*Session Memory*) y qué conocimiento se consolida en almacenamiento duradero (*Persistent Memory*).
9. **¿Existe planificación?** — Verificar si el agente descompone metas complejas en un plan estructurado y observable (`goal → plan → steps`) o si avanza por tanteo reactivo ciego.
10. **¿Quién autoriza acciones de riesgo?** — Identificar las políticas de seguridad y barreras de control (*Guardrails*) que bloquean mutaciones peligrosas.
11. **¿Dónde interviene un humano?** — Ubicar las compuertas de supervisión humana (*Human-in-the-Loop* o *Approval Gates*) que exigen autorización explícita antes de ejecutar efectos secundarios críticos.
12. **¿Cómo observamos qué hizo?** — Auditar la trazabilidad estructurada de la ejecución (*Agent Tracing*) mediante identificadores únicos de correlación (`run_id`), latencias, tokens consumidos, spans y payloads de entrada/salida.
13. **¿Cómo medimos si funciona?** — Evaluar sistemáticamente el comportamiento del agente mediante datasets de prueba, midiendo precisión en la selección de herramientas, validez de argumentos, pasos requeridos y tasa de éxito.
14. **¿Por qué esto debería ser un agente y no un workflow determinista?** — Justificar la autonomía bajo el principio de *Least Autonomy Necessary*.

### Principio de Autoridad Humana
- El humano conserva: **criterio técnico, criterio de negocio, autoridad, supervisión y responsabilidad legal/operacional**.
- El agente **amplifica capacidad**, nunca sustituye el juicio profesional del ingeniero.

---

## 2. Principio pedagógico

Toda lección y taller de M05 sigue una estructura pedagógica inquebrantable:

```text
Problema real de ingeniería
    ↓
Intuición física / operacional
    ↓
Experiencia interactiva en plataforma (CASE Academy)
    ↓
Explicación técnica del mecanismo
    ↓
Evolución incremental del código del agente
    ↓
Taller práctico grupal en dominio propio
    ↓
Pruebas de validación (regresión + nuevo caso)
    ↓
Descubrimiento del nuevo límite arquitectónico
    ↓
Puente pedagógico a la siguiente lección
```

### Reglas Docentes No Negociables
1. **Continuidad del Proyecto:** El estudiante NO crea proyectos nuevos en cada clase. Trabaja sobre un único repositorio y dominio de negocio elegido en L02, evolucionando su propio agente paso a paso (`Agent v1 → v2 → v3 → v4 → v5 → v6 → Lab 05`).
2. **Cero Magia:** No se utilizan frameworks de abstracción mágica (*LangChain*, *LangGraph*, *CrewAI*, *AutoGPT*) para enseñar fundamentos. Toda capacidad se implementa primero desde primeros principios en Python estándar, haciendo visibles las estructuras de datos y el protocolo.
3. **Mecanismo Antes de Herramienta:** No se enseña una herramienta externa (como *Mem0* o servicios de memoria vectorial) sin antes haber construido y sufrido el mecanismo explícito en software (almacenamiento en diccionario/JSON con políticas claras de lectura/escritura).
4. **Least Autonomy Necessary (LAN):** La autonomía es un costo y un riesgo que se justifica, jamás un valor por defecto. Si una tarea puede resolverse con código determinista, usar un agente es una mala decisión de ingeniería.

---

## 3. Pipeline L01–L07

El módulo se estructura en siete lecciones progresivas más un laboratorio final integrador:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                        M05 AGENT ENGINEERING PIPELINE                      │
└────────────────────────────────────────────────────────────────────────────┘

  [L01] DECISION / AUTONOMY ──────► ¿Cuándo necesito realmente un agente?
        Capacidad: Decision         Estado: YA IMPLEMENTADA (main)
        Principio: Least Autonomy Necessary
        
  [L02] TOOLS / TOOL CALLING ────► ¿Cómo interactúa el agente con sistemas externos?
        Capacidad: Tools            Estado: YA IMPLEMENTADA (main)
        Artefacto: Agent v1 (7 hops operacionales, JSON Schema, CPU execution)
        
  [L03] AGENT LOOP ──────────────► ¿Cómo observa un resultado y vuelve a decidir?
        Capacidad: Loop             Estado: YA IMPLEMENTADA (main)
        Artefacto: Agent v2 (while loop, max_iterations, Caso D multi-step)
        
  [L04] STATE & MEMORY ──────────► ¿Qué información conserva durante una ejecución,
        Capacidades: State, Memory  entre turnos y entre sesiones?
        Estado: IMPLEMENTADA EN FEATURE (branch: feat/m05-agent-engineering-expansion)
        Artefacto: Agent v3 (Execution State vs Session Memory vs Persistent Memory, Scopes)
        
  [L05] PLANNING & DECOMPOSITION ─► ¿Cómo transforma una meta compleja en pasos observables?
        Capacidad: Planning         Artefacto: Agent v4 (Structured Observable Plan, Replanning)
        
  [L06] GUARDRAILS & HITL ───────► ¿Qué puede hacer, qué no, y cuándo debe pedir permiso?
        Capacidades: Guardrails,    Artefacto: Agent v5 (Allowlists, Circuit Breakers, Approval Gate)
        Human Oversight
        
  [L07] OBSERVABILITY & EVAL ────► ¿Cómo sabemos qué hizo y si realmente funciona?
        Capacidades: Tracing, Eval  Artefacto: Agent v6 (Structured Agent Tracing, Trajectory Benchmarks)
        
  [LAB 05] INTEGRACIÓN FINAL ────► Arquitectura, defensa, implementación, gobernanza y
                                   evaluación de un agente completo en producción
```

---

## 4. Evolución Agent v1 → Agent v6

Cada versión del agente añade exactamente una frontera de capacidad al sistema, resolviendo el límite descubierto en la lección anterior:

```text
┌──────────────┐   Límite: Solo resuelve 1 turno de herramientas;
│   Agent v1   │   no puede encadenar resultados dependientes.
└──────┬───────┘
       │ + Agent Loop (while) + max_iterations
       ▼
┌──────────────┐   Límite: Amnesia total al retornar; al terminar el loop
│   Agent v2   │   desaparece el contexto y se pierde el hilo inter-turno.
└──────┬───────┘
       │ + Execution State + Session Memory + Persistent Memory Store
       ▼
┌──────────────┐   Límite: Avanza a ciegas paso a paso; en tareas compuestas
│   Agent v3   │   sufre de deriva (drift) y no sabe qué le falta por hacer.
└──────┬───────┘
       │ + Structured Observable Plan + Plan Tracking + Replanning
       ▼
┌──────────────┐   Límite: Si propone una mutación peligrosa o entra en ciclo,
│   Agent v4   │   ejecuta sin control ni autorización humana.
└──────┬───────┘
       │ + Guardrails (Allowlists, Budgets) + Human Approval Gate (HITL)
       ▼
┌──────────────┐   Límite: Caja negra en producción; no sabemos cuánto cuesta,
│   Agent v5   │   dónde falló ni cómo medir regresiones sistemáticas.
└──────┬───────┘
       │ + Structured Agent Tracing (run_id, latencias, tokens) + Behavioral Eval Suite
       ▼
┌──────────────┐
│   Agent v6   │   Agente de nivel de producción instrumentado y gobernado.
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Lab 05    │   Proyecto integral auditado, probado y defendido ante un panel/revisor de arquitectura.
└──────────────┘
```

---

## 5. Core Agent vs Engineering Layer

Una de las confusiones más graves en la industria es asumir que "el agente" es solo el ciclo de llamada al modelo. Arquitectónicamente, un sistema agéntico profesional consta de dos capas acopladas:

```text
╔══════════════════════════════════════════════════════════════════════════════════╗
║                          ENGINEERING & CONTROL LAYER                             ║
║                                                                                  ║
║   ┌──────────────────────────────────────────────────────────────────────────┐   ║
║   │ Guardrails & Security Policies (Allowlists, Schema Validation, Budgets)  │   ║
║   └──────────────────────────────────────────────────────────────────────────┘   ║
║   ┌──────────────────────────────────────────────────────────────────────────┐   ║
║   │ Human Oversight & Approval Gates (Pause/Resume, Risk Escalation)         │   ║
║   └──────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                  ║
║        ╔════════════════════════════════════════════════════════════════╗        ║
║        ║                          CORE AGENT                            ║        ║
║        ║                                                                ║        ║
║        ║               ┌─────────── Planning ───────────┐               ║        ║
║        ║               │      (Meta → Plan → Pasos)      │               ║        ║
║        ║               ▼                                ▼               ║        ║
║        ║          [Decision] ◄────── Feedback ──────► [Loop]            ║        ║
║        ║               ▲                                │               ║        ║
║        ║               │                                ▼               ║        ║
║        ║        [State & Memory] ◄── Observaciones ── [Tools]           ║        ║
║        ║                                                                ║        ║
║        ╚════════════════════════════════════════════════════════════════╝        ║
║                                                                                  ║
║   ┌──────────────────────────────────────────────────────────────────────────┐   ║
║   │ Observability & Tracing (run_id, Spans, Payloads, Latency, Token Usage)  │   ║
║   └──────────────────────────────────────────────────────────────────────────┘   ║
║   ┌──────────────────────────────────────────────────────────────────────────┐   ║
║   │ Behavioral Evaluation & Quality Metrics (Accuracy, Safety, Trajectory)   │   ║
║   └──────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

> [!NOTE]
> **Orden pedagógico de construcción vs. Arquitectura de ejecución en runtime**
> El orden de las lecciones (`L01 Decision → L02 Tools → L03 Loop → L04 State & Memory → L05 Planning`) representa el **orden pedagógico de construcción incremental**, no una secuencia rígida o lineal de ejecución en runtime:
> - **Decision** es una capacidad general que se manifiesta en cada punto de bifurcación probabilística.
> - **Planning** no tiene que ejecutarse siempre antes de cada loop; puede ocurrir como paso previo (descomposición inicial de la meta) o dinámicamente *durante* el Loop cuando se detecta la necesidad de replanificar.
> - **State & Memory** no ocurre "después" del bucle; alimenta continuamente tanto a las Decisiones como a la Planificación y retiene el contexto entre turnos.
> - **Tools** son invocadas por el runtime desde dentro del Loop cuando el modelo propone una llamada estructurada.
> - **Replanning** puede ocurrir después de que una nueva observación contradice el plan original.
> En runtime, Planning, State, Decision y Loop cooperan y se realimentan continuamente bajo la soberanía del software.

### Capa 1: Core Agent (Mecanismo Operacional)
- **Decision:** Capacidad probabilística del modelo para elegir el siguiente camino.
- **Tools:** Catálogo de funciones de backend con contratos de entrada/salida.
- **Loop:** Ciclo de ejecución en software que alimenta observaciones sucesivas.
- **State & Memory:** Almacenamiento de variables de ejecución y retención entre turnos.
- **Planning:** Generación y seguimiento de secuencias de pasos explícitos.

### Capa 2: Engineering & Control Layer (Envolvente de Gobierno)
- **Guardrails:** Políticas de restricción que impiden que el modelo viole límites de dominio o agote presupuestos.
- **Human Oversight (HITL):** Compuertas de validación donde una acción de riesgo queda en suspenso hasta que un operador humano la aprueba o rechaza.
- **Observability:** Instrumentación completa para reconstruir cada milisegundo de ejecución y cada token consumido.
- **Evaluation:** Marco de pruebas automatizadas sobre trayectorias agénticas para prevenir regresiones.

---

## 6. Objetivo de cada lesson

### L01 — Decision / Autonomy
- **Pregunta:** ¿Cuándo necesito realmente un agente?
- **Capacidad:** Decision.
- **Estado:** Ya implementada en `main`.
- **Núcleo:** Least Autonomy Necessary. Descarte riguroso de *Fixed Pipeline* y *State Machine* antes de considerar autonomía.

### L02 — Tools / Tool Calling
- **Pregunta:** ¿Cómo interactúa el agente con sistemas externos?
- **Capacidad:** Tools.
- **Artefacto:** Agent v1.
- **Estado:** Ya implementada en `main`.
- **Núcleo:** Protocolo de 7 hops. El modelo propone (`finish_reason="tool_calls"`), la CPU en Python ejecuta. JSON Schema como contrato de tipado.

### L03 — Agent Loop
- **Pregunta:** ¿Cómo observa un resultado y vuelve a decidir?
- **Capacidad:** Loop.
- **Artefacto:** Agent v2.
- **Estado:** Ya implementada en `main`.
- **Núcleo:** Bucle `while` iterativo gobernado por software. Límite duro `max_iterations`. Casos dependientes de dos pasos (Caso D).

### L04 — State & Memory
- **Pregunta:** ¿Qué información conserva durante una ejecución, entre turnos y entre sesiones?
- **Capacidades:** State & Memory.
- **Artefacto:** Agent v3.
- **Núcleo Técnico:**
  - *Execution State:* Variables transitorias de la tarea en curso (scratchpad, acumuladores locales).
  - *Session Memory:* Ventana de contexto conversacional multi-turno con poda o resumen para no desbordar tokens.
  - *Persistent Memory:* Almacén externo (KV/documental) donde se leen y escriben datos estables (preferencias del usuario, perfiles, hechos del dominio).
  - *Frontera de Lectura/Escritura:* El agente no guarda todo ciegamente; existen políticas explícitas sobre qué merece ser persistido y qué debe descartarse.
  - *Enfoque Didáctico:* Construcción artesanal en Python (`dict` estructurado con métodos `read()`, `write()`, `clear()`) antes de cualquier biblioteca de abstracción.

### L05 — Planning & Task Decomposition
- **Pregunta:** ¿Cómo transforma una meta compleja en pasos observables?
- **Capacidad:** Planning.
- **Artefacto:** Agent v4.
- **Núcleo Técnico:**
  - Agente reactivo (ve un paso a la vez y adivina) vs Agente planificador (descompone la meta antes de actuar).
  - El plan como estructura de datos observable:
    ```json
    {
      "goal": "Auditar despliegue de versión v2.4",
      "steps": [
        {"id": 1, "description": "Consultar logs de error de la última hora", "status": "completed"},
        {"id": 2, "description": "Obtener lista de commits entre v2.3 y v2.4", "status": "in_progress"},
        {"id": 3, "description": "Comparar autores con incidentes abiertos", "status": "pending"}
      ],
      "current_step": 2
    }
    ```
  - Prohibición de Chain-of-Thought oculto: el plan debe ser un artefacto de software observable, auditable e inspeccionable.
  - Seguimiento de ejecución y detección de deriva (*plan drift*).
  - Replanning: capacidad de actualizar los pasos restantes cuando una observación contradice la hipótesis inicial sin perder la meta general.
  - Criterio de terminación basado en el cumplimiento del plan.

### L06 — Guardrails & Human-in-the-Loop (IMPLEMENTADA EN FEATURE)
- **Pregunta:** ¿Qué puede hacer el agente, qué no, y cuándo debe pedir autorización?
- **Capacidades:** Guardrails & Human Oversight.
- **Artefacto:** Agent v5.
- **Núcleo Técnico:**
  - **Capacidad ≠ Autoridad:** `TOOL_REGISTRY` define qué herramientas existen; `ToolPolicy` evaluada por `PolicyEvaluator` define qué está permitido (`ALLOW`), qué requiere autorización humana (`REQUIRE_APPROVAL`) y qué está prohibido (`BLOCK`).
  - **ToolPolicy unificada:** Modelo determinista sin booleanos conflictivos con `decision`, `risk_level` y `argument_constraints`.
  - **Action Binding vs TOCTOU:** `ActionProposal` con hash SHA-256 sobre serialización determinista (`action_fingerprint`). La huella garantiza que la acción ejecutada coincide exactamente con lo aprobado; el runtime revalida además precondiciones y política antes de ejecutar.
  - **Aprobación de un solo uso y Anti-Replay:** `ApprovalRecord` inmutable con `consumed: bool = False`, `consumed_at` y `consumed_proposal_ids` para prevenir reutilización de autorizaciones.
  - **Compuerta Humana Formal (HITL):** Transición de estado a `PAUSED_FOR_APPROVAL` con contexto preservado; reanudación segura tras `APPROVE` o inyección de observación tras `REJECT`.
  - **Diferencia Semántica BLOCK vs REJECT:** `BLOCK` es proscripción determinista en software sin compuerta ni override; `REJECT` es denegación humana evaluada sobre una propuesta admisible.
  - **BudgetController:** Disyuntores operativos (*Circuit Breakers*) que cortan la ejecución con `termination_reason = "budget_exceeded"` ante exceso de iteraciones, llamadas a herramientas o fallos repetidos. Contadores rotulados didácticamente.

### L07 — Observability & Evaluation
- **Pregunta:** ¿Cómo sabemos qué hizo el agente y si realmente funciona?
- **Capacidades:** Observability & Evaluation.
- **Artefacto:** Agent v6.
- **Núcleo Técnico:**
  - *Observability (Agent Tracing / Structured Agent Tracing):*
    - Trazabilidad estructurada del agente con `run_id` como identificador único de correlación por ejecución (generado mediante UUID, ULID o timestamp+hash). Aclarar que IDs deterministas pueden ser útiles en tests reproducibles, pero no son requisito del runtime normal en producción.
    - Registro detallado de cada iteración mediante spans estructurados: timestamp, modelo invocado, tokens de entrada/salida, latencia de inferencia, herramienta solicitada, argumentos exactos, latencia de ejecución de la herramienta, payload devuelto y motivo de terminación.
    - Formato de logs estructurados (JSONL) exportables para auditoría.
    - *Nota de arquitectura:* En L07 enseñamos **Agent Tracing / Structured Tracing** sobre el agente local en Python. Este tracing estructurado sienta las bases para evolucionar posteriormente a *Distributed Tracing* cuando una ejecución cruce múltiples microservicios, procesos o sandboxes en clúster (temas de M07/M08), pero no debe presentarse distributed tracing como requisito base local.
  - *Evaluation:*
    - Conexión con los fundamentos de evaluación de M04 (evaluación rigurosa vs "la respuesta se ve bonita").
    - Métricas clave de comportamiento agéntico:
      - *Task Success Rate:* Porcentaje de metas completadas exitosamente.
      - *Tool Selection Accuracy:* Precisión en la elección de la herramienta óptima.
      - *Argument Validity Rate:* Porcentaje de argumentos que respetan el contrato sin requerir reintentos.
      - *Trajectory Efficiency:* Número de pasos ejecutados vs pasos teóricamente óptimos.
      - *Unsafe Actions Blocked:* Porcentaje de intentos de violación de políticas interceptados por guardrails.
      - *Human Escalation Rate:* Proporción de ejecuciones que requirieron intervención de un operador.
    - Creación de un banco de pruebas automatizado (*Trajectory Benchmark Suite*) en Python.

---

## 7. Experiences propuestas para CASE Academy

Siguiendo el estándar de 3 experiencias interactivas por lección en `src/app/academy/modules/m05-ai-agents/`:

### L04 — State & Memory
1. **`exp-execution-state-inspector`**: Visualizador interactivo de memoria. Permite alternar entre el estado transitorio de la llamada (`scratchpad`), la memoria de sesión conversacional y el almacén persistente de disco, mostrando qué variables se destruyen al retornar la función y cuáles se preservan.
2. **`exp-context-window-collapse`**: Simulador de fatiga de contexto. El estudiante observa cómo acumular mensajes crudos dispara exponencialmente el costo y satura el contexto, y experimenta aplicando estrategias de poda (*windowing*) y resumen selectivo (*state checkpointing*).
3. **`exp-memory-policy-matrix`**: Ejercicio de clasificación interactivo. Dada una serie de datos producidos durante una atención al cliente (un número de tarjeta temporal, una preferencia dietaria del usuario, un código postal de un solo envío), el estudiante define la política de memoria: ¿descartar?, ¿guardar en sesión?, o ¿persistir en base de datos?

### L05 — Planning & Task Decomposition
1. **`exp-reactive-vs-planned`**: Comparador lado a lado. Ejecuta una consulta compleja sobre un agente puramente reactivo (que comete errores y da vueltas innecesarias) versus un agente que primero emite un plan estructurado y luego ejecuta paso a paso.
2. **`exp-plan-inspector`**: Tablero visual de estado de plan. Muestra en tiempo real el progreso de un plan JSON (`goal`, `steps`, `status: pending | in_progress | completed | failed`), permitiendo inspeccionar cómo se actualiza cada paso con la observación de su respectiva herramienta.
3. **`exp-replanning-simulator`**: Simulador de contingencia. La herramienta del Paso 2 falla deliberadamente (ej. servidor caído). El estudiante observa cómo el agente intercepta el fallo, no se rinde, y genera un plan adaptativo alternativo para alcanzar la meta.

### L06 — Guardrails & Human-in-the-Loop
1. **`exp-permission-boundary`**: Matriz interactiva de frontera de permisos. El estudiante compara el catálogo técnico `TOOL_REGISTRY` contra la política de software `ToolPolicy`, clasificando herramientas en `ALLOW`, `REQUIRE_APPROVAL` y `BLOCK`.
2. **`exp-human-approval-gate`**: Simulador de compuerta en tiempo real. El agente suspende la ejecución a `PAUSED_FOR_APPROVAL` ante operaciones críticas (ej. transferir fondos), muestra la `ActionProposal` con su huella SHA-256 sobre serialización determinista, y permite al estudiante aprobar, rechazar o simular ataques de mutación de argumentos (TOCTOU) y replay.
3. **`exp-budget-circuit-breaker`**: Consola de control de presupuestos y disyuntores. Permite configurar límites de iteraciones, llamadas y fallos, visualizando la activación del disyuntor (`CIRCUIT OPEN`) y la detención segura con `termination_reason = "budget_exceeded"`. Contadores rotulados como simulación didáctica.

### L07 — Observability & Evaluation
1. **`exp-agent-trace-waterfall`**: Visualizador de cascada de trazas (*flame-graph*). Muestra la secuencia temporal de una ejecución completa dividida en spans: inferencia LLM, serialización de argumentos, ejecución en CPU de la tool, espera de aprobación humana y respuesta final.
2. **`exp-trajectory-comparison`**: Analizador de eficiencia. Compara visualmente dos ejecuciones que llegaron a la misma respuesta final: una eficiente en 2 iteraciones con costo mínimo, y una ineficiente en 7 iteraciones con herramientas redundantes.
3. **`exp-evaluation-matrix`**: Tablero de métricas agénticas. Ejecuta una batería de 10 casos de prueba y presenta el reporte consolidado: Task Success Rate, Tool Accuracy, Costo promedio por ejecución y Tasa de intervención humana.

---

## 8. Talleres acumulativos

Todos los talleres conservan la arquitectura base de Python (`ModelProvider`, `MockModelProvider`, `OpenAICompatibleProvider`, `ToolCall`, `TOOL_REGISTRY`, dominio propio del estudiante) construida en L02 y L03.

### Progresión Acumulativa de Casos de Prueba (A–I)

Para garantizar la coherencia a lo largo de todo el módulo y evitar colisiones entre talleres, los casos de prueba siguen una nomenclatura alfabética estrictamente acumulativa:

| Lección | Caso | Propósito del Caso | Estado / Validación |
|---|---|---|---|
| **L02 (Agent v1)** | **Caso A** | Activación de Herramienta 1 en dominio propio | Validado en L02 |
| **L02 (Agent v1)** | **Caso B** | Activación de Herramienta 2 en dominio propio | Validado en L02 |
| **L02 (Agent v1)** | **Caso C** | Consulta conceptual directa (Sin invocación de herramientas) | Validado en L02 |
| **L03 (Agent v2)** | **Caso D** | Tarea multi-step dependiente (≥2 llamadas encadenadas en bucle) | Validado en L03 |
| **L03 (Agent v2)** | **Caso E** | Parada forzada por `max_iterations` (Circuit breaker básico) | Validado en L03 |
| **L04 (Agent v3)** | **Caso F** | Continuidad multi-turno con memoria de sesión y persistencia (F1 sesión, F2 aislamiento `subject_id`) | Validado e implementado en L04 |
| **L05 (Agent v4)** | **Caso G** | Planificación estructurada observable (G1), replanning con historial e invariante de meta (G2) y detección de deadlock (G3) | Implementado en feature |
| **L06 (Agent v5)** | **Caso H** | Guardrails deterministas, Action Binding SHA-256 sobre serialización determinista, HITL con reanudación y Circuit Breakers (H1 ALLOW, H2 APPROVE, H3 REJECT, H4 BLOCK, H5a Mutation, H5b Anti-Replay, H6 Budget) | Implementado en feature |
| **L07 (Agent v6)** | **Caso I** | Benchmark automatizado de evaluación de comportamiento (`eval_agent.py`) | Por implementar en L07 |

---

### Taller 04 — Agent v2 → Agent v3 (State & Memory)
- **Entregable:** `agent_v3.py` con `ExecutionState` tipado y `MemoryStore` explícito.
- **Qué se conserva:** Todo el código de herramientas, schemas, loop y pruebas A, B, C, D, E de Agent v2.
- **Qué se agrega:**
  - Clase `ExecutionState` para variables de trabajo transitorias.
  - Clase `MemoryStore` en memoria / JSON con métodos `get_session()`, `save_session()`, `get_profile()`, `update_profile()`.
  - Política de poda de contexto para mantener el historial acotado a las últimas $K$ interacciones relevantes.
- **Caso F (Continuidad Multi-Turno con Memoria):** El agente resuelve una consulta, la función retorna; luego el usuario hace una segunda consulta que depende de la primera (ej. *"¿Y cuánto costaría si agrego un día más?"*) y el agente la responde correctamente utilizando la memoria de sesión.

### Taller 05 — Agent v3 → Agent v4 (Planning)
- **Entregable:** `agent_v4.py` con componente `Planner` y seguimiento de planes estructurados.
- **Qué se conserva:** Todo el código de Agent v3 + memoria persistente y casos A–F.
- **Qué se agrega:**
  - Esquema estructurado de plan emitido como JSON antes de invocar herramientas operativas.
  - Loop de ejecución orientado a plan: avanza paso a paso actualizando `status` de cada ítem.
  - Mecanismo de `replan()` si una herramienta devuelve un error controlado.
- **Caso G (Planificación Observable y Replanning):** Una solicitud amplia que requiere tres pasos coordinados (ej. auditar inventario, verificar proveedores con bajo stock y generar solicitud de cotización), mostrando en consola el plan inicial, el avance de cada paso y la capacidad de replanificar si una herramienta retorna un fallo transitorio.

### Taller 06 — Agent v4 → Agent v5 (Guardrails & Human-in-the-Loop)
- **Entregable:** `agent_v5.py` con `PolicyEvaluator`, `ToolPolicy`, `ActionProposal` SHA-256, `ApprovalRecord` anti-replay y `BudgetController`.
- **Qué se conserva:** Todo el código de Agent v4 + planificador, memoria y casos A–G.
- **Qué se agrega:**
  - `PolicyDecision` (ALLOW, REQUIRE_APPROVAL, BLOCK) y `RiskLevel` (LOW, MEDIUM, CRITICAL).
  - `ToolPolicy` sin ambigüedad determinista.
  - `ActionProposal` con hash SHA-256 sobre serialización determinista (`action_fingerprint`).
  - `ApprovalRecord` con sellado `consumed = True` y control `consumed_proposal_ids` para evitar ataques de replay.
  - Máquina de estados con `ExecutionStatus` formal (`PAUSED_FOR_APPROVAL`) y reanudación segura.
  - Revalidación en tiempo real de política y precondiciones vigentes antes de despachar.
  - `BudgetController` con disyuntores operativos ante exceso de llamadas o iteraciones.
- **Caso H (Guardrails, HITL y Control de Presupuestos):**
  - **H1:** Acción ALLOW de bajo riesgo ejecutada directamente sin pausa.
  - **H2:** Acción crítica que genera `ActionProposal`, entra en `PAUSED_FOR_APPROVAL`, recibe APPROVE con fingerprint coincidente y precondiciones vigentes, se ejecuta exactamente una vez y se sella como consumida.
  - **H3:** Denegación humana (REJECT); la herramienta nunca se ejecuta y se inyecta la observación de rechazo.
  - **H4:** Acción proscrita (BLOCK) interceptada en software antes de cualquier compuerta humana.
  - **H5a:** Detección de mutación de argumentos post-aprobación mediante disparidad de huellas (`fingerprint_mismatch`).
  - **H5b:** Intercepción de ataque de replay reutilizando una aprobación ya consumida (`approval_replay_detected`).
  - **H6:** Límite presupuestal alcanzado; disyuntor se activa con `termination_reason = "budget_exceeded"`.

### Taller 07 — Agent v5 → Agent v6 (Observability & Evaluation)
- **Entregable:** `agent_v6.py` con `AgentTracer` y suite de pruebas `eval_agent.py`.
- **Qué se conserva:** Todo el código de Agent v5 + guardrails, aprobación humana y casos A–H.
- **Qué se agrega:**
  - `AgentTracer`: genera un archivo de traza estructurada `runs/{run_id}.json` con `run_id` como correlador único, spans, latencias y tokens de cada ejecución.
  - Script evaluador `eval_agent.py`: corre automáticamente una batería de casos estándar (happy path, consulta sin tools, error de tool, acción bloqueada por guardrail, meta multi-step) y emite un informe con las métricas cuantitativas del agente.
- **Caso I (Benchmark de Evaluación Automatizada):** Ejecución de la suite completa mostrando el reporte de evaluación en consola con métricas de éxito, precisión de herramientas y consumo de recursos.

---

## 9. Lab 05 final — Integración y Defensa de Ingeniería

El Laboratorio 05 deja de ser un documento conceptual pasivo (`workflow-spec.md`) y se convierte en el **Proyecto Capstone del Módulo 05**:

### Misión del Equipo
Cada grupo de estudio debe defender, desplegar e instrumentar su **Agent vFinal** completo ante un panel o revisor de arquitectura técnica (el instructor o pares evaluadores). Como dinámica optativa de aula, el instructor puede asumir el rol de CTO o arquitecto principal, pero el objetivo pedagógico reside en la justificación técnica objetiva y no en el roleplay.

### 12 Entregables Obligatorios del Lab
1. **Autonomy Test Matrix:** Justificación documentada de por qué el problema requería un agente y no un *Fixed Pipeline* ni una *State Machine*, demostrando la imposibilidad de predefinir rutas estáticas.
2. **Tool Catalog & JSON Schemas:** Mínimo 3 herramientas operacionales con esquemas estrictos y tipado sin ambigüedades.
3. **Execution Runtime & Loop:** Implementación de bucle con parada estricta, gestión de excepciones y prevención de bucles infinitos.
4. **State & Memory Management:** Separación explícita entre estado transitorio de ejecución, memoria de sesión y almacenamiento duradero.
5. **Structured Planning Engine:** Descomposición de metas complejas en planes observables e inspeccionables, con capacidad de replanificación.
6. **Classification of Operations & Guardrails:** Matriz de riesgo de herramientas y límites de presupuesto (tokens, costo, tiempo).
7. **Human-in-the-Loop Gate:** Compuerta de aprobación para acciones críticas con soporte de autorización o rechazo guiado.
8. **Structured Agent Tracing:** Exportación de trazas completas con `run_id` como identificador único de correlación, spans, latencias y payload auditables.
9. **Automated Evaluation Benchmark:** Suite de mínimo 8 casos de prueba automatizados cubriendo diferentes trayectorias.
10. **Behavioral Metrics Report:** Reporte cuantitativo con tasa de éxito, precisión de herramientas, eficiencia de pasos y costo promedio.
11. **Software vs Model Boundary Declaration:** Especificación formal de qué decisiones corresponden exclusivamente al software y cuáles son propuestas por el modelo probabilístico.
12. **Defensa Oral Técnica:** Sustentación técnica ante el panel/revisor de arquitectura respondiendo con solvencia las 14 preguntas de arquitectura de M05.

### Matriz de Casos de Prueba Requeridos en el Lab
- **Caso 1: Happy Path Simple** — Consulta directa resuelta en un solo paso de herramienta.
- **Caso 2: No-Tool Direct Answer** — Pregunta conceptual resuelta sin invocar herramientas.
- **Caso 3: Multi-Step Dependent** — Meta que exige encadenar al menos dos herramientas dependientes.
- **Caso 4: Memory Continuity** — Consulta de seguimiento en un segundo turno que aprovecha el contexto previo.
- **Caso 5: Plan Execution & Replanning** — Meta compuesta con falla forzada de una herramienta y replanificación airosa.
- **Caso 6: Tool Error & Graceful Recovery** — Herramienta que retorna un error controlado y el agente formula una respuesta explicativa.
- **Caso 7: Max Iterations Circuit Breaker** — Tarea irresoluble que detiene el bucle de forma limpia al llegar a `max_iterations`.
- **Caso 8: Critical Action Intercepted by HITL** — Acción de alto impacto interceptada por la compuerta humana (validando camino de aprobación y camino de rechazo).

---

## 10. Fronteras de contenido

Para mantener el foco y la excelencia pedagógica, M05 establece límites explícitos con otros módulos:

### Lo que SÍ pertenece a M05:
- Arquitectura lógica del agente (software sovereignty, contracts, runtime).
- El bucle de ejecución y sus condiciones de parada.
- Manejo estructurado de estado, memoria de sesión y memoria persistente.
- Planificación observable y replanificación.
- Guardrails lógicos, presupuestos y compuertas de supervisión humana (HITL).
- Observabilidad estructurada y evaluación de comportamiento.

### Lo que NO pertenece a M05 (Reservado para otros módulos):
- **Model Context Protocol (MCP) y sandboxing de clústeres:** Se enseña en **M07 (MCP & Advanced Tool Integration)**. En M05 el contrato es lógico y local.
- **Agentes escribiendo y depurando código:** Se enseña en **M06 (Agentic Software Engineering)**. En M05 los dominios son de negocio/operacionales.
- **Infraestructura de producción a escala (Kubernetes, sandboxes gVisor/Docker, colas Celery/Temporal):** Se enseña en **M08 (Production AI & Deployment)**.
- **Entrenamiento o ajuste de pesos (Fine-Tuning / RLHF):** El bucle de ejecución no modifica los pesos del modelo.

---

## 11. Multi-Agent como extensión opcional (L08)

El diseño de M05 **excluye deliberadamente los sistemas Multi-Agent del núcleo obligatorio** de la certificación.

### Justificación Técnica y Pedagógica
La industria padece de una fiebre injustificada de *"Planner Agent + Coder Agent + Reviewer Agent"* que añade latencia masiva, costos descontrolados, depuración imposible y degradación de contexto sin aportar valor real sobre un único agente bien instrumentado.

Un estudiante que no sabe controlar, limitar y evaluar un solo agente producirá un desastre exponencial si intenta orquestar cinco agentes interactuando entre sí.

### L08 (Opcional / Avanzada): Multi-Agent Systems & Orchestration
Se ofrece únicamente como extensión avanzada una vez dominado el agente individual.

- **Pregunta de Entrada Obligatoria:**
  > *“¿Por qué necesito dos agentes y no un solo agente con dos herramientas adicionales?”*
- **Condiciones Válidas para Justificar Multi-Agent:**
  1. **Aislamiento de Privilegios y Credenciales:** El Agente A tiene acceso a datos de clientes pero no a pasarelas de pago; el Agente B tiene acceso a pagos pero no a datos personales.
  2. **Modelos Heterogéneos:** Un agente rápido y económico (ej. 8B) para clasificación y filtrado de alto volumen, y un agente de alta capacidad (ej. 70B+) para síntesis y planificación profunda.
  3. **Límites de Contexto Incompatibles:** Tareas que requieren corpus documentales tan extensos que un solo contexto colapsaría por interferencia o costo.
  4. **Fronteras Organizacionales / Multi-Tenant:** Agentes que representan identidades o departamentos diferentes con políticas independientes.
- **Anti-patrón Prohibido:** Segmentar agentes por "roles humanos imaginarios" cuando una función simple en Python resuelve la misma lógica.

---

## 12. Impacto esperado sobre CASE Academy

### En la Plataforma Web (`src/app/academy/modules/m05-ai-agents/`):
1. **Rutas y Configuración (`course.config.ts`, `app.routes.ts`):**
   - Incorporación futura de las lecciones `lesson-04-state-memory`, `lesson-05-planning`, `lesson-06-guardrails-hitl` y `lesson-07-observability-eval`.
   - Evolución de `lab-05-design-agentic-workflow` a `lab-05-agent-engineering`.
2. **Componente Visual `AgentBuildingMap`:**
   - Evolución del mapa de 5 estados a un mapa de **Dos Capas** (Core Agent vs Engineering Layer) o una progresión ampliada de 7 nodos que refleje fielmente el nuevo pipeline.
3. **Registro de Experiencias (`experience-registry.component.ts`):**
   - Incorporación modular de las 12 nuevas experiencias (3 por cada nueva lección: L04, L05, L06, L07).
4. **Documentación del Instructor (`docs/curriculum/instructor/`):**
   - Creación de las guías de sesión y timelines para L04–L07 y el nuevo Lab 05.
5. **Talleres de Código (`docs/curriculum/workshops/`):**
   - Creación de las guías de taller acumulativas `taller-04-agent-v3.md` a `taller-07-agent-v6.md`.

---

*Fin del documento de arquitectura maestro. Aprobado para gobernar la feature `feat/m05-agent-engineering-expansion`.*
