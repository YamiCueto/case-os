# Lab 01 — Analyze a Legacy Routine (Instructor Guide)

## Engineering Problem
Los ingenieros de software, al enfrentarse a la modernización de sistemas legacy con IA, tienden a dos extremos peligrosos:
1. Rechazar la IA totalmente porque "no compila y falla" (esperan determinismo).
2. Delegar ciegamente la lógica de negocio core a un LLM (riesgo de alucinación crítica).

Este laboratorio obliga al ingeniero a auditar el código real y trazar la frontera arquitectónica entre la certidumbre (determinismo) y la flexibilidad (probabilidad).

## Learning Objectives
- Seleccionar código apropiado del entorno real corporativo.
- Desarrollar la agudeza mental para detectar unidades lógicas.
- Separar de manera estricta lo determinista de las oportunidades probabilísticas.
- Aplicar la disciplina de "Analizar antes de Generar" al interactuar con herramientas de IA autorizadas (Copilot, Cursor, etc.).

## Scenario
El estudiante actúa como un ingeniero de modernización que debe evaluar si un componente del sistema actual puede mejorarse con IA, sin poner en riesgo las reglas de negocio financieras o duras.

## Constraints
- **Seguridad primero:** Prohibido subir el código a herramientas no autorizadas. Trabajo puramente local.
- **Sin escritura de código:** En este Lab, la IA no tiene permiso para rescribir la rutina, solo para ayudar a analizarla.

## Starting Point
El estudiante debe abrir su IDE (VSCode, IntelliJ, etc.), ir a su repositorio de trabajo real, y localizar una rutina, servicio o stored procedure de moderada complejidad (que tome decisiones y procese datos).

## Engineering Decision (El Núcleo del Lab)
El estudiante debe clasificar cada pieza de la rutina.

### Strict Deterministic Logic
- Cálculos matemáticos.
- Validación de esquemas de Base de Datos.
- Reglas de negocio reguladas (ej. cálculo de impuestos).
- Enrutamiento de red.

### Probabilistic Opportunity
- Extracción de datos de texto no estructurado.
- Clasificación de intenciones del usuario.
- Generación de mensajes de error amigables para el usuario final.
- Documentación y explicabilidad del código.

## Autonomy Test
Si delegamos la parte probabilística, ¿necesita revisión humana síncrona o puede operar en background de forma autónoma? (Esto introduce la necesidad de Evaluación - M08).

## Tool Contract
El estudiante usará la herramienta de IA autorizada en su máquina (ej. GitHub Copilot Chat).
El contrato es de análisis: 
1. Estudiante inyecta el código en el prompt.
2. Estudiante instruye: "Analiza este código y lista las dependencias y reglas de negocio. NO generes código nuevo."

## Guardrails
La advertencia crítica del instructor: "La IA intentará reescribir el código porque está diseñada para complacer. Su tarea es contenerla. Si Copilot les genera el refactor, fallaron en controlar a la herramienta."

## Human-in-the-Loop
El estudiante debe actuar como el revisor de la salida del modelo. ¿El análisis de la IA inventó una dependencia? ¿Asumió un marco de trabajo (framework) incorrecto?

## Failure & Recovery
Si el modelo falla en el análisis, el estudiante debe identificar si fue por falta de contexto (M03) o por alucinación pura (M01).

## Expected Artifact
Un documento Markdown local, Ticket de Jira o registro en su libreta donde liste:
- Archivo analizado.
- Lista de lógicas deterministas.
- Lista de oportunidades probabilísticas.
- Hallazgos de alucinación o riesgos.

## Instructor Guidance
### Cómo iniciar el Lab:
Dirige a los estudiantes a la página del `Lab 01` en la plataforma CASE Academy. Diles: "La plataforma tiene las instrucciones, pero el trabajo ocurre en sus IDEs. Tienen 30 minutos."

### Mientras trabajan:
Camina por el aula (física o virtual). Pregunta qué rutinas eligieron. Si alguien eligió un "CRUD simple", pídele que busque algo más complejo (ej. procesamiento de pagos).

## Common Student Mistakes
- El estudiante le pide al LLM que "mejore el código" inmediatamente, perdiendo el propósito analítico del Lab.
- El estudiante asume que un "Regex" complejo es una oportunidad probabilística. (Error: un Regex es determinista; la extracción probabilística reemplaza al Regex cuando este ya no escala por variabilidad).

## Review Checklist
Antes de cerrar la clase, valida rápidamente con la audiencia:
- [ ] ¿Pudieron frenar al asistente para que solo analice?
- [ ] ¿Alguien encontró una alucinación en el análisis de su propio código?
- [ ] ¿Quedó clara la frontera de qué jamás delegarían al modelo?

## Discussion Questions
Para cerrar el Lab:
- "Si tuvieran que rediseñar esta rutina hoy, aislando lo determinista en una API y lo probabilístico en un LLM, ¿qué tan difícil sería el refactor?"

## Extension Exercise
Pedir al estudiante que busque en la base de datos de tickets/issues de su empresa un incidente reciente causado por un sistema legacy intentando hacer (mediante miles de `ifs`) un trabajo de clasificación semántica que hoy sería trivial para un modelo probabilístico.
