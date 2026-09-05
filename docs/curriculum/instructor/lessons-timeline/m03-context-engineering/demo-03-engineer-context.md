# M03 · Demo 03 — Diseñar el contexto

## Qué demuestra esta actividad

La demo transforma el principio de contexto mínimo útil en una decisión visible: los estudiantes eligen fuentes de información, ven el consumo de presupuesto y comprueban si incluyeron todo lo indispensable sin ruido.

**Duración sugerida en vivo:** aproximadamente 2 horas si se usa como sesión práctica completa; 20–30 minutos como cierre de L03.  
**Escenario:** una persona pregunta «¿Puedo cancelar esta?» mientras ve la factura #552.

## Antes de iniciar

Explica que **TU** significa unidades de presupuesto usadas únicamente para visualizar el costo relativo del contexto. La aplicación no está llamando un LLM real: evalúa de forma determinista si se seleccionan las fuentes requeridas, no hay ruido y no se exceden 100 TU.

## Mapa de la demo

| Fuente | Tamaño | ¿Por qué importa? |
| --- | ---: | --- |
| Usuario y autenticación | 10 TU | Determina rol, permisos e identidad. |
| Estado de la aplicación | 15 TU | Identifica la factura #552 pendiente. |
| Historial completo | 55 TU | Es ruido histórico para esta pregunta. |
| Historial reciente | 15 TU | Conserva la intención inmediata. |
| Política de cancelación | 30 TU | Aporta la regla para decidir. |
| Promociones y marketing | 25 TU | No cambia la decisión. |

El conjunto correcto es: usuario + estado de aplicación + historial reciente + política. Total: **70 TU**.

## Guion de demostración

### Ronda 1 — El anti-patrón: «enviemos todo»

1. Selecciona las seis fuentes.
2. Pregunta antes de mirar el resultado: «¿Tenemos toda la información? Sí. ¿Tenemos un buen contexto?». 
3. Señala que llega a 150 TU y la interfaz muestra `FAIL — Noise / Overflow`.

Idea a verbalizar: «Disponibilidad no es calidad. El presupuesto se excede y dos bloques no ayudan a decidir la cancelación».

### Ronda 2 — Poco contexto

1. Reinicia la selección.
2. Elige solo estado de aplicación y política.
3. Pregunta: «¿Puede responder con seguridad sin saber quién pregunta ni qué acaba de preguntar?». 
4. La interfaz seguirá en estado de construcción porque faltan fuentes obligatorias.

Idea: «Menos por sí solo tampoco es mejor: falta contexto útil».

### Ronda 3 — Contexto mínimo útil

1. Selecciona usuario, estado, historial reciente y política.
2. Haz que el grupo calcule: 10 + 15 + 15 + 30 = 70 TU.
3. Observa el `PASS — Minimum Useful Context`.

Cierre verbal: «No buscamos el prompt más largo; diseñamos el paquete de información que permite actuar sin inventar».

## Preguntas que funcionan bien

- «¿Cuál bloque quitarían primero si tuviéramos solamente 60 TU?»
- «¿Qué riesgo aparece si añadimos el historial completo “por si acaso”?»
- «¿Cambiaría su selección si la pregunta fuera por una promoción? ¿Por qué?»

## Actividad extendida — 30 a 45 min

Divide la clase en equipos. Cada equipo inventa una tarea de soporte y propone cuatro fuentes necesarias, una fuente de ruido y un presupuesto. Otro equipo intenta detectar qué falta o qué sobra. El tutor valida preguntando siempre: «¿qué decisión cambia con este dato?».

## Limitación a declarar

La evaluación de éxito de esta demo es una simulación educativa basada en reglas, no una medición de precisión real de un modelo. Lo real que enseña es la lógica de selección, presupuesto y exclusión de ruido.
