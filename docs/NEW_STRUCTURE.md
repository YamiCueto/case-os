# NEW STRUCTURE — Nueva Estructura de Carpetas Propuesta
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Fase:** 4 — Diseño de estructura. Sin mover archivos todavía.  
**Versión:** 1.0.0 — Propuesta. No se modificó ningún archivo.

---

## 1. Principios de Diseño de la Nueva Estructura

La nueva estructura debe satisfacer los siguientes principios de ingeniería:

1. **Escalabilidad**: Soportar 6 módulos, 60-80+ clases, y múltiples tipos de contenido sin refactorización mayor.
2. **Discoverability**: Cualquier desarrollador nuevo debe entender dónde está cada cosa en menos de 5 minutos.
3. **Cohesión por dominio**: El contenido pedagógico agrupa los archivos, no el tipo técnico.
4. **Separación de concerns**: Shell/Layout separado de Features. Features separadas de Shared. Shared separado de Core.
5. **Reversibilidad**: Cada migración de archivo puede hacerse de forma incremental y reversible.
6. **Preservación absoluta**: Todo el contenido existente preservado sin eliminación ni renombrado.

---

## 2. Nueva Estructura de Carpetas — Vista Completa

```
curso-ia-generativa/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # [MANTENER — sin cambios]
│
├── public/
│   ├── favicon.ico                     # [MANTENER]
│   ├── 404.html                        # [MANTENER]
│   └── assets/                         # [NUEVO] Subcarpeta para assets de contenido
│       └── docs/                       # [MOVER] study-plan-dev.md va aquí
│           └── study-plan-dev.md
│
├── docs/                               # [NUEVO] Documentación técnica y pedagógica
│   ├── ARCHITECTURE_REVIEW.md          # [YA EXISTE]
│   ├── COURSE_REVIEW.md                # [YA EXISTE]
│   ├── NEW_STRUCTURE.md                # [ESTE ARCHIVO]
│   ├── MASTER_PLAN.md                  # [PENDIENTE — Fase Final]
│   └── decisions/                      # [FUTURO] Architecture Decision Records (ADR)
│       └── ADR-001-tailwind-migration.md
│
├── src/
│   ├── index.html                      # [MANTENER — actualizar meta tags]
│   ├── main.ts                         # [MANTENER — sin cambios]
│   ├── styles.css                      # [MANTENER — refactorizar tokens]
│   │
│   └── app/
│       │
│       ├── app.ts                      # [MANTENER nombre — refactorizar internamente]
│       ├── app.html                    # [MANTENER nombre — refactorizar template]
│       ├── app.css                     # [MANTENER nombre — agregar estilos shell]
│       ├── app.config.ts               # [MANTENER — sin cambios]
│       ├── app.routes.ts               # [MANTENER nombre — refactorizar rutas]
│       │
│       ├── core/                       # [NUEVO] Servicios singleton, guards, interceptors
│       │   ├── services/
│       │   │   ├── navigation.service.ts   # Modelo de datos de navegación
│       │   │   ├── progress.service.ts     # Progreso del estudiante (localStorage)
│       │   │   └── course.service.ts       # Datos del curso (módulos, clases)
│       │   └── models/
│       │       ├── course.model.ts         # Interfaces: Course, Module, Lesson
│       │       ├── navigation.model.ts     # Interfaces: NavItem, NavSection
│       │       └── progress.model.ts       # Interfaces: StudentProgress, LessonStatus
│       │
│       ├── shared/                     # [NUEVO] Componentes, pipes, directivas reutilizables
│       │   ├── components/
│       │   │   ├── slide-show/             # [EXTRAER] Slideshow genérico reutilizable
│       │   │   │   ├── slide-show.component.ts
│       │   │   │   ├── slide-show.component.html
│       │   │   │   └── slide-show.component.css
│       │   │   ├── lesson-card/            # Card de clase para listas de contenido
│       │   │   │   ├── lesson-card.component.ts
│       │   │   │   └── lesson-card.component.html
│       │   │   ├── module-badge/           # Badge de módulo
│       │   │   └── progress-indicator/     # Indicador de progreso
│       │   ├── styles/                 # [MODULARIZAR] shared-presentation.css dividido
│       │   │   ├── _variables.css          # CSS custom properties (fuente de verdad)
│       │   │   ├── _typography.css         # Tipografía
│       │   │   ├── _cards.css              # Estilos de cards
│       │   │   ├── _slides.css             # Estilos de slideshow
│       │   │   ├── _code.css               # Tokyo Night + code blocks
│       │   │   └── index.css               # Barrel: @import de todos los parciales
│       │   └── shared.ts               # Barrel exports
│       │
│       ├── layout/                     # [NUEVO] Componentes de shell/layout
│       │   ├── sidebar/
│       │   │   ├── sidebar.component.ts
│       │   │   ├── sidebar.component.html
│       │   │   └── sidebar.component.css
│       │   └── mobile-menu/
│       │       ├── mobile-menu.component.ts
│       │       └── mobile-menu.component.html
│       │
│       ├── features/                   # [NUEVO] Organización por features de la plataforma
│       │   │
│       │   ├── home/                   # [NUEVO] Página de inicio / Bienvenida
│       │   │   ├── home.component.ts
│       │   │   └── home.component.html
│       │   │
│       │   ├── modules/                # [NUEVO] Módulos del curso
│       │   │   │
│       │   │   └── module-1-ia-generativa/     # [NUEVO] Módulo 1 — IA Generativa
│       │   │       │                            # (agrupa todo el contenido existente)
│       │   │       │
│       │   │       ├── module-1.routes.ts      # Child routes de Módulo 1
│       │   │       │
│       │   │       ├── overview/               # [MOVER + ADAPTAR] Plan de estudio
│       │   │       │   └── plan-dev-detallado/ # [MANTENER sin renombrar internamente]
│       │   │       │       ├── plan-dev-detallado.component.ts     # [SIN CAMBIOS]
│       │   │       │       ├── plan-dev-detallado.component.html   # [SIN CAMBIOS]
│       │   │       │       └── plan-dev-detallado.component.css    # [SIN CAMBIOS]
│       │   │       │
│       │   │       ├── lessons/                # [MOVER] Todas las clases existentes
│       │   │       │   ├── clase1-dev-fundamentos/     # [SIN CAMBIOS INTERNOS]
│       │   │       │   ├── clase2-dev-spring-boot/     # [SIN CAMBIOS INTERNOS]
│       │   │       │   ├── clase3-dev-migracion-legacy/
│       │   │       │   ├── clase4-dev-integracion-apis/
│       │   │       │   ├── clase5-dev-testing-avanzado/
│       │   │       │   ├── clase6-dev-modulo-angular/
│       │   │       │   ├── clase7-dev-frontend-legacy/
│       │   │       │   ├── clase8-dev-estado-rxjs/
│       │   │       │   ├── clase9-dev-testing-e2e/
│       │   │       │   ├── clase10-dev-fastapi/
│       │   │       │   ├── clase11-dev-lambda-serverless/
│       │   │       │   └── clase12-dev-proyecto-final/
│       │   │       │
│       │   │       └── resources/              # [MOVER] Recursos del módulo 1
│       │   │           ├── installation-guides/    # [SIN CAMBIOS INTERNOS]
│       │   │           └── tech-stack/             # [SIN CAMBIOS INTERNOS]
│       │   │
│       │   │   # Módulos futuros (vacíos inicialmente — placeholders)
│       │   │   ├── module-2-context-engineering/
│       │   │   │   └── module-2.routes.ts      # Rutas vacías — placeholder
│       │   │   ├── module-3-agent-engineering/
│       │   │   ├── module-4-dev-automation/
│       │   │   ├── module-5-enterprise-architecture/
│       │   │   └── module-6-ai-quality/
│       │   │
│       │   ├── library/                # [NUEVO] Biblioteca de recursos reutilizables
│       │   │   ├── agents/             # Biblioteca de Agentes
│       │   │   ├── contexts/           # Biblioteca de Contextos
│       │   │   ├── prompts/            # Biblioteca de Prompts
│       │   │   ├── patterns/           # Patrones de diseño con IA
│       │   │   ├── checklists/         # Checklists por dominio
│       │   │   ├── templates/          # Plantillas reutilizables
│       │   │   └── case-studies/       # Casos de estudio
│       │   │
│       │   └── framework/              # [NUEVO] Framework propio del curso
│       │       ├── principles/         # Principios del framework
│       │       ├── roles/              # Roles (AI Engineer, AI Architect, etc.)
│       │       ├── artifacts/          # Artefactos del framework
│       │       ├── workflow/           # Flujo de trabajo
│       │       └── governance/         # Gobernanza y validaciones
│       │
│       └── [shared-presentation.css]  # [DEPRECAR GRADUALMENTE → mover a shared/styles/]
│
├── angular.json                        # [ACTUALIZAR paths de estilos]
├── package.json                        # [ACTUALIZAR — instalar Tailwind como npm]
├── tsconfig.json                       # [ACTUALIZAR — strict: true]
└── [otros config files]                # [MANTENER sin cambios]
```

