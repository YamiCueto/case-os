# IA Generativa para Desarrolladores Full Stack

**Plan de Capacitación DEV - 1 Mes (20 días hábiles)**

---

**Enfoque:** De Usuario Casual a Prompt Engineer Profesional (Stack Completo)  
**Duración:** 1 hora diaria  
**Modalidad:** Teórico-Práctica  
**Stack Tecnológico:** Java + Spring Boot | Angular | Python | Node.js | AWS  
**Dirigido a:** Equipo de Desarrollo del Proyecto BancoFiel

---

## 🎯 Objetivo del Curso

Capacitar al equipo de desarrollo en el uso profesional de IA Generativa para:
- **Acelerar desarrollo** sin sacrificar calidad
- **Modernizar código legacy** (VB6 → Spring Boot/Angular)
- **Automatizar tareas repetitivas** (CRUD, validaciones, tests)
- **Mejorar arquitectura** con asistencia de IA
- **Documentar eficientemente** código y decisiones técnicas

---

## ⚠️ IMPORTANTE: Prompt Engineering para Developers

### El Mito del "ChatGPT hace todo el código"

| Developer Casual ❌ | Prompt Engineer Profesional ✅ |
|---------------------|-------------------------------|
| **Prompt genérico:**<br>"Hazme un microservicio en Java" | **Prompt estructurado:**<br>"Actúa como arquitecto Java. Spring Boot 3.2, Java 17. Microservicio REST de Gestión de Préstamos para banca. Incluye: Controller con validaciones JSR-380, Service con lógica negocio, Repository JPA, DTOs con MapStruct, manejo excepciones global, logs SLF4J, tests con JUnit 5 + Mockito. Arquitectura hexagonal." |
| Acepta código sin revisar | Valida arquitectura, patrones, seguridad |
| No considera contexto del proyecto | Especifica versiones, dependencias, estándares del equipo |
| Copia/pega sin entender | Analiza, adapta y mejora el código generado |

> **⚡ CLAVE:** La IA multiplica tu productividad cuando le das contexto preciso del stack, arquitectura y restricciones del proyecto.

---

## 🏗️ Contexto del Proyecto MyLegacyApp - BancoFiel

### Stack Tecnológico Actual:
- **Backend:** Java 11/17, Spring Boot 2.7/3.x, Spring Data JPA, Spring Security
- **Frontend:** Angular 14+, TypeScript, RxJS, Angular Material
- **Base de Datos:** Oracle 19c, SQL Server
- **Cloud:** AWS (EC2, S3, RDS, Lambda, API Gateway, CloudWatch)
- **Legacy:** VB6 (en proceso de migración)
- **Herramientas:** Maven, Git, Jenkins, SonarQube, Postman

### Desafíos Principales:
1. Migración de módulos VB6 legacy a arquitectura moderna
2. Integración con sistemas externos (Bureau de Crédito, Core Bancario)
3. Alta criticidad (sistema financiero regulado)
4. Necesidad de tests exhaustivos y documentación
5. Más de 500,000 usuarios activos

---

## 📚 Plan de Estudios - 12 Clases Prácticas

### ✅ Módulo 1: Fundamentos (COMPLETADO - Clase 1)

**Clase 1: Fundamentos de IA Generativa para Developers** ✅
- ✅ Diferencias IA, ML, GenIA y aplicaciones en desarrollo
- ✅ LLMs: tokens, contexto, temperatura, modelos especializados en código
- ✅ Herramientas: ChatGPT, Claude, GitHub Copilot, Cursor, Amazon CodeWhisperer
- ✅ Limitaciones: alucinaciones, seguridad, propiedad intelectual
- ✅ Ejercicio práctico: Análisis de módulo legacy para migración

---

### 🔥 Módulo 2: Backend Development con IA (4 sesiones)

**Clase 2: Taller - Generación de Microservicio Spring Boot Completo**

**Reto:** Crear microservicio de Gestión de Clientes desde cero

**Práctica:**
1. Analizar requerimientos de negocio (HU de gestión de clientes bancarios)
2. Estructurar prompt para arquitectura completa
3. Generar:
   - Entidades JPA con relaciones
   - DTOs con validaciones Bean Validation
   - Repository con consultas personalizadas
   - Service con lógica de negocio
   - Controller REST con OpenAPI/Swagger
   - Manejo de excepciones global
   - Configuración de seguridad básica
   - Tests unitarios (JUnit 5 + Mockito)

**Stack:** Java 17, Spring Boot 3.2, Spring Data JPA, Lombok, MapStruct

**Entregable:** Microservicio funcional con Swagger, listo para deploy

