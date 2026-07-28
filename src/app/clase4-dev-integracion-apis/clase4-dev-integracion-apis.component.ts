import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  type: string;
}

@Component({
  selector: 'app-clase4-dev-integracion-apis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase4-dev-integracion-apis.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase4-dev-integracion-apis.component.css'
  ]
})
export class Clase4DevIntegracionApisComponent {
  currentSlide = 0;

  slides: Slide[] = [
    { type: 'title' },
    { type: 'context' },
    { type: 'api-design' },
    { type: 'dto-mapping' },
    { type: 'error-handling' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  context = {
    scenario: 'Integrar microservicio con API externa de Bureau de Crédito para evaluación crediticia',
    requirements: [
      'API REST JSON con autenticación OAuth2',
      'Rate limit: 100 peticiones/minuto',
      'SLA: 95% disponibilidad, timeout 5 segundos',
      'Criticidad: Alta - decisión crediticia depende de esta consulta'
    ],
    challenges: [
      {
        title: 'Alta Disponibilidad',
        description: 'API externa puede fallar, necesitamos resilencia',
        icon: 'shield'
      },
      {
        title: 'Performance',
        description: 'Reducir latencia con caché inteligente',
        icon: 'speed'
      },
      {
        title: 'Rate Limiting',
        description: 'Respetar límites de tasa de la API',
        icon: 'timeline'
      },
      {
        title: 'Auditoría',
        description: 'Registrar todas las consultas para compliance',
        icon: 'description'
      }
    ]
  };

  apiDesign = {
    title: 'Diseño del Cliente REST',
    components: [
      {
        name: 'WebClient',
        purpose: 'Cliente HTTP reactivo no bloqueante',
        config: ['Base URL configurable', 'Timeout 5 segundos', 'Retry 3 intentos con backoff exponencial']
      },
      {
        name: 'Circuit Breaker',
        purpose: 'Protección ante fallos en cascada',
        config: ['Resilience4j', 'Umbral: 50% fallos en 10 requests', 'Half-open: 30 segundos']
      },
      {
        name: 'Cache Layer',
        purpose: 'Reducir llamadas redundantes',
        config: ['Redis/Caffeine', 'TTL: 1 hora', 'Invalidación por documento']
      }
    ]
  };

  dtoMapping = {
    request: {
      name: 'BureauRequestDTO',
      fields: [
        { name: 'documento', type: 'String', validation: '@NotBlank, @Pattern(regexp="^[0-9]{8,11}$")' },
        { name: 'tipoDocumento', type: 'TipoDocumentoEnum', validation: '@NotNull' },
        { name: 'tipoConsulta', type: 'String', validation: '@NotBlank (valores: BASICA, COMPLETA)' }
      ]
    },
    response: {
      name: 'HistorialCrediticioDTO',
      fields: [
        { name: 'score', type: 'Integer', description: 'Puntaje crediticio 300-850' },
        { name: 'estadoRiesgo', type: 'String', description: 'BAJO, MEDIO, ALTO' },
        { name: 'deudas', type: 'List<DeudaDTO>', description: 'Lista de deudas activas' },
        { name: 'alertas', type: 'List<String>', description: 'Alertas de riesgo' },
        { name: 'fechaConsulta', type: 'LocalDateTime', description: 'Timestamp de consulta' }
      ]
    }
  };

  errorHandling = {
    strategies: [
      {
        name: 'Retry con Backoff Exponencial',
        description: 'Reintentar peticiones fallidas con espera creciente',
        implementation: '3 reintentos: 1s, 2s, 4s',
        exceptions: ['TimeoutException', 'ConnectException']
      },
      {
        name: 'Circuit Breaker',
        description: 'Cortar peticiones cuando API está caída',
        implementation: 'Open después de 50% fallos en 10 peticiones',
        exceptions: ['BureauServiceUnavailableException']
      },
      {
        name: 'Fallback Response',
        description: 'Respuesta por defecto cuando Circuit está Open',
        implementation: 'Score 0, estadoRiesgo: DESCONOCIDO, alerta: "Servicio temporalmente no disponible"',
        exceptions: ['CallNotPermittedException']
      },
      {
        name: 'Timeout Management',
        description: 'Cancelar peticiones lentas automáticamente',
        implementation: 'Timeout global: 5 segundos',
        exceptions: ['TimeoutException']
      }
    ]
  };

  promptStructure = {
    role: 'Actúa como arquitecto de integraciones especializado en APIs REST resilientes',
    context: [
      'Sistema: Consulta Bureau de Crédito para evaluación de préstamos',
      'API Externa: REST JSON, autenticación OAuth2, rate limit 100 req/min',
      'SLA: 95% disponibilidad, timeout 5 segundos',
      'Criticidad: Alta - decisión crediticia depende de esta consulta'
    ],
    task: [
      '1. Configuración WebClient con timeout 5s, retry 3 intentos backoff exponencial, circuit breaker Resilience4j (50% fallos en 10 req)',
      '2. Service BureauCreditoService con método consultarHistorial(String documento): HistorialCrediticioDTO',
      '3. DTOs: BureauRequestDTO (documento, tipoConsulta) y HistorialCrediticioDTO (score, deudas, estadoRiesgo, alertas)',
      '4. Manejo excepciones: BureauServiceUnavailableException, BureauTimeoutException, InvalidDocumentException',
      '5. Cache con Redis (TTL 1 hora) y logs de auditoría (request/response)',
      '6. Tests con WireMock: respuesta exitosa, API caída, timeout, cache funcional'
    ],
    restrictions: [
      'No exponer datos sensibles en logs',
      'Métricas con Micrometer/Prometheus',
      'Health check para monitoreo'
    ],
    expectedOutput: 'Código completo + application.yml con configuraciones + tests WireMock'
  };

  challenge = {
    title: 'Reto: Cliente Bureau de Crédito Robusto',
    description: 'Implementa un cliente Spring Boot completo para integración con API externa de Bureau de Crédito',
    requirements: [
      'WebClient configurado con timeout 5s y retry 3 intentos',
      'Circuit Breaker con Resilience4j (umbral 50% fallos)',
      'Cache con Redis/Caffeine (TTL 1 hora)',
      'DTOs con validaciones completas',
      'Manejo de excepciones personalizado',
      'Tests con WireMock simulando API externa',
      'Logs de auditoría (NO exponer datos sensibles)',
      'Métricas con Micrometer'
    ],
    hints: [
      'Usa @Retry, @CircuitBreaker, @Cacheable annotations',
      'Configura WebClient.Builder bean en @Configuration',
      'WireMock: stubFor(get(urlEqualTo("/api/bureau/...")).willReturn(...))',
      'Métricas custom: MeterRegistry para contar consultas exitosas/fallidas'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Configuración',
      practices: [
        'Externalizar URLs, timeouts, retry policies en application.yml',
        'Usar Spring Cloud Config para ambientes (dev, qa, prod)',
        'Implementar Health Indicators personalizados (BureauHealthIndicator)'
      ]
    },
    {
      category: 'Seguridad',
      practices: [
        'Autenticación OAuth2: usar RestTemplate/WebClient con OAuth2 interceptor',
        'NO loguear tokens, documentos completos o datos sensibles',
        'Encriptar credenciales en application.yml con Jasypt'
      ]
    },
    {
      category: 'Performance',
      practices: [
        'Cache en dos niveles: L1 (Caffeine) + L2 (Redis)',
        'TTL diferenciado: cache corto (5 min) para consultas repetidas, largo (1 hora) para historiales',
        'Métricas: latencia p50, p95, p99 de llamadas externas'
      ]
    },
    {
      category: 'Resilencia',
      practices: [
        'Fallback response con datos mock cuando Circuit está Open',
        'Rate Limiting local antes de llamar API externa (Bucket4j)',
        'Monitoring: alertas cuando Circuit Breaker se abre'
      ]
    },
    {
      category: 'Testing',
      practices: [
        'WireMock para simular API externa en tests de integración',
        'Tests de resilencia: forzar timeouts, fallos, rate limits',
        'Contract Testing con Spring Cloud Contract si tienes acceso a contrato de API'
      ]
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
