# M01-L02 — Anatomía de la Inferencia

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** entender tokens, ventana de contexto, temperatura y costo como restricciones de ingeniería, no como detalles internos del modelo.

## Idea central

> Un LLM procesa tokens dentro de un presupuesto limitado de contexto y costo. Diseñar una llamada al modelo significa administrar ese presupuesto.

## Ruta en pantalla

| Tiempo | Sección | Meta |
|---|---|---|
| 17:00–17:15 | Apertura | Conectar con L01 y predecir cómo procesa texto un LLM. |
| 17:15–17:40 | Tokens | Comprender fragmentación sin entrar en el algoritmo. |
| 17:40–18:00 | Demo y ejercicio 1 | Explorar palabras, código e identificadores. |
| 18:00–18:20 | Ventana de contexto | Entender límite, relevancia y presupuesto. |
| 18:20–18:30 | Pausa / discusión | Relacionar contexto con casos de trabajo reales. |
| 18:30–18:45 | Temperatura | Elegir variabilidad según la tarea. |
| 18:45–18:55 | Economía de inferencia | Conectar tokens, costo y latencia. |
| 18:55–19:00 | Ejercicio 2 y cierre | Diseñar un presupuesto de contexto simple. |

## 17:00–17:40 — Tokens

Pregunta: “¿Un LLM ve una palabra igual que nosotros vemos una palabra?”

- **Token:** fragmento de texto que el modelo procesa; puede ser palabra, parte de una palabra, puntuación o espacio.
- **Tokenización:** dividir texto en esos fragmentos antes de procesarlo.

> “El modelo no recibe un libro como frases completas; recibe piezas de un rompecabezas estadístico.”

Explica la consecuencia, no el algoritmo: contar letras, manejar palabras raras, código o IDs largos puede comportarse distinto de lo que esperamos. Usa el Token Playground de forma breve o déjalo para la Demo 01.

### Ejercicio 1 — ¿Qué enviarías al modelo? (20 min)

Proyecta tres elementos: un correo breve del cliente, 200 líneas de logs y un UUID repetido varias veces. Pregunta qué información aporta evidencia para diagnosticar un incidente y qué información solo consume contexto. En parejas, que propongan una versión reducida del prompt.

Conclusión:

> “Optimizar tokens no es recortar por recortar: es conservar evidencia útil y retirar ruido.”

## 18:00–18:20 — Ventana de contexto

Pregunta: “¿Qué pasa si queremos enviar un manual entero, el historial de chat y pedir una respuesta extensa?”

- **Ventana de contexto:** cantidad máxima de tokens que un modelo puede considerar en una llamada.
- Incluye texto enviado y respuesta generada.
- Más contexto no equivale automáticamente a mejor respuesta.

> “La ventana de contexto es la mesa de trabajo del modelo: no podemos poner toda la biblioteca encima y esperar que trabaje mejor.”

Mini ejercicio: para responder “¿Cuál es la política de vacaciones?”, compara enviar todo el manual, la política vigente con excepciones, o una política desactualizada. Cierra: seleccionar contexto relevante será un problema de M03 y M04.

## 18:30–18:45 — Temperatura

Pregunta: “¿Necesitamos la misma creatividad para inventar nombres de una campaña que para extraer un JSON?”

- **Temperatura baja:** reduce variación; útil cuando se busca consistencia y formato.
- **Temperatura alta:** permite más variedad; útil para explorar alternativas creativas.

> “La temperatura no convierte un LLM en determinista; ajusta cuánto riesgo de variación aceptamos.”

Actividad: clasificar extracción de campos, lluvia de ideas, resumen contractual y nombres de campaña como tareas de temperatura baja o alta.

## 18:45–18:55 — Economía de la inferencia

- Los tokens de entrada son el contexto que enviamos.
- Los tokens de salida son el texto que el modelo genera paso a paso.
- Más tokens normalmente implican más costo y tiempo de respuesta.

> “Un prompt más largo no es gratis. La meta no es llenar contexto; es enviar el mínimo contexto suficiente.”

No memorices precios ni factores fijos: cambian por proveedor y modelo.

### Ejercicio 2 — Presupuesto de contexto (5 min)

Cada pareja tiene “100 fichas de tokens” para responder una consulta sobre una política interna. Deben repartirlas entre instrucciones, pregunta del usuario, contexto recuperado y respuesta. Luego pregunta: “¿Qué sacrificarían primero si el presupuesto baja a la mitad?”

## Preguntas de salida

1. ¿Qué es un token?
2. ¿Qué incluye la ventana de contexto?
3. ¿Cuándo usarías temperatura baja?
4. ¿Por qué seleccionar contexto es una decisión de ingeniería?
