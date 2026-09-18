# M05-L01 — Flujos de Trabajo vs Agentes

# Guía timeline para impartir la Lección 01

**Duración de referencia:** 2 horas (120 minutos)
**Modalidad:** Proyectar CASE Academy en pantalla compartida y usar esta guía como guion de conducción técnica en vivo.
**Meta de la sesión:** Que los participantes adquieran el criterio arquitectónico para decidir cuándo un problema se resuelve con un flujo determinista, cuándo delegar una decisión puntual a un modelo probabilístico (Model-Routed) y cuándo un problema realmente justifica la superficie de fallo de un ciclo agéntico (Agent Loop).

---

## Objetivo docente de L01

Al finalizar la sesión, los ingenieros deben ser capaces de:

1. **Definir operacionalmente la autonomía** no como "inteligencia" o "libertad", sino como **cuánta capacidad le delegamos al modelo para decidir qué hacer después dentro de los límites del software**.
2. **Distinguir con precisión las 4 categorías operacionales:** *LLM Call*, *Workflow Determinista*, *Tool-Using / Model-Routed* y *Agent Loop*.
3. **Identificar la frontera del bucle agéntico:** Reconocer que la diferencia clave radica en si el resultado de una acción regresa al modelo como una **observación** que alimenta una nueva ronda de decisión.
4. **Cuantificar el costo de la autonomía:** Evaluar el impacto en predictibilidad, flexibilidad, costo de inferencia, latencia y riesgo operacional.
5. **Aplicar la regla arquitectónica de diseño:** Implementar **Least Autonomy Necessary** (Mínima Autonomía Necesaria) en decisiones de producción.

---

## Mapa mental del instructor

Usa esta secuencia como ancla cognitiva durante toda la sesión:

```text
1. LLM Call
   El modelo recibe una entrada y genera una salida.
   No escoge un siguiente paso operacional.
         ↓
2. Workflow Determinista
   El software ejecuta una secuencia de pasos conocida y predefinida.
   El código conoce todos los caminos de antemano.
         ↓
3. Tool-Using / Model-Routed
   El modelo participa en clasificar o proponer una herramienta/ruta.
   El software ejecuta esa acción de forma prefijada y el flujo termina.
   NO hay ciclo de realimentación (observación → nueva decisión).
         ↓
4. Agent Loop
   El modelo propone una acción, el runtime la valida y ejecuta,
   el resultado regresa al modelo como observación y el modelo
   decide dinámicamente qué hacer a continuación.
   (Decisión → Acción → Observación → Actualización de Estado → Nueva Decisión).
```

> **Principio de oro para el instructor:**
> La buena ingeniería de IA no se mide por cuánta autonomía le das al modelo, sino por **cuánta autonomía fuiste capaz de quitarle** para resolver el problema de forma robusta, económica y predecible.

---

<a id="navegacion-rapida"></a>
## Navegación rápida de la clase

