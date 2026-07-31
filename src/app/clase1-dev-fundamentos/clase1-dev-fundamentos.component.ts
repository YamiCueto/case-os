import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Tool {
  name: string;
  description: string;
  icon: string;
  price: string;
  bestFor: string;
  color: string;
}

interface Challenge {
  id: number;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  title: string;
  description: string;
  context: string[];
  requirements: string[];
  hints: string[];
  color: string;
}

@Component({
  selector: 'app-clase1-dev-fundamentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase1-dev-fundamentos.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase1-dev-fundamentos.component.css'
  ]
})
export class Clase1DevFundamentosComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'theory' },
    { type: 'tools' },
    { type: 'prompts' },
    { type: 'limitations' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  conceptos = [
    {
      icon: '🐉',
      title: 'Modelos de Razonamiento (Reasoning Models)',
      description: 'Modelos como Gemini 2.5 Pro / 3.x, DeepSeek R1, Claude 3.7 / 4.x y o3-mini razonan internamente (Chain-of-Thought) resolviendo bugs y arquitectura compleja.',
      color: 'bg-blue-50'
    },
    {
      icon: '🔌',
      title: 'Model Context Protocol (MCP)',
      iconClass: 'text-purple-600',
      titleText: 'MCP: Conexión con Herramientas',
      description: 'Protocolo estándar abierto para conectar Agentes de IA directamente a bases de datos PostgreSQL, APIs REST y herramientas del sistema.',
      color: 'bg-purple-50'
    },
    {
      icon: '📋',
      title: 'Spec-Driven Development (AGENTS.md)',
      description: 'Uso de especificaciones estructuradas `.agents` / `AGENTS.md` para definir reglas de proyecto, restricciones de código y estándares de calidad para los agentes.',
      color: 'bg-green-50'
    },
    {
      icon: '🤖',
      title: 'Agentes de Código Autónomos',
      description: 'Evolución de copilotos a agentes autónomos (Cursor AI, Windsurf, Copilot Agent Mode) capaces de editar múltiples archivos, correr pruebas y corregir errores.',
      color: 'bg-orange-50'
    }
  ];

  tools: Tool[] = [
    {
      name: 'Google Gemini 2.5 Pro / 3.x',
      description: 'Modelo de razonamiento multimodal y agentic coding de Google AI con ventana de contexto de 1M-2M+ tokens.',
      icon: '💎',
      price: 'Free / Gemini Advanced / API',
      bestFor: 'Análisis de grandes repositorios, código multimodal y razonamiento',
      color: 'bg-blue-50'
    },
    {
      name: 'DeepSeek R1 / V3',
      description: 'Modelo de razonamiento de código abierto con cadena de pensamiento interna de ultra-alta eficiencia.',
      icon: '🐉',
      price: 'Open Source / API Gratuita',
      bestFor: 'Razonamiento complejo, algoritmos, refactorización',
      color: 'bg-indigo-50'
    },
    {
      name: 'Claude 3.7 Sonnet & 4.x (Anthropic)',
      description: 'Modelo híbrido con pensamiento extendido, líder de la industria en generación de código y arquitectura.',
      icon: '🧠',
      price: 'Gratis / Pro $20/mes',
      bestFor: 'Código complejo, refactorización, arquitectura',
      color: 'bg-purple-50'
    },
    {
      name: 'OpenAI o3-mini & GPT-5.x',
      description: 'Modelos de razonamiento rápido e integración directa en VS Code y ChatGPT.',
      icon: '⚛️',
      price: 'Plus / Copilot $10/mes',
      bestFor: 'Autocompletado, solución de bugs, tests',
      color: 'bg-green-50'
    }
  ];

  promptExamples = {
    casual: {
      title: 'Desarrollador Casual ❌',
      prompt: '"Hazme un microservicio en Java"',
      problems: [
        'No especifica versiones',
        'No define arquitectura',
        'No menciona dependencias',
        'No pide tests',
        'Resultado genérico e inútil'
      ]
    },
    professional: {
      title: 'Prompt Engineer Profesional ✅',
      prompt: `[ROL] Actúa como arquitecto Java senior

[CONTEXTO]
- Stack: Java 21 LTS, Spring Boot 4.1.0, Spring Framework 7
- Arquitectura: Microservicio hexagonal, Jakarta EE 11
- Base de datos: PostgreSQL 17
- Performance: Virtual Threads habilitados (spring.threads.virtual.enabled=true)
- Proyecto: Sistema bancario de préstamos

[TAREA]
Genera microservicio de Gestión de Préstamos:
1. Entidad Prestamo (JPA 3.2 / jakarta.persistence)
2. DTO con validaciones Bean Validation 3.1
3. Repository con consultas personalizadas
4. Service con lógica negocio
5. Controller REST con OpenAPI 3.1
6. Manejo excepciones global con ProblemDetail (RFC 7807)
7. Tests JUnit 5 + Mockito + Testcontainers (cobertura >80%)

[RESTRICCIONES]
- Lombok para reducir boilerplate
- MapStruct para mapeo DTO
- Logs con SLF4J
- JSpecify (@NonNull, @Nullable) para null safety
- Usar jakarta.* (no javax.*)
- Documentación JavaDoc`,
      benefits: [
        'Especifica versiones exactas',
        'Define arquitectura clara',
        'Incluye todos los componentes',
        'Pide tests con cobertura',
        'Resultado production-ready'
      ]
    }
  };

  limitations = [
    {
      icon: '🎭',
      title: 'Alucinaciones',
      description: 'La IA puede inventar librerías inexistentes, métodos deprecated o arquitecturas incorrectas.',
      solution: 'Siempre valida el código generado. Ejecuta tests. Revisa documentación oficial.',
      color: 'bg-red-50'
    },
    {
      icon: '🔒',
      title: 'Seguridad',
      description: 'Puede generar código vulnerable: SQL injection, XSS, secretos hardcoded.',
      solution: 'Revisa con SonarQube, snyk. Nunca compartas código propietario con IAs públicas.',
      color: 'bg-yellow-50'
    },
    {
      icon: '©️',
      title: 'Propiedad Intelectual',
      description: 'El código generado puede tener licencias restrictivas o ser plagio.',
      solution: 'Verifica licencias. En empresas, usa herramientas con garantía legal (GitHub Copilot Enterprise).',
      color: 'bg-orange-50'
    },
    {
      icon: '📅',
      title: 'Conocimiento Desactualizado',
      description: 'Modelos entrenados hasta cierta fecha. No conocen últimas versiones.',
      solution: 'Especifica versiones. Complementa con documentación oficial actualizada.',
      color: 'bg-blue-50'
    }
  ];

  challenge: Challenge = {
    id: 1,
    difficulty: 'Intermedio',
    title: 'Analizar Módulo Legacy para Migración',
    description: 'Usa IA para analizar un módulo VB6 legacy y proponer arquitectura de migración a Spring Boot',
    context: [
      'Módulo VB6 de consulta de clientes bancarios',
      'Conexión directa a Oracle con ADO',
      'Validaciones en código UI',
      'Sin separación de capas'
    ],
    requirements: [
      'Identificar lógica de negocio vs código UI',
      'Proponer arquitectura en capas (Controller, Service, Repository)',
      'Listar queries SQL a migrar a JPA',
      'Identificar validaciones a Bean Validation',
      'Estimar esfuerzo de migración'
    ],
    hints: [
      'Usa un prompt estructurado con [ROL], [CONTEXTO], [TAREA]',
      'Pega fragmentos del código VB6',
      'Pide análisis de complejidad',
      'Solicita diagrama de arquitectura propuesta',
      'Pregunta sobre riesgos y mitigaciones'
    ],
    color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
  };

  bestPractices = {
    dos: [
      {
        title: 'Especifica versiones exactas',
        example: '✅ "Spring Boot 3.2.1, Java 17"',
        description: 'Evita incompatibilidades'
      },
      {
        title: 'Define arquitectura claramente',
        example: '✅ "Arquitectura hexagonal con DDD"',
        description: 'Obtén código estructurado'
      },
      {
        title: 'Pide tests siempre',
        example: '✅ "Incluye tests JUnit 5 con cobertura >80%"',
        description: 'Código confiable desde el inicio'
      },
      {
        title: 'Itera sobre resultados',
        example: '✅ "Mejora este código agregando circuit breaker"',
        description: 'Refina hasta obtener calidad production'
      },
      {
        title: 'Valida seguridad',
        example: '✅ Revisa con SonarQube, snyk',
        description: 'Detecta vulnerabilidades'
      }
    ],
    donts: [
      {
        title: 'Prompts demasiado amplios',
        example: '❌ "Hazme un sistema bancario completo"',
        description: 'Resultados genéricos e inútiles'
      },
      {
        title: 'Omitir requisitos no funcionales',
        example: '❌ Solo pedir funcionalidad',
        description: 'Falta performance, seguridad'
      },
      {
        title: 'Copiar/pegar sin revisar',
        example: '❌ Usar código sin análisis',
        description: 'Bugs, vulnerabilidades, mal diseño'
      },
      {
        title: 'Ignorar contexto del proyecto',
        example: '❌ Código incompatible con stack',
        description: 'Desperdicio de tiempo'
      }
    ]
  };

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }
}
