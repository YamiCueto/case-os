# Lesson 01 — Embeddings & Vector Databases

## 1. Propósito de la clase
Desmitificar las representaciones vectoriales (*Embeddings*). Enseñar que los vectores son una técnica matemática para capturar la proximidad semántica (significado) de los textos, pero que no comprenden el conocimiento absoluto ni son inmunes a errores de ambigüedad.

## 2. Qué debe aprender el estudiante
- Definir qué es un Embedding: una representación matemática (array de flotantes) que proyecta el significado de un texto en un espacio N-dimensional.
- Entender el rol real de una Vector Database: indexar y buscar rápidamente proximidad entre estas coordenadas geométricas (búsqueda semántica), en lugar de coincidencias exactas de palabras (búsqueda léxica).
- Reconocer las limitaciones de los embeddings frente a negaciones, ironía o términos técnicos altamente específicos (donde la búsqueda semántica suele fallar).

## 3. Conceptos fundamentales

### 3.1 Embeddings
Los embeddings convierten palabras, frases o documentos enteros en números. Si dos fragmentos de texto significan lo mismo en la vida real, sus vectores apuntarán hacia la misma dirección en el espacio geométrico.

#### Concept Analogy: Embeddings (Coordenadas de Significado)
- **Analogía cotidiana:** Ubicar ciudades en un mapa de GPS (Latitud y Longitud).
- **Mapeo:** La "ciudad" es el texto. La "latitud/longitud" es el Embedding. El mapa es el "espacio N-dimensional".
- **Límite de la analogía:** Un GPS tiene 2 coordenadas espaciales. Un Embedding tiene entre 768 y 1536 dimensiones que representan conceptos abstractos (ej. nivel de formalidad, connotación positiva/negativa, tema). Además, en un mapa físico la distancia es absoluta; en los embeddings, la distancia depende de los datos con los que el modelo fue entrenado (sus sesgos).
- **Traducción técnica:** Proyección de tokens discretos en un espacio vectorial continuo denso.
- **Ejemplo aplicado a SWE:** Quieres que tu app busque "error de conexión". Si usas una base de datos tradicional (SQL `LIKE`), "falló el timeout de base de datos" no hará match. Si conviertes ambas frases a Embeddings, el cálculo matemático de su ángulo (Cosine Similarity) será cercano a 0.95 (muy similares), permitiendo el match.

### 3.2 Búsqueda Vectorial vs Léxica
La búsqueda semántica (vectores) encuentra el "significado". La búsqueda léxica (BM25/TF-IDF) encuentra la "palabra exacta". La ingeniería avanzada requiere ambas (*Hybrid Search*).

#### Concept Analogy: Vector vs Léxica
- **Analogía cotidiana:** Buscar un libro en la biblioteca describiendo la trama al bibliotecario (Semántica) vs buscar un libro dándole el número ISBN exacto (Léxica).
- **Mapeo:** El bibliotecario asociando la trama a un libro es la búsqueda por Embeddings. El ISBN exacto es la búsqueda por `keyword` (Léxica).
- **Límite de la analogía:** El bibliotecario usa razonamiento lógico profundo; el motor vectorial solo mide distancias geométricas estúpidas. Si le pides al bibliotecario "libros que NO traten sobre magia", entenderá. Si se lo pides a un motor vectorial simple, la palabra "magia" arrastrará los vectores hacia los libros de magia, dándote exactamente lo que no querías.
- **Traducción técnica:** *K-Nearest Neighbors (KNN)* o *Approximate Nearest Neighbor (ANN)* en un índice vectorial.
- **Ejemplo aplicado a SWE:** Al buscar un código de error específico `ERR-SYS-9021`, la búsqueda vectorial puede fallar o traer `ERR-SYS-9022` porque son "similares". La búsqueda léxica es infinitamente superior para coincidencias exactas.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Paso todos mis documentos a una base de datos vectorial y mágicamente el LLM ya 'sabe' todo lo que hay en mi empresa."*
**Consecuencia:** Descubrirá en producción que el buscador devuelve documentos irrelevantes porque midió "similitud" en lugar de "verdad". La IA generará respuestas confiadas basadas en documentos incorrectos, culpando al LLM cuando en realidad falló el algoritmo de indexación y búsqueda que el ingeniero implementó.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Los números mapean las palabras que "se parecen" para encontrarlas juntas.
- **Mecanismo:** Un modelo de Embeddings (como `text-embedding-3-small`) ha sido pre-entrenado para colocar conceptos contextuales cerca en un espacio hiperdimensional. La base de datos vectorial crea un índice HNSW para calcular distancias (Cosine, Dot Product) en milisegundos a gran escala.
- **Consecuencia de ingeniería:** Usar vectores añade un nuevo microservicio a nuestra arquitectura, y nos obliga a gestionar ciclos de actualización (¿qué pasa si el texto original cambia? El vector debe recalcularse).

