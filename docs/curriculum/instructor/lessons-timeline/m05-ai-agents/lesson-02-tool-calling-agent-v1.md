# M05-L02 — Llamada de Herramientas y Agent v1

## Guía timeline para impartir la Lección 02

**Duración de referencia:** 2 horas  
**Modalidad:** CASE Academy + editor/terminal de Python.  
**Meta de la sesión:** que el grupo comprenda Tool Calling como un protocolo de comunicación estructurada y construya un Agent v1 donde el modelo propone una tool, Python controla la ejecución y el resultado regresa al modelo.

---

## La idea central que deben llevarse

> El modelo no ejecuta funciones. El modelo propone una llamada estructurada; el runtime valida y ejecuta la función real; después el resultado se envía en una nueva inferencia para que el modelo pueda responder.

El alumno debe poder rastrear este flujo sin depender de frameworks:

```text
USER
  ↓
MODEL
  ↓
TOOL SELECTED
  ↓
ARGUMENTS
  ↓
PYTHON EXECUTION
  ↓
TOOL RESULT
  ↓
MODEL RESPONSE
```

---

## Continuidad con L01

Abre con el mapa del agente:

```text
Decision ✓ → Tools ● → Loop ○ → State / Memory ○ → Guardrails ○
```

Di:

> “En L01 aprendimos cuándo vale la pena delegar una decisión al modelo. Hoy agregamos la primera capacidad operativa: Tools. Pero el modelo seguirá sin ejecutar nada por sí mismo.”

No adelantes la solución de L03. El límite de Agent v1 debe descubrirse al final de la sesión.

---

## Dos ritmos posibles para impartir L02

La guía oficial del taller estipula entre 60 y 75 minutos de trabajo activo (hasta 90 minutos con preparación de entorno desde cero). Para asegurar una conducción docente realista, considera estas dos modalidades de impartición:

### Opción A — Sesión única intensiva (~120 min)

Diseñada para grupos que ya cuentan con Python instalado y entorno preparado:

- **0–10 min:** Apertura y mapa del agente (recap de Decision).
- **10–25 min:** 01. Desmitificando Tool Calling (experiencia: `tool-anatomy`).
- **25–45 min:** 02. Tool Calling Inspector y los 7 hops (experiencia: `tool-calling-inspector`).
- **45–55 min:** 03. Frontera de Seguridad: lectura vs side effects (experiencia: `tool-boundary`).
- **55–110 min (55 min):** 04. Taller práctico Agent v1 en grupos de estudio.
- **110–120 min (10 min):** Reto de 2 pasos dependientes, límite operacional y puente hacia L03.

*Nota:* Esta modalidad requiere ejecución ágil; los grupos completan el baseline y la trazabilidad de los 7 hops en clase, dejando extensiones adicionales como trabajo posterior.

### Opción B — Sesión desdoblada (Recomendada si el grupo necesita soporte con Python)

CASE Academy permite flexibilizar las lecciones en dos sesiones sin forzar artificialmente todo en dos horas:

- **Sesión 1 (Fundamentos y arquitectura):** Apertura, Tool Anatomy, Tool Calling Inspector, Frontera de Seguridad, preparación del entorno (`python -m venv .venv`) y definición del dominio y tools por grupo de estudio.
- **Sesión 2 (Construcción y diagnóstico):** Programación activa del Agent v1, ejecución de los 3 casos (Tool 1, Tool 2, sin tool), inspección de 7 hops en consola, diagnóstico de Tool Schema, reto de 2 pasos dependientes y cierre conceptual hacia L03.

---

# Cronograma (Referencia para Sesión Única — Opción A)

| Tiempo | Sección visible en CASE Academy | Objetivo real |
|---|---|---|
| 0–10 min | Apertura + mapa del agente | Conectar Decision con Tools y romper la idea de que el LLM ejecuta acciones. |
| 10–25 min | 01. Desmitificando Tool Calling | Diferenciar función Python, Tool Schema y Tool Registry. |
| 25–45 min | 02. Tool Calling Inspector | Seguir los 7 hops y ubicar la frontera exacta entre modelo y runtime. |
| 45–55 min | 03. Frontera de Seguridad | Diferenciar lectura vs side effects y ubicar validaciones en software. |
| 55–110 min | 04. Taller práctico — Agent v1 | Construcción en grupos de estudio sobre dominio propio y trazabilidad en consola. |
| 110–120 min | Límite de Agent v1 | Formular el problema de 2 pasos dependientes que da origen a L03 Agent Loop. |