**Prompt Base:**
```
[ROL] Actúa como arquitecto de software senior especializado en Spring Boot

[CONTEXTO]
- Proyecto: Sistema bancario MyLegacyApp - BancoFiel
- Stack: Java 17, Spring Boot 3.2.x, Spring Data JPA, Oracle 19c
- Arquitectura: Microservicios con arquitectura hexagonal
- Estándares: Lombok, MapStruct, validaciones JSR-380
- Seguridad: Spring Security con JWT

[TAREA]
Genera microservicio completo de Gestión de Clientes incluyendo:
1. Entidad Cliente con campos: id, tipoDocumento, numeroDocumento, nombres, apellidos, email, telefono, fechaNacimiento, direccion, ciudadId, estadoCivil, ocupacion, ingresos, activo, fechaCreacion, fechaActualizacion
2. DTOs: ClienteRequestDTO, ClienteResponseDTO con validaciones
3. Mapper con MapStruct
4. Repository con consultas: findByNumeroDocumento, findByEmailContaining, findActivosByIngresos
5. Service con validaciones de negocio: cliente único por documento, validar mayoría de edad
6. Controller REST con endpoints CRUD + búsquedas
7. Manejo excepciones global con @ControllerAdvice
8. Tests unitarios con cobertura >80%

[RESTRICCIONES]
- Usar Lombok para reducir boilerplate
- Documentar con JavaDoc métodos públicos
- Logs con SLF4J en operaciones críticas
- Respuestas HTTP estandarizadas

[FORMATO]
Código completo con estructura de paquetes + application.yml + tests
```

**Tiempo:** 10 min intro + 50 min hands-on

---

**Clase 3: Taller - Migración Legacy VB6 a Spring Boot**

**Reto:** Analizar módulo VB6 existente y migrar a Spring Boot moderno

**Práctica:**
1. Analizar código VB6 legacy (formulario de consulta de clientes)
2. Identificar lógica de negocio, validaciones, consultas DB
3. Generar prompt para migración estructurada
4. Migrar a Spring Boot manteniendo funcionalidad equivalente
5. Mejorar con arquitectura moderna (DTO, Service, Repository)
6. Agregar tests que validen equivalencia funcional

**Casos de Migración:**
- Consultas SQL nativas → JPA Criteria/JPQL
- Validaciones en formulario → Bean Validation
- Lógica en UI → Service layer
- Conexiones DB directas → Spring Data Repository

**Stack:** Spring Boot 3.2, JPA, Thymeleaf (opcional para vistas)

**Entregable:** Módulo migrado + documento de equivalencias funcionales

**Prompt Base:**
```
[ROL] Actúa como especialista en migración de sistemas legacy a arquitecturas modernas

[CONTEXTO]
- Origen: VB6 con consultas SQL nativas a Oracle
- Destino: Spring Boot 3.2 + JPA + arquitectura en capas
- Criticidad: Sistema bancario en producción
- Restricción: mantener funcionalidad equivalente 100%

[TAREA]
Analizar este código VB6 y generar equivalente en Spring Boot:

[CÓDIGO VB6]
Private Sub btnConsultar_Click()
    Dim rs As ADODB.Recordset
    Dim sql As String
    
    If Len(txtDocumento.Text) = 0 Then
        MsgBox "Ingrese número de documento", vbExclamation
        Exit Sub
    End If
    
    sql = "SELECT * FROM CLIENTES WHERE NUM_DOCUMENTO = '" & txtDocumento.Text & "' AND ACTIVO = 'S'"
    
    Set rs = conn.Execute(sql)
    
    If Not rs.EOF Then
        txtNombres.Text = rs("NOMBRES")
        txtApellidos.Text = rs("APELLIDOS")
        txtEmail.Text = rs("EMAIL")
        lblEstado.Caption = "Cliente Activo"
    Else
        MsgBox "Cliente no encontrado", vbInformation
    End If
End Sub

[OUTPUT ESPERADO]
1. Controller REST con endpoint GET /api/clientes/consultar/{documento}
2. Service con validaciones de negocio
3. Repository JPA type-safe
4. DTOs con validaciones
5. Manejo de excepciones (ClienteNoEncontradoException)
6. Tests unitarios que validen casos: cliente existe, no existe, documento vacío

[FORMATO]
Código Spring Boot completo + explicación de cambios arquitectónicos
```

**Tiempo:** 15 min análisis legacy + 45 min migración

---

**Clase 4: Taller - Integración con APIs Externas (Bureau de Crédito)**

**Reto:** Integrar microservicio con API externa simulando Bureau de Crédito

**Práctica:**
1. Diseñar cliente REST con RestTemplate/WebClient
2. Implementar circuit breaker con Resilience4j
3. Manejo de timeouts y retry policies
4. Caché de respuestas con Spring Cache
5. Logs de auditoría de consultas externas
6. Tests con WireMock para simular API externa

**Stack:** Spring Boot, WebClient, Resilience4j, Redis/Caffeine Cache

**Entregable:** Cliente robusto con manejo de fallos y caché

