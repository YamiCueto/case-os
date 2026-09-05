# M04-L02 — La tubería RAG (RAG pipeline)

## Guía de tutor para proyectar CASE Academy

**Lección en plataforma:** 30 minutos de lectura  
**Uso recomendado:** aproximadamente 2 horas con demostración, discusión y ejercicios.  
**Objetivo de la clase:** que los estudiantes entiendan que RAG no es “preguntarle algo a un LLM”; es un proceso que primero prepara una biblioteca de conocimiento y luego recupera contexto relevante antes de generar una respuesta.

---

## Idea central que deben llevarse

> RAG busca candidatos relevantes en una fuente de conocimiento, construye contexto con los fragmentos seleccionados y se lo entrega al LLM para responder con base en esa información.

La calidad de la respuesta depende primero de la calidad del contexto recuperado. Un LLM no puede responder bien si recibe fragmentos irrelevantes, incompletos o sin los permisos adecuados.

---

## Conceptos en lenguaje simple

| Término | Forma fácil de explicarlo |
|---|---|
| **RAG** | Un sistema que busca en una biblioteca antes de pedirle al LLM que responda. |
| **Documento** | La fuente original: PDF, wiki, manual, repositorio o registro. |
| **Chunk** | Un fragmento pequeño y manejable de un documento. |
| **Chunking** | El proceso de dividir un documento en fragmentos. |
| **Overlap** | La parte que se repite entre dos chunks vecinos para no perder una idea cortada. |
| **Embedding** | Una representación numérica que permite comparar textos por relación semántica. |
| **Vector DB** | El lugar donde se almacenan y se buscan los vectores, junto con sus datos de origen. |
| **Metadata** | Datos que acompañan al chunk: título, URL, fecha, autor, permisos, tipo de documento, etc. |
| **Query** | La pregunta o solicitud que hace el usuario. |
| **Retrieval** | Encontrar los chunks que parecen más útiles para esa query. |
| **Top-K** | La cantidad de candidatos más relevantes que se recuperan. |
| **Context Build** | Preparar el mensaje que recibirá el LLM: pregunta + chunks recuperados + instrucciones. |
| **Grounded response** | Una respuesta apoyada en el contexto recuperado, no solo en conocimiento general del modelo. |

---

# Antes de iniciar

Abre la Lección 02 y deja visible la primera demo, **Explorador del RAG Pipeline**.

Tu frase inicial puede ser:

> “En la clase anterior aprendimos a encontrar texto relacionado. Hoy veremos qué hace un sistema con esos resultados para que un LLM pueda responder usando nuestros documentos.”

Pregunta inicial:

> “Si un LLM no conoce el manual interno de una empresa, ¿cómo puede responder preguntas sobre ese manual sin volver a entrenarlo?”

No respondas inmediatamente. Escucha hipótesis y después presenta RAG.

---

# Recorrido núcleo — 30 minutos

| Tiempo | Qué proyectar | Pregunta principal | Resultado esperado |
|---|---|---|---|
| 0–4 min | Título y primera sección | “¿Qué le falta a un buscador para responder una pregunta?” | Distinguen búsqueda de generación. |
| 4–14 min | Demo: Explorador del RAG Pipeline | “¿Qué se prepara antes y qué ocurre cuando llega una pregunta?” | Diferencian Offline e Online. |
| 14–24 min | Demo: Visualizador de Chunking & Overlap | “¿Cómo dividimos un documento sin destruir su significado?” | Comprenden tamaño y overlap. |
| 24–28 min | Sección Fase 2: Inferencia | “¿Qué recibe realmente el LLM?” | Explican Search → Assemble → Generate. |
| 28–30 min | Conclusión | “¿Qué determina la calidad de una respuesta RAG?” | Concluyen: calidad del contexto recuperado. |

Si tienes más tiempo, usa las extensiones propuestas después de cada demo.

---

# 0–4 min — ¿Qué es RAG?

## Concepto fácil de explicar

- **Retrieval** por sí solo encuentra documentos o fragmentos.
- **Generation** produce una respuesta en lenguaje natural.
- **RAG** une ambos: primero busca; después entrega los resultados al LLM para que redacte la respuesta.

Forma corta de decirlo:

