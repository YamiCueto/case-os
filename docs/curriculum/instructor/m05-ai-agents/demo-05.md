# Demo 05 — The Agent Loop (Instructor Guide)

## 1. Propósito de la Demo
Desmitificar el razonamiento de los agentes permitiendo a los estudiantes operar manualmente el bucle de toma de decisiones. Visualizar cómo la autonomía aumenta la superficie de fallo al permitir que el sistema se quede atascado en bucles y evidenciar la diferencia entre la "Intención (Intent)" observable y la acción subyacente.

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Tras finalizar la Lesson 03 (The Agent Loop).
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Abre la plataforma CASE Academy y navega a `Demo 05 — The Agent Loop`. Explica a la clase que están viendo el "backend" de un agente, no la interfaz de chat bonita que ve el usuario. El objetivo del agente es "Encontrar el correo de Juan y enviarle el reporte de ventas".

### Paso 2: El Flujo Feliz (Autonomía funcionando)
1. Inicia la simulación. El sistema muestra:
   - **INTENT:** "Necesito buscar el correo de Juan."
   - **ACTION:** `search_directory(name="Juan")`
2. Como instructor, presiona el botón "Inyectar Observation (Éxito)".
   - **OBSERVATION:** `{"email": "juan@empresa.com"}`
3. El sistema realiza el **STATE UPDATE** (el correo se guarda en memoria) y avanza a la siguiente iteración.
4. Siguiente ciclo:
   - **INTENT:** "Ahora que tengo el correo, enviaré el reporte."
   - **ACTION:** `send_email(to="juan@empresa.com", doc="sales_report.pdf")`
5. **Lo que debes destacar:** Esto parece mágico, pero no es más que dos llamadas secuenciales donde el estado de la primera alimentó a la segunda.

### Paso 3: Aumentando la Superficie de Fallo (El Bucle)
1. Reinicia la simulación con una pequeña trampa.
2. Ciclo 1:
   - **INTENT:** "Necesito buscar el correo de Juan."
   - **ACTION:** `search_directory(name="Juan")`
3. Esta vez, inyecta un fallo simulando una caída de la API:
   - **OBSERVATION:** `500 Internal Server Error`
4. Observa el Ciclo 2. Muchos modelos básicos reaccionarán así:
   - **INTENT:** "La búsqueda falló, intentaré de nuevo."
   - **ACTION:** `search_directory(name="Juan")`
5. Sigue inyectando el error 500 un par de veces.
6. **Lo que debes destacar:** El agente está atrapado en un bucle infinito, consumiendo tokens (dinero) a cada segundo. Pregunta al grupo: *"¿Cómo detenemos esto en producción si nadie está mirando la pantalla?"* (Respuestas esperadas: Max Iterations, Circuit Breakers, Fallback to Human).

### Paso 4: La Decisión Arquitectónica
1. Detén el bucle infinito de la Demo.
2. Plantea el problema: *"Para hacer esta tarea (Buscar correo -> Enviar PDF), usamos un agente que casi se queda en un bucle infinito costando cientos de dólares. ¿Se podía resolver esto con un Fixed Pipeline o una State Machine?"*
3. Demuestra en la pizarra cómo un simple código Python de dos líneas con un bloque `try/catch` habría sido infinitamente más barato, rápido y seguro.

## 4. Puntos de Discusión a provocar
- "Si ocultamos el 'Intent' en la interfaz, el usuario final solo ve una demora de 10 segundos y luego un fallo. ¿Por qué es crítico almacenar el 'Intent' y las 'Observations' en nuestros logs de backend (Observabilidad)?"
- "Si cada iteración cuesta dinero, ¿cómo justifican económicamente el uso de este patrón frente a su jefe?"

## 5. Transición al Lab
"Hemos visto lo fácil que es caer en la trampa de construir un agente para una tarea que no lo merecía. En el *Real Engineering Lab 05*, ustedes serán sus propios arquitectos críticos. Deberán justificar por qué NO usar herramientas simples antes de siquiera atreverse a diseñar las especificaciones de un agente."
