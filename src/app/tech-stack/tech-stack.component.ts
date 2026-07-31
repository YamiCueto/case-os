import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Technology {
  name: string;
  icon: string;
  description: string;
  category: string;
  tags: string[];
  docUrl: string;
  flipped?: boolean;
}

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack.component.html',
  styleUrls: ['./tech-stack.component.css']
})
export class TechStackComponent {
  showStack = false;
  flippedCards: Set<string> = new Set();
  expandedCategories: Set<string> = new Set();

  technologies: Technology[] = [
    // IA, Agentes & Protocolos
    {
      name: 'Model Context Protocol (MCP)',
      icon: '🔌',
      description: 'Estándar abierto para conectar Agentes de IA directamente a bases de datos PostgreSQL, APIs REST y herramientas del sistema',
      category: 'IA & Asistentes',
      tags: ['Protocolo', 'Agentes', 'MCP Standard'],
      docUrl: 'https://modelcontextprotocol.io'
    },
    {
      name: 'Google Gemini 2.5 Pro / 3.x',
      icon: '💎',
      description: 'Modelo de razonamiento multimodal y agentic coding con ventana de contexto ultra-larga (1M-2M+ tokens) de Google AI',
      category: 'IA & Asistentes',
      tags: ['Google AI', 'Reasoning', '1M+ Context'],
      docUrl: 'https://ai.google.dev'
    },
    {
      name: 'DeepSeek R1 / V3',
      icon: '🐉',
      description: 'Modelo de razonamiento de código abierto con cadena de pensamiento interna (Chain-of-Thought) ultra-eficiente para algoritmos y arquitectura',
      category: 'IA & Asistentes',
      tags: ['Open Source', 'Chain of Thought', 'Razonamiento'],
      docUrl: 'https://github.com/deepseek-ai'
    },
    {
      name: 'Claude 3.7 Sonnet & 4.x',
      icon: '🧠',
      description: 'Modelo híbrido con pensamiento extendido ("extended thinking") líder en generación de código complejo y refactorización multi-archivo',
      category: 'IA & Asistentes',
      tags: ['Anthropic', 'Extended Thinking', 'Arquitectura'],
      docUrl: 'https://docs.anthropic.com'
    },
    {
      name: 'OpenAI o3-mini / o3 / GPT-5.x',
      icon: '⚛️',
      description: 'Modelos de razonamiento avanzado de OpenAI enfocados en resolución de problemas lógicos, math, solución de bugs y generación de tests',
      category: 'IA & Asistentes',
      tags: ['OpenAI', 'Reasoning', 'Algorithms'],
      docUrl: 'https://platform.openai.com/docs'
    },
    // Editores & Entornos de Desarrollo Asistidos por IA
    {
      name: 'Google Antigravity IDE',
      icon: '🛸',
      description: 'IDE nativo para agentes autónomos desarrollado por el equipo de Google DeepMind para pair programming inteligente',
      category: 'Editores',
      tags: ['Google DeepMind', 'Agentic IDE', 'Pair Programming'],
      docUrl: 'https://deepmind.google'
    },
    {
      name: 'VS Code + Copilot Chat & Agent Mode',
      icon: '🟦',
      description: 'Editor estelar de desarrollo con integración de GitHub Copilot Chat, Agent Mode, ejecución de terminal y corrección de tests',
      category: 'Editores',
      tags: ['VS Code', 'Copilot Chat', 'Agent Mode'],
      docUrl: 'https://code.visualstudio.com'
    },
    {
      name: 'Cursor AI',
      icon: '⚡',
      description: 'IDE nativo agéntico basado en VS Code, optimizado para desarrollo Spec-Driven (AGENTS.md) e integración nativa MCP',
      category: 'Editores',
      tags: ['Agentic IDE', 'Spec-Driven', 'MCP Native'],
      docUrl: 'https://docs.cursor.com'
    },
    {
      name: 'Windsurf (Codeium Cascade)',
      icon: '🏄‍♂️',
      description: 'IDE agéntico enfocado en flujos de trabajo (flows) colaborativos con contexto continuo del repositorio completo',
      category: 'Editores',
      tags: ['Codeium', 'Flows', 'Cascade Agent'],
      docUrl: 'https://codeium.com/windsurf'
    },
    {
      name: 'OpenAI Codex & Code Interpreter',
      icon: '🧠',
      description: 'Motor de ejecución y razonamiento de código en entornos aislados para refactorización y análisis de scripts',
      category: 'Editores',
      tags: ['OpenAI', 'Codex', 'Interpreter'],
      docUrl: 'https://platform.openai.com'
    },
    {
      name: 'JetBrains AI Assistant (IntelliJ IDEA)',
      icon: '💎',
      description: 'Asistente agéntico integrado en IntelliJ IDEA optimizado para arquitecturas Java 21, Spring Boot y microservicios enterprise',
      category: 'Editores',
      tags: ['JetBrains', 'Java 21', 'Spring Boot'],
      docUrl: 'https://www.jetbrains.com/ai/'
    },

    // Frontend
    {
      name: 'HTML5 + CSS3',
      icon: '🌐',
      description: 'Fundamentos web para estructura y estilos (Clase 7 - Vanilla JS)',
      category: 'Frontend',
      tags: ['Web', 'Básico', 'Legacy'],
      docUrl: 'https://developer.mozilla.org/en-US/docs/Web'
    },
    {
      name: 'JavaScript (Vanilla)',
      icon: '🟨',
      description: 'JavaScript puro sin frameworks para entender fundamentos (Clase 7)',
      category: 'Frontend',
      tags: ['JavaScript', 'Legacy', 'DOM'],
      docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    },
    {
      name: 'Angular 22',
      icon: '🈰️',
      description: 'Framework enterprise para aplicaciones web escalables. Angular 22 introduce Signal Forms estables, httpResource(), Zoneless por defecto, y OnPush como estrategia por defecto (Clases 6, 7, 8, 12)',
      category: 'Frontend',
      tags: ['Framework', 'TypeScript', 'Signals', 'Zoneless'],
      docUrl: 'https://angular.dev'
    },
    {
      name: 'TypeScript 6.0',
      icon: '🔷',
      description: 'Superset de JavaScript con tipado estricto. TypeScript 6.0 aporta inferencia mejorada y compatibilidad con ESM nativo en Node.js 22',
      category: 'Frontend',
      tags: ['JavaScript', 'Tipado', 'Angular'],
      docUrl: 'https://www.typescriptlang.org/docs/'
    },
    {
      name: 'Angular Signals',
      icon: '🚦',
      description: 'API reactiva nativa de Angular 22: signal(), computed(), effect(), toSignal(), toObservable(). Reemplaza BehaviorSubject para estado de componentes (Clase 8)',
      category: 'Frontend',
      tags: ['Reactive', 'Angular 22', 'State'],
      docUrl: 'https://angular.dev/guide/signals'
    },
    {
      name: 'httpResource (Angular 22)',
      icon: '⚡',
      description: 'Primitive declarativa estable en Angular 22 para HTTP + Signals. Reemplaza HttpClient + switchMap para fetch de datos simple (Clase 6)',
      category: 'Frontend',
      tags: ['HTTP', 'Signals', 'Angular 22'],
      docUrl: 'https://angular.dev/guide/http/making-requests'
    },
    {
      name: 'Tailwind CSS',
      icon: '🎨',
      description: 'Framework CSS utility-first para diseño rápido y consistente',
      category: 'Frontend',
      tags: ['CSS', 'Diseño', 'Utilidades'],
      docUrl: 'https://tailwindcss.com/docs'
    },

    // Backend
    {
      name: 'Java 21 LTS',
      icon: '☕',
      description: 'Versión LTS del lenguaje Java. Incluye Virtual Threads (Project Loom), Records, Sealed Classes, Pattern Matching y mejoras de performance para microservicios enterprise (Clase 2)',
      category: 'Backend',
      tags: ['Lenguaje', 'Enterprise', 'Virtual Threads'],
      docUrl: 'https://docs.oracle.com/en/java/javase/21/'
    },
    {
      name: 'Spring Boot 4.1.0',
      icon: '🍃',
      description: 'Framework líder para APIs REST y microservicios. Spring Boot 4.1 (jun 2026) requiere Java 17+ sobre Spring Framework 7 + Jakarta EE 11. Incluye gRPC nativo, Virtual Threads y ProblemDetail RFC 7807 (Clase 2)',
      category: 'Backend',
      tags: ['Framework', 'REST', 'Jakarta EE 11'],
      docUrl: 'https://spring.io/projects/spring-boot'
    },
    {
      name: 'Python 3.13',
      icon: '🐍',
      description: 'Python 3.13 incluye JIT experimental, Free-Threaded mode (sin GIL) y REPL mejorado. Lenguaje versátil para APIs y IA (Clase 10)',
      category: 'Backend',
      tags: ['Lenguaje', 'IA', 'Async'],
      docUrl: 'https://docs.python.org/3.13/'
    },
    {
      name: 'uv (Python package manager)',
      icon: '🦄',
      description: 'Gestor de paquetes y proyectos Python escrito en Rust. 10-100x más rápido que pip. Reemplaza pip + venv + pip-tools + poetry. Usado en Clase 10 con FastAPI',
      category: 'Backend',
      tags: ['Python', 'Herramientas', 'Rust'],
      docUrl: 'https://docs.astral.sh/uv/'
    },
    {
      name: 'FastAPI 0.141.1',
      icon: '⚡',
      description: 'Framework Python moderno para APIs REST. Requiere Pydantic v2 (Rust-powered). Soporta OpenAPI 3.1 y SQLAlchemy 2.0 async (Clase 10)',
      category: 'Backend',
      tags: ['Framework', 'REST', 'Pydantic v2'],
      docUrl: 'https://fastapi.tiangolo.com'
    },

    // Bases de Datos
    {
      name: 'PostgreSQL 17',
      icon: '🐘',
      description: 'Base de datos relacional production-ready. Estándar para tests de integración con Testcontainers (reemplaza H2 en entornos modernos)',
      category: 'Bases de Datos',
      tags: ['SQL', 'Producción', 'Testcontainers'],
      docUrl: 'https://www.postgresql.org/docs/17/'
    },
    {
      name: 'H2 Database',
      icon: '💾',
      description: 'Base de datos en memoria para desarrollo rápido con Spring Boot. Nota: en 2026 se prefiere Testcontainers + PostgreSQL real para tests de integración',
      category: 'Bases de Datos',
      tags: ['SQL', 'In-Memory', 'Java', 'Legacy para tests'],
      docUrl: 'https://www.h2database.com/html/main.html'
    },
    {
      name: 'SQLite',
      icon: '📦',
      description: 'Base de datos embebida ligera para Python y demos (FastAPI con SQLAlchemy 2.0)',
      category: 'Bases de Datos',
      tags: ['SQL', 'Embebida', 'Python'],
      docUrl: 'https://www.sqlite.org/docs.html'
    },

    // Testing & QA
    {
      name: 'Selenium WebDriver 4',
      icon: '🤖',
      description: 'Automatización de pruebas E2E en navegadores. Selenium 4 incluye CDP nativo y relative locators (Clase 4)',
      category: 'Testing & QA',
      tags: ['Automatización', 'E2E', 'Browser'],
      docUrl: 'https://www.selenium.dev/documentation/'
    },
    {
      name: 'Cypress 15',
      icon: '🌲',
      description: 'Framework E2E moderno para Angular con cy.prompt() (tests en lenguaje natural via IA), Cypress Cloud AI assertions y soporte completo Angular 22 standalone (Clase 9)',
      category: 'Testing & QA',
      tags: ['E2E', 'JavaScript', 'AI-driven'],
      docUrl: 'https://docs.cypress.io'
    },
    {
      name: 'JUnit 5 + Testcontainers 2.0',
      icon: '✅',
      description: 'Testing unitario Java con Testcontainers 2.0.5 y @ServiceConnection para tests de integración contra bases de datos reales (Clases 5, 9)',
      category: 'Testing & QA',
      tags: ['Unit Testing', 'Java', 'Testcontainers'],
      docUrl: 'https://junit.org/junit5/docs/current/user-guide/'
    },
    {
      name: 'Mockito 5',
      icon: '🎡',
      description: 'Framework para mocking en tests unitarios Java. Mockito 5 con soporte nativo para Java 21 y tipos sellados (Clases 5, 9)',
      category: 'Testing & QA',
      tags: ['Mocking', 'Java', 'Unit Testing'],
      docUrl: 'https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html'
    },
    {
      name: 'Jest / Vitest (Angular)',
      icon: '🧪',
      description: 'Runners de testing modernos para Angular 22 que reemplazan Jasmine + Karma (en desuso). Vitest ofrece HMR de tests y es compatible con Vite (Clases 8, 9)',
      category: 'Testing & QA',
      tags: ['Unit Testing', 'Angular', 'Moderno'],
      docUrl: 'https://vitest.dev'
    },
    {
      name: 'Postman',
      icon: '📮',
      description: 'Herramienta para testing manual y automatizado de APIs REST (Clase 5)',
      category: 'Testing & QA',
      tags: ['API Testing', 'REST', 'Manual'],
      docUrl: 'https://learning.postman.com/docs/'
    },
    {
      name: 'REST Assured',
      icon: '🔐',
      description: 'Librería Java para testing automatizado de APIs REST (Clase 5)',
      category: 'Testing & QA',
      tags: ['API Testing', 'Java', 'Automatizado'],
      docUrl: 'https://rest-assured.io'
    },
    {
      name: 'pytest',
      icon: '🧬',
      description: 'Framework de testing para Python con sintaxis simple (FastAPI)',
      category: 'Testing & QA',
      tags: ['Unit Testing', 'Python', 'Backend'],
      docUrl: 'https://docs.pytest.org'
    },

    // Build & Deploy
    {
      name: 'Gradle',
      icon: '🐘',
      description: 'Build tool moderno para proyectos Java/Spring Boot (Clase 6)',
      category: 'Build & Deploy',
      tags: ['Build', 'Java', 'Automatización'],
      docUrl: 'https://docs.gradle.org'
    },
    {
      name: 'npm',
      icon: '📦',
      description: 'Gestor de paquetes para JavaScript/TypeScript y Angular',
      category: 'Build & Deploy',
      tags: ['Package Manager', 'JavaScript', 'Node'],
      docUrl: 'https://docs.npmjs.com'
    },
    {
      name: 'Git',
      icon: '🔀',
      description: 'Sistema de control de versiones distribuido',
      category: 'Build & Deploy',
      tags: ['Version Control', 'Colaboración'],
      docUrl: 'https://git-scm.com/doc'
    },
    {
      name: 'GitHub',
      icon: '🐙',
      description: 'Plataforma para hosting de repositorios y colaboración',
      category: 'Build & Deploy',
      tags: ['Repository', 'Colaboración', 'CI/CD'],
      docUrl: 'https://docs.github.com'
    },

    // Librerías y Herramientas Adicionales
    {
      name: 'Swagger UI',
      icon: '📘',
      description: 'Documentación interactiva automática para APIs REST (Clases 5, 6)',
      category: 'Documentación',
      tags: ['API Docs', 'OpenAPI', 'Interactivo'],
      docUrl: 'https://swagger.io/docs/'
    },
    {
      name: 'Faker.js / Faker (Python)',
      icon: '🎲',
      description: 'Generación de datos sintéticos realistas para testing (Clase 3)',
      category: 'Testing & QA',
      tags: ['Datos Sintéticos', 'Mocking', 'Testing'],
      docUrl: 'https://fakerjs.dev/guide/'
    },
    {
      name: 'Lombok',
      icon: '🌶️',
      description: 'Librería Java para reducir boilerplate code (Clase 6)',
      category: 'Librerías',
      tags: ['Java', 'Productividad', 'Backend'],
      docUrl: 'https://projectlombok.org/features/'
    },
    {
      name: 'RxJS',
      icon: '🔄',
      description: 'Librería para programación reactiva en Angular',
      category: 'Librerías',
      tags: ['Reactive', 'Angular', 'Observables'],
      docUrl: 'https://rxjs.dev/guide/overview'
    }
  ];

