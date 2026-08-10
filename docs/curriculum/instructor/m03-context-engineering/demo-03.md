# Demo 03 — Engineer the Context (Instructor Guide)

## 1. Propósito de la Demo
Demostrar visual e interactivamente el impacto que tiene la sobrecarga de información (ruido) y la compresión en la respuesta de un modelo. Los estudiantes verán en tiempo real cómo un modelo "se pierde" o alucina cuando la densidad de información decae, desmintiendo que "más contexto es mejor".

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Inmediatamente después de la Lesson 03 (Compression & Validation).
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Abre la plataforma CASE Academy y navega a `Demo 03 — Engineer the Context`. Explica a la clase que van a actuar como el ensamblador backend que alimenta al LLM con datos sobre una supuesta interrupción de servicio (Outage).

### Paso 2: Escenario "Contexto Máximo" (El Anti-Patrón)
1. Activa la opción para enviar un "Volcado completo de logs" (esto inyectará miles de líneas de logs irrelevantes).
2. Añade un par de líneas de discusión irrelevante del chat de Slack de soporte.
3. Inserta el dato real que el modelo debe encontrar: (ej. "La base de datos principal se reinició a las 04:13 AM").
4. El Prompt (Instrucción) debe pedir: "Genera el reporte ejecutivo del incidente y la causa raíz".
5. **Lo que debes destacar:** Ejecuta la simulación. Observen cómo el LLM falla, genera un resumen excesivamente largo enfocándose en información irrelevante del chat, e ignora (o entierra) el reinicio crítico de la base de datos de las 04:13 AM.

### Paso 3: Discusión (Lost in the middle)
1. Pregunta a la audiencia: *"Le pasamos todos los archivos relacionados. ¿Por qué falló?"*
2. Guía la discusión hacia el fenómeno de dilución de atención: al haber tantos tokens de "ruido", la saliencia matemática de las palabras "reinicio" y "04:13 AM" se redujo drásticamente.

### Paso 4: Escenario "Contexto Mínimo Útil" (Compresión)
1. Reinicia la demo.
2. Ahora, activa la opción "Filtrar por errores críticos" (esto simula un bloque de código backend haciendo `grep "ERROR"`).
3. Elimina las conversaciones de Slack (Priorización).
4. Ejecuta de nuevo la misma instrucción.
5. **Lo que debes destacar:** El LLM genera ahora un reporte ejecutivo impecable de 3 líneas que señala la caída exacta de la base de datos.
6. Demuestra la diferencia en costo: *"El primer prompt consumió 8,000 tokens y tardó 12 segundos. Este consumió 150 tokens y tardó 1 segundo."*

## 4. Puntos de Discusión a provocar
- "Si ustedes estuvieran automatizando un sistema de triaje de bugs con IA, ¿escribirían una lógica en Python para pre-procesar y comprimir los logs antes de enviarlos, o le enviarían todo el archivo de logs crudo al LLM?"
- "Note cómo la instrucción (Prompt) no cambió entre el Paso 2 y el Paso 4. Lo único que cambió fue la ingeniería de los datos que inyectamos. **El prompt no soluciona los problemas de malos datos.**"

## 5. Transición al Lab
"Han visto cómo la compresión salva la tarea. Ahora, en el *Real Engineering Lab 03*, ustedes ya no van a escribir prompts. Van a escribir un **Context Manifest** para definir matemáticamente qué información debe extraer nuestro backend y cómo inyectarla a la IA."
