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
    scenario: 'Un proyecto Angular legacy tiene componentes con memory leaks, change detection ineficiente y código difícil de mantener. Los componentes suscriben observables sin unsubscribe, usan la estrategia legacy Eager (Default en v21 y anterior) y mezclan lógica de negocio con presentación.',
    problems: [
      {
        icon: '💧',
        title: 'Memory Leaks',
        description: 'Subscripciones sin unsubscribe causan fugas de memoria',
        color: 'red'
      },
      {
        icon: '🔄',
        title: 'Change Detection Eager (Legado)',
        description: 'ChangeDetectionStrategy.Eager (renombrado de Default en Angular 22) ejecuta CD en toda la app constantemente',
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
      'Eliminar memory leaks con takeUntilDestroyed (Angular 16+)',
      'OnPush es el default en Angular 22: migrar componentes Eager a OnPush o Signals',
      'Separar componentes smart (container) y dumb (presentational)',
      'Migrar estado de BehaviorSubject a signal() + computed() (Signals)',
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
          'Listar componentes con CD Eager (ChangeDetectionStrategy.Eager)',
          'Priorizar por impacto en performance (Angular DevTools + Chrome DevTools)'
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
        phase: 'Fase 3: OnPush Strategy (Default en Angular 22)',
        icon: '⚡',
        tasks: [
          'En Angular 22, OnPush es el DEFAULT. Componentes nuevos ya lo usan',
          'Componentes legacy con Eager: migrar a OnPush o a Signals',
          'Usar Immutability en @Input() (spread operator, Object.assign)',
          'Validar performance con Angular DevTools Profiler'
        ],
        color: 'purple'
      },
      {
        phase: 'Fase 4: Smart/Dumb Pattern',
        icon: '🏗️',
        tasks: [
          'Extraer lógica de negocio a Smart Components (container)',
          'Crear Dumb Components (presentational) con input()/output() signals',
          'Inyectar servicios solo en Smart Components',
          'Testear Dumb Components con inputs mockeados'
        ],
        color: 'orange'
      },
      {
        phase: 'Fase 5: Migración a Signals (Angular 22)',
        icon: '🚦',
        tasks: [
          'Reemplazar BehaviorSubject de estado local con signal()',
          'Usar computed() para estado derivado (reemplaza combineLatest)',
          'Migrar @Input() a input() signals para mejor type safety',
          'Usar ng generate @angular/core:signal-input-migration (CLI schematic)'
        ],
        color: 'teal'
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
      title: '⚠️ Eager Change Detection (Angular 22: renombrado de Default)',
      description: 'Angular revisa TODO el árbol de componentes en cada evento. Renombrado a Eager en Angular 22. Los nuevos componentes usan OnPush automáticamente.',
      code: `// ⚠️ Eager (antes Default): Change detection en TODOS los componentes
@Component({
  selector: 'app-user-list',
  // Angular 22: Eager es el modo antiguo (antes se llamaba Default)
  changeDetection: ChangeDetectionStrategy.Eager, // ← modo legacy
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
        'Impacto exponencial con muchos componentes',
        'En Angular 22, los componentes nuevos ya NO usan Eager por defecto'
      ]
    },
    onPush: {
      title: '✅ OnPush Change Detection (DEFAULT en Angular 22)',
      description: 'En Angular 22, OnPush es la estrategia por defecto. Angular solo revisa el componente cuando signal cambia, @Input cambia (referencia), o @Output emite.',
      code: `// ✅ OnPush: DEFAULT en Angular 22 para nuevos componentes
@Component({
  selector: 'app-user-list',
  // Angular 22: OnPush es el default, no necesitas especificarlo
  // changeDetection: ChangeDetectionStrategy.OnPush, ← implícito
  template: \`
    @for (user of users(); track user.id) {  <!-- @for: control flow Angular 17+ -->
      <div>{{ user.name }}</div>
    }
  \`
})
export class UserListComponent {
  // Angular 22: input() signal en lugar de @Input() decorator
  readonly users = input<User[]>([]);
  readonly userClick = output<User>();  // output() en lugar de @Output()

  onUserClick(user: User) {
    this.userClick.emit(user); // ✅ Trigger CD
  }
}`,
      benefits: [
        'CD solo cuando signal cambia o @Input reference cambia',
        'Mejor performance en listas grandes',
        'Fuerza inmutabilidad (buena práctica)',
        'En Angular 22, es el comportamiento por defecto sin config adicional'
      ],
      requirements: [
        'Usar inmutabilidad en inputs (spread, Object.assign)',
        'Preferir signal() y input() para máxima eficiencia',
        'Usar async pipe o toSignal() para observables (auto markForCheck)'
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
      'OnPush como DEFAULT en Angular 22 (sin configuración adicional)',
      'Arquitectura escalable con Smart/Dumb pattern + Signals',
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
        use: 'Profiler para medir Change Detection (Signals-aware)'
      },
      {
        name: 'RxJS + Signals Interop',
        icon: '🔧',
        use: 'toSignal(), toObservable(), takeUntilDestroyed'
      }
    ],
    nextSteps: [
      'Clase 8: Estado Complejo con RxJS + Signals (signal(), computed(), rxResource)',
      'Migración a Signal Forms (Angular 22) para formularios reactivos modernos',
      'Performance profiling en producción con Lighthouse + Angular DevTools'
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
