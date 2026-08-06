> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# MASTER PLAN â€” Plan Maestro de EvoluciÃ³n de la Plataforma
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**VersiÃ³n:** 2.0.0 â€” RevisiÃ³n independiente de Enterprise Architect incorporada.

> **Historial de versiones:**
> - v1.0.0 â€” AuditorÃ­a inicial (Principal Architect interno)
> - v2.0.0 â€” RevisiÃ³n crÃ­tica independiente (Enterprise Architect externo). Recomendaciones cuestionadas, corregidas y reclasificadas. Incorpora matriz Impacto vs Esfuerzo.

---

## 1. Estado Actual (As-Is)

### 1.1 Resumen Ejecutivo

| DimensiÃ³n | Estado Actual |
|---|---|
| **Tipo** | SPA Angular monolÃ­tica desplegada en GitHub Pages |
| **PropÃ³sito** | Plataforma de presentaciones para un curso de IA Generativa (12 clases) |
| **Framework** | Angular ^22.0.0 + TypeScript ~6.0.2 |
| **Estilos** | Tailwind CDN + CSS custom properties (mezcla sin design system) |
| **Routing** | Hash-based, 16 rutas planas en un solo archivo |
| **Tests** | 0 tests (skipTests: true en todos los schematics) |
| **Componentes shared** | 0 componentes reutilizables |
| **Servicios** | 0 servicios Angular |
| **Estado** | Local (class properties) â€” Sin Signal Store |
| **Despliegue** | GitHub Actions â†’ GitHub Pages (automatizado) |
| **Contenido** | 12 clases prÃ¡cticas + 3 recursos (plan, instalaciÃ³n, tech stack) |

### 1.2 Fortalezas Actuales

- âœ… Contenido tÃ©cnico de alta calidad y relevancia
- âœ… Lazy loading implementado correctamente
- âœ… SEO con meta tags completos, OG, Twitter Cards, JSON-LD
- âœ… Dark theme consistente y diseÃ±o visual de calidad
- âœ… Pipeline de deploy automatizado y funcional
- âœ… Caso de uso real (BancoFiel) bien contextualizado
- âœ… ProgresiÃ³n pedagÃ³gica correctamente calibrada

### 1.3 Deudas TÃ©cnicas CrÃ­ticas

- âŒ Tailwind cargado vÃ­a CDN (antipatrÃ³n de producciÃ³n)
- âŒ 0 tests â€” proyecto educativo sin cobertura es contradictorio
- âŒ Routing plano: insostenible para 6 mÃ³dulos y 60+ clases
- âŒ Links de navegaciÃ³n duplicados y hardcodeados en el sidebar
- âŒ `shared-presentation.css` monolÃ­tico de 1,434 lÃ­neas
- âŒ LÃ³gica de slideshow duplicada en los 12 componentes
- âŒ Sin design system formal
- âŒ Sin gestiÃ³n de estado centralizada
- âŒ `*ngIf` en lugar de `@if` (Angular 17+ syntax)
- âŒ Inconsistencias de versiÃ³n en documentaciÃ³n

---

## 2. Estado Objetivo (To-Be)

### 2.1 VisiÃ³n de la Plataforma

Transformar este repositorio en una **Plataforma Profesional de Aprendizaje para IngenierÃ­a de Software asistida por IA** que:

1. Soporte el crecimiento durante **5+ aÃ±os** sin refactorizaciones mayores.
2. Aloje un programa completo de **6 mÃ³dulos** y **60-80 clases**.
3. Provea una **biblioteca reutilizable** de agentes, contextos, prompts, patrones, checklists y templates.
4. Cuente con un **Framework propio** de metodologÃ­a para desarrollo asistido por IA.
5. Sea un proyecto de referencia de calidad: con tests, documentaciÃ³n, diseÃ±o coherente y accesibilidad.

### 2.2 Arquitectura Objetivo

```
Plataforma: Software Engineering con IA
â”‚
â”œâ”€â”€ Bienvenida                    â†’ HomeComponent
â”œâ”€â”€ IntroducciÃ³n                  â†’ IntroductionComponent
â”‚
â”œâ”€â”€ MÃ³dulo 1: IA Generativa       â†’ [TODO EL CONTENIDO ACTUAL]
â”‚   â”œâ”€â”€ Plan de Estudio
â”‚   â”œâ”€â”€ GuÃ­as de InstalaciÃ³n
â”‚   â”œâ”€â”€ Tech Stack BancoFiel
â”‚   â””â”€â”€ Clases 1-12 (preservadas)
â”‚
â”œâ”€â”€ MÃ³dulo 2: IngenierÃ­a de Contexto    â†’ [NUEVO]
â”œâ”€â”€ MÃ³dulo 3: IngenierÃ­a de Agentes     â†’ [NUEVO]
â”œâ”€â”€ MÃ³dulo 4: AutomatizaciÃ³n del Dev    â†’ [NUEVO]
â”œâ”€â”€ MÃ³dulo 5: Arquitectura Empresarial  â†’ [NUEVO]
â”œâ”€â”€ MÃ³dulo 6: Calidad con IA            â†’ [NUEVO]
â”‚
â”œâ”€â”€ Biblioteca                    â†’ [NUEVO]
â”‚   â”œâ”€â”€ Agentes
â”‚   â”œâ”€â”€ Contextos
â”‚   â”œâ”€â”€ Prompts
â”‚   â”œâ”€â”€ Patrones
â”‚   â”œâ”€â”€ Checklists
â”‚   â”œâ”€â”€ Casos de Estudio
â”‚   â””â”€â”€ Templates
â”‚
â””â”€â”€ Framework                     â†’ [NUEVO]
    â”œâ”€â”€ Principios
    â”œâ”€â”€ Roles
    â”œâ”€â”€ Artefactos
    â”œâ”€â”€ Workflow
    â””â”€â”€ Gobernanza
```

---

## 3. Roadmap Completo de MigraciÃ³n

### Principios del Roadmap

- **Cada paso es reversible** â€” ningÃºn cambio masivo.
- **Primero infraestructura, luego contenido** â€” sin romper lo que funciona.
- **Compatibilidad de URLs garantizada** â€” los redirects se crean antes de mover archivos.
- **Tests antes de cada migraciÃ³n** â€” no mover lo que no podemos verificar.
- **Un paso a la vez, verificar y continuar**.

---

### FASE 0 â€” Prerequisitos y ConfiguraciÃ³n (Antes de todo)

**Objetivo:** Estabilizar el entorno antes de cualquier cambio de estructura.

**DuraciÃ³n estimada:** 2-3 dÃ­as  
**Riesgo:** BAJO  
**Reversible:** 100%

| Paso | AcciÃ³n | Archivos Afectados | VerificaciÃ³n |
|---|---|---|---|
| 0.1 | Crear branch `refactor/phase-0` en Git | `.git/` | `git checkout -b refactor/phase-0` |
| 0.2 | Instalar Tailwind v4 como npm | `package.json`, `angular.json` | `npm run build` sin errores |
| 0.3 | Remover script CDN de Tailwind de `index.html` | `src/index.html` | App sigue funcionando visualmente |
| 0.4 | Activar `strict: true` en tsconfig | `tsconfig.json` | Resolver errores de tipo resultantes |
| 0.5 | Configurar ESLint para Angular | `eslint.config.js` | `ng lint` pasa |
| 0.6 | Corregir `*ngIf` â†’ `@if` en `app.html` | `src/app/app.html` | App sigue funcionando |
| 0.7 | Crear carpeta `docs/` con todos los documentos de auditorÃ­a | `docs/` | âœ… YA HECHO |

---

### FASE 1 â€” Core y Modelos (Semana 1)

**Objetivo:** Crear la infraestructura de datos sin mover ningÃºn archivo de contenido.

**DuraciÃ³n estimada:** 3-4 dÃ­as  
**Riesgo:** BAJO  
**Reversible:** 100% (solo se agregan archivos nuevos)

| Paso | AcciÃ³n | Archivos Nuevos |
|---|---|---|
| 1.1 | Crear `src/app/core/` | Directorio |
| 1.2 | Crear interfaces TypeScript del curso | `core/models/course.model.ts` |
| 1.3 | Crear `CourseService` con datos del MÃ³dulo 1 | `core/services/course.service.ts` |
| 1.4 | Crear `NavigationService` | `core/services/navigation.service.ts` |
| 1.5 | Crear `src/app/shared/styles/` | `shared/styles/_variables.css` |
| 1.6 | Migrar CSS custom properties a `_variables.css` | Refactor de `styles.css` |

---

### FASE 2 â€” Layout Components (Semana 2)

**Objetivo:** Extraer el Sidebar y Mobile Menu a componentes independientes.

**DuraciÃ³n estimada:** 3-4 dÃ­as  
**Riesgo:** MEDIO (toca el componente root)  
**Reversible:** SÃ­, via Git revert

| Paso | AcciÃ³n | Notas |
|---|---|---|
| 2.1 | Crear `SidebarComponent` | Importa `CourseService` â€” genera navigation dinÃ¡micamente |
| 2.2 | Crear `MobileMenuComponent` | Reutiliza mismos datos que Sidebar |
| 2.3 | Refactorizar `app.html` para usar los nuevos componentes | Eliminar duplicaciÃ³n |
| 2.4 | Verificar que todos los 16 links del sidebar funcionan | Test manual |
| 2.5 | Eliminar `classesOpen` no usado de `app.ts` | Cleanup |

