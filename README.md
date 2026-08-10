<div align="center">
  <h1>CASE OS</h1>
  <p><strong>The Engineering Operating System & AI Academy</strong></p>
  <p><em>Learn. Build. Experiment. Ship.</em></p>
  <br />
  
  [![Angular](https://img.shields.io/badge/Angular-22+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Signals](https://img.shields.io/badge/Signals-Reactive-009688?style=for-the-badge&logo=angular&logoColor=white)]()
  [![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
</div>

<br />

## 🌌 Visión General

> Modern software engineers no solo consumen contenido. Investigan, experimentan, documentan, automatizan y construyen.
>
> **CASE OS** unifica estas actividades dentro de un único Engineering Workspace, eliminando la fragmentación entre cursos, documentación, laboratorios y herramientas de productividad. Es el hogar de **CASE Academy**, el programa definitivo de *Agentic Software Engineering*.

<div align="center">
  <img src="docs/assets/case-os-hero.png" alt="CASE OS Dashboard" width="100%" />
</div>

---

## 🏛️ Los Dos Pilares de CASE OS

CASE OS se divide en dos componentes masivos que interactúan de forma nativa: La **Plataforma Tecnológica** (El Sistema Operativo) y el **Currículum** (La Academia).

### Pilar 1: La Plataforma (CASE OS)

- **Engineering Workspace:** El hub central de operaciones y dashboards interactivos.
- **Library:** Una biblioteca de recursos de ingeniería de IA listos para usar (Token Estimators, Context Budgets, Prompt Checklists, Arquitecturas MCP).
- **Labs:** Entornos experimentales interactivos (`Token Playground`, `Classification Routines`).
- **Command Palette:** Búsqueda global y ejecución ultra rápida (`Ctrl+K`).
- **Keyboard First:** Diseñado para power users, totalmente accesible por atajos.
- **Design System:** Tokens de CSS puros, arquitectura escalable sin librerías de componentes UI pesadas.

### Pilar 2: El Currículum (CASE Academy)

CASE Academy es el programa maestro que transforma ingenieros de software tradicionales en **Ingenieros de Sistemas Probabilísticos**. Abandona el "prompting mágico" para enfocarse en la arquitectura, seguridad y evaluación de sistemas de IA generativa en producción.

**Módulos del Currículum Core (Instructor Guide):**
- **M01 AI Foundations:** Entender que la IA es un motor probabilístico, no una base de datos determinista.
- **M02 Prompt Engineering:** Controlar el comportamiento mediante *Instruction Contracts* y esquemas de salida estrictos.
- **M03 Context Engineering:** Ensamblar el contexto mínimo útil (*Context Manifest*). Relevante ≠ Necesario.
- **M04 Retrieval (RAG):** Construir pipelines de recuperación de candidatos y evaluar métricas de recall/precisión.
- **M05 AI Agents:** Implementar el principio de *Least Autonomy Necessary* mediante *Tool Calling* y ciclos de decisión.
- **M06 Agentic SWE:** Protocolos de colaboración humano-agente. El ingeniero diseña el qué; el agente tipea; el ingeniero verifica.
- **M07 Model Context Protocol (MCP):** Estandarización de capacidades corporativas. Exponer BDs asumiendo *Assume Breach* y *Never Trust the Client*.
- **M08 Production:** Cruzar la brecha a Producción. Jerarquía de Evaluación (`Determinista → LLM-as-a-Judge → Human Review`) sobre un *Golden Dataset*.
- **M09 Architecture:** Transición de arquitecturas monolíticas hacia sistemas distribuidos basados en capacidades.

> **Regla de Oro del Currículum:** *La IA puede producir el cambio; la responsabilidad de evaluar, auditar y aceptar el cambio pertenece al proceso de ingeniería (Deployment Gate).*

---

## ⚙️ Arquitectura Interna (Core Engines)

CASE OS no es una aplicación web tradicional. Es un sistema construido sobre pilares desacoplados (Engines):

```text
src/app/core/
├── engines/
│   ├── context/          (Context Builder, Graph Navigator)
│   ├── retrieval/        (Retrieval Pipeline, Strategies, Vectors)
│   └── search-engine     (Static Search Engine)
├── command/              (Command Palette, Registry, Dispatcher)
├── knowledge/            (Knowledge Registry, Providers)
└── storage/              (Local Storage Providers)
```

**Principios Arquitectónicos:**
- **✓ Declarative-first**
- **✓ Angular Signals over mutable state**
- **✓ Registry-driven architecture** (Command Registry, Workspace Registry)
- **✓ Dumb presentation components**
- **✓ Zero horizontal coupling**

---

## 🛠️ Stack Tecnológico

- **Framework:** Angular 22 (Standalone Components)
- **Reactivity:** Angular Signals (`signal`, `computed`, `effect`)
- **Language:** TypeScript 5.5+
- **Styling:** CSS Design Tokens (`design-system.css`)
- **Icons:** Material Symbols Outlined
- **CI/CD:** GitHub Actions & GitHub Pages Automático

---

## 💻 Quick Start

### Requisitos
- Node.js v22.x+
- npm v10.x+

### Instalación
```bash
git clone https://github.com/YamiCueto/case-os.git
cd case-os
npm install
npm start
```
Abre tu navegador en `http://localhost:4200/`.

---

## 🚀 Build y Deployment

### Compilación Local
```bash
npm run build
```

### GitHub Pages (Automático)
El despliegue está orquestado mediante **GitHub Actions**. Cualquier push a `main` disparará el workflow (`.github/workflows/deploy.yml`), publicando la SPA optimizada en `yamicueto.github.io/case-os/`.

---

## 🛣️ CASE OS Roadmap

### Phase I — Operating System (✅ Completado)
- Design Engine & Workspace Platform
- Command Platform (`Ctrl+K`)
- Engineering Workspace

### Phase II — Core Curriculum (✅ Completado)
- Academy Layout & Architecture
- Generative AI Engineering Modules (M01-M09)
- Labs & Library Integration

### Phase III — Collaborative Engineering (🔄 En Progreso)
- Projects & Agents Integration
- Multiplayer Features
- Advanced Context Engine

---

## 📖 Documentación Interna

El código fuente está respaldado por manifiestos arquitectónicos:

- [`CASE_OS_ARCHITECTURE.md`](CASE_OS_ARCHITECTURE.md) — Paradigma de Motores.
- [`CASE_UX_FOUNDATION.md`](CASE_UX_FOUNDATION.md) — Filosofía de Experiencia de Usuario.
- [`DESIGN.md`](DESIGN.md) — Documentación del Design System.

---

## 🤝 Contribución

CASE OS es estricto en su arquitectura. Antes de proponer un PR:
1. Asegúrate de que tu UI siga el principio **Dumb presentation components**.
2. Evita introducir CSS hardcodeado; utiliza únicamente `var(--case-*)`.
3. Todos los componentes de negocio deben registrarse vía Manifest o Registries.

---

## 📜 Licencia

Distribuido bajo la licencia [MIT](LICENSE). Construido con rigor para la ingeniería del futuro.
