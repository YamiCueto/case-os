# M03 · Lección 01 — Anatomía del contexto

## Resultado de la sesión

El estudiante diferencia **contexto disponible** de **contexto útil** y puede escoger las piezas mínimas para una tarea concreta.

**Duración sugerida en vivo:** aproximadamente 2 horas.  
**Pregunta guía:** «Si el modelo no puede ver mi aplicación, ¿qué necesita saber para ayudarme?"

## Conceptos para explicar en pantalla

| Concepto | Forma fácil de decirlo | Ejemplo |
| --- | --- | --- |
| LLM sin estado | Cada llamada empieza sin saber qué ocurrió antes; el sistema debe volver a contarle lo importante. | Para responder sobre una factura, necesita saber cuál factura se está viendo. |
| Fuente de contexto | Lugar de donde el sistema puede sacar información. | Perfil del usuario, pantalla actual, historial o resultado de una búsqueda. |
| Contexto disponible | Todo lo que el backend podría enviar. | Los 50 mensajes del chat y todo el perfil de compras. |
| Contexto mínimo útil | Lo indispensable para resolver esta pregunta sin ruido. | ID, estado y fecha de entrega del pedido consultado. |

Presenta las seis fuentes de la app como un mapa, no como una lista para memorizar: contexto estático, usuario, estado de aplicación, recuperado, herramientas e historial de conversación.

## Timeline de clase

| Tiempo aproximado | Qué haces | Qué debe ocurrir |
| --- | --- | --- |
| 17:00–17:10 | Apertura | Pregunta: «¿Qué sabe realmente un asistente sobre la pantalla que estoy mirando?» |
| 17:10–17:30 | Concepto técnico breve | Explica que el LLM no adivina estado; el backend lo prepara e inyecta. |
| 17:30–17:50 | Ejemplo guiado | Caso: «¿Puedo cancelar esta factura?». Separa datos necesarios de datos accesorios. |
| 17:50–18:10 | Actividad 1 | Equipos clasifican seis tarjetas en necesario, opcional o ruido. |
| 18:10–18:20 | Pausa | Recupera una conclusión de cada equipo al volver. |
| 18:20–18:45 | Fuentes de contexto | Mapea las seis fuentes al caso de una factura o pedido. |
| 18:45–19:00 | Ejercicio y cierre | Cada equipo define un contexto mínimo útil y justifica una exclusión. |

## Ejemplo para conducir

**Pregunta del usuario:** «¿Puedo cancelar esta?»  
**Pantalla:** factura #552 pendiente.

Pregunta al grupo qué enviarían. Llévalos a esta respuesta:

```text
Necesario: ID y permisos del usuario, factura #552, estado actual,
últimos dos mensajes y política de cancelación aplicable.

No necesario: 50 mensajes antiguos, campañas de marketing y el historial
completo de compras.
```

La frase que conviene repetir: «Que un dato hable del mismo tema no significa que sea necesario para tomar esta decisión».

## Actividad: semáforo de contexto — 20 min

Muestra estas tarjetas y pide que levanten una mano o voten en chat:

1. Rol y permisos del usuario.
2. Factura actual y su estado.
3. Últimos dos mensajes sobre la cancelación.
4. Política de cancelación.
5. 50 mensajes previos.
6. Promoción comercial vigente.

Clasificación esperada: 1–4 verdes; 5 y 6 rojas. Si alguien considera una tarjeta amarilla, pídele que defina **qué decisión concreta** cambia con ella.

## Errores que debes corregir

- «El modelo tiene memoria»: aclara que conserva solamente lo incluido en la interacción o lo que el sistema persista y reinyecte.
- «Todo lo relacionado sirve»: vuelve a la pregunta de la tarea puntual.
- «RAG arregla el contexto»: RAG recupera candidatos; aquí decidimos qué entra y cómo se presenta.

## Cierre

«Ya sabemos identificar lo útil. En la siguiente sesión veremos qué hacer cuando varias piezas útiles compiten por un espacio limitado.»
