# ARCHITECTURE REVIEW — Auditoría Arquitectónica Completa
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Autor:** Principal Software Architect (Auditoría)  
**Versión:** 1.0.0 — Solo lectura. No se modificó ningún archivo.

---

## 1. Resumen Ejecutivo

El proyecto es una **Single Page Application (SPA) Angular** desplegada en GitHub Pages que sirve como plataforma educativa interactiva para un curso de IA Generativa para desarrolladores de software.

La aplicación está correctamente construida para su etapa actual (v1 de contenido), pero **no tiene la estructura arquitectónica necesaria para escalar** a una plataforma educativa multi-módulo de varios años.

El contenido existente es rico, técnico y bien estructurado pedagógicamente. La arquitectura técnica actual es funcional pero monolítica y difícil de extender sin incurrir en deuda técnica creciente.

---

## 2. Stack Tecnológico Identificado

| Componente | Tecnología | Versión | Observación |
|---|---|---|---|
| Framework UI | Angular | **^22.0.0** | `package.json` dice v22, README dice 19+, index.html dice 19. Inconsistencia en documentación. |
| Lenguaje | TypeScript | ~6.0.2 | Moderno, alineado con Angular v22 |
| Estilos globales | Vanilla CSS + Tailwind CDN | Tailwind sin versión fija | **Tailwind cargado via CDN** — no instalado como dependencia npm. Antipatrón para producción. |
| Fuentes | Google Fonts (Inter, Material Icons) | — | Cargadas desde CDN en `index.html` |
| Routing | Angular Router (Hash-based) | — | `withHashLocation()` — Necesario para GitHub Pages. Correcto. |
| Estado | Signals nativos de Angular | — | Uso limitado: solo en `App.title`. No hay gestión de estado global. |
| Build | `@angular/build:application` | ^22.0.8 | Builder moderno (esbuild). Correcto. |
| Deploy | GitHub Actions + GitHub Pages | — | Pipeline automatizado. Funcional. |
| Testing | Sin tests configurados | — | `skipTests: true` en todos los schematics. Deuda técnica crítica. |

---

## 3. Estructura de Carpetas — Estado Actual

```
curso-ia-generativa/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD GitHub Pages
├── public/
│   ├── favicon.ico
│   ├── 404.html                    # Fallback para routing SPA
│   └── study-plan-dev.md           # PROBLEMA: Markdown de contenido en /public
├── src/
│   ├── index.html                  # Entry point con meta tags SEO completos
│   ├── main.ts                     # Bootstrap de la app
│   ├── styles.css                  # Estilos globales + Tokyo Night tokens
│   └── app/
│       ├── app.ts                  # Root component (shell layout)
│       ├── app.html                # Sidebar + Mobile menu + Router outlet
│       ├── app.css                 # VACÍO — 0 bytes
│       ├── app.config.ts           # Providers: router con HashLocation
│       ├── app.routes.ts           # 16 rutas, lazy-loaded, flat routing
│       ├── shared-presentation.css # 1,434 líneas — CSS compartido para clases
│       ├── plan-dev-detallado/     # Componente: Plan de estudio (home page)
│       ├── installation-guides/    # Componente: Guías de instalación
│       ├── tech-stack/             # Componente: Stack tecnológico BancoFiel
│       ├── clase1-dev-fundamentos/
│       ├── clase2-dev-spring-boot/
│       ├── clase3-dev-migracion-legacy/
│       ├── clase4-dev-integracion-apis/
│       ├── clase5-dev-testing-avanzado/
│       ├── clase6-dev-modulo-angular/
│       ├── clase7-dev-frontend-legacy/
│       ├── clase8-dev-estado-rxjs/
│       ├── clase9-dev-testing-e2e/
│       ├── clase10-dev-fastapi/
│       ├── clase11-dev-lambda-serverless/
│       └── clase12-dev-proyecto-final/
└── [config files]
```

**Observación crítica:** No existe una carpeta `docs/`, `shared/`, `core/`, `features/`, ni ninguna organización por capas o módulos. Todo está en `src/app/` a un solo nivel.

---

