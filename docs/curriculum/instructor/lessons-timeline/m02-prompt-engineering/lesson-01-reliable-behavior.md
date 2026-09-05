# M02-L01 — Comportamiento Confiable

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** que los estudiantes pasen de pedir respuestas en conversación a diseñar contratos que el software pueda verificar y consumir.

## Idea central

> Un prompt no es una pregunta bonita: es un contrato que reduce ambigüedad para que el sistema pueda aceptar o rechazar la salida del modelo.

## Timeline

| Tiempo | Tema | Actividad |
|---|---|---|
| 17:00–17:15 | Apertura | Contrastar conversación y contrato. |
| 17:15–17:40 | Mito del prompt perfecto | Explicar comportamiento reproducible. |
| 17:40–18:00 | Ejercicio 1 | Convertir una solicitud vaga en criterios comprobables. |
| 18:00–18:20 | Zero-Shot y Few-Shot | Comparar instrucción sola con ejemplos. |
| 18:20–18:30 | Pausa / preguntas | Conectar ejemplos con costo y mantenimiento. |
| 18:30–18:45 | Restricciones negativas | Proteger el consumidor de la salida. |
| 18:45–18:55 | Ejercicio 2 | Diseñar un mini contrato. |
| 18:55–19:00 | Cierre | Preparar Demo 02. |

## 17:00–17:40 — Mito del prompt perfecto

Pregunta de apertura:

> “Si le decimos al LLM exactamente qué hacer, ¿se vuelve una función determinista?”

### Conceptos fáciles

- **Prompt perfecto:** mito; no hay palabras mágicas que eliminen la variación de un modelo probabilístico.
- **Comportamiento reproducible:** una salida puede variar, pero debe mantenerse dentro de límites aceptables para el caso de uso.
- **Contrato:** define entrada, tarea, restricciones, salida y qué hacer cuando algo falla.

Forma corta de decirlo:

> “No controlamos todos los pensamientos del modelo. Controlamos las barandas que determinan qué salidas puede aceptar nuestro sistema.”

Proyecta la comparación de CASE Academy y pregunta: “¿Quién decide si la respuesta puede llegar a la base de datos: el LLM o el backend?”

### Ejercicio 1 — De vago a comprobable (20 min)

Entrega esta instrucción:

```text
Analiza este ticket y dame un resumen corto.
```

En parejas, deben reemplazar “analiza” y “corto” por reglas comprobables: campos requeridos, número máximo de puntos, categorías permitidas, formato y respuesta si falta información. Comparte dos soluciones y pregunta: “¿Podría una prueba automática decidir si se cumplió?”

## 18:00–18:20 — Zero-Shot y Few-Shot

- **Zero-Shot:** instrucción sin ejemplos; útil para tareas simples, más frágil cuando el formato importa.
- **Few-Shot:** incluye ejemplos de entrada y salida; enseña el patrón deseado.

> “En vez de describir durante diez líneas cómo debe verse la salida, a veces mostramos dos ejemplos correctos y un caso límite.”

No digas que más ejemplos siempre mejora: ejemplos contradictorios, largos o malos también consumen contexto y desalinean el comportamiento.

Actividad corta: usa una clasificación de severidad. Pide un ejemplo válido y un ejemplo donde no haya evidencia suficiente. Ambos deben mostrar exactamente el mismo formato de salida.

## 18:30–18:45 — Restricciones negativas

Pregunta: “¿Qué rompe más fácilmente un `JSON.parse()`?”

- “Aquí tienes tu respuesta:” antes del JSON.
- Markdown con bloques de código.
- Campos inesperados o valores fuera de un conjunto permitido.

> “Decir qué no debe hacer es tan importante como decir la tarea. Pero la restricción reduce riesgos; la validación externa es la que decide.”

## Ejercicio 2 — Mini contrato (10 min)

Para clasificar un correo, cada pareja escribe cinco partes:

1. Tarea.
2. Entrada delimitada con `<email>...</email>`.
3. Restricciones: sin Markdown ni explicación.
4. Salida: `{"category":"BILLING|SUPPORT|OTHER"}`.
5. Fallback: `{"category":"OTHER"}` si no hay evidencia.

## Cierre

> “Un contrato no vuelve verdadera una respuesta, pero evita que una salida inesperada rompa silenciosamente el sistema. En la Demo 02 veremos esta diferencia con un validador real.”