---

### FASE 3 â€” Routing Jerarquizado (Semana 2-3)

**Objetivo:** Migrar de routing plano a child routes por mÃ³dulo.

**DuraciÃ³n estimada:** 4-5 dÃ­as  
**Riesgo:** MEDIO-ALTO (cambios de routing pueden romper navegaciÃ³n)  
**Reversible:** SÃ­ â€” los redirects garantizan compatibilidad

| Paso | AcciÃ³n | Notas |
|---|---|---|
| 3.1 | Crear `app/features/` directorio | Sin mover contenido |
| 3.2 | Crear `module-1.routes.ts` con child routes | Rutas nuevas bajo `/modulo-1/` |
| 3.3 | **PRIMERO**: Agregar redirects en `app.routes.ts` | `/clase1-dev-fundamentos` â†’ `/modulo-1/clase/1` etc. |
| 3.4 | Verificar que redirects funcionan | Test manual de TODAS las URLs actuales |
| 3.5 | Agregar ruta `/modulo-1` al routing principal | Lazy load del mÃ³dulo |
| 3.6 | Verificar navegaciÃ³n interna en sidebar | Test manual |

---

### FASE 4 â€” Mover Contenido Existente (Semana 3-4)

**Objetivo:** Mover los directorios de componentes a su nueva ubicaciÃ³n.

**DuraciÃ³n estimada:** 2-3 dÃ­as  
**Riesgo:** MEDIO (cambios de import paths)  
**Reversible:** SÃ­ â€” Git permite revertir movimientos de archivos

> âš ï¸ **PRECAUCIÃ“N:** Los imports dentro de los componentes deberÃ¡n actualizarse cuando se muevan. La ruta relativa a `shared-presentation.css` cambiarÃ¡.

| Paso | AcciÃ³n | ValidaciÃ³n |
|---|---|---|
| 4.1 | Mover `plan-dev-detallado/` a `features/modules/module-1-ia-generativa/overview/` | Verificar compilaciÃ³n |
| 4.2 | Mover `clase1-dev-fundamentos/` a `features/modules/module-1-ia-generativa/lessons/` | Verificar routing |
| 4.3 | Repetir para clases 2-12 (una a la vez) | Verificar cada una |
| 4.4 | Mover `installation-guides/` a `features/modules/module-1-ia-generativa/resources/` | Verificar routing |
| 4.5 | Mover `tech-stack/` a `features/modules/module-1-ia-generativa/resources/` | Verificar routing |
| 4.6 | Actualizar imports en `module-1.routes.ts` | Compilar y verificar |

---

### FASE 5 â€” Shared Slideshow Component (Semana 4-5)

**Objetivo:** Extraer la lÃ³gica duplicada de slideshow a un componente reutilizable.

**DuraciÃ³n estimada:** 3-4 dÃ­as  
**Riesgo:** MEDIO (toca 12 componentes)  
**Reversible:** SÃ­ â€” los componentes originales se mantienen hasta que el nuevo estÃ© probado

| Paso | AcciÃ³n |
|---|---|
| 5.1 | Crear `shared/components/slide-show/` con lÃ³gica genÃ©rica |
| 5.2 | Probar con Clase 1 Ãºnicamente |
| 5.3 | Validar que el comportamiento es idÃ©ntico al original |
| 5.4 | Migrar el resto de clases al componente compartido (una a la vez) |

---

### FASE 6 â€” ModularizaciÃ³n de CSS (Semana 5-6)

**Objetivo:** Dividir `shared-presentation.css` en parciales temÃ¡ticos.

**DuraciÃ³n estimada:** 3-4 dÃ­as  
**Riesgo:** BAJO (los estilos no cambian, solo su organizaciÃ³n)

| Paso | AcciÃ³n |
|---|---|
| 6.1 | Crear `shared/styles/` con parciales vacÃ­os |
| 6.2 | Mover CSS de variables â†’ `_variables.css` |
| 6.3 | Mover CSS de cards â†’ `_cards.css` |
| 6.4 | Mover CSS de slides â†’ `_slides.css` |
| 6.5 | Mover CSS de cÃ³digo â†’ `_code.css` |
| 6.6 | Crear `index.css` barrel |
| 6.7 | Actualizar referencias en todos los componentes |
| 6.8 | Deprecar `shared-presentation.css` original |

---

### FASE 7 â€” Nuevas Secciones (Semana 6-10)

**Objetivo:** Crear las nuevas secciones de la plataforma.

| SecciÃ³n | DuraciÃ³n | Prioridad |
|---|---|---|
| HomePage (Bienvenida) | 2 dÃ­as | ALTA |
| Placeholder de mÃ³dulos 2-6 | 1 dÃ­a | ALTA |
| Biblioteca (estructura vacÃ­a navegable) | 3 dÃ­as | MEDIA |
| Framework (estructura vacÃ­a navegable) | 2 dÃ­as | MEDIA |
| Contenido de MÃ³dulo 2 | 2-3 semanas | BAJA (requiere planificaciÃ³n pedagÃ³gica) |

---

### FASE 8 â€” Tests y Calidad (Continuo)

**Objetivo:** Implementar suite de tests bÃ¡sica.

| Tipo de Test | Herramienta | Prioridad |
|---|---|---|
| Unit tests para Services (CourseService, NavigationService) | Jest/Jasmine | ALTA |
| Component tests para Sidebar | Angular Testing Library | ALTA |
| E2E tests de navegaciÃ³n (rutas crÃ­ticas) | Playwright | MEDIA |
| Accessibility audit | axe-core | MEDIA |

---

## 4. DiseÃ±o de la Biblioteca Reutilizable

### 4.1 Estructura de la Biblioteca

La **Biblioteca** serÃ¡ una secciÃ³n de la plataforma con recursos clasificados y reutilizables para los estudiantes:

```
/biblioteca
â”œâ”€â”€ /agentes              # Definiciones de agentes especializados
â”‚   â”œâ”€â”€ agente-java-architect
â”‚   â”œâ”€â”€ agente-spring-boot-developer
â”‚   â”œâ”€â”€ agente-legacy-migrator
â”‚   â”œâ”€â”€ agente-testing-engineer
â”‚   â””â”€â”€ agente-angular-developer
â”‚
â”œâ”€â”€ /contextos            # Plantillas de contexto (AGENTS.md)
â”‚   â”œâ”€â”€ contexto-bancofiel-backend
â”‚   â”œâ”€â”€ contexto-angular-project
â”‚   â”œâ”€â”€ contexto-microservicio-java
â”‚   â””â”€â”€ contexto-python-rag
â”‚
â”œâ”€â”€ /prompts              # Biblioteca de prompts estructurados
â”‚   â”œâ”€â”€ prompts-backend-java
â”‚   â”œâ”€â”€ prompts-frontend-angular
â”‚   â”œâ”€â”€ prompts-testing
â”‚   â”œâ”€â”€ prompts-migracion-legacy
â”‚   â””â”€â”€ prompts-arquitectura
â”‚
â”œâ”€â”€ /patrones             # Patrones de diseÃ±o con asistencia IA
â”‚   â”œâ”€â”€ patron-hexagonal-con-ia
â”‚   â”œâ”€â”€ patron-rag-enterprise
â”‚   â”œâ”€â”€ patron-mcp-server
â”‚   â””â”€â”€ patron-agentic-testing
â”‚
â”œâ”€â”€ /checklists           # Checklists por dominio
â”‚   â”œâ”€â”€ checklist-code-review-ia
â”‚   â”œâ”€â”€ checklist-migracion-legacy
â”‚   â”œâ”€â”€ checklist-seguridad-ia
â”‚   â””â”€â”€ checklist-deploy-produccion
â”‚
â”œâ”€â”€ /templates            # Plantillas reutilizables
â”‚   â”œâ”€â”€ template-agents-md
â”‚   â”œâ”€â”€ template-prompt-estructurado
â”‚   â”œâ”€â”€ template-arquitectura-hexagonal
â”‚   â””â”€â”€ template-plan-migracion
â”‚
â””â”€â”€ /casos-de-estudio     # Casos de estudio documentados
    â”œâ”€â”€ caso-bancofiel-migracion-vb6
    â”œâ”€â”€ caso-microservicio-prestamos
    â””â”€â”€ caso-rag-normativa-bancaria
```

### 4.2 Modelo de Datos de la Biblioteca

```typescript
export interface LibraryItem {
  id: string;
  type: 'agent' | 'context' | 'prompt' | 'pattern' | 'checklist' | 'template' | 'case-study';
  title: string;
  description: string;
  tags: string[];
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  relatedLessons: number[];    // IDs de clases relacionadas
  content: string;             // Contenido markdown
  lastUpdated: string;
}
```

---

## 5. DiseÃ±o del Framework del Curso

### 5.1 Nombre del Framework

**"AI-Driven Software Engineering Framework (ADSE Framework)"**

### 5.2 Secciones del Framework

