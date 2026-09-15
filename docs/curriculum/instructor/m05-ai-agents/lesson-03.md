# Guía Docente: M05 L03 — El Agent Loop y la Evolución a Agent v2

Esta guía es el guion pedagógico completo para conducir la sesión de M05 L03. Está diseñada para que el docente pueda abrir este documento en paralelo con la plataforma CASE OS y el editor de código, guiando a los estudiantes paso a paso desde el descubrimiento de la limitación de **Agent v1** hasta la evolución acumulativa a **Agent v2**.

---

## Principio Pedagógico de la Lección

> **"L02 enseñó a un modelo a pedir una acción. L03 enseña al runtime a continuar tomando decisiones después de observar el resultado de esa acción."**

La progresión de M05 es estrictamente acumulativa:

```text
L01
Decision / Autonomy
  ↓
L02
Tools / Agent v1
  ↓
L03
Agent Loop / Agent v2
  ↓
L04
State & Memory (Futuro)
  ↓
L05
Guardrails (Futuro)
```

**Reglas pedagógicas inviolables:**
1. **No presentar L03 como una clase independiente ni como un proyecto nuevo.** L03 es la evolución directa del código construido en L02.
2. **No empezar enseñando "bucles while".** Primero hacemos visible la falla estructural de Agent v1 ante un problema dependiente.
3. **No usar frameworks opacos.** No introduzcas LangChain, LangGraph, MCP, multi-agent ni abstracciones que oculten las llamadas HTTP.
4. **No avanzar State/Memory de L04 ni Guardrails de L05** más allá de las referencias mínimas requeridas por el runtime loop.

---

## Estructura y Ritmo de la Sesión

- **00. Apertura:** Ubicación en el mapa del agente (5 min).
- **01. El Problema Detonante:** Por qué Agent v1 se detiene (20 min).
- **02. El Concepto Central:** Agent Loop mental model y runtime soberano (25 min).
- **03. Condiciones de Parada y Control del Software:** Terminación normal vs controlada (20 min).
- **04. Taller práctico:** De Agent v1 a Agent v2 en grupos de estudio (60–75 min).
- **05. Cierre y Puente Pedagógico:** Hacia L04 State & Memory (5 min).

---

## 00. Apertura: Ubicación en el Mapa del Agente

### Objetivo Pedagógico
Establecer la continuidad pedagógica con L01 y L02. El alumno debe entender que en L01 aprendió cuándo delegar una decisión y en L02 cómo estructurar la solicitud y ejecución de una tool. En L03 agregará el bucle de realimentación para que el agente encadene múltiples decisiones dependientes.

### Qué explicar con tus propias palabras
> "En L02 logramos algo crucial: nuestro modelo aprendió a solicitar una herramienta estructurada y nuestro software en Python aprendió a ejecutarla y devolverle la respuesta. Nuestro Agent v1 funciona. Pero hoy descubriremos que Agent v1 tiene un límite infranqueable: es estrictamente de un solo turno de herramientas. Si una meta requiere dos pasos donde el segundo depende de lo que descubrió el primero, Agent v1 se detiene a mitad de camino. Hoy no crearemos un agente nuevo; tomaremos nuestro Agent v1 y lo evolucionaremos a Agent v2 mediante el Agent Loop."

### Qué elemento de CASE OS mostrar
Proyecta en pantalla el componente `AgentBuildingMap` al inicio de la lección en `/#/academy/modules/m05-ai-agents/lesson-03-agent-loop`.

### Qué interacción ejecutar
Señala los nodos **Decision** y **Tools** (marcados en verde como superados en L01 y L02) y el nodo **Loop** (resaltado como la capacidad activa de L03). Haz notar que **State** y **Guardrails** permanecen atenuados como etapas futuras.

---

## 01. El Problema Detonante: Por Qué Agent v1 se Detiene

### Objetivo Pedagógico
Hacer visible el límite estructural de Agent v1 mediante un caso concreto de dos pasos dependientes. El estudiante debe descubrir que el modelo no falló: el runtime falló porque solo esperaba una respuesta final tras la primera tool.

