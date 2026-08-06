> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# NEW STRUCTURE â€” Nueva Estructura de Carpetas Propuesta
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Fase:** 4 â€” DiseÃ±o de estructura. Sin mover archivos todavÃ­a.  
**VersiÃ³n:** 1.0.0 â€” Propuesta. No se modificÃ³ ningÃºn archivo.

---

## 1. Principios de DiseÃ±o de la Nueva Estructura

La nueva estructura debe satisfacer los siguientes principios de ingenierÃ­a:

1. **Escalabilidad**: Soportar 6 mÃ³dulos, 60-80+ clases, y mÃºltiples tipos de contenido sin refactorizaciÃ³n mayor.
2. **Discoverability**: Cualquier desarrollador nuevo debe entender dÃ³nde estÃ¡ cada cosa en menos de 5 minutos.
3. **CohesiÃ³n por dominio**: El contenido pedagÃ³gico agrupa los archivos, no el tipo tÃ©cnico.
4. **SeparaciÃ³n de concerns**: Shell/Layout separado de Features. Features separadas de Shared. Shared separado de Core.
5. **Reversibilidad**: Cada migraciÃ³n de archivo puede hacerse de forma incremental y reversible.
6. **PreservaciÃ³n absoluta**: Todo el contenido existente preservado sin eliminaciÃ³n ni renombrado.

---

## 2. Nueva Estructura de Carpetas â€” Vista Completa

