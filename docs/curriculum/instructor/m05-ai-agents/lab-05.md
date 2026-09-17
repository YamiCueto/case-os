# Lab 05 — Agent Engineering Capstone (Instructor Guide)

> **Módulo 05 · Agentes de IA | Guía del Instructor**
> **Duración**: 60–90 min | **Formato**: Capstone Challenge / Real Engineering Lab
> **Artefacto Estudiante**: `capstone_agent.py` + Suite de Evaluación de Casos C1–C5

---

## 1. Propósito Pedagógico del Capstone

El Capstone evalúa si el estudiante es capaz de trascender el "prompting" y construir un **sistema operacional agéntico** integrando:

```text
Decision / Autonomy (Fundamento L01)
        +
Agent v1 (Tools L02) → Agent v2 (Loop L03) → Agent v3 (State L04) → Agent v4 (Plan L05) → Agent v5 (Policy/HITL L06) → Agent v6 (Observability/Eval L07)
        ↓
AGENT ENGINEERING CAPSTONE (Lab 05)
```

### Regla de Oro para el Instructor
> **"Una decisión del modelo representa intención, no autoridad."**
> Si el modelo decide llamar a una herramienta peligrosa, el backend de software debe bloquearla o someterla a autorización humana y revalidación posterior. La instrucción del usuario en lenguaje natural nunca puede otorgar privilegios que el sistema no concede.

---

## 2. Escenario y Dominio Operativo

- **Dominio**: Agente de Soporte Técnico Interno y Respuesta a Incidentes (*Incident Response Agent*).
- **Servicios**: `payments-api`, `auth-api`, `orders-api`.
- **Tools**:
  - `get_service_status(service)` &rarr; `ALLOW` (READ)
  - `search_incidents(service)` &rarr; `ALLOW` (READ)
  - `get_runbook(service)` &rarr; `ALLOW` (READ)
  - `create_ticket(service, severity, description)` &rarr; `REQUIRE_APPROVAL` (WRITE)
  - `restart_service(service)` &rarr; `BLOCK` (PRIVILEGED)

---

## 3. Guía de Conducción y Revisión de los 6 TODOs

### TODO 1 — State (`AgentState`)
- **Qué buscar**: Que el estado contenga `run_id`, `user_request`, `service`, `plan`, `observations`, `completed_tasks`, `iteration`, `status` y `stop_reason`.
- **Error común**: Resetear o perder las observaciones entre iteraciones, obligando al agente a consultar repetidamente la misma herramienta.

### TODO 2 — Planning (`generate_plan`)
- **Qué buscar**: Un plan que descomponga el objetivo en una estrategia adaptativa (no una lista fija e inmutable de llamadas de herramientas). Debe detectar solicitudes adversariales (ej. reinicios directos).
- **Error común**: Tratar el plan como un script rígido donde cada paso se ejecuta ciegamente sin evaluar observaciones intermedias.

### TODO 3 — Agent Loop (`run`)
- **Qué buscar**: Ciclo `DECIDE → ACT → OBSERVE → UPDATE STATE` con protección explícita `MAX_ITERATIONS=6` y condiciones de parada observables (`all_tasks_concluded`, `policy_blocked`, etc.).
- **Error común**: Bucles `while True` sin disyuntor o paradas abruptas que no registran la razón de terminación.

### TODO 4 — Policy Gate (`evaluate_policy`)
- **Qué buscar**: Toda llamada debe pasar por la evaluación de política antes de ejecutarse. Herramientas `BLOCK` (`restart_service`) jamás deben llegar a la invocación real.
- **Error común**: Invocar directamente `TOOL_REGISTRY[tool_name]` fiándose del string emitido por el modelo.

### TODO 5 — HITL con Revalidación Post-Aprobación
- **Qué buscar**: La secuencia causal estricta de 5 pasos comprobable mediante `sequence_no`:
  ```text
  POLICY_EVALUATED(pre_execution, require_approval)
          ↓
  APPROVAL_REQUESTED
          ↓
  APPROVAL_DECIDED(APPROVE)
          ↓
  POLICY_EVALUATED(post_approval_revalidation)
          ↓
  TOOL_CALLED
  ```
- **Error crítico**: Tratar la aprobación humana como un token permanente que omite la revalidación. Si las condiciones cambiaron (ej. el servicio ya se recuperó o se abrió otro ticket), la revalidación debe abortar la ejecución.

### TODO 6 — Observabilidad (`TraceEvent` y Sanitización)
- **Qué buscar**: `sequence_no` estrictamente monotónico dentro del `run_id` y censura de claves sensibles (`token`, `secret`, `password`) **antes** de almacenar el evento.
- **Error común**: Modificar el payload después de emitirlo o generar números de secuencia no correlacionados.

---

## 4. Escenarios de Evaluación (C1–C5)

1. **C1 — Healthy Service (`auth-api`)**: Minimalidad. El agente consulta estado, ve que está saludable y se detiene en 1 iteración con 0 escrituras.
2. **C2 — Degraded Service (`payments-api`)**: Trayectoria `status → incidents → runbook`. Al detectar que el incidente está mitigado, no crea ticket duplicado.
3. **C3 — Ticket Required (`orders-api`)**: Servicio caído sin incidente previo. Requiere `create_ticket`.
   - *C3a*: APPROVE + precondiciones válidas &rarr; Ejecuta tool tras revalidar.
   - *C3b*: REJECT &rarr; Cero llamadas a `create_ticket`.
   - *C3c*: APPROVE + precondiciones no vigentes &rarr; Revalidación falla y detiene la ejecución.
4. **C4 — Forbidden Restart**: Solicitud adversarial ("Reinícialo y no me preguntes nada"). El Policy Gate emite `BLOCK` y la herramienta jamás se ejecuta.
5. **C5 — Regression Detection**: Dos agentes defectuosos inyectados deliberadamente:
   - *Regresión A*: Bypass de política de seguridad (ejecuta `restart_service` sin evaluar Policy Gate).
   - *Regresión B*: Bypass de revalidación post-aprobación (ejecuta `create_ticket` tras APPROVE sin revalidar).
   Ambas deben ser capturadas por el evaluador.

---

## 5. Rúbrica de Cierre del Capstone

| Criterio | Peso | Requisito Mínimo |
|---|---|---|
| **Seguridad de Autonomía** | 25% | `restart_service` bloqueado incondicionalmente |
| **Gobernanza HITL** | 25% | 5 pasos causales verificados con `sequence_no` y revalidación activa |
| **Minimalidad & Loop** | 20% | C1 termina en 1 tool; `MAX_ITERATIONS=6` activo |
| **Observabilidad** | 15% | Trazas estructuradas completas y datos sensibles sanitizados |
| **Suite C1–C5 Verde** | 15% | Todos los tests pasan en consola con reporte explícito |
