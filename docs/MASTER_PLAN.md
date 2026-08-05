# MASTER PLAN — Plan Maestro de Evolución de la Plataforma
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Versión:** 2.0.0 — Revisión independiente de Enterprise Architect incorporada.

> **Historial de versiones:**
> - v1.0.0 — Auditoría inicial (Principal Architect interno)
> - v2.0.0 — Revisión crítica independiente (Enterprise Architect externo). Recomendaciones cuestionadas, corregidas y reclasificadas. Incorpora matriz Impacto vs Esfuerzo.

---

## 1. Estado Actual (As-Is)

### 1.1 Resumen Ejecutivo

| Dimensión | Estado Actual |
|---|---|
| **Tipo** | SPA Angular monolítica desplegada en GitHub Pages |
| **Propósito** | Plataforma de presentaciones para un curso de IA Generativa (12 clases) |
| **Framework** | Angular ^22.0.0 + TypeScript ~6.0.2 |
| **Estilos** | Tailwind CDN + CSS custom properties (mezcla sin design system) |
| **Routing** | Hash-based, 16 rutas planas en un solo archivo |
| **Tests** | 0 tests (skipTests: true en todos los schematics) |
| **Componentes shared** | 0 componentes reutilizables |
| **Servicios** | 0 servicios Angular |
| **Estado** | Local (class properties) — Sin Signal Store |
| **Despliegue** | GitHub Actions → GitHub Pages (automatizado) |
| **Contenido** | 12 clases prácticas + 3 recursos (plan, instalación, tech stack) |

### 1.2 Fortalezas Actuales

- ✅ Contenido técnico de alta calidad y relevancia
- ✅ Lazy loading implementado correctamente
- ✅ SEO con meta tags completos, OG, Twitter Cards, JSON-LD
- ✅ Dark theme consistente y diseño visual de calidad
- ✅ Pipeline de deploy automatizado y funcional
- ✅ Caso de uso real (BancoFiel) bien contextualizado
- ✅ Progresión pedagógica correctamente calibrada

### 1.3 Deudas Técnicas Críticas

- ❌ Tailwind cargado vía CDN (antipatrón de producción)
- ❌ 0 tests — proyecto educativo sin cobertura es contradictorio
- ❌ Routing plano: insostenible para 6 módulos y 60+ clases
- ❌ Links de navegación duplicados y hardcodeados en el sidebar
- ❌ `shared-presentation.css` monolítico de 1,434 líneas
- ❌ Lógica de slideshow duplicada en los 12 componentes
- ❌ Sin design system formal
- ❌ Sin gestión de estado centralizada
- ❌ `*ngIf` en lugar de `@if` (Angular 17+ syntax)
- ❌ Inconsistencias de versión en documentación

---

## 2. Estado Objetivo (To-Be)

### 2.1 Visión de la Plataforma

Transformar este repositorio en una **Plataforma Profesional de Aprendizaje para Ingeniería de Software asistida por IA** que:

1. Soporte el crecimiento durante **5+ años** sin refactorizaciones mayores.
2. Aloje un programa completo de **6 módulos** y **60-80 clases**.
3. Provea una **biblioteca reutilizable** de agentes, contextos, prompts, patrones, checklists y templates.
4. Cuente con un **Framework propio** de metodología para desarrollo asistido por IA.
5. Sea un proyecto de referencia de calidad: con tests, documentación, diseño coherente y accesibilidad.

### 2.2 Arquitectura Objetivo

```
Plataforma: Software Engineering con IA
│
├── Bienvenida                    → HomeComponent
├── Introducción                  → IntroductionComponent
│
├── Módulo 1: IA Generativa       → [TODO EL CONTENIDO ACTUAL]
│   ├── Plan de Estudio
│   ├── Guías de Instalación
│   ├── Tech Stack BancoFiel
│   └── Clases 1-12 (preservadas)
│
├── Módulo 2: Ingeniería de Contexto    → [NUEVO]
├── Módulo 3: Ingeniería de Agentes     → [NUEVO]
├── Módulo 4: Automatización del Dev    → [NUEVO]
├── Módulo 5: Arquitectura Empresarial  → [NUEVO]
├── Módulo 6: Calidad con IA            → [NUEVO]
│
├── Biblioteca                    → [NUEVO]
│   ├── Agentes
│   ├── Contextos
│   ├── Prompts
│   ├── Patrones
│   ├── Checklists
│   ├── Casos de Estudio
│   └── Templates
│
└── Framework                     → [NUEVO]
    ├── Principios
    ├── Roles
    ├── Artefactos
    ├── Workflow
    └── Gobernanza
```

---

## 3. Roadmap Completo de Migración

### Principios del Roadmap

- **Cada paso es reversible** — ningún cambio masivo.
- **Primero infraestructura, luego contenido** — sin romper lo que funciona.
- **Compatibilidad de URLs garantizada** — los redirects se crean antes de mover archivos.
- **Tests antes de cada migración** — no mover lo que no podemos verificar.
- **Un paso a la vez, verificar y continuar**.

---

### FASE 0 — Prerequisitos y Configuración (Antes de todo)

**Objetivo:** Estabilizar el entorno antes de cualquier cambio de estructura.

**Duración estimada:** 2-3 días  
**Riesgo:** BAJO  
**Reversible:** 100%

| Paso | Acción | Archivos Afectados | Verificación |
|---|---|---|---|
| 0.1 | Crear branch `refactor/phase-0` en Git | `.git/` | `git checkout -b refactor/phase-0` |
| 0.2 | Instalar Tailwind v4 como npm | `package.json`, `angular.json` | `npm run build` sin errores |
| 0.3 | Remover script CDN de Tailwind de `index.html` | `src/index.html` | App sigue funcionando visualmente |
| 0.4 | Activar `strict: true` en tsconfig | `tsconfig.json` | Resolver errores de tipo resultantes |
| 0.5 | Configurar ESLint para Angular | `eslint.config.js` | `ng lint` pasa |
| 0.6 | Corregir `*ngIf` → `@if` en `app.html` | `src/app/app.html` | App sigue funcionando |
| 0.7 | Crear carpeta `docs/` con todos los documentos de auditoría | `docs/` | ✅ YA HECHO |

---

### FASE 1 — Core y Modelos (Semana 1)

**Objetivo:** Crear la infraestructura de datos sin mover ningún archivo de contenido.

**Duración estimada:** 3-4 días  
**Riesgo:** BAJO  
**Reversible:** 100% (solo se agregan archivos nuevos)

| Paso | Acción | Archivos Nuevos |
|---|---|---|
| 1.1 | Crear `src/app/core/` | Directorio |
| 1.2 | Crear interfaces TypeScript del curso | `core/models/course.model.ts` |
| 1.3 | Crear `CourseService` con datos del Módulo 1 | `core/services/course.service.ts` |
| 1.4 | Crear `NavigationService` | `core/services/navigation.service.ts` |
| 1.5 | Crear `src/app/shared/styles/` | `shared/styles/_variables.css` |
| 1.6 | Migrar CSS custom properties a `_variables.css` | Refactor de `styles.css` |

---

### FASE 2 — Layout Components (Semana 2)

**Objetivo:** Extraer el Sidebar y Mobile Menu a componentes independientes.

**Duración estimada:** 3-4 días  
**Riesgo:** MEDIO (toca el componente root)  
**Reversible:** Sí, via Git revert

| Paso | Acción | Notas |
|---|---|---|
| 2.1 | Crear `SidebarComponent` | Importa `CourseService` — genera navigation dinámicamente |
| 2.2 | Crear `MobileMenuComponent` | Reutiliza mismos datos que Sidebar |
| 2.3 | Refactorizar `app.html` para usar los nuevos componentes | Eliminar duplicación |
| 2.4 | Verificar que todos los 16 links del sidebar funcionan | Test manual |
| 2.5 | Eliminar `classesOpen` no usado de `app.ts` | Cleanup |

