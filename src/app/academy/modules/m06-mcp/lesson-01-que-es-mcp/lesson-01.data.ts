export interface LearningObjective {
  icon: string;
  text: string;
}

export interface FundamentalConcept {
  icon: string;
  title: string;
  description: string;
}

export interface CommonPitfall {
  title: string;
  solution: string;
}

export interface GroupQuestion {
  question: string;
  expectedAnswer: string;
}

export interface SynthesisBlock {
  summary: string;
  transitionText: string;
}

export interface LessonSection {
  id: string;
  title: string;
  eyebrow?: string;
  lead?: string;
  paragraphs?: string[];
  callout?: {
    type: 'info' | 'warning' | 'tip' | 'danger';
    title: string;
    message: string;
  };
  codeBlock?: {
    language: string;
    code: string;
    caption?: string;
  };
  keyTakeaways?: string[];
}

export interface LessonDocument {
  title: string;
  subtitle: string;
  eyebrow: string;
  duration: string;
  difficulty: string;
  moduleBadge: string;
  learningObjectives?: LearningObjective[];
  fundamentalConcepts?: FundamentalConcept[];
  sections: LessonSection[];
  comparison?: {
    beforeTitle: string;
    beforeItems: string[];
    afterTitle: string;
    afterItems: string[];
  };
  commonPitfalls?: CommonPitfall[];
  groupQuestions?: GroupQuestion[];
  synthesis?: SynthesisBlock;
}

