# Lab 05 — Design an Agentic Workflow (Instructor Guide)

## Engineering Problem
La industria de la IA sufre de un sesgo por la innovación excesiva: los ingenieros usan LLMs con bucles autónomos para tareas que podrían resolverse con `if/else`, introduciendo latencia masiva, altos costos y fallos de seguridad (superficie de fallo expandida) donde no era necesario.

## Learning Objectives
- Aplicar el principio de **Least Autonomy Necessary** a un problema corporativo real.
- Aprender a descartar soluciones simples con evidencia técnica antes de elegir una solución compleja (Agente).
- Diseñar una **Agent Specification** rigurosa enfocada en la mitigación de riesgos (Guardrails, Max Iterations, HITL) en lugar de centrarse solo en el "prompting".

## Scenario
El estudiante actúa como Arquitecto de Sistemas. Va a retomar la tarea corporativa de sus Labs anteriores (M01-M04). Su misión es diseñar el sistema orquestador final que conectará todo. Pero antes de programar un agente con sus herramientas, debe demostrarle al CTO (el instructor) que la autonomía es estrictamente necesaria.

## Constraints
- **Trabajo local:** Creación de un documento de arquitectura `workflow-spec.md`.
- **Justificación Obligatoria:** Si el estudiante no puede probar que el *Fixed Pipeline* o la *State Machine* fallarían en su caso de uso, no se le permite diseñar el Agente.

## Starting Point
Crear un archivo `workflow-spec.md` con la siguiente tabla de evaluación obligatoria.

### Fase 1: La Decisión (Autonomy Test)
El estudiante debe llenar esta tabla:

| Solución arquitectónica | ¿Es suficiente para la tarea? | ¿Por qué? (Evidencia de fallo/éxito) |
| ----------------------- | ----------------------------- | ------------------------------------- |
| **Fixed Pipeline**      | (Sí/No)                       | (Justificación técnica)               |
| **State Machine**       | (Sí/No)                       | (Justificación técnica)               |
| **Agent (Autonomous)**  | (Sí/No)                       | (Justificación de la variabilidad)    |

## Engineering Decision (El Núcleo del Lab)
**SOLO SI** el *Fixed Pipeline* y la *State Machine* quedan descartados mediante evidencia sólida (ej. "Las rutas de resolución son imposibles de mapear anticipadamente porque dependen de variables del mundo real no predecibles"), el estudiante avanza a la Fase 2.

### Fase 2: Design the Agent Specification
El estudiante debe diseñar la especificación técnica del agente. Aquí no evaluamos su capacidad de escribir prompts ("Eres un asistente útil"), sino su capacidad para limitar el daño:

1. **Core Instruction (Intent):** El límite rígido del comportamiento esperado.
2. **Tool Contracts:** Nombres exactos, parámetros (JSON Schema) y propósitos de las funciones permitidas.
3. **State:** ¿Qué variables se arrastran en cada vuelta del bucle?
4. **Guardrails & Abort Conditions:** ¿Bajo qué condición técnica el agente debe detenerse inmediatamente (Circuit Breaker)?
5. **Max Iterations:** Número máximo de ciclos permitidos antes de matar el proceso.
6. **Retry Policy:** ¿Qué pasa si una herramienta falla? ¿Intentar de nuevo, intentar con otra herramienta, o abortar?
7. **Failure / Recovery (HITL):** Si el agente se rinde o alcanza el límite, ¿cómo escala la decisión a un humano (Human-in-the-Loop)?

## Tool Contract
El estudiante entregará la tabla de decisión y, si procede, la especificación de diseño arquitectónico. Puede escribir pseudocódigo, pero no código ejecutable directo.

## Guardrails
La advertencia crítica del instructor: "Si diseñan un Agente y su campo de 'Max Iterations' está vacío, o su 'Retry Policy' dice 'Dejar que el modelo decida', han introducido una vulnerabilidad crítica de denegación de servicio (DDoS financiero) en su empresa."

## Human-in-the-Loop
Intercambio de especificaciones. Un compañero revisará la Tabla de Decisión de otro. El objetivo del compañero es actuar como un "Abogado del Diablo": intentar convencer al autor de que su tarea *sí* se puede resolver con una *State Machine*, ahorrando dinero a la empresa.

## Failure & Recovery
Si un estudiante justifica un Agente diciendo "Es más moderno" o "Es más fácil que programar todos los if/else", el instructor debe reprobar ese diseño. La "pereza" del desarrollador no justifica aumentar exponencialmente la superficie de fallo de la aplicación.

## Expected Artifact
Un documento `workflow-spec.md` que contenga la Tabla de Justificación y (si se justificó la autonomía) la *Agent Specification* completa.

## Instructor Guidance
### Cómo iniciar el Lab:
"Hasta hoy, aprendieron a construir capacidades: contratos lógicos, manejo de contexto y recuperación de información. Hoy van a aprender a ponerles frenos. Quiero que sean sumamente críticos. Destruyan la necesidad de autonomía. Solo usen un agente si el problema se defiende por sí solo."

### Mientras trabajan:
Camina por el aula preguntando: "¿Tu agente tiene permiso para escribir/borrar datos? ¿Qué pasa si entra en un bucle infinito borrando cosas diferentes cada segundo? Muéstrame tu 'Abort Condition'."

## Common Student Mistakes
- Escribir Prompts extensos en el campo de "Core Instruction" y dejar en blanco los "Guardrails".
- Forzar el uso de un agente en la tabla de decisión inventando casos de borde irrealistas solo para usar la tecnología "cool".

## Review Checklist
Antes de cerrar la clase:
- [ ] ¿Quién descubrió que su proyecto final en realidad no necesita un Agente y que un Pipeline es suficiente? (Celebra esto como una victoria de ingeniería suprema).
- [ ] ¿Quién incluyó un Human-In-The-Loop (escalado a un empleado real) como condición final de fallo en su especificación?

## Discussion Questions
Para cerrar el Lab y preparar el siguiente módulo:
- "Han diseñado agentes que toman decisiones bajo reglas estrictas. Pero, ¿qué pasa si en lugar de aplicar esto a problemas de negocio (procesar facturas), se lo aplicamos a nuestro propio trabajo? ¿Podemos diseñar un agente cuya única 'herramienta' sea ejecutar comandos en nuestra terminal, escribir código, leer los errores del compilador y auto-corregirse?"

## Extension Exercise
*(Puente a M06)*: Pedirles que imaginen cuáles serían las "Tools" (Tool Contracts) que necesitaría un Agente de IA para operar como un Ingeniero de Software Junior autónomo. (Respuestas esperadas: `list_dir`, `read_file`, `write_file`, `run_bash_command`).