### Apertura
- [01 — Apertura y Mapa del Agente](#bloque-01)
- [02 — La Frontera de la Autonomía](#bloque-02)

### Taxonomía Operacional
- [03 — Qué significa Taxonomía Operacional](#bloque-03)
- [04 — LLM Call](#bloque-04)
- [05 — Workflow Determinista](#bloque-05)
- [06 — Tool-Using / Model-Routed](#bloque-06)
- [07 — Agent Loop](#bloque-07)
- [08 — Key Insights](#bloque-08)

### Control del flujo
- [09 — ¿Quién controla el flujo?](#bloque-09)
- [10 — Simulador Determinista vs Model-Routed](#bloque-10)
- [11 — model_router.py](#bloque-11)

### Decisión arquitectónica
- [12 — Pausa activa](#bloque-12)
- [13 — Trade-offs de Autonomía](#bloque-13)
- [14 — Least Autonomy Necessary](#bloque-14)
- [15 — Ejercicio de Diseño](#bloque-15)

### Cierre
- [16 — Cierre y puente hacia Tool Calling](#bloque-16)

---

## Cronograma general y prioridades (120 min)

| Bloque | Sección en CASE Academy | Duración | Prioridad |
|---|---|---|---|
| [**01**](#bloque-01) | [Apertura, conexión M04 → M05 y Mapa del Agente](#bloque-01) | 0–10 min | **MUST TEACH** |
| [**02**](#bloque-02) | [01. La Frontera de la Autonomía (Encuadre conceptual)](#bloque-02) | 10–20 min | **MUST TEACH** |
| [**03**](#bloque-03) | [Taxonomía Operacional: Definición previa a la interacción](#bloque-03) | 20–25 min | **MUST TEACH** |
| [**04**](#bloque-04) | [Taxonomía — Escenario 1: Resumen de texto (`LLM Call`)](#bloque-04) | 25–30 min | **MUST TEACH** |
| [**05**](#bloque-05) | [Taxonomía — Escenario 2: Script con Regex (`Workflow Determinista`)](#bloque-05) | 30–35 min | **MUST TEACH** |
| [**06**](#bloque-06) | [Taxonomía — Escenario 3: Búsqueda sin retorno (`Tool-Using / Model-Routed`)](#bloque-06) | 35–42 min | **MUST TEACH** |
| [**07**](#bloque-07) | [Taxonomía — Escenario 4: Bucle con realimentación (`Agent Loop`)](#bloque-07) | 42–50 min | **MUST TEACH** |
| [**08**](#bloque-08) | [Taxonomía — Key Insights y Conexión curricular con L02 y L03](#bloque-08) | 50–55 min | **MUST TEACH** |
| [**09**](#bloque-09) | [02. ¿Quién controla el flujo? (Concepto de Model Router)](#bloque-09) | 55–65 min | **MUST TEACH** |
| [**10**](#bloque-10) | [Simulador Split View: Determinista vs Model-Routed](#bloque-10) | 65–78 min | **MUST TEACH** |
| [**11**](#bloque-11) | [Anatomía en código: `model_router.py`](#bloque-11) | 78–85 min | **MUST TEACH** |
| [**12**](#bloque-12) | [Pausa activa: Clasificación rápida en grupos de estudio](#bloque-12) | 85–95 min | *OPTIONAL / IF TIME ALLOWS* |
| [**13**](#bloque-13) | [03. ¿Cuánta autonomía necesitas? (Slider de Trade-offs)](#bloque-13) | 95–105 min | **MUST TEACH** |
| [**14**](#bloque-14) | [Regla Arquitectónica: Least Autonomy Necessary](#bloque-14) | 105–110 min | **MUST TEACH** |
| [**15**](#bloque-15) | [Ejercicio de diseño arquitectónico: Casos A, B y C](#bloque-15) | 110–116 min | *OPTIONAL / IF TIME ALLOWS* |
| [**16**](#bloque-16) | [Cierre de L01 y Puente hacia L02 (Tool Calling)](#bloque-16) | 116–120 min | **MUST TEACH** |

---

## Timeline de conducción en vivo

---

<a id="bloque-01"></a>
### Bloque 01 — Apertura, conexión M04 → M05 y Mapa del Agente
- **Tiempo sugerido:** 0–10 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La cabecera técnica de la lección (`M05 · Lección 01 — Flujos de Trabajo vs Agentes`), el subtítulo *"No todo problema necesita un agente"*, el índice de navegación de secciones y el componente interactivo `app-agent-building-map` donde la primera etapa, **Decision**, aparece resaltada en color acento (`Decision → Tools → Loop → State / Memory → Guardrails`).

#### Objetivo pedagógico
Conectar con los pipelines de RAG de M04 y establecer que un agente no es un monolito mágico, sino un ensamblaje progresivo de cinco capacidades de software, comenzando hoy exclusivamente por la toma de decisiones.

#### Key idea
En RAG el software conocía de antemano toda la ruta. En agentes comenzamos a estudiar qué cambia cuando el software ya no sabe con certeza cuál debería ser el siguiente paso.

#### Qué decir
> "Bienvenidos al Módulo 05. Hasta el módulo anterior estuvimos trabajando con RAG. Piensen en cómo funcionaba ese pipeline: el usuario enviaba una consulta, nuestro código buscaba en la base vectorial, nuestro código formateaba el contexto y el modelo generaba una respuesta. El recorrido estaba 100% predeterminado en el software.
>
> Miren el diagrama en pantalla: en CASE descomponemos un sistema agéntico en cinco capacidades de ingeniería: **Decision**, **Tools**, **Loop**, **State** y **Guardrails**. Hoy no vamos a construir un agente completo ni a tirar código complejo de herramientas. Hoy vamos a dominar la primera pieza: **Decision**. Vamos a responder la pregunta que define si un sistema en producción es rentable o un agujero de costos: ¿quién decide qué hacer después?"

#### Pregunta al grupo
> "En el pipeline de RAG que construimos en M04, ¿quién decidía que había que hacer una búsqueda en la base de datos: el modelo de lenguaje o nuestro código en Python?"

#### Qué observar
El grupo debe llegar al consenso de que el código controlaba el flujo de forma fija. El modelo solo recibía datos y redactaba.

#### Frase puente
> "Hagamos scroll a la primera sección para examinar exactamente qué ocurre cuando el código llega a la frontera donde ya no puede predecir el camino."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-02"></a>
### Bloque 02 — Sección 01: La Frontera de la Autonomía (Encuadre conceptual)
- **Tiempo sugerido:** 10–20 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El encabezado `01. La Frontera de la Autonomía`, el subtítulo *"Cuando el código ya no sabe cuál es el siguiente paso"*, y dos párrafos técnicos introductorios antes del ejercicio interactivo.

#### Objetivo pedagógico
Entender que la autonomía técnica no es "libertad sin control", sino delegar deliberadamente una decisión sobre el siguiente paso a una inferencia probabilística, siempre dentro de las fronteras impuestas por el software.

#### Key idea
Autonomía = cuánta capacidad le delegamos al modelo para decidir qué hacer después dentro de los límites del runtime.

#### Qué decir
> "Leamos el subtítulo: 'Cuando el código ya no sabe cuál es el siguiente paso'. En desarrollo tradicional estamos acostumbrados a modelar todo con reglas rígidas: si pasa A, ejecuta B; si pasa C, ejecuta D. Pero cuando el problema involucra ambigüedad semántica o información que solo se descubre en tiempo de ejecución, ese código rígido se rompe.
>
> Ahí es donde introducimos autonomía. Pero ojo con esta definición: en este curso, autonomía no significa que el modelo tenga 'libertad' ni que tome el control del servidor. Autonomía significa **cuánta capacidad le delegamos al modelo para decidir qué hacer después**, manteniendo siempre el runtime y los límites bajo control de nuestro software."

#### Frase puente
> "Para entender esto sin caer en hype ni en discusiones abstractas, miremos la herramienta de clasificación que tenemos justo debajo."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-03"></a>
### Bloque 03 — Taxonomía Operacional: Definición previa a la interacción
- **Tiempo sugerido:** 20–25 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El panel interactivo con título `Taxonomía Operacional: Evaluando Autonomía`, el subtítulo *"Lee cada caso y determina el nivel de autonomía empleado en la solución"*, y los 4 botones de categorías visibles: `LLM Call`, `Workflow Determinista`, `Tool-Using / Model-Routed` y `Agent Loop`.

#### Objetivo pedagógico
Definir con claridad quirúrgica qué significa "taxonomía operacional", qué dimensión técnica se está evaluando y qué representa cada uno de los 4 botones ANTES de tocar el primer ejercicio.

#### Key idea
- **Taxonomía:** Clasificación estructurada.
- **Operacional:** Basada en cómo opera el flujo en tiempo de ejecución (quién decide y cómo viajan los datos).
- **Espectro de autonomía:** De menos decisión delegada al modelo → a más decisión dinámica delegada al modelo:
  1. *LLM Call:* Genera texto. Cero decisión operacional.
  2. *Workflow Determinista:* Pasos automatizados predefinidos en código. Cero modelo en la decisión.
  3. *Tool-Using / Model-Routed:* El modelo participa eligiendo una herramienta o ruta, pero la ejecución subsiguiente es fija y no hay bucle de retorno.
  4. *Agent Loop:* El modelo propone una acción, observa el resultado del entorno y decide iterativamente el siguiente paso.

#### Qué decir
> "Detengámonos aquí un momento antes de tocar la pantalla. Esta sección se llama 'Taxonomía Operacional: Evaluando Autonomía'. Desglosemos esas palabras para que no queden dudas durante toda la clase:
>
> - **Taxonomía** significa clasificar.
> - **Operacional** significa que vamos a clasificar según cómo funciona el sistema en tiempo de ejecución: quién decide el siguiente paso y adónde van los datos.
> - Y **Autonomía**, como acabamos de acordar, es **cuánto le delegamos al modelo la decisión sobre qué hacer después**.
>
> En pantalla tienen cuatro categorías. No son niveles de un videojuego donde el último es el mejor. Son cuatro patrones arquitectónicos distintos:
> 1. En un **LLM Call**, el modelo solo recibe texto y escupe texto. No elige un paso siguiente en ningún proceso.
> 2. En un **Workflow Determinista**, el código ejecuta una secuencia fija conocida de antemano.
> 3. En **Tool-Using / Model-Routed**, el modelo participa en elegir una herramienta o una categoría, pero el software ejecuta esa acción y el proceso termina. No hay un ciclo donde el modelo vea el resultado para volver a decidir.
> 4. En un **Agent Loop**, el resultado de la acción regresa al modelo como una observación, y esa observación determina qué decide hacer a continuación.
>
> Vamos a clasificar cuatro sistemas reales. Su tarea no es adivinar: es preguntarse **¿quién decidió el siguiente paso y si el resultado regresa al modelo?**"

#### Frase puente
> "Leamos el primer caso que aparece en el panel."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-04"></a>
### Bloque 04 — Taxonomía: Escenario 1 — Resumen de texto (`LLM Call`)
- **Tiempo sugerido:** 25–30 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La tarjeta del Escenario 1 (`s0`):
*"El usuario envía un texto a un modelo para que resuma su contenido. El modelo genera el resumen y se lo entrega de vuelta al usuario."*
Debajo, los cuatro botones interactivos.

#### Objetivo pedagógico
Identificar que una invocación directa a un LLM es una llamada de generación de texto y no contiene ninguna toma de decisión operacional sobre un flujo.

#### Key idea
Entrada → Modelo → Salida. El modelo responde una solicitud puntual; no decide un siguiente paso dentro de un proceso de software.

#### Qué decir
> "Miremos el caso 1: el usuario manda un texto, el modelo genera un resumen y se lo entrega. Preguntémonos: ¿el modelo decidió llamar a una función? No. ¿Eligió consultar una base de datos? No. ¿Recibió información de vuelta para evaluar si el resumen quedó bien y decidir qué hacer después? No.
>
> El modelo simplemente transformó tokens de entrada en tokens de salida. Esto es una llamada pura a un modelo."

#### Pregunta al grupo
> "¿Este sistema tomó alguna decisión operacional sobre qué paso ejecutar a continuación dentro de un software?"

#### Interacción
Haz clic en el botón `LLM Call`.

#### Qué observar
El panel cambia a borde y fondo verde (`success-panel`), aparece el icono `check_circle` y el texto explicativo:
*"Correcto. Esto es una simple llamada al modelo (User -> LLM -> Response)."*

#### Explicación / resolución
No hay herramientas, no hay bifurcaciones en código ni bucles de ejecución. El modelo actúa como un transformador de lenguaje natural puro.

#### Error común
Creer que cualquier aplicación conectada a la API de OpenAI o Gemini ya es un "agente de IA".

#### Frase puente
> "Veamos el segundo caso, donde sí hay varios pasos encadenados en un proceso."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-05"></a>
### Bloque 05 — Taxonomía: Escenario 2 — Script con Regex (`Workflow Determinista`)
- **Tiempo sugerido:** 30–35 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La tarjeta del Escenario 2 (`s0b`):
*"Un script de Python lee un correo, extrae el remitente usando expresiones regulares (regex) y lo guarda en una base de datos PostgreSQL."*
Debajo, los cuatro botones interactivos.

#### Objetivo pedagógico
Entender que la automatización de múltiples pasos no constituye IA ni autonomía agéntica si toda la secuencia de ejecución está predefinida en código imperativo.

#### Key idea
Quien decidió cada transición fue el desarrollador al escribir el código. El sistema sigue un camino 100% determinista.

#### Qué decir
> "Caso 2: un script de Python lee un correo, extrae el remitente con regex y lo guarda en PostgreSQL. Hay tres pasos claros: lectura, extracción y persistencia. Hay automatización real.
>
> Pero pregunto: ¿quién decidió que después de leer el correo venía la expresión regular y luego el INSERT de base de datos? El programador. El software conoce la ruta completa antes de arrancar."

#### Pregunta al grupo
> "¿Interviene aquí algún modelo probabilístico o alguna decisión tomada dinámicamente en tiempo de ejecución?"

#### Interacción
Haz clic en el botón `Workflow Determinista`.

#### Qué observar
El panel se ilumina en verde con el feedback:
*"Correcto. Es un flujo determinista, controlado 100% por reglas en código rígido."*

#### Explicación / resolución
El flujo es predecible, repetible y formalmente determinista. Bajo las mismas condiciones de entrada, el código siempre ejecutará exactamente las mismas instrucciones en el mismo orden.

#### Error común
Confundir la automatización de procesos (RPA o scripts de backend) con sistemas agénticos. Encadenar pasos no equivale a delegar decisiones.

#### Frase puente
> "Hasta aquí el modelo no decide nada o ni siquiera participa. Ahora entremos al caso 3, donde el modelo sí participa en la decisión."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-06"></a>
### Bloque 06 — Taxonomía: Escenario 3 — Búsqueda sin retorno (`Tool-Using / Model-Routed`)
- **Tiempo sugerido:** 35–42 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La tarjeta del Escenario 3 (`s1`):
*"El modelo decide que necesita buscar en la base de datos de tickets. Devuelve un JSON solicitando la ejecución de `search_tickets`. El sistema extrae el JSON, ejecuta la consulta SQL, y envía esos tickets crudos al usuario por email."*
Debajo, los cuatro botones interactivos.

#### Objetivo pedagógico
Diferenciar con precisión técnica el uso de herramientas (Tool Calling) de un ciclo agéntico (Agent Loop), identificando que la ausencia de realimentación impide la existencia de un agente.

#### Key idea
El modelo participa en seleccionar la herramienta o la ruta, pero la ejecución subsiguiente la realiza el software de forma prefijada y el proceso concluye. No hay realimentación hacia el modelo.

#### Qué decir
> "Mucha atención a este caso, porque aquí es donde ocurre la mayor confusión en la industria.
>
> El modelo recibe la consulta del usuario, evalúa el contexto y dice: 'Para responder esto necesito buscar tickets, así que ejecuten `search_tickets`'. Devuelve un JSON estructurado. Nuestro backend toma el JSON, ejecuta la consulta en la base de datos y le manda el resultado crudo al usuario por correo.
>
> Hubo un cambio fundamental frente a los casos anteriores: **el modelo participó en elegir la acción**. Pero miren con lupa qué pasó después: una vez que el software corrió la consulta SQL, ¿el resultado regresó al modelo para que lo analizara y decidiera si necesitaba buscar otra cosa? No. El software despachó el correo y el proceso terminó."

#### Pregunta al grupo
> "Después de ejecutar `search_tickets`, ¿el resultado volvió al modelo para que decidiera nuevamente qué hacer, o el flujo terminó directamente?"

#### Interacción
*(Opcional formativo)*: Si alguien del grupo afirma que es un `Agent Loop`, haz clic deliberadamente en `Agent Loop` para mostrar el panel de error en rojo:
*"Incorrecto. Algunas herramientas/frameworks pueden denominarlo agente, pero CASE separa Tool-Using Workflow de Agent Loop para hacer visible si la observación produce o no una nueva ronda de decisión. Aquí no la hubo."*
Luego haz clic en `Tool-Using / Model-Routed`.

#### Qué observar
El panel verde confirma:
*"Correcto. El modelo decidió usar una herramienta o enrutar, pero el sistema completó el trabajo de forma predecible sin volver a preguntarle al modelo. NO hubo retroalimentación (Loop)."*

#### Explicación / resolución
El modelo actuó como un selector o enrutador. Delegamos la decisión de qué herramienta invocar, pero el software mantuvo el control determinista de la ejecución final.

#### Error común
Equiparar "Function Calling" o "Tool Calling" con "Agente". Usar herramientas es solo una capacidad de comunicación del modelo; un agente requiere que el resultado de la herramienta regrese al modelo para alimentar la siguiente decisión.

#### Frase puente
> "¿Qué tendría que cambiar en este flujo para que sí estemos ante un Agent Loop? Miremos el cuarto escenario."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-07"></a>
### Bloque 07 — Taxonomía: Escenario 4 — Bucle con realimentación (`Agent Loop`)
- **Tiempo sugerido:** 42–50 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La tarjeta del Escenario 4 (`s2`):
*"El modelo usa `search_tickets` para obtener los errores reportados. El sistema le inyecta el resultado de vuelta al prompt del modelo (como una observación). El modelo lee los tickets, nota que falta un log específico, y decide llamar a `fetch_logs` antes de finalizar."*
Debajo, los cuatro botones interactivos.

#### Objetivo pedagógico
Reconocer la anatomía completa de un Agent Loop: el ciclo iterativo donde una acción genera una observación del entorno, y esa observación modifica el estado y detona una nueva decisión del modelo.

#### Key idea
El bucle conceptual agéntico:
`DECISIÓN → ACCIÓN → OBSERVACIÓN → ACTUALIZACIÓN DE ESTADO → NUEVA DECISIÓN`.
El siguiente paso no estaba prefijado en código; emergió dinámicamente de lo que el modelo descubrió durante la ejecución.

#### Qué decir
> "Miren el contraste directo con el caso anterior. El modelo pide `search_tickets`. El sistema ejecuta la búsqueda, pero esta vez **le inyecta el resultado de vuelta al modelo como una observación**.
>
> El modelo lee esa nueva evidencia, razona sobre ella y descubre algo: 'Espera, con estos tickets no me alcanza, me falta el log del servidor de pagos'. Y toma una **segunda decisión**: solicita ejecutar `fetch_logs`.
>
> El siguiente paso no estaba programado rígidamente en un `if/else`. Emergió de la interacción entre lo que el modelo decidió, lo que el entorno devolvió como observación y lo que el modelo reevaluó en la siguiente iteración."

#### Pregunta al grupo
> "¿Qué elemento estructural apareció aquí que NO existía en el escenario anterior?"

#### Interacción
Haz clic en el botón `Agent Loop`.

#### Qué observar
El panel verde muestra la resolución exitosa:
*"¡Exacto! El resultado de la primera herramienta detonó una nueva decisión del modelo. Esto es un Agent Loop clásico."*

#### Explicación / resolución
Hay realimentación iterativa. El runtime ejecuta la acción propuesta por el modelo, captura la salida como observación, actualiza el historial de mensajes (estado) y solicita una nueva inferencia al modelo. El modelo decide si el objetivo está cumplido o si necesita otra iteración.

#### Error común
Creer que en un Agent Loop el modelo ejecuta código directamente en el servidor. Recordar: el modelo solo propone la intención estructurada; el runtime de software es quien valida permisos, ejecuta llamadas y aplica los guardrails de seguridad.

#### Frase puente
> "Bajemos al bloque de Key Insights que sintetiza esta regla de oro."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-08"></a>
### Bloque 08 — Taxonomía: Key Insights y Conexión curricular con L02 y L03
- **Tiempo sugerido:** 50–55 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El bloque de `Key Insights de Ingeniería` con título *"Taxonomía Operacional en CASE"* y dos viñetas con iconos de verificación:
- *Tool-Using Workflow:* El modelo decide usar una herramienta. El sistema la ejecuta, entrega el resultado al usuario y termina. NO hay realimentación.
- *Agent Loop:* El resultado de la herramienta regresa al modelo, quien evalúa la nueva observación y decide si necesita ejecutar otra acción o finalizar.

#### Objetivo pedagógico
Fijar el criterio de demarcación técnica y conectar de forma explícita la taxonomía con las lecciones L02 y L03 del currículo.

#### Key idea
- No todo sistema que usa un LLM es un agente.
- No todo sistema que usa herramientas es un agente.
- La diferencia crítica aparece cuando el resultado de una acción vuelve al modelo y participa en la decisión del siguiente paso.

#### Qué decir
> "Léanse estas dos viñetas con mucho cuidado. Este es el criterio que deben llevarse grabado a sus empresas:
>
> No todo sistema que usa un LLM es un agente. No todo sistema que usa herramientas es un agente. La diferencia real aparece cuando el resultado de una acción vuelve al modelo como observación y participa en la decisión del siguiente paso.
>
> Miren cómo se conecta esto con el resto del Módulo 05:
> - **Hoy en L01:** Aprendemos cuándo se justifica introducir autonomía.
> - **En L02:** Aprenderemos cómo hacer que el modelo solicite herramientas de forma tipada y segura mediante el protocolo de **Tool Calling**.
> - **Y en L03:** Construiremos el motor que gestiona este ciclo cerrado: el **Agent Loop**."

#### Frase puente
> "Ahora pasemos a la Sección 02 para ver cómo implementamos en código el escalón intermedio más útil y seguro: el enrutador semántico."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-09"></a>
### Bloque 09 — Sección 02: ¿Quién controla el flujo? (Concepto de Model Router)
- **Tiempo sugerido:** 55–65 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El encabezado `02. ¿Quién controla el flujo?`, el subtítulo *"El paso del IF-ELSE al ruteo semántico"*, y el párrafo explicativo sobre el patrón Model-Routed Workflow.

#### Objetivo pedagógico
Entender el Model-Routed Workflow como el puente pragmático entre código determinista y modelos de lenguaje: delegar la desambiguación semántica al modelo sin entregarle el control de la ejecución.

#### Key idea
En lugar de forzar a que el modelo controle toda la aplicación, usamos el LLM como un clasificador semántico de alta precisión y luego recuperamos el control determinista del software.

#### Qué decir
> "Entramos a la Sección 02. En la práctica, la mayoría de ingenieros cometen uno de dos errores opuestos:
> O intentan resolver texto libre con 200 expresiones regulares y diccionarios de sinónimos que se vuelven inmanejables, o saltan directo a montar un agente autónomo complejo con frameworks pesados.
>
> La solución de producción más robusta y económica suele ser la del medio: el **Model-Routed Workflow**. Usamos el LLM exactamente donde es imbatible: entendiendo lenguaje ambiguo y clasificando la intención. Pero en cuanto el modelo devuelve una etiqueta estructurada, nuestro software recupera el control y ejecuta un flujo determinista probado."

#### Frase puente
> "Miremos el simulador interactivo para ver cómo responde un flujo determinista frente a un Model-Routed ante un ticket real."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-10"></a>
### Bloque 10 — Simulador Split View: Determinista vs Model-Routed
- **Tiempo sugerido:** 65–78 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El panel interactivo dividido en dos columnas con un ticket de entrada ambiguo:
*"Quiero devolver el producto porque me cobraron dos veces, pero perdí el número de orden y mi app se cierra sola."*
- **Columna izquierda:** `Flujo Determinista` (Badge: *"Excelente para flujos conocidos"*), botón `Ejecutar Reglas IF-ELSE`, y visualización de nodos condicionales.
- **Columna derecha:** `Model-Routed Workflow` (Badge: *"Útil para clasificación semántica"*), botón `Enrutar con LLM`, y nodo con animación de inferencia.

#### Objetivo pedagógico
Demostrar en vivo por qué las reglas condicionales rígidas fallan ante entradas no estructuradas y cómo el Model-Routed Workflow resuelve la ambigüedad manteniendo la ejecución bajo control de software.

#### Key idea
- El flujo determinista es rápido y barato, pero frágil ante variaciones lingüísticas.
- El Model-Routed desambigua múltiples intenciones en un JSON estructurado.
- **El modelo propone / enruta; el software ejecuta.**

#### Qué decir
> "Miren el ticket del usuario en pantalla: 'Quiero devolver el producto porque me cobraron dos veces, pero perdí el número de orden y mi app se cierra sola'.
> Hay un reclamo de devolución, un error de cobro doble, falta de datos de orden y un reporte de bug técnico. Todo mezclado en una sola oración.
>
> Veamos qué le pasa a un flujo determinista clásico de reglas condicionales cuando procesa este mensaje."

#### Interacción 1
Haz clic en el botón `Ejecutar Reglas IF-ELSE` en la columna izquierda.

#### Qué observar
El flujo se activa paso a paso: pasa por `if (text.includes('devolver'))`, llega a `if (hasOrderNumber(text))` y falla con un nodo rojo de error:
*"Error: Falta número de orden. Ticket descartado o requiere humano."*

#### Explicación 1
El programador asumió que si alguien pide devolución siempre proporciona el número de orden en el mismo texto. Como no vino, el código no supo recuperarse y descartó la solicitud.

#### Qué decir
> "El código tradicional falló no por malo, sino porque no puede anticipar la variabilidad infinita del lenguaje humano. Ahora miren la columna derecha: el Model-Routed Workflow."

#### Interacción 2
Haz clic en el botón `Enrutar con LLM` en la columna derecha.

#### Qué observar
El nodo `llm.generate(prompt)` muestra el icono giratorio `sync` simulando inferencia, y luego se despliega el nodo verde con el JSON estructurado:
```json
{
  "intent": "multiple_issues",
  "sub_intents": ["refund", "billing_error", "tech_bug"],
  "missing_data": ["order_number"],
  "action": "route_to_human_tier_2"
}
```
Y al fondo aparece la caja de conclusión: *"En el Model-Routed, el modelo propone/rutea. El software ejecuta."*

#### Explicación 2
El modelo no ejecutó ninguna función de reembolso ni manipuló la base de datos. Solo leyó el lenguaje natural y produjo un objeto de datos estructurado identificando las intenciones y los datos faltantes. Nuestro backend lee ese JSON y decide qué cola de soporte invocar.

#### Pregunta al grupo
> "¿Quién tomó la decisión semántica? El modelo. ¿Y quién tiene el control de las funciones que realmente se ejecutan en el backend? Nuestro software."

#### Frase puente
> "Miremos cómo se escribe esto en código Python real justo en el bloque de abajo."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-11"></a>
### Bloque 11 — Anatomía en código: `model_router.py`
- **Tiempo sugerido:** 78–85 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El bloque de código Python con nombre de archivo `model_router.py`:
- Paso 1: Llamada al modelo exigiendo JSON estructurado (`response_format={"type": "json_object"}`).
- Paso 2: Bloque de control determinista en Python (`if intent == "technical_support" ... elif intent == "refund" ... else: fallback`).

#### Objetivo pedagógico
Inspeccionar la implementación técnica estándar de un Model-Routed Workflow en producción: contrato JSON estricto + bifurcaciones tradicionales de software.

#### Key idea
Un Model Router no elimina el control de software; cambia qué parte del problema resolvemos con código (la ejecución) y qué parte delegamos al modelo (la clasificación).

#### Qué decir
> "Miren el bloque de código. Son literalmente 15 líneas de Python, pero este es el patrón que sostiene miles de sistemas en producción:
>
> En el paso 1, obligamos al modelo a devolver un JSON con un esquema estricto usando `response_format`. Extraemos la intención.
> En el paso 2, el flujo determinista recupera el control completo. Un `if/elif/else` convencional de Python. Si el modelo devuelve una intención válida, llamamos a la función preprogramada correspondiente. Y si el modelo alucina o devuelve algo desconocido, cae en el `else` de fallback seguro.
>
> El modelo no tiene punteros a funciones, no ejecuta SQL y no tiene acceso a internet. Solo clasifica."

#### Error común
Creer que migrar a IA significa que el modelo debe manejar el flujo de control completo de la aplicación.

#### Frase puente
> "Hagamos un ejercicio rápido de 5 minutos en grupos de estudio para verificar que sabemos aplicar esta distinción en problemas reales."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-12"></a>
### Bloque 12 — Pausa activa: Clasificación rápida en grupos de estudio
- **Tiempo sugerido:** 85–95 min
- **Prioridad:** OPTIONAL / IF TIME ALLOWS *(si la clase viene retrasada, haz la puesta en común directa en 3 min)*

#### Qué estás viendo
Mantén visible en pantalla el código de `model_router.py` y la sección de control de flujo mientras los participantes debaten.

#### Objetivo pedagógico
Consolidar el criterio de selección entre Pipeline Determinista, Model-Routed Workflow y Agent Loop frente a tres requerimientos empresariales.

#### Dinámica para el instructor
Pide al grupo que se organicen en parejas o tríos y clasifiquen estos 3 casos en 3 minutos:
1. *"Generar una factura PDF con formato estricto y enviarla al repositorio contable."*
2. *"Clasificar un ticket de soporte escrito en lenguaje libre entre cinco áreas resolutoras."*
3. *"Investigar por qué un despliegue falla en producción: leer logs, probar un parche en memoria y reevaluar si los tests pasan."*

#### Puesta en común (2 minutos)
- **Caso 1:** **Flujo determinista (Pipeline).** Cero inferencia. La estructura de la factura y los cálculos matemáticos deben ser exactos. Usar un LLM aquí es negligencia técnica por costo y riesgo de alucinación.
- **Caso 2:** **Model-Routed Workflow.** El texto del usuario es ambiguo (justifica inferencia semántica), pero una vez identificada el área, el enrutamiento al sistema de tickets es un proceso de software determinista.
- **Caso 3:** **Agent Loop.** Nadie puede programar de antemano qué error va a arrojar el log, qué parche probar y si fallará de nuevo. El siguiente paso depende estrictamente de lo que devuelva la observación anterior.

#### Frase puente
> "Excelente. Ahora entremos a la Sección 03 para responder la pregunta económica de fondo: ¿cuánto nos cuesta realmente cada escalón de autonomía?"

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-13"></a>
### Bloque 13 — Sección 03: ¿Cuánta autonomía necesitas? (Slider de Trade-offs)
- **Tiempo sugerido:** 95–105 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
La sección `03. ¿Cuánta autonomía necesitas?` con el subtítulo *"La autonomía es un costo operacional, no un objetivo por sí mismo"*, el callout metodológico y el componente interactivo `El Costo de la Autonomía` compuesto por:
- Un slider de 3 posiciones: `Deterministic` (0), `Model-Routed` (1) y `Agent Loop` (2).
- Una tarjeta descriptiva que se actualiza dinámicamente.
- Dos grupos de métricas con barras de progreso:
  - **Capacidades (más alto = mejor):** *Predictibilidad* y *Flexibilidad*.
  - **Costos (más alto = peor):** *Costo Relativo*, *Latencia Relativa* y *Riesgo Operacional*.

#### Objetivo pedagógico
Analizar rigurosamente los cinco costos operacionales que se disparan al aumentar la autonomía: pérdida de predictibilidad, costo económico de tokens, latencia acumulada, complejidad de pruebas y riesgo de efectos secundarios (side effects).

#### Key idea
La autonomía no es gratis: cada decisión que le entregas al modelo reduce la predictibilidad y multiplica la superficie de fallo del sistema.

#### Interacción guiada paso a paso por el instructor

1. **Posición 0 — Deterministic:**
   - Coloca el slider en **Deterministic** (posición 0).
   - **Qué observar:** Predictibilidad 95%, Flexibilidad 10%, Costo Relativo 5%, Latencia 5%, Riesgo 10%.
   - **Qué decir:** "Observen la posición 0: flujo determinista. La predictibilidad es del 95%: sabemos exactamente qué ruta va a seguir cada milisegundo. El costo de tokens es cero, la latencia es imperceptible y el riesgo operacional es mínimo. ¿Su única limitación? Flexibilidad del 10%: si la entrada se desvía un milímetro de lo programado, el sistema no sabe qué hacer."

2. **Posición 1 — Model-Routed:**
   - Mueve el slider a **Model-Routed** (posición 1).
   - **Qué observar:** Predictibilidad 80%, Flexibilidad 50%, Costo 30%, Latencia 35%, Riesgo 30%.
   - **Qué decir:** "Subamos a Model-Routed. Miren el intercambio: ganamos flexibilidad (50%) para procesar lenguaje ambiguo, pero empezamos a pagar peaje. Costo y latencia suben al 30-35% porque ahora pagamos una llamada de red a la API del modelo por cada solicitud. Y el riesgo sube al 30% si el modelo clasifica mal. Sin embargo, la predictibilidad sigue siendo alta (80%) porque el código determinista retiene la ejecución."

3. **Posición 2 — Agent Loop:**
   - Mueve el slider a **Agent Loop** (posición 2).
   - **Qué observar:** Predictibilidad colapsa al 30%, Flexibilidad sube al 95%, Costo sube al 90%, Latencia al 90% y Riesgo Operacional al 85%.
   - **Qué decir:** "Y ahora miren lo que ocurre cuando pasamos a un Agent Loop completo. La flexibilidad es casi total (95%): el agente puede iterar y resolver problemas no previstos. Pero miren el precio operativo que pagamos: la predictibilidad se desploma al 30%, el costo y la latencia se van al 90% porque el modelo puede encadenar 5, 10 o 20 inferencias antes de decidir parar, y el riesgo operacional salta al 85% porque si el agente tiene herramientas con efectos secundarios en bases de datos o APIs externas, un loop descontrolado puede causar estragos en producción."

#### Pregunta al grupo
> "Si están diseñando el flujo de cancelación de pedidos para un e-commerce con medio millón de usuarios diarios, ¿en cuál de estas tres posiciones pondrían su arquitectura y por qué?"

#### Error común
Asumir que el Agent Loop es la arquitectura moderna obligatoria y que los workflows deterministas son tecnología obsoleta. En producción, el 90% de los casos de negocio se resuelven de forma óptima en posición 0 o 1.

#### Frase puente
> "Para sintetizar esta decisión en una regla de ingeniería formal, lean el callout de arquitectura que tenemos justo abajo."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-14"></a>
### Bloque 14 — Regla Arquitectónica: Least Autonomy Necessary
- **Tiempo sugerido:** 105–110 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El callout de arquitectura destacado con borde y estilo de regla:
`Regla Arquitectónica: Least Autonomy Necessary`.

#### Objetivo pedagógico
Fijar el principio rector de diseño de sistemas con IA: construir siempre con el nivel más bajo de autonomía que resuelva de forma robusta el problema.

#### Key idea
- Si un flujo determinista resuelve el problema, **está prohibido usar un LLM**.
- Si un Model-Routed Workflow resuelve la ambigüedad, **está prohibido construir un Agent Loop**.
- Reserva el Agent Loop **exclusivamente para problemas abiertos** donde el siguiente paso no puede anticiparse sin observar resultados intermedios.

#### Qué decir
> "Miren esta regla en pantalla: **Least Autonomy Necessary** (Mínima Autonomía Necesaria). Es la directriz más importante de todo este curso.
>
> En ingeniería tradicional aprendemos a no usar una base de datos distribuida si nos alcanza con SQLite. En IA agéntica aplica exactamente lo mismo:
> Si un pipeline de código resuelve el problema, no metas un modelo.
> Si un Model Router desambigua la intención, no metas un bucle agéntico.
> Reserva el Agent Loop únicamente para problemas donde sea matemáticamente imposible prever el siguiente paso sin evaluar lo que descubrió la acción anterior."

#### Frase puente
> "Apliquemos esta regla a tres casos de diseño antes de cerrar la lección."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-15"></a>
### Bloque 15 — Ejercicio de diseño arquitectónico: Casos A, B y C
- **Tiempo sugerido:** 110–116 min
- **Prioridad:** OPTIONAL / IF TIME ALLOWS

#### Qué estás viendo
Discusión guiada de los 3 casos de diseño para comprobar la asimilación de la regla arquitectónica.

#### Objetivo pedagógico
Verificar que los participantes justifican sus decisiones basándose en la necesidad real de autonomía y no en la popularidad de la tecnología.

#### Regla del ejercicio para el instructor
No aceptes como justificación "usaría un agente porque es más inteligente". Exige que completen esta frase:
> *"Necesito autonomía aquí porque el siguiente paso no puede determinarse de antemano debido a ______."*

#### Casos para evaluar:
1. **Caso A — Procesamiento de 20.000 facturas estándar:**
   *Resolución esperada:* **Pipeline Determinista.** Formato conocido, reglas contables estrictas, cero variabilidad requerida.
2. **Caso B — Mesa de ayuda con texto libre hacia 6 áreas:**
   *Resolución esperada:* **Model-Routed Workflow.** El texto libre justifica la inferencia semántica del modelo para clasificar, pero el despacho a la cola de destino es determinista.
3. **Caso C — Diagnóstico técnico de incidentes en producción:**
   *Resolución esperada:* **Agent Loop.** El sistema debe leer logs, formular hipótesis, probar consultas y decidir el siguiente paso en función de lo que vaya encontrando.

#### Frase puente
> "Llegamos al final de la Lección 01. Hagamos el cierre formal y veamos el puente hacia lo que construiremos en la Lección 02."

[↑ Volver al índice](#navegacion-rapida)

---

<a id="bloque-16"></a>
### Bloque 16 — Cierre de L01 y Puente hacia L02 (Tool Calling)
- **Tiempo sugerido:** 116–120 min
- **Prioridad:** MUST TEACH

#### Qué estás viendo
El pie de página con la navegación hacia la siguiente lección (`M05-L02 — Llamada de Herramientas y Agent v1`) y el mapa conceptual del agente.

#### Objetivo pedagógico
Sellar los tres conceptos no negociables de la sesión, erradicar los dos errores más comunes y plantear la pregunta técnica detonante de L02.

#### Qué decir
> "Para cerrar la sesión de hoy, hagamos balance. Hemos recorrido la primera capacidad de nuestro mapa: **Decision**.
> Ya sabemos que autonomía no es inteligencia sin límites, sino delegar la elección del siguiente paso.
> Ya sabemos distinguir un LLM Call de un Workflow Determinista, de un Model Router y de un Agent Loop.
> Y ya tenemos la brújula de diseño: Least Autonomy Necessary.
>
> Ahora quiero dejarlos con la pregunta técnica que abre la Lección 02:
> Supongamos que evaluamos un caso y determinamos que sí necesitamos que el modelo decida qué herramienta usar.
> Pero aquí nos encontramos con un problema físico: los LLMs son modelos matemáticos encerrados en un servidor de inferencia. No tienen 'manos'. No pueden abrir una conexión a PostgreSQL, no pueden consultar una API REST ni pueden ejecutar un script de Python por sí mismos.
>
> ¿Cómo le damos capacidades al modelo para interactuar con nuestro sistema sin entregarle el control de nuestro runtime?
> Eso es **Tool Calling**, el protocolo de comunicación estructurada que aprenderemos e implementaremos desde cero en la Lección 02."

[↑ Volver al índice](#navegacion-rapida)

---

## Cierre de L01

### 3 Conceptos que los estudiantes deben retener obligatoriamente
1. **Autonomía Operacional:** Cuánta capacidad le delegamos al modelo probabilístico para decidir qué hacer después dentro de los límites del software.
2. **La frontera del Agent Loop:** Un sistema con herramientas concluye cuando la herramienta ejecuta; un agente reinyecta el resultado como una **observación** que alimenta una nueva ronda de decisión iterativa.
3. **Least Autonomy Necessary:** La regla de oro de la arquitectura de IA: utiliza siempre el menor nivel de autonomía que resuelva el problema con robustez y bajo costo.

### 2 Errores conceptuales a erradicar
1. *"Cualquier sistema que llame a una API de LLM o use Function Calling es un agente."*
   **Realidad:** Puede ser un simple *LLM Call* o un *Tool-Using Workflow*. Solo hay agente si existe un ciclo cerrado de realimentación (observación → nueva decisión).
2. *"A mayor nivel de autonomía, mejor arquitectura de software."*
   **Realidad:** Cada incremento de autonomía dispara la superficie de fallo: reduce la predictibilidad al 30%, aumenta costos y latencia al 90% y multiplica el riesgo operacional.

### 1 Transición hacia L02 (Tool Calling)
> "El modelo puede tomar decisiones semánticas, pero está aislado del entorno real. En la **Lección 02** construiremos el mecanismo de **Tool Calling**: el contrato estricto donde el modelo propone llamadas estructuradas en JSON y nuestro código en Python las valida y ejecuta con total seguridad."

---

## Checklist rápido del instructor antes de cerrar sesión

Antes de despedir la clase, verifica que el grupo pueda responder con soltura:
- [ ] ¿Quién decide el siguiente paso en un pipeline determinista? *(El código / programador).*
- [ ] ¿Qué hace exactamente un Model Router? *(Clasifica o extrae intención con el LLM y devuelve el control al software).*
- [ ] ¿Qué diferencia a un Tool-Using Workflow de un Agent Loop? *(Que en el Agent Loop el resultado vuelve al modelo como observación para volver a decidir).*
- [ ] ¿Por qué un exceso de autonomía pone en riesgo un sistema de producción? *(Porque dispara la latencia, el costo en tokens y la probabilidad de efectos secundarios no deseados).*
- [ ] ¿Qué nos exige la regla Least Autonomy Necessary? *(Diseñar con la mínima autonomía posible que resuelva el caso de uso).*