---

## 3. Nueva Estructura de Rutas

### 3.1 Árbol de Rutas Propuesto

```
/                          → Redirect → /home
/home                      → HomeComponent (nuevo — Bienvenida)

/modulo-1                  → Lazy Module: Module1RoutingModule
  /modulo-1/plan           → PlanDevDetalladoComponent (preservado)
  /modulo-1/clase/1        → Clase1DevFundamentosComponent (preservado)
  /modulo-1/clase/2        → Clase2DevSpringBootComponent (preservado)
  /modulo-1/clase/3        → Clase3DevMigracionLegacyComponent (preservado)
  /modulo-1/clase/4        → Clase4DevIntegracionApisComponent (preservado)
  /modulo-1/clase/5        → Clase5DevTestingAvanzadoComponent (preservado)
  /modulo-1/clase/6        → Clase6DevModuloAngularComponent (preservado)
  /modulo-1/clase/7        → Clase7DevFrontendLegacyComponent (preservado)
  /modulo-1/clase/8        → Clase8DevEstadoRxjsComponent (preservado)
  /modulo-1/clase/9        → Clase9DevTestingE2eComponent (preservado)
  /modulo-1/clase/10       → Clase10DevFastapiComponent (preservado)
  /modulo-1/clase/11       → Clase11DevLambdaServerlessComponent (preservado)
  /modulo-1/clase/12       → Clase12DevProyectoFinalComponent (preservado)
  /modulo-1/instalacion    → InstallationGuidesComponent (preservado)
  /modulo-1/tech-stack     → TechStackComponent (preservado)

/modulo-2                  → Placeholder (Coming Soon)
/modulo-3                  → Placeholder (Coming Soon)
/modulo-4                  → Placeholder (Coming Soon)
/modulo-5                  → Placeholder (Coming Soon)
/modulo-6                  → Placeholder (Coming Soon)

/biblioteca                → LibraryComponent (nuevo)
  /biblioteca/agentes
  /biblioteca/contextos
  /biblioteca/prompts
  /biblioteca/patrones
  /biblioteca/checklists
  /biblioteca/templates
  /biblioteca/casos-de-estudio

/framework                 → FrameworkComponent (nuevo)

# Redirects de compatibilidad (para no romper URLs existentes)
/plan-dev-detallado        → Redirect → /modulo-1/plan
/study-plan                → Redirect → /modulo-1/plan
/installation-guides       → Redirect → /modulo-1/instalacion
/tech-stack                → Redirect → /modulo-1/tech-stack
/clase1-dev-fundamentos    → Redirect → /modulo-1/clase/1
/clase2-dev-spring-boot    → Redirect → /modulo-1/clase/2
[... todos los redirects de clases existentes ...]
```

