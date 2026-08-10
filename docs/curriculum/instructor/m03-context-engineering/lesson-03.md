# Lesson 03 — Compression & Validation

## 1. Propósito de la clase
Enseñar técnicas de mitigación cuando el contexto necesario excede el presupuesto de tokens (Token Budget). Introducir la distinción técnica del fenómeno "Lost in the middle" (Degradación de contexto) de forma precisa, desmintiendo mitos absolutos, y enseñar a comprimir información maximizando la densidad de la señal.

## 2. Qué debe aprender el estudiante
- Entender que a medida que el contexto crece, el rendimiento del modelo no "se apaga", sino que su capacidad de atender a información secundaria decae.
- Aplicar técnicas de compresión de contexto (eliminar boilerplate, resumir historial, extraer entidades).
- Diseñar flujos donde una primera llamada al LLM comprima el contexto para una segunda llamada de razonamiento complejo.

## 3. Conceptos fundamentales

### 3.1 Degradación de Atención (Lost in the Middle)
No es una regla absoluta donde el modelo "deja de leer". Es un fenómeno de dilución de atención probabilística. 

#### Concept Analogy: Degradación de Atención
- **Analogía cotidiana:** Leer un informe técnico de 200 páginas antes de una reunión vs leer un resumen ejecutivo de 5 páginas.
- **Mapeo:** El informe técnico es un *prompt* con la ventana de contexto al máximo.
- **Límite de la analogía:** El humano olvida cosas porque su memoria biológica se satura. El modelo no "olvida"; su mecanismo de atención matemática asigna pesos de probabilidad más bajos a los tokens que están en el medio del documento comparado con los del inicio y el final (efecto U-shape).
- **Traducción técnica:** Disminución en el *Signal-to-Noise ratio* que afecta los valores de atención (*Attention Scores*) durante la predicción del siguiente token.
- **Ejemplo aplicado a SWE:** Enviar 20 archivos de código fuente esperando que el modelo detecte un bug sutil en la línea 4000 del séptimo archivo. **A medida que el contexto crece, la capacidad de utilizar de forma uniforme toda la información disponible puede degradarse; la posición, redundancia, saliencia y relevancia de la información importan.**

### 3.2 Densidad de Información y Compresión
La información necesaria para el modelo suele estar rodeada de ruido sintáctico (ej. boilerplate en código, HTML tags en páginas web). Comprimir contexto significa extraer la señal pura.

#### Concept Analogy: Densidad de Información
- **Analogía cotidiana:** Enviar un archivo `.zip` por una red lenta.
- **Mapeo:** La red lenta es el límite de tokens (y su costo/latencia). El `.zip` es el contexto comprimido.
- **Límite de la analogía:** El archivo ZIP se descomprime para restaurarse exactamente bit a bit. En el contexto de un LLM, la compresión implica una pérdida irreversible de datos (ej. eliminar comentarios de código, transformar HTML a Markdown), pero que preserva la semántica útil.
- **Traducción técnica:** Pre-procesamiento de datos (Text Parsing, Minification) para reducir la carga de tokens.
- **Ejemplo aplicado a SWE:** En vez de pasar un archivo HTML completo (10K tokens), pasar por una librería como `html-to-markdown` en el backend antes del modelo, reduciéndolo a 1K tokens sin perder información vital (texto y jerarquía).

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Para evitar el 'lost in the middle', simplemente moveré la información más importante al principio o al final de mis 50,000 tokens de prompt"*.
**Consecuencia:** Estará utilizando curitas estructurales en lugar de curar la enfermedad. Poner información crítica en los extremos asume que el resto es ruido. Si es ruido, no debería estar ahí. Seguirá pagando facturas de API carísimas y sufriendo latencia innecesaria. La solución real es no enviar esos 50,000 tokens en primer lugar.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Un mensaje corto y directo es más difícil de malinterpretar que un discurso de dos horas.
- **Mecanismo:** La arquitectura Transformer computa la relación matemática de cada token con todos los demás. Inyectar tokens de baja densidad (ej. espacios en blanco, boilerplate) fuerza al mecanismo a computar atención sobre nada, diluyendo el peso relativo de los tokens de alta densidad (la lógica de negocio).
- **Consecuencia de ingeniería:** Implementamos *pipelines* de transformación de datos (stripping, parsing, minifying) obligatorios *antes* de que el string llegue al ensamblador del prompt.

## 6. Ejemplo técnico
**Pobre densidad (300 tokens):**
```html
<div class="user-card-wrapper" style="color: blue;">
  <span id="name-label">Nombre del cliente:</span> <strong>Juan Pérez</strong>
  <!-- Este es el email del cliente -->
  <span>juan@empresa.com</span>
</div>
```

**Alta densidad (Comprimido - 25 tokens):**
```json
{ "cliente": "Juan Pérez", "email": "juan@empresa.com" }
```

## 7. Ejemplo aplicado a Software Engineering
Un sistema que resume reuniones (transcripciones). Una hora de audio genera miles de tokens con muletillas ("ehh", "bueno", "este"). Un ingeniero de contexto avanzado corre un modelo pequeño y barato primero para comprimir la transcripción ("filtrar muletillas y saludos"), y le pasa ese *output* comprimido al modelo grande (y caro) para extraer las decisiones estratégicas. Esto es la técnica de Compresión en Cascada.

## 8. Errores conceptuales frecuentes
- **"Los modelos ya tienen contextos infinitos"**: Promesas de marketing como "Contexto Infinito" a menudo esconden que el modelo degrada su precisión para recuperar hechos sutiles y aumenta brutalmente la latencia.
- **"El resumen no pierde información"**: Cualquier compresión semántica pierde información. Hay que tener cuidado de no comprimir el *contexto necesario*.

## 9. Preguntas para el grupo
- "Si tuvieran que inyectar un log de errores de 1 millón de líneas a un LLM, ¿qué pre-procesamiento por código harían antes de enviar el prompt?" (Respuestas esperadas: grep de errores severos, tail de las últimas 500 líneas, agrupar excepciones similares).
- "¿Por qué convertir un archivo PDF a texto plano puede aumentar el riesgo de alucinación si la tarea era entender una tabla de doble entrada?" (La estructura espacial se pierde en la compresión).

## 10. Mini ejercicio
Muestra en pantalla un bloque de código Java con muchos *Getters/Setters*, imports innecesarios y comentarios generados automáticamente. Pide al grupo que defina una regla (Regex o parser abstracto) para "minificar" este contexto antes de enviárselo al LLM para una revisión arquitectónica.

## 11. Demo relacionada
*(Demo 03: Engineer the Context abordará el presupuesto).*

## 12. Discusión
La Ingeniería de Contexto requiere fuertes habilidades de Backend. No estamos jugando a hablar con la IA, estamos construyendo tuberías (pipelines) ETL (Extract, Transform, Load) donde el destino (Load) es la ventana de contexto del LLM.

## 13. Preparación para la siguiente clase
*(Cierre crucial del módulo)*:
"Hemos aprendido a diseñar y ensamblar el contexto mínimo útil. **Pero el problema ya no es solamente qué contexto usar. El problema es cómo encontrarlo cuando nuestro sistema contiene miles o millones de artefactos** (millones de expedientes, cientos de repositorios). No podemos programar `if/else` para buscar esa información. Necesitamos automatizar el descubrimiento de candidatos. En el Módulo 04, entraremos al mundo del **Retrieval (RAG)**."
