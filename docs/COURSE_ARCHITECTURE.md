# COURSE ARCHITECTURE — Arquitectura Definitiva de la Academia
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Rol:** Product Architect + Instructional Designer  
**Versión:** 1.0.0 — Documento normativo. No implementa código.  
**Audiencia:** Ingenieros de software senior con experiencia en tecnologías legacy (VB6, COBIS, .NET, SQL Server).

---

## 0. Visión y Propósito

### 0.1 Nombre de la Academia

> **CASE Academy**  
> *Code · Architect · Ship · Engineer*

### 0.2 Misión

Formar ingenieros de software senior capaces de diseñar, construir y operar sistemas empresariales modernos utilizando IA Generativa como multiplicador de productividad — sin sacrificar criterio técnico, seguridad ni calidad.

### 0.3 Propuesta de Valor

| Para... | El problema actual es... | CASE Academy ofrece... |
|---|---|---|
| Ingenieros legacy (VB6/COBIS) | La brecha con el stack moderno parece insalvable | Un camino de migración concreto, clase a clase, con IA como acelerador |
| Equipos corporativos | Los cursos de IA son superficiales o teóricos | Casos de uso bancarios reales (BancoFiel) aplicables el día siguiente |
| Architects | La IA se usa sin criterio ni gobernanza | Un framework de arquitectura para sistemas AI-native enterprise |
| Tech Leads | No hay una metodología para AI-assisted development | El CASE Framework: roles, artefactos, flujos y métricas |

### 0.4 Narrativa Central: BancoFiel

**BancoFiel** es el caso de uso transversal de toda la academia. Un banco con +500,000 usuarios activos que migra de un sistema legacy (VB6, SQL Server, Java 8) a una arquitectura moderna AI-native (Java 21, Spring Boot 3.4, Angular 22, Python 3.13, AWS).

Cada módulo, cada clase y cada laboratorio utiliza este contexto. El estudiante no aprende en abstracto — aprende mientras moderniza un banco real.

---

## 1. Mapa Completo del Curso

### 1.1 Diagrama de la Academia

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          CASE ACADEMY                                      ║
║              AI-Driven Software Engineering for Enterprise                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║  │  ONBOARDING  ·  Bienvenida  ·  Perfil  ·  Roadmap  ·  Setup        │  ║
║  └─────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ║
║  │  MÓDULO 1    │  │  MÓDULO 2    │  │  MÓDULO 3    │  │  MÓDULO 4    │  ║
║  │  CASE        │  │  Context     │  │  Agent       │  │  Dev         │  ║
║  │  Foundations │  │  Engineering │  │  Engineering │  │  Automation  │  ║
║  │  LIVE ✅     │  │  Q3 2026 🔒  │  │  Q4 2026 🔒  │  │  Q1 2027 🔒  │  ║
║  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  ║
║                                                                            ║
║  ┌──────────────┐  ┌──────────────┐                                       ║
║  │  MÓDULO 5    │  │  MÓDULO 6    │                                       ║
║  │  Enterprise  │  │  AI Quality  │                                       ║
║  │  Architecture│  │  & Governance│                                       ║
║  │  Q2 2027 🔒  │  │  Q3 2027 🔒  │                                       ║
║  └──────────────┘  └──────────────┘                                       ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║  │  BIBLIOTECA  ·  LABORATORIOS  ·  FRAMEWORK  ·  COMUNIDAD           │  ║
║  └─────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║  │  CERTIFICACIÓN  ·  CASE Certified AI Engineer                       │  ║
║  └─────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### 1.2 Progresión del Estudiante

El estudiante recorre la academia en una progresión de roles explícita:

```
    ENTRADA                                                    SALIDA
       │                                                          │
  Dev Legacy           Prompt         AI              CASE        │
  (VB6/COBIS)   ─►   Engineer   ─►  Engineer   ─►  Architect     │
       │              (M1·C1)      (M1·C5-C12)      (M3-M6)      │
       │                                                          │
  Herramientas:    AGENTS.md      MCP Servers     Multi-Agent     │
  VB6, Java 8,     Prompts        RAG · Lambda    Orquestación    │
  SQL Server        estructurados  CI/CD + IA      Gobernanza      │
```

### 1.3 Tabla de Módulos

| # | Módulo | Alias | Duración | Estado | Semanas |
|---|---|---|---|---|---|
| M1 | **CASE Foundations** | `case-foundations` | 12 semanas | ✅ LIVE | 1–12 |
| M2 | **Context Engineering** | `context-engineering` | 8 semanas | 🔒 Q3 2026 | 13–20 |
| M3 | **Agent Engineering** | `agent-engineering` | 8 semanas | 🔒 Q4 2026 | 21–28 |
| M4 | **Dev Automation** | `dev-automation` | 6 semanas | 🔒 Q1 2027 | 29–34 |
| M5 | **Enterprise Architecture** | `enterprise-architecture` | 6 semanas | 🔒 Q2 2027 | 35–40 |
| M6 | **AI Quality & Governance** | `ai-quality-governance` | 4 semanas | 🔒 Q3 2027 | 41–44 |

**Duración total del programa:** 44 semanas (~11 meses)  
**Dedicación recomendada:** 3–5 horas/semana

---

## 2. Módulo 1 — CASE Foundations ✅

> **"De Desarrollador Legacy a AI Engineer en 12 semanas"**

### 2.1 Descripción

CASE Foundations es el módulo de entrada a la academia. Cubre el stack tecnológico completo que un equipo de BancoFiel necesita dominar para modernizar su sistema: Backend Java, Frontend Angular, Testing automatizado, RAG con Python, y Cloud con AWS. Todo con IA Generativa como herramienta transversal.

### 2.2 Perfil de Entrada (Prerrequisitos)

