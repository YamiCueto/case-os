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
    scenario: 'Sistema bancario MyLegacyApp con módulos en Visual Basic 6.0 de hace 20+ años',
    problems: [
      {
        title: 'Sin documentación',
        description: 'Código legacy sin comentarios ni documentación técnica',
        icon: '📄',
        color: 'bg-red-50'
      },
      {
        title: 'Desarrolladores retirados',
        description: 'El equipo original ya no trabaja en la empresa',
        icon: '👴',
        color: 'bg-orange-50'
      },
      {
        title: 'Lógica de negocio compleja',
        description: 'Validaciones bancarias, cálculos financieros embebidos',
        icon: '🧮',
        color: 'bg-yellow-50'
      },
      {
        title: 'Acoplamiento alto',
        description: 'Código espagueti con dependencias cruzadas',
        icon: '🍝',
        color: 'bg-purple-50'
      }
    ],
    goal: 'Migrar módulo de Gestión de Clientes (VB6) a Spring Boot sin perder funcionalidad'
  };

  strategy = {
    approach: 'Usar IA como asistente de análisis y traductor inteligente',
    phases: [
      {
        number: 1,
        name: 'Análisis',
        description: 'Entender el código legacy con ayuda de IA',
        icon: '🔍',
        color: 'bg-blue-50'
      },
      {
        number: 2,
        name: 'Documentación',
        description: 'Generar documentación técnica automáticamente',
        icon: '📝',
        color: 'bg-green-50'
      },
      {
        number: 3,
        name: 'Traducción',
        description: 'Migrar código VB6 a Java con Spring Boot',
        icon: '🔄',
        color: 'bg-purple-50'
      },
      {
        number: 4,
        name: 'Validación',
        description: 'Generar tests para garantizar equivalencia',
        icon: '✅',
        color: 'bg-orange-50'
      }
    ]
  };

  analysisPrompt = {
    title: 'Prompt para Análisis de Código Legacy',
    prompt: `[ROL] Actúa como arquitecto de software senior especializado en modernización de sistemas legacy

[CONTEXTO]
- Sistema: MyLegacyApp BancoFiel - Módulo Gestión de Clientes
- Lenguaje origen: Visual Basic 6.0
- Target: Java 17 + Spring Boot 3.2
- Objetivo: Migración completa preservando lógica de negocio

[TAREA]
Analiza este código VB6 y genera:
1. Diagrama de flujo de la lógica principal
2. Lista de funciones y sus responsabilidades
3. Identificación de lógica de negocio vs lógica técnica
4. Dependencias externas (DLLs, APIs, base de datos)
5. Campos y validaciones en formularios
6. Reglas de negocio implícitas en el código

[CÓDIGO VB6]
<PEGAR CÓDIGO AQUÍ>

[RESTRICCIONES]
- No omitir ninguna validación o regla de negocio
- Documentar código comentado o deshabilitado
- Identificar posibles bugs en el código legacy

[FORMATO]
Markdown estructurado con secciones claras`,
    benefits: [
      'Entiendes el código sin leerlo línea por línea',
      'Identificas lógica de negocio crítica',
      'Detectas código obsoleto o redundante',
      'Documentas el sistema automáticamente'
    ]
  };

  migrationSteps: MigrationStep[] = [
    {
      number: 1,
      title: 'Analizar Módulo VB6',
      description: 'Usar IA para entender estructura, funciones y flujo',
      prompt: 'Analiza este módulo VB6 y documenta su funcionalidad...',
      expectedOutput: [
        'Diagrama de flujo',
        'Lista de funciones',
        'Reglas de negocio',
        'Dependencias'
      ],
      time: '15 min',
      icon: '🔍',
      color: 'bg-blue-50'
    },
    {
      number: 2,
      title: 'Extraer Entidades',
      description: 'Identificar objetos de dominio (Cliente, Cuenta, etc)',
      prompt: 'Del código VB6 analizado, extrae las entidades JPA...',
      expectedOutput: [
        'Clases Entity',
        'Campos con tipos Java',
        'Relaciones entre entidades',
        'Validaciones Bean Validation'
      ],
      time: '10 min',
      icon: '📦',
      color: 'bg-green-50'
    },
    {
      number: 3,
      title: 'Traducir Lógica de Negocio',
      description: 'Convertir funciones VB6 a métodos Java',
      prompt: 'Traduce estas funciones VB6 a métodos Java en Service...',
      expectedOutput: [
        'Clase Service',
        'Métodos con lógica traducida',
        'Manejo de excepciones',
        'Logs en operaciones críticas'
      ],
      time: '20 min',
      icon: '🔄',
      color: 'bg-purple-50'
    },
    {
      number: 4,
      title: 'Crear REST API',
      description: 'Exponer funcionalidad como endpoints REST',
      prompt: 'Crea Controller REST exponiendo las operaciones del Service...',
      expectedOutput: [
        'Clase Controller',
        'Endpoints RESTful',
        'DTOs request/response',
        'Documentación OpenAPI'
      ],
      time: '10 min',
      icon: '🌐',
      color: 'bg-orange-50'
    },
    {
      number: 5,
      title: 'Generar Tests',
      description: 'Crear tests unitarios para validar equivalencia',
      prompt: 'Genera tests JUnit validando cada caso del código VB6...',
      expectedOutput: [
        'Tests unitarios Service',
        'Tests integración Controller',
        'Casos edge detectados en VB6',
        'Cobertura >80%'
      ],
      time: '15 min',
      icon: '🧪',
      color: 'bg-pink-50'
    }
  ];

  challenge: Challenge = {
    id: 3,
    difficulty: 'Avanzado',
    title: 'Migrar Módulo de Apertura de Cuentas VB6',
    description: 'Tienes un módulo VB6 real con 800 líneas de código sin documentación. Debes migrarlo a Spring Boot preservando toda la lógica.',
    legacyCode: `' Módulo: AperturaCuentas.bas
' Fecha: 1998-03-15
' Autor: Unknown

Public Function ValidarCliente(ByVal numDocumento As String) As Boolean
    Dim rs As ADODB.Recordset
    Dim sql As String

    ' Validar formato documento
    If Len(numDocumento) < 8 Or Len(numDocumento) > 11 Then
        MsgBox "Documento inválido"
        ValidarCliente = False
        Exit Function
    End If

    ' Consultar cliente en BD
    sql = "SELECT * FROM Clientes WHERE NumDocumento = '" & numDocumento & "'"
    Set rs = New ADODB.Recordset
    rs.Open sql, cn, adOpenStatic

    If rs.EOF Then
        MsgBox "Cliente no existe"
        ValidarCliente = False
    Else
        ' Validar estado cliente
        If rs("Estado") = "I" Then
            MsgBox "Cliente inactivo"
            ValidarCliente = False
        Else
            ValidarCliente = True
        End If
    End If

    rs.Close
End Function

Public Function CrearCuenta(numDoc As String, tipoCuenta As String) As Long
    ' Lógica compleja de creación...
    ' [+700 líneas más]
End Function`,
    requirements: [
      'Analizar código VB6 completo con IA',
      'Extraer entidad Cliente con validaciones',
      'Traducir función ValidarCliente a Java',
      'Crear Service con lógica equivalente',
      'Crear Controller REST con endpoint POST /clientes/validar',
      'Generar tests unitarios validando todos los casos',
      'Documentar diferencias entre VB6 y Spring Boot'
    ],
    hints: [
      'Usa IA para analizar el código completo primero',
      'Pide que identifique las reglas de negocio implícitas',
      'Traduce sección por sección, no todo a la vez',
      'Genera tests basados en los If/Else del VB6',
      'Moderniza el código: usa Optional en lugar de validaciones manuales'
    ],
    tiempo: '60 minutos'
  };

  bestPractices = {
    dos: [
      {
        title: 'Analizar antes de codificar',
        example: '✅ "Analiza este VB6 y documenta su funcionalidad"',
        why: 'Entiendes qué hace antes de traducir'
      },
      {
        title: 'Migrar por capas',
        example: '✅ Entity → Service → Controller → Tests',
        why: 'Proceso ordenado y verificable'
      },
      {
        title: 'Preservar lógica de negocio',
        example: '✅ Traducir validaciones exactamente igual',
        why: 'Evitas cambiar comportamiento del sistema'
      },
      {
        title: 'Modernizar código obsoleto',
        example: '✅ Reemplazar MsgBox por excepciones',
        why: 'Aprovechas para mejorar el diseño'
      },
      {
        title: 'Generar tests exhaustivos',
        example: '✅ Un test por cada if/else del VB6',
        why: 'Garantizas equivalencia funcional'
      }
    ],
    donts: [
      {
        title: 'Traducir todo de golpe',
        example: '❌ "Migra estos 1000 líneas de VB6"',
        why: 'Resultados incorrectos y difíciles de validar'
      },
      {
        title: 'Omitir análisis previo',
        example: '❌ Empezar a codificar sin entender',
        why: 'Pierdes lógica de negocio crítica'
      },
      {
        title: 'Cambiar lógica de negocio',
        example: '❌ "Mejora esta validación mientras migras"',
        why: 'Introduces bugs y cambios no autorizados'
      },
      {
        title: 'No generar tests',
        example: '❌ "Solo migra el código"',
        why: 'No puedes validar que funciona igual'
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
