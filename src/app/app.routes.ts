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
        path: 'library/resources/ai-glossary',
        loadComponent: () => import('./library/resources/ai-glossary/ai-glossary').then(m => m.AiGlossary)
      },
      {
        path: 'library/resources/token-estimator',
        loadComponent: () => import('./library/resources/token-estimator/token-estimator').then(m => m.TokenEstimator)
      },
      {
        path: 'library/resources/json-extraction-prompt',
        loadComponent: () => import('./library/resources/json-extraction-prompt/json-extraction-prompt').then(m => m.JsonExtractionPrompt)
      },
      {
        path: 'library/resources/code-review-prompt',
        loadComponent: () => import('./library/resources/code-review-prompt/code-review-prompt').then(m => m.CodeReviewPrompt)
      },
      {
        path: 'library/resources/prompt-checklist',
        loadComponent: () => import('./library/resources/prompt-checklist/prompt-checklist').then(m => m.PromptChecklist)
      },
      {
        path: 'library/resources/context-checklist',
        loadComponent: () => import('./library/resources/context-checklist/context-checklist').then(m => m.ContextChecklist)
      },
      {
        path: 'library/resources/context-template',
        loadComponent: () => import('./library/resources/context-template/context-template').then(m => m.ContextTemplate)
      },
      {
        path: 'library/resources/context-budget',
        loadComponent: () => import('./library/resources/context-budget/context-budget').then(m => m.ContextBudget)
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
        path: 'labs/token-playground',
        loadComponent: () => import('./labs/token-playground/token-playground').then(m => m.TokenPlayground)
      },
      {
        path: 'labs/engineer-instruction',
        loadComponent: () => import('./labs/engineer-instruction/engineer-instruction').then(m => m.EngineerInstructionLab)
      },
      {
        path: 'labs/engineer-context',
        loadComponent: () => import('./labs/engineer-context/engineer-context').then(m => m.EngineerContextLab)
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
          },
          {
            path: 'academy/modules/m01-ai-foundations/lesson-01-probabilidad',
            loadComponent: () => import('./academy/modules/m01-ai-foundations/lesson-01-probabilidad/lesson-01-probabilidad').then(m => m.Lesson01Probabilidad)
          },
          {
            path: 'academy/modules/m01-ai-foundations/lesson-02-inferencia',
            loadComponent: () => import('./academy/modules/m01-ai-foundations/lesson-02-inferencia/lesson-02-inferencia').then(m => m.Lesson02Inferencia)
          },
          {
            path: 'academy/modules/m01-ai-foundations/lesson-03-sistemas',
            loadComponent: () => import('./academy/modules/m01-ai-foundations/lesson-03-sistemas/lesson-03-sistemas').then(m => m.Lesson03Sistemas)
          },
          {
            path: 'academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior',
            loadComponent: () => import('./academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior/lesson-01-reliable-behavior').then(m => m.Lesson01ReliableBehavior)
          },
          {
            path: 'academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns',
            loadComponent: () => import('./academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns/lesson-02-reasoning-patterns').then(m => m.Lesson02ReasoningPatterns)
          },
          {
            path: 'academy/modules/m02-prompt-engineering/lesson-03-structured-outputs',
            loadComponent: () => import('./academy/modules/m02-prompt-engineering/lesson-03-structured-outputs/lesson-03-structured-outputs').then(m => m.Lesson03StructuredOutputs)
          },
          {
            path: 'academy/modules/m03-context-engineering/lesson-01-anatomy',
            loadComponent: () => import('./academy/modules/m03-context-engineering/lesson-01-anatomy/lesson-01-anatomy').then(m => m.Lesson01Anatomy)
          },
          {
            path: 'academy/modules/m03-context-engineering/lesson-02-assembly',
            loadComponent: () => import('./academy/modules/m03-context-engineering/lesson-02-assembly/lesson-02-assembly').then(m => m.Lesson02Assembly)
          },
          {
            path: 'academy/modules/m03-context-engineering/lesson-03-compression',
            loadComponent: () => import('./academy/modules/m03-context-engineering/lesson-03-compression/lesson-03-compression').then(m => m.Lesson03Compression)
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