**Prompt Base:**
```
[ROL] Actúa como arquitecto de integraciones especializado en APIs REST

[CONTEXTO]
- Sistema: Consulta Bureau de Crédito para evaluación de préstamos
- API Externa: REST JSON, autenticación OAuth2, rate limit 100 req/min
- SLA: 95% disponibilidad, timeout 5 segundos
- Criticidad: Alta - decisión crediticia depende de esta consulta

[TAREA]
Genera cliente Spring Boot para integración con Bureau de Crédito:

1. Configuración WebClient con:
   - Base URL configurable
   - Timeout 5 segundos
   - Retry 3 intentos con backoff exponencial
   - Circuit breaker con Resilience4j (umbral 50% fallos en 10 req)

2. Service BureauCreditoService con métodos:
   - consultarHistorial(String documento): HistorialCrediticioDTO
   - Validar documento antes de llamar API
   - Cache con Redis (TTL 1 hora)
   - Logs de auditoría (request/response)

3. DTOs:
   - BureauRequestDTO (documento, tipoConsulta)
   - HistorialCrediticioDTO (score, deudas, estadoRiesgo, alertas)

4. Manejo excepciones:
   - BureauServiceUnavailableException (API caída)
   - BureauTimeoutException (timeout)
   - InvalidDocumentException (documento inválido)

5. Tests con WireMock:
   - Respuesta exitosa
   - API caída (circuit breaker actúa)
   - Timeout (retry funciona)
   - Cache funcional

[RESTRICCIONES]
- No exponer datos sensibles en logs
- Métricas con Micrometer/Prometheus
- Health check para monitoreo

[FORMATO]
Código completo + application.yml con configuraciones
```

**Tiempo:** 10 min teoría + 50 min implementación

---

**Clase 5: Taller - Testing Avanzado con IA**

**Reto:** Suite completa de tests para microservicio existente

**Práctica:**
1. Analizar código de microservicio (Clases 2-4)
2. Generar tests unitarios con alta cobertura
3. Tests de integración con Testcontainers (Oracle/PostgreSQL)
4. Tests de contrato con Spring Cloud Contract
5. Performance tests con JMeter/Gatling (generados con IA)
6. Análisis de cobertura con JaCoCo

**Tipos de Tests:**
- Unitarios: Service, Repository, Mappers
- Integración: Controller + Service + DB real
- E2E: Flujo completo con APIs externas mockeadas
- Performance: carga concurrente, tiempos de respuesta

**Stack:** JUnit 5, Mockito, Testcontainers, Spring Cloud Contract, JaCoCo

**Entregable:** Suite completa de tests + reporte de cobertura >80%

**Tiempo:** 10 min teoría + 50 min generación de tests

---

### 💻 Módulo 3: Frontend Development con IA (4 sesiones)

**Clase 6: Taller - Generación de Módulo Angular Completo**

**Reto:** Módulo de Gestión de Clientes en Angular consumiendo API de Clase 2

**Práctica:**
1. Estructura de módulo con lazy loading
2. Componentes: lista, formulario (crear/editar), detalle
3. Servicios con HttpClient + interceptores
4. Formularios reactivos con validaciones
5. Manejo de estado con RxJS (sin NgRx inicialmente)
6. Estilos con Angular Material
7. Tests unitarios con Jasmine/Karma

**Stack:** Angular 16+, TypeScript, RxJS, Angular Material, HttpClient

**Entregable:** Módulo funcional CRUD con UI profesional

**Prompt Base:**
```
[ROL] Actúa como desarrollador Angular senior especializado en aplicaciones empresariales

[CONTEXTO]
- Proyecto: Frontend sistema bancario MyLegacyApp
- Stack: Angular 16, TypeScript, RxJS, Angular Material
- API Backend: Spring Boot REST (endpoints de Clase 2)
- Estándares: Reactive Forms, lazy loading, standalone components opcional

[TAREA]
Genera módulo Angular de Gestión de Clientes con:

1. Estructura de archivos:
   - clientes.module.ts (con routing)
   - clientes-lista.component (tabla con paginación, filtros, búsqueda)
   - clientes-form.component (crear/editar con validaciones)
   - clientes-detalle.component (vista solo lectura)
   - clientes.service.ts (CRUD con HttpClient)

2. ClientesService con métodos:
   - getClientes(page, size, filtros): Observable<Page<Cliente>>
   - getClienteById(id): Observable<Cliente>
   - createCliente(cliente): Observable<Cliente>
   - updateCliente(id, cliente): Observable<Cliente>
   - deleteCliente(id): Observable<void>
   - buscarPorDocumento(documento): Observable<Cliente>

3. ClientesFormComponent:
   - Reactive Form con validaciones:
     * Documento: required, pattern (solo números)
     * Email: required, email
     * Teléfono: required, pattern
     * Ingresos: required, min(0)
   - Modo crear/editar dinámico
   - Manejo de errores de API

4. ClientesListaComponent:
   - Tabla Angular Material con MatSort, MatPaginator
   - Búsqueda por documento/nombre
   - Filtros: estado (activo/inactivo), rango de ingresos
   - Acciones: ver, editar, eliminar (con confirmación)

5. Interceptores:
   - AuthInterceptor (agregar JWT token)
   - ErrorInterceptor (manejo global de errores HTTP)
   - LoadingInterceptor (spinner global)

6. Tests unitarios:
   - ClientesService con HttpClientTestingModule
   - Componentes con ComponentFixture
   - Validaciones de formularios

[RESTRICCIONES]
- Tipado estricto TypeScript
- Manejo de Observables con async pipe
- Unsubscribe automático (takeUntil pattern)
- Mensajes de error/éxito con MatSnackBar
- Responsive design

[FORMATO]
Código completo con estructura de carpetas + estilos SCSS
```

