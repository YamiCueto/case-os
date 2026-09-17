# M05-L04 — Estado y Memoria: De la Amnesia del Modelo a la Persistencia Controlada (Agent v3)

## Guía timeline para impartir la Lección 04

**Duración de referencia:** 2 horas (120 minutos)  
**Modalidad:** CASE Academy + editor/terminal de Python.  
**Meta de la sesión:** Que el grupo comprenda la diferencia radical entre la ventana de contexto efímera y un sistema de memoria persistente gobernado por el software, y evolucione su **Agent v2** de L03 hacia un **Agent v3** capaz de mantener continuidad conversacional e inter-sesión con aislamiento riguroso por `subject_id`.

---

## La idea central que deben llevarse

> **"Un LLM no tiene memoria interna entre peticiones: cada inferencia es un cálculo sin estado. Pasar todo el historial de chat satura el contexto y degrada el razonamiento. Un sistema de memoria profesional pertenece a la capa de software, clasifica hechos bajo políticas estrictas, aísla datos por `subject_id` y recupera solo lo relevante de forma acotada y predecible."**

El estudiante debe internalizar las cuatro verdades arquitectónicas de la lección:
1. **Context Window ≠ Memory Store:** La ventana de contexto es memoria de trabajo temporal; el Memory Store es persistencia estructurada.
2. **Chat History ≠ Memory System:** Acumular mensajes crudos no es memoria; es un basurero conversacional con costo creciente.
3. **Memory Store ≠ RAG Knowledge Base:** RAG indexa conocimiento documental global; Memory Store almacena hechos específicos del usuario/sujeto.
4. **ExecutionState ≠ SessionMemory ≠ PersistentMemory:** Diferentes horizontes temporales para diferentes necesidades de control.

---

## Continuidad con L01, L02 y L03

Abre con el mapa del agente proyectado en CASE Academy:

```text
Core Agent:
Decision (L01 ✓) → Tools (L02 ✓) → Loop (L03 ✓) → State & Memory (L04 ●) → Planning (L05 ○)

Engineering & Control Layer:
Guardrails & HITL (L06 ○) ─── Observability & Evaluation (L07 ○)
```

Di:

> “En L01 decidimos cuándo delegar. En L02 le dimos herramientas para actuar. En L03 construimos un Agent Loop que cicla hasta resolver tareas compuestas. Pero si llamamos a Agent v2 por segunda vez, vuelve a nacer con amnesia total: no sabe quiénes somos, qué acordamos hace un minuto ni qué regla de negocio gobierna a su cliente. Hoy no creamos un agente desde cero: tomamos nuestro Agent v2 de L03 y lo transformamos en **Agent v3** con arquitectura de Estado y Memoria.”

---

## Dos ritmos posibles para impartir L04

### Opción A — Sesión única intensiva (~120 min)
Diseñada para grupos con buen ritmo en Python y su Agent v2 listo:
- **0–10 min:** Apertura y ubicación en `AgentBuildingMap` v2. Demostración en vivo de la amnesia de Agent v2.
- **10–30 min:** Los tres horizontes temporales: `ExecutionState`, `SessionMemory` y `PersistentMemory`. Experiencia `exp-execution-state-inspector`.
- **30–50 min:** Ventana de contexto vs Memoria externa y la ilusión del historial infinito. Experiencia `exp-context-vs-memory`.
- **50–70 min:** Scope, Ownership (`subject_id`) y Políticas de Memoria. Experiencia `exp-memory-policy-matrix`.
- **70–110 min (40 min):** Taller práctico: De Agent v2 a Agent v3. Implementación de `MemoryStore`, `hydrate()`, `write_back()` y pruebas Casos F1/F2.
- **110–120 min (10 min):** Auditoría pedagógica, discusión sobre Mem0/frameworks y puente hacia L05 Planning.

### Opción B — Sesión desdoblada (Recomendada si los grupos exploran persistencia por primera vez)
- **Sesión 1 (Fundamentos, Costo de Contexto y Políticas):**
  Apertura, demostración de amnesia, análisis de los 3 niveles temporales, exploración de las 3 experiencias interactivas en CASE Academy, diseño de la `MemoryPolicy` y del modelo de datos para su dominio particular.
- **Sesión 2 (Implementación de Agent v3 y Validación de Scopes):**
  Desarrollo de `MemoryStore` en memoria/disco, integración de `hydrate()` y `write_back()` en `run_agent_v3()`, pruebas de no-regresión (A, B, C, D, E) y ejecución de los Casos F1 (continuidad de sesión) y F2 (persistencia y aislamiento entre usuarios). Cierre con puente hacia Planning.

---

# Cronograma Detallado (Sesión Única — 120 min)