### Caso Concreto Detonante
Presenta la siguiente solicitud de usuario en pantalla:

> **"Consulta el estado del pedido ORD-4091 y, si está listo para despacho, consulta qué transportadora tiene asignada."**

Herramientas disponibles en el sistema:
1. `get_order_status(order_id: str)`: Devuelve el estado actual (`"ready_to_ship"`, `"processing"`, etc.).
2. `get_shipping_provider(order_id: str)`: Devuelve la transportadora asignada y guía de rastreo.

### Flujo Operacional en Agent v1
1. **User:** Envía la consulta compuesta.
2. **Model (Inferencia 1):** Propone `ToolCall: get_order_status(order_id="ORD-4091")`.
3. **Python:** Ejecuta `get_order_status` y obtiene `{"status": "ready_to_ship"}`.
4. **Python:** Inyecta el resultado como mensaje de rol `tool` y realiza la segunda inferencia.
5. **Model (Inferencia 2):** Lee la observación `"ready_to_ship"`, deduce que debe averiguar la transportadora y emite:
   `ToolCall: get_shipping_provider(order_id="ORD-4091")`.
6. **Y aquí se detiene Agent v1.**

### Por qué colapsa el runtime
En el código de `run_agent_v1()` de L02 teníamos:

```python
second_response = provider.generate(messages=messages, tools=TOOLS_SCHEMAS)
return second_response.content or ""
```

Agent v1 asumió ingenuamente que la segunda llamada al modelo siempre produciría un texto final en lenguaje natural (`second_response.content`). Pero cuando el modelo emite otro `ToolCall`, `second_response.content` es `None` o vacío, y la función no tiene código para capturar una segunda tool, ejecutarla ni volver a llamar al modelo.

> **Punto clave para el instructor:** El modelo no falló. El modelo actuó con perfecta precisión al pedir la segunda herramienta. **El software falló porque el runtime no sabe continuar.**

### Experiencia Interactiva en CASE OS
Proyecta la **Experiencia 1: `why-agent-v1-stops`** (Por qué se detiene Agent v1).
1. Muestra la traza visual con la interrupción en el segundo llamado.
2. Haz la pregunta detonante interactiva:
   *¿Dónde está el problema?*
   - A. Tool A falló
   - B. El modelo no sabe usar tools
   - C. Falta un schema
   - **D. El runtime dejó de procesar decisiones (Correcta)**
3. Conduce la discusión hacia la conclusión: la arquitectura lineal de dos saltos de L02 debe reemplazarse por un ciclo dinámico gobernado por el software.

---

## 02. El Concepto Central: Agent Loop y Runtime Soberano

### Objetivo Pedagógico
Establecer el modelo mental del **Agent Loop**: un bucle de control en software donde el modelo propone el siguiente paso y el runtime ejecuta la acción, acumula la observación y decide si se requiere otra iteración.

### El Modelo Mental Observable

```text
       ┌───────────────────────────────┐
       │     ENTRADA DEL USUARIO       │
       └──────────────┬────────────────┘
                      ▼
             ┌────────────────┐
        ┌───►│  MODEL (LLM)   │◄───┐
        │    └────────┬───────┘    │
        │             │            │
        │             ▼            │
        │       ¿Pide Tool?        │
        │      /           \       │
   (SÍ) │     /             \      │ (NO: finish_reason="stop")
        ▼    ▼               ▼     │
  ┌────────────────┐   ┌────────────────────────┐
  │ VALIDAR SCHEMA │   │     FINAL ANSWER       │
  └───────┬────────┘   └───────────┬────────────┘
          ▼                        │
  ┌────────────────┐               │
  │ EXECUTE PYTHON │               ▼
  └───────┬────────┘              FIN
          ▼
  ┌────────────────┐
  │  OBSERVATION   │
  │  (role: tool)  │
  └───────┬────────┘
          │
          └────────────────────────┘
            Nueva inferencia HTTP
```

### Pregunta Crucial para la Clase
> **"¿Quién decide si todavía queda trabajo por hacer?"**

