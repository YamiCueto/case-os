# M02-L03 — Salidas Estructuradas

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** que el estudiante distinga texto útil para humanos de datos válidos para software y diseñe la capa de validación necesaria.

## Idea central

> JSON válido no significa información verdadera, y una instrucción que pide JSON no reemplaza un esquema ni un validador en el backend.

## Timeline

| Tiempo | Tema | Actividad |
|---|---|---|
| 17:00–17:15 | Apertura | Mostrar por qué un saludo puede romper un pipeline. |
| 17:15–17:40 | Lenguaje natural a código | Recorrer el pipeline de integración. |
| 17:40–18:00 | Ejercicio 1 | Diseñar un schema de ticket. |
| 18:00–18:20 | JSON y schemas | Separar sintaxis, tipos y reglas de negocio. |
| 18:20–18:30 | Pausa / preguntas | Revisar diferencias entre validar y verificar. |
| 18:30–18:45 | Manejo de fallos | Diseñar respuesta ante error. |
| 18:45–18:55 | Ejercicio 2 | Detectar JSON válido pero inaceptable. |
| 18:55–19:00 | Cierre | Preparar Lab 02. |

## 17:00–17:40 — Lenguaje natural a código

Proyecta este caso:

```text
Aquí tienes el JSON solicitado:
{"status":"success"}
```

Pregunta: “¿Es útil para una persona? ¿`JSON.parse()` puede procesar toda esta respuesta?”

### Conceptos fáciles

- **Salida estructurada:** datos con forma acordada, para que el software pueda procesarlos.
- **Schema:** contrato de campos, tipos y valores permitidos.
- **Validación:** código que acepta o rechaza la salida antes de usarla.

> “El modelo propone un objeto; el backend decide si el objeto cumple el contrato y si puede ejecutar la siguiente acción.”

### Ejercicio 1 — Schema de ticket (20 min)

En parejas, diseñen el schema de un clasificador de tickets. Debe incluir severidad permitida, si es bug, componente afectado y resumen. Pregunta: “¿Qué campo puede ser `null`? ¿Qué valores no deberían ser posibles?”

No conviertas la actividad en TypeScript avanzado: importa que las restricciones sean claras y comprobables.

## 18:00–18:20 — JSON y schema

Explica tres niveles:

1. **Texto parseable:** parece o puede convertirse en JSON.
2. **Estructura válida:** tiene campos y tipos correctos.
3. **Decisión válida:** contiene información suficiente y autorizada para el negocio.

> “Un JSON con `{"severity":"HIGH"}` puede ser perfectamente válido y aun así estar equivocado sobre el ticket.”

## 18:30–18:45 — Manejo de fallos

Pregunta: “¿Qué debe hacer el backend si recibe Markdown, un campo ausente o una severidad no permitida?”

Busca: rechazar, registrar, pedir corrección o enviar a revisión humana. Nunca pasar el resultado directo a una base de datos o una acción crítica.

### Ejercicio 2 — Válido pero inaceptable (10 min)

Proyecta tres respuestas:

1. Texto con un bloque ```json.
2. JSON sin el campo `severity`.
3. JSON completo que acusa una vulnerabilidad sin evidencia.

Pide que indiquen qué capa falla: parseo, schema o verificación de negocio/evidencia.

## Cierre

> “El formato es una frontera técnica; no es una garantía de verdad. El laboratorio final une contrato, ejemplos, pruebas de resistencia y validación.”
