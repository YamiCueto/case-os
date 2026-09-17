# Timeline Pedagógico · M05 Lab 05 — Agent Engineering Capstone

## Estructura Temporal de la Sesión (60–90 min)

Este Laboratorio Capstone integra las capacidades desarrolladas a lo largo de L01–L07:
- **Fundamento**: L01 Decision / Least Autonomy Necessary.
- **Evolución**: Agent v1 (Tools) &rarr; v2 (Loop) &rarr; v3 (State) &rarr; v4 (Plan) &rarr; v5 (Guardrails & HITL) &rarr; v6 (Observability & Eval).
- **Desafío**: Construir un **Incident Response Agent** ejecutado sobre un entorno simulado determinista y reproducible para resolver incidentes en servicios internos (`payments-api`, `auth-api`, `orders-api`).

---

### Distribución Recomendada de la Sesión (75 min)

| Intervalo | Bloque Temático | Dinámica / Actividades | Hito Clave |
|---|---|---|---|
| **00–10 min** | **Encuadre del Capstone y el Dominio** | Presentar el escenario de soporte a incidentes. Recordar que no hay Agent v7 ni L08: el reto es integración de ingeniería. | Los estudiantes entienden que la propuesta del modelo es intención, no autoridad. |
| **10–25 min** | **Arquitectura y Contratos (TODO 1, 2, 4)** | Revisión de `AgentState`, generación de plan adaptativo y el Policy Gate: READ &rarr; ALLOW, WRITE &rarr; REQUIRE_APPROVAL, PRIVILEGED &rarr; BLOCK. | Claridad sobre por qué `restart_service` jamás debe ejecutarse. |
| **25–45 min** | **Implementación del Loop & HITL (TODO 3, 5, 6)** | Programación del bucle `while` con límite `MAX_ITERATIONS=6`, compuerta HITL con revalidación causal y emisor de trazas con `sequence_no` monotónico. | Secuencia causal estricta de 5 pasos verificable en código. |
| **45–65 min** | **Ejecución del Benchmark C1–C5** | Correr la suite de evaluación sobre los 5 escenarios. Validación de casos borde y detección deliberada de regresiones en C5. | Los estudiantes obtienen `CAPSTONE BENCHMARK RESULT: PASS` en consola. |
| **65–75 min** | **Auditoría Docente y Cierre del Módulo** | Auditoría rápida de aserciones: cero llamadas a `restart_service`, cero escritura sin HITL, sanitización de datos. Transición hacia M06 (Agentic SWE). | Cierre formal del Módulo 05. |

---

## Puntos Críticos de Auditoría Docente

1. **¿El estudiante permitió que `restart_service` se ejecutara ante la instrucción adversarial C4?**
   - *Intervención*: Demostrar que un prompt agresivo del usuario no altera la matriz de permisos de la infraestructura. La herramienta debe emitir `BLOCK` incondicionalmente.
2. **¿La compuerta HITL omite la revalidación post-aprobación?**
   - *Intervención*: Preguntar: *"Si el operador tardó 10 minutos en aprobar y mientras tanto el incidente ya fue resuelto por otro ingeniero, ¿debe el agente crear un ticket duplicado?"*
3. **¿El agente entra en bucle infinito ante servicios caídos?**
   - *Intervención*: Verificar que `state.iteration >= self.max_iterations` interrumpe el bucle y establece `status="failed"` con `stop_reason="max_iterations_exceeded"`.
4. **¿Se censuran las claves de autenticación en las trazas?**
   - *Intervención*: Inspeccionar `InMemoryTraceCollector._sanitize()` y comprobar que claves como `token` o `secret` son reemplazadas por `***REDACTED***` antes de agregarse a `self.events`.
