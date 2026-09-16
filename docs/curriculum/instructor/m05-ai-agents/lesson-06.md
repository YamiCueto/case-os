# Guía Docente · M05 L06 — Guardrails & Human-in-the-Loop (HITL)

## 00. Ficha Técnica de la Lección

- **Módulo:** 05 — Agentes de IA
- **Lección:** 06 — Guardrails & Human-in-the-Loop (`c-m5-l06`)
- **Duración:** 120 minutos (Sesión Intensiva) o 2 bloques de 60 min (Sesión Desdoblada)
- **Evolución del Agente:** Agent v4 (Planning & Replanning) ──► **Agent v5 (Guardrails & Human Oversight)**
- **Prerrequisito Estricto:** `c-m5-l05` (Lección 05 — Planificación y Descomposición de Tareas y Taller 05 de Agent v4)
- **Casos de Validación del Taller:** Casos A–G (No-regresión) + **Casos H1** (ALLOW directo), **Caso H2** (REQUIRE_APPROVAL / APPROVE con binding SHA-256), **Caso H3** (REJECT con inyección de observación), **Caso H4** (BLOCK determinista de software), **Caso H5a** (Detección de mutación de argumentos), **Caso H5b** (Protección anti-replay de aprobación consumida) y **Caso H6** (Disyuntor de presupuesto `budget_exceeded`).

---

## 01. Propósito Pedagógico y Tesis Central

En las lecciones anteriores construimos un agente capaz de decidir (L01), llamar herramientas tipadas (L02), iterar en un ciclo autónomo (L03), retener memoria persistente por `subject_id` (L04) y planificar/replanificar mediante grafos de tareas observables (L05).

Sin embargo, Agent v4 presenta un riesgo crítico de seguridad y control operacional:
```text
Goal: Resolver pago pendiente
S1 [TOOL]    consultar deuda       ──► S2 [RUNTIME] validar reglas
S3 [TOOL]    ejecutar transferencia──► S4 [MODEL]   emitir confirmación
```

### El Problema Detonante
Agent v4 concluye lógicamente que el paso **S3 (`transfer_funds`)** es el paso correcto y necesario para cumplir la meta. Las herramientas existen en el catálogo y los tipos de datos son válidos.

Pero: **¿Está el agente autorizado para ejecutar transferencias o mutaciones críticas de forma autónoma?**

NO.

### La Tesis Central
> **`CAPACIDAD ≠ AUTORIDAD`**
> *"Que una acción sea técnicamente posible (existe en el registro) y lógicamente correcta según el plan, no significa que el agente esté autorizado a ejecutarla."*

L06 representa el ingreso pleno a la **Engineering & Control Layer**:
- El **Core Agent** (L01–L05) intenta resolver la tarea.
- La **Engineering Layer** (L06–L07) decide bajo qué condiciones se le permite operar, cuándo suspender para revisión humana y cuándo cortar la ejecución por desborde presupuestal.

---

## 02. Reglas Pedagógicas Fundamentales de L06

1. **Guardrails en Software ≠ Instrucciones en el System Prompt:**
   - Enseñar con vehemencia que pedirle al LLM *"por favor no hagas transferencias no autorizadas"* o *"no borres registros"* es una ilusión de seguridad. Un modelo probabilístico sufre de jailbreaks, ambigüedades e inyecciones de prompt.
   - Los controles reales viven en software determinista (`PolicyEvaluator` en Python), antes de la invocación de cualquier herramienta.
2. **`RiskLevel` ≠ `PolicyDecision` (Sin Estados Contradictorios):**
   - El riesgo (`LOW`, `MEDIUM`, `CRITICAL`) es una **clasificación y metadata**, no una decisión.
   - La política produce exactamente **una** decisión determinista: `ALLOW`, `REQUIRE_APPROVAL` o `BLOCK`.
   - Queda prohibido modelar booleanos conflictivos como `allowed=False` junto a `requires_approval=True`.
3. **Action Binding vs TOCTOU Completo:**
   - El `action_fingerprint` (digest SHA-256 sobre serialización JSON determinista de la tupla `tool_name` + `sorted_arguments`) garantiza el **Action Binding**: el humano autoriza una acción concreta con parámetros exactos, no una intención abstracta.
   - **El fingerprint no protege contra cambios en el mundo exterior.** Entre la aprobación humana y la ejecución real, la cuenta pudo ser congelada o el saldo agotado. El runtime siempre revalida la política y las precondiciones vigentes antes del despacho.