```
/framework
â”‚
â”œâ”€â”€ /principios
â”‚   â”œâ”€â”€ P1: IA como multiplicador â€” el criterio tÃ©cnico es el acelerador
â”‚   â”œâ”€â”€ P2: Contexto de calidad = resultados de calidad
â”‚   â”œâ”€â”€ P3: EspecificaciÃ³n antes que implementaciÃ³n
â”‚   â”œâ”€â”€ P4: ValidaciÃ³n humana siempre
â”‚   â”œâ”€â”€ P5: IteraciÃ³n continua sobre resultados
â”‚   â””â”€â”€ P6: Seguridad y gobernanza no son opcionales
â”‚
â”œâ”€â”€ /roles
â”‚   â”œâ”€â”€ Prompt Engineer
â”‚   â”œâ”€â”€ AI Engineer
â”‚   â”œâ”€â”€ AI Architect
â”‚   â””â”€â”€ AI Engineering Lead
â”‚
â”œâ”€â”€ /artefactos
â”‚   â”œâ”€â”€ AGENTS.md â€” EspecificaciÃ³n de arquitectura para agentes
â”‚   â”œâ”€â”€ Prompt Estructurado â€” Plantilla ROL/CONTEXTO/TAREA/RESTRICCIONES
â”‚   â”œâ”€â”€ Servidor MCP â€” Conector de agentes a herramientas
â”‚   â””â”€â”€ Plan de MigraciÃ³n con IA
â”‚
â”œâ”€â”€ /workflow
â”‚   â”œâ”€â”€ Flujo: AnÃ¡lisis con IA
â”‚   â”œâ”€â”€ Flujo: GeneraciÃ³n asistida
â”‚   â”œâ”€â”€ Flujo: ValidaciÃ³n y correcciÃ³n
â”‚   â””â”€â”€ Flujo: Agentic Self-Fixing
â”‚
â”œâ”€â”€ /buenas-practicas
â”‚   â”œâ”€â”€ Seguridad en prompts
â”‚   â”œâ”€â”€ Manejo de alucinaciones
â”‚   â”œâ”€â”€ EspecificaciÃ³n de versiones
â”‚   â””â”€â”€ ValidaciÃ³n de cÃ³digo generado
â”‚
â”œâ”€â”€ /metricas
â”‚   â”œâ”€â”€ Velocidad de desarrollo (story points/sprint)
â”‚   â”œâ”€â”€ Cobertura de tests (>80%)
â”‚   â”œâ”€â”€ Calidad de prompts (tasa de Ã©xito en primer intento)
â”‚   â””â”€â”€ ROI del uso de IA
â”‚
â””â”€â”€ /gobernanza
    â”œâ”€â”€ Uso responsable de IA en empresa
    â”œâ”€â”€ Privacidad y datos sensibles
    â”œâ”€â”€ Licencias y propiedad intelectual
    â””â”€â”€ AuditorÃ­a de uso de IA
```

---

## 6. AnÃ¡lisis de Riesgos

| Riesgo | Probabilidad | Impacto | MitigaciÃ³n |
|---|---|---|---|
| Ruptura de navegaciÃ³n durante migraciÃ³n de rutas | MEDIA | ALTO | Implementar redirects ANTES de mover archivos |
| RegresiÃ³n visual al migrar Tailwind CDN â†’ npm | MEDIA | ALTO | Build y test visual en staging antes de merge |
| PÃ©rdida de contenido al mover carpetas | BAJA | CRÃTICO | Git con commits atÃ³micos, branch protegido |
| Incompatibilidad de Tailwind v4 con Angular 22 | BAJA | ALTO | Investigar antes de comenzar Fase 0 |
| Deuda tÃ©cnica en TypeScript al activar strict mode | ALTA | MEDIO | Reservar tiempo especÃ­fico para correcciones |
| Inconsistencia visual al dividir shared-presentation.css | MEDIA | MEDIO | Visual regression testing antes/despuÃ©s |
| Scope creep al agregar nuevas secciones antes de migrar existentes | ALTA | ALTO | Secuenciar estrictamente: migrar antes de crear |

---

## 7. EstimaciÃ³n de Tiempo

| Fase | DescripciÃ³n | DuraciÃ³n | Prioridad |
|---|---|---|---|
| 0 | Prerequisitos y configuraciÃ³n | 2-3 dÃ­as | INMEDIATA |
| 1 | Core y modelos de datos | 3-4 dÃ­as | ALTA |
| 2 | Layout components (Sidebar) | 3-4 dÃ­as | ALTA |
| 3 | Routing jerarquizado | 4-5 dÃ­as | ALTA |
| 4 | Mover contenido existente | 2-3 dÃ­as | ALTA |
| 5 | Shared slideshow component | 3-4 dÃ­as | MEDIA |
| 6 | ModularizaciÃ³n CSS | 3-4 dÃ­as | MEDIA |
| 7 | Nuevas secciones | 5-10 dÃ­as | MEDIA-BAJA |
| 8 | Tests y calidad (continuo) | Ongoing | ALTA |
| **TOTAL** | **MigraciÃ³n completa** | **~30-45 dÃ­as** | â€” |

---

## 8. Prioridad de Cambios

### 8.1 Cambios RÃ¡pidos (Quick Wins â€” <1 dÃ­a cada uno)

Estos cambios tienen alto impacto inmediato y bajo riesgo:

| # | Cambio | Tiempo | Impacto |
|---|---|---|---|
| QW1 | Remover `classesOpen` no usado de `app.ts` | 5 min | Limpieza de cÃ³digo |
| QW2 | Corregir `*ngIf` â†’ `@if` en `app.html` | 30 min | ModernizaciÃ³n Angular |
| QW3 | Actualizar README con versiÃ³n correcta de Angular | 10 min | DocumentaciÃ³n correcta |
| QW4 | Llenar `app.css` con estilos del shell o eliminarlo | 15 min | EliminaciÃ³n de confusiÃ³n |
| QW5 | Mover `study-plan-dev.md` a `public/assets/docs/` | 5 min | OrganizaciÃ³n de assets |
| QW6 | Crear `docs/` con los documentos de auditorÃ­a | âœ… YA HECHO | DocumentaciÃ³n |

### 8.2 Cambios de Alto Impacto (Alta prioridad â€” Fase 0-3)

| # | Cambio | Beneficio |
|---|---|---|
| HI1 | Migrar Tailwind CDN â†’ npm | Performance, reproducibilidad, tree-shaking |
| HI2 | Crear modelo de datos del curso (CourseService) | Elimina hardcoding, base para escalar |
| HI3 | Refactorizar sidebar con datos dinÃ¡micos | Escalabilidad del menÃº |
| HI4 | Implementar routing jerarquizado con redirects | Escalabilidad del routing |
| HI5 | Activar TypeScript strict | Calidad del cÃ³digo |

### 8.3 Cambios de Largo Plazo (Mes 2-3)

| # | Cambio | Beneficio |
|---|---|---|
| LP1 | Tests unitarios para servicios | Confiabilidad |
| LP2 | Shared slideshow component | DRY, mantenibilidad |
| LP3 | ModularizaciÃ³n de CSS | Mantenibilidad de estilos |
| LP4 | Crear secciones Biblioteca y Framework | Nueva funcionalidad |
| LP5 | Contenido de MÃ³dulo 2+ | Crecimiento del programa |
| LP6 | Accessibility audit y mejoras | Inclusividad |
| LP7 | Performance monitoring (Core Web Vitals) | UX |

---

## 9. DefiniciÃ³n de "Hecho" por Fase

### Fase 0 â€” Hecho cuando:
- [ ] `npm run build` pasa sin errores con Tailwind npm
- [ ] `ng lint` pasa sin errores de ESLint
- [ ] TypeScript strict activado con 0 errores de compilaciÃ³n
- [ ] App visualmente idÃ©ntica al estado actual en todos los browsers

### Fase 1-4 â€” Hecho cuando:
- [ ] Todas las rutas existentes responden (con redirect o directo)
- [ ] Sidebar muestra todos los links correctamente
- [ ] Todos los componentes de clase cargan correctamente
- [ ] El build de producciÃ³n pasa sin errores
- [ ] Deploy a GitHub Pages exitoso

### Fase 5-6 â€” Hecho cuando:
- [ ] 0 lÃ³gica duplicada de slideshow
- [ ] CSS dividido en parciales con barrel
- [ ] Sin regresiones visuales

### Fase 7+ â€” Hecho cuando:
- [ ] HomeComponent con diseÃ±o premium
- [ ] MÃ³dulos 2-6 con placeholder navegable
- [ ] Biblioteca con al menos 3 items por categorÃ­a
- [ ] Framework documentado con todos los secciones

---

## 10. PrÃ³ximos Pasos

**AcciÃ³n inmediata requerida:**

Antes de implementar cualquier cambio, se requiere **aprobaciÃ³n explÃ­cita** del siguiente orden de implementaciÃ³n:

1. Â¿Se aprueba comenzar con **Fase 0 (Quick Wins + Tailwind npm)**?
2. Â¿Se aprueba el **diseÃ±o de routing propuesto** en `NEW_STRUCTURE.md`?
3. Â¿Se aprueba el **modelo de datos del curso** propuesto?
4. Â¿Hay preferencia de tiempo estimado diferente para alguna fase?