Si el grupo requiere soporte con Python o mayor tiempo para programar su dominio, opta por la **Opción B (Sesión desdoblada)**. No sacrifiques el cierre conceptual hacia L03.

---

# 0–10 min — Apertura: el modelo no tiene manos

## Pregunta inicial

> “Si un LLM necesita conocer el estado actual de un pedido, ¿cómo hace para consultar nuestra base de datos?”

Escucha respuestas como “se conecta”, “llama la API” o “consulta la BD”. Úsalas para introducir la frontera.

Di:

> “El modelo no posee nuestras credenciales, sockets ni funciones Python. Lo que puede hacer es generar una estructura que diga qué herramienta necesita y con qué argumentos. Nuestro software decide qué hacer con esa propuesta.”

## En pantalla

Muestra `AgentBuildingMap` y señala:

- **Decision:** capacidad trabajada en L01.
- **Tools:** capacidad activa en L02.
- **Loop, State, Guardrails:** todavía no implementados.

---

# 10–25 min — 01. Desmitificando Tool Calling

## Conceptos fáciles de explicar

### Función Python

> “Es código ejecutable en nuestro runtime. Puede leer una BD, llamar una API o modificar estado.”

### Tool Schema

> “Es una descripción estructurada que el modelo puede leer para entender qué capacidad existe, cuándo podría servir y qué argumentos debe generar.”

### Tool Registry

> “Es el puente controlado por software que relaciona el nombre propuesto por el modelo con una función que realmente existe.”

---

## Experiencia: Tool Anatomy

Proyecta la **Sección 01 — Desmitificando Tool Calling** (experiencia: `tool-anatomy`).

Alterna entre:

- **Tool Schema (JSON Schema)**
- **Función en Python (Runtime)**

Pregunta:

> “Si cambio solo la descripción del Tool Schema, ¿cambia el comportamiento interno de la función Python?”

Respuesta: **no**.

Después:

> “¿Puede cambiar la probabilidad de que el modelo seleccione correctamente esa herramienta?”

Respuesta: **sí**. Una descripción ambigua ofrece menos señal sobre cuándo y para qué usarla.

## Punto técnico que debe quedar claro

La descripción de una tool forma parte del contexto que guía al modelo. Es una forma de Prompt Engineering estructurado.

No presentes el Tool Schema como una frontera de seguridad. Las reglas de autorización y negocio siguen viviendo en software.

---

## Mini construcción en vivo

Escribe una función sencilla:

```python
def get_order_status(order_id: str) -> dict:
    return {
        "order_id": order_id,
        "status": "en_camino",
        "eta": "15:00"
    }
```

Luego muestra un schema mínimo:

```python
TOOL_SCHEMA = {
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": "Consulta el estado logistico de un pedido mediante su identificador.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string"
                }
            },
            "required": ["order_id"]
        }
    }
}
```

Y el registro:

```python
TOOL_REGISTRY = {
    "get_order_status": get_order_status
}
```

Pregunta:

> “¿Cuál de estas tres piezas conoce el LLM?”

Respuesta buscada: **el schema**. La función y el registry pertenecen al runtime de la aplicación.

---

# 25–45 min — 02. Tool Calling Inspector: los 7 hops

## En pantalla

Proyecta la **Sección 02 — Tool Calling Inspector** (experiencia: `tool-calling-inspector`).

Empieza con el escenario de consulta de pedido y avanza fase por fase.

| Hop | Qué remarcar |
|---|---|
| 1. USER | El usuario expresa una necesidad en lenguaje natural. |
| 2. MODEL | El modelo procesa mensajes + Tool Schemas disponibles. |
| 3. TOOL SELECTED | El modelo propone el nombre de una herramienta. |
| 4. ARGUMENTS | El modelo genera argumentos estructurados. |
| 5. EXECUTION | El runtime valida y ejecuta la función real. |
| 6. TOOL RESULT | La aplicación incorpora la observación como mensaje de tool. |
| 7. MODEL RESPONSE | Se realiza otra inferencia y el modelo redacta la respuesta. |

