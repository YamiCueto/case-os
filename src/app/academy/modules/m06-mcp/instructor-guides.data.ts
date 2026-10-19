import { LessonInstructorGuide } from './instructor-guide.models';

export const INSTRUCTOR_GUIDE_L01: LessonInstructorGuide = {
  lessonId: 'c-m6-l01',
  lessonTitle: 'L01 — ¿Qué es MCP y por qué necesitamos utilizarlo?',
  sessionDate: 'Martes 20 de Octubre de 2026',
  sessionTimeTotal: 55,
  sessionNumber: 'Sesión 1 de 3 (Bloque A)',
  blocks: [
    {
      id: 'l01-b1',
      startMinute: 0,
      endMinute: 10,
      durationMinutes: 10,
      topic: 'Activación y el Problema de las Integraciones N × M',
      objective: 'Sensibilizar al grupo sobre la inviabilidad del acoplamiento punto a punto entre agentes y herramientas de software.',
      explanationGuide: [
        'Presentar el dilema real: si tenemos N clientes/agentes (Claude Desktop, Cursor, CASE OS, scripts internos) y M herramientas corporativas (GitHub, PostgreSQL, Jira, S3), se requieren N × M integraciones artesanales.',
        'Contrastar la fragilidad de cambiar un endpoint REST cuando 5 agentes distintos lo consumen con parseos dispares.',
        'Hacer analogía con los puertos USB antes del estándar USB-C o con Language Server Protocol (LSP) en IDEs.'
      ],
      suggestedScript: '"Buenos días ingenieros. Imaginen que cada vez que compran un mouse o teclado tuvieran que soldar un conector diferente a la placa madre. Eso hacíamos con los LLMs hasta 2024: cada agente programaba su propio wrapper HTTP frágil. Hoy resolveremos el cuello de botella N × M."',
      platformSectionRef: 'nxm-problem',
      checkQuestion: {
        question: '¿Por qué una arquitectura en estrella (N + M) supera a una malla de integraciones punto a punto (N × M)?',
        expectedAnswer: 'Porque añadir un nuevo cliente o una nueva herramienta sólo requiere implementar 1 conector estándar contra el protocolo, reduciendo la complejidad de O(N×M) a O(N+M).'
      },
      transition: 'Ahora que entendemos la fricción del acoplamiento frágil, veamos formalmente qué es MCP y qué problema viene a resolver.'
    },
    {
      id: 'l01-b2',
      startMinute: 10,
      endMinute: 25,
      durationMinutes: 15,
      topic: 'Qué es Model Context Protocol y qué Resuelve',
      objective: 'Comprender la especificación de MCP como protocolo abierto basado en JSON-RPC 2.0 y sus tres primitivas fundamentales.',
      explanationGuide: [
        'Definir MCP: estándar abierto creado por Anthropic para conectar modelos con datos y herramientas de manera segura.',
        'Detallar las 3 primitivas: Tools (funciones ejecutables con efectos secundarios o consultas), Resources (datos leídos como archivos/URIs sin ejecución activa) y Prompts (plantillas reutilizables parametrizadas).',
        'Explicar el modelo de seguridad: los servidores MCP corren en procesos aislados bajo Least Privilege.'
      ],
      suggestedScript: '"MCP no es una librería de Python ni un SDK cerrado: es un protocolo de transporte de mensajes tipados sobre JSON-RPC 2.0. Expone tres primitivas universales: Herramientas para actuar, Recursos para leer contexto, y Prompts para guiar el razonamiento."',
      platformSectionRef: 'mcp-solution',
      checkQuestion: {
        question: '¿Cuál es la diferencia fundamental entre un Resource y una Tool en MCP?',
        expectedAnswer: 'Un Resource es pasivo y idempotente (lectura de datos vía URI, similar a GET HTTP), mientras que una Tool es activa, acepta argumentos estructurados y puede producir efectos colaterales o cómputo.'
      },
      transition: 'Comprendidas las primitivas, examinemos cómo interactúan los tres actores de la arquitectura: Host, Client y Server.'
    },
    {
      id: 'l01-b3',
      startMinute: 25,
      endMinute: 40,
      durationMinutes: 15,
      topic: 'Arquitectura Host, Client y Server con Simulador en Vivo',
      objective: 'Visualizar la separación estricta de responsabilidades entre el entorno anfitrión, el cliente de protocolo y el servidor de herramientas.',
      explanationGuide: [
        'Diferenciar con precisión: Host (la aplicación contenedora como CASE OS o Claude Desktop que gobierna UI y permisos), MCP Client (el conector que mantiene la sesión y serializa JSON-RPC), MCP Server (el proceso hijo o remoto que dialoga con la API real).',
        'Mostrar cómo viaja la petición y quién toma la decisión de invocar la herramienta (el LLM razona, el Host autoriza, el Client envía, el Server ejecuta).'
      ],
      suggestedScript: '"Miren el simulador interactivo en pantalla. El Host es el árbitro de seguridad: nunca deja que el modelo hable directamente con el sistema operativo sin pasar por la compuerta de autorización."',
      platformSectionRef: 'architecture-simulator',
      playgroundRef: {
        name: 'Simulador Visual de Arquitectura MCP',
        actionSteps: [
          'En el selector de Host, seleccionar "CASE OS Agent Studio".',
          'En el selector de MCP Server, alternar entre "Filesystem" (stdio) y "Supabase" (Streamable HTTP) para contrastar los canales de transporte y su aislamiento de seguridad.',
          'Hacer clic en los nodos del diagrama (MCP Host, LLM Core, MCP Client, MCP Server) para proyectar en el panel inferior sus fronteras de seguridad y responsabilidades.',
          'Pulsar "Siguiente Paso →" secuencialmente para observar el viaje completo del mensaje JSON-RPC 2.0 y el payload en tránsito.'
        ]
      },
      checkQuestion: {
        question: '¿Por qué el modelo de IA no ejecuta directamente el código del servidor MCP?',
        expectedAnswer: 'Porque el modelo sólo emite texto estructurado con la intención (tools/call); la ejecución real está confinada en el proceso del MCP Server y gobernada por las políticas del Host.'
      },
      transition: 'Una duda recurrente en equipos senior: ¿No es esto lo mismo que el Tool Calling que vimos en M05? Aclaremos esa frontera técnica.'
    },
    {
      id: 'l01-b4',
      startMinute: 40,
      endMinute: 50,
      durationMinutes: 10,
      topic: 'Tool Calling Convencional vs MCP Estandarizado',
      objective: 'Diferenciar la capacidad de un modelo de emitir argumentos JSON frente a un protocolo de interoperabilidad distribuida.',
      explanationGuide: [
        'Tool Calling (M05): Capacidad intrínseca del modelo fundacional para pausar su generación y estructurar un JSON con nombre y argumentos.',
        'MCP (M06): Protocolo de infraestructura que estandariza el descubrimiento dinámico, el transporte, la negociación de capacidades y la seguridad multi-proceso.',
        'Analizar la pila arquitectónica en la plataforma (#tool-calling-vs-mcp): Tool Calling es el mecanismo de inferencia; MCP es la red de distribución y confinamiento de privilegios.'
      ],
      suggestedScript: '"Tool Calling es la capacidad del cerebro de emitir un comando motor; MCP son los nervios y los estándares biomecánicos que le permiten interactuar con cualquier herramienta sin acoplamiento."',
      platformSectionRef: 'tool-calling-vs-mcp',
      checkQuestion: {
        question: '¿Puede utilizarse MCP sin Tool Calling en el LLM?',
        expectedAnswer: 'No para la selección autónoma: el LLM utiliza Tool Calling para seleccionar la herramienta descubierta por el cliente MCP.'
      },
      transition: 'Excelente. Hagamos un cierre rápido de L01 con preguntas de verificación y preparemos la transición a L02.'
    },
    {
      id: 'l01-b5',
      startMinute: 50,
      endMinute: 55,
      durationMinutes: 5,
      topic: 'Comprobación, Preguntas de Activación y Transición a L02',
      objective: 'Consolidar la asimilación conceptual de la lección y conectar con el catálogo de servidores del mundo real.',
      explanationGuide: [
        'Lanzar pregunta rápida a la sala sobre el rol de JSON-RPC 2.0.',
        'Recapitular los 3 mensajes clave: N+M, Host como frontera de seguridad y desacoplamiento de herramientas.',
        'Hacer el puente con L02: "En los próximos 65 minutos conoceremos los 6 servidores MCP más potentes del desarrollo de software".'
      ],
      suggestedScript: '"En resumen: MCP convirtió las herramientas en piezas de LEGO universales. En la siguiente lección instalaremos visualmente las tres piezas maestras de todo ingeniero: GitHub, Filesystem y Playwright."',
      platformSectionRef: 'synthesis-l01',
      checkQuestion: {
        question: 'Si mañana una empresa crea un nuevo CRM, ¿qué debe construir para que cualquier agente MCP del mundo lo use?',
        expectedAnswer: 'Únicamente un MCP Server que exponga las herramientas del CRM bajo la especificación JSON-RPC de MCP.'
      },
      transition: 'Pasemos de inmediato a la Lección 02: Los servidores MCP más útiles para ingeniería.'
    }
  ]
};