**No se modificarÃ¡ ningÃºn archivo del proyecto hasta recibir aprobaciÃ³n explÃ­cita.**

---

## 11. Registro de Decisiones ArquitectÃ³nicas

| ID | DecisiÃ³n | Alternativa Considerada | JustificaciÃ³n |
|---|---|---|---|
| ADR-001 | Mantener Hash Routing | HTML5 History API | GitHub Pages requiere hash routing sin servidor que maneje rutas |
| ADR-002 | Child routes por mÃ³dulo | Routing plano extendido | Escalabilidad: 60+ rutas en un solo archivo es inmanejable |
| ADR-003 | Preservar todos los URLs actuales con redirects | Renombrar URLs | Compatibilidad con links externos y bookmarks existentes |
| ADR-004 | CourseService como fuente de datos | JSON estÃ¡tico en assets | Tipado TypeScript, lazy loading por mÃ³dulo, extensible a API remota |
| ADR-005 | Tailwind v4 npm | Tailwind CDN | Tree-shaking, performance, reproducibilidad, sin dependencia externa en runtime |
| ADR-006 | Angular Signals para estado | NgRx (Redux) | Menor complejidad para el volumen de estado actual. NgRx Signal Store como opciÃ³n futura. |

---

*Este documento requiere aprobaciÃ³n explÃ­cita antes de iniciar cualquier implementaciÃ³n.*  
*VersiÃ³n 1.0.0 â€” AuditorÃ­a interna completada en 2026-08-04*

---

---

# REVISIÃ“N INDEPENDIENTE â€” Enterprise Architect Externo
**VersiÃ³n:** 2.0.0  
**Fecha:** 2026-08-04  
**MetodologÃ­a:** Cuestionamiento de cada recomendaciÃ³n de la v1.0.0. No se asume que la auditorÃ­a inicial es correcta.

> Este anÃ¡lisis no invalida la v1.0.0. La complementa con pensamiento crÃ­tico, alternativas ignoradas y riesgos subestimados.

---

## EA-01 â€” RevisiÃ³n CrÃ­tica de Recomendaciones

A continuaciÃ³n, cada recomendaciÃ³n significativa de la v1.0.0 es sometida al cuestionario: Â¿quÃ© problema resuelve?, Â¿existe alternativa mejor?, Â¿quÃ© riesgos introduce?, Â¿cuÃ¡l es el costo real?, Â¿cuÃ¡l es el beneficio real?, Â¿vale la pena para **este** proyecto?

---

### R01 â€” Migrar Tailwind CDN â†’ npm

**RecomendaciÃ³n original:** Instalar Tailwind v4 vÃ­a npm para eliminar la dependencia CDN.

**Â¿QuÃ© problema intenta resolver?**  
La versiÃ³n CDN de Tailwind genera una hoja de estilos completa (>3MB) sin tree-shaking. TambiÃ©n introduce una dependencia de red en tiempo de ejecuciÃ³n: si el CDN falla o estÃ¡ bloqueado (en entornos corporativos con proxies), la UI queda sin estilos. AdemÃ¡s impide builds reproducibles.

**Â¿Existe una alternativa mejor?**  
SÃ­: **Tailwind v3 npm** en lugar de v4. La v1.0.0 recomienda directamente Tailwind v4, que es nueva y tiene cambios de breaking con respecto a v3 (nuevo engine CSS-first, sin archivo de configuraciÃ³n JS). Para un proyecto Angular v22 que **ya usa sintaxis de Tailwind v3** (clases como `bg-slate-900`, `text-indigo-400`), el salto a v4 puede requerir auditorÃ­a y correcciÃ³n de muchas clases. Tailwind v3 npm es mÃ¡s seguro como primer paso.

**Â¿QuÃ© riesgos introduce?**
- **Tailwind v4 con Angular**: Tailwind v4 usa Vite como motor principal. Angular ^22 usa `@angular/build:application` (esbuild). La integraciÃ³n `@tailwindcss/vite` no aplica directamente a Angular CLI. Se necesita `@tailwindcss/postcss` con PostCSS. Existe riesgo real de incompatibilidad o configuraciÃ³n compleja que la v1.0.0 **no menciona**.
- **Clases v3 â†’ v4**: Algunos prefijos y clases cambiaron entre versiones. Un template con 252+ lÃ­neas de Tailwind en `app.html` mÃ¡s 12 componentes puede tener regresiones visuales difÃ­ciles de detectar sin visual regression testing automatizado.

**Â¿CuÃ¡l serÃ­a el costo real?**  
La v1.0.0 dice "Bajo esfuerzo". La realidad: si se elige v4, el esfuerzo es **Medio-Alto** (1-2 dÃ­as de configuraciÃ³n + 1 dÃ­a de verificaciÃ³n visual). Si se elige v3, el esfuerzo es genuinamente **Bajo** (medio dÃ­a).

**Â¿CuÃ¡l serÃ­a el beneficio real?**  
Para un proyecto GitHub Pages con audiencia tÃ©cnica: el CDN de Tailwind tiene >99.9% uptime. El beneficio de performance es real pero marginal para este caso de uso (no es una app de e-commerce con millones de visitas). El beneficio principal es **arquitectÃ³nico** (reproducibilidad de builds) y no operacional.

**Â¿Vale la pena?**  
SÃ­, vale la pena â€” pero con **Tailwind v3 npm** como primer paso, no v4. La v4 puede evaluarse en 6-12 meses cuando madure mÃ¡s el ecosistema de integraciones.

**CorrecciÃ³n a la v1.0.0:** Cambiar recomendaciÃ³n de Tailwind v4 a Tailwind v3 npm como paso inmediato. Postponer evaluaciÃ³n de v4.

---

### R02 â€” Activar TypeScript `strict: true`

**RecomendaciÃ³n original:** Agregar `"strict": true` en `tsconfig.json`.

**Â¿QuÃ© problema intenta resolver?**  
Habilitar chequeos de tipos estrictos: `strictNullChecks`, `noImplicitAny`, `strictPropertyInitialization`, etc.

**Â¿Existe una alternativa mejor?**  
Activarlo gradualmente en lugar de todo a la vez: primero `strictNullChecks: true`, luego `noImplicitAny: true`. Pero dado que el proyecto es relativamente pequeÃ±o (49 archivos) y los componentes son simples (principalmente templates con datos), activar `strict: true` de golpe es probablemente manejable.

**Â¿QuÃ© riesgos introduce?**  
El riesgo real es el **tiempo no estimado de correcciÃ³n de errores**. La v1.0.0 dice "Resolver errores de tipo resultantes" como si fuera trivial. Con 12 componentes que tienen interfaces locales, arrays de objetos tipados, y uso de `@HostListener`, pueden aparecer 20-50 errores de compilaciÃ³n al activar strict. No es bloqueante, pero la v1.0.0 subestima el esfuerzo.

**Â¿CuÃ¡l serÃ­a el costo real?**  
Medio dÃ­a de activaciÃ³n + 0.5-2 dÃ­as de correcciones segÃºn la cantidad de errores.

**Â¿Vale la pena?**  
**SÃ­, absolutamente**. Un proyecto educativo que enseÃ±a buenas prÃ¡cticas de ingenierÃ­a de software **debe** tener TypeScript strict activado. Es una contradicciÃ³n enseÃ±ar calidad de cÃ³digo sin practicarla.

**Sin cambios en la recomendaciÃ³n.** Pero debe documentarse un presupuesto realista de correcciÃ³n.

---

### R03 â€” Routing Jerarquizado con Child Routes

**RecomendaciÃ³n original:** Migrar de routing plano a `/modulo-1/clase/1`, `/modulo-1/clase/2`, etc.

**Â¿QuÃ© problema intenta resolver?**  
El routing plano actual no escala a 60+ rutas. Un solo `app.routes.ts` con 60 entradas se vuelve difÃ­cil de mantener.

**Â¿Existe una alternativa mejor?**  
SÃ­, y es **significativamente mÃ¡s simple**: En lugar de reestructurar el routing completo, se puede usar `loadChildren` con archivos de rutas por mÃ³dulo sin cambiar las URLs pÃºblicas. Las URLs `clase1-dev-fundamentos`, `clase2-dev-spring-boot`, etc. siguen existiendo, pero el routing se organiza en archivos separados:

```typescript
// app.routes.ts (simplificado)
{
  path: '',
  loadChildren: () => import('./features/modules/module-1/module-1.routes')
}
```

Esto evita la necesidad de redirect masivos y mantiene las URLs actuales sin cambio. **La v1.0.0 propone cambiar las URLs sin necesidad real de hacerlo.**

**Â¿QuÃ© riesgos introduce la propuesta original?**  
- **FragmentaciÃ³n de URLs**: `/modulo-1/clase/1` pierde el contexto descriptivo del nombre. Un estudiante que tiene un bookmark o link compartido de `/clase3-dev-migracion-legacy` y lo ve redirigido a `/modulo-1/clase/3` puede confundirse.
- **Redirects infinitos**: Con hash routing + mÃºltiples redirects, Angular puede entrar en loops si los redirects no estÃ¡n correctamente configurados. Requiere testing exhaustivo.
- **SEO regresivo**: Los redirects de hash-based routing no son indexables por Google de todos modos, pero cambiar las URLs reduce la relevancia de cualquier link existente en redes sociales o chats.
- **Complejidad innecesaria**: `/modulo-1/clase/1` es menos descriptivo que `/clase1-dev-fundamentos`. La URL actual es mÃ¡s humana y memorable.

