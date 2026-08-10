# CASE Academy — Instructor Curriculum Master

## Visión General

CASE Academy (Cognitive Architecture & Software Engineering) está diseñado para enseñar a ingenieros de software senior cómo pensar, diseñar y construir sistemas utilizando Modelos Fundacionales. 

El propósito de este currículum no es enseñar a usar "herramientas de IA" (como Copilot o ChatGPT), sino enseñar **Ingeniería de Software Asistida por IA**. 

> **Filosofía Fundamental:**
> La IA no reemplaza el razonamiento de ingeniería; cambia **dónde** y **cómo** debemos ejercerlo.

## La Progresión Pedagógica (La Única Historia)

El curso está estructurado como una sola narrativa continua. Cada módulo resuelve el problema que el módulo anterior dejó abierto. Como instructor, es crítico mantener esta línea conductora viva en la mente de los estudiantes.

| Módulo | Tema Principal | Pregunta Central del Instructor al Grupo | Conexión con el siguiente módulo |
| ------ | -------------- | ---------------------------------------- | -------------------------------- |
| **M01** | **AI Foundations** | *¿Qué cambia cuando el software deja de ser completamente determinista?* | El modelo puede producir algo plausible pero falso. |
| **M02** | **Prompt Engineering** | *¿Cómo hacemos que un modelo siga instrucciones de manera confiable?* | Necesitamos contratos para controlar lo que le pedimos. |
| **M03** | **Context Engineering** | *¿Qué información necesita realmente el modelo?* | Necesitamos inyectar contexto relevante. |
| **M04** | **Retrieval & RAG** | *¿Cómo encontramos esa información a escala?* | Necesitamos estrategias de retrieval a escala. |
| **M05** | **AI Agents** | *¿Cuándo necesitamos autonomía?* | Necesitamos controlar cuándo el modelo puede actuar. |
| **M06** | **Agentic SWE** | *¿Cómo usamos IA para modificar software sin perder control?* | Necesitamos verificar los cambios que produce. |
| **M07** | **MCP & Tools** | *¿Cómo exponemos capacidades externas de forma segura?* | Necesitamos limitar sus capacidades externas (Tools). |
| **M08** | **Production AI** | *¿Cómo demostramos que el sistema merece llegar a producción?* | Necesitamos evidencia de confiabilidad. |
| **M09** | **AI Architecture** | *¿Cómo construimos solamente la arquitectura que realmente necesitamos?* | Necesitamos una arquitectura proporcional al problema. |

## Reglas Pedagógicas Transversales

### 1. Las Tres Capas de Aprendizaje
> **Every abstract AI concept must be taught through three layers: Intuición → Mecanismo → Consecuencia de ingeniería.**

- **Intuición:** ¿cómo se lo explico a alguien que nunca ha trabajado con IA?
- **Mecanismo:** ¿qué está ocurriendo realmente debajo?
- **Consecuencia de ingeniería:** ¿qué cambia en la forma de diseñar software?

### 2. El Uso de Analogías
Para construir la intuición inicial, las lecciones incluyen **Concept Analogies**.
> **Regla de Oro:** Las analogías sirven para construir intuición, no para sustituir el mecanismo técnico. El instructor debe declarar explícitamente dónde deja de aplicar cada analogía.

El flujo obligatorio para explicar una analogía es:
`Analogía → Mapeo → Límite de la analogía → Concepto técnico → SWE`

## Estructura de las Clases (Classroom Flow)

CASE Academy (la plataforma web) es tu herramienta visual de apoyo. **NO es un curso autoguiado.**

El flujo estándar de una clase es:
1. **Contexto Conceptual (Instructor):** Explicación del problema de ingeniería.
2. **Demo Interactiva (Plataforma):** Uso de la plataforma para visualizar el concepto. Discusión en grupo.
3. **Profundización (Instructor):** Implicaciones arquitectónicas, errores comunes, trade-offs.
4. **Real Engineering Lab (Estudiante Local):** El estudiante resuelve un problema guiado en su propio entorno, con su propio IDE y repositorio legacy. La plataforma provee el playbook, no la ejecución.

## Evaluación (Assessment)

La evaluación en CASE Academy no es mediante test de opciones múltiples. Evaluamos madurez de ingeniería. A lo largo del curso, debes validar si el estudiante puede:

- [ ] Explicar el concepto y la intuición detrás.
- [ ] Identificar **cuándo aplica** un patrón.
- [ ] Identificar **cuándo NO aplica** (cuándo es sobreingeniería).
- [ ] Diseñar una solución técnica.
- [ ] Justificar los *trade-offs* de ingeniería.
- [ ] Identificar modos de fallo (*failure modes*).
- [ ] Definir restricciones (*guardrails*) apropiadas.
