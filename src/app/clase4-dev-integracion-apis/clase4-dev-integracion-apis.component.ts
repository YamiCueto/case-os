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
    { type: 'http-exchange-design' },
    { type: 'dto-mapping' },
    { type: 'error-handling' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  context = {
    scenario: 'El sistema COBIS y los módulos VB6/.NET hacen llamadas SOAP/XML a servicios financieros externos (bureaus, DANE, DIAN). El objetivo es migrar esas integraciones a clientes REST declarativos con @HttpExchange en Spring Boot 4.1.0, sin perder resiliencia ni trazabilidad.',
    legacySources: [
      { label: 'VB6', detail: 'WinInet + XMLHTTP — llamadas SOAP manuales con concatenación de XML' },
      { label: '.NET', detail: 'HttpClient + ServiceReference — proxies WSDL generados automáticamente' },
      { label: 'COBIS', detail: 'Llamadas internas por stored procedures y XML sobre TCP propietario' }
    ],
    requirements: [
      'Bureau Crediticio: REST/JSON, OAuth2, rate limit 100 req/min',
      'DIAN: SOAP legacy con certificado digital (migrar a REST wrapper interno)',
      'DANE: REST/JSON, sin auth, datos poblacionales para validación',
      'Criticidad: Alta — decisiones crediticias y de cumplimiento dependen de estas consultas'
    ],
    challenges: [
      {
        icon: '🔄',
        title: '@HttpExchange — Clientes Declarativos (Spring Boot 4.1)',
        description: 'Reemplaza WebClient/RestTemplate verbosos. Define la integración como una interfaz Java pura — Spring genera la implementación. Equivalente al ServiceReference de .NET pero sin WSDL.',
        color: 'blue'
      },
      {
        icon: '⚡',
        title: 'Virtual Threads (Java 21)',
        description: 'Habilitar con spring.threads.virtual.enabled=true en build.gradle. Elimina el modelo reactivo complejo: código bloqueante normal con concurrencia masiva. Ideal para migrar código .NET/VB6 secuencial.',
        color: 'green'
      },
      {
        icon: '🛡️',
        title: 'Resiliencia con Spring Boot 4.1',
        description: '@Retryable y @CircuitBreaker nativos en Spring Boot 4.1. Para casos avanzados: Resilience4j. El patrón reemplaza los try/catch anidados de VB6 y los Using blocks de .NET.',
        color: 'orange'
      },
      {
        icon: '📦',
        title: 'Java Records como DTOs',
        description: 'Java 21 records reemplazan las clases DTO con getters/setters. Equivalente a los Type/Struct de VB6 pero inmutables, con equals(), hashCode() y toString() automáticos.',
        color: 'purple'
      }
    ]
  };

  httpExchangeDesign = {
    title: 'Arquitectura con @HttpExchange',
    gradleSnippet: `// build.gradle (Kotlin DSL)
plugins {
    id("org.springframework.boot") version "4.1.0"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "2.1.0"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-aop")  // @Retryable
    implementation("org.springframework.retry:spring-retry")
    implementation("io.github.resilience4j:resilience4j-spring-boot3:2.2.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("com.github.tomakehurst:wiremock-standalone:3.5.4")
}`,
    components: [
      {
        name: '@HttpExchange Interface',
        purpose: 'Define el cliente como contrato Java — Spring genera la implementación',
        config: [
          'Anotaciones: @GetExchange, @PostExchange, @PutExchange',
          'Sin implementación manual — comparable a JpaRepository',
          'Equivalente al ServiceReference de .NET / proxy SOAP de VB6'
        ]
      },
      {
        name: 'HttpServiceProxyFactory',
        purpose: 'Fábrica que conecta la interfaz con RestClient o WebClient',
        config: [
          'Configurado en @Bean con timeout, base URL, OAuth2',
          'Un bean por API externa (Bureau, DIAN, DANE)',
          'Integración con Virtual Threads automática'
        ]
      },
      {
        name: '@Retryable + @CircuitBreaker',
        purpose: 'Resiliencia declarativa sobre los métodos de servicio',
        config: [
          '@Retryable(maxAttempts=3, backoff=@Backoff(delay=1000, multiplier=2))',
          '@CircuitBreaker(name="bureau", fallbackMethod="fallbackBureau")',
          'Sin código boilerplate — comparable al bloque On Error Retry de VB6'
        ]
      }
    ]
  };

  dtoMapping = {
    request: {
      name: 'BureauRequest (Java Record)',
      fields: [
        { name: 'documento', type: 'String', validation: '@NotBlank, @Pattern("^[0-9]{8,11}$")' },
        { name: 'tipoDocumento', type: 'TipoDocumento', validation: '@NotNull — enum CC, CE, NIT' },
        { name: 'tipoConsulta', type: 'TipoConsulta', validation: '@NotNull — enum BASICA, COMPLETA' }
      ]
    },
    response: {
      name: 'HistorialCrediticio (Java Record)',
      fields: [
        { name: 'score', type: 'Integer', description: 'Puntaje crediticio 300–850' },
        { name: 'estadoRiesgo', type: 'RiesgoEnum', description: 'BAJO, MEDIO, ALTO' },
        { name: 'deudas', type: 'List<Deuda>', description: 'Deudas activas (record anidado)' },
        { name: 'alertas', type: 'List<String>', description: 'Alertas de riesgo' },
        { name: 'fechaConsulta', type: 'Instant', description: 'Timestamp ISO-8601 — reemplaza Date de VB6' }
      ]
    },
    javaRecordExample: `// Antes: clase VB6 Type / .NET POCO con setters
// Después: Java 21 Record — inmutable, compacto

public record BureauRequest(
    @NotBlank @Pattern(regexp = "^[0-9]{8,11}$")
    String documento,

    @NotNull TipoDocumento tipoDocumento,
    @NotNull TipoConsulta tipoConsulta
) {}

public record HistorialCrediticio(
    Integer score,
    RiesgoEnum estadoRiesgo,
    List<Deuda> deudas,
    List<String> alertas,
    Instant fechaConsulta
) {
    // Lógica de dominio dentro del record
    public boolean esRiesgoBajo() {
        return estadoRiesgo == RiesgoEnum.BAJO && score >= 650;
    }
}`
  };

  errorHandling = {
    strategies: [
      {
        name: '@Retryable con Backoff Exponencial',
        description: 'Reintentar peticiones fallidas — declarativo, sin try/catch manual',
        implementation: '3 reintentos: 1s → 2s → 4s (multiplier=2). Equivale al loop de reintentos manual de VB6.',
        exceptions: ['TimeoutException', 'ConnectException', 'HttpServerErrorException']
      },
      {
        name: '@CircuitBreaker (Resilience4j)',
        description: 'Cortar peticiones cuando la API externa falla repetidamente',
        implementation: 'Abre tras 50% fallos en ventana de 10 peticiones. Half-open: 30 seg.',
        exceptions: ['BureauNoDisponibleException']
      },
      {
        name: 'Fallback Method',
        description: 'Respuesta degradada cuando el circuit está abierto',
        implementation: 'Score=0, estadoRiesgo=DESCONOCIDO, alerta="Servicio temporalmente no disponible"',
        exceptions: ['CallNotPermittedException']
      },
      {
        name: 'Timeout con RestClient',
        description: 'Cancelar peticiones lentas antes del timeout del cliente COBIS/VB6',
        implementation: 'connectTimeout=3s, readTimeout=5s configurado en HttpServiceProxyFactory',
        exceptions: ['ResourceAccessException']
      }
    ]
  };

  promptStructure = {
    role: 'Actúa como arquitecto Java 21 + Spring Boot 4.1.0 especialista en migración de integraciones COBIS/VB6 a clientes REST declarativos con @HttpExchange',
    context: [
      'Sistema origen: COBIS con llamadas SOAP/XML al bureau de crédito vía stored procedures',
      'Sistema destino: Spring Boot 4.1.0 + Gradle + Java 21 con Virtual Threads habilitados',
      'API externa: Bureau REST/JSON, OAuth2 client_credentials, rate limit 100 req/min, timeout 5s',
      'Criticidad: Alta — decisión crediticia depende de la consulta'
    ],
    task: [
      '1. Interfaz @HttpExchange BureauClient con métodos: consultarHistorial(@RequestBody BureauRequest)',
      '2. Records Java 21: BureauRequest (documento, tipoDocumento, tipoConsulta) y HistorialCrediticio (score, deudas, estadoRiesgo, alertas, fechaConsulta)',
      '3. @Bean HttpServiceProxyFactory con RestClient configurado (OAuth2, timeout 5s, base URL desde application.yml)',
      '4. BureauService con @Retryable(3 intentos, backoff exponencial) y @CircuitBreaker con fallback',
      '5. application.yml con todas las configuraciones externalizadas (spring.threads.virtual.enabled=true)',
      '6. Tests con WireMock: respuesta exitosa, timeout, API caída, circuit breaker activado'
    ],
    restrictions: [
      'Java 21 LTS, Spring Boot 4.1.0, Gradle 8.x (Kotlin DSL), sin Maven',
      'DTOs como records inmutables — sin Lombok, sin setters',
      'No exponer datos sensibles en logs (enmascarar documento en trazas)',
      'Virtual Threads habilitados — código bloqueante normal, sin WebFlux/Reactor'
    ],
    expectedOutput: 'Código completo compilable + build.gradle + application.yml + tests WireMock'
  };

  challenge = {
    title: 'Reto: Migrar Llamada COBIS/VB6 → @HttpExchange',
    description: 'Tienes un módulo VB6 que consulta el bureau de crédito vía SOAP y un procedimiento COBIS que hace lo mismo vía XML. Migra ambas integraciones a un único cliente @HttpExchange en Spring Boot 4.1.0.',
    legacyVb6Code: `' VB6: Consulta SOAP manual al bureau
Public Function ConsultarBureau(numDoc As String) As String
    Dim objHttp As Object
    Dim sXml As String

    Set objHttp = CreateObject("Microsoft.XMLHTTP")

    ' XML SOAP armado a mano (sin sanitización — SQL injection risk)
    sXml = "<soap:Envelope>" & _
           "<soap:Body>" & _
           "<ConsultarHistorial>" & _
           "<Documento>" & numDoc & "</Documento>" & _
           "</ConsultarHistorial>" & _
           "</soap:Body>" & _
           "</soap:Envelope>"

    objHttp.Open "POST", "http://bureau.interna/ws/historial", False
    objHttp.setRequestHeader "Content-Type", "text/xml"
    objHttp.send sXml

    ' Sin manejo de timeout, sin retry, sin circuit breaker
    ConsultarBureau = objHttp.responseText
End Function`,
    requirements: [
      'Interfaz @HttpExchange BureauClient con @PostExchange("/historial")',
      'Records: BureauRequest y HistorialCrediticio con todos sus campos',
      '@Bean RestClient configurado con timeout 5s y Bearer token OAuth2',
      'BureauService con @Retryable(3) y @CircuitBreaker + fallback',
      'application.yml: bureau.base-url, bureau.oauth2.token-url, bureau.oauth2.client-secret',
      'Test WireMock: respuesta exitosa, timeout (delay 6s), error 500, circuit abierto',
      'Comparativa comentada: qué problema resuelve cada parte vs el código VB6'
    ],
    hints: [
      'Usa HttpServiceProxyFactory.builderFor(restClient).build() para crear el proxy',
      'El @Bean RestClient va en @Configuration — no en el Service',
      'Para OAuth2: OAuth2ClientHttpRequestInterceptor de Spring Security',
      'WireMock: stubFor(post(urlEqualTo("/historial")).withRequestBody(matchingJsonPath("$.documento")))',
      'Virtual Threads: spring.threads.virtual.enabled=true en application.yml — nada más'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Gradle & Estructura',
      practices: [
        'Kotlin DSL (build.gradle.kts) — type-safe, autocompletado en IDE',
        'Módulo :integrations separado para todos los clientes externos (BureauClient, DianClient, DaneClient)',
        'Versiones en gradle/libs.versions.toml (Version Catalog) — un solo lugar para actualizar'
      ]
    },
    {
      category: '@HttpExchange vs Legacy',
      practices: [
        'Una interfaz por API externa — no mezclar clientes en una sola clase',
        'Registrar el @Bean del proxy en @Configuration, no en el @Service',
        'Anotar con @Retryable en el Service, no en la interfaz @HttpExchange'
      ]
    },
    {
      category: 'Java Records (DTOs)',
      practices: [
        'Records para DTOs de entrada/salida — inmutables por diseño',
        'Lógica de dominio simple (isRiesgoBajo()) como métodos dentro del record',
        'Para mapeos complejos: método estático Record.from(OtraClase) — sin MapStruct'
      ]
    },
    {
      category: 'Seguridad',
      practices: [
        'Credenciales OAuth2 en variables de entorno, nunca en build.gradle ni application.yml',
        'Enmascarar número de documento en logs: mostrar solo últimos 4 dígitos',
        'Validar response con Bean Validation antes de procesar — no confiar en APIs externas'
      ]
    },
    {
      category: 'Testing con WireMock',
      practices: [
        '@WireMockTest en tests de integración — levanta servidor mock automáticamente',
        'Simular todos los casos: éxito, timeout, 4xx, 5xx, circuit breaker',
        'Verificar que los logs de auditoría se generan (capturar con @Spy en Logger)'
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
