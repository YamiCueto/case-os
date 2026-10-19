import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { ComparisonBlock, LessonSection as DocLessonSection } from '../../../models/lesson-document.models';
import { LESSON_01_DOCUMENT } from './lesson-01.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonOutlineComponent } from '../../../components/lesson-outline/lesson-outline.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent
} from '../../../../core/ui/components';
import { InstructorGuideDrawerComponent } from '../../../components/instructor-guide-drawer/instructor-guide-drawer.component';
import { INSTRUCTOR_GUIDE_L01 } from '../instructor-guides.data';
import { M06LessonClosingComponent } from '../components/m06-lesson-closing/m06-lesson-closing.component';

export interface HostOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  role: string;
}

export interface ServerOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  transport: string;
  tools: string[];
}

export interface OperationOption {
  id: string;
  serverId: string;
  name: string;
  tool: string;
  arguments: Record<string, any>;
  externalSystem: string;
  mockResponse: Record<string, any>;
}

export interface SimulationStep {
  stepNumber: number;
  activeComponent: 'USER' | 'HOST' | 'LLM' | 'CLIENT' | 'SERVER' | 'EXTERNAL';
  title: string;
  description: string;
  responsibility: string;
  payload?: string;
}

export interface NodeDetail {
  id: 'USER' | 'HOST' | 'LLM' | 'CLIENT' | 'SERVER' | 'EXTERNAL';
  name: string;
  role: string;
  boundary: string;
  icon: string;
  colorHex: string;
  responsibilities: string[];
  securityNotice: string;
}

export interface TransportInfo {
  type: 'stdio' | 'Streamable HTTP';
  name: string;
  channel: string;
  security: string;
  bestFor: string;
}