**Tiempo:** 10 min intro + 50 min desarrollo

---

**Clase 7: Taller - Modernización de Frontend Legacy**

**Reto:** Refactorizar componente Angular antiguo a mejores prácticas

**Práctica:**
1. Analizar código Angular legacy (versión 8-10, sin buenas prácticas)
2. Identificar problemas: memory leaks, falta de tipado, lógica en template
3. Refactorizar a Angular moderno con:
   - OnPush change detection
   - Standalone components (opcional)
   - Smart/Dumb components pattern
   - RxJS operators correctos
   - Signals (Angular 16+)

**Casos de Refactoring:**
- Subscriptions sin unsubscribe → takeUntil/async pipe
- Lógica compleja en template → métodos/pipes
- Estado local desorganizado → BehaviorSubject/Signals
- Componente monolítico → separar en componentes más pequeños

**Stack:** Angular 16+, TypeScript, RxJS

**Entregable:** Componente refactorizado + documento de mejoras

**Prompt Base:**
```
[ROL] Actúa como experto en refactoring de aplicaciones Angular

[CONTEXTO]
- Código legacy: Angular 10, mala gestión de subscripciones, lógica en template
- Objetivo: Angular 16 con mejores prácticas, OnPush, Signals

[TAREA]
Refactorizar este componente legacy:

[CÓDIGO LEGACY]
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  loading = false;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loading = true;
    this.http.get('http://localhost:8080/api/clientes').subscribe(
      (data: any) => {
        this.clientes = data;
        this.loading = false;
      },
      error => {
        alert('Error al cargar clientes');
        this.loading = false;
      }
    );
  }
  
  eliminar(id: number) {
    if(confirm('¿Eliminar cliente?')) {
      this.http.delete(`http://localhost:8080/api/clientes/${id}`).subscribe(
        () => {
          this.clientes = this.clientes.filter(c => c.id !== id);
          alert('Cliente eliminado');
        }
      );
    }
  }
}

[OUTPUT ESPERADO]
1. Componente con OnPush change detection
2. Servicio tipado con interfaces
3. Manejo de estado con Signals o BehaviorSubject
4. Operadores RxJS correctos (catchError, finalize)
5. Smart/Dumb separation si aplica
6. Tests unitarios

[FORMATO]
Código refactorizado + explicación de mejoras + tests
```

**Tiempo:** 15 min análisis + 45 min refactoring

---

**Clase 8: Taller - Estado Complejo con RxJS Avanzado**

**Reto:** Implementar flujo reactivo complejo con múltiples observables

**Práctica:**
1. Escenario: formulario de solicitud de préstamo con validaciones asíncronas
2. Consultar múltiples APIs en paralelo (cliente, Bureau, scoring)
3. Combinar resultados con RxJS operators (forkJoin, combineLatest, switchMap)
4. Implementar búsqueda con debounce y cancelación
5. Manejo de loading states por operación
6. Error handling granular

**Operadores clave:** switchMap, mergeMap, forkJoin, combineLatest, debounceTime, distinctUntilChanged, catchError

**Stack:** Angular, RxJS

**Entregable:** Componente con flujos reactivos complejos funcionando

**Tiempo:** 10 min teoría RxJS + 50 min implementación

---

**Clase 9: Taller - Testing E2E con Cypress + IA**

**Reto:** Suite de tests E2E para flujo completo de gestión de clientes

**Práctica:**
1. Configurar Cypress en proyecto Angular
2. Generar tests E2E con IA para:
   - Login y autenticación
   - Crear cliente nuevo (path feliz)
   - Validaciones de formulario (casos error)
   - Editar cliente existente
   - Eliminar cliente con confirmación
   - Búsqueda y filtros
3. Page Object Model para reutilización
4. Custom commands para acciones comunes
5. Integración con CI/CD (GitHub Actions)

**Stack:** Cypress, TypeScript

**Entregable:** Suite completa de tests E2E ejecutándose

**Tiempo:** 10 min setup + 50 min generación de tests

---

### ☁️ Módulo 4: Backend Alternativo - Python/Node.js + AWS (3 sesiones)

**Clase 10: Taller - Microservicio Python con FastAPI**

**Reto:** API REST rápida con Python para procesamiento de datos

**Práctica:**
1. Generar API FastAPI desde cero
2. Endpoints CRUD con Pydantic models
3. Async/await para operaciones I/O
4. Integración con base de datos (SQLAlchemy o MongoDB)
5. Documentación automática con Swagger
6. Tests con pytest

**Caso de uso:** API de procesamiento de scoring crediticio (cálculos intensivos)

**Stack:** Python 3.11, FastAPI, Pydantic, SQLAlchemy, pytest

**Entregable:** API funcional con documentación y tests

**Prompt Base:**
```
[ROL] Actúa como desarrollador Python senior especializado en APIs REST

