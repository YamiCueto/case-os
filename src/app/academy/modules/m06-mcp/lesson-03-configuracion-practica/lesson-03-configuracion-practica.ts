import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { ComparisonBlock, LessonSection as DocLessonSection } from '../../../models/lesson-document.models';
import { LESSON_03_DOCUMENT } from './lesson-03.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonOutlineComponent } from '../../../components/lesson-outline/lesson-outline.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';
import { InstructorGuideDrawerComponent } from '../../../components/instructor-guide-drawer/instructor-guide-drawer.component';
import { INSTRUCTOR_GUIDE_L03 } from '../instructor-guides.data';
import { M06LessonClosingComponent } from '../components/m06-lesson-closing/m06-lesson-closing.component';

export interface InspectorScenario {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  tool: string;
  server: string;
  transport: 'stdio' | 'Streamable HTTP';
  requestRpc: {
    jsonrpc: string;
    id: number;
    method: string;
    params: {
      name: string;
      arguments: Record<string, any>;
    };
  };
  validationResult: {
    valid: boolean;
    reason: string;
  };
  serverExecution: {
    requiresHitl: boolean;
    hitlApproved?: boolean;
    status: 'success' | 'server_error' | 'permission_denied';
    externalSystem: string;
    details: string;
  };
  responseRpc: {
    jsonrpc: string;
    id: number;
    result?: {
      content: Array<{ type: string; text?: string; [key: string]: any }>;
      isError: boolean;
    };
    error?: {
      code: number;
      message: string;
      data?: any;
    };
  };
}

