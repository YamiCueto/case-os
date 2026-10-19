import { LessonDocument } from '../lesson-01-que-es-mcp/lesson-01.data';

export const LESSON_04_DOCUMENT: LessonDocument = {
  title: 'MCP Integrado con Agentes de IA',
  subtitle: 'Conectando los agentes desarrollados en el Módulo M05 con múltiples servidores MCP coordinados para resolver tareas complejas de software.',
  eyebrow: 'Módulo 06 · Lección 04',
  duration: '60 min',
  difficulty: 'EXPERT',
  moduleBadge: 'M06 · Model Context Protocol',
  learningObjectives: [
    { icon: 'lan', text: 'Conectar el bucle de razonamiento (Agent Loop) con el descubrimiento dinámico de herramientas multi-MCP.' },
    { icon: 'alt_route', text: 'Implementar enrutamiento agéntico inteligente entre servidores MCP especializados (Linear, Filesystem, GitHub, Playwright).' },
    { icon: 'verified_user', text: 'Establecer compuertas Human-in-the-Loop y auditoría inmutable para operaciones sensibles en producción.' },
    { icon: 'assignment_turned_in', text: 'Preparar la arquitectura técnica y los entregables para el Laboratorio Final Capstone.' }
  ],
  fundamentalConcepts: [
    { icon: 'memory', title: 'Evolución M05 → M06', description: 'Transición de funciones monolíticas en memoria a micro-servicios MCP desacoplados e independientes.' },
    { icon: 'schema', title: 'Inyección Dinámica de Tools', description: 'El agente interroga al inicio a sus servidores MCP y alimenta dinámicamente la ventana de contexto del LLM.' },
    { icon: 'gavel', title: 'Frontera de Autorización HITL', description: 'Suspensión del ciclo ReAct hasta que un ingeniero revise el diff y otorgue consentimiento explícito.' },
    { icon: 'fact_check', title: 'Trazabilidad y Evidencias', description: 'Generación de informes de auditoría vinculando ticket, diff de código, commit y captura visual.' }
  ],
  comparison: {
    beforeTitle: 'Agente Monolítico M05 (Tool Calling Local)',
    beforeItems: [
      'Funciones TypeScript o Python codificadas directamente dentro del runtime del agente.',
      'El agente conoce los detalles internos de las bases de datos y APIs externas.',
      'Escalabilidad limitada: añadir una herramienta exige desplegar nuevamente todo el agente.',
      'Superficie de ataque amplia: todas las credenciales residen en la memoria del agente.'
    ],
    afterTitle: 'Agente Agéntico M06 (Orquestación Multi-MCP)',
    afterItems: [
      'El agente es un puro motor de razonamiento (LLM + ReAct Loop) agnóstico a la implementación.',
      'Descubre dinámicamente herramientas de múltiples MCP Servers (Jira, Filesystem, Playwright).',
      'Despliegue y escalado independiente de servidores y agentes.',
      'Seguridad modular con compuertas HITL y principio de mínimo privilegio en cada proceso.'
    ]
  },
  sections: [
    {
      id: 'agentic-evolution',
      eyebrow: '01. CONEXIÓN CURRICULAR',
      title: 'De los Agentes V2–V6 de M05 a la Arquitectura Multi-MCP',
      lead: 'En el Módulo 05 aprendimos a construir el Agent Loop (Thought → Action → Observation), gestionar memoria y compuertas de políticas. Ahora conectamos ese motor con MCP.',
      paragraphs: [
        'En los laboratorios de M05 diseñamos agentes que tomaban decisiones utilizando un catálogo estático de funciones locales. Aunque este enfoque enseña los fundamentos del bucle agéntico, en el mundo real un agente de software debe interactuar simultáneamente con múltiples sistemas distribuidos.',
        'Al integrar MCP, el bucle del agente no cambia en su esencia matemática, pero se transforma radicalmente en su arquitectura: en lugar de llamar a una función interna, el dispatcher agéntico enruta la llamada al MCP Client correspondiente según el prefijo o catálogo de la herramienta.',
        'Esto permite que un solo agente coordine herramientas de 3 o 4 servidores MCP simultáneamente sin acoplamiento.'
      ],
      callout: {
        type: 'info',
        title: 'Principio de Neutralidad del Bucle',
        message: 'Para el LLM, el prompt de herramientas sigue siendo JSON-Schema estándar. Es el Host quien mantiene el registro de qué servidor MCP es dueño de cada herramienta.'
      }
    },
    {
      id: 'case-study',
      eyebrow: '02. CASO DE ESTUDIO PRINCIPAL',
      title: 'Resolución Automatizada de un Ticket de Software',
      lead: 'Analicemos el flujo completo cuando un agente de desarrollo recibe un ticket de fallo en producción.',
      paragraphs: [
        '1. Ingesta del Ticket: El agente recibe el ID "ISSUE-402" e invoca la herramienta linear_get_issue del servidor Linear MCP para obtener la descripción del error y los pasos de reproducción.',
        '2. Localización del Código: Con los términos del error, el agente invoca filesystem_search_files y filesystem_read_file del servidor Filesystem MCP para inspeccionar el módulo afectado (/src/auth/session.ts).',
        '3. Formulación del Parche: El agente analiza el código y diseña la solución corrigiendo la fuga de memoria en el listener del worker.',
        '4. Compuerta de Aprobación Humana (HITL): Antes de aplicar el parche o abrir un PR, el agente solicita confirmación explícita al ingeniero humano, presentando el diff unificado del código.',
        '5. Verificación Visual E2E: Con la aprobación humana concedida, el agente invoca playwright_navigate y playwright_screenshot del servidor Playwright MCP para validar que la interfaz no presente regresiones.',
        '6. Registro de Evidencia: Se genera un informe estructurado que enlaza el issue de Linear, el commit de Git y la captura de pantalla de Playwright.'
      ],
      codeBlock: {
        language: 'typescript',
        caption: 'Bucle Agéntico Multi-MCP con Enrutamiento Dinámico',
        code: `// Agent Dispatcher sobre múltiples clientes MCP
async function executeAgentToolCall(toolCall: ToolCallProposal): Promise<ToolResult> {
  const server = mcpRegistry.findServerForTool(toolCall.name);
  
  if (server.isDangerous && !humanApprovalService.hasApproved(toolCall.id)) {
    return { status: "PAUSED_FOR_APPROVAL", reason: "Requiere autorización humana previa." };
  }

  // Invocar al MCP Server correspondiente
  const response = await server.client.callTool({
    name: toolCall.name,
    arguments: toolCall.arguments
  });

  return { status: "SUCCESS", observation: response.content };
}`
      }
    },
    {
      id: 'multi-server-governance',
      eyebrow: '03. GOBERNANZA MULTI-SERVIDOR',
      title: 'Seguridad, Tokens y Aislamiento de Contexto',
      lead: 'Coordinar múltiples servidores exige evitar que el contexto del LLM se contamine o filtre secretos entre herramientas.',
      paragraphs: [
        'Aislamiento de Tokens: El servidor de GitHub maneja su propio PAT, mientras que el servidor de base de datos maneja su cadena de conexión. El agente (LLM) nunca ve ninguno de estos secretos; solo recibe y procesa datos limpios.',
        'Presupuesto de Contexto: Cada observación devuelta por un servidor MCP consume tokens de la ventana de contexto. El Host debe truncar o resumir payloads masivos (como lecturas de archivos gigantes o queries con miles de filas) antes de inyectarlos en el prompt del modelo.',
        'Trazabilidad Inmutable: Cada acción ejecutada debe registrarse con un timestamp, ID de sesión, servidor invocado y firma de aprobación humana para propósitos de auditoría de seguridad.'
      ],
      keyTakeaways: [
        'MCP desacopla el razonamiento del agente de la infraestructura de las herramientas.',
        'Un agente moderno puede orquestar en paralelo GitHub MCP, Filesystem MCP y Playwright MCP.',
        'La compuerta HITL es mandatoria antes de mutaciones destructivas o despliegues.',
        'El LLM nunca manipula credenciales directas; solo emite intenciones estructuradas.'
      ]
    }
  ],
  commonPitfalls: [
    {
      title: 'Desbordamiento de la ventana de contexto al acumular observaciones multi-servidor',
      solution: 'Truncar o resumir los payloads voluminosos devueltos por Filesystem o bases de datos antes de incorporarlos a la memoria conversacional del agente.'
    },
    {
      title: 'Bucles infinitos entre herramientas cuando una falla repetidamente',
      solution: 'Configurar un límite estricto de pasos (maxIterations / recursionLimit) en el agent dispatcher para abortar y solicitar intervención de un ingeniero.'
    },
    {
      title: 'Ausencia de evidencia verificable tras la ejecución agéntica',
      solution: 'Exigir que toda acción automatizada concluya con una verificación independiente (ej. screenshot de Playwright o test unitario en verde).'
    }
  ],
  groupQuestions: [
    {
      question: '¿Por qué es preferible desacoplar las herramientas en servidores MCP independientes en lugar de empaquetarlas en un solo servidor monolítico?',
      expectedAnswer: 'Porque permite aislar credenciales, escalar procesos de forma independiente y evitar que un fallo en un conector afecte al resto de capacidades del agente.'
    },
    {
      question: '¿Qué papel cumple la Observación en el ciclo ReAct al interactuar con MCP?',
      expectedAnswer: 'Es la evidencia factual que devuelve el servidor MCP al LLM, permitiéndole evaluar el éxito de su acción y razonar el siguiente paso con información real.'
    }
  ],
  synthesis: {
    summary: 'La verdadera potencia de los agentes de software emerge al combinar su capacidad de razonamiento con múltiples servidores MCP coordinados: Linear para requerimientos, Filesystem para código, GitHub para control de versiones y Playwright para validación.',
    transitionText: '¡Todo el conocimiento del curso está listo para confluir! En el Laboratorio Final 06 pondrás en práctica esta arquitectura conectando tus agentes V2–V6 con servidores MCP reales.'
  }
};