  get categories(): string[] {
    return [...new Set(this.technologies.map(t => t.category))];
  }

  getTechnologiesByCategory(category: string): Technology[] {
    return this.technologies.filter(t => t.category === category);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Editores': 'from-slate-500 to-slate-600',
      'IA & Asistentes': 'from-violet-500 to-purple-600',
      'Frontend': 'from-blue-500 to-cyan-600',
      'Backend': 'from-green-500 to-emerald-600',
      'Bases de Datos': 'from-orange-500 to-amber-600',
      'Testing & QA': 'from-pink-500 to-rose-600',
      'Build & Deploy': 'from-indigo-500 to-blue-600',
      'Documentación': 'from-yellow-500 to-orange-500',
      'Librerías': 'from-teal-500 to-green-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  }

  toggleStack(): void {
    this.showStack = !this.showStack;
  }

  toggleCard(techName: string, event: Event): void {
    event.stopPropagation();
    if (this.flippedCards.has(techName)) {
      this.flippedCards.delete(techName);
    } else {
      this.flippedCards.add(techName);
    }
  }

  isFlipped(techName: string): boolean {
    return this.flippedCards.has(techName);
  }

  toggleCategory(category: string, event: Event): void {
    event.stopPropagation();
    if (this.expandedCategories.has(category)) {
      // Si ya está expandida, la colapsamos
      this.expandedCategories.delete(category);
    } else {
      // Si no está expandida, colapsamos todas las demás y expandimos esta
      this.expandedCategories.clear();
      this.expandedCategories.add(category);
    }
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  expandAllCategories(): void {
    this.categories.forEach(cat => this.expandedCategories.add(cat));
  }

  collapseAllCategories(): void {
    this.expandedCategories.clear();
  }
}
