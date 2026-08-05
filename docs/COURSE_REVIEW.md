# COURSE REVIEW — Auditoría Pedagógica Completa
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Rol:** Instructional Designer + Technical Writer  
**Versión:** 1.0.0 — Solo análisis. No se modificó ningún archivo.

---

## 1. Resumen Ejecutivo Pedagógico

El contenido existente constituye un **programa técnico de alta calidad** para desarrolladores de software con experiencia en tecnologías legacy. La estructura pedagógica es coherente, la dificultad está bien escalada y los temas son técnicamente relevantes para 2026.

Sin embargo, el programa actual carece de:
- Una **narrativa pedagógica explícita** que conecte las clases entre sí.
- Una **evaluación continua** (quizzes, autoevaluaciones, rúbricas).
- **Recursos complementarios** clasificados por tipo.
- Un **modelo de progresión** explícito del estudiante.
- Una sección de **bienvenida e introducción** al programa global.

---

## 2. Clasificación del Contenido Existente

### 2.1 Tipo de contenido por componente

| Componente | Tipo de Contenido | Formato | Interactividad |
|---|---|---|---|
| `plan-dev-detallado` | Syllabus / Hoja de ruta | Documento estático (HTML) | Baja — Solo lectura |
| `installation-guides` | Guía procedimental | Lista interactiva expandible | Media — Expand/collapse |
| `tech-stack` | Referencia técnica | Cards con flip animation | Media — Flip cards |
| `clase1-dev-fundamentos` | Clase magistral | Slideshow (8 slides) | Media — Navegación |
| `clase2-dev-spring-boot` | Taller práctico | Slideshow (8 slides) | Media — Navegación |
| `clase3-dev-migracion-legacy` | Taller práctico | Slideshow | Media — Navegación |
| `clase4-dev-integracion-apis` | Taller práctico | Slideshow | Media — Navegación |
| `clase5-dev-testing-avanzado` | Taller técnico | Slideshow | Media — Navegación |
| `clase6-dev-modulo-angular` | Taller Frontend | Slideshow | Media — Navegación |
| `clase7-dev-frontend-legacy` | Taller migración | Slideshow | Media — Navegación |
| `clase8-dev-estado-rxjs` | Taller avanzado | Slideshow | Media — Navegación |
| `clase9-dev-testing-e2e` | Taller QA | Slideshow | Media — Navegación |
| `clase10-dev-fastapi` | Taller AI/RAG | Slideshow | Media — Navegación |
| `clase11-dev-lambda-serverless` | Taller Cloud | Slideshow | Media — Navegación |
| `clase12-dev-proyecto-final` | Proyecto capstone | Slideshow complejo | Alta — Múltiples secciones |

**Hallazgo:** El 80% del contenido es de tipo "clase magistral con slideshow". Falta diversidad de formatos pedagógicos.

---

## 3. Análisis de la Estructura del Curso

### 3.1 Organización Mensual (estructura implícita)

El curso está organizado en 3 meses de 4 semanas cada uno, con una clase por semana:

**MES 1 — Fundamentos IA + Backend Java/Spring Boot (Semanas 1-4)**

| Semana | Clase | Tema | Tipo | Dificultad |
|---|---|---|---|---|
| 1 | C1 | Context Engineering, Spec-Driven Dev, MCP | Fundamentos + Configuración | ★★☆☆☆ |
| 2 | C2 | Microservicio Spring Boot 3.4+ / Java 21 | Taller Backend | ★★★☆☆ |
| 3 | C3 | Migración Legacy VB6 / Java 8 → Spring Boot | Taller Migración | ★★★★☆ |
| 4 | C4 | APIs REST Resilientes + Servidor MCP propio | Taller Avanzado | ★★★★☆ |

**MES 2 — Frontend Angular + Testing (Semanas 5-8)**

| Semana | Clase | Tema | Tipo | Dificultad |
|---|---|---|---|---|
| 5 | C5 | Testing Unitario Avanzado + Agentic Self-Fixing | Taller QA | ★★★☆☆ |
| 6 | C6 | Frontend Angular 19+ Signals + Tailwind v4 | Taller Frontend | ★★★☆☆ |
| 7 | C7 | Modernización Frontend Legacy → Angular | Taller Migración | ★★★★☆ |
| 8 | C8 | Estado Reactivo Avanzado (Signals + RxJS + Signal Store) | Taller Avanzado | ★★★★★ |

**MES 3 — IA Avanzada, Cloud + Proyecto Final (Semanas 9-12)**

