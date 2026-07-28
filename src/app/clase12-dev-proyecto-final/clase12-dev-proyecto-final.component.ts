import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  title: string;
  type: string;
  content?: any;
}

@Component({
  selector: 'app-clase12-dev-proyecto-final',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase12-dev-proyecto-final.component.html',
  styleUrls: ['./clase12-dev-proyecto-final.component.css', './clase12-extras.css', '../shared-presentation.css']
})
export class Clase12DevProyectoFinalComponent {
  currentSlide = 0;

  // Title Slide
  titleSlide = {
    title: 'Proyecto Final Integrado',
    subtitle: 'Sistema de Préstamos Full-Stack + IA',
    icon: '🚀',
    description: 'Arquitectura de microservicios con 4 backends (Java Spring Boot, Python FastAPI, Lambda Node.js, CRUD REST), frontend Angular, AWS Cloud, y pruebas E2E automatizadas. Proyecto capstone que integra todo el conocimiento del curso.'
  };

  // Slide 1: Arquitectura del Proyecto
  architecture = {
    title: 'Arquitectura del Proyecto',
    description: 'Sistema distribuido con 4 microservicios backend, 1 frontend SPA, y orquestación serverless',
    diagram: `
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Angular 16+)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Login   │  │  Form    │  │ History  │  │  Admin   │           │
│  │  RxJS    │  │ Reactivo │  │   Table  │  │  Panel   │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
└───────┼─────────────┼─────────────┼─────────────┼─────────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │ HTTP REST
        ┌─────────────┴─────────────────────────────────┐
        │      API Gateway / Load Balancer              │
        └─────────────┬─────────────────────────────────┘
                      │
      ┌───────────────┼───────────────┬──────────────┐
      │               │               │              │
┌─────▼─────┐  ┌─────▼──────┐  ┌────▼─────┐  ┌────▼─────────┐
│ MS Clientes│  │ MS Scoring │  │ MS       │  │ Lambda       │
│ (Java SB)  │  │ (FastAPI)  │  │ Decisión │  │ Orchestrator │
│            │  │            │  │ (Java)   │  │ (Node.js)    │
│ Port: 8081 │  │ Port: 8000 │  │ Port:8082│  │ Event-driven │
└─────┬──────┘  └─────┬──────┘  └────┬─────┘  └────┬─────────┘
      │               │               │              │
      └───────────────┴───────────────┴──────────────┘
                      │
      ┌───────────────┴────────────────────────┐
      │                                        │
┌─────▼────────┐  ┌────────────┐  ┌─────────▼────────┐
│ PostgreSQL   │  │ DynamoDB   │  │ S3 Buckets       │
│ (Clientes +  │  │ (Logs +    │  │ (CSV Files +     │
│  Decisiones) │  │  Events)   │  │  Reports)        │
└──────────────┘  └────────────┘  └──────────────────┘
`,
    components: [
      { name: 'MS Clientes', tech: 'Java Spring Boot', port: '8081', db: 'PostgreSQL', purpose: 'CRUD de clientes con validaciones' },
      { name: 'MS Scoring', tech: 'Python FastAPI', port: '8000', db: 'N/A', purpose: 'Cálculo de scoring crediticio' },
      { name: 'MS Decisión', tech: 'Java Spring Boot', port: '8082', db: 'PostgreSQL', purpose: 'Lógica de aprobación con IA' },
      { name: 'Lambda Orchestrator', tech: 'Node.js + TypeScript', trigger: 'S3', db: 'DynamoDB', purpose: 'Procesamiento batch CSV' },
      { name: 'Frontend', tech: 'Angular 16+', features: 'RxJS + Forms + Tables', purpose: 'Interfaz de usuario reactiva' }
    ]
  };