@Component({
  selector: 'app-lesson-01-que-es-mcp',
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
  templateUrl: './lesson-01-que-es-mcp.html',
  styleUrls: ['../m06-living-doc.css', './lesson-01-que-es-mcp.css']
})
export class Lesson01QueEsMcp implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  readonly instructorGuide = INSTRUCTOR_GUIDE_L01;
  readonly lessonPath = '/academy/modules/m06-mcp/lesson-01-que-es-mcp';

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(this.lessonPath);
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c-m6-l01');

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
      id: 'architecture-simulator',
      title: 'Playground: Simulador de Arquitectura',
      blocks: []
    },
    {
      id: 'common-pitfalls',
      title: 'Errores Comunes en Producción',
      blocks: []
    },
    {
      id: 'group-questions',
      title: 'Preguntas al Grupo y Comprobación',
      blocks: []
    },
    {
      id: 'synthesis',
      title: 'Síntesis y Transición a L02',
      blocks: []
    }
  ];

  readonly comparisonBlock: ComparisonBlock = {
    type: 'COMPARISON',
    left: {
      title: this.doc.comparison?.beforeTitle || 'Integración Tradicional',
      badge: 'Caos N × M',
      icon: 'close',
      points: this.doc.comparison?.beforeItems || []
    },
    right: {
      title: this.doc.comparison?.afterTitle || 'Estándar MCP',
      badge: 'Arquitectura N + M',
      icon: 'check_circle',
      points: this.doc.comparison?.afterItems || [],
      active: true
    }
  };

  // --- Playground State ---
  readonly hosts: HostOption[] = [
    {
      id: 'case-os',
      name: 'CASE OS Agent Studio',
      icon: 'terminal',
      description: 'Entorno de ingeniería agéntica de CASE OS con runtime HITL.',
      role: 'Orquesta contexto del agente, políticas de seguridad y ejecución de herramientas.'
    },
    {
      id: 'claude-desktop',
      name: 'Claude Desktop',
      icon: 'desktop_windows',
      description: 'Cliente de escritorio oficial de Anthropic con soporte MCP nativo.',
      role: 'Mantiene procesos stdio hijos configurados en claude_desktop_config.json.'
    },
    {
      id: 'cursor-ide',
      name: 'Cursor / Antigravity IDE',
      icon: 'code',
      description: 'Editor de código agéntico con MCP client en segundo plano.',
      role: 'Inyecta capacidades de MCP en el bucle de autocompletado y chat.'
    }
  ];

  readonly servers: ServerOption[] = [
    {
      id: 'github',
      name: 'GitHub MCP Server',
      icon: 'hub',
      description: 'Acceso a repositorios, ramas, pull requests y issues vía GitHub API.',
      transport: 'stdio (npx -y @modelcontextprotocol/server-github)',
      tools: ['list_issues', 'get_file_contents', 'create_pull_request']
    },
    {
      id: 'filesystem',
      name: 'Filesystem MCP Server',
      icon: 'folder',
      description: 'Lectura y escritura controlada en directorios autorizados del SO.',
      transport: 'stdio (npx -y @modelcontextprotocol/server-filesystem /workspace)',
      tools: ['read_file', 'write_file', 'list_directory']
    },
    {
      id: 'supabase',
      name: 'Supabase / PostgreSQL MCP',
      icon: 'database',
      description: 'Introspección de esquema relacional y ejecución segura de queries.',
      transport: 'Streamable HTTP (https://api.supabase.com/mcp/v1)',
      tools: ['execute_sql', 'list_tables', 'describe_table']
    }
  ];

  readonly operations: OperationOption[] = [
    {
      id: 'gh-issues',
      serverId: 'github',
      name: 'Consultar issues críticos abiertos',
      tool: 'list_issues',
      arguments: { state: 'open', labels: ['bug', 'critical'], limit: 3 },
      externalSystem: 'GitHub REST/GraphQL API v4',
      mockResponse: {
        total: 1,
        issues: [
          { id: 402, title: 'Memory leak in session worker thread', author: 'dev-lead', state: 'open' }
        ]
      }
    },
    {
      id: 'fs-read',
      serverId: 'filesystem',
      name: 'Leer archivo de configuración package.json',
      tool: 'read_file',
      arguments: { path: '/workspace/package.json', encoding: 'utf-8' },
      externalSystem: 'Local OS File System (/workspace sandbox)',
      mockResponse: {
        name: 'core-microservice',
        version: '2.4.0',
        dependencies: { '@angular/core': '^22.0.0', 'rxjs': '^7.8.0' }
      }
    },
    {
      id: 'db-query',
      serverId: 'supabase',
      name: 'Consultar usuarios activos en base de datos',
      tool: 'execute_sql',
      arguments: { query: 'SELECT id, email, role FROM app_users WHERE active = true LIMIT 2;' },
      externalSystem: 'PostgreSQL Relational DB Cluster (Port 5432)',
      mockResponse: {
        rowCount: 2,
        rows: [
          { id: 'usr_881', email: 'architect@enterprise.com', role: 'admin' },
          { id: 'usr_882', email: 'lead@enterprise.com', role: 'engineer' }
        ]
      }
    }
  ];

  // Definición de Nodos Arquitectónicos, Fronteras de Seguridad y Responsabilidades
  readonly nodesDetail: Record<'USER' | 'HOST' | 'LLM' | 'CLIENT' | 'SERVER' | 'EXTERNAL', NodeDetail> = {
    USER: {
      id: 'USER',
      name: 'Usuario Final',
      role: 'Intención de Negocio',
      boundary: 'Entorno de Usuario',
      icon: 'person',
      colorHex: '#94a3b8',
      responsibilities: [
        'Formula el objetivo de software en lenguaje natural.',
        'Define el alcance de negocio sin conocer detalles técnicos ni protocolos.',
        'Recibe y valida la respuesta final consolidada tras el bucle agéntico.'
      ],
      securityNotice: 'No tiene acceso directo a credenciales del servidor ni a la red interna; interactúa exclusivamente con el Host.'
    },
    HOST: {
      id: 'HOST',
      name: 'MCP Host',
      role: 'Orquestador & Runtime (CASE OS / Claude Desktop / Cursor)',
      boundary: 'Frontera de Aplicación (Gatekeeper)',
      icon: 'terminal',
      colorHex: '#a855f7',
      responsibilities: [
        'Custodia variables de entorno, claves secretas y tokens de autenticación.',
        'Aplica compuertas de autorización humana (Human-in-the-Loop) para operaciones sensibles.',
        'Gobierna el bucle agéntico (Agent Loop) y gestiona el context window del modelo.',
        'Enruta las peticiones JSON-RPC al cliente MCP correspondiente.'
      ],
      securityNotice: 'El Host actúa como árbitro supremo de seguridad. Ningún modelo de IA puede saltarse sus compuertas de autorización.'
    },
    LLM: {
      id: 'LLM',
      name: 'LLM Core',
      role: 'Reasoning Engine (Claude / Gemini / GPT)',
      boundary: 'Capa Cognitiva (Aislada del SO)',
      icon: 'psychology',
      colorHex: '#38bdf8',
      responsibilities: [
        'Interpreta semánticamente el objetivo del usuario contra los esquemas JSON-Schema expuestos.',
        'Genera propuestas de Tool Calls con nombres y argumentos estrictamente tipados.',
        'Pausa la generación de texto a la espera de la observación del mundo real.',
        'Sintetiza la respuesta analítica incorporando la evidencia recopilada.'
      ],
      securityNotice: 'El modelo es puramente inferencial: carece de sockets de red, no tiene acceso a disco ni permisos en el sistema operativo.'
    },
    CLIENT: {
      id: 'CLIENT',
      name: 'MCP Client',
      role: 'Conector Protocolar 1:1',
      boundary: 'Frontera de Transporte Protocolar',
      icon: 'sync_alt',
      colorHex: '#10b981',
      responsibilities: [
        'Negocia versión de protocolo y capabilities durante el handshake inicial (initialize).',
        'Descubre dinámicamente herramientas (tools/list), recursos y prompts.',
        'Serializa llamadas JSON-RPC 2.0 (tools/call) y valida esquemas antes del envío.',
        'Gestiona el canal de transporte (pipes stdio locales o HTTP/SSE remotos).'
      ],
      securityNotice: 'Garantiza tipado estricto y aísla la conexión con cada servidor independientemente; un fallo en un conector no compromete a los demás.'
    },
    SERVER: {
      id: 'SERVER',
      name: 'MCP Server',
      role: 'Proceso Ligero Independiente',
      boundary: 'Frontera de Seguridad / Sandbox',
      icon: 'dns',
      colorHex: '#f59e0b',
      responsibilities: [
        'Expone herramientas, recursos y prompts sin acoplarse a ningún modelo de IA.',
        'Ejecuta la lógica de negocio bajo el principio de mínimo privilegio (Least Privilege).',
        'Valida estrictamente los argumentos contra la especificación JSON-Schema.',
        'Devuelve observaciones estructuradas con formato estandarizado.'
      ],
      securityNotice: 'Aislamiento de proceso estricto: confinado a su propio subproceso o contenedor sin privilegios de superusuario.'
    },
    EXTERNAL: {
      id: 'EXTERNAL',
      name: 'Sistema Externo',
      role: 'Target Environment (GitHub / PostgreSQL / Filesystem)',
      boundary: 'Infraestructura Corporativa',
      icon: 'cloud',
      colorHex: '#ec4899',
      responsibilities: [
        'Almacena el código fuente, registros de base de datos o repositorios corporativos.',
        'Procesa las mutaciones y consultas solicitadas por las herramientas autorizadas.',
        'Devuelve datos reales o códigos de estado tras la ejecución.'
      ],
      securityNotice: 'Solo accesible mediante las credenciales y tokens restringidos configurados en el Servidor MCP.'
    }
  };

  selectedHostId = signal<string>('case-os');
  selectedServerId = signal<string>('github');
  selectedOperationId = signal<string>('gh-issues');
  currentStepIndex = signal<number>(0);
  inspectedNodeId = signal<'USER' | 'HOST' | 'LLM' | 'CLIENT' | 'SERVER' | 'EXTERNAL' | null>(null);
  isAutoPlaying = signal<boolean>(false);
  private autoPlayTimer: any = null;

  selectedHost = computed(() => this.hosts.find(h => h.id === this.selectedHostId()) ?? this.hosts[0]);
  selectedServer = computed(() => this.servers.find(s => s.id === this.selectedServerId()) ?? this.servers[0]);

  selectedTransportInfo = computed<TransportInfo>(() => {
    const s = this.selectedServer();
    if (s.transport.includes('stdio')) {
      return {
        type: 'stdio',
        name: 'Pipes Estándar de Entrada/Salida (stdio)',
        channel: 'stdin / stdout locales en subproceso hijo creado por el Host',
        security: 'Aislamiento local absoluto. Sin sockets de red ni puertos abiertos. Inmune a ataques de red externa.',
        bestFor: 'Herramientas locales del desarrollador: acceso al sistema de archivos, CLI de Git, SQLite.'
      };
    } else {
      return {
        type: 'Streamable HTTP',
        name: 'Streamable HTTP / SSE sobre HTTPS',
        channel: 'Peticiones POST JSON-RPC con streaming unidireccional Server-Sent Events',
        security: 'Canal cifrado TLS/HTTPS con autenticación mediante Bearer Tokens o cabeceras OAuth.',
        bestFor: 'Microservicios centralizados, bases de datos en la nube (Supabase, Postgres) e integraciones corporativas.'
      };
    }
  });

  activeNode = computed<NodeDetail>(() => {
    const inspected = this.inspectedNodeId();
    if (inspected) {
      return this.nodesDetail[inspected];
    }
    const current = this.currentStep();
    return this.nodesDetail[current.activeComponent];
  });

  availableOperations = computed(() => {
    const serverId = this.selectedServerId();
    return this.operations.filter(op => op.serverId === serverId);
  });

  selectedOperation = computed(() => {
    const ops = this.availableOperations();
    return ops.find(o => o.id === this.selectedOperationId()) || ops[0];
  });

  simulationSteps = computed<SimulationStep[]>(() => {
    const host = this.selectedHost();
    const server = this.selectedServer();
    const op = this.selectedOperation();

    if (!op) return [];

    return [
      {
        stepNumber: 1,
        activeComponent: 'USER',
        title: '1. Petición del Usuario',
        description: `El usuario le solicita al Host: "${op.name}".`,
        responsibility: 'El usuario define la intención de negocio sin conocer detalles técnicos del backend.'
      },
      {
        stepNumber: 2,
        activeComponent: 'HOST',
        title: '2. Evaluación y Contextualización en el Host',
        description: `${host.name} empaqueta el prompt del sistema junto con los esquemas de herramientas descubiertas de ${server.name} y lo envía al LLM.`,
        responsibility: 'El Host mantiene la sesión, aplica límites de tokens y suministra las herramientas disponibles.',
        payload: JSON.stringify({
          system_prompt: 'Eres un asistente agéntico. Tienes acceso a herramientas MCP.',
          tools_available: [op.tool]
        }, null, 2)
      },
      {
        stepNumber: 3,
        activeComponent: 'LLM',
        title: '3. Decisión del Modelo (Tool Calling)',
        description: `El LLM razona que requiere datos reales y emite una propuesta de Tool Call para invocar "${op.tool}".`,
        responsibility: 'El modelo no ejecuta código; únicamente genera el objeto estructurado JSON con la llamada.',
        payload: JSON.stringify({
          tool_call: {
            name: op.tool,
            arguments: op.arguments
          }
        }, null, 2)
      },
      {
        stepNumber: 4,
        activeComponent: 'CLIENT',
        title: '4. Intercepción del MCP Client',
        description: `El MCP Client dentro de ${host.name} valida el esquema de argumentos y serializa la petición JSON-RPC 2.0.`,
        responsibility: 'El MCP Client gestiona la conexión con el proceso del servidor y aplica timeouts y manejo de errores.',
        payload: JSON.stringify({
          jsonrpc: '2.0',
          id: 104,
          method: 'tools/call',
          params: {
            name: op.tool,
            arguments: op.arguments
          }
        }, null, 2)
      },
      {
        stepNumber: 5,
        activeComponent: 'SERVER',
        title: `5. Ejecución en ${server.name}`,
        description: `El proceso de ${server.name} recibe la petición JSON-RPC a través de ${server.transport.split(' ')[0]} y ejecuta la operación autorizada.`,
        responsibility: 'El servidor ejecuta con permisos mínimos dentro de su sandbox y no expone el resto del sistema.',
        payload: `-> Despachando llamada a ${op.externalSystem} con credenciales de proceso seguro...`
      },
      {
        stepNumber: 6,
        activeComponent: 'EXTERNAL',
        title: `6. Respuesta de ${op.externalSystem}`,
        description: `El sistema externo completa la operación y retorna la información al servidor MCP.`,
        responsibility: 'El sistema externo procesa la consulta según los permisos concedidos al token/proceso.',
        payload: JSON.stringify(op.mockResponse, null, 2)
      },
      {
        stepNumber: 7,
        activeComponent: 'HOST',
        title: '7. Inyección de la Observación y Respuesta Final',
        description: `El MCP Server devuelve la respuesta estructurada a ${host.name}, que la añade al contexto del LLM para formular la respuesta final al usuario.`,
        responsibility: 'El Host completa el bucle agéntico y presenta el resultado verificado.',
        payload: JSON.stringify({
          jsonrpc: '2.0',
          id: 104,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(op.mockResponse)
              }
            ],
            isError: false
          }
        }, null, 2)
      }
    ];
  });

  currentStep = computed(() => {
    const steps = this.simulationSteps();
    const idx = Math.min(this.currentStepIndex(), steps.length - 1);
    return steps[idx] || steps[0];
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

  onServerChange(serverId: string): void {
    this.selectedServerId.set(serverId);
    const ops = this.operations.filter(o => o.serverId === serverId);
    if (ops.length > 0) {
      this.selectedOperationId.set(ops[0].id);
    }
    this.resetSimulation();
  }

  onOperationChange(opId: string): void {
    this.selectedOperationId.set(opId);
    this.resetSimulation();
  }

  nextStep(): void {
    const maxIdx = this.simulationSteps().length - 1;
    if (this.currentStepIndex() < maxIdx) {
      this.currentStepIndex.update(i => i + 1);
    } else {
      this.stopAutoPlay();
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  goToStep(index: number): void {
    this.currentStepIndex.set(index);
  }

  resetSimulation(): void {
    this.stopAutoPlay();
    this.currentStepIndex.set(0);
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying()) {
      this.stopAutoPlay();
    } else {
      this.isAutoPlaying.set(true);
      if (this.currentStepIndex() >= this.simulationSteps().length - 1) {
        this.currentStepIndex.set(0);
      }
      this.autoPlayTimer = setInterval(() => {
        if (this.currentStepIndex() < this.simulationSteps().length - 1) {
          this.nextStep();
        } else {
          this.stopAutoPlay();
        }
      }, 2200);
    }
  }

  inspectNode(nodeId: 'USER' | 'HOST' | 'LLM' | 'CLIENT' | 'SERVER' | 'EXTERNAL'): void {
    if (this.inspectedNodeId() === nodeId) {
      this.inspectedNodeId.set(null);
    } else {
      this.inspectedNodeId.set(nodeId);
    }
  }

  clearInspectedNode(): void {
    this.inspectedNodeId.set(null);
  }

  private stopAutoPlay(): void {
    this.isAutoPlaying.set(false);
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
}
