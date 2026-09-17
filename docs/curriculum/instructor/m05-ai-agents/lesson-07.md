# Lección 07 — Observabilidad y Evaluación Agéntica

## Resumen Pedagógico

Esta lección cierra la **Engineering & Control Layer** (**Agent v5 → Agent v6**) con la capa de instrumentación y evaluación que convierte corridas opacas en trayectorias estructuradas, auditables y medibles.

**Problema Detonante:** Agent v5 está gobernado con guardrails y compuerta HITL. Pero si falla en producción a las 3 AM, ¿qué evidencia estructurada tienes de lo que hizo? La paradoja de la respuesta final: un agente puede completar su ejecución y emitir una respuesta sintácticamente correcta mientras esconde ineficiencias críticas que solo se detectan analizando su trayectoria completa.

**Concepto Central:** Evaluación agéntica rigurosa = **Outcome** (¿qué obtuvo?) + **Trajectory** (¿cómo llegó?).

---

## Artefacto Principal

**Agent v6:** Evolución de Agent v5 con:
- `EventType` / `TraceEvent` (sequence_no monotónico, run_id, step_id, payload sanitizado)
- `InMemoryTraceCollector` (base 100% determinista y offline)
- Sanitización previa al `emit()` (`_SENSITIVE_KEYS`, `sanitize_payload()`)
- `RunSummary.from_events()` (única fuente de verdad de métricas)
- `EvaluationCase` (`expected_outcome_status`, `expected_tools`, `expected_tool_sequence`, `require_hitl`)
- `AgentEvaluator` (aserciones deterministas, sin score global mágico)
- Golden Cases I1–I5 con detección automática de regresiones

---

## Principios No Negociables de L07

1. **No trazar Chain-of-Thought ni razonamiento interno.** Solo artefactos observables: model calls, tool calls, policy decisions, HITL events, plan events.
2. **Logging ≠ Structured Agent Tracing.** El logging operacional (`logger.info()`) no permite correlación por `run_id` ni aserciones programáticas. Son complementarios, no equivalentes ni antagonistas.
3. **`sequence_no` monotónico dentro del `run_id`.** Condición necesaria para reconstruir el orden causal de decisiones.
4. **Sanitización previa al `emit()`.** El `TraceCollector` nunca ve passwords, tokens ni PII innecesarios.
5. **`RunSummary` derivado, no calculado.** `from_events()` es la única fuente de verdad. `iterations` = `len({e.iteration...})`, nunca `max()`.
6. **Sin score global mágico.** Las dimensiones de evaluación se reportan de forma independiente: Task Success Rate, Tool Selection Accuracy, Policy Compliance (0 violations toleradas), HITL Escalation Rate, Iteration Efficiency, Tool Failure Rate.
7. **LLM-as-a-Judge es complementario, no sustituto.** Jamás reemplaza aserciones de políticas, seguridad ni orden de ejecución.
8. **HITL trace obligatorio con revalidación post-approval.** `APPROVAL_REQUESTED` → `APPROVAL_DECIDED` → `POLICY_EVALUATED(phase=post_approval_revalidation)` → `TOOL_CALLED`.
9. **Sin OpenTelemetry como dependencia base de L07.** La base es `InMemoryTraceCollector`. OpenTelemetry es la evolución natural hacia M07/M08 con microservicios distribuidos.

---

## Roadmap del Módulo Post L07

```text
L01 — Decision / Autonomy                    Agent v0 ✅ CLOSED
L02 — Tools / Tool Calling                   Agent v1 ✅ CLOSED
L03 — Agent Loop                             Agent v2 ✅ CLOSED
L04 — State & Memory                         Agent v3 ✅ CLOSED
L05 — Planning & Task Decomposition          Agent v4 ✅ CLOSED
L06 — Guardrails & HITL                      Agent v5 ✅ CLOSED
L07 — Observability & Evaluation             Agent v6 ✅ CLOSED

Demo 05 — El Bucle del Agente                Playground interactivo
Lab 05  — Capstone: Diseñar un Flujo Agéntico Proyecto integrador (L01-L07 + dominio propio)
```

---

## Relación con el Roadmap del Curso

- **M06 — Agentic SWE:** El agente al servicio de ingeniería de software (no nuevo módulo de fundamentos de agentes).
- **M07 — MCP:** Model Context Protocol para interoperabilidad entre agentes y herramientas — donde OpenTelemetry toma relevancia como infraestructura de tracing distribuido.
- **M08 — Production:** Evaluación, seguridad y hardening de sistemas agénticos en producción, construyendo sobre la base de L07.
