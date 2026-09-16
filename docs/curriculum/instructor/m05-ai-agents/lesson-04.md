# Guía Docente: M05 L04 — Estado y Memoria: De la Amnesia del Modelo a la Persistencia Controlada (Agent v3)

Esta guía es el guion pedagógico completo para conducir la sesión de M05 L04. Permite al docente guiar a los alumnos a través de la evolución de **Agent v2** hacia **Agent v3**, resolviendo la amnesia conversacional y la pérdida de continuidad entre ejecuciones mediante una arquitectura explícita de **State & Memory**.

---

## Principio Pedagógico de la Lección

> **"L03 enseñó al runtime a ciclar hasta resolver una meta. L04 enseña al runtime a recordar quién es el usuario, qué se decidió y qué preferencias gobiernan sus ejecuciones futuras sin saturar la ventana de contexto."**

La progresión de M05 es estrictamente acumulativa:

```text
L01: Decision / Autonomy (Flujo determinista vs delegación)
  ↓
L02: Tool Calling / Agent v1 (Declaración, invocación e inyección estructurada)
  ↓
L03: Agent Loop / Agent v2 (Bucle de realimentación multi-step y paradas)
  ↓
L04: State & Memory / Agent v3 (ExecutionState, SessionMemory, Persistent Memory y Scopes)
  ↓
L05: Planning (Planes explícitos, descomposición y replanificación)
  ↓
L06: Guardrails & Human-in-the-Loop (Políticas de seguridad, validación y control)
  ↓
L07: Observability & Evaluation (Spans, trazas locales, latencia y benchmarking)
```

### Reglas pedagógicas inviolables para L04:
1. **Diferenciación conceptual radical:**
   - **Context Window ≠ Memory Store:** La ventana de contexto es RAM efímera del LLM con costo cuadrático/lineal en tokens y degradación de atención; el Memory Store es almacenamiento persistente estructurado gobernado por el software.
   - **Chat History ≠ Memory System:** Volcar toda la transcripción de mensajes no es memoria; satura el contexto y arrastra ruido. Un sistema de memoria sintetiza, clasifica, asocia metadatos y recupera bajo demanda.
   - **Memory Store ≠ RAG Knowledge Base:** RAG indexa conocimiento documental corporativo general (manuales, leyes, catálogos); el Memory Store gestiona hechos, preferencias y decisiones aprendidas sobre un sujeto o entidad particular.
2. **Los tres horizontes temporales:**
   - **ExecutionState (Efímero / Intra-run):** Variables vivas del bucle (`run_id`, `session_id`, `subject_id`, `messages`, `iteration`, `last_observation`, `termination_reason`). `session_id` y `subject_id` forman parte del contexto de ejecución, pero no hacen persistente a `ExecutionState`. Al terminar la función, las referencias locales salen de alcance; si ningún otro objeto lo referencia, queda elegible para liberación/recolección.
   - **SessionMemory (Conversacional / Inter-turn):** Historial acotado del hilo activo (`session_id`).
   - **PersistentMemory (Duradera / Inter-session):** Hechos y preferencias explícitas indexadas con metadatos y `subject_id`.
3. **Scope y Ownership de Memoria:**
   - `run_id`: correlación por ejecución.
   - `session_id`: hilo conversacional.
   - `subject_id`: identidad del usuario/entidad propietaria. **Evita la contaminación cruzada entre usuarios.**
4. **Soberanía del Software sobre el Almacenamiento:**
   - El modelo **nunca** escribe directamente en base de datos.
   - El modelo propone una intención o el software clasifica el mensaje bajo una **MemoryPolicy** declarativa. El software valida, sanitiza y ejecuta el almacenamiento.
5. **Costo de la memoria recuperada:**
   - Recuperar memoria no es gratis: inyectar hechos en el prompt consume tokens de entrada. El crecimiento del contexto debe ser **acotado, controlado y predecible**, no plano ni infinito.
6. **Políticas de higiene y seguridad:**
   - Prohibido almacenar contraseñas, API keys, credenciales o datos confidenciales transitorios en memoria persistente.
