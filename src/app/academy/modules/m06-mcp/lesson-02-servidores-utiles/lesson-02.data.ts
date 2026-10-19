export interface ServerDetail {
  id: string;
  name: string;
  category: string;
  badgeColor: string;
  icon: string;
  problemSolved: string;
  whenToUse: string;
  allowedOperations: string[];
  realWorldExample: string;
  installConfig: string;
  requiredPermissions: string;
  risksAndLimits: string;
  docsUrl: string;
  sampleTools: Array<{
    name: string;
    description: string;
    inputSchema: Record<string, any>;
    sampleCall: Record<string, any>;
    sampleOutput: Record<string, any>;
  }>;
}

export const USEFUL_SERVERS: ServerDetail[] = [
  {
    id: 'github',
    name: 'GitHub MCP Server',
    category: 'Ingeniería de Software & Código',
    badgeColor: '#a855f7',
    icon: 'hub',
    problemSolved: 'Permite a los agentes de IA interactuar directamente con repositorios Git sin requerir clones locales ni scripts ad-hoc de autenticación con la API REST de GitHub.',
    whenToUse: 'En flujos de code review automatizado, triaje de incidencias, creación de pull requests, búsqueda semántica de código en la organización y auditoría de commits.',
    allowedOperations: [
      'search_repositories: Buscar repositorios por filtros.',
      'get_file_contents: Leer archivos específicos en cualquier rama o commit.',
      'create_or_update_file: Modificar archivos directamente en una rama.',
      'list_issues / create_issue: Gestionar el ciclo de vida de incidencias.',
      'create_pull_request: Abrir PRs con ramas y descripciones generadas.'
    ],
    realWorldExample: 'Un agente de guardia recibe una alerta de error en Sentry, consulta el archivo afectado en la rama main vía get_file_contents, genera el fix y abre un Pull Request etiquetado con "needs-review".',
    installConfig: `// claude_desktop_config.json / mcp_config.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}`,
    requiredPermissions: 'Token Fine-grained con permisos estrictos de "Contents: Read/Write" y "Pull requests: Read/Write" acotado únicamente a los repositorios objetivo.',
    risksAndLimits: 'Riesgo de modificación inadvertida de ramas protegidas (main/prod). Mitigación: Forzar que el token no tenga permisos de bypass sobre reglas de protección de rama y exigir compuerta HITL.',
    docsUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    sampleTools: [
      {
        name: 'get_file_contents',
        description: 'Obtiene el contenido decodificado de un archivo en un repositorio GitHub.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Dueño u organización del repositorio' },
            repo: { type: 'string', description: 'Nombre del repositorio' },
            path: { type: 'string', description: 'Ruta relativa del archivo' },
            branch: { type: 'string', description: 'Rama o commit SHA' }
          },
          required: ['owner', 'repo', 'path']
        },
        sampleCall: {
          owner: 'enterprise-org',
          repo: 'auth-service',
          path: 'src/tokens/jwt.verifier.ts',
          branch: 'main'
        },
        sampleOutput: {
          path: 'src/tokens/jwt.verifier.ts',
          sha: 'd6b9e2810f',
          size: 1420,
          content: 'export class JwtVerifier { verify(token: string) { ... } }'
        }
      },
      {
        name: 'create_issue',
        description: 'Crea una nueva incidencia con título, cuerpo y etiquetas.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            labels: { type: 'array', items: { type: 'string' } }
          },
          required: ['owner', 'repo', 'title', 'body']
        },
        sampleCall: {
          owner: 'enterprise-org',
          repo: 'auth-service',
          title: 'Audit: Expiración de token JWT muy prolongada en ambiente staging',
          body: 'Detectado durante análisis estático agéntico en L02.',
          labels: ['security', 'audit']
        },
        sampleOutput: {
          id: 504,
          number: 28,
          html_url: 'https://github.com/enterprise-org/auth-service/issues/28',
          state: 'open'
        }
      }
    ]
  },
  {
    id: 'filesystem',
    name: 'Filesystem MCP Server',
    category: 'Acceso Local Controlado',
    badgeColor: '#10b981',
    icon: 'folder',
    problemSolved: 'Concede al agente acceso seguro al sistema de archivos local únicamente dentro de los directorios raíz explícitamente parametrizados al arrancar el servidor.',
    whenToUse: 'En refactorizaciones locales, análisis de código en workspace, generación de artefactos, lectura de configuraciones y testing en máquina local.',
    allowedOperations: [
      'read_file: Leer el contenido UTF-8 de un archivo autorizado.',
      'write_file: Crear o sobreescribir un archivo.',
      'list_directory: Explorar archivos y carpetas en un directorio.',
      'directory_tree: Generar la estructura jerárquica de un árbol de carpetas.',
      'search_files: Búsqueda rápida por patrón o nombre de archivo.'
    ],
    realWorldExample: 'El agente lee el esquema de la base de datos local /src/db/schema.sql, detecta que falta un índice en la columna user_id y redacta una nueva migración en /src/db/migrations/004_add_index.sql.',
    installConfig: `// claude_desktop_config.json / mcp_config.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\\\Users\\\\developer\\\\projects\\\\app"
      ]
    }
  }
}`,
    requiredPermissions: 'El servidor hereda los permisos del usuario que inicia el proceso, pero el código del servidor MCP valida estrictamente que ninguna ruta escape del directorio raíz especificado (prevención de Path Traversal ../../).',
    risksAndLimits: 'Sobreescritura destructiva de archivos del código fuente. Mitigación: Mantener el proyecto bajo control de versiones Git y configurar copias de seguridad automáticas antes de ejecuciones masivas.',
    docsUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    sampleTools: [
      {
        name: 'read_file',
        description: 'Lee el contenido de un archivo dentro de los directorios permitidos.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta absoluta o relativa dentro del directorio raíz' }
          },
          required: ['path']
        },
        sampleCall: {
          path: 'C:/Users/developer/projects/app/angular.json'
        },
        sampleOutput: {
          content: '{\n  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",\n  "version": 1,\n  "projects": { ... }\n}'
        }
      },
      {
        name: 'list_directory',
        description: 'Lista archivos y carpetas de un directorio autorizado.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' }
          },
          required: ['path']
        },
        sampleCall: {
          path: 'C:/Users/developer/projects/app/src'
        },
        sampleOutput: {
          entries: [
            { name: 'app', isDirectory: true },
            { name: 'index.html', isDirectory: false, size: 540 },
            { name: 'main.ts', isDirectory: false, size: 280 }
          ]
        }
      }
    ]
  },
  {
    id: 'playwright',
    name: 'Playwright MCP Server',
    category: 'Automatización & Browser QA',
    badgeColor: '#38bdf8',
    icon: 'open_in_browser',
    problemSolved: 'Proporciona al agente un navegador headless para navegar por páginas web, validar interfaces de usuario, interactuar con elementos, inspeccionar la consola y tomar capturas de pantalla.',
    whenToUse: 'En validación end-to-end de aplicaciones web, comprobación visual de cambios de frontend, reproducción de errores reportados por usuarios y scraping dinámico con JavaScript.',
    allowedOperations: [
      'browser_navigate: Navega a una URL especificada.',
      'browser_click: Hace clic en un elemento mediante selector CSS o rol accesible.',
      'browser_type: Escribe texto en un campo de entrada.',
      'browser_screenshot: Captura una imagen del estado actual de la pantalla.',
      'browser_console_logs: Inspecciona los logs de consola y errores de red.'
    ],
    realWorldExample: 'Tras implementar un cambio en el componente de login, el agente inicia el navegador en localhost:4200, ingresa credenciales de prueba, verifica la transición al dashboard y captura un screenshot como evidencia.',
    installConfig: `// claude_desktop_config.json / mcp_config.json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}`,
    requiredPermissions: 'Acceso a la red local y externa para abrir conexiones HTTP/HTTPS y ejecutar procesos de Chromium en modo headless.',
    risksAndLimits: 'Ejecución accidental de acciones en entornos de producción (ej. clicks en botones de compra o borrado). Mitigación: Restringir las URLs permitidas a localhost y entornos de staging mediante variables de entorno.',
    docsUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/playwright',
    sampleTools: [
      {
        name: 'browser_navigate',
        description: 'Navega a una URL y espera a que el DOM esté listo.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL a cargar' }
          },
          required: ['url']
        },
        sampleCall: {
          url: 'http://localhost:4200/academy/home'
        },
        sampleOutput: {
          status: 200,
          title: 'CASE Academy — Ingeniería de Sistemas Probabilísticos',
          viewport: { width: 1280, height: 720 }
        }
      },
      {
        name: 'browser_screenshot',
        description: 'Captura la pantalla actual y devuelve la imagen codificada en base64.',
        inputSchema: {
          type: 'object',
          properties: {
            fullPage: { type: 'boolean', description: 'Si debe capturar la página completa' }
          }
        },
        sampleCall: {
          fullPage: false
        },
        sampleOutput: {
          format: 'image/png',
          data: 'iVBORw0KGgoAAAANSUhEUgAABAAAAAMACAYAAAC6...',
          dimensions: { width: 1280, height: 720 }
        }
      }
    ]
  },
  {
    id: 'postgres',
    name: 'PostgreSQL / Supabase MCP Server',
    category: 'Bases de Datos Relacionales',
    badgeColor: '#3b82f6',
    icon: 'database',
    problemSolved: 'Expone esquemas relacionales, tablas y capacidades de consulta estructurada a modelos de IA sin requerir que el LLM genere credenciales de conexión directas.',
    whenToUse: 'En analítica de datos en lenguaje natural, introspección de esquemas en migraciones, depuración de datos inconsistentes y generación asistida de queries optimizadas.',
    allowedOperations: [
      'list_tables: Lista las tablas disponibles en el esquema.',
      'describe_table: Devuelve tipos de columna, claves foráneas e índices.',
      'execute_sql: Ejecuta consultas SELECT parametrizadas.',
      'read_resource: Acceso de sólo lectura a vistas precalculadas vía URIs postgres://.'
    ],
    realWorldExample: 'El agente recibe la consulta "¿Cuántos estudiantes completaron el módulo 05 esta semana?", inspecciona el esquema de learning_progress, formula el SELECT y devuelve el reporte tabular.',
    installConfig: `// claude_desktop_config.json / mcp_config.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://read_only_user:pass@db.internal:5432/production_replica"
      ]
    }
  }
}`,
    requiredPermissions: 'Usuario de base de datos con permisos estrictos de sólo lectura (GRANT SELECT ON ALL TABLES) sobre una réplica de lectura, nunca sobre el nodo primario de escritura.',
    risksAndLimits: 'Inyección de SQL o sobrecarga por queries no indexadas (full table scan). Mitigación: Configurar statement_timeout = 3000ms a nivel de conexión de base de datos.',
    docsUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    sampleTools: [
      {
        name: 'describe_table',
        description: 'Obtiene el esquema de columnas y restricciones de una tabla.',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: { type: 'string' }
          },
          required: ['table_name']
        },
        sampleCall: {
          table_name: 'learning_progress'
        },
        sampleOutput: {
          table: 'learning_progress',
          columns: [
            { name: 'user_id', type: 'uuid', nullable: false },
            { name: 'unit_id', type: 'text', nullable: false },
            { name: 'completed_at', type: 'timestamptz', nullable: true }
          ]
        }
      }
    ]
  },
  {
    id: 'linear',
    name: 'Jira / Linear MCP Server',
    category: 'Gestión de Proyectos & Tickets',
    badgeColor: '#f59e0b',
    icon: 'task_alt',
    problemSolved: 'Conecta el contexto del equipo de desarrollo (sprints, prioridades, especificaciones de historias de usuario) con los agentes de código.',
    whenToUse: 'En automatización de triaje de tickets, sincronización de estado de tareas según commits de Git, extracción de requerimientos de negocio y redacción de release notes.',
    allowedOperations: [
      'search_issues: Busca incidencias por ciclo, estado o asignado.',
      'get_issue: Lee la descripción completa, comentarios y criterios de aceptación.',
      'update_issue_status: Transiciona un ticket a "In Progress" o "Ready for Review".',
      'add_comment: Publica resúmenes técnicos o enlaces a PRs en el ticket.'
    ],
    realWorldExample: 'Al comenzar a trabajar en el ticket ENG-104, el agente consulta la descripción en Linear, extrae los criterios de aceptación y los utiliza como contrato de pruebas en el bucle agéntico.',
    installConfig: `// claude_desktop_config.json / mcp_config.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-linear"],
      "env": {
        "LINEAR_API_KEY": "lin_api_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}`,
    requiredPermissions: 'API Key con permisos de lectura de historias y escritura de comentarios en el equipo asignado.',
    risksAndLimits: 'Comentarios masivos innecesarios o cambios erróneos de estado en tickets de clientes. Mitigación: Requerir confirmación antes de mutar estados de historias.',
    docsUrl: 'https://github.com/jerhadf/linear-mcp-server',
    sampleTools: [
      {
        name: 'get_issue',
        description: 'Recupera el detalle y criterios de aceptación de un issue.',
        inputSchema: {
          type: 'object',
          properties: {
            issueId: { type: 'string', description: 'Identificador del issue (ej. ENG-104)' }
          },
          required: ['issueId']
        },
        sampleCall: {
          issueId: 'ENG-104'
        },
        sampleOutput: {
          identifier: 'ENG-104',
          title: 'Migrar autenticación a tokens JWT asimétricos Ed25519',
          priority: 'High',
          state: 'In Progress',
          assignee: 'agent-pair'
        }
      }
    ]
  },
  {
    id: 'custom',
    name: 'Servidores MCP Personalizados (Custom)',
    category: 'Integración Corporativa a Medida',
    badgeColor: '#06b6d4',
    icon: 'construction',
    problemSolved: 'Permite conectar cualquier sistema legado, ERP (SAP, Oracle), CRM o API interna propietaria con el ecosistema de agentes mediante el MCP SDK oficial.',
    whenToUse: 'Cuando la organización posee sistemas propios no públicos o cuando se requiere aplicar validaciones de negocio corporativas antes de invocar una operación.',
    allowedOperations: [
      'Definidas a la medida del negocio con TypeScript SDK (@modelcontextprotocol/sdk) o Python SDK (mcp).',
      'Exposición de Resources protegidos con URIs empresariales (crm://clientes/{id}).',
      'Herramientas con validación previa de esquemas mediante Zod o Pydantic.'
    ],
    realWorldExample: 'La Cooperativa Financiera CFA expone un servidor MCP custom en Node.js que valida las reglas de crédito del asociado antes de permitir que el agente de asesoría simule una tasa de interés.',
    installConfig: `// package.json / server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "cfa-core-mcp", version: "1.0.0" });

server.tool("get_associate_balance", { associate_id: z.string() }, async ({ associate_id }) => {
  const balance = await cfaLegacyDb.getBalance(associate_id);
  return { content: [{ type: "text", text: JSON.stringify(balance) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);`,
    requiredPermissions: 'Configurados en la capa de transporte y middleware del servidor custom con autenticación mTLS, tokens JWT corporativos o variables de entorno locales.',
    risksAndLimits: 'Mantenimiento del código del servidor y posibles cuellos de botella en stdio si se procesan payloads masivos no paginados.',
    docsUrl: 'https://modelcontextprotocol.io/docs/tools',
    sampleTools: [
      {
        name: 'get_associate_balance',
        description: 'Consulta el saldo y estado financiero del asociado en la base de datos de CFA.',
        inputSchema: {
          type: 'object',
          properties: {
            associate_id: { type: 'string', description: 'Cédula o ID del asociado' }
          },
          required: ['associate_id']
        },
        sampleCall: {
          associate_id: 'CFA-904128'
        },
        sampleOutput: {
          associate_id: 'CFA-904128',
          accountType: 'Aportes y Ahorro Programado',
          status: 'Activo al día',
          maxCreditAuthorized: 15000000
        }
      }
    ]
  }
];

