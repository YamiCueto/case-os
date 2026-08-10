# Lesson 01 — Reliable Behavior

## 1. Propósito de la clase
Erradicar la mala práctica de interactuar con el modelo como si fuera un humano en un chat de soporte. Enseñar al ingeniero que un *prompt* no es una pregunta, sino un **contrato de comportamiento** diseñado para mitigar la naturaleza estadística (ambigüedad) del modelo.

## 2. Qué debe aprender el estudiante
- Diferenciar entre una instrucción ambigua ("haz un buen resumen") y una instrucción acotada ("extrae las 3 decisiones clave").
- Separar semánticamente la instrucción (lo que quieres que haga) del contexto (la información sobre la cual debe operar).
- Entender que a mayor ambigüedad en el contrato, mayor varianza en el comportamiento probabilístico.

## 3. Conceptos fundamentales

### 3.1 El Prompt como Contrato
En ingeniería tradicional, las interfaces tienen contratos estrictos (tipos de datos, `required`, `optional`). En IA, el prompt actúa como esa interfaz. Debe declarar qué se espera, bajo qué condiciones y qué está estrictamente prohibido.

#### Concept Analogy: Prompt como Contrato vs Conversación
- **Analogía cotidiana:** Pedirle a un pasante: "Revisa este documento y dime qué te parece" (Conversación) vs "Lee la página 4, extrae los nombres de los clientes y lístalos con viñetas" (Contrato).
- **Mapeo:** La "charla casual" es un prompt sin restricciones. El "contrato" es un prompt estructurado (rol, tarea, formato).
- **Límite de la analogía:** Un pasante humano puede pedir aclaraciones si algo no tiene sentido. El modelo base (si no está programado en un flujo conversacional con validaciones) simplemente generará el texto más probable ante la ambigüedad, lo que a menudo resulta en alucinaciones o formatos rotos.
- **Traducción técnica:** Reducción del espacio de probabilidad (Temperature / Top P virtual) restringiendo matemáticamente los tokens que "tienen sentido" generar a continuación.
- **Ejemplo aplicado a SWE:** Un prompt que dice "analiza el código" devolverá párrafos inútiles. Un contrato dice: `<role>Senior Reviewer</role> <task>Find XSS vulnerabilities</task> <constraints>Do not explain, just output the line number.</constraints>`.

### 3.2 Separación Instrucción vs Contexto
El modelo no sabe naturalmente qué parte de tu texto es la regla y qué parte es el dato empírico. Si mezclas ambos, eres vulnerable a *Prompt Injection* (accidental o intencional) y a confusión semántica.

#### Concept Analogy: Instrucción vs Contexto
- **Analogía cotidiana:** Las reglas de un juego de mesa vs Las cartas repartidas en esta partida.
- **Mapeo:** Las instrucciones del manual ("El manual prohíbe mirar las cartas del rival") son la Instrucción (System Prompt). Las cartas que tienes en la mano son el Contexto (User Input).
- **Límite de la analogía:** En un juego físico, las reglas y las cartas están físicamente separadas. En un LLM, todo entra como un único chorro de texto plano continuo, por lo que nosotros debemos usar delimitadores (como XML tags o Markdown) para crear esa separación artificial.
- **Traducción técnica:** Demarcación semántica de la ventana de contexto.
- **Ejemplo aplicado a SWE:** Enviar `Resume este texto: <user_input>` es peligroso. Los delimitadores hacen explícita la frontera entre instrucciones y datos, reduciendo ambigüedad y algunos errores de interpretación. **No son un mecanismo de seguridad suficiente contra prompt injection.** Las verdaderas fronteras de seguridad deben ser sistémicas (M08), no depender solamente de lo que diga el prompt.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Un prompt es básicamente una pregunta detallada a un buscador"*.
**Consecuencia:** Escribirá descripciones narrativas largas, como si el modelo estuviera "leyendo" para entender. Esto provoca que el modelo pierda restricciones (*lost in the middle*). La realidad es que el prompt es la *configuración inicial del cálculo estadístico*.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Las palabras ambiguas permiten múltiples interpretaciones.
- **Mecanismo:** La ambigüedad aplana la distribución de probabilidad, haciendo que múltiples secuencias de tokens compitan con pesos similares, aumentando el riesgo de alucinación/desvío. Las restricciones concentran la probabilidad en los tokens correctos.
- **Consecuencia de ingeniería:** Pasamos de escribir texto libre a definir plantillas estructuradas con secciones estrictas (System, Context, Task, Format, Boundaries).

## 6. Ejemplo técnico
**Malo (Conversacional):**
`Por favor, mira estos logs y fíjate si hay algún error de base de datos, y me avisas brevemente.`
*(Produce respuestas inconsistentes: a veces JSON, a veces texto, a veces no encuentra nada).*

**Bueno (Contrato):**
```text
Task: Extract database connection errors.
Input: <logs>...</logs>
Constraints: 
- Return ONLY the exact timestamp of the error.
- If no DB error is found, return "NO_ERROR".
- Do not provide explanations.
```

## 7. Ejemplo aplicado a Software Engineering
Diseñar el bloque de un CI/CD pipeline (GitHub Actions). Si el prompt del paso de IA no está estructurado como contrato, la salida podría romper el siguiente paso del pipeline (ej. `jq` fallando porque el modelo incluyó un saludo educado antes del JSON).

## 8. Errores conceptuales frecuentes
- **"El modelo no me hizo caso"**: En realidad, tu instrucción competía con un contexto ruidoso y el modelo asignó mayor probabilidad al ruido.
- **"Usar palabras mágicas"**: Creer que decir "Piensa paso a paso" siempre funciona mágicamente sin entender por qué.

## 9. Preguntas para el grupo
- "Cuando escriben una función en TypeScript/Java, usan tipos para que el compilador rechace algo inválido. ¿Cómo logramos que el modelo 'rechace' o 'evite' una ruta inválida?"
- "¿Por qué usar Markdown o XML tags dentro del prompt ayuda al modelo?"

## 10. Mini ejercicio
Pide al grupo que transforme el siguiente prompt ambiguo en un contrato estricto de 3 partes (Rol, Tarea, Restricciones):
*Ambiguo:* "Lee el reporte de QA y ayúdame a priorizar los bugs para el equipo de frontend."

## 11. Demo relacionada
*(Demo 02: Engineer the Instruction)*. 

## 12. Discusión
¿Por qué nos cuesta tanto dejar de ser amables o conversacionales con los modelos? Porque las interfaces (ChatGPT, Claude) fueron diseñadas como chat. Pero nosotros somos ingenieros construyendo sobre la API, no usuarios finales chateando.

## 13. Preparación para la siguiente clase
"Hemos aprendido a ser explícitos. Pero a veces, incluso el contrato más claro no es suficiente si la tarea requiere saltos lógicos complejos. En la siguiente clase veremos patrones de razonamiento y el poder de los ejemplos (Few-Shot)."