| Conocimiento | Nivel Requerido |
|---|---|
| Programación orientada a objetos (Java, C#, VB.NET) | Intermedio |
| SQL y bases de datos relacionales | Intermedio |
| Control de versiones (Git) | Básico |
| Conceptos de REST APIs | Básico |
| Terminal / Command Line | Básico |
| IA Generativa (uso casual) | Ninguno requerido |

### 2.3 Perfil de Salida (Competencias Logradas)

Al completar M1, el estudiante puede:

- [ ] Diseñar microservicios Java 21 / Spring Boot 3.4 con arquitectura hexagonal usando IA
- [ ] Migrar código VB6/Java 8 a Spring Boot con asistencia de agentes
- [ ] Construir APIs REST resilientes con Circuit Breaker, Retry y un servidor MCP propio
- [ ] Desarrollar componentes Angular 22 con Signals, Standalone Components y estado reactivo
- [ ] Modernizar frontends legacy (jQuery/Angular 14) con IA como guía de migración
- [ ] Implementar testing unitario (JUnit 5 + Mockito) y E2E (Playwright/Cypress) con Agentic Self-Fixing
- [ ] Construir sistemas RAG con Python 3.12, FastAPI y Vector Databases
- [ ] Desplegar funciones serverless con AWS Lambda + Amazon Bedrock + Guardrails
- [ ] Entregar un proyecto integrador de 4 microservicios con CI/CD completo

### 2.4 Organización Interna del Módulo 1

```
M1 — CASE Foundations
│
├── BLOQUE A: AI Developer Toolkit (Semanas 1–4)
│   ├── C1  Fundamentos de IA Generativa         ★★☆☆☆
│   ├── C2  Spring Boot con IA                   ★★★☆☆
│   ├── C3  Migración Legacy VB6 → Spring Boot   ★★★★☆
│   └── C4  APIs Resilientes + Servidor MCP      ★★★★☆
│
├── BLOQUE B: Full-Stack AI Development (Semanas 5–8)
│   ├── C5  Testing Avanzado + Agentic Self-Fix  ★★★☆☆
│   ├── C6  Angular Signals + Standalone         ★★★☆☆
│   ├── C7  Modernización Frontend Legacy        ★★★★☆
│   └── C8  Estado Reactivo (Signals + RxJS)     ★★★★★
│
├── BLOQUE C: AI-Native Enterprise Systems (Semanas 9–11)
│   ├── C9  Testing E2E + Self-Healing           ★★★☆☆
│   ├── C10 RAG con Python 3.12 + FastAPI        ★★★★☆
│   └── C11 AWS Lambda + Bedrock + Guardrails    ★★★★☆
│
└── PROYECTO FINAL (Semana 12)
    └── C12 Sistema de Aprobación Crediticia      ★★★★★
```

### 2.5 Fichas de Cada Clase

---

#### C1 — Fundamentos de IA Generativa para Developers

| Campo | Valor |
|---|---|
| **Semana** | 1 |
| **Bloque** | A — AI Developer Toolkit |
| **Duración** | 90 min |
| **Dificultad** | ★★☆☆☆ Introductorio |
| **Tipo** | Clase magistral + Configuración |
| **Ruta actual** | `/clase1-dev-fundamentos` |
| **Ruta nueva** | `/m1/clase/1` |

**Objetivos de aprendizaje:**
1. Distinguir IA, ML y IA Generativa con casos de uso de desarrollo de software
2. Configurar el entorno de trabajo con Gemini, Claude, Copilot y Cursor
3. Escribir prompts estructurados (ROL / CONTEXTO / TAREA / RESTRICCIONES)
4. Identificar y mitigar las limitaciones de la IA en contexto empresarial
5. Crear el primer `AGENTS.md` del proyecto BancoFiel

**Slides del contenido:**
- S1: Modelos de razonamiento (Gemini, DeepSeek, Claude, OpenAI) — comparativa
- S2: Model Context Protocol (MCP) — introducción y ecosistema
- S3: Spec-Driven Development con `AGENTS.md`
- S4: Agentes de código autónomos
- S5: Prompts estructurados vs. casuales — contraste con ejemplos reales
- S6: Limitaciones críticas (alucinaciones, IP, seguridad, desactualización)
- S7: Buenas prácticas para developers enterprise
- S8: **Reto:** Crear `AGENTS.md` del módulo de Gestión de Clientes de BancoFiel

**Entregable:** `AGENTS.md` del proyecto BancoFiel con contexto, stack y restricciones.  
**Prerrequisitos:** Ninguno.  
**Conecta con:** C2 — el `AGENTS.md` se usa como contexto en los prompts de Spring Boot.

---

#### C2 — Microservicio Spring Boot con IA

| Campo | Valor |
|---|---|
| **Semana** | 2 |
| **Bloque** | A — AI Developer Toolkit |
| **Duración** | 90 min |
| **Dificultad** | ★★★☆☆ Intermedio |
| **Tipo** | Taller práctico |
| **Ruta actual** | `/clase2-dev-spring-boot` |
| **Ruta nueva** | `/m1/clase/2` |

**Objetivos de aprendizaje:**
1. Diseñar arquitectura hexagonal con asistencia de IA
2. Generar entidades JPA, DTOs, Repositories y Services con prompts estructurados
3. Implementar Virtual Threads en Java 21
4. Exponer APIs REST documentadas con OpenAPI/Swagger
5. Validar entradas con Bean Validation y Java Records

**Entregable:** Microservicio `ms-clientes` funcional con Swagger, tests y CI básico.  
**Prerrequisitos:** C1 — AGENTS.md del proyecto.  
**Conecta con:** C3 (el ms-clientes se usa como referencia de migración), C4 (se integra a la API resiliente).

---

#### C3 — Migración Legacy VB6 → Spring Boot

| Campo | Valor |
|---|---|
| **Semana** | 3 |
| **Bloque** | A — AI Developer Toolkit |
| **Duración** | 90 min |
| **Dificultad** | ★★★★☆ Avanzado |
| **Tipo** | Taller de migración |
| **Ruta actual** | `/clase3-dev-migracion-legacy` |
| **Ruta nueva** | `/m1/clase/3` |

**Objetivos de aprendizaje:**
1. Analizar código VB6/Java 8 con IA para detectar reglas de negocio ocultas
2. Mapear Stored Procedures SQL a Spring Data JPA
3. Preservar lógica de negocio durante la refactorización
4. Documentar decisiones de migración con IA como co-autor

**Entregable:** Módulo de Préstamos migrado de VB6 a Spring Boot 3.4, con tests de regresión.  
**Prerrequisitos:** C2 — conocimiento de la arquitectura Spring Boot objetivo.  
**Conecta con:** C5 — el módulo migrado requiere cobertura de tests ≥80%.

---

#### C4 — APIs REST Resilientes + Servidor MCP

| Campo | Valor |
|---|---|
| **Semana** | 4 |
| **Bloque** | A — AI Developer Toolkit |
| **Duración** | 90 min |
| **Dificultad** | ★★★★☆ Avanzado |
| **Tipo** | Taller avanzado |
| **Ruta actual** | `/clase4-dev-integracion-apis` |
| **Ruta nueva** | `/m1/clase/4` |

**Objetivos de aprendizaje:**
1. Implementar Circuit Breaker y Retry con Resilience4j
2. Integrar Redis como caché de respuestas de APIs externas
3. Diseñar y publicar un Servidor MCP propio con TypeScript SDK
4. Conectar el servidor MCP al agente de código para automatizar tareas

**Entregable:** Servidor MCP de BancoFiel con 3 herramientas: `buscar-cliente`, `calcular-scoring`, `generar-reporte`.  
**Prerrequisitos:** C2, C3.  
**Conecta con:** M2 (el MCP se expande en Context Engineering), C12 (usado en el proyecto final).

---

#### C5 — Testing Avanzado + Agentic Self-Fixing

| Campo | Valor |
|---|---|
| **Semana** | 5 |
| **Bloque** | B — Full-Stack AI Development |
| **Duración** | 90 min |
| **Dificultad** | ★★★☆☆ Intermedio |
| **Tipo** | Taller QA |
| **Ruta actual** | `/clase5-dev-testing-avanzado` |
| **Ruta nueva** | `/m1/clase/5` |

**Objetivos de aprendizaje:**
1. Implementar tests unitarios con JUnit 5 + Mockito + Testcontainers
2. Configurar JaCoCo para cobertura ≥80%
3. Construir un bucle de Agentic Self-Fixing: test falla → IA genera fix → test pasa
4. Integrar el ciclo en GitHub Actions

**Entregable:** Suite de tests con cobertura ≥80% y pipeline de autocorrección.  
**Prerrequisitos:** C2, C3.  
**Conecta con:** C9 (extensión al testing E2E), C12 (testing del proyecto final).

---

#### C6 — Frontend Angular 22 con Signals

| Campo | Valor |
|---|---|
| **Semana** | 6 |
| **Bloque** | B — Full-Stack AI Development |
| **Duración** | 90 min |
| **Dificultad** | ★★★☆☆ Intermedio |
| **Tipo** | Taller Frontend |
| **Ruta actual** | `/clase6-dev-modulo-angular` |
| **Ruta nueva** | `/m1/clase/6` |

**Objetivos de aprendizaje:**
1. Construir Standalone Components con Angular Signals (`signal()`, `computed()`, `effect()`)
2. Usar el nuevo control flow (`@if`, `@for`, `@switch`)
3. Reemplazar Zone.js con Change Detection granular
4. Integrar Tailwind CSS para diseño de componentes UI

**Entregable:** Pantalla de Gestión de Clientes con Standalone Components y Signals.  
**Prerrequisitos:** Experiencia Angular ≥v14.  
**Conecta con:** C7, C8, C12.

---

#### C7 — Modernización Frontend Legacy

| Campo | Valor |
|---|---|
| **Semana** | 7 |
| **Bloque** | B — Full-Stack AI Development |
| **Duración** | 90 min |
| **Dificultad** | ★★★★☆ Avanzado |
| **Tipo** | Taller de migración |
| **Ruta actual** | `/clase7-dev-frontend-legacy` |
| **Ruta nueva** | `/m1/clase/7` |

**Objetivos de aprendizaje:**
1. Analizar componentes Angular 14/jQuery con IA para identificar patrones legacy
2. Migrar a Angular 22 con OnPush + Signals granulares
3. Aplicar el patrón Smart/Dumb Components
4. Generar tests de regresión visual durante la migración con IA

**Entregable:** Módulo legacy migrado: 1 SmartComponent + 3 DumbComponents + tests.  
**Prerrequisitos:** C6.  
**Conecta con:** C8 — gestión de estado del módulo migrado.

---

#### C8 — Estado Reactivo Avanzado

| Campo | Valor |
|---|---|
| **Semana** | 8 |
| **Bloque** | B — Full-Stack AI Development |
| **Duración** | 90 min |
| **Dificultad** | ★★★★★ Experto |
| **Tipo** | Taller avanzado |
| **Ruta actual** | `/clase8-dev-estado-rxjs` |
| **Ruta nueva** | `/m1/clase/8` |

**Objetivos de aprendizaje:**
1. Integrar Signals con RxJS (de `Observable` a `toSignal()`)
2. Implementar NgRx Signal Store para estado global
3. Diseñar el flujo completo: API → Service (RxJS) → Store (Signals) → Template
4. Gestionar loading states, error states y optimistic updates

**Entregable:** Store global de BancoFiel con estado de Clientes, Préstamos y Decisiones.  
**Prerrequisitos:** C6, C7.  
**Conecta con:** C12 — el store es la base del estado del proyecto final.

---

#### C9 — Testing E2E + Self-Healing

| Campo | Valor |
|---|---|
| **Semana** | 9 |
| **Bloque** | C — AI-Native Enterprise Systems |
| **Duración** | 90 min |
| **Dificultad** | ★★★☆☆ Intermedio |
| **Tipo** | Taller QA |
| **Ruta actual** | `/clase9-dev-testing-e2e` |
| **Ruta nueva** | `/m1/clase/9` |

**Objetivos de aprendizaje:**
1. Escribir tests E2E con Playwright (comparativa con Cypress)
2. Detectar selectores rotos en CI/CD con alertas automáticas
3. Implementar Self-Healing tests con IA
4. Diseñar estrategia E2E para BancoFiel: smoke, regression, critical paths

**Entregable:** Suite E2E del flujo Registro → Solicitud → Decisión con Self-Healing.  
**Prerrequisitos:** C5, C6.  
**Conecta con:** C12 — los tests E2E cubren el proyecto final completo.

---

#### C10 — RAG con Python 3.12 + FastAPI

| Campo | Valor |
|---|---|
| **Semana** | 10 |
| **Bloque** | C — AI-Native Enterprise Systems |
| **Duración** | 90 min |
| **Dificultad** | ★★★★☆ Avanzado |
| **Tipo** | Taller AI / RAG |
| **Ruta actual** | `/clase10-dev-fastapi` |
| **Ruta nueva** | `/m1/clase/10` |

**Objetivos de aprendizaje:**
1. Entender la arquitectura RAG (Retrieval-Augmented Generation)
2. Indexar documentos (normativas bancarias) en PgVector / ChromaDB
3. Generar embeddings con OpenAI / Ollama para búsqueda semántica
4. Exponer el sistema RAG como microservicio con FastAPI
5. Integrar el RAG al MS-Decisión de BancoFiel para justificar decisiones crediticias

**Pre-lectura recomendada:** LAB-PY01 — Python para Developers Java.

**Entregable:** `ms-scoring-rag` que responde preguntas sobre normativa bancaria usando RAG.  
**Prerrequisitos:** C2, C4.  
**Conecta con:** C11 (el RAG se despliega en Lambda), C12 (uno de los 4 microservicios del proyecto final).

---

#### C11 — AWS Lambda + Amazon Bedrock + Guardrails

| Campo | Valor |
|---|---|
| **Semana** | 11 |
| **Bloque** | C — AI-Native Enterprise Systems |
| **Duración** | 90 min |
| **Dificultad** | ★★★★☆ Avanzado |
| **Tipo** | Taller Cloud |
| **Ruta actual** | `/clase11-dev-lambda-serverless` |
| **Ruta nueva** | `/m1/clase/11` |

**Objetivos de aprendizaje:**
1. Desplegar funciones serverless con AWS Lambda (Node.js/Python) + SAM
2. Integrar Amazon Bedrock como LLM backbone del sistema
3. Configurar Guardrails para datos sensibles del contexto bancario
4. Diseñar el flujo: S3 Upload → Lambda Trigger → Bedrock → DynamoDB

**Nota de acceso:** Requiere cuenta AWS. Ver LAB-AWS01 para entorno sandbox gratuito.

**Entregable:** `lambda-orchestrator` que procesa lotes CSV de solicitudes con Bedrock.  
**Prerrequisitos:** C10.  
**Conecta con:** C12 — el 4to microservicio del proyecto final.

---

#### C12 — Proyecto Final: Sistema de Aprobación Crediticia

| Campo | Valor |
|---|---|
| **Semana** | 12 |
| **Bloque** | Proyecto Final |
| **Duración** | 180 min (sesión doble) |
| **Dificultad** | ★★★★★ Experto |
| **Tipo** | Proyecto Capstone |
| **Ruta actual** | `/clase12-dev-proyecto-final` |
| **Ruta nueva** | `/m1/clase/12` |

**Descripción:**
Sistema completo de Aprobación Crediticia AI-Native para BancoFiel. Integra todo lo aprendido en M1 en una arquitectura de 4 microservicios con CI/CD completo y cobertura de tests ≥80%.

**Arquitectura del Proyecto:**

```
┌─────────────────────────────────────────────────────────────┐
│              SISTEMA DE APROBACIÓN CREDITICIA               │
│                     BancoFiel · M1 Capstone                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Angular 22 Frontend]                                     │
│         │ HTTP                                              │
│         ▼                                                   │
│   [API Gateway / NGINX]                                     │
│    ┌────┴────────────────────┐                              │
│    ▼                         ▼                              │
│ [MS Clientes]         [MS Decisión]                         │
│ Java 21 · :8081       Java 21 · :8082                       │
│ PostgreSQL             PostgreSQL                           │
│                   [MS Scoring]                              │
│                   Python · :8000                            │
│                   FastAPI + RAG                             │
│         [Lambda Orchestrator]                               │
│         Node.js + TypeScript                                │
│         S3 → Bedrock → DynamoDB                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Historias de Usuario (HUs) a implementar:**

| HU | Título | Actor | Criterios Clave |
|---|---|---|---|
| HU-001 | Registro de Cliente | Oficial de crédito | Validaciones en tiempo real, RFC único, respuesta <500ms |
| HU-002 | Solicitud de Préstamo | Oficial de crédito | Scoring 0–1000, decisión APROBADO/RECHAZADO, persistencia |
| HU-003 | Consulta de Historial | Gerente | Tabla paginada, filtros, exportación CSV, carga <2s |
| HU-004 | Procesamiento Batch CSV | Sistema | Lambda trigger, decisiones bulk, notificación de resultados |

**Entregable final (requisitos de aprobación):**
```
✅ 4 microservicios corriendo en Docker Compose local
✅ Frontend Angular 22 integrado a los 4 servicios
✅ Tests unitarios cobertura ≥80% (JaCoCo + Pytest)
✅ Tests E2E cubriendo los 4 flujos principales (Playwright)
✅ README con diagrama de arquitectura, setup y decisiones técnicas
✅ Pipeline CI/CD en GitHub Actions: build + tests + deploy
✅ Servidor MCP de BancoFiel con al menos 3 tools funcionando
```

**Rúbrica de evaluación:**

| Criterio | Peso | Descripción |
|---|---|---|
| Funcionalidad (HUs) | 40% | Las 4 HUs implementadas y funcionando |
| Calidad de código | 20% | TypeScript strict, ESLint clean, sin code smells |
| Testing | 20% | Cobertura ≥80% backend, flujos E2E completos |
| Arquitectura | 10% | Hexagonal, Smart/Dumb, MCP correctamente aplicados |
| Documentación | 10% | AGENTS.md completo, README con ADRs |

---

### 2.6 Recursos del Módulo 1

| Recurso | Tipo | Ruta |
|---|---|---|
| Plan de Estudio Detallado | Reference | `/m1/recursos/plan` |
| Guías de Instalación | Guide | `/m1/recursos/instalacion` |
| Tech Stack BancoFiel | Reference | `/m1/recursos/tech-stack` |
| Contexto BancoFiel (study-plan-dev.md) | Context | Biblioteca > Contextos |

---

## 3. Módulos Futuros — Diseño Conceptual

### 3.1 Módulo 2 — Context Engineering 🔒

> **"El código que la IA produce es tan bueno como el contexto que le das"**

**Duración:** 8 semanas | **Semanas:** 13–20 | **Estado:** En diseño pedagógico

**¿Por qué después de M1?**  
En M1 el estudiante usa el contexto de forma intuitiva. M2 convierte esa práctica en disciplina formal y medible.

**Submódulos:**

| # | Submódulo | Semanas | Enfoque |
|---|---|---|---|
| 2.1 | `AGENTS.md` Avanzado | 13–14 | Especificaciones profundas, capas de contexto, versionado |
| 2.2 | Gestión de Ventana de Contexto | 15–16 | Token budgeting, compresión semántica, memoria episódica |
| 2.3 | Técnicas Avanzadas de Prompting | 17–18 | Few-shot, Chain-of-Thought, Tree-of-Thoughts, meta-prompting |
| 2.4 | Prompt Libraries y Governance | 19–20 | Repositorios de prompts, versionado, A/B testing |

**Proyecto M2:** Biblioteca de Prompts Corporativa de BancoFiel con métricas de efectividad.  
**Certificación parcial:** CASE Context Engineer (CC)

---

### 3.2 Módulo 3 — Agent Engineering 🔒

> **"Agentes que trabajan mientras duermes"**

**Duración:** 8 semanas | **Semanas:** 21–28 | **Estado:** En diseño pedagógico

**Submódulos:**

| # | Submódulo | Semanas | Enfoque |
|---|---|---|---|
| 3.1 | Arquitecturas de Agentes | 21–22 | ReAct, Plan-and-Execute, Reflection, Self-Refinement |
| 3.2 | MCP Avanzado — Producción | 23–24 | MCP enterprise: autenticación, rate limiting, logging |
| 3.3 | Orquestación Multi-Agente | 25–26 | LangGraph, CrewAI, AutoGen — patrones y anti-patrones |
| 3.4 | Evaluación y Testing de Agentes | 27–28 | Métricas, evals, benchmarks, detección de regresión |

**Proyecto M3:** Sistema de Agentes para BancoFiel — análisis de código + generación de tests + revisión de PRs.  
**Certificación parcial:** CASE Agent Engineer (CA)

---

### 3.3 Módulo 4 — Dev Automation 🔒

> **"CI/CD inteligente que se autocorrige"**

**Duración:** 6 semanas | **Semanas:** 29–34

**Submódulos:**

| # | Submódulo | Semanas | Enfoque |
|---|---|---|---|
| 4.1 | GitHub Actions + IA | 29–30 | Pipelines con detección automática de fallos |
| 4.2 | Code Review Automatizado | 31–32 | Review con IA, linting contextual, security scanning |
| 4.3 | Documentación Técnica con IA | 33 | ADRs, READMEs, diagramas generados desde el código |
| 4.4 | Deuda Técnica con IA | 34 | Detección, clasificación y priorización |

**Proyecto M4:** Pipeline de automatización completo para el repositorio de BancoFiel.

---

### 3.4 Módulo 5 — Enterprise Architecture 🔒

> **"Diseñar sistemas que escalan con IA como primer ciudadano"**

**Duración:** 6 semanas | **Semanas:** 35–40

**Submódulos:**

| # | Submódulo | Semanas | Enfoque |
|---|---|---|---|
| 5.1 | Event-Driven Architecture + IA | 35–36 | Kafka, EventBridge, Event Sourcing con IA |
| 5.2 | Microservicios AI-Native | 37–38 | Service mesh, observabilidad, tracing con LLMs |
| 5.3 | Data Architecture para IA | 39 | Feature stores, vector DBs en producción, data lineage |
| 5.4 | ADRs con IA | 40 | ADRs generados y evaluados con IA, simulación de trade-offs |

**Proyecto M5:** Rediseño de la arquitectura completa de BancoFiel como AI-Native.

---

### 3.5 Módulo 6 — AI Quality & Governance 🔒

> **"IA responsable en producción: seguridad, auditoría y compliance"**

**Duración:** 4 semanas | **Semanas:** 41–44

**Submódulos:**

| # | Submódulo | Semanas | Enfoque |
|---|---|---|---|
| 6.1 | Seguridad en sistemas con IA | 41–42 | Prompt injection, jailbreaking, data exfiltration, guardrails |
| 6.2 | Compliance y Auditoría | 43 | GDPR, PCI-DSS, trazabilidad de decisiones IA en banca |
| 6.3 | Governance Framework | 44 | Políticas, roles, métricas, revisión de uso IA en empresa |

**Proyecto M6:** Framework de Governance de IA para BancoFiel.

---

## 4. Biblioteca — CASE Library

### 4.1 Propósito

La Biblioteca contiene recursos reutilizables consultables antes, durante y después de cualquier módulo. Son el resultado destilado del programa — no prerequisitos, sino cristalizaciones del conocimiento.

### 4.2 Catálogo Completo

```
CASE Library
│
├── 📁 Agentes (7 definiciones)
│   ├── agente-java-architect        — Arquitectura hexagonal, microservicios, patrones
│   ├── agente-spring-boot-developer — JPA, REST, validaciones, tests
│   ├── agente-legacy-migrator       — VB6/Java8 → Spring Boot, SQL → JPA
│   ├── agente-angular-developer     — Signals, NgRx, Tailwind, testing Angular
│   ├── agente-testing-engineer      — JUnit 5, Mockito, Playwright, Self-Fixing
│   ├── agente-python-ai-engineer    — FastAPI, RAG, embeddings, LangChain
│   └── agente-aws-architect         — Lambda, Bedrock, SAM, Guardrails
│
├── 📁 Contextos — AGENTS.md (6 plantillas)
│   ├── contexto-bancofiel-global    — Contexto maestro del proyecto
│   ├── contexto-ms-clientes         — Microservicio de clientes
│   ├── contexto-ms-scoring          — Scoring crediticio
│   ├── contexto-ms-decision         — Lógica de decisión
│   ├── contexto-frontend-angular    — Frontend BancoFiel
│   └── contexto-infraestructura-aws — Infraestructura cloud
│
├── 📁 Prompts (7 colecciones)
│   ├── prompts-arquitectura         — Diseño hexagonal, diagramas C4, ADRs
│   ├── prompts-backend-java         — Entidades JPA, Services, Controllers, DTOs
│   ├── prompts-migracion-legacy     — Análisis VB6, migración SQL→JPA
│   ├── prompts-frontend-angular     — Signals, NgRx, formularios reactivos
│   ├── prompts-testing              — JUnit 5, Mockito, E2E, Self-Healing
│   ├── prompts-python-rag           — Embeddings, chunking, retrieval
│   └── prompts-code-review          — Revisión de arquitectura, seguridad, deuda
│
├── 📁 Patrones (6 fichas)
│   ├── patron-hexagonal-con-ia      — Arquitectura hexagonal con prompts + IA
│   ├── patron-rag-enterprise        — RAG para sistemas con datos sensibles
│   ├── patron-mcp-server-produccion — MCP enterprise: auth, rate limiting, logging
│   ├── patron-agentic-self-fixing   — Bucle test-falla → IA-fix → test-pasa
│   ├── patron-smart-dumb-components — Separación en Angular con Signals
│   └── patron-migration-legacy-ai   — Migración legacy paso a paso con IA
│
├── 📁 Checklists (6 listas)
│   ├── checklist-code-review-ia     — Qué verificar en código generado por IA
│   ├── checklist-migracion-vb6      — Pasos para migrar módulo VB6
│   ├── checklist-microservicio-java — Qué debe tener un ms listo para producción
│   ├── checklist-seguridad-prompt   — Prevención de prompt injection y data leakage
│   ├── checklist-deploy-produccion  — Antes de hacer push a producción
│   └── checklist-arquitectura-review— Criterios para revisar una arquitectura
│
├── 📁 Templates (6 plantillas)
│   ├── template-agents-md           — AGENTS.md con todas las secciones
│   ├── template-prompt-estructurado — ROL / CONTEXTO / TAREA / RESTRICCIONES
│   ├── template-adr                 — Architecture Decision Record
│   ├── template-plan-migracion      — Plan de migración de módulo legacy
│   ├── template-readme-microservicio— README estándar para ms de BancoFiel
│   └── template-historia-usuario    — Historia de usuario con criterios de aceptación
│
└── 📁 Casos de Estudio (4 casos)
    ├── caso-bancofiel-migracion-prestamos — Módulo Préstamos VB6 → Spring Boot
    ├── caso-bancofiel-rag-normativa       — RAG sobre normativa bancaria
    ├── caso-bancofiel-lambda-scoring      — Lambda batch scoring crediticio
    └── caso-migracion-angular-legado      — Angular 14 NgModules → 22 Standalone
```

---

## 5. Laboratorios — CASE Labs

### 5.1 Propósito

Los labs son entornos de práctica guiada, independientes de las clases. Cada lab tiene instrucciones paso a paso, código starter, solución final y criterios de aceptación.

### 5.2 Catálogo Completo

| ID | Nombre | Duración | Dificultad | Prerrequisito para |
|---|---|---|---|---|
| LAB-PY01 | Python para Developers Java | 2 h | ★★☆☆☆ | C10 |
| LAB-AWS01 | Entorno AWS Sandbox | 1 h | ★★☆☆☆ | C11 |
| LAB-DOCKER01 | Docker + Docker Compose | 1.5 h | ★★★☆☆ | C12 |
| LAB-MCP01 | Primer Servidor MCP desde Cero | 2 h | ★★★☆☆ | C4 (extensión) |
| LAB-RAG01 | RAG con Ollama (sin API de pago) | 30 min | ★★☆☆☆ | Complemento C10 |
| LAB-SIGNALS01 | Migrar NgModule a Standalone + Signals | 1 h | ★★★☆☆ | C6, C7 |
| LAB-HEXAGONAL01 | Arquitectura Hexagonal Paso a Paso | 2 h | ★★★★☆ | Complemento C2 |
| LAB-AGENTS01 | Primer Agente con LangGraph | 2 h | ★★★★☆ | Preparación M3 |

---

## 6. Proyecto Final de la Academia — CASE Capstone

### 6.1 Denominación

**CASE Capstone Project — BancoFiel AI-Native Platform**

### 6.2 Concepto

Al completar los 6 módulos, el estudiante habrá construido de forma incremental la plataforma completa de BancoFiel AI-Native. No es un proyecto nuevo — es la culminación de todos los entregables de cada módulo integrados en una solución cohesiva.

### 6.3 Arquitectura Final del Capstone

```
╔═══════════════════════════════════════════════════════════════════════╗
║          BANCOFIEL AI-NATIVE PLATFORM — CAPSTONE ARCHITECTURE        ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  CAPA DE INTELIGENCIA ARTIFICIAL                                      ║
║  ┌──────────────────┐  ┌────────────────────┐  ┌──────────────────┐ ║
║  │  Context Library │  │ Agent Orchestrator │  │ Prompt Registry  │ ║
║  │  (M2)            │  │ LangGraph (M3)     │  │ (M2)             │ ║
║  └──────────────────┘  └────────────────────┘  └──────────────────┘ ║
║                                                                       ║
║  CAPA DE APLICACIÓN (M1)                                             ║
║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   ║
║  │MS Clientes │ │MS Scoring  │ │MS Decisión │ │Lambda Orchestr.│   ║
║  │Java 21     │ │FastAPI/RAG │ │Java 21     │ │Node.js+Bedrock │   ║
║  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   ║
║                                                                       ║
║  CAPA FRONTEND (M1)                                                  ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │         Angular 22 · Signals · NgRx Store · Tailwind          │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                       ║
║  CAPA DE AUTOMATIZACIÓN (M4)                                         ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │ GitHub Actions · Code Review AI · Doc Generation · Debt Score │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                       ║
║  CAPA DE GOBERNANZA (M6)                                             ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │ AI Policy · Audit Log · Prompt Registry · Compliance Report   │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 6.4 Rúbrica del Capstone Final

| Dimensión | Peso | Criterios |
|---|---|---|
| Funcionalidad completa | 30% | Todas las HUs de los 6 módulos implementadas y funcionando |
| Arquitectura AI-Native | 20% | Context Engineering + Agent Orchestration integrados |
| Calidad del código | 15% | SonarQube grade A, cobertura ≥85%, TypeScript strict |
| Testing exhaustivo | 15% | Unit + Integration + E2E + Agent evals |
| Documentación técnica | 10% | AGENTS.md, ADRs, README, diagramas C4 generados con IA |
| Gobernanza de IA | 10% | Política de uso, guardrails configurados, audit log |

---

## 7. Sistema de Certificación

### 7.1 Árbol de Certificaciones

```
CASE Academy — Mapa de Certificaciones

  M1 ──► CASE Certified Foundations Engineer         (CF)
  M2 ──► CASE Certified Context Engineer             (CC)
  M3 ──► CASE Certified Agent Engineer               (CA)
  M4 ──► CASE Certified DevOps AI Engineer           (CD)
M1-M4 ──► CASE Certified AI Engineer                 (CE)  ← intermedia
  M5 ──► CASE Certified Enterprise Architect         (CEA)
  M6 ──► CASE Certified AI Governance Specialist     (CGS)
M1-M6 ──► CASE Certified AI Engineering Lead         (CL)  ← máxima
```

### 7.2 Requisitos por Certificación

#### CASE Certified Foundations Engineer (CF) — Entrada

- ✅ Completar las 12 clases del Módulo 1
- ✅ Aprobar el Proyecto Final C12 con rúbrica ≥70%
- ✅ Completar al menos 4 laboratorios del catálogo M1
- ✅ Autoevaluación final con ≥75% de respuestas correctas

#### CASE Certified AI Engineer (CE) — Intermedia

- ✅ CASE CF obtenida
- ✅ M2 y M3 completados (CC y CA obtenidas)
- ✅ Proyecto M3 aprobado con rúbrica ≥75%
- ✅ Portfolio de 3 entregables publicados en GitHub

#### CASE Certified AI Engineering Lead (CL) — Máxima

- ✅ CASE CE obtenida
- ✅ M4, M5, M6 completados
- ✅ Capstone Final aprobado con rúbrica ≥80%
- ✅ Contribución a la Biblioteca: mínimo 1 patrón o caso de estudio original

### 7.3 Formato del Certificado

- Badge digital (compatible con LinkedIn Open Badges)
- PDF firmado con fecha, módulos completados y puntuación
- Enlace verificable al portfolio del estudiante en GitHub

---

## 8. Navegación — Mapa Completo de Rutas

### 8.1 Árbol de Rutas de la Plataforma

```
CASE Academy — Árbol de Navegación Completo

/                          → Onboarding / Home de bienvenida
/perfil                    → Perfil del estudiante + progreso
/roadmap                   → Mapa completo de la academia (este documento visual)

/m1                        → Módulo 1: CASE Foundations (LIVE)
  /m1/overview             → Descripción + prerrequisitos + plan
  /m1/clase/1              → C1: Fundamentos IA Generativa
  /m1/clase/2              → C2: Spring Boot con IA
  /m1/clase/3              → C3: Migración Legacy
  /m1/clase/4              → C4: APIs + MCP
  /m1/clase/5              → C5: Testing Avanzado
  /m1/clase/6              → C6: Angular Signals
  /m1/clase/7              → C7: Frontend Legacy
  /m1/clase/8              → C8: Estado Reactivo
  /m1/clase/9              → C9: Testing E2E
  /m1/clase/10             → C10: RAG + FastAPI
  /m1/clase/11             → C11: Lambda + Bedrock
  /m1/clase/12             → C12: Proyecto Final
  /m1/recursos/instalacion → Guías de Instalación
  /m1/recursos/tech-stack  → Tech Stack BancoFiel
  /m1/recursos/plan        → Plan de Estudio Detallado

/m2                        → Módulo 2: Context Engineering (🔒 Q3 2026)
/m3                        → Módulo 3: Agent Engineering (🔒 Q4 2026)
/m4                        → Módulo 4: Dev Automation (🔒 Q1 2027)
/m5                        → Módulo 5: Enterprise Architecture (🔒 Q2 2027)
/m6                        → Módulo 6: AI Quality & Governance (🔒 Q3 2027)

/biblioteca                → CASE Library
  /biblioteca/agentes
  /biblioteca/contextos
  /biblioteca/prompts
  /biblioteca/patrones
  /biblioteca/checklists
  /biblioteca/templates
  /biblioteca/casos-de-estudio

/laboratorios              → CASE Labs
  /laboratorios/py01
  /laboratorios/aws01
  /laboratorios/docker01
  /laboratorios/mcp01
  /laboratorios/rag01
  /laboratorios/signals01
  /laboratorios/hexagonal01
  /laboratorios/agents01

/framework                 → CASE Framework
  /framework/principios
  /framework/roles
  /framework/artefactos
  /framework/workflow
  /framework/metricas
  /framework/gobernanza

/certificaciones           → Sistema de Certificaciones
  /certificaciones/cf
  /certificaciones/ce
  /certificaciones/cl

# REDIRECTS DE COMPATIBILIDAD (URLs actuales del sitio — permanentes)
/clase1-dev-fundamentos       → /m1/clase/1
/clase2-dev-spring-boot       → /m1/clase/2
/clase3-dev-migracion-legacy  → /m1/clase/3
/clase4-dev-integracion-apis  → /m1/clase/4
/clase5-dev-testing-avanzado  → /m1/clase/5
/clase6-dev-modulo-angular    → /m1/clase/6
/clase7-dev-frontend-legacy   → /m1/clase/7
/clase8-dev-estado-rxjs       → /m1/clase/8
/clase9-dev-testing-e2e       → /m1/clase/9
/clase10-dev-fastapi          → /m1/clase/10
/clase11-dev-lambda-serverless→ /m1/clase/11
/clase12-dev-proyecto-final   → /m1/clase/12
/installation-guides          → /m1/recursos/instalacion
/tech-stack                   → /m1/recursos/tech-stack
/plan-dev-detallado           → /m1/recursos/plan
/study-plan                   → /m1/recursos/plan
```

### 8.2 Sidebar de Navegación — Estructura Visual

```
┌──────────────────────────────────────┐
│  CASE ACADEMY                   🏠   │
├──────────────────────────────────────┤
│  Mi Progreso: ████████░░ 60%         │
├──────────────────────────────────────┤
│                                      │
│  📦 MÓDULO 1: CASE Foundations ▼    │
│  ✅ Overview del Módulo              │
│                                      │
│  ┌─ 🔵 BLOQUE A: AI Dev Toolkit     │
│  │  ✅ C1 · Fundamentos IA          │
│  │  ✅ C2 · Spring Boot             │
│  │  ✅ C3 · Migración Legacy        │
│  │  ✅ C4 · APIs + MCP              │
│  │                                   │
│  ├─ 🟡 BLOQUE B: Full-Stack AI      │
│  │  ✅ C5 · Testing Avanzado        │
│  │  ✅ C6 · Angular Signals         │
│  │  🔄 C7 · Frontend Legacy    ◄── │
│  │  ⬜ C8 · Estado Reactivo         │
│  │                                   │
│  ├─ ⬜ BLOQUE C: AI-Native Ent.     │
│  │  ⬜ C9  · Testing E2E            │
│  │  ⬜ C10 · RAG + FastAPI          │
│  │  ⬜ C11 · Lambda + Bedrock       │
│  │                                   │
│  └─ ⬜ 🏆 C12 · Proyecto Final      │
│                                      │
│  📁 Recursos M1 ▼                   │
│     📄 Plan de Estudio              │
│     🔧 Guías de Instalación         │
│     🛠️ Tech Stack BancoFiel         │
├──────────────────────────────────────┤
│  📦 MÓDULO 2: Context Eng.   🔒 Q3  │
│  📦 MÓDULO 3: Agent Eng.     🔒 Q4  │
│  📦 MÓDULO 4: Dev Automation  🔒 Q1 │
│  📦 MÓDULO 5: Enterprise Arch 🔒 Q2 │
│  📦 MÓDULO 6: AI Governance   🔒 Q3 │
├──────────────────────────────────────┤
│  📚 CASE Library                    │
│  🧪 CASE Labs                       │
│  ⚙️  CASE Framework                 │
│  🏅 Certificaciones                 │
└──────────────────────────────────────┘

Leyenda: ✅ Completado · 🔄 En progreso · ⬜ Pendiente · 🔒 No disponible
```

---

## 9. Experiencia del Estudiante

### 9.1 Journey del Estudiante — Timeline Completo

```
DÍA 0 — Onboarding
   ├─ Bienvenida al programa
   ├─ Diagnóstico de conocimientos previos (quiz 10 preguntas)
   ├─ Setup del entorno guiado (Labs: PY01 si aplica, AWS01 si aplica)
   └─ Primer AGENTS.md: el estudiante se define como agente
         "Actúa como desarrollador senior de BancoFiel..."

SEMANA 1 — C1: Primeros pasos
   ├─ [Pre-clase]  Leer: "El mito del ChatGPT hace todo el código"
   ├─ [Clase]      90 min · Fundamentos + primer prompt estructurado
   ├─ [Post-clase] Reto: AGENTS.md del módulo de Clientes
   └─ [Reflexión]  "¿Qué cambió en tu forma de usar la IA esta semana?"

SEMANAS 2–4 — Bloque A (Backend)
   ├─ Cada clase: Contexto → Demo → Prompt → Resultado → Revisión
   ├─ Entregable incremental: ms-clientes → migración → APIs + MCP
   └─ CHECKPOINT A (fin semana 4): Autoevaluación de Bloque A

SEMANAS 5–8 — Bloque B (Frontend)
   ├─ Reset deliberado de dificultad (nuevo dominio → dificultad baja)
   ├─ Entregable incremental: componente → migración → estado global
   └─ CHECKPOINT B (fin semana 8): Autoevaluación de Bloque B

SEMANAS 9–11 — Bloque C (AI-Native)
   ├─ Integración de conocimientos previos con nuevas tecnologías
   ├─ Entregable incremental: E2E suite → RAG service → Lambda
   └─ CHECKPOINT C (fin semana 11): Pre-evaluación para Proyecto Final

SEMANA 12 — Proyecto Final
   ├─ Kick-off: Arquitectura del sistema con IA (día 1)
   ├─ Implementación con IA como co-desarrollador (días 2–4)
   ├─ Demo + Entrega + Peer review (día 5)
   └─ Solicitud de certificación CASE CF
```

### 9.2 Modelo Pedagógico: Ciclo CASE

Cada clase sigue el mismo ciclo pedagógico de 4 pasos:

```
C — CONTEXTO (10 min)
│   "¿Qué problema de BancoFiel resolvemos hoy?"
│   Slide de objetivos + prerrequisitos + entregable de la clase.
│
A — ANÁLISIS (15 min)
│   "¿Cómo lo haría sin IA?" → "¿Cómo lo haría con IA?"
│   Contraste explícito entre enfoque legacy y AI-assisted.
│
S — SÍNTESIS (45 min)
│   Demo en vivo: el instructor construye el entregable con IA.
│   El estudiante replica en paralelo con su propio proyecto.
│
E — EVALUACIÓN (20 min)
    Reto: el estudiante aplica lo aprendido a un caso diferente.
    Criterios claros: ¿qué debe funcionar? ¿qué debe ser testeable?
```

### 9.3 Sistema de Checkpoints

| Checkpoint | Momento | Formato | Criterio de paso |
|---|---|---|---|
| Diagnóstico inicial | Día 0 | Quiz 10 preguntas | Solo diagnóstico |
| Checkpoint A | Fin semana 4 | Autoevaluación + entregables | ms-clientes + migración + MCP funcionando |
| Checkpoint B | Fin semana 8 | Autoevaluación + entregables | Frontend integrado con estado global |
| Checkpoint C | Fin semana 11 | Autoevaluación técnica | E2E suite + RAG + Lambda corriendo |
| Proyecto Final | Semana 12 | Rúbrica formal | ≥70% en todos los criterios |

### 9.4 Indicadores de Progreso (UI)

El estudiante ve en todo momento:
- **Progreso del módulo** — % de clases completadas
- **Bloque actual** — A / B / C / Proyecto
- **Entregables completados** — check por entregable
- **Próxima clase disponible**
- **Hito de certificación** — cuántas clases faltan para CF

### 9.5 Modos de Estudio

| Modo | Dedicación | Duración M1 | Para quién |
|---|---|---|---|
| **Intensivo** | 5 h/semana | 12 semanas | Dev con bloque dedicado de estudio |
| **Estándar** | 3 h/semana | 16 semanas | Dev que estudia en paralelo al trabajo |
| **Flexible** | A tu ritmo | Sin límite | Self-paced sin fecha de vencimiento |

### 9.6 Recursos de Apoyo por Clase

| Recurso | Formato | Cuándo usarlo |
|---|---|---|
| Lab complementario | Tutorial paso a paso | Antes de clase con prerequisito técnico |
| Glosario técnico | Searchable | Cuando aparece un término desconocido |
| FAQ por clase | Lista expandible | Al terminar con dudas |
| Caso de estudio | Artículo largo | Para profundizar después de la clase |
| Checklist de entregable | Markdown | Antes de entregar para asegurar completitud |

---

## 10. Glosario del Programa

| Término | Definición en el contexto de CASE Academy |
|---|---|
| **AGENTS.md** | Archivo de especificación de contexto: quién eres, cuál es el proyecto, el stack y las restricciones. Equivalente a un system prompt persistente para agentes de código. |
| **Agentic Self-Fixing** | Bucle automático: test falla → agente genera fix → test se ejecuta → si pasa se acepta; si falla el bucle se repite. |
| **BancoFiel** | Banco ficticio con +500,000 usuarios activos. Caso de uso central de CASE Academy. Sistema legacy en migración hacia arquitectura AI-Native. |
| **CASE Framework** | Metodología propia de la academia para AI-assisted software engineering: roles, artefactos, flujos y métricas. |
| **Ciclo CASE** | Modelo pedagógico de 4 pasos: Contexto → Análisis → Síntesis → Evaluación. Estructura de cada clase. |
| **Circuit Breaker** | Patrón de resiliencia que "abre el circuito" cuando un servicio falla repetidamente, evitando cascadas de fallos. |
| **Context Engineering** | Disciplina de diseñar, estructurar y mantener el contexto que se provee a un modelo de IA para maximizar la calidad de sus respuestas. |
| **MCP (Model Context Protocol)** | Protocolo estándar que permite a los agentes interactuar con herramientas externas (DBs, APIs, archivos) de forma estandarizada. |
| **RAG (Retrieval-Augmented Generation)** | Patrón donde la IA combina generación de texto con recuperación de información de una base de conocimiento externa. |
| **Self-Healing Tests** | Tests E2E que detectan selectores rotos y usan IA para encontrar el nuevo selector automáticamente. |
| **Spec-Driven Development** | Metodología donde se escribe primero la especificación formal (AGENTS.md) antes de generar código con IA. |
| **Smart Component** | Componente Angular que conoce el estado de la aplicación e interactúa con servicios. |
| **Dumb Component** | Componente Angular que solo recibe datos por @Input y emite eventos por @Output. Sin dependencias de servicios. |

---

## 11. Métricas de la Academia

### 11.1 Métricas de Completitud

| Métrica | Meta M1 |
|---|---|
| Tasa de completitud de clases | ≥70% |
| Tasa de aprobación del Proyecto Final | ≥80% |
| NPS del módulo | ≥60 |
| Tiempo promedio de completitud | ≤18 semanas |

### 11.2 Métricas de Aprendizaje

| Métrica | Descripción |
|---|---|
| Calidad del AGENTS.md final | Rúbrica: secciones completas, contexto claro, stack específico |
| Cobertura de tests del Proyecto Final | Debe ser ≥80% (JaCoCo + Pytest) |
| Complejidad ciclomática del código | Promedio <10 por método |
| Ratio prompts estructurados | % de prompts documentados usando ROL/CONTEXTO/TAREA |

### 11.3 Métricas de la Plataforma

| Métrica | Meta |
|---|---|
| Tiempo de primera carga (LCP) | ≤2.5s |
| Tasa de rebote en clase | <30% (estudiantes que salen antes del 50%) |
| Clases más visitadas | Top 3 monitoreadas mensualmente |

---

## 12. Principios de Diseño de la Academia

### P1: BancoFiel como Sistema Real
Todo lo que se aprende se aplica directamente a BancoFiel. No hay ejercicios abstractos. El estudiante construye un sistema que podría existir en producción.

### P2: El criterio técnico primero
La IA es una herramienta. El ingeniero valida, decide y es responsable. El curso nunca enseña a aceptar código generado sin revisión crítica.

### P3: Incremental y Acumulativo
Cada entregable de clase es un ladrillo del siguiente. Al terminar M1, el estudiante tiene 12 artefactos reales en su GitHub.

### P4: La dificultad reinicia con cada dominio nuevo
Al empezar Bloque B (Frontend), la dificultad baja deliberadamente. Es una señal pedagógica, no una inconsistencia. El estudiante gana confianza antes de escalar de nuevo.

### P5: Formatos pedagógicos múltiples
Las clases son slideshows. Los labs son tutoriales paso a paso. Los casos de estudio son artículos. Los patrones son fichas de referencia. Cada tipo de conocimiento tiene su formato ideal.

### P6: Gobernanza desde el inicio
La seguridad, el uso responsable y la gobernanza de IA no son un módulo final. Se mencionan desde C1 y se refuerzan en cada clase. En M6 se formalizan — pero el estudiante ya los practica desde el día 1.

---

*Versión 1.0.0 — Arquitectura definitiva del curso. No modifica ningún archivo de código.*  
*Rol: Product Architect + Instructional Designer*  
*Siguiente acción: Aprobación del propietario. Luego: implementación por fases según MASTER_PLAN.md.*
