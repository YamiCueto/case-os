# M04 · Demo 04 — Construir la recuperación

**Duración sugerida en vivo:** 25–35 minutos como demo, o hasta 2 horas con discusión y ejercicio.
**Objetivo:** mostrar cómo Top-K afecta los candidatos recuperados y el equilibrio entre precisión y cobertura.

## Guion

1. Declara que la demo usa datos y resultados simulados para enseñar la lógica de recuperación.
2. Ejecuta el escenario con Top-K bajo y pregunta: «¿Qué evidencia útil podríamos estar dejando fuera?»
3. Aumenta Top-K y pregunta: «¿Qué candidatos adicionales ahora requieren filtrado?»
4. Cierra: recuperar más no significa responder mejor si el contexto termina lleno de ruido.

## Qué observar

La similitud cosenoidal ordena candidatos por cercanía de significado. No es una garantía de relevancia, actualidad o permiso de acceso; esas reglas se aplican después de recuperar.

## Mini actividad

En parejas, elijan un Top-K para una base ficticia de políticas internas y escriban una razón técnica y una razón pedagógica para su elección.
