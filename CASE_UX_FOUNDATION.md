# CASE UX Foundation
### Sprint 0 — Design Bible v1.0

> Este documento es la fuente de verdad visual del producto antes de escribir código.  
> Todo lo que implementan los sprints 1-10 debe derivarse de aquí.

---

## 1. Design Principles

### 1.1 Tool, not Product
CASE se siente como una herramienta de ingeniería, no como un producto de marketing. Las decisiones visuales favorecen la funcionalidad sobre la presentación. Cada elemento existe porque sirve un propósito de trabajo.

> ✓ Compacto, denso, preciso  
> ✗ Gigante, espacioso, decorativo

### 1.2 Context is King
El entorno visual siempre refleja el estado de trabajo del usuario. La interfaz comunica dónde está el usuario, qué está haciendo y qué tiene disponible. La ambigüedad es un defecto.

> ✓ El Explorer cambia según el Workspace  
> ✗ Una misma vista para todo

### 1.3 Zero Noise
Solo existe lo que tiene propósito. Sin decoraciones, sin fondos degradados, sin glassmorphism, sin sombras dramáticas. La profundidad se comunica exclusivamente a través de diferencia tonal (1-2 stops de gris).

> ✓ `surface-0`, `surface-1`, bordes 1px  
> ✗ `box-shadow: 0 20px 40px rgba(...)`, gradients

### 1.4 Respect the Reader
El contenido (código, documentación, conceptos) es el protagonista. La interfaz es el marco. Los elementos de UI no compiten con el contenido en tamaño, color ni animación.

> ✓ Typography pequeña y precisa, accent restringido  
> ✗ Headings de 48px, botones llamativos en el contenido

### 1.5 Engineered Motion
Las animaciones son funcionales: comunican estado, orientan al usuario, no entretienen. Duración máxima de 250ms. Sin bounce, sin zoom exagerado.

> ✓ Fade 150ms al cambiar de vista, slide 200ms para paneles  
> ✗ Bounce, glow, animaciones decorativas

---

## 2. Component Inventory

### Shell Components
| Componente | Rol |
|---|---|
| `WorkspaceTopBar` | Barra superior fija. Brand + breadcrumb + acciones globales |
| `GlobalNav` | Columna de iconos 48px. Navegación de primer nivel |
| `ContextExplorer` | Panel contextual 240px. Navegación de segundo nivel |
| `ContentCanvas` | Área principal. Container del `<router-outlet>` |

### UI Primitives
| Componente | Rol |
|---|---|
| `CaseButton` | Primary, Secondary, Ghost. Acción principal |
| `CaseIconButton` | Solo icono. Acciones compactas |
| `CaseBadge` | Etiqueta monoespaciada. Tags, lenguajes, versiones |
| `CaseStatusBadge` | Estado semántico: LIVE, LOCKED, COMING_SOON |
| `CaseDivider` | Separador 1px. Horizontal o vertical |
| `CaseProgressBar` | Indicador de progreso. Altura 2px o 4px |
| `CaseSkeleton` | Placeholder de carga. Shimmer animation |
| `CaseToast` | Notificación temporal. Bottom-right |

### Layout Primitives
| Componente | Rol |
|---|---|
| `CasePanel` | Contenedor con elevación. Surface + border |
| `CaseTabs` | Pestañas con indicador 2px |
| `CaseBreadcrumb` | Ruta de navegación. Separada por `/` |
| `CaseEmptyState` | Estado vacío. Icono + mensaje + CTA opcional |

### Explorer Primitives
| Componente | Rol |
|---|---|
| `CaseExplorerItem` | Fila de 28px. Icono + label + estado |
| `CaseSidebarSection` | Encabezado de sección colapsable |

### Feature Components
| Componente | Rol |
|---|---|
| `CaseCommandPalette` | Modal de búsqueda global. `Ctrl+K` |
| `CaseCodeBlock` | Bloque de código con syntax highlighting |

---

## 3. Layout Rules

