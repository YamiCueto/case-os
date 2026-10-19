# Guía del Instructor — Lección 04: MCP Integrado con Agentes de IA
**Módulo 06 · Model Context Protocol**

---

## 1. Objetivos de Aprendizaje
Al finalizar la lección, el participante será capaz de:
- Integrar servidores MCP en agentes autónomos basados en el patrón ReAct (Thought → Action → Observation).
- Diseñar la capa de enrutamiento dinámico (Agent Dispatcher) para coordinar múltiples servidores MCP en paralelo.
- Manejar la inyección de observaciones en el contexto del agente evitando el desbordamiento de la ventana de contexto.
- Aplicar compuertas de gobernanza y aprobación humana (HITL) ante operaciones con efectos secundarios permanentes.
- Construir una solución completa a un caso de estudio real de software: ticket en Linear → inspección en Filesystem → parche en GitHub → verificación en Playwright.

## 2. Duración y Distribución Temporal (Total: 60 minutos · Jueves 22 de Octubre)
- **00–15 min:** Conectar MCP con el Agent Loop de M05 (patrón ReAct extendido, tabla hash de enrutamiento y Agent Dispatcher).
- **15–35 min:** Flujo multi-MCP y simulación en vivo en el Playground: Orquestador visual Multi-MCP paso a paso.
- **35–50 min:** Aplicación al agente de resolución de tickets corporativos: Linear → Filesystem → GitHub → Playwright con compuerta HITL.
- **50–60 min:** Preparación, roles por célula y criterios de aceptación para el Laboratorio Final Capstone del Sábado.

## 3. Conceptos Técnicos Fundamentales
- **Multi-MCP Agent Loop:** Ciclo iterativo donde el LLM elige herramientas que pertenecen a diferentes servidores MCP; el runtime enruta cada llamada al cliente correspondiente.
- **Agent Dispatcher:** Módulo middleware en el Host que mantiene la tabla hash de `{ tool_name -> server_client }`.
- **Compuerta Human-in-the-Loop (M05 Guardrail):** Estado de pausa determinista `PAUSED_FOR_APPROVAL` que congela la ejecución hasta que una clave criptográfica o un operador humano valida la acción.
- **Evidencia Estructurada de Ejecución:** Trazabilidad inmutable que enlaza el issue de origen, el commit de Git y la captura de pantalla de verificación E2E.

## 4. Guion del Instructor: Qué decir en cada sección

### Sección 1: El Salto Cualitativo desde M05
> *"En el módulo anterior (M05), construimos agentes V2 a V6. Aprendimos cómo el modelo piensa antes de actuar, cómo guarda memoria de corto plazo y cómo evalúa sus resultados. Pero aquellas herramientas eran código estático en nuestra aplicación. Hoy damos el salto definitivo: nuestro agente ahora es un director de orquesta. No necesita saber programar en Git o comunicarse con Chromium; simplemente despacha órdenes estructuradas a los servidores especializados a través de MCP."*

### Sección 2: El Caso del Ticket ISSUE-402
> *"Fíjense en el flujo que vamos a ver en el playground: el agente no adivina. Primero consulta el ticket en Linear para entender qué falla. Luego va al código fuente local vía Filesystem MCP y encuentra la fuga de memoria. Diseña el parche, pero antes de hacer git push, se frena y nos pregunta: '¿Autorizas crear este PR?'. Le decimos que sí. Crea el PR en GitHub MCP, y luego abre Playwright MCP para comprobar que la pantalla de login sigue funcionando. Eso es ingeniería agéntica profesional."*

## 5. Preguntas para Activar al Grupo
1. *"¿Por qué es una mala práctica dejar que el agente cree y fusione (merge) un Pull Request a producción sin intervención humana?"*
   - *Respuesta esperada:* Por el principio de contención de fallos y responsabilidad de ingeniería. La IA puede producir el cambio, pero la aprobación final pertenece al proceso de ingeniería (Deployment Gate).
2. *"Si el servidor de Filesystem devuelve un archivo de 50,000 líneas de código, ¿qué problema enfrentaría el agente y cómo debe mitigarlo el Host?"*
   - *Respuesta esperada:* Desbordamiento de la ventana de contexto y degradación de atención (Lost in the Middle). El Host debe truncar, paginar o resumir la observación antes de inyectarla al LLM.

## 6. Guion de Demostración del Playground (Orquestador Visual)
1. Abrir en la lección la sección **Orquestador Visual de Agente + Múltiples Servidores MCP**.
2. Mostrar la barra superior de 4 servidores: `Linear MCP`, `Filesystem MCP`, `GitHub MCP` y `Playwright MCP`.
3. Avanzar al **Paso 1 (Pensamiento)**: Mostrar el razonamiento del agente analizando el ticket `ISSUE-402`.
4. Avanzar al **Paso 2 (Linear MCP)**: Notar cómo la tarjeta de Linear se ilumina en amarillo (`PROCESANDO`) y la observación del ticket entra al contexto.
5. Avanzar al **Paso 4 (Filesystem MCP)**: La tarjeta de Filesystem se ilumina en verde (`PROCESANDO`) y el código del worker se lee en el sandbox.
6. Avanzar al **Paso 5 (Compuerta HITL)**:
   - Resaltar que el botón **Avanzar Bucle** se encuentra deshabilitado.
   - Explicar la regla: el runtime protege el repositorio.
   - Hacer clic en **✓ Aprobar Creación de Pull Request**.
7. Avanzar al **Paso 6 (GitHub MCP)** y luego al **Paso 7 (Playwright MCP)**:
   - Observar cómo Playwright navega a `localhost:4200/login` y valida el resultado.
8. Culminar en el **Paso 8**: Evidencia completa recopilada.

## 7. Errores Conceptuales Frecuentes
- **Error:** Creer que el agente necesita una conexión independiente con cada herramienta.
  - *Aclaración:* El agente solo habla con el Host; es el Host quien mantiene los clientes MCP conectados a los servidores.
- **Error:** Suponer que las herramientas solo pueden llamarse de una en una.
  - *Aclaración:* Modelos avanzados soportan Parallel Tool Calling, permitiendo que el LLM emita varias llamadas simultáneas a diferentes servidores MCP en un solo paso.

## 8. Actividad de Comprobación
- Pedir al grupo que describa en 3 viñetas qué servidores MCP conectarían a un agente para automatizar la migración de un esquema de base de datos relacional.
- *Respuesta esperada:* PostgreSQL/Supabase MCP (para leer el esquema actual y aplicar la migración), Filesystem MCP (para escribir el archivo de migración SQL) y GitHub MCP (para versionar la migración en una rama).

## 9. Transición al Laboratorio Final Capstone
> *"Hemos llegado al momento culminante de toda la formación. En el Laboratorio Final Capstone integrarán sus agentes existentes con un servidor MCP real, documentarán sus 7 entregables obligatorios y cerraremos formalmente las capacitaciones de CASE OS con fecha límite del 24 de octubre de 2026."*
