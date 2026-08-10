# Lesson 03 — Security & Constraints

## 1. Propósito de la clase
Enseñar al estudiante que un sistema de IA generativa no puede operar en el vacío. En Producción, un agente teóricamente perfecto puede derrumbar los servidores, quebrar a la empresa económicamente o comprometer datos si no opera dentro de **Fronteras Operativas Estrictas (Operational Constraints) y Fronteras de Seguridad (Security Boundaries)**. 

## 2. Qué debe aprender el estudiante
- Identificar restricciones operativas críticas: *Costes, Latencia (SLA), Rate Limits*.
- Diseñar la seguridad asumiendo compromisos (Assume Breach): el modelo ya ha sido hackeado vía *Prompt Injection*, ¿qué detiene el daño? (Conecta con M07).
- Formalizar el principio: **El modelo propone, el sistema dispone.**

## 3. Conceptos fundamentales

### 3.1 Restricciones Operativas (MLOps Constraints)
Las limitaciones físicas y económicas que dictan la viabilidad del software impulsado por IA. Un Agente que resuelve todo pero tarda 40 segundos por ciclo no sobrevivirá en Producción B2C.

- **Costes (FinOps):** Cada loop de un Agente (M05) incrementa linealmente el costo, ya que re-envía el historial entero (*Context Window*) en cada iteración.
- **Latencia / SLA:** Un *Fixed Pipeline* devuelve respuestas en milisegundos. Un Agente que rutea dinámicamente puede tardar decenas de segundos. ¿Qué dice el Acuerdo de Nivel de Servicio (SLA) de tu producto?
- **Rate Limits y Concurrencia:** Proveedores como OpenAI limitan el número de *Tokens-Per-Minute* (TPM). Si tu sistema de Evals lanza 500 pruebas en paralelo para aprobar un *Deployment Gate*, la API fallará (429 Too Many Requests), bloqueando todo el tráfico de producción y desarrollo. Se requieren arquitecturas con colas y caché.

#### Concept Analogy: El Ferrari en el Tráfico
- **Analogía cotidiana:** Usar un Fórmula 1 para entregar pizzas en el centro de la ciudad.
- **Mapeo:** 
  - El Fórmula 1 es un modelo *State-of-the-Art* (SOTA) o un agente altamente autónomo.
  - La velocidad máxima es excelente, pero la restricción operativa real (el tráfico, semáforos, el costo del combustible especial) hace que la moto (State Machine) sea más rápida, barata y confiable.
- **Límite de la analogía:** La gasolina cuesta dinero lineal. Los tokens de los LLMs tienen un costo casi logarítmico sobre ventanas de contexto grandes; una mala gestión del contexto de un Agente encarece exponencialmente la tarea.
- **Traducción técnica:** Transición de arquitecturas monolíticas bloqueantes hacia sistemas distribuidos asíncronos apoyados por cachés semánticas.
- **Ejemplo aplicado a SWE:** Un estudiante usa `gpt-4` con `temperature=0` para extraer JSON estructurado (un simple *parser*). En Producción, esto dispara los costos. El ingeniero Senior migra la tarea a un modelo Open Source pequeño y ultra rápido especializado en JSON (ej. Mistral fine-tuned), porque la tarea no requería la autonomía de GPT-4 (*Least Autonomy Necessary*).

### 3.2 Fronteras de Seguridad (Security Boundaries)
En el mundo de la IA Genitiva, el **Prompt Injection** (Inyección de instrucciones maliciosas) sigue siendo un problema irresoluble en la capa del modelo (M01: No hay barrera dura entre dato e instrucción). Por lo tanto, la seguridad debe existir **fuera** del modelo.

Esta es la tesis central del curso materializada: **La IA puede generar el cambio o la solicitud de acción; la responsabilidad de aceptar y ejecutar ese cambio permanece en el proceso de ingeniería tradicional (Backend / Deployment Gate).**