  // Slide 2: User Stories (HU)
  userStories = {
    title: 'Historias de Usuario Principales',
    description: 'El proyecto debe implementar estas 4 HUs críticas con criterios de aceptación validables',
    stories: [
      {
        id: 'HU-001',
        title: 'Registro de Cliente',
        as: 'oficial de crédito',
        want: 'registrar los datos de un nuevo cliente',
        so: 'pueda iniciar el proceso de solicitud de préstamo',
        acceptance: [
          'Formulario reactivo con validaciones en tiempo real (nombre, email, RFC, teléfono)',
          'POST a MS Clientes con validación de RFC único',
          'Respuesta con ID del cliente creado en < 500ms',
          'Mensaje de éxito con opción de "Solicitar Préstamo"'
        ]
      },
      {
        id: 'HU-002',
        title: 'Solicitud de Préstamo',
        as: 'oficial de crédito',
        want: 'ingresar los datos de una solicitud de préstamo',
        so: 'el sistema calcule el scoring y determine la aprobación',
        acceptance: [
          'Formulario con 5 campos: monto, plazo, ingresos mensuales, deudas, historial',
          'Llamada a MS Scoring (FastAPI) que retorna puntaje 0-1000',
          'Llamada a MS Decisión con cliente + scoring que retorna APROBADO/RECHAZADO',
          'Persistencia de decisión en PostgreSQL con timestamp',
          'Mensaje visual claro del resultado con detalles del scoring'
        ]
      },
      {
        id: 'HU-003',
        title: 'Consulta de Historial',
        as: 'gerente',
        want: 'visualizar el historial de todas las solicitudes',
        so: 'pueda auditar y analizar las aprobaciones/rechazos',
        acceptance: [
          'Tabla paginada con filtros por estado, cliente, fecha',
          'Columnas: ID, Cliente, Fecha, Monto, Scoring, Decisión, Oficial',
          'Exportación a CSV del historial filtrado',
          'Actualización en tiempo real con WebSocket o polling',
          'Carga inicial en < 2s para 1000 registros'
        ]
      },
      {
        id: 'HU-004',
        title: 'Procesamiento Batch',
        as: 'sistema',
        want: 'procesar archivos CSV con múltiples solicitudes',
        so: 'se ejecuten aprobaciones masivas sin intervención manual',
        acceptance: [
          'Subida de CSV a S3 dispara Lambda automáticamente',
          'Lambda procesa CSV línea por línea (cliente, monto, plazo, ingresos, deudas)',
          'Por cada línea: llama a MS Scoring y MS Decisión',
          'Guarda resultados en DynamoDB con estado SUCCESS/ERROR',
          'Envía notificación SNS al finalizar con resumen (OK, errores, tiempo)',
          'CSV de errores guardado en bucket separado para reprocesamiento'
        ]
      }
    ]
  };

  // Slide 3: Estructura del Equipo
  teamStructure = {
    title: 'Estructura del Equipo y Roles',
    description: 'Distribución de responsabilidades para equipos de 3-4 personas',
    roles: [
      {
        role: 'Backend Developer 1',
        icon: '☕',
        responsibilities: [
          'MS Clientes (Java Spring Boot + JPA)',
          'Base de datos PostgreSQL (schema clientes + solicitudes)',
          'Endpoints CRUD con validaciones (@Valid)',
          'Pruebas unitarias con JUnit + Mockito',
          'Documentación Swagger/OpenAPI'
        ],
        deliverables: [
          'ClienteController con 5 endpoints',
          'ClienteService con lógica de negocio',
          'ClienteRepository (JPA)',
          'application.yml con configuración DB',
          '80% cobertura de tests'
        ]
      },
      {
        role: 'Backend Developer 2',
        icon: '🐍',
        responsibilities: [
          'MS Scoring (Python FastAPI + Pydantic)',
          'Algoritmo de scoring (ingresos, deudas, historial, estabilidad)',
          'Validaciones con Pydantic schemas',
          'Pytest para tests unitarios e integración',
          'Async/await para alto rendimiento'
        ],
        deliverables: [
          'scoring_service.py con cálculo del puntaje',
          'main.py con endpoints FastAPI',
          'schemas.py con modelos Pydantic',
          'tests/ con 15+ casos de prueba',
          'Dockerfile para despliegue'
        ]
      },
      {
        role: 'Cloud/DevOps Developer',
        icon: '☁️',
        responsibilities: [
          'Lambda Orchestrator (Node.js + TypeScript)',
          'SAM template con infraestructura completa',
          'Configuración S3 buckets + DynamoDB + SNS',
          'CloudWatch alarms y dashboard',
          'Pipeline CI/CD (GitHub Actions o similar)'
        ],
        deliverables: [
          'handler.ts con procesamiento CSV',
          'template.yaml con IaC completo',
          'package.json con dependencias AWS SDK v3',
          'Jest tests para Lambda',
          'README con instrucciones de deploy'
        ]
      },
      {
        role: 'Frontend Developer',
        icon: '🎨',
        responsibilities: [
          'SPA Angular 16+ con standalone components',
          'Formularios reactivos con validaciones',
          'Tabla de historial con paginación/filtros',
          'RxJS para manejo de estado y llamadas HTTP',
          'Cypress tests E2E para flujos críticos'
        ],
        deliverables: [
          'ClienteFormComponent con validaciones',
          'PrestamoFormComponent con flujo completo',
          'HistorialComponent con tabla + filtros',
          'HttpService con interceptors',
          '5+ specs E2E en Cypress'
        ]
      }
    ],
    optionalRole: {
      role: 'Tester QA',
      icon: '🧪',
      responsibilities: [
        'Test plan con casos de prueba manuales',
        'Pruebas de integración entre microservicios (Postman collections)',
        'Pruebas de carga (JMeter o K6)',
        'Validación de criterios de aceptación de HUs',
        'Reporte de bugs con evidencias'
      ]
    }
  };