| Semana | Clase | Tema | Tipo | Dificultad |
|---|---|---|---|---|
| 9 | C9 | Testing E2E Playwright/Cypress + Self-Healing | Taller QA | ★★★☆☆ |
| 10 | C10 | RAG con Python 3.12 + FastAPI + Vector DBs | Taller AI | ★★★★☆ |
| 11 | C11 | AWS Lambda Serverless + Amazon Bedrock + Guardrails | Taller Cloud | ★★★★☆ |
| 12 | C12 | Proyecto Integrador Final AI-Native Enterprise | Proyecto Capstone | ★★★★★ |

---

## 4. Análisis de Coherencia Pedagógica

### 4.1 Progresión de Dificultad

```
DIFICULTAD
    ★★★★★  │                            C12 ●
    ★★★★☆  │          C3● C4●     C7● C8●     C10● C11●
    ★★★☆☆  │     C2●         C5● C6●     C9●
    ★★☆☆☆  │ C1●
    ★☆☆☆☆  │
              └────────────────────────────────────────
              S1   S2   S3   S4   S5   S6   S7   S8   S9  S10  S11  S12
```

**Evaluación:** La curva de dificultad es ascendente y razonablemente suave. No hay saltos abruptos.

**Observaciones:**
- Hay una ligera caída de dificultad al inicio del Mes 2 (C5 y C6 son más básicas que C3 y C4). Esto es pedagógicamente correcto: reinicia el ciclo de aprendizaje con un nuevo dominio (Frontend).
- Similar caída al inicio de Mes 3 (C9 es más básica que C8). Misma lógica: nuevo dominio (QA/Cloud).

### 4.2 Balance de Temas por Dominio

| Dominio | Clases | Porcentaje |
|---|---|---|
| Backend (Java/Spring Boot) | C2, C3, C4 | 25% |
| Frontend (Angular) | C6, C7, C8 | 25% |
| Testing / QA | C5, C9 | 16.7% |
| IA / Herramientas | C1 | 8.3% |
| RAG / Python | C10 | 8.3% |
| Cloud / AWS | C11 | 8.3% |
| Integración | C12 | 8.3% |

**Evaluación:** El balance está sesgado hacia Backend y Frontend, que son los dominios más relevantes para la audiencia objetivo. La IA como tema explícito solo aparece en C1 (fundamentos) y se trabaja como herramienta transversal en las demás clases. **Esto es una brecha pedagógica importante**: la IA como disciplina merece más tiempo dedicado.

---

## 5. Análisis del Contenido por Clase

### C1 — Fundamentos de IA Generativa

**Temas cubiertos:**
- Modelos de razonamiento (Gemini, DeepSeek, Claude, OpenAI)
- Model Context Protocol (MCP)
- Spec-Driven Development (AGENTS.md)
- Agentes de código autónomos
- Prompts estructurados vs. casuales
- Limitaciones de la IA (alucinaciones, seguridad, IP, desactualización)
- Buenas prácticas
- Ejercicio: Análisis de módulo VB6 para migración

**Evaluación Pedagógica:**
- ✅ Cubre conceptos correctos para el nivel inicial
- ✅ El contraste "prompt casual vs. profesional" es didácticamente efectivo
- ✅ Las limitaciones están correctamente contextualizadas
- ⚠️ MCP se introduce muy brevemente para ser uno de los ejes del programa
- ❌ Falta un "mapa mental" que muestre cómo todos los conceptos se relacionan
- ❌ No hay ejercicio de autoevaluación al final

### C2 — Spring Boot con IA

**Temas cubiertos:**
- Arquitectura hexagonal con asistencia IA
- Generación de microservicio de Gestión de Clientes
- Modelado de entidades JPA y Virtual Threads
- Controladores REST con OpenAPI/Swagger
- Bean Validation y Java Records

**Evaluación Pedagógica:**
- ✅ El objetivo de "crear microservicio completo desde cero" es claro y motivador
- ✅ La conexión con IA es explícita (prompts de arquitectura)
- ⚠️ Alta densidad técnica para una sola sesión
- ❌ Falta contexto de "por qué hexagonal" antes de pedirle a la IA que lo genere

### C3 — Migración Legacy

**Temas cubiertos:**
- Análisis de código VB6/Java 8 con IA
- Conversión a Spring Boot 3.4
- SQL nativo a Spring Data JPA
- Preservación de reglas de negocio

