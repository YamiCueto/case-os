# M03 · Laboratorio 03 — Construir el contexto mínimo útil

## Misión del laboratorio

Los estudiantes no redactan un prompt nuevo. Diseñan un **Context Manifest**: una especificación de qué datos debe reunir un backend, en qué prioridad, cómo los comprime y cómo verifica que aún sirven para la tarea.

**Duración sugerida en vivo:** aproximadamente 2 horas.  
**Entregable:** `context-manifest.md` o `context-manifest.json` para un caso real autorizado o un caso ficticio.

## Límite de seguridad

Usen solamente datos ficticios, públicos o aprobados por la organización. No se deben subir secretos, PII, credenciales ni código propietario a herramientas de IA no autorizadas. El laboratorio es de diseño; puede completarse sin enviar nada a un LLM.

## Timeline de clase

| Tiempo aproximado | Actividad | Evidencia |
| --- | --- | --- |
| 17:00–17:15 | Presenta la misión | Diferencian prompt de Context Manifest. |
| 17:15–17:30 | Escogen tarea | Una tarea concreta y acotada. |
| 17:30–17:55 | Identifican contexto | Lista de 3–5 fuentes necesarias y exclusiones. |
| 17:55–18:15 | Priorizan y comprimen | Prioridad, presupuesto y regla de transformación. |
| 18:15–18:25 | Pausa | Revisión rápida de un manifiesto voluntario. |
| 18:25–18:45 | Ensamblaje y prueba mental | Definen forma del payload e hipótesis. |
| 18:45–19:00 | Intercambio y cierre | Un compañero hace de truncador y detecta brechas. |

## Caso sugerido si no usan un proyecto propio

**Tarea:** responder si se puede cancelar una factura pendiente.  
**El sistema debe poder:** decidir según permisos, estado de la factura y política vigente; si falta un dato, debe indicarlo en vez de inventar.

## Plantilla mínima

```yaml
task: "Decidir si una factura puede cancelarse"
budget: "100 unidades"

required_context:
  - priority: 1
    source: "Estado de factura actual"
    why: "Indica si aún puede cancelarse"
    compression: "id, estado, fecha de emisión"
  - priority: 2
    source: "Rol y permisos del usuario"
    why: "Determina autorización"
    compression: "rol y permiso de cancelación"
  - priority: 3
    source: "Política vigente"
    why: "Define la regla aplicable"
    compression: "solo sección de cancelación"

excluded_context:
  - "Promociones comerciales: no cambian la decisión"
  - "Historial completo: se usará solo el mensaje reciente si aporta intención"

assembly: "Etiquetas separadas para estado, política y pregunta"
hypothesis: "Con estos datos el modelo puede decidir o pedir el dato faltante"
validation: "Verificar campos obligatorios y presupuesto antes de enviar"
context_gaps: []
```

## Pasos para guiar a los equipos

1. **Definir la tarea.** No aceptes «ayudar con el proyecto»; pide una acción verificable.
2. **Elegir de tres a cinco fuentes.** Por cada una deben responder: «¿qué decisión cambiaría si falta?».
3. **Excluir explícitamente.** Una buena exclusión demuestra que entendieron el ruido.
4. **Asignar prioridad.** ¿Qué se elimina primero cuando no hay espacio?
5. **Definir compresión.** Debe ser una transformación concreta, no «resumir todo».
6. **Escribir hipótesis y validación.** ¿Qué debería poder hacer el sistema y cómo comprobarían que el contexto era suficiente?

## Dinámica de revisión por pares — 20 min

Intercambian manifiestos. La persona revisora elimina prioridades bajas una por una y pregunta:

- «¿Todavía se puede responder con seguridad?»
- «¿Qué dato falta para no inventar?»
- «¿Cuál de tus fuentes es solo “interesante”, pero no necesaria?»

El autor registra la respuesta como un `context_gap` o ajusta prioridad/compresión. Esto enseña que la iteración correcta es mejorar el contexto, no llenar el prompt de reglas nuevas.

## Checklist de entrega

- [ ] La tarea es concreta y tiene alcance.
- [ ] Hay de 3 a 5 piezas necesarias con justificación.
- [ ] Se documentó al menos una exclusión y una regla de compresión.
- [ ] Existe una prioridad y una decisión ante falta de presupuesto.
- [ ] La hipótesis no promete certeza mágica del LLM.
- [ ] Se indica cómo detectar una brecha de contexto.

## Cierre hacia M04

«Hoy decidimos manualmente qué contexto necesitamos. Cuando haya miles de documentos, la siguiente dificultad será encontrar candidatos adecuados de forma automática. Ese es el problema de Retrieval y RAG.»
