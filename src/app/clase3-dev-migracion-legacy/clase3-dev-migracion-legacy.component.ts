import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MigrationStep {
  number: number;
  title: string;
  description: string;
  prompt: string;
  expectedOutput: string[];
  time: string;
  icon: string;
  color: string;
}

interface Challenge {
  id: number;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  title: string;
  description: string;
  legacyCode: string;
  legacySource: string;
  requirements: string[];
  hints: string[];
  tiempo: string;
}

@Component({
  selector: 'app-clase3-dev-migracion-legacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase3-dev-migracion-legacy.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase3-dev-migracion-legacy.component.css'
  ]
})
export class Clase3DevMigracionLegacyComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'strategy' },
    { type: 'analysis' },
    { type: 'migration-steps' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  context = {
    scenario: 'Sistema financiero con módulos distribuidos en tres tecnologías legacy: VB6 (formularios y lógica de negocio), .NET Framework (servicios WCF y clases de utilidades) y COBIS (stored procedures y módulos COBOL-like). El objetivo es migrar todo a Java 21 + Spring Boot 4.1.0 + Gradle preservando la lógica de negocio exacta.',
    legacySystems: [
      {
        name: 'Visual Basic 6.0',
        icon: '🟡',
        characteristics: [
          'Formularios con lógica embebida (UI + negocio mezclados)',
          'Módulos .bas con funciones globales',
          'Conexión ADODB con SQL concatenado (riesgo inyección)',
          'Manejo de errores: On Error GoTo / On Error Resume Next'
        ]
      },
      {
        name: '.NET Framework',
        icon: '🔵',
        characteristics: [
          'Clases estáticas con métodos utilitarios',
          'WCF Services (SOAP) con DataContracts',
          'DataSet / DataReader para acceso a datos',
          'App.config / Web.config con cadenas de conexión'
        ]
      },
      {
        name: 'COBIS',
        icon: '🟠',
        characteristics: [
          'Stored procedures como unidad de negocio principal',
          'Llamadas XML sobre protocolo propietario TCP',
          'Tablas con nomenclatura especial (prefijo módulo)',
          'Parámetros tipados con códigos numéricos internos'
        ]
      }
    ],
    goal: 'Migrar módulos de Gestión de Clientes y Apertura de Cuentas a Java 21 + Spring Boot 4.1.0 + Gradle sin perder funcionalidad ni lógica de negocio'
  };

  strategy = {
    approach: 'Usar IA (Copilot) como asistente de análisis, documentación y traducción inteligente de código legacy',
    phases: [
      {
        number: 1,
        name: 'Análisis',
        description: 'Entender el código legacy con Copilot — sin importar el lenguaje fuente',
        icon: '🔍',
        color: 'bg-blue-50'
      },
      {
        number: 2,
        name: 'Documentación',
        description: 'Generar documentación técnica y reglas de negocio automáticamente',
        icon: '📝',
        color: 'bg-green-50'
      },
      {
        number: 3,
        name: 'Traducción',
        description: 'Migrar a Java 21 + Spring Boot 4.1.0 respetando la lógica exacta',
        icon: '🔄',
        color: 'bg-purple-50'
      },
      {
        number: 4,
        name: 'Validación',
        description: 'Generar tests JUnit 5 que garanticen equivalencia funcional',
        icon: '✅',
        color: 'bg-orange-50'
      }
    ]
  };

  analysisPrompt = {
    title: 'Prompt Maestro para Análisis de Código Legacy',
    prompt: `[ROL] Actúa como arquitecto Java 21 senior especializado en modernización
de sistemas legacy (VB6, .NET Framework, COBIS) hacia Spring Boot 4.1.0

[CONTEXTO]
- Sistema: [NOMBRE DEL SISTEMA] — Módulo: [NOMBRE DEL MÓDULO]
- Lenguaje origen: [VB6 | .NET Framework | COBIS stored procedure]
- Target: Java 21 LTS + Spring Boot 4.1.0 + Gradle 8 (Kotlin DSL)
- Build: Gradle (no Maven) — estructura multi-módulo
- Objetivo: Migración completa preservando lógica de negocio exacta

[TAREA]
Analiza este código y genera:
1. Resumen de responsabilidades del módulo (qué hace, qué no hace)
2. Lista de funciones/métodos con su lógica de negocio
3. Entidades de dominio detectadas (candidatas a @Entity JPA)
4. Reglas de negocio explícitas e implícitas (especialmente validaciones)
5. Dependencias externas (BDs, APIs, servicios)
6. Riesgos detectados (SQL injection, código sin error handling, etc.)
7. Equivalencias Java 21 sugeridas para cada construcción legacy

[CÓDIGO LEGACY]
<PEGAR CÓDIGO VB6 / .NET / COBIS AQUÍ>

[RESTRICCIONES]
- No omitir ninguna validación (especialmente en IFs anidados de VB6)
- Documentar stored procedures COBIS como operaciones de servicio Java
- Traducir DataContract .NET a Java record
- Usar jakarta.* (no javax.*) — Spring Boot 4.1.0 usa Jakarta EE 11
- No usar Lombok — Java 21 records y constructores explícitos
- Gradle Kotlin DSL — no generar pom.xml

[FORMATO]
Markdown estructurado con código Java ejecutable en bloques de código`,
    benefits: [
      'Funciona con VB6, .NET y COBIS sin cambiar el prompt base',
      'Identifica reglas de negocio críticas antes de tocar código',
      'Detecta riesgos de seguridad (SQL injection en VB6, stored procs sin validación)',
      'Genera documentación técnica como efecto secundario del análisis'
    ]
  };

  migrationSteps: MigrationStep[] = [
    {
      number: 1,
      title: 'Analizar el Módulo Legacy',
      description: 'Usar Copilot para entender estructura, reglas de negocio y dependencias — sin importar si es VB6, .NET o COBIS',
      prompt: 'Analiza este módulo [VB6/COBIS/.NET] y documenta: responsabilidades, reglas de negocio, entidades, validaciones y riesgos...',
      expectedOutput: [
        'Resumen de responsabilidades',
        'Mapa de reglas de negocio',
        'Entidades candidatas a @Entity',
        'Riesgos y deuda técnica'
      ],
      time: '15 min',
      icon: '🔍',
      color: 'bg-blue-50'
    },
    {
      number: 2,
      title: 'Crear Estructura Gradle',
      description: 'Definir build.gradle.kts con Java 21, Spring Boot 4.1.0 y módulos del proyecto',
      prompt: 'Genera build.gradle.kts para proyecto Spring Boot 4.1.0 con Java 21, Gradle 8 Kotlin DSL, módulos: :domain, :application, :infrastructure...',
      expectedOutput: [
        'build.gradle.kts raíz',
        'settings.gradle.kts con módulos',
        'application.yml base',
        'Estructura de directorios'
      ],
      time: '10 min',
      icon: '🐘',
      color: 'bg-yellow-50'
    },
    {
      number: 3,
      title: 'Extraer Entidades JPA',
      description: 'Convertir Types VB6, DataContracts .NET o tablas COBIS a @Entity Java 21',
      prompt: 'Del análisis anterior, extrae entidades JPA con: campos (usando tipos Java correctos), validaciones Bean Validation, relaciones @ManyToOne/@OneToMany, sin Lombok...',
      expectedOutput: [
        'Clases @Entity con Jakarta Persistence',
        'Java Records para DTOs',
        'Enums para campos codificados',
        'Validaciones @NotNull, @Size, @Pattern'
      ],
      time: '10 min',
      icon: '📦',
      color: 'bg-green-50'
    },
    {
      number: 4,
      title: 'Traducir Lógica de Negocio',
      description: 'Convertir funciones VB6, métodos .NET estáticos o stored procedures COBIS a @Service Java',
      prompt: 'Traduce estas [funciones VB6 / métodos .NET / stored procedures COBIS] a métodos @Service Java 21 con: lógica equivalente, excepciones de dominio, @Transactional donde aplique...',
      expectedOutput: [
        'Clase @Service con lógica equivalente',
        'Excepciones de dominio personalizadas',
        '@Transactional en operaciones de escritura',
        'Logs SLF4J en operaciones críticas'
      ],
      time: '20 min',
      icon: '🔄',
      color: 'bg-purple-50'
    },
    {
      number: 5,
      title: 'Crear REST API',
      description: 'Exponer la lógica migrada como endpoints REST — reemplazando formularios VB6 o servicios WCF',
      prompt: 'Crea @RestController para el Service migrado con: endpoints RESTful, Java Records como DTOs, @Valid, ResponseEntity, @ControllerAdvice para excepciones...',
      expectedOutput: [
        '@RestController con endpoints',
        'Java Records (Request/Response DTOs)',
        '@ControllerAdvice para errores',
        'Anotaciones @Operation de SpringDoc'
      ],
      time: '10 min',
      icon: '🌐',
      color: 'bg-orange-50'
    },
    {
      number: 6,
      title: 'Generar Tests de Equivalencia',
      description: 'Crear tests JUnit 5 que validen que la lógica Java es equivalente al comportamiento del código legacy',
      prompt: 'Genera tests JUnit 5 para cada caso del código legacy: un test por cada If/Else de VB6, por cada stored procedure COBIS, por cada método .NET. Incluir casos borde detectados...',
      expectedOutput: [
        'Tests unitarios @Service con @ExtendWith(MockitoExtension)',
        'Tests de integración con @SpringBootTest',
        'Casos borde del código legacy',
        'Cobertura >80% de la lógica migrada'
      ],
      time: '15 min',
      icon: '🧪',
      color: 'bg-pink-50'
    }
  ];

  challenge: Challenge = {
    id: 3,
    difficulty: 'Avanzado',
    title: 'Migrar Validación de Clientes — VB6 + COBIS a Java 21',
    description: 'Tienes dos módulos que hacen lo mismo: una función VB6 que valida clientes con SQL concatenado, y un stored procedure COBIS equivalente. Debes migrar ambos a un único @Service Java 21 con Spring Boot 4.1.0 + Gradle.',
    legacySource: 'VB6 + COBIS',
    legacyCode: `' ===== VB6: AperturaCuentas.bas (1998) =====
Public Function ValidarCliente(ByVal numDocumento As String) As Boolean
    Dim rs As ADODB.Recordset
    Dim sql As String

    ' Validar formato — lógica de negocio hardcodeada
    If Len(numDocumento) < 8 Or Len(numDocumento) > 11 Then
        MsgBox "Documento inválido"
        ValidarCliente = False
        Exit Function
    End If

    ' SQL concatenado — VULNERABLE A INYECCIÓN SQL
    sql = "SELECT * FROM Clientes WHERE NumDocumento = '" & numDocumento & "'"
    Set rs = New ADODB.Recordset
    rs.Open sql, cn, adOpenStatic

    If rs.EOF Then
        MsgBox "Cliente no existe"
        ValidarCliente = False
    Else
        If rs("Estado") = "I" Then
            MsgBox "Cliente inactivo"
            ValidarCliente = False
        Else
            ValidarCliente = True
        End If
    End If
    rs.Close
End Function

-- ===== COBIS: sp_validar_cliente (equivalente) =====
CREATE PROCEDURE sp_validar_cliente
    @num_doc VARCHAR(11)
AS BEGIN
    DECLARE @estado CHAR(1)
    DECLARE @existe INT

    SELECT @existe = COUNT(*), @estado = estado
    FROM cobis..cl_ente
    WHERE identificacion = @num_doc

    IF @existe = 0
        RAISERROR('Cliente no existe', 16, 1)
    ELSE IF @estado = 'I'
        RAISERROR('Cliente inactivo', 16, 1)
END`,
    requirements: [
      'Analizar ambos códigos (VB6 + COBIS) con un solo prompt de Copilot',
      'Extraer entidad Cliente como @Entity JPA con validaciones Bean Validation',
      'Crear ClienteService con método validarCliente(String documento) que unifique las dos lógicas',
      'Reemplazar SQL concatenado con Spring Data JPA (eliminar vulnerabilidad inyección)',
      'Crear @RestController con POST /clientes/validar usando Java Record como DTO',
      'Generar tests JUnit 5 para: documento corto, documento largo, cliente inexistente, cliente inactivo, cliente válido',
      'build.gradle.kts con Java 21, Spring Boot 4.1.0, spring-boot-starter-data-jpa, H2 para tests'
    ],
    hints: [
      'Prompt: "Analiza este VB6 Y este stored procedure COBIS — tienen la misma lógica de negocio. Unifica en un @Service Java 21"',
      'El estado "I" de COBIS y el rs("Estado") = "I" de VB6 son la misma regla → enum EstadoCliente.INACTIVO',
      'El SQL concatenado de VB6 → findByDocumento(String doc) en JpaRepository',
      'MsgBox de VB6 y RAISERROR de COBIS → excepciones de dominio: ClienteNoExisteException, ClienteInactivoException',
      'Para H2 en tests: spring.jpa.hibernate.ddl-auto=create-drop en application-test.yml'
    ],
    tiempo: '60 minutos'
  };

  bestPractices = {
    dos: [
      {
        title: 'Analizar antes de codificar — siempre',
        example: '✅ "Analiza este VB6/.NET/COBIS y documenta lógica de negocio"',
        why: 'Entiendes qué hace antes de traducir — evitas introducir bugs sutiles'
      },
      {
        title: 'Un prompt por capa — no todo junto',
        example: '✅ Entity → Repository → Service → Controller → Tests',
        why: 'Copilot genera mejor código con contexto acotado'
      },
      {
        title: 'Incluir código legacy en el contexto del prompt',
        example: '✅ Pegar el VB6/COBIS original en [CÓDIGO LEGACY]',
        why: 'Copilot tiene el contexto exacto para traducir correctamente'
      },
      {
        title: 'Especificar Gradle explícitamente',
        example: '✅ "Usa Gradle 8 Kotlin DSL — no generes pom.xml"',
        why: 'Copilot tiende a generar Maven por defecto si no se especifica'
      },
      {
        title: 'Pedir Java Records en lugar de POJOs con setters',
        example: '✅ "DTOs como Java 21 records inmutables — sin Lombok, sin setters"',
        why: 'Records son más seguros, concisos y modernos que los POJOs legacy'
      }
    ],
    donts: [
      {
        title: 'Traducir todo de golpe',
        example: '❌ "Migra estos 1000 líneas de VB6/COBIS"',
        why: 'Resultados incorrectos y difíciles de validar layer por layer'
      },
      {
        title: 'Omitir la fuente del código legacy en el prompt',
        example: '❌ Pegar código sin decir si es VB6, .NET o COBIS',
        why: 'Copilot puede interpretar incorrectamente la sintaxis'
      },
      {
        title: 'Cambiar lógica de negocio durante la migración',
        example: '❌ "Mejora esta validación mientras migras"',
        why: 'Mezcla migración con refactoring — introduce bugs silenciosos'
      },
      {
        title: 'Pedir Maven cuando el proyecto usa Gradle',
        example: '❌ No especificar build tool — Copilot genera pom.xml',
        why: 'Genera inconsistencia con el resto del proyecto'
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
