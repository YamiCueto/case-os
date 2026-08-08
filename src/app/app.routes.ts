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
        path: 'library/resources/cosine-similarity',
        loadComponent: () => import('./library/resources/cosine-similarity/cosine-similarity').then(m => m.CosineSimilarity)
      },
      {
        path: 'library/resources/rag-metrics',
        loadComponent: () => import('./library/resources/rag-metrics/rag-metrics').then(m => m.RagMetrics)
      },
      {
        path: 'library/resources/tool-schema',
        loadComponent: () => import('./library/resources/tool-schema/tool-schema').then(m => m.ToolSchema)
      },
      {
        path: 'library/resources/agentic-code-review',
        loadComponent: () => import('./library/resources/agentic-code-review/agentic-code-review').then(m => m.AgenticCodeReview)
      },
      {
        path: 'library/resources/mcp-core-concepts',
        loadComponent: () => import('./library/resources/mcp-core-concepts/mcp-core-concepts').then(m => m.McpCoreConcepts)
      },
      {
        path: 'library/resources/production-checklist',
        loadComponent: () => import('./library/resources/production-checklist/production-checklist').then(m => m.ProductionChecklist)
      },
      {
        path: 'library/resources/ai-architecture-patterns',
        loadComponent: () => import('./library/resources/ai-architecture-patterns/ai-architecture-patterns').then(m => m.AiArchitecturePatterns)
      },
      {
        path: 'labs',
        loadComponent: () => import('./labs/pages/labs-home/labs-home.component').then(m => m.LabsHomeComponent)
      },
      // labs/:slug eliminado — los Real Engineering Labs son rutas explícitas bajo academy/
      {
        path: 'academy/modules/m01-ai-foundations/demo-token-playground',
        loadComponent: () => import('./labs/token-playground/token-playground').then(m => m.TokenPlayground)
      },



      {
        path: 'labs/eval-pipeline',
        loadComponent: () => import('./labs/eval-pipeline/eval-pipeline').then(m => m.EvalPipelineLab)
      },
      {
        path: 'labs/architecture-blueprint',
        loadComponent: () => import('./labs/architecture-blueprint/architecture-blueprint').then(m => m.ArchitectureBlueprintLab)
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
            path: 'academy/modules/m01-ai-foundations/lab-01-legacy-routine',
            loadComponent: () => import('./academy/modules/m01-ai-foundations/lab-01-legacy-routine/lab-01-legacy-routine').then(m => m.Lab01LegacyRoutine)
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
            path: 'academy/modules/m02-prompt-engineering/demo-engineer-instruction',
            loadComponent: () => import('./academy/modules/m02-prompt-engineering/demo-engineer-instruction/demo-engineer-instruction').then(m => m.DemoEngineerInstruction)
          },
          {
            path: 'academy/modules/m02-prompt-engineering/lab-02-engineer-instruction-contract',
            loadComponent: () => import('./academy/modules/m02-prompt-engineering/lab-02-engineer-instruction-contract/lab-02-engineer-instruction-contract').then(m => m.Lab02EngineerInstructionContract)
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
          },
          {
            path: 'academy/modules/m03-context-engineering/demo-engineer-context',
            loadComponent: () => import('./academy/modules/m03-context-engineering/demo-engineer-context/demo-engineer-context').then(m => m.DemoEngineerContext)
          },
          {
            path: 'academy/modules/m03-context-engineering/lab-03-build-minimum-useful-context',
            loadComponent: () => import('./academy/modules/m03-context-engineering/lab-03-build-minimum-useful-context/lab-03-build-minimum-useful-context').then(m => m.Lab03BuildMinimumUsefulContext)
          },
          {
            path: 'academy/modules/m04-retrieval-rag/lesson-01-embeddings',
            loadComponent: () => import('./academy/modules/m04-retrieval-rag/lesson-01-embeddings/lesson-01-embeddings').then(m => m.Lesson01Embeddings)
          },
          {
            path: 'academy/modules/m04-retrieval-rag/lesson-02-pipeline',
            loadComponent: () => import('./academy/modules/m04-retrieval-rag/lesson-02-pipeline/lesson-02-pipeline').then(m => m.Lesson02Pipeline)
          },
          {
            path: 'academy/modules/m04-retrieval-rag/lesson-03-evaluation',
            loadComponent: () => import('./academy/modules/m04-retrieval-rag/lesson-03-evaluation/lesson-03-evaluation').then(m => m.Lesson03Evaluation)
          },
          {
            path: 'academy/modules/m04-retrieval-rag/demo-build-retrieval',
            loadComponent: () => import('./academy/modules/m04-retrieval-rag/demo-build-retrieval/demo-build-retrieval').then(m => m.DemoBuildRetrieval)
          },
          {
            path: 'academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy',
            loadComponent: () => import('./academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy/lab-04-build-retrieval-strategy').then(m => m.Lab04BuildRetrievalStrategy)
          },
          {
            path: 'academy/modules/m05-ai-agents/lesson-01-workflows',
            loadComponent: () => import('./academy/modules/m05-ai-agents/lesson-01-workflows/lesson-01-workflows').then(m => m.Lesson01Workflows)
          },
          {
            path: 'academy/modules/m05-ai-agents/lesson-02-tool-calling',
            loadComponent: () => import('./academy/modules/m05-ai-agents/lesson-02-tool-calling/lesson-02-tool-calling').then(m => m.Lesson02ToolCalling)
          },
          {
            path: 'academy/modules/m05-ai-agents/lesson-03-agent-loop',
            loadComponent: () => import('./academy/modules/m05-ai-agents/lesson-03-agent-loop/lesson-03-agent-loop').then(m => m.Lesson03AgentLoop)
          },
          {
            path: 'academy/modules/m05-ai-agents/demo-agent-loop',
            loadComponent: () => import('./academy/modules/m05-ai-agents/demo-agent-loop/demo-agent-loop').then(m => m.DemoAgentLoop)
          },
          {
            path: 'academy/modules/m05-ai-agents/lab-05-design-agentic-workflow',
            loadComponent: () => import('./academy/modules/m05-ai-agents/lab-05-design-agentic-workflow/lab-05-design-agentic-workflow').then(m => m.Lab05DesignAgenticWorkflow)
          },
          {
            path: 'academy/modules/m06-agentic-swe/lesson-01-agentic-coding',
            loadComponent: () => import('./academy/modules/m06-agentic-swe/lesson-01-agentic-coding/lesson-01-agentic-coding').then(m => m.Lesson01AgenticCoding)
          },
          {
            path: 'academy/modules/m06-agentic-swe/lesson-02-human-collaboration',
            loadComponent: () => import('./academy/modules/m06-agentic-swe/lesson-02-human-collaboration/lesson-02-human-collaboration').then(m => m.Lesson02HumanCollaboration)
          },
          {
            path: 'academy/modules/m06-agentic-swe/lesson-03-repository-context',
            loadComponent: () => import('./academy/modules/m06-agentic-swe/lesson-03-repository-context/lesson-03-repository-context').then(m => m.Lesson03RepositoryContext)
          },
          {
            path: 'academy/modules/m06-agentic-swe/demo-ai-coder',
            loadComponent: () => import('./academy/modules/m06-agentic-swe/demo-ai-coder/demo-ai-coder').then(m => m.DemoAiCoder)
          },
          {
            path: 'academy/modules/m06-agentic-swe/lab-06-agentic-swe-protocol',
            loadComponent: () => import('./academy/modules/m06-agentic-swe/lab-06-agentic-swe-protocol/lab-06-agentic-swe-protocol').then(m => m.Lab06AgenticSweProtocol)
          },
          {
            path: 'academy/modules/m07-mcp/lesson-01-nxm-problem',
            loadComponent: () => import('./academy/modules/m07-mcp/lesson-01-nxm-problem/lesson-01-nxm-problem').then(m => m.Lesson01NxMProblem)
          },
          {
            path: 'academy/modules/m07-mcp/lesson-02-architecture',
            loadComponent: () => import('./academy/modules/m07-mcp/lesson-02-architecture/lesson-02-architecture').then(m => m.Lesson02Architecture)
          },
          {
            path: 'academy/modules/m07-mcp/lesson-03-primitives',
            loadComponent: () => import('./academy/modules/m07-mcp/lesson-03-primitives/lesson-03-primitives').then(m => m.Lesson03Primitives)
          },
          {
            path: 'academy/modules/m07-mcp/demo-mcp-connector',
            loadComponent: () => import('./academy/modules/m07-mcp/demo-mcp-connector/demo-mcp-connector').then(m => m.DemoMcpConnector)
          },
          {
            path: 'academy/modules/m07-mcp/lab-07-map-integration-to-mcp',
            loadComponent: () => import('./academy/modules/m07-mcp/lab-07-map-integration-to-mcp/lab-07-map-integration-to-mcp').then(m => m.Lab07MapIntegrationToMcp)
          },
          {
            path: 'academy/modules/m08-production/lesson-01-production-gap',
            loadComponent: () => import('./academy/modules/m08-production/lesson-01-production-gap/lesson-01-production-gap').then(m => m.Lesson01ProductionGap)
          },
          {
            path: 'academy/modules/m08-production/lesson-02-evaluation',
            loadComponent: () => import('./academy/modules/m08-production/lesson-02-evaluation/lesson-02-evaluation').then(m => m.Lesson02Evaluation)
          },
          {
            path: 'academy/modules/m08-production/lesson-03-security',
            loadComponent: () => import('./academy/modules/m08-production/lesson-03-security/lesson-03-security').then(m => m.Lesson03Security)
          },
          {
            path: 'academy/modules/m09-architecture/lesson-01-monolith',
            loadComponent: () => import('./academy/modules/m09-architecture/lesson-01-monolith/lesson-01-monolith').then(m => m.Lesson01Monolith)
          },
          {
            path: 'academy/modules/m09-architecture/lesson-02-capabilities',
            loadComponent: () => import('./academy/modules/m09-architecture/lesson-02-capabilities/lesson-02-capabilities').then(m => m.Lesson02Capabilities)
          },
          {
            path: 'academy/modules/m09-architecture/lesson-03-case-study',
            loadComponent: () => import('./academy/modules/m09-architecture/lesson-03-case-study/lesson-03-case-study').then(m => m.Lesson03CaseStudy)
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