[CONTEXTO]
- Stack: Python 3.11, FastAPI, Pydantic, SQLAlchemy, PostgreSQL
- Caso de uso: API de scoring crediticio para evaluación de préstamos
- Requerimientos: async, alta performance, documentación automática

[TAREA]
Genera API FastAPI de Scoring Crediticio con:

1. Models Pydantic:
   - SolicitudPrestamoInput (ingresos, deudas, historial, monto)
   - ScoringResultOutput (score, nivel_riesgo, monto_aprobado, observaciones)

2. Endpoints:
   - POST /api/scoring/calcular: calcular score
   - GET /api/scoring/{solicitud_id}: consultar resultado
   - GET /api/scoring/historial/{cliente_id}: historial de scorings

3. Lógica de negocio en service layer:
   - Calcular score con algoritmo: ingresos/deudas ratio, historial crediticio, estabilidad laboral
   - Clasificar riesgo: Bajo (>750), Medio (650-750), Alto (<650)
   - Determinar monto máximo aprobable

4. Base de datos:
   - SQLAlchemy con PostgreSQL
   - Tabla solicitudes_prestamo
   - Tabla historico_scoring

5. Tests con pytest:
   - Unit tests del algoritmo de scoring
   - Integration tests con DB en memoria
   - Cobertura >80%

[RESTRICCIONES]
- Operaciones async donde sea posible
- Validaciones con Pydantic
- Logs estructurados con loguru
- CORS configurado para frontend Angular

[FORMATO]
Código completo con estructura de proyecto + requirements.txt + tests
```

**Tiempo:** 10 min intro FastAPI + 50 min desarrollo

---

**Clase 11: Taller - Serverless con AWS Lambda + Node.js**

**Reto:** Funciones Lambda para procesamiento asíncrono

**Práctica:**
1. Crear función Lambda con Node.js/TypeScript
2. Trigger desde S3 (procesar archivo de transacciones)
3. Integración con API Gateway
4. Almacenamiento en DynamoDB
5. Logs con CloudWatch
6. Deployment con AWS SAM o Serverless Framework

**Casos de uso:**
- Procesar archivo CSV de transacciones masivas
- Notificaciones asíncronas (SNS/SES)
- Transformación de datos para reporting

**Stack:** Node.js, TypeScript, AWS Lambda, API Gateway, DynamoDB, S3

**Entregable:** Lambda funcional deployed en AWS + infraestructura como código

**Prompt Base:**
```
[ROL] Actúa como arquitecto de soluciones serverless en AWS

[CONTEXTO]
- Cloud: AWS
- Stack: Node.js 18, TypeScript, AWS SDK v3
- Caso de uso: procesar archivo CSV de transacciones bancarias subido a S3
- Volumen: hasta 100k transacciones por archivo

[TAREA]
Genera función Lambda con infraestructura SAM/CloudFormation:

1. Lambda Handler (TypeScript):
   - Trigger: S3 PutObject en bucket transacciones-input/
   - Leer archivo CSV desde S3
   - Parsear y validar transacciones
   - Guardar en DynamoDB tabla 'transacciones'
   - Publicar evento a SNS topic 'transacciones-procesadas'
   - Mover archivo a bucket transacciones-processed/

2. Validaciones de negocio:
   - Formato CSV correcto
   - Montos válidos (positivos, máximo 1M)
   - Fechas válidas
   - Cuentas origen/destino existen

3. Manejo de errores:
   - Archivo corrupto → mover a bucket transacciones-error/
   - Error en DynamoDB → retry con exponential backoff
   - Logs detallados en CloudWatch

4. Infraestructura (SAM template):
   - Lambda con 512MB, timeout 5 min
   - Rol IAM con permisos mínimos
   - S3 buckets (input, processed, error)
   - DynamoDB table con GSI por fecha
   - SNS topic

5. Tests:
   - Unit tests del parser
   - Integration test con LocalStack
   - Test con archivo CSV de ejemplo

[RESTRICCIONES]
- TypeScript estricto
- AWS SDK v3 (modular)
- Environment variables para configuración
- Logs estructurados JSON

[FORMATO]
Código Lambda + template.yaml SAM + tests + README deploy
```

**Tiempo:** 15 min intro Serverless + 45 min desarrollo

---

**Clase 12: Proyecto Final Integrado - Stack Completo**

**Reto:** Sistema completo de Aprobación de Préstamos (Microservicios + Frontend + AWS)

**Equipos de 3-4 personas (mix de especialidades)**

**Arquitectura del Sistema:**
```
[Angular Frontend] 
    ↓
