import { LessonDocument } from '../lesson-01-que-es-mcp/lesson-01.data';

export const LESSON_03_DOCUMENT: LessonDocument = {
  title: 'Configuración y Utilización Práctica de Servidores MCP',
  subtitle: 'Transportes stdio y Streamable HTTP, archivos de configuración, inspección JSON-RPC, manejo de errores y compuertas de seguridad.',
  eyebrow: 'Módulo 06 · Lección 03',
  duration: '60 min',
  difficulty: 'ADVANCED',
  moduleBadge: 'M06 · Model Context Protocol',
  learningObjectives: [
    { icon: 'settings_ethernet', text: 'Discernir técnica y arquitectónicamente entre el transporte local stdio y el transporte distribuido Streamable HTTP.' },
    { icon: 'description', text: 'Construir archivos mcp_config.json de producción con comandos, argumentos y variables de entorno seguras.' },
    { icon: 'troubleshoot', text: 'Monitorear e inspeccionar paquetes JSON-RPC 2.0 (initialize, tools/list, tools/call).' },
    { icon: 'gavel', text: 'Implementar compuertas de seguridad Human-in-the-Loop (HITL) para operaciones de mutación destructiva.' }
  ],
  fundamentalConcepts: [
    { icon: 'terminal', title: 'Transporte stdio (IPC)', description: 'Procesos hijos locales comunicados mediante stdin/stdout sin latencia de red ni puertos expuestos.' },
    { icon: 'cloud_sync', title: 'Streamable HTTP (SSE)', description: 'Servicios remotos distribuidos con Server-Sent Events y endpoints POST para ambientes cloud.' },
    { icon: 'integration_instructions', title: 'Mensajería JSON-RPC 2.0', description: 'Estructura canónica de peticiones, respuestas tipadas y manejo formal de códigos de error.' },
    { icon: 'verified_user', title: 'Compuertas Human-in-the-Loop', description: 'Frontera de autorización donde el runtime suspende la llamada hasta obtener confirmación humana.' }
  ],
  comparison: {
    beforeTitle: 'Transporte Local stdio (Procesos Hijos)',
    beforeItems: [
      'El cliente MCP arranca directamente el proceso del servidor como subproceso local.',
      'Comunicación mediante entrada/salida estándar (stdin / stdout).',
      'Sin latencia de red ni puertos abiertos en la máquina.',
      'Excelente para herramientas locales (filesystem, git CLI, dev tools).',
      'Requiere que el entorno local tenga instalado el runtime (Node.js, Python, uvx).'
    ],
    afterTitle: 'Transporte Remoto Streamable HTTP (Cloud & Distributed)',
    afterItems: [
      'El servidor corre en un host remoto o clúster como microservicio independiente.',
      'Comunicación bidireccional mediante Server-Sent Events (SSE) y POSTs HTTP.',
      'Permite compartir un servidor MCP centralizado entre múltiples ingenieros y agentes.',
      'Ideal para bases de datos corporativas, CRM y servicios en la nube.',
      'Exige capas de transporte seguro TLS y autenticación mediante Authorization Headers.'
    ]
  },
  sections: [
    {
      id: 'transports',
      eyebrow: '01. CAPA DE TRANSPORTE',
      title: 'Transportes Oficiales: stdio vs Streamable HTTP',
      lead: 'MCP estandariza cómo los mensajes JSON-RPC 2.0 se transfieren entre el cliente y el servidor.',
      paragraphs: [
        'Transporte stdio: En este modo, el MCP Client (en CASE OS o Claude Desktop) ejecuta un comando del sistema (por ejemplo, "npx -y @modelcontextprotocol/server-filesystem C:\\repo") como un proceso hijo. El cliente escribe peticiones JSON delimitadas por saltos de línea en el descriptor stdin del servidor y lee las respuestas en stdout.',
        'Transporte Streamable HTTP: Para arquitecturas cliente-servidor distribuidas en red o en la nube, MCP define un transporte basado en Server-Sent Events (SSE) para el streaming de eventos desde el servidor hacia el cliente, complementado con peticiones HTTP POST para el envío de llamadas y comandos del cliente hacia el servidor.',
        'Regla dorada en stdio: El proceso del servidor MCP NUNCA debe escribir logs arbitrarios con console.log() en stdout, ya que corrompe el flujo JSON-RPC del cliente. Los logs deben dirigirse estrictamente a stderr.'
      ],
      codeBlock: {
        language: 'bash',
        caption: 'Comando de ejecución verificado de servidores comunes',
        code: `# Ejecución local vía npx (Node.js)
npx -y @modelcontextprotocol/server-filesystem /workspace

# Ejecución local vía uvx (Python)
uvx mcp-server-git --repository /workspace/project

# Ejecución remota vía Streamable HTTP
curl -N -H "Accept: text/event-stream" https://mcp.enterprise.internal/sse`
      }
    },
    {
      id: 'config-files',
      eyebrow: '02. CONFIGURACIÓN EN CLIENTES',
      title: 'Archivos de Configuración en el Ecosistema',
      lead: 'Tanto Claude Desktop como editores agénticos (Cursor, Antigravity IDE, CASE OS) utilizan esquemas de configuración JSON estandarizados.',
      paragraphs: [
        'En Windows, Claude Desktop lee la configuración desde %APPDATA%\\Claude\\claude_desktop_config.json. En macOS, desde ~/Library/Application Support/Claude/claude_desktop_config.json.',
        'En CASE OS y Antigravity, la configuración reside en el archivo mcp_config.json dentro de la carpeta .agents del workspace.',
        'Dentro del bloque "mcpServers", cada clave define el identificador del servidor, el comando a ejecutar, sus argumentos y las variables de entorno necesarias para la autenticación.'
      ],
      codeBlock: {
        language: 'json',
        caption: 'mcp_config.json de producción con múltiples servidores y tokens de entorno',
        code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:/Users/developer/projects/core-app"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_live_access_token_here"
      }
    },
    "postgres-staging": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://ro_agent:secret@10.0.4.12:5432/staging_db"]
    }
  }
}`
      }
    },
    {
      id: 'lifecycle-rpc',
      eyebrow: '03. PROTOCOLO JSON-RPC 2.0',
      title: 'Ciclo de Vida de las Primitivas MCP',
      lead: 'MCP estructura toda la comunicación en tres fases bien definidas: Inicialización, Descubrimiento e Invocación.',
      paragraphs: [
        '1. Inicialización (initialize): El cliente envía sus capacidades y versión de protocolo. El servidor responde con su identidad y confirma qué primitivas soporta (tools, resources, prompts).',
        '2. Descubrimiento (tools/list): El cliente solicita la lista de herramientas disponibles. El servidor retorna un array de definiciones donde cada herramienta incluye su nombre semántico, descripción en lenguaje natural y su inputSchema validable con JSON-Schema.',
        '3. Invocación (tools/call): Cuando el modelo decide usar una herramienta, el cliente emite una petición tools/call enviando el "name" y el objeto "arguments". El servidor ejecuta y responde con content array (text, image, resource) e indicador isError: boolean.'
      ],
      callout: {
        type: 'info',
        title: 'Manejo de Errores Estandarizado',
        message: 'Si los argumentos violan el schema, el servidor responde con JSON-RPC Error Code -32602 (Invalid Params). Si la herramienta falla internamente (ej. archivo no encontrado), responde con resultado normal pero isError: true, permitiendo que el LLM lea el error y replanifique su estrategia.'
      }
    },
    {
      id: 'troubleshooting',
      eyebrow: '04. DIAGNÓSTICO Y SEGURIDAD',
      title: 'Diagnóstico de Problemas Frecuentes y Human-in-the-Loop',
      lead: 'La mayoría de fallos en producción con MCP provienen de 3 errores típicos de configuración.',
      paragraphs: [
        'Error ENOENT / Command Not Found: Ocurre cuando el cliente intenta ejecutar "npx" o "uvx" pero el binario no está en el PATH del proceso que ejecuta el cliente. En Windows, se soluciona especificando la ruta absoluta del ejecutable (ej. "C:\\\\Program Files\\\\nodejs\\\\npx.cmd").',
        'Variables de Entorno No Heredadas: Muchos clientes MCP no heredan automáticamente las variables del shell de usuario (.bashrc o variables de usuario de Windows). Es imperativo definirlas explícitamente en el bloque "env" del mcp_config.json.',
        'Timeout en Procesos stdio: Si el servidor MCP tarda demasiado en inicializar (por ejemplo, instalando dependencias en frío con npx), el cliente puede abortar la conexión por timeout. Es una mejor práctica instalar globalmente el paquete del servidor (npm i -g @modelcontextprotocol/server-...) y ejecutar directamente su comando.'
      ],
      keyTakeaways: [
        'Los servidores locales stdio nunca deben ensuciar stdout con logs; usar stderr.',
        'El archivo mcp_config.json es el punto único de configuración de herramientas del agente.',
        'Las herramientas destructivas (mutaciones de base de datos, git push) deben requerir confirmación humana explícita.',
        'El código isError: true permite que el agente aprenda del error y formule una llamada correctiva.'
      ]
    }
  ],
  commonPitfalls: [
    {
      title: 'Fallo ENOENT / Command Not Found al ejecutar subprocesos en Windows',
      solution: 'Los daemons a menudo no heredan el PATH interactivo. Usar la ruta completa al binario (ej. C:\\Program Files\\nodejs\\npx.cmd) o configurar extensiones .cmd explícitas.'
    },
    {
      title: 'Timeouts de Inicialización en descarga de paquetes con npx',
      solution: 'Instalar los servidores MCP localmente o globalmente con npm i -g para evitar descargas en frío en cada arranque del cliente.'
    },
    {
      title: 'Exposición accidental de secretos y variables de entorno en repositorios',
      solution: 'Nunca commitear tokens en mcp_config.json; referenciar variables de entorno del sistema o usar inyectores seguros de secretos.'
    }
  ],
  groupQuestions: [
    {
      question: '¿Qué sucede si un servidor MCP stdio escribe logs de depuración mediante console.log en stdout?',
      expectedAnswer: 'Rompe la comunicación JSON-RPC porque el cliente espera únicamente mensajes JSON válidos delimitados por saltos de línea. Los logs deben escribirse en stderr.'
    },
    {
      question: '¿Por qué la compuerta Human-in-the-Loop (HITL) debe resolverse en el Host y no dentro del servidor MCP?',
      expectedAnswer: 'Porque el Host es la entidad de confianza que controla la interfaz de usuario, las credenciales del usuario y las políticas organizacionales de seguridad.'
    }
  ],
  synthesis: {
    summary: 'La configuración sólida de servidores MCP combina transporte adecuado (stdio para local, HTTP para red), control estricto de secretos en mcp_config.json, supervisión de paquetes JSON-RPC y compuertas de seguridad HITL para mutaciones de datos.',
    transitionText: 'Con los servidores configurados y verificados, en la Lección 04 integraremos múltiples servidores en vivo dentro del Agent Loop desarrollado en el Módulo M05.'
  }
};