## 6. Ejemplo técnico
**Texto A:** "El cliente no pudo pagar con tarjeta."
**Texto B:** "Fallo en la pasarela de Stripe."
**Texto C:** "El perro come carne."

En SQL tradicional: Texto A no tiene relación con B.
En Espacio Vectorial:
- Similitud (A, B) = 0.88 (Están cerca, ambos hablan de pagos fallidos).
- Similitud (A, C) = 0.12 (Están lejísimos).

## 7. Ejemplo aplicado a Software Engineering
Diseñar el sistema de autocompletado de la base de conocimientos interna de soporte. En lugar de forzar a los agentes a recordar las palabras exactas del título del artículo de la wiki, un input de usuario ("pantalla azul en windows") se convierte en embedding y recupera el artículo oficial de la empresa ("BSOD Troubleshooting"), aumentando drásticamente la tasa de resolución en el primer contacto.

## 8. Errores conceptuales frecuentes
- **"El modelo genera texto leyendo el Vector DB"**: Los LLMs no leen bases vectoriales. El código backend tradicional es el que busca en la BD vectorial, extrae el texto, y se lo pasa en formato *string* al LLM.
- **"Los vectores son deterministas"**: Una palabra como "Batería" (de coche vs instrumento musical) tiene un embedding estático en modelos viejos, pero los modelos actuales (*contextual embeddings*) calculan la coordenada dependiendo de las palabras vecinas.

## 9. Preguntas para el grupo
- "Si un usuario busca 'Cómo cancelar mi cuenta', ¿la búsqueda vectorial podría devolverle accidentalmente 'Cómo reactivar mi cuenta'? ¿Por qué?" (Respuesta: porque la distancia semántica entre 'cancelar' y 'reactivar' es menor que la distancia hacia cosas sin relación, a veces fallando por la negación o el opuesto).
- "¿Por qué no podemos simplemente actualizar la base de datos SQL que ya tenemos para que entienda el 'significado' del texto?"

## 10. Mini ejercicio
Muestra 3 frases en pantalla (1. "Quiero devolver mi producto", 2. "Refund policy", 3. "El producto llegó roto"). Pide a la clase que discutan si una búsqueda por palabra clave (SQL) vincularía estas frases. Luego pregúntales por qué la búsqueda vectorial sí lo haría (las 3 mapean al concepto hiperdimensional de 'Problemas post-venta').

## 11. Demo relacionada
*(Se explorará en Demo 04).*

## 12. Discusión
Los Embeddings son el pegamento que permite conectar la intención humana ambigua con datos empresariales estructurados y no estructurados, pero son solo el primer paso. Producen "candidatos", no certezas.

## 13. Preparación para la siguiente clase
"Hemos aprendido a transformar el conocimiento en números y recuperarlo. Pero encontrar un documento en la base de datos no es suficiente para darle una respuesta útil al usuario. En la próxima lección, ensamblaremos el Pipeline completo de RAG para ver cómo se conectan los vectores con la generación."