**Respuesta técnica precisa:**
- El **modelo** propone la siguiente acción (`finish_reason="tool_calls"`) o una respuesta final (`finish_reason="stop"`).
- Pero el **runtime (nuestro código Python)** es el soberano absoluto: inspecciona la respuesta del modelo, decide si la solicitud es válida, ejecuta la función, acumula los mensajes y comanda la siguiente inferencia.

### Desmitificación Crítica: El Modelo NO queda corriendo
Enfatiza con rigor:
> "Nunca digan que el modelo 'queda corriendo en un bucle'. Un LLM es una función matemática sin estado expuesta tras una API HTTP. Cada iteración del bucle es una llamada HTTP independiente y completa:
>
> - **Iteración 1:** Llamada HTTP #1 → Modelo devuelve Tool A → Python ejecuta Tool A.
> - **Iteración 2:** Llamada HTTP #2 (con historial ampliado) → Modelo devuelve Tool B → Python ejecuta Tool B.
> - **Iteración 3:** Llamada HTTP #3 (con ambas observaciones) → Modelo devuelve texto final.
>
> El bucle reside 100% en la CPU de tu máquina, no en los servidores de la IA."

### Experiencia Interactiva en CASE OS
Proyecta la **Experiencia 2: `agent-loop-inspector`** (Inspector del Agent Loop).
1. Recorre la ejecución de la consulta de dos pasos (`ORD-4091`) paso por paso:
   - **Iteración 1:** LLM propone `get_order_status`, Python ejecuta, obtiene `"ready_to_ship"`.
   - **Iteración 2:** Python envía el historial acumulado. El LLM lee el estado y propone `get_shipping_provider`. Python ejecuta y obtiene transportadora `"Servientrega"` y guía `"SE-9921"`.
   - **Iteración 3:** Python envía el historial con ambas observaciones. El LLM responde con texto final sin pedir tools (`finish_reason="stop"`).
2. Muestra cómo el acumulador `messages` crece en cada iteración:
   `[user_query, assistant_tool_1, tool_result_1, assistant_tool_2, tool_result_2]`.

---

## 03. Condiciones de Parada y Control del Software

### Objetivo Pedagógico
Comprender que todo bucle en ingeniería de software debe poseer condiciones de terminación deterministas. En L03 enseñamos las 3 formas canónicas de salida del runtime.

### Las 3 Formas Canónicas de Terminación

| Condición | Origen | Comportamiento del Runtime |
|---|---|---|
| **1. Final Answer** | Modelo (`finish_reason="stop"`) | El modelo concluye que tiene información suficiente y emite texto en lenguaje natural. El loop retorna exitosamente. |
| **2. Max Iterations** | Runtime (Límite operacional en CPU) | El loop alcanza el contador máximo (ej. `max_iterations = 5`). El runtime aborta inmediatamente para prevenir costos y bucles infinitos. |
| **3. Error de Ejecución** | Runtime (Fallo no recuperable o excepción) | Captura de error de red, contrato inválido o timeout. El runtime maneja la salida controlada. |

### La Regla de Oro de Terminación
> **"Nunca ejecutes un Agent Loop sin `max_iterations`."**

Explica:
> "Si una herramienta devuelve un error persistente (ej. base de datos caída), un modelo ingenuo puede solicitar la misma herramienta una y otra vez creyendo que 'esta vez sí funcionará'. Si el software no impone un límite superior de vueltas, la aplicación consumirá tu presupuesto de API en minutos. El límite pertenece al software, no al modelo."

*Nota docente:* Mantén este concepto como la **condición mínima de terminación del runtime**. No te extiendas a Guardrails avanzados (circuit breakers, rate limiting o filtros semánticos), ya que eso es el foco de L05.

### Experiencia Interactiva en CASE OS
Proyecta la **Experiencia 3: `stop-conditions`** (Condiciones de Parada).
1. Modifica interactivamente el selector de `max_iterations` entre 1, 2, 3 y 5.
2. Ejecuta la tarea de dos pasos con `max_iterations = 1` y observa cómo el sistema aborta de forma segura reportando `Stopped: iteration limit reached`.
3. Ejecuta la tarea con `max_iterations = 3` y observa cómo alcanza `Final Answer`.
4. Ejecuta el escenario de herramienta en fallo repetido y demuestra cómo `max_iterations` salva al sistema de un bucle infinito.

