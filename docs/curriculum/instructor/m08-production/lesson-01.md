# Lesson 01 — The Production Gap

## 1. Propósito de la clase
Destruir la falsa confianza que generan los prototipos locales (M01-M07). Enseñar al estudiante por qué una aplicación de IA que funciona perfectamente en su laptop fracasará estrepitosamente en Producción si no cuenta con un sistema riguroso de evaluación estadística.

## 2. Qué debe aprender el estudiante
- Diferenciar entre una Demo (100% de tasa de éxito en 3 intentos) y un Sistema en Producción (95% de tasa de éxito en 10,000 intentos constantes).
- Identificar el peligro de la "Evaluación por vibras" (Vibes-based evaluation) o *Eyeballing*.
- Entender el concepto de "Regresión Silenciosa" (Silent Regression) provocada por la falta de determinismo en los LLMs.

## 3. Conceptos fundamentales

### 3.1 La Brecha de Producción (The Production Gap)
En software tradicional, si el código pasa a producción y el entorno es idéntico, el comportamiento será idéntico. En la IA generativa, el motor central es un servicio de terceros (OpenAI, Anthropic) alojado en la nube que actualiza sus pesos (weights) sin tu permiso.

Una instrucción (Prompt Contract, M02) que funcionaba perfectamente con `gpt-4-0314` puede romperse sutilmente con `gpt-4-0613`, provocando que el agente comience a omitir el paso 3 de tu flujo de trabajo de repente. A esto se le llama **Regresión Silenciosa**. Si no tienes un sistema matemático que detecte este cambio, tus usuarios serán los primeros en descubrir que tu IA se ha vuelto "tonta".

#### Concept Analogy: El Degustador de Vinos
- **Analogía cotidiana:** Controlar la calidad en una bodega de vinos.
- **Mapeo:** 
  - *Vibes-based Evaluation:* El enólogo prueba 3 barriles de la cosecha de este año, le sabe rico ("buenas vibras"), y embotella 50,000 litros asumiendo que todos los barriles saben igual.
  - *Systematic Evaluation:* El laboratorio toma muestras del 10% de todos los barriles, mide los niveles de acidez (pH), taninos y azúcar de forma automatizada contra una métrica histórica objetiva, y solo aprueba el lote si la desviación estándar es menor al 2%.
- **Límite de la analogía:** En un viñedo, el clima que cambia el vino es estacional. En el desarrollo con LLMs, el "clima" (el modelo base) puede cambiar cualquier día de la semana sin que te enteres. La evaluación no es un evento antes de lanzar, es un oleoducto continuo (CI/CD pipeline).
- **Traducción técnica:** Transición del *Manual Prompt Testing* en una UI de chat hacia un *Automated Evaluation Framework* ejecutando métricas sobre un dataset representativo.
- **Ejemplo aplicado a SWE:** En M02, el estudiante ajustaba el prompt, probaba 2 veces en el Playground, y decía "Ya funciona". En M08, el ingeniero modifica el prompt, y su terminal lanza una suite de 500 pruebas (Eval Pipeline) que concluye: *"Precisión mejoró 4%, pero la adherencia al formato JSON cayó un 12%. Cambio rechazado por el Deployment Gate"*.

### 3.2 El Fin del "Eyeballing" (Vibes-based Evaluation)
"Eyeballing" es leer la respuesta de la IA y decidir visualmente si es correcta. Es el peor enemigo de un ingeniero de IA. A escala, los humanos sufrimos fatiga de lectura y comenzamos a aprobar alucinaciones altamente plausibles (M01). 
Para superar la Brecha de Producción, debemos convertir cualidades subjetivas ("¿Es amable?", "¿Es preciso?") en aserciones computables.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Dado que uso un LLM muy inteligente como Claude 3.5 Sonnet, confío en que entenderá el contexto siempre igual de bien que lo hizo ayer en mi demo."*
**Consecuencia:** El ingeniero despliega la app sin Evals. La semana siguiente, marketing introduce una ligera modificación en el prompt base para que el bot sea "más simpático". El bot efectivamente se vuelve más simpático, pero ese pequeño cambio probabilístico provoca que el agente "olvide" pedir el número de orden antes de procesar reembolsos. Como no hay un marco de evaluación sistemático, el fallo llega a Producción causando caos.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Las demos están diseñadas para mostrarte el "Happy Path" (el camino feliz). Producción es el "Unhappy Path" continuo.
- **Mecanismo:** La naturaleza estocástica del LLM garantiza que el comportamiento fluctuará, especialmente ante *Edge Cases* no previstos por el desarrollador en su entorno local cerrado.
- **Consecuencia de ingeniería:** Tu flujo de trabajo (CI/CD) ahora debe incorporar un nuevo tipo de *Test*. Ya no son solo "Unit Tests" de código determinista, son "Evals" (Evaluaciones probabilísticas) que corren diariamente para garantizar la integridad del contrato.