@Component({
  selector: 'app-lesson-03-configuracion-practica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LessonHeaderComponent,
    LessonOutlineComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent,
    InstructorGuideDrawerComponent,
    M06LessonClosingComponent
  ],
  templateUrl: './lesson-03-configuracion-practica.html',
  styleUrls: ['../m06-living-doc.css', './lesson-03-configuracion-practica.css']
})
export class Lesson03ConfiguracionPractica implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_03_DOCUMENT;
  readonly instructorGuide = INSTRUCTOR_GUIDE_L03;
  readonly lessonPath = '/academy/modules/m06-mcp/lesson-03-configuracion-practica';

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(this.lessonPath);
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c-m6-l03');

  readonly outlineSections: DocLessonSection[] = [
    {
      id: 'learning-objectives',
      title: '1. Objetivos de Aprendizaje',
      blocks: []
    },
    {
      id: 'fundamental-concepts',
      title: '2. Conceptos Fundamentales',
      blocks: []
    },
    ...this.doc.sections.map((s, idx) => ({
      id: s.id,
      title: `${idx + 3}. ${s.title}`,
      blocks: []
    })),
    {
      id: 'tool-calling-inspector',
      title: 'Playground: MCP Inspector & HITL',
      blocks: []
    },
    {
      id: 'common-pitfalls',
      title: 'Errores Comunes y Seguridad',
      blocks: []
    },
    {
      id: 'group-questions',
      title: 'Preguntas al Grupo y Comprobación',
      blocks: []
    },
    {
      id: 'synthesis',
      title: 'Síntesis y Transición a L04',
      blocks: []
    }
  ];

  readonly comparisonBlock: ComparisonBlock = {
    type: 'COMPARISON',
    left: {
      title: this.doc.comparison?.beforeTitle || 'Transporte stdio',
      badge: 'Local & IPC',
      icon: 'terminal',
      points: this.doc.comparison?.beforeItems || []
    },
    right: {
      title: this.doc.comparison?.afterTitle || 'Streamable HTTP',
      badge: 'Remoto & Red',
      icon: 'cloud_sync',
      points: this.doc.comparison?.afterItems || [],
      active: true
    }
  };

  // --- Scenarios for the MCP Tool Calling Inspector ---
  readonly scenarios: InspectorScenario[] = [
    {
      id: 'scenario-success',
      title: 'Invocación Exitosa (Lectura de Archivo en Filesystem)',
      badge: 'HAPPY PATH',
      badgeColor: '#10b981',
      tool: 'read_file',
      server: 'Filesystem MCP',
      transport: 'stdio',
      requestRpc: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'read_file',
          arguments: {
            path: 'C:/Users/developer/projects/core-app/src/main.ts'
          }
        }
      },
      validationResult: {
        valid: true,
        reason: 'Argumento "path" presente, tipo string y contenido dentro de la ruta raíz permitida.'
      },
      serverExecution: {
        requiresHitl: false,
        status: 'success',
        externalSystem: 'OS Kernel File Descriptor',
        details: 'Archivo localizado y decodificado como UTF-8 sin errores de I/O.'
      },
      responseRpc: {
        jsonrpc: '2.0',
        id: 1,
        result: {
          content: [
            {
              type: 'text',
              text: 'import { bootstrapApplication } from "@angular/platform-browser";\nimport { appConfig } from "./app/app.config";\nimport { AppComponent } from "./app/app";\n\nbootstrapApplication(AppComponent, appConfig);'
            }
          ],
          isError: false
        }
      }
    },
    {
      id: 'scenario-schema-error',
      title: 'Fallo de Validación JSON-Schema (Argumento Faltante)',
      badge: 'SCHEMA ERROR (-32602)',
      badgeColor: '#ef4444',
      tool: 'create_issue',
      server: 'GitHub MCP',
      transport: 'stdio',
      requestRpc: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'create_issue',
          arguments: {
            owner: 'enterprise-org',
            repo: 'core-app'
            // "title" y "body" omitidos
          }
        }
      },
      validationResult: {
        valid: false,
        reason: 'Violación de Schema: Propiedades obligatorias "title" y "body" no suministradas en arguments.'
      },
      serverExecution: {
        requiresHitl: false,
        status: 'server_error',
        externalSystem: 'GitHub MCP Internal Validator',
        details: 'El servidor rechaza la ejecución antes de contactar a GitHub API.'
      },
      responseRpc: {
        jsonrpc: '2.0',
        id: 2,
        error: {
          code: -32602,
          message: 'Invalid params: Required properties "title" and "body" are missing from input arguments.'
        }
      }
    },
    {
      id: 'scenario-hitl',
      title: 'Compuerta Human-in-the-Loop (Operación Sensible de Escritura)',
      badge: 'REQUIERE APROBACIÓN',
      badgeColor: '#f59e0b',
      tool: 'delete_customer_record',
      server: 'Database / Supabase MCP',
      transport: 'Streamable HTTP',
      requestRpc: {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'delete_customer_record',
          arguments: {
            customerId: 'cust_90118',
            purgeAllData: true
          }
        }
      },
      validationResult: {
        valid: true,
        reason: 'Esquema de parámetros válido. Operación catalogada como Peligrosa (Destructive Side-effect).'
      },
      serverExecution: {
        requiresHitl: true,
        hitlApproved: false,
        status: 'permission_denied',
        externalSystem: 'PostgreSQL Primary Node',
        details: 'El Host retiene la petición hasta recibir confirmación explícita del operador humano.'
      },
      responseRpc: {
        jsonrpc: '2.0',
        id: 3,
        result: {
          content: [
            {
              type: 'text',
              text: 'Operación pausada por el Host (PAUSED_FOR_APPROVAL). Token de autorización humana pendiente.'
            }
          ],
          isError: true
        }
      }
    },
    {
      id: 'scenario-enoent',
      title: 'Diagnóstico de Error de Runtime (Archivo No Encontrado)',
      badge: 'TOOL ERROR (isError: true)',
      badgeColor: '#f97316',
      tool: 'read_file',
      server: 'Filesystem MCP',
      transport: 'stdio',
      requestRpc: {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'read_file',
          arguments: {
            path: 'C:/Users/developer/projects/core-app/non-existent-config.yaml'
          }
        }
      },
      validationResult: {
        valid: true,
        reason: 'Esquema sintáctico correcto, pero el recurso físico no existe en disco.'
      },
      serverExecution: {
        requiresHitl: false,
        status: 'server_error',
        externalSystem: 'OS Filesystem Access',
        details: 'ENOENT: no such file or directory, open "non-existent-config.yaml".'
      },
      responseRpc: {
        jsonrpc: '2.0',
        id: 4,
        result: {
          content: [
            {
              type: 'text',
              text: 'Error: ENOENT: no such file or directory, open "C:/Users/developer/projects/core-app/non-existent-config.yaml"'
            }
          ],
          isError: true
        }
      }
    }
  ];

  selectedScenarioId = signal<string>('scenario-success');
  hitlDecision = signal<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  selectedScenario = computed(() => {
    return this.scenarios.find(s => s.id === this.selectedScenarioId()) || this.scenarios[0];
  });

  activePipelineStage = signal<number>(5);

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }

  selectScenario(id: string): void {
    this.selectedScenarioId.set(id);
    this.hitlDecision.set('PENDING');
    this.activePipelineStage.set(5);
  }

  approveHitl(): void {
    this.hitlDecision.set('APPROVED');
  }

  rejectHitl(): void {
    this.hitlDecision.set('REJECTED');
  }
}
