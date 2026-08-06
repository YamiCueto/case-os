> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# COURSE ARCHITECTURE â€” Arquitectura Definitiva de la Academia
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Rol:** Product Architect + Instructional Designer  
**VersiÃ³n:** 1.0.0 â€” Documento normativo. No implementa cÃ³digo.  
**Audiencia:** Ingenieros de software senior con experiencia en tecnologÃ­as legacy (VB6, COBIS, .NET, SQL Server).

---

## 0. VisiÃ³n y PropÃ³sito

### 0.1 Nombre de la Academia

> **CASE Academy**  
> *Code Â· Architect Â· Ship Â· Engineer*

### 0.2 MisiÃ³n

Formar ingenieros de software senior capaces de diseÃ±ar, construir y operar sistemas empresariales modernos utilizando IA Generativa como multiplicador de productividad â€” sin sacrificar criterio tÃ©cnico, seguridad ni calidad.

### 0.3 Propuesta de Valor

| Para... | El problema actual es... | CASE Academy ofrece... |
|---|---|---|
| Ingenieros legacy (VB6/COBIS) | La brecha con el stack moderno parece insalvable | Un camino de migraciÃ³n concreto, clase a clase, con IA como acelerador |
| Equipos corporativos | Los cursos de IA son superficiales o teÃ³ricos | Casos de uso bancarios reales (BancoFiel) aplicables el dÃ­a siguiente |
| Architects | La IA se usa sin criterio ni gobernanza | Un framework de arquitectura para sistemas AI-native enterprise |
| Tech Leads | No hay una metodologÃ­a para AI-assisted development | El CASE Framework: roles, artefactos, flujos y mÃ©tricas |

### 0.4 Narrativa Central: BancoFiel

**BancoFiel** es el caso de uso transversal de toda la academia. Un banco con +500,000 usuarios activos que migra de un sistema legacy (VB6, SQL Server, Java 8) a una arquitectura moderna AI-native (Java 21, Spring Boot 3.4, Angular 22, Python 3.13, AWS).

Cada mÃ³dulo, cada clase y cada laboratorio utiliza este contexto. El estudiante no aprende en abstracto â€” aprende mientras moderniza un banco real.

---

## 1. Mapa Completo del Curso

### 1.1 Diagrama de la Academia

```
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                          CASE ACADEMY                                      â•‘
â•‘              AI-Driven Software Engineering for Enterprise                 â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘                                                                            â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚  ONBOARDING  Â·  Bienvenida  Â·  Perfil  Â·  Roadmap  Â·  Setup        â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•‘                                                                            â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚  MÃ“DULO 1    â”‚  â”‚  MÃ“DULO 2    â”‚  â”‚  MÃ“DULO 3    â”‚  â”‚  MÃ“DULO 4    â”‚  â•‘
â•‘  â”‚  CASE        â”‚  â”‚  Context     â”‚  â”‚  Agent       â”‚  â”‚  Dev         â”‚  â•‘
â•‘  â”‚  Foundations â”‚  â”‚  Engineering â”‚  â”‚  Engineering â”‚  â”‚  Automation  â”‚  â•‘
â•‘  â”‚  LIVE âœ…     â”‚  â”‚  Q3 2026 ðŸ”’  â”‚  â”‚  Q4 2026 ðŸ”’  â”‚  â”‚  Q1 2027 ðŸ”’  â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•‘                                                                            â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                       â•‘
â•‘  â”‚  MÃ“DULO 5    â”‚  â”‚  MÃ“DULO 6    â”‚                                       â•‘
â•‘  â”‚  Enterprise  â”‚  â”‚  AI Quality  â”‚                                       â•‘
â•‘  â”‚  Architectureâ”‚  â”‚  & Governanceâ”‚                                       â•‘
â•‘  â”‚  Q2 2027 ðŸ”’  â”‚  â”‚  Q3 2027 ðŸ”’  â”‚                                       â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                       â•‘
â•‘                                                                            â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚  BIBLIOTECA  Â·  LABORATORIOS  Â·  FRAMEWORK  Â·  COMUNIDAD           â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•‘                                                                            â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚  CERTIFICACIÃ“N  Â·  CASE Certified AI Engineer                       â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•‘                                                                            â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
```

### 1.2 ProgresiÃ³n del Estudiante

El estudiante recorre la academia en una progresiÃ³n de roles explÃ­cita:

```
    ENTRADA                                                    SALIDA
       â”‚                                                          â”‚
  Dev Legacy           Prompt         AI              CASE        â”‚
  (VB6/COBIS)   â”€â–º   Engineer   â”€â–º  Engineer   â”€â–º  Architect     â”‚
       â”‚              (M1Â·C1)      (M1Â·C5-C12)      (M3-M6)      â”‚
       â”‚                                                          â”‚
  Herramientas:    AGENTS.md      MCP Servers     Multi-Agent     â”‚
  VB6, Java 8,     Prompts        RAG Â· Lambda    OrquestaciÃ³n    â”‚
  SQL Server        estructurados  CI/CD + IA      Gobernanza      â”‚
```

### 1.3 Tabla de MÃ³dulos

| # | MÃ³dulo | Alias | DuraciÃ³n | Estado | Semanas |
|---|---|---|---|---|---|
| M1 | **CASE Foundations** | `case-foundations` | 12 semanas | âœ… LIVE | 1â€“12 |
| M2 | **Context Engineering** | `context-engineering` | 8 semanas | ðŸ”’ Q3 2026 | 13â€“20 |
| M3 | **Agent Engineering** | `agent-engineering` | 8 semanas | ðŸ”’ Q4 2026 | 21â€“28 |
| M4 | **Dev Automation** | `dev-automation` | 6 semanas | ðŸ”’ Q1 2027 | 29â€“34 |
| M5 | **Enterprise Architecture** | `enterprise-architecture` | 6 semanas | ðŸ”’ Q2 2027 | 35â€“40 |
| M6 | **AI Quality & Governance** | `ai-quality-governance` | 4 semanas | ðŸ”’ Q3 2027 | 41â€“44 |

**DuraciÃ³n total del programa:** 44 semanas (~11 meses)  
**DedicaciÃ³n recomendada:** 3â€“5 horas/semana

---

## 2. MÃ³dulo 1 â€” CASE Foundations âœ…

> **"De Desarrollador Legacy a AI Engineer en 12 semanas"**

### 2.1 DescripciÃ³n

CASE Foundations es el mÃ³dulo de entrada a la academia. Cubre el stack tecnolÃ³gico completo que un equipo de BancoFiel necesita dominar para modernizar su sistema: Backend Java, Frontend Angular, Testing automatizado, RAG con Python, y Cloud con AWS. Todo con IA Generativa como herramienta transversal.

### 2.2 Perfil de Entrada (Prerrequisitos)