---

## 04. De Agent v1 a Agent v2: Evolución Técnica y Taller Práctico

### Mensaje Central para los Grupos de Estudio
> **"No crees un agente nuevo. Toma el proyecto que construiste en L02 y evoluciónalo."**

### Qué se Conserva vs. Qué se Agrega

```text
┌────────────────────────────────────────────────────────┐
│                      AGENT V1                          │
│                                                        │
│  ModelProvider                ✅ SE CONSERVA           │
│  MockModelProvider            ✅ SE CONSERVA (v2)      │
│  OpenAICompatibleProvider     ✅ SE CONSERVA           │
│  Herramientas del grupo       ✅ SE CONSERVAN          │
│  Tool Schemas                 ✅ SE CONSERVAN          │
│  TOOL_REGISTRY                ✅ SE CONSERVA           │
│  execute_tool_call()          ✅ SE CONSERVA           │
│  messages (acumulador)        ✅ SE CONSERVA           │
│                                                        │
│  run_agent_v1()               🔄 EVOLUCIONA            │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                      AGENT V2                          │
│                                                        │
│  Agent Loop (while iterativo) 🆕 NUEVO                 │
│  max_iterations (límite duro) 🆕 NUEVO                 │
│  Instrumentación de iteración 🆕 NUEVO                 │
│  Caso D (2 pasos dependientes)🆕 NUEVO                 │
│  run_agent_v2()               🆕 NUEVO                 │
└────────────────────────────────────────────────────────┘
```

### Guía Práctica de Migración: Checklist para el Estudiante

#### No cambies esto todavía
- Tu **dominio de negocio** elegido en L02.
- Tus **herramientas existentes** en Python.
- Tus **Tool Schemas** en JSON Schema.
- Tu **TOOL_REGISTRY** y despachador `execute_tool_call`.
- Tus pruebas unitarias de L02: **Caso A** (Tool 1), **Caso B** (Tool 2) y **Caso C** (sin tools). Todas deben seguir pasando en Agent v2.

#### Agrega en L03
1. **Duplicar o renombrar la función:** Conserva `run_agent_v1` como referencia histórica y crea `run_agent_v2(user_query: str, provider: ModelProvider, max_iterations: int = 5) -> str`.
2. **Sustituir la estructura lineal por un bucle iterativo:**
   Reemplaza la segunda inferencia fija por un ciclo `while iterations < max_iterations:`.
3. **Evaluar en cada ciclo la respuesta del modelo:**
   - Si `response.tool_calls` está presente: ejecutar cada tool solicitada, anexar la observación con `role: "tool"` y volver a iterar.
   - Si no hay tool calls: imprimir la respuesta final y retornar `response.content`.
4. **Instrumentar cada iteración en consola:**
   Imprimir `[ITERATION X]`, `MODEL`, `ARGUMENTS`, `EXECUTION`, `OBSERVATION`.
5. **Incorporar el Caso D (Multi-step dependiente):**
   Diseñar una consulta en el dominio del grupo que requiera obligatoriamente el encadenamiento de dos herramientas.

### El Scaffolding Conceptual del Loop

```python
def run_agent_v2(user_query: str, provider: ModelProvider, max_iterations: int = 5) -> str:
    messages: List[Dict[str, Any]] = [{"role": "user", "content": user_query}]
    iteration = 0

    while iteration < max_iterations:
        iteration += 1
        print(f"\n{'='*20} [ITERATION {iteration}] {'='*20}")

        # Inferencia actual
        response = provider.generate(messages=messages, tools=TOOLS_SCHEMAS)

        # Condición 1: Final Answer (terminación normal)
        if not response.tool_calls:
            print(f"[FINAL ANSWER]\n{response.content}\n")
            return response.content or ""

        # Procesar herramientas solicitadas
        for tool_call in response.tool_calls:
            print(f"[MODEL PROPOSAL] Tool: {tool_call.name}")
            print(f"[ARGUMENTS] {json.dumps(tool_call.arguments)}")

            # Ejecución en CPU
            result = execute_tool_call(tool_call)
            print(f"[OBSERVATION] {json.dumps(result)}")

            # Acumulación de evidencia en messages
            messages.append({
                "role": "assistant",
                "content": None,
                "tool_calls": [{
                    "id": tool_call.id,
                    "type": "function",
                    "function": {
                        "name": tool_call.name,
                        "arguments": json.dumps(tool_call.arguments)
                    }
                }]
            })
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": tool_call.name,
                "content": json.dumps(result)
            })

    # Condición 2: Límite de iteraciones alcanzado
    print(f"[ABORTED] Se alcanzo el limite maximo de iteraciones ({max_iterations}).")
    return f"Error: No se pudo completar la tarea tras {max_iterations} iteraciones."
```