**Â¿CuÃ¡l serÃ­a el costo real?**  
La v1.0.0 estima 4-5 dÃ­as. Con redirects, testing de todas las rutas, y debugging de posibles loops en hash routing: **5-8 dÃ­as realistas**.

**Â¿Vale la pena cambiar las URLs?**  
**No.** Las URLs actuales son descriptivas y no representan un problema tÃ©cnico. El problema real es la organizaciÃ³n del **cÃ³digo** (un solo archivo de rutas grande), no de las **URLs**. La soluciÃ³n es `loadChildren` por mÃ³dulo manteniendo las URLs actuales.

**CorrecciÃ³n crÃ­tica a la v1.0.0:** Separar "reorganizaciÃ³n de cÃ³digo de routing" (recomendado) de "cambio de URLs pÃºblicas" (no recomendado). La propuesta de cambiar a `/modulo-1/clase/N` es una decisiÃ³n de UX que no tiene justificaciÃ³n tÃ©cnica sÃ³lida y aÃ±ade riesgo sin beneficio real.

---

### R04 â€” Mover Archivos de Componentes a Nueva Estructura de Carpetas

**RecomendaciÃ³n original:** Mover `clase1-dev-fundamentos/` â†’ `features/modules/module-1-ia-generativa/lessons/clase1-dev-fundamentos/`.

**Â¿QuÃ© problema intenta resolver?**  
Organizar el cÃ³digo segÃºn la nueva jerarquÃ­a de mÃ³dulos pedagÃ³gicos.

**Â¿Existe una alternativa mejor?**  
**SÃ­: No mover nada todavÃ­a.** La reorganizaciÃ³n de carpetas es pura cosmÃ©tica para el funcionamiento de la app. No aporta valor al estudiante. No mejora la performance. No corrige ningÃºn bug. Solo reorganiza archivos.

El costo real de mover 15 directorios con 49 archivos es:
- Actualizar todas las rutas relativas de importaciÃ³n en `loadComponent()`
- Actualizar la ruta relativa de `shared-presentation.css` en cada componente (actualmente `'../shared-presentation.css'`, pasarÃ­a a ser `'../../../../../shared/styles/index.css'` â€” 5 niveles de profundidad)
- Riesgo de romper el build en Angular CLI que no siempre detecta movimientos de archivos correctamente
- Tiempo de compilaciÃ³n y verificaciÃ³n

**Â¿QuÃ© riesgos introduce?**  
- Rutas relativas de CSS que se vuelven extremadamente largas y propensas a error
- Posibles errores de hot reload en desarrollo
- Merge conflicts si hay trabajo en paralelo

**Â¿Vale la pena?**  
**No en este momento.** La estructura de carpetas es una deuda organizacional, no tÃ©cnica. Puede resolverse en el futuro cuando haya mÃ¡s mÃ³dulos que justifiquen la nueva jerarquÃ­a. Mover 49 archivos para alojar un solo mÃ³dulo (el actual) es over-engineering prematuro.

**CorrecciÃ³n a la v1.0.0:** Remover Fase 4 (mover archivos) del roadmap inmediato. Marcar como "Diferida â€” evaluar cuando existan al menos 2 mÃ³dulos de contenido". El `CourseService` puede apuntar a los componentes en su ubicaciÃ³n actual sin necesidad de moverlos.

---

### R05 â€” Shared Slideshow Component

**RecomendaciÃ³n original:** Extraer la lÃ³gica de navegaciÃ³n de slides (prevSlide/nextSlide/onKeydown) a un componente genÃ©rico compartido.

**Â¿QuÃ© problema intenta resolver?**  
228 lÃ­neas de cÃ³digo idÃ©ntico distribuido en 12 componentes.

**Â¿Existe una alternativa mejor?**  
SÃ­: En lugar de un componente genÃ©rico de slideshow, extraer la **lÃ³gica** (no la UI) a un **servicio inyectable** o una **clase base** (`BaseSlideComponent`). Esto elimina la duplicaciÃ³n sin cambiar los templates HTML de cada clase (que son muy diferentes entre sÃ­).

```typescript
// shared/slide-navigation.service.ts
export class SlideNavigationService {
  currentSlide = signal(0);
  
  prev(total: number): void { ... }
  next(total: number): void { ... }
  goTo(index: number): void { ... }
}
```

Cada componente lo inyecta. Sin cambios de template. Sin ruptura.

**Â¿QuÃ© riesgos introduce la propuesta original (componente genÃ©rico)?**  
Un componente genÃ©rico de slideshow tendrÃ­a que manejar la diversidad de tipos de slide (C1 tiene 8 tipos distintos: title, theory, tools, prompts, limitations, challenge, best-practices, summary). C12 tiene muchos mÃ¡s. Crear un componente verdaderamente genÃ©rico que acomode esta diversidad es **muy complejo** y puede resultar en un componente que no es mÃ¡s simple que lo actual.

**Â¿CuÃ¡l serÃ­a el costo real?**  
Un servicio de navegaciÃ³n: 1 dÃ­a.  
Un componente genÃ©rico de slideshow: 3-5 dÃ­as (la v1.0.0 estima 3-4 dÃ­as, que podrÃ­a ser correcto pero es optimista dado la diversidad de templates).

**Â¿Vale la pena?**  
El servicio de navegaciÃ³n: **SÃ­, inmediatamente**. El componente genÃ©rico: **Cuestionable** â€” requiere anÃ¡lisis mÃ¡s profundo de la variabilidad de templates.

**CorrecciÃ³n a la v1.0.0:** Cambiar la recomendaciÃ³n de "componente genÃ©rico" a "servicio de navegaciÃ³n inyectable". Es mÃ¡s simple, menos riesgoso, y resuelve el mismo problema de duplicaciÃ³n de lÃ³gica.

---

### R06 â€” ModularizaciÃ³n de `shared-presentation.css`

**RecomendaciÃ³n original:** Dividir el archivo de 1,434 lÃ­neas en 8 parciales CSS.

**Â¿QuÃ© problema intenta resolver?**  
Un archivo CSS monolÃ­tico es difÃ­cil de mantener cuando crece.

**Â¿Existe una alternativa mejor?**  
SÃ­. Dado que el proyecto ya usa Tailwind (despuÃ©s de la migraciÃ³n a npm), muchos de los estilos en `shared-presentation.css` pueden **reemplazarse con clases de utilidad de Tailwind** en lugar de crear parciales. Esto reducirÃ­a la cantidad total de CSS custom y harÃ­a el sistema mÃ¡s coherente.

La alternativa concreta: en lugar de dividir el archivo, **primero identificar quÃ© CSS ya tiene equivalente Tailwind** y eliminarlo. Solo lo que no tenga equivalente en Tailwind merece estar en CSS custom. Esto podrÃ­a reducir el archivo de 1,434 a ~300-400 lÃ­neas antes de dividirlo.

**Â¿QuÃ© riesgos introduce la propuesta original?**  
- 8 archivos de importaciÃ³n aÃ±aden complejidad de mantenimiento lateral: ahora hay que buscar en 8 archivos en lugar de 1.
- Los `@import` en cascada tienen implicaciones de performance en CSS (aunque con bundling moderno esto es irrelevante).
- Riesgo de regresiones visuales silenciosas al reorganizar CSS.

**Â¿Vale la pena?**  
**Parcialmente**. La refactorizaciÃ³n es vÃ¡lida pero el orden de operaciones de la v1.0.0 estÃ¡ invertido. Primero debe migrarse Tailwind a npm, luego identificar quÃ© CSS se puede eliminar por ser redundante con Tailwind, y reciÃ©n despuÃ©s dividir el resto. La v1.0.0 propone dividir sin limpiar primero.

**CorrecciÃ³n:** Agregar paso previo: auditorÃ­a de CSS redundante con Tailwind antes de dividir.

---

### R07 â€” Activar ESLint

**RecomendaciÃ³n original:** Configurar ESLint para Angular.

**Â¿QuÃ© problema intenta resolver?**  
Sin linting, errores de estilo y antipatrones pueden acumularse.

**Â¿Existe una alternativa mejor?**  
Angular v17+ ya incluye soporte para `@angular-eslint`. La recomendaciÃ³n es correcta. Sin embargo, la v1.0.0 no menciona quÃ© conjunto de reglas activar. `@angular-eslint/recommended` + `@typescript-eslint/recommended-type-checked` es el estÃ¡ndar actual.

**Â¿QuÃ© riesgos introduce?**  
Si se activa ESLint con reglas estrictas sin un plan de correcciÃ³n, el primer `ng lint` puede retornar cientos de warnings que desmotivan al equipo. Se recomienda activar en modo `warn` primero, luego escalar a `error`.

**Â¿Vale la pena?**  
**SÃ­, definitivamente**. Bajo esfuerzo, alto impacto a largo plazo.

---

### R08 â€” Crear `CourseService` y Modelo de Datos

