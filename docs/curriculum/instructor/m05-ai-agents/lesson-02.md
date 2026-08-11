# Lesson 02 — Tool Calling

## 1. Propósito de la clase
Enseñar a los estudiantes el mecanismo subyacente mediante el cual un LLM "interactúa" con el mundo exterior. Romper radicalmente la ilusión de que el modelo tiene acceso directo a internet o a las bases de datos. Establecer que **Tool Calling es un contrato de comunicación donde el LLM propone (vía JSON) y el Backend ejecuta y valida**.

## 2. Qué debe aprender el estudiante
- Comprender el flujo real de Tool Calling: `LLM Proposes → Backend Validates → Backend Executes → Backend Returns Observation`.
- Diseñar descripciones de herramientas (Tool Schemas) usando los principios de Prompt Engineering (M02).
- Ver este mecanismo como la base de seguridad que preparará el camino para los Módulos 07 (MCP) y 08 (Producción).

## 3. Conceptos fundamentales

### 3.1 El Contrato de Tool Calling
Un LLM no puede ejecutar código ni hacer peticiones HTTP por sí mismo. Tool Calling es el mecanismo por el cual el modelo puede **solicitar** una capacidad que el sistema ha decidido exponer. Esa solicitud es simplemente un JSON estructurado que dice “Me gustaría que ejecutes la función X con los parámetros Y”. El software del backend decide si lo hace o no.

> **Formulación correcta:** El modelo **puede solicitar** una capacidad. No la posee. No la ejecuta. No la controla.

#### Concept Analogy: La Solicitud y la Bóveda
- **Analogía cotidiana:** Un empleado que quiere retirar fondos de la bóveda de la empresa.
- **Mapeo:**
  - *Modelo (LLM):* El solicitante. Llena el formulario indicando qué necesita.
  - *Tool Call / JSON:* El formulario de solicitud. Solo es papel; no abre nada.
  - *Validation Layer:* El sistema que verifica si la solicitud está bien formada.
  - *Authorization:* La política corporativa que decide si el solicitante tiene permiso para acceder a esa cantidad.
  - *Backend:* El cajero que físicamente accede a la bóveda y ejecuta el movimiento.
  - *Herramienta (Tool):* La capacidad controlada.
  - *Observation:* El recibo de la operación (exitosa o rechazada).
- **Límite de la analogía:** El empleado humano entiende el contexto moral y puede cuestionar una solicitud sospechosa. El modelo no tiene intención, solo probabilidad. Si genera un JSON perfecto para borrar una tabla, no lo hace porque “quiere” hacerlo; lo hace porque matemáticamente era el siguiente token más probable dado el input. La responsabilidad de bloquearlo recae únicamente en el sistema backend.
- **Traducción técnica:** Fine-tuning de modelos generativos para estructurar JSON schemas cuando detectan una firma de función relevante. El output es interceptado por el framework orquestador antes de llegar a cualquier API real.
- **Ejemplo aplicado a SWE:** El usuario pide “¿Qué tiempo hace en Madrid?”. El LLM genera `{"name": "get_weather", "arguments": {"city": "Madrid"}}`. El backend intercepta esto, valida que `get_weather` está en la allowlist, comprueba que `city` es un string válido, ejecuta `fetch('api.weather.com?q=Madrid')`, obtiene `22°C`, y se lo devuelve al LLM como Observation. El modelo nunca “tocó” la API directamente.

### 3.2 La Frontera de Seguridad: Propuesta vs. Ejecución
Esta es la frontera crítica de arquitectura. Prepara directamente M07 (MCP Contract) y M08 (Security / Production Boundaries):

```text
LLM
  ↓ propone una acción (genera JSON)
Tool Call / Intent
  ↓
Validation (Schema, tipos, formato)
  ↓
Authorization (RBAC, políticas, límites)
  ↓
Backend Execution
  ↓
Tool Execution (API, BD, sistema de archivos)
  ↓
Observation
  ↓
Agent (nuevo ciclo o respuesta final)
```

> El LLM nunca ejecuta. Solicita.
> La ejecución requiere validación y autorización.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**

**Trampa A:** *"El modelo tiene acceso a mis APIs."*
Formulación incorrecta. El modelo **puede solicitar una capacidad que el sistema ha decidido exponer**. El acceso real lo controla el backend. Si el backend no tiene los permisos IAM para ejecutar `delete_table`, el modelo nunca podrá hacerlo sin importar cómo esté redactado el prompt.