export const LESSON_02_DOCUMENT = {
  title: 'Los Servidores MCP más Útiles para Desarrollo de Software',
  subtitle: 'Análisis comparativo, arquitectura de seguridad y casos prácticos de integración con GitHub, Filesystem, Playwright, bases de datos y sistemas corporativos.',
  eyebrow: 'Módulo 06 · Lección 02',
  duration: '65 min',
  difficulty: 'INTERMEDIATE',
  moduleBadge: 'M06 · Model Context Protocol',
  servers: USEFUL_SERVERS,
  learningObjectives: [
    { icon: 'handyman', text: 'Evaluar y seleccionar los servidores MCP ideales para flujos de código, archivos, navegador y bases de datos.' },
    { icon: 'code', text: 'Configurar y autorizar GitHub MCP, Filesystem MCP y Playwright MCP bajo Least Privilege.' },
    { icon: 'policy', text: 'Identificar riesgos de seguridad, mitigaciones y gobernanza de tokens en repositorios y sistemas de archivos.' },
    { icon: 'build_circle', text: 'Entender la estructura para construir un servidor MCP corporativo personalizado.' }
  ],
  fundamentalConcepts: [
    { icon: 'hub', title: 'GitHub MCP', description: 'Inspección de código, búsqueda semántica en repositorios y automatización de pull requests.' },
    { icon: 'folder', title: 'Filesystem MCP', description: 'Lectura y escritura estrictamente confinada a subdirectorios autorizados del sistema de archivos.' },
    { icon: 'open_in_browser', title: 'Playwright MCP', description: 'Validación visual, navegación e interacción sin backend sobre aplicaciones web en vivo.' },
    { icon: 'dns', title: 'Bases de Datos & Propietarios', description: 'Consultas SQL acotadas de sólo lectura y conectores para sistemas legados corporativos.' }
  ],
  commonPitfalls: [
    {
      title: 'Montar la raíz del disco (C:\\ o /) en Filesystem MCP',
      solution: 'Confinar siempre el servidor a la carpeta específica del proyecto (ej. /workspace/src). Evitar exponer credenciales locales o claves SSH.'
    },
    {
      title: 'Usar Personal Access Tokens (PAT) de GitHub con permisos de Administrador',
      solution: 'Generar Fine-grained PATs con permisos acotados exclusivamente a los repositorios destino y sin capacidad de saltarse protecciones de rama.'
    },
    {
      title: 'Saturar el contexto del agente cargando decenas de herramientas innecesarias',
      solution: 'Activar únicamente los servidores y tools indispensables para la tarea en curso, reduciendo consumo de tokens y confusión del LLM.'
    }
  ],
  groupQuestions: [
    {
      question: '¿Por qué Filesystem MCP requiere especificar rutas raíz explícitas en sus argumentos de inicio?',
      expectedAnswer: 'Para crear un sandbox de ejecución (jail) que impida al servidor acceder a archivos del sistema operativo fuera del directorio de trabajo permitido.'
    },
    {
      question: '¿Qué ventaja ofrece Playwright MCP frente a llamadas HTTP directas para probar una UI?',
      expectedAnswer: 'Permite interactuar con el DOM real renderizado por JavaScript, validar flujos interactivos, capturar capturas de pantalla y verificar el estado visual exacto.'
    }
  ],
  synthesis: {
    summary: 'Los servidores MCP son los órganos sensoriales y motores del agente: GitHub permite auditar y mutar código, Filesystem interactúa con el entorno local de forma segura, y Playwright valida la experiencia en el navegador.',
    transitionText: 'Conocidos los servidores esenciales, en la Lección 03 aprenderemos a instalarlos, configurar sus transportes (stdio vs HTTP), inspeccionar llamadas JSON-RPC y resolver errores en producción.'
  }
};