## 4. Inventario Completo de Componentes

### 4.1 Componente Shell (Layout)

| Componente | Selector | Archivo TS | Tamaño HTML | Patrón |
|---|---|---|---|---|
| `App` (Root Shell) | `app-root` | `app.ts` | 14.6 KB | Sidebar + Router Outlet |

### 4.2 Componentes Informativos

| Componente | Clase | Ruta | Tamaño TS | Tamaño HTML |
|---|---|---|---|---|
| Plan de Estudio | `PlanDevDetalladoComponent` | `/plan-dev-detallado` | 356 B | 23.6 KB |
| Guías Instalación | `InstallationGuidesComponent` | `/installation-guides` | 18.7 KB | 14.7 KB |
| Tech Stack | `TechStackComponent` | `/tech-stack` | 17.1 KB | 11.4 KB |

### 4.3 Componentes de Clases (Presentaciones)

| N° | Clase Angular | Ruta URL | TS | HTML | CSS | Slides |
|---|---|---|---|---|---|---|
| C1 | `Clase1DevFundamentosComponent` | `/clase1-dev-fundamentos` | 9.7 KB | 10.8 KB | 9.3 KB | 8 |
| C2 | `Clase2DevSpringBootComponent` | `/clase2-dev-spring-boot` | 11.5 KB | 10.2 KB | 8.6 KB | 8 |
| C3 | `Clase3DevMigracionLegacyComponent` | `/clase3-dev-migracion-legacy` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C4 | `Clase4DevIntegracionApisComponent` | `/clase4-dev-integracion-apis` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C5 | `Clase5DevTestingAvanzadoComponent` | `/clase5-dev-testing-avanzado` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C6 | `Clase6DevModuloAngularComponent` | `/clase6-dev-modulo-angular` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C7 | `Clase7DevFrontendLegacyComponent` | `/clase7-dev-frontend-legacy` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C8 | `Clase8DevEstadoRxjsComponent` | `/clase8-dev-estado-rxjs` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C9 | `Clase9DevTestingE2eComponent` | `/clase9-dev-testing-e2e` | ~10 KB | ~10 KB | ~8 KB | ~8 |
| C10 | `Clase10DevFastapiComponent` | `/clase10-dev-fastapi` | 14.1 KB | 10.1 KB | 7.7 KB | ~8 |
| C11 | `Clase11DevLambdaServerlessComponent` | `/clase11-dev-lambda-serverless` | ~12 KB | ~10 KB | ~8 KB | ~8 |
| C12 | `Clase12DevProyectoFinalComponent` | `/clase12-dev-proyecto-final` | **27.6 KB** | 11.2 KB | 10.4 KB | Múltiples |

**Hallazgo:** Clase12 es el componente más complejo (27.6 KB TS) y el único con un archivo CSS adicional (`clase12-extras.css`).

---

## 5. Auditoría del Sistema de Routing

### 5.1 Configuración

```typescript
// app.config.ts — Hash-based routing: correcto para GitHub Pages
provideRouter(routes, withHashLocation())
```

### 5.2 Problemas del Routing

| Problema | Impacto | Prioridad |
|---|---|---|
| Routing plano (sin child routes) | Al agregar 60+ rutas se vuelve inmanejable | ALTA |
| Sin rutas de módulo de curso | No se puede navegar a `/modulo-1/clase-x` | ALTA |
| Raíz redirige al plan de estudio | Debería ser una página de bienvenida | MEDIA |
| URLs llevan prefijo `dev` hardcodeado | Nuevas clases de otros módulos no seguirán el patrón | MEDIA |

---

## 6. Auditoría del Sistema de Estilos

| Archivo | Tamaño | Rol |
|---|---|---|
| `src/styles.css` | 3.3 KB | Global: CSS custom properties, dark theme, Tokyo Night |
| `src/app/shared-presentation.css` | **25.4 KB / 1,434 líneas** | Estilos compartidos para todas las clases |
| `src/app/app.css` | 0 bytes | Vacío — sin uso |
| `[clase].component.css` (x12) | ~7-10 KB c/u | Estilos específicos de cada clase |
| Tailwind CDN | N/A | Utilidades para sidebar, plan de estudio |

