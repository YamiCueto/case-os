import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — El Problema N × M (c19)
 * Módulo 07 — Model Context Protocol
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c19',
  sections: [
    {
      id: 'problema-integracion-nxm',
      title: '01. The N × M Integration Problem',
      subtitle: 'La crisis de la fragmentación en la era de los agentes',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'En los módulos anteriores vimos que los Agentes necesitan Herramientas y Contexto para ser útiles. Pero en el mundo real, los datos viven en decenas de sistemas diferentes: Jira, GitHub, Slack, bases de datos SQL, APIs internas y servicios cloud.'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Problema de Integración N × M',
          message: 'Si tenemos N proveedores de IAs (Claude, OpenAI, Gemini) y M fuentes de datos, terminamos escribiendo integraciones personalizadas para cada combinación. Para 3 clientes y 3 servidores necesitas 9 integraciones customizadas. Si subes a 10 asistentes y 50 herramientas, necesitas 500 integraciones. El ecosistema no puede escalar de forma sostenible así.'
        }
      ]
    },
    {
      id: 'caos-integraciones-sin-estandar',
      title: '02. El Caos de las Integraciones sin Protocolo Estándar',
      subtitle: 'Por qué el código de integración a medida fracasa a escala',
      blocks: [
        {
          type: 'CODE',
          filename: 'nxm-spaghetti-matrix.txt',
          language: 'text',
          code: `AI ASSISTANTS (N)                  CUSTOM INTEGRATION CODE                  DATA SOURCES (M)
┌────────────────┐                ┌─────────────────────────┐               ┌────────────────┐
│ Claude Desktop │ ───(Custom)───►│ Spaghetti Bridges       │───(Custom)───►│ GitHub Repo    │
│ Cursor IDE     │ ───(Custom)───►│ N × M Hardcoded Glue    │───(Custom)───►│ PostgreSQL DB  │
│ Custom Agent   │ ───(Custom)───►│ High Maintenance Debt   │───(Custom)───►│ Jira Project   │
└────────────────┘                └─────────────────────────┘               └────────────────┘`
        },
        {
          type: 'PARAGRAPH',
          text: 'Sin un protocolo común, cada herramienta define su propio formato de autenticación, esquema de payload, manejo de errores y ciclo de vida de conexión, acumulando deuda técnica exponencial.'
        }
      ]
    },
    {
      id: 'solucion-model-context-protocol',
      title: '03. Model Context Protocol (MCP): La Promesa de la Estandarización',
      subtitle: 'El conector universal de código abierto para inteligencia artificial',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Introducido por Anthropic y adoptado ampliamente como estándar abierto, Model Context Protocol (MCP) estandariza la comunicación entre Asistentes de IA y Fuentes de Datos, actuando como un conector universal.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Integraciones Propietarias',
            subtitle: 'Enfoque N × M Fragmentado',
            icon: '🍝',
            badge: 'High Fragility',
            points: [
              'Código de pegamento a medida por cada asistente y cada herramienta.',
              'Mantenimiento exponencial: cada cambio de API rompe múltiples clientes.',
              'Falta de gobernanza centralizada y políticas de seguridad inconsistentes.'
            ]
          },
          right: {
            title: 'Ecosistema MCP Universal',
            subtitle: 'Enfoque 1 × N + 1 × M',
            icon: '🔌',
            badge: 'Open Standard',
            active: true,
            points: [
              'Un Servidor MCP para tus datos internos es compatible automáticamente con Cursor, Claude Desktop y cualquier cliente MCP.',
              'Cero integraciones customizadas para nuevos modelos o herramientas.',
              'Descubrimiento dinámico de capacidades y contratos uniformes.'
            ]
          }
        }
      ]
    },
    {
      id: 'el-usb-de-la-ia-y-conclusion',
      title: '04. El "USB" de la Inteligencia Artificial',
      subtitle: 'Interoperabilidad absoluta y descubrimiento dinámico',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Plug and Play Arquitectónico',
          message: 'MCP es a los Agentes de IA lo que el USB fue a los periféricos de PC. Define una topología estricta y transportes agnósticos para que la IA pueda descubrir capacidades (Tools, Context) de forma dinámica. Advertencia: MCP no es una "forma de hacer prompting". Es un protocolo arquitectónico cliente-servidor real.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Fundamentos del Ecosistema MCP',
          items: [
            'MCP resuelve la explosión combinatoria N × M mediante una interfaz universal estándar.',
            'Desacopla el desarrollo de modelos de lenguaje de la implementación de fuentes de datos corporativas.',
            'Permite a los asistentes de desarrollo y agentes descubrir capacidades en tiempo de ejecución sin recompilación.'
          ]
        }
      ]
    }
  ]
};
