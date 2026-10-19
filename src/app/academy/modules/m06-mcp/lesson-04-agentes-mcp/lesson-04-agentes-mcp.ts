import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { ComparisonBlock, LessonSection as DocLessonSection } from '../../../models/lesson-document.models';
import { LESSON_04_DOCUMENT } from './lesson-04.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonOutlineComponent } from '../../../components/lesson-outline/lesson-outline.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';
import { InstructorGuideDrawerComponent } from '../../../components/instructor-guide-drawer/instructor-guide-drawer.component';
import { INSTRUCTOR_GUIDE_L04 } from '../instructor-guides.data';
import { M06LessonClosingComponent } from '../components/m06-lesson-closing/m06-lesson-closing.component';

export interface AgentStep {
  stepIndex: number;
  phase: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'HITL_GATE' | 'COMPLETED';
  activeServer: 'LINEAR' | 'FILESYSTEM' | 'GITHUB' | 'PLAYWRIGHT' | 'NONE';
  title: string;
  thought: string;
  toolCall?: {
    server: string;
    tool: string;
    arguments: Record<string, any>;
  };
  observation?: string;
  requiresHumanApproval?: boolean;
}

@Component({
  selector: 'app-lesson-04-agentes-mcp',
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
  templateUrl: './lesson-04-agentes-mcp.html',
  styleUrls: ['../m06-living-doc.css', './lesson-04-agentes-mcp.css']
})
export class Lesson04AgentesMcp implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_04_DOCUMENT;
  readonly instructorGuide = INSTRUCTOR_GUIDE_L04;
  readonly lessonPath = '/academy/modules/m06-mcp/lesson-04-agentes-mcp';

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(this.lessonPath);
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c-m6-l04');

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
      id: 'agent-orchestrator',
      title: 'Playground: Orquestador Multi-MCP',
      blocks: []
    },
    {
      id: 'common-pitfalls',
      title: 'Errores Comunes en Multi-MCP',
      blocks: []
    },
    {
      id: 'group-questions',
      title: 'Preguntas al Grupo y Comprobación',
      blocks: []
    },
    {
      id: 'synthesis',
      title: 'Síntesis y Preparación Lab 06',
      blocks: []
    }
  ];

  readonly comparisonBlock: ComparisonBlock = {
    type: 'COMPARISON',
    left: {
      title: this.doc.comparison?.beforeTitle || 'Agente Monolítico',
      badge: 'Acoplamiento Estático',
      icon: 'close',
      points: this.doc.comparison?.beforeItems || []
    },
    right: {
      title: this.doc.comparison?.afterTitle || 'Agente Modular MCP',
      badge: 'Orquestación Dinámica',
      icon: 'check_circle',
      points: this.doc.comparison?.afterItems || [],
      active: true
    }
  };

  // --- Multi-MCP Agent Orchestrator State ---
  currentAgentStepIndex = signal<number>(0);
  isHumanApproved = signal<boolean>(false);

  readonly agentSteps: AgentStep[] = [
    {
      stepIndex: 1,
      phase: 'THOUGHT',
      activeServer: 'NONE',
      title: 'Paso 1: Recepción de Ticket y Planificación',
      thought: 'He recibido una tarea para investigar el ticket ISSUE-402 reportado en el sprint activo. Debo consultar Linear MCP para entender el error reportado y los pasos de reproducción.'
    },
    {
      stepIndex: 2,
      phase: 'ACTION',
      activeServer: 'LINEAR',
      title: 'Paso 2: Consulta de Detalles en Linear MCP',
      thought: 'Consultando la descripción y logs asociados al ticket.',
      toolCall: {
        server: 'Linear MCP Server',
        tool: 'get_issue',
        arguments: { issueId: 'ISSUE-402' }
      },
      observation: 'Ticket ISSUE-402: "Memory leak in auth session worker thread on concurrent requests". Archivo sospechoso: src/auth/session-worker.ts.'
    },
    {
      stepIndex: 3,
      phase: 'THOUGHT',
      activeServer: 'NONE',
      title: 'Paso 3: Análisis de Causa Raíz',
      thought: 'El ticket apunta a src/auth/session-worker.ts. Debo utilizar Filesystem MCP para inspeccionar el contenido del archivo y verificar el manejo de event listeners.'
    },
    {
      stepIndex: 4,
      phase: 'ACTION',
      activeServer: 'FILESYSTEM',
      title: 'Paso 4: Inspección de Código en Filesystem MCP',
      thought: 'Leyendo el archivo de origen en el workspace autorizado.',
      toolCall: {
        server: 'Filesystem MCP Server',
        tool: 'read_file',
        arguments: { path: 'src/auth/session-worker.ts' }
      },
      observation: 'Código leído: Se detecta que worker.on("message", handler) se registra en cada request sin invocar worker.removeListener() al finalizar la sesión.'
    },
    {
      stepIndex: 5,
      phase: 'HITL_GATE',
      activeServer: 'NONE',
      title: 'Paso 5: Solicitud de Aprobación Humana (HITL)',
      thought: 'He preparado el parche que añade worker.off("message", handler) en el bloque finally. Como escribir en el repositorio es una operación con efecto secundario, requiero confirmación del ingeniero humano.',
      requiresHumanApproval: true
    },
    {
      stepIndex: 6,
      phase: 'ACTION',
      activeServer: 'GITHUB',
      title: 'Paso 6: Creación de Pull Request en GitHub MCP',
      thought: 'Aprobación humana recibida. Creando rama "fix/issue-402-leak" y abriendo Pull Request con el parche validado.',
      toolCall: {
        server: 'GitHub MCP Server',
        tool: 'create_pull_request',
        arguments: {
          title: 'fix(auth): prevent worker listener leak on session close (#402)',
          head: 'fix/issue-402-leak',
          base: 'main'
        }
      },
      observation: 'PR #58 creado exitosamente: https://github.com/enterprise/core-app/pull/58.'
    },
    {
      stepIndex: 7,
      phase: 'ACTION',
      activeServer: 'PLAYWRIGHT',
      title: 'Paso 7: Verificación Visual con Playwright MCP',
      thought: 'Validando que la interfaz de inicio de sesión no presente regresiones tras el parche.',
      toolCall: {
        server: 'Playwright MCP Server',
        tool: 'browser_navigate',
        arguments: { url: 'http://localhost:4200/login' }
      },
      observation: 'Página cargada con HTTP 200. Formulario de autenticación interactivo y funcional. Sin errores en consola.'
    },
    {
      stepIndex: 8,
      phase: 'COMPLETED',
      activeServer: 'NONE',
      title: 'Paso 8: Tarea Completada con Evidencia Multi-MCP',
      thought: 'El ticket ha sido diagnosticado, parchado, validado con Human-in-the-Loop y verificado con Playwright. Registro de evidencias completado.'
    }
  ];

  currentStep = computed(() => {
    return this.agentSteps[this.currentAgentStepIndex()] || this.agentSteps[0];
  });

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }

  nextAgentStep(): void {
    const step = this.currentStep();
    if (step.phase === 'HITL_GATE' && !this.isHumanApproved()) {
      return; // Bloqueado hasta aprobación humana
    }

    if (this.currentAgentStepIndex() < this.agentSteps.length - 1) {
      this.currentAgentStepIndex.update(i => i + 1);
    }
  }

  prevAgentStep(): void {
    if (this.currentAgentStepIndex() > 0) {
      this.currentAgentStepIndex.update(i => i - 1);
    }
  }

  approveHitl(): void {
    this.isHumanApproved.set(true);
    this.nextAgentStep();
  }

  resetOrchestrator(): void {
    this.currentAgentStepIndex.set(0);
    this.isHumanApproved.set(false);
  }
}