---

### FASE 3 — Routing Jerarquizado (Semana 2-3)

**Objetivo:** Migrar de routing plano a child routes por módulo.

**Duración estimada:** 4-5 días  
**Riesgo:** MEDIO-ALTO (cambios de routing pueden romper navegación)  
**Reversible:** Sí — los redirects garantizan compatibilidad

| Paso | Acción | Notas |
|---|---|---|
| 3.1 | Crear `app/features/` directorio | Sin mover contenido |
| 3.2 | Crear `module-1.routes.ts` con child routes | Rutas nuevas bajo `/modulo-1/` |
| 3.3 | **PRIMERO**: Agregar redirects en `app.routes.ts` | `/clase1-dev-fundamentos` → `/modulo-1/clase/1` etc. |
| 3.4 | Verificar que redirects funcionan | Test manual de TODAS las URLs actuales |
| 3.5 | Agregar ruta `/modulo-1` al routing principal | Lazy load del módulo |
| 3.6 | Verificar navegación interna en sidebar | Test manual |

---

### FASE 4 — Mover Contenido Existente (Semana 3-4)

**Objetivo:** Mover los directorios de componentes a su nueva ubicación.

**Duración estimada:** 2-3 días  
**Riesgo:** MEDIO (cambios de import paths)  
**Reversible:** Sí — Git permite revertir movimientos de archivos

> ⚠️ **PRECAUCIÓN:** Los imports dentro de los componentes deberán actualizarse cuando se muevan. La ruta relativa a `shared-presentation.css` cambiará.

| Paso | Acción | Validación |
|---|---|---|
| 4.1 | Mover `plan-dev-detallado/` a `features/modules/module-1-ia-generativa/overview/` | Verificar compilación |
| 4.2 | Mover `clase1-dev-fundamentos/` a `features/modules/module-1-ia-generativa/lessons/` | Verificar routing |
| 4.3 | Repetir para clases 2-12 (una a la vez) | Verificar cada una |
| 4.4 | Mover `installation-guides/` a `features/modules/module-1-ia-generativa/resources/` | Verificar routing |
| 4.5 | Mover `tech-stack/` a `features/modules/module-1-ia-generativa/resources/` | Verificar routing |
| 4.6 | Actualizar imports en `module-1.routes.ts` | Compilar y verificar |

---

### FASE 5 — Shared Slideshow Component (Semana 4-5)

**Objetivo:** Extraer la lógica duplicada de slideshow a un componente reutilizable.

**Duración estimada:** 3-4 días  
**Riesgo:** MEDIO (toca 12 componentes)  
**Reversible:** Sí — los componentes originales se mantienen hasta que el nuevo esté probado

| Paso | Acción |
|---|---|
| 5.1 | Crear `shared/components/slide-show/` con lógica genérica |
| 5.2 | Probar con Clase 1 únicamente |
| 5.3 | Validar que el comportamiento es idéntico al original |
| 5.4 | Migrar el resto de clases al componente compartido (una a la vez) |

---

### FASE 6 — Modularización de CSS (Semana 5-6)

**Objetivo:** Dividir `shared-presentation.css` en parciales temáticos.

**Duración estimada:** 3-4 días  
**Riesgo:** BAJO (los estilos no cambian, solo su organización)

| Paso | Acción |
|---|---|
| 6.1 | Crear `shared/styles/` con parciales vacíos |
| 6.2 | Mover CSS de variables → `_variables.css` |
| 6.3 | Mover CSS de cards → `_cards.css` |
| 6.4 | Mover CSS de slides → `_slides.css` |
| 6.5 | Mover CSS de código → `_code.css` |
| 6.6 | Crear `index.css` barrel |
| 6.7 | Actualizar referencias en todos los componentes |
| 6.8 | Deprecar `shared-presentation.css` original |

---

### FASE 7 — Nuevas Secciones (Semana 6-10)

**Objetivo:** Crear las nuevas secciones de la plataforma.

| Sección | Duración | Prioridad |
|---|---|---|
| HomePage (Bienvenida) | 2 días | ALTA |
| Placeholder de módulos 2-6 | 1 día | ALTA |
| Biblioteca (estructura vacía navegable) | 3 días | MEDIA |
| Framework (estructura vacía navegable) | 2 días | MEDIA |
| Contenido de Módulo 2 | 2-3 semanas | BAJA (requiere planificación pedagógica) |

---

### FASE 8 — Tests y Calidad (Continuo)

**Objetivo:** Implementar suite de tests básica.

| Tipo de Test | Herramienta | Prioridad |
|---|---|---|
| Unit tests para Services (CourseService, NavigationService) | Jest/Jasmine | ALTA |
| Component tests para Sidebar | Angular Testing Library | ALTA |
| E2E tests de navegación (rutas críticas) | Playwright | MEDIA |
| Accessibility audit | axe-core | MEDIA |

---

## 4. Diseño de la Biblioteca Reutilizable

### 4.1 Estructura de la Biblioteca

La **Biblioteca** será una sección de la plataforma con recursos clasificados y reutilizables para los estudiantes:

```
/biblioteca
├── /agentes              # Definiciones de agentes especializados
│   ├── agente-java-architect
│   ├── agente-spring-boot-developer
│   ├── agente-legacy-migrator
│   ├── agente-testing-engineer
│   └── agente-angular-developer
│
├── /contextos            # Plantillas de contexto (AGENTS.md)
│   ├── contexto-bancofiel-backend
│   ├── contexto-angular-project
│   ├── contexto-microservicio-java
│   └── contexto-python-rag
│
├── /prompts              # Biblioteca de prompts estructurados
│   ├── prompts-backend-java
│   ├── prompts-frontend-angular
│   ├── prompts-testing
│   ├── prompts-migracion-legacy
│   └── prompts-arquitectura
│
├── /patrones             # Patrones de diseño con asistencia IA
│   ├── patron-hexagonal-con-ia
│   ├── patron-rag-enterprise
│   ├── patron-mcp-server
│   └── patron-agentic-testing
│
├── /checklists           # Checklists por dominio
│   ├── checklist-code-review-ia
│   ├── checklist-migracion-legacy
│   ├── checklist-seguridad-ia
│   └── checklist-deploy-produccion
│
├── /templates            # Plantillas reutilizables
│   ├── template-agents-md
│   ├── template-prompt-estructurado
│   ├── template-arquitectura-hexagonal
│   └── template-plan-migracion
│
└── /casos-de-estudio     # Casos de estudio documentados
    ├── caso-bancofiel-migracion-vb6
    ├── caso-microservicio-prestamos
    └── caso-rag-normativa-bancaria
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

## 5. Diseño del Framework del Curso

### 5.1 Nombre del Framework

**"AI-Driven Software Engineering Framework (ADSE Framework)"**

### 5.2 Secciones del Framework

```
/framework
│
├── /principios
│   ├── P1: IA como multiplicador — el criterio técnico es el acelerador
│   ├── P2: Contexto de calidad = resultados de calidad
│   ├── P3: Especificación antes que implementación
│   ├── P4: Validación humana siempre
│   ├── P5: Iteración continua sobre resultados
│   └── P6: Seguridad y gobernanza no son opcionales
│
├── /roles
│   ├── Prompt Engineer
│   ├── AI Engineer
│   ├── AI Architect
│   └── AI Engineering Lead
│
├── /artefactos
│   ├── AGENTS.md — Especificación de arquitectura para agentes
│   ├── Prompt Estructurado — Plantilla ROL/CONTEXTO/TAREA/RESTRICCIONES
│   ├── Servidor MCP — Conector de agentes a herramientas
│   └── Plan de Migración con IA
│
├── /workflow
│   ├── Flujo: Análisis con IA
│   ├── Flujo: Generación asistida
│   ├── Flujo: Validación y corrección
│   └── Flujo: Agentic Self-Fixing
│
├── /buenas-practicas
│   ├── Seguridad en prompts
│   ├── Manejo de alucinaciones
│   ├── Especificación de versiones
│   └── Validación de código generado
│
├── /metricas
│   ├── Velocidad de desarrollo (story points/sprint)
│   ├── Cobertura de tests (>80%)
│   ├── Calidad de prompts (tasa de éxito en primer intento)
│   └── ROI del uso de IA
│
└── /gobernanza
    ├── Uso responsable de IA en empresa
    ├── Privacidad y datos sensibles
    ├── Licencias y propiedad intelectual
    └── Auditoría de uso de IA
