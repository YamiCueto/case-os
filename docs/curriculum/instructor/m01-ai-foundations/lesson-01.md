# Lesson 01 — De Código a Probabilidad

## 1. Propósito de la clase
Mostrar al ingeniero de software el cambio de paradigma fundamental al trabajar con IA: pasar de un mundo de ejecución determinista (donde el código fuente siempre produce el mismo resultado dadas las mismas entradas) a un mundo de probabilidad basada en secuencias de tokens. 

## 2. Qué debe aprender el estudiante
- Entender que un modelo de lenguaje no "piensa", sino que calcula distribuciones de probabilidad sobre un vocabulario de tokens.
- Reconocer la diferencia absoluta de comportamiento entre un sistema de software tradicional y un sistema generativo.
- Aceptar que el determinismo estricto se pierde y debe ser reemplazado por gestión de expectativas e ingeniería de resiliencia.

## 3. Conceptos fundamentales

### 3.1 El Paradigma Determinista
En el software clásico, la arquitectura garantiza previsibilidad. `A + B` siempre es `C`. Si hay un error, hay un `stack trace`. La lógica de negocio está escrita en reglas rígidas (`if`, `switch`, bases de datos relacionales).

### 3.2 Tokens vs Caracteres
El modelo no lee letras ni palabras, lee representaciones numéricas llamadas **tokens**. Un token es la unidad fundamental de procesamiento. Las palabras comunes pueden ser un solo token, mientras que palabras raras se dividen. Esto afecta desde la lógica (el modelo puede fallar contando letras) hasta los costos operativos (el cómputo se factura por token).

#### Concept Analogy: Token
- **Analogía cotidiana:** Un rompecabezas de sílabas prefabricadas.
- **Mapeo:** Las piezas grandes son palabras comunes (ej. "el", "gato"), las piezas pequeñas son fragmentos de palabras raras (ej. "hipo", "pota", "mo").
- **Límite de la analogía:** A diferencia de las piezas físicas, los tokens son secuencias matemáticas (vectores) con relación semántica en un espacio multidimensional.
- **Traducción técnica:** Representación numérica fragmentada del vocabulario.
- **Ejemplo aplicado a SWE:** Por qué un LLM falla si le pides un string de exactamente 10 letras o por qué pasar un UUID en un log destroza la ventana de contexto (porque se divide en muchos tokens).

### 3.3 Next-Token Prediction
El mecanismo núcleo de un LLM. Dado un contexto de $N$ tokens, el modelo asigna una probabilidad a cada token posible en su vocabulario de ser el $N+1$. No está razonando una idea completa de antemano; está desenvolviendo una distribución estadística iterativamente.

#### Concept Analogy: Modelo Probabilístico
- **Analogía cotidiana:** Un programa tradicional es como una máquina expendedora: introduces A y siempre recibes B. Un LLM se parece más a un conductor que, viendo la carretera, el tráfico y el destino, decide cuál es el siguiente movimiento más probable.
- **Mapeo:** La carretera y el tráfico son el contexto (prompt + historial). El siguiente movimiento es el siguiente token.
- **Límite de la analogía:** El conductor tiene consciencia y un plan a largo plazo. El modelo solo está calculando fríamente la estadística matemática del siguiente fragmento de texto basado en su entrenamiento.
- **Traducción técnica:** Distribución de probabilidad para el token $N+1$ sobre el vocabulario disponible.
- **Ejemplo aplicado a SWE:** Por eso no podemos tratar la salida del modelo como tratamos el resultado de una función pura, y no podemos confiar ciegamente en llamadas a APIs sin una validación estricta posterior.

## 4. Explicación para el instructor
Inicia la clase preguntando cuántos años de experiencia suman en la sala. Construye sobre eso: "Toda nuestra carrera nos han entrenado para eliminar la incertidumbre del código. Hoy, vamos a aprender a inyectar incertidumbre controlada para ganar capacidades semánticas."

No dejes que la clase se desvíe hacia redes neuronales o matrices de pesos matemáticos profundos. Mantén el enfoque en la abstracción de caja negra que consumirá un ingeniero: *input semántico -> predicción probabilística -> output no garantizado*.

## 5. Ejemplo técnico
Mostrar la tokenización en la práctica.
*Ejemplo:* 
La palabra `Hamburguesa` puede ser un token, pero `Hambuuurguesa` puede ser dividida en `Hamb` `uuu` `rguesa`.
Explica por qué los modelos fallan en rimas, poesía estricta o conteo exacto de letras: *no ven las letras, ven IDs de tokens*.

## 6. Ejemplo aplicado a Software Engineering
Imagina un parser tradicional de CSV.
- **Determinista:** Lee línea por línea, explota (crash) si falta una coma.
- **Probabilístico (LLM):** Puede inferir que la coma faltante fue un error humano, leer el contexto, y extraer el JSON correctamente. Ganamos flexibilidad, pero perdemos la garantía estricta de que fallará rápido (*fail-fast*).

## 7. Errores conceptuales frecuentes
- **"El modelo busca en su base de datos":** Los modelos base no tienen base de datos, tienen pesos entrenados. Memorizan patrones, no tablas.
- **"Le dije exactamente qué hacer y no lo hizo":** Los ingenieros asumen que un prompt es código fuente compilable. Un prompt es una fuerte influencia sobre la distribución de probabilidad, no una orden de compilador.

## 8. Preguntas para el grupo
- "¿Qué procesos en sus empresas actuales podrían tolerar un margen de error del 1% si a cambio ganan comprensión de lenguaje humano?"
- "Si un LLM solo predice el siguiente token, ¿cómo logra escribir código fuente que compila y funciona?"

## 9. Mini ejercicio
Pide a los estudiantes que escriban en el chat o en un papel una instrucción clásica de programación (ej. ordenar un array) y luego pídanles que intenten expresar esa misma orden en lenguaje natural asumiendo que el receptor puede "entender" la intención pero podría equivocarse en el detalle.

## 10. Demo relacionada
*(No realizar la demo profunda aquí, referenciar al Demo 01 para más adelante)*
Muestra brevemente la plataforma CASE Academy Lesson 01. Muestra la diferencia visual entre el bloque de código rígido y el bloque de probabilidad.

## 11. Discusión
Dirige la conversación hacia la **Ingeniería de Resiliencia**. Si sabemos que el sistema puede equivocarse, nuestro trabajo como ingenieros ya no es hacer el prompt perfecto, sino diseñar la arquitectura del sistema alrededor del modelo para atrapar el error (M08).

## 12. Takeaways
- El software tradicional es una máquina de estados determinista.
- Un LLM es una máquina de probabilidades estadística.
- La inteligencia artificial en software engineering es el arte de envolver sistemas probabilísticos con arquitecturas deterministas.

## 13. Preparación para la siguiente clase
"Si la base es estadística, entonces el modelo a veces inventa cosas. A eso le llamamos alucinación. En la siguiente clase veremos por qué ocurre la inferencia incorrecta y cómo clasificarla."
