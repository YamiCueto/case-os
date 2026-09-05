# M04-L01 — Representaciones vectoriales (Embeddings) y bases de datos vectoriales

## Guion simple para impartir la Lección 01

**Horario:** 17:00–19:00  
**Modalidad:** proyectar CASE Academy y usar esta guía para dirigir la conversación.  
**Meta de hoy:** que el grupo entienda por qué buscar por palabras no siempre basta y cuándo usar búsqueda léxica, semántica o ambas.

---

## La idea central que deben llevarse

> Una representación vectorial (embedding) convierte un texto en números que permiten buscar contenidos relacionados por significado. Pero, cuando una palabra o un código exacto importa, la búsqueda léxica sigue siendo necesaria.

No necesitas que memoricen fórmulas, HNSW ni RRF. Basta con que puedan explicar qué problema resuelve cada pieza.

---

## Cómo usar esta guía

En cada sección de la plataforma sigue siempre esta secuencia:

1. Haz la pregunta.
2. Pide dos o tres respuestas.
3. Muestra o manipula la experiencia en pantalla.
4. Pregunta qué observaron.
5. Da la explicación técnica corta.
6. Cierra con una sola conclusión.

No es necesario leer los párrafos de CASE Academy en voz alta: úsalos como apoyo visual.

---

# Cronograma

| Hora | Sección visible en CASE Academy | Objetivo real |
|---|---|---|
| 17:00–17:15 | 01. Búsqueda Léxica vs Búsqueda Semántica | Descubrir que palabras diferentes pueden expresar la misma necesidad. |
| 17:15–17:35 | 02. ¿Qué es un Embedding? | Crear la intuición de que textos relacionados quedan cerca. |
| 17:35–17:45 | 03. Cosine Similarity | Entender que se usa una medida para ordenar qué tan relacionados están dos vectores. |
| 17:45–18:05 | 04. Top-K Retrieval | Comprender que el buscador devuelve los K resultados más relevantes. |
| 18:05–18:15 | 05. HNSW | Entender solo por qué necesitamos buscar eficientemente a gran escala. |
| 18:15–18:35 | 06. Búsqueda Híbrida | Reconocer que los códigos y términos exactos siguen importando. |
| 18:35–18:55 | 07. Ejercicio de Integración | Decidir entre búsqueda léxica, semántica e híbrida. |
| 18:55–19:00 | Cierre | Conectar retrieval con la próxima lección sobre RAG y chunking. |

Si el grupo participa mucho, reduce HNSW a cinco minutos. No recortes el ejercicio final.

---

# 17:00–17:15 — 01. Búsqueda Léxica vs Búsqueda Semántica

## Concepto fácil de explicar

- **Búsqueda léxica:** busca las palabras escritas por la persona, o palabras muy parecidas.
- **Búsqueda semántica:** busca textos que hablen de la misma idea, aunque usen palabras distintas.
- **BM25:** es un motor de búsqueda léxica que ordena los documentos según qué tanto coinciden sus términos con la consulta.

Forma corta de decirlo:

> “La búsqueda léxica pregunta: ‘¿dónde aparecen estas palabras?’. La búsqueda semántica pregunta: ‘¿qué texto habla de esta misma necesidad?’.”

## Pregunta de apertura

> “Tenemos miles de documentos. Si alguien pregunta algo, ¿cómo encontramos el documento útil?”

Escucha respuestas como Google, palabras clave, filtros o IA. No corrijas todavía.

Luego pregunta:

> “Si un documento dice `crédito educativo` y la persona escribe `quiero financiar mis estudios`, ¿deberíamos poder encontrarlo?”

La respuesta esperada es sí.

## En pantalla

Abre la experiencia **Experimento: Léxico vs Semántico**.

Usa estas consultas, una por una:

1. `guardar plata todos los meses`
2. `financiar mis estudios`
3. `Factura #100245`

Antes de cambiar la consulta, pregunta:

> “¿Qué documento creen que debería quedar primero?”