**Evaluación Pedagógica:**
- ✅ **La clase más relevante para la audiencia objetivo** — los estudiantes vienen de VB6
- ✅ El caso de uso BancoFiel es perfectamente contextualizado
- ✅ Los casos de migración son concretos y medibles
- ⚠️ La complejidad de migración de legacy puede subestimarse en una sola sesión

### C4 — APIs REST + Creación de Servidor MCP

**Temas cubiertos:**
- Spring WebClient, Resilience4j (Circuit Breaker, Retry)
- Redis
- Creación de Servidor MCP propio

**Evaluación Pedagógica:**
- ✅ Cierra el loop del Mes 1 conectando todo con MCP
- ✅ El entregable "servidor MCP propio" es muy concreto y motivador
- ⚠️ Combina dos temas complejos (resiliencia + MCP) en una sola clase
- ⚠️ La curva de aprendizaje de MCP SDK puede ser elevada sin recursos de apoyo

### C5 — Testing Avanzado + Agentic Self-Fixing

**Temas cubiertos:**
- JUnit 5, Mockito, Testcontainers
- JaCoCo (cobertura >80%)
- Bucles de autocorrección con IA

**Evaluación Pedagógica:**
- ✅ El concepto de "Agentic Self-Fixing" es innovador y relevante
- ✅ Cobertura >80% como objetivo concreto
- ⚠️ Testing es percibido como aburrido — la framing con IA es el gancho correcto
- ❌ Falta mencionar testing de contratos (Pact) para microservicios

### C6 — Frontend Angular Signals

**Temas cubiertos:**
- Angular Signals: `signal()`, `computed()`, `effect()`
- Standalone Components
- Nuevo flow control (@if, @for, @switch)
- Tailwind CSS v4

**Evaluación Pedagógica:**
- ✅ Modernización de Angular bien enmarcada
- ✅ El contraste con el paradigma anterior (Zone.js) ayuda
- ⚠️ Tailwind v4 es muy reciente — puede haber issues de compatibilidad

### C7 — Modernización Frontend Legacy

**Temas cubiertos:**
- Migración JS/jQuery → Angular 19
- OnPush + reactividad granular con Signals
- Smart/Dumb Components

**Evaluación Pedagógica:**
- ✅ Complemento perfecto de C6 (primero aprendes nuevo, luego migras viejo)
- ✅ Patrón Smart/Dumb es fundamental y frecuentemente omitido
- ⚠️ La audiencia puede no tener experiencia con jQuery (más probable con VB6)

### C8 — Estado Reactivo Avanzado

**Temas cubiertos:**
- Integración Signals + RxJS
- NgRx Signal Store

**Evaluación Pedagógica:**
- ✅ Es la clase más avanzada del Mes 2 — correctamente al final
- ⚠️ NgRx Signal Store es una librería relativamente nueva con documentación limitada
- ❌ La transición de Zone.js a Signals debería estar más explícita antes de esta clase

### C9 — Testing E2E

**Temas cubiertos:**
- Playwright / Cypress
- CI/CD con detección de selectores rotos
- Self-Healing con IA

**Evaluación Pedagógica:**
- ✅ El "self-healing" tests es el diferenciador más innovador de la clase
- ✅ Playwright vs Cypress bien contextualizado
- ⚠️ Sin contexto de cuándo preferir Playwright vs Cypress

### C10 — RAG con Python/FastAPI

**Temas cubiertos:**
- Python 3.12, FastAPI
- PgVector / ChromaDB
- Embeddings (OpenAI / Ollama)
- LangChain / LlamaIndex

**Evaluación Pedagógica:**
- ✅ RAG es uno de los patrones más importantes de IA en 2026
- ✅ El caso de uso bancario (consultas RAG sobre normativa) es muy práctico
- ⚠️ Es un salto grande de paradigma (de Java/Angular a Python) en una sola sesión
- ❌ Falta una introducción de Python para desarrolladores Java antes de esta clase

### C11 — AWS Lambda + Bedrock

**Temas cubiertos:**
- AWS Lambda (Node.js/Python)
- Amazon Bedrock
- API Gateway, DynamoDB
- SAM / CDK
- Guardrails

**Evaluación Pedagógica:**
- ✅ Guardrails es el tema más importante desde perspectiva empresarial y regulatoria
- ✅ La combinación Lambda + Bedrock es el patrón estándar de la industria
- ⚠️ Es una clase muy densa (Lambda + Bedrock + DynamoDB + Guardrails + SAM/CDK)
- ❌ Requiere cuenta AWS con permisos específicos — barrera de entrada para algunos estudiantes

