import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Arquitectura de MCP (c20)
 * Módulo 07 — Model Context Protocol
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c20',
  sections: [
    {
      id: 'topologia-oficial-mcp',
      title: '01. La Topología Oficial de MCP: Host, Client y Server',
      subtitle: 'Diferencias estrictas entre quién pide información y quién la provee',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'MCP se basa en una topología estricta. Es vital entender la diferencia entre quién pide información y quién la provee. Nunca debes confundir al Host con el Client.'
        },
        {
          type: 'CODE',
          filename: 'mcp-topology-diagram.txt',
          language: 'text',
          code: `Host (e.g., Claude Desktop, Cursor IDE)
 ├── MCP Client 1 ──► [Transport: STDIO] ─────────► MCP Server Local (e.g., File System / SQLite)
 │                                                    ├── Tools
 │                                                    ├── Resources
 │                                                    └── Prompts
 └── MCP Client 2 ──► [Transport: Streamable HTTP] ──► MCP Server Remote (e.g., Jira / PostgreSQL)
                                                      ├── Tools
                                                      ├── Resources
                                                      └── Prompts`
        }
      ]
    },
    {
      id: 'desglose-de-las-tres-capas',
      title: '02. Las Tres Capas de la Arquitectura MCP',
      subtitle: 'Responsabilidades operativas de Host, Client y Server',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Responsabilidades por Capa Arquitectónica',
          items: [
            '1. Host: Es la aplicación principal donde el usuario interactúa (ej. Claude Desktop, Cursor IDE). Un Host puede instanciar múltiples Clientes MCP para conectarse a diferentes servidores simultáneamente.',
            '2. MCP Client: Es el módulo dentro del Host que mantiene la conexión 1 a 1 con un Servidor MCP mediante el protocolo estándar. Negocia la conexión y transfiere peticiones JSON-RPC.',
            '3. MCP Server: Es el programa externo (ligero y sin estado) que expone el acceso a los sistemas locales o remotos (ej. PostgreSQL, Jira). Responde a las peticiones del Cliente mostrando qué capacidades tiene (Tools, Resources, Prompts).'
          ]
        }
      ]
    },
    {
      id: 'transportes-modernos-stdio-streamable-http',
      title: '03. Transportes Modernos: STDIO vs Streamable HTTP',
      subtitle: 'Especificación estandarizada para entornos locales y remotos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: '¿Cómo se comunican el Cliente y el Servidor físicamente? La especificación actual define dos transportes principales estandarizados (notar que HTTP+SSE es considerado legacy/deprecado):'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'STDIO (Standard I/O)',
            subtitle: 'Integraciones Locales',
            icon: '💻',
            badge: 'Local Subprocess',
            points: [
              'El Host inicia el subproceso del Servidor (ej. npx mi-servidor-mcp).',
              'Comunicación directa vía streams estándar (Standard Input / Standard Output).',
              'Máximo rendimiento y mínima latencia en la máquina del desarrollador.'
            ]
          },
          right: {
            title: 'Streamable HTTP',
            subtitle: 'Integraciones Remotas & Cloud',
            icon: '🌐',
            badge: 'Enterprise Standard',
            active: true,
            points: [
              'Permite flujos bidireccionales eficientes sin las limitaciones históricas de SSE.',
              'Adaptabilidad a firewalls y proxies empresariales.',
              'Ideal para microservicios y servidores MCP compartidos en la nube.'
            ]
          }
        }
      ]
    },
    {
      id: 'nucleo-stateless-y-capabilities',
      title: '04. Principios de Diseño: Núcleo Stateless y Descubrimiento',
      subtitle: 'Declaración explícita de capacidades sin memoria de sesión',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Stateless Core & Dynamic Discovery',
          message: 'Un principio clave en las especificaciones recientes es el núcleo stateless de MCP. Los servidores no recuerdan el estado de la conversación. En su lugar, cuando el Cliente se conecta, el Servidor declara explícitamente sus Capabilities (qué puede hacer). Descubrirlas dinámicamente es la base que elimina la necesidad de escribir código de integración manual.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Invariantes Arquitectónicos de MCP',
          items: [
            'Los MCP Servers son procesos ligeros, modulares y sin retención de estado conversacional.',
            'La negociación de capacidades se produce mediante JSON-RPC durante el handshake inicial.',
            'El Host mantiene el control de seguridad y autorización sobre todas las invocaciones.'
          ]
        }
      ]
    }
  ]
};
