import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'plan-dev-detallado',
    pathMatch: 'full'
  },
  {
    path: 'plan-dev-detallado',
    loadComponent: () => import('./plan-dev-detallado/plan-dev-detallado.component').then(m => m.PlanDevDetalladoComponent)
  },
  {
    path: 'study-plan',
    redirectTo: 'plan-dev-detallado'
  },
  {
    path: 'clase1-dev-fundamentos',
    loadComponent: () => import('./clase1-dev-fundamentos/clase1-dev-fundamentos.component').then(m => m.Clase1DevFundamentosComponent)
  },
  {
    path: 'clase2-dev-spring-boot',
    loadComponent: () => import('./clase2-dev-spring-boot/clase2-dev-spring-boot.component').then(m => m.Clase2DevSpringBootComponent)
  },
  {
    path: 'clase3-dev-migracion-legacy',
    loadComponent: () => import('./clase3-dev-migracion-legacy/clase3-dev-migracion-legacy.component').then(m => m.Clase3DevMigracionLegacyComponent)
  },
  {
    path: 'clase4-dev-integracion-apis',
    loadComponent: () => import('./clase4-dev-integracion-apis/clase4-dev-integracion-apis.component').then(m => m.Clase4DevIntegracionApisComponent)
  },
  {
    path: 'clase5-dev-testing-avanzado',
    loadComponent: () => import('./clase5-dev-testing-avanzado/clase5-dev-testing-avanzado.component').then(m => m.Clase5DevTestingAvanzadoComponent)
  },
  {
    path: 'clase6-dev-modulo-angular',
    loadComponent: () => import('./clase6-dev-modulo-angular/clase6-dev-modulo-angular.component').then(m => m.Clase6DevModuloAngularComponent)
  },
  {
    path: 'clase7-dev-frontend-legacy',
    loadComponent: () => import('./clase7-dev-frontend-legacy/clase7-dev-frontend-legacy.component').then(m => m.Clase7DevFrontendLegacyComponent)
  },
  {
    path: 'clase8-dev-estado-rxjs',
    loadComponent: () => import('./clase8-dev-estado-rxjs/clase8-dev-estado-rxjs.component').then(m => m.Clase8DevEstadoRxjsComponent)
  },
  {
    path: 'clase9-dev-testing-e2e',
    loadComponent: () => import('./clase9-dev-testing-e2e/clase9-dev-testing-e2e.component').then(m => m.Clase9DevTestingE2eComponent)
  },
  {
    path: 'clase10-dev-fastapi',
    loadComponent: () => import('./clase10-dev-fastapi/clase10-dev-fastapi.component').then(m => m.Clase10DevFastapiComponent)
  },
  {
    path: 'clase11-dev-lambda-serverless',
    loadComponent: () => import('./clase11-dev-lambda-serverless/clase11-dev-lambda-serverless.component').then(m => m.Clase11DevLambdaServerlessComponent)
  },
  {
    path: 'clase12-dev-proyecto-final',
    loadComponent: () => import('./clase12-dev-proyecto-final/clase12-dev-proyecto-final.component').then(m => m.Clase12DevProyectoFinalComponent)
  },
  {
    path: 'installation-guides',
    loadComponent: () => import('./installation-guides/installation-guides.component').then(m => m.InstallationGuidesComponent)
  },
  {
    path: 'tech-stack',
    loadComponent: () => import('./tech-stack/tech-stack.component').then(m => m.TechStackComponent)
  },
  {
    path: '**',
    redirectTo: 'plan-dev-detallado'
  }
];