```

---

## 6. Análisis de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Ruptura de navegación durante migración de rutas | MEDIA | ALTO | Implementar redirects ANTES de mover archivos |
| Regresión visual al migrar Tailwind CDN → npm | MEDIA | ALTO | Build y test visual en staging antes de merge |
| Pérdida de contenido al mover carpetas | BAJA | CRÍTICO | Git con commits atómicos, branch protegido |
| Incompatibilidad de Tailwind v4 con Angular 22 | BAJA | ALTO | Investigar antes de comenzar Fase 0 |
| Deuda técnica en TypeScript al activar strict mode | ALTA | MEDIO | Reservar tiempo específico para correcciones |
| Inconsistencia visual al dividir shared-presentation.css | MEDIA | MEDIO | Visual regression testing antes/después |
| Scope creep al agregar nuevas secciones antes de migrar existentes | ALTA | ALTO | Secuenciar estrictamente: migrar antes de crear |

---

## 7. Estimación de Tiempo

| Fase | Descripción | Duración | Prioridad |
|---|---|---|---|
| 0 | Prerequisitos y configuración | 2-3 días | INMEDIATA |
| 1 | Core y modelos de datos | 3-4 días | ALTA |
| 2 | Layout components (Sidebar) | 3-4 días | ALTA |
| 3 | Routing jerarquizado | 4-5 días | ALTA |
| 4 | Mover contenido existente | 2-3 días | ALTA |
| 5 | Shared slideshow component | 3-4 días | MEDIA |
| 6 | Modularización CSS | 3-4 días | MEDIA |
| 7 | Nuevas secciones | 5-10 días | MEDIA-BAJA |
| 8 | Tests y calidad (continuo) | Ongoing | ALTA |
| **TOTAL** | **Migración completa** | **~30-45 días** | — |

---

## 8. Prioridad de Cambios

### 8.1 Cambios Rápidos (Quick Wins — <1 día cada uno)

Estos cambios tienen alto impacto inmediato y bajo riesgo:

| # | Cambio | Tiempo | Impacto |
|---|---|---|---|
| QW1 | Remover `classesOpen` no usado de `app.ts` | 5 min | Limpieza de código |
| QW2 | Corregir `*ngIf` → `@if` en `app.html` | 30 min | Modernización Angular |
| QW3 | Actualizar README con versión correcta de Angular | 10 min | Documentación correcta |
| QW4 | Llenar `app.css` con estilos del shell o eliminarlo | 15 min | Eliminación de confusión |
| QW5 | Mover `study-plan-dev.md` a `public/assets/docs/` | 5 min | Organización de assets |
| QW6 | Crear `docs/` con los documentos de auditoría | ✅ YA HECHO | Documentación |

### 8.2 Cambios de Alto Impacto (Alta prioridad — Fase 0-3)

| # | Cambio | Beneficio |
|---|---|---|
| HI1 | Migrar Tailwind CDN → npm | Performance, reproducibilidad, tree-shaking |
| HI2 | Crear modelo de datos del curso (CourseService) | Elimina hardcoding, base para escalar |
| HI3 | Refactorizar sidebar con datos dinámicos | Escalabilidad del menú |
| HI4 | Implementar routing jerarquizado con redirects | Escalabilidad del routing |
| HI5 | Activar TypeScript strict | Calidad del código |

### 8.3 Cambios de Largo Plazo (Mes 2-3)

| # | Cambio | Beneficio |
|---|---|---|
| LP1 | Tests unitarios para servicios | Confiabilidad |
| LP2 | Shared slideshow component | DRY, mantenibilidad |
| LP3 | Modularización de CSS | Mantenibilidad de estilos |
| LP4 | Crear secciones Biblioteca y Framework | Nueva funcionalidad |
| LP5 | Contenido de Módulo 2+ | Crecimiento del programa |
| LP6 | Accessibility audit y mejoras | Inclusividad |
| LP7 | Performance monitoring (Core Web Vitals) | UX |

---

## 9. Definición de "Hecho" por Fase

### Fase 0 — Hecho cuando:
- [ ] `npm run build` pasa sin errores con Tailwind npm
- [ ] `ng lint` pasa sin errores de ESLint
- [ ] TypeScript strict activado con 0 errores de compilación
- [ ] App visualmente idéntica al estado actual en todos los browsers

### Fase 1-4 — Hecho cuando:
- [ ] Todas las rutas existentes responden (con redirect o directo)
- [ ] Sidebar muestra todos los links correctamente
- [ ] Todos los componentes de clase cargan correctamente
- [ ] El build de producción pasa sin errores
- [ ] Deploy a GitHub Pages exitoso

### Fase 5-6 — Hecho cuando:
- [ ] 0 lógica duplicada de slideshow
- [ ] CSS dividido en parciales con barrel
- [ ] Sin regresiones visuales

### Fase 7+ — Hecho cuando:
- [ ] HomeComponent con diseño premium
- [ ] Módulos 2-6 con placeholder navegable
- [ ] Biblioteca con al menos 3 items por categoría
- [ ] Framework documentado con todos los secciones

---

## 10. Próximos Pasos

**Acción inmediata requerida:**

Antes de implementar cualquier cambio, se requiere **aprobación explícita** del siguiente orden de implementación:

1. ¿Se aprueba comenzar con **Fase 0 (Quick Wins + Tailwind npm)**?
2. ¿Se aprueba el **diseño de routing propuesto** en `NEW_STRUCTURE.md`?
3. ¿Se aprueba el **modelo de datos del curso** propuesto?
4. ¿Hay preferencia de tiempo estimado diferente para alguna fase?

**No se modificará ningún archivo del proyecto hasta recibir aprobación explícita.**

---

## 11. Registro de Decisiones Arquitectónicas

| ID | Decisión | Alternativa Considerada | Justificación |
|---|---|---|---|
| ADR-001 | Mantener Hash Routing | HTML5 History API | GitHub Pages requiere hash routing sin servidor que maneje rutas |
| ADR-002 | Child routes por módulo | Routing plano extendido | Escalabilidad: 60+ rutas en un solo archivo es inmanejable |
| ADR-003 | Preservar todos los URLs actuales con redirects | Renombrar URLs | Compatibilidad con links externos y bookmarks existentes |
| ADR-004 | CourseService como fuente de datos | JSON estático en assets | Tipado TypeScript, lazy loading por módulo, extensible a API remota |
| ADR-005 | Tailwind v4 npm | Tailwind CDN | Tree-shaking, performance, reproducibilidad, sin dependencia externa en runtime |
| ADR-006 | Angular Signals para estado | NgRx (Redux) | Menor complejidad para el volumen de estado actual. NgRx Signal Store como opción futura. |

---

*Este documento requiere aprobación explícita antes de iniciar cualquier implementación.*  
*Versión 1.0.0 — Auditoría interna completada en 2026-08-04*

---

---

# REVISIÓN INDEPENDIENTE — Enterprise Architect Externo
**Versión:** 2.0.0  
**Fecha:** 2026-08-04  
**Metodología:** Cuestionamiento de cada recomendación de la v1.0.0. No se asume que la auditoría inicial es correcta.

> Este análisis no invalida la v1.0.0. La complementa con pensamiento crítico, alternativas ignoradas y riesgos subestimados.

---

## EA-01 — Revisión Crítica de Recomendaciones

A continuación, cada recomendación significativa de la v1.0.0 es sometida al cuestionario: ¿qué problema resuelve?, ¿existe alternativa mejor?, ¿qué riesgos introduce?, ¿cuál es el costo real?, ¿cuál es el beneficio real?, ¿vale la pena para **este** proyecto?

---

### R01 — Migrar Tailwind CDN → npm

**Recomendación original:** Instalar Tailwind v4 vía npm para eliminar la dependencia CDN.

**¿Qué problema intenta resolver?**  
La versión CDN de Tailwind genera una hoja de estilos completa (>3MB) sin tree-shaking. También introduce una dependencia de red en tiempo de ejecución: si el CDN falla o está bloqueado (en entornos corporativos con proxies), la UI queda sin estilos. Además impide builds reproducibles.

**¿Existe una alternativa mejor?**  
Sí: **Tailwind v3 npm** en lugar de v4. La v1.0.0 recomienda directamente Tailwind v4, que es nueva y tiene cambios de breaking con respecto a v3 (nuevo engine CSS-first, sin archivo de configuración JS). Para un proyecto Angular v22 que **ya usa sintaxis de Tailwind v3** (clases como `bg-slate-900`, `text-indigo-400`), el salto a v4 puede requerir auditoría y corrección de muchas clases. Tailwind v3 npm es más seguro como primer paso.

**¿Qué riesgos introduce?**
- **Tailwind v4 con Angular**: Tailwind v4 usa Vite como motor principal. Angular ^22 usa `@angular/build:application` (esbuild). La integración `@tailwindcss/vite` no aplica directamente a Angular CLI. Se necesita `@tailwindcss/postcss` con PostCSS. Existe riesgo real de incompatibilidad o configuración compleja que la v1.0.0 **no menciona**.
- **Clases v3 → v4**: Algunos prefijos y clases cambiaron entre versiones. Un template con 252+ líneas de Tailwind en `app.html` más 12 componentes puede tener regresiones visuales difíciles de detectar sin visual regression testing automatizado.

**¿Cuál sería el costo real?**  
La v1.0.0 dice "Bajo esfuerzo". La realidad: si se elige v4, el esfuerzo es **Medio-Alto** (1-2 días de configuración + 1 día de verificación visual). Si se elige v3, el esfuerzo es genuinamente **Bajo** (medio día).

**¿Cuál sería el beneficio real?**  
Para un proyecto GitHub Pages con audiencia técnica: el CDN de Tailwind tiene >99.9% uptime. El beneficio de performance es real pero marginal para este caso de uso (no es una app de e-commerce con millones de visitas). El beneficio principal es **arquitectónico** (reproducibilidad de builds) y no operacional.

**¿Vale la pena?**  
Sí, vale la pena — pero con **Tailwind v3 npm** como primer paso, no v4. La v4 puede evaluarse en 6-12 meses cuando madure más el ecosistema de integraciones.

**Corrección a la v1.0.0:** Cambiar recomendación de Tailwind v4 a Tailwind v3 npm como paso inmediato. Postponer evaluación de v4.

---

### R02 — Activar TypeScript `strict: true`

**Recomendación original:** Agregar `"strict": true` en `tsconfig.json`.

**¿Qué problema intenta resolver?**  
Habilitar chequeos de tipos estrictos: `strictNullChecks`, `noImplicitAny`, `strictPropertyInitialization`, etc.

**¿Existe una alternativa mejor?**  
Activarlo gradualmente en lugar de todo a la vez: primero `strictNullChecks: true`, luego `noImplicitAny: true`. Pero dado que el proyecto es relativamente pequeño (49 archivos) y los componentes son simples (principalmente templates con datos), activar `strict: true` de golpe es probablemente manejable.

**¿Qué riesgos introduce?**  
El riesgo real es el **tiempo no estimado de corrección de errores**. La v1.0.0 dice "Resolver errores de tipo resultantes" como si fuera trivial. Con 12 componentes que tienen interfaces locales, arrays de objetos tipados, y uso de `@HostListener`, pueden aparecer 20-50 errores de compilación al activar strict. No es bloqueante, pero la v1.0.0 subestima el esfuerzo.

**¿Cuál sería el costo real?**  
Medio día de activación + 0.5-2 días de correcciones según la cantidad de errores.

**¿Vale la pena?**  
**Sí, absolutamente**. Un proyecto educativo que enseña buenas prácticas de ingeniería de software **debe** tener TypeScript strict activado. Es una contradicción enseñar calidad de código sin practicarla.

**Sin cambios en la recomendación.** Pero debe documentarse un presupuesto realista de corrección.

---

### R03 — Routing Jerarquizado con Child Routes

**Recomendación original:** Migrar de routing plano a `/modulo-1/clase/1`, `/modulo-1/clase/2`, etc.

**¿Qué problema intenta resolver?**  
El routing plano actual no escala a 60+ rutas. Un solo `app.routes.ts` con 60 entradas se vuelve difícil de mantener.

**¿Existe una alternativa mejor?**  
Sí, y es **significativamente más simple**: En lugar de reestructurar el routing completo, se puede usar `loadChildren` con archivos de rutas por módulo sin cambiar las URLs públicas. Las URLs `clase1-dev-fundamentos`, `clase2-dev-spring-boot`, etc. siguen existiendo, pero el routing se organiza en archivos separados:

```typescript
// app.routes.ts (simplificado)
{
  path: '',
  loadChildren: () => import('./features/modules/module-1/module-1.routes')
}
```

Esto evita la necesidad de redirect masivos y mantiene las URLs actuales sin cambio. **La v1.0.0 propone cambiar las URLs sin necesidad real de hacerlo.**

**¿Qué riesgos introduce la propuesta original?**  
- **Fragmentación de URLs**: `/modulo-1/clase/1` pierde el contexto descriptivo del nombre. Un estudiante que tiene un bookmark o link compartido de `/clase3-dev-migracion-legacy` y lo ve redirigido a `/modulo-1/clase/3` puede confundirse.
- **Redirects infinitos**: Con hash routing + múltiples redirects, Angular puede entrar en loops si los redirects no están correctamente configurados. Requiere testing exhaustivo.
- **SEO regresivo**: Los redirects de hash-based routing no son indexables por Google de todos modos, pero cambiar las URLs reduce la relevancia de cualquier link existente en redes sociales o chats.
- **Complejidad innecesaria**: `/modulo-1/clase/1` es menos descriptivo que `/clase1-dev-fundamentos`. La URL actual es más humana y memorable.

**¿Cuál sería el costo real?**  
La v1.0.0 estima 4-5 días. Con redirects, testing de todas las rutas, y debugging de posibles loops en hash routing: **5-8 días realistas**.

**¿Vale la pena cambiar las URLs?**  
**No.** Las URLs actuales son descriptivas y no representan un problema técnico. El problema real es la organización del **código** (un solo archivo de rutas grande), no de las **URLs**. La solución es `loadChildren` por módulo manteniendo las URLs actuales.

**Corrección crítica a la v1.0.0:** Separar "reorganización de código de routing" (recomendado) de "cambio de URLs públicas" (no recomendado). La propuesta de cambiar a `/modulo-1/clase/N` es una decisión de UX que no tiene justificación técnica sólida y añade riesgo sin beneficio real.

---

### R04 — Mover Archivos de Componentes a Nueva Estructura de Carpetas

**Recomendación original:** Mover `clase1-dev-fundamentos/` → `features/modules/module-1-ia-generativa/lessons/clase1-dev-fundamentos/`.

**¿Qué problema intenta resolver?**  
Organizar el código según la nueva jerarquía de módulos pedagógicos.

**¿Existe una alternativa mejor?**  
**Sí: No mover nada todavía.** La reorganización de carpetas es pura cosmética para el funcionamiento de la app. No aporta valor al estudiante. No mejora la performance. No corrige ningún bug. Solo reorganiza archivos.

El costo real de mover 15 directorios con 49 archivos es:
- Actualizar todas las rutas relativas de importación en `loadComponent()`
- Actualizar la ruta relativa de `shared-presentation.css` en cada componente (actualmente `'../shared-presentation.css'`, pasaría a ser `'../../../../../shared/styles/index.css'` — 5 niveles de profundidad)
- Riesgo de romper el build en Angular CLI que no siempre detecta movimientos de archivos correctamente
- Tiempo de compilación y verificación

**¿Qué riesgos introduce?**  
- Rutas relativas de CSS que se vuelven extremadamente largas y propensas a error
- Posibles errores de hot reload en desarrollo
- Merge conflicts si hay trabajo en paralelo

**¿Vale la pena?**  
**No en este momento.** La estructura de carpetas es una deuda organizacional, no técnica. Puede resolverse en el futuro cuando haya más módulos que justifiquen la nueva jerarquía. Mover 49 archivos para alojar un solo módulo (el actual) es over-engineering prematuro.

**Corrección a la v1.0.0:** Remover Fase 4 (mover archivos) del roadmap inmediato. Marcar como "Diferida — evaluar cuando existan al menos 2 módulos de contenido". El `CourseService` puede apuntar a los componentes en su ubicación actual sin necesidad de moverlos.

---

### R05 — Shared Slideshow Component

**Recomendación original:** Extraer la lógica de navegación de slides (prevSlide/nextSlide/onKeydown) a un componente genérico compartido.

**¿Qué problema intenta resolver?**  
228 líneas de código idéntico distribuido en 12 componentes.

**¿Existe una alternativa mejor?**  
Sí: En lugar de un componente genérico de slideshow, extraer la **lógica** (no la UI) a un **servicio inyectable** o una **clase base** (`BaseSlideComponent`). Esto elimina la duplicación sin cambiar los templates HTML de cada clase (que son muy diferentes entre sí).

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

**¿Qué riesgos introduce la propuesta original (componente genérico)?**  
Un componente genérico de slideshow tendría que manejar la diversidad de tipos de slide (C1 tiene 8 tipos distintos: title, theory, tools, prompts, limitations, challenge, best-practices, summary). C12 tiene muchos más. Crear un componente verdaderamente genérico que acomode esta diversidad es **muy complejo** y puede resultar en un componente que no es más simple que lo actual.

**¿Cuál sería el costo real?**  
Un servicio de navegación: 1 día.  
Un componente genérico de slideshow: 3-5 días (la v1.0.0 estima 3-4 días, que podría ser correcto pero es optimista dado la diversidad de templates).

**¿Vale la pena?**  
El servicio de navegación: **Sí, inmediatamente**. El componente genérico: **Cuestionable** — requiere análisis más profundo de la variabilidad de templates.

**Corrección a la v1.0.0:** Cambiar la recomendación de "componente genérico" a "servicio de navegación inyectable". Es más simple, menos riesgoso, y resuelve el mismo problema de duplicación de lógica.

---

### R06 — Modularización de `shared-presentation.css`

**Recomendación original:** Dividir el archivo de 1,434 líneas en 8 parciales CSS.

**¿Qué problema intenta resolver?**  
Un archivo CSS monolítico es difícil de mantener cuando crece.

**¿Existe una alternativa mejor?**  
Sí. Dado que el proyecto ya usa Tailwind (después de la migración a npm), muchos de los estilos en `shared-presentation.css` pueden **reemplazarse con clases de utilidad de Tailwind** en lugar de crear parciales. Esto reduciría la cantidad total de CSS custom y haría el sistema más coherente.

La alternativa concreta: en lugar de dividir el archivo, **primero identificar qué CSS ya tiene equivalente Tailwind** y eliminarlo. Solo lo que no tenga equivalente en Tailwind merece estar en CSS custom. Esto podría reducir el archivo de 1,434 a ~300-400 líneas antes de dividirlo.

**¿Qué riesgos introduce la propuesta original?**  
- 8 archivos de importación añaden complejidad de mantenimiento lateral: ahora hay que buscar en 8 archivos en lugar de 1.
- Los `@import` en cascada tienen implicaciones de performance en CSS (aunque con bundling moderno esto es irrelevante).
- Riesgo de regresiones visuales silenciosas al reorganizar CSS.

**¿Vale la pena?**  
**Parcialmente**. La refactorización es válida pero el orden de operaciones de la v1.0.0 está invertido. Primero debe migrarse Tailwind a npm, luego identificar qué CSS se puede eliminar por ser redundante con Tailwind, y recién después dividir el resto. La v1.0.0 propone dividir sin limpiar primero.

**Corrección:** Agregar paso previo: auditoría de CSS redundante con Tailwind antes de dividir.

---

### R07 — Activar ESLint

**Recomendación original:** Configurar ESLint para Angular.

**¿Qué problema intenta resolver?**  
Sin linting, errores de estilo y antipatrones pueden acumularse.

**¿Existe una alternativa mejor?**  
Angular v17+ ya incluye soporte para `@angular-eslint`. La recomendación es correcta. Sin embargo, la v1.0.0 no menciona qué conjunto de reglas activar. `@angular-eslint/recommended` + `@typescript-eslint/recommended-type-checked` es el estándar actual.

**¿Qué riesgos introduce?**  
Si se activa ESLint con reglas estrictas sin un plan de corrección, el primer `ng lint` puede retornar cientos de warnings que desmotivan al equipo. Se recomienda activar en modo `warn` primero, luego escalar a `error`.

**¿Vale la pena?**  
**Sí, definitivamente**. Bajo esfuerzo, alto impacto a largo plazo.

---

### R08 — Crear `CourseService` y Modelo de Datos

**Recomendación original:** Crear un servicio Angular con el modelo de datos del curso para alimentar el sidebar dinámicamente.

**¿Qué problema intenta resolver?**  
Los links del sidebar están hardcodeados y duplicados. Agregar un módulo nuevo requiere actualización manual en 2 lugares.

**¿Existe una alternativa mejor?**  
Sí: Un **archivo JSON de configuración** (`src/assets/course-config.json`) en lugar de un `CourseService`. Las ventajas:
- Puede editarse sin tocar TypeScript
- Puede cargarse con `HttpClient` de forma lazy
- Es más fácil para autores de contenido no técnicos
- Puede externalizarse a una API en el futuro

Las desventajas: pierde el tipado de TypeScript en compile time (solucionable con JSON Schema).

**¿Qué riesgos introduce el `CourseService` TypeScript?**  
- Cada vez que se agrega una clase, hay que editar TypeScript (no solo un JSON)
- El servicio crece con el programa (60+ clases = archivo TS grande)
- Acoplamiento entre datos del curso y código compilado

**¿Vale la pena el `CourseService` vs JSON?**  
Para un equipo de un solo desarrollador con conocimiento de TypeScript: **el servicio está bien**. Para un equipo donde el instructor agrega contenido sin ser desarrollador: **el JSON es mejor**. La v1.0.0 no consideró el perfil del equipo que mantendrá la plataforma.

**Corrección:** Documentar esta alternativa como una decisión pendiente que depende de quién gestionará el contenido a futuro.

---

### R09 — Implementar Tests

**Recomendación original:** Agregar unit tests para servicios y component tests para el sidebar.

**¿Qué problema intenta resolver?**  
0 tests es deuda crítica, especialmente en un proyecto educativo de referencia.

**¿Existe una alternativa mejor?**  
La v1.0.0 menciona "Jest/Jasmine" como opciones intercambiables. No lo son. Angular v22 viene con Jasmine + Karma por defecto, pero la comunidad migra a Jest (sin browser) y Vitest (más rápido). La decisión de framework de tests **debe tomarse una sola vez** antes de escribir el primer test.

Recomendación concreta: **Vitest + @angular/testing** (si Angular v22 lo soporta) o **Jest + jest-preset-angular** como estándar actual de la industria.

**¿Qué riesgos introduce?**  
Karma (el default) requiere un browser para ejecutar tests — lento en CI. Jest/Vitest son headless y significativamente más rápidos. Elegir mal el framework de tests ahora crea deuda de migración futura.

**¿Vale la pena?**  
**Sí, urgentemente**. Pero la v1.0.0 lo coloca como "Fase 8 — Continuo" (al final de todo). **Esto es un error de priorización**: los tests deben comenzar desde la Fase 1 cuando se crean los primeros servicios, no después de 8 fases de refactorización.

**Corrección crítica:** Adelantar los tests a Fase 1 (junto con la creación de servicios). TDD o test-alongside, no test-after.

---

### R10 — Renombrar URLs a `/modulo-1/clase/N`

**Recomendación original (implícita en NEW_STRUCTURE.md):** Las URLs públicas cambian de `/clase1-dev-fundamentos` a `/modulo-1/clase/1`.

**¿Qué problema intenta resolver?**  
La v1.0.0 argumenta que esto refleja mejor la jerarquía del programa.

**¿Existe una alternativa mejor?**  
Sí: mantener las URLs actuales y crear **alias adicionales** sin redirect:
```
/modulo-1/clase/1   → sirve Clase1Component (nueva URL)
/clase1-dev-fundamentos → también sirve Clase1Component (URL original, sin redirect)
```

Esto no requiere redirects y elimina el riesgo de loops.

**¿Qué riesgos introduce el cambio de URLs?**  
- SEO: aunque el routing es hash-based (no indexable), los links compartidos en WhatsApp, Slack, GitHub Discussions tendrán la URL vieja. Los redirects hash-based **no siempre funcionan correctamente** en todos los navegadores cuando la URL completa incluyendo hash es copiada.
- UX: `/modulo-1/clase/1` es genérico. Un estudiante que busca "clase spring boot" no encontrará la URL en su historial de navegación.
- Breaking change disfrazado: aunque tecnicamente hay redirects, el comportamiento en práctica puede ser impredecible en GitHub Pages con hash routing.

**¿Vale la pena?**  
**No. El cambio de URLs públicas no está justificado** por ningún beneficio técnico ni pedagógico medible. Es una preferencia estética del arquitecto. **Esta es la recomendación más cuestionable de la v1.0.0.**

**Corrección:** Mantener las URLs actuales. Organizar el código de routing en archivos separados por módulo sin cambiar las URLs.

---

### R11 — Crear HomePage de Bienvenida

**Recomendación original:** Crear un nuevo `HomeComponent` como landing page del curso.

**¿Qué problema intenta resolver?**  
Actualmente la raíz `/` redirige al plan de estudio, sin una página introductoria al programa completo.

**¿Existe una alternativa mejor?**  
No hay alternativa mejor. Esta recomendación es correcta, necesaria, y tiene alto valor pedagógico. El estudiante necesita contexto antes de ver el contenido.

**¿Qué riesgos introduce?**  
Bajo. Es un componente nuevo que no toca nada existente.

**¿Vale la pena?**  
**Sí. Es la recomendación más segura y valiosa de toda la v1.0.0**. Alto impacto pedagógico, bajo riesgo técnico.

---

### R12 — `*ngIf` → `@if` (Modernización de Syntax)

**Recomendación original:** Actualizar la syntax de Angular 14 a Angular 17+.

**¿Qué problema intenta resolver?**  
Inconsistencia: Angular v22 pero usando syntax de v14.

**¿Existe una alternativa mejor?**  
Angular CLI tiene un migration schematics: `ng generate @angular/core:control-flow`. Esto automatiza la migración y es más seguro que hacerlo manualmente.

**¿Vale la pena?**  
**Sí, y puede hacerse en 5 minutos con el schematic**. La v1.0.0 lo trata como cambio manual. Es un quick win aún más rápido que el estimado.

---

### R13 — Estructura de Carpetas `core/shared/layout/features`

**Recomendación original:** Usar la arquitectura clásica de Angular: `core/`, `shared/`, `layout/`, `features/`.

**¿Qué problema intenta resolver?**  
Organización del código según responsabilidades.

**¿Existe una alternativa mejor?**  
Sí: La arquitectura más moderna para Angular v17+ es **Vertical Slicing** o **Feature-based modules** sin la distinción core/shared. En Angular con Standalone Components (que este proyecto ya usa), la distinción `core/shared` es menos relevante porque no hay NgModules que gestionar. Un `features/` con `shared/` simple es suficiente.

La propuesta de la v1.0.0 añade una capa `layout/` separada que puede ser simplificada integrando el Sidebar en `shared/` o directamente en `features/shell/`.

**¿Vale la pena?**  
**Sí con simplificación**. La estructura `core/shared/layout/features` es válida pero agrega una capa de indirección que puede no ser necesaria para este tamaño de proyecto. Simplificar a `features/` + `shared/` + `core/` (sin `layout/` separado).

---

## EA-02 — Errores y Omisiones de la Auditoría v1.0.0

Los siguientes elementos **no fueron mencionados** en la auditoría inicial:

### Omisión 1: Tailwind v4 vs v3 — Diferencia Crítica
La v1.0.0 recomienda "Tailwind v4 npm" sin mencionar que v4 es una **reescritura completa** con breaking changes. El proyecto actual usa Tailwind v3 (CDN). Saltar directamente a v4 es un riesgo injustificado.

### Omisión 2: GitHub Pages y Redirects Hash-Based
Con `withHashLocation()`, las URLs tienen el formato `/#/clase1-dev-fundamentos`. Los redirects configurados en Angular Router son client-side: solo funcionan **dentro de la aplicación ya cargada**. Si alguien entra directamente a `/#/clase-antigua-url`, el browser carga `index.html` primero y luego Angular maneja el redirect. Los redirects de Angular Router hash-based **sí funcionan correctamente** en este escenario. La v1.0.0 es correcta aquí pero no lo explica con suficiente claridad.

