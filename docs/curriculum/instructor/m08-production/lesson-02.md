# Lesson 02 — Evaluation Hierarchy

## 1. Propósito de la clase
Dotar al estudiante de un marco mental robusto para evaluar sistemas estocásticos (IA). Aprender a utilizar la jerarquía de evaluación (Determinista → LLM-as-a-Judge → Humano) apoyada sobre la base insustituible de un **Golden Dataset** (Dataset Dorado). 

## 2. Qué debe aprender el estudiante
- Diseñar la pirámide de evaluación donde lo determinista actúa como filtro primario.
- Implementar el patrón **LLM-as-a-Judge** (Usar un LLM fuerte para evaluar la salida de otro LLM).
- Comprender la importancia vital de tener un conjunto de datos estático y representativo (*Golden Dataset*) contra el cual medir cada modificación en Producción.

## 3. Conceptos fundamentales

### 3.1 La Jerarquía de Evaluación
No podemos evaluar respuestas probabilísticas solo con humanos (por costo y lentitud), ni solo con código clásico (porque falla ante variaciones lingüísticas). La solución es una jerarquía por etapas (un *Pipeline*):

1. **Determinista (El primer filtro):** Código clásico. ¿La respuesta incluye el JSON con las claves exactas requeridas? ¿La longitud es menor a X caracteres? ¿Contiene insultos filtrables mediante regex? (Rápido, 100% confiable, barato).
2. **LLM-as-a-Judge (El filtro semántico):** Si pasa el filtro determinista, usamos un modelo LLM de mayor capacidad (ej. GPT-4 o Claude 3.5 Sonnet) con un prompt muy estricto para que actúe exclusivamente como Juez. Su único trabajo es puntuar (0 a 1) si la respuesta semántica cumple con el *Golden Dataset*. (Escalable, confiable en un 95%, costo moderado).
3. **Human Review (El filtro final/Arbitraje):** Un humano experto revisa solo un muestreo aleatorio del 1% de las salidas, y aquellos casos donde el *LLM-as-a-Judge* indicó "Fallo". (Lento, caro, alta precisión para calibrar al Juez).

#### Concept Analogy: La Corrección de Exámenes
- **Analogía cotidiana:** Corregir exámenes universitarios de miles de estudiantes.
- **Mapeo:** 
  - *Golden Dataset:* La hoja maestra de respuestas correctas.
  - *Determinista:* Una máquina óptica que corrige los exámenes de selección múltiple (A, B, C). Elimina el volumen masivo al instante.
  - *LLM-as-a-Judge:* Un asistente del profesor leyendo las respuestas de desarrollo. Compara lo que escribió el alumno con la hoja maestra y le da una nota.
  - *Human Review:* El profesor titular interviene solo cuando un alumno apela su nota o cuando el asistente no está seguro.
- **Límite de la analogía:** El asistente universitario humano aprende y mejora con el tiempo, y entiende matices implícitos de su materia. El *LLM-as-a-Judge* no tiene "experiencia vivida"; si tu rúbrica de evaluación (el prompt del juez) es vaga, el juez aprobará errores sistemáticos de manera implacable.
- **Traducción técnica:** Un pipeline de CI/CD (GitHub Actions) donde cada push a la rama principal ejecuta scripts de Python que hacen llamadas a la API (Target LLM), y luego corren aserciones asíncronas invocando a un modelo distinto (Judge LLM).
- **Ejemplo aplicado a SWE:** Quieres validar si tu Agente extrae correctamente el nombre de un contrato. El código determinista verifica que el output sea un JSON válido. El *LLM-as-a-Judge* verifica que el nombre extraído ("Juan Pérez") sea lógicamente igual al del Golden Dataset ("Sr. Juan Pérez").