Pide que comparen las dos columnas, no los porcentajes exactos.

## Explicación breve

> “La búsqueda léxica se apoya en las palabras presentes. La búsqueda semántica intenta recuperar textos relacionados por intención o significado, aunque no usen las mismas palabras.”

No expliques BM25 por dentro. Solo nómbralo:

> “BM25 es una técnica habitual de búsqueda léxica.”

## Conclusión para decir

> “La búsqueda semántica no es mejor en todos los casos: sirve para un problema diferente.”

---

# 17:15–17:35 — 02. ¿Qué es un Embedding?

## Concepto fácil de explicar

- **Embedding:** una representación numérica de un texto.
- **Vector:** la lista de números que forma esa representación.
- **Espacio vectorial:** una forma de imaginar dónde quedan ubicados esos vectores para compararlos.

Analogía útil:

> “Es como poner cada frase en un mapa de ideas. Las frases que tratan temas parecidos quedan cerca; las que hablan de otra cosa quedan lejos.”

Aclara enseguida:

> “No es un mapa real ni los números tienen un significado individual para nosotros. Es una forma matemática de organizar relaciones entre textos.”

## Pregunta

Lee estas frases:

- “Olvidé mi contraseña.”
- “No puedo ingresar a mi cuenta.”
- “Necesito restablecer mis credenciales.”
- “Quiero comprar una motocicleta.”

Pregunta:

> “Sin usar tecnología: ¿cuáles deberían quedar juntas y cuál debería quedar lejos?”

Deja que justifiquen la respuesta.

## Concepto técnico mínimo

> “Un embedding es una lista de números generada por un modelo para representar un texto. No leemos esos números uno por uno; nos importa que textos con una intención parecida puedan quedar próximos.”

No digas que una dimensión es una categoría como ‘finanzas’ o ‘soporte’.

## En pantalla

Abre **¿Qué es un Embedding?** y la experiencia 3D.

Pide a una persona que seleccione un punto. Pregunta:

> “¿Qué observan en los vecinos del concepto seleccionado?”

Luego aclara:

> “La vista 3D es una simplificación para que podamos ver la idea. Un embedding real tiene cientos o miles de dimensiones.”

## Mini ejercicio oral

> “Si agregamos ‘Necesito cambiar mi password’, ¿en qué grupo la pondrían? ¿Por qué?”

## Conclusión para decir

> “El embedding no es magia ni una traducción del texto. Es una representación numérica útil para comparar contenidos.”

---

# 17:35–17:45 — 03. Cosine Similarity

## Concepto fácil de explicar

- **Similitud:** una puntuación que ayuda a ordenar qué tan relacionados parecen dos vectores.
- **Similitud coseno:** compara hacia dónde apuntan dos vectores, es decir, compara su dirección.

Forma corta de decirlo:

> “Si dos flechas apuntan casi hacia el mismo lado, la similitud es alta. Si apuntan hacia lados muy diferentes, la similitud baja.”

No hace falta que memoricen la fórmula. Solo deben recordar que es una manera de medir cercanía entre representaciones.

## Pregunta

> “Ya tenemos vectores. ¿Cómo decidimos cuáles se parecen más?”

Escucha ideas: distancia, cercanía, ángulo o comparación matemática.

## En pantalla

Abre **Midiendo la similitud**. Mueve el vector B una vez para que apunte cerca de A y otra para que se aleje.

Pregunta antes de moverlo:

> “Si B apunta en la misma dirección que A, ¿la similitud debería subir o bajar?”

## Explicación breve

> “La similitud coseno es una medida matemática que compara la dirección de dos vectores. Para nuestra clase basta con esta intuición: direcciones parecidas producen una similitud mayor.”

Puedes señalar el ángulo en pantalla, pero no desarrolles la fórmula ni el código.

## Conclusión para decir

> “La similitud coseno compara vectores; que esos vectores reflejen significado depende del modelo de embeddings.”

---

# 17:45–18:05 — 04. Top-K Retrieval

