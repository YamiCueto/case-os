# Guía del Instructor — Lección 01: ¿Qué es MCP y por qué necesitamos utilizarlo?
**Módulo 06 · Model Context Protocol**

---

## 1. Objetivos de Aprendizaje
Al finalizar la lección, el participante será capaz de:
- Explicar la crisis de integración N × M en arquitecturas de agentes de software.
- Distinguir con precisión matemática y arquitectónica la diferencia entre Tool Calling y MCP.
- Describir las responsabilidades y fronteras de seguridad de los tres roles: Host, Client y Server.
- Trazar el ciclo de vida completo de un mensaje desde la intención humana hasta la respuesta de un backend.

## 2. Duración y Distribución Temporal (Total: 55 minutos · Martes 20 de Octubre)
- **00–10 min:** Activación, contexto corporativo y el problema de las integraciones N × M.
- **10–25 min:** Qué es Model Context Protocol y qué problemas resuelve (especificación JSON-RPC 2.0 y primitivas).
- **25–40 min:** Anatomía de Host, Client y Server + Demostración interactiva en el Simulador de Arquitectura.
- **40–50 min:** Tool Calling frente a MCP (diferenciación conceptual y fronteras de seguridad).
- **50–55 min:** Preguntas socráticas de comprobación y transición hacia L02 (Servidores Útiles).

## 3. Conceptos Técnicos Fundamentales
- **Crisis N × M:** Multiplicación exponencial de conectores propietarios entre N hosts/agentes y M herramientas.
- **LSP Análogo:** Cómo Language Server Protocol desacopló editores de compiladores en 2016 y cómo MCP lo hace para LLMs y herramientas.
- **JSON-RPC 2.0:** Formato de serialización ligero de peticiones y respuestas con `id`, `method`, `params`, `result` y `error`.
- **Least Privilege en Procesos:** Aislamiento donde el servidor MCP corre como proceso separado con permisos restringidos.

## 4. Guion del Instructor: Qué decir en cada sección

### Sección 1: El Problema N × M
> *"Compañeros ingenieros, en M05 construimos agentes que llamaban a funciones en memoria. Pero imaginen su empresa: tienen 4 aplicaciones que usan agentes (el IDE del desarrollador, el bot de soporte, el pipeline de CI/CD y un dashboard analítico). Y tienen 6 fuentes de datos (GitHub, Jira, PostgreSQL, Slack, AWS, Datadog). Si cada cliente escribe su propio SDK para cada herramienta, tenemos 4 × 6 = 24 integraciones propietarias que mantener. Cualquier cambio de schema en Jira romperá 4 agentes a la vez. MCP cambia esta fórmula a N + M: un protocolo único abierto."*

### Sección 2: Tool Calling frente a MCP
> *"No confundamos Tool Calling con MCP. Tool Calling es una capacidad interna del LLM: el modelo aprende a dejar de escribir texto y escupir un JSON estructurado con el nombre de una función. Pero el modelo no sabe abrir un socket TCP, ni sabe ejecutar un proceso en Windows. MCP es la fontanería y el protocolo estándar que comunica al Host con el servidor que ejecuta la herramienta."*

## 5. Preguntas para Activar al Grupo
1. *"¿Por qué no es seguro que el LLM ejecute directamente comandos de bash o SQL usando credenciales inyectadas en su prompt?"*
   - *Respuesta esperada:* Porque cualquier Prompt Injection podría filtrar las credenciales o borrar la base de datos sin control perimetral.
2. *"Si cambio de modelo (de Claude 3.5 Sonnet a GPT-4o o Gemini Flash), ¿tengo que volver a escribir mis servidores MCP?"*
   - *Respuesta esperada:* No, porque el servidor MCP es agnóstico al modelo de IA; solo habla JSON-RPC con el Host.

## 6. Guion de Demostración del Playground (Simulador Visual)
1. Abrir la lección en pantalla compartida y dirigirse a la sección **Simulador Visual de Arquitectura MCP**.
2. Seleccionar como Host: `CASE OS Agent Studio`.
3. Seleccionar como MCP Server: `GitHub MCP Server`.
4. Seleccionar Operación: `Consultar issues críticos abiertos`.
5. Hacer clic en **Siguiente Paso** y relatar en voz alta cada transición:
   - *Paso 1:* Usuario solicita la acción.
   - *Paso 2:* Host contextualiza el prompt del sistema.
   - *Paso 3:* LLM genera el Tool Call JSON.
   - *Paso 4:* MCP Client serializa JSON-RPC 2.0 `tools/call`.
   - *Paso 5:* Servidor MCP ejecuta con token acotado.
   - *Paso 6:* GitHub API devuelve datos reales.
   - *Paso 7:* Host inyecta la observación en el bucle del agente.
6. Probar el botón **Auto-Play** para mostrar la fluidez del ciclo completo.

## 7. Errores Conceptuales Frecuentes
- **Error:** Creer que un servidor MCP contiene al modelo de lenguaje.
  - *Aclaración:* El servidor MCP es un simple proceso backend (Node/Python); no contiene pesos de redes neuronales ni hace inferencia.
- **Error:** Pensar que MCP sustituye a las APIs REST.
  - *Aclaración:* MCP envuelve las APIs existentes para exponerlas de forma semántica y autodescriptiva a los agentes de IA.

## 8. Actividad de Comprobación
- Pedir a los asistentes que en el chat o en voz alta indiquen qué componente de la arquitectura (Host, Client, Server o LLM) es el responsable de rechazar una operación destructiva si el usuario no ha hecho clic en "Aprobar".
- *Respuesta correcta:* El Host (a través de la compuerta de políticas y Human-in-the-Loop).

## 9. Transición a la Siguiente Lección
> *"Ahora que entendemos la arquitectura y el protocolo, pasemos a la Lección 02, donde exploraremos los 6 servidores MCP más útiles y utilizados en la industria del software: GitHub, Filesystem, Playwright, PostgreSQL, Jira y cómo crear servidores custom."*
