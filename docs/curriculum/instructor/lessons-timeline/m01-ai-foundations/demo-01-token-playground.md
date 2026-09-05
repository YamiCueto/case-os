# M01-D01 — Token Playground

## Guía de tutor para la demo

**Duración sugerida en vivo:** aproximadamente 2 horas si se desarrolla como clase-taller  
**Objetivo:** hacer visible que el modelo recibe fragmentos de texto y que la forma de escribir afecta tokens, contexto y costo.

## Importante antes de empezar

La pantalla es una **simulación didáctica**, no un tokenizador oficial de un proveedor. Sirve para observar fragmentación y comparar entradas; no uses su conteo ni su costo como cifra de facturación real.

## Timeline de clase-taller

| Tiempo | Actividad |
|---|---|
| 17:00–17:15 | Introducción: por qué tokens no son palabras. |
| 17:15–17:35 | Recorrido guiado por el simulador. |
| 17:35–18:00 | Experimentos en parejas: texto natural, código e IDs. |
| 18:00–18:15 | Discusión: contexto útil frente a ruido. |
| 18:15–18:25 | Pausa. |
| 18:25–18:45 | Ejercicio: reducir un prompt técnico. |
| 18:45–18:55 | Puesta en común y conexión con costo/latencia. |
| 18:55–19:00 | Preguntas de salida. |

## Recorrido en pantalla

| Paso | Acción | Pregunta para el grupo | Idea a cerrar |
|---|---|---|---|
| 1 | Muestra el texto inicial | “¿Cuántas palabras creen que verá el modelo?” | El modelo no procesa necesariamente palabras completas. |
| 2 | Cambia una palabra común por una rara | “¿Qué cambió en los fragmentos?” | Palabras, código e identificadores pueden fragmentarse distinto. |
| 3 | Escribe un identificador técnico | “¿Qué pasa con nombres largos, UUIDs o logs?” | Pueden consumir mucho contexto sin aportar significado proporcional. |
| 4 | Compara frases equivalentes | “¿Qué decisión de ingeniería podría cambiar?” | El idioma y la redacción influyen en contexto, costo y latencia. |

## Guion de ejecución

### Caso 1 — Texto natural

Conserva o escribe:

```text
La ingeniería de software aplicada a la Inteligencia Artificial.
```

Di:

> “A la derecha no estamos viendo cómo un humano separa palabras; estamos viendo una representación simplificada de las piezas que el modelo recibe.”

### Caso 2 — Texto técnico

Prueba:

```text
CalculateTotalRevenueForCustoomer()
```

Pregunta:

> “¿Por qué un identificador raro o con un error tipográfico puede ser costoso para el contexto?”

Conclusión:

> “El modelo no inspecciona letras con la precisión de un compilador. Procesa piezas estadísticas; por eso los strings exactos, hashes y código extenso requieren cuidado.”

### Caso 3 — Cambiar signos y espacios

Agrega puntuación, saltos de línea o una versión en español e inglés. No prometas que siempre un idioma consume exactamente más tokens: depende del tokenizador y del texto.

> “La lección no es memorizar una equivalencia de tokens. La lección es medir cuando el costo, la latencia o el límite de contexto importan.”

## Preguntas de salida

1. ¿Por qué un UUID o un log largo puede ser problemático en un prompt?
2. ¿Por qué no debemos calcular costos reales con este simulador?
3. ¿Qué información eliminarías antes de enviar un incidente al modelo?

## Ejercicio principal — Prompt con presupuesto (20 min)

Entrega o proyecta este prompt lleno de ruido: un objetivo de una línea, varios saludos repetidos, un log de cientos de líneas y IDs que no aportan diagnóstico. Cada pareja debe dejar una versión de máximo cinco líneas que conserve objetivo, evidencia relevante, restricción de salida y criterio de falta de información.

Puesta en común: cada pareja explica qué eliminó y qué riesgo habría si hubiera eliminado demasiado. La meta no es lograr el prompt “más corto”, sino el contexto mínimo suficiente.