### C12 — Proyecto Final

**Temas cubiertos:**
- Sistema de Aprobación Crediticia Full-Stack
- 4 microservicios (Java 21, Python 3.13, Lambda Node.js, CRUD REST)
- Frontend Angular 22 con Signals
- E2E Cypress 15
- AWS Cloud

**Evaluación Pedagógica:**
- ✅ El proyecto integrador es ambicioso y pedagógicamente correcto como cierre
- ✅ La arquitectura de 4 microservicios es realista y representativa
- ✅ El diagrama ASCII de arquitectura es un diferenciador de calidad técnica
- ⚠️ 27.6 KB de TypeScript sugiere que el componente es demasiado complejo — difícil de mantener
- ⚠️ La complejidad del proyecto final puede ser abrumadora para estudiantes que no completaron C1-C11

---

## 6. Análisis de la Audiencia

### 6.1 Perfil del Estudiante Objetivo

**Fondo técnico:**
- Experiencia con COBIS, VB6, .NET Framework, SQL Server, Stored Procedures
- Transicionando hacia: Java 21, Spring Boot, Angular, IA Generativa

**Nivel de IA:**
- Principiante a intermedio en IA
- Usuario casual de ChatGPT/Copilot
- Sin experiencia en MCP, Agents, RAG

**Gaps identificados:**
- Pueden no conocer Python (necesario para C10)
- Pueden no tener cuenta AWS (necesario para C11)
- Pueden no estar familiarizados con arquitectura hexagonal (C2)
- Pueden resistir el cambio de paradigma imperativo → reactivo

---

## 7. Oportunidades de Mejora Pedagógica

### 7.1 Faltantes Críticos

| Elemento Faltante | Impacto | Prioridad |
|---|---|---|
| Página de Bienvenida al curso | El estudiante no tiene contexto de "por qué estoy aquí" | CRÍTICA |
| Introducción al programa global | Sin visión del roadmap completo de 6 módulos | CRÍTICA |
| Evaluaciones / Autoevaluaciones | No hay forma de medir aprendizaje | ALTA |
| Recursos complementarios clasificados | Sin bibliografía, sin links de referencia centralizados | ALTA |
| Mapa de prerrequisitos entre clases | El estudiante no sabe qué necesita saber antes de cada clase | ALTA |
| Entregables claros por clase | "Reto" existe pero no está formalizado como entregable evaluable | ALTA |
| Glosario técnico | Estudiantes legacy no conocen todos los términos modernos | MEDIA |
| FAQ por clase | Preguntas frecuentes de cada tema | MEDIA |
| Casos de estudio adicionales | Solo hay BancoFiel como contexto | MEDIA |

### 7.2 Mejoras al Formato Pedagógico

| Mejora | Justificación |
|---|---|
| Agregar slide de objetivos al inicio de cada clase | El estudiante debe saber qué aprenderá antes de empezar |
| Agregar slide de resumen/checklist al final de cada clase | Cierre cognitivo del aprendizaje |
| Agregar tiempo estimado por sección | Ayuda a gestionar el ritmo de estudio |
| Incluir "siguiente clase" al final | Continuidad narrativa |
| Clasificar contenido por nivel (Básico/Intermedio/Avanzado) | Navegación personalizada |
| Incluir indicador de progreso del curso | Motivación del estudiante |

---

## 8. Análisis de la Narrativa del Curso

### 8.1 Hilo Conductor

El hilo conductor implícito es: **"BancoFiel"** — un banco ficticio con sistema legacy (VB6, SQL Server) que está migrando a arquitectura moderna con IA.

**Fortalezas del hilo conductor:**
- Es contextualmente relevante para la audiencia (muchos vienen de banca/finanzas)
- Permite casos de uso concretos y medibles
- Da continuidad entre clases

**Debilidades del hilo conductor:**
- No está explícitamente presentado como hilo conductor en ninguna parte
- Algunos estudiantes pueden no venir del sector bancario
- La narrativa se interrumpe en C10 (Python/RAG) y C11 (AWS) — no queda claro cómo se conecta a BancoFiel

### 8.2 Progresión de Roles del Estudiante

El curso enseña a los estudiantes a progresar en su rol:

```
Desarrollador Legacy  →  Prompt Engineer  →  AI Engineer  →  AI Architect
    (Entrada)              (Mes 1, C1)       (Mes 2-3)        (C12)
```