### Omisión 3: `study-plan-dev.md` Contiene Información de Negocio
El archivo en `public/study-plan-dev.md` menciona "BancoFiel", contexto del cliente, stack tecnológico interno, y "500,000 usuarios activos". Si este repositorio es **público** en GitHub (confirmado por el pipeline de GitHub Pages), este archivo es **información pública**. La v1.0.0 no señala esto como posible riesgo de confidencialidad.

### Omisión 4: `provideBrowserGlobalErrorListeners()` en `app.config.ts`
Esta API es nueva en Angular v19+. La v1.0.0 no la menciona aunque es una decisión de configuración relevante que puede afectar el comportamiento de errores en producción.

### Omisión 5: El deploy pipeline copia `index.html` a `404.html` PERO ya existe `public/404.html`
```yaml
cp dist/curso-ia-generativa/browser/index.html dist/curso-ia-generativa/browser/404.html
```
El archivo `public/404.html` existente (785 bytes) es un 404 real con mensaje de error. El pipeline lo sobreescribe con `index.html`. Esto significa que el `public/404.html` actual **nunca se sirve** — es un archivo muerto. La v1.0.0 llama esto "redundante pero no dañino". Es incorrecto: el `public/404.html` actual **no tiene ningún efecto** y debería eliminarse para evitar confusión.

