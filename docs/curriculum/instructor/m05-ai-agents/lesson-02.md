# Lesson 02 — Tool Calling

## 1. Propósito de la clase
Enseñar a los estudiantes el mecanismo subyacente mediante el cual un LLM "interactúa" con el mundo exterior. Romper radicalmente la ilusión de que el modelo tiene acceso directo a internet o a las bases de datos. Establecer que **Tool Calling es un contrato de comunicación donde el LLM propone (vía JSON) y el Backend ejecuta y valida**.

## 2. Qué debe aprender el estudiante
- Comprender el flujo real de Tool Calling: `LLM Proposes → Backend Validates → Backend Executes → Backend Returns Observation`.
- Diseñar descripciones de herramientas (Tool Schemas) usando los principios de Prompt Engineering (M02).
- Ver este mecanismo como la base de seguridad que preparará el camino para los Módulos 07 (MCP) y 08 (Producción).

## 3. Conceptos fundamentales

### 3.1 El Contrato de Tool Calling
Un LLM no puede ejecutar código ni hacer peticiones HTTP (a menos que se le conecte un intérprete, lo cual sigue siendo mediado por backend). Tool Calling es simplemente forzar al modelo a responder con un JSON estructurado que dice "Me gustaría que ejecutes la función X con los parámetros Y".

#### Concept Analogy: Tool Calling
- **Analogía cotidiana:** Un cirujano (LLM) y su instrumentista (Backend).
- **Mapeo:** 
  - El cirujano no busca en la bandeja de herramientas. Extiende la mano y dice: "Bisturí del número 3" (*Tool Proposal*).
  - El instrumentista verifica que el cirujano pidió la herramienta correcta para la incisión, la toma de la bandeja y se la entrega (*Validation & Execution*).
  - El paciente sangra (*Observation*).
- **Límite de la analogía:** Si el cirujano humano pide una motosierra, el instrumentista humano lo detendrá por sentido común. Si el LLM alucina y pide "Borrar Base de Datos" en un JSON perfectamente formateado, un Backend mal diseñado simplemente ejecutará el comando ciegamente.
- **Traducción técnica:** Fine-tuning de modelos generativos para detectar firmas de funciones en el input (JSON Schema) y frenar la generación de lenguaje natural a favor de escupir un objeto JSON válido.
- **Ejemplo aplicado a SWE:** El usuario pide "¿Qué tiempo hace en Madrid?". El LLM (cirujano) responde: `{"name": "get_weather", "arguments": {"city": "Madrid"}}`. El backend (instrumentista) atrapa este JSON, detiene al LLM, ejecuta `fetch('api.weather.com?q=Madrid')`, obtiene `22°C` (Observation), y se lo inyecta de vuelta al LLM para que finalmente diga: "En Madrid hace 22 grados".

### 3.2 Proposición vs. Ejecución (La Frontera de Seguridad)
Esta es la frontera crítica de arquitectura de sistemas:
```text
LLM (Modelo de Lenguaje)
  ↓ [Propone Acción / Genera JSON]
Validation Layer (Código de Backend tradicional)
  ↓ [Decide si es seguro y válido]
Backend Execution
  ↓ [Ejecuta la función / BD / API]
Observation
```
El LLM nunca ejecuta; propone.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Le di al Agente la herramienta `update_database`. Ahora el Agente está directamente conectado a mi base de datos de producción."*
**Consecuencia:** Confundirá la capacidad lingüística con los permisos de red. Escribirá prompts diciendo "Nunca borres datos" en lugar de quitarle el permiso de borrado al rol IAM de la base de datos que usa el Backend. Y cuando el modelo sea hackeado por un *Prompt Injection*, el Backend ejecutará la eliminación masiva porque el ingeniero creyó que el modelo actuaría como escudo de seguridad.

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