```
curso-ia-generativa/
â”‚
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ deploy.yml                  # [MANTENER â€” sin cambios]
â”‚
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.ico                     # [MANTENER]
â”‚   â”œâ”€â”€ 404.html                        # [MANTENER]
â”‚   â””â”€â”€ assets/                         # [NUEVO] Subcarpeta para assets de contenido
â”‚       â””â”€â”€ docs/                       # [MOVER] study-plan-dev.md va aquÃ­
â”‚           â””â”€â”€ study-plan-dev.md
â”‚
â”œâ”€â”€ docs/                               # [NUEVO] DocumentaciÃ³n tÃ©cnica y pedagÃ³gica
â”‚   â”œâ”€â”€ ARCHITECTURE_REVIEW.md          # [YA EXISTE]
â”‚   â”œâ”€â”€ COURSE_REVIEW.md                # [YA EXISTE]
â”‚   â”œâ”€â”€ NEW_STRUCTURE.md                # [ESTE ARCHIVO]
â”‚   â”œâ”€â”€ MASTER_PLAN.md                  # [PENDIENTE â€” Fase Final]
â”‚   â””â”€â”€ decisions/                      # [FUTURO] Architecture Decision Records (ADR)
â”‚       â””â”€â”€ ADR-001-tailwind-migration.md
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ index.html                      # [MANTENER â€” actualizar meta tags]
â”‚   â”œâ”€â”€ main.ts                         # [MANTENER â€” sin cambios]
â”‚   â”œâ”€â”€ styles.css                      # [MANTENER â€” refactorizar tokens]
â”‚   â”‚
â”‚   â””â”€â”€ app/
â”‚       â”‚
â”‚       â”œâ”€â”€ app.ts                      # [MANTENER nombre â€” refactorizar internamente]
â”‚       â”œâ”€â”€ app.html                    # [MANTENER nombre â€” refactorizar template]
â”‚       â”œâ”€â”€ app.css                     # [MANTENER nombre â€” agregar estilos shell]
â”‚       â”œâ”€â”€ app.config.ts               # [MANTENER â€” sin cambios]
â”‚       â”œâ”€â”€ app.routes.ts               # [MANTENER nombre â€” refactorizar rutas]
â”‚       â”‚
â”‚       â”œâ”€â”€ core/                       # [NUEVO] Servicios singleton, guards, interceptors
â”‚       â”‚   â”œâ”€â”€ services/
â”‚       â”‚   â”‚   â”œâ”€â”€ navigation.service.ts   # Modelo de datos de navegaciÃ³n
â”‚       â”‚   â”‚   â”œâ”€â”€ progress.service.ts     # Progreso del estudiante (localStorage)
â”‚       â”‚   â”‚   â””â”€â”€ course.service.ts       # Datos del curso (mÃ³dulos, clases)
â”‚       â”‚   â””â”€â”€ models/
â”‚       â”‚       â”œâ”€â”€ course.model.ts         # Interfaces: Course, Module, Lesson
â”‚       â”‚       â”œâ”€â”€ navigation.model.ts     # Interfaces: NavItem, NavSection
â”‚       â”‚       â””â”€â”€ progress.model.ts       # Interfaces: StudentProgress, LessonStatus
â”‚       â”‚
â”‚       â”œâ”€â”€ shared/                     # [NUEVO] Componentes, pipes, directivas reutilizables
â”‚       â”‚   â”œâ”€â”€ components/
â”‚       â”‚   â”‚   â”œâ”€â”€ slide-show/             # [EXTRAER] Slideshow genÃ©rico reutilizable
â”‚       â”‚   â”‚   â”‚   â”œâ”€â”€ slide-show.component.ts
â”‚       â”‚   â”‚   â”‚   â”œâ”€â”€ slide-show.component.html
â”‚       â”‚   â”‚   â”‚   â””â”€â”€ slide-show.component.css
â”‚       â”‚   â”‚   â”œâ”€â”€ lesson-card/            # Card de clase para listas de contenido
â”‚       â”‚   â”‚   â”‚   â”œâ”€â”€ lesson-card.component.ts
â”‚       â”‚   â”‚   â”‚   â””â”€â”€ lesson-card.component.html
â”‚       â”‚   â”‚   â”œâ”€â”€ module-badge/           # Badge de mÃ³dulo
â”‚       â”‚   â”‚   â””â”€â”€ progress-indicator/     # Indicador de progreso
â”‚       â”‚   â”œâ”€â”€ styles/                 # [MODULARIZAR] shared-presentation.css dividido
â”‚       â”‚   â”‚   â”œâ”€â”€ _variables.css          # CSS custom properties (fuente de verdad)
â”‚       â”‚   â”‚   â”œâ”€â”€ _typography.css         # TipografÃ­a
â”‚       â”‚   â”‚   â”œâ”€â”€ _cards.css              # Estilos de cards
â”‚       â”‚   â”‚   â”œâ”€â”€ _slides.css             # Estilos de slideshow
â”‚       â”‚   â”‚   â”œâ”€â”€ _code.css               # Tokyo Night + code blocks
â”‚       â”‚   â”‚   â””â”€â”€ index.css               # Barrel: @import de todos los parciales
â”‚       â”‚   â””â”€â”€ shared.ts               # Barrel exports
â”‚       â”‚
â”‚       â”œâ”€â”€ layout/                     # [NUEVO] Componentes de shell/layout
â”‚       â”‚   â”œâ”€â”€ sidebar/
â”‚       â”‚   â”‚   â”œâ”€â”€ sidebar.component.ts
â”‚       â”‚   â”‚   â”œâ”€â”€ sidebar.component.html
â”‚       â”‚   â”‚   â””â”€â”€ sidebar.component.css
â”‚       â”‚   â””â”€â”€ mobile-menu/
â”‚       â”‚       â”œâ”€â”€ mobile-menu.component.ts
â”‚       â”‚       â””â”€â”€ mobile-menu.component.html
â”‚       â”‚
â”‚       â”œâ”€â”€ features/                   # [NUEVO] OrganizaciÃ³n por features de la plataforma
â”‚       â”‚   â”‚
â”‚       â”‚   â”œâ”€â”€ home/                   # [NUEVO] PÃ¡gina de inicio / Bienvenida
â”‚       â”‚   â”‚   â”œâ”€â”€ home.component.ts
â”‚       â”‚   â”‚   â””â”€â”€ home.component.html
â”‚       â”‚   â”‚
â”‚       â”‚   â”œâ”€â”€ modules/                # [NUEVO] MÃ³dulos del curso
â”‚       â”‚   â”‚   â”‚
â”‚       â”‚   â”‚   â””â”€â”€ module-1-ia-generativa/     # [NUEVO] MÃ³dulo 1 â€” IA Generativa
â”‚       â”‚   â”‚       â”‚                            # (agrupa todo el contenido existente)
â”‚       â”‚   â”‚       â”‚
â”‚       â”‚   â”‚       â”œâ”€â”€ module-1.routes.ts      # Child routes de MÃ³dulo 1
â”‚       â”‚   â”‚       â”‚
â”‚       â”‚   â”‚       â”œâ”€â”€ overview/               # [MOVER + ADAPTAR] Plan de estudio
â”‚       â”‚   â”‚       â”‚   â””â”€â”€ plan-dev-detallado/ # [MANTENER sin renombrar internamente]
â”‚       â”‚   â”‚       â”‚       â”œâ”€â”€ plan-dev-detallado.component.ts     # [SIN CAMBIOS]
â”‚       â”‚   â”‚       â”‚       â”œâ”€â”€ plan-dev-detallado.component.html   # [SIN CAMBIOS]
â”‚       â”‚   â”‚       â”‚       â””â”€â”€ plan-dev-detallado.component.css    # [SIN CAMBIOS]
â”‚       â”‚   â”‚       â”‚
â”‚       â”‚   â”‚       â”œâ”€â”€ lessons/                # [MOVER] Todas las clases existentes
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase1-dev-fundamentos/     # [SIN CAMBIOS INTERNOS]
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase2-dev-spring-boot/     # [SIN CAMBIOS INTERNOS]
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase3-dev-migracion-legacy/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase4-dev-integracion-apis/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase5-dev-testing-avanzado/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase6-dev-modulo-angular/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase7-dev-frontend-legacy/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase8-dev-estado-rxjs/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase9-dev-testing-e2e/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase10-dev-fastapi/
â”‚       â”‚   â”‚       â”‚   â”œâ”€â”€ clase11-dev-lambda-serverless/
â”‚       â”‚   â”‚       â”‚   â””â”€â”€ clase12-dev-proyecto-final/
â”‚       â”‚   â”‚       â”‚
â”‚       â”‚   â”‚       â””â”€â”€ resources/              # [MOVER] Recursos del mÃ³dulo 1
â”‚       â”‚   â”‚           â”œâ”€â”€ installation-guides/    # [SIN CAMBIOS INTERNOS]
â”‚       â”‚   â”‚           â””â”€â”€ tech-stack/             # [SIN CAMBIOS INTERNOS]
â”‚       â”‚   â”‚
â”‚       â”‚   â”‚   # MÃ³dulos futuros (vacÃ­os inicialmente â€” placeholders)
â”‚       â”‚   â”‚   â”œâ”€â”€ module-2-context-engineering/
â”‚       â”‚   â”‚   â”‚   â””â”€â”€ module-2.routes.ts      # Rutas vacÃ­as â€” placeholder
â”‚       â”‚   â”‚   â”œâ”€â”€ module-3-agent-engineering/
â”‚       â”‚   â”‚   â”œâ”€â”€ module-4-dev-automation/
â”‚       â”‚   â”‚   â”œâ”€â”€ module-5-enterprise-architecture/
â”‚       â”‚   â”‚   â””â”€â”€ module-6-ai-quality/
â”‚       â”‚   â”‚
â”‚       â”‚   â”œâ”€â”€ library/                # [NUEVO] Biblioteca de recursos reutilizables
â”‚       â”‚   â”‚   â”œâ”€â”€ agents/             # Biblioteca de Agentes
â”‚       â”‚   â”‚   â”œâ”€â”€ contexts/           # Biblioteca de Contextos
â”‚       â”‚   â”‚   â”œâ”€â”€ prompts/            # Biblioteca de Prompts
â”‚       â”‚   â”‚   â”œâ”€â”€ patterns/           # Patrones de diseÃ±o con IA
â”‚       â”‚   â”‚   â”œâ”€â”€ checklists/         # Checklists por dominio
â”‚       â”‚   â”‚   â”œâ”€â”€ templates/          # Plantillas reutilizables
â”‚       â”‚   â”‚   â””â”€â”€ case-studies/       # Casos de estudio
â”‚       â”‚   â”‚
â”‚       â”‚   â””â”€â”€ framework/              # [NUEVO] Framework propio del curso
â”‚       â”‚       â”œâ”€â”€ principles/         # Principios del framework
â”‚       â”‚       â”œâ”€â”€ roles/              # Roles (AI Engineer, AI Architect, etc.)
â”‚       â”‚       â”œâ”€â”€ artifacts/          # Artefactos del framework
â”‚       â”‚       â”œâ”€â”€ workflow/           # Flujo de trabajo
â”‚       â”‚       â””â”€â”€ governance/         # Gobernanza y validaciones
â”‚       â”‚
â”‚       â””â”€â”€ [shared-presentation.css]  # [DEPRECAR GRADUALMENTE â†’ mover a shared/styles/]
â”‚
â”œâ”€â”€ angular.json                        # [ACTUALIZAR paths de estilos]
â”œâ”€â”€ package.json                        # [ACTUALIZAR â€” instalar Tailwind como npm]
â”œâ”€â”€ tsconfig.json                       # [ACTUALIZAR â€” strict: true]
â””â”€â”€ [otros config files]                # [MANTENER sin cambios]
```