4. **Aprobaciones de Un Solo Uso y Protección Anti-Replay:**
   - Una aprobación no es un token reutilizable.
   - Tras ejecutarse, el `ApprovalRecord` se sella como `consumed = True`, se estampa `consumed_at` y se archiva en `consumed_proposal_ids`.
   - Cualquier intento subsiguiente de despachar una acción reutilizando esa aprobación es interceptado como `approval_replay_detected`.
5. **Diferencia Semántica: `BLOCK` vs `REJECT`:**
   - `BLOCK`: Política determinista prohíbe la acción *antes* de cualquier compuerta humana; no hay `ActionProposal`, no hay prompt humano y el humano no puede anular el bloqueo en la política base.
   - `REJECT`: El supervisor humano evalúa una propuesta válida y decide rechazarla; la herramienta no se ejecuta y se inyecta una observación de rechazo para que el planificador busque alternativas o termine ordenadamente.
6. **BudgetController y Circuit Breakers:**
   - El agente debe operar bajo presupuestos operativos duros (`max_iterations`, `max_tool_calls`, `max_failures`).
   - Todo valor ilustrativo de tokens o costo debe rotularse: `SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS`.

---

## 03. Arquitectura del Pipeline de Ejecución de Agent v5

Presenta en la pizarra este diagrama de flujo de control:

```text
PlanStep (TOOL)
   │
   ▼
PolicyEvaluator.evaluate(tool, args, context)
   │
┌──┴──────────────────────┬──────────────────────────────────┬──────────────┐
│ ALLOW                   │ REQUIRE_APPROVAL                 │ BLOCK        │
└──┬──────────────────────┴────────────────┬─────────────────┴──────┬───────┘
   │                                       │                        │
execute (1-Shot)                    ActionProposal               BLOCKED
   │                         (SHA-256 deterministic hash)    (sin compuerta)
observation                                │
   │                              PAUSED_FOR_APPROVAL
RUNNING                                    │
                                    SUPERVISOR HUMANO
                                   ↙                 ↘
                              APPROVE                REJECT
                                 │                      │
                       anti-replay check         record rejection
                        (not consumed)                  │
                                 │               tool NOT executed
                      verify action_fingerprint         │
                       (exact match 64-hex)      inject observation
                                 │                      │
                    re-evaluate policy/preconds     replan/stop
                     (estado del mundo exterior)
                                 │
                           execute once
                                 │
                       mark approval consumed
                       (consumed=True, add id)
                                 │
                              RUNNING
```

---

## 04. Guía de Experiencias Interactivas en CASE OS

Dirige a los estudiantes a explorar las tres herramientas de la plataforma:

1. **`exp-permission-boundary` (Capacidad vs Autoridad):**
   - Compara en vivo la lista de herramientas en `TOOL_REGISTRY` (capacidad técnica) contra la `ToolPolicy` (frontera de autorización).
   - Permite clasificar herramientas en `ALLOW`, `REQUIRE_APPROVAL` y `BLOCK`.
   - Enseña que aunque una herramienta compile y reciba JSON válido, el software puede prohibir su ejecución.

2. **`exp-human-approval-gate` (Compuerta Humana, Binding y TOCTOU):**
   - Simula el paso S3 (`transfer_funds`, $250,000 COP).
   - El runtime entra en `PAUSED_FOR_APPROVAL` y genera la tarjeta de `ActionProposal` con su huella SHA-256 sobre serialización determinista.
   - Demuestra el ataque TOCTOU: el estudiante hace clic en *"Sabotear monto a $900,000 post-aprobación"* y comprueba cómo el runtime detecta la discrepancia de huellas (`fingerprint mismatch`) y bloquea la llamada.
   - Demuestra el cambio de precondición: aun con fingerprint válido, si la cuenta fue congelada externamente, el runtime cancela la ejecución.
   - Demuestra el ataque de replay: intentar reusar la aprobación consumida genera `approval_replay_detected`.

3. **`exp-budget-circuit-breaker` (Presupuestos y Disyuntores):**
   - Consola con medidores de iteraciones, tool calls y fallos.
   - Simula la apertura del disyuntor (`CIRCUIT OPEN`), deteniendo la corrida con `termination_reason = "budget_exceeded"`.
   - Rotulado visible de contadores didácticos ilustrativos.

---

## 05. Taller Práctico: De Agent v4 a Agent v5 (60–75 min)

