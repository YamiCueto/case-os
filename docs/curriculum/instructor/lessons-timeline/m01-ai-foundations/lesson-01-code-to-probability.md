# M01-L01 — De Código a Probabilidad

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** que el grupo distinga un programa determinista de un LLM y entienda qué controla realmente un ingeniero cuando integra un modelo.

## Idea central

> El código tradicional ejecuta reglas explícitas; un LLM genera la continuación más probable según el contexto. Por eso no tratamos su salida como el resultado garantizado de una función.

## Ruta en pantalla

| Tiempo | Sección de CASE Academy | Meta de explicación |
|---|---|---|
| 17:00–17:15 | Apertura | Activar conocimiento previo y plantear el contraste. |
| 17:15–17:40 | De Código a Probabilidad | Contrastar reglas y probabilidades. |
| 17:40–18:00 | Ejercicio 1 | Clasificar decisiones deterministas y probabilísticas. |
| 18:00–18:20 | Entrenamiento vs Inferencia | Distinguir lo que crea el proveedor de lo que opera el equipo. |
| 18:20–18:30 | Pausa / preguntas | Recuperar dudas y conectar con casos reales. |
| 18:30–18:50 | Parámetros y elección de modelo | Relacionar tamaño de modelo con costo, latencia y tarea. |
| 18:50–19:00 | Ejercicio 2 y cierre | Elegir modelo por caso y preparar L02. |

## 17:00–17:40 — Software determinista vs LLM

### Pregunta de apertura

> “Si una función recibe la misma entrada dos veces, ¿qué esperamos que ocurra?”

Escribe `calcularIVA(100) → 119`. Después pregunta: “Si le pedimos a un LLM resumir un correo, ¿garantizamos exactamente las mismas palabras cada vez?”

### Concepto fácil de explicar

- **Software determinista:** reglas explícitas. Misma entrada, misma salida esperada.
- **LLM:** calcula qué fragmento de texto es más probable que continúe una secuencia.
- **Probabilístico:** puede dar resultados distintos o formular una respuesta plausible pero incorrecta.

> “Un `if/else` sigue reglas que escribimos. Un LLM sigue patrones aprendidos y elige una continuación probable.”

Proyecta ambas columnas. Pide que identifiquen una diferencia que afectaría una aplicación de pagos, salud o seguridad.

> “La IA no elimina la ingeniería: hace más importante decidir qué puede ser probabilístico y qué debe seguir siendo una regla comprobable.”

### Ejercicio 1 — Semáforo de decisiones (20 min)

Divide el grupo en parejas. Proyecta estas situaciones y pídeles decidir si son **verdes** (puede intervenir IA con supervisión), **amarillas** (solo con validación fuerte) o **rojas** (deben permanecer deterministas):

1. Clasificar el tono de una queja.
2. Calcular el interés de un crédito.
3. Resumir una reunión.
4. Autorizar una transferencia bancaria.
5. Extraer el tema de un correo sin estructura.

No busques una respuesta automática. Pide siempre: “¿Qué pasa si se equivoca una vez?” La conclusión debe ser que el riesgo y la validación determinan la frontera.

## 18:00–18:20 — Entrenamiento vs Inferencia

### Pregunta

> “Cuando una persona usa un chatbot, ¿el modelo aprende permanentemente esa conversación?”

### Concepto fácil de explicar

- **Entrenamiento:** proceso previo que ajusta los parámetros del modelo con grandes cantidades de datos.
- **Inferencia:** usar el modelo ya entrenado para responder una solicitud.
- **Modelo congelado:** una consulta normal no actualiza automáticamente su conocimiento.

> “Entrenar es fabricar y preparar el motor. Inferencia es encender ese motor para cada viaje.”

No profundices en redes neuronales, GPUs ni billones de parámetros. Recalca: el equipo diseña la llamada, contexto, límites y validación.

## 18:30–18:50 — Parámetros y elección de modelo

Pregunta: “¿Usarían el modelo más grande y costoso para clasificar el asunto de un correo?”

- **Parámetros:** valores matemáticos aprendidos que influyen en el comportamiento del modelo.
- **Modelo pequeño:** suele ser más barato y rápido para tareas acotadas.
- **Modelo grande:** puede servir para tareas complejas, con mayor costo y latencia.

> “No se trata de comprar el modelo más grande; se trata de usar la capacidad mínima que resuelve la tarea con la calidad necesaria.”

### Ejercicio 2 — Decisión de arquitectura

En grupos, decidir qué enfoque priorizarían para clasificar 10.000 correos, resumir un diseño técnico complejo y extraer campos de una factura estable. Deben justificar con cuatro criterios: calidad necesaria, costo, latencia y riesgo de error. Busca razonamiento, no una única respuesta.

## Cierre y preguntas de salida

> “Ya sabemos que un LLM trabaja con probabilidades. En la siguiente lección veremos con qué unidad procesa el texto, qué límites tiene su contexto y por qué cada decisión también tiene costo.”

1. ¿Qué diferencia práctica hay entre una función y un LLM?
2. ¿Qué parte controla el proveedor y cuál controlamos nosotros?
3. ¿Por qué un modelo pequeño puede ser una buena decisión de ingeniería?

**Evita:** decir que el modelo piensa, consulta una base de datos interna o garantiza su salida. No expliques aún RAG ni prompt engineering.
