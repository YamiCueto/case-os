import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import {
  CaseCodeBlockComponent
} from '../../../../core/ui/components';
import { InstructorGuideDrawerComponent } from '../../../components/instructor-guide-drawer/instructor-guide-drawer.component';
import { INSTRUCTOR_GUIDE_LAB06 } from '../instructor-guides.data';

export interface LabAlternative {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
  targetMcp: string;
  sampleConfig: string;
  sampleVerification: string;
}

export interface DeliverableItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-lab-06-integracion-mcp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CaseCodeBlockComponent,
    InstructorGuideDrawerComponent
  ],
  templateUrl: './lab-06-integracion-mcp.html',
  styleUrls: ['../m06-living-doc.css', './lab-06-integracion-mcp.css']
})
export class Lab06IntegracionMcp implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly instructorGuide = INSTRUCTOR_GUIDE_LAB06;
  readonly lessonPath = '/academy/modules/m06-mcp/lab-06-integracion-mcp';
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(this.lessonPath);
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m6');

  readonly alternatives: LabAlternative[] = [
    {
      id: 'alt-mysql',
      title: 'Alternativa A: Consulta de Base de Datos (MySQL CFA / Supabase MCP)',
      icon: 'database',
      badge: 'Base de Datos',
      description: 'Conectar el agente V3/V4 a un servidor MCP relacional para consultar transacciones y estado de asociados bajo Least Privilege (sólo SELECT).',
      targetMcp: '@modelcontextprotocol/server-postgres o servidor MySQL CFA',
      sampleConfig: `{\n  "mcpServers": {\n    "cfa-db": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://ro_agent:secret@localhost:5432/cfa_core"]\n    }\n  }\n}`,
      sampleVerification: `// tools/call execute_sql\n{\n  "query": "SELECT id, balance, status FROM accounts WHERE associate_id = 'CFA-109';"\n}`
    },
    {
      id: 'alt-github',
      title: 'Alternativa B: Inspección de Repositorio (GitHub MCP)',
      icon: 'hub',
      badge: 'Código & PRs',
      description: 'Integrar el agente V5/V6 con GitHub MCP para analizar issues abiertos, examinar diffs de código y redactar Pull Requests verificables.',
      targetMcp: '@modelcontextprotocol/server-github',
      sampleConfig: `{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }\n    }\n  }\n}`,
      sampleVerification: `// tools/call list_issues\n{\n  "owner": "enterprise-org",\n  "repo": "case-os",\n  "state": "open"\n}`
    },
    {
      id: 'alt-playwright',
      title: 'Alternativa C: Validación de Interfaz Web (Playwright MCP)',
      icon: 'open_in_browser',
      badge: 'Browser E2E',
      description: 'Dotar al agente de un navegador headless para comprobar la carga de rutas en localhost, capturar screenshots y validar ausencia de errores en consola.',
      targetMcp: '@modelcontextprotocol/server-playwright',
      sampleConfig: `{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-playwright"]\n    }\n  }\n}`,
      sampleVerification: `// tools/call browser_navigate\n{\n  "url": "http://localhost:4200/academy/home"\n}`
    },
    {
      id: 'alt-filesystem',
      title: 'Alternativa D: Acceso Controlado a Archivos (Filesystem MCP)',
      icon: 'folder',
      badge: 'Local Sandbox',
      description: 'Permitir que el agente lea configuraciones locales y genere parches de código dentro de una carpeta acotada sin riesgo de Path Traversal.',
      targetMcp: '@modelcontextprotocol/server-filesystem',
      sampleConfig: `{\n  "mcpServers": {\n    "workspace-fs": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:/Users/developer/projects/app"]\n    }\n  }\n}`,
      sampleVerification: `// tools/call read_file\n{\n  "path": "c:/Users/developer/projects/app/angular.json"\n}`
    }
  ];

  selectedAlternativeId = signal<string>('alt-github');
  selectedAlternative = computed(() => {
    return this.alternatives.find(a => a.id === this.selectedAlternativeId()) || this.alternatives[0];
  });

  deliverables = signal<DeliverableItem[]>([
    {
      id: 'd1',
      label: '1. Diagrama de Arquitectura',
      description: 'Visualización del flujo: Agente V2–V6 → Host → MCP Client → Servidor MCP → Backend.',
      completed: false
    },
    {
      id: 'd2',
      label: '2. Configuración del Servidor MCP',
      description: 'Archivo mcp_config.json verificado con comandos, flags y variables de entorno seguras.',
      completed: false
    },
    {
      id: 'd3',
      label: '3. Evidencia de Conexión y Descubrimiento',
      description: 'Captura o log del handshake initialize y listado tools/list devuelto por el servidor.',
      completed: false
    },
    {
      id: 'd4',
      label: '4. Ejecución de una Herramienta',
      description: 'Petición tools/call enviada por el agente con argumentos válidos y respuesta procesada.',
      completed: false
    },
    {
      id: 'd5',
      label: '5. Manejo de al menos un Error',
      description: 'Evidencia de respuesta ante argumento inválido (-32602) o fallo controlado (isError: true).',
      completed: false
    },
    {
      id: 'd6',
      label: '6. Explicación de Permisos Utilizados',
      description: 'Justificación del principio de mínimo privilegio (Least Privilege) y compuerta HITL aplicada.',
      completed: false
    },
    {
      id: 'd7',
      label: '7. Demostración Funcional',
      description: 'Breve demostración del agente completando el objetivo mediante la herramienta integrada.',
      completed: false
    }
  ]);

  completedCount = computed(() => this.deliverables().filter(d => d.completed).length);
  isLabFinished = computed(() => this.completedCount() === this.deliverables().length);

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }

  toggleDeliverable(id: string): void {
    this.deliverables.update(list =>
      list.map(d => d.id === id ? { ...d, completed: !d.completed } : d)
    );
  }

  markAllComplete(): void {
    this.deliverables.update(list => list.map(d => ({ ...d, completed: true })));
    if (this.lesson) {
      this.userProgressService.markLessonAsCompleted(this.lesson.id);
    }
  }
}
