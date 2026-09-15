# M05-L01 — Flujos de Trabajo vs Agentes

## Guía timeline para impartir la Lección 01

**Duración de referencia:** 2 horas  
**Modalidad:** proyectar CASE Academy y usar esta guía como guion de conducción.  
**Meta de la sesión:** que el grupo pueda decidir cuándo usar un flujo determinista, cuándo permitir que un modelo enrute una decisión y cuándo un problema realmente justifica un Agent Loop.

---

## La idea central que deben llevarse

> Un agente no es automáticamente una arquitectura mejor. La autonomía debe introducirse solo donde el siguiente paso no pueda determinarse de forma robusta con software tradicional.

La regla transversal de la clase es:

> **Least Autonomy Necessary:** usa el menor nivel de autonomía que resuelva correctamente el problema.

No busques que memoricen nombres de frameworks. Busca que sepan responder: **¿quién decide el siguiente paso y por qué?**

---

## Cómo usar esta guía

En cada sección de CASE Academy sigue esta secuencia:

1. Abre con una situación concreta.
2. Pide al grupo que diga quién debería decidir el siguiente paso.
3. Manipula la experiencia en pantalla.
4. Haz que comparen control determinista vs decisión probabilística.
5. Da la explicación técnica breve.
6. Cierra con una decisión arquitectónica.

No leas la plataforma en voz alta. Úsala como apoyo visual para discusión.

---

# Cronograma

| Tiempo | Sección visible en CASE Academy | Objetivo real |
|---|---|---|
| 0–10 min | Apertura + mapa del agente | Conectar M04 con M05 y presentar **Decision** como primera capacidad. |
| 10–35 min | 01. La Frontera de la Autonomía | Distinguir flujo determinista, model-routed workflow y Agent Loop. |
| 35–60 min | 02. ¿Quién controla el flujo? | Entender qué significa delegar al modelo una decisión sin entregarle toda la ejecución. |
| 60–70 min | Pausa activa en grupos de estudio | Clasificar 3 casos y verificar quién decide el siguiente paso antes de ver trade-offs. |
| 70–100 min | 03. ¿Cuánta autonomía necesitas? | Analizar coste, riesgo, latencia, testing y observabilidad. |
| 100–115 min | Ejercicio de decisión arquitectónica | Aplicar Least Autonomy Necessary a casos de diseño en grupos de estudio. |
| 115–120 min | Cierre hacia L02 | Dejar planteado el problema: el modelo puede decidir, pero aún no puede ejecutar acciones externas. |

Si la discusión técnica se extiende, conserva el ejercicio final y recorta ejemplos secundarios.

---

# 0–10 min — Apertura: de RAG a agentes

## Pregunta de entrada

> “En RAG, ¿quién decidía que había que buscar información: el modelo o nuestro software?”

La respuesta buscada es: **el software controlaba el flujo**.

Conecta con M04:

```text
Query
  ↓
Retrieval
  ↓
Context Build
  ↓
LLM
```

Di:

> “En ese pipeline nosotros conocíamos el recorrido. Ahora vamos a estudiar qué cambia cuando el software ya no sabe con certeza cuál debería ser el siguiente paso.”

## En pantalla

Muestra el mapa de construcción del agente y ubica **Decision** como la capacidad activa de L01.

Presenta las próximas piezas solo como mapa:

```text
Decision → Tools → Loop → State / Memory → Guardrails
```

No desarrolles todavía Tools, Loop, State ni Guardrails.

## Conclusión para decir

> “Hoy no vamos a construir el agente completo. Primero tenemos que aprender cuándo vale la pena delegar una decisión al modelo.”

---

# 10–35 min — 01. La Frontera de la Autonomía

## Conceptos fáciles de explicar

### Flujo determinista

> “El software conoce de antemano la secuencia o las reglas que determinan el siguiente paso.”

Ejemplo:

```text
Validar entrada → consultar BD → generar reporte → guardar
```

### Model-Routed Workflow

> “El modelo participa en una decisión concreta, por ejemplo clasificar la intención, pero después el software recupera el control.”

Ejemplo:

```text
Usuario
  ↓
LLM clasifica intención
  ↓
refund ───────→ workflow de reembolso
support ──────→ workflow de soporte
other ────────→ fallback
```

