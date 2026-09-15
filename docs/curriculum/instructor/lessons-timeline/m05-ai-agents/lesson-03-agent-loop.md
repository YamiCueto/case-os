# M05-L03 — El Agent Loop y la Evolución a Agent v2

## Guía timeline para impartir la Lección 03

**Duración de referencia:** 2 horas
**Modalidad:** CASE Academy + editor/terminal de Python.
**Meta de la sesión:** que el grupo comprenda el Agent Loop como un ciclo de control gobernado por el software y evolucione su **Agent v1** de L02 hacia un **Agent v2** capaz de resolver flujos multi-step dependientes con límites estrictos de terminación.

---

## La idea central que deben llevarse

> L02 enseñó a un modelo a pedir una acción. L03 enseña al runtime a continuar tomando decisiones después de observar el resultado de esa acción. El modelo propone la siguiente acción o una respuesta final, pero el runtime en software es el soberano que controla el ciclo y decide si continúa procesando.

El estudiante debe comprender con claridad que el modelo no "queda corriendo", sino que cada vuelta es una inferencia HTTP independiente:

```text
MODEL
  ↓
¿ToolCall?
  ├─ sí → VALIDATE → EXECUTE → OBSERVATION → MODEL otra vez
  └─ no → FINAL ANSWER → FIN
```

---

## Continuidad con L01 y L02

Abre con el mapa del agente proyectado en CASE Academy:

```text
Decision ✓ → Tools ✓ → Loop ● → State / Memory ○ → Guardrails ○
```

Di:

> “En L01 aprendimos cuándo delegar una decisión al modelo. En L02 aprendimos cómo conectar herramientas para que el modelo pida acciones externas. Pero nuestro Agent v1 tenía una limitación silenciosa: solo sabía dar un salto. Hoy no creamos un proyecto nuevo: tomamos el Agent v1 que ya construyeron y lo evolucionamos a Agent v2 agregando el Agent Loop.”

---

## Dos ritmos posibles para impartir L03

La guía oficial del taller estipula entre 60 y 75 minutos de trabajo práctico. Para asegurar una conducción docente realista, considera estas dos modalidades de impartición:

### Opción A — Sesión única intensiva (~120 min)

Diseñada para grupos que ya tienen su Agent v1 de L02 funcionando y listo en su entorno virtual:

- **0–10 min:** Apertura y mapa del agente (recap de Tools y Agent v1).
- **10–30 min:** El problema detonante: Por qué se detiene Agent v1 (experiencia: `why-agent-v1-stops`).
- **30–55 min:** El concepto central: Agent Loop y runtime soberano (experiencia: `agent-loop-inspector`).
- **55–75 min:** Condiciones de parada y soberanía del software (experiencia: `stop-conditions`).
- **75–115 min (40 min):** Taller práctico: De Agent v1 a Agent v2 en grupos de estudio.
- **115–120 min (5 min):** Reflexión final, acumulación en memoria de ejecución y puente hacia L04 State & Memory.

*Nota:* En esta modalidad intensiva, los grupos enfocan su tiempo de código en reemplazar `run_agent_v1()` por `run_agent_v2()`, implementar el ciclo `while`, verificar que los Casos A, B y C sigan pasando y ejecutar el nuevo Caso D multi-step.

### Opción B — Sesión desdoblada (Recomendada si los grupos requieren afinar su dominio)

Si los grupos necesitan soporte depurando su Agent v1 o diseñando su Caso D:

- **Sesión 1 (Fundamentos y diagnóstico del fallo):** Apertura, análisis del límite de Agent v1 con el caso de dos pasos (`ORD-4091`), experiencia `why-agent-v1-stops`, modelo mental del Agent Loop (`agent-loop-inspector`), condiciones de parada (`stop-conditions`), y diseño en papel del Caso D dependiente para su dominio.
- **Sesión 2 (Construcción, migración y pruebas):** Programación activa de `run_agent_v2()`, integración de `max_iterations`, actualización de `MockModelProvider v2`, ejecución de pruebas A, B, C y D en consola, instrumentación por iteración y cierre pedagógico hacia L04.

---