| Tiempo | Bloque visible en CASE Academy | Objetivo Pedagógico |
|---|---|---|
| **0–10 min** | Apertura + `AgentBuildingMap` v2 | Conectar con L01-L03 y demostrar la falla de amnesia de Agent v2. |
| **10–30 min** | 01. Los Tres Horizontes de Estado | Distinguir ExecutionState, SessionMemory y PersistentMemory (`exp-execution-state-inspector`). |
| **30–50 min** | 02. Context Window vs Memory Store | Demostrar el costo de tokens y pérdida de foco del chat history (`exp-context-vs-memory`). |
| **50–70 min** | 03. Scope, Ownership & Políticas | Garantizar aislamiento con `subject_id` y clasificar datos (`exp-memory-policy-matrix`). |
| **70–110 min** | 04. Taller Práctico: Agent v3 | Evolucionar el código: `MemoryStore`, `hydrate()`, `write_back()` y Casos F1/F2. |
| **110–120 min** | 05. Cierre y Puente hacia L05 | Desmitificar Mem0 y plantear la necesidad de Planning en tareas multi-objetivo. |

---

# 0–10 min — Apertura: El Experimento de la Amnesia

### Qué proyectar
Proyecta CASE Academy en `/#/academy/modules/m05-ai-agents/lesson-04-state-memory`.
Muestra el mapa del agente con **State & Memory** resaltado en color cyan y las lecciones anteriores en verde completado.

### Experimento en vivo del docente
Abre la consola con Agent v2 de L03 y ejecuta:
```python
# Turno 1
res1 = run_agent_v2("Hola, soy María. Mi transportadora preferida siempre es Coordinadora.", tools=TOOLS)
print(res1.content)
# El modelo responde educadamente confirmando que usará Coordinadora.

# Turno 2
res2 = run_agent_v2("¿Qué transportadora uso para despachar el pedido ORD-5501?", tools=TOOLS)
print(res2.content)
# El modelo invoca get_shipping_provider y devuelve Servientrega al azar.
```

### Pregunta al grupo
> *"¿Por qué el modelo confirmó la regla de María en el primer turno y la ignoró por completo en el segundo turno?"*

Deja que 2 o 3 estudiantes respondan. La conclusión debe ser unánime: **el modelo no tiene memoria intrínseca; si el software no se la pasa, no existe**.

---

# 10–30 min — Los Tres Horizontes de Estado y Memoria

### Concepto clave
Explica que mezclar variables del bucle con hechos del cliente es una pésima práctica de ingeniería:

1. **ExecutionState (Efímero / Intra-run):**
   - Variables de runtime que salen de alcance al terminar la función: `run_id`, `session_id`, `subject_id`, `messages`, `iteration`, `last_observation`, `termination_reason`.
   - `session_id` y `subject_id` forman parte del contexto de ejecución, pero no hacen persistente a `ExecutionState`. Si ningún otro objeto conserva una referencia, queda elegible para liberación/recolección.
2. **SessionMemory (Conversacional / Inter-turn):**
   - Contexto del hilo de chat activo (`session_id`). Permite al usuario decir "y envíalo" refiriéndose a la orden del turno anterior.
3. **PersistentMemory (Duradera / Inter-session):**
   - Hechos verificados, preferencias y perfiles asociados a un `subject_id` (usuario u organización).

### Experiencia interactiva: `exp-execution-state-inspector`
Pide a los alumnos que abran la experiencia en CASE Academy:
- Ver cómo el inspector muestra en tiempo real cómo cambia `ExecutionState` mientras el agente itera.
- Demostrar que el `ExecutionState` nunca se persiste directamente en base de datos; solo se extraen de él los hechos necesarios.

---

# 30–50 min — Context Window vs Memory Store

### Concepto clave
Derrumba el mito común: *"Los modelos ahora tienen 1 millón de tokens de contexto, así que guardemos todo el chat history y pasémoslo siempre."*

Puntos a enfatizar:
1. **Costo financiero:** 1 millón de tokens de entrada en cada turno multiplica el costo por 100x.
2. **Latencia:** Procesar ventanas gigantescas añade segundos de delay por inferencia.
3. **Atención diluida ("Lost in the middle"):** El modelo pierde precisión al recuperar detalles sepultados en miles de mensajes irrelevantes.
4. **Costo de la memoria recuperada:** Recordar no es gratis: inyectar hechos al prompt también consume tokens. Por eso el crecimiento debe ser **acotado, controlado y predecible**, no plano ni desbordado.
5. **Simulación didáctica:** Enfatizar que las cifras del simulador son valores ilustrativos para visualizar órdenes de magnitud; el consumo real depende del tokenizer, modelo, system prompt, schemas de herramientas y recuerdos recuperados.

