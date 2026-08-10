# Lesson 02 — MCP Architecture

## 1. Propósito de la clase
Diseccionar la topología del *Model Context Protocol*. Despejar la confusión común sobre dónde se ejecuta el modelo de IA y dónde se ejecutan las herramientas. Los estudiantes aprenderán a identificar los roles estrictos de `Host`, `Client` y `Server`, y comprenderán los transportes modernos (`stdio` vs `SSE`).

## 2. Qué debe aprender el estudiante
- Mapear correctamente la arquitectura de 3 componentes (Host ↔ Client ↔ Server).
- Entender que el Servidor MCP desconoce por completo la existencia del LLM.
- Reconocer la frontera de seguridad ("Airgap lógico") que el protocolo establece entre la inferencia de IA y la ejecución de código corporativo.

## 3. Conceptos fundamentales

### 3.1 La Arquitectura Tripartita
MCP no es una conexión directa de punto a punto entre un LLM y una base de datos. Está diseñado en capas:

1. **El MCP Host:** Es la aplicación que el usuario final utiliza (ej. Cursor IDE, Claude Desktop, una app custom). El Host es quien *habla* con el modelo de lenguaje de IA.
2. **El MCP Client:** Es el componente de red que vive *dentro* del Host. Su único trabajo es establecer la conexión, mantener el ciclo de vida de la sesión (handshake), y enrutar los mensajes JSON-RPC.
3. **El MCP Server:** Es la aplicación que tú desarrollas. Es un servidor ligero conectado a tus sistemas reales (ej. MySQL local de CFA). Responde a las peticiones del Cliente exponiendo recursos y ejecutando herramientas.

```text
[ LLM ] <---(API)--- [ HOST (App) + CLIENT ] <===(MCP Protocol)===> [ SERVER ] ---> [ MySQL / APIs ]
```

#### Concept Analogy: El Restaurante
- **Analogía cotidiana:** Cenar en un restaurante.
- **Mapeo:** 
  - El **Cocinero** es el LLM. (Procesa ingredientes y genera platos).
  - El **Camarero** es el Host + Client (Recoge tu pedido, va a la cocina, y habla con la despensa).
  - El **Despensero** es el MCP Server. (Tiene la llave de la bodega de vinos, y solo le entrega al camarero lo que está autorizado, sin importarle quién es el cocinero).
- **Límite de la analogía:** En un restaurante, el camarero puede robar un vino. En MCP, el Servidor autentica y autoriza cada transacción forzando contratos tipados. El Despensero (Server) tiene control absoluto sobre el acceso, implementando *Least Privilege*.
- **Traducción técnica:** Arquitectura Cliente-Servidor donde el transporte es agnóstico (Local `stdio` o Remoto `SSE over HTTP`).
- **Ejemplo aplicado a SWE:** Quieres conectar una IA a tu base de datos local `MySQL` de tu aplicación Core Financial App (CFA). No le pasas credenciales de MySQL a Claude Desktop. Escribes un Servidor MCP (Despensero) local. Claude Desktop (Host) inicia el Servidor MCP. Claude le pide al Servidor MCP la lista de tablas. El Servidor hace la query a MySQL y le devuelve el esquema. La IA genera el código, propone un *Tool Call* para insertar un dato, y el Servidor decide si lo ejecuta o no.

### 3.2 Transportes (Transport Layer)
El protocolo es agnóstico a la red, pero implementa dos estándares principales:
- **`stdio` (Standard Input/Output):** Ideal para desarrollo local (como el caso de la CFA). El Host lanza el Servidor MCP como un subproceso en la misma máquina. Ultra rápido, latencia nula.
- **`HTTP con SSE` (Server-Sent Events):** Ideal para despliegues distribuidos corporativos. El Host habla por red con un Servidor MCP alojado en la nube que maneja la autenticación y mantiene conexiones bidireccionales abiertas.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Diseñaré mi Servidor MCP para que lea la base de datos MySQL y luego envíe él mismo los datos a la API de OpenAI para resumirlos, devolviéndole el resultado a Cursor."*
**Consecuencia:** El ingeniero acaba de destruir la arquitectura MCP, convirtiendo su servidor en un *Host* ad-hoc. MCP exige que la responsabilidad de hablar con la IA resida **exclusivamente en el Host**. El Servidor MCP debe ser "tonto" respecto a la IA; solo despacha datos estructurados.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** El Servidor MCP es un traductor ciego. No sabe qué modelo de IA está usando la información. Solo obedece solicitudes del protocolo.
- **Mecanismo:** El Host inyecta en el prompt base las herramientas que el Servidor le reportó en el *handshake*. Cuando el modelo genera un JSON, el Host lo enruta a través del Cliente MCP hacia el Servidor.
- **Consecuencia de ingeniería:** Tu equipo puede cambiar de IDE (de Cursor a Windsurf) o cambiar de LLM (de GPT-4 a Llama-3) sin necesidad de reescribir una sola línea del código de tu Servidor MCP.

## 6. Ejemplo técnico
**Lo que viaja por el protocolo (JSON-RPC):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "query_cfa_mysql",
    "arguments": {
      "table": "transactions",
      "limit": 5
    }
  }
}
```
*Nota que no hay ninguna mención a "tokens", "llms", o "prompts". Es puro RPC.*

## 7. Ejemplo aplicado a Software Engineering
Si ocurre un incidente de seguridad (ej. se borró una tabla de la CFA), la auditoría arquitectónica es trivial:
- ¿Fue culpa del LLM? No, el LLM solo propuso texto.
- ¿Fue culpa del Host? No, el Host solo enrutó el mensaje.
- ¿Fue culpa del Servidor MCP? **Sí.** El Servidor MCP no implementó *Least Privilege* y aceptó una query de tipo `DROP TABLE`. La responsabilidad está acotada.

## 8. Errores conceptuales frecuentes
- **"El Cliente MCP se instala en mi base de datos"**: No, el Cliente vive dentro del Host (la app de IA). El Servidor es el código que tú escribes para conectar tu base de datos.
- **"Host y Client son lo mismo"**: Casi siempre se empaquetan juntos (como Claude Desktop), pero lógicamente el Host maneja la UI y el LLM, mientras el Cliente maneja la tubería MCP.

## 9. Preguntas para el grupo
- "Si construyen un Servidor MCP para buscar logs internos, ¿cómo evitan que un usuario le pida a la IA que extraiga los salarios de los directivos?" (Respuesta: Aplicando autorización (RBAC) en el propio código del Servidor MCP, usando el token de identidad que el Host puede pasar al iniciar la conexión).
- "¿Por qué usar `stdio` para desarrollo local en lugar de levantar un servidor HTTP?"

## 10. Mini ejercicio
Dibuja en la pizarra tres componentes desordenados: `LLM API (Anthropic)`, `MySQL Database (CFA)`, `MCP Server (Python)`, `Claude Desktop (App)`. Pide a los alumnos que dibujen las flechas y nombren las capas (`Host`, `Server`) y los protocolos (REST, MCP/stdio, SQL) que las conectan.

## 11. Demo relacionada
*(Se explicará la arquitectura durante la Demo 07).*

## 12. Discusión
Al separar limpiamente el razonamiento probabilístico (LLM/Host) de la acción determinista (Server/DB), hemos resuelto el mayor problema de seguridad de la IA empresarial: la imprevisibilidad.

## 13. Preparación para la siguiente clase
"El Servidor MCP es nuestro despensero. Pero, ¿qué capacidades puede exponerle al camarero? Mañana veremos las tres Primitivas del protocolo: Resources (solo lectura), Tools (acción con efectos secundarios) y Prompts."