---

## 3. Nueva Estructura de Rutas

### 3.1 Ãrbol de Rutas Propuesto

```
/                          â†’ Redirect â†’ /home
/home                      â†’ HomeComponent (nuevo â€” Bienvenida)

/modulo-1                  â†’ Lazy Module: Module1RoutingModule
  /modulo-1/plan           â†’ PlanDevDetalladoComponent (preservado)
  /modulo-1/clase/1        â†’ Clase1DevFundamentosComponent (preservado)
  /modulo-1/clase/2        â†’ Clase2DevSpringBootComponent (preservado)
  /modulo-1/clase/3        â†’ Clase3DevMigracionLegacyComponent (preservado)
  /modulo-1/clase/4        â†’ Clase4DevIntegracionApisComponent (preservado)
  /modulo-1/clase/5        â†’ Clase5DevTestingAvanzadoComponent (preservado)
  /modulo-1/clase/6        â†’ Clase6DevModuloAngularComponent (preservado)
  /modulo-1/clase/7        â†’ Clase7DevFrontendLegacyComponent (preservado)
  /modulo-1/clase/8        â†’ Clase8DevEstadoRxjsComponent (preservado)
  /modulo-1/clase/9        â†’ Clase9DevTestingE2eComponent (preservado)
  /modulo-1/clase/10       â†’ Clase10DevFastapiComponent (preservado)
  /modulo-1/clase/11       â†’ Clase11DevLambdaServerlessComponent (preservado)
  /modulo-1/clase/12       â†’ Clase12DevProyectoFinalComponent (preservado)
  /modulo-1/instalacion    â†’ InstallationGuidesComponent (preservado)
  /modulo-1/tech-stack     â†’ TechStackComponent (preservado)

/modulo-2                  â†’ Placeholder (Coming Soon)
/modulo-3                  â†’ Placeholder (Coming Soon)
/modulo-4                  â†’ Placeholder (Coming Soon)
/modulo-5                  â†’ Placeholder (Coming Soon)
/modulo-6                  â†’ Placeholder (Coming Soon)

/biblioteca                â†’ LibraryComponent (nuevo)
  /biblioteca/agentes
  /biblioteca/contextos
  /biblioteca/prompts
  /biblioteca/patrones
  /biblioteca/checklists
  /biblioteca/templates
  /biblioteca/casos-de-estudio

/framework                 â†’ FrameworkComponent (nuevo)

# Redirects de compatibilidad (para no romper URLs existentes)
/plan-dev-detallado        â†’ Redirect â†’ /modulo-1/plan
/study-plan                â†’ Redirect â†’ /modulo-1/plan
/installation-guides       â†’ Redirect â†’ /modulo-1/instalacion
/tech-stack                â†’ Redirect â†’ /modulo-1/tech-stack
/clase1-dev-fundamentos    â†’ Redirect â†’ /modulo-1/clase/1
/clase2-dev-spring-boot    â†’ Redirect â†’ /modulo-1/clase/2
[... todos los redirects de clases existentes ...]
```

