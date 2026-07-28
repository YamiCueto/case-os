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
      'Módulo Angular con lazy loading y routing',
      'CRUD completo con formularios reactivos',
      'Tabla con paginación, filtros y búsqueda',
      'Integración con API REST del backend',
      'UI profesional con Angular Material'
    ],
    challenges: [
      {
        icon: 'code',
        title: 'Boilerplate Repetitivo',
        description: 'Crear servicios, componentes, formularios y routing manualmente toma horas',
        color: 'blue'
      },
      {
        icon: 'bug_report',
        title: 'Manejo de Estado',
        description: 'Gestionar loading states, errores y datos con RxJS es complejo',
        color: 'orange'
      },
      {
        icon: 'sync_problem',
        title: 'Validaciones Duplicadas',
        description: 'Mantener validaciones frontend consistentes con backend',
        color: 'red'
      },
      {
        icon: 'style',
        title: 'Estilos Inconsistentes',
        description: 'Lograr UI profesional y responsive sin experiencia en Material',
        color: 'purple'
      }
    ]
  };

  architectureLayers = [
    {
      name: 'Routing Module',
      description: 'Lazy loading con rutas para lista, crear, editar, detalle',
      icon: '🗺️',
      files: ['clientes-routing.module.ts']
    },
    {
      name: 'Service Layer',
      description: 'HttpClient con CRUD + interceptores (auth, error, loading)',
      icon: '🔌',
      files: ['clientes.service.ts', 'interceptors/']
    },
    {
      name: 'Components',
      description: 'Lista (tabla), Form (crear/editar), Detalle (solo lectura)',
      icon: '🧩',
      files: ['clientes-lista/', 'clientes-form/', 'clientes-detalle/']
    },
    {
      name: 'Models & Validators',
      description: 'Interfaces TypeScript + validadores custom',
      icon: '📋',
      files: ['models/cliente.model.ts', 'validators/']
    }
  ];

  servicePrompt = {
    title: 'Generar Service con HttpClient',
    role: 'Actúa como desarrollador Angular senior especializado en servicios REST',
    context: [
      'Proyecto: Frontend MyLegacyApp (sistema bancario)',
      'Stack: Angular 16, TypeScript, RxJS, HttpClient',
      'API Backend: Spring Boot REST en http://localhost:8080/api/clientes',
      'Autenticación: JWT en header Authorization'
    ],
    task: [
      'Crear ClientesService con métodos CRUD completos',
      'getClientes(page, size, filtros): Observable<Page<Cliente>> con paginación',
      'getClienteById(id): Observable<Cliente> con manejo de 404',
      'createCliente(cliente): Observable<Cliente> con validación respuesta',
      'updateCliente(id, cliente): Observable<Cliente>',
      'deleteCliente(id): Observable<void> con confirmación',
      'buscarPorDocumento(documento): Observable<Cliente>',
      'Manejo de errores con catchError y throwError',
      'Loading state con BehaviorSubject'
    ],
    expectedOutput: [
      'ClientesService injectable con @Injectable({providedIn: "root"})',
      'Interface Cliente y PageResponse tipadas',
      'Métodos con tipado estricto de Observable',
      'Error handling con operators RxJS (catchError, retry)',
      'BaseURL desde environment.ts',
      'Tests unitarios con HttpClientTestingModule'
    ]
  };

  componentPrompt = {
    title: 'Generar Componentes CRUD',
    role: 'Actúa como desarrollador Angular senior especializado en formularios reactivos y Material',
    context: [
      'Módulo: Gestión de Clientes bancarios',
      'Framework: Angular Material para UI',
      'Forms: Reactive Forms con validaciones',
      'Estado: BehaviorSubject + async pipe (sin NgRx)'
    ],
    task: [
      'ClientesListaComponent: Tabla MatTable con MatPaginator, MatSort',
      'Filtros: búsqueda por nombre/documento, estado activo/inactivo',
      'Acciones: botones ver/editar/eliminar con MatDialog confirmación',
      'ClientesFormComponent: FormBuilder con validaciones',
      'Validators: documento (solo números), email, teléfono, ingresos > 0',
      'Modo crear/editar dinámico según route params',
      'ClientesDetalleComponent: vista solo lectura con datos cliente',
      'Loading spinners con MatProgressSpinner',
      'Snackbar para mensajes éxito/error'
    ],
    expectedOutput: [
      'Componentes con OnPush change detection',
      'Smart components (lista) vs Dumb components (form, detalle)',
      'Unsubscribe automático con takeUntil + Subject',
      'Template con async pipe para Observables',
      'Estilos SCSS con variables Material theming',
      'Tests con ComponentFixture + TestBed'
    ]
  };

  challenge = {
    title: '🏆 Challenge: Módulo Angular Completo',
    description: 'Genera un módulo funcional de Gestión de Clientes que consuma la API REST del microservicio de la Clase 2',
    requirements: [
      'Módulo con lazy loading y routing independiente',
      'ClientesService con todos los métodos CRUD + interceptores',
      'ClientesListaComponent con tabla Material, paginación y filtros',
      'ClientesFormComponent con validaciones reactivas',
      'ClientesDetalleComponent para visualización',
      'Manejo de errores global con ErrorInterceptor',
      'Loading states con LoadingInterceptor + MatProgressBar',
      'Responsive design con breakpoints Material',
      'Tests unitarios para service y componentes'
    ],
    moduleStructure: {
      routing: ['/', '/nuevo', '/:id/editar', '/:id/detalle'],
      components: [
        'ClientesListaComponent (smart)',
        'ClientesFormComponent (dumb)',
        'ClientesDetalleComponent (dumb)'
      ],
      services: [
        'ClientesService (CRUD)',
        'AuthInterceptor (JWT)',
        'ErrorInterceptor (manejo global)',
        'LoadingInterceptor (spinner)'
      ]
    },
    hints: [
      'Usa Angular Material schematics para generar tabla inicial',
      'FormBuilder.group() con Validators.compose para múltiples validaciones',
      'Subject + takeUntil en ngOnDestroy para evitar memory leaks',
      'ActivatedRoute.params para detectar modo crear vs editar',
      'MatDialog para confirmación de eliminación',
      'environment.ts para configurar baseURL de API'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Arquitectura de Componentes',
      practices: [
        'Smart components: manejan lógica y estado (lista)',
        'Dumb components: solo presentación, reciben @Input y emiten @Output',
        'OnPush change detection para mejor performance',
        'Standalone components para modularidad (opcional Angular 16+)'
      ]
    },
    {
      category: 'Manejo de Observables',
      practices: [
        'async pipe en template para auto-unsubscribe',
        'takeUntil + Subject en ngOnDestroy si subscribe manual',
        'shareReplay(1) para compartir resultados HTTP entre suscriptores',
        'catchError + throwError para manejo de errores'
      ]
    },
    {
      category: 'Formularios Reactivos',
      practices: [
        'FormBuilder para crear formularios de forma declarativa',
        'Custom validators para lógica compleja',
        'markAllAsTouched() antes de submit para mostrar errores',
        'patchValue() para editar, setValue() para crear'
      ]
    },
    {
      category: 'Tipado TypeScript',
      practices: [
        'Interfaces para modelos (Cliente, PageResponse)',
        'Enums para valores fijos (EstadoCliente)',
        'Generics en servicios: Observable<T>',
        'Strict mode habilitado en tsconfig.json'
      ]
    },
    {
      category: 'Testing',
      practices: [
        'HttpClientTestingModule para mockear HTTP',
        'ComponentFixture + detectChanges() para tests componentes',
        'Spy objects para mockear servicios',
        'async/fakeAsync para operaciones asíncronas'
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