> **Garantía de compatibilidad:** Los URLs actuales seguirán funcionando indefinidamente mediante redirects. Ningún enlace externo se romperá.

---

## 4. Modelo de Datos del Curso

```typescript
// core/models/course.model.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: number;
  slug: string;         // 'modulo-1-ia-generativa'
  title: string;        // 'IA Generativa'
  description: string;
  status: 'available' | 'coming-soon' | 'in-progress';
  lessons: Lesson[];
  resources: Resource[];
}

export interface Lesson {
  id: number;
  moduleId: number;
  slug: string;         // 'clase1-dev-fundamentos'
  title: string;        // 'Fundamentos de IA Generativa'
  subtitle: string;
  route: string;        // '/modulo-1/clase/1'
  duration: string;     // '90 min'
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  tags: string[];
  status: 'available' | 'coming-soon';
}

export interface Resource {
  id: string;
  type: 'guide' | 'reference' | 'tool' | 'template';
  title: string;
  route: string;
}
```

Este modelo permite al sidebar generarse **dinámicamente** desde datos, eliminando la duplicación actual.

---

## 5. Nueva Arquitectura del Sidebar

En lugar de links hardcodeados, el sidebar usará el modelo de datos:

```typescript
// layout/sidebar/sidebar.component.ts
export class SidebarComponent {
  courseModules = inject(CourseService).modules;
}
```

```html
<!-- layout/sidebar/sidebar.component.html -->
@for (module of courseModules(); track module.id) {
  <div class="module-section">
    <span class="module-title">{{ module.title }}</span>
    @for (lesson of module.lessons; track lesson.id) {
      <a [routerLink]="lesson.route" routerLinkActive="active">
        {{ lesson.title }}
      </a>
    }
  </div>
}
```

---

## 6. Estrategia de Migración de Estilos

### 6.1 División de `shared-presentation.css` (1,434 líneas)

El archivo monolítico se dividirá en módulos CSS con responsabilidad única:

| Archivo Nuevo | Contenido | Tamaño Estimado |
|---|---|---|
| `_variables.css` | CSS custom properties globales (colores, espaciado, tipografía) | ~50 líneas |
| `_typography.css` | Estilos de texto, headings, párrafos | ~100 líneas |
| `_cards.css` | Cards, panels, section-cards | ~200 líneas |
| `_slides.css` | Slideshow container, controles, indicadores | ~300 líneas |
| `_code.css` | Tokyo Night tokens, `code`, `pre`, `kbd` | ~150 líneas |
| `_badges.css` | Tech badges, tags, labels | ~100 líneas |
| `_animations.css` | Keyframes, transiciones, hover effects | ~150 líneas |
| `_layout.css` | Grids, flexbox utilities del contenido | ~200 líneas |
| `index.css` | Barrel: `@import` de todos los parciales | ~20 líneas |

