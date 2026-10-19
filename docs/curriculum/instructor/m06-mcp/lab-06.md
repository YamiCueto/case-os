# Guía del Instructor — Laboratorio 06: Construcción de una Integración MCP
**Módulo 06 · Model Context Protocol (Cierre Definitivo de Capacitaciones)**
**Fecha Límite Definitiva de Entrega:** Sábado 24 de Octubre de 2026

---

## 1. Objetivos del Laboratorio
El participante consolidará los conocimientos de todo el programa CASE OS integrando al menos un servidor MCP útil con los agentes desarrollados en el Módulo M05:
- Reutilizar la arquitectura de agentes construida previamente (V2–V6) sin rehacer el proyecto desde cero.
- Configurar y desplegar un servidor MCP oficial o corporativo.
- Demostrar el descubrimiento (`tools/list`), la ejecución exitosa de una herramienta y el manejo resiliente de al menos un error.
- Sustentar el cumplimiento del principio de mínimo privilegio (Least Privilege) y compuertas Human-in-the-Loop.
- Realizar el cierre formal del programa formativo completo (M01–M06).

## 2. Duración y Distribución Temporal (Total: 180 minutos · Sábado 24 de Octubre)
- **000–015 min:** Introducción, criterios de aceptación y asignación por células técnicas.
- **015–035 min:** Selección de la alternativa y configuración del servidor MCP en `mcp_config.json`.
- **035–110 min:** Implementación acompañada del agente con MCP (75 min de codificación, conexión y pruebas).
- **110–140 min:** Ejecución, inyección de errores intencionales y validación de resiliencia / HITL.
- **140–165 min:** Demostraciones de las células técnicas frente a la plenaria (5 min por célula).
- **165–180 min:** Conclusiones, retrospectiva y Ceremonia de Cierre Definitivo de Capacitaciones.

## 3. Las 4 Alternativas de Laboratorio

### Alternativa A: Consulta de Base de Datos (MySQL CFA / Supabase MCP)
- **Objetivo:** Conectar el agente a un servidor MCP relacional para consultar transacciones y estado de asociados bajo Least Privilege.
- **Entorno:** Base de datos local MySQL de CFA o proyecto Supabase.
- **Comando:** `npx -y @modelcontextprotocol/server-postgres <CONNECTION_STRING>` o servidor MySQL local.

### Alternativa B: Inspección de Repositorio (GitHub MCP)
- **Objetivo:** Conectar el agente con GitHub MCP para analizar issues abiertos, examinar diffs de código y proponer PRs.
- **Entorno:** Repositorio personal o de la organización con Fine-Grained Token.
- **Comando:** `npx -y @modelcontextprotocol/server-github` con variable de entorno `GITHUB_PERSONAL_ACCESS_TOKEN`.

### Alternativa C: Validación de Interfaz Web (Playwright MCP)
- **Objetivo:** Conectar el agente a un navegador headless para comprobar la carga de rutas en localhost, capturar screenshots y validar consola.
- **Entorno:** Proyecto Angular CASE OS corriendo en `localhost:4200`.
- **Comando:** `npx -y @modelcontextprotocol/server-playwright`.

### Alternativa D: Acceso Controlado a Archivos (Filesystem MCP)
- **Objetivo:** Conectar el agente para inspeccionar y parchar archivos dentro de un directorio acotado del workspace.
- **Entorno:** Directorio del proyecto en máquina local.
- **Comando:** `npx -y @modelcontextprotocol/server-filesystem <DIRECTORIO_RAIZ>`.

---

## 4. Checklist de los 7 Entregables Obligatorios

| # | Entregable | Criterio de Aceptación |
| :--- | :--- | :--- |
| **1** | **Diagrama de Arquitectura** | Diagrama de bloques que ilustre claramente el flujo: Agente → Host → MCP Client → Servidor MCP → Backend. |
| **2** | **Configuración del Servidor** | Archivo `mcp_config.json` válido con comandos, argumentos y variables de entorno seguras. |
| **3** | **Evidencia de Conexión** | Captura o log de la respuesta `tools/list` mostrando las herramientas descubiertas con sus schemas. |
| **4** | **Ejecución de Herramienta** | Captura de llamada `tools/call` exitosa con argumentos estructurados y respuesta procesada por el agente. |
| **5** | **Manejo de al menos un Error** | Evidencia de respuesta controlada ante argumento inválido (-32602) o fallo lógico (`isError: true`). |
| **6** | **Explicación de Permisos** | Documentación de por qué los permisos asignados cumplen con el principio de mínimo privilegio. |
| **7** | **Demostración Funcional** | Demostración breve (en vivo o grabada) del agente resolviendo la tarea mediante la herramienta integrada. |

---

## 5. Protocolo de Cierre Definitivo de las Capacitaciones (Sábado 24 de Octubre de 2026)

### Momento 1: Validación y Firma del Checklist
El instructor verifica que cada estudiante o equipo complete los 7 puntos en la interfaz interactiva del Laboratorio 06 y que el porcentaje alcance el 100%.

### Momento 2: Consolidación del Recorrido Curricular
El instructor proyecta el resumen curricular de los 6 módulos completados:
- **M01 — Fundamentos de IA:** El paso de la lógica determinista a los modelos probabilísticos.
- **M02 — Prompt Engineering:** Control estricto de comportamiento mediante contratos de instrucción.
- **M03 — Context Engineering:** El contexto mínimo útil: relevante ≠ necesario.
- **M04 — Retrieval y RAG:** Recuperación estructurada y evaluación de relevancia.
- **M05 — AI Agents:** Bucles autónomos de decisión (ReAct), memoria y guardrails de seguridad.
- **M06 — Model Context Protocol:** Interoperabilidad universal y conexión con herramientas reales de software.

### Momento 3: Palabras Finales del Instructor
> *"Estimados ingenieros, hoy sábado 24 de octubre de 2026 culmina formalmente nuestra capacitación en CASE OS. Han dejado atrás la era del 'prompting intuitivo' y se han consolidado como ingenieros de sistemas probabilísticos. Tienen en sus manos la arquitectura, la disciplina y las herramientas para diseñar agentes de software seguros, verificables y de clase mundial. ¡Felicitaciones por culminar con éxito el programa!"*
