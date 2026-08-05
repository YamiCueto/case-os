import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'library',
        loadComponent: () => import('./library/pages/library-home/library-home.component').then(m => m.LibraryHomeComponent)
      },
      {
        path: 'library/:slug',
        loadComponent: () => import('./library/pages/resource-detail/resource-detail.component').then(m => m.ResourceDetailComponent)
      },
      {
        path: 'labs',
        loadComponent: () => import('./labs/pages/labs-home/labs-home.component').then(m => m.LabsHomeComponent)
      },
      {
        path: 'labs/:slug',
        loadComponent: () => import('./labs/pages/lab-workspace/lab-workspace.component').then(m => m.LabWorkspaceComponent)
      },
      {
        path: 'framework',
        loadComponent: () => import('./framework/framework.component').then(m => m.FrameworkComponent)
      },
      {
        path: '',
        loadComponent: () => import('./core/layout/academy-layout/academy-layout.component').then(m => m.AcademyLayoutComponent),
        children: [
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
            path: 'academy/home',
            loadComponent: () => import('./academy/home/home.component').then(m => m.HomeComponent)
          },
          {
            path: 'academy/roadmap',
            loadComponent: () => import('./academy/roadmap/roadmap.component').then(m => m.RoadmapComponent)
          },
          {
            path: 'academy/certifications',
            loadComponent: () => import('./academy/certifications/certifications.component').then(m => m.CertificationsComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