## 6. Ejemplo técnico
**Malo (Vibes-based):**
- Modificar el prompt.
- Probar con: "Hola, quiero devolver mis zapatos".
- IA responde bien. -> *Deploy to Prod*.

**Bueno (Systematic):**
- Modificar el prompt.
- `npm run evals` (Ejecuta 200 casos de prueba pre-grabados).
- Resultado: *Pass rate 98% (anterior 95%). No regressions detected.* -> *Deploy to Prod*.

## 7. Ejemplo aplicado a Software Engineering
Si tienes un Agente de código (M06 Agentic SWE) que procesa Pull Requests, no puedes evaluar su calidad solo porque "refactorizó bien tu módulo anoche". Necesitas un repositorio espejo (Golden Dataset) con 50 bugs conocidos, y hacer que el agente intente arreglarlos de forma automatizada cada vez que actualizas su *System Prompt*, midiendo cuántos tests pasan tras su intervención.

## 8. Errores conceptuales frecuentes
- **"Las evaluaciones evitan todos los errores"**: Falso. Las evaluaciones (Evals) solo te dan confianza estadística. Nunca garantizan un comportamiento determinista del 100%. Solo te protegen contra regresiones conocidas.
- **"Puedo usar TDD para prompts"**: Es peligroso confundir TDD (Test Driven Development) clásico con Evals. Un Unit Test asume que `2 + 2 = 4` siempre. Una Eval asume que `similarity(respuesta, "cuatro") > 0.95`. Es un cambio de paradigma.

## 9. Preguntas para el grupo
- "¿Por qué un Unit Test tradicional falla estrepitosamente al intentar validar la respuesta de un Agente de IA?" (Respuesta: Porque un Unit Test busca igualdad exacta (`===`), mientras que el LLM genera paráfrasis plausibles constantemente).
- "Si un LLM es actualizado en el servidor de OpenAI y tu aplicación en Producción se rompe, ¿de quién es la culpa de que el incidente haya afectado a los usuarios reales?" (Respuesta: Tuya, por no tener un *Deployment Gate* o monitoreo en producción).

## 10. Mini ejercicio
Muestra en pantalla dos respuestas de una IA a la pregunta *"¿Cuál es la política de devoluciones?"*. 
Respuesta A: "Las devoluciones se aceptan en 30 días."
Respuesta B: "Usted cuenta con un plazo de 30 días para realizar devoluciones."
Pide al grupo que escriban una función en pseudocódigo (sin usar otro LLM) que devuelva `TRUE` en ambos casos si el significado es el correcto. Rápidamente se darán cuenta de que la validación basada en palabras clave (regex/substrings) es inútil, abriendo la puerta a la lección 02.

## 11. Demo relacionada
*(Se mostrará en la Demo 08).*

## 12. Discusión
La IA es fácil de hacer prototipos y extremadamente difícil de productivizar. El 90% de los proyectos corporativos de GenAI fracasan porque los equipos confunden el éxito del prototipo con estar listos para el lanzamiento (Readiness).

## 13. Preparación para la siguiente clase
"El ejercicio de las cadenas de texto acaba de revelarnos un problema grave: si no podemos usar Unit Tests tradicionales (`===`) porque la IA genera variaciones constantes, y no podemos tener a un humano leyendo 10,000 respuestas al día por fatiga visual, ¿quién evalúa a la IA? Mañana veremos la Jerarquía de Evaluación y presentaremos al Juez definitivo: Otra IA."