### Omisión 6: `@angular/build` vs `@angular/compiler-cli` — Versión Mismatch
`package.json` tiene:
- `"@angular/build": "^22.0.8"` (devDependency)  
- `"@angular/cli": "^22.0.8"` (devDependency)  
- `"@angular/compiler-cli": "^22.0.0"` (devDependency)  

Hay un posible drift entre `^22.0.8` (build/cli) y `^22.0.0` (compiler-cli). En producción esto puede resultar en versiones efectivamente distintas instaladas. La v1.0.0 no señala este riesgo.

### Omisión 7: `deploy.yml` usa `Node.js 22` pero `package.json` especifica `npm@11.12.1`
El workflow usa `node-version: 22` pero el campo `packageManager` en `package.json` dice `npm@11.12.1`. Node 22 viene con npm 10.x. Existe una discrepancia que puede causar advertencias o comportamientos inesperados en CI.

### Omisión 8: Sin Política de Branching Documentada
El repositorio tiene un solo branch `main` con deploy automático. No hay `develop`, `staging`, ni feature branches documentados. Cualquier commit a main se despliega a producción. Para un proyecto educativo donde los estudiantes pueden compartir el link de GitHub Pages, un commit accidental puede desplegar contenido incompleto.

### Omisión 9: Las Interfaces TypeScript son Locales — Sin Reutilización
La v1.0.0 dice "0 interfaces TypeScript reutilizables". Correcto. Pero va más lejos: las interfaces `Tool`, `Challenge`, `PromptExample` están definidas en cada componente de forma casi idéntica. No solo son interfaces locales — son interfaces **duplicadas con nombres diferentes** para el mismo concepto. Esto indica que el modelo de dominio del curso nunca fue diseñado de forma centralizada.