  // Slide 4: Guía de Implementación (Fases)
  implementationGuide = {
    title: 'Guía de Implementación por Fases',
    description: 'Roadmap de 6 semanas con hitos verificables',
    phases: [
      {
        phase: 'Fase 1: Setup Inicial',
        duration: '1 semana',
        tasks: [
          'Setup de repositorio Git con estructura monorepo o multirepo',
          'Configuración de bases de datos (PostgreSQL local + DynamoDB local con SAM)',
          'Esqueleto de proyectos: Spring Boot (2), FastAPI (1), Lambda (1), Angular (1)',
          'Configuración de CI/CD básica (compilación y tests)',
          'Docker Compose para levantar todo el stack localmente'
        ],
        deliverable: 'Stack funcional con "Hello World" en cada servicio'
      },
      {
        phase: 'Fase 2: Backends Core',
        duration: '2 semanas',
        tasks: [
          'MS Clientes: CRUD completo con validaciones y tests',
          'MS Scoring: Implementar algoritmo + endpoints + tests con pytest',
          'MS Decisión: Lógica de aprobación + integración con MS Scoring',
          'Documentación OpenAPI/Swagger en los 3 servicios',
          'Postman collection con 30+ requests de integración'
        ],
        deliverable: 'HU-001 y HU-002 funcionales end-to-end vía Postman'
      },
      {
        phase: 'Fase 3: Frontend Reactivo',
        duration: '1.5 semanas',
        tasks: [
          'Componentes de formularios con validaciones reactivas',
          'Servicios HTTP con interceptors para auth y errores',
          'Componente de historial con tabla + paginación + filtros',
          'Manejo de estado con RxJS (BehaviorSubject)',
          'CSS con Tailwind o Material Design'
        ],
        deliverable: 'HU-001, HU-002, HU-003 funcionales desde UI'
      },
      {
        phase: 'Fase 4: Serverless Lambda',
        duration: '1 semana',
        tasks: [
          'Lambda handler con procesamiento de CSV desde S3',
          'Integración con MS Scoring y MS Decisión (HTTP calls)',
          'Escritura a DynamoDB + notificación SNS',
          'SAM template con toda la infraestructura',
          'Tests unitarios con Jest + mocks de AWS SDK'
        ],
        deliverable: 'HU-004 funcional con procesamiento batch'
      },
      {
        phase: 'Fase 5: Testing E2E',
        duration: '0.5 semanas',
        tasks: [
          'Cypress tests para flujo completo: registro → solicitud → consulta',
          'Tests de contrato con Pact o similar (opcional)',
          'Pruebas de carga básicas con K6 (500 req/s)',
          'Validación de criterios de aceptación de todas las HUs',
          'Documentación de casos de prueba ejecutados'
        ],
        deliverable: 'Suite de tests automatizados pasando al 100%'
      },
      {
        phase: 'Fase 6: Deploy y Demo',
        duration: '1 semana',
        tasks: [
          'Deploy en AWS (EC2 o ECS para backends, S3+CloudFront para frontend)',
          'Lambda ya desplegado con SAM deploy',
          'Configuración de dominio y certificados SSL',
          'Monitoreo con CloudWatch dashboard + alarms',
          'Video demo de 10 minutos mostrando las 4 HUs'
        ],
        deliverable: 'Sistema en producción accesible públicamente + video'
      }
    ]
  };

