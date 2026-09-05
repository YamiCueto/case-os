# M03 · Lección 03 — Compresión y validación

## Resultado de la sesión

El estudiante comprende que comprimir es conservar la señal útil, no cortar texto a ciegas, y sabe verificar que el contexto final sigue siendo apto para la tarea.

**Duración sugerida en vivo:** aproximadamente 2 horas.  
**Pregunta guía:** «¿Cómo reducimos información sin quitar el dato que determina la respuesta?»

## Conceptos para explicar en pantalla

| Concepto | Explicación sencilla | Ejemplo |
| --- | --- | --- |
| Compresión | Quitar estructura y ruido, conservando los hechos necesarios. | Convertir HTML de una ficha de cliente a nombre, ID y estado. |
| Truncamiento ciego | Cortar por caracteres sin entender la estructura. Es frágil. | Partir un JSON o una función por la mitad. |
| Destilación | Transformar datos a una versión más compacta y útil. | Resumir un historial a decisiones, pendientes y fecha. |
| Pérdida de atención | Con mucho texto y ruido, usar uniformemente los detalles se vuelve más difícil. | El dato crítico queda enterrado entre logs repetidos. |
| Validación del contexto | Comprobar presupuesto, formato y datos críticos antes de llamar al LLM. | Verificar que el JSON es válido y que incluye el estado actual. |

Aclara una precisión importante: no digas que el modelo «no lee» el medio de forma absoluta. El problema es que, en contextos largos, la recuperación de detalles puede degradarse según posición, ruido y relevancia.

## Timeline de clase

| Tiempo aproximado | Qué haces | Resultado esperado |
| --- | --- | --- |
| 17:00–17:15 | Recuperación de L02 | El grupo prioriza antes de pensar en reducir. |
| 17:15–17:35 | Compresión vs. corte | Compara un JSON roto con uno reducido de forma segura. |
| 17:35–17:55 | Ejemplos | Elimina campos vacíos, HTML, repetición y comentarios irrelevantes. |
| 17:55–18:15 | Ejercicio de destilación | Equipos convierten un registro ruidoso en un resumen operativo. |
| 18:15–18:25 | Pausa | Revisa qué campos preservó cada equipo. |
| 18:25–18:45 | Validación | Verifica límite, formato y datos indispensables. |
| 18:45–19:00 | Puente a demo/lab | Explica qué observarán y qué artefacto producirán. |

## Ejemplo rápido

**Antes — mucha estructura, poca señal:**

```html
<div class="card"><span>Nombre:</span><strong>Juan Pérez</strong>
<!-- correo vigente --><span>juan@empresa.com</span></div>
```

**Después — mismo hecho esencial:**

```json
{ "cliente": "Juan Pérez", "email": "juan@empresa.com" }
```

Pregunta: «¿Qué tarea podría romperse con esta compresión?». Respuesta esperada: una tarea que dependa de la estructura visual, campos omitidos o relaciones no preservadas.

## Actividad: destila el incidente — 20 min

Entrega este material ficticio:

```text
INFO: usuario inició sesión
INFO: campaña de septiembre activa
ERROR 04:13: conexión a base de datos perdida
INFO: mensaje repetido de estado
ERROR 04:14: reintento falló
CHAT: ¿alguien vio el partido?
```

Pide una versión de máximo tres líneas para un reporte ejecutivo. Debe conservar hora, sistema afectado y estado del reintento; debe excluir promociones, conversación y repetición. Luego pregunta qué información faltaría para afirmar una causa raíz: no deben inventarla.

## Checklist antes de enviar contexto

- [ ] ¿Está dentro del presupuesto definido?
- [ ] ¿Conserva los datos que determinan la tarea?
- [ ] ¿El formato sigue completo y parseable?
- [ ] ¿Se quitaron duplicados, campos vacíos y estructura irrelevante?
- [ ] ¿La compresión eliminó algún dato que la respuesta necesita?

## Cierre

«El contexto bien diseñado crea mejores condiciones, no una garantía. Ahora usaremos la demo para seleccionar el conjunto mínimo útil y el laboratorio para convertir ese razonamiento en un Context Manifest.»
