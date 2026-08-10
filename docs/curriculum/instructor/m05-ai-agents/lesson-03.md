# Lesson 03 — The Agent Loop

## 1. Propósito de la clase
Enseñar el motor que impulsa la autonomía: el bucle de retroalimentación donde el sistema evalúa dinámicamente qué hacer a continuación. Establecer el patrón **INTENT → ACTION → OBSERVATION → STATE UPDATE** como el estándar operativo para enseñar el patrón ReAct, manteniendo la distinción crucial entre el razonamiento interno privado del modelo (caja negra) y la intención observable que el sistema puede rastrear.

## 2. Qué debe aprender el estudiante
- Operar el ciclo fundamental de toma de decisiones de un agente.
- Diferenciar entre el *Reasoning* interno del LLM (que no debe exponerse como interfaz determinista) y el *Intent / Decision* (el resultado observable de ese razonamiento).
- Comprender cómo cada vuelta adicional en el bucle (*loop iteration*) aumenta la superficie de fallo y los costos de operación.

## 3. Conceptos fundamentales

### 3.1 El Patrón del Agent Loop
Históricamente conocido como ReAct (Reasoning + Acting), es un patrón de software, un simple bucle `while` que no termina hasta que el LLM decide que ha resuelto la tarea o hasta que alcanza un límite de iteraciones.

Nuestra formulación pedagógica observable es:
1. **INTENT (Decisión):** Qué acción o estrategia decidió intentar el modelo basándose en el estado actual.
2. **ACTION:** Qué herramienta específica solicita (el Tool Call / JSON propuesto).
3. **OBSERVATION:** Qué resultado devuelve el backend tras ejecutar la herramienta.
4. **STATE UPDATE:** Cómo cambia el estado del workflow (el historial de mensajes o la memoria de la máquina de estados) con esta nueva evidencia.

#### Concept Analogy: The Agent Loop
- **Analogía cotidiana:** Jugar a hundir la flota (Batalla Naval).
- **Mapeo:** 
  - *Intent:* "Creo que hay un barco cerca de B4 porque acabo de golpear A4, intentaré B4."
  - *Action:* Disparas a B4 (Llamada a la herramienta).
  - *Observation:* Tu oponente grita "¡Agua!" (Respuesta de la herramienta).
  - *State Update:* Marcas B4 con una cruz en tu tablero (Actualización del contexto).
  - *Next Intent:* "Okay, el barco debe estar en A5 entonces..." (Siguiente ciclo).
- **Límite de la analogía:** Un jugador humano sabe cuándo rendirse si las reglas del juego cambian o si el tablero se incendia. Un agente de IA carece de consciencia espacial y temporal real. Si la herramienta siempre devuelve "Agua", el agente de IA puede quedarse atrapado disparando a B4 infinitamente a menos que nosotros programemos un *Max Iterations Abort Condition*. Un agente ejecuta un ciclo ciego condicionado solo por estado y restricciones.
- **Traducción técnica:** Un ciclo `while(true)` donde la salida del LLM (`tool_calls`) condiciona si se ejecuta código de backend, se anexa el resultado al historial, y se fuerza una nueva inferencia (Next-Token Prediction) hasta que el LLM genera texto final sin peticiones de herramientas.
- **Ejemplo aplicado a SWE:** Un agente resolviendo un bug. INTENT: "Verificaré los logs de errores". ACTION: `get_logs(service="auth")`. OBSERVATION: `[Error: DB connection timeout]`. STATE UPDATE: Añadir esto al contexto. Siguiente ciclo -> INTENT: "Revisaré el archivo de configuración de BD"...

