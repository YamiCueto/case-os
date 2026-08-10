# Lab 08 — Design a Production AI Protocol (Instructor Guide)

## Engineering Problem
Un equipo de desarrollo acaba de construir un "Customer Service Agent" que lee FAQs (M03 y M04), utiliza Tools de reembolso mediante MCP (M05 y M07) y funciona de manera excelente en la laptop del desarrollador. Mañana planean hacer el despliegue (Deploy) a 100,000 usuarios en Producción. Si lo hacen así, la base de datos corre riesgo de inyección, los costos de la API pueden quebrar a la empresa, y la calidad de las respuestas se degradará en silencio.

## Learning Objectives
- Integrar todos los conceptos del curso (M01-M07) en un marco de evaluación único.
- Diseñar y rellenar un documento de **Production Readiness Review (PRR)** (Revisión de Preparación para Producción).
- Establecer un **Deployment Gate** que impida el paso a Producción de sistemas AI inseguros o financieramente inviables.

## Scenario
El estudiante actuará como el *Site Reliability Engineer (SRE)* o Arquitecto Principal. Un desarrollador Junior acaba de someter un *Pull Request* para lanzar el nuevo Agente de Soporte al Cliente a Producción. Tu trabajo no es escribir código hoy, sino ejercer como la última barrera de defensa de la empresa. Debes evaluar la propuesta del Junior completando un checklist de PRR y decidiendo si apruebas el despliegue (Go) o lo rechazas (No-Go).

## Constraints
- **Trabajo local:** Creación de un documento de gobernanza `prr-agent-deployment.md`.
- **Enfoque Sistémico:** No se admiten respuestas vagas como "parece seguro". Todo debe atarse a un mecanismo (ej. "La seguridad de la Tool de reembolso se garantiza mediante validación estricta de esquema MCP en el backend").

## Starting Point
Crear el archivo `prr-agent-deployment.md` copiando el esqueleto del PRR provisto por el instructor.

## Engineering Decision (El Núcleo del Lab)
El estudiante debe rellenar las siguientes secciones críticas para el Agente Propuesto:

### 1. System Prompt & Context (M02 + M03)
¿Cuál es la instrucción base (System Prompt)?
¿El agente tiene su *Context Boundary* rígidamente definido o puede leer información indiscriminada? *(El estudiante debe auditar el archivo que el Junior pretende lanzar).*

### 2. Autonomy & Tools (M05 + M07)
Mapeo de la regla de *Least Autonomy Necessary* y MCP:
- ¿Qué Tools (Side-effects) tiene expuestas?
- ¿Están las APIs internas protegidas asumiendo *Assume Breach* (Never trust the client)?
- ¿Cuál requiere un HITL (Human in the Loop) obligatorio?

### 3. Cost & Latency Constraints (M08)
El estudiante debe hacer matemáticas básicas:
- Si 1 interacción consume 2,000 tokens de contexto y el Agente hace un bucle (Loop) de 3 iteraciones promedio... ¿Cuánto cuesta cada ticket resuelto en dólares?
- ¿Existen cachés semánticas configuradas para mitigar el costo y mejorar la latencia? (Si la respuesta es no, esto debería ser un factor de rechazo para B2C masivos).

### 4. Evaluation Pipeline & Golden Dataset (M08)
- ¿Existe un *Golden Dataset*? (El estudiante debe exigir una métrica, ej: "El PR debe venir acompañado de los resultados de un test automatizado sobre el dataset de 500 tickets históricos").
- ¿Qué criterios validan los Evals? (Semántica y Determinismo).

### 5. Failure Mode & Fallback
- Si la API del LLM se cae completamente, o el Rate Limit (Token Proxy) rechaza la petición por costos... ¿qué le responde el sistema al usuario?
*(Respuesta esperada: Transferencia elegante (hand-off) a un operador humano sin mostrar errores de stack trace al usuario final).*

## Expected Artifact
Un **Production Readiness Review (PRR)** completo. Es la manifestación física de la regla de oro: **AI-generated change → Evidence → Evaluation → Deployment Gate.**

Ejemplo de la sección de decisión final que debe llenar el estudiante:
```markdown
# DEPLOYMENT DECISION: NO-GO (REJECTED)
**Motivos de rechazo:**
1. Falta de Evals: No se presentó un reporte automatizado del LLM-as-a-Judge contra el Golden Dataset de Reembolsos de 2023.
2. Inseguridad de Tooling (M07): La Tool 'execute_refund' no aplica validación de monto máximo en el backend MCP.
3. Riesgo de Costos (M08): No hay un límite duro (Circuit Breaker) para el número de iteraciones (loops) del Agente si falla en recuperar los datos.

**Acciones Requeridas para Autorización:**
- Construir el Golden Dataset y ejecutar un benchmark.
- Restringir la Tool en el Servidor MCP (Max refund: $50 USD).
- Setear parámetro `max_loops = 3` en el orquestador del Agente.
```

## Human-in-the-Loop
Intercambio de PRRs. El instructor pedirá a los estudiantes que lean el PRR de su compañero y actúen como "Abogados del diablo". ¿Qué resquicio olvidó tapar el revisor que podría costarle millones a la empresa?

## Instructor Guidance
### Cómo iniciar el Lab:
"El código barato y los prototipos brillantes de IA no sirven de nada si no podemos operarlos de forma segura en Producción. Hoy, ustedes son Site Reliability Engineers. Su firma en este documento es lo que separa a nuestra empresa de un incidente de ciberseguridad o de la bancarrota por costos de API. Tengan piedad cero con el sistema propuesto."

### Mientras trabajan:
Pregunta a los estudiantes sobre el **Golden Dataset**: "¿Cómo sabemos que su Juez (LLM) no aprobó un error por ser condescendiente?" Recuérdales la Jerarquía de Evals de la Lección 02.

## Common Student Mistakes
- Aprobar el PR argumentando "se ve bien, los prompts son claros". (Caída en el *Eyeballing* o Vibes-based evaluation).
- Olvidar calcular los costos exponenciales de una ventana de contexto grande operando en bucle.

## Review Checklist (Course Finale)
Antes de cerrar la clase, y el curso:
- [ ] ¿Los estudiantes asumen ahora que el LLM va a alucinar, fallar o ser engañado por definición?
- [ ] ¿Sienten que la carga de hacer que el software funcione es de ellos (procesos backend, PRRs, validaciones deterministas) y ya no dependen mágicamente del LLM?

## Discussion Questions (Cierre del Programa)
- "Vuelvan al Módulo 01. Dijimos que la IA no es un oráculo, sino un motor de texto estocástico extremadamente convincente. Después de construir arquitecturas, controlar contexto, diseñar agentes con herramientas y aplicar Evals estadísticos... ¿sienten que ahora son ustedes los que controlan a la IA, y no al revés?"

## The End
*(Fin de CASE Academy - M08).*