## Concepto fácil de explicar

- **Retrieval:** recuperar o traer documentos que podrían ayudar a responder una pregunta.
- **Top-K:** los K resultados que el sistema considera más relacionados con la consulta.
- **Ranking:** el orden de resultados, desde el más prometedor hasta los siguientes.

Forma corta de decirlo:

> “Top-K es pedirle al buscador: ‘no me des todos los documentos; tráeme solamente los K candidatos más útiles’.”

## Pregunta

> “Si tenemos una pregunta y mil documentos, ¿queremos un solo resultado o varios candidatos?”

Después:

> “¿Qué podría pasar si solo devolvemos uno y no era el mejor?”

## En pantalla

Abre **Top-K Retrieval**.

Prueba primero K = 1 y luego K = 3 o K = 5. No necesitas recorrer todos los valores.

Pregunta:

> “¿Qué cambió cuando aumentamos K?”

Respuesta buscada: recuperamos más vecinos o candidatos relevantes.

## Explicación breve

> “Top-K significa devolver los K resultados con mejor relación con la consulta. K no significa ‘la respuesta correcta’; significa cuántos candidatos pasamos al siguiente paso.”

## Ejercicio rápido

> “Para una pregunta simple, ¿usarían K = 1, K = 3 o K = 20? ¿Qué ganamos y qué arriesgamos al traer demasiados resultados?”

Busca que digan: más contexto puede ayudar, pero también puede traer ruido.

---

# 18:05–18:15 — 05. HNSW: solo la idea de escala

## Concepto fácil de explicar

- **Índice:** una estructura que permite encontrar información sin revisar todo, como el índice de un libro.
- **ANN (Approximate Nearest Neighbors):** búsqueda de vecinos muy cercanos sin comparar la consulta contra cada vector existente.
- **HNSW:** un tipo de índice que navega conexiones entre vectores para llegar rápido a una zona donde probablemente estén los mejores resultados.

Forma corta de decirlo:

> “En vez de revisar cada casa de una ciudad para encontrar una dirección, usamos un mapa que nos lleva primero al barrio correcto y luego a la calle correcta.”

## Pregunta

> “Si hay cien millones de vectores, ¿es buena idea comparar la consulta con todos cada vez?”

Respuesta esperada: sería muy lento o costoso.

## En pantalla

Abre **Indexación HNSW**. Haz pocos pasos; no conviertas esta parte en una explicación del algoritmo.

Pregunta:

> “¿Qué creen que intenta evitar este recorrido?”

## Explicación breve

> “HNSW es un tipo de índice. Ayuda a recorrer solo una parte prometedora de los vectores para encontrar vecinos cercanos más rápido.”

Si aparece la palabra *approximate*, dilo así:

> “Es aproximado: priorizamos obtener resultados muy buenos rápidamente, sin revisar absolutamente todo.”

## Conclusión para decir

> “Hoy no necesitamos saber construir HNSW; necesitamos saber qué problema resuelve: buscar a escala.”

---

# 18:15–18:35 — 06. Búsqueda Híbrida

## Concepto fácil de explicar

- **Búsqueda híbrida:** usa búsqueda léxica y semántica para aprovechar lo mejor de ambas.
- **RRF (Reciprocal Rank Fusion):** una regla para mezclar dos listas ordenadas de resultados y producir una lista final.

Forma corta de decirlo:

> “Un motor protege las palabras exactas; el otro entiende la intención. La búsqueda híbrida escucha a los dos antes de decidir qué mostrar primero.”

## Pregunta

> “Si la búsqueda semántica encuentra significados relacionados, ¿podemos dejar de buscar palabras exactas?”

Usa el caso:

```text
Factura #100245
Factura #100246
```

Pregunta:

> “¿Sería aceptable recibir la factura equivocada porque es semánticamente parecida?”

La respuesta es no.

## En pantalla

Vuelve brevemente a la experiencia Léxico vs Semántico con `Factura #100245`, o abre **Búsqueda Híbrida** si el grupo sigue atento.