### Agent Loop

> “El modelo observa el estado actual, decide una acción, recibe el resultado y vuelve a decidir. El siguiente paso puede cambiar en tiempo de ejecución.”

Todavía no expliques su implementación. L03 se encargará de eso.

> [!NOTE]
> **Nota para el instructor sobre Máquinas de Estados (State Machines):**
>
> Una State Machine clásica con estados y transiciones predefinidas sigue siendo control determinista; modelar estados o usar un grafo no convierte automáticamente un sistema en agente. La diferencia crucial es **quién decide la transición**: si el código conoce y evalúa las condiciones de antemano (`if/switch`), el flujo es determinista; si el modelo evalúa contexto ambiguo para elegir la transición, entramos en **Model-Routed Workflow**; y solo si el resultado de una acción vuelve al modelo y este decide iterativamente el siguiente paso, estamos ante un **Agent Loop**.

---

## Experiencia: What is an Agent?

Usa la experiencia `what-is-an-agent`.

Antes de interactuar pregunta:

> “Si una aplicación usa un LLM, ¿eso la convierte automáticamente en un agente?”

Busca que aparezca la duda. Luego guía la comparación entre las distintas formas de control.

### Preguntas al grupo

- “¿Dónde está escrita la secuencia de pasos?”
- “¿Puede cambiar el siguiente paso según algo descubierto durante la ejecución?”
- “¿Quién tiene la última palabra: el código o el modelo?”

## Aclaración importante

No uses como criterio “tiene tools = es agente”. Una aplicación puede permitir que el modelo seleccione una herramienta y aun así terminar después de una única ejecución.

Usa esta taxonomía operacional:

- **Tool-Using Workflow:** el modelo propone una tool, el software la ejecuta y el flujo termina sin nueva decisión del modelo.
- **Agent Loop:** el resultado vuelve al modelo y este puede decidir otra acción o finalizar.

## Conclusión para decir

> “La diferencia importante no es cuánto código de IA tenemos. Es dónde vive la decisión del siguiente paso.”

---

# 35–70 min — 02. ¿Quién controla el flujo?

## Pregunta detonante

> “Un usuario escribe: ‘me cobraron dos veces y necesito ayuda’. ¿Es mejor mantener cien reglas de palabras clave o pedirle a un modelo que clasifique la intención?”

No conviertas la pregunta en un debate de ‘LLM siempre mejor’. El objetivo es descubrir una zona donde una decisión semántica puede ser útil.

---

## Experiencia: Who Controls Flow?

Usa `who-controls-flow`.

Presenta primero un caso determinista y luego uno donde el modelo enruta.

La idea a remarcar es:

```text
modelo decide una etiqueta
        ↓
software valida la etiqueta
        ↓
software ejecuta el workflow correspondiente
```

El LLM no obtiene automáticamente control sobre toda la aplicación.

## Ejemplo técnico mínimo

Puedes escribir en pantalla:

```python
intent = route_with_model(user_message)

if intent == "technical_support":
    result = run_support_workflow()
elif intent == "refund":
    result = run_refund_workflow()
else:
    result = run_fallback()
```

Pregunta:

> “¿Quién tomó la decisión semántica?”

Respuesta: el modelo.

Luego:

> “¿Quién decidió qué función real se ejecutó?”

Respuesta: el software.

## Error conceptual a prevenir

No digas que pasar de `if/else` a un LLM elimina reglas. En realidad cambia **qué parte del problema modelamos mediante reglas y qué parte delegamos a inferencia probabilística**.

## Pausa activa: Clasificación en grupos de estudio (~5–7 min)

Haz una pausa para romper la exposición pasiva antes de pasar a los costes de autonomía. Invita a los participantes a organizarse en **grupos de estudio (2 a 3 integrantes)** y presenta estos 3 casos breves:

1. *“Generar una factura PDF con formato estricto y enviarla al repositorio.”*
2. *“Clasificar un ticket de soporte escrito en lenguaje libre entre cinco áreas resolutoras.”*
3. *“Investigar por qué un despliegue falla en producción: leer logs, probar un parche en memoria y reevaluar si los tests pasan.”*

Cada grupo debe responder en 3 minutos:
- ¿Qué nivel corresponde: **Flujo determinista**, **Model-Routed Workflow** o **Agent Loop**?
- **¿Quién controla el siguiente paso** en cada caso: el código o el modelo?