> “Un buscador entrega documentos. Un LLM redacta. RAG hace que el LLM redacte usando los documentos que el buscador encontró.”

## Aclaración importante

No digas que RAG elimina las alucinaciones. Di:

> “RAG puede reducir el riesgo de respuestas sin fundamento cuando recupera contexto correcto y el LLM está instruido para usarlo. No garantiza que nunca haya errores.”

---

# 4–14 min — Demo 1: Explorador del RAG Pipeline

## Qué muestra esta demo

La pantalla separa el proceso en dos zonas:

```text
OFFLINE / INGESTION
Documents → Chunking → Embedding → Vector DB

ONLINE / INFERENCE
Query → Retrieval → Context Build → LLM
```

La flecha entre **Vector DB** y **Retrieval** conecta las dos fases: lo que se preparó antes permite responder después.

## Cómo presentar la separación Offline / Online

Di:

> “Offline significa que lo hacemos antes de que llegue la pregunta: preparar y organizar la biblioteca. Online significa que ocurre cuando el usuario pregunta y necesita una respuesta.”

Analogía útil:

> “Offline es organizar una biblioteca y poner etiquetas en los libros. Online es recibir una pregunta, ir a la sección correcta y llevar los pasajes útiles a quien responderá.”

Pregunta al grupo:

> “¿Qué pasaría si esperáramos a dividir y vectorizar todos los documentos solo después de que el usuario hace la pregunta?”

Respuesta esperada: la respuesta sería lenta y costosa.

---

## Recorrido de los nodos: qué decir al hacer clic

No es necesario abrir los ocho nodos con la misma profundidad. Selecciona estos seis y usa el panel derecho como apoyo.

### 1. Documents

**Qué es:** las fuentes originales de conocimiento.

> “Aquí están los PDFs, wikis, políticas, repositorios o registros. Todavía son documentos completos; aún no son fáciles de recuperar con precisión.”

Pregunta:

> “¿Qué fuentes internas necesitaría conocer un asistente de Recursos Humanos?”

Busca respuestas como políticas, manuales, beneficios, procedimientos y preguntas frecuentes.

### 2. Chunking

**Qué es:** dividir el documento en partes pequeñas con sentido.

> “No buscamos normalmente un manual entero. Buscamos el párrafo o fragmento que responde la pregunta.”

Pregunta:

> “Si alguien pregunta por vacaciones, ¿es mejor entregar al LLM un manual de 100 páginas o la sección pertinente?”

### 3. Embedding

**Qué es:** convertir cada chunk en un vector para poder compararlo con consultas por significado.

> “Al texto no lo guardamos solo como palabras; también guardamos una representación que permite encontrar fragmentos relacionados con una pregunta.”

No expliques dimensiones ni fórmulas: eso fue parte de L01.

### 4. Vector DB

**Qué es:** el almacén que conserva los vectores y sus datos de origen para encontrarlos después.

> “La Vector DB guarda el vector, pero también debe conservar de dónde salió: documento, URL, fecha y permisos.”

Punto importante:

> “La similitud no reemplaza los filtros. Por ejemplo, el sistema debe respetar permisos incluso si un fragmento es muy relevante.”

### 5. Retrieval

**Qué es:** buscar los chunks que mejor se relacionan con la pregunta del usuario.

> “En este paso también se vectoriza la pregunta y se compara contra los vectores almacenados. El resultado es una lista de candidatos, no una respuesta final.”

### 6. Context Build y LLM

**Qué es Context Build:** crear el mensaje que recibirá el LLM.

> “Aquí reunimos la pregunta, los chunks seleccionados y las instrucciones. Esto es Context Engineering aplicado automáticamente.”

**Qué es el LLM en este flujo:** generar a partir de un prompt estructurado.

> “El LLM no consulta directamente toda la base de datos. Recibe el contexto que otro paso preparó para él.”

---

## Cómo ejecutar la simulación

1. Pide una predicción: “¿Qué creen que se activa primero: el LLM o la biblioteca?”
2. Haz clic en **Run Pipeline**.
3. Deja que el grupo observe la fila Offline: Documents → Chunking → Embedding → Vector DB.
4. Señala el cambio a Online: Query → Retrieval → Context Build → LLM.
5. Al final, selecciona **LLM** y repite: “el LLM recibió contexto recuperado y filtrado”.