### 3.1 Shell Structure
```
┌─────────────────────────────────────────────────────┐
│  WorkspaceTopBar — 40px — position: sticky top      │
├──────────┬──────────────────┬────────────────────────┤
│ GlobalNav│ ContextExplorer  │   ContentCanvas        │
│  48px    │   240px          │   flex: 1              │
│  fixed   │   collapsible    │   overflow-y: auto     │
└──────────┴──────────────────┴────────────────────────┘
```

### 3.2 Reglas del Shell
- El `WorkspaceTopBar` es siempre visible. `position: sticky top: 0; z-index: var(--case-z-raised)`
- El `GlobalNav` nunca colapsa. Siempre 48px de ancho. Solo iconos, nunca texto.
- El `ContextExplorer` puede colapsarse a 0px. Transición de `width + opacity`.
- El `ContentCanvas` siempre ocupa el espacio restante. `flex: 1; min-width: 0`

### 3.3 Panel Rules
- Sin `border-radius` mayores a `--case-radius-md` (6px) en el shell
- Sin `box-shadow` en el shell. La profundidad es tonal.
- Bordes siempre `1px solid var(--case-border)`. Nunca más gruesos.
- Separación entre secciones: siempre con `CaseDivider`

### 3.4 Content Canvas Rules
- **Padding horizontal:** `var(--case-space-6)` (24px) en desktop
- **Heading principal** de cada vista: `font-size: var(--case-text-xl)` (20px), NO 32px+

---

## 4. Grid System

### Base Unit: 4px
Toda medida en el sistema es múltiplo de 4.

### Layout Grid
```
Global Nav:        48px (fixed)
Context Explorer:  240px (collapsible)
Content Canvas:    flex-1 (min 480px)
Top Bar:           40px height
```

### Content Grid (dentro del Canvas)
- **Single column:** Lecciones, documentación
- **2-column grid:** Dashboard widgets, galerías de items
- **Gap:** `var(--case-space-4)` (16px)
- **No más de 2 columnas** en el Canvas principal

---

## 5. Typography Scale

### Familias
| Familia | Variable | Uso |
|---|---|---|
| Inter | `--case-font-sans` | Todo el UI, labels, body text |
| JetBrains Mono | `--case-font-mono` | Código, badges, metadata técnica |

### Escala
| Token | Tamaño | Weight | Line-height | Uso |
|---|---|---|---|---|
| `--case-text-xs` | 11px | 400/500 | 16px | Labels mínimos, metadata, timestamps |
| `--case-text-sm` | 13px | 400 | 18px | Body secundario, explorer items |
| `--case-text-base` | 14px | 400 | 20px | Body principal, párrafos |
| `--case-text-md` | 15px | 500 | 22px | Subtítulos |
| `--case-text-lg` | 17px | 600 | 24px | Headings secundarios |
| `--case-text-xl` | 20px | 600 | 28px | Heading principal de vista |
| `--case-text-2xl` | 24px | 700 | 32px | Solo Dashboard (uso restringido) |

### Reglas
- Un solo `h1` por vista. Siempre con `--case-text-xl` o `--case-text-2xl`.
- Los badges y labels técnicos siempre usan `--case-font-mono`.
- No usar `rem` custom ni `px` hardcodeados en componentes.

---

## 6. Iconography

### Librería: Material Symbols Outlined (ya instalado)

### Tamaños
| Contexto | Token | Valor |
|---|---|---|
| Inline (texto) | `--case-icon-xs` | 14px |
| Explorer items, badges | `--case-icon-sm` | 16px |
| Global Nav, Top Bar | `--case-icon-md` | 20px |
| Empty States | `--case-icon-xl` | 32px |

### Iconos por Workspace
| Workspace | Icono Material |
|---|---|
| Dashboard | `grid_view` |
| Academy | `school` |
| Library | `library_books` |
| Labs | `science` |
| Framework | `account_tree` |
| Agents | `smart_toy` |
| Projects | `folder_open` |

### Reglas
- Solo `Material Symbols Outlined`. No emojis en la UI shell.
- Color: `currentColor` siempre. Nunca color hardcodeado en el icono.
- El active state en GlobalNav lo indica la línea 2px, no el icono.

---

