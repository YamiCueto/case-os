import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase7-dev-frontend-legacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase7-dev-frontend-legacy.component.html',
  styleUrls: ['./clase7-dev-frontend-legacy.component.css', '../shared-presentation.css']
})
export class Clase7DevFrontendLegacyComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'refactoring-strategy' },
    { type: 'unsubscribe-patterns' },
    { type: 'change-detection' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  // Slide 2: Context
  context = {
    scenario: 'Un proyecto Angular 10 heredado tiene componentes con memory leaks, change detection ineficiente y código difícil de mantener. Los componentes suscriben observables sin unsubscribe, usan Default Change Detection y mezclan lógica de negocio con presentación.',
    problems: [
      {
        icon: '💧',
        title: 'Memory Leaks',
        description: 'Subscripciones sin unsubscribe causan fugas de memoria',
        color: 'red'
      },
      {
        icon: '🔄',
        title: 'Change Detection Ineficiente',
        description: 'Default strategy ejecuta CD en toda la app constantemente',
        color: 'orange'
      },
      {
        icon: '🍝',
        title: 'Código Spaguetti',
        description: 'Smart components con lógica de negocio, presentación y API calls mezclados',
        color: 'yellow'
      },
      {
        icon: '🐛',
        title: 'Difícil de Testear',
        description: 'Componentes acoplados con dependencias difíciles de mockear',
        color: 'purple'
      }
    ],
    modernGoals: [
      'Eliminar memory leaks con takeUntil/takeUntilDestroyed',
      'Optimizar performance con OnPush Change Detection',
      'Separar componentes smart (container) y dumb (presentational)',
      'Preparar para migración a Signals en Angular 16+',
      'Mejorar testabilidad con componentes desacoplados'
    ]
  };

  // Slide 3: Refactoring Strategy
  refactoringStrategy = {
    steps: [
      {
        phase: 'Fase 1: Análisis',
        icon: '🔍',
        tasks: [
          'Identificar componentes con subscripciones sin unsubscribe',
          'Detectar componentes que mezclan lógica smart/dumb',
          'Listar componentes con Default Change Detection',
          'Priorizar por impacto en performance (Chrome DevTools)'
        ],
        color: 'blue'
      },
      {
        phase: 'Fase 2: Unsubscribe Pattern',
        icon: '🛑',
        tasks: [
          'Implementar takeUntilDestroyed (Angular 16+) o takeUntil',
          'Refactorizar subscripciones en ngOnInit',
          'Remover ngOnDestroy manuales con Subject.complete()',
          'Validar con Chrome DevTools Memory Profiler'
        ],
        color: 'green'
      },
      {
        phase: 'Fase 3: OnPush Strategy',
        icon: '⚡',
        tasks: [
          'Cambiar a OnPush en componentes presentacionales',
          'Usar Immutability en @Input() (spread operator, Object.assign)',
          'Emitir eventos con @Output() EventEmitter',
          'Validar performance con Angular DevTools Profiler'
        ],
        color: 'purple'
      },
      {
        phase: 'Fase 4: Smart/Dumb Pattern',
        icon: '🏗️',
        tasks: [
          'Extraer lógica de negocio a Smart Components (container)',
          'Crear Dumb Components (presentational) con @Input/@Output',
          'Inyectar servicios solo en Smart Components',
          'Testear Dumb Components con inputs mockeados'
        ],
        color: 'orange'
      }
    ]
  };

  // Slide 4: Unsubscribe Patterns
  unsubscribePatterns = {
    legacy: {
      title: '❌ Patrón Legacy (Evitar)',
      code: `// ❌ Memory leak - subscription sin unsubscribe
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // 🔥 PROBLEMA: Esta subscription nunca se limpia
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}`,
      problems: [
        'Subscription activa después de destruir componente',
        'Memory leak acumulativo en navegación',
        'Event listeners zombies consumiendo CPU'
      ]
    },
    takeUntilDestroyed: {
      title: '✅ takeUntilDestroyed (Angular 16+)',
      code: `// ✅ MODERNO: Auto-unsubscribe con takeUntilDestroyed
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class UserListComponent implements OnInit {
  users: User[] = [];
  private destroyRef = inject(DestroyRef);

  constructor(private userService: UserService) {}

  ngOnInit() {
    // ✅ Auto-cleanup cuando componente se destruye
    this.userService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => this.users = users);
  }
}`,
      benefits: [
        'No necesita ngOnDestroy manual',
        'Más corto y declarativo',
        'Recomendado para Angular 16+'
      ]
    },
    takeUntil: {
      title: '✅ takeUntil (Angular <16)',
      code: `// ✅ CLÁSICO: takeUntil con Subject
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.users = users);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      benefits: [
        'Compatible con Angular 10+',
        'Patrón probado y estable',
        'Limpia múltiples subscriptions con un Subject'
      ]
    }
  };

  // Slide 5: Change Detection Strategy
  changeDetectionStrategy = {
    default: {
      title: '⚠️ Default Change Detection',
      description: 'Angular revisa TODO el árbol de componentes en cada evento (click, http, timer)',
      code: `// ⚠️ Default: Change detection en TODOS los componentes
@Component({
  selector: 'app-user-list',
  // Por defecto: ChangeDetectionStrategy.Default
  template: \`
    <div *ngFor="let user of users">
      {{ user.name }} - {{ heavyCalculation(user) }}
    </div>
  \`
})
export class UserListComponent {
  @Input() users: User[] = [];

  heavyCalculation(user: User) {
    // 🔥 Se ejecuta en CADA change detection
    return expensiveOperation(user);
  }
}`,
      problems: [
        'CD se ejecuta aunque @Input no cambie',
        'Funciones en template se ejecutan constantemente',
        'Impacto exponencial con muchos componentes'
      ]
    },
    onPush: {
      title: '✅ OnPush Change Detection',
      description: 'Angular solo revisa el componente cuando @Input cambia (referencia), @Output emite, o se llama markForCheck()',
      code: `// ✅ OnPush: Change detection optimizada
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngFor="let user of users">
      {{ user.name }}
    </div>
  \`
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Output() userClick = new EventEmitter<User>();

  onUserClick(user: User) {
    this.userClick.emit(user); // ✅ Trigger CD
  }
}`,
      benefits: [
        'CD solo cuando @Input reference cambia',
        'Mejor performance en listas grandes',
        'Fuerza inmutabilidad (buena práctica)'
      ],
      requirements: [
        'Usar inmutabilidad en @Input (spread, Object.assign)',
        'Emitir eventos con @Output en lugar de modificar state',
        'Usar async pipe para observables (auto markForCheck)'
      ]
    },
    immutability: {
      title: '🔄 Inmutabilidad para OnPush',
      code: `// ❌ Mutación directa - OnPush NO detecta cambio
updateUser(userId: string, newName: string) {
  const user = this.users.find(u => u.id === userId);
  user.name = newName; // ❌ Misma referencia, OnPush ignora
}

// ✅ Nueva referencia - OnPush detecta cambio
updateUser(userId: string, newName: string) {
  this.users = this.users.map(u =>
    u.id === userId
      ? { ...u, name: newName } // ✅ Nuevo objeto
      : u
  );
}`
    }
  };

  // Slide 6: Challenge
  challenge = {
    title: 'Refactorizar Componente Legacy a Patrón Moderno',
    difficulty: 'Avanzado',
    time: '30 minutos',
    description: 'Refactorizar un componente Angular legacy con memory leaks y Default CD a patrón moderno con OnPush, takeUntil y smart/dumb separation',
    legacyCode: `// ❌ LEGACY: UserDashboardComponent (todo en uno)
@Component({
  selector: 'app-user-dashboard',
  template: \`
    <div class="dashboard">
      <h2>Users: {{ users.length }}</h2>
      <input [(ngModel)]="searchTerm" (input)="onSearch()">

      <div *ngFor="let user of filteredUsers">
        <span>{{ user.name }}</span>
        <button (click)="deleteUser(user.id)">Delete</button>
      </div>
    </div>
  \`
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    // 🔥 Memory leak - sin unsubscribe
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });

    // 🔥 Memory leak - polling cada 5s
    interval(5000).subscribe(() => {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      });
    });
  }

  onSearch() {
    // 🔥 Lógica de filtrado en componente
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteUser(id: string) {
    // 🔥 API call directo en componente
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }
}`,
    requirements: [
      'Implementar takeUntilDestroyed o takeUntil para todas las subscriptions',
      'Cambiar a OnPush Change Detection',
      'Separar en Smart Component (container) y Dumb Component (presentational)',
      'Extraer lógica de filtrado a servicio o pipe',
      'Usar inmutabilidad para updates'
    ],
    hints: [
      'Smart Component: maneja subscriptions, servicios y estado',
      'Dumb Component: recibe @Input y emite @Output',
      'Usa async pipe para observables (auto unsubscribe)',
      'switchMap para cancelar requests anteriores',
      'Crea UserListComponent (dumb) + UserDashboardComponent (smart)'
    ]
  };

  // Slide 7: Best Practices
  bestPractices = [
    {
      category: 'Memory Management',
      icon: '💾',
      practices: [
        'Usar takeUntilDestroyed (Angular 16+) o takeUntil pattern',
        'Preferir async pipe sobre subscribe manual',
        'Validar memory leaks con Chrome DevTools Memory Profiler',
        'Evitar subscriptions en ngAfterViewInit sin cleanup'
      ]
    },
    {
      category: 'Change Detection',
      icon: '⚡',
      practices: [
        'OnPush en todos los componentes presentacionales',
        'Inmutabilidad con spread operator o libraries (immer.js)',
        'Evitar funciones en templates (usar pipes puros)',
        'Medir performance con Angular DevTools Profiler'
      ]
    },
    {
      category: 'Component Architecture',
      icon: '🏗️',
      practices: [
        'Separar Smart (container) y Dumb (presentational) components',
        'Smart: maneja estado, servicios, routing',
        'Dumb: @Input/@Output, sin inyección de servicios',
        'Reusar Dumb components en múltiples Smart components'
      ]
    },
    {
      category: 'RxJS Operators',
      icon: '🔧',
      practices: [
        'switchMap para auto-cancelar requests anteriores',
        'shareReplay(1) para cachear HTTP responses',
        'debounceTime para inputs (evitar requests excesivos)',
        'combineLatest para combinar múltiples observables'
      ]
    },
    {
      category: 'Testing',
      icon: '🧪',
      practices: [
        'Testear Dumb components con inputs mockeados (fácil)',
        'Testear Smart components mockeando servicios',
        'Usar marble testing para observables complejos',
        'Validar unsubscribe con spy on ngOnDestroy'
      ]
    }
  ];

  // Slide 8: Summary
  summary = {
    achievements: [
      'Eliminación de memory leaks con takeUntil/takeUntilDestroyed',
      'Optimización de performance con OnPush Change Detection',
      'Arquitectura escalable con Smart/Dumb pattern',
      'Código más testeable y mantenible'
    ],
    tools: [
      {
        name: 'Chrome DevTools',
        icon: '🔍',
        use: 'Memory Profiler para detectar leaks'
      },
      {
        name: 'Angular DevTools',
        icon: '📊',
        use: 'Profiler para medir Change Detection'
      },
      {
        name: 'RxJS Operators',
        icon: '🔧',
        use: 'takeUntil, switchMap, shareReplay'
      }
    ],
    nextSteps: [
      'Clase 8: Estado Complejo con RxJS (BehaviorSubject, State Management)',
      'Migración a Signals (Angular 16+) para reactive state',
      'Performance profiling en producción con Lighthouse'
    ]
  };

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }
}
