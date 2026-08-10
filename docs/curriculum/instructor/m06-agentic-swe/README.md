# Module 06: Agentic Software Engineering

## MODULE BRIEF

**Purpose**
Aplicar todo el marco teórico de IA generativa (M01-M05) al propio ciclo de vida del desarrollo de software. Demostrar que Agentic SWE no consiste en dejar que la IA programe sola, sino en transformar al programador en un diseñador del cambio: **El ingeniero define el objetivo, las restricciones, el contexto y los criterios de aceptación; el sistema de IA puede generar o modificar código, pero el ingeniero conserva la responsabilidad sobre la decisión, la verificación y la aceptación del cambio.**

**Prerequisites**
Módulo 05 (AI Agents). El estudiante debe comprender que la autonomía (observar, decidir, accionar) incrementa la superficie de fallo. Ahora aplicaremos ese riesgo a un entorno donde los efectos secundarios son código real.

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Discernir qué nivel de autonomía usar para una tarea de código (desde un simple autocomplete hasta una refactorización autónoma).
- Orquestar el ciclo de colaboración `Goal → AI System → Diff → Verification → Human Review`.
- Comprender cómo los sistemas de IA ensamblan el contexto de un repositorio antes de inyectarlo al LLM.
- Diseñar un protocolo de cambio (*Agentic SWE Protocol*) y generar un Paquete de Evidencia (*Evidence Package*).

**Suggested duration**
2 horas teóricas + 1.5 horas de Real Engineering Lab.

**Teaching strategy**
Romper la fantasía de "IA programadora que te reemplazará" y aterrizarla en la dura realidad de la ingeniería de software: el código generado es código heredado (legacy) en el momento en que se escribe. El instructor debe ser inflexible en exigir **verificación**. Si el código funciona pero el estudiante no sabe revertirlo o explicar sus efectos secundarios, el ejercicio está reprobado.

**Concept dependencies**
- **Instruction Contract (M02) & Context Manifest (M03)**: Estas piezas ahora se integran de forma nativa en la especificación del cambio de software.
- **Agent Loop (M05)**: El sistema de IA itera leyendo errores del compilador, pero el ingeniero controla el límite.

**Curriculum Components**
- [Lesson 01: From Completion to Agents](./lesson-01.md)
- [Lesson 02: Human-Agent Collaboration](./lesson-02.md)
- [Lesson 03: Repository Context](./lesson-03.md)
- [Demo 06: The AI-Assisted Change](./demo-06.md)
- [Lab 06: Design an Agentic SWE Protocol](./lab-06.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "El humano deja de ser solamente productor de código y pasa a ser diseñador del cambio."
M06 es el momento cumbre donde los módulos previos se conectan:
`M02 (Instruction) → M03 (Context) → M05 (Agent Contract) → M06 (Software Change Protocol) → M08 (Production Verification)`.
Demuestra que no estamos acumulando "trucos de ChatGPT", sino construyendo controles de ingeniería alrededor de un sistema probabilístico.

**Qué NO explicar todavía**
- No entraremos en CI/CD automatizado guiado por IA, ni en pipelines de despliegue autónomo a producción masiva. Esos son problemas de **M08 (Production AI)**. Aquí el alcance es el entorno de desarrollo local/repositorio.

**Common misconceptions (Errores comunes de estudiantes)**
- *“El Agente de código es mejor que el Autocomplete porque es más avanzado.”* (Falso: Son herramientas diferentes. Autocomplete es perfecto para una línea; un Agente es para investigación de bugs. Autonomía justificada).
- *“Si los tests pasan, el código generado por IA es perfecto.”* (Falso: La IA puede haber borrado dependencias sutiles o introducido comportamientos no solicitados que los tests actuales no cubren).

**Module transition (Hacia M07 y M08)**
Cierre vital para el arco narrativo del curso: 
> "Ahora sabemos cómo orquestar la colaboración entre nosotros y un sistema de IA para modificar nuestro código de forma segura y auditable. Pero todo este tiempo hemos usado herramientas que ya venían programadas por terceros (como los IDEs). ¿Qué pasa si queremos que nuestra IA corporativa hable con nuestra base de datos, nuestro Jira y nuestro Slack usando un lenguaje universal? Entraremos a **M07 (MCP & Tool Integration)**, la estandarización del control."
