# M01-L03 — Modelos vs Sistemas

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** que el grupo vea al LLM como un componente de una arquitectura, no como una aplicación autosuficiente ni una base de datos.

## Idea central

> El modelo genera e infiere; el sistema aporta datos actuales, permisos, herramientas, validación y control de acciones críticas.

## Ruta en pantalla

| Tiempo | Sección | Meta |
|---|---|---|
| 17:00–17:15 | Apertura | Recuperar los pilares de M01. |
| 17:15–17:40 | Modelos vs Sistemas | Diferenciar capacidad y responsabilidad. |
| 17:40–18:00 | Ejercicio 1 | Diseñar componentes de un asistente. |
| 18:00–18:20 | Alucinaciones | Entender plausibilidad frente a evidencia. |
| 18:20–18:30 | Pausa / preguntas | Conectar el riesgo con sistemas reales. |
| 18:30–18:50 | Ejercicio 2 | Diseñar defensas antes de una acción crítica. |
| 18:50–19:00 | Preparación práctica y cierre | Conectar con Demo 01 y Lab 01. |

## 17:00–17:40 — Modelo vs sistema

Pregunta: “Si conectamos un LLM a una aplicación, ¿ya construimos un sistema de IA confiable?”

- **Modelo:** componente que recibe contexto y genera una salida.
- **Sistema:** modelo más interfaz, datos, permisos, reglas, herramientas y validaciones.

> “El LLM es el motor; el sistema es el automóvil completo: frenos, volante, tablero y cinturones de seguridad.”

Usa las dos columnas de CASE Academy. Pregunta qué capacidad necesita un asistente de soporte que el modelo por sí solo no puede garantizar: datos actuales, permisos, consulta de pedidos, validación o auditoría.

> “El LLM puede proponer una acción o clasificar una intención. El código determinista decide si puede ejecutarla.”

### Ejercicio 1 — Arquitectura con tarjetas (20 min)

En equipos, diseñen un asistente de soporte de pedidos usando cinco tarjetas: usuario, LLM, base de datos, servicio de pagos y validador. Deben dibujar flechas y responder: “¿Qué componente puede leer datos?”, “¿qué componente puede cobrar?” y “¿dónde se valida el permiso?”.

## 18:00–18:20 — Alucinaciones

Pregunta: “Si el modelo no recibió la API privada de la empresa, ¿cómo puede responder sobre ella?”

- **Alucinación:** salida plausible que no está respaldada por evidencia real.
- El modelo completa un patrón cuando le falta información; no consulta automáticamente la verdad.
- El sistema debe proporcionar evidencia y validar la salida.

Ejemplo: `InternalApi.connect()` puede sonar como una API real, pero no existir en el proyecto.

Defensas para mostrar en pantalla:

1. Dar contexto verificado.
2. Pedir evidencia o citas cuando corresponda.
3. Definir qué hacer si falta información.
4. Validar formatos y reglas con código.

> “Una temperatura baja ayuda a la consistencia; no convierte una afirmación no verificada en verdadera.”

## 18:30–18:50 — Ejercicio de arquitectura

Plantea un asistente de atención al cliente. Pide tres respuestas:

- Componentes deterministas: permisos, estado de pedido, envío de dinero.
- Tarea probabilística: resumir el caso o clasificar el tono.
- Validación antes de actuar: reglas, esquema, permisos o confirmación humana.

### Cierre listo para decir

> “No diseñamos un oráculo. Diseñamos un sistema que aprovecha la interpretación del LLM y conserva el control determinista sobre los datos y las acciones.”

### Ejercicio 2 — Antes de ejecutar (20 min)

Presenta este caso: “El LLM propone devolver un pago porque interpreta un correo como fraude”. Cada equipo debe definir cuatro defensas antes de que ocurra una acción: evidencia necesaria, reglas deterministas, permisos y punto de revisión humana. Comparen las respuestas y pregunta cuál defensa evita el daño si el modelo se equivoca.

## Puente a M02

> “Si el modelo es probabilístico, necesitamos contratos e instrucciones claras para integrarlo de forma confiable. Ese será el problema del siguiente módulo: Prompt Engineering.”
