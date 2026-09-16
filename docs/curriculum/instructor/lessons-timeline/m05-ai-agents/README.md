# M05 — Agentes de IA

Guías timeline para impartir en vivo las lecciones del módulo M05 usando CASE Academy como apoyo visual y práctico.

| Lección | Guía |
|---|---|
| L01 — Flujos de Trabajo vs Agentes | [lesson-01-workflows-vs-agents.md](lesson-01-workflows-vs-agents.md) |
| L02 — Llamada de Herramientas y Agent v1 | [lesson-02-tool-calling-agent-v1.md](lesson-02-tool-calling-agent-v1.md) |
| L03 — El Agent Loop y la Evolución a Agent v2 | [lesson-03-agent-loop.md](lesson-03-agent-loop.md) |
| L04 — State & Memory (Agent v3) | [lesson-04-state-memory.md](lesson-04-state-memory.md) |
| L05 — Planning & Task Decomposition (Agent v4) | [lesson-05-planning-task-decomposition.md](lesson-05-planning-task-decomposition.md) |
| L06 — Guardrails & Human-in-the-Loop (Agent v5) | [lesson-06-guardrails-hitl.md](lesson-06-guardrails-hitl.md) |
| L07 — Observability & Evaluation (Agent v6) | [lesson-07-observability-evaluation.md](lesson-07-observability-evaluation.md) |
| Lab 05 — Agent Engineering Capstone | *(En diseño arquitectónico)* |

Estas guías no sustituyen el material docente canónico de M05. Su función es convertir cada lección de la plataforma en una sesión conducible de aproximadamente dos horas, con preguntas, demostraciones, práctica y cierres pedagógicos.

Para la especificación completa del nuevo pipeline y arquitectura pedagógica, consulta [Module Architecture: Agent Engineering](../../m05-ai-agents/module-architecture.md) y [el material docente de M05](../../m05-ai-agents/README.md).

## Principio de conducción del módulo

M05 debe sentirse como la construcción progresiva e incremental de un agente de software real, no como una colección de definiciones aisladas.

```text
L01 Decision (Autonomy)
    ↓
L02 Tools (Agent v1)
    ↓
L03 Loop (Agent v2)
    ↓
L04 State & Memory (Agent v3)
    ↓
L05 Planning & Task Decomposition (Agent v4)
    ↓
L06 Guardrails & Human-in-the-Loop (Agent v5)
    ↓
L07 Observability & Evaluation (Agent v6)
    ↓
Lab 05 Integración Final (Capstone)
```

La regla transversal es **Least Autonomy Necessary**: primero entender qué decisión se está delegando al modelo y luego agregar capacidades una por una, manteniendo en software los límites que no deben quedar bajo control probabilístico.
