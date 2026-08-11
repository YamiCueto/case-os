# Lesson 01 — Workflows vs Agents

## 1. Propósito de la clase
Enseñar a los ingenieros a evitar la trampa de sobre-ingeniería de agentes. Establecer el principio rector de **Least Autonomy Necessary**: la autonomía es un riesgo, no un beneficio gratuito. Los estudiantes aprenderán a decidir arquitectónicamente entre un *Fixed Pipeline*, una *State Machine*, y un *Agent*.

## 2. Qué debe aprender el estudiante
- Entender que no todo sistema que invoca herramientas múltiples necesita un Agente.
- Diferenciar el comportamiento determinista (Pipelines, State Machines) del comportamiento basado en toma de decisiones probabilísticas (Agents).
- Cuantificar el coste del exceso de autonomía (superficie de fallo).

## 3. Conceptos fundamentales

### 3.1 El Espectro de la Autonomía
La solución técnica no es una escalera donde "Agente" es la cima evolutiva obligatoria; es un menú de decisiones de diseño **donde la decisión correcta depende únicamente del problema, no de la modernidad de la tecnología**.

1. **Fixed Pipeline:** La secuencia es conocida y fija. Ejecución lineal (Paso A → Paso B → Paso C). No hay decisiones dinámicas.
2. **State Machine:** El conjunto de estados y sus transiciones es conocido y puede modelarse con anticipación. El sistema evalúa condiciones predefinidas para moverse entre estados.
3. **Agent:** El siguiente paso no está completamente determinado de antemano. Requiere que el modelo evalúe el estado actual y tome una decisión dinámica sobre qué acción ejecutar.

> **`LEAST AUTONOMY NECESSARY` — Regla de Diseño Obligatoria:**
> - Si un *Fixed Pipeline* resuelve correctamente el problema, **no se justifica introducir una State Machine**.
> - Si una *State Machine* resuelve correctamente el problema, **no se justifica introducir un Agente**.
> - "Agent" no significa: más inteligente, mejor, más moderno, ni más autónomo de lo necesario.

#### Concept Analogy: El Trabajador y las Instrucciones
- **Analogía cotidiana:** Un trabajador al que le asignas distintos tipos de instrucciones según la tarea.
- **Mapeo:**
  - *Fixed Pipeline:* El trabajador sigue una receta de cocina al pie de la letra: mezcla, hornea, sirve. Cada paso está prescrito. No evalúa nada.
  - *State Machine:* El trabajador sigue un procedimiento con rutas alternativas: "si el horno ya está caliente, ve al paso 4; si no, caliéntalo primero". Las bifurcaciones están documentadas por adelantado.
  - *Agent:* El trabajador recibe únicamente un objetivo («prepara algo para cenar con estas sobras») y debe observar los ingredientes, decidir qué hacer, intentarlo, corregir si huele mal, y repetir hasta terminar. El siguiente paso **no está pre-escrito**.
- **Límite de la analogía:** No uses esta analogía para concluir que el Agente es "un empleado digital". El Agente no tiene hambre, cansancio ni juicio moral. No sabe cuándo parar excepto que el sistema le instruya cuándo hacerlo. Si la herramienta `smell_dish` no existe en su Tool Inventory, nunca sabrá que la cena está quemada.
- **Traducción técnica:** Transición del Control Flow clásico (`for/if/switch`) a un Control Flow dinámico donde el modelo probabilístico decide el siguiente nodo de ejecución en cada iteración.
- **Ejemplo aplicado a SWE:**
  - *Pipeline:* Leer un PDF → Hacer resumen → Guardar en BD. La secuencia nunca varía.
  - *State Machine:* Leer PDF → ¿Es factura o contrato? (condición predefinida) → ejecutar rama correspondiente.
  - *Agent:* Analizar una carpeta desconocida, inferir qué tipo de documentos hay, detectar que faltan firmas, y decidir por sí mismo enviar correos antes de archivar. El orden de pasos no se puede codificar de antemano.

### 3.2 Superficie de Fallo de la Autonomía
> **Regla Crítica:** Cada incremento de autonomía incrementa exponencialmente la superficie de fallo.
Cuando delegas el flujo de control a un LLM:
- **Coste y Latencia:** En lugar de ejecutar 1 vez (Pipeline), el LLM podría entrar en un bucle iterativo (loop) ejecutando 20 inferencias antes de decidir terminar.
- **Seguridad (Side effects):** Si el LLM decide usar la herramienta `send_email` 500 veces en un bucle, destruirá tu reputación.
- **Testing:** Un Pipeline se prueba con un test unitario tradicional. Un Agente requiere evaluación probabilística masiva, simuladores y guardrails para detenerlo (Kill switches).
- **Observabilidad:** Necesitas sistemas (como LangSmith o trace-logs complejos) para saber *por qué* el agente tomó esa ruta.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**

