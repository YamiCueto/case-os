import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase9-dev-testing-e2e',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase9-dev-testing-e2e.component.html',
  styleUrls: ['./clase9-dev-testing-e2e.component.css', '../shared-presentation.css']
})
export class Clase9DevTestingE2eComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'setup' },
    { type: 'page-object' },
    { type: 'api-mocking' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  // Slide 1: Title
  titleSlide = {
    title: 'Testing E2E con Cypress',
    subtitle: 'Pruebas End-to-End en Angular',
    icon: '🧪',
    description: 'Aprende a implementar pruebas E2E efectivas usando Cypress para validar flujos completos de usuario en aplicaciones Angular.'
  };

  // Slide 2: Context
  context = {
    scenario: {
      icon: '🏢',
      text: 'Tu equipo lanzó una aplicación Angular en producción. Los unit tests pasan, los integration tests también, pero los usuarios reportan bugs en flujos críticos que nadie detectó.'
    },
    problems: [
      {
        icon: '❌',
        titulo: 'Tests Unitarios Insuficientes',
        descripcion: 'Los unit tests validan componentes aislados pero no prueban la integración real entre módulos, servicios y navegación.',
        color: 'red'
      },
      {
        icon: '🔗',
        titulo: 'Integración No Validada',
        descripcion: 'Las interacciones entre frontend, backend, y autenticación solo se prueban manualmente, causando regresiones frecuentes.',
        color: 'orange'
      },
      {
        icon: '👤',
        titulo: 'Flujos de Usuario Rotos',
        descripcion: 'Cambios en rutas, formularios o estados rompen flujos completos (login → dashboard → acción) que nadie valida automáticamente.',
        color: 'yellow'
      },
      {
        icon: '⏱️',
        titulo: 'Testing Manual Lento',
        descripcion: 'El QA manual de flujos críticos toma horas por release, ralentizando deploys y aumentando el riesgo de bugs en producción.',
        color: 'purple'
      }
    ],
    solution: 'Cypress permite automatizar pruebas E2E que validan flujos completos de usuario, desde el login hasta acciones críticas, con feedback rápido y confiable.'
  };

  // Slide 3: Setup
  setup = {
    installation: {
      titulo: 'Instalación con Schematic',
      command: 'ng add @cypress/schematic',
      description: 'Angular Schematic oficial que configura Cypress automáticamente: instala dependencias, crea cypress.config.ts, y ajusta angular.json.'
    },
    projectStructure: {
      titulo: 'Estructura del Proyecto',
      folders: [
        { name: 'cypress/', description: 'Carpeta raíz de Cypress' },
        { name: '  e2e/', description: 'Tests E2E (spec files)' },
        { name: '  fixtures/', description: 'Mock data JSON' },
        { name: '  support/', description: 'Commands + helpers' }
      ]
    },
    config: {
      titulo: 'Configuración Básica',
      description: 'cypress.config.ts define la URL base, timeouts, viewport, y opciones de video/screenshots.',
      code: `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Custom plugins
    }
  }
});`
    },
    runCommands: {
      titulo: 'Comandos para Ejecutar',
      commands: [
        { command: 'npx cypress open', description: 'Abre el Test Runner interactivo (modo desarrollo)' },
        { command: 'npx cypress run', description: 'Ejecuta tests en headless mode (CI/CD)' }
      ]
    }
  };

  // Slide 4: Page Object
  pageObject = {
    concept: {
      icon: '📄',
      titulo: 'Qué es Page Object',
      description: 'Patrón que encapsula selectores y acciones de una página en una clase, separando la lógica de interacción de los tests. Facilita mantenimiento cuando cambia el HTML.'
    },
    withoutPattern: {
      titulo: '❌ Sin Page Object (Frágil)',
      description: 'Selectores duplicados en múltiples tests. Si cambia el HTML, hay que actualizar todos los tests.',
      code: `describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show error on invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('wrong@test.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('be.visible');
  });
});`
    },
    withPattern: {
      titulo: '✅ Con Page Object (Mantenible)',
      description: 'Selectores centralizados en LoginPage. Cambios en HTML solo afectan la clase, no los tests.',
      pageObjectCode: `// cypress/support/pages/login.page.ts
export class LoginPage {
  private selectors = {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '.error-message'
  };

  visit() {
    cy.visit('/login');
  }

  fillEmail(email: string) {
    cy.get(this.selectors.emailInput).type(email);
  }

  fillPassword(password: string) {
    cy.get(this.selectors.passwordInput).type(password);
  }

  submit() {
    cy.get(this.selectors.submitButton).click();
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }
}`,
      testCode: `// cypress/e2e/login.cy.ts
import { LoginPage } from '../support/pages/login.page';

describe('Login Flow', () => {
  const loginPage = new LoginPage();

  it('should login successfully', () => {
    loginPage.visit();
    loginPage.fillEmail('user@test.com');
    loginPage.fillPassword('password123');
    loginPage.submit();
    cy.url().should('include', '/dashboard');
  });

  it('should show error on invalid credentials', () => {
    loginPage.visit();
    loginPage.fillEmail('wrong@test.com');
    loginPage.fillPassword('wrongpass');
    loginPage.submit();
    loginPage.getErrorMessage().should('be.visible');
  });
});`
    },
    benefits: [
      { icon: '🔧', text: 'Mantenibilidad: Cambios en selectores solo afectan Page Object' },
      { icon: '♻️', text: 'Reusabilidad: Métodos compartidos entre múltiples tests' },
      { icon: '📖', text: 'Legibilidad: Tests más claros y descriptivos' }
    ]
  };

  // Slide 5: API Mocking
  apiMocking = {
    concept: {
      icon: '🔌',
      titulo: 'Por Qué Mockear APIs',
      reasons: [
        'Tests independientes del backend (no requieren servidor corriendo)',
        'Simular errores, timeouts, y edge cases difíciles de reproducir',
        'Velocidad: respuestas instantáneas sin latencia de red',
        'Determinismo: mismos datos siempre, tests más confiables'
      ]
    },
    basicIntercept: {
      titulo: 'Intercept Básico',
      description: 'cy.intercept() captura peticiones HTTP y permite mockear respuestas.',
      code: `describe('User List', () => {
  it('should display users from API', () => {
    // Mock de respuesta de GET /api/users
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Alice', email: 'alice@test.com' },
        { id: 2, name: 'Bob', email: 'bob@test.com' }
      ]
    }).as('getUsers');

    cy.visit('/users');
    cy.wait('@getUsers'); // Espera a que se complete la petición
    cy.get('.user-card').should('have.length', 2);
    cy.contains('Alice').should('be.visible');
  });
});`
    },
    fixturesIntercept: {
      titulo: 'Usando Fixtures',
      description: 'Fixtures son archivos JSON en cypress/fixtures/ que centralizan mock data reutilizable.',
      fixtureFile: `// cypress/fixtures/users.json
[
  { "id": 1, "name": "Alice", "email": "alice@test.com" },
  { "id": 2, "name": "Bob", "email": "bob@test.com" },
  { "id": 3, "name": "Charlie", "email": "charlie@test.com" }
]`,
      testCode: `describe('User List with Fixture', () => {
  it('should display users from fixture', () => {
    cy.intercept('GET', '/api/users', { fixture: 'users.json' })
      .as('getUsers');

    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('.user-card').should('have.length', 3);
  });
});`
    },
    errorSimulation: {
      titulo: 'Simulación de Errores',
      description: 'Simular errores HTTP para validar manejo de errores en la UI.',
      code: `describe('Error Handling', () => {
  it('should show error message on API failure', () => {
    cy.intercept('GET', '/api/users', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getUsersError');

    cy.visit('/users');
    cy.wait('@getUsersError');
    cy.get('.error-banner')
      .should('be.visible')
      .and('contain', 'Error al cargar usuarios');
  });

  it('should show loading spinner on slow API', () => {
    cy.intercept('GET', '/api/users', (req) => {
      req.reply({
        delay: 3000, // Simula latencia de 3 segundos
        statusCode: 200,
        body: []
      });
    }).as('getSlowUsers');

    cy.visit('/users');
    cy.get('.loading-spinner').should('be.visible');
    cy.wait('@getSlowUsers');
    cy.get('.loading-spinner').should('not.exist');
  });
});`
    }
  };

  // Slide 6: Challenge
  challenge = {
    title: 'Desafío Práctico',
    description: 'Implementa tests E2E para un flujo de checkout completo en un e-commerce.',
    difficulty: 'avanzado',
    timeEstimate: '45-60 min',
    sections: [
      {
        titulo: '📋 Requisitos del Test',
        items: [
          'Test completo del flujo: Product List → Product Detail → Add to Cart → Checkout → Order Confirmation',
          'Mockear APIs: GET /api/products, POST /api/orders, GET /api/cart',
          'Implementar Page Objects para ProductListPage, ProductDetailPage, CartPage, CheckoutPage',
          'Validar que el precio total se calcula correctamente (suma productos + shipping)',
          'Simular error en POST /api/orders y validar mensaje de error en UI'
        ]
      },
      {
        titulo: '🎯 Escenarios a Probar',
        items: [
          'Happy path: Usuario completa compra exitosamente',
          'Error path: Falla el submit de orden, mostrar error y permitir reintentar',
          'Edge case: Carrito vacío no permite ir a checkout',
          'Validación: Formulario de checkout requiere campos obligatorios (nombre, dirección, tarjeta)'
        ]
      },
      {
        titulo: '🔧 Bonus Points',
        items: [
          'Usar cy.session() para mantener autenticación entre tests',
          'Implementar custom command cy.addProductToCart(productId)',
          'Capturar screenshots en cada paso del flujo para debugging',
          'Parametrizar tests con múltiples productos usando cy.each()'
        ]
      }
    ]
  };

  // Slide 7: Best Practices
  bestPractices = [
    {
      categoria: 'Selectores',
      icon: '🎯',
      good: [
        'Usar data-cy="selector" para elementos interactivos',
        'Evitar selectores CSS frágiles (clases de estilo, IDs generados)',
        'Preferir cy.findByRole() de Testing Library para accesibilidad'
      ],
      bad: [
        'Depender de clases CSS (.btn-primary puede cambiar)',
        'Usar nth-child() o :first que rompen con cambios en layout',
        'Selectores XPath complejos difíciles de mantener'
      ]
    },
    {
      categoria: 'Esperas y Timeouts',
      icon: '⏱️',
      good: [
        'Usar cy.wait(@alias) para esperar peticiones HTTP específicas',
        'Aprovechar auto-retry de Cypress (cy.get() reintenta automáticamente)',
        'Configurar timeouts globales en cypress.config.ts'
      ],
      bad: [
        'cy.wait(5000) con tiempo fijo (flaky tests)',
        'Asumir que elementos aparecen instantáneamente',
        'No usar .should() para validar estado antes de interactuar'
      ]
    },
    {
      categoria: 'Organización de Tests',
      icon: '📁',
      good: [
        'Agrupar tests por feature/módulo (auth.cy.ts, checkout.cy.ts)',
        'Usar beforeEach() para setup común (login, reset state)',
        'Implementar Page Objects para lógica reutilizable'
      ],
      bad: [
        'Tests monolíticos de 200+ líneas que prueban todo',
        'Duplicar código de setup en cada test',
        'Tests interdependientes (orden de ejecución importa)'
      ]
    },
    {
      categoria: 'Datos de Test',
      icon: '📊',
      good: [
        'Usar fixtures para mock data consistente y reutilizable',
        'Generar datos dinámicos con faker.js para casos edge',
        'Resetear estado con cy.clearLocalStorage() entre tests'
      ],
      bad: [
        'Hardcodear datos de test en múltiples archivos',
        'Depender de datos de producción (cambian constantemente)',
        'No limpiar estado entre tests (localStorage, cookies)'
      ]
    },
    {
      categoria: 'CI/CD Integration',
      icon: '🚀',
      good: [
        'Ejecutar tests en headless mode (npx cypress run)',
        'Paralelizar tests con Cypress Cloud o nx para velocidad',
        'Capturar videos/screenshots solo en failure para debugging'
      ],
      bad: [
        'Ejecutar todos los tests en un solo job (lento)',
        'No configurar retry strategy para tests flaky',
        'Ignorar failures en CI ("lo arreglaremos después")'
      ]
    }
  ];

  // Slide 8: Summary
  summary = {
    achievements: [
      { icon: '✅', text: 'Configuraste Cypress en Angular con ng add @cypress/schematic' },
      { icon: '📄', text: 'Implementaste Page Object Pattern para tests mantenibles' },
      { icon: '🔌', text: 'Mockeaste APIs con cy.intercept() para tests independientes' },
      { icon: '🧪', text: 'Creaste tests E2E que validan flujos completos de usuario' }
    ],
    cypressFeatures: {
      titulo: 'Features Clave de Cypress',
      items: [
        { feature: 'Auto-Retry', description: 'Comandos reintentan automáticamente hasta timeout' },
        { feature: 'Time Travel', description: 'Debuggea tests viendo snapshots de cada paso' },
        { feature: 'Real Browser', description: 'Tests corren en Chrome/Firefox real, no headless' },
        { feature: 'Network Stubbing', description: 'Control total sobre requests HTTP con cy.intercept()' }
      ]
    },
    comparison: {
      titulo: 'Cypress vs Otras Herramientas',
      tools: [
        { tool: 'Cypress', pros: 'DX excelente, fast, debugging fácil con time-travel', cons: 'Solo frontend, no soporta múltiples tabs' },
        { tool: 'Playwright', pros: 'Multi-browser, soporta múltiples tabs, paralelo nativo', cons: 'Curva de aprendizaje más alta, menos community' },
        { tool: 'Selenium', pros: 'Maduro, multi-lenguaje, gran community', cons: 'Lento, flaky tests frecuentes, setup complejo' }
      ]
    },
    nextSteps: [
      'Integrar Cypress en tu pipeline de CI/CD (GitHub Actions, GitLab CI)',
      'Explorar Cypress Component Testing para probar componentes aislados',
      'Aprender Cypress Cloud para paralelización y analytics',
      'Implementar visual regression testing con Percy o Applitools'
    ]
  };

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
}
