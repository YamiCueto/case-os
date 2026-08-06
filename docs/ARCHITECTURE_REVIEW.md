> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# ARCHITECTURE REVIEW â€” AuditorÃ­a ArquitectÃ³nica Completa
**Proyecto:** `curso-ia-generativa`  
**Fecha:** 2026-08-04  
**Autor:** Principal Software Architect (AuditorÃ­a)  
**VersiÃ³n:** 1.0.0 â€” Solo lectura. No se modificÃ³ ningÃºn archivo.

---

## 1. Resumen Ejecutivo

El proyecto es una **Single Page Application (SPA) Angular** desplegada en GitHub Pages que sirve como plataforma educativa interactiva para un curso de IA Generativa para desarrolladores de software.

La aplicaciÃ³n estÃ¡ correctamente construida para su etapa actual (v1 de contenido), pero **no tiene la estructura arquitectÃ³nica necesaria para escalar** a una plataforma educativa multi-mÃ³dulo de varios aÃ±os.

El contenido existente es rico, tÃ©cnico y bien estructurado pedagÃ³gicamente. La arquitectura tÃ©cnica actual es funcional pero monolÃ­tica y difÃ­cil de extender sin incurrir en deuda tÃ©cnica creciente.

---

## 2. Stack TecnolÃ³gico Identificado

| Componente | TecnologÃ­a | VersiÃ³n | ObservaciÃ³n |
|---|---|---|---|
| Framework UI | Angular | **^22.0.0** | `package.json` dice v22, README dice 19+, index.html dice 19. Inconsistencia en documentaciÃ³n. |
| Lenguaje | TypeScript | ~6.0.2 | Moderno, alineado con Angular v22 |
| Estilos globales | Vanilla CSS + Tailwind CDN | Tailwind sin versiÃ³n fija | **Tailwind cargado via CDN** â€” no instalado como dependencia npm. AntipatrÃ³n para producciÃ³n. |
| Fuentes | Google Fonts (Inter, Material Icons) | â€” | Cargadas desde CDN en `index.html` |
| Routing | Angular Router (Hash-based) | â€” | `withHashLocation()` â€” Necesario para GitHub Pages. Correcto. |
| Estado | Signals nativos de Angular | â€” | Uso limitado: solo en `App.title`. No hay gestiÃ³n de estado global. |
| Build | `@angular/build:application` | ^22.0.8 | Builder moderno (esbuild). Correcto. |
| Deploy | GitHub Actions + GitHub Pages | â€” | Pipeline automatizado. Funcional. |
| Testing | Sin tests configurados | â€” | `skipTests: true` en todos los schematics. Deuda tÃ©cnica crÃ­tica. |

---

## 3. Estructura de Carpetas â€” Estado Actual

```
curso-ia-generativa/
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ deploy.yml              # CI/CD GitHub Pages
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.ico
â”‚   â”œâ”€â”€ 404.html                    # Fallback para routing SPA
â”‚   â””â”€â”€ study-plan-dev.md           # PROBLEMA: Markdown de contenido en /public
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ index.html                  # Entry point con meta tags SEO completos
â”‚   â”œâ”€â”€ main.ts                     # Bootstrap de la app
â”‚   â”œâ”€â”€ styles.css                  # Estilos globales + Tokyo Night tokens
â”‚   â””â”€â”€ app/
â”‚       â”œâ”€â”€ app.ts                  # Root component (shell layout)
â”‚       â”œâ”€â”€ app.html                # Sidebar + Mobile menu + Router outlet
â”‚       â”œâ”€â”€ app.css                 # VACÃO â€” 0 bytes
â”‚       â”œâ”€â”€ app.config.ts           # Providers: router con HashLocation
â”‚       â”œâ”€â”€ app.routes.ts           # 16 rutas, lazy-loaded, flat routing
â”‚       â”œâ”€â”€ shared-presentation.css # 1,434 lÃ­neas â€” CSS compartido para clases
â”‚       â”œâ”€â”€ plan-dev-detallado/     # Componente: Plan de estudio (home page)
â”‚       â”œâ”€â”€ installation-guides/    # Componente: GuÃ­as de instalaciÃ³n
â”‚       â”œâ”€â”€ tech-stack/             # Componente: Stack tecnolÃ³gico BancoFiel
â”‚       â”œâ”€â”€ clase1-dev-fundamentos/
â”‚       â”œâ”€â”€ clase2-dev-spring-boot/
â”‚       â”œâ”€â”€ clase3-dev-migracion-legacy/
â”‚       â”œâ”€â”€ clase4-dev-integracion-apis/
â”‚       â”œâ”€â”€ clase5-dev-testing-avanzado/
â”‚       â”œâ”€â”€ clase6-dev-modulo-angular/
â”‚       â”œâ”€â”€ clase7-dev-frontend-legacy/
â”‚       â”œâ”€â”€ clase8-dev-estado-rxjs/
â”‚       â”œâ”€â”€ clase9-dev-testing-e2e/
â”‚       â”œâ”€â”€ clase10-dev-fastapi/
â”‚       â”œâ”€â”€ clase11-dev-lambda-serverless/
â”‚       â””â”€â”€ clase12-dev-proyecto-final/
â””â”€â”€ [config files]
```