> **GarantÃ­a de compatibilidad:** Los URLs actuales seguirÃ¡n funcionando indefinidamente mediante redirects. NingÃºn enlace externo se romperÃ¡.

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

Este modelo permite al sidebar generarse **dinÃ¡micamente** desde datos, eliminando la duplicaciÃ³n actual.

---

## 5. Nueva Arquitectura del Sidebar

En lugar de links hardcodeados, el sidebar usarÃ¡ el modelo de datos:

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

## 6. Estrategia de MigraciÃ³n de Estilos

### 6.1 DivisiÃ³n de `shared-presentation.css` (1,434 lÃ­neas)

El archivo monolÃ­tico se dividirÃ¡ en mÃ³dulos CSS con responsabilidad Ãºnica:

| Archivo Nuevo | Contenido | TamaÃ±o Estimado |
|---|---|---|
| `_variables.css` | CSS custom properties globales (colores, espaciado, tipografÃ­a) | ~50 lÃ­neas |
| `_typography.css` | Estilos de texto, headings, pÃ¡rrafos | ~100 lÃ­neas |
| `_cards.css` | Cards, panels, section-cards | ~200 lÃ­neas |
| `_slides.css` | Slideshow container, controles, indicadores | ~300 lÃ­neas |
| `_code.css` | Tokyo Night tokens, `code`, `pre`, `kbd` | ~150 lÃ­neas |
| `_badges.css` | Tech badges, tags, labels | ~100 lÃ­neas |
| `_animations.css` | Keyframes, transiciones, hover effects | ~150 lÃ­neas |
| `_layout.css` | Grids, flexbox utilities del contenido | ~200 lÃ­neas |
| `index.css` | Barrel: `@import` de todos los parciales | ~20 lÃ­neas |