### 6.2 Migración de Tailwind CDN a npm

```bash
# Fase 1: Instalar Tailwind v4 como dependencia
npm install tailwindcss@4 @tailwindcss/vite

# Fase 2: Configurar en angular.json
# Fase 3: Reemplazar script CDN en index.html
# Fase 4: Verificar que clases de Tailwind en templates siguen funcionando
```

---

## 7. Impacto de la Nueva Estructura

### 7.1 Archivos que se MUEVEN (sin cambios internos)

| Archivo Actual | Nueva Ubicación |
|---|---|
| `src/app/plan-dev-detallado/` | `src/app/features/modules/module-1-ia-generativa/overview/plan-dev-detallado/` |
| `src/app/installation-guides/` | `src/app/features/modules/module-1-ia-generativa/resources/installation-guides/` |
| `src/app/tech-stack/` | `src/app/features/modules/module-1-ia-generativa/resources/tech-stack/` |
| `src/app/clase1-dev-fundamentos/` | `src/app/features/modules/module-1-ia-generativa/lessons/clase1-dev-fundamentos/` |
| `src/app/clase2-dev-spring-boot/` | `src/app/features/modules/module-1-ia-generativa/lessons/clase2-dev-spring-boot/` |
| `src/app/clase3-dev-migracion-legacy/` | `.../lessons/clase3-dev-migracion-legacy/` |
| ... (clases 4-12) | `.../lessons/[clase-name]/` |
| `public/study-plan-dev.md` | `public/assets/docs/study-plan-dev.md` |

### 7.2 Archivos que se CREAN (nuevos)

| Archivo Nuevo | Propósito |
|---|---|
| `src/app/core/services/course.service.ts` | Modelo de datos del curso |
| `src/app/core/services/navigation.service.ts` | Gestión de navegación dinámica |
| `src/app/core/models/course.model.ts` | Interfaces TypeScript del modelo |
| `src/app/shared/styles/_variables.css` | CSS custom properties centralizadas |
| `src/app/shared/styles/_slides.css` | Estilos de slideshow extraídos |
| `src/app/layout/sidebar/sidebar.component.ts` | Sidebar como componente independiente |
| `src/app/features/home/home.component.ts` | Página de bienvenida |
| `src/app/features/modules/module-1-ia-generativa/module-1.routes.ts` | Child routes M1 |
| `src/app/features/library/library.component.ts` | Biblioteca de recursos |

### 7.3 Archivos que se MANTIENEN SIN CAMBIOS

```
src/main.ts
src/index.html (solo actualización de meta)
src/app/app.config.ts (solo agregar redirects)
src/app/clase[1-12]-*/[clase]-*.component.ts  (TODOS preservados)
src/app/clase[1-12]-*/[clase]-*.component.html (TODOS preservados)
src/app/clase[1-12]-*/[clase]-*.component.css  (TODOS preservados)
src/app/installation-guides/*.ts / *.html / *.css
src/app/tech-stack/*.ts / *.html / *.css
src/app/plan-dev-detallado/*.ts / *.html / *.css
.github/workflows/deploy.yml
angular.json (cambios mínimos de paths)
```

---

## 8. Verificación de Preservación

La siguiente tabla confirma que **ningún componente existente es eliminado o renombrado**:

| Componente | Clase Angular | Selector | Ruta URL | Estado |
|---|---|---|---|---|
| Plan de Estudio | `PlanDevDetalladoComponent` | `app-plan-dev-detallado` | `/modulo-1/plan` (+ redirect desde `/plan-dev-detallado`) | ✅ PRESERVADO |
| Guías Instalación | `InstallationGuidesComponent` | `app-installation-guides` | `/modulo-1/instalacion` (+ redirect) | ✅ PRESERVADO |
| Tech Stack | `TechStackComponent` | `app-tech-stack` | `/modulo-1/tech-stack` (+ redirect) | ✅ PRESERVADO |
| Clase 1 | `Clase1DevFundamentosComponent` | `app-clase1-dev-fundamentos` | `/modulo-1/clase/1` (+ redirect) | ✅ PRESERVADO |
| Clase 2 | `Clase2DevSpringBootComponent` | `app-clase2-dev-spring-boot` | `/modulo-1/clase/2` (+ redirect) | ✅ PRESERVADO |
| Clase 3-12 | (todos) | (todos) | `/modulo-1/clase/[n]` (+ redirect) | ✅ PRESERVADOS |

---

*Documento de solo lectura — No se movió ningún archivo.*
*Siguiente: Roadmap de migración en `MASTER_PLAN.md`*