### Qué representan los colores de candidatos

En el panel de **Retrieval**, la simulación muestra candidatos:

- **Signal:** chunks relevantes.
- **Noise:** chunks menos útiles o irrelevantes.

La animación dirige el *signal* hacia **Context Build** y descarta visualmente el *noise*. Úsalo para explicar la idea deseada:

> “Recuperar candidatos no basta. Debemos evitar que los fragmentos irrelevantes entren al contexto final.”

Nota para ti: la demo es didáctica; en un sistema real se usan estrategias como filtros de metadata, umbrales, reordenamiento (*reranking*) y evaluación. La visualización no muestra todas esas etapas como nodos separados.

---

## Actividad con Top-K — 3 a 5 minutos adicionales

El deslizador permite elegir Top-K entre 1 y 5. Haz dos ejecuciones:

1. **Top-K = 2:** pregunta: “¿Qué ganamos al enviar poco contexto?”
2. **Top-K = 3 o más:** pregunta: “¿Qué riesgo aparece al traer más candidatos?”

Conclusión:

> “Un K mayor puede traer información útil adicional, pero también incrementa el riesgo de ruido, costo y confusión para el LLM. No existe un número universal; se elige y se evalúa.”

No interpretes los puntajes mostrados como resultados de un modelo real: son valores de una simulación para visualizar señal, ruido y el efecto de Top-K.

---

# 14–24 min — Demo 2: Visualizador de Chunking & Overlap

## Qué enseña esta demo

La demo toma una política de vacaciones y la divide en varios chunks. Sus controles usan **caracteres** para que el efecto sea visible; en producción normalmente se usan tokens y separadores más inteligentes.

Di antes de tocar los controles:

> “Esta demo no intenta enseñarnos un número mágico de caracteres. Nos permite ver qué sacrificamos o conservamos cuando dividimos un documento.”

## Conceptos fáciles

### Chunk size

> “Es el tamaño de cada fragmento. Un chunk muy pequeño puede perder contexto; uno muy grande puede traer información innecesaria.”

### Overlap

> “Es una pequeña repetición entre el final de un chunk y el inicio del siguiente. Sirve como una frase puente para que una idea no se rompa por completo al dividir el documento.”

### Trade-off

> “El overlap protege contexto, pero también repite texto. Más repetición implica más almacenamiento y más texto potencial para enviar al modelo.”

---

## Recorrido recomendado de la demo

### Caso A — Sin overlap

1. Mantén un tamaño de chunk medio, por ejemplo 90.
2. Cambia **Overlap** a `0`.
3. Pide que observen el final de un chunk y el comienzo del siguiente.

Pregunta:

> “¿Qué información puede perderse cuando una oración o una regla se parte justo entre dos fragmentos?”

Conclusión:

> “Sin overlap es más barato y hay menos repetición, pero una idea puede quedar incompleta en cada chunk.”

### Caso B — Overlap moderado

1. Usa la configuración inicial sugerida por la demo: **Chunk Size 90** y **Overlap 20**.
2. Señala el texto repetido entre chunks consecutivos.

Pregunta:

> “¿Qué ventaja tiene que el siguiente chunk repita parte del anterior?”

Conclusión:

> “El chunk siguiente puede completar una idea que comenzó antes. El costo es repetir una parte del contenido.”

### Caso C — Overlap alto

1. Baja el tamaño de chunk, por ejemplo a 50.
2. Sube el overlap a 40.
3. Pide que observen el porcentaje de reutilización y la repetición.

Pregunta:

> “¿Estamos aportando mucho contenido nuevo en cada chunk o estamos guardando casi lo mismo varias veces?”

Conclusión:

> “Demasiado overlap genera redundancia. Puede aumentar costo y empeorar el contexto si repetimos la misma información demasiadas veces.”

---

## Ejercicio de decisión — 3 a 5 minutos

Plantea:

> “Vamos a crear un asistente para responder preguntas sobre políticas de vacaciones. ¿Elegirían chunks pequeños, medianos o grandes? ¿Overlap nulo, moderado o alto? Defiendan su decisión.”

