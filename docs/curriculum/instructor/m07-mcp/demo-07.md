# Demo 07 — The Universal Connector (Instructor Guide)

## 1. Propósito de la Demo
Desmitificar el "handshake" de MCP y evidenciar físicamente cómo una aplicación de IA descubre capacidades alojadas en un servidor externo. Demostrar en vivo cómo el principio de *Least Privilege* implementado en el backend protege la base de datos corporativa contra instrucciones abusivas del Agente.

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Tras finalizar la Lesson 03 (Primitives).
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Explica a la clase el escenario: Tienes la base de datos local de la *Core Financial App (CFA)* corriendo en MySQL. Quieres que el cliente de IA (Claude Desktop o Cursor) pueda investigar datos financieros.
Muestra el código del **Servidor MCP** (Python o Node.js) alojado localmente.
Resalta que el servidor expone:
- 1 **Resource:** `mysql://cfa/schema` (Solo lectura del esquema).
- 1 **Tool:** `get_user_transactions(user_id)` (Limitado a 5 resultados por query).

### Paso 2: El Descubrimiento (Handshake)
1. Modifica la configuración de tu cliente (ej. `claude_desktop_config.json`) para arrancar el servidor usando transporte `stdio`.
```json
{
  "mcpServers": {
    "cfa-database": {
      "command": "python",
      "args": ["server.py"]
    }
  }
}
```
2. Reinicia la aplicación cliente. 
3. **Lo que debes destacar:** En la interfaz de la IA, haz click en el icono de herramientas (o equivalente). La aplicación ahora lista mágicamente "get_user_transactions" y "Database Schema". Explica que el Cliente envió un `tools/list` y un `resources/list`, y construyó la interfaz dinámica basado en la respuesta JSON. ¡No escribimos ni un solo prompt de integración!

### Paso 3: Probando Least Privilege
1. Abre el chat y escribe: *"Elimina la tabla de transacciones de la base de datos."*
2. **Lo que debes observar:** El modelo (LLM) intentará cumplir la orden. Como *no tiene* una herramienta llamada `drop_table`, intentará forzar el uso de `get_user_transactions` pasando un SQL malicioso (si la herramienta permitiera raw SQL), o se disculpará diciendo que carece de las herramientas.
3. Si simulaste una herramienta insegura `execute_raw_sql` (sólo para la demo), y el LLM envía `DROP TABLE`, el terminal del servidor MCP lanzará un error programado por ti: `Error: SQL Statement rejected. Only SELECT is allowed.`
4. **Lo que debes destacar:** ¡El fallo del LLM fue contenido por la frontera de seguridad del Servidor! Never Trust the Client.

### Paso 4: El Flujo Correcto (Human in the Loop)
1. Ahora escribe: *"¿Cuáles son las transacciones del usuario 42?"*
2. El cliente (Host) captura el intento y muestra un popup: *"El Agente desea usar la herramienta `get_user_transactions(42)`. ¿Permitir?"* (Simulación de **Human-in-the-Loop / HITL**).
3. Presiona **Accept**. El Servidor devuelve el JSON, el modelo lo lee, y formatea la respuesta en español para el usuario.
4. Explica: "MySQL produjo JSON crudo; la IA lo consumió, pero solo cuando nosotros lo autorizamos en el HITL".

## 4. Puntos de Discusión a provocar
- "Si quitáramos la capa de HITL (Auto-Approve) por 'comodidad', ¿qué riesgos de seguridad asumiríamos con la CFA?"
- "Han notado que no necesitamos decirle a la IA la contraseña de MySQL. La IA nunca vio credenciales. ¿Por qué esto cambia las reglas de seguridad corporativa de la GenAI?" (Respuesta: La autenticación pertenece al Host y al Servidor, aislando al LLM).

## 5. Transición al Lab
"Hemos visto la teoría y la demo. En el *Real Engineering Lab 07*, ustedes se enfrentarán al desafío real: tomar una base de datos legacy corporativa llena de datos confidenciales y diseñar su propia frontera MCP. Tendrán que justificar por qué ciertas tablas deben ser Resources y por qué ciertas acciones requieren Tools hiper-acotadas."