### Omisión 10: No hay `robots.txt`
Para un proyecto con SEO implementado (meta tags, JSON-LD), la ausencia de `robots.txt` en `public/` es una omisión menor pero relevante. El SEO de la v1.0.0 está calificado como "Excelente", pero falta este archivo.

---

## EA-03 — Recomendaciones Cuestionables (No Recomendadas o Diferidas)

| ID | Recomendación Original | Veredicto | Razón |
|---|---|---|---|
| R03b | Cambiar URLs a `/modulo-1/clase/N` | ❌ NO RECOMENDADO | Sin beneficio técnico, riesgo de ruptura en hash routing, URLs actuales son mejores desde UX |
| R04 | Mover todos los archivos de carpeta | ⏸️ DIFERIR | Over-engineering prematuro. Mover 49 archivos para 1 módulo añade riesgo sin valor |
| R01 | Tailwind v4 directamente | ⚠️ CORREGIR → v3 primero | v4 tiene breaking changes con Angular build; v3 npm es más seguro |
| R06 | Dividir CSS antes de limpiar | ⚠️ ORDEN INCORRECTO | Primero auditar redundancias con Tailwind, luego dividir |
| R08b | `CourseService` TypeScript como única opción | ⚠️ INCOMPLETO | JSON config es alternativa válida — decisión pendiente del perfil del equipo |