### Puesta en común rápida (2–3 min)
- Caso 1: **Flujo determinista (Pipeline)** — el código conoce la secuencia completa; cero necesidad de inferencia.
- Caso 2: **Model-Routed Workflow** — el modelo desambigua la intención semántica; luego el código enruta deterministamente a la cola correspondiente.
- Caso 3: **Agent Loop** — el siguiente paso no se puede anticipar en código rígido; depende de la observación que devuelvan los logs y las pruebas.

---

# 70–100 min — 03. ¿Cuánta autonomía necesitas?

## Experiencia: Autonomy Tradeoffs

Usa `autonomy-tradeoffs`.

Antes de manipularla pregunta:

> “Si más autonomía fuera siempre mejor, ¿por qué no dejamos que el modelo controle toda la aplicación?”

Haz que el grupo enumere riesgos antes de mostrar la respuesta técnica.

---

## Los cinco costes que deben reconocer

### 1. Predictibilidad

Un pipeline tiene rutas conocidas. Un agente puede descubrir rutas diferentes entre ejecuciones.

### 2. Coste y latencia

Más decisiones del modelo implican más inferencias y potencialmente más llamadas externas.

### 3. Testing

Un flujo determinista puede cubrirse con tests tradicionales. Un sistema probabilístico necesita además evaluación de comportamiento y escenarios.

### 4. Side effects

Una decisión incorrecta se vuelve más grave cuando las tools modifican estado: enviar correos, cancelar operaciones o escribir en una base de datos.

### 5. Observabilidad

Si el modelo toma decisiones dinámicas necesitas registrar qué observó, qué decidió y qué ocurrió después.

## Frase de cierre de esta sección

> “La autonomía no es una feature gratuita: cada decisión que entregamos al modelo amplía lo que debemos observar, evaluar y proteger.”

---

# 100–115 min — Ejercicio de decisión arquitectónica

Invita a los participantes a trabajar en sus **grupos de estudio (2 a 3 integrantes)**. Para cada caso deben elegir:

- Pipeline determinista
- Model-Routed Workflow
- Agent Loop

Y justificar **qué decisión necesita realmente el modelo**.

## Caso A — Procesamiento documental

> Llegan 20.000 facturas con un formato conocido. Debemos extraer campos, validar totales y guardar resultados.

Esperado: pipeline o workflow altamente controlado.

## Caso B — Mesa de ayuda

> Los usuarios describen libremente problemas y debemos enviarlos a una de seis áreas conocidas.

Esperado: model-routed workflow puede ser razonable.

## Caso C — Diagnóstico técnico

> Una aplicación falla. El sistema puede consultar logs, inspeccionar configuración, ejecutar una prueba y decidir qué revisar después según el resultado.

Esperado: candidato a Agent Loop porque el siguiente paso depende de información descubierta durante la ejecución.

## Regla del ejercicio

No aceptes “Agent porque es más inteligente”. Pide que completen esta frase:

> “Necesito autonomía aquí porque el siguiente paso no puede determinarse de antemano debido a ______.”

---

# 115–120 min — Cierre hacia L02

Haz estas tres preguntas rápidas:

1. “¿Todo uso de LLM implica un agente?” → **No.**
2. “¿El nivel máximo de autonomía es siempre deseable?” → **No.**
3. “¿Qué principio usamos para decidir?” → **Least Autonomy Necessary.**

Luego abre la puerta a L02:

> “Supongamos que sí tenemos una decisión que queremos delegar al modelo. Ahora aparece otro problema: el LLM solo genera información. No puede consultar nuestra base de datos ni ejecutar una función Python por sí mismo. ¿Cómo le damos capacidades sin entregarle el control de nuestro runtime?”

Respuesta: **Tool Calling**, que será la siguiente lección.

---

## Checklist del instructor

Antes de cerrar confirma que el grupo puede explicar con sus palabras:

- quién controla un pipeline;
- qué hace un model router;
- qué diferencia un workflow con tools de un Agent Loop;
- por qué más autonomía aumenta superficie de fallo;
- qué significa Least Autonomy Necessary.

Si esas cinco ideas están claras, L01 cumplió su objetivo.