  // Slide 5: Entregables del Proyecto
  deliverables = {
    title: 'Entregables Obligatorios',
    description: 'Artefactos que deben presentarse para la evaluación final',
    items: [
      {
        category: 'Código Fuente',
        icon: '💻',
        requirements: [
          'Repositorio Git con commits atómicos y descriptivos',
          'README.md con instrucciones de setup, arquitectura, y team',
          'Código limpio con linting (ESLint, SonarLint) sin warnings',
          '.gitignore correctamente configurado (no subir node_modules, target, .env)',
          'Branches: main (prod), develop (staging), feature/* (desarrollo)'
        ]
      },
      {
        category: 'Documentación',
        icon: '📚',
        requirements: [
          'Diagramas de arquitectura (C4 Model: contexto, contenedores, componentes)',
          'Documentación de APIs (Swagger/OpenAPI accesible en /docs)',
          'Manual de usuario con screenshots del frontend',
          'Guía de troubleshooting común',
          'Postman collection exportada con ejemplos'
        ]
      },
      {
        category: 'Testing',
        icon: '🧪',
        requirements: [
          'Cobertura mínima: 70% en backends, 60% en frontend',
          'Al menos 5 tests E2E en Cypress cubriendo flujos críticos',
          'Reporte de tests automatizado (JaCoCo, coverage.py, etc.)',
          'Tests de integración entre microservicios',
          'Evidencia de pruebas de carga (gráficas JMeter/K6)'
        ]
      },
      {
        category: 'Infraestructura',
        icon: '☁️',
        requirements: [
          'docker-compose.yml para levantar stack completo localmente',
          'SAM template.yaml funcional (sam build && sam deploy exitoso)',
          'Scripts de inicialización de bases de datos (schema.sql, seed data)',
          'Variables de entorno documentadas en .env.example',
          'Diagramas de infraestructura AWS (S3, Lambda, DynamoDB, SNS)'
        ]
      },
      {
        category: 'Demo en Vivo',
        icon: '🎬',
        requirements: [
          'Presentación de 15 minutos + 5 minutos Q&A',
          'Demostración de las 4 HUs funcionando en vivo',
          'Mostrar logs en CloudWatch de Lambda procesando CSV',
          'Explicar 1 desafío técnico encontrado y cómo se resolvió',
          'Video de respaldo (10 min) en caso de problemas de conectividad'
        ]
      }
    ]
  };

  // Slide 6: Criterios de Evaluación
  evaluationCriteria = {
    title: 'Criterios de Evaluación y Rúbrica',
    description: 'Distribución de puntaje total: 100 puntos',
    criteria: [
      {
        category: 'Funcionalidad',
        points: 35,
        breakdown: [
          { item: 'HU-001 (Registro Cliente) funcional', points: 7 },
          { item: 'HU-002 (Solicitud Préstamo con scoring) funcional', points: 10 },
          { item: 'HU-003 (Historial con filtros) funcional', points: 8 },
          { item: 'HU-004 (Procesamiento batch Lambda) funcional', points: 10 }
        ]
      },
      {
        category: 'Arquitectura y Diseño',
        points: 20,
        breakdown: [
          { item: 'Correcta separación de responsabilidades entre servicios', points: 5 },
          { item: 'Uso de patrones de diseño apropiados (Repository, Service, etc.)', points: 5 },
          { item: 'Manejo robusto de errores y excepciones', points: 5 },
          { item: 'Código limpio y bien estructurado (SOLID, DRY)', points: 5 }
        ]
      },
      {
        category: 'Testing y Calidad',
        points: 20,
        breakdown: [
          { item: 'Cobertura de tests unitarios ≥70%', points: 7 },
          { item: 'Tests E2E funcionando (≥5 specs)', points: 7 },
          { item: 'Tests de integración entre servicios', points: 6 }
        ]
      },
      {
        category: 'Infraestructura y DevOps',
        points: 15,
        breakdown: [
          { item: 'Docker Compose funcional para desarrollo local', points: 5 },
          { item: 'SAM template correcto con deploy exitoso', points: 5 },
          { item: 'CI/CD pipeline básico (build + test automático)', points: 5 }
        ]
      },
      {
        category: 'Documentación',
        points: 10,
        breakdown: [
          { item: 'README completo con setup instructions', points: 3 },
          { item: 'Diagramas de arquitectura claros', points: 3 },
          { item: 'Documentación de APIs (Swagger/OpenAPI)', points: 2 },
          { item: 'Postman collection exportada', points: 2 }
        ]
      }
    ],
    bonusPoints: [
      { item: 'Implementar autenticación JWT con roles (admin/usuario)', points: 5 },
      { item: 'WebSocket para actualización en tiempo real del historial', points: 5 },
      { item: 'Dashboard de métricas (Grafana o similar)', points: 5 },
      { item: 'Multi-idioma (i18n) en el frontend', points: 3 }
    ]
  };