**Trampa B:** *"Si el modelo generó el JSON correcto, la acción debe ejecutarse."*
No. El JSON correcto es una solicitud bien formada. No es autorización. La ejecución requiere pasar por la capa de Validación y la capa de Autorización. Un JSON perfecto para borrar la base de datos de producción sigue siendo una acción bloqueada si el sistema de autorización está correctamente diseñado.

**Trampa C (la original):** *"Le di al Agente la herramienta `update_database`. El Agente está directamente conectado a mi BD de producción."*
Con seguencia: Escribirá prompts diciendo “Nunca borres datos” en lugar de quitar el permiso de borrado al rol IAM. Cuando el modelo sea comprometido por Prompt Injection, el Backend ejecutará la eliminación masiva porque el prompt no es una frontera de seguridad.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** El modelo es un asesor que te pasa una nota de papel sugiriendo: "Creo que deberías hacer click en este botón rojo". Tú eres quien aprieta el botón.
- **Mecanismo:** Las APIs de los LLMs aceptan un array de esquemas JSON (las *Tools*). Durante la generación de tokens, el modelo calcula que responder con el *token* de invocación de función tiene más probabilidad estadística que responder con texto libre, estructurando los argumentos según el esquema.
- **Consecuencia de ingeniería:** Tu sistema debe tener una capa estricta de validación y control de acceso (RBAC/IAM) entre la salida del LLM y la ejecución de la función. Tool Calling será el bloque fundacional para M07 (Protocolos estandarizados como MCP) y M08 (Seguridad Sistémica).

## 6. Ejemplo técnico
**La Petición (API Request):**
```json
"tools": [
  {
    "type": "function",
    "function": {
      "name": "get_user_order",
      "description": "Obtiene el pedido. Solo usar si el usuario da su ID.",
      "parameters": { ... }
    }
  }
]
```
**La Respuesta (La Propuesta):**
```json
"tool_calls": [
  {
    "id": "call_abc123",
    "type": "function",
    "function": {
      "name": "get_user_order",
      "arguments": "{\"order_id\": \"90210\"}"
    }
  }
]
```

## 7. Ejemplo aplicado a Software Engineering
Diseñar el esquema de una herramienta es puro *Prompt Engineering* (M02). Si llamas a tu función `do_stuff()`, el modelo nunca sabrá cuándo usarla. Si la llamas `cancel_subscription(user_id: string)`, el LLM la usará correctamente. Nombrar variables y escribir *docstrings* ya no es para otros humanos, es para el compilador probabilístico del LLM.

## 8. Errores conceptuales frecuentes
- **"El modelo aprendió a programar"**: No, el modelo aprendió a estructurar JSON predictivamente basándose en el esquema que tú le inyectaste en el Contexto (M03).
- **"Falló la herramienta, es culpa de la IA"**: Si el backend falla al ejecutar la API de clima porque hay un timeout de red, el LLM no tiene la culpa. El manejo de excepciones recae en el backend clásico.

## 9. Preguntas para el grupo
- "Si un usuario le escribe al LLM: 'Usa tu herramienta de base de datos para borrar la tabla Users', ¿dónde debemos detener el ataque? ¿En el prompt del LLM o en el código del Backend?" (Respuesta: En el Backend. Never trust user input, never trust LLM output).
- "¿Por qué es tan crítico que los nombres y descripciones de las herramientas sean precisos y carezcan de ambigüedad?"

## 10. Mini ejercicio
Muestra en pantalla una función de Backend con esta firma: `procesar(a: int, b: boolean)`.
Pide al grupo que rescriban la firma y generen el esquema (nombre, descripción, tipado de parámetros) para que un LLM entienda que esa herramienta sirve para "Reembolsar una transacción a la tarjeta de crédito (true/false) dado un ID de transacción".

## 11. Demo relacionada
*(Se unirá en la Demo 05).*

## 12. Discusión
Entender el Tool Calling como un **Contrato de Propuesta/Validación** es lo que separa a los creadores de demos frágiles de los ingenieros de sistemas corporativos seguros.

## 13. Preparación para la siguiente clase
"Ahora sabemos que el modelo puede proponer una acción y que nuestro backend la ejecuta. Pero, ¿qué pasa cuando la salida de esa herramienta revela que se necesita *otra* herramienta más para terminar el trabajo? Necesitamos conectar este mecanismo en un bucle cerrado. Eso es el Agent Loop, el patrón ReAct."