[API Gateway AWS]
    ↓
[Lambda Orchestrator (Node.js)]
    ↓↓↓
[Microservicio Clientes (Java/Spring Boot)]
[Microservicio Scoring (Python/FastAPI)]  
[Microservicio Decisión (Java/Spring Boot)]
    ↓
[RDS PostgreSQL / DynamoDB]
```

**Historias de Usuario a Implementar:**

**HU1:** Como oficial de crédito, quiero consultar información del cliente para verificar su identidad
- Backend Java: endpoint consulta cliente
- Frontend Angular: pantalla de búsqueda

**HU2:** Como sistema, necesito calcular el scoring crediticio automáticamente
- Backend Python: API de cálculo de scoring
- Integración con Bureau (mock)

**HU3:** Como oficial, quiero ver la recomendación del sistema sobre aprobar/rechazar el préstamo
- Backend Java: motor de decisión con reglas de negocio
- Frontend Angular: dashboard con semáforo (aprobado/pendiente/rechazado)

**HU4:** Como auditor, necesito consultar logs de todas las decisiones crediticias
- Lambda Node.js: agregación de logs desde CloudWatch
- Frontend Angular: reporte de auditoría

**Tareas por Equipo:**

**Backend Team:**
1. Microservicio Clientes (Java/Spring Boot) con API REST
2. Microservicio Scoring (Python/FastAPI) con algoritmo
3. Microservicio Decisión (Java/Spring Boot) con reglas
4. Lambda Orchestrator (Node.js/TypeScript) coordinando llamadas
5. Tests de integración entre servicios
6. API Gateway configurado

**Frontend Team:**
1. Módulo de consulta de clientes
2. Componente de solicitud de préstamo (formulario)
3. Dashboard de decisión con visualización
4. Reporte de auditoría
5. Integración con API Gateway
6. Tests E2E del flujo completo

**DevOps/Cloud Team:**
1. Infraestructura AWS (SAM/Terraform)
2. CI/CD con GitHub Actions
3. Monitoring con CloudWatch
4. Logs centralizados
5. Health checks de todos los servicios

**Entregables del Proyecto:**
1. **Código:** repositorio GitHub con estructura de monorepo
2. **Documentación:** README con arquitectura, decisiones técnicas, diagramas
3. **Tests:** suite completa (unitarios, integración, E2E)
4. **Deploy:** sistema funcionando en AWS
5. **Presentación:** 20 min por equipo mostrando demo funcional

**Evaluación:**
- Funcionalidad completa (30%)
- Calidad del código y arquitectura (25%)
- Tests y cobertura (20%)
- Documentación (15%)
- Presentación y demo (10%)

**Tiempo:** 2 sesiones de 60 min = 120 min totales

---

## 🎯 Plantillas Reutilizables para Developers

### Plantilla 1: Generación de Componente Backend

```
[ROL] Actúa como [arquitecto/desarrollador senior] especializado en [tecnología]

[CONTEXTO]
- Proyecto: [nombre del proyecto]
- Stack: [versiones exactas de tecnologías]
- Arquitectura: [microservicios/monolito/serverless]
- Base de datos: [tipo y versión]
- Patrones: [ej: DDD, hexagonal, clean architecture]

[TAREA]
Genera [componente específico] para [funcionalidad] incluyendo:
1. [Capa de dominio/entidades]
2. [Capa de aplicación/servicios]
3. [Capa de infraestructura/repositorios]
4. [API/Controllers]
5. [DTOs y validaciones]
6. [Manejo de excepciones]
7. [Tests unitarios y de integración]

[RESTRICCIONES]
- Framework: [nombre y versión]
- Dependencias permitidas: [lista]
- Estándares de código: [ej: SonarLint, Checkstyle]
- Seguridad: [requisitos específicos]
- Performance: [requisitos de SLA]

[FORMATO]
[Estructura de archivos, código completo, configuraciones]
```

### Plantilla 2: Refactoring de Código Legacy

```
[ROL] Actúa como experto en modernización de sistemas legacy

[CONTEXTO]
- Código origen: [tecnología legacy]
- Objetivo: [tecnología moderna]
- Criticidad: [nivel]
- Restricciones de tiempo: [deadline]
- Recursos disponibles: [equipo, infraestructura]

[CÓDIGO LEGACY]
[Pegar código original aquí]

[TAREA]
Migrar este código a [stack moderno] manteniendo:
1. Funcionalidad equivalente 100%
2. Mejorar arquitectura siguiendo [patrones]
3. Agregar tests para validar equivalencia
4. Documentar cambios arquitectónicos

[ANÁLISIS REQUERIDO]
- Identificar lógica de negocio vs código de UI
- Extraer queries SQL → repositorios
- Validaciones → bean validation
- Dependencias a reemplazar