### 3.2 Reasoning vs Intent (Lo Privado vs Lo Observable)
El *Chain-of-Thought* (CoT) es el proceso probabilístico interno que el modelo utiliza para llegar a una conclusión. **No debemos enseñar el CoT como una interfaz predecible ni como una garantía de seguridad.** Lo que nos importa en ingeniería de software es el **INTENT** (la decisión observable): si el agente decidió que necesita llamar a la base de datos, eso es auditable. Si el modelo internamente "pensó en Shakespeare" antes de llamar a la base de datos, es irrelevante y peligroso depender de ello.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Si le digo al agente en el prompt 'Piensa paso a paso y nunca te equivoques', el agente razonará como un humano y su bucle será seguro."*
**Consecuencia:** El ingeniero confiará ciegamente en el bucle. Cuando el modelo entre en una alucinación cíclica (pidiendo la misma herramienta rota una y otra vez), consumirá miles de dólares de API en minutos. El ingeniero no entenderá por qué el agente no "pensó" en detenerse.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Es como navegar un laberinto en la oscuridad tocando las paredes. Das un paso (Acción), sientes la pared (Observación), actualizas tu mapa mental (Estado), y decides el próximo paso (Intent).
- **Mecanismo:** El LLM es *Stateless* (Sin estado). Cada vuelta del bucle requiere enviarle el historial completo: [Prompt Inicial + Intent Anterior + Action Anterior + Observation Anterior]. El costo computacional crece linealmente con cada paso.
- **Consecuencia de ingeniería:** La superficie de fallo se multiplica por cada iteración. Programar un Agente significa obligatoriamente programar *Guardrails* sistémicos: políticas de reintentos (*Retry Policies*), límites máximos de ciclos (*Max Iterations*), condiciones de aborto (*Circuit Breakers*) y monitoreo de bucles infinitos.

## 6. Ejemplo técnico
**Un Bucle Peligroso (Sin Estado Observable Claro):**
Ciclo 1: LLM llama `search_db("user=Juan")` -> Falla.
Ciclo 2: LLM llama `search_db("user=Juan")` -> Falla.
*(Bucle infinito)*.

**El Bucle de Ingeniería Robusta (State Update + Guardrails):**
Ciclo 1: INTENT="Buscar usuario". ACTION=`search_db("Juan")`. OBSERVATION="Error 404".
STATE UPDATE: Incrementar contador de errores. 
Ciclo 2: INTENT="Intentar variaciones". ACTION=`search_db("Juan Perez")`. OBSERVATION="Error 404".
STATE UPDATE: Contador de errores = 2. *Max_Errors_Reached* -> Forzar transición a Salida.

## 7. Ejemplo aplicado a Software Engineering
Un agente DevOps que debe reiniciar un servicio si se cae. No le damos autonomía total. Diseñamos el Agent Loop para que, tras intentar 3 veces y recibir un OBSERVATION de fallo, el sistema escale el problema mediante un *Human-in-the-Loop* (HITL), enviando un mensaje a Slack: "Intenté X, Y, Z. El servidor sigue caído. ¿Deseas que intente purgar la base de datos de staging? (Sí/No)".

## 8. Errores conceptuales frecuentes
- **"El Agente aprende con cada paso"**: Falso. El modelo base no aprende (no actualiza pesos). Solo se añade información al *Context Window*. Si la ventana se llena, ocurre un *Lost in the Middle* (M03) y el agente "olvida" por qué empezó la tarea.
- **"Razonamiento visible = Inteligencia"**: Mostrar el "Thinking..." del modelo en la UI es una decisión de UX, no un mecanismo de software auditable para tomar decisiones de enrutamiento backend.

## 9. Preguntas para el grupo
- "Si un agente tiene que hacer 10 búsquedas en internet en secuencia (10 ciclos de loop), ¿cuánto más caro y lento es que si hiciéramos las 10 búsquedas en paralelo usando un Fixed Pipeline tradicional?"
- "¿Por qué depender de que el LLM decida *'Me rindo'* es una mala práctica de seguridad?" (Respuesta: porque el LLM está pre-entrenado para intentar complacerte siempre, a menudo prefiriendo alucinar antes que admitir derrota).

## 10. Mini ejercicio
Pide al grupo que esbocen (dibujo o pseudocódigo) qué ocurre en el backend si en la fase de `ACTION` la API que el modelo intentó usar devuelve un *Timeout (504)*. Deben definir si el `OBSERVATION` que se inyecta de vuelta le dice al LLM "Intenta de nuevo" (riesgo de bucle) o "Usa una herramienta alternativa" (mitigación).

## 11. Demo relacionada
*(Demo 05).*

## 12. Discusión
La autonomía es un multiplicador. Multiplica la capacidad de resolver problemas ambiguos, pero también multiplica la latencia, el costo y el riesgo. Los ingenieros de IA de verdad pasan más tiempo diseñando cómo *detener* al agente que cómo *iniciarlo*.

## 13. Preparación para la siguiente clase
"Toda esta teoría abstracta sobre ciclos e intenciones se vuelve muy obvia cuando la operas con tus propias manos. En la Demo 05 y el Lab 05, vamos a jugar a ser el bucle y ustedes van a tener que justificar por qué una máquina de estados podría haber sido una mejor idea."
