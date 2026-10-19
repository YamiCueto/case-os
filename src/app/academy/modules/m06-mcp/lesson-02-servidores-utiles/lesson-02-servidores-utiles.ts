import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LessonSection as DocLessonSection } from '../../../models/lesson-document.models';
import { LESSON_02_DOCUMENT, USEFUL_SERVERS, ServerDetail } from './lesson-02.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonOutlineComponent } from '../../../components/lesson-outline/lesson-outline.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';
import { InstructorGuideDrawerComponent } from '../../../components/instructor-guide-drawer/instructor-guide-drawer.component';
import { INSTRUCTOR_GUIDE_L02 } from '../instructor-guides.data';
import { M06LessonClosingComponent } from '../components/m06-lesson-closing/m06-lesson-closing.component';

@Component({
  selector: 'app-lesson-02-servidores-utiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LessonHeaderComponent,
    LessonOutlineComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent,
    InstructorGuideDrawerComponent,
    M06LessonClosingComponent
  ],
  templateUrl: './lesson-02-servidores-utiles.html',
  styleUrls: ['../m06-living-doc.css', './lesson-02-servidores-utiles.css']
})
export class Lesson02ServidoresUtiles implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_02_DOCUMENT;
  readonly instructorGuide = INSTRUCTOR_GUIDE_L02;
  readonly servers = USEFUL_SERVERS;
  readonly lessonPath = '/academy/modules/m06-mcp/lesson-02-servidores-utiles';

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(this.lessonPath);
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c-m6-l02');

  readonly outlineSections: DocLessonSection[] = [
    {
      id: 'learning-objectives',
      title: '1. Objetivos de Aprendizaje',
      blocks: []
    },
    {
      id: 'fundamental-concepts',
      title: '2. Criterios de Selección',
      blocks: []
    },
    ...this.servers.map((s, idx) => ({
      id: 'server-' + s.id,
      title: `${idx + 3}. Servidor ${s.name}`,
      blocks: []
    })),
    {
      id: 'server-explorer',
      title: 'Playground: Explorador y Comparador',
      blocks: []
    },
    {
      id: 'common-pitfalls',
      title: 'Errores Comunes y Antipatrones',
      blocks: []
    },
    {
      id: 'group-questions',
      title: 'Preguntas al Grupo y Criterios',
      blocks: []
    },
    {
      id: 'synthesis',
      title: 'Síntesis y Cierre Sesión 1',
      blocks: []
    }
  ];

  // --- Playground State ---
  selectedServerId = signal<string>('github');
  selectedToolName = signal<string>('get_file_contents');
  customArguments = signal<string>('');
  simulationOutput = signal<{
    status: 'idle' | 'running' | 'success' | 'error';
    rpcRequest?: any;
    rpcResponse?: any;
    executionTimeMs?: number;
    securityNote?: string;
  }>({ status: 'idle' });

  selectedServer = computed<ServerDetail>(() => {
    return this.servers.find(s => s.id === this.selectedServerId()) || this.servers[0];
  });

  selectedTool = computed(() => {
    const srv = this.selectedServer();
    const tool = srv.sampleTools.find(t => t.name === this.selectedToolName());
    return tool || srv.sampleTools[0];
  });

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
    this.syncToolArguments();
  }

  selectServer(serverId: string): void {
    this.selectedServerId.set(serverId);
    const srv = this.selectedServer();
    if (srv.sampleTools.length > 0) {
      this.selectedToolName.set(srv.sampleTools[0].name);
    }
    this.syncToolArguments();
    this.resetSimulation();
  }

  selectTool(toolName: string): void {
    this.selectedToolName.set(toolName);
    this.syncToolArguments();
    this.resetSimulation();
  }

  private syncToolArguments(): void {
    const tool = this.selectedTool();
    if (tool) {
      this.customArguments.set(JSON.stringify(tool.sampleCall, null, 2));
    }
  }

  runSimulation(): void {
    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(this.customArguments());
    } catch {
      this.simulationOutput.set({
        status: 'error',
        rpcRequest: null,
        rpcResponse: {
          jsonrpc: '2.0',
          error: {
            code: -32602,
            message: 'Invalid params: Argumentos JSON malformados.'
          }
        },
        executionTimeMs: 4,
        securityNote: 'El MCP Client rechaza antes de transmitir al servidor si los argumentos no son JSON válido.'
      });
      return;
    }

    this.simulationOutput.set({ status: 'running' });

    setTimeout(() => {
      const tool = this.selectedTool();
      const srv = this.selectedServer();

      const rpcReq = {
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1000) + 1,
        method: 'tools/call',
        params: {
          name: tool.name,
          arguments: parsedArgs
        }
      };

      const rpcRes = {
        jsonrpc: '2.0',
        id: rpcReq.id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tool.sampleOutput, null, 2)
            }
          ],
          isError: false
        }
      };

      this.simulationOutput.set({
        status: 'success',
        rpcRequest: rpcReq,
        rpcResponse: rpcRes,
        executionTimeMs: Math.floor(Math.random() * 45) + 35,
        securityNote: `Ejecutado bajo el principio de mínimo privilegio en ${srv.name}. Operación restringida a los límites configurados.`
      });
    }, 450);
  }

  resetSimulation(): void {
    this.simulationOutput.set({ status: 'idle' });
  }
}