## Explicación breve

> “La búsqueda léxica protege las coincidencias exactas: códigos, errores, nombres y referencias. La búsqueda semántica ayuda cuando el usuario describe una necesidad con sus propias palabras.”

> “Una búsqueda híbrida combina ambos tipos de resultados. RRF es simplemente una forma de unir sus posiciones en un ranking final.”

No muestres ni expliques la fórmula de RRF salvo que alguien la pida.

## Conclusión para decir

> “No elegimos un motor ‘mejor’; elegimos la estrategia adecuada al tipo de consulta.”

---

# 18:35–18:55 — 07. Ejercicio de integración

## Instrucción

Abre **Decisión Arquitectónica**.

Antes de permitir que elijan, di:

> “En grupos de dos, decidan qué estrategia usarían y justifiquen su respuesta antes de hacer clic.”

Usa los tres escenarios de la plataforma:

1. `Factura #100245` → léxica.
2. `Quiero ahorrar para comprar una vivienda` → semántica.
3. `Error de timeout en la base de datos SQL Server` → híbrida.

## Preguntas para cada caso

> “¿Qué parte de esta consulta necesita coincidencia exacta?”

> “¿Qué parte depende de entender la intención?”

> “¿Qué riesgo tendríamos si usáramos solo una estrategia?”

## Cierre del ejercicio

No presentes las decisiones como una regla universal. Di:

> “En producción, la respuesta depende del tipo de documentos, las consultas de los usuarios y el costo de equivocarse. Este ejercicio nos ayuda a razonar la decisión.”

---

# 18:55–19:00 — Cierre y puente a la Lección 02

## Concepto fácil de explicar

- **RAG:** un patrón donde el sistema busca información relevante antes de pedirle al LLM que responda.
- **Contexto:** los fragmentos de información recuperados que se entregan al LLM junto con la pregunta.
- **Chunking:** dividir documentos grandes en fragmentos pequeños y útiles para poder buscarlos y recuperarlos mejor.

Forma corta de decirlo:

> “Antes de responder, el sistema abre la parte relevante de su biblioteca y se la entrega al modelo. Eso es RAG.”

Dibuja o muestra este flujo sencillo:

```text
Pregunta del usuario
        ↓
Búsqueda de contenido relevante
        ↓
Top-K resultados
        ↓
Contexto para el LLM
        ↓
Respuesta
```

Di:

> “Hoy entendimos la recuperación: encontrar contenido relevante antes de responder. En la siguiente lección veremos cómo preparar documentos en fragmentos y cómo usar esos resultados como contexto para un LLM. Ese patrón se llama RAG.”

No expliques el pipeline RAG completo hoy: la Lección 02 lo desarrolla.

---

# Preguntas de salida

Haz estas tres preguntas antes de terminar:

1. “¿Qué diferencia hay entre búsqueda léxica y semántica?”
2. “¿Qué es un embedding en una frase?”
3. “¿Cuándo elegirían una búsqueda híbrida?”

Respuestas esperadas:

- Léxica: busca coincidencias de palabras o términos; semántica: busca contenidos relacionados por significado.
- Un embedding es una representación numérica de un texto que permite compararlo con otros textos.
- Híbrida: cuando importan a la vez el significado general y términos técnicos o exactos.

---

# Recordatorio para ti

- No leer la plataforma: úsala para mostrar y preguntar.
- No perseguir precisión matemática; buscar comprensión útil.
- No usar “el embedding entiende”. Preferir: “el modelo produce una representación que permite comparar relaciones aprendidas”.
- No decir que HNSW garantiza el resultado exacto.
- Si falta tiempo, omite detalles de HNSW y RRF; nunca omitas el ejercicio final.

La clase habrá salido bien si, al final, alguien puede decir:

> “Embeddings sirven para buscar por significado, pero los códigos exactos requieren búsqueda por palabras; a veces conviene combinar ambas.”
