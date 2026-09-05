# M02-L02 — Patrones de Razonamiento

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** elegir cuándo una tarea requiere respuesta directa, razonamiento guiado o descomposición, sin usar razonamiento largo donde no aporta valor.

## Idea central

> No todas las tareas necesitan que el modelo razone paso a paso. El patrón depende de complejidad, riesgo, costo y latencia.

## Timeline

| Tiempo | Tema | Actividad |
|---|---|---|
| 17:00–17:15 | Apertura | Comparar respuesta rápida y análisis verificable. |
| 17:15–17:40 | Structured Problem Solving | Descomponer antes de concluir. |
| 17:40–18:00 | Ejercicio 1 | Revisar un caso con pasos de evidencia. |
| 18:00–18:20 | Chain of Thought | Entender su utilidad y sus límites. |
| 18:20–18:30 | Pausa / discusión | Hablar de costo y exposición de razonamiento. |
| 18:30–18:45 | Least-to-Most | Planear una tarea amplia por fases. |
| 18:45–18:55 | Ejercicio 2 | Elegir el patrón correcto. |
| 18:55–19:00 | Cierre | Puente a salidas estructuradas. |

## Structured Problem Solving

Pregunta:

> “¿Confiarían en ‘sí, parece seguro’ como revisión de 500 líneas de código?”

### Conceptos fáciles

- **Petición directa:** pedir conclusión sin exigir evidencia intermedia; rápida, pero puede omitir detalles.
- **Razonamiento guiado:** pedir pasos observables, por ejemplo flujo de datos, validación y riesgo antes de concluir.
- **Verificación:** comprobar la conclusión contra el código o evidencia disponible.

> “No le pedimos una respuesta más larga por gusto: le pedimos una ruta de verificación cuando el problema la necesita.”

### Ejercicio 1 — Auditoría en tres pasos

Muestra un pseudocódigo que recibe `userInput`, lo registra y lo envía a una consulta. En grupos, escriben tres pasos que un asistente debería revisar antes de responder “seguro” o “riesgoso”: fuente de datos, sanitización y efecto de la operación. La discusión trata de evidencia, no de vulnerabilidades avanzadas.

## Chain of Thought: uso responsable

Explica sin sobreprometer:

- Pedir un análisis por etapas puede mejorar tareas de comparación, evaluación o síntesis compleja.
- Produce más texto, costo y latencia.
- No es una garantía de verdad ni una excusa para mostrar razonamiento interno sensible al usuario.

> “Para extraer una fecha no necesitamos un ensayo. Para evaluar una migración técnica, un plan y criterios sí pueden ser útiles.”

## Least-to-Most

- **Descomposición:** convertir una tarea amplia en subtareas manejables.
- **Plan primero:** obtener o definir fases antes de pedir implementación.

Ejemplo: antes de migrar un módulo, identificar componentes, dependencias, pruebas y riesgos; no pedir directamente “migra todo”.

### Ejercicio 2 — Matriz de patrón (10 min)

Clasifiquen estas tareas como directa, Few-Shot, razonamiento guiado o descomposición:

1. Extraer correo y teléfono de un formulario uniforme.
2. Clasificar el tono de diez comentarios.
3. Auditar consecuencias de eliminar una tabla.
4. Planear la migración de un módulo antiguo.

Cada equipo debe justificar con complejidad, costo, latencia y riesgo.

## Cierre

> “Pensar más no es siempre mejor. La ingeniería elige el mínimo patrón que aporta la evidencia necesaria. La siguiente lección hará que el resultado de esos patrones sea consumible por código.”
