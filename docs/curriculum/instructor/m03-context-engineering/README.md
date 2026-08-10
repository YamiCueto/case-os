# Module 03: Context Engineering

## MODULE BRIEF

**Purpose**
Enseñar a construir el conjunto mínimo de información útil (Contexto) que el modelo necesita para resolver una tarea. Mover al ingeniero de la pregunta "¿Qué le digo al modelo?" (Prompting) a "¿Qué necesita saber el modelo para poder hacerlo?" (Context Engineering).

**Prerequisites**
Módulo 02 (Prompt Engineering). El estudiante ya sabe cómo escribir un contrato estricto, separar instrucciones de datos (delimitadores) y exigir formatos estructurados (JSON/XML).

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Diferenciar entre contexto relevante y contexto necesario (Minimum Useful Context).
- Desmontar el sesgo de que "más información siempre es mejor" en los LLMs.
- Ensamblar, priorizar y comprimir el contexto basado en el presupuesto de tokens (Token Budget).
- Diseñar un *Context Manifest* que defina qué piezas de información debe recuperar el sistema de backend.

**Suggested duration**
2 horas teóricas + 1 hora de Real Engineering Lab.

**Teaching strategy**
Uso constante de la analogía del "viaje y el equipaje". Analizar escenarios donde se asume que inyectar todo el repositorio solucionará el problema, para demostrar cómo esto causa degradación de atención (*Lost in the Middle*), lentitud y sobrecostos. 

**Concept dependencies**
- **Token Limits (M01)**: Para entender el presupuesto computacional y el límite físico de la ventana de contexto.
- **System Prompt vs User Input (M02)**: Porque el contexto dinámico se inyectará en la zona de User Input.

**Curriculum Components**
- [Lesson 01: Anatomy of Context](./lesson-01.md)
- [Lesson 02: Assembly & Prioritization](./lesson-02.md)
- [Lesson 03: Compression & Validation](./lesson-03.md)
- [Demo 03: Engineer the Context](./demo-03.md)
- [Lab 03: Build the Minimum Useful Context](./lab-03.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "El mejor ingeniero de contexto es el que logra eliminar la mayor cantidad de información sin romper la respuesta del modelo."
La meta es enseñar a los ingenieros a ser tacaños con el contexto. Menos contexto significa menos latencia, menos costo, y menos riesgo de que el modelo se distraiga con ruido.

**Qué NO explicar todavía**
- No expliques cómo funcionan las bases de datos vectoriales (Chroma, Pinecone), ni algoritmos de similitud (Cosine Similarity). Eso es el mecanismo de generación de candidatos, y pertenece estrictamente a **M04 (Retrieval)**.

**Common misconceptions (Errores comunes de estudiantes)**
- *“Si le paso todo el manual en PDF, el modelo sabrá qué hacer.”* (Falso: sobrecarga cognitiva).
- *“El contexto relevante es todo lo que habla del mismo tema.”* (Falso: Relevante != Necesario).

**Intervenciones si el grupo está pasivo**
- "Levanten la mano si alguna vez copiaron y pegaron 5 archivos enteros de su código en ChatGPT para resolver un bug de 2 líneas. ¿ChatGPT les devolvió código que usaba funciones que no existían porque se mezcló con los otros archivos?"

**Module transition (Hacia M04)**
Cierre vital para el arco narrativo del curso: 
> "Ahora sabemos exactamente qué información necesitamos (Context Manifest) y cómo ensamblarla. El problema ya no es solamente *qué contexto usar*, sino **cómo encontrarlo automáticamente cuando el sistema corporativo contiene millones de documentos, repositorios y logs**. Buscar a mano ya no escala. Necesitamos sistemas que recuperen esa información por nosotros. En el Módulo 04 entraremos a Retrieval (RAG)."