# Cronograma (Referencia para Sesión Única — Opción A)

| Tiempo | Sección visible en CASE Academy | Objetivo real |
|---|---|---|
| 0–10 min | Apertura + mapa del agente | Conectar L01/L02 con L03 y activar el nodo Loop. |
| 10–30 min | 01. Por qué Agent v1 se detiene | Mostrar el fallo ante 2 pasos dependientes: el runtime no sabe continuar. |
| 30–55 min | 02. El Ciclo de Control: Agent Loop | Rastrear el bucle iterativo y desmitificar que el LLM quede corriendo. |
| 55–75 min | 03. Condiciones de Parada | Explicar las 3 formas de terminación: Final Answer, Max Iterations y Error. |
| 75–115 min | 04. Taller práctico: Agent v1 → Agent v2 | Migración en código Python en grupos de estudio y prueba del Caso D multi-step. |
| 115–120 min | Cierre y puente hacia L04 | Descubrir la limitación de la memoria efímera de ejecución y anticipar State & Memory. |

---

# 0–10 min — Apertura: El Modelo No Queda Corriendo

## Pregunta inicial

> “En la clase pasada, su Agent v1 ejecutó una consulta y nos dio una respuesta usando una tool. Si ahora le pedimos una tarea que requiere consultar el estado de un pedido y, según lo que devuelva, consultar qué transportadora tiene asignada... ¿cuántas llamadas a la API del modelo ocurren?”

Escucha respuestas como “una llamada”, “el modelo hace todo adentro” o “dos llamadas”. Úsalas para abrir el código.

## Qué explicar con tus propias palabras

> “Muchos desarrolladores creen que cuando un agente trabaja, el modelo de lenguaje 'se queda pensando y dando vueltas en bucle'. Eso es falso. Un LLM es una función matemática sin memoria expuesta a través de una llamada HTTP. Cada vez que el agente toma una decisión, nuestro software hace una llamada HTTP completa, recibe un JSON, ejecuta código en la CPU y decide si vuelve a llamar al modelo. El bucle existe en nuestro código, no en la IA.”

## Proyección en CASE OS
Abre `/#/academy/modules/m05-ai-agents/lesson-03-agent-loop` y muestra el componente `AgentBuildingMap` con el nodo **Loop** activo.

---

# 10–30 min — El Problema Detonante: Por Qué Agent v1 se Detiene

## El Escenario Concreto
Escribe o proyecta en pantalla la consulta:

> **"Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada."**

Muestra las dos herramientas necesarias:
1. `get_order_status(order_id)`
2. `get_shipping_provider(order_id)`

## El Diagnóstico en Vivo
Rastrea la ejecución en el pizarrón o pantalla:
1. Turno 1: Usuario pregunta.
2. Modelo responde: `ToolCall(name="get_order_status", arguments={"order_id": "ORD-4091"})`.
3. Python ejecuta y obtiene: `{"status": "ready_to_ship"}`.
4. Python inyecta la observación con `role: "tool"`.
5. Segunda inferencia al modelo.
6. El modelo lee `"ready_to_ship"` y emite con perfecta lógica:
   `ToolCall(name="get_shipping_provider", arguments={"order_id": "ORD-4091"})`.
7. **Y aquí el código de Agent v1 termina.**

## Pregunta detonante para el grupo
> “¿Falló el modelo de lenguaje en esta solicitud?”

*Respuesta esperada de los alumnos:* No, el modelo propuso exactamente la herramienta correcta que se necesitaba a continuación.

> “¿Entonces por qué el usuario no recibió la información de la transportadora?”

## Explicación técnica para resolver dudas
> “Porque en L02 programamos nuestro runtime de forma puramente lineal:
>
> ```python
> second_response = provider.generate(messages=messages, tools=TOOLS_SCHEMAS)
> return second_response.content or ""
> ```
>
> Nuestro software asumía que la segunda respuesta siempre contendría texto final en `content`. Cuando el modelo devolvió otro `tool_calls`, `second_response.content` era nulo. El modelo no falló: nuestro software no sabía continuar.”