  // Slide 7: Desafíos Técnicos Comunes
  challenges = {
    title: 'Desafíos Técnicos y Soluciones',
    description: 'Problemas frecuentes y cómo abordarlos',
    items: [
      {
        challenge: 'Comunicación entre Microservicios',
        problem: 'MS Decisión no puede llamar a MS Scoring por problemas de CORS o DNS',
        solutions: [
          'Usar docker-compose con nombres de servicio (scoring:8000) en lugar de localhost',
          'Configurar CORS en FastAPI: app.add_middleware(CORSMiddleware, allow_origins=["*"])',
          'Implementar circuit breaker con Resilience4j (Java) o tenacity (Python)',
          'Agregar timeouts razonables (5-10s) en RestTemplate o HttpClient'
        ]
      },
      {
        challenge: 'Lambda No Recibe Eventos de S3',
        problem: 'Subir CSV a S3 no dispara la función Lambda',
        solutions: [
          'Verificar que el S3 bucket tenga permisos para invocar Lambda (AWS::Lambda::Permission)',
          'Confirmar que el evento esté configurado: NotificationConfiguration en SAM template',
          'Revisar CloudWatch Logs para errores de permisos o timeout',
          'Testear localmente con: sam local invoke -e events/s3-event.json'
        ]
      },
      {
        challenge: 'Frontend No Muestra Datos',
        problem: 'Llamadas HTTP fallan con CORS o 404',
        solutions: [
          'Usar proxy en angular.json para desarrollo: "/api": {"target": "http://localhost:8081"}',
          'Verificar que los endpoints de backend tengan @CrossOrigin (Spring) o CORS middleware',
          'Debuggear con Network tab en DevTools para ver request/response exactos',
          'Implementar interceptor HTTP para logging de todas las llamadas'
        ]
      },
      {
        challenge: 'Tests E2E Fallan Intermitentemente',
        problem: 'Cypress tests pasan localmente pero fallan en CI',
        solutions: [
          'Agregar esperas explícitas: cy.intercept() + cy.wait(@alias)',
          'Usar datos de prueba aislados (crear cliente único por test con UUID)',
          'Limpiar base de datos antes de cada test: beforeEach(() => db.reset())',
          'Aumentar timeouts en CI: defaultCommandTimeout: 10000'
        ]
      },
      {
        challenge: 'Rendimiento Bajo en Procesamiento Batch',
        problem: 'Lambda tarda 5+ minutos en procesar 1000 líneas de CSV',
        solutions: [
          'Procesar en lotes de 25 con Promise.all() en lugar de secuencial',
          'Aumentar memoria de Lambda (más memoria = más CPU proporcionalmente)',
          'Usar DynamoDB BatchWriteItem en lugar de PutItem individual',
          'Considerar Step Functions para orquestación de procesos largos (>15min)'
        ]
      }
    ]
  };

