# Lesson 03 — Structured Outputs

## 1. Propósito de la clase
Enseñar el salto definitivo entre "IA generativa para humanos" e "IA integrada en sistemas": la necesidad obligatoria de forzar la salida del modelo hacia interfaces y esquemas predecibles y verificables (JSON, XML).

## 2. Qué debe aprender el estudiante
- Diseñar contratos que no solo exijan "haz X", sino "devuelve X **únicamente** bajo la estructura Y".
- Implementar validación estricta del lado del código (Zod, Pydantic) sobre la salida del modelo.
- Entender que una respuesta estructuralmente válida no garantiza veracidad factual (esquema correcto != contenido correcto).

## 3. Conceptos fundamentales

### 3.1 Restricciones y Formato de Salida
Los LLMs tienden a ser "amigables" y conversacionales (por su entrenamiento RLHF). Añaden "¡Claro, aquí tienes!" antes del código. En ingeniería de software, ese saludo rompe el pipeline. Debemos aplicar restricciones absolutas.

#### Concept Analogy: Restricciones y Formato
- **Analogía cotidiana:** Un formulario de declaración de impuestos del gobierno.
- **Mapeo:** La instrucción de "haz un resumen" es una página en blanco. El formato estructurado (JSON Schema) es el formulario oficial con casillas delimitadas.
- **Límite de la analogía:** Si llenas mal un formulario físico, un burócrata humano lo devuelve. Si el modelo llena mal el JSON, el parser en el código (ej. `JSON.parse`) lanza una excepción que detiene toda la ejecución de la aplicación.
- **Traducción técnica:** Coerción de la capa de salida del modelo hacia una gramática formal (Grammar-constrained decoding) o inyección de restricciones fuertes en el *system prompt*.
- **Ejemplo aplicado a SWE:** Enviar un prompt que finaliza con `<output_format>Return ONLY valid JSON. No markdown. No preambles.</output_format>` para que la aplicación Node.js pueda consumirlo directamente.

### 3.2 Validación del Output
La responsabilidad de la calidad de los datos generados recae en la arquitectura que consume el LLM, no en el LLM mismo.

#### Concept Analogy: Validación
- **Analogía cotidiana:** Pasar por el filtro de seguridad de un aeropuerto.
- **Mapeo:** El modelo de IA es el pasajero generando contenido. Tu código de validación (Zod/Pydantic) es el escáner de seguridad.
- **Límite de la analogía:** El escáner detecta amenazas físicas absolutas. Nuestro validador de esquemas solo detecta que la estructura de datos coincida (ej. que "edad" sea un número), no sabe si el modelo mintió sobre la edad real de la persona.
- **Traducción técnica:** Parsing y validación de tipos estáticos en runtime.
- **Ejemplo aplicado a SWE:** No confiar nunca en el string crudo que devuelve la API de OpenAI. Envolverlo en un `try/catch` que pase por un esquema de validación (ej. validar que la fecha extraída es real y no "99/99/9999").

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Si uso un JSON Schema estricto (Structured Outputs de OpenAI) o le digo que sea riguroso, la IA ya no va a alucinar ni equivocarse en el contenido"*.
**Consecuencia:** Creerá que *"formato válido = información veraz"*. Esto es un error fatal. El modelo puede inventar perfectamente una mentira que encaje impecablemente dentro del JSON Schema exigido. El esquema valida sintaxis, no semántica o factualidad.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Pedimos que la respuesta quepa en las casillas correctas para que el ordenador pueda leerla.
- **Mecanismo:** Técnicas como *JSON mode* o *Structured Outputs* alteran el vocabulario de probabilidad (Logit bias) durante la generación, bloqueando matemáticamente que el modelo genere tokens que rompan la gramática del esquema esperado.
- **Consecuencia de ingeniería:** La IA se convierte en un microservicio de caja negra tradicional. Le enviamos texto (input), devuelve un JSON tipado (output), y nuestro backend tradicional procesa ese JSON. La lógica dura vuelve a estar bajo nuestro control.

## 6. Ejemplo técnico
**Generación libre (Peligro):**
`Input: Prompt` -> `Output: "Aquí tienes los errores: 1. NullPointer. 2. Timeout."` (El backend no puede hacer nada con esto sin escribir NLP propio).

**Contrato de Salida (Control):**
```text
Instrucción: Extrae errores.
Formato: 
{
  "errors": [{"type": "string", "severity": "HIGH|LOW"}]
}
Obligatorio: Retorna SOLO el JSON crudo.
```
`Input: Prompt` -> `Output: {"errors": [{"type": "NullPointer", "severity": "HIGH"}]}`

## 7. Ejemplo aplicado a Software Engineering
Sistema de triaje automático de Tickets de soporte. El LLM lee el ticket del usuario y debe decidir a qué departamento asignarlo. El código TypeScript define un `enum` con los departamentos. El LLM es forzado a devolver un JSON donde el valor pertenece estrictamente a ese `enum`. TypeScript lo valida, y si pasa, ejecuta el routing de bases de datos.

## 8. Errores conceptuales frecuentes
- **"El JSON se rompió porque el modelo es tonto"**: Muchas veces el JSON se rompe porque la tarea era demasiado compleja y el modelo no tuvo espacio (CoT) para pensar. Quiso razonar y escribió el razonamiento dentro del JSON, rompiendo comillas.
- **"Pydantic lo arregla todo"**: Una librería de validación no arregla el error de generación, solo lo atrapa (*fail-fast*) para que puedas intentar una estrategia de reintento (*Retry Pattern*).

## 9. Preguntas para el grupo
- "Si forzamos al modelo a devolver un booleano `true/false`, le estamos quitando el espacio para usar *Chain of Thought*. ¿Cómo podríamos diseñar el esquema JSON para recuperar ese espacio de pensamiento sin romper el código de backend?" (Respuesta: añadir un campo `{"reasoning": "...", "result": true}`).
- "¿Qué hacemos en nuestro backend si la validación del JSON falla? ¿Lanzar error al usuario o programar un reintento automático (*retry loop*) pidiendo al modelo que corrija su propio JSON?"

## 10. Mini ejercicio
Muestra en pantalla un JSON donde la sintaxis está perfecta, pero la lógica de negocio subyacente es un desastre alucinado. Pide a los ingenieros que discutan: ¿Dónde debemos poner el *guardrail* para evitar que esto afecte al usuario final?

## 11. Demo relacionada
*(No tiene demo separada; se demuestra operativamente en el Lab 02).*

## 12. Discusión
Toda esta ingeniería (M01 y M02) nos ha enseñado a crear una "máquina traductora" perfecta: convierte lenguaje no estructurado en JSON estructurado de forma reproducible. 

## 13. Preparación para la siguiente clase
*(Cierre crucial del módulo)*:
"Ya tenemos un contrato. El modelo nos obedece, nos da el formato exacto y no hace comentarios extras. **¿Pero qué ocurre cuando la tarea exige analizar el manual de políticas internas de recursos humanos de nuestra empresa, un PDF de 500 páginas que cambia cada mes?** No podemos copiar y pegar eso en la instrucción cada vez. Necesitamos inyectar contexto de forma automatizada. En el Módulo 03 aprenderemos Context Engineering."
