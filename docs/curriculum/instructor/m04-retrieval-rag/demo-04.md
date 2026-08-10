# Demo 04 — Build Retrieval (Instructor Guide)

## 1. Propósito de la Demo
Visualizar de forma interactiva el comportamiento de la generación de candidatos (búsqueda semántica) frente a un océano de documentos, y observar en tiempo real el dilema clásico del *trade-off* entre Precision y Recall (Top-K).

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Tras finalizar la Lesson 03 (Retrieval Evaluation), para aterrizar la teoría de Precision/Recall.
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Abre la plataforma CASE Academy y navega a `Demo 04 — Build Retrieval`. Explica que esta pantalla simula una pequeña Base de Datos Vectorial cargada con 50 fragmentos de políticas de RRHH, manuales técnicos y tickets de soporte viejos.

### Paso 2: Ejecución de Búsqueda de Baja Precisión (Ambigüedad)
1. Ingresa la query de búsqueda: *"políticas de vacaciones"*.
2. Configura el `Top-K = 3` (devolver los 3 documentos más cercanos).
3. **Lo que debes destacar:** Ejecuta la búsqueda. Los resultados arrojan:
   - *Resultado 1:* Política oficial de vacaciones (Correcto).
   - *Resultado 2:* Ticket de soporte sobre un sistema de vacaciones (Falso Positivo, relevante pero inútil para la política).
   - *Resultado 3:* Política de viáticos para viajes (Falso Positivo).
4. Pregunta al grupo: *"¿Qué pasaría si el Context Assembler inyecta el Resultado 3 en el prompt del LLM?"* (Respuesta: El LLM podría alucinar diciéndole al empleado que sus vacaciones se pagan como viáticos).

### Paso 3: El Dilema Precision vs Recall (Subiendo el Top-K)
1. Cambia la query a algo más específico pero raro: *"Días extra por matrimonio en sucursal España"*.
2. Mantén el `Top-K = 3`. 
3. **Lo que debes destacar:** Ejecuta. El resultado correcto no aparece. ¡Recall de 0%!
4. Ahora, incrementa el `Top-K = 15`. Vuelve a ejecutar.
5. **Lo que debes destacar:** El resultado correcto aparece en la posición 12. ¡Salvamos el Recall! Pero pregunta al grupo: *"¿A qué costo?"* (Respuesta: Ahora le pasaremos 14 documentos basura al LLM, aumentando latencia, costo y riesgo de distracción por *Lost in the Middle*).

### Paso 4: La Solución Arquitectónica (Re-ranking)
1. Activa la opción de "Hybrid Search + Re-ranker" (Simulado en la plataforma).
2. Mantén `Top-K inicial = 15`, pero configura el Re-ranker para devolver el `Top-3` final.
3. **Lo que debes destacar:** El sistema hace la red de arrastre amplia para garantizar Recall, pero luego aplica un filtro que descarta el ruido. El documento correcto sube a la Posición 1 y se envían solo 3 documentos al LLM. Hemos maximizado Precisión y Recall combinando etapas. Sin embargo, enfatiza que **el re-ranking es una técnica útil cuando el retrieval inicial produce más candidatos de los que conviene entregar al contexto final, no un paso obligatorio.** La regla es *Least Complexity Necessary*: ¿qué estrategia consigue los candidatos necesarios con la complejidad mínima?

## 4. Puntos de Discusión a provocar
- "Si un usuario es muy vago al preguntar ('no funciona'), ¿cuál será el desempeño del buscador? Si el buscador falla, la IA fallará irremediablemente."
- "Noten que Retrieval recupera candidatos, pero **NO decide automáticamente qué entra al contexto final.** Si ustedes envían los 15 resultados crudos al prompt, ustedes fallaron como ingenieros."

## 5. Transición al Lab
"Hemos visto cómo una mala búsqueda rompe al mejor de los LLMs. Y hemos visto que ajustar esto 'al ojo' es peligroso. En el *Real Engineering Lab 04*, van a diseñar la especificación de búsqueda de su propio proyecto y, lo más importante, crearán el examen (benchmark) con el cual medirán objetivamente si funciona."
