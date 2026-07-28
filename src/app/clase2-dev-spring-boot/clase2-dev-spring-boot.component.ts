import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PromptExample {
  title: string;
  description: string;
  prompt: string;
  output: string[];
  tips: string[];
}

interface Challenge {
  id: number;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  title: string;
  description: string;
  requirements: string[];
  stack: string[];
  hints: string[];
  tiempo: string;
}

@Component({
  selector: 'app-clase2-dev-spring-boot',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase2-dev-spring-boot.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase2-dev-spring-boot.component.css'
  ]
})
export class Clase2DevSpringBootComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'objective' },
    { type: 'architecture' },
    { type: 'prompt-structure' },
    { type: 'step-by-step' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  objective = {
    main: 'Crear microservicio completo de Gestión de Clientes desde cero usando IA',
    goals: [
      'Generar arquitectura hexagonal con Spring Boot 3.2',
      'Implementar todas las capas: Entity, DTO, Repository, Service, Controller',
      'Agregar validaciones, manejo de excepciones y tests',
      'Obtener código production-ready en menos de 30 minutos'
    ],
    stack: [
      { name: 'Java 17', icon: '☕', color: 'bg-red-50' },
      { name: 'Spring Boot 3.2', icon: '🍃', color: 'bg-green-50' },
      { name: 'Spring Data JPA', icon: '💾', color: 'bg-blue-50' },
      { name: 'Lombok', icon: '🔧', color: 'bg-yellow-50' },
      { name: 'MapStruct', icon: '🗺️', color: 'bg-purple-50' },
      { name: 'JUnit 5 + Mockito', icon: '🧪', color: 'bg-pink-50' }
    ]
  };

  architectureLayers = [
    {
      name: 'Controller',
      icon: '🎯',
      description: 'REST API endpoints con validaciones',
      components: ['ClienteController', 'OpenAPI/Swagger', 'Exception Handling'],
      color: 'bg-blue-50'
    },
    {
      name: 'Service',
      icon: '⚙️',
      description: 'Lógica de negocio y validaciones',
      components: ['ClienteService', 'Business Rules', 'DTO Mapping'],
      color: 'bg-green-50'
    },
    {
      name: 'Repository',
      icon: '💾',
      description: 'Acceso a datos con JPA',
      components: ['ClienteRepository', 'Custom Queries', 'JPA Entities'],
      color: 'bg-purple-50'
    },
    {
      name: 'DTOs',
      icon: '📦',
      description: 'Objetos de transferencia',
      components: ['ClienteRequestDTO', 'ClienteResponseDTO', 'Bean Validation'],
      color: 'bg-orange-50'
    }
  ];

  promptStructure = {
    sections: [
      {
        name: 'ROL',
        icon: '👤',
        description: 'Define quién debe actuar la IA',
        example: 'Actúa como arquitecto de software senior especializado en Spring Boot',
        color: 'bg-blue-50'
      },
      {
        name: 'CONTEXTO',
        icon: '📋',
        description: 'Stack, proyecto, arquitectura, restricciones',
        example: 'Proyecto: Sistema bancario MyLegacyApp - Stack: Java 17, Spring Boot 3.2.x',
        color: 'bg-green-50'
      },
      {
        name: 'TAREA',
        icon: '🎯',
        description: 'Qué generar exactamente',
        example: 'Genera microservicio completo de Gestión de Clientes incluyendo...',
        color: 'bg-purple-50'
      },
      {
        name: 'RESTRICCIONES',
        icon: '⚠️',
        description: 'Qué usar y qué evitar',
        example: 'Usar Lombok, MapStruct, validaciones JSR-380',
        color: 'bg-orange-50'
      },
      {
        name: 'FORMATO',
        icon: '📝',
        description: 'Cómo estructurar la salida',
        example: 'Código completo con estructura de paquetes + application.yml',
        color: 'bg-pink-50'
      }
    ]
  };

  promptExample: PromptExample = {
    title: 'Prompt Profesional para Microservicio',
    description: 'Prompt estructurado que genera código production-ready',
    prompt: `[ROL] Actúa como arquitecto de software senior especializado en Spring Boot

[CONTEXTO]
- Proyecto: Sistema bancario MyLegacyApp - BancoFiel
- Stack: Java 17, Spring Boot 3.2.x, Spring Data JPA, Oracle 19c
- Arquitectura: Microservicios con arquitectura hexagonal
- Estándares: Lombok, MapStruct, validaciones JSR-380
- Seguridad: Spring Security con JWT

[TAREA]
Genera microservicio completo de Gestión de Clientes incluyendo:
1. Entidad Cliente con campos: id, tipoDocumento, numeroDocumento, nombres,
   apellidos, email, telefono, fechaNacimiento, direccion, ciudadId,
   estadoCivil, ocupacion, ingresos, activo, fechaCreacion, fechaActualizacion
2. DTOs: ClienteRequestDTO, ClienteResponseDTO con validaciones
3. Mapper con MapStruct
4. Repository con consultas: findByNumeroDocumento, findByEmailContaining,
   findActivosByIngresos
5. Service con validaciones: cliente único por documento, validar mayoría de edad
6. Controller REST con endpoints CRUD + búsquedas
7. Manejo excepciones global con @ControllerAdvice
8. Tests unitarios con cobertura >80%

[RESTRICCIONES]
- Usar Lombok para reducir boilerplate
- Documentar con JavaDoc métodos públicos
- Logs con SLF4J en operaciones críticas
- Respuestas HTTP estandarizadas

[FORMATO]
Código completo con estructura de paquetes + application.yml + tests`,
    output: [
      '✅ Entidad JPA con relaciones y validaciones',
      '✅ DTOs con Bean Validation (@NotNull, @Email, @Pattern)',
      '✅ Repository con consultas personalizadas',
      '✅ Service con lógica de negocio',
      '✅ Controller REST con OpenAPI',
      '✅ Global Exception Handler',
      '✅ Tests JUnit 5 + Mockito',
      '✅ Configuración application.yml'
    ],
    tips: [
      'Especifica versiones exactas de Spring Boot y Java',
      'Define arquitectura claramente (hexagonal, capas, etc)',
      'Lista todos los campos de la entidad',
      'Menciona validaciones de negocio específicas',
      'Pide tests con cobertura mínima'
    ]
  };

  steps = [
    {
      number: 1,
      title: 'Analizar Requerimientos',
      description: 'Revisar Historia de Usuario y extraer entidades, campos, validaciones',
      time: '5 min',
      icon: '📋',
      color: 'bg-blue-50'
    },
    {
      number: 2,
      title: 'Estructurar Prompt',
      description: 'Crear prompt con ROL, CONTEXTO, TAREA, RESTRICCIONES, FORMATO',
      time: '5 min',
      icon: '✍️',
      color: 'bg-green-50'
    },
    {
      number: 3,
      title: 'Generar con IA',
      description: 'Usar ChatGPT/Claude con el prompt estructurado',
      time: '2 min',
      icon: '🤖',
      color: 'bg-purple-50'
    },
    {
      number: 4,
      title: 'Revisar y Ajustar',
      description: 'Validar código, ejecutar tests, ajustar si es necesario',
      time: '10 min',
      icon: '🔍',
      color: 'bg-orange-50'
    },
    {
      number: 5,
      title: 'Generar Tests',
      description: 'Pedir a IA que genere tests unitarios completos',
      time: '5 min',
      icon: '🧪',
      color: 'bg-pink-50'
    },
    {
      number: 6,
      title: 'Documentar',
      description: 'Agregar JavaDoc y README con instrucciones',
      time: '3 min',
      icon: '📝',
      color: 'bg-indigo-50'
    }
  ];

  challenge: Challenge = {
    id: 2,
    difficulty: 'Intermedio',
    title: 'Crear Microservicio de Gestión de Clientes',
    description: 'Genera un microservicio completo de Gestión de Clientes bancarios usando IA con arquitectura hexagonal y todas las mejores prácticas',
    requirements: [
      'Entidad Cliente con mínimo 12 campos',
      'DTOs con validaciones Bean Validation',
      'Repository con 3+ consultas personalizadas',
      'Service con validaciones de negocio',
      'Controller REST con CRUD completo',
      'Manejo global de excepciones',
      'Tests unitarios cobertura >80%',
      'Documentación OpenAPI/Swagger',
      'application.yml configurado'
    ],
    stack: [
      'Java 17',
      'Spring Boot 3.2.x',
      'Spring Data JPA',
      'Lombok',
      'MapStruct',
      'JUnit 5',
      'Mockito',
      'H2/PostgreSQL'
    ],
    hints: [
      'Usa el prompt estructurado de ejemplo como base',
      'Especifica campos exactos de la entidad Cliente',
      'Define validaciones de negocio: documento único, mayor de edad',
      'Pide tests en el mismo prompt',
      'Itera si falta algo: "Agrega manejo de excepciones"'
    ],
    tiempo: '30 minutos'
  };

  bestPractices = {
    dos: [
      {
        title: 'Especifica arquitectura',
        example: '✅ "Arquitectura hexagonal con separación de capas"',
        why: 'Código estructurado y mantenible'
      },
      {
        title: 'Lista todos los campos',
        example: '✅ "Entidad con: id, tipoDocumento, numeroDocumento..."',
        why: 'Evita iteraciones posteriores'
      },
      {
        title: 'Define validaciones',
        example: '✅ "Cliente único por documento, mayor de 18 años"',
        why: 'Lógica de negocio correcta'
      },
      {
        title: 'Pide tests en el prompt',
        example: '✅ "Incluye tests JUnit 5 con cobertura >80%"',
        why: 'Código testeable desde el inicio'
      },
      {
        title: 'Especifica estándares',
        example: '✅ "Usar Lombok, MapStruct, SLF4J"',
        why: 'Consistencia en el código'
      }
    ],
    donts: [
      {
        title: 'Prompts vagos',
        example: '❌ "Hazme un microservicio"',
        why: 'Resultados genéricos'
      },
      {
        title: 'Omitir validaciones',
        example: '❌ No especificar reglas de negocio',
        why: 'Código incompleto'
      },
      {
        title: 'No pedir tests',
        example: '❌ Solo generar código de producción',
        why: 'Difícil de mantener'
      },
      {
        title: 'Ignorar configuración',
        example: '❌ No pedir application.yml',
        why: 'Microservicio no arranca'
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