**ObservaciÃ³n crÃ­tica:** No existe una carpeta `docs/`, `shared/`, `core/`, `features/`, ni ninguna organizaciÃ³n por capas o mÃ³dulos. Todo estÃ¡ en `src/app/` a un solo nivel.

---

## 4. Inventario Completo de Componentes

### 4.1 Componente Shell (Layout)

| Componente | Selector | Archivo TS | TamaÃ±o HTML | PatrÃ³n |
|---|---|---|---|---|
| `App` (Root Shell) | `app-root` | `app.ts` | 14.6 KB | Sidebar + Router Outlet |

### 4.2 Componentes Informativos

| Componente | Clase | Ruta | TamaÃ±o TS | TamaÃ±o HTML |
|---|---|---|---|---|
| Plan de Estudio | `PlanDevDetalladoComponent` | `/plan-dev-detallado` | 356 B | 23.6 KB |
| GuÃ­as InstalaciÃ³n | `InstallationGuidesComponent` | `/installation-guides` | 18.7 KB | 14.7 KB |
| Tech Stack | `TechStackComponent` | `/tech-stack` | 17.1 KB | 11.4 KB |

### 4.3 Componentes de Clases (Presentaciones)

| NÂ° | Clase Angular | Ruta URL | TS | HTML | CSS | Slides |
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
| C12 | `Clase12DevProyectoFinalComponent` | `/clase12-dev-proyecto-final` | **27.6 KB** | 11.2 KB | 10.4 KB | MÃºltiples |

**Hallazgo:** Clase12 es el componente mÃ¡s complejo (27.6 KB TS) y el Ãºnico con un archivo CSS adicional (`clase12-extras.css`).

---

## 5. AuditorÃ­a del Sistema de Routing

### 5.1 ConfiguraciÃ³n

```typescript
// app.config.ts â€” Hash-based routing: correcto para GitHub Pages
provideRouter(routes, withHashLocation())
```

### 5.2 Problemas del Routing

| Problema | Impacto | Prioridad |
|---|---|---|
| Routing plano (sin child routes) | Al agregar 60+ rutas se vuelve inmanejable | ALTA |
| Sin rutas de mÃ³dulo de curso | No se puede navegar a `/modulo-1/clase-x` | ALTA |
| RaÃ­z redirige al plan de estudio | DeberÃ­a ser una pÃ¡gina de bienvenida | MEDIA |
| URLs llevan prefijo `dev` hardcodeado | Nuevas clases de otros mÃ³dulos no seguirÃ¡n el patrÃ³n | MEDIA |

---

## 6. AuditorÃ­a del Sistema de Estilos

| Archivo | TamaÃ±o | Rol |
|---|---|---|
| `src/styles.css` | 3.3 KB | Global: CSS custom properties, dark theme, Tokyo Night |
| `src/app/shared-presentation.css` | **25.4 KB / 1,434 lÃ­neas** | Estilos compartidos para todas las clases |
| `src/app/app.css` | 0 bytes | VacÃ­o â€” sin uso |
| `[clase].component.css` (x12) | ~7-10 KB c/u | Estilos especÃ­ficos de cada clase |
| Tailwind CDN | N/A | Utilidades para sidebar, plan de estudio |

### Problemas CrÃ­ticos de Estilos

