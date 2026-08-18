import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 02 — Colaboración Humano-Agente (c17)
 * Módulo 06 — Ingeniería de Software Agéntica
 */
export const LESSON_02_DOCUMENT: LessonDocument = {
  lessonId: 'c17',
  sections: [
    {
      id: 'espectro-de-colaboracion',
      title: '01. El Espectro de Colaboración Humano-Agente',
      subtitle: 'La Ley de la Autonomía: mayor autonomía requiere mayor verificación',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'A medida que los agentes asumen más responsabilidad técnica (escribir código, refactorizar, ejecutar tests), el rol del humano evoluciona. Los agentes no reemplazan al desarrollador; la ingeniería agéntica desplaza el trabajo humano hacia áreas de mayor impacto y juicio arquitectónico.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Ley de la Autonomía',
          message: 'Mayor autonomía requiere mayor verificación. Si el agente solo completa una línea de código, puedes verificarla leyendo. Si el agente refactoriza 50 archivos, necesitas pruebas automatizadas, análisis de seguridad y revisión arquitectónica.'
        }
      ]
    },
    {
      id: 'espectro-de-trabajo',
      title: '02. El Espectro de Trabajo: De Tecleador a Orquestador',
      subtitle: 'Evolución de las modalidades de interacción en desarrollo',
      blocks: [
        {
          type: 'EXAMPLE',
          title: 'Modalidades de Interacción en el Espectro SWE',
          content: [
            '1. Tradicional: Human writes code (El humano escribe el 100% del código).',
            '2. Code Completion: AI suggests ──► Human reviews (La IA sugiere líneas locales y el humano acepta).',
            '3. Agentic Workflow: AI implements ──► Human verifies (La IA implementa componentes y el humano verifica funcionalidad).',
            '4. Autonomous Loop: AI iterates ──► Human approves (La IA itera en background y el humano aprueba la integración final).'
          ],
          caption: 'El avance en el espectro traslada el esfuerzo del desarrollador de escribir líneas a definir invariantes y contratos.'
        }
      ]
    },
    {
      id: 'cuatro-pilares-del-trabajo',
      title: '03. Los Cuatro Pilares del Nuevo Trabajo',
      subtitle: 'Hacia dónde se desplaza el esfuerzo del ingeniero humano',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Los 4 Pilares de la Ingeniería Agéntica',
          items: [
            '1. Contexto & Especificación: Seleccionar qué información (archivos, reglas) proveer al agente y definir los requerimientos de negocio sin ambigüedad (M02/M03).',
            '2. Validación & Testing: Escribir pruebas robustas que sirvan como "contrato de éxito" para que el agente sepa si su código realmente funciona.',
            '3. Revisión (Code Review): Evaluar impacto arquitectónico, riesgos de seguridad y mantenibilidad a largo plazo de las propuestas del agente.',
            '4. Aprobación Estratégica: Alinear la implementación técnica con los objetivos del producto y del usuario final.'
          ]
        }
      ]
    },
    {
      id: 'human-in-the-loop-y-conclusion',
      title: '04. Conclusión: La Verificación es Primordial',
      subtitle: 'Protección contra código convincentemente incorrecto',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'No confíes ciegamente en el modelo',
          message: 'Los modelos generativos, por su naturaleza probabilística, pueden y van a producir código incorrecto de manera sumamente convincente. Human Approval debe ser un paso obligatorio: especialmente antes de integrar (merge) cambios a producción, un experto humano debe revisar y aprobar la decisión del agente, validando que se adhiera al contexto corporativo.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Colaboración Humano-Agente',
          items: [
            'El desarrollador opera como director técnico y árbitro de calidad.',
            'Los tests automatizados son la herramienta principal del agente para converger hacia una solución válida.',
            'Ningún cambio agéntico debe llegar a ramas principales sin aprobación humana explícita.'
          ]
        }
      ]
    }
  ]
};
