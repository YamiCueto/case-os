# M03 · Lección 02 — Ensamblaje y priorización

## Resultado de la sesión

El estudiante puede ordenar bloques de contexto y construir un payload claro dentro de un presupuesto limitado.

**Duración sugerida en vivo:** aproximadamente 2 horas.  
**Pregunta guía:** «Si no todo cabe, ¿qué debe entrar primero?»

## Conceptos para explicar fácil

| Concepto | Explicación para decir | Imagen mental |
| --- | --- | --- |
| Presupuesto de tokens | Es el espacio y costo disponibles para contarle cosas al modelo. | Una maleta de 20 kg. |
| Priorización | Decidir qué pieza entra antes y cuál se queda fuera. | Empacar pasaporte antes que un tercer par de zapatos. |
| Relevancia | ¿Ayuda a resolver esta pregunta? | Política de cancelación para una cancelación. |
| Recencia | ¿Sigue vigente o es lo más reciente? | El último mensaje vale más que uno de hace dos horas. |
| Redundancia | ¿Ya tenemos el mismo dato en otro bloque? | No llevar tres copias del mismo documento. |
| Ensamblaje | Ordenar los bloques con etiquetas claras antes de llamar al LLM. | Un expediente con separadores, no una pila desordenada. |

## Timeline de clase

| Tiempo aproximado | Qué haces | Resultado esperado |
| --- | --- | --- |
| 17:00–17:15 | Repaso y pregunta | Recupera «mínimo útil» con el caso de la factura. |
| 17:15–17:35 | Presupuesto | Usa la analogía de la maleta: no todo cabe aunque sea útil. |
| 17:35–17:55 | Tres filtros | Clasifica bloques por relevancia, recencia y redundancia. |
| 17:55–18:15 | Ejercicio de prioridad | El grupo escoge dos de cinco bloques para una revisión de código. |
| 18:15–18:25 | Pausa | Deja visibles las decisiones de cada equipo. |
| 18:25–18:45 | Ensamblaje | Muestra un payload con etiquetas XML o Markdown. |
| 18:45–19:00 | Reto de orden | Reordenan y justifican un payload final. |

## Ejercicio: solo caben dos bloques

**Tarea:** revisar un cambio de código que falló en producción. Solo hay presupuesto para dos bloques.

| Bloque disponible | Pregunta al grupo |
| --- | --- |
| `git diff` actual | ¿Muestra el cambio que hay que revisar? |
| Error del linter en archivos modificados | ¿Apunta directamente al fallo? |
| Historial de commits completo | ¿Es necesario ahora o es ruido histórico? |
| Guía de estilo general | ¿Aporta más que el diff y el error? |
| Documentación antigua de React | ¿Está vigente y aplica al cambio? |

No impongas una única respuesta sin contexto. Una elección razonable es `git diff` + error del linter. Pide que indiquen qué hipótesis cambiaría si la tarea fuera de estilo y no de fallo.

## Ejemplo de payload legible

```xml
<system_instructions>
Revisa el cambio y señala un riesgo verificable.
</system_instructions>
<application_state>
Archivo modificado: billing.service.ts
</application_state>
<evidence>
Error: null reference en línea 42
</evidence>
<user_input>
¿Qué debo corregir primero?
</user_input>
```

Explica: las etiquetas no son magia; hacen visible la frontera entre instrucciones, datos, evidencia y pregunta. Los datos externos siguen siendo datos, no nuevas instrucciones.

## Preguntas para activar la clase

- «¿Una ventana enorme elimina la necesidad de priorizar?» No: sigue habiendo costo, latencia y ruido.
- «¿Qué puede salir mal al usar una política de hace cinco años?» Puede ser relevante por tema, pero incorrecta por vigencia.
- «Si sobra espacio, ¿metemos todo?» No necesariamente; primero comprobamos si agrega señal.

## Cierre

«Seleccionar y ordenar no basta cuando los bloques esenciales siguen siendo grandes. Ahora toca comprimir sin destruir la información que permite responder.»