### 6.2 MigraciÃ³n de Tailwind CDN a npm

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

| Archivo Actual | Nueva UbicaciÃ³n |
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

| Archivo Nuevo | PropÃ³sito |
|---|---|
| `src/app/core/services/course.service.ts` | Modelo de datos del curso |
| `src/app/core/services/navigation.service.ts` | GestiÃ³n de navegaciÃ³n dinÃ¡mica |
| `src/app/core/models/course.model.ts` | Interfaces TypeScript del modelo |
| `src/app/shared/styles/_variables.css` | CSS custom properties centralizadas |
| `src/app/shared/styles/_slides.css` | Estilos de slideshow extraÃ­dos |
| `src/app/layout/sidebar/sidebar.component.ts` | Sidebar como componente independiente |
| `src/app/features/home/home.component.ts` | PÃ¡gina de bienvenida |
| `src/app/features/modules/module-1-ia-generativa/module-1.routes.ts` | Child routes M1 |
| `src/app/features/library/library.component.ts` | Biblioteca de recursos |

### 7.3 Archivos que se MANTIENEN SIN CAMBIOS

```
src/main.ts
src/index.html (solo actualizaciÃ³n de meta)
src/app/app.config.ts (solo agregar redirects)
src/app/clase[1-12]-*/[clase]-*.component.ts  (TODOS preservados)
src/app/clase[1-12]-*/[clase]-*.component.html (TODOS preservados)
src/app/clase[1-12]-*/[clase]-*.component.css  (TODOS preservados)
src/app/installation-guides/*.ts / *.html / *.css
src/app/tech-stack/*.ts / *.html / *.css
src/app/plan-dev-detallado/*.ts / *.html / *.css
.github/workflows/deploy.yml
angular.json (cambios mÃ­nimos de paths)
```

---

## 8. VerificaciÃ³n de PreservaciÃ³n

La siguiente tabla confirma que **ningÃºn componente existente es eliminado o renombrado**:

| Componente | Clase Angular | Selector | Ruta URL | Estado |
|---|---|---|---|---|
| Plan de Estudio | `PlanDevDetalladoComponent` | `app-plan-dev-detallado` | `/modulo-1/plan` (+ redirect desde `/plan-dev-detallado`) | âœ… PRESERVADO |
| GuÃ­as InstalaciÃ³n | `InstallationGuidesComponent` | `app-installation-guides` | `/modulo-1/instalacion` (+ redirect) | âœ… PRESERVADO |
| Tech Stack | `TechStackComponent` | `app-tech-stack` | `/modulo-1/tech-stack` (+ redirect) | âœ… PRESERVADO |
| Clase 1 | `Clase1DevFundamentosComponent` | `app-clase1-dev-fundamentos` | `/modulo-1/clase/1` (+ redirect) | âœ… PRESERVADO |
| Clase 2 | `Clase2DevSpringBootComponent` | `app-clase2-dev-spring-boot` | `/modulo-1/clase/2` (+ redirect) | âœ… PRESERVADO |
| Clase 3-12 | (todos) | (todos) | `/modulo-1/clase/[n]` (+ redirect) | âœ… PRESERVADOS |

---

*Documento de solo lectura â€” No se moviÃ³ ningÃºn archivo.*
*Siguiente: Roadmap de migraciÃ³n en `MASTER_PLAN.md`*