---

## Pregunta crítica

> “¿Qué está ocurriendo en el modelo mientras Python ejecuta la función?”

Corrige esta confusión de forma explícita:

> “La primera inferencia ya terminó. El modelo no queda corriendo ni esperando un callback. La aplicación recibe el ToolCall, ejecuta la función y luego realiza una nueva llamada al modelo con el resultado incluido en el historial.”

Forma visual:

```text
HTTP call #1
User + schemas → Model → ToolCall
                         ↓ termina

Python runtime
valida → ejecuta → obtiene resultado

HTTP call #2
historial + Tool Result + schemas → Model → respuesta o nueva decisión
```

## Escenario sin tool

Cambia a la pregunta conceptual de la experiencia.

Pregunta:

> “¿Debe el modelo utilizar una tool cada vez que existe una tool disponible?”

Respuesta: **no**.

Un saludo, una explicación conceptual o una solicitud que pueda resolverse con el contexto actual puede terminar con respuesta textual sin ToolCall.

---

## Ejercicio rápido de clasificación

Pregunta al grupo qué debería ocurrir:

1. “¿Dónde está el pedido ORD-100?” → tool.
2. “¿Qué significa idempotencia?” → probablemente no tool.
3. “Aplica el cupón DESC15 al pedido ORD-200.” → depende de qué capacidad se haya expuesto.

La idea es separar **necesidad del usuario** de **inventario de herramientas disponible**.

---

# 45–55 min — 03. Frontera de Seguridad: lectura vs side effects

## En pantalla

Proyecta la **Sección 03 — Frontera de Seguridad** (experiencia: `tool-boundary`).

Compara:

### Lectura

Ejemplos:

- consultar estado;
- buscar inventario;
- obtener información de una base de conocimiento.

El riesgo operativo es menor porque una repetición accidental no debería modificar el estado.

### Side effects

Ejemplos:

- cancelar un pedido;
- enviar un correo;
- emitir un reembolso;
- modificar una fila en BD.

Aquí una decisión incorrecta puede cambiar el mundo real.

---

## Pregunta detonante

> “Si escribimos en el system prompt ‘nunca hagas reembolsos mayores a 100’, ¿eso es suficiente para proteger el sistema?”

Respuesta: **no**.

La política debe verificarse dentro del software que ejecuta la operación.

Ejemplo:

```python
def execute_refund(amount: float) -> dict:
    if amount > 100:
        return {
            "error": "refund_limit_exceeded"
        }
    return {
        "status": "approved",
        "amount": amount
    }
```

## Regla para decir

> “Never trust LLM output. La propuesta del modelo es input no confiable para nuestro runtime.”

Validar como mínimo:

- nombre de tool permitido;
- JSON válido;
- tipos y campos requeridos;
- autorización;
- estado actual del recurso;
- reglas de negocio;
- idempotencia cuando existe mutación.

---

# 55–110 min — 04. Taller práctico: construye tu Agent v1

Esta actividad no consiste en copiar el ejemplo de pedidos. Cada grupo de estudio diseña su propio agente.

## Antes de programar

Cada grupo de estudio responde:

1. ¿Qué problema resuelve mi Agent v1?
2. ¿Qué información externa necesita?
3. ¿Qué dos tools mínimas necesita?
4. ¿Cuándo NO debería usar ninguna tool?
5. Si una tool modifica estado, ¿qué validaciones deben permanecer en Python?

> [!IMPORTANT]
> **Side effects no obligatorios en el código:**
>
> No es obligatorio que las tools implementadas en el taller muten estado persistente. El requisito real es implementar mínimo **dos tools**, y ambas pueden ser de solo lectura (ej. consultar catálogo y verificar disponibilidad).
>
> Si ninguna tool muta estado, el grupo debe responder obligatoriamente de forma conceptual:
> **"¿Qué operación de este dominio sí tendría side effects y qué validaciones exigiría antes de exponerla como tool?"**
>
> Identificando controles concretos en el software: autorización de usuario, validación de estado previo, límites de negocio, idempotencia y confirmación humana cuando aplique. (Esto se trata estrictamente como frontera de ejecución de L02; no adelantarse a los Guardrails de L05).