| Problema | Severidad |
|---|---|
| Tailwind cargado via CDN en producciÃ³n | CRÃTICO |
| `shared-presentation.css` monolÃ­tico (1,434 lÃ­neas) | ALTA |
| Mezcla de dos sistemas de estilos sin design system unificado | ALTA |
| CSS custom properties definidas en `:root` dos veces | MEDIA |
| `app.css` vacÃ­o | BAJA |

---

## 7. AnÃ¡lisis del Root Component

### Problemas del `App` Component

- `classesOpen = true` â€” Propiedad definida pero **no usada** en el template.
- El sidebar tiene links de navegaciÃ³n **hardcodeados en HTML** â€” duplicados entre desktop y mobile.
- Usa `*ngIf` (syntax v14) en lugar de `@if` (syntax v17+). Inconsistente con Angular 22.
- Links duplicados: cuando se agrega una clase hay que actualizarla en **dos lugares**.

---

## 8. AnÃ¡lisis de DuplicaciÃ³n de CÃ³digo

El patrÃ³n Slideshow se repite en 12 componentes:

```
prevSlide(): ~5 lÃ­neas Ã— 12 = 60 lÃ­neas duplicadas
nextSlide(): ~5 lÃ­neas Ã— 12 = 60 lÃ­neas duplicadas
onKeydown(): ~7 lÃ­neas Ã— 12 = 84 lÃ­neas duplicadas
Imports (CommonModule, RouterModule): 2 lÃ­neas Ã— 12 = 24 lÃ­neas duplicadas
TOTAL: ~228 lÃ­neas de cÃ³digo idÃ©ntico en 12 archivos
```

---

## 9. AuditorÃ­a de Calidad

| Criterio | Estado | ObservaciÃ³n |
|---|---|---|
| Tests | AUSENTE | `skipTests: true` en todos los schematics |
| TypeScript estricto | NO configurado | Sin `strict: true` en tsconfig |
| Linting | NO verificable | Sin ESLint visible |
| SEO | EXCELENTE | Open Graph, Twitter Cards, JSON-LD Schema |
| Lazy loading | IMPLEMENTADO | Todos los componentes cargados bajo demanda |
| Accessibility | NO auditado | Sin atributos aria-* evidentes |
| Prettier | CONFIGURADO | `.prettierrc` presente |

### Inconsistencias de VersiÃ³n Documentadas

| Archivo | Dice | Vs. Realidad |
|---|---|---|
| `README.md` | Angular 19+ | package.json: Angular ^22.0.0 |
| `index.html` | Spring Boot 3.4+ | Clase 12: Spring Boot 4.1.0 |
| `study-plan-dev.md` | 1 mes, 20 dÃ­as | Resto del curso: 3 meses / 12 semanas |

---

## 10. MÃ©tricas del Proyecto (Estado Actual)

| MÃ©trica | Valor |
|---|---|
| Total de componentes | 15 (1 shell + 2 info + 12 clases) |
| Total de rutas | 16 (14 + 2 redirects) |
| Shared components UI | 0 |
| Tests | 0 |
| Servicios Angular | 0 |
| Interfaces TypeScript reutilizables | 0 (todas locales) |
| Archivos en `src/app/` | ~49 archivos en 15 directorios |

---

## 11. Deuda TÃ©cnica Priorizada

| Deuda | CategorÃ­a | Impacto | Esfuerzo |
|---|---|---|---|
| Sin tests | Calidad | CRÃTICO | Alto |
| Tailwind via CDN | Infraestructura | ALTO | Bajo |
| Routing plano sin jerarquÃ­a | Arquitectura | CRÃTICO | Medio |
| Sidebar con links hardcodeados | Mantenibilidad | ALTO | Medio |
| `shared-presentation.css` monolÃ­tico | Estilos | ALTO | Alto |
| LÃ³gica de slideshow duplicada | DRY | MEDIO | Medio |
| Sin design system formal | DiseÃ±o | ALTO | Alto |
| Sin gestiÃ³n de estado formal | Arquitectura | MEDIO | Alto |
| Sin accessibility | Calidad | ALTO | Medio |
| `*ngIf` vs `@if` inconsistencia | ModernizaciÃ³n | BAJO | Bajo |

---

*Documento de solo lectura â€” No se modificÃ³ ningÃºn archivo del proyecto.*
*Siguiente: `docs/COURSE_REVIEW.md`*