## 7. Motion Guidelines

### Filosofía
Las animaciones sirven para orientar, confirmar y guiar. **Nunca para entretener.**

### Duraciones
| Token | Valor | Uso |
|---|---|---|
| `--case-duration-fast` | 100ms | Hover states, color changes |
| `--case-duration-normal` | 150ms | La mayoría de transiciones UI |
| `--case-duration-slow` | 250ms | Paneles collapse/expand |
| `--case-duration-enter` | 200ms | Elementos que aparecen |
| `--case-duration-exit` | 150ms | Elementos que desaparecen |

### Easing
| Token | Curva |
|---|---|
| `--case-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--case-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` — elementos que entran |
| `--case-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` — elementos que salen |

### Animaciones permitidas
| Animación | Propiedades | Duración |
|---|---|---|
| View transition | `opacity + translateY(4px)` | 200ms ease-out |
| Panel collapse | `width + opacity` | 250ms ease-default |
| Modal/Command Palette | `opacity + scale(0.97→1)` | 150ms ease-out |
| Toast | `opacity + translateX(-8px)` | 150ms ease-out |
| Hover | `background-color` | 100ms ease-default |

### Animaciones PROHIBIDAS
❌ bounce / spring  
❌ scale > 1.0 en elementos persistentes  
❌ blur / backdrop-filter  
❌ gradientes animados  
❌ glow effects  
❌ rotaciones decorativas  

### Accessibility (OBLIGATORIO)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

---

## 8. Responsive Rules

### Breakpoints
| Nombre | Valor | Notas |
|---|---|---|
| `md` | 768px | Tablet (soporte secundario) |
| `lg` | 1024px | Desktop mínimo |
| `xl` | 1280px | **Target primario** |

### Shell por breakpoint
| Componente | < 768px | 768-1024px | 1024px+ |
|---|---|---|---|
| TopBar | 100% | 100% | 100% |
| GlobalNav | Oculto | 48px visible | 48px visible |
| ContextExplorer | Oculto | Colapsado | 240px visible |
| ContentCanvas | 100% | flex-1 | flex-1 |

---

## 9. Design Tokens Reference

### Paleta de Superficie (Hyper-Dark — derivada de DESIGN.md)
```
--case-surface-0:   #050505   App shell base
--case-surface-1:   #0A0A0A   Sidebars, paneles fijos
--case-surface-2:   #111111   Cards, paneles elevados
--case-surface-3:   #161616   Modales, context menus
--case-surface-4:   #1E1E1E   Hover states, selección
```

### Borders
```
--case-border:          #1F1F1F
--case-border-subtle:   #141414
--case-border-strong:   #2A2A2A
```

### Texto
```
--case-text-primary:    #EDEDED
--case-text-secondary:  #8A8A8A
--case-text-muted:      #555555
--case-text-disabled:   #333333
```

### Accent (uso MUY restringido)
```
--case-accent:   #007AFF   Electric Blue
                            SOLO: botones primarios, active indicators,
                            progress bars, focus rings, links
```

### Semánticos
```
--case-color-success:   #22C55E
--case-color-warning:   #F59E0B
--case-color-error:     #EF4444
--case-color-info:      #3B82F6
```

---

## 10. Sprint 0 Checklist — Completado

- [x] Design Principles definidos (5 principios)
- [x] Component Inventory completo (Shell + UI + Explorer + Feature)
- [x] Layout Rules documentadas (Shell structure, Panel rules, Canvas rules)
- [x] Grid System definido (base 4px, columns, gaps)
- [x] Typography Scale completa (7 niveles, 2 familias)
- [x] Iconography definida (Material Symbols, tamaños, mapeo por workspace)
- [x] Motion Guidelines completas (permitidas, prohibidas, a11y)
- [x] Responsive Rules documentadas (target 1280px+)
- [x] Design Tokens Reference completa (color, border, text, accent, semantic)
- [x] Decisiones arquitectónicas documentadas (Explorer por Workspace, limitación URL)

**→ Sprint 0 COMPLETADO. Proceder a Sprint 1 — CASE Design System.**