**RecomendaciÃ³n original:** Crear un servicio Angular con el modelo de datos del curso para alimentar el sidebar dinÃ¡micamente.

**Â¿QuÃ© problema intenta resolver?**  
Los links del sidebar estÃ¡n hardcodeados y duplicados. Agregar un mÃ³dulo nuevo requiere actualizaciÃ³n manual en 2 lugares.

**Â¿Existe una alternativa mejor?**  
SÃ­: Un **archivo JSON de configuraciÃ³n** (`src/assets/course-config.json`) en lugar de un `CourseService`. Las ventajas:
- Puede editarse sin tocar TypeScript
- Puede cargarse con `HttpClient` de forma lazy
- Es mÃ¡s fÃ¡cil para autores de contenido no tÃ©cnicos
- Puede externalizarse a una API en el futuro

Las desventajas: pierde el tipado de TypeScript en compile time (solucionable con JSON Schema).

**Â¿QuÃ© riesgos introduce el `CourseService` TypeScript?**  
- Cada vez que se agrega una clase, hay que editar TypeScript (no solo un JSON)
- El servicio crece con el programa (60+ clases = archivo TS grande)
- Acoplamiento entre datos del curso y cÃ³digo compilado

**Â¿Vale la pena el `CourseService` vs JSON?**  
Para un equipo de un solo desarrollador con conocimiento de TypeScript: **el servicio estÃ¡ bien**. Para un equipo donde el instructor agrega contenido sin ser desarrollador: **el JSON es mejor**. La v1.0.0 no considerÃ³ el perfil del equipo que mantendrÃ¡ la plataforma.

**CorrecciÃ³n:** Documentar esta alternativa como una decisiÃ³n pendiente que depende de quiÃ©n gestionarÃ¡ el contenido a futuro.

---

### R09 â€” Implementar Tests

**RecomendaciÃ³n original:** Agregar unit tests para servicios y component tests para el sidebar.

**Â¿QuÃ© problema intenta resolver?**  
0 tests es deuda crÃ­tica, especialmente en un proyecto educativo de referencia.

**Â¿Existe una alternativa mejor?**  
La v1.0.0 menciona "Jest/Jasmine" como opciones intercambiables. No lo son. Angular v22 viene con Jasmine + Karma por defecto, pero la comunidad migra a Jest (sin browser) y Vitest (mÃ¡s rÃ¡pido). La decisiÃ³n de framework de tests **debe tomarse una sola vez** antes de escribir el primer test.

RecomendaciÃ³n concreta: **Vitest + @angular/testing** (si Angular v22 lo soporta) o **Jest + jest-preset-angular** como estÃ¡ndar actual de la industria.

**Â¿QuÃ© riesgos introduce?**  
Karma (el default) requiere un browser para ejecutar tests â€” lento en CI. Jest/Vitest son headless y significativamente mÃ¡s rÃ¡pidos. Elegir mal el framework de tests ahora crea deuda de migraciÃ³n futura.

**Â¿Vale la pena?**  
**SÃ­, urgentemente**. Pero la v1.0.0 lo coloca como "Fase 8 â€” Continuo" (al final de todo). **Esto es un error de priorizaciÃ³n**: los tests deben comenzar desde la Fase 1 cuando se crean los primeros servicios, no despuÃ©s de 8 fases de refactorizaciÃ³n.

**CorrecciÃ³n crÃ­tica:** Adelantar los tests a Fase 1 (junto con la creaciÃ³n de servicios). TDD o test-alongside, no test-after.

---

### R10 â€” Renombrar URLs a `/modulo-1/clase/N`

**RecomendaciÃ³n original (implÃ­cita en NEW_STRUCTURE.md):** Las URLs pÃºblicas cambian de `/clase1-dev-fundamentos` a `/modulo-1/clase/1`.

**Â¿QuÃ© problema intenta resolver?**  
La v1.0.0 argumenta que esto refleja mejor la jerarquÃ­a del programa.

**Â¿Existe una alternativa mejor?**  
SÃ­: mantener las URLs actuales y crear **alias adicionales** sin redirect:
```
/modulo-1/clase/1   â†’ sirve Clase1Component (nueva URL)
/clase1-dev-fundamentos â†’ tambiÃ©n sirve Clase1Component (URL original, sin redirect)
```

Esto no requiere redirects y elimina el riesgo de loops.

**Â¿QuÃ© riesgos introduce el cambio de URLs?**  
- SEO: aunque el routing es hash-based (no indexable), los links compartidos en WhatsApp, Slack, GitHub Discussions tendrÃ¡n la URL vieja. Los redirects hash-based **no siempre funcionan correctamente** en todos los navegadores cuando la URL completa incluyendo hash es copiada.
- UX: `/modulo-1/clase/1` es genÃ©rico. Un estudiante que busca "clase spring boot" no encontrarÃ¡ la URL en su historial de navegaciÃ³n.
- Breaking change disfrazado: aunque tecnicamente hay redirects, el comportamiento en prÃ¡ctica puede ser impredecible en GitHub Pages con hash routing.

**Â¿Vale la pena?**  
**No. El cambio de URLs pÃºblicas no estÃ¡ justificado** por ningÃºn beneficio tÃ©cnico ni pedagÃ³gico medible. Es una preferencia estÃ©tica del arquitecto. **Esta es la recomendaciÃ³n mÃ¡s cuestionable de la v1.0.0.**

**CorrecciÃ³n:** Mantener las URLs actuales. Organizar el cÃ³digo de routing en archivos separados por mÃ³dulo sin cambiar las URLs.

---

### R11 â€” Crear HomePage de Bienvenida

**RecomendaciÃ³n original:** Crear un nuevo `HomeComponent` como landing page del curso.

**Â¿QuÃ© problema intenta resolver?**  
Actualmente la raÃ­z `/` redirige al plan de estudio, sin una pÃ¡gina introductoria al programa completo.

**Â¿Existe una alternativa mejor?**  
No hay alternativa mejor. Esta recomendaciÃ³n es correcta, necesaria, y tiene alto valor pedagÃ³gico. El estudiante necesita contexto antes de ver el contenido.

**Â¿QuÃ© riesgos introduce?**  
Bajo. Es un componente nuevo que no toca nada existente.

**Â¿Vale la pena?**  
**SÃ­. Es la recomendaciÃ³n mÃ¡s segura y valiosa de toda la v1.0.0**. Alto impacto pedagÃ³gico, bajo riesgo tÃ©cnico.

---

### R12 â€” `*ngIf` â†’ `@if` (ModernizaciÃ³n de Syntax)

**RecomendaciÃ³n original:** Actualizar la syntax de Angular 14 a Angular 17+.

**Â¿QuÃ© problema intenta resolver?**  
Inconsistencia: Angular v22 pero usando syntax de v14.

**Â¿Existe una alternativa mejor?**  
Angular CLI tiene un migration schematics: `ng generate @angular/core:control-flow`. Esto automatiza la migraciÃ³n y es mÃ¡s seguro que hacerlo manualmente.

**Â¿Vale la pena?**  
**SÃ­, y puede hacerse en 5 minutos con el schematic**. La v1.0.0 lo trata como cambio manual. Es un quick win aÃºn mÃ¡s rÃ¡pido que el estimado.

---

### R13 â€” Estructura de Carpetas `core/shared/layout/features`

**RecomendaciÃ³n original:** Usar la arquitectura clÃ¡sica de Angular: `core/`, `shared/`, `layout/`, `features/`.

**Â¿QuÃ© problema intenta resolver?**  
OrganizaciÃ³n del cÃ³digo segÃºn responsabilidades.

**Â¿Existe una alternativa mejor?**  
SÃ­: La arquitectura mÃ¡s moderna para Angular v17+ es **Vertical Slicing** o **Feature-based modules** sin la distinciÃ³n core/shared. En Angular con Standalone Components (que este proyecto ya usa), la distinciÃ³n `core/shared` es menos relevante porque no hay NgModules que gestionar. Un `features/` con `shared/` simple es suficiente.

La propuesta de la v1.0.0 aÃ±ade una capa `layout/` separada que puede ser simplificada integrando el Sidebar en `shared/` o directamente en `features/shell/`.

**Â¿Vale la pena?**  
**SÃ­ con simplificaciÃ³n**. La estructura `core/shared/layout/features` es vÃ¡lida pero agrega una capa de indirecciÃ³n que puede no ser necesaria para este tamaÃ±o de proyecto. Simplificar a `features/` + `shared/` + `core/` (sin `layout/` separado).

---

## EA-02 â€” Errores y Omisiones de la AuditorÃ­a v1.0.0

Los siguientes elementos **no fueron mencionados** en la auditorÃ­a inicial:

### OmisiÃ³n 1: Tailwind v4 vs v3 â€” Diferencia CrÃ­tica
La v1.0.0 recomienda "Tailwind v4 npm" sin mencionar que v4 es una **reescritura completa** con breaking changes. El proyecto actual usa Tailwind v3 (CDN). Saltar directamente a v4 es un riesgo injustificado.