7. **Sin frameworks externos opacos:**
   - No usar LangChain, LangGraph, Mem0 como librería mágica externa. Se analiza Mem0 conceptualmente en pizarra para entender qué hace por debajo, pero se implementa la memoria nativa en Python.

---

## Estructura y Ritmo de la Sesión (120 min)

| Bloque | Minutos | Tema Principal | Actividad / Demostración |
| :--- | :--- | :--- | :--- |
| **00. Apertura** | 00–05 min | Ubicación en el Mapa del Agente | Proyección de `AgentBuildingMap` v2 en CASE OS |
| **01. Amnesia de Agent v2** | 05–25 min | La Falla Detonante de Continuidad | Demostración en vivo de reinicio de contexto |
| **02. Anatomía de Estado y Memoria** | 25–45 min | Los 3 Niveles: Execution, Session, Persistent | Diagrama de flujo y soberanía de software |
| **03. Scope & Ownership** | 45–60 min | Aislamiento por `subject_id` y Costo de Contexto | Discusión socrática de privacidad y tokens |
| **04. Taller Práctico** | 60–105 min | De Agent v2 a Agent v3 (Casos F1 y F2) | Implementación de `MemoryStore`, `hydrate()` y `write_back()` |
| **05. Cierre y Puente a L05** | 105–120 min | De Recordar Hechos a Planificar Estrategias | Discusión de Mem0 y preguntas socráticas hacia Planning |

---

## 00. Apertura: Ubicación en el Mapa del Agente (5 min)

### Qué explicar con tus propias palabras
> "En L01 aprendimos cuándo delegar una decisión a un modelo. En L02 le dimos manos estructuradas con herramientas. En L03 le dimos un bucle para iterar hasta resolver tareas compuestas. Nuestro Agent v2 sabe razonar y actuar. Pero si cerramos el script o enviamos un segundo mensaje, Agent v2 vuelve a nacer de cero: no recuerda quiénes somos, qué decidió hace dos segundos ni qué política de despacho acordamos. Hoy no vamos a reescribir el agente: vamos a dotarlo de Estado y Memoria evolucionándolo a **Agent v3**."

### Qué elemento de CASE OS mostrar
Proyecta el componente `AgentBuildingMapComponent` en `/#/academy/modules/m05-ai-agents/lesson-04-state-memory`.
Muestra la arquitectura de dos capas:
- **Core Agent:** Decision (L01, superado), Tools (L02, superado), Loop (L03, superado), **State & Memory (L04, ACTIVO)**, Planning (L05, pendiente).
- **Engineering & Control Layer:** Guardrails & HITL (L06), Observability & Eval (L07).

---

## 01. El Problema Detonante: La Amnesia de Agent v2 (20 min)

### El Experimento en Vivo (Demostración del Instructor)
Abre una terminal interactiva con `run_agent_v2()` de L03 y ejecuta la siguiente secuencia:

**Turno 1:**
```text
Usuario: "Hola, soy Carlos de Logística. Para todos mis envíos futuros prioriza la transportadora 'Servientrega'."
Agent v2: "Entendido Carlos, tendré en cuenta que para tus envíos futuros debes priorizar Servientrega."
```

**Turno 2 (inmediatamente después):**
```text
Usuario: "¿Qué transportadora debo usar para el pedido ORD-4091?"
Agent v2: "Consultaré las transportadoras disponibles para el pedido ORD-4091..." [Invoca get_shipping_provider y devuelve transportadora por defecto al azar, olvidando por completo la preferencia de Carlos].
```

### Pregunta Socrática para el Salón
> *"¿Por qué Agent v2 olvidó la regla de Carlos si acababa de responder que la tendría en cuenta hace 10 segundos?"*

**Respuestas esperadas de los alumnos:**
- *"Porque no le pasamos los mensajes anteriores."*
- *"Porque cada llamada a `run_agent_v2` crea una lista nueva de mensajes."*
- *"Porque el modelo no guarda memoria interna de las peticiones HTTP."*