[OUTPUT]
1. Código migrado con arquitectura moderna
2. Tabla de equivalencias funcionales
3. Tests de regresión
4. Documento de decisiones técnicas
```

### Plantilla 3: Tests Automáticos

```
[ROL] Actúa como ingeniero de QA especializado en automatización

[CONTEXTO]
- Componente a testear: [clase/módulo/API]
- Framework de tests: [JUnit, Jest, pytest, etc]
- Cobertura objetivo: [porcentaje]
- Tipos de tests: [unitarios, integración, E2E]

[CÓDIGO A TESTEAR]
[Pegar código aquí]

[TAREA]
Genera suite completa de tests incluyendo:
1. Tests unitarios:
   - Path feliz
   - Edge cases
   - Manejo de excepciones
   - Validaciones
2. Tests de integración (si aplica):
   - Con base de datos (Testcontainers)
   - Con APIs externas (WireMock)
3. Mocks y stubs necesarios
4. Setup y teardown

[COBERTURA]
- Mínimo [X]% de cobertura
- Todos los métodos públicos testeados
- Validar comportamiento, no implementación

[FORMATO]
Código de tests completo + comandos para ejecutar + reporte esperado
```

### Plantilla 4: Documentación Técnica

```
[ROL] Actúa como arquitecto de software y technical writer

[CONTEXTO]
- Componente/Sistema: [nombre]
- Audiencia: [desarrolladores, DevOps, QA]
- Nivel de detalle: [alto/medio/básico]

[CÓDIGO/SISTEMA]
[Pegar código o descripción aquí]

[TAREA]
Genera documentación técnica completa:
1. README.md con:
   - Descripción del sistema
   - Arquitectura (diagrama)
   - Tecnologías utilizadas
   - Requisitos previos
   - Instrucciones de instalación
   - Configuración
   - Cómo ejecutar
   - Cómo ejecutar tests
   - Estructura del proyecto

2. JavaDoc/JSDoc:
   - Documentar métodos públicos
   - Describir parámetros y retornos
   - Incluir ejemplos de uso

3. Diagrama de arquitectura:
   - Componentes principales
   - Flujo de datos
   - Integraciones externas

4. Decisiones técnicas (ADR):
   - Por qué se eligieron ciertas tecnologías
   - Trade-offs considerados

