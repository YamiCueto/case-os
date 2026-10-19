# Guía del Instructor — Lección 02: Los Servidores MCP más Útiles
**Módulo 06 · Model Context Protocol**

---

## 1. Objetivos de Aprendizaje
Al finalizar la lección, el participante será capaz de:
- Identificar los casos de uso, capacidades y riesgos de los 6 servidores esenciales: GitHub, Filesystem, Playwright, PostgreSQL, Linear y Custom Servers.
- Evaluar los requisitos de seguridad y permisos mínimos (Least Privilege) para cada integración.
- Inspeccionar esquemas JSON-Schema oficiales de herramientas MCP en tiempo real.
- Reconocer la configuración estándar en `mcp_config.json` para entornos de desarrollo y staging.

## 2. Duración y Distribución Temporal (Total: 65 minutos · Martes 20 de Octubre)
- **00–10 min:** Panorama de servidores MCP y criterios de selección (Least Privilege, madurez, rendimiento).
- **10–35 min:** La tríada central: GitHub MCP (código y PRs), Filesystem MCP (jail y sandbox local) y Playwright MCP (E2E browser).
- **35–45 min:** Datos y productividad: Supabase/PostgreSQL, Linear y Servidores Personalizados corporativos.
- **45–60 min:** Explorador interactivo de servidores: simulación de peticiones JSON-RPC, esquemas y diagnóstico.
- **60–65 min:** Comprobación socrática, síntesis del ecosistema y cierre de la Sesión 1 (Martes).

## 3. Conceptos Técnicos Fundamentales
- **JSON-Schema en MCP:** Estructura que define propiedades requeridas, tipos primitivos y descripciones semánticas que guían al LLM.
- **Frontera de Sandbox en Filesystem:** Restricción de rutas absolutas para evitar que el agente acceda a archivos sensibles del sistema operativo.
- **Browser Automation Headless:** Control no interactivo de Chromium vía Playwright MCP para validación visual de rutas frontend.
- **Read-Only Replicas:** Principio de conectar servidores de bases de datos MCP exclusivamente a réplicas de lectura.

## 4. Guion del Instructor: Qué decir en cada sección

### Sección 1: Tríada de Desarrollo (GitHub + Filesystem + Playwright)
> *"Un agente de software moderno no es un chatbot; es un colega de pair-programming. Con Filesystem MCP lee el código de su máquina local. Con GitHub MCP consulta los pull requests y las ramas del equipo. Y con Playwright MCP levanta un navegador Chromium, visita localhost:4200 y comprueba con sus propios ojos si el botón que acaba de maquetar funciona o arroja un error en consola."*

### Sección 2: Seguridad y Mínimo Privilegio (Least Privilege)
> *"Regla de oro de arquitectura: nunca le den a un servidor MCP un token de GitHub con permisos de Administrador de Organización, ni una cadena de conexión con el usuario 'postgres' superuser. Si el agente solo necesita leer issues, el token de GitHub debe tener permisos de solo lectura sobre Issues. Si necesita consultar la base de datos, conéctenlo a una réplica con 'GRANT SELECT ON TABLES'. Si el agente se equivoca, la arquitectura contiene el daño."*

## 5. Preguntas para Activar al Grupo
1. *"¿Qué riesgo corremos si ejecutamos el servidor de Filesystem pasándole como directorio raíz 'C:\\' en Windows o '/' en Linux?"*
   - *Respuesta esperada:* El agente tendría acceso a leer claves SSH, archivos de contraseñas y archivos del sistema operativo, violando el principio de Least Privilege.
2. *"¿Por qué es preferible usar Playwright MCP en lugar de pedirle al modelo que adivine si una interfaz funciona?"*
   - *Respuesta esperada:* Porque Playwright MCP provee evidencia empírica real (DOM renderizado, errores de consola, capturas de pantalla) en lugar de alucinaciones.

## 6. Guion de Demostración del Playground (Explorador Interactivo)
1. Navegar a la sección del **Explorador Interactivo de Servidores MCP**.
2. Seleccionar la pestaña **GitHub MCP**.
3. Seleccionar la herramienta `get_file_contents`.
4. Mostrar en la columna izquierda cómo el esquema JSON-Schema exige `owner`, `repo` y `path`.
5. Modificar intencionalmente el editor de argumentos eliminando la propiedad `repo`.
6. Hacer clic en **Ejecutar Simulación Educativa**.
7. Resaltar cómo el sistema rechaza la llamada con error de validación antes de transmitirla.
8. Restaurar el argumento válido y ejecutar nuevamente, destacando la respuesta estructurada y el tiempo de respuesta en milisegundos.
9. Repetir la demostración seleccionando **Playwright MCP** con `browser_navigate` hacia `http://localhost:4200/academy/home`.

## 7. Errores Conceptuales Frecuentes
- **Error:** Pensar que para usar Playwright MCP el estudiante debe escribir código de pruebas en TypeScript.
  - *Aclaración:* El servidor MCP expone herramientas declarativas (`browser_navigate`, `browser_click`). El modelo de IA o el runtime decide qué herramientas invocar según la meta del usuario.
- **Error:** Creer que un servidor custom requiere semanas de desarrollo.
  - *Aclaración:* Con el MCP SDK oficial de TypeScript o Python, un servidor MCP completo con 2 tools se escribe en menos de 40 líneas de código.

## 8. Actividad de Comprobación
- Pedir al grupo que indique qué servidor MCP utilizarían si su objetivo fuera verificar que el despliegue en staging no arrojó errores 404 en la consola web del navegador.
- *Respuesta correcta:* Playwright MCP (mediante `browser_navigate` y `browser_console_logs`).

## 9. Transición a la Siguiente Lección
> *"Ahora que conocemos las capacidades de cada servidor, en la Lección 03 aprenderemos la parte operativa: cómo instalarlos, configurarlos en stdio y Streamable HTTP, diagnosticar problemas frecuentes y gestionar las compuertas de seguridad."*