**Respuesta pedagógica de cierre:**
> "Exacto. Los LLMs son funciones puramente matemáticas sin estado interno persistente: $f(mensajes) \rightarrow respuesta$. Si el software no le reinyecta la memoria, el modelo sufre de amnesia total. Pero la solución NO es reenviarle 500 mensajes de chat. Si hacemos eso, en 10 turnos colapsamos la ventana de contexto, sube la latencia al cielo y pagamos dólares innecesarios. Necesitamos un **sistema de memoria estructurado gobernado por el runtime**."

---

## 02. Anatomía de Estado y Memoria: Los Tres Niveles (20 min)

Explica con claridad meridiana los tres horizontes temporales en la pizarra:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Nivel 1: ExecutionState (Efímero / Intra-run)                           │
│ • run_id: "run_99182" | session_id: "sess_01" | subject_id: "usr_101" │
│ • iteration: 2 / max_iterations: 5                                     │
│ • last_observation: {"status": "ready_to_ship"}                        │
│ • termination_reason: "final_answer" (al concluir)                     │
│ • Vive solo durante la función; sale de alcance al retornar.           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (persiste solo hechos relevantes)
┌──────────────────────────────────▼─────────────────────────────────────┐
│ Nivel 2: SessionMemory (Conversacional / Inter-turn)                    │
│ • session_id: "sess_col_001"                                           │
│ • turns: Historial reciente depurado (rolling window / summary)         │
│ • Vive mientras la sesión conversacional permanezca activa.            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (extrae preferencias duraderas)
┌──────────────────────────────────▼─────────────────────────────────────┐
│ Nivel 3: PersistentMemory (Duradera / Inter-session)                   │
│ • subject_id: "usr_carlos_77"                                          │
│ • facts / preferences: {"preferred_carrier": "Servientrega"}           │
│ • Vive en base de datos o almacenamiento persistente indexado.         │
└────────────────────────────────────────────────────────────────────────┘
```

### Experiencia Interactiva en CASE OS
Dirige a los estudiantes a la experiencia **Execution State Inspector** en la plataforma:
- Inspeccionar cómo cambian `run_id`, `iteration`, y `tool_history` en cada paso del loop.
- Verificar que `ExecutionState` nunca sale al usuario final; es la memoria de trabajo del runtime.

---

## 03. Scope & Ownership: Evitando la Contaminación Cruzada (15 min)

### La Falla Crítica de Seguridad y Privacidad
Plantea este escenario en la pizarra:
- **Usuario A (Carlos):** *"Mi transportadora preferida es Servientrega."*
- **Usuario B (Mariana):** *"¿Qué transportadora debo usar para despachar mi pedido urgente?"*

> *"Si el sistema de memoria solo indexara 'preferencias' sin asociar el `subject_id`, el agente podría inyectarle a Mariana la preferencia de Carlos. En logística esto genera envíos a destinos erróneos; en salud o finanzas, es una filtración catastrófica de datos."*

### Los Tres Identificadores Clave:
1. `run_id`: Correlaciona una ejecución única del Agent Loop (para trazabilidad y depuración).
2. `session_id`: Agrupa los intercambios de un mismo hilo conversacional.
3. `subject_id`: Identifica unívocamente a la persona o entidad propietaria de la memoria. **Toda consulta al `MemoryStore` debe filtrar obligatoriamente por `subject_id`.**

### El Costo de la Memoria Recuperada
Explica con la experiencia **Context vs Memory**:
- Estrategia A (Chat History acumulativo): El contexto crece sin control de forma lineal/cuadrática. A los 20 turnos cuesta miles de tokens.
- Estrategia B (Memory Store estructurado): Solo se inyectan los 2 o 3 hechos relevantes para la meta actual. El contexto crece de forma **acotada, controlada y predecible**.

---

## 04. Taller Práctico: De Agent v2 a Agent v3 (45 min)

Guía a los alumnos en la lectura y codificación del **Taller 04 (`taller-04-agent-v3.md`)**.

### Paso 1: Inspeccionar la evolución del contrato
Muestra cómo `run_agent_v2` recibía únicamente `prompt` y `tools`, mientras que `run_agent_v3` recibe el contexto de sesión:

```python
# L02: Agent v1 (Single turn)
def run_agent_v1(prompt: str, tools: list[ToolDefinition]) -> str