Guía a los alumnos con el documento canónico [`taller-06-agent-v5.md`](file:///c:/Users/YAMI/Documents/projects/curso-ia-generativa/docs/curriculum/workshops/m05-ai-agents/taller-06-agent-v5.md):

### Hito 1: Modelado de Políticas Deterministas (15 min)
- Implementar `PolicyDecision`, `RiskLevel` y `ToolPolicy` unificada.
- Construir `PolicyEvaluator` con allowlist y validación de restricciones de negocio.

### Hito 2: Action Binding y Modelo de Aprobación (15 min)
- Implementar `compute_action_fingerprint()` con serialización JSON determinista `json.dumps(..., sort_keys=True, separators=(',', ':'))`.
- Implementar `ActionProposal` y `ApprovalRecord` con `consumed: bool = False`, `consumed_at` y `consumed_proposal_ids`.

### Hito 3 y 4: Máquina de Estados y BudgetController (15 min)
- Implementar `ExecutionStatus` (`RUNNING`, `PAUSED_FOR_APPROVAL`, `COMPLETED`, `FAILED`, `BLOCKED`).
- Construir `run_step_with_guardrails()` gobernando el flujo: control anti-replay, verificación de huella, revalidación de precondiciones y sellado de consumo.

### Hito 5: Batería de Pruebas Obligatoria (Casos H1–H6) (20 min)
- **Caso H1:** Acción `ALLOW` ejecutada sin pausa.
- **Caso H2:** Acción `REQUIRE_APPROVAL` aprobada, huella verificada, ejecutada 1 vez y sellada como consumida.
- **Caso H3:** Acción rechazada por humano; herramienta no ejecutada y observación inyectada.
- **Caso H4:** Acción `BLOCK` proscrita en software sin compuerta ni override humano.
- **Caso H5a:** Mutación de parámetros post-aprobación detectada por huella (`fingerprint_mismatch`).
- **Caso H5b:** Intento de reutilizar aprobación consumida interceptado (`approval_replay_detected`).
- **Caso H6:** Límite de llamadas a herramientas alcanzado; disyuntor activado con `termination_reason = "budget_exceeded"`.

---

## 06. Matriz de Errores Comunes de los Estudiantes

| Error Común | Causa Raíz | Intervención del Instructor |
|---|---|---|
| Intentar validar seguridad con un system prompt | Confundir alineación probabilística con control determinista de software | Preguntar: *"Si un prompt injection burla el system prompt, ¿qué línea de código en tu backend impide el cobro?"* |
| Usar SHA-256 truncado para la verificación interna | Confundir el prefijo visual de la UI con la comprobación de integridad | Recordar: *"La UI muestra 12 caracteres por legibilidad, pero el runtime compara los 64 hex completos."* |
| Afirmar que el fingerprint resuelve todo TOCTOU | Asumir que verificar la propuesta protege contra cambios en el mundo exterior | Recordar: *"El fingerprint protege la integridad de la acción propuesta, no el estado del mundo exterior. Siempre revalida política y precondiciones antes de ejecutar."* |
| Reutilizar aprobaciones entre pasos o ciclos | Tratar la aprobación como un permiso genérico en vez de un registro de un solo uso | Exigir: *"Cada ApprovalRecord se sella con consumed=True y se almacena en consumed_proposal_ids."* |
| Permitir que el humano anule un `BLOCK` | Romper la separación entre políticas fundamentales y operaciones autorizables | Aclarar: *"BLOCK es la ley del software. Si una operación está proscrita, la compuerta humana ni siquiera se abre."* |

---

## 07. Criterios de Evaluación y Rúbrica

- **Excelente (100%):** Implementa `PolicyDecision` determinista sin booleanos conflictivos; calcula hash SHA-256 sobre serialización determinista; implementa comprobación anti-replay y revalidación de precondiciones; aprueba los Casos H1 a H6 en terminal sin errores.
- **Aceptable (80%):** Implementa compuerta humana y pausa/reanudación, pero descuida la revalidación de precondiciones o permite replay de aprobaciones.
- **Insuficiente (<60%):** Depende de prompts para la seguridad, usa `input("Y/N")` improvisado en la consola sin modelo de datos de aprobación o no supera los casos H2/H5.

---

## 08. Puente Pedagógico hacia L07 (Observability & Evaluation)

Al concluir L06, los estudiantes han construido un agente con:
- Decisión (L01)
- Herramientas (L02)
- Bucle autónomo (L03)
- Memoria persistente (L04)
- Planificación estructurada (L05)
- Guardrails deterministas y Human-in-the-Loop (L06)

**El Nuevo Problema Detonante para L07:**
> *"Sabemos que el agente está planificado y controlado por compuertas. Pero si lo desplegamos a producción, ¿cómo sabemos exactamente qué trayectoria siguió, cuántas iteraciones ejecutó, cuántos tokens consumió cada paso y cómo evaluamos sistemáticamente si es confiable?"*

Esto abre la puerta a **L07 — Observability & Evaluation (Agent v6)**.