[FORMATO]
Markdown profesional + diagramas (PlantUML, Mermaid)
```

---

## 🚀 Mejores Prácticas para Developers

### ✅ DO's (Hacer)

1. **Especificar versiones exactas**
   - ✅ "Spring Boot 3.2.1, Java 17, Angular 16.2"
   - ❌ "Spring Boot, Java, Angular"

2. **Incluir contexto de arquitectura**
   - ✅ "Microservicio con arquitectura hexagonal, DDD"
   - ❌ "Hacer un microservicio"

3. **Definir estándares de código**
   - ✅ "Usar Lombok, MapStruct, validaciones JSR-380"
   - ❌ Dejar que la IA elija libremente

4. **Pedir tests junto con código**
   - ✅ "Genera código + tests unitarios con cobertura >80%"
   - ❌ Solo pedir el código de producción

5. **Iterar sobre el resultado**
   - ✅ "Mejora este código agregando circuit breaker"
   - ❌ Conformarse con la primera respuesta

6. **Validar seguridad**
   - ✅ Revisar que no haya SQL injection, XSS, secretos hardcoded
   - ❌ Asumir que el código de IA es seguro

7. **Documentar decisiones**
   - ✅ "Explica por qué elegiste esta arquitectura"
   - ❌ Solo generar código sin entender el razonamiento

### ❌ DON'Ts (Evitar)

1. **Prompts demasiado amplios**
   - ❌ "Hazme un sistema bancario completo"
   - ✅ "Genera el microservicio de gestión de cuentas"

2. **Omitir requisitos no funcionales**
   - ❌ Solo pedir funcionalidad
   - ✅ Incluir performance, seguridad, escalabilidad

3. **Ignorar el contexto del proyecto existente**
   - ❌ Generar código incompatible con el stack actual
   - ✅ Especificar dependencias y versiones del proyecto

4. **Copiar/pegar sin revisar**
   - ❌ Usar código generado sin análisis
   - ✅ Revisar línea por línea, ejecutar tests

5. **No validar contra estándares**
   - ❌ Código que no pasa SonarQube
   - ✅ Validar con linters y análisis estático

6. **Olvidar casos edge**
   - ❌ Solo implementar path feliz
   - ✅ Manejar errores, timeouts, null values

---

## 📊 Evaluación y Certificación

### Entregables por Participante:

1. **Repositorio GitHub Personal:**
   - Mínimo 5 proyectos de los talleres
   - README con descripción y screenshots
   - CI/CD configurado (GitHub Actions)
   - Tests ejecutándose automáticamente

2. **Prompt Library Documentada:**
   - 30 prompts reutilizables categorizados:
     * Backend (Java, Python, Node.js)
     * Frontend (Angular, React)
     * Cloud (AWS)
     * Testing
     * Refactoring
     * Documentación

3. **Artículo Técnico (LinkedIn/Medium):**
   - "Cómo la IA me ayudó a [migrar legacy/crear microservicio/etc]"
   - Incluir código, prompts usados, lecciones aprendidas
   - Mínimo 1000 palabras

4. **Video Demo (5-10 minutos):**
   - Mostrar flujo: HU → análisis → prompt → código → tests → deploy
   - Narrar decisiones técnicas
   - Subir a YouTube/Loom

### Proyecto Final (Clase 12):

**Formato:** Equipos de 3-4 personas
**Duración:** 2 sesiones (120 min)
**Sistema:** Aprobación de Préstamos (Stack Completo)

**Evaluación (100 puntos):**
- **Funcionalidad (30 pts):**
  - HUs implementadas completamente
  - Sistema integrado funcional
  - Deploy en AWS exitoso

- **Calidad de Código (25 pts):**
  - Arquitectura limpia y escalable
  - Patrones de diseño correctos
  - Código DRY, SOLID
  - Sin code smells (SonarQube)

- **Tests (20 pts):**
  - Cobertura >80%
  - Tests unitarios + integración + E2E
  - Tests pasando en CI/CD

- **Documentación (15 pts):**
  - README completo
  - Diagramas de arquitectura
  - ADRs (decisiones técnicas)
  - Instrucciones de deploy

- **Presentación (10 pts):**
  - Demo funcional sin errores
  - Explicación técnica clara
  - Responder preguntas
  - Lecciones aprendidas

### Criterios de Aprobación:

- **Aprobado con Distinción (90-100):** Domina IA para desarrollo, genera código production-ready, arquitectura sólida
- **Aprobado (70-89):** Usa IA efectivamente, código funcional, tests básicos
- **No Aprobado (<70):** Uso casual de IA, código con problemas, falta de tests

---

## 🛠️ Herramientas y Recursos

### IDEs y Editores con IA:
- **Cursor:** IDE con IA integrada (mejor para Java/TS)
- **GitHub Copilot:** $10/mes, extensión para VS Code
- **Amazon CodeWhisperer:** Gratis, enfocado en AWS
- **Tabnine:** Alternativa con modelo local

### LLMs Recomendados:
- **Claude (Anthropic):** Excelente para código, arquitectura, refactoring
- **ChatGPT (OpenAI):** Versión Plus ($20/mes) para GPT-4
- **GitHub Copilot Chat:** Integrado en VS Code
- **Google Gemini:** Gratis, bueno para explicaciones

### Documentación Oficial:
- **Spring Boot:** https://spring.io/guides
- **Angular:** https://angular.io/docs
- **FastAPI:** https://fastapi.tiangolo.com
- **AWS:** https://docs.aws.amazon.com
- **Prompt Engineering Guide:** https://www.promptingguide.ai

### Comunidades:
- **Discord:** Spring Boot, Angular, AWS Developers
- **Reddit:** r/java, r/angular, r/aws, r/MachineLearning
- **Stack Overflow:** Tags específicos por tecnología

---

## 💡 Consejos para Maximizar tu Aprendizaje

1. **Practica diariamente:** Dedica 30 min/día fuera de las clases
2. **Construye tu biblioteca de prompts:** Guarda los que funcionan bien
3. **Experimenta con diferentes LLMs:** Compara Claude vs ChatGPT vs Copilot
4. **Comparte con el equipo:** Crea un canal de Slack para compartir prompts útiles
5. **Itera tus prompts:** Nunca te conformes con la primera respuesta
6. **Valida siempre:** La IA puede alucinar, tu criterio es irreemplazable
7. **Aprende de los errores:** Cuando la IA se equivoca, analiza por qué
8. **Combina IA con tu experiencia:** La IA amplifica tu conocimiento, no lo reemplaza

---

## 🎯 Roadmap Post-Curso

### Mes 2: Especialización
- Profundizar en área de interés (Backend, Frontend, Cloud)
- Contribuir a proyectos open source usando IA
- Crear prompts avanzados para tu dominio

### Mes 3: Liderazgo Técnico
- Mentorear a otros en uso de IA
- Crear biblioteca interna de prompts para el equipo
- Proponer mejoras al proceso de desarrollo con IA

### Mes 4: Evangelización
- Dar charla interna sobre casos de éxito
- Escribir artículos técnicos
- Participar en comunidades externas

---

## 🚀 ¡Éxito en tu Transformación con IA!

Recuerda: **La IA es tu copiloto, no tu piloto.** Tú sigues siendo el desarrollador senior que toma decisiones arquitectónicas, valida código y garantiza calidad.

Este curso te da las herramientas para multiplicar tu productividad x3-5 sin sacrificar calidad. ¡Aprovéchalo al máximo!

---

**Contacto y Soporte:**
- Slack: #ia-generativa-devs
- Email: [tu-email]
- GitHub: [org]/ia-training

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0
**Autor:** Yamid Cueto - Tech Lead MyLegacyApp BancoFiel
