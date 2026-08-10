# Module 08: Production AI

## MODULE BRIEF

**Purpose**
Enseñar a cruzar la brecha entre un prototipo local que "funciona bien" (M01-M07) y un sistema en producción auditable, seguro y escalable. Formalizar la regla de oro: **La IA puede producir el cambio; la responsabilidad de aceptar el cambio permanece en el proceso de ingeniería (Deployment Gate).** El estudiante debe dejar de preguntar "¿la IA funciona?" y empezar a preguntar "¿qué evidencia necesito para autorizar este sistema en producción?".

**Prerequisites**
Módulo 07 (MCP). Los estudiantes ya saben cómo conectar un agente de IA con infraestructura corporativa de manera estandarizada y segura. Ahora deben aprender a evaluar estadísticamente esa integración antes de exponerla a usuarios reales.

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Abandonar la "evaluación basada en vibras" (Vibes-based evaluation) a favor de una jerarquía estricta: Determinista → LLM-as-a-Judge → Human Review.
- Construir Datasets Dorados (Golden Datasets) para prevenir regresiones silenciosas provocadas por actualizaciones de modelos base.
- Identificar restricciones operativas en producción (Costes, Latencia, Rate Limits) que destruyen diseños ingenuos.
- Diseñar un **Production Readiness Review (PRR)** que actúe como compuerta de despliegue (Deployment Gate).

**Suggested duration**
2 horas teóricas + 1.5 horas de Real Engineering Lab.

**Teaching strategy**
Este es el choque de realidad del curso. El instructor debe adoptar la postura de un *Site Reliability Engineer (SRE)* implacable. Si el estudiante dice "Mi agente es genial, resuelve el 90% de los tickets", el instructor debe responder: "¿Cómo sabes que no alucina en el 10% restante? Demuéstramelo con datos." Todo el módulo gira en torno a la **Evidencia**.

**Concept dependencies**
- **Probabilistic Behavior (M01)**: Retomamos el concepto fundacional: plausibilidad no equivale a verdad. En producción, la plausibilidad es peligrosa sin un *Evaluation Pipeline*.
- **Agentic SWE Protocol (M06)**: La validación manual que hacíamos sobre nuestro código ahora se automatiza sobre las respuestas del agente a gran escala.

**Curriculum Components**
- [Lesson 01: The Production Gap](./lesson-01.md)
- [Lesson 02: Evaluation Hierarchy](./lesson-02.md)
- [Lesson 03: Security & Constraints](./lesson-03.md)
- [Demo 08: The Eval Pipeline](./demo-08.md)
- [Lab 08: Design a Production AI Protocol](./lab-08.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "El entorno de producción no tolera la evaluación por vibras."
Es fácil hacer una demo de IA impresionante para 1 usuario. Es una pesadilla de ingeniería mantenerla estable para 10,000 usuarios cuando OpenAI/Anthropic actualizan los pesos del modelo subyacente sin avisarte, cambiando sutilmente su comportamiento probabilístico.

**La Regla Transversal (Aplicable a cada lección)**
> **AI-generated change → Evidence → Evaluation → Deployment Gate.**
Nunca desplegamos una nueva instrucción (prompt) o un nuevo agente sin pasar su salida por un pipeline de evaluación riguroso. La IA propone, el *Deployment Gate* dispone.

**Qué NO explicar**
- No entraremos en el afinamiento fino (Fine-tuning) de modelos fundacionales. Ese es un tema profundo de *Machine Learning Engineering*. Aquí nos mantenemos en la capa de Arquitectura y *Software Engineering* (Evaluación de prompts y workflows).

**Common misconceptions (Errores comunes de estudiantes)**
- *“Los usuarios nos avisarán si la IA dice algo mal.”* (Falso: Los usuarios no detectan alucinaciones sutiles. La confianza ciega degrada el producto).
- *“Para evaluar si mi agente funciona, solo pruebo 3 ejemplos diferentes y ya está.”* (Falso: Esto es "Vibes-based evaluation". Necesitas evaluación estadística (Evals) sobre un *Golden Dataset*).

**Course Conclusion**
Cierre épico para todo el programa CASE Academy: 
> "Al principio de este curso pensábamos que la Inteligencia Artificial era magia que amenazaba con reemplazar la Ingeniería de Software. Ocho módulos después, descubrimos que la IA es solo un subsistema probabilístico ruidoso. Para domarlo, hemos tenido que hacer **más y mejor Ingeniería de Software** que nunca. El verdadero poder no está en escribir el mejor prompt, sino en diseñar el mejor sistema."
