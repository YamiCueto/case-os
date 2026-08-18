import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Contexto del Repositorio (c18)
 * Módulo 06 — Ingeniería de Software Agéntica
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c18',
  sections: [
    {
      id: 'contexto-del-repositorio-intro',
      title: '01. Contexto del Repositorio: Más allá del RAG básico',
      subtitle: 'Cómo un IDE construye la inteligencia sobre el código',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Un error común es asumir que un IDE simplemente hace "RAG sobre tu repositorio" al buscar palabras clave. La realidad es que los entornos modernos (como Cursor o Copilot) construyen contexto relevante utilizando múltiples estrategias simultáneamente.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'El Código es un Grafo, no Texto Plano',
          message: 'El código no es un texto plano. Es un grafo de dependencias estricto. El mejor contexto proviene de entender las relaciones estructurales, no solo las similitudes semánticas.'
        }
      ]
    },
    {
      id: 'fuentes-de-contexto-ide',
      title: '02. Las Piezas del Rompecabezas (Context Assembly)',
      subtitle: 'Selección y ensamblaje de estado en tiempo de desarrollo',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Fuentes de Contexto para el Coding Agent',
          items: [
            '1. Open Files: El agente da prioridad máxima a lo que estás mirando o editando en las pestañas activas.',
            '2. Dependencies: Importaciones y librerías utilizadas (Grafo sintáctico y AST).',
            '3. Diagnostics: Errores del compilador en tiempo real (Linter, TypeScript errors).',
            '4. Search Results: Búsqueda Vectorial (RAG) para encontrar código similar y utilitarios.'
          ]
        },
        {
          type: 'CODE',
          filename: 'ide-context-assembly-pipeline.txt',
          language: 'text',
          code: `[Active File + Cursor Position] ─┐
[Project Dependencies & Types]   ├─► Context Selector ─► Assembled Payload ─► Coding Agent (LLM)
[Compiler & Linter Diagnostics]  │       (Token Budget)
[Semantic Search Chunks (RAG)]   ─┘`
        }
      ]
    },
    {
      id: 'desafio-fragmentacion-puente-m07',
      title: '03. El Problema de Integración (Preparando el terreno para M07)',
      subtitle: 'La fragmentación de herramientas y el desafío de interoperabilidad',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Como desarrollador trabajando con un agente, tu trabajo principal a menudo es garantizar que el agente tenga el contexto correcto. Pero surge un desafío gigante a nivel de infraestructura:'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Desafío de la Fragmentación',
          message: 'Para que un agente construya ese contexto, necesita saber cómo leer archivos locales, cómo consultar tu base de datos de tickets de JIRA, cómo hacer fetch a la documentación de AWS, etc. Cada integración es diferente. Esta fragmentación es exactamente lo que resuelve Model Context Protocol (MCP), que estudiaremos a fondo en el Módulo 07.'
        }
      ]
    },
    {
      id: 'del-concepto-a-la-practica-m06',
      title: '04. Práctica: The Context-Aware Coder',
      subtitle: 'Simulando el cambio asistido por IA en el IDE',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Comportamiento según el Perímetro de Contexto',
          items: [
            'Omisión de contexto esencial: El agente alucinará un parche incorrecto o asumirá firmas que no existen.',
            'Exceso de contexto irrelevante: El agente se distraerá e intentará expandir el alcance de forma destructiva.',
            'Contexto óptimo: El agente genera el parche ideal, pasa a Verificación (Tests) y requiere tu Human Approval.'
          ]
        },
        {
          type: 'DEMO_REF',
          demoId: 'd6',
          title: 'Demo 06 — El Cambio Asistido por IA',
          description: 'Experimenta directamente el impacto del perímetro de contexto. Enfréntate a un bug en un componente simulado y observa cómo el contexto exacto habilita parches limpios con verificación.',
          path: '/academy/modules/m06-agentic-swe/demo-ai-coder',
          actionLabel: 'Probar Demo 06'
        },
        {
          type: 'LAB_REF',
          labId: 'l6',
          title: 'Laboratorio 06 — Diseñar un Protocolo de Ingeniería de Software Agéntica',
          description: 'Diseña un protocolo de equipo para ingeniería de software asistida por IA: perímetro de contexto, validación con tests y política de aprobación humana.',
          path: '/academy/modules/m06-agentic-swe/lab-06-agentic-swe-protocol',
          duration: '90 min',
          actionLabel: 'Iniciar Laboratorio 06'
        }
      ]
    }
  ]
};
