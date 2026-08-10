# Module 02: Prompt Engineering

## MODULE BRIEF

**Purpose**
Desmontar la idea de que hacer *prompting* es "hablar con la IA" o "escribir descripciones bonitas", y establecer la práctica de **diseñar contratos de comportamiento** para sistemas probabilísticos. Este módulo enseña cómo reducir la ambigüedad, imponer restricciones y garantizar que el output pueda ser consumido por un sistema determinista.

**Prerequisites**
Módulo 01 (AI Foundations). El estudiante debe comprender que el modelo genera la siguiente palabra más probable (plausibilidad) y no posee una fuente interna de verdad.

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Diferenciar entre una instrucción ambigua (conversación) y una instrucción delimitada (contrato).
- Separar claramente la instrucción del contexto dentro de un prompt.
- Utilizar ejemplos (Few-Shot) para alinear semánticamente el comportamiento del modelo.
- Explicar los límites del razonamiento estructurado (Chain of Thought).
- Forzar la salida del modelo hacia un esquema estructurado (JSON/XML) para integrarlo en código.

**Suggested duration**
2 horas teóricas + 1 hora de Real Engineering Lab.

**Teaching strategy**
Transición constante de "humano" a "máquina". Iniciar con prompts que parecen correos electrónicos dirigidos a un colega (mal), y evolucionarlos iterativamente frente al grupo hasta convertirlos en plantillas parametrizadas, inyectables desde código y con validación de salida.

**Concept dependencies**
- **Plauisibilidad (M01)**: Base para entender por qué la ambigüedad causa alucinación.

**Curriculum Components**
- [Lesson 01: Reliable Behavior](./lesson-01.md)
- [Lesson 02: Reasoning Patterns](./lesson-02.md)
- [Lesson 03: Structured Outputs](./lesson-03.md)
- [Demo 02: Engineer the Instruction](./demo-02.md)
- [Lab 02: Engineer an AI Instruction Contract](./lab-02.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "El modelo compite por adivinar tu intención. El *Prompt Engineering* es el arte de no dejar nada a la adivinanza."
Enfatiza que en ingeniería de software no esperamos a que un bloque de código "adivine" el formato. El contrato de comportamiento se diseña para que el fallo sea predecible.

**Qué NO explicar todavía**
- No expliques cómo inyectar cientos de documentos o consultar bases de datos corporativas. Eso pertenece a Context Engineering (M03) y Retrieval (M04). Aquí asumimos que el texto (contexto) que necesita el prompt cabe fácilmente y ya lo tenemos.

**Common misconceptions (Errores comunes de estudiantes)**
- *“Un prompt es básicamente una pregunta.”* (Falso: es un contrato de parámetros, instrucciones, contexto y formato).
- *“Más instrucciones siempre es mejor.”* (Falso: a mayor longitud, el modelo sufre de *lost in the middle* o dilución de atención).

**Intervenciones si el grupo está pasivo**
- "Si tu prompt dice 'haz un resumen corto', ¿el modelo falló si entrega 50 palabras? ¿y si entrega 500? Si la prueba unitaria no puede decidirlo, tu contrato es defectuoso."

**Module transition (Hacia M03)**
Cierre vital para el arco narrativo del curso: 
> "Hemos logrado que el modelo se comporte de manera predecible, acate restricciones y devuelva JSON. Nuestro contrato es perfecto. **Pero, ¿qué ocurre cuando el modelo necesita procesar información que no cabe en la instrucción o cambia todos los días (ej. perfiles de clientes)?** No podemos escribir eso a mano cada vez. Necesitamos inyectar contexto. En el Módulo 03 entraremos a Context Engineering."