### Experiencia interactiva: `exp-context-vs-memory`
- Manipula el deslizador de turnos conversacionales (Turno 1 a Turno 20).
- Compara la gráfica de consumo: Estrategia A (Chat crudo) explota a miles de tokens; Estrategia B (Memory Store) se mantiene contenida en un rango acotado de 300–450 tokens.

---

# 50–70 min — Scope, Ownership y Políticas de Memoria

### El peligro de la contaminación cruzada (`subject_id`)
Presenta el caso de seguridad:
- Dos usuarios de la misma empresa están operando el agente.
- Si el `MemoryStore` guarda `"preferred_carrier": "Servientrega"` sin atarlo a `subject_id: "user_carlos"`, cuando la usuaria `user_laura` pregunte por sus envíos, el agente le impondrá Servientrega.
- **Regla de oro:** Toda lectura y escritura en `MemoryStore` debe incluir obligatoriamente el `subject_id`.

### Políticas de memoria: Qué se guarda y qué NO
No todo lo que dice el usuario debe persistirse:
- **Guardar en PersistentMemory:** Preferencias explícitas de negocio, restricciones operativas recurrentes, roles y perfiles.
- **Guardar solo en SessionMemory:** Preguntas de seguimiento, referencias a pedidos temporales ("el pedido anterior"), aclaraciones de paso.
- **PROHIBIDO PERSISTIR:** Contraseñas, API keys, tarjetas de crédito, tokens JWT, información sensible transitoria.

### Experiencia interactiva: `exp-memory-policy-matrix`
Pide a los alumnos clasificar tarjetas interactivas:
- Clasificar frases como "Mi nombre es Carlos", "Mi password temporal es...", "Usa Servientrega para mis pedidos" en sus categorías correctas (Execution / Session / Persistent / Never Store).

---

# 70–110 min — Taller Práctico: De Agent v2 a Agent v3

Los alumnos abren su repositorio local y el archivo `docs/curriculum/workshops/m05-ai-agents/taller-04-agent-v3.md`.

### Hito 1: Creación del `MemoryStore` (10 min)
Implementar una clase limpia con métodos:
- `search(subject_id: str, query: str = None) -> list[MemoryItem]`
- `save(item: MemoryItem) -> None`
- Filtrado estricto por `subject_id` para evitar fugas entre usuarios.

### Hito 2: Ciclo `hydrate()` y `write_back()` en `run_agent_v3()` (15 min)
Modificar el runtime de L03:
1. Al inicio, invocar `hydrate()` para inyectar hechos en el prompt del sistema.
2. Ejecutar el bucle de L03 con su `ExecutionState` local.
3. Al finalizar con éxito, invocar `write_back()` bajo la `MemoryPolicy`.

### Hito 3: Validación de Casos F1 y F2 (15 min)
- **Caso F1:** Continuidad en la misma sesión (reconocimiento del pedido del turno 1 en el turno 2).
- **Caso F2:** Persistencia entre sesiones y validación de aislamiento entre `user_carlos` y `user_laura` (comprobando la frontera primaria de memoria con `search()` evaluando `m.subject_id` y `str(m.value)`, además de `hydrate_context()`).
- Asegurar que los Casos previos (A, B, C, D, E) siguen ejecutándose sin errores (no-regresión).

---

# 110–120 min — Cierre Pedagógico y Puente a L05

### Discusión sobre librerías del ecosistema (Mem0 / Zep)
Pregunta al grupo:
> *"Si una librería como Mem0 les ofrece 'memoria en 2 líneas de código', ¿qué riesgos detectan ahora que conocen cómo funciona por dentro?"*

Puntos clave a fijar:
- Dependencia de llamadas adicionales a LLMs para extracción de entidades (más costo y latencia).
- Riesgo de alucinaciones en los hechos guardados si no hay validación determinista de software.
- Complejidad en el aislamiento multitenant si no se configuran bien los `subject_id` y namespaces.

### Puente hacia L05: Planning
Lanza la pregunta de transición:
> *"Agent v3 ya sabe razonar con herramientas, iterar en bucle y recordar quiénes somos. Pero supongan que el usuario pide: 'Verifica los 10 clientes con pagos vencidos, calcula sus intereses de mora, genera un reporte consolidado y notifica a cobranzas'. Si el agente solo itera paso a paso sin un mapa previo, ¿cómo sabe si va por buen camino o si olvidó la mitad del proceso?"*

Concluye:
> **"Para coordinar tareas complejas de múltiples etapas necesitamos un plan explícito. En la Lección 05 construiremos Planning: descomposición de objetivos, grafos de ejecución y replanificación dinámica."**
