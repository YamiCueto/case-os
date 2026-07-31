import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  type: string;
}

@Component({
  selector: 'app-clase6-dev-modulo-angular',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase6-dev-modulo-angular.component.html',
  styleUrls: [
    '../shared-presentation.css',
    './clase6-dev-modulo-angular.component.css'
  ]
})
export class Clase6DevModuloAngularComponent {
  currentSlide = 0;

  slides: Slide[] = [
    { type: 'title' },
    { type: 'context' },
    { type: 'architecture' },
    { type: 'service-prompt' },
    { type: 'component-prompt' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  context = {
    scenario: 'El equipo necesita desarrollar rápidamente un módulo CRUD de Gestión de Clientes que consuma la API REST del microservicio (Clase 2)',
    goals: [
      'Componentes Standalone con Angular 22 (sin NgModules)',
      'CRUD completo con Signal Forms (estable en Angular 22)',
      'Tabla con paginación, filtros y búsqueda con httpResource()',
      'Integración reactiva con signals + computed()',
      'UI profesional con Angular Material 22'
    ],
    challenges: [
      {
        icon: 'code',
        title: 'Boilerplate Reducido',
        description: 'Angular 22 elimina NgModules: los componentes Standalone son el default. Menos archivos, menos configuración',
        color: 'blue'
      },
      {
        icon: 'bug_report',
        title: 'Estado Reactivo con Signals',
        description: 'signal() + computed() reemplazan BehaviorSubject para estado local. httpResource() para datos HTTP',
        color: 'orange'
      },
      {
        icon: 'sync_problem',
        title: 'Signal Forms vs Reactive Forms',
        description: 'Angular 22 introduce Signal Forms estables: formularios reactivos basados en signals, sin FormControl manual',
        color: 'red'
      },
      {
        icon: 'style',
        title: 'OnPush por Defecto',
        description: 'Angular 22 establece OnPush como estrategia por defecto. Change detection preciso y automático con Signals',
        color: 'purple'
      }
    ]
  };

  architectureLayers = [
    {
      name: 'Routing (Standalone)',
      description: 'Lazy loading con rutas standalone para lista, crear, editar, detalle. Sin NgModule',
      icon: '🗃️',
      files: ['clientes.routes.ts']
    },
    {
      name: 'Service Layer',
      description: 'httpResource() para CRUD + interceptores funcionales (provideHttpClient + withInterceptors)',
      icon: '🔌',
      files: ['clientes.service.ts', 'interceptors/']
    },
    {
      name: 'Components (Standalone)',
      description: 'Componentes Standalone con Signal Forms y OnPush por defecto en Angular 22',
      icon: '🧩',
      files: ['clientes-lista/', 'clientes-form/', 'clientes-detalle/']
    },
    {
      name: 'Signals & Models',
      description: 'signal(), computed(), input() como alternativa tipada a @Input (Angular 22)',
      icon: '📋',
      files: ['models/cliente.model.ts', 'validators/']
    }
  ];

  servicePrompt = {
    title: 'Generar Service con httpResource (Angular 22)',
    role: 'Actúa como desarrollador Angular senior especializado en Angular 22 y Signals',
    context: [
      'Proyecto: Frontend MyLegacyApp (sistema bancario)',
      'Stack: Angular 22, TypeScript 6.0, RxJS 7.8, httpResource(), Signals',
      'API Backend: Spring Boot 4.1 REST en http://localhost:8081/api/clientes',
      'Autenticación: JWT en header Authorization'
    ],
    task: [
      'Crear ClientesService con métodos CRUD usando httpResource()',
      'getClientes(): httpResource con params signal para paginación + filtros',
      'getClienteById(id): httpResource con id param signal',
      'createCliente(cliente): Observable<Cliente> (mutaciones aún usan RxJS)',
      'updateCliente(id, cliente): Observable<Cliente>',
      'deleteCliente(id): Observable<void>',
      'buscarPorDocumento(documento): httpResource con query signal',
      'Manejo de errores con httpResource.error signal'
    ],
    expectedOutput: [
      'ClientesService injectable con inject(HttpClient) (no constructor DI)',
      'Interface Cliente y PageResponse con tipos TypeScript 6.0',
      'httpResource para queries, Observable para mutaciones (POST/PUT/DELETE)',
      'Error handling con signal: resource.error()',
      'BaseURL desde environment.ts',
      'Tests unitarios con HttpClientTestingModule o Vitest'
    ]
  };

  componentPrompt = {
    title: 'Generar Componentes CRUD Standalone (Angular 22)',
    role: 'Actúa como desarrollador Angular 22 senior especializado en Signals y Angular Material',
    context: [
      'Módulo: Gestión de Clientes bancarios',
      'Framework: Angular Material 22 para UI',
      'Forms: Signal Forms (estable en Angular 22) para formularios',
      'Estado: signal() + computed() (reemplaza BehaviorSubject)'
    ],
    task: [
      'ClientesListaComponent: Tabla MatTable con httpResource() para datos',
      'Filtros reactivos: searchSignal con debounce integrado',
      'Acciones: botones ver/editar/eliminar con MatDialog confirmación',
      'ClientesFormComponent: Signal Forms con validaciones declarativas',
      'Validators: documento (solo números), email, teléfono, ingresos > 0',
      'Modo crear/editar dinámico con input() signal en lugar de ActivatedRoute',
      'ClientesDetalleComponent: vista solo lectura con datos cliente',
      'Loading state automático con resource.isLoading() signal',
      'Snackbar para mensajes éxito/error'
    ],
    expectedOutput: [
      'Componentes Standalone con OnPush (default en v22)',
      'input() como signal de entrada (reemplaza @Input decorator)',
      'output() para emisor de eventos (reemplaza @Output EventEmitter)',
      'Template con @if / @for / @switch (control flow moderno Angular 17+)',
      'Signal Forms: FormGroup con signalValue(), validate(), touched signals',
      'Tests con ComponentFixture + Vitest/Jest'
    ]
  };

  challenge = {
    title: '🏆 Challenge: Módulo Angular 22 Completo',
    description: 'Genera un módulo funcional de Gestión de Clientes usando Angular 22 con Signals, Signal Forms y httpResource que consuma la API REST de Spring Boot 4.1 (Clase 2)',
    requirements: [
      'Componentes Standalone con lazy loading y routing sin NgModule',
      'ClientesService con httpResource() para queries, Observable para mutaciones',
      'ClientesListaComponent: tabla Material con paginación via signals',
      'ClientesFormComponent con Signal Forms y validaciones',
      'ClientesDetalleComponent para visualización',
      'Manejo de errores global con interceptores funcionales (provideHttpClient)',
      'Loading states automáticos con resource.isLoading()',
      'Responsive design con breakpoints Material 22',
      'Tests unitarios con Vitest para service y componentes'
    ],
    moduleStructure: {
      routing: ['/', '/nuevo', '/:id/editar', '/:id/detalle'],
      components: [
        'ClientesListaComponent (standalone, OnPush default)',
        'ClientesFormComponent (Signal Forms)',
        'ClientesDetalleComponent (input() signals)'
      ],
      services: [
        'ClientesService (httpResource + Observable)',
        'AuthInterceptor (funcional, provideHttpClient)',
        'ErrorInterceptor (funcional, withInterceptors)'
      ]
    },
    hints: [
      'Angular 22: ng g c clientes/lista --standalone (ya no necesita --module)',
      'Signal Forms: formGroup.value() es un signal, no un Observable',
      'httpResource: const clientes = httpResource("http://api/clientes")',
      'input() signals: readonly id = input<number>() en lugar de @Input()',
      'MatDialog funciona igual, solo importar directamente en standalone component',
      'environment.ts: provideEnvironmentInitializer para configuración'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Arquitectura Angular 22',
      practices: [
        'Standalone Components como default: no más NgModules para features',
        'input() + output() como signals de I/O (reemplaza @Input/@Output decorators)',
        'OnPush es el default en Angular 22: no necesitas especificarlo',
        'Lazy loading con loadComponent() en lugar de loadChildren()'
      ]
    },
    {
      category: 'Signals y Estado',
      practices: [
        'signal() para estado local del componente',
        'computed() para estado derivado (reemplaza combineLatest + async pipe)',
        'httpResource() para fetch HTTP declarativo + signal de error/loading',
        'toSignal() para convertir Observables existentes a Signals'
      ]
    },
    {
      category: 'Signal Forms (Angular 22)',
      practices: [
        'formGroup.value() retorna un signal, reactivo automáticamente',
        'formControl.touched es un signal: usa en templates directamente',
        'validate() método sincrónico, no necesita statusChanges Observable',
        'Mantener Reactive Forms para formularios muy complejos (wizards multi-step)'
      ]
    },
    {
      category: 'Tipado TypeScript 6',
      practices: [
        'Interfaces para modelos (Cliente, PageResponse) con tipos estrictos',
        'Enums (StrEnum pattern) para valores fijos (EstadoCliente)',
        'Generics en services: httpResource<T>()',
        'Strict mode habilitado en tsconfig.json (ya es default)'
      ]
    },
    {
      category: 'Testing con Vitest',
      practices: [
        'Vitest reemplaza Karma como test runner en Angular 22',
        'ComponentFixture + detectChanges() sigue igual con Vitest',
        'Spy objects para mockear services (compatibles)',
        'async/fakeAsync sigue funcionando con Vitest'
      ]
    }
  ];

  angularTools = [
    {
      name: 'Angular Schematics',
      description: 'Generadores CLI para componentes, servicios, módulos',
      commands: [
        'ng g module clientes --routing',
        'ng g component clientes/lista',
        'ng g service clientes/clientes'
      ]
    },
    {
      name: 'Angular Material',
      description: 'Componentes UI pre-construidos con diseño Material',
      components: ['MatTable', 'MatPaginator', 'MatFormField', 'MatDialog', 'MatSnackBar']
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