## Experiencia en CASE OS
Proyecta la **Experiencia 1: `why-agent-v1-stops`**.
Pide a los estudiantes que seleccionen individualmente en sus pantallas la causa raíz del fallo. Refuerza que la opción correcta es **D: El runtime dejó de procesar decisiones**.

---

# 30–55 min — El Concepto Central: Agent Loop y Runtime Soberano

## El Ciclo de Control
Muestra el diagrama canónico del Agent Loop:

```text
Decision → Action → Observation → Next Decision → ...
```

Desglosa las 4 fases fundamentales:
1. **Decision (Modelo):** El LLM evalúa el contexto actual y propone una acción o una respuesta final.
2. **Action (Runtime):** Python valida los argumentos contra el Tool Schema y ejecuta la función real en CPU.
3. **Observation (Runtime):** Python captura el resultado y lo empaqueta como mensaje de rol `tool`.
4. **Next Decision (Modelo):** Python envía el historial enriquecido en una nueva inferencia HTTP.

## Pregunta de Arquitectura
> “¿Quién decide si el bucle continúa: el modelo o nuestro código?”

Di con énfasis:
> “El modelo emite una propuesta: si solicita herramientas (`tool_calls`), propone continuar trabajando; si emite texto directo, propone que terminó. Pero **nuestro código es el soberano absoluto**. Nuestro software decide si la propuesta es válida, si hay presupuesto disponible, si se alcanzó el límite de iteraciones y si autoriza la siguiente inferencia.”

## Experiencia en CASE OS
Proyecta la **Experiencia 2: `agent-loop-inspector`**.
Recorre paso por paso las 3 iteraciones del caso `ORD-4091`:
- Muestra cómo crece la lista `messages` con cada vuelta.
- Enseña la diferencia entre el mensaje con `tool_calls` generado por el asistente y el mensaje con `role: "tool"` inyectado por Python con su `tool_call_id`.
- Señala el momento exacto en que `finish_reason` cambia a `"stop"` y el agente genera la respuesta final sintetizada.

---

# 55–75 min — Condiciones de Parada y Soberanía del Software

## Las 3 Salidas Obligatorias de un Runtime Robusto
Explica las tres formas en que un loop de agente puede y debe terminar:

1. **Final Answer (Terminación normal):**
   El modelo no solicita tools; emite texto de respuesta al usuario.
2. **Max Iterations (Terminación controlada por el runtime):**
   Se alcanza el número máximo de vueltas permitidas (ej. `max_iterations = 5`).
3. **Error de Ejecución (Manejo explícito de excepciones):**
   Fallo en backend, timeout o respuesta malformada capturada por el software.

## Pregunta provocadora
> “Si el modelo es tan inteligente, ¿por qué no dejamos que el modelo decida cuándo detenerse y listo?”

## La trampa de los bucles infinitos
> “Imagina que una API externa está caída y devuelve siempre `{"error": "503 Service Unavailable"}`. Un modelo probabilístico puede interpretar: *'Vaya, la API falló, voy a reintentar a ver si responde'*. Y en la siguiente iteración vuelve a pedir la misma herramienta. Sin un `max_iterations` impuesto por software, el agente se quedará en un bucle infinito que quemará 50 dólares de saldo en dos minutos. Los límites operacionales de software NUNCA se delegan al modelo.”

## Experiencia en CASE OS
Proyecta la **Experiencia 3: `stop-conditions`**.
- Demuestra interactivamente el caso de `max_iterations = 1` vs `max_iterations = 3`.
- Muestra el escenario de fallo repetido y cómo el corte determinista en software protege la estabilidad y el costo del sistema.

---

# 75–115 min — Taller Práctico: De Agent v1 a Agent v2

## Indicación inicial para los grupos de estudio
> “Abran su carpeta del taller de L02. **No creen un archivo nuevo desde cero.** Hoy evolucionamos su propio Agent v1 a Agent v2.”

## Checklist de Migración en Pantalla
Muestra el checklist en el proyector:

```text
NO TOQUES ESTO:
  ✓ Dominio y datos en memoria de tu grupo
  ✓ Funciones existentes en Python
  ✓ Tool Schemas en JSON Schema
  ✓ TOOL_REGISTRY y execute_tool_call()
  ✓ Pruebas A, B y C de L02 (deben seguir pasando)

AGREGA EN L03:
  1. Duplica run_agent_v1() como run_agent_v2()
  2. Implementa el while iteration < max_iterations:
  3. Evalúa si hay tool_calls -> ejecuta, añade observation y repite
  4. Si no hay tool_calls -> retorna final answer
  5. Si alcanza max_iterations -> retorna aborto controlado
  6. Agrega instrumentación en consola ([ITERATION X])
  7. Agrega el Caso D: consulta multi-step de 2 pasos dependientes
```

## Conducción del Taller por Hitos

### Hito 1: Implementación del Loop Mínimo (15 min)
Los grupos reemplazan la segunda inferencia terminal por la estructura `while`.
Verifican que el código compile y que los casos anteriores (A: Tool 1, B: Tool 2, C: Sin tools) sigan funcionando idénticamente.

### Hito 2: MockModelProvider v2 y Transiciones del Protocolo (10 min)
Para los grupos en Modo A (sin API keys), explican cómo `MockModelProvider v2` simula el encadenamiento basándose en las observaciones presentes en `messages`.

### Hito 3: Diseño y Ejecución del Caso D Multi-Step (15 min)
Cada grupo adapta el Caso D a su propio dominio de negocio.
- *Dominio médico:* Consultar paciente → ver alergias → según alergia, consultar contraindicación de medicamento.
- *Dominio bancario:* Consultar saldo → verificar si alcanza para transferencia → autorizar transacción.
- *Dominio e-commerce:* Consultar estado de orden → si lista para despacho, consultar transportadora.

## Monitoreo en sala: Errores comunes a detectar
1. **Olvidar anexar el mensaje del asistente con los `tool_calls`:**
   Si solo anexan el mensaje con `role: "tool"`, muchas APIs (y nuestro protocolo estándar) darán error porque cada mensaje de herramienta debe estar precedido por el mensaje del asistente que la solicitó con su respectivo `id`.
2. **No incrementar el contador de iteraciones:**
   Riesgo de bucle infinito si la condición del `while` no avanza.
3. **Pérdida de historial:**
   Reinicializar `messages` dentro del bucle en lugar de acumular.

---

# 115–120 min — Cierre y Puente Pedagógico hacia L04

## La Pregunta Final de la Clase
Reúne la atención de todos los grupos y haz la siguiente pregunta:

> “Miren su terminal. Su Agent v2 acaba de completar con éxito una meta de dos pasos. Pero miren su variable `messages`:
>
> ```python
> messages = [user_query, tool_1, obs_1, tool_2, obs_2, final_answer]
> ```
>
> Si el usuario ahora escribe: *'¿Y cuándo llega?'*, ¿qué pasa si ejecutamos `run_agent_v2()` otra vez?
> ¿El agente sabe de qué pedido estamos hablando?
> Y si apagamos el servidor y volvemos mañana, ¿dónde quedaron esos datos?”

## Conclusión Pedagógica
> “Hoy construimos el bucle de ejecución: la capacidad de razonar y actuar en múltiples turnos dentro de una misma llamada. Pero nuestro agente todavía tiene amnesia entre ejecuciones. En la próxima clase, **L04 — State & Memory**, aprenderemos qué parte de este historial debe persistir, cómo estructurar la memoria del agente y cómo evitar que nuestro contexto colapse por acumular demasiados mensajes.”

---

## Checklist Docente antes de Salir del Aula

- [ ] Todos los grupos verificaron que el fallo de Agent v1 ocurrió en el runtime, no en el modelo.
- [ ] Los estudiantes pueden recitar las 3 formas de terminación: Final Answer, Max Iterations y Error.
- [ ] Los grupos conservaron sus tools y schemas de L02 sin empezar un proyecto nuevo.
- [ ] La consola de Python muestra la instrumentación limpia por iteración (`[ITERATION 1]`, `[ITERATION 2]`).
- [ ] Los casos A, B y C de L02 siguen pasando en Agent v2.
- [ ] Se probó exitosamente el Caso D multi-step dependiente.
- [ ] Quedó sembrada la necesidad de State & Memory para L04.