  // Slide 8: Recursos y Herramientas Recomendadas
  resources = {
    title: 'Recursos y Herramientas',
    description: 'Stack tecnológico recomendado y referencias útiles',
    tools: [
      {
        category: 'Desarrollo Backend',
        items: [
          'Java 17 + Spring Boot 3.1 (MS Clientes y Decisión)',
          'Python 3.11 + FastAPI 0.104 + Pydantic V2 (MS Scoring)',
          'Node.js 18 + TypeScript 5.0 + AWS SDK v3 (Lambda)',
          'PostgreSQL 15 con pgAdmin 4 para gestión visual',
          'DynamoDB Local con AWS SAM CLI para desarrollo offline'
        ]
      },
      {
        category: 'Desarrollo Frontend',
        items: [
          'Angular 16+ con standalone components',
          'RxJS 7+ para programación reactiva',
          'Tailwind CSS 3 para estilos',
          'Angular Material 16 para componentes UI (opcional)',
          'Cypress 13 para testing E2E'
        ]
      },
      {
        category: 'Infraestructura y DevOps',
        items: [
          'Docker 24 + Docker Compose V2',
          'AWS SAM CLI 1.100+ (brew install aws-sam-cli)',
          'Localstack para emular AWS localmente (opcional)',
          'GitHub Actions o GitLab CI para pipeline',
          'AWS CLI configurado con credenciales (aws configure)'
        ]
      },
      {
        category: 'Testing y QA',
        items: [
          'JUnit 5 + Mockito para tests Java',
          'Pytest + pytest-asyncio para tests Python',
          'Jest + ts-jest para tests TypeScript',
          'Postman/Insomnia para tests manuales de APIs',
          'K6 o JMeter para pruebas de carga'
        ]
      },
      {
        category: 'Documentación',
        items: [
          'Swagger UI (integrado en Spring Boot y FastAPI)',
          'Draw.io o Lucidchart para diagramas',
          'Markdown para README y guías',
          'Postman Documenter para generar docs de collections',
          'Mermaid.js para diagramas en Markdown'
        ]
      }
    ],
    tutorials: [
      'Spring Boot REST API: https://spring.io/guides/tutorials/rest',
      'FastAPI documentation: https://fastapi.tiangolo.com',
      'AWS SAM Tutorial: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html',
      'Angular Forms Guide: https://angular.io/guide/reactive-forms',
      'Cypress E2E: https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test'
    ]
  };

  // Slide 9: Summary
  summary = {
    title: '¡Proyecto Final Completo!',
    achievements: [
      'Arquitectura de microservicios con 4 backends y 1 frontend integrados',
      '4 Historias de Usuario implementadas con criterios de aceptación validables',
      'Stack tecnológico diverso: Java, Python, Node.js, TypeScript, Angular',
      'Infraestructura serverless con AWS Lambda, S3, DynamoDB, SNS',
      'Testing completo: unitario, integración, E2E, y carga',
      'CI/CD pipeline automatizado con Docker y SAM'
    ],
    keyFeatures: [
      '🚀 Sistema distribuido escalable y resiliente',
      '☁️ Procesamiento batch con orquestación serverless',
      '🎨 Frontend reactivo con RxJS y formularios validados',
      '🧪 Suite completa de tests automatizados',
      '📊 Monitoreo y alertas con CloudWatch',
      '🔐 Manejo robusto de errores y excepciones'
    ],
    nextSteps: [
      '📅 Planificar sprints semanales con revisiones de progreso',
      '👥 Distribuir roles según fortalezas del equipo',
      '🛠️ Configurar entorno de desarrollo (Docker Compose + IDEs)',
      '📝 Crear backlog de tareas en Trello/Jira con estimaciones',
      '💬 Establecer canales de comunicación (Slack/Discord)',
      '🎯 Definir Definition of Done para cada fase',
      '🚀 ¡Manos a la obra y a construir un proyecto del que estén orgullosos!'
    ]
  };

  slides: Slide[] = [
    { title: 'Arquitectura', type: 'architecture' },
    { title: 'User Stories', type: 'userStories' },
    { title: 'Equipo', type: 'teamStructure' },
    { title: 'Implementación', type: 'implementationGuide' },
    { title: 'Entregables', type: 'deliverables' },
    { title: 'Evaluación', type: 'evaluationCriteria' },
    { title: 'Desafíos', type: 'challenges' },
    { title: 'Recursos', type: 'resources' },
    { title: 'Resumen', type: 'summary' }
  ];

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' && this.currentSlide < this.slides.length) {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft' && this.currentSlide > 0) {
      this.prevSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
}