### Problemas Críticos de Estilos

| Problema | Severidad |
|---|---|
| Tailwind cargado via CDN en producción | CRÍTICO |
| `shared-presentation.css` monolítico (1,434 líneas) | ALTA |
| Mezcla de dos sistemas de estilos sin design system unificado | ALTA |
| CSS custom properties definidas en `:root` dos veces | MEDIA |
| `app.css` vacío | BAJA |

---

## 7. Análisis del Root Component

### Problemas del `App` Component

- `classesOpen = true` — Propiedad definida pero **no usada** en el template.
- El sidebar tiene links de navegación **hardcodeados en HTML** — duplicados entre desktop y mobile.
- Usa `*ngIf` (syntax v14) en lugar de `@if` (syntax v17+). Inconsistente con Angular 22.
- Links duplicados: cuando se agrega una clase hay que actualizarla en **dos lugares**.

---

## 8. Análisis de Duplicación de Código

El patrón Slideshow se repite en 12 componentes:

```
prevSlide(): ~5 líneas × 12 = 60 líneas duplicadas
nextSlide(): ~5 líneas × 12 = 60 líneas duplicadas
onKeydown(): ~7 líneas × 12 = 84 líneas duplicadas
Imports (CommonModule, RouterModule): 2 líneas × 12 = 24 líneas duplicadas
TOTAL: ~228 líneas de código idéntico en 12 archivos
```

---

## 9. Auditoría de Calidad

| Criterio | Estado | Observación |
|---|---|---|
| Tests | AUSENTE | `skipTests: true` en todos los schematics |
| TypeScript estricto | NO configurado | Sin `strict: true` en tsconfig |
| Linting | NO verificable | Sin ESLint visible |
| SEO | EXCELENTE | Open Graph, Twitter Cards, JSON-LD Schema |
| Lazy loading | IMPLEMENTADO | Todos los componentes cargados bajo demanda |
| Accessibility | NO auditado | Sin atributos aria-* evidentes |
| Prettier | CONFIGURADO | `.prettierrc` presente |

### Inconsistencias de Versión Documentadas

| Archivo | Dice | Vs. Realidad |
|---|---|---|
| `README.md` | Angular 19+ | package.json: Angular ^22.0.0 |
| `index.html` | Spring Boot 3.4+ | Clase 12: Spring Boot 4.1.0 |
| `study-plan-dev.md` | 1 mes, 20 días | Resto del curso: 3 meses / 12 semanas |

---

## 10. Métricas del Proyecto (Estado Actual)

| Métrica | Valor |
|---|---|
| Total de componentes | 15 (1 shell + 2 info + 12 clases) |
| Total de rutas | 16 (14 + 2 redirects) |
| Shared components UI | 0 |
| Tests | 0 |
| Servicios Angular | 0 |
| Interfaces TypeScript reutilizables | 0 (todas locales) |
| Archivos en `src/app/` | ~49 archivos en 15 directorios |

---

## 11. Deuda Técnica Priorizada

| Deuda | Categoría | Impacto | Esfuerzo |
|---|---|---|---|
| Sin tests | Calidad | CRÍTICO | Alto |
| Tailwind via CDN | Infraestructura | ALTO | Bajo |
| Routing plano sin jerarquía | Arquitectura | CRÍTICO | Medio |
| Sidebar con links hardcodeados | Mantenibilidad | ALTO | Medio |
| `shared-presentation.css` monolítico | Estilos | ALTO | Alto |
| Lógica de slideshow duplicada | DRY | MEDIO | Medio |
| Sin design system formal | Diseño | ALTO | Alto |
| Sin gestión de estado formal | Arquitectura | MEDIO | Alto |
| Sin accessibility | Calidad | ALTO | Medio |
| `*ngIf` vs `@if` inconsistencia | Modernización | BAJO | Bajo |

---

*Documento de solo lectura — No se modificó ningún archivo del proyecto.*
*Siguiente: `docs/COURSE_REVIEW.md`*