export const LESSON_01_DOCUMENT: LessonDocument = {
  title: '¿Qué es MCP y por qué necesitamos utilizarlo?',
  subtitle: 'Del caos de las integraciones N × M al estándar abierto de interoperabilidad para agentes de Inteligencia Artificial.',
  eyebrow: 'Módulo 06 · Lección 01',
  duration: '55 min',
  difficulty: 'INTERMEDIATE',
  moduleBadge: 'M06 · Model Context Protocol',
  learningObjectives: [
    { icon: 'hub', text: 'Comprender el problema de escalabilidad N × M de las integraciones tradicionales y cómo MCP lo reduce a N + M.' },
    { icon: 'account_tree', text: 'Diferenciar con precisión Tool Calling, APIs REST y Model Context Protocol.' },
    { icon: 'shield', text: 'Dominar la separación de responsabilidades y fronteras de seguridad entre Host, Client y Server.' },
    { icon: 'sync_alt', text: 'Trazar el ciclo de vida completo de un mensaje JSON-RPC 2.0 desde la intención hasta la respuesta.' }
  ],
  fundamentalConcepts: [
    { icon: 'device_hub', title: 'Arquitectura en Estrella (N + M)', description: 'Un único conector estándar permite a N clientes interactuar con M herramientas sin reprogramar integraciones.' },
    { icon: 'dns', title: 'Desacoplamiento Host–Server', description: 'El Host gobierna la seguridad y la UI; el Server expone herramientas en un proceso aislado sin conocer al modelo.' },
    { icon: 'category', title: 'Tres Primitivas Fundamentales', description: 'Tools (funciones con efectos/consultas), Resources (lectura pasiva de URIs) y Prompts (plantillas guiadas).' }
  ],
  comparison: {
    beforeTitle: 'Integración Tradicional (Caos N × M)',
    beforeItems: [
      'Cada cliente o agente escribe su propio conector propietario para cada herramienta.',
      'N clientes × M herramientas = N × M integraciones frágiles y acopladas.',
      'Cualquier cambio de esquema en la API rompe todos los agentes simultáneamente.',
      'Las credenciales se dispersan y la auditoría de seguridad es inconsistente.',
      'Lógica de parseo, prompts y autorización duplicada en cada framework.'
    ],
    afterTitle: 'Arquitectura Model Context Protocol (MCP)',
    afterItems: [
      'Protocolo estandarizado abierto sobre JSON-RPC 2.0 (Host, Client, Server).',
      'N clientes + M herramientas = Arquitectura desacoplada en estrella (N + M).',
      'Descubrimiento dinámico de herramientas (tools), recursos (resources) y prompts.',
      'Aislamiento de procesos con permisos granulares (Least Privilege) y HITL.',
      'Reutilización universal entre Claude Desktop, CASE OS, Cursor, VS Code y agentes custom.'
    ]
  },
  sections: [
    {
      id: 'nxm-problem',
      eyebrow: '01. EL ORIGEN DEL PROBLEMA',
      title: 'La crisis de integración N × M en sistemas agénticos',
      lead: 'A medida que los agentes de IA abandonan los prototipos de chat para interactuar con sistemas de producción, el modelo de integración directa colapsa rápidamente.',
      paragraphs: [
        'En los inicios del desarrollo agéntico, cada desarrollador escribía funciones personalizadas (Python functions, endpoints REST, wrappers de base de datos) y las inyectaba manualmente en el prompt del LLM. Esto funcionaba mientras existía un único agente conectado a un único repositorio o base de datos.',
        'Sin embargo, cuando una organización tiene múltiples clientes (IDE del desarrollador, agente de CI/CD, bot de soporte, dashboard analítico) y múltiples fuentes de datos (GitHub, Jira, PostgreSQL, logs en Datadog, Slack), la cantidad de integraciones necesarias crece de forma multiplicativa: N clientes × M herramientas.',
        'Este escenario reproduce exactamente el problema que resolvió Language Server Protocol (LSP) en 2016 para los lenguajes de programación y los editores de código. Model Context Protocol (MCP) es el equivalente a LSP para la era agéntica: un protocolo abierto que desacopla a los modelos de IA de las herramientas del mundo real.'
      ],
      callout: {
        type: 'info',
        title: 'Principio de Desacoplamiento',
        message: 'El modelo de IA debe razonar sobre interfaces semánticas estándar, no conocer los detalles de conexión TCP, librerías cliente o tokens propietarios de cada servicio.'
      }
    },
    {
      id: 'tool-calling-vs-mcp',
      eyebrow: '02. CLARIDAD CONCEPTUAL',
      title: 'Tool Calling frente a Model Context Protocol (MCP)',
      lead: 'Una de las confusiones más comunes es considerar que MCP es un reemplazo de Tool Calling. No lo es: son capas complementarias de una misma arquitectura.',
      paragraphs: [
        'Tool Calling (o Function Calling) es una capacidad intrínseca del Modelo Fundacional (LLM). Es el mecanismo mediante el cual el modelo, entrenado para reconocer definiciones en formato JSON-Schema, decide pausar la generación de texto y emitir un objeto JSON estructurado con el nombre de la función y sus argumentos.',
        'Model Context Protocol (MCP) es el protocolo de transporte, descubrimiento y ejecución entre el Host (la aplicación que corre el agente) y el Server (el proceso que expone las herramientas o datos).',
        'MCP resuelve cómo el Host descubre qué herramientas existen (tools/list), valida los esquemas, gestiona el transporte (stdio o HTTP), ejecuta de forma segura el proceso externo y devuelve el resultado estandarizado al contexto del modelo.'
      ],
      codeBlock: {
        language: 'text',
        caption: 'Pila Arquitectónica: De la intención semántica a la ejecución real',
        code: `+-------------------------------------------------------------------+
| 1. LLM (Reasoning Engine) -> Emite Tool Call: { name, arguments } |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 2. MCP Host (CASE OS / Runtime) -> Orquesta contexto y políticas  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 3. MCP Client -> Serializa JSON-RPC 2.0 y maneja canal de transporte|
+-------------------------------------------------------------------+
                                  | (stdio / Streamable HTTP)
                                  v
+-------------------------------------------------------------------+
| 4. MCP Server (Proceso Independiente) -> Expone Tools y Resources |
+-------------------------------------------------------------------+
                                  | (Acceso restringido / Sandbox)
                                  v
+-------------------------------------------------------------------+
| 5. Sistema Externo -> GitHub API / Postgres DB / Filesystem / Web |
+-------------------------------------------------------------------+`
      }
    },
    {
      id: 'mcp-architecture',
      eyebrow: '03. ANATOMÍA DEL PROTOCOLO',
      title: 'Arquitectura Host, Client y Server',
      lead: 'El protocolo define tres roles con fronteras de seguridad y responsabilidades estrictas.',
      paragraphs: [
        'Host: Es la aplicación de usuario o agente que requiere contexto adicional o capacidades de ejecución. Ejemplos de hosts son CASE OS, Claude Desktop, Cursor o un script de Node/Python usando el MCP SDK. El Host controla la interfaz, gestiona la clave del LLM y aplica políticas de autorización humana (Human-in-the-Loop).',
        'MCP Client: Cada Host contiene uno o más clientes MCP. Un MCP Client mantiene una conexión dedicada 1:1 con un MCP Server específico. El cliente se encarga del handshake inicial, negociación de capacidades (capabilities), timeouts y reconexión.',
        'MCP Server: Es un proceso ligero e independiente que expone capacidades al cliente. No necesita saber qué modelo de IA está al otro lado. Solo expone herramientas ejecutables (Tools), recursos de sólo lectura (Resources) y plantillas guiadas (Prompts).'
      ],
      callout: {
        type: 'warning',
        title: 'Aislamiento de Privilegios (Least Privilege)',
        message: 'Un MCP Server se ejecuta en su propio proceso. Si el servidor de Filesystem solo tiene acceso concedido a /projects/app, el agente no puede acceder al resto del disco aunque el modelo lo solicite.'
      }
    },
    {
      id: 'flow-lifecycle',
      eyebrow: '04. CICLO DE VIDA',
      title: 'Flujo completo de una petición en MCP',
      lead: 'Comprender el ciclo de vida de un mensaje permite depurar problemas de comunicación y diseñar arquitecturas tolerantes a fallos.',
      paragraphs: [
        '1. Handshake Inicial: Al arrancar, el MCP Client envía un mensaje "initialize" conteniendo su versión de protocolo e información del cliente. El MCP Server responde con sus capabilities (herramientas soportadas, soporte de notificaciones de cambios).',
        '2. Descubrimiento: El cliente invoca "tools/list". El servidor devuelve la lista completa de herramientas con sus esquemas JSON-Schema y descripciones semánticas. El Host toma estas definiciones y las inyecta en el prompt del sistema del LLM.',
        '3. Solicitud del Usuario: El usuario formula un objetivo (ej. "Revisa los pull requests abiertos con fallos de CI").',
        '4. Decisión del Modelo: El LLM determina que necesita consultar la herramienta "github_list_prs" con argumento { state: "open" } y emite una propuesta de Tool Call.',
        '5. Despacho y Ejecución: El Host recibe la propuesta, verifica políticas de seguridad, delega al MCP Client respectivo, y este emite una petición JSON-RPC "tools/call" hacia el MCP Server.',
        '6. Observación: El MCP Server interactúa con GitHub, recibe la respuesta y la empaqueta como contenido estructurado. El Host inyecta esta observación en el contexto del LLM para continuar el bucle agéntico.'
      ],
      keyTakeaways: [
        'MCP transforma una complejidad N × M en una arquitectura escalable N + M.',
        'Tool Calling es la capacidad del LLM; MCP es el protocolo de conexión Host-Server.',
        'El aislamiento de procesos garantiza que los servidores se ejecuten bajo el principio de mínimo privilegio.',
        'El protocolo es neutral respecto al proveedor de IA: funciona con cualquier modelo moderno.'
      ]
    }
  ],
  commonPitfalls: [
    {
      title: 'Confundir Tool Calling con el Protocolo MCP',
      solution: 'Tool Calling es la capacidad interna del modelo para formatear argumentos; MCP es el protocolo de transporte, descubrimiento y seguridad que desacopla la ejecución.'
    },
    {
      title: 'Permitir que el Servidor MCP escriba logs arbitrarios en stdout (stdio)',
      solution: 'En transporte stdio, stdout está reservado exclusivamente para paquetes JSON-RPC. Cualquier console.log() corrompe la sesión. Utilizar siempre stderr para diagnósticos.'
    },
    {
      title: 'Asignar permisos de superusuario a los Servidores MCP',
      solution: 'Configurar cada servidor bajo el principio de Least Privilege (acotar Filesystem a una sola carpeta, y GitHub a tokens con permisos de lectura específicos).'
    }
  ],
  groupQuestions: [
    {
      question: '¿Por qué la arquitectura N + M de MCP es exponencialmente más sostenible que las integraciones N × M?',
      expectedAnswer: 'Porque agregar un nuevo agente o una nueva herramienta requiere solo un conector estándar contra el protocolo en lugar de escribir código a medida para cada combinación.'
    },
    {
      question: '¿Qué rol de seguridad desempeña el Host en la interacción entre el LLM y el MCP Server?',
      expectedAnswer: 'Actúa como compuerta de autorización (Gatekeeper): valida permisos, aplica Human-in-the-Loop y decide si despacha o bloquea la llamada emitida por el modelo.'
    }
  ],
  synthesis: {
    summary: 'Model Context Protocol (MCP) establece el estándar de oro para conectar modelos con herramientas del mundo real: separa el razonamiento de la ejecución, resuelve el caos de integraciones mediante JSON-RPC 2.0 y confina las capacidades en procesos aislados bajo mínimo privilegio.',
    transitionText: 'Con los fundamentos claros, en la Lección 02 exploraremos en detalle los 6 servidores MCP más útiles para desarrollo de software: GitHub, Filesystem, Playwright, Supabase, Linear y servidores corporativos.'
  }
};
