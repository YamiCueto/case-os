# Module 04: Retrieval & RAG

## MODULE BRIEF

**Purpose**
Enseñar que RAG (Retrieval-Augmented Generation) no es una tecnología mágica de bases de datos vectoriales, sino una arquitectura de software diseñada para resolver el **problema de escala de la ingeniería de contexto**. El objetivo es encontrar candidatos en un océano de información; luego el *Context Assembler* (M03) decidirá si los usa.

**Prerequisites**
Módulo 03 (Context Engineering). El estudiante debe comprender que el contexto útil tiene restricciones estrictas de presupuesto y que más contexto no equivale a mejor contexto.

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Entender Embeddings como coordenadas de significado matemático.
- Diferenciar el proceso de Retrieval (generación de candidatos) del ensamblaje del Contexto final.
- Comprender la tubería de RAG: `Knowledge Source → Retrieval Candidates → Evaluation → Selection → Context Assembly → Validation`.
- Medir la calidad de un sistema RAG usando métricas de ingeniería clásicas: **Precision** y **Recall**.

**Suggested duration**
2 horas teóricas + 1 hora de Real Engineering Lab.

**Teaching strategy**
Evitar en todo momento el "hype" de RAG. Enseñar RAG como un motor de búsqueda de los años 90 que ha sido potenciado matemáticamente, pero que sigue sufriendo los mismos problemas de indexación, latencia y relevancia. Hacer constante hincapié en que Retrieval propone, pero el Context Assembler dispone.

**Concept dependencies**
- **Minimum Useful Context (M03)**: El *Retrieval* debe devolver candidatos que pasen la prueba de necesidad, no solo de relevancia.

**Curriculum Components**
- [Lesson 01: Embeddings & Vector Databases](./lesson-01.md)
- [Lesson 02: The RAG Pipeline](./lesson-02.md)
- [Lesson 03: Retrieval Evaluation](./lesson-03.md)
- [Demo 04: Build Retrieval](./demo-04.md)
- [Lab 04: Build a Retrieval Strategy](./lab-04.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "Retrieval no decide automáticamente qué merece entrar al contexto final."
Enfatiza que un Vector Database puede devolver 10 documentos (Top-K) que son matemáticamente "similares" a la pregunta, pero que pueden ser basura obsoleta. El ingeniero sigue siendo responsable de la evaluación y filtrado.

**Qué NO explicar todavía**
- No expliques todavía cómo el modelo *actúa* autónomamente basándose en la información recuperada, o cómo puede ejecutar consultas a bases de datos en bucle. La autonomía pertenece al **Módulo 05 (AI Agents)**. Aquí el sistema es de una sola vía (Query -> Search -> Response).

**Common misconceptions (Errores comunes de estudiantes)**
- *“RAG significa poner mis PDFs en un Vector DB.”* (Falso: RAG incluye chunking, embedding, indexación, búsqueda híbrida, re-ranking y ensamblaje).
- *“Si el Vector DB dice que la similitud es 0.99, el documento tiene la respuesta perfecta.”* (Falso: puede significar que el documento tiene las palabras exactas pero dice lo opuesto de lo que el usuario necesita, o está desactualizado).

**Intervenciones si el grupo está pasivo**
- "¿Alguna vez han buscado un ticket en Jira y el buscador les arrojó 50 resultados inútiles? RAG sufre exactamente de eso si la estrategia de búsqueda (*Retrieval Specification*) no está bien diseñada. ¿Cómo probarían que su búsqueda funciona antes de mandársela al LLM?"

**Module transition (Hacia M05)**
Cierre vital para el arco narrativo del curso: 
> "Ahora tenemos contratos sólidos (M02), un diseño de contexto mínimo (M03) y un motor de búsqueda a escala para encontrar candidatos (M04). Hasta este punto, nosotros escribimos el código que hace las preguntas y nosotros llamamos al LLM. Pero, ¿qué pasa si el problema es tan complejo que el LLM necesita hacer 5 búsquedas diferentes, analizar los resultados de la primera para decidir la segunda, y ejecutar herramientas por sí mismo? Necesitamos soltar el control del ciclo de ejecución. Entraremos al mundo de los **AI Agents (M05)**."