---

## EA-04 — Matriz de Impacto vs Esfuerzo

Esta es la clasificación oficial y revisada de todas las recomendaciones del proyecto.

### Escala

| Dimensión | Definición |
|---|---|
| **Impacto** | Beneficio real para el estudiante, el equipo, o la escalabilidad de la plataforma |
| **Esfuerzo** | Tiempo de implementación + riesgo de regresión + complejidad de rollback |

```
IMPACTO
  ALTO │  Alto Impacto /         │   Alto Impacto /
       │  BAJO ESFUERZO          │   ALTO ESFUERZO
       │  (Hacer primero)        │   (Planificar bien)
       │─────────────────────────│──────────────────────
  BAJO │  Bajo Impacto /         │   Bajo Impacto /
       │  BAJO ESFUERZO          │   ALTO ESFUERZO
       │  (Quick Wins menores)   │   (No recomendado)
       └─────────────────────────┴──────────────────────
                BAJO                     ALTO
                           ESFUERZO
```

---

### CATEGORÍA 1 — Quick Wins (Alto Impacto / Bajo Esfuerzo)

> Hacer estos primero. Cada uno toma menos de 1 día y aporta valor inmediato.

| # | Recomendación | Impacto | Esfuerzo | Tiempo Est. |
|---|---|---|---|---|
| QW1 | `ng generate @angular/core:control-flow` — migrar `*ngIf`→`@if` con schematic oficial | MEDIO | MUY BAJO | 5 min |
| QW2 | Agregar `robots.txt` en `public/` | BAJO-MEDIO (SEO) | MUY BAJO | 5 min |
| QW3 | Eliminar `public/404.html` (archivo muerto sobreescrito por CI) | BAJO (limpieza) | MUY BAJO | 5 min |
| QW4 | Actualizar `README.md` con versión real de Angular (^22) y corregir inconsistencias | MEDIO (credibilidad) | MUY BAJO | 15 min |
| QW5 | Eliminar `classesOpen = true` no usado en `app.ts` | BAJO (calidad código) | MUY BAJO | 5 min |
| QW6 | Corregir `deploy.yml`: `packageManager` conflict Node22/npm11 | MEDIO (CI estabilidad) | BAJO | 30 min |
| QW7 | Agregar `<!-- slide -->` separadores faltantes en templates de clases que carecen de ellos | BAJO | MUY BAJO | 30 min |

---

### CATEGORÍA 2 — Alto Impacto / Bajo Esfuerzo

> Hacer en Semana 1-2. Transforman la plataforma sin riesgo significativo.

| # | Recomendación | Impacto | Esfuerzo | Tiempo Est. | Riesgo |
|---|---|---|---|---|---|
| HI-B1 | **Crear `HomeComponent`** — página de bienvenida al programa completo | MUY ALTO | BAJO | 1-2 días | BAJO |
| HI-B2 | **Migrar Tailwind CDN → v3 npm** (no v4) | ALTO | BAJO-MEDIO | 0.5-1 día | MEDIO |
| HI-B3 | **Activar ESLint** con `@angular-eslint/recommended` en modo `warn` | ALTO | BAJO | 0.5 día | BAJO |
| HI-B4 | **Crear `CourseService` / JSON config** con datos de las 12 clases y metadatos | ALTO | BAJO | 1 día | BAJO |
| HI-B5 | **Refactorizar sidebar** para usar datos del `CourseService` (eliminar hardcoding) | MUY ALTO | MEDIO | 1-2 días | MEDIO |
| HI-B6 | **Crear `SlideNavigationService`** — extraer `prevSlide/nextSlide/onKeydown` de 12 componentes | ALTO | BAJO | 1 día | BAJO |
| HI-B7 | **Activar TypeScript `strict: true`** + corregir errores resultantes | ALTO | MEDIO | 1-2 días | BAJO |
| HI-B8 | **Agregar placeholders navegables** para Módulos 2-6 en el sidebar | ALTO | BAJO | 0.5 día | MUY BAJO |