### 3.2 El Golden Dataset (Dataset Dorado)
Es el activo más valioso de un equipo de IA. Es una colección estática de inputs representativos (`Preguntas`) emparejados con su salida ideal (`Ground Truth / Respuestas correctas`). 
Sin un Golden Dataset, el *LLM-as-a-Judge* no tiene con qué comparar. El desarrollo impulsado por IA (**AI-Driven Development**) en realidad debería llamarse **Dataset-Driven Development**. Si no mides contra el Golden Dataset antes de desplegar, estás operando a ciegas.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Para el LLM-as-a-Judge usaré el mismo modelo rápido y barato (ej. Haiku o GPT-4o-mini) que genera las respuestas, así ahorro dinero."*
**Consecuencia:** Esto es un *False Pass* (Falso Positivo) sistémico. Si el modelo pequeño alucina una respuesta, y luego le pides a ese *mismo* modelo pequeño que juzgue su propia respuesta, es muy probable que ratifique su propio error por un sesgo cognitivo del modelo. El Juez debe ser, por regla general, un modelo más potente (State of the Art) que el modelo generador, o tener un prompt extremadamente especializado.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** No dejes que el estudiante califique su propio examen. Trae a un experto externo.
- **Mecanismo:** Un *Evaluation Framework* (como LangSmith, Braintrust, promptfoo) orquesta la batería de Evals tomando el *Golden Dataset*, lanzándolo contra el sistema, y enviando pares `(Respuesta_Generada, Ground_Truth)` al modelo evaluador (Judge).
- **Consecuencia de ingeniería:** La ingeniería de prompts (M02) se vuelve una ciencia verificable. Ya no dices "Creo que este prompt es mejor", dices "Este prompt mejoró el Recall del Golden Dataset en un 12% según el pipeline del Juez".

## 6. Ejemplo técnico
**El Prompt del Juez (LLM-as-a-Judge):**
```text
Actúa como un evaluador imparcial. Compara la Respuesta Generada con la Verdad Esperada (Ground Truth).
Evalúa solo la EQUIVALENCIA SEMÁNTICA, ignorando el formato o estilo.
Responde estrictamente con un JSON: {"score": 1, "reason": "..."} o {"score": 0, "reason": "..."}

[Ground Truth]: "La devolución tarda 5 días laborables."
[Respuesta Generada]: "En 5 días hábiles tendrás tu dinero devuelto."
```
*Salida del Juez:* `{"score": 1, "reason": "Días laborables y días hábiles son semánticamente equivalentes."}`

## 7. Ejemplo aplicado a Software Engineering
¿Recuerdas el **Retrieval Specification** de M04? Ese micro-benchmark de 5 queries era la semilla de un *Golden Dataset*. En un proyecto de software empresarial, ese dataset no tiene 5 entradas, tiene 5,000 casos extraídos de interacciones reales de usuarios, con el *Ground Truth* validado manualmente por el equipo de QA.

## 8. Errores conceptuales frecuentes
- **"El LLM-as-a-judge es infalible"**: Falso. A veces el Juez se equivoca (Falsa Alarma). Por eso existe la capa superior de *Human Review* para calibrar y corregir al Juez de vez en cuando.
- **"El Golden Dataset nunca cambia"**: Falso. A medida que tu aplicación evoluciona y cubre nuevos casos de uso (ej. abren mercado en otro país), debes inyectar nuevos casos (Edge Cases) al dataset.

## 9. Preguntas para el grupo
- "Si un Agente (M05) genera código Python en un bucle, ¿qué capa de la Jerarquía de Evaluación representa correr el comando `python -m pytest` sobre ese código generado?" (Respuesta: Determinista. Compilar y pasar tests es una regla booleana dura, no requiere un LLM Juez).
- "¿Por qué es vital usar ejemplos del mundo real en tu Golden Dataset en lugar de casos sintéticos inventados por el equipo de desarrollo?"

## 10. Mini ejercicio
Muestra una respuesta generada con un error sutil (Ej: *El modelo dice "Paga en cuotas sin interés", cuando el Ground Truth dice "Paga en cuotas con un pequeño recargo"*). 
Pide a los estudiantes que redacten las instrucciones del Juez (El prompt del *LLM-as-a-Judge*) para garantizar que detecte esa discrepancia financiera específica sin equivocarse. 

## 11. Demo relacionada
*(Se mostrará en la Demo 08).*

## 12. Discusión
En el desarrollo tradicional, escribes código hasta que los tests pasan. En GenAI, el comportamiento ya viene pre-entrenado; pasas el 80% de tu tiempo de ingeniería construyendo el sistema que verifica que ese comportamiento no se descarrila. 

## 13. Preparación para la siguiente clase
"Tener evaluaciones y un Juez es fabuloso. Pero incluso si nuestro agente saca una puntuación perfecta en el laboratorio, en Producción se enfrentará a restricciones que no perdonan: Costos exorbitantes, Latencia de red, Límite de Tokens (Rate Limits) y ataques de seguridad en vivo. Mañana aprenderemos sobre las fronteras operativas y cómo diseñar restricciones para salvar la compañía."
