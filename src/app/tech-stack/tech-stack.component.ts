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
      description: 'Estándar abierto para conectar Agentes de IA directamente a bases de datos, APIs y herramientas locales',
      category: 'IA & Asistentes',
      tags: ['Protocolo', 'Agentes', 'SOTA 2026'],
      docUrl: 'https://modelcontextprotocol.io'
    },
    {
      name: 'DeepSeek R1 / V3',
      icon: '🐉',
      description: 'Modelo de razonamiento de código abierto enfocado en lógica compleja, matemática y refactorización de código',
      category: 'IA & Asistentes',
      tags: ['IA', 'Reasoning', 'Open Source'],
      docUrl: 'https://github.com/deepseek-ai'
    },
    {
      name: 'Claude 3.7 Sonnet',
      icon: '🧠',
      description: 'Modelo híbrido con pensamiento profundo y capacidad avanzada para desarrollo de software y arquitectura',
      category: 'IA & Asistentes',
      tags: ['IA', 'Reasoning', 'Anthropic'],
      docUrl: 'https://docs.anthropic.com'
    },
    {
      name: 'OpenAI o3-mini / o1',
      icon: '⚛️',
      description: 'Modelos de razonamiento de OpenAI diseñados para la resolución de problemas lógicos y generación de algoritmos',
      category: 'IA & Asistentes',
      tags: ['IA', 'OpenAI', 'Razonamiento'],
      docUrl: 'https://platform.openai.com/docs'
    },
    {
      name: 'Cursor AI & Windsurf',
      icon: '✨',
      description: 'IDEs nativos de agentes de IA para desarrollo Spec-Driven, edición multi-archivo y ejecución autónoma',
      category: 'Editores',
      tags: ['IDE', 'Agentes', 'SOTA'],
      docUrl: 'https://docs.cursor.com'
    },
    {
      name: 'GitHub Copilot Agent Mode',
      icon: '🤖',
      description: 'Asistencia autónoma de código integrada en VS Code con capacidades de auto-edición y análisis de proyectos',
      category: 'IA & Asistentes',
      tags: ['IA', 'Copilot', 'Agentic'],
      docUrl: 'https://docs.github.com/en/copilot'
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
      name: 'Angular 18+',
      icon: '🅰️',
      description: 'Framework moderno para aplicaciones enterprise escalables (Clases 8, 9, 12)',
      category: 'Frontend',
      tags: ['Framework', 'TypeScript', 'Enterprise'],
      docUrl: 'https://angular.dev/overview'
    },
    {
      name: 'TypeScript',
      icon: '🔷',
      description: 'Superset de JavaScript con tipado estático para código más robusto',
      category: 'Frontend',
      tags: ['JavaScript', 'Tipado', 'Angular'],
      docUrl: 'https://www.typescriptlang.org/docs/'
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
      name: 'Java 17+',
      icon: '☕',
      description: 'Lenguaje robusto para backend enterprise (Clase 6)',
      category: 'Backend',
      tags: ['Lenguaje', 'Enterprise', 'JVM'],
      docUrl: 'https://docs.oracle.com/en/java/javase/17/'
    },
    {
      name: 'Spring Boot',
      icon: '🍃',
      description: 'Framework líder para APIs REST y microservicios en Java (Clase 6)',
      category: 'Backend',
      tags: ['Framework', 'REST', 'Java'],
      docUrl: 'https://spring.io/projects/spring-boot'
    },
    {
      name: 'Python 3.10+',
      icon: '🐍',
      description: 'Lenguaje versátil para scripting, APIs y testing (Clases 3, 4, 5)',
      category: 'Backend',
      tags: ['Lenguaje', 'Scripting', 'Testing'],
      docUrl: 'https://docs.python.org/3/'
    },
    {
      name: 'FastAPI',
      icon: '⚡',
      description: 'Framework moderno Python para APIs REST con validación automática',
      category: 'Backend',
      tags: ['Framework', 'REST', 'Python'],
      docUrl: 'https://fastapi.tiangolo.com'
    },

    // Bases de Datos
    {
      name: 'H2 Database',
      icon: '💾',
      description: 'Base de datos en memoria para desarrollo rápido con Spring Boot (Clase 6)',
      category: 'Bases de Datos',
      tags: ['SQL', 'In-Memory', 'Java'],
      docUrl: 'https://www.h2database.com/html/main.html'
    },
    {
      name: 'SQLite',
      icon: '📦',
      description: 'Base de datos embebida ligera para Python y demos (FastAPI)',
      category: 'Bases de Datos',
      tags: ['SQL', 'Embebida', 'Python'],
      docUrl: 'https://www.sqlite.org/docs.html'
    },

    // Testing & QA
    {
      name: 'Selenium WebDriver',
      icon: '🤖',
      description: 'Automatización de pruebas E2E en navegadores (Clase 4)',
      category: 'Testing & QA',
      tags: ['Automatización', 'E2E', 'Browser'],
      docUrl: 'https://www.selenium.dev/documentation/'
    },
    {
      name: 'Cypress',
      icon: '🌲',
      description: 'Framework moderno para testing E2E con experiencia developer-first (Clases 4, 9)',
      category: 'Testing & QA',
      tags: ['E2E', 'JavaScript', 'Moderno'],
      docUrl: 'https://docs.cypress.io'
    },
    {
      name: 'JUnit 5',
      icon: '✅',
      description: 'Framework de testing unitario para Java/Spring Boot (Clases 6, 9)',
      category: 'Testing & QA',
      tags: ['Unit Testing', 'Java', 'Backend'],
      docUrl: 'https://junit.org/junit5/docs/current/user-guide/'
    },
    {
      name: 'Mockito',
      icon: '🎭',
      description: 'Framework para mocking en tests unitarios Java (Clases 6, 9)',
      category: 'Testing & QA',
      tags: ['Mocking', 'Java', 'Unit Testing'],
      docUrl: 'https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html'
    },
    {
      name: 'Jasmine + Karma',
      icon: '🧪',
      description: 'Framework de testing unitario para Angular (Clases 8, 9)',
      category: 'Testing & QA',
      tags: ['Unit Testing', 'Angular', 'Frontend'],
      docUrl: 'https://jasmine.github.io/pages/docs_home.html'
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
