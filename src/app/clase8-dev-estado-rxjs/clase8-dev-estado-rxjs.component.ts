import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase8-dev-estado-rxjs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase8-dev-estado-rxjs.component.html',
  styleUrls: ['./clase8-dev-estado-rxjs.component.css', '../shared-presentation.css']
})
export class Clase8DevEstadoRxjsComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'state-patterns' },
    { type: 'behaviorsubject' },
    { type: 'operators' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  // Slide 2: Context
  context = {
    scenario: 'Una aplicación Angular enterprise necesita gestionar estado complejo compartido entre múltiples componentes: autenticación, carrito de compras, notificaciones en tiempo real y preferencias de usuario. Sin un state management adecuado, el código se vuelve un "spaghetti" de @Input/@Output y servicios acoplados.',
    problems: [
      {
        icon: '🔄',
        title: 'Prop Drilling',
        description: '@Input/@Output anidados en 5+ niveles de componentes',
        color: 'red'
      },
      {
        icon: '🐛',
        title: 'Estado Inconsistente',
        description: 'Múltiples componentes con copias desincronizadas del mismo estado',
        color: 'orange'
      },
      {
        icon: '⚡',
        title: 'Race Conditions',
        description: 'Requests simultáneos sobrescribiendo datos sin control',
        color: 'yellow'
      },
      {
        icon: '🎯',
        title: 'No Single Source of Truth',
        description: 'Estado distribuido sin patrón centralizado',
        color: 'purple'
      }
    ],
    whenUseRxJS: [
      'Estado compartido entre 3+ componentes no relacionados',
      'Datos en tiempo real (WebSockets, Server-Sent Events)',
      'Aplicaciones medianas sin justificar NgRx/Akita',
      'Necesitas Observable-based API (async pipe friendly)',
      'Cache y sincronización de datos con backend'
    ],
    whenUseNgRx: [
      'Aplicaciones enterprise con 50+ componentes',
      'Necesitas time-travel debugging (DevTools)',
      'Equipo familiarizado con Redux pattern',
      'Auditoría completa de cambios de estado',
      'Testing exhaustivo con predictibilidad total'
    ]
  };

  // Slide 3: State Patterns
  statePatterns = {
    naive: {
      title: '❌ Patrón Naive (Evitar)',
      description: 'Servicio con Subject expuesto públicamente - cualquiera puede emitir valores',
      code: `// ❌ PROBLEMA: Subject público - no hay encapsulación
export class CartService {
  // 🔥 Cualquier componente puede hacer cart$.next(...)
  cart$ = new Subject<CartItem[]>();

  addItem(item: CartItem) {
    // ❌ No hay estado actual, solo emisión de eventos
    this.cart$.next([item]);
  }
}`,
      problems: [
        'Subject público permite mutaciones desde cualquier lugar',
        'No hay "current state" - solo eventos',
        'Race conditions al emitir valores simultáneamente',
        'Imposible testear con marble testing'
      ]
    },
    behaviorSubject: {
      title: '✅ BehaviorSubject + Encapsulación',
      description: 'Estado privado con BehaviorSubject, exposición pública con asObservable()',
      code: `// ✅ CORRECTO: BehaviorSubject privado + Observable público
export class CartService {
  // Estado privado - nadie puede mutar desde afuera
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // Exposición pública READ-ONLY
  cart$ = this.cartSubject.asObservable();

  // Métodos controlados para mutación
  addItem(item: CartItem) {
    const current = this.cartSubject.value; // Acceso al estado actual
    this.cartSubject.next([...current, item]); // Inmutabilidad
  }

  removeItem(id: string) {
    const current = this.cartSubject.value;
    this.cartSubject.next(current.filter(i => i.id !== id));
  }

  clear() {
    this.cartSubject.next([]);
  }
}`,
      benefits: [
        'Encapsulación: Solo el servicio muta estado',
        'Current value: Acceso sincrónico con .value',
        'Inmutabilidad forzada con spread operator',
        'Observable público para subscripción con async pipe'
      ]
    },
    derived: {
      title: '🔄 Estado Derivado (Computed)',
      description: 'Crear observables derivados del estado base con operadores RxJS',
      code: `export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Estado derivado: Total items
  totalItems$ = this.cart$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  // Estado derivado: Total precio
  totalPrice$ = this.cart$.pipe(
    map(items => items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    ))
  );

  // Estado derivado: Items vacío
  isEmpty$ = this.cart$.pipe(
    map(items => items.length === 0)
  );
}`
    }
  };

  // Slide 4: BehaviorSubject Deep Dive
  behaviorSubjectDetails = {
    concept: {
      title: '📊 BehaviorSubject: Concepto',
      description: 'Subject que almacena el último valor emitido y lo entrega inmediatamente a nuevos suscriptores',
      example: `// BehaviorSubject vs Subject
const subject$ = new Subject<number>();
subject$.subscribe(val => console.log('Sub1:', val));
subject$.next(1); // Sub1: 1
subject$.subscribe(val => console.log('Sub2:', val)); // ❌ No recibe nada
subject$.next(2); // Sub1: 2, Sub2: 2

const behavior$ = new BehaviorSubject<number>(0); // Valor inicial
behavior$.subscribe(val => console.log('Sub1:', val)); // Sub1: 0
behavior$.next(1); // Sub1: 1
behavior$.subscribe(val => console.log('Sub2:', val)); // ✅ Sub2: 1 (último valor)
behavior$.next(2); // Sub1: 2, Sub2: 2`
    },
    stateService: {
      title: '🏗️ State Service Pattern',
      code: `// Pattern genérico para State Service
export class StateService<T> {
  private state$ = new BehaviorSubject<T>(this.initialState);

  // Selector público
  select$ = this.state$.asObservable();

  constructor(private initialState: T) {}

  // Mutation genérica
  protected setState(newState: Partial<T>) {
    this.state$.next({
      ...this.state$.value,
      ...newState
    });
  }

  protected getState(): T {
    return this.state$.value;
  }

  // Selector específico
  select<K>(selector: (state: T) => K): Observable<K> {
    return this.select$.pipe(
      map(selector),
      distinctUntilChanged() // Evita emisiones duplicadas
    );
  }
}

// Uso concreto
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserStateService extends StateService<UserState> {
  constructor() {
    super({ user: null, loading: false, error: null });
  }

  // Selectores específicos
  user$ = this.select(state => state.user);
  loading$ = this.select(state => state.loading);
  error$ = this.select(state => state.error);

  // Acciones
  loadUser() {
    this.setState({ loading: true, error: null });
    this.http.get<User>('/api/user').subscribe({
      next: user => this.setState({ user, loading: false }),
      error: err => this.setState({ error: err.message, loading: false })
    });
  }
}`
    }
  };

  // Slide 5: Operadores Clave
  operators = {
    shareReplay: {
      title: '📡 shareReplay(1) - Cache HTTP',
      description: 'Evita múltiples requests HTTP cachando la última respuesta',
      code: `// ❌ SIN shareReplay: 3 subscriptions = 3 HTTP requests
export class ProductService {
  getProducts() {
    return this.http.get<Product[]>('/api/products');
  }
}

// Component A
this.products$ = this.service.getProducts(); // Request 1

// Component B
this.products$ = this.service.getProducts(); // Request 2

// Component C
this.products$ = this.service.getProducts(); // Request 3

// ✅ CON shareReplay: 1 request para N subscriptions
export class ProductService {
  products$ = this.http.get<Product[]>('/api/products').pipe(
    shareReplay(1) // Cache último valor para nuevos suscriptores
  );
}

// Component A, B, C
this.products$ = this.service.products$; // Solo 1 request HTTP`,
      benefits: [
        'Evita requests duplicados',
        'Cache automático del último valor',
        'Multicasting: 1 source → N subscribers',
        'Ideal para datos que cambian poco (config, user profile)'
      ]
    },
    combineLatest: {
      title: '🔀 combineLatest - Merge Streams',
      description: 'Combina múltiples observables emitiendo cuando cualquiera cambia',
      code: `// Combinar múltiples estados
export class DashboardComponent {
  vm$ = combineLatest({
    user: this.userService.user$,
    cart: this.cartService.cart$,
    notifications: this.notificationService.notifications$
  }).pipe(
    map(({ user, cart, notifications }) => ({
      userName: user?.name,
      cartCount: cart.length,
      unreadCount: notifications.filter(n => !n.read).length
    }))
  );
}

// Template con async pipe
<div *ngIf="vm$ | async as vm">
  <p>Welcome {{ vm.userName }}</p>
  <p>Cart: {{ vm.cartCount }} items</p>
  <p>Notifications: {{ vm.unreadCount }}</p>
</div>`
    },
    switchMap: {
      title: '🔄 switchMap - Auto-cancel',
      description: 'Cancela request anterior cuando llega nuevo (ideal para search)',
      code: `// Search con auto-cancel de requests anteriores
export class SearchComponent {
  searchTerm$ = new Subject<string>();

  results$ = this.searchTerm$.pipe(
    debounceTime(300), // Espera 300ms sin cambios
    distinctUntilChanged(), // Ignora valores duplicados
    switchMap(term =>
      this.searchService.search(term) // Cancela request anterior
    )
  );
}

// Template
<input (input)="searchTerm$.next($event.target.value)">
<div *ngFor="let result of results$ | async">{{ result }}</div>`
    }
  };

  // Slide 6: Challenge
  challenge = {
    title: 'State Service con Operaciones Complejas',
    difficulty: 'Avanzado',
    time: '45 minutos',
    description: 'Crear un State Service para gestionar un carrito de compras con operaciones avanzadas: agregar, remover, actualizar cantidad, aplicar cupones y calcular totales con impuestos',
    requirements: [
      'BehaviorSubject privado con estado CartState (items, coupon, loading)',
      'Observable público cart$ con asObservable()',
      'Métodos: addItem, removeItem, updateQuantity, applyCoupon',
      'Estado derivado: totalItems$, subtotal$, discount$, tax$, total$',
      'Integración con HTTP: loadCart(), syncCart() con shareReplay',
      'Manejo de errores con catchError y error state'
    ],
    hints: [
      'Usar map para transformaciones de array inmutables',
      'combineLatest para calcular total con múltiples inputs',
      'switchMap para cancelar syncCart() anteriores',
      'distinctUntilChanged en selectores para evitar re-renders',
      'Definir interface CartState con tipado estricto'
    ],
    bonus: [
      'Agregar undo/redo con historial de estados (array de snapshots)',
      'Persistir estado en localStorage con tap operator',
      'Crear facade service para encapsular múltiples state services',
      'Implementar optimistic updates (actualizar UI antes de confirmar backend)'
    ]
  };

  // Slide 7: Best Practices
  bestPractices = [
    {
      category: 'State Management',
      icon: '🎯',
      practices: [
        'BehaviorSubject privado + asObservable() para encapsulación',
        'Inmutabilidad con spread operator en todas las mutaciones',
        'Estado derivado con operadores map, no en componentes',
        'Single source of truth: 1 BehaviorSubject por entidad'
      ]
    },
    {
      category: 'Performance',
      icon: '⚡',
      practices: [
        'shareReplay(1) en HTTP requests para cache',
        'distinctUntilChanged() en selectores para evitar re-renders',
        'Unsubscribe con takeUntilDestroyed en subscriptions manuales',
        'Async pipe en templates (auto-unsubscribe)'
      ]
    },
    {
      category: 'Operadores RxJS',
      icon: '🔧',
      practices: [
        'switchMap para cancelar requests (search, autocomplete)',
        'combineLatest para merge de múltiples streams',
        'debounceTime para inputs (300ms recomendado)',
        'catchError para manejo de errores sin romper stream'
      ]
    },
    {
      category: 'Arquitectura',
      icon: '🏗️',
      practices: [
        'State Service por feature (UserState, CartState, etc.)',
        'Facade Service para coordinar múltiples states',
        'No mezclar estado local (component) con global (service)',
        'Interfaces TypeScript estrictas para todo el estado'
      ]
    },
    {
      category: 'Testing',
      icon: '🧪',
      practices: [
        'Marble testing para observables complejos',
        'Mockear BehaviorSubject con { value: mockValue }',
        'Testear estado derivado con subscribe + expectations',
        'Usar fakeAsync + tick para operadores con tiempo (debounce)'
      ]
    }
  ];

  // Slide 8: Summary
  summary = {
    achievements: [
      'Gestión de estado complejo con BehaviorSubject',
      'Encapsulación y Single Source of Truth',
      'Operadores RxJS para flujos reactivos',
      'Performance con shareReplay y distinctUntilChanged'
    ],
    rxjsOperators: [
      {
        name: 'shareReplay',
        icon: '📡',
        use: 'Cache HTTP responses'
      },
      {
        name: 'combineLatest',
        icon: '🔀',
        use: 'Merge múltiples streams'
      },
      {
        name: 'switchMap',
        icon: '🔄',
        use: 'Auto-cancel requests'
      },
      {
        name: 'distinctUntilChanged',
        icon: '🎯',
        use: 'Evitar emisiones duplicadas'
      }
    ],
    comparison: [
      {
        aspect: 'Cuándo usar RxJS State',
        description: 'Apps medianas con 3-20 features que necesitan estado compartido sin complejidad de NgRx'
      },
      {
        aspect: 'Cuándo usar NgRx',
        description: 'Apps enterprise con 50+ componentes que requieren time-travel debugging y auditoría completa'
      },
      {
        aspect: 'Cuándo usar Signals (Angular 16+)',
        description: 'Estado reactivo con mejor performance y menos boilerplate que RxJS para casos simples'
      }
    ],
    nextSteps: [
      'Clase 9: Testing E2E con Cypress (mocking API calls)',
      'Migración incremental a Signals (Angular 16+)',
      'Explorar Akita como alternativa ligera a NgRx'
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
