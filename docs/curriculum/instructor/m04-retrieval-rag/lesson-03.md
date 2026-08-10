# Lesson 03 — Retrieval Evaluation

## 1. Propósito de la clase
Enseñar a los ingenieros que implementar RAG sin evaluación es programar a ciegas. Demostrar cómo utilizar las métricas clásicas de recuperación de información (Precision y Recall) para diagnosticar si el problema de un sistema de IA está en la generación (LLM) o en la base de datos (Retrieval).

## 2. Qué debe aprender el estudiante
- Diferenciar entre **Precision** (cuántos de los documentos recuperados eran realmente útiles) y **Recall** (cuántos de los documentos útiles existentes logramos recuperar).
- Comprender el *trade-off* fundamental: mejorar Recall a menudo destruye Precision (y viceversa).
- Implementar la evaluación como un flujo de integración continua (Test-Driven Development para RAG).

## 3. Conceptos fundamentales

### 3.1 Precision (Precisión)
Mide la pureza de los resultados. De los 5 documentos que el sistema trajo, ¿cuántos sirvieron?

#### Concept Analogy: Precision
- **Analogía cotidiana:** Pescar con un arpón.
- **Mapeo:** El arpón es tu sistema de búsqueda ajustado para máxima precisión.
- **Límite de la analogía:** Si tiras el arpón a un pez específico y le das, tu precisión es 100%. Pero en un LLM, si necesitas 3 piezas de contexto distintas y tu "arpón" solo trae una, aunque sea perfecta, el modelo fallará por falta de información complementaria.
- **Traducción técnica:** $Precision = True Positives / (True Positives + False Positives)$.
- **Ejemplo aplicado a SWE:** Tu RAG devuelve 5 fragmentos de código. Solo 1 contiene la función relevante; los otros 4 son ruido. Precisión = 20%. Esto inyecta ruido masivo en la ventana de contexto (violando los principios de M03) y aumenta los costos de API innecesariamente.

### 3.2 Recall (Exhaustividad)
Mide la cobertura. De todos los documentos útiles que existen en la base de datos para esta pregunta, ¿cuántos lograste pescar?

#### Concept Analogy: Recall
- **Analogía cotidiana:** Pescar con una red gigante de arrastre.
- **Mapeo:** La red gigante es tu sistema ajustado para máximo Recall (ej. pedirle al Vector DB que devuelva el Top-50).
- **Límite de la analogía:** La red atrapará todos los peces útiles del lago (Recall 100%), pero también sacará botas viejas, llantas y basura. El LLM sufrirá severamente de sobrecarga cognitiva (*Lost in the Middle*) intentando separar el pescado de la basura en el prompt.
- **Ejemplo aplicado a SWE:** Aumentar `k=20` en la consulta vectorial suele aumentar la probabilidad de recuperar elementos relevantes (mejorando el Recall), pero también puede introducir más candidatos irrelevantes, reduciendo la Precisión del conjunto recuperado. K no es bueno ni malo, es un *trade-off* que debe medirse. Si introduces demasiada "basura" en la red, el LLM sufrirá de sobrecarga cognitiva.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Si el LLM responde una tontería, debo mejorar mi System Prompt (M02) diciéndole que sea más inteligente o que no alucine."*
**Consecuencia:** El ingeniero pasará días ajustando palabras mágicas en el prompt sin darse cuenta de que el modelo alucina porque el sistema de *Retrieval* está operando con un Recall del 0% (nunca recuperó el documento que tenía la respuesta). Estará intentando arreglar un problema de base de datos editando el frontend.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** No podemos juzgar a un cocinero (LLM) si el repartidor del supermercado (Retrieval) le trajo los ingredientes equivocados.
- **Mecanismo:** El LLM genera texto fuertemente condicionado al contexto inyectado. Si el Retrieval inyecta falsos positivos (Baja Precisión), el modelo genera respuestas basadas en premisas falsas. Si el Retrieval omite verdaderos positivos (Bajo Recall), el modelo alucinará para rellenar los huecos.
- **Consecuencia de ingeniería:** Diseñamos *Golden Datasets* (pares de preguntas y respuestas verificadas con sus documentos de origen) y corremos scripts automatizados (evaluadores algorítmicos o *LLM-as-a-judge*) en CI/CD para medir Precision/Recall cada vez que cambiamos la estrategia de chunking o el modelo de embedding.

## 6. Ejemplo técnico
**Escenario de fallo:**
- User Query: "¿Cómo conecto la VPN en Mac?"
- Retrieval devuelve: [Guía VPN Windows, Guía VPN Linux, Política de uso de internet].
- *Precision: 0%. Recall: 0%.*
- LLM Output: "Para Mac, usa el mismo cliente de Windows..." (Alucinación).
- *Solución:* Modificar el pipeline de RAG (BM25 o Re-ranking), no cambiar el prompt.

## 7. Ejemplo aplicado a Software Engineering
Test-Driven Development para RAG. Tienes un Excel con 50 preguntas reales de tus usuarios, y en la columna de al lado, el ID del documento exacto que las responde. Antes de hacer un *deploy* de un nuevo modelo de embeddings, tu script corre las 50 preguntas contra tu Vector DB, verifica si el ID correcto está en el Top-5 devuelto, y si la tasa de acierto (Hit Rate) baja del 90%, bloquea el deploy.

## 8. Errores conceptuales frecuentes
- **"Precision es mejor que Recall (o viceversa)"**: Depende del caso de uso. En un sistema legal, no encontrar un caso precedente (Bajo Recall) es inaceptable, aunque traigas ruido. En un asistente de chat rápido, traer ruido (Baja Precision) confunde al usuario, por lo que es preferible decir "No lo sé".
- **"Solo mido si la respuesta final del LLM está bien"**: Medir solo la salida final (*End-to-End*) oculta la verdadera causa del fallo. Hay que medir el Retrieval independientemente.

## 9. Preguntas para el grupo
- "Si tu pipeline RAG está fallando, ¿cómo sabes si el culpable es el Vector DB, el modelo de embeddings, la estrategia de chunking o el LLM?" (Respuesta: Evaluando métricas componentes de forma aislada).
- "Si tuvieran que elegir, ¿qué es más peligroso para un LLM: Alta Precisión pero Bajo Recall (falta info clave) o Alto Recall pero Baja Precisión (mucha info clave mezclada con mucho ruido)?"

## 10. Mini ejercicio
Muestra en pantalla una búsqueda de usuario: *"Horarios del comedor los viernes"*.
Resultados recuperados: `[1. Menú del lunes, 2. Horarios generales, 3. Evento especial del viernes pasado]`.
Pregunta a los ingenieros si esto es un problema de Precision o Recall, y si el LLM podría salvarse de este mal contexto si le decimos "Sé muy analítico" en el prompt.

## 11. Demo relacionada
*(Demo 04: Build Retrieval permitirá jugar con este trade-off).*

## 12. Discusión
La evaluación transforma los proyectos de IA de "juguetes que a veces fallan" en "sistemas de software robustos". La IA probabilística necesita marcos de prueba deterministas más rigurosos que el software tradicional.

## 13. Preparación para la siguiente clase
"Toda la teoría se tiene que poner a prueba. En el Lab 04 de hoy, ustedes diseñarán una estrategia de búsqueda para su propio problema de ingeniería, y construirán el dataset de 5 preguntas (benchmark) que determinará si su sistema funciona o si están programando a ciegas."