Esta progresión no está documentada explícitamente en el curso. Debería ser el elemento central de la narrativa pedagógica.

---

## 9. Análisis del Documento `study-plan-dev.md`

**Ubicación:** `public/study-plan-dev.md` (35.9 KB / 1,113 líneas)

Este documento parece ser la **versión original del plan de estudios** antes de que se expandiera a 12 semanas. Contiene:
- Plan de 1 mes / 20 días hábiles (vs. 3 meses del resto)
- El stack de BancoFiel en detalle
- Las 12 clases descritas de forma más narrativa
- El perfil del equipo de desarrollo objetivo

**Hallazgo importante:** Este archivo contiene información valiosa sobre el contexto del proyecto BancoFiel que no está en ningún componente Angular. Es un activo de contenido huérfano.

---

## 10. Clasificación del Contenido Existente en la Nueva Estructura

Para la nueva plataforma, todo el contenido existente se clasifica dentro de **Módulo 1: IA Generativa**:

| Contenido Actual | Sección Nueva | Categoría |
|---|---|---|
| `plan-dev-detallado` | Módulo 1 / Plan de Estudio | Navegación / Referencia |
| `installation-guides` | Módulo 1 / Recursos / Guías | Recurso Instrumental |
| `tech-stack` | Módulo 1 / Recursos / Referencias | Referencia Técnica |
| C1 — Fundamentos GenIA | M1 / Clase 1 | Clase Fundamentos |
| C2 — Spring Boot | M1 / Clase 2 | Clase Práctica |
| C3 — Migración Legacy | M1 / Clase 3 | Clase Práctica |
| C4 — APIs REST + MCP | M1 / Clase 4 | Clase Práctica |
| C5 — Testing Avanzado | M1 / Clase 5 | Clase Práctica |
| C6 — Angular Signals | M1 / Clase 6 | Clase Práctica |
| C7 — Frontend Legacy | M1 / Clase 7 | Clase Práctica |
| C8 — Estado RxJS | M1 / Clase 8 | Clase Práctica |
| C9 — Testing E2E | M1 / Clase 9 | Clase Práctica |
| C10 — RAG FastAPI | M1 / Clase 10 | Clase Práctica |
| C11 — Lambda Serverless | M1 / Clase 11 | Clase Práctica |
| C12 — Proyecto Final | M1 / Clase 12 | Proyecto Capstone |
| `study-plan-dev.md` | M1 / Documentación / Contexto BancoFiel | Recurso de Referencia |

---

## 11. Recomendaciones Pedagógicas para Nuevos Módulos

### Módulo 2 — Ingeniería de Contexto (propuesto)

Contenido sugerido basado en brechas identificadas:
- Context Engineering profundo (AGENTS.md avanzado)
- Gestión de ventana de contexto
- Técnicas de few-shot, chain-of-thought
- Prompt libraries y versioning

### Módulo 3 — Ingeniería de Agentes (propuesto)

Contenido sugerido:
- Arquitecturas de agentes (ReAct, Plan-and-Execute, Multi-Agent)
- MCP avanzado — servidor de producción
- Orquestación de agentes (LangGraph, CrewAI)
- Evaluación de agentes

### Módulo 4 — Automatización del Desarrollo (propuesto)

Contenido sugerido:
- CI/CD con IA (GitHub Actions + AI)
- Code review automatizado
- Generación de documentación técnica
- Análisis de deuda técnica con IA

---

## 12. Conclusión Pedagógica

El contenido existente representa un **Módulo 1 de alta calidad** para una plataforma educativa profesional. Sus fortalezas son:

1. **Relevancia técnica** — El stack 2026 es correcto y actualizado
2. **Contextualización** — BancoFiel como caso de uso concreto
3. **Progresión** — La curva de dificultad está bien calibrada
4. **Profundidad técnica** — No es un curso superficial de prompting

Sus brechas principales son:
1. **Falta de narrativa explícita** — El estudiante no ve el cuadro completo
2. **Sin evaluación** — No hay forma de medir el aprendizaje
3. **Sin diversidad de formatos** — Todo es slideshow
4. **Sin recursos complementarios** — Sin biblioteca de referencia

Estas brechas son precisamente lo que la nueva plataforma deberá resolver en las Fases 2-7 del Master Plan.

---

*Documento de solo lectura — No se modificó ningún archivo del proyecto.*
*Siguiente: `docs/NEW_STRUCTURE.md`*