export const INSTRUCTOR_GUIDE_L02: LessonInstructorGuide = {
  lessonId: 'c-m6-l02',
  lessonTitle: 'L02 — Los servidores MCP más útiles para desarrollo de software',
  sessionDate: 'Martes 20 de Octubre de 2026',
  sessionTimeTotal: 65,
  sessionNumber: 'Sesión 1 de 3 (Bloque B)',
  blocks: [
    {
      id: 'l02-b1',
      startMinute: 0,
      endMinute: 10,
      durationMinutes: 10,
      topic: 'Criterios de Selección y Clasificación de Servidores MCP',
      objective: 'Aprender a evaluar servidores MCP oficiales, comunitarios y propietarios según criterios de seguridad y gobernanza.',
      explanationGuide: [
        'Presentar las tres categorías: Ingeniería de Código (GitHub, Git), Sistema Operativo y Navegación (Filesystem, Playwright) y Persistencia / Gestión (PostgreSQL, Linear).',
        'Establecer criterios de selección: soporte oficial, modelo de permisos (read-only vs mutación), aislamiento de tokens y consumo de contexto.'
      ],
      suggestedScript: '"No todos los servidores MCP son seguros para producción. Un servidor mal configurado puede darle acceso total a su disco C o permitir que un agente sobrescriba la rama main en GitHub. Analicemos cómo elegir con rigor."',
      platformSectionRef: 'ecosystem-overview',
      checkQuestion: {
        question: '¿Qué riesgo introduce cargar 20 servidores MCP con 150 herramientas a la vez en el mismo agente?',
        expectedAnswer: 'Satura la ventana de contexto del LLM con descripciones de tools, aumenta los costos de tokens y eleva la probabilidad de alucinación o confusión al seleccionar herramientas.'
      },
      transition: 'Analicemos en profundidad los tres servidores esenciales: GitHub, Filesystem y Playwright.'
    },
    {
      id: 'l02-b2',
      startMinute: 10,
      endMinute: 35,
      durationMinutes: 25,
      topic: 'Inmersión: GitHub MCP, Filesystem MCP y Playwright MCP',
      objective: 'Dominar la configuración, esquemas de tools y políticas de Least Privilege de los tres servidores pilares.',
      explanationGuide: [
        'GitHub MCP: herramientas search_repositories, get_file_contents, create_pull_request. Tokens Fine-Grained con expiración.',
        'Filesystem MCP: argumento de ruta raíz restrictiva (evitar montar C:\\ o / directamente; montar sólo subdirectorios de trabajo).',
        'Playwright MCP: herramientas navigate_url, click_element, capture_screenshot. Capacidad de inspeccionar DOM y validar UI sin backend.'
      ],
      suggestedScript: '"Fíjense en la regla de oro de Filesystem MCP: npx -y @modelcontextprotocol/server-filesystem C:\\repo\\src. Si ponen C:\\, cualquier prompt injection podría exfiltrar sus claves SSH o archivos del sistema."',
      platformSectionRef: 'server-github',
      checkQuestion: {
        question: '¿Cómo mitiga GitHub MCP la posibilidad de que un agente destruya la rama de producción?',
        expectedAnswer: 'Restringiendo los permisos del PAT a sólo ramas secundarias y exigiendo compuertas de protección de rama y revisión humana (HITL) para merge.'
      },
      transition: 'Ampliemos el catálogo a sistemas transaccionales: bases de datos relacionales, gestión de incidencias y servidores custom.'
    },
    {
      id: 'l02-b3',
      startMinute: 35,
      endMinute: 45,
      durationMinutes: 10,
      topic: 'Bases de Datos, Tracking y Servidores Propietarios',
      objective: 'Comprender la integración de PostgreSQL / Supabase, Linear / Jira y cómo estructurar un servidor MCP corporativo.',
      explanationGuide: [
        'PostgreSQL / Supabase: introspección de schemas, validación de consultas SQL de sólo lectura (`SELECT`) antes de permitir escrituras.',
        'Linear / Jira: lectura de tickets, actualización de estados de sprint y trazabilidad de bugs.',
        'Servidores Custom: cuándo crear un servidor interno con `@modelcontextprotocol/sdk` para conectar con el Core bancario o ERP corporativo.'
      ],
      suggestedScript: '"Para conectar el agente a su base de datos corporativa, nunca usen credenciales de superusuario. Creen un usuario específico con GRANT SELECT sobre vistas acotadas. El MCP Server debe aplicar Least Privilege por diseño."',
      platformSectionRef: 'server-supabase',
      checkQuestion: {
        question: '¿Por qué conviene que el servidor MCP ejecute describe_table antes de que el agente formule una query SQL?',
        expectedAnswer: 'Porque proporciona al agente el esquema exacto de columnas y tipos de datos, eliminando suposiciones y evitando errores de sintaxis en la consulta SQL.'
      },
      transition: 'Es momento de interactuar con el Playground: vamos a simular llamadas reales a cada uno de estos servidores.'
    },
    {
      id: 'l02-b4',
      startMinute: 45,
      endMinute: 60,
      durationMinutes: 15,
      topic: 'Práctica con el Explorador Interactivo de Servidores MCP',
      objective: 'Inspeccionar visualmente las herramientas, schemas JSON y respuestas simuladas de cada servidor.',
      explanationGuide: [
        'Guiar a los participantes en el uso del Playground Explorador.',
        'Probar sucesivamente GitHub, Playwright y Filesystem.',
        'Analizar la estructura de la solicitud JSON-RPC (`tools/call`) y cómo viajan los argumentos tipados.'
      ],
      suggestedScript: '"Abran la sección del Explorador. Vamos a simular que el agente necesita inspeccionar el botón de login con Playwright MCP. Observen cómo la herramienta navigate_url valida que el argumento sea una URL válida antes de emitir la orden."',
      platformSectionRef: 'servers-explorer',
      playgroundRef: {
        name: 'Explorador Interactivo de Servidores MCP',
        actionSteps: [
          'Hacer clic en la pestaña "Playwright MCP".',
          'Seleccionar la herramienta "capture_screenshot".',
          'Revisar el esquema JSON-Schema de los argumentos de entrada.',
          'Pulsar "Ejecutar Simulación Educativa" y verificar la respuesta JSON-RPC con la evidencia generada.'
        ]
      },
      checkQuestion: {
        question: '¿Qué propiedad de la respuesta JSON-RPC indica si la herramienta falló a nivel de ejecución de negocio?',
        expectedAnswer: 'La propiedad isError: true dentro del resultado (result.isError), acompañada del texto del error en result.content.'
      },
      transition: 'Concluimos esta primera sesión de 120 minutos con una síntesis de valor.'
    },
    {
      id: 'l02-b5',
      startMinute: 60,
      endMinute: 65,
      durationMinutes: 5,
      topic: 'Cierre de la Sesión del Martes y Puente al Jueves',
      objective: 'Cerrar la jornada consolidando los aprendizajes de L01 y L02 y anticipar la sesión práctica de configuración.',
      explanationGuide: [
        'Resumir: hoy dominamos la arquitectura de MCP y el catálogo de servidores esenciales.',
        'Anticipar el Jueves: "El jueves abriremos mcp_config.json, configuraremos transportes stdio y HTTP, inspeccionaremos errores y conectaremos múltiples servidores a nuestros agentes V2-V6".',
        'Recordar que el sábado 24 de octubre concluye definitivamente el programa formativo con el Capstone.'
      ],
      suggestedScript: '"Gran trabajo hoy. Ya no ven a los LLMs como chatbots aislados, sino como orquestadores de herramientas universales. El jueves configuraremos y depuraremos el protocolo en vivo. ¡Nos vemos el jueves a las 18:00!"',
      platformSectionRef: 'synthesis-l02',
      checkQuestion: {
        question: '¿Cuál es el archivo principal donde se configuran los servidores MCP en el entorno de desarrollo?',
        expectedAnswer: 'mcp_config.json (en .agents o en la configuración del cliente compatible como claude_desktop_config.json).'
      },
      transition: 'Fin de la sesión del Martes 20 de Octubre. Preparar entorno para el Jueves 22 de Octubre.'
    }
  ]
};

