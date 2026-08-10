# Lab 03 — Build the Minimum Useful Context (Instructor Guide)

## Engineering Problem
El problema central del contexto no es qué decirle a la IA, sino **qué información necesita tener disponible la IA para que pueda tomar la decisión correcta**. Los estudiantes deben dejar de escribir "prompts gigantes" estáticos a mano y empezar a diseñar **Context Manifests** (especificaciones de datos que un backend ensamblaría en runtime).

## Learning Objectives
- Cambiar el paradigma mental del ingeniero de *"¿Qué le digo al modelo?"* (M02) hacia *"¿Qué necesita saber el modelo?"* (M03).
- Identificar y diferenciar contexto relevante de contexto necesario (Minimum Useful Context).
- Diseñar un *Context Manifest* que priorice las piezas de información basándose en relevancia y recencia, previendo una estrategia de truncamiento.

## Scenario
El estudiante retoma la tarea corporativa que ha estado evolucionando (Lab 01, Lab 02). Su contrato de instrucciones (Prompt) ahora es sólido, pero la tarea exige información del estado actual de la empresa (ej. si es un refactor de código, necesita el árbol de dependencias; si es atención al cliente, necesita el perfil del usuario). Su misión no es escribir el prompt, sino definir la tubería de datos (data pipeline) que alimentará a ese prompt.

## Constraints
- **Trabajo local:** Toda la experimentación debe hacerse en sus propios repositorios/casos de uso.
- **Sin prompts:** En este laboratorio está prohibido escribir las instrucciones de comportamiento. Solo escribirán estructura de datos y metadatos.

## Starting Point
El estudiante debe abrir su editor y crear un archivo `context-manifest.json` o `.md` asociado a la tarea que automatizó en el Lab 02.

## Engineering Decision (El Núcleo del Lab)
El estudiante debe estructurar su manifiesto de contexto tomando tres decisiones críticas:
1. **Identificación (Anatomy):** ¿Cuáles son las 3 a 5 piezas de información que el sistema forzosamente debe inyectar para que el contrato (Lab 02) no alucine?
2. **Jerarquía (Assembly):** Asignar una prioridad del 1 al 5 a cada pieza. ¿Qué se elimina primero si nos quedamos sin límite de tokens?
3. **Compresión:** ¿Cómo se transformará la información cruda antes de inyectarla? (ej. "En lugar del objeto JSON completo de la Base de Datos, extraeremos solo las claves `id`, `status` y `last_updated`").

## Autonomy Test
¿Si el sistema backend trunca (elimina) la prioridad 4 y 5 de este manifiesto debido a limitaciones de espacio, el LLM todavía es capaz de devolver un resultado seguro (aunque sea parcial o indique "falta información"), o fallará catastróficamente inventando datos?

## Tool Contract
El estudiante no necesita ejecutar esto obligatoriamente contra una IA; es un ejercicio de arquitectura de software. Pueden, sin embargo, simular el impacto construyendo el payload final y pasándolo a su herramienta (Copilot/Claude) para verificar si la compresión semántica retuvo suficiente información.

## Guardrails
La advertencia crítica del instructor: "Si incluyen en su manifiesto 'Recuperar todos los logs del último mes', automáticamente reprobaron. Exijo densidad. Extraigan y resuman primero."

## Human-in-the-Loop
Pide a los estudiantes que intercambien sus *Context Manifests* con un compañero. El compañero actuará como el "truncador", tachando la información de menor prioridad, y preguntándole al autor original si su LLM sobreviviría con los restos.

## Failure & Recovery
Si al simular el contexto mínimo el modelo falla, el estudiante debe identificar el *Context Gap* (¿qué información faltaba?) y reajustar el manifiesto en lugar de intentar añadir reglas gramaticales complejas al *prompt*.

## Expected Artifact
Un **Context Manifest**.
Ejemplo de estructura esperada:
```yaml
task_id: "code-review-bot"
budget: 8000_tokens
context_sources:
  - priority: 1 (Critical)
    source: "Git diff of current PR"
    compression: "Remove unchanged code lines"
  - priority: 2 (High)
    source: "Linter errors for modified files"
    compression: "Extract only line number and error code"
  - priority: 3 (Medium)
    source: "Company wide style-guide"
    compression: "Filter only rules related to the languages in the PR"
```

## Instructor Guidance
### Cómo iniciar el Lab:
Explica el cambio de rol: "Hasta ayer, eran psicólogos intentando convencer a un modelo de que se portara bien (Prompting). Hoy, son ingenieros diseñando el payload de la API. El contexto es un problema de ingeniería de información y orquestación: debemos decidir qué información llega al modelo, en qué forma, con qué prioridad y bajo qué presupuesto. Céntrense en los datos, no en las palabras."

### Mientras trabajan:
Pregunta en voz alta: "¿Están seguros de que necesitan todo el documento? ¿Pueden transformarlo en un diccionario clave-valor en Python antes de enviarlo al modelo?"

## Common Student Mistakes
- Seguir iterando sobre las instrucciones ("actúa como un experto...") en lugar de enfocarse en los datos requeridos.
- Confundir "relevante" con "necesario", incluyendo repositorios completos solo porque pertenecen al mismo proyecto.

## Review Checklist
Antes de cerrar la clase, valida rápidamente con la audiencia:
- [ ] ¿Quién implementó una técnica de pre-procesamiento/compresión (como *minifying* o *filtering*) en su manifiesto?
- [ ] ¿Quién asignó un orden de prioridad estricto para prever escenarios donde la ventana se sature?

## Discussion Questions
Para cerrar el Lab y preparar el siguiente módulo:
- "Su Context Manifest dice: 'Buscar la guía de estilo aplicable'. Si su empresa tiene 5,000 documentos en Confluence, ¿cómo va a saber su programa de backend cuál es el documento correcto para inyectar en este contexto sin hacer que un humano lo busque manualmente?"

## Extension Exercise
*(Puente a M04)*: Pedirles que esbocen pseudocódigo que realice una consulta a una base de datos para intentar satisfacer una de las piezas prioritarias de su *Context Manifest*.