Si un atacante logra que tu Agente proponga la acción `execute_refund(amount=1000000)`, la seguridad no depende del Agente. Depende del Contrato (M02), del Contexto Limitado (M03), del Control de Loops (M05) y del Servidor MCP con *Least Privilege* (M07) que debe denegar esa transacción.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Pondré filtros robustos de seguridad (Guardrails) directamente dentro del System Prompt pidiéndole al LLM que se niegue a borrar la base de datos."*
**Consecuencia:** Como se demostró en módulos anteriores, el modelo generativo buscará complacer al usuario (Sycophancy) si el prompt de inyección está lo suficientemente ofuscado. El modelo ejecutará la herramienta prohibida. El ingeniero confundió el "deseo" textual con una "frontera de seguridad" física.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** No pones al perro guardián dentro de la casa que intenta robar el ladrón; pones una cerca eléctrica física alrededor de la casa.
- **Mecanismo:** *Assume Breach*. Diseña la arquitectura asumiendo que el LLM va a intentar proponer acciones hostiles o costosas. Aisla el entorno de ejecución (Sandboxing, Role-Based Access Control).
- **Consecuencia de ingeniería:** Tu equipo no pierde tiempo debatiendo "cómo hacer que el LLM sea más seguro", sino invirtiendo recursos en asegurar las API clásicas, habilitar el *Caching* y orquestar límites de rate/tokens por usuario a nivel proxy.

## 6. Ejemplo técnico
**Control de Costes (Token Proxy):**
En lugar de que cada aplicación llame directamente a `api.openai.com`, todo el tráfico corporativo pasa por un *API Gateway* interno que cuenta los tokens consumidos por el usuario autenticado (OIDC) y bloquea la llamada (HTTP 429) si excede los $10 USD diarios. La responsabilidad recae en Infraestructura (Platform Engineering), no en el desarrollador del Agente.

## 7. Ejemplo aplicado a Software Engineering
Un agente que procesa logs de errores (Agentic SWE, M06) y propone Fixes de código automático (Pull Requests). En lugar de hacer auto-merge a producción (riesgo fatal), el *Deployment Gate* exige que pase los Unit Tests (Determinista, Lección 02) y requiere la aprobación manual de un Ingeniero Lead (*Human-in-the-Loop*). La IA produce el cambio, el Proceso asume la responsabilidad.

## 8. Errores conceptuales frecuentes
- **"El modelo más grande es siempre mejor"**: Falso. Un modelo SOTA es inyectable y lento. Un modelo especializado pequeño es más barato, predecible y rápido, cumpliendo mejor las restricciones operativas.
- **"No necesito caché si el modelo responde rápido"**: Falso. Si un millón de usuarios preguntan *"¿Cuáles son sus horarios?"*, recalcular los tokens un millón de veces es quemar dinero. Una *Semantic Cache* (Redis VSS, etc.) intercepta la pregunta recurrente y ahorra un 90% de costos de API.

## 9. Preguntas para el grupo
- "Si tu API de OpenAI se cae por completo, ¿qué le dice tu aplicación al usuario?" (Fallo de resiliencia).
- "Si un agente de soporte al cliente (Agent) decide, por alucinación, ofrecerle un reembolso de \$500 a un cliente por una queja trivial, y tu sistema backend transfiere el dinero... ¿cómo lo explicarás ante una auditoría financiera?"

## 10. Mini ejercicio
Proyecta un fragmento de código de un Agente de Reservas de Hotel. El bucle del Agente (M05) está expuesto al cliente.
Pide al grupo que esbocen en una pizarra (o texto) los **3 Circuit Breakers** técnicos (interruptores de emergencia) que instalarían alrededor de ese Agente para asegurar que Producción sobreviva. (Ej: 1. Max Loops=3, 2. Max Token Budget=$2 por sesión, 3. Timeout absoluto de 8 segundos).

## 11. Demo relacionada
*(Las Evals y restricciones confluirán en la Demo 08 y Lab 08).*

## 12. Discusión
En el desarrollo con IA Generativa, la mayor parte del código que escribirás no es para "hacer hablar" a la IA, es código de defensa: defensa contra alucinaciones, inyecciones, picos de latencia y bucles infinitos. Ese es el verdadero trabajo del Ingeniero en Producción.

## 13. Preparación para la siguiente clase
"Toda esta rigurosidad teórica tiene una manifestación tangible. Vamos a construir un pipeline de evaluación real (Eval Pipeline) en la Demo 08, donde usaremos a la IA para juzgar a la IA, y luego pasaremos al desafío final del curso: diseñar el Acta de Autorización para Producción (PRR)."