export const INSTRUCTOR_GUIDE_L03: LessonInstructorGuide = {
  lessonId: 'c-m6-l03',
  lessonTitle: 'L03 — Configuración y utilización práctica de servidores MCP',
  sessionDate: 'Jueves 22 de Octubre de 2026',
  sessionTimeTotal: 60,
  sessionNumber: 'Sesión 2 de 3 (Bloque A)',
  blocks: [
    {
      id: 'l03-b1',
      startMinute: 0,
      endMinute: 15,
      durationMinutes: 15,
      topic: 'Mecanismos de Transporte: stdio vs Streamable HTTP',
      objective: 'Discernir cuándo utilizar comunicación por subprocesos IPC (stdio) y cuándo utilizar transporte remoto distribuido (HTTP/SSE).',
      explanationGuide: [
        'Transporte stdio: el cliente arranca un subproceso hijo local. Comunicación mediante descriptores de archivo stdin/stdout. Ventajas: cero latencia, sin puertos de red abiertos. Desventajas: atado a la máquina local.',
        'Transporte Streamable HTTP: el servidor corre como microservicio en red. Usa Server-Sent Events (SSE) unidireccional y POST HTTP para comandos. Ventajas: compartido entre equipos, escalable en Kubernetes. Desventajas: requiere TLS y tokens Bearer.',
        'Regla técnica crítica: en stdio, JAMÁS usar console.log() en stdout; usar siempre stderr para no romper el protocolo JSON-RPC.'
      ],
      suggestedScript: '"Buenas tardes ingenieros. Hoy entramos a las tuercas de MCP. La primera decisión de arquitectura es el transporte: stdio para herramientas locales en la máquina del dev; Streamable HTTP para microservicios corporativos compartidos."',
      platformSectionRef: 'transports',
      checkQuestion: {
        question: 'Si un servidor MCP stdio escribe un mensaje de log con console.log("Iniciando conexión"), ¿qué ocurre en el cliente?',
        expectedAnswer: 'El cliente intenta parsear el mensaje como JSON-RPC, falla con SyntaxError de JSON y desconecta o reinicia el servidor MCP.'
      },
      transition: 'Ahora veamos cómo se declara todo esto en los archivos de configuración JSON.'
    },
    {
      id: 'l03-b2',
      startMinute: 15,
      endMinute: 30,
      durationMinutes: 15,
      topic: 'Estructura de mcp_config.json y Gestión de Credenciales',
      objective: 'Aprender a escribir configuraciones limpias, seguras y reproducibles sin exponer tokens en repositorios públicos.',
      explanationGuide: [
        'Anatomía del mcp_config.json: bloque mcpServers, comando ejecutable ("npx", "uvx", "node"), array args y mapa env.',
        'Ubicaciones estándar: .agents/mcp_config.json en CASE OS / Antigravity; claude_desktop_config.json en Claude Desktop.',
        'Seguridad de credenciales: nunca hardcodear PATs o contraseñas en git; referenciar variables de entorno del sistema o archivos .env protegidos en .gitignore.'
      ],
      suggestedScript: '"Miren la estructura en pantalla. El objeto mcpServers mapea identificadores contra comandos. Si el token de GitHub se sube al repositorio, GitHub lo revoca automáticamente en 60 segundos. Inyéctenlo siempre por env."',
      platformSectionRef: 'config-files',
      checkQuestion: {
        question: '¿Por qué en Windows es preferible invocar "npx.cmd" o pasar la ruta absoluta en lugar de simplemente "npx" si el servicio corre como daemon?',
        expectedAnswer: 'Porque los daemons y procesos de fondo a menudo no heredan el PATH del usuario interactivo y lanzan errores ENOENT (Command Not Found).'
      },
      transition: 'Pasemos al Playground: vamos a inspeccionar en vivo cómo viaja un JSON-RPC y cómo actúa la compuerta humana (HITL).'
    },
    {
      id: 'l03-b3',
      startMinute: 30,
      endMinute: 45,
      durationMinutes: 15,
      topic: 'Playground en Vivo: MCP Tool Calling Inspector y Compuertas HITL',
      objective: 'Experimentar interactivamente con solicitudes JSON-RPC reales, validaciones de esquema y autorización humana para mutaciones.',
      explanationGuide: [
        'Demostrar el pipeline en 5 etapas: Usuario -> Host -> MCP Client -> MCP Server -> Sistema Externo.',
        'Probar el escenario de Happy Path: lectura de archivos.',
        'Probar el escenario de Compuerta HITL: modificación de código en GitHub. Explicar por qué una operación destructiva debe bloquearse hasta que un humano pulse "Aprobar Ejecución".'
      ],
      suggestedScript: '"Vayan al Inspector en pantalla. Seleccionemos el escenario de modificación en GitHub. Fíjense: el MCP Server suspende la ejecución y notifica al Host que requiere confirmación. Hasta que el humano no aprueba, no se toca el repositorio."',
      platformSectionRef: 'tool-calling-inspector',
      playgroundRef: {
        name: 'MCP Tool Calling Inspector',
        actionSteps: [
          'Hacer clic en el chip de escenario "COMPUERTA HITL (Modificación de Código en GitHub)".',
          'Observar la advertencia en el banner de compuerta humana: "Estado actual: PENDING".',
          'Pulsar el botón "✓ Aprobar Ejecución".',
          'Comprobar la transición a "APPROVED" y la serialización de la respuesta JSON-RPC.'
        ]
      },
      checkQuestion: {
        question: '¿En qué capa de la arquitectura reside la responsabilidad de solicitar y validar la aprobación humana?',
        expectedAnswer: 'En el Host (la aplicación anfitriona como CASE OS), actuando como frontera de seguridad antes de autorizar el despacho del tools/call.'
      },
      transition: '¿Qué pasa cuando algo sale mal? Analicemos los tres errores más comunes en producción.'
    },
    {
      id: 'l03-b4',
      startMinute: 45,
      endMinute: 55,
      durationMinutes: 10,
      topic: 'Diagnóstico de Errores: ENOENT, Timeouts y Permisos de Acceso',
      objective: 'Desarrollar criterio técnico para depurar conexiones fallidas y códigos de error JSON-RPC.',
      explanationGuide: [
        'Analizar el Error -32602 (Invalid Params): cuando los argumentos no cumplen el JSON-Schema.',
        'Analizar el Error de Timeout: cuando npx descarga paquetes pesados en frío y se supera el límite de 30 segundos.',
        'Analizar el Error EACCES: intento de leer o escribir en directorios fuera de la raíz autorizada en Filesystem MCP.'
      ],
      suggestedScript: '"Si su agente se queda colgado diciendo \'Esperando respuesta del servidor\', no culpen al LLM: el proceso de Node probablemente murió en silencio. Miren stderr y revisen los códigos JSON-RPC -32602 y -32603."',
      platformSectionRef: 'troubleshooting',
      checkQuestion: {
        question: 'Si un servidor MCP responde con { "isError": true, "content": [{ "type": "text", "text": "FileNotFound" }] }, ¿el agente se detiene o puede recuperarse?',
        expectedAnswer: 'Puede recuperarse, porque el error se devuelve como una observación legible al modelo en el bucle agéntico, permitiéndole buscar en otra ruta o pedir ayuda.'
      },
      transition: 'Hagamos la comprobación de L03 y pasemos a la lección cumbre: coordinar múltiples servidores MCP en un bucle agéntico.'
    },
    {
      id: 'l03-b5',
      startMinute: 55,
      endMinute: 60,
      durationMinutes: 5,
      topic: 'Síntesis de L03 y Conexión con Agentes de IA en L04',
      objective: 'Cerrar la sesión de configuración técnica y proyectar la integración en el Agent Loop.',
      explanationGuide: [
        'Resumir: transporte seguro, configuración limpia en mcp_config.json, observabilidad de JSON-RPC y compuertas HITL.',
        'Hacer el puente con L04: "Ahora que sabemos configurar servidores individuales, en los próximos 60 minutos veremos cómo un agente utiliza 4 servidores distintos en simultáneo para resolver un bug completo".'
      ],
      suggestedScript: '"Tienen la infraestructura lista. En L04 integraremos esto con los agentes V2–V6 de M05 en un caso real de ingeniería de software."',
      platformSectionRef: 'synthesis-l03',
      checkQuestion: {
        question: '¿Cuál es la diferencia entre un error a nivel de transporte JSON-RPC y un error a nivel de herramienta?',
        expectedAnswer: 'El error de transporte (error: { code, message }) significa que la llamada no pudo cursarse; el error de herramienta (result: { isError: true }) significa que la llamada se ejecutó pero la lógica de negocio reportó una falla.'
      },
      transition: 'Comenzamos inmediatamente la Lección 04: MCP integrado con agentes de IA.'
    }
  ]
};