# L03: Agent v2 (Autonomous Loop)
def run_agent_v2(prompt: str, tools: list[ToolDefinition], max_iterations: int = 5) -> AgentResponse

# L04: Agent v3 (State & Memory Aware)
def run_agent_v3(
    prompt: str,
    tools: list[ToolDefinition],
    session_id: str,
    subject_id: str,
    memory_store: MemoryStore,
    max_iterations: int = 5
) -> AgentResponse
```

### Paso 2: El Ciclo de Vida: Hydrate → Loop → Write-back
Explica los dos momentos sagrados de integración:
1. **Hydration (Antes del bucle):**
   - El runtime consulta `memory_store.search(subject_id=subject_id, session_id=session_id)`.
   - Inyecta un bloque claro en el System Prompt:
     ```text
     [MEMORIA CONOCIDA DEL USUARIO]
     - preferred_carrier: Servientrega
     - client_tier: VIP
     ```
2. **Execution Loop:**
   - Se ejecuta el bucle de L03 gobernado por `ExecutionState` local.
3. **Write-Back (Después del bucle):**
   - Una `MemoryPolicy` analiza si durante la conversación el usuario explicitó hechos duraderos o preferencias permanentes.
   - Si aplica, el runtime invoca `memory_store.save_fact(subject_id, key, value)`.

### Paso 3: Validación de los Casos F1 y F2
- **Caso F1 (Session Continuity):** El agente responde al Turno 2 recordando la orden mencionada en el Turno 1 dentro de la misma `session_id`.
- **Caso F2 (Persistent Continuity & Subject Isolation):**
  - Carlos inicia una nueva sesión (`session_B`) y el agente recuerda que su transportadora favorita es Servientrega.
  - Laura inicia su propia sesión (`session_C`).
  - **Prueba primaria de aislamiento:** Se inspecciona `memory_store.search(subject_id="usr_laura_02")` (comprobando `m.subject_id != carlos_id` y `"Servientrega" not in str(m.value)`) e `hydrate_context()` para garantizar que ningún `MemoryItem` de Carlos entra en el espacio de Laura.
  - **Prueba secundaria:** Se comprueba que la respuesta del agente no adopte la preferencia de Carlos y proporcione opciones estándar neutrales.

---

## 05. Cierre y Puente Pedagógico a L05 (15 min)

### Discusión Arquitectónica: ¿Qué es Mem0 y por qué no lo usamos a ciegas?
> "En la industria escucharán mucho hablar de **Mem0**, Zep o LangMem. ¿Qué hacen estas librerías? Exactamente lo que acabamos de programar: interceptan las peticiones, extraen entidades con un LLM secundario, guardan vectores en SQLite/Qdrant y las reinyectan al prompt. Usarlas sin entender State & Memory produce agentes con memorias alucinadas o filtración de datos entre clientes. Hoy ustedes aprendieron el mecanismo real que gobierna cualquier framework."

### Pregunta detonante para L05 (Planning)
> *"Ya tenemos un agente que usa tools (L02), itera en bucle (L03) y recuerda preferencias del usuario (L04). Pero imaginen que el usuario le pide: 'Audita todas las órdenes devueltas del mes, recalcula reembolsos, genera reporte PDF y envíalo a contabilidad'. Si el agente solo cicla paso a paso sin un plan inicial, ¿qué pasará cuando un paso intermedio falle o se desvíe del objetivo general?"*

**Conexión con L05:** En la Lección 05 introduciremos **Planning**: cómo el agente crea una secuencia explícita de tareas antes de ejecutarlas, evalúa su progreso y replanifica dinámicamente si la realidad cambia.
