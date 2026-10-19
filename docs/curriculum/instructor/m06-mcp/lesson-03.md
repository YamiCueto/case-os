# Guía del Instructor — Lección 03: Configuración y Utilización Práctica
**Módulo 06 · Model Context Protocol**

---

## 1. Objetivos de Aprendizaje
Al finalizar la lección, el participante será capaz de:
- Instalar y ejecutar servidores MCP locales mediante `npx` y transportes `stdio`.
- Configurar servidores MCP remotos mediante `Streamable HTTP` con Server-Sent Events (SSE).
- Estructurar archivos `mcp_config.json` y `claude_desktop_config.json` con variables de entorno protegidas.
- Interpretar el ciclo de vida de peticiones y respuestas JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`).
- Diagnosticar los 3 fallos más comunes en producción: ENOENT, variables de entorno perdidas y timeouts.
- Implementar compuertas Human-in-the-Loop ante operaciones destructivas.

## 2. Duración y Distribución Temporal (Total: 60 minutos · Jueves 22 de Octubre)
- **00–15 min:** Modos de transporte: stdio (procesos hijos locales) vs Streamable HTTP (nube, Kubernetes y SSE).
- **15–30 min:** Configuración de servidores: estructura de `mcp_config.json`, aislamiento de variables de entorno y comandos oficiales.
- **30–45 min:** Demostración y práctica en el Playground: MCP Tool Calling Inspector (mensajes JSON-RPC 2.0 y payloads).
- **45–55 min:** Gestión de errores en producción (-32602, timeouts), permisos granulares y compuertas Human-in-the-Loop (HITL).
- **55–60 min:** Preguntas socráticas de comprobación, síntesis técnica y transición a L04 (Agentes con MCP).

## 3. Conceptos Técnicos Fundamentales
- **Proceso Hijo stdio:** Canal bidireccional donde stdin recibe peticiones y stdout entrega respuestas. La regla dorada: nada de `console.log` a stdout en el servidor; usar `stderr`.
- **Streamable HTTP:** Transporte moderno MCP para arquitecturas serverless o microservicios que reemplaza WebSockets tradicionales por SSE y POST.
- **Código de Error -32602:** Código canónico JSON-RPC 2.0 para parámetros inválidos o ausentes según el JSON-Schema.
- **Bandera isError en Resultado:** MCP permite devolver un resultado válido (`result`) con `isError: true` para que el modelo lea el fallo lógico y replanifique sin romper la conexión de transporte.

## 4. Guion del Instructor: Qué decir en cada sección

### Sección 1: stdio vs HTTP
> *"Cuando usamos stdio, no hay puertos abiertos ni latencia de red. El cliente lanza el comando npx directamente en el sistema operativo del usuario. Pero si estamos en un clúster de Kubernetes corporativo o en un entorno en la nube compartido por 50 ingenieros, usamos Streamable HTTP. El servidor escucha peticiones HTTP seguras y envía eventos en tiempo real mediante SSE."*

### Sección 2: El Peligro de los Logs en stdout
> *"Atención a este fallo clásico: un desarrollador novato crea un servidor MCP y pone 'console.log("Iniciando conexión a base de datos...")'. Inmediatamente el cliente MCP arroja un error crítico de parseo JSON. ¿Por qué? Porque en stdio, stdout es el canal exclusivo de JSON-RPC. Cualquier texto plano rompe el protocolo. Si necesitan registrar logs, usen siempre 'console.error()' que viaja por stderr y no afecta la comunicación."*

## 5. Preguntas para Activar al Grupo
1. *"¿Qué sucede si un cliente intenta invocar una herramienta que no existe en el catálogo del servidor?"*
   - *Respuesta esperada:* El servidor responde con error JSON-RPC código -32601 (Method not found).
2. *"¿Por qué es fundamental definir variables de entorno dentro del bloque 'env' de mcp_config.json en vez de asumir que el cliente heredará el terminal?"*
   - *Respuesta esperada:* Porque aplicaciones GUI como Claude Desktop o Antigravity IDE se lanzan frecuentemente fuera del contexto de una sesión de terminal activa y no heredan `.bashrc` o variables temporales.

## 6. Guion de Demostración del Playground (Tool Calling Inspector)
1. Abrir la lección en la sección **MCP Tool Calling Inspector**.
2. Mostrar el pipeline de 6 etapas: `Usuario → Host → MCP Client → MCP Server → Sistema externo → Respuesta`.
3. Seleccionar el escenario **Invocación Exitosa (Lectura de Archivo)**:
   - Explicar la estructura de la solicitud JSON-RPC 2.0 (`id`, `method: "tools/call"`, `params`).
   - Mostrar el resultado estructurado en el panel derecho (`isError: false`).
4. Cambiar al escenario **Fallo de Validación JSON-Schema (-32602)**:
   - Resaltar que el argumento `title` y `body` fueron omitidos intencionalmente.
   - Mostrar cómo el MCP Server rechaza la llamada con código `-32602`.
5. Cambiar al escenario **Compuerta Human-in-the-Loop**:
   - Mostrar el banner de advertencia amarillo: la herramienta `delete_customer_record` requiere autorización humana.
   - Demostrar el clic en **Aprobar Ejecución** o **Rechazar Operación** para liberar el runtime.
6. Cambiar al escenario **Diagnóstico de Error de Runtime (ENOENT)**:
   - Explicar cómo el servidor devuelve `isError: true` para que el agente entienda que el archivo no existe sin crashear el proceso.

## 7. Errores Conceptuales Frecuentes
- **Error:** Creer que un error de una herramienta (`isError: true`) debe cerrar la conexión del cliente.
  - *Aclaración:* Al contrario, MCP está diseñado para ser resiliente: el error viaja como observación para que el agente replantee su razonamiento.
- **Error:** Intentar usar rutas relativas en la configuración de Filesystem MCP.
  - *Aclaración:* Las rutas deben ser absolutas para evitar ambigüedades respecto al directorio de trabajo del subproceso.

## 8. Actividad de Comprobación
- Pedir a un estudiante que comparta la pantalla o explique qué línea cambiaría en un `mcp_config.json` si el comando `npx` falla con `ENOENT` en Windows.
- *Respuesta esperada:* Especificar la ruta completa al ejecutable, por ejemplo `"command": "C:\\Program Files\\nodejs\\npx.cmd"`.

## 9. Transición a la Siguiente Lección
> *"Con la infraestructura y configuración dominada, pasemos a la Lección 04: el clímax de la arquitectura agéntica, donde pondremos a un agente de IA a orquestar múltiples servidores MCP en simultáneo para resolver un ticket real."*