export const INSTRUCTOR_GUIDE_L04: LessonInstructorGuide = {
  lessonId: 'c-m6-l04',
  lessonTitle: 'L04 — MCP integrado con agentes de IA',
  sessionDate: 'Jueves 22 de Octubre de 2026',
  sessionTimeTotal: 60,
  sessionNumber: 'Sesión 2 de 3 (Bloque B)',
  blocks: [
    {
      id: 'l04-b1',
      startMinute: 0,
      endMinute: 15,
      durationMinutes: 15,
      topic: 'Conectando MCP con el Agent Loop de M05',
      objective: 'Integrar el descubrimiento dinámico de herramientas MCP dentro del bucle ReAct (Pensamiento -> Acción -> Observación) de los agentes V2–V6.',
      explanationGuide: [
        'Recordar el Agent Loop de M05: el agente decide qué hacer basándose en el estado acumulado y la memoria de trabajo.',
        'Explicar el cambio de paradigma: en vez de registrar herramientas hardcodeadas en el código del agente, el agente arranca consultando tools/list de todos sus servidores MCP activos.',
        'Inyección dinámica: las descripciones y schemas descubiertos se formatean y se pasan en el system prompt o parámetro de herramientas de la API del LLM.'
      ],
      suggestedScript: '"En el módulo M05 construyeron agentes con funciones fijas en TypeScript. Hoy damos el salto cuántico: el agente despierta, interroga a sus servidores MCP, descubre 15 herramientas que nunca vio antes y aprende a usarlas al vuelo."',
      platformSectionRef: 'mcp-agent-loop',
      checkQuestion: {
        question: '¿Qué ventaja ofrece el descubrimiento dinámico de herramientas sobre el registro estático en código?',
        expectedAnswer: 'Permite añadir, actualizar o retirar capacidades del agente sin tener que recompilar ni volver a desplegar el código del agente; basta con reiniciar el proceso del servidor MCP.'
      },
      transition: 'Veamos el caso de estudio principal: resolver una incidencia combinando 4 servidores MCP distintos.'
    },
    {
      id: 'l04-b2',
      startMinute: 15,
      endMinute: 35,
      durationMinutes: 20,
      topic: 'Caso de Estudio y Playground: Orquestador Visual Multi-MCP',
      objective: 'Demostrar cómo un agente resuelve un ticket real coordinando Linear, Filesystem, GitHub y Playwright con compuerta humana.',
      explanationGuide: [
        'Paso 1: Linear MCP -> el agente lee el ticket BUG-402 (fallo en validación de formulario de login).',
        'Paso 2: Filesystem MCP -> lee el archivo auth.service.ts y localiza la expresión regular errónea.',
        'Paso 3: GitHub MCP (HITL) -> solicita crear una rama fix/login-regex y abrir PR. Requiere aprobación humana.',
        'Paso 4: Playwright MCP -> navega a la URL local de prueba y valida que el formulario acepte el input corregido.'
      ],
      suggestedScript: '"Observen la consola del orquestador en pantalla. Este es el trabajo real de un AI Engineer: ningún servidor resuelve el problema por sí solo. Es la orquestación coordinada entre Linear, Filesystem, GitHub y Playwright lo que completa el flujo de ingeniería."',
      platformSectionRef: 'multi-mcp-orchestrator',
      playgroundRef: {
        name: 'Orquestador Visual de Agente + Múltiples Servidores MCP',
        actionSteps: [
          'Verificar que el Paso 1 (Linear MCP: Lectura de Ticket) esté activo.',
          'Pulsar "Siguiente Paso →" para avanzar al Paso 2 (Filesystem MCP: Inspección de auth.service.ts).',
          'Pulsar "Siguiente Paso →" para llegar al Paso 3 (Compuerta HITL: Modificación en GitHub).',
          'Pulsar "✓ Aprobar Creación de PR" para autorizar la mutación.',
          'Pulsar "Siguiente Paso →" para completar con el Paso 4 (Playwright MCP: Validación de Interfaz).'
        ]
      },
      checkQuestion: {
        question: '¿Por qué el agente incorpora el resultado de cada herramienta como una observación (Observation) en el historial de mensajes?',
        expectedAnswer: 'Para que el LLM tenga evidencia factual de lo que ocurrió en el paso anterior y pueda razonar el siguiente paso con contexto real en lugar de inventar el estado.'
      },
      transition: 'Analicemos cómo aplicar este mismo patrón a los agentes de software que ustedes han venido refinando.'
    },
    {
      id: 'l04-b3',
      startMinute: 35,
      endMinute: 50,
      durationMinutes: 15,
      topic: 'Auditoría, Registro de Evidencias y Mitigación de Riesgos',
      objective: 'Establecer los estándares de observabilidad y trazabilidad indispensables para desplegar agentes multi-servidor en entornos bancarios o corporativos.',
      explanationGuide: [
        'Registro de auditoría (Audit Trail): cada llamada JSON-RPC debe persistir timestamp, usuario, agente, herramienta, argumentos, hash de commit o id de registro modificado.',
        'Prevención de bucles infinitos: fijar un límite estricto de iteraciones (ej. máximo 8 pasos) en el agent loop.',
        'Manejo de rate-limits: qué hacer cuando la API de GitHub o Jira devuelve HTTP 429.'
      ],
      suggestedScript: '"En producción no hay lugar para la magia negra. Cada decisión de un agente debe ser auditable: quién aprobó la orden, qué JSON se envió y qué evidencia visual certificó el cambio."',
      platformSectionRef: 'audit-security',
      checkQuestion: {
        question: '¿Qué mecanismo protege a la organización si el LLM entra en un bucle repetitivo de llamadas fallidas a una herramienta?',
        expectedAnswer: 'Un contador de pasos máximos (maxSteps / recursionLimit) en el runtime del agente que aborta la ejecución y solicita intervención humana.'
      },
      transition: 'Llegamos a la preparación del gran evento: el Laboratorio Final Capstone del Sábado 24 de Octubre.'
    },
    {
      id: 'l04-b4',
      startMinute: 50,
      endMinute: 60,
      durationMinutes: 10,
      topic: 'Preparación y Reglas de Juego para el Laboratorio del Sábado',
      objective: 'Alinear a los estudiantes con las cuatro alternativas del laboratorio, los 7 entregables obligatorios y la logística de cierre definitivo.',
      explanationGuide: [
        'Explicar las 4 alternativas: MySQL/Supabase (datos), GitHub (código), Playwright (UI) o Filesystem (archivos locales).',
        'Recordar la regla de oro: reutilizar sus agentes V2-V6 de M05, no empezar de cero.',
        'Detallar los 7 entregables obligatorios: Diagrama, Configuración, Descubrimiento, Ejecución, Manejo de Error, Permisos y Demostración.',
        'Informar que el sábado 24 de octubre es el cierre definitivo de todas las capacitaciones de CASE OS.'
      ],
      suggestedScript: '"El sábado cerramos el ciclo formativo de CASE OS. No queremos presentaciones de diapositivas: queremos ver a sus agentes de M05 conectados a herramientas reales, fallando de manera controlada y ejecutando soluciones verificables. Elijan su alternativa hoy mismo."',
      platformSectionRef: 'lab-preparation',
      checkQuestion: {
        question: '¿Por qué es obligatorio evidenciar el manejo de al menos un error en el laboratorio final?',
        expectedAnswer: 'Porque en ingeniería real los agentes deben ser tolerantes a fallos (schemas inválidos, permisos denegados) y replanificar sin colapsar.'
      },
      transition: 'Fin de la sesión del Jueves 22 de Octubre. Cita definitiva: Sábado 24 de Octubre a las 09:00 para el Laboratorio Capstone y Cierre.'
    }
  ]
};