### OmisiÃ³n 2: GitHub Pages y Redirects Hash-Based
Con `withHashLocation()`, las URLs tienen el formato `/#/clase1-dev-fundamentos`. Los redirects configurados en Angular Router son client-side: solo funcionan **dentro de la aplicaciÃ³n ya cargada**. Si alguien entra directamente a `/#/clase-antigua-url`, el browser carga `index.html` primero y luego Angular maneja el redirect. Los redirects de Angular Router hash-based **sÃ­ funcionan correctamente** en este escenario. La v1.0.0 es correcta aquÃ­ pero no lo explica con suficiente claridad.

### OmisiÃ³n 3: `study-plan-dev.md` Contiene InformaciÃ³n de Negocio
El archivo en `public/study-plan-dev.md` menciona "BancoFiel", contexto del cliente, stack tecnolÃ³gico interno, y "500,000 usuarios activos". Si este repositorio es **pÃºblico** en GitHub (confirmado por el pipeline de GitHub Pages), este archivo es **informaciÃ³n pÃºblica**. La v1.0.0 no seÃ±ala esto como posible riesgo de confidencialidad.

### OmisiÃ³n 4: `provideBrowserGlobalErrorListeners()` en `app.config.ts`
Esta API es nueva en Angular v19+. La v1.0.0 no la menciona aunque es una decisiÃ³n de configuraciÃ³n relevante que puede afectar el comportamiento de errores en producciÃ³n.

### OmisiÃ³n 5: El deploy pipeline copia `index.html` a `404.html` PERO ya existe `public/404.html`
```yaml
cp dist/curso-ia-generativa/browser/index.html dist/curso-ia-generativa/browser/404.html
```
El archivo `public/404.html` existente (785 bytes) es un 404 real con mensaje de error. El pipeline lo sobreescribe con `index.html`. Esto significa que el `public/404.html` actual **nunca se sirve** â€” es un archivo muerto. La v1.0.0 llama esto "redundante pero no daÃ±ino". Es incorrecto: el `public/404.html` actual **no tiene ningÃºn efecto** y deberÃ­a eliminarse para evitar confusiÃ³n.

### OmisiÃ³n 6: `@angular/build` vs `@angular/compiler-cli` â€” VersiÃ³n Mismatch
`package.json` tiene:
- `"@angular/build": "^22.0.8"` (devDependency)  
- `"@angular/cli": "^22.0.8"` (devDependency)  
- `"@angular/compiler-cli": "^22.0.0"` (devDependency)  

Hay un posible drift entre `^22.0.8` (build/cli) y `^22.0.0` (compiler-cli). En producciÃ³n esto puede resultar en versiones efectivamente distintas instaladas. La v1.0.0 no seÃ±ala este riesgo.

### OmisiÃ³n 7: `deploy.yml` usa `Node.js 22` pero `package.json` especifica `npm@11.12.1`
El workflow usa `node-version: 22` pero el campo `packageManager` en `package.json` dice `npm@11.12.1`. Node 22 viene con npm 10.x. Existe una discrepancia que puede causar advertencias o comportamientos inesperados en CI.

### OmisiÃ³n 8: Sin PolÃ­tica de Branching Documentada
El repositorio tiene un solo branch `main` con deploy automÃ¡tico. No hay `develop`, `staging`, ni feature branches documentados. Cualquier commit a main se despliega a producciÃ³n. Para un proyecto educativo donde los estudiantes pueden compartir el link de GitHub Pages, un commit accidental puede desplegar contenido incompleto.

### OmisiÃ³n 9: Las Interfaces TypeScript son Locales â€” Sin ReutilizaciÃ³n
La v1.0.0 dice "0 interfaces TypeScript reutilizables". Correcto. Pero va mÃ¡s lejos: las interfaces `Tool`, `Challenge`, `PromptExample` estÃ¡n definidas en cada componente de forma casi idÃ©ntica. No solo son interfaces locales â€” son interfaces **duplicadas con nombres diferentes** para el mismo concepto. Esto indica que el modelo de dominio del curso nunca fue diseÃ±ado de forma centralizada.

### OmisiÃ³n 10: No hay `robots.txt`
Para un proyecto con SEO implementado (meta tags, JSON-LD), la ausencia de `robots.txt` en `public/` es una omisiÃ³n menor pero relevante. El SEO de la v1.0.0 estÃ¡ calificado como "Excelente", pero falta este archivo.

---

## EA-03 â€” Recomendaciones Cuestionables (No Recomendadas o Diferidas)

| ID | RecomendaciÃ³n Original | Veredicto | RazÃ³n |
|---|---|---|---|
| R03b | Cambiar URLs a `/modulo-1/clase/N` | âŒ NO RECOMENDADO | Sin beneficio tÃ©cnico, riesgo de ruptura en hash routing, URLs actuales son mejores desde UX |
| R04 | Mover todos los archivos de carpeta | â¸ï¸ DIFERIR | Over-engineering prematuro. Mover 49 archivos para 1 mÃ³dulo aÃ±ade riesgo sin valor |
| R01 | Tailwind v4 directamente | âš ï¸ CORREGIR â†’ v3 primero | v4 tiene breaking changes con Angular build; v3 npm es mÃ¡s seguro |
| R06 | Dividir CSS antes de limpiar | âš ï¸ ORDEN INCORRECTO | Primero auditar redundancias con Tailwind, luego dividir |
| R08b | `CourseService` TypeScript como Ãºnica opciÃ³n | âš ï¸ INCOMPLETO | JSON config es alternativa vÃ¡lida â€” decisiÃ³n pendiente del perfil del equipo |

---

## EA-04 â€” Matriz de Impacto vs Esfuerzo

Esta es la clasificaciÃ³n oficial y revisada de todas las recomendaciones del proyecto.

### Escala

| DimensiÃ³n | DefiniciÃ³n |
|---|---|
| **Impacto** | Beneficio real para el estudiante, el equipo, o la escalabilidad de la plataforma |
| **Esfuerzo** | Tiempo de implementaciÃ³n + riesgo de regresiÃ³n + complejidad de rollback |

```
IMPACTO
  ALTO â”‚  Alto Impacto /         â”‚   Alto Impacto /
       â”‚  BAJO ESFUERZO          â”‚   ALTO ESFUERZO
       â”‚  (Hacer primero)        â”‚   (Planificar bien)
       â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  BAJO â”‚  Bajo Impacto /         â”‚   Bajo Impacto /
       â”‚  BAJO ESFUERZO          â”‚   ALTO ESFUERZO
       â”‚  (Quick Wins menores)   â”‚   (No recomendado)
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                BAJO                     ALTO
                           ESFUERZO
```

---

### CATEGORÃA 1 â€” Quick Wins (Alto Impacto / Bajo Esfuerzo)

> Hacer estos primero. Cada uno toma menos de 1 dÃ­a y aporta valor inmediato.

| # | RecomendaciÃ³n | Impacto | Esfuerzo | Tiempo Est. |
|---|---|---|---|---|
| QW1 | `ng generate @angular/core:control-flow` â€” migrar `*ngIf`â†’`@if` con schematic oficial | MEDIO | MUY BAJO | 5 min |
| QW2 | Agregar `robots.txt` en `public/` | BAJO-MEDIO (SEO) | MUY BAJO | 5 min |
| QW3 | Eliminar `public/404.html` (archivo muerto sobreescrito por CI) | BAJO (limpieza) | MUY BAJO | 5 min |
| QW4 | Actualizar `README.md` con versiÃ³n real de Angular (^22) y corregir inconsistencias | MEDIO (credibilidad) | MUY BAJO | 15 min |
| QW5 | Eliminar `classesOpen = true` no usado en `app.ts` | BAJO (calidad cÃ³digo) | MUY BAJO | 5 min |
| QW6 | Corregir `deploy.yml`: `packageManager` conflict Node22/npm11 | MEDIO (CI estabilidad) | BAJO | 30 min |
| QW7 | Agregar `<!-- slide -->` separadores faltantes en templates de clases que carecen de ellos | BAJO | MUY BAJO | 30 min |

---

### CATEGORÃA 2 â€” Alto Impacto / Bajo Esfuerzo

> Hacer en Semana 1-2. Transforman la plataforma sin riesgo significativo.

| # | RecomendaciÃ³n | Impacto | Esfuerzo | Tiempo Est. | Riesgo |
|---|---|---|---|---|---|
| HI-B1 | **Crear `HomeComponent`** â€” pÃ¡gina de bienvenida al programa completo | MUY ALTO | BAJO | 1-2 dÃ­as | BAJO |
| HI-B2 | **Migrar Tailwind CDN â†’ v3 npm** (no v4) | ALTO | BAJO-MEDIO | 0.5-1 dÃ­a | MEDIO |
| HI-B3 | **Activar ESLint** con `@angular-eslint/recommended` en modo `warn` | ALTO | BAJO | 0.5 dÃ­a | BAJO |
| HI-B4 | **Crear `CourseService` / JSON config** con datos de las 12 clases y metadatos | ALTO | BAJO | 1 dÃ­a | BAJO |
| HI-B5 | **Refactorizar sidebar** para usar datos del `CourseService` (eliminar hardcoding) | MUY ALTO | MEDIO | 1-2 dÃ­as | MEDIO |
| HI-B6 | **Crear `SlideNavigationService`** â€” extraer `prevSlide/nextSlide/onKeydown` de 12 componentes | ALTO | BAJO | 1 dÃ­a | BAJO |
| HI-B7 | **Activar TypeScript `strict: true`** + corregir errores resultantes | ALTO | MEDIO | 1-2 dÃ­as | BAJO |
| HI-B8 | **Agregar placeholders navegables** para MÃ³dulos 2-6 en el sidebar | ALTO | BAJO | 0.5 dÃ­a | MUY BAJO |

