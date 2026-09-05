# M02-D02 — Diseñar la Instrucción

## Guía de tutor para la demo

**Duración sugerida en vivo:** aproximadamente 2 horas como clase-taller  
**Objetivo:** demostrar que una respuesta correcta para una persona puede ser inválida para el software que intenta consumirla.

## Transparencia pedagógica

La generación del LLM en esta demo es una **simulación educativa local**. El validador de JSON y schema es real y determinista. Preséntalo así para no confundir simulación con una llamada real a un modelo.

## Timeline

| Tiempo | Actividad |
|---|---|
| 17:00–17:15 | Contexto: aplicación, LLM y validador. |
| 17:15–17:35 | Experimento 1: instrucción conversacional. |
| 17:35–17:55 | Discusión y ejercicio: salida humana vs salida de sistema. |
| 17:55–18:15 | Experimento 2: pedir JSON no basta. |
| 18:15–18:25 | Pausa. |
| 18:25–18:45 | Experimento 3: restricciones y schema. |
| 18:45–18:55 | Ejercicio: modificar el contrato y predecir el fallo. |
| 18:55–19:00 | Cierre y puente al laboratorio. |

## Experimento 1 — Instrucción simple

Ejecuta sin modificar:

```text
Analiza el siguiente código y dime qué está mal.
```

Pregunta antes de ejecutar:

> “¿Qué tipo de respuesta esperarían ustedes como humanos?”

Al aparecer el texto libre y el fallo de `JSON.parse()`, di:

> “El análisis puede ser útil para nosotros, pero el backend esperaba una estructura. El fallo es de integración, no de cortesía.”

### Ejercicio breve

Pide dos columnas en el chat: “aceptable para humano” y “aceptable para programa”. Incluyan un saludo, Markdown, campos de datos y un mensaje de error.

## Experimento 2 — Pedir JSON

Ejecuta:

```text
Analiza el siguiente código y devuelve el resultado como JSON.
```

Pregunta:

> “¿Qué falta si el JSON tiene otras claves, texto extra o valores que el backend no contempla?”

Conclusión:

> “JSON válido no equivale a contrato válido. El consumidor necesita nombres de campos, tipos y valores permitidos.”

## Experimento 3 — Contrato completo

Resalta las tres partes visibles:

1. Solo JSON, sin Markdown ni explicaciones.
2. Schema exacto: `status`, `severity`, `issue`.
3. Valores permitidos para severidad.

Después de la validación correcta, pregunta:

> “¿El schema probó que el problema reportado por el modelo es verdadero?”

Respuesta: no; probó estructura, no veracidad factual.

## Ejercicio final — Romper el contrato

En grupos, cambien mentalmente una condición: eliminar el schema, permitir Markdown o cambiar `severity` por texto libre. Cada grupo predice si falla parseo, schema o lógica de negocio y por qué.

## Cierre

> “La meta no es obtener una respuesta inteligente a cualquier precio. Es obtener una salida que el software pueda validar, aceptar o rechazar de forma segura.”