### MockModelProvider v2: Simulación Determinista del Protocolo
Explica a los estudiantes que usan el Modo A (sin API keys):
> "En L02, `MockModelProvider` respondía con una regla simple o por número de llamada. En L03, `MockModelProvider v2` simula deterministicamente las transiciones del protocolo basándose en el historial de `messages` y en la última observación recibida. Si ve que la última observación es `status: ready_to_ship`, emite la propuesta para `get_shipping_provider`. Si ve que la observación de la transportadora ya está en el historial, emite la respuesta final. No razona semánticamente; simula de forma predecible el contrato para que podamos validar la arquitectura de nuestro software."

---

## 05. Cierre y Puente Pedagógico hacia L04

### La Pregunta que Deja Abierta L03
Reúne al grupo al finalizar el taller y plantea la siguiente reflexión:

> "Hoy logramos que nuestro agente ejecute bucles de múltiples decisiones. Agent v2 ya puede tomar 2, 3 o 5 pasos dependientes dentro de una ejecución. Pero miren atentamente nuestro código:
>
> ```python
> messages = [user_query, tool_call_1, result_1, tool_call_2, result_2, final_answer]
> ```
>
> **¿Qué ocurre cuando la función `run_agent_v2()` termina su ejecución y el usuario hace una segunda pregunta?**
> **¿Dónde quedaron los datos del pedido que acabamos de consultar?**
> **¿Qué información pertenece exclusivamente a esta ejecución efímera y qué información debería sobrevivir entre turnos?**
> **¿Qué ocurre si el usuario cierra el programa y vuelve mañana?"**

### El Mapa hacia L04

```text
Agent v2
  ├── Decision      ✅ (L01)
  ├── Tools         ✅ (L02)
  └── Loop          ✅ (L03)

pero...

  State / Memory    ❓ (L04)
  Guardrails        ❓ (L05)
```

### Conclusión Docente
> "En L03 resolvimos el bucle de ejecución inmediata. En la siguiente clase, **L04 — State & Memory**, aprenderemos a estructurar qué estado debe conservarse en el contexto de ejecución, qué memoria debe persistir entre sesiones y cómo evitar que nuestro contexto colapse por acumulación descontrolada."

---

## Ficha de Preguntas para el Grupo

1. **"¿Por qué no conviene usar una variable global `call_count` para saber en qué paso del loop estamos?"**
   *Respuesta esperada:* Porque en un sistema real no sabemos cuántos pasos requerirá la tarea; depende dinámicamente de lo que devuelvan las herramientas. El modelo debe decidir basándose en la evidencia del historial de mensajes, no en un contador predeterminado.

2. **"Si no reenviamos las observaciones previas en cada llamada HTTP, ¿qué ocurre con el modelo?"**
   *Respuesta esperada:* El modelo es sin estado (*stateless*). Si no le reenviamos las observaciones anteriores, sufre amnesia instantánea y volverá a pedir la primera herramienta una y otra vez.

3. **"¿Cuál es la diferencia entre un bucle infinito en código tradicional y un bucle infinito en un agente de IA?"**
   *Respuesta esperada:* En código tradicional, un `while True` consume CPU local hasta que lo detienes con `Ctrl+C`. En un agente de IA, cada vuelta del bucle es una llamada a una API de pago; un bucle infinito consume dinero real a toda velocidad hasta agotar tu saldo o tu límite de tarjeta.
