# Lesson 01 — Workflows vs Agents

## 1. Propósito de la clase
Enseñar a los ingenieros a evitar la trampa de sobre-ingeniería de agentes. Establecer el principio rector de **Least Autonomy Necessary**: la autonomía es un riesgo, no un beneficio gratuito. Los estudiantes aprenderán a decidir arquitectónicamente entre un *Fixed Pipeline*, una *State Machine*, y un *Agent*.

## 2. Qué debe aprender el estudiante
- Entender que no todo sistema que invoca herramientas múltiples necesita un Agente.
- Diferenciar el comportamiento determinista (Pipelines, State Machines) del comportamiento basado en toma de decisiones probabilísticas (Agents).
- Cuantificar el coste del exceso de autonomía (superficie de fallo).

## 3. Conceptos fundamentales

### 3.1 El Espectro de la Autonomía
La solución técnica no es una escalera donde "Agente" es la cima evolutiva obligatoria; es un menú de decisiones de diseño.

1. **Fixed Pipeline:** Ejecución lineal (Paso A → Paso B → Paso C).
2. **State Machine (Enrutamiento condicional):** Evaluación de condiciones predefinidas para saltar de un estado a otro.
3. **Agent:** El LLM evalúa un objetivo abierto, inspecciona las herramientas disponibles, y decide el orden de ejecución en tiempo real.

#### Concept Analogy: Grados de Navegación
- **Analogía cotidiana:** Las formas de llegar a un destino.
- **Mapeo:**
  - *Fixed Pipeline:* Un tren sobre rieles. Sigue una ruta predeterminada, no puede desviarse. Si hay un obstáculo, choca.
  - *State Machine:* Un conductor humano siguiendo las instrucciones paso a paso de un mapa de papel o GPS. Si una calle está cerrada (condición), el mapa tiene una regla de desvío alternativa calculada, pero sigue un algoritmo fijo.
  - *Agent:* Un conductor experto observando el tráfico en tiempo real, evaluando el clima, cambiando de estrategia, e incluso decidiendo estacionar el auto si la misión original ("llegar rápido") se vuelve peligrosa.
- **Límite de la analogía:** Un agente de software no "piensa como una persona". No tiene intuición ni sentido común. Simplemente ejecuta un ciclo ciego de inferencia matemática condicionado por el estado, las herramientas proporcionadas y las restricciones del sistema. Si no le programaste una herramienta para "ver" que hay tráfico, avanzará ciegamente hacia el caos.
- **Traducción técnica:** Transición del Control Flow clásico (`for/if/switch`) a un Control Flow dinámico orquestado por un modelo probabilístico.
- **Ejemplo aplicado a SWE:** 
  - *Pipeline:* Leer un PDF → Hacer resumen → Guardar en BD.
  - *State Machine:* Leer PDF → ¿Es factura o contrato? → Si es factura, extraer monto; si es contrato, extraer firmas.
  - *Agent:* Analizar la carpeta entera → "Dado que encontré facturas y contratos desordenados, y faltan firmas, decidiré enviar correos a los firmantes faltantes antes de intentar guardarlos".

### 3.2 Superficie de Fallo de la Autonomía
> **Regla Crítica:** Cada incremento de autonomía incrementa exponencialmente la superficie de fallo.
Cuando delegas el flujo de control a un LLM:
- **Coste y Latencia:** En lugar de ejecutar 1 vez (Pipeline), el LLM podría entrar en un bucle iterativo (loop) ejecutando 20 inferencias antes de decidir terminar.
- **Seguridad (Side effects):** Si el LLM decide usar la herramienta `send_email` 500 veces en un bucle, destruirá tu reputación.
- **Testing:** Un Pipeline se prueba con un test unitario tradicional. Un Agente requiere evaluación probabilística masiva, simuladores y guardrails para detenerlo (Kill switches).
- **Observabilidad:** Necesitas sistemas (como LangSmith o trace-logs complejos) para saber *por qué* el agente tomó esa ruta.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Para hacer mi app inteligente, pondré un LLM en el centro (Agente) y le daré acceso a 15 funciones distintas para que él decida cómo ayudar al usuario."*
**Consecuencia:** Creará un sistema donde una pregunta simple del usuario ("¿Cuál es mi saldo?") provocará que el Agente, de manera impredecible, intente usar la herramienta de "Actualizar Contraseña" porque alucinó la intención, generando un incidente de seguridad y una pésima experiencia, cuando un simple enrutador determinista lo habría resuelto en 50 milisegundos.

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