| Conocimiento | Nivel Requerido |
|---|---|
| ProgramaciÃ³n orientada a objetos (Java, C#, VB.NET) | Intermedio |
| SQL y bases de datos relacionales | Intermedio |
| Control de versiones (Git) | BÃ¡sico |
| Conceptos de REST APIs | BÃ¡sico |
| Terminal / Command Line | BÃ¡sico |
| IA Generativa (uso casual) | Ninguno requerido |

### 2.3 Perfil de Salida (Competencias Logradas)

Al completar M1, el estudiante puede:

- [ ] DiseÃ±ar microservicios Java 21 / Spring Boot 3.4 con arquitectura hexagonal usando IA
- [ ] Migrar cÃ³digo VB6/Java 8 a Spring Boot con asistencia de agentes
- [ ] Construir APIs REST resilientes con Circuit Breaker, Retry y un servidor MCP propio
- [ ] Desarrollar componentes Angular 22 con Signals, Standalone Components y estado reactivo
- [ ] Modernizar frontends legacy (jQuery/Angular 14) con IA como guÃ­a de migraciÃ³n
- [ ] Implementar testing unitario (JUnit 5 + Mockito) y E2E (Playwright/Cypress) con Agentic Self-Fixing
- [ ] Construir sistemas RAG con Python 3.12, FastAPI y Vector Databases
- [ ] Desplegar funciones serverless con AWS Lambda + Amazon Bedrock + Guardrails
- [ ] Entregar un proyecto integrador de 4 microservicios con CI/CD completo

### 2.4 OrganizaciÃ³n Interna del MÃ³dulo 1

```
M1 â€” CASE Foundations
â”‚
â”œâ”€â”€ BLOQUE A: AI Developer Toolkit (Semanas 1â€“4)
â”‚   â”œâ”€â”€ C1  Fundamentos de IA Generativa         â˜…â˜…â˜†â˜†â˜†
â”‚   â”œâ”€â”€ C2  Spring Boot con IA                   â˜…â˜…â˜…â˜†â˜†
â”‚   â”œâ”€â”€ C3  MigraciÃ³n Legacy VB6 â†’ Spring Boot   â˜…â˜…â˜…â˜…â˜†
â”‚   â””â”€â”€ C4  APIs Resilientes + Servidor MCP      â˜…â˜…â˜…â˜…â˜†
â”‚
â”œâ”€â”€ BLOQUE B: Full-Stack AI Development (Semanas 5â€“8)
â”‚   â”œâ”€â”€ C5  Testing Avanzado + Agentic Self-Fix  â˜…â˜…â˜…â˜†â˜†
â”‚   â”œâ”€â”€ C6  Angular Signals + Standalone         â˜…â˜…â˜…â˜†â˜†
â”‚   â”œâ”€â”€ C7  ModernizaciÃ³n Frontend Legacy        â˜…â˜…â˜…â˜…â˜†
â”‚   â””â”€â”€ C8  Estado Reactivo (Signals + RxJS)     â˜…â˜…â˜…â˜…â˜…
â”‚
â”œâ”€â”€ BLOQUE C: AI-Native Enterprise Systems (Semanas 9â€“11)
â”‚   â”œâ”€â”€ C9  Testing E2E + Self-Healing           â˜…â˜…â˜…â˜†â˜†
â”‚   â”œâ”€â”€ C10 RAG con Python 3.12 + FastAPI        â˜…â˜…â˜…â˜…â˜†
â”‚   â””â”€â”€ C11 AWS Lambda + Bedrock + Guardrails    â˜…â˜…â˜…â˜…â˜†
â”‚
â””â”€â”€ PROYECTO FINAL (Semana 12)
    â””â”€â”€ C12 Sistema de AprobaciÃ³n Crediticia      â˜…â˜…â˜…â˜…â˜…
```

### 2.5 Fichas de Cada Clase

---

#### C1 â€” Fundamentos de IA Generativa para Developers

| Campo | Valor |
|---|---|
| **Semana** | 1 |
| **Bloque** | A â€” AI Developer Toolkit |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜†â˜†â˜† Introductorio |
| **Tipo** | Clase magistral + ConfiguraciÃ³n |
| **Ruta actual** | `/clase1-dev-fundamentos` |
| **Ruta nueva** | `/m1/clase/1` |

**Objetivos de aprendizaje:**
1. Distinguir IA, ML y IA Generativa con casos de uso de desarrollo de software
2. Configurar el entorno de trabajo con Gemini, Claude, Copilot y Cursor
3. Escribir prompts estructurados (ROL / CONTEXTO / TAREA / RESTRICCIONES)
4. Identificar y mitigar las limitaciones de la IA en contexto empresarial
5. Crear el primer `AGENTS.md` del proyecto BancoFiel

**Slides del contenido:**
- S1: Modelos de razonamiento (Gemini, DeepSeek, Claude, OpenAI) â€” comparativa
- S2: Model Context Protocol (MCP) â€” introducciÃ³n y ecosistema
- S3: Spec-Driven Development con `AGENTS.md`
- S4: Agentes de cÃ³digo autÃ³nomos
- S5: Prompts estructurados vs. casuales â€” contraste con ejemplos reales
- S6: Limitaciones crÃ­ticas (alucinaciones, IP, seguridad, desactualizaciÃ³n)
- S7: Buenas prÃ¡cticas para developers enterprise
- S8: **Reto:** Crear `AGENTS.md` del mÃ³dulo de GestiÃ³n de Clientes de BancoFiel

**Entregable:** `AGENTS.md` del proyecto BancoFiel con contexto, stack y restricciones.  
**Prerrequisitos:** Ninguno.  
**Conecta con:** C2 â€” el `AGENTS.md` se usa como contexto en los prompts de Spring Boot.

---

#### C2 â€” Microservicio Spring Boot con IA

| Campo | Valor |
|---|---|
| **Semana** | 2 |
| **Bloque** | A â€” AI Developer Toolkit |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜†â˜† Intermedio |
| **Tipo** | Taller prÃ¡ctico |
| **Ruta actual** | `/clase2-dev-spring-boot` |
| **Ruta nueva** | `/m1/clase/2` |

**Objetivos de aprendizaje:**
1. DiseÃ±ar arquitectura hexagonal con asistencia de IA
2. Generar entidades JPA, DTOs, Repositories y Services con prompts estructurados
3. Implementar Virtual Threads en Java 21
4. Exponer APIs REST documentadas con OpenAPI/Swagger
5. Validar entradas con Bean Validation y Java Records

**Entregable:** Microservicio `ms-clientes` funcional con Swagger, tests y CI bÃ¡sico.  
**Prerrequisitos:** C1 â€” AGENTS.md del proyecto.  
**Conecta con:** C3 (el ms-clientes se usa como referencia de migraciÃ³n), C4 (se integra a la API resiliente).

---

#### C3 â€” MigraciÃ³n Legacy VB6 â†’ Spring Boot

| Campo | Valor |
|---|---|
| **Semana** | 3 |
| **Bloque** | A â€” AI Developer Toolkit |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜† Avanzado |
| **Tipo** | Taller de migraciÃ³n |
| **Ruta actual** | `/clase3-dev-migracion-legacy` |
| **Ruta nueva** | `/m1/clase/3` |

**Objetivos de aprendizaje:**
1. Analizar cÃ³digo VB6/Java 8 con IA para detectar reglas de negocio ocultas
2. Mapear Stored Procedures SQL a Spring Data JPA
3. Preservar lÃ³gica de negocio durante la refactorizaciÃ³n
4. Documentar decisiones de migraciÃ³n con IA como co-autor

**Entregable:** MÃ³dulo de PrÃ©stamos migrado de VB6 a Spring Boot 3.4, con tests de regresiÃ³n.  
**Prerrequisitos:** C2 â€” conocimiento de la arquitectura Spring Boot objetivo.  
**Conecta con:** C5 â€” el mÃ³dulo migrado requiere cobertura de tests â‰¥80%.

---

#### C4 â€” APIs REST Resilientes + Servidor MCP

| Campo | Valor |
|---|---|
| **Semana** | 4 |
| **Bloque** | A â€” AI Developer Toolkit |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜† Avanzado |
| **Tipo** | Taller avanzado |
| **Ruta actual** | `/clase4-dev-integracion-apis` |
| **Ruta nueva** | `/m1/clase/4` |

**Objetivos de aprendizaje:**
1. Implementar Circuit Breaker y Retry con Resilience4j
2. Integrar Redis como cachÃ© de respuestas de APIs externas
3. DiseÃ±ar y publicar un Servidor MCP propio con TypeScript SDK
4. Conectar el servidor MCP al agente de cÃ³digo para automatizar tareas

**Entregable:** Servidor MCP de BancoFiel con 3 herramientas: `buscar-cliente`, `calcular-scoring`, `generar-reporte`.  
**Prerrequisitos:** C2, C3.  
**Conecta con:** M2 (el MCP se expande en Context Engineering), C12 (usado en el proyecto final).

---

#### C5 â€” Testing Avanzado + Agentic Self-Fixing

| Campo | Valor |
|---|---|
| **Semana** | 5 |
| **Bloque** | B â€” Full-Stack AI Development |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜†â˜† Intermedio |
| **Tipo** | Taller QA |
| **Ruta actual** | `/clase5-dev-testing-avanzado` |
| **Ruta nueva** | `/m1/clase/5` |

**Objetivos de aprendizaje:**
1. Implementar tests unitarios con JUnit 5 + Mockito + Testcontainers
2. Configurar JaCoCo para cobertura â‰¥80%
3. Construir un bucle de Agentic Self-Fixing: test falla â†’ IA genera fix â†’ test pasa
4. Integrar el ciclo en GitHub Actions

**Entregable:** Suite de tests con cobertura â‰¥80% y pipeline de autocorrecciÃ³n.  
**Prerrequisitos:** C2, C3.  
**Conecta con:** C9 (extensiÃ³n al testing E2E), C12 (testing del proyecto final).

---

#### C6 â€” Frontend Angular 22 con Signals

| Campo | Valor |
|---|---|
| **Semana** | 6 |
| **Bloque** | B â€” Full-Stack AI Development |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜†â˜† Intermedio |
| **Tipo** | Taller Frontend |
| **Ruta actual** | `/clase6-dev-modulo-angular` |
| **Ruta nueva** | `/m1/clase/6` |

**Objetivos de aprendizaje:**
1. Construir Standalone Components con Angular Signals (`signal()`, `computed()`, `effect()`)
2. Usar el nuevo control flow (`@if`, `@for`, `@switch`)
3. Reemplazar Zone.js con Change Detection granular
4. Integrar Tailwind CSS para diseÃ±o de componentes UI

**Entregable:** Pantalla de GestiÃ³n de Clientes con Standalone Components y Signals.  
**Prerrequisitos:** Experiencia Angular â‰¥v14.  
**Conecta con:** C7, C8, C12.

---

#### C7 â€” ModernizaciÃ³n Frontend Legacy

| Campo | Valor |
|---|---|
| **Semana** | 7 |
| **Bloque** | B â€” Full-Stack AI Development |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜† Avanzado |
| **Tipo** | Taller de migraciÃ³n |
| **Ruta actual** | `/clase7-dev-frontend-legacy` |
| **Ruta nueva** | `/m1/clase/7` |

**Objetivos de aprendizaje:**
1. Analizar componentes Angular 14/jQuery con IA para identificar patrones legacy
2. Migrar a Angular 22 con OnPush + Signals granulares
3. Aplicar el patrÃ³n Smart/Dumb Components
4. Generar tests de regresiÃ³n visual durante la migraciÃ³n con IA

**Entregable:** MÃ³dulo legacy migrado: 1 SmartComponent + 3 DumbComponents + tests.  
**Prerrequisitos:** C6.  
**Conecta con:** C8 â€” gestiÃ³n de estado del mÃ³dulo migrado.

---

#### C8 â€” Estado Reactivo Avanzado

| Campo | Valor |
|---|---|
| **Semana** | 8 |
| **Bloque** | B â€” Full-Stack AI Development |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜… Experto |
| **Tipo** | Taller avanzado |
| **Ruta actual** | `/clase8-dev-estado-rxjs` |
| **Ruta nueva** | `/m1/clase/8` |

**Objetivos de aprendizaje:**
1. Integrar Signals con RxJS (de `Observable` a `toSignal()`)
2. Implementar NgRx Signal Store para estado global
3. DiseÃ±ar el flujo completo: API â†’ Service (RxJS) â†’ Store (Signals) â†’ Template
4. Gestionar loading states, error states y optimistic updates

**Entregable:** Store global de BancoFiel con estado de Clientes, PrÃ©stamos y Decisiones.  
**Prerrequisitos:** C6, C7.  
**Conecta con:** C12 â€” el store es la base del estado del proyecto final.

---

#### C9 â€” Testing E2E + Self-Healing

| Campo | Valor |
|---|---|
| **Semana** | 9 |
| **Bloque** | C â€” AI-Native Enterprise Systems |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜†â˜† Intermedio |
| **Tipo** | Taller QA |
| **Ruta actual** | `/clase9-dev-testing-e2e` |
| **Ruta nueva** | `/m1/clase/9` |

**Objetivos de aprendizaje:**
1. Escribir tests E2E con Playwright (comparativa con Cypress)
2. Detectar selectores rotos en CI/CD con alertas automÃ¡ticas
3. Implementar Self-Healing tests con IA
4. DiseÃ±ar estrategia E2E para BancoFiel: smoke, regression, critical paths

**Entregable:** Suite E2E del flujo Registro â†’ Solicitud â†’ DecisiÃ³n con Self-Healing.  
**Prerrequisitos:** C5, C6.  
**Conecta con:** C12 â€” los tests E2E cubren el proyecto final completo.

---

#### C10 â€” RAG con Python 3.12 + FastAPI

| Campo | Valor |
|---|---|
| **Semana** | 10 |
| **Bloque** | C â€” AI-Native Enterprise Systems |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜† Avanzado |
| **Tipo** | Taller AI / RAG |
| **Ruta actual** | `/clase10-dev-fastapi` |
| **Ruta nueva** | `/m1/clase/10` |

**Objetivos de aprendizaje:**
1. Entender la arquitectura RAG (Retrieval-Augmented Generation)
2. Indexar documentos (normativas bancarias) en PgVector / ChromaDB
3. Generar embeddings con OpenAI / Ollama para bÃºsqueda semÃ¡ntica
4. Exponer el sistema RAG como microservicio con FastAPI
5. Integrar el RAG al MS-DecisiÃ³n de BancoFiel para justificar decisiones crediticias

**Pre-lectura recomendada:** LAB-PY01 â€” Python para Developers Java.

**Entregable:** `ms-scoring-rag` que responde preguntas sobre normativa bancaria usando RAG.  
**Prerrequisitos:** C2, C4.  
**Conecta con:** C11 (el RAG se despliega en Lambda), C12 (uno de los 4 microservicios del proyecto final).

---

#### C11 â€” AWS Lambda + Amazon Bedrock + Guardrails

| Campo | Valor |
|---|---|
| **Semana** | 11 |
| **Bloque** | C â€” AI-Native Enterprise Systems |
| **DuraciÃ³n** | 90 min |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜† Avanzado |
| **Tipo** | Taller Cloud |
| **Ruta actual** | `/clase11-dev-lambda-serverless` |
| **Ruta nueva** | `/m1/clase/11` |

**Objetivos de aprendizaje:**
1. Desplegar funciones serverless con AWS Lambda (Node.js/Python) + SAM
2. Integrar Amazon Bedrock como LLM backbone del sistema
3. Configurar Guardrails para datos sensibles del contexto bancario
4. DiseÃ±ar el flujo: S3 Upload â†’ Lambda Trigger â†’ Bedrock â†’ DynamoDB

**Nota de acceso:** Requiere cuenta AWS. Ver LAB-AWS01 para entorno sandbox gratuito.

**Entregable:** `lambda-orchestrator` que procesa lotes CSV de solicitudes con Bedrock.  
**Prerrequisitos:** C10.  
**Conecta con:** C12 â€” el 4to microservicio del proyecto final.

---

#### C12 â€” Proyecto Final: Sistema de AprobaciÃ³n Crediticia

| Campo | Valor |
|---|---|
| **Semana** | 12 |
| **Bloque** | Proyecto Final |
| **DuraciÃ³n** | 180 min (sesiÃ³n doble) |
| **Dificultad** | â˜…â˜…â˜…â˜…â˜… Experto |
| **Tipo** | Proyecto Capstone |
| **Ruta actual** | `/clase12-dev-proyecto-final` |
| **Ruta nueva** | `/m1/clase/12` |

**DescripciÃ³n:**
Sistema completo de AprobaciÃ³n Crediticia AI-Native para BancoFiel. Integra todo lo aprendido en M1 en una arquitectura de 4 microservicios con CI/CD completo y cobertura de tests â‰¥80%.

**Arquitectura del Proyecto:**

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              SISTEMA DE APROBACIÃ“N CREDITICIA               â”‚
â”‚                     BancoFiel Â· M1 Capstone                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                             â”‚
â”‚   [Angular 22 Frontend]                                     â”‚
â”‚         â”‚ HTTP                                              â”‚
â”‚         â–¼                                                   â”‚
â”‚   [API Gateway / NGINX]                                     â”‚
â”‚    â”Œâ”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                              â”‚
â”‚    â–¼                         â–¼                              â”‚
â”‚ [MS Clientes]         [MS DecisiÃ³n]                         â”‚
â”‚ Java 21 Â· :8081       Java 21 Â· :8082                       â”‚
â”‚ PostgreSQL             PostgreSQL                           â”‚
â”‚                   [MS Scoring]                              â”‚
â”‚                   Python Â· :8000                            â”‚
â”‚                   FastAPI + RAG                             â”‚
â”‚         [Lambda Orchestrator]                               â”‚
â”‚         Node.js + TypeScript                                â”‚
â”‚         S3 â†’ Bedrock â†’ DynamoDB                             â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Historias de Usuario (HUs) a implementar:**

| HU | TÃ­tulo | Actor | Criterios Clave |
|---|---|---|---|
| HU-001 | Registro de Cliente | Oficial de crÃ©dito | Validaciones en tiempo real, RFC Ãºnico, respuesta <500ms |
| HU-002 | Solicitud de PrÃ©stamo | Oficial de crÃ©dito | Scoring 0â€“1000, decisiÃ³n APROBADO/RECHAZADO, persistencia |
| HU-003 | Consulta de Historial | Gerente | Tabla paginada, filtros, exportaciÃ³n CSV, carga <2s |
| HU-004 | Procesamiento Batch CSV | Sistema | Lambda trigger, decisiones bulk, notificaciÃ³n de resultados |

**Entregable final (requisitos de aprobaciÃ³n):**
```
âœ… 4 microservicios corriendo en Docker Compose local
âœ… Frontend Angular 22 integrado a los 4 servicios
âœ… Tests unitarios cobertura â‰¥80% (JaCoCo + Pytest)
âœ… Tests E2E cubriendo los 4 flujos principales (Playwright)
âœ… README con diagrama de arquitectura, setup y decisiones tÃ©cnicas
âœ… Pipeline CI/CD en GitHub Actions: build + tests + deploy
âœ… Servidor MCP de BancoFiel con al menos 3 tools funcionando
```

**RÃºbrica de evaluaciÃ³n:**

| Criterio | Peso | DescripciÃ³n |
|---|---|---|
| Funcionalidad (HUs) | 40% | Las 4 HUs implementadas y funcionando |
| Calidad de cÃ³digo | 20% | TypeScript strict, ESLint clean, sin code smells |
| Testing | 20% | Cobertura â‰¥80% backend, flujos E2E completos |
| Arquitectura | 10% | Hexagonal, Smart/Dumb, MCP correctamente aplicados |
| DocumentaciÃ³n | 10% | AGENTS.md completo, README con ADRs |

---

### 2.6 Recursos del MÃ³dulo 1

| Recurso | Tipo | Ruta |
|---|---|---|
| Plan de Estudio Detallado | Reference | `/m1/recursos/plan` |
| GuÃ­as de InstalaciÃ³n | Guide | `/m1/recursos/instalacion` |
| Tech Stack BancoFiel | Reference | `/m1/recursos/tech-stack` |
| Contexto BancoFiel (study-plan-dev.md) | Context | Biblioteca > Contextos |

---

## 3. MÃ³dulos Futuros â€” DiseÃ±o Conceptual

### 3.1 MÃ³dulo 2 â€” Context Engineering ðŸ”’

> **"El cÃ³digo que la IA produce es tan bueno como el contexto que le das"**

**DuraciÃ³n:** 8 semanas | **Semanas:** 13â€“20 | **Estado:** En diseÃ±o pedagÃ³gico

**Â¿Por quÃ© despuÃ©s de M1?**  
En M1 el estudiante usa el contexto de forma intuitiva. M2 convierte esa prÃ¡ctica en disciplina formal y medible.

**SubmÃ³dulos:**

| # | SubmÃ³dulo | Semanas | Enfoque |
|---|---|---|---|
| 2.1 | `AGENTS.md` Avanzado | 13â€“14 | Especificaciones profundas, capas de contexto, versionado |
| 2.2 | GestiÃ³n de Ventana de Contexto | 15â€“16 | Token budgeting, compresiÃ³n semÃ¡ntica, memoria episÃ³dica |
| 2.3 | TÃ©cnicas Avanzadas de Prompting | 17â€“18 | Few-shot, Chain-of-Thought, Tree-of-Thoughts, meta-prompting |
| 2.4 | Prompt Libraries y Governance | 19â€“20 | Repositorios de prompts, versionado, A/B testing |

**Proyecto M2:** Biblioteca de Prompts Corporativa de BancoFiel con mÃ©tricas de efectividad.  
**CertificaciÃ³n parcial:** CASE Context Engineer (CC)

---

### 3.2 MÃ³dulo 3 â€” Agent Engineering ðŸ”’

> **"Agentes que trabajan mientras duermes"**

**DuraciÃ³n:** 8 semanas | **Semanas:** 21â€“28 | **Estado:** En diseÃ±o pedagÃ³gico

**SubmÃ³dulos:**

| # | SubmÃ³dulo | Semanas | Enfoque |
|---|---|---|---|
| 3.1 | Arquitecturas de Agentes | 21â€“22 | ReAct, Plan-and-Execute, Reflection, Self-Refinement |
| 3.2 | MCP Avanzado â€” ProducciÃ³n | 23â€“24 | MCP enterprise: autenticaciÃ³n, rate limiting, logging |
| 3.3 | OrquestaciÃ³n Multi-Agente | 25â€“26 | LangGraph, CrewAI, AutoGen â€” patrones y anti-patrones |
| 3.4 | EvaluaciÃ³n y Testing de Agentes | 27â€“28 | MÃ©tricas, evals, benchmarks, detecciÃ³n de regresiÃ³n |

**Proyecto M3:** Sistema de Agentes para BancoFiel â€” anÃ¡lisis de cÃ³digo + generaciÃ³n de tests + revisiÃ³n de PRs.  
**CertificaciÃ³n parcial:** CASE Agent Engineer (CA)

---

### 3.3 MÃ³dulo 4 â€” Dev Automation ðŸ”’

> **"CI/CD inteligente que se autocorrige"**

**DuraciÃ³n:** 6 semanas | **Semanas:** 29â€“34

**SubmÃ³dulos:**

| # | SubmÃ³dulo | Semanas | Enfoque |
|---|---|---|---|
| 4.1 | GitHub Actions + IA | 29â€“30 | Pipelines con detecciÃ³n automÃ¡tica de fallos |
| 4.2 | Code Review Automatizado | 31â€“32 | Review con IA, linting contextual, security scanning |
| 4.3 | DocumentaciÃ³n TÃ©cnica con IA | 33 | ADRs, READMEs, diagramas generados desde el cÃ³digo |
| 4.4 | Deuda TÃ©cnica con IA | 34 | DetecciÃ³n, clasificaciÃ³n y priorizaciÃ³n |

**Proyecto M4:** Pipeline de automatizaciÃ³n completo para el repositorio de BancoFiel.

---

### 3.4 MÃ³dulo 5 â€” Enterprise Architecture ðŸ”’

> **"DiseÃ±ar sistemas que escalan con IA como primer ciudadano"**

**DuraciÃ³n:** 6 semanas | **Semanas:** 35â€“40

**SubmÃ³dulos:**

| # | SubmÃ³dulo | Semanas | Enfoque |
|---|---|---|---|
| 5.1 | Event-Driven Architecture + IA | 35â€“36 | Kafka, EventBridge, Event Sourcing con IA |
| 5.2 | Microservicios AI-Native | 37â€“38 | Service mesh, observabilidad, tracing con LLMs |
| 5.3 | Data Architecture para IA | 39 | Feature stores, vector DBs en producciÃ³n, data lineage |
| 5.4 | ADRs con IA | 40 | ADRs generados y evaluados con IA, simulaciÃ³n de trade-offs |

**Proyecto M5:** RediseÃ±o de la arquitectura completa de BancoFiel como AI-Native.

---

### 3.5 MÃ³dulo 6 â€” AI Quality & Governance ðŸ”’

> **"IA responsable en producciÃ³n: seguridad, auditorÃ­a y compliance"**

**DuraciÃ³n:** 4 semanas | **Semanas:** 41â€“44

**SubmÃ³dulos:**

| # | SubmÃ³dulo | Semanas | Enfoque |
|---|---|---|---|
| 6.1 | Seguridad en sistemas con IA | 41â€“42 | Prompt injection, jailbreaking, data exfiltration, guardrails |
| 6.2 | Compliance y AuditorÃ­a | 43 | GDPR, PCI-DSS, trazabilidad de decisiones IA en banca |
| 6.3 | Governance Framework | 44 | PolÃ­ticas, roles, mÃ©tricas, revisiÃ³n de uso IA en empresa |

**Proyecto M6:** Framework de Governance de IA para BancoFiel.

---

## 4. Biblioteca â€” CASE Library

### 4.1 PropÃ³sito

La Biblioteca contiene recursos reutilizables consultables antes, durante y despuÃ©s de cualquier mÃ³dulo. Son el resultado destilado del programa â€” no prerequisitos, sino cristalizaciones del conocimiento.

### 4.2 CatÃ¡logo Completo

```
CASE Library
â”‚
â”œâ”€â”€ ðŸ“ Agentes (7 definiciones)
â”‚   â”œâ”€â”€ agente-java-architect        â€” Arquitectura hexagonal, microservicios, patrones
â”‚   â”œâ”€â”€ agente-spring-boot-developer â€” JPA, REST, validaciones, tests
â”‚   â”œâ”€â”€ agente-legacy-migrator       â€” VB6/Java8 â†’ Spring Boot, SQL â†’ JPA
â”‚   â”œâ”€â”€ agente-angular-developer     â€” Signals, NgRx, Tailwind, testing Angular
â”‚   â”œâ”€â”€ agente-testing-engineer      â€” JUnit 5, Mockito, Playwright, Self-Fixing
â”‚   â”œâ”€â”€ agente-python-ai-engineer    â€” FastAPI, RAG, embeddings, LangChain
â”‚   â””â”€â”€ agente-aws-architect         â€” Lambda, Bedrock, SAM, Guardrails
â”‚
â”œâ”€â”€ ðŸ“ Contextos â€” AGENTS.md (6 plantillas)
â”‚   â”œâ”€â”€ contexto-bancofiel-global    â€” Contexto maestro del proyecto
â”‚   â”œâ”€â”€ contexto-ms-clientes         â€” Microservicio de clientes
â”‚   â”œâ”€â”€ contexto-ms-scoring          â€” Scoring crediticio
â”‚   â”œâ”€â”€ contexto-ms-decision         â€” LÃ³gica de decisiÃ³n
â”‚   â”œâ”€â”€ contexto-frontend-angular    â€” Frontend BancoFiel
â”‚   â””â”€â”€ contexto-infraestructura-aws â€” Infraestructura cloud
â”‚
â”œâ”€â”€ ðŸ“ Prompts (7 colecciones)
â”‚   â”œâ”€â”€ prompts-arquitectura         â€” DiseÃ±o hexagonal, diagramas C4, ADRs
â”‚   â”œâ”€â”€ prompts-backend-java         â€” Entidades JPA, Services, Controllers, DTOs
â”‚   â”œâ”€â”€ prompts-migracion-legacy     â€” AnÃ¡lisis VB6, migraciÃ³n SQLâ†’JPA
â”‚   â”œâ”€â”€ prompts-frontend-angular     â€” Signals, NgRx, formularios reactivos
â”‚   â”œâ”€â”€ prompts-testing              â€” JUnit 5, Mockito, E2E, Self-Healing
â”‚   â”œâ”€â”€ prompts-python-rag           â€” Embeddings, chunking, retrieval
â”‚   â””â”€â”€ prompts-code-review          â€” RevisiÃ³n de arquitectura, seguridad, deuda
â”‚
â”œâ”€â”€ ðŸ“ Patrones (6 fichas)
â”‚   â”œâ”€â”€ patron-hexagonal-con-ia      â€” Arquitectura hexagonal con prompts + IA
â”‚   â”œâ”€â”€ patron-rag-enterprise        â€” RAG para sistemas con datos sensibles
â”‚   â”œâ”€â”€ patron-mcp-server-produccion â€” MCP enterprise: auth, rate limiting, logging
â”‚   â”œâ”€â”€ patron-agentic-self-fixing   â€” Bucle test-falla â†’ IA-fix â†’ test-pasa
â”‚   â”œâ”€â”€ patron-smart-dumb-components â€” SeparaciÃ³n en Angular con Signals
â”‚   â””â”€â”€ patron-migration-legacy-ai   â€” MigraciÃ³n legacy paso a paso con IA
â”‚
â”œâ”€â”€ ðŸ“ Checklists (6 listas)
â”‚   â”œâ”€â”€ checklist-code-review-ia     â€” QuÃ© verificar en cÃ³digo generado por IA
â”‚   â”œâ”€â”€ checklist-migracion-vb6      â€” Pasos para migrar mÃ³dulo VB6
â”‚   â”œâ”€â”€ checklist-microservicio-java â€” QuÃ© debe tener un ms listo para producciÃ³n
â”‚   â”œâ”€â”€ checklist-seguridad-prompt   â€” PrevenciÃ³n de prompt injection y data leakage
â”‚   â”œâ”€â”€ checklist-deploy-produccion  â€” Antes de hacer push a producciÃ³n
â”‚   â””â”€â”€ checklist-arquitectura-reviewâ€” Criterios para revisar una arquitectura
â”‚
â”œâ”€â”€ ðŸ“ Templates (6 plantillas)
â”‚   â”œâ”€â”€ template-agents-md           â€” AGENTS.md con todas las secciones
â”‚   â”œâ”€â”€ template-prompt-estructurado â€” ROL / CONTEXTO / TAREA / RESTRICCIONES
â”‚   â”œâ”€â”€ template-adr                 â€” Architecture Decision Record
â”‚   â”œâ”€â”€ template-plan-migracion      â€” Plan de migraciÃ³n de mÃ³dulo legacy
â”‚   â”œâ”€â”€ template-readme-microservicioâ€” README estÃ¡ndar para ms de BancoFiel
â”‚   â””â”€â”€ template-historia-usuario    â€” Historia de usuario con criterios de aceptaciÃ³n
â”‚
â””â”€â”€ ðŸ“ Casos de Estudio (4 casos)
    â”œâ”€â”€ caso-bancofiel-migracion-prestamos â€” MÃ³dulo PrÃ©stamos VB6 â†’ Spring Boot
    â”œâ”€â”€ caso-bancofiel-rag-normativa       â€” RAG sobre normativa bancaria
    â”œâ”€â”€ caso-bancofiel-lambda-scoring      â€” Lambda batch scoring crediticio
    â””â”€â”€ caso-migracion-angular-legado      â€” Angular 14 NgModules â†’ 22 Standalone
```

---

## 5. Laboratorios â€” CASE Labs

### 5.1 PropÃ³sito

Los labs son entornos de prÃ¡ctica guiada, independientes de las clases. Cada lab tiene instrucciones paso a paso, cÃ³digo starter, soluciÃ³n final y criterios de aceptaciÃ³n.

### 5.2 CatÃ¡logo Completo

| ID | Nombre | DuraciÃ³n | Dificultad | Prerrequisito para |
|---|---|---|---|---|
| LAB-PY01 | Python para Developers Java | 2 h | â˜…â˜…â˜†â˜†â˜† | C10 |
| LAB-AWS01 | Entorno AWS Sandbox | 1 h | â˜…â˜…â˜†â˜†â˜† | C11 |
| LAB-DOCKER01 | Docker + Docker Compose | 1.5 h | â˜…â˜…â˜…â˜†â˜† | C12 |
| LAB-MCP01 | Primer Servidor MCP desde Cero | 2 h | â˜…â˜…â˜…â˜†â˜† | C4 (extensiÃ³n) |
| LAB-RAG01 | RAG con Ollama (sin API de pago) | 30 min | â˜…â˜…â˜†â˜†â˜† | Complemento C10 |
| LAB-SIGNALS01 | Migrar NgModule a Standalone + Signals | 1 h | â˜…â˜…â˜…â˜†â˜† | C6, C7 |
| LAB-HEXAGONAL01 | Arquitectura Hexagonal Paso a Paso | 2 h | â˜…â˜…â˜…â˜…â˜† | Complemento C2 |
| LAB-AGENTS01 | Primer Agente con LangGraph | 2 h | â˜…â˜…â˜…â˜…â˜† | PreparaciÃ³n M3 |

---

## 6. Proyecto Final de la Academia â€” CASE Capstone

### 6.1 DenominaciÃ³n

**CASE Capstone Project â€” BancoFiel AI-Native Platform**

### 6.2 Concepto

Al completar los 6 mÃ³dulos, el estudiante habrÃ¡ construido de forma incremental la plataforma completa de BancoFiel AI-Native. No es un proyecto nuevo â€” es la culminaciÃ³n de todos los entregables de cada mÃ³dulo integrados en una soluciÃ³n cohesiva.

### 6.3 Arquitectura Final del Capstone

```
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘          BANCOFIEL AI-NATIVE PLATFORM â€” CAPSTONE ARCHITECTURE        â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘                                                                       â•‘
â•‘  CAPA DE INTELIGENCIA ARTIFICIAL                                      â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â•‘
â•‘  â”‚  Context Library â”‚  â”‚ Agent Orchestrator â”‚  â”‚ Prompt Registry  â”‚ â•‘
â•‘  â”‚  (M2)            â”‚  â”‚ LangGraph (M3)     â”‚  â”‚ (M2)             â”‚ â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â•‘
â•‘                                                                       â•‘
â•‘  CAPA DE APLICACIÃ“N (M1)                                             â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â•‘
â•‘  â”‚MS Clientes â”‚ â”‚MS Scoring  â”‚ â”‚MS DecisiÃ³n â”‚ â”‚Lambda Orchestr.â”‚   â•‘
â•‘  â”‚Java 21     â”‚ â”‚FastAPI/RAG â”‚ â”‚Java 21     â”‚ â”‚Node.js+Bedrock â”‚   â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â•‘
â•‘                                                                       â•‘
â•‘  CAPA FRONTEND (M1)                                                  â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â•‘
â•‘  â”‚         Angular 22 Â· Signals Â· NgRx Store Â· Tailwind          â”‚ â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â•‘
â•‘                                                                       â•‘
â•‘  CAPA DE AUTOMATIZACIÃ“N (M4)                                         â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â•‘
â•‘  â”‚ GitHub Actions Â· Code Review AI Â· Doc Generation Â· Debt Score â”‚ â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â•‘
â•‘                                                                       â•‘
â•‘  CAPA DE GOBERNANZA (M6)                                             â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â•‘
â•‘  â”‚ AI Policy Â· Audit Log Â· Prompt Registry Â· Compliance Report   â”‚ â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
```

### 6.4 RÃºbrica del Capstone Final

| DimensiÃ³n | Peso | Criterios |
|---|---|---|
| Funcionalidad completa | 30% | Todas las HUs de los 6 mÃ³dulos implementadas y funcionando |
| Arquitectura AI-Native | 20% | Context Engineering + Agent Orchestration integrados |
| Calidad del cÃ³digo | 15% | SonarQube grade A, cobertura â‰¥85%, TypeScript strict |
| Testing exhaustivo | 15% | Unit + Integration + E2E + Agent evals |
| DocumentaciÃ³n tÃ©cnica | 10% | AGENTS.md, ADRs, README, diagramas C4 generados con IA |
| Gobernanza de IA | 10% | PolÃ­tica de uso, guardrails configurados, audit log |

---

## 7. Sistema de CertificaciÃ³n

### 7.1 Ãrbol de Certificaciones

```
CASE Academy â€” Mapa de Certificaciones

  M1 â”€â”€â–º CASE Certified Foundations Engineer         (CF)
  M2 â”€â”€â–º CASE Certified Context Engineer             (CC)
  M3 â”€â”€â–º CASE Certified Agent Engineer               (CA)
  M4 â”€â”€â–º CASE Certified DevOps AI Engineer           (CD)
M1-M4 â”€â”€â–º CASE Certified AI Engineer                 (CE)  â† intermedia
  M5 â”€â”€â–º CASE Certified Enterprise Architect         (CEA)
  M6 â”€â”€â–º CASE Certified AI Governance Specialist     (CGS)
M1-M6 â”€â”€â–º CASE Certified AI Engineering Lead         (CL)  â† mÃ¡xima
```

### 7.2 Requisitos por CertificaciÃ³n

#### CASE Certified Foundations Engineer (CF) â€” Entrada

- âœ… Completar las 12 clases del MÃ³dulo 1
- âœ… Aprobar el Proyecto Final C12 con rÃºbrica â‰¥70%
- âœ… Completar al menos 4 laboratorios del catÃ¡logo M1
- âœ… AutoevaluaciÃ³n final con â‰¥75% de respuestas correctas

#### CASE Certified AI Engineer (CE) â€” Intermedia

- âœ… CASE CF obtenida
- âœ… M2 y M3 completados (CC y CA obtenidas)
- âœ… Proyecto M3 aprobado con rÃºbrica â‰¥75%
- âœ… Portfolio de 3 entregables publicados en GitHub

#### CASE Certified AI Engineering Lead (CL) â€” MÃ¡xima

- âœ… CASE CE obtenida
- âœ… M4, M5, M6 completados
- âœ… Capstone Final aprobado con rÃºbrica â‰¥80%
- âœ… ContribuciÃ³n a la Biblioteca: mÃ­nimo 1 patrÃ³n o caso de estudio original

### 7.3 Formato del Certificado

- Badge digital (compatible con LinkedIn Open Badges)
- PDF firmado con fecha, mÃ³dulos completados y puntuaciÃ³n
- Enlace verificable al portfolio del estudiante en GitHub

---

## 8. NavegaciÃ³n â€” Mapa Completo de Rutas

### 8.1 Ãrbol de Rutas de la Plataforma

```
CASE Academy â€” Ãrbol de NavegaciÃ³n Completo

/                          â†’ Onboarding / Home de bienvenida
/perfil                    â†’ Perfil del estudiante + progreso
/roadmap                   â†’ Mapa completo de la academia (este documento visual)

/m1                        â†’ MÃ³dulo 1: CASE Foundations (LIVE)
  /m1/overview             â†’ DescripciÃ³n + prerrequisitos + plan
  /m1/clase/1              â†’ C1: Fundamentos IA Generativa
  /m1/clase/2              â†’ C2: Spring Boot con IA
  /m1/clase/3              â†’ C3: MigraciÃ³n Legacy
  /m1/clase/4              â†’ C4: APIs + MCP
  /m1/clase/5              â†’ C5: Testing Avanzado
  /m1/clase/6              â†’ C6: Angular Signals
  /m1/clase/7              â†’ C7: Frontend Legacy
  /m1/clase/8              â†’ C8: Estado Reactivo
  /m1/clase/9              â†’ C9: Testing E2E
  /m1/clase/10             â†’ C10: RAG + FastAPI
  /m1/clase/11             â†’ C11: Lambda + Bedrock
  /m1/clase/12             â†’ C12: Proyecto Final
  /m1/recursos/instalacion â†’ GuÃ­as de InstalaciÃ³n
  /m1/recursos/tech-stack  â†’ Tech Stack BancoFiel
  /m1/recursos/plan        â†’ Plan de Estudio Detallado

/m2                        â†’ MÃ³dulo 2: Context Engineering (ðŸ”’ Q3 2026)
/m3                        â†’ MÃ³dulo 3: Agent Engineering (ðŸ”’ Q4 2026)
/m4                        â†’ MÃ³dulo 4: Dev Automation (ðŸ”’ Q1 2027)
/m5                        â†’ MÃ³dulo 5: Enterprise Architecture (ðŸ”’ Q2 2027)
/m6                        â†’ MÃ³dulo 6: AI Quality & Governance (ðŸ”’ Q3 2027)

/biblioteca                â†’ CASE Library
  /biblioteca/agentes
  /biblioteca/contextos
  /biblioteca/prompts
  /biblioteca/patrones
  /biblioteca/checklists
  /biblioteca/templates
  /biblioteca/casos-de-estudio

/laboratorios              â†’ CASE Labs
  /laboratorios/py01
  /laboratorios/aws01
  /laboratorios/docker01
  /laboratorios/mcp01
  /laboratorios/rag01
  /laboratorios/signals01
  /laboratorios/hexagonal01
  /laboratorios/agents01

/framework                 â†’ CASE Framework
  /framework/principios
  /framework/roles
  /framework/artefactos
  /framework/workflow
  /framework/metricas
  /framework/gobernanza

/certificaciones           â†’ Sistema de Certificaciones
  /certificaciones/cf
  /certificaciones/ce
  /certificaciones/cl

# REDIRECTS DE COMPATIBILIDAD (URLs actuales del sitio â€” permanentes)
/clase1-dev-fundamentos       â†’ /m1/clase/1
/clase2-dev-spring-boot       â†’ /m1/clase/2
/clase3-dev-migracion-legacy  â†’ /m1/clase/3
/clase4-dev-integracion-apis  â†’ /m1/clase/4
/clase5-dev-testing-avanzado  â†’ /m1/clase/5
/clase6-dev-modulo-angular    â†’ /m1/clase/6
/clase7-dev-frontend-legacy   â†’ /m1/clase/7
/clase8-dev-estado-rxjs       â†’ /m1/clase/8
/clase9-dev-testing-e2e       â†’ /m1/clase/9
/clase10-dev-fastapi          â†’ /m1/clase/10
/clase11-dev-lambda-serverlessâ†’ /m1/clase/11
/clase12-dev-proyecto-final   â†’ /m1/clase/12
/installation-guides          â†’ /m1/recursos/instalacion
/tech-stack                   â†’ /m1/recursos/tech-stack
/plan-dev-detallado           â†’ /m1/recursos/plan
/study-plan                   â†’ /m1/recursos/plan
```

### 8.2 Sidebar de NavegaciÃ³n â€” Estructura Visual

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  CASE ACADEMY                   ðŸ    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Mi Progreso: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘ 60%         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                      â”‚
â”‚  ðŸ“¦ MÃ“DULO 1: CASE Foundations â–¼    â”‚
â”‚  âœ… Overview del MÃ³dulo              â”‚
â”‚                                      â”‚
â”‚  â”Œâ”€ ðŸ”µ BLOQUE A: AI Dev Toolkit     â”‚
â”‚  â”‚  âœ… C1 Â· Fundamentos IA          â”‚
â”‚  â”‚  âœ… C2 Â· Spring Boot             â”‚
â”‚  â”‚  âœ… C3 Â· MigraciÃ³n Legacy        â”‚
â”‚  â”‚  âœ… C4 Â· APIs + MCP              â”‚
â”‚  â”‚                                   â”‚
â”‚  â”œâ”€ ðŸŸ¡ BLOQUE B: Full-Stack AI      â”‚
â”‚  â”‚  âœ… C5 Â· Testing Avanzado        â”‚
â”‚  â”‚  âœ… C6 Â· Angular Signals         â”‚
â”‚  â”‚  ðŸ”„ C7 Â· Frontend Legacy    â—„â”€â”€ â”‚
â”‚  â”‚  â¬œ C8 Â· Estado Reactivo         â”‚
â”‚  â”‚                                   â”‚
â”‚  â”œâ”€ â¬œ BLOQUE C: AI-Native Ent.     â”‚
â”‚  â”‚  â¬œ C9  Â· Testing E2E            â”‚
â”‚  â”‚  â¬œ C10 Â· RAG + FastAPI          â”‚
â”‚  â”‚  â¬œ C11 Â· Lambda + Bedrock       â”‚
â”‚  â”‚                                   â”‚
â”‚  â””â”€ â¬œ ðŸ† C12 Â· Proyecto Final      â”‚
â”‚                                      â”‚
â”‚  ðŸ“ Recursos M1 â–¼                   â”‚
â”‚     ðŸ“„ Plan de Estudio              â”‚
â”‚     ðŸ”§ GuÃ­as de InstalaciÃ³n         â”‚
â”‚     ðŸ› ï¸ Tech Stack BancoFiel         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ“¦ MÃ“DULO 2: Context Eng.   ðŸ”’ Q3  â”‚
â”‚  ðŸ“¦ MÃ“DULO 3: Agent Eng.     ðŸ”’ Q4  â”‚
â”‚  ðŸ“¦ MÃ“DULO 4: Dev Automation  ðŸ”’ Q1 â”‚
â”‚  ðŸ“¦ MÃ“DULO 5: Enterprise Arch ðŸ”’ Q2 â”‚
â”‚  ðŸ“¦ MÃ“DULO 6: AI Governance   ðŸ”’ Q3 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ“š CASE Library                    â”‚
â”‚  ðŸ§ª CASE Labs                       â”‚
â”‚  âš™ï¸  CASE Framework                 â”‚
â”‚  ðŸ… Certificaciones                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Leyenda: âœ… Completado Â· ðŸ”„ En progreso Â· â¬œ Pendiente Â· ðŸ”’ No disponible
```

---

## 9. Experiencia del Estudiante

### 9.1 Journey del Estudiante â€” Timeline Completo

```
DÃA 0 â€” Onboarding
   â”œâ”€ Bienvenida al programa
   â”œâ”€ DiagnÃ³stico de conocimientos previos (quiz 10 preguntas)
   â”œâ”€ Setup del entorno guiado (Labs: PY01 si aplica, AWS01 si aplica)
   â””â”€ Primer AGENTS.md: el estudiante se define como agente
         "ActÃºa como desarrollador senior de BancoFiel..."

SEMANA 1 â€” C1: Primeros pasos
   â”œâ”€ [Pre-clase]  Leer: "El mito del ChatGPT hace todo el cÃ³digo"
   â”œâ”€ [Clase]      90 min Â· Fundamentos + primer prompt estructurado
   â”œâ”€ [Post-clase] Reto: AGENTS.md del mÃ³dulo de Clientes
   â””â”€ [ReflexiÃ³n]  "Â¿QuÃ© cambiÃ³ en tu forma de usar la IA esta semana?"

SEMANAS 2â€“4 â€” Bloque A (Backend)
   â”œâ”€ Cada clase: Contexto â†’ Demo â†’ Prompt â†’ Resultado â†’ RevisiÃ³n
   â”œâ”€ Entregable incremental: ms-clientes â†’ migraciÃ³n â†’ APIs + MCP
   â””â”€ CHECKPOINT A (fin semana 4): AutoevaluaciÃ³n de Bloque A

SEMANAS 5â€“8 â€” Bloque B (Frontend)
   â”œâ”€ Reset deliberado de dificultad (nuevo dominio â†’ dificultad baja)
   â”œâ”€ Entregable incremental: componente â†’ migraciÃ³n â†’ estado global
   â””â”€ CHECKPOINT B (fin semana 8): AutoevaluaciÃ³n de Bloque B

SEMANAS 9â€“11 â€” Bloque C (AI-Native)
   â”œâ”€ IntegraciÃ³n de conocimientos previos con nuevas tecnologÃ­as
   â”œâ”€ Entregable incremental: E2E suite â†’ RAG service â†’ Lambda
   â””â”€ CHECKPOINT C (fin semana 11): Pre-evaluaciÃ³n para Proyecto Final

SEMANA 12 â€” Proyecto Final
   â”œâ”€ Kick-off: Arquitectura del sistema con IA (dÃ­a 1)
   â”œâ”€ ImplementaciÃ³n con IA como co-desarrollador (dÃ­as 2â€“4)
   â”œâ”€ Demo + Entrega + Peer review (dÃ­a 5)
   â””â”€ Solicitud de certificaciÃ³n CASE CF
```

### 9.2 Modelo PedagÃ³gico: Ciclo CASE

Cada clase sigue el mismo ciclo pedagÃ³gico de 4 pasos:

```
C â€” CONTEXTO (10 min)
â”‚   "Â¿QuÃ© problema de BancoFiel resolvemos hoy?"
â”‚   Slide de objetivos + prerrequisitos + entregable de la clase.
â”‚
A â€” ANÃLISIS (15 min)
â”‚   "Â¿CÃ³mo lo harÃ­a sin IA?" â†’ "Â¿CÃ³mo lo harÃ­a con IA?"
â”‚   Contraste explÃ­cito entre enfoque legacy y AI-assisted.
â”‚
S â€” SÃNTESIS (45 min)
â”‚   Demo en vivo: el instructor construye el entregable con IA.
â”‚   El estudiante replica en paralelo con su propio proyecto.
â”‚
E â€” EVALUACIÃ“N (20 min)
    Reto: el estudiante aplica lo aprendido a un caso diferente.
    Criterios claros: Â¿quÃ© debe funcionar? Â¿quÃ© debe ser testeable?
```

### 9.3 Sistema de Checkpoints

| Checkpoint | Momento | Formato | Criterio de paso |
|---|---|---|---|
| DiagnÃ³stico inicial | DÃ­a 0 | Quiz 10 preguntas | Solo diagnÃ³stico |
| Checkpoint A | Fin semana 4 | AutoevaluaciÃ³n + entregables | ms-clientes + migraciÃ³n + MCP funcionando |
| Checkpoint B | Fin semana 8 | AutoevaluaciÃ³n + entregables | Frontend integrado con estado global |
| Checkpoint C | Fin semana 11 | AutoevaluaciÃ³n tÃ©cnica | E2E suite + RAG + Lambda corriendo |
| Proyecto Final | Semana 12 | RÃºbrica formal | â‰¥70% en todos los criterios |

### 9.4 Indicadores de Progreso (UI)

El estudiante ve en todo momento:
- **Progreso del mÃ³dulo** â€” % de clases completadas
- **Bloque actual** â€” A / B / C / Proyecto
- **Entregables completados** â€” check por entregable
- **PrÃ³xima clase disponible**
- **Hito de certificaciÃ³n** â€” cuÃ¡ntas clases faltan para CF

### 9.5 Modos de Estudio

| Modo | DedicaciÃ³n | DuraciÃ³n M1 | Para quiÃ©n |
|---|---|---|---|
| **Intensivo** | 5 h/semana | 12 semanas | Dev con bloque dedicado de estudio |
| **EstÃ¡ndar** | 3 h/semana | 16 semanas | Dev que estudia en paralelo al trabajo |
| **Flexible** | A tu ritmo | Sin lÃ­mite | Self-paced sin fecha de vencimiento |

### 9.6 Recursos de Apoyo por Clase

| Recurso | Formato | CuÃ¡ndo usarlo |
|---|---|---|
| Lab complementario | Tutorial paso a paso | Antes de clase con prerequisito tÃ©cnico |
| Glosario tÃ©cnico | Searchable | Cuando aparece un tÃ©rmino desconocido |
| FAQ por clase | Lista expandible | Al terminar con dudas |
| Caso de estudio | ArtÃ­culo largo | Para profundizar despuÃ©s de la clase |
| Checklist de entregable | Markdown | Antes de entregar para asegurar completitud |

---

## 10. Glosario del Programa

| TÃ©rmino | DefiniciÃ³n en el contexto de CASE Academy |
|---|---|
| **AGENTS.md** | Archivo de especificaciÃ³n de contexto: quiÃ©n eres, cuÃ¡l es el proyecto, el stack y las restricciones. Equivalente a un system prompt persistente para agentes de cÃ³digo. |
| **Agentic Self-Fixing** | Bucle automÃ¡tico: test falla â†’ agente genera fix â†’ test se ejecuta â†’ si pasa se acepta; si falla el bucle se repite. |
| **BancoFiel** | Banco ficticio con +500,000 usuarios activos. Caso de uso central de CASE Academy. Sistema legacy en migraciÃ³n hacia arquitectura AI-Native. |
| **CASE Framework** | MetodologÃ­a propia de la academia para AI-assisted software engineering: roles, artefactos, flujos y mÃ©tricas. |
| **Ciclo CASE** | Modelo pedagÃ³gico de 4 pasos: Contexto â†’ AnÃ¡lisis â†’ SÃ­ntesis â†’ EvaluaciÃ³n. Estructura de cada clase. |
| **Circuit Breaker** | PatrÃ³n de resiliencia que "abre el circuito" cuando un servicio falla repetidamente, evitando cascadas de fallos. |
| **Context Engineering** | Disciplina de diseÃ±ar, estructurar y mantener el contexto que se provee a un modelo de IA para maximizar la calidad de sus respuestas. |
| **MCP (Model Context Protocol)** | Protocolo estÃ¡ndar que permite a los agentes interactuar con herramientas externas (DBs, APIs, archivos) de forma estandarizada. |
| **RAG (Retrieval-Augmented Generation)** | PatrÃ³n donde la IA combina generaciÃ³n de texto con recuperaciÃ³n de informaciÃ³n de una base de conocimiento externa. |
| **Self-Healing Tests** | Tests E2E que detectan selectores rotos y usan IA para encontrar el nuevo selector automÃ¡ticamente. |
| **Spec-Driven Development** | MetodologÃ­a donde se escribe primero la especificaciÃ³n formal (AGENTS.md) antes de generar cÃ³digo con IA. |
| **Smart Component** | Componente Angular que conoce el estado de la aplicaciÃ³n e interactÃºa con servicios. |
| **Dumb Component** | Componente Angular que solo recibe datos por @Input y emite eventos por @Output. Sin dependencias de servicios. |

---

## 11. MÃ©tricas de la Academia

### 11.1 MÃ©tricas de Completitud

| MÃ©trica | Meta M1 |
|---|---|
| Tasa de completitud de clases | â‰¥70% |
| Tasa de aprobaciÃ³n del Proyecto Final | â‰¥80% |
| NPS del mÃ³dulo | â‰¥60 |
| Tiempo promedio de completitud | â‰¤18 semanas |

### 11.2 MÃ©tricas de Aprendizaje

| MÃ©trica | DescripciÃ³n |
|---|---|
| Calidad del AGENTS.md final | RÃºbrica: secciones completas, contexto claro, stack especÃ­fico |
| Cobertura de tests del Proyecto Final | Debe ser â‰¥80% (JaCoCo + Pytest) |
| Complejidad ciclomÃ¡tica del cÃ³digo | Promedio <10 por mÃ©todo |
| Ratio prompts estructurados | % de prompts documentados usando ROL/CONTEXTO/TAREA |

### 11.3 MÃ©tricas de la Plataforma

| MÃ©trica | Meta |
|---|---|
| Tiempo de primera carga (LCP) | â‰¤2.5s |
| Tasa de rebote en clase | <30% (estudiantes que salen antes del 50%) |
| Clases mÃ¡s visitadas | Top 3 monitoreadas mensualmente |

---

## 12. Principios de DiseÃ±o de la Academia

### P1: BancoFiel como Sistema Real
Todo lo que se aprende se aplica directamente a BancoFiel. No hay ejercicios abstractos. El estudiante construye un sistema que podrÃ­a existir en producciÃ³n.

### P2: El criterio tÃ©cnico primero
La IA es una herramienta. El ingeniero valida, decide y es responsable. El curso nunca enseÃ±a a aceptar cÃ³digo generado sin revisiÃ³n crÃ­tica.

### P3: Incremental y Acumulativo
Cada entregable de clase es un ladrillo del siguiente. Al terminar M1, el estudiante tiene 12 artefactos reales en su GitHub.

### P4: La dificultad reinicia con cada dominio nuevo
Al empezar Bloque B (Frontend), la dificultad baja deliberadamente. Es una seÃ±al pedagÃ³gica, no una inconsistencia. El estudiante gana confianza antes de escalar de nuevo.

### P5: Formatos pedagÃ³gicos mÃºltiples
Las clases son slideshows. Los labs son tutoriales paso a paso. Los casos de estudio son artÃ­culos. Los patrones son fichas de referencia. Cada tipo de conocimiento tiene su formato ideal.

### P6: Gobernanza desde el inicio
La seguridad, el uso responsable y la gobernanza de IA no son un mÃ³dulo final. Se mencionan desde C1 y se refuerzan en cada clase. En M6 se formalizan â€” pero el estudiante ya los practica desde el dÃ­a 1.

---

*VersiÃ³n 1.0.0 â€” Arquitectura definitiva del curso. No modifica ningÃºn archivo de cÃ³digo.*  
*Rol: Product Architect + Instructional Designer*  
*Siguiente acciÃ³n: AprobaciÃ³n del propietario. Luego: implementaciÃ³n por fases segÃºn MASTER_PLAN.md.*