**Trampa A (La más común):** *"Si puedo construir un Agente, debería construir un Agente."*

Consecuencia de ingeniería directa: mayor autonomía implica una **superficie de fallo exponencialmente mayor**:
- Más *tool calls* → más puntos de fallo de red.
- Más estados posibles → imposible cubrir con tests tradicionales.
- Más latencia → SLA en riesgo.
- Más coste de API → el agente podría gastar en una iteración lo que un pipeline gasta en un mes.
- Más *retries* y *loops* → riesgo de bucles infinitos y DDoS financiero.
- Más efectos secundarios → un send_email en loop destruye la reputación del dominio.
- Mayor necesidad de observabilidad → requiere tracing complejo (LangSmith, etc.).
- Mayor complejidad de rollback → ¿cómo deshaces 50 acciones encadenadas?

**Trampa B:** *"Para hacer mi app inteligente, pondré un LLM en el centro (Agente) y le daré acceso a 15 funciones para que él decida cómo ayudar."*

Consecuencia: Una pregunta simple del usuario ("¿Cuál es mi saldo?") puede provocar que el Agente use la herramienta de "Actualizar Contraseña" porque alucinó la intención. Un enrutador determinista habría resuelto esto en 50 milisegundos sin riesgo alguno.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Si la receta del pastel nunca cambia, sigue la receta paso a paso (Pipeline). Solo contrata a un Chef Creativo (Agente) si te piden inventar un plato con sobras misteriosas.
- **Mecanismo:** Un pipeline es código imperativo. Un Agente delega el salto de instrucción al motor probabilístico del Transformer (Next-Token Prediction de una etiqueta de acción).
- **Consecuencia de ingeniería:** Por defecto, construimos *State Machines*. Solo "ascendemos" a diseño de Agentes si probamos matemáticamente que el problema tiene demasiada variabilidad para modelarse con `if/else`.

## 6. Ejemplo técnico
**Malo (Autonomía innecesaria):**
Un agente LLM para resetear contraseñas.
`User: Olvidé mi clave` → LLM decide llamar a `ask_email` → `User: juan@mail.com` → LLM decide llamar a `send_reset_link`. (Lento, caro, propenso a errores tontos).

**Bueno (State Machine determinista):**
Código tradicional: `if intent == "reset_password" { run_reset_flow(user_email) }`. Seguro, inmediato, gratis.

## 7. Ejemplo aplicado a Software Engineering
Si estás automatizando CI/CD, correr un *Linter* y luego los *Tests Unitarios* es un Fixed Pipeline. Si el test falla, generar un reporte de error es una State Machine. Ahora, si el test falla, y quieres que el sistema lea el error, proponga un parche de código, lo aplique en memoria, vuelva a correr los tests, y si vuelve a fallar intente una estrategia distinta hasta que pase... eso es un problema que justifica la enorme superficie de fallo de un Agente (Agentic SWE).

## 8. Errores conceptuales frecuentes
- **"El Agente y la Máquina de Estados son opuestos"**: En realidad, un Agente se programa frecuentemente *dentro* de una gran máquina de estados (StateGraph).
- **"Workflow = Aburrido; Agent = Cool"**: La mentalidad de hype ignora que los workflows fijos impulsan el 99% de las tareas empresariales críticas de manera rentable.

## 9. Preguntas para el grupo
- "Una empresa quiere procesar 100,000 recibos diarios extrayendo el IVA. ¿Pondrían a un Agente a procesarlos, o a un Pipeline? ¿Por qué?"
- "¿Cuáles son los riesgos legales de conectar un Agente autónomo directamente a la API de devoluciones (Refunds) de su e-commerce?"

## 10. Mini ejercicio
Pide a los estudiantes que escriban en 1 minuto el flujo para "Atender un ticket de soporte de Nivel 1" usando pseudocódigo determinista (if/else). Luego, pídeles que marquen en rojo en qué punto exacto su código fallaría irremediablemente frente a la variabilidad humana, justificando ahí y solo ahí el uso de un modelo generativo.

## 11. Demo relacionada
*(Se utilizará la Demo 05 más adelante).*

## 12. Discusión
La buena arquitectura de IA se define por cuánta autonomía fuiste capaz de quitarle al modelo, no por cuánta le diste.

## 13. Preparación para la siguiente clase
"Si finalmente decidimos que necesitamos un Agente, surge un problema de bajo nivel: El LLM es solo un modelo de texto encerrado en un servidor. No tiene manos. ¿Cómo hace para consultar una base de datos o enviar un email? En la siguiente clase veremos el mecanismo de *Tool Calling* y el contrato estricto entre el modelo y el software."
