import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Primitivas (c21)
 * Módulo 07 — Model Context Protocol
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c21',
  sections: [
    {
      id: 'lenguaje-interoperabilidad-mcp',
      title: '01. El Lenguaje de la Interoperabilidad: Manifiesto de Capacidades',
      subtitle: 'La tríada de primitivas: Resources, Tools y Prompts',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Cuando un Client se conecta a un Server, el servidor le envía un manifiesto (JSON) con lo que puede ofrecer. Esta oferta se agrupa estrictamente en tres categorías fundamentales.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Oro de MCP',
          message: 'Confundir un Resource con una Tool es el error más común al diseñar servidores MCP. Comprender esta diferencia es crucial para la seguridad, el control de accesos y la escalabilidad del sistema.'
        }
      ]
    },
    {
      id: 'resources-vs-tools-mcp',
      title: '02. Resources vs Tools: Acceso a Información vs Operaciones',
      subtitle: 'Lectura segura controlada por el servidor vs ejecución invocada por el modelo',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: '1. Resources (Lectura Segura)',
            subtitle: 'Datos controlados por el Servidor',
            icon: '📄',
            badge: 'Read-Only / URIs',
            points: [
              'Representa datos o contexto pasivo expuesto por el servidor (ej. un archivo local, un log, un registro de base de datos).',
              'Identificados mediante URIs estándar (file:///..., postgres://...).',
              'El Host o el usuario los inyectan al contexto antes o durante la generación.',
              'Operación 100% de solo lectura: el modelo solo lee datos sin ejecutar acciones.'
            ]
          },
          right: {
            title: '2. Tools (Acciones Activas)',
            subtitle: 'Operaciones controladas por el Modelo',
            icon: '🛠️',
            badge: 'Executable / HITL',
            active: true,
            points: [
              'Funciones ejecutables expuestas con JSON Schema para mutaciones o búsquedas complejas.',
              'El LLM decide cuándo y con qué parámetros invocar la herramienta en su Agent Loop.',
              'Tienen efectos secundarios potenciales (github_create_pr, execute_sql_query).',
              'Requieren validación estricta, permisos Least Privilege y Human Approval (HITL).'
            ]
          }
        }
      ]
    },
    {
      id: 'prompts-plantillas-mcp',
      title: '03. Prompts (Templates Reutilizables)',
      subtitle: 'Plantillas de interacción predefinidas por el Servidor',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Características de la Primitiva Prompts',
          items: [
            'Plantillas predefinidas por el Servidor para estandarizar flujos de trabajo frecuentes en el dominio.',
            'Permiten al usuario invocar comandos estructurados (ej. "Analizar este ticket de Jira") que vinculan automáticamente los Resources y Tools adecuados.',
            'Aseguran consistencia en las directivas de ingeniería en equipos multidisciplinarios.'
          ]
        }
      ]
    },
    {
      id: 'practica-mcp-universal-connector',
      title: '04. Práctica: The Universal Connector & Least Privilege',
      subtitle: 'Simulación de interoperabilidad y especificación de ingeniería',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos cubierto la resolución del problema N × M, la arquitectura Host-Client-Server, los transportes modernos y las tres primitivas fundamentales. Es momento de pasar a la práctica interactiva y el diseño de especificaciones seguras.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd7',
          title: 'Demo 07 — El Conector Universal',
          description: 'En lugar de codificar integraciones legacy (el problema N × M), experimenta la conexión a Servidores MCP simulados (ej. MySQL local) y observa cómo el Agente descubre primitivas instantáneamente bajo el principio de Least Privilege.',
          path: '/academy/modules/m07-mcp/demo-mcp-connector',
          actionLabel: 'Probar Demo 07'
        },
        {
          type: 'LAB_REF',
          labId: 'l7',
          title: 'Laboratorio 07 — Mapear una Integración Legacy a MCP',
          description: 'Diseña una especificación MCP segura (Resources, Tools, Least Privilege y Human-in-the-Loop) para modernizar una base de datos legacy hacia el ecosistema de agentes.',
          path: '/academy/modules/m07-mcp/lab-07-map-integration-to-mcp',
          duration: '90 min',
          actionLabel: 'Iniciar Laboratorio 07'
        }
      ]
    }
  ]
};
