import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  type: string;
}

@Component({
  selector: 'app-clase5-dev-testing-avanzado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase5-dev-testing-avanzado.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase5-dev-testing-avanzado.component.css'
  ]
})
export class Clase5DevTestingAvanzadoComponent {
  currentSlide = 0;

  slides: Slide[] = [
    { type: 'title' },
    { type: 'context' },
    { type: 'test-types' },
    { type: 'unit-tests' },
    { type: 'integration-tests' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  context = {
    scenario: 'Construir suite completa de tests para microservicios de Clases 2-4 usando IA',
    goals: [
      'Cobertura >80% de código crítico',
      'Tests automatizados en CI/CD',
      'Detección temprana de bugs',
      'Documentación viva del comportamiento'
    ],
    challenges: [
      {
        title: 'Tests Tediosos',
        description: 'Escribir tests manualmente es lento y aburrido',
        icon: 'schedule',
        color: 'orange'
      },
      {
        title: 'Casos Edge',
        description: 'Difícil pensar en todos los casos de prueba',
        icon: 'psychology',
        color: 'purple'
      },
      {
        title: 'Cobertura Baja',
        description: 'Presión de tiempo reduce calidad de tests',
        icon: 'trending_down',
        color: 'red'
      },
      {
        title: 'Tests Frágiles',
        description: 'Tests que fallan con cambios mínimos',
        icon: 'broken_image',
        color: 'yellow'
      }
    ]
  };

  testTypes = [
    {
      name: 'Tests Unitarios',
      icon: '🧪',
      description: 'Prueban unidades aisladas de código',
      scope: 'Service, Repository, Mappers, Validators',
      tools: 'JUnit 5, Mockito, AssertJ',
      coverage: '70-80%',
      speed: 'Muy rápidos (ms)',
      examples: [
        'ClienteService.crearCliente() con datos válidos',
        'ClienteService.crearCliente() con documento duplicado',
        'ValidadorDocumento.validar() con formatos incorrectos'
      ]
    },
    {
      name: 'Tests de Integración',
      icon: '🔗',
      description: 'Prueban interacción entre componentes',
      scope: 'Controller + Service + Repository + DB',
      tools: 'Spring Boot Test, Testcontainers, REST Assured',
      coverage: '15-20%',
      speed: 'Lentos (segundos)',
      examples: [
        'POST /api/clientes con BD real (Testcontainers)',
        'GET /api/clientes con paginación y filtros',
        'Transacciones rollback en caso de error'
      ]
    },
    {
      name: 'Tests E2E',
      icon: '🌐',
      description: 'Prueban flujos completos de usuario',
      scope: 'API completa + servicios externos mockeados',
      tools: 'MockMvc, WireMock, Spring Cloud Contract',
      coverage: '5-10%',
      speed: 'Muy lentos (segundos-minutos)',
      examples: [
        'Flujo completo: crear cliente → consultar Bureau → aprobar préstamo',
        'Integración con API externa (WireMock)',
        'Manejo de timeouts y circuit breaker'
      ]
    },
    {
      name: 'Tests de Performance',
      icon: '⚡',
      description: 'Prueban rendimiento bajo carga',
      scope: 'Endpoints críticos con carga concurrente',
      tools: 'JMeter, Gatling, Spring Boot Actuator',
      coverage: 'Endpoints críticos',
      speed: 'Muy lentos (minutos)',
      examples: [
        '1000 usuarios concurrentes en /api/clientes',
        'Tiempos de respuesta p95 < 200ms',
        'Detección de memory leaks bajo carga'
      ]
    }
  ];

  unitTestsPrompt = {
    title: 'Generar Tests Unitarios con IA',
    role: 'Actúa como ingeniero de QA especializado en testing automatizado con JUnit 5 y Mockito',
    context: [
      'Microservicio: Gestión de Clientes (Spring Boot 3.2)',
      'Clase a testear: ClienteService con lógica de negocio',
      'Framework: JUnit 5 + Mockito + AssertJ',
      'Objetivo: Cobertura >80% en métodos públicos'
    ],
    task: [
      '1. Analizar método crearCliente(ClienteRequestDTO dto) y generar tests para:',
      '   - Caso exitoso con datos válidos',
      '   - Cliente duplicado (documento ya existe)',
      '   - Datos inválidos (documento null, email incorrecto)',
      '   - Verificar llamadas a repository.save()',
      '2. Mock de dependencias (ClienteRepository, ValidadorService)',
      '3. Usar @InjectMocks, @Mock annotations',
      '4. Assertions con AssertJ para legibilidad',
      '5. Given-When-Then pattern para estructura'
    ],
    expectedOutput: [
      'Clase de test completa con @ExtendWith(MockitoExtension.class)',
      'Setup en @BeforeEach con mocks configurados',
      'Mínimo 5 tests cubriendo casos: exitoso, errores validación, duplicados',
      'Verificaciones con verify() de llamadas a mocks',
      'Tests independientes sin compartir estado'
    ]
  };

  integrationTestsPrompt = {
    title: 'Tests de Integración con Testcontainers',
    role: 'Actúa como arquitecto de testing especializado en tests de integración con Spring Boot',
    context: [
      'Microservicio: Spring Boot con JPA y PostgreSQL',
      'Herramienta: Testcontainers para BD real',
      'Objetivo: Validar interacción completa Controller → Service → Repository → DB'
    ],
    task: [
      '1. Configurar Testcontainers con PostgreSQL container',
      '2. Generar tests de integración para ClienteController:',
      '   - POST /api/clientes (crear cliente en BD real)',
      '   - GET /api/clientes/{id} (recuperar de BD)',
      '   - PUT /api/clientes/{id} (actualizar en BD)',
      '   - DELETE /api/clientes/{id} (soft delete)',
      '3. Usar @SpringBootTest con @AutoConfigureMockMvc',
      '4. MockMvc para simular requests HTTP',
      '5. Validar responses: status codes, JSON content, headers'
    ],
    expectedOutput: [
      'Clase con @SpringBootTest y @Testcontainers',
      'PostgreSQLContainer configurado como @Container',
      'Tests con MockMvc: perform(post/get/put/delete)',
      'Assertions de HTTP status, JSON paths con jsonPath()',
      'Limpieza de BD entre tests (@BeforeEach)'
    ]
  };

  challenge = {
    title: 'Reto: Suite Completa de Tests',
    description: 'Genera suite completa de tests para microservicio BureauCreditoService (Clase 4) con cobertura >80%',
    requirements: [
      'Tests unitarios: BureauCreditoService con mocks de WebClient y Cache',
      'Tests integración: Controller con Testcontainers',
      'Tests E2E: Flujo con API externa mockeada (WireMock)',
      'Tests resilencia: Circuit Breaker, Retry, Timeout',
      'Reporte de cobertura con JaCoCo (>80%)',
      'Tests pasan en CI/CD (GitHub Actions)'
    ],
    hints: [
      'Usa @MockBean para mockear WebClient en tests de integración',
      'WireMock: stubFor(get(...)) para mockear API externa',
      'Testcontainers con Redis para validar cache',
      'AssertJ para assertions fluidas: assertThat(score).isBetween(300, 850)',
      'Resilience4j: forzar fallos para probar Circuit Breaker'
    ],
    timeEstimate: '50 minutos',
    testStructure: {
      unitTests: [
        'BureauCreditoServiceTest (15 tests)',
        'HistorialCrediticioDTOTest (5 tests validaciones)',
        'BureauClientConfigTest (3 tests configuración)'
      ],
      integrationTests: [
        'BureauCreditoControllerIntegrationTest (8 tests)',
        'CacheIntegrationTest con Redis Testcontainer (4 tests)'
      ],
      e2eTests: [
        'BureauCreditoE2ETest con WireMock (6 tests)',
        'CircuitBreakerE2ETest (4 tests resilencia)'
      ]
    }
  };

  bestPractices = [
    {
      category: 'Nomenclatura',
      practices: [
        'Nombres descriptivos: testCrearClienteConDocumentoDuplicado_DeberiaLanzarException()',
        'Pattern Given-When-Then en comentarios o métodos',
        'Prefijo test o sufijo Test según convención del equipo'
      ]
    },
    {
      category: 'Independencia',
      practices: [
        'Cada test debe poder ejecutarse solo sin depender de otros',
        'No compartir estado entre tests (usar @BeforeEach para setup)',
        'Tests deben ser determinísticos (mismo resultado siempre)'
      ]
    },
    {
      category: 'Cobertura Inteligente',
      practices: [
        'Priorizar lógica de negocio crítica (80% cobertura)',
        'Casos edge: nulls, listas vacías, límites numéricos',
        'No testear getters/setters simples ni código framework',
        'Tests de regresión para bugs encontrados en producción'
      ]
    },
    {
      category: 'Performance de Tests',
      practices: [
        'Tests unitarios: <100ms cada uno',
        'Tests integración: <5 segundos',
        'Testcontainers: reutilizar containers con @Container (static)',
        'Paralelizar ejecución con @Execution(CONCURRENT)'
      ]
    },
    {
      category: 'Mantenibilidad',
      practices: [
        'Test data builders para crear objetos complejos',
        'Utility methods para assertions repetitivas',
        'Mocks mínimos: solo lo necesario para el test',
        'Documentar WHY, no WHAT (propósito del test)'
      ]
    }
  ];

  coverageTools = [
    {
      name: 'JaCoCo',
      description: 'Plugin Maven/Gradle para cobertura de código',
      features: ['Reporte HTML', 'Umbrales configurables', 'Integración CI/CD'],
      config: `<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <configuration>
    <rules>
      <rule>
        <element>PACKAGE</element>
        <limits>
          <limit>
            <counter>LINE</counter>
            <value>COVEREDRATIO</value>
            <minimum>0.80</minimum>
          </limit>
        </limits>
      </rule>
    </rules>
  </configuration>
</plugin>`
    },
    {
      name: 'SonarQube',
      description: 'Análisis estático + cobertura + code smells',
      features: ['Dashboard visual', 'Deuda técnica', 'Quality Gates'],
      config: 'Integración con JaCoCo, reportes centralizados'
    }
  ];

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