---

### CATEGORÃA 3 â€” Alto Impacto / Alto Esfuerzo

> Planificar cuidadosamente. Hacer despuÃ©s de Cat. 1 y 2. Requieren anÃ¡lisis y testing.

| # | RecomendaciÃ³n | Impacto | Esfuerzo | Tiempo Est. | Riesgo |
|---|---|---|---|---|---|
| HI-A1 | **Reorganizar `app.routes.ts`** en archivos separados por mÃ³dulo (sin cambiar URLs pÃºblicas) | ALTO | MEDIO-ALTO | 2-3 dÃ­as | MEDIO |
| HI-A2 | **Crear secciÃ³n Biblioteca** â€” estructura navegable con contenido inicial | MUY ALTO | ALTO | 4-6 dÃ­as | BAJO |
| HI-A3 | **Crear secciÃ³n Framework** â€” metodologÃ­a del curso documentada interactivamente | ALTO | ALTO | 3-5 dÃ­as | BAJO |
| HI-A4 | **Implementar tests** â€” `CourseService`, `SidebarComponent`, navegaciÃ³n E2E | MUY ALTO | ALTO | 3-5 dÃ­as | BAJO |
| HI-A5 | **Dividir `shared-presentation.css`** en parciales (DESPUÃ‰S de auditar redundancias Tailwind) | MEDIO | ALTO | 2-3 dÃ­as | MEDIO |
| HI-A6 | **Accessibility audit** con `axe-core` + correcciones `aria-*` | ALTO | MEDIO | 2-3 dÃ­as | BAJO |
| HI-A7 | **Evaluaciones / Quizzes** por clase (nueva feature pedagÃ³gica) | MUY ALTO | MUY ALTO | 1-2 semanas | BAJO |

---

### CATEGORÃA 4 â€” Bajo Impacto

> Hacer solo si hay tiempo sobrante. No bloquean el crecimiento del proyecto.

| # | RecomendaciÃ³n | JustificaciÃ³n |
|---|---|---|
| BI-1 | Mover `study-plan-dev.md` a `public/assets/docs/` | Solo organizaciÃ³n. No afecta UX ni funcionalidad. |
| BI-2 | Dividir `app.html` en sub-templates via `ng-template` | El archivo de 252 lÃ­neas es manejable. Complejidad no justificada. |
| BI-3 | Llenar o eliminar `app.css` vacÃ­o | CosmÃ©tico. |
| BI-4 | Implementar `ProgressService` con localStorage | Sin evaluaciones implementadas, el progreso no tiene utilidad real aÃºn. |
| BI-5 | `module-badge` y `progress-indicator` como shared components | Dependen de features (evaluaciones, progreso) que no existen aÃºn. |

---

### CATEGORÃA 5 â€” No Recomendado

> No implementar. El riesgo supera el beneficio o la recomendaciÃ³n estÃ¡ incorrectamente planteada.

| # | RecomendaciÃ³n Original | RazÃ³n |
|---|---|---|
| NR-1 | **Cambiar URLs pÃºblicas** a `/modulo-1/clase/N` | URLs actuales son mÃ¡s descriptivas, los redirects en hash routing tienen riesgos, y no hay beneficio tÃ©cnico o UX medible |
| NR-2 | **Mover 49 archivos** a nueva estructura de carpetas inmediatamente | Over-engineering prematuro. El valor aparece reciÃ©n con el 2do mÃ³dulo de contenido |
| NR-3 | **Migrar directamente a Tailwind v4** | Breaking changes con Angular CLI build. Riesgo injustificado cuando v3 npm resuelve el problema original |
| NR-4 | **Dividir CSS antes de auditar redundancias** con Tailwind | El orden incorrecto genera trabajo doble |
| NR-5 | **Crear `NavigationService` separado de `CourseService`** | Son la misma preocupaciÃ³n. Un servicio es suficiente. Separarlo en dos es sobre-abstracciÃ³n. |

---

## EA-05 â€” Roadmap Revisado y Priorizado

Con base en la revisiÃ³n crÃ­tica, el roadmap corregido es:

### Sprint 0 â€” Quick Wins (1-2 dÃ­as)

```
QW1  â†’ ng generate @angular/core:control-flow (automÃ¡tico)
QW2  â†’ Crear robots.txt
QW3  â†’ Eliminar public/404.html (archivo muerto)
QW4  â†’ Actualizar README.md
QW5  â†’ Limpiar classesOpen de app.ts
QW6  â†’ Corregir deploy.yml (Node/npm version alignment)
```

### Sprint 1 â€” Fundamentos (1 semana)

```
HI-B3 â†’ ESLint configurado
HI-B7 â†’ TypeScript strict
HI-B4 â†’ CourseService (o JSON config â€” decidir primero)
HI-B6 â†’ SlideNavigationService (eliminar 228 lÃ­neas duplicadas)
HI-A4 â†’ Primeros tests (unit tests de CourseService y SlideNavigationService)
```

### Sprint 2 â€” NavegaciÃ³n y UX (1 semana)

```
HI-B2 â†’ Tailwind v3 npm
HI-B5 â†’ Sidebar dinÃ¡mico con CourseService
HI-B1 â†’ HomeComponent (bienvenida)
HI-B8 â†’ Placeholders mÃ³dulos 2-6
HI-A1 â†’ app.routes.ts dividido por mÃ³dulo (sin cambiar URLs)
```

### Sprint 3 â€” Contenido y Calidad (2 semanas)

```
HI-A2 â†’ Biblioteca (estructura + contenido inicial)
HI-A3 â†’ Framework (metodologÃ­a interactiva)
HI-A6 â†’ Accessibility
HI-A5 â†’ CSS modularizado (despuÃ©s de auditorÃ­a Tailwind)
```

### Sprint 4+ â€” Crecimiento (continuo)

```
HI-A7 â†’ Evaluaciones/Quizzes
MÃ³dulo 2 â†’ IngenierÃ­a de Contexto (planificaciÃ³n pedagÃ³gica separada)
MÃ³dulo 3+ â†’ Sucesivos
```

---

## EA-06 â€” Preguntas Abiertas que Requieren DecisiÃ³n del Propietario

Las siguientes preguntas no pueden responderse sin informaciÃ³n del contexto del negocio:

| # | Pregunta | Impacto de la DecisiÃ³n |
|---|---|---|
| P1 | Â¿QuiÃ©n gestionarÃ¡ el contenido a futuro: el mismo desarrollador o un instructor sin conocimientos de TypeScript? | Define `CourseService` TS vs JSON config |
| P2 | Â¿El repositorio es y seguirÃ¡ siendo pÃºblico? | Define si `study-plan-dev.md` (con info de BancoFiel) debe permanecer visible |
| P3 | Â¿Se planea monetizaciÃ³n o acceso restringido a mÃ³dulos futuros? | Define si se necesita autenticaciÃ³n y backend |
| P4 | Â¿Las evaluaciones/quizzes son un requisito o nice-to-have? | Define prioridad de `ProgressService` y almacenamiento |
| P5 | Â¿El nombre del repositorio GitHub cambiarÃ¡ cuando la plataforma crezca? | Define si el `base-href` hardcodeado en `deploy.yml` es un riesgo |
| P6 | Â¿Hay un timeline externo (fecha de lanzamiento de MÃ³dulo 2)? | Define quÃ© es urgente vs importante |

---

## EA-07 â€” ConclusiÃ³n de la RevisiÃ³n Independiente

La auditorÃ­a v1.0.0 es **sÃ³lida en diagnÃ³stico pero irregular en prescripciÃ³n**. Sus hallazgos tÃ©cnicos son correctos. Sus recomendaciones contienen:

- **3 recomendaciones incorrectas** (cambio de URLs, migraciÃ³n a Tailwind v4 directamente, mover archivos prematuramente)
- **4 recomendaciones incompletas** (testing ubicado al final en lugar del inicio, NavigationService innecesariamente separado, CSS sin auditorÃ­a previa, CourseService sin considerar alternativa JSON)
- **10 omisiones significativas** (robots.txt, 404.html muerto, riesgo de confidencialidad en study-plan-dev.md, version drift en devDependencies, etc.)

La revisiÃ³n v2.0.0 **no invalida** el trabajo anterior. Lo refina. El plan revisado en EA-05 es ejecutable, priorizado correctamente, y con riesgos mitigados.

**RecomendaciÃ³n final del Enterprise Architect externo:**  
Comenzar con Sprint 0 (Quick Wins) esta semana. Ejecutar Sprint 1 la prÃ³xima semana. No tocar la estructura de carpetas hasta tener al menos el 2do mÃ³dulo de contenido listo. No cambiar las URLs pÃºblicas.

---

*VersiÃ³n 2.0.0 â€” RevisiÃ³n independiente completada en 2026-08-04*  
*AprobaciÃ³n requerida antes de implementar cualquier cambio.*