Posibles dominios únicamente como inspiración:

- biblioteca;
- soporte;
- inventario;
- reservas;
- gestión de tareas;
- consulta de productos;
- soporte técnico.

---

## Contrato mínimo del Agent v1

El grupo debe producir:

- propósito concreto;
- mínimo 2 funciones Python;
- Tool Schemas claros;
- `TOOL_REGISTRY` o dispatcher equivalente;
- un caso que use Tool 1;
- un caso que use Tool 2;
- un caso que no use tools;
- trazabilidad de los 7 hops;
- una explicación de la frontera de ejecución.

> [!NOTE]
> **Nota para el instructor sobre `MockModelProvider` (Modo A):**
>
> `MockModelProvider` **no realiza inferencia semántica real** ni razonamiento probabilístico sobre lenguaje natural. Es una simulación determinista basada en reglas explícitas para reproducir fielmente la estructura y los contratos de mensajes del protocolo (`finish_reason="tool_calls"`, extracción de argumentos JSON, mensaje con `role: "tool"` y nueva llamada simulada inyectando la observación).
>
> *Frase conceptual para el grupo:* **“En Modo A no estamos demostrando inteligencia del modelo; estamos demostrando el protocolo del software.”**
>
> Este modo es 100% suficiente para validar la arquitectura y el dispatcher sin costo ni credenciales externas. En Modo B (proveedor real opcional) sí se observa selección probabilística genuina a partir de las descripciones en lenguaje natural.

---

## Diagnóstico pedagógico de Tool Schema

Pide que comparen una descripción precisa con una ambigua.

Pregunta:

> “¿Qué cambió: la función Python o la información que el modelo utiliza para decidir?”

Respuesta: cambió la información declarativa disponible para la decisión del modelo.

En Mock Mode explica que este deterioro no se observa realmente como comportamiento probabilístico porque las reglas están simuladas de forma determinista. Con un proveedor real sí puede evaluarse la selección de herramientas.

---

# 110–120 min — El límite de Agent v1 y puente hacia L03

Plantea una petición que requiera dos pasos dependientes.

Ejemplo conceptual:

> “Consulta el pedido; si todavía está procesando, calcula si tiene descuento aplicable y dime qué debería hacer.”

Pregunta:

> “Después de ejecutar Tool A y devolver el resultado al modelo, ¿podría el modelo responder con otro ToolCall?”

Respuesta: **sí**, porque en la segunda inferencia vuelve a recibir los Tool Schemas.

Después pregunta:

> “¿Qué hace nuestro Agent v1 actual si `second_response` contiene otro `tool_call` en vez de texto final?”

Respuesta buscada: **el runtime no sabe continuar** si solamente consume `second_response.content` y termina.

La frontera exacta es:

```text
Tool A
  ↓
resultado
  ↓
segunda inferencia
  ↓
¿Tool B?
  ↓
runtime actual no procesa otra decisión
```

No implementes todavía bucles iterativos de control, recursión agéntica ni encadenamiento arbitrario.

Cierra con:

> “Nuestro modelo ya puede volver a decidir. Lo que todavía no hemos construido es un runtime capaz de procesar decisiones repetidas hasta llegar a una respuesta final. Ese mecanismo será L03: Agent Loop.”

---

## Checklist del instructor

Antes de cerrar verifica que el grupo pueda responder:

- ¿Quién selecciona la tool? → el modelo.
- ¿Quién genera los argumentos? → el modelo.
- ¿Quién valida y ejecuta la función? → el software.
- ¿La primera inferencia queda ejecutándose mientras corre la tool? → no.
- ¿Qué es un Tool Result? → una observación incorporada al historial para una nueva inferencia.
- ¿El prompt es una frontera de seguridad? → no.
- ¿Puede la segunda inferencia solicitar otra tool? → sí.
- ¿Qué le falta a Agent v1 para continuar? → un runtime iterativo que procese nuevas decisiones.

Si estas respuestas están claras, L02 cumplió su objetivo aunque el taller práctico se termine en la siguiente sesión.