export const INSTRUCTOR_GUIDE_LAB06: LessonInstructorGuide = {
  lessonId: 'c-m6-lab',
  lessonTitle: 'LAB 06 — Capstone MCP y Cierre Definitivo de Capacitaciones',
  sessionDate: 'Sábado 24 de Octubre de 2026',
  sessionTimeTotal: 180,
  sessionNumber: 'Sesión 3 de 3 (Sesión Final de Cierre)',
  blocks: [
    {
      id: 'lab-b1',
      startMinute: 0,
      endMinute: 15,
      durationMinutes: 15,
      topic: 'Introducción, Criterios de Aceptación y Rúbrica de Evaluación',
      objective: 'Establecer las reglas de juego, los 7 entregables obligatorios y la dinámica de trabajo por células de ingeniería.',
      explanationGuide: [
        'Bienvenida a la sesión final de graduación y capstone.',
        'Repasar los 7 entregables: 1. Diagrama de arquitectura, 2. mcp_config.json verificado, 3. Evidencia de tools/list, 4. tools/call exitoso, 5. Manejo de error controlado, 6. Justificación de permisos mínimos, 7. Demo en vivo de 3 minutos.',
        'Recordar que a las 11:20 am inician las sustentaciones de las células.'
      ],
      suggestedScript: '"Buenos días ingenieros. Hoy es 24 de octubre de 2026, el día de cierre definitivo del programa de Inteligencia Artificial Generativa y CASE OS. Durante los últimos meses dominaron desde la probabilidad condicional hasta agentes autónomos. Hoy demostraremos que sus agentes pueden interactuar con el software del mundo real."',
      platformSectionRef: 'lab-hero',
      checkQuestion: {
        question: '¿Cuál es el criterio principal que distingue a una integración de nivel Enterprise de un script informal?',
        expectedAnswer: 'El principio de Least Privilege en credenciales, la contención del alcance de ejecución y la capacidad de auditar cada tools/call con intervención humana.'
      },
      transition: 'Tienen 20 minutos para fijar su alternativa y validar la conexión inicial del servidor MCP.'
    },
    {
      id: 'lab-b2',
      startMinute: 15,
      endMinute: 35,
      durationMinutes: 20,
      topic: 'Selección de Alternativa y Conexión Inicial del Servidor MCP',
      objective: 'Garantizar que cada célula configure su servidor MCP (MySQL, GitHub, Playwright o Filesystem) y valide el handshake initialize.',
      explanationGuide: [
        'Acompañar a las células a elegir su alternativa.',
        'Alternativa A: MySQL CFA / Supabase MCP (excelente para perfiles backend/datos).',
        'Alternativa B: GitHub MCP (ideal para DevOps y automatización de PRs).',
        'Alternativa C: Playwright MCP (ideal para QA y validación frontend).',
        'Alternativa D: Filesystem MCP (la más directa y sin dependencias de red externa).',
        'Verificar que el mcp_config.json arranque sin errores ENOENT.'
      ],
      suggestedScript: '"Células: elijan una de las cuatro tarjetas en el panel. Verifiquen que su mcp_config.json ejecute sin fallos y capturen de inmediato el pantallazo de tools/list. Ese es su primer entregable."',
      platformSectionRef: 'alternatives-grid',
      checkQuestion: {
        question: 'Si el servidor tarda más de 10 segundos en responder el tools/list, ¿cuál es el primer paso de diagnóstico?',
        expectedAnswer: 'Verificar si npx está descargando dependencias en frío o si el proceso stdio quedó bloqueado esperando input en stdin.'
      },
      transition: 'Servidores conectados. Iniciamos el bloque central de implementación de 75 minutos.'
    },
    {
      id: 'lab-b3',
      startMinute: 35,
      endMinute: 110,
      durationMinutes: 75,
      topic: 'Implementación Acompañada: Conectando el Agente con la Herramienta',
      objective: 'Guiar a los participantes mientras su agente V2–V6 formula una llamada a la herramienta MCP y procesa la observación.',
      explanationGuide: [
        'Rondas de mentoría técnica por célula (10-12 minutos por célula).',
        'Revisar: ¿el agente incluye el schema en su contexto? ¿el payload JSON generado coincide con inputSchema?',
        'Evitar que se dispersen programando código adicional: reutilizar el runtime de M05.',
        'Asegurar que guarden las capturas de logs para los entregables 3 y 4.'
      ],
      suggestedScript: '"Atención células: el agente debe ejecutar la herramienta y leer el resultado. No hagan trampas hardcodeando strings: muestren el tools/call real pasando por el MCP Client."',
      platformSectionRef: 'deliverables-panel',
      checkQuestion: {
        question: '¿Cómo comprueban que el agente realmente utilizó la herramienta y no alucinó la respuesta?',
        expectedAnswer: 'Inspeccionando los logs del proceso del MCP Server o revisando que el id de tools/call coincida en el registro JSON-RPC.'
      },
      transition: 'A 30 minutos de las demos: provoquemos intencionalmente el manejo de error y cerremos los entregables.'
    },
    {
      id: 'lab-b4',
      startMinute: 110,
      endMinute: 140,
      durationMinutes: 30,
      topic: 'Inyección de Errores, Validación y Preparación de Demos',
      objective: 'Comprobar que el agente maneje errores (Entregable 5) y preparar la presentación de 3 minutos por célula.',
      explanationGuide: [
        'Inyección de error sugerida: pasar un archivo inexistente, una query SQL con error de sintaxis o un selector CSS ausente en Playwright.',
        'Verificar que el agente lea `isError: true`, emita un mensaje explicativo y proponga una acción correctiva.',
        'Completar el checklist de los 7 entregables en la plataforma de CASE OS.'
      ],
      suggestedScript: '"Últimos 30 minutos de laboratorio. Cada célula debe provocar al menos un error controlado y documentar la reacción del agente. Tienen hasta las 11:20 para marcar sus 7 entregables en la plataforma."',
      platformSectionRef: 'checklist',
      checkQuestion: {
        question: '¿Por qué una prueba de error exitosa otorga más puntos que una ejecución donde todo funcionó a la primera?',
        expectedAnswer: 'Porque demuestra resiliencia técnica: un agente que no sabe fallar es una bomba de tiempo en un entorno de producción.'
      },
      transition: 'Tiempo de trabajo concluido. Iniciamos la ronda de sustentaciones y demostraciones en vivo.'
    },
    {
      id: 'lab-b5',
      startMinute: 140,
      endMinute: 165,
      durationMinutes: 25,
      topic: 'Demostraciones en Vivo de las Células (3 min por equipo)',
      objective: 'Socializar las soluciones construidas y evaluar la capacidad de síntesis técnica y defensa arquitectónica.',
      explanationGuide: [
        'Dinámica: 3 minutos exactos por célula (1 min arquitectura, 1 min demo en vivo, 1 min preguntas).',
        'Evaluar: funcionamiento real, claridad en la justificación de permisos mínimos y compostura ante imprevistos técnicos.'
      ],
      suggestedScript: '"Célula 1 al escenario. Compartan pantalla, muestren su arquitectura, disparen el tools/call en vivo y muéstrennos cómo su agente manejó el error. Tiempo corriendo."',
      platformSectionRef: 'deliverables-panel',
      checkQuestion: {
        question: '¿Qué lección aprendieron al ver a sus agentes fallar en vivo frente al grupo?',
        expectedAnswer: 'Que la predictibilidad del software agéntico no depende de hacer prompts más largos, sino de contratos de herramientas estrictos y verificaciones deterministas.'
      },
      transition: 'Felicitaciones a todas las células por el nivel de ingeniería demostrado. Procedemos al acto de clausura definitiva.'
    },
    {
      id: 'lab-b6',
      startMinute: 165,
      endMinute: 180,
      durationMinutes: 15,
      topic: 'Conclusiones Finales y Cierre Definitivo de las Capacitaciones',
      objective: 'Cerrar formalmente el programa formativo de CASE OS al sábado 24 de octubre de 2026, celebrando la transformación profesional del equipo.',
      explanationGuide: [
        'Recapitular el viaje formativo completo: M01 Fundamentos -> M02 Prompts -> M03 Contexto -> M04 RAG -> M05 Agentes -> M06 MCP.',
        'Destacar que hoy cuentan con un marco de trabajo de ingeniería de IA riguroso, medible y éticamente responsable.',
        'Leer la cita de clausura oficial de CASE OS.',
        'Invitar a pulsar el botón "Volver al Dashboard de CASE Academy" con el 100% del programa completado.'
      ],
      suggestedScript: '"Ingenieros: hoy 24 de octubre de 2026 concluyen formalmente las capacitaciones de CASE OS. Llegaron pensando que la IA era simplemente escribir un buen prompt en un chat; hoy se marchan como Arquitectos de Sistemas de IA capaces de diseñar arquitecturas agénticas universales con Model Context Protocol. Recuerden siempre: la IA no sustituye la arquitectura de software; la hace más crítica y exigente que nunca. ¡Misión cumplida!"',
      platformSectionRef: 'closure-section',
      checkQuestion: {
        question: '¿Cuál es el compromiso de ingeniería que asumen a partir del lunes en sus proyectos reales?',
        expectedAnswer: 'Diseñar sistemas con interfaces desacopladas, aplicar Least Privilege, auditar cada inferencia y mantener siempre al ser humano en el centro del control.'
      },
      transition: 'Graduación y Cierre definitivo del programa de capacitaciones CASE OS.'
    }
  ]
};

export const ALL_INSTRUCTOR_GUIDES: Record<string, LessonInstructorGuide> = {
  'c-m6-l01': INSTRUCTOR_GUIDE_L01,
  'c-m6-l02': INSTRUCTOR_GUIDE_L02,
  'c-m6-l03': INSTRUCTOR_GUIDE_L03,
  'c-m6-l04': INSTRUCTOR_GUIDE_L04,
  'c-m6-lab': INSTRUCTOR_GUIDE_LAB06
};
