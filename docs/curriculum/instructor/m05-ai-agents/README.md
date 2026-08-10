# Module 05: AI Agents

## MODULE BRIEF

**Purpose**
Enseñar a los estudiantes a justificar matemáticamente y arquitectónicamente la necesidad de autonomía en un sistema de IA, bajo el principio rector de **Least Autonomy Necessary** (La menor autonomía necesaria). Romper el mito de que "si puedo construir un agente, debería construir un agente".

**Prerequisites**
Módulo 04 (Retrieval). Los estudiantes ya saben buscar conocimiento a escala. Ahora enfrentan el problema de qué hacer cuando el sistema no solo debe "saber", sino "actuar" o "decidir dinámicamente" el siguiente paso.

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Diferenciar cuándo usar un **Fixed Pipeline**, una **State Machine**, o un **Agente Autónomo**, justificándolo como una decisión técnica y no como una escalera obligatoria.
- Diseñar Tool Calling como un contrato estricto donde la IA propone, pero el Backend valida y ejecuta.
- Operar el ciclo `INTENT → ACTION → OBSERVATION → STATE UPDATE` sin confundirlo con razonamiento cognitivo humano.
- Cuantificar que **cada incremento de autonomía incrementa exponencialmente la superficie de fallo**, el coste, la latencia y la complejidad operativa.

**Suggested duration**
2 horas teóricas + 1 hora de Real Engineering Lab.

**Teaching strategy**
Evita el antropomorfismo. Un agente no "piensa y decide" como un empleado; ejecuta un bucle de *inferencia* condicionado por el estado. El instructor debe ser el crítico más duro de la autonomía: si un estudiante propone un agente para hacer un pipeline lineal (ej. leer correo -> extraer factura -> guardar en BD), el instructor debe reprobar ese diseño por sobre-ingeniería innecesaria.

**Concept dependencies**
- **Instruction Contracts (M02)**: El Agente opera bajo reglas estrictas.
- **Context Manifest (M03)**: Las observaciones de las herramientas alteran dinámicamente el contexto disponible.

**Curriculum Components**
- [Lesson 01: Workflows vs Agents](./lesson-01.md)
- [Lesson 02: Tool Calling](./lesson-02.md)
- [Lesson 03: The Agent Loop](./lesson-03.md)
- [Demo 05: The Agent Loop](./demo-05.md)
- [Lab 05: Design an Agentic Workflow](./lab-05.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "La autonomía es una capacidad cara y riesgosa que se justifica, no un default."
Cada grado de libertad que le das al LLM en un bucle aumenta la probabilidad de que entre en un loop infinito, de que ejecute herramientas erróneas, y de que el coste de inferencia se dispare. Debe estar justificado por la incertidumbre intrínseca de la tarea.

**La Regla Transversal (Aplicable a cada lección)**
> **Cada incremento de autonomía incrementa la superficie de fallo.**
Más autonomía significa más *tool calls*, más estados posibles, mayor latencia, más dificultad de *testing*, más efectos secundarios y mayor necesidad de observabilidad (rollbacks). Convertiremos la autonomía en una decisión de ingeniería cuantificable.

**Qué NO explicar todavía**
- No profundices en cómo asegurar un clúster donde corre el código del agente (Sandboxing severo) ni en protocolos de conexión como MCP (Model Context Protocol). Esos son los núcleos de **M07 (MCP & Tool Integration)** y **M08 (Production AI)**. Aquí nos centramos en el *Contrato Lógico*.

**Common misconceptions (Errores comunes de estudiantes)**
- *“Un agente es inteligente porque piensa por sí solo.”* (Falso: es un bucle `while` alrededor de un LLM que escupe JSON).
- *“El LLM llama a mi base de datos.”* (Falso: el LLM *propone* texto; tu código de backend recibe ese texto, valida si es seguro, y llama a la base de datos).

**Module transition (Hacia M06)**
Cierre vital para el arco narrativo del curso: 
> "Ahora sabemos cómo darle a un modelo las herramientas y el estado para iterar hasta resolver un problema. Pero si aplicamos esto al propio ciclo de desarrollo de software, ¿puede un agente escribir código, probarlo, leer el error del compilador y corregirlo? En el Módulo 06, Agentic Software Engineering, veremos cómo esto cambia la forma en que los humanos desarrollamos software."
