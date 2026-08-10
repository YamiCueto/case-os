# Lab 06 — Design an Agentic SWE Protocol (Instructor Guide)

## Engineering Problem
Los ingenieros jóvenes están utilizando herramientas de IA para generar miles de líneas de código bajo el pretexto de "ir rápido", y fusionándolas (merge) en repositorios corporativos sin comprender los efectos secundarios de esos cambios. El *Code Review* se ha vuelto ineficiente porque el autor humano del *Pull Request* no entiende cómo funciona el código que él mismo "escribió".

## Learning Objectives
- Diseñar un sistema operativo formal (Protocolo) para cambios asistidos por IA.
- Separar explícitamente el rol de *Delegación (Diseño)* del rol de *Verificación (QA)*.
- Generar un **Paquete de Evidencia (Evidence Package)** documentado que demuestre control absoluto sobre la IA.

## Scenario
El estudiante actúa como un Tech Lead que debe redactar la política oficial de su equipo para usar herramientas de IA generativa sobre el código de la empresa. Ya saben cómo funcionan los contratos (M02), cómo manejar el contexto (M03), cómo la IA busca (M04) y el riesgo de los bucles (M05). Ahora deben condensar eso en un protocolo paso a paso para un compañero junior que está a punto de resolver un *Bug*.

## Constraints
- **Trabajo local:** Creación de un documento Markdown `agentic-swe-protocol.md`.
- **Enfoque Sistémico:** El laboratorio no es para escribir *prompts*, sino para diseñar los pasos de verificación y responsabilidad humana alrededor del LLM.

## Starting Point
Crear un archivo `agentic-swe-protocol.md` y un esqueleto del **Evidence Package**.

## Engineering Decision (El Núcleo del Lab)
El estudiante debe rellenar y justificar las siguientes secciones obligatorias de su protocolo:

### 1. Baseline Before AI
Antes de abrir el chat con la IA, ¿qué debe documentar el ingeniero?
*(Ej: Estado actual, Tests que fallan, Warnings del Linter, Estado de Git, Limitaciones conocidas).*

### 2. Context Boundary (M03 + M06)
¿Qué piezas específicas del repositorio se le darán a la IA para que las vea, y qué piezas se le ocultarán expresamente para evitar expansiones de alcance?

### 3. Change Scope
¿Qué archivos tiene permiso de modificar la IA y qué arquitecturas están fuera de los límites?

### 4. Acceptance Criteria
¿Cómo sabremos matemáticamente/funcionalmente que el agente terminó su trabajo correctamente?

### 5. Verification
¿Qué scripts de CI, tests unitarios o revisiones manuales de seguridad se ejecutarán sobre el *Diff* generado?

### 6. Human Review
¿Qué preguntas debe responder obligatoriamente el ingeniero humano al leer el Diff generado por la IA? *(Ej: ¿Entiendo la sintaxis? ¿Cambió librerías no solicitadas?)*

### 7. Rollback
Si la revisión falla, ¿cuál es el procedimiento exacto para descartar la alucinación del Agente y volver a un estado limpio? *(Ej: `git reset --hard` no es suficiente si el agente instaló dependencias globales).*

## Autonomy Test
Si el equipo sigue este protocolo estrictamente, ¿puede el Agente de Código causar un incidente en producción? Si la respuesta es sí, el protocolo es débil en las fases de *Verification* o *Human Review*.

## Expected Artifact
Al final, el estudiante debe entregar un prototipo de su **Evidence Package**. Es el reporte que el ingeniero debería adjuntar en el *Pull Request*.
Debería verse así:
```text
ISSUE: #104 Memory Leak en Auth.
CONTEXT MANIFEST: AuthController.ts, SessionManager.ts.
INSTRUCTION: "Fix the leak without changing Redis dependencies."
GENERATED DIFF: (+12 lines, -4 lines in SessionManager.ts)
TEST RESULTS: PASS (Coverage 94%)
REVIEW CHECKLIST: 
 [x] Entiendo el código.
 [x] No hay dependencias nuevas.
DECISION: ACCEPT
```

## Guardrails
La advertencia crítica del instructor: "Si su protocolo dice 'Mirar el código por encima y si parece bien hacer commit', ustedes serán reemplazados por una máquina pronto, porque están aportando cero valor de ingeniería."

## Human-in-the-Loop
Pide a los estudiantes que lean el *Evidence Package* de un compañero. El revisor debe buscar fisuras lógicas: "¿Qué pasa si la IA modificó el `package.json` pero tú no lo pusiste en tu *Review Checklist*? El paquete de evidencia es inválido."

## Failure & Recovery
Si un estudiante se atasca intentando diseñar el "prompt perfecto" dentro del protocolo, detenlo. El protocolo debe asumir que el LLM fallará tarde o temprano. El diseño del protocolo es la red de seguridad para capturar ese fallo.

## Instructor Guidance
### Cómo iniciar el Lab:
"M06 cierra aquí. Ustedes ya no son tipógrafos. Son Arquitectos y Supervisores (QA). La herramienta de IA escribirá más rápido que ustedes, pero ustedes cobrarán su sueldo por la rigurosidad de su Paquete de Evidencia. Diseñemos el proceso."

### Mientras trabajan:
Valida las reglas de **Rollback**. Muchos olvidan que los agentes con herramientas de sistema de archivos (File System) pueden haber borrado cosas accidentalmente. La dependencia de Git como única red de salvamento debe discutirse.

## Common Student Mistakes
- Omitir el paso del *Context Boundary*, permitiendo que el Agente "lea todo el repositorio" por defecto, violando el principio de Least Autonomy Necessary.
- Confundir la *Verificación* (ejecución de tests) con el *Human Review* (comprensión y auditoría del diseño). Ambos son necesarios.

## Review Checklist
Antes de cerrar la clase:
- [ ] ¿Quién diseñó un mecanismo claro para obligar al ingeniero a justificar por qué la IA modificó un archivo que no estaba en el *Change Scope*?
- [ ] ¿Se interiorizó la diferencia crítica entre delegar el "tipeo" y retener la responsabilidad arquitectónica?

## Discussion Questions
Para cerrar el módulo:
- "Si construyen este nivel de rigor en su día a día, el código generado por IA será más seguro que el código escrito a mano. Pero, ¿qué pasa si queremos orquestar este nivel de verificación con herramientas externas, usando un estándar abierto y conectándolo a sistemas de producción corporativos? M07 y M08 nos esperan."

## Extension Exercise
*(Puente a M07/M08)*: El curso lleva una progresión impecable:
`M02 (Instruction Contract) -> M03 (Context Manifest) -> M05 (Agent Contract) -> M06 (Software Change Protocol)`.
Pide a los estudiantes que reflexionen sobre qué falta. (Respuesta esperada: Estandarización de protocolos de comunicación con herramientas corporativas - MCP, y despliegues seguros en producción).