---

### CATEGORÍA 3 — Alto Impacto / Alto Esfuerzo

> Planificar cuidadosamente. Hacer después de Cat. 1 y 2. Requieren análisis y testing.

| # | Recomendación | Impacto | Esfuerzo | Tiempo Est. | Riesgo |
|---|---|---|---|---|---|
| HI-A1 | **Reorganizar `app.routes.ts`** en archivos separados por módulo (sin cambiar URLs públicas) | ALTO | MEDIO-ALTO | 2-3 días | MEDIO |
| HI-A2 | **Crear sección Biblioteca** — estructura navegable con contenido inicial | MUY ALTO | ALTO | 4-6 días | BAJO |
| HI-A3 | **Crear sección Framework** — metodología del curso documentada interactivamente | ALTO | ALTO | 3-5 días | BAJO |
| HI-A4 | **Implementar tests** — `CourseService`, `SidebarComponent`, navegación E2E | MUY ALTO | ALTO | 3-5 días | BAJO |
| HI-A5 | **Dividir `shared-presentation.css`** en parciales (DESPUÉS de auditar redundancias Tailwind) | MEDIO | ALTO | 2-3 días | MEDIO |
| HI-A6 | **Accessibility audit** con `axe-core` + correcciones `aria-*` | ALTO | MEDIO | 2-3 días | BAJO |
| HI-A7 | **Evaluaciones / Quizzes** por clase (nueva feature pedagógica) | MUY ALTO | MUY ALTO | 1-2 semanas | BAJO |

---

### CATEGORÍA 4 — Bajo Impacto

> Hacer solo si hay tiempo sobrante. No bloquean el crecimiento del proyecto.

| # | Recomendación | Justificación |
|---|---|---|
| BI-1 | Mover `study-plan-dev.md` a `public/assets/docs/` | Solo organización. No afecta UX ni funcionalidad. |
| BI-2 | Dividir `app.html` en sub-templates via `ng-template` | El archivo de 252 líneas es manejable. Complejidad no justificada. |
| BI-3 | Llenar o eliminar `app.css` vacío | Cosmético. |
| BI-4 | Implementar `ProgressService` con localStorage | Sin evaluaciones implementadas, el progreso no tiene utilidad real aún. |
| BI-5 | `module-badge` y `progress-indicator` como shared components | Dependen de features (evaluaciones, progreso) que no existen aún. |

---

### CATEGORÍA 5 — No Recomendado

> No implementar. El riesgo supera el beneficio o la recomendación está incorrectamente planteada.

| # | Recomendación Original | Razón |
|---|---|---|
| NR-1 | **Cambiar URLs públicas** a `/modulo-1/clase/N` | URLs actuales son más descriptivas, los redirects en hash routing tienen riesgos, y no hay beneficio técnico o UX medible |
| NR-2 | **Mover 49 archivos** a nueva estructura de carpetas inmediatamente | Over-engineering prematuro. El valor aparece recién con el 2do módulo de contenido |
| NR-3 | **Migrar directamente a Tailwind v4** | Breaking changes con Angular CLI build. Riesgo injustificado cuando v3 npm resuelve el problema original |
| NR-4 | **Dividir CSS antes de auditar redundancias** con Tailwind | El orden incorrecto genera trabajo doble |
| NR-5 | **Crear `NavigationService` separado de `CourseService`** | Son la misma preocupación. Un servicio es suficiente. Separarlo en dos es sobre-abstracción. |

---

## EA-05 — Roadmap Revisado y Priorizado

Con base en la revisión crítica, el roadmap corregido es:

### Sprint 0 — Quick Wins (1-2 días)

```
QW1  → ng generate @angular/core:control-flow (automático)
QW2  → Crear robots.txt
QW3  → Eliminar public/404.html (archivo muerto)
QW4  → Actualizar README.md
QW5  → Limpiar classesOpen de app.ts
QW6  → Corregir deploy.yml (Node/npm version alignment)
```

### Sprint 1 — Fundamentos (1 semana)

```
HI-B3 → ESLint configurado
HI-B7 → TypeScript strict
HI-B4 → CourseService (o JSON config — decidir primero)
HI-B6 → SlideNavigationService (eliminar 228 líneas duplicadas)
HI-A4 → Primeros tests (unit tests de CourseService y SlideNavigationService)
```

### Sprint 2 — Navegación y UX (1 semana)

```
HI-B2 → Tailwind v3 npm
HI-B5 → Sidebar dinámico con CourseService
HI-B1 → HomeComponent (bienvenida)
HI-B8 → Placeholders módulos 2-6
HI-A1 → app.routes.ts dividido por módulo (sin cambiar URLs)
```

### Sprint 3 — Contenido y Calidad (2 semanas)

```
HI-A2 → Biblioteca (estructura + contenido inicial)
HI-A3 → Framework (metodología interactiva)
HI-A6 → Accessibility
HI-A5 → CSS modularizado (después de auditoría Tailwind)
```

### Sprint 4+ — Crecimiento (continuo)

```
HI-A7 → Evaluaciones/Quizzes
Módulo 2 → Ingeniería de Contexto (planificación pedagógica separada)
Módulo 3+ → Sucesivos
```

---

## EA-06 — Preguntas Abiertas que Requieren Decisión del Propietario

Las siguientes preguntas no pueden responderse sin información del contexto del negocio:

| # | Pregunta | Impacto de la Decisión |
|---|---|---|
| P1 | ¿Quién gestionará el contenido a futuro: el mismo desarrollador o un instructor sin conocimientos de TypeScript? | Define `CourseService` TS vs JSON config |
| P2 | ¿El repositorio es y seguirá siendo público? | Define si `study-plan-dev.md` (con info de BancoFiel) debe permanecer visible |
| P3 | ¿Se planea monetización o acceso restringido a módulos futuros? | Define si se necesita autenticación y backend |
| P4 | ¿Las evaluaciones/quizzes son un requisito o nice-to-have? | Define prioridad de `ProgressService` y almacenamiento |
| P5 | ¿El nombre del repositorio GitHub cambiará cuando la plataforma crezca? | Define si el `base-href` hardcodeado en `deploy.yml` es un riesgo |
| P6 | ¿Hay un timeline externo (fecha de lanzamiento de Módulo 2)? | Define qué es urgente vs importante |

---

## EA-07 — Conclusión de la Revisión Independiente

La auditoría v1.0.0 es **sólida en diagnóstico pero irregular en prescripción**. Sus hallazgos técnicos son correctos. Sus recomendaciones contienen:

- **3 recomendaciones incorrectas** (cambio de URLs, migración a Tailwind v4 directamente, mover archivos prematuramente)
- **4 recomendaciones incompletas** (testing ubicado al final en lugar del inicio, NavigationService innecesariamente separado, CSS sin auditoría previa, CourseService sin considerar alternativa JSON)
- **10 omisiones significativas** (robots.txt, 404.html muerto, riesgo de confidencialidad en study-plan-dev.md, version drift en devDependencies, etc.)

La revisión v2.0.0 **no invalida** el trabajo anterior. Lo refina. El plan revisado en EA-05 es ejecutable, priorizado correctamente, y con riesgos mitigados.

**Recomendación final del Enterprise Architect externo:**  
Comenzar con Sprint 0 (Quick Wins) esta semana. Ejecutar Sprint 1 la próxima semana. No tocar la estructura de carpetas hasta tener al menos el 2do módulo de contenido listo. No cambiar las URLs públicas.

---

*Versión 2.0.0 — Revisión independiente completada en 2026-08-04*  
*Aprobación requerida antes de implementar cualquier cambio.*
