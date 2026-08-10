# Demo 01 — Token Playground

## 1. Propósito de la Demo
Esta demo interactiva, disponible dentro de la plataforma CASE Academy, tiene como objetivo romper la intuición visual de los ingenieros sobre cómo leen los modelos de lenguaje. Busca hacer visible la unidad atómica de los LLMs: **el Token**.

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Inmediatamente después de la Lesson 01 (De Código a Probabilidad).
- **Duración sugerida:** 10 a 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción
Abre la plataforma CASE Academy y navega a `Demo 01 — Token Playground`. Pide a los alumnos que abran la misma URL en sus pantallas si tienen acceso, o que observen la pantalla proyectada.

### Paso 2: El experimento del Texto Común
1. Ingresa una frase estándar y común en inglés, por ejemplo: *"The quick brown fox jumps over the lazy dog."*
2. **Lo que debes destacar:** Observen cómo cada palabra común (y sus espacios) se mapea a un único token. El modelo ve esto como un rompecabezas muy eficiente.

### Paso 3: El experimento del Texto Raro/Técnico
1. Borra el texto anterior e ingresa un bloque de código legacy, por ejemplo, una variable en PascalCase con un error tipográfico: `CalculateTotalRevenueForCustoomer()`.
2. **Lo que debes destacar:** Muestra cómo `Custoomer` se fragmenta en varios tokens ridículos (ej: `Custo`, `omer`). Explica que el modelo no sabe qué es una "o" extra; estadísticamente tiene que predecir el siguiente fragmento, lo que hace que tareas de conteo de letras o sintaxis estricta sean propensas a errores.

### Paso 4: Impacto en el Idioma (Español vs Inglés)
1. Escribe la misma frase en inglés y luego en español.
2. **Lo que debes destacar:** Generalmente, los textos en español consumen más tokens que en inglés para expresar la misma idea. Menciona el impacto operativo de esto: **los costos y la latencia aumentan dependiendo del idioma**, un trade-off arquitectónico crítico para sistemas globales.

## 4. Puntos de Discusión a provocar
- "¿Se dan cuenta de por qué si le piden al LLM que escriba una palabra de exactamente 15 letras, casi siempre falla?"
- "Cuando pasamos un log de servidor lleno de hashes UUID aleatorios, destruimos la ventana de contexto porque cada hash se divide en docenas de tokens."

## 5. Transición al Lab
"Hemos visto la materia prima del modelo: el token. Ahora vamos a llevar esto a su código real. En el Real Engineering Lab 01, van a analizar una rutina de su propio entorno de trabajo para separar mentalmente lo que pertenece al mundo rígido de los caracteres (código tradicional) y lo que puede ser delegado al mundo de los tokens (probabilidad)."