No busques una única configuración correcta. Busca que razonen:

- La política tiene reglas y excepciones que deben conservar contexto.
- Los chunks demasiado grandes pueden mezclar reglas no relacionadas.
- Un overlap moderado suele ser un punto de partida razonable.
- La configuración final se valida con preguntas reales y evaluación de retrieval.

---

# 24–28 min — Fase 2: Inferencia Online

Vuelve a la sección **El Proceso Online de 3 Pasos** y usa esta explicación.

```text
1. Search
Pregunta → embedding de la pregunta → Top-K chunks candidatos

2. Assemble
Pregunta + chunks útiles + instrucciones → prompt estructurado

3. Generate
Prompt estructurado → LLM → respuesta
```

Forma corta de decirlo:

> “Buscar no es responder. Después de buscar hay que seleccionar y organizar el contexto; solo entonces el LLM puede generar una respuesta útil.”

## Conexión con M03

Di:

> “En el Módulo 03 elegíamos manualmente qué información incluir en un prompt. RAG automatiza esa selección desde una biblioteca, pero seguimos necesitando decidir qué contexto es útil y cómo se presenta.”

## Aclaraciones técnicas que ayudan sin complicar

- Una temperatura baja puede hacer la redacción más consistente, pero no garantiza que la respuesta sea verdadera.
- Un resultado similar no siempre es un resultado suficiente o autorizado.
- Metadata y permisos son reglas deterministas; no deben depender solo de similitud semántica.

---

# 28–30 min — Cierre

Proyecta la sección **Calidad de Contexto en RAG** y pregunta:

> “¿Dónde puede fallar un RAG antes de que el LLM escriba una sola palabra?”

Posibles respuestas:

- Documento desactualizado o mal extraído.
- Chunks mal divididos.
- Embeddings que no capturan bien la necesidad.
- Recuperación de resultados irrelevantes.
- K demasiado bajo o demasiado alto.
- Filtros de metadata o permisos ausentes.
- Contexto mal ensamblado.

## Cierre listo para decir

> “RAG no reemplaza el trabajo de diseñar contexto: lo automatiza. Si recuperamos información incorrecta, incompleta o irrelevante, el LLM recibirá una mala base para responder. Por eso evaluamos retrieval, no solo la respuesta final.”

---

# Preguntas de salida

Haz estas preguntas antes de terminar:

1. “¿Qué diferencia hay entre la fase Offline y la fase Online?”
2. “¿Por qué dividimos un documento en chunks?”
3. “¿Para qué sirve el overlap?”
4. “¿Qué recibe el LLM dentro de un RAG?”
5. “¿Por qué Top-K no debe ser siempre lo más alto posible?”

Respuestas esperadas:

- Offline prepara e indexa la biblioteca antes de la consulta; Online busca y responde cuando llega la pregunta.
- Para recuperar fragmentos precisos y manejables, en vez de documentos completos.
- Para preservar contexto entre fragmentos vecinos.
- La pregunta, instrucciones y los chunks recuperados que forman el contexto.
- Porque traer más resultados también puede traer ruido, repetición, costo y confusión.

---

# Si tienes 50 minutos

Añade estas extensiones sin incorporar conceptos nuevos:

| Extensión | Tiempo | Actividad |
|---|---:|---|
| Navegar nodos | 8 min | Cada estudiante explica un nodo del pipeline con sus propias palabras. |
| Comparar Top-K | 5 min | Ejecutar la simulación con K = 2 y K = 4; discutir señal y ruido. |
| Decidir chunking | 7 min | Grupos proponen configuración para políticas de RR. HH., manual técnico o FAQs. |

---

# Recordatorio para ti

- La demo es una **simulación didáctica**, no una ejecución con documentos reales ni un modelo real.
- “RAG reduce el riesgo de alucinación” es correcto; “RAG elimina las alucinaciones” no lo es.
- Chunk size y overlap no tienen números universales. Se prueban y se evalúan con preguntas reales.
- El LLM no “consulta la Vector DB” directamente: recibe contexto construido a partir de la recuperación.
- Si el tiempo se acaba, no omitas la diferencia Offline/Online ni el ejercicio de overlap: son las dos ideas estructurales de esta lección.
