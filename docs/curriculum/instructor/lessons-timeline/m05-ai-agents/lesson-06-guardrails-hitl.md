# Timeline Pedagógico · M05 L06 — Guardrails & Human-in-the-Loop (HITL)

## Estructura Temporal de la Sesión (120 min)

Esta lección formaliza la entrada a la **Engineering & Control Layer** (**Agent v4 → Agent v5**), introduciendo políticas deterministas de software (`PolicyEvaluator`), compuertas formales Human-in-the-Loop (`PAUSED_FOR_APPROVAL`), binding criptográfico de acciones (`action_fingerprint` SHA-256), revalidación de precondiciones, aprobaciones de un solo uso con protección anti-replay y disyuntores operativos (`BudgetController`).

---

### Opción A: Sesión Intensiva Única (120 min)

| Intervalo | Bloque Temático | Dinámica / Actividades | Hito Clave |
|---|---|---|---|
| **00–10 min** | **Recap L05 y Problema de Autoridad** | Recordar Agent v4. Plantear el problema detonante: el agente deduce que debe transferir $250,000 COP o reiniciar un servidor. ¿Tiene autoridad para ejecutarlo? | Estudiantes asimilan el principio rector: **Capacidad ≠ Autoridad**. |
| **10–30 min** | **Capacidad vs Autoridad & Permission Boundary** | Diferenciar `TOOL_REGISTRY` (catálogo técnico) de `ToolPolicy` (frontera de software). Exploración interactiva de `exp-permission-boundary`. | Desmitificación: "Los guardrails viven en software, no en súplicas dentro del system prompt". |
| **30–50 min** | **Modelo de Decisión, Riesgo y Allowlist** | Presentar `PolicyDecision` (ALLOW, REQUIRE_APPROVAL, BLOCK) y `RiskLevel`. Demostrar por qué la allowlist es la frontera más sólida. | Estudiantes eliminan estados contradictorios (BLOCK vs REQUIRE). |
| **50–70 min** | **ActionProposal, Binding SHA-256 y HITL** | Presentar la compuerta humana: suspensión a `PAUSED_FOR_APPROVAL`, `ActionProposal` y cálculo de huella SHA-256 sobre serialización determinista. Exploración interactiva de `exp-human-approval-gate`. | Demostración visual: el humano autoriza una acción concreta con parámetros exactos. |
| **70–90 min** | **TOCTOU, Revalidación de Precondiciones y Anti-Replay** | Simular sabotaje de argumentos ($250k → $900k) y cambio de precondición (cuenta congelada). Modelar `ApprovalRecord` con sellado `consumed` y `consumed_proposal_ids`. | Comprender que el fingerprint protege la integridad de la acción propuesta pero no congela el mundo exterior, y que las aprobaciones son de un solo uso. |
| **90–110 min** | **BudgetController y Circuit Breakers** | Demostración de `exp-budget-circuit-breaker`. Límites duros de iteraciones y llamadas. Rotulado explícito de métricas didácticas ilustrativas. | Comprensión de la detención segura con `termination_reason = "budget_exceeded"`. |
| **110–115 min** | **Taller Práctico: De Agent v4 a Agent v5** | Codificación colaborativa en grupos de estudio (`taller-06-agent-v5.md`). Ejecución y validación de los Casos H1 a H6 en terminal. | 100% de los grupos ejecutan los tests H1 a H6 con aserciones verdes. |
| **115–120 min** | **Cierre y Puente a L07** | Pregunta de cierre: nuestro agente está planificado y controlado, pero ¿cómo trazamos lo que hizo y evaluamos su calidad en producción? Presentación de Observability & Eval. | Conexión natural con L07 (Observability & Evaluation). |

---

### Opción B: Sesión Desdoblada (2 Bloques de 60 min)

#### Bloque 1: Políticas de Software, Binding y Human-in-the-Loop (60 min)
- **00–15 min:** El problema de autoridad y por qué los system prompts no son guardrails confiables.
- **15–30 min:** `exp-permission-boundary`, `TOOL_REGISTRY` vs `ToolPolicy` y clasificación determinista.
- **30–45 min:** `ActionProposal`, cálculo de huella SHA-256 sobre serialización determinista y suspensión formal a `PAUSED_FOR_APPROVAL`.
- **45–60 min:** `exp-human-approval-gate`, defensa contra mutación de argumentos y revalidación de precondiciones frente a TOCTOU.

#### Bloque 2: Presupuestos, Taller Agent v5 y Puente a Observabilidad (60 min)
- **00–15 min:** Consumo único de aprobaciones, protección anti-replay y `BudgetController` con disyuntores.
- **15–45 min:** Taller 06: Implementación de `run_step_with_guardrails()` y Casos H1 a H6 en Python.
- **45–55 min:** Auditoría en consola de H2 (aprobación legítima), H5a (mutación bloqueada) y H5b (replay bloqueado).
- **55–60 min:** Reflexión y apertura hacia L07 (Observability & Evaluation).

---

## Puntos de Control y Evaluación para el Docente

1. **¿El estudiante intenta implementar guardrails pidiéndole al LLM que se autolimite?**
   - *Intervención:* Exigir que señale la línea de Python que evalúa la llamada antes de que la función sea despachada.
2. **¿Se utiliza SHA-256 truncado para la validación interna?**
   - *Intervención:* Recordar que los 12 o 16 caracteres visibles en la UI son para ergonomía del operador, pero la comparación en software se hace contra el digest completo de 64 hex.
3. **¿El estudiante afirma que el fingerprint elimina todo riesgo de TOCTOU?**
   - *Intervención:* Preguntar: *"Si el hash coincide al 100%, pero durante la espera la cuenta fue congelada en el banco, ¿tu agente revalida el estado antes de transferir?"*.
4. **¿Permite reutilizar una aprobación para una segunda llamada?**
   - *Intervención:* Comprobar que `ApprovalRecord` tenga `consumed = True` y que el identificador resida en `consumed_proposal_ids`.
5. **¿Distingue entre `BLOCK` y `REJECT`?**
   - *Intervención:* Asegurar que una herramienta con decisión `BLOCK` no genere `ActionProposal` ni permita anulación del supervisor.
6. **¿Están debidamente rotulados los contadores de presupuesto?**
   - *Intervención:* Confirmar que cualquier cálculo de costo o tokens figure como `SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS`.
