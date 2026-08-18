import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Salidas Estructuradas (c6)
 * Módulo 02 — Ingeniería de Prompts
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c6',
  sections: [
    {
      id: 'lenguaje-natural-a-codigo',
      title: '01. El Puente entre Lenguaje Natural y Código',
      subtitle: 'Diseñando para ser consumido por software, no por humanos',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Los humanos leemos texto libre y Markdown; el software automatizado consume estructuras de datos tipadas (JSON). Si estás integrando modelos de lenguaje en una aplicación de producción, no puedes depender de expresiones regulares frágiles para extraer la respuesta del modelo.'
        },
        {
          type: 'EXAMPLE',
          title: 'Pipeline de Integración de Salidas Estructuradas',
          content: [
            '1. User Input (Lenguaje Natural) ──► El usuario interactúa libremente.',
            '2. LLM Ingestion + Schema Constraint ──► El modelo recibe la interfaz TypeScript / JSON Schema.',
            '3. Structured Output Generation ──► El modelo produce únicamente el objeto JSON sin texto conversacional.',
            '4. Deterministic Validation ──► Zod / Pydantic valida tipos y restricciones de negocio.',
            '5. Business Logic & Software Execution ──► El código backend procesa los datos con certeza tipada.'
          ],
          caption: 'El modelo produce una propuesta probabilística; el software determinista decide si la estructura es válida.'
        }
      ]
    },
    {
      id: 'json-y-schemas',
      title: '02. JSON & Schemas Tipados',
      subtitle: 'Forzando el formato mediante contratos de tipos',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'La técnica más efectiva para obtener datos estructurados es proveer una interfaz tipada (TypeScript o JSON Schema) directamente en el System Prompt, acompañada de restricciones negativas.'
        },
        {
          type: 'CODE',
          filename: 'ticket-analysis-schema.prompt',
          language: 'typescript',
          code: `Analiza el ticket de soporte y devuelve un JSON válido que cumpla estrictamente con este schema de TypeScript:

interface TicketAnalysis {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  is_bug: boolean;
  affected_component: string | null;
  summary: string;
}

WARNING: Return ONLY valid JSON. Do not include markdown backticks.`
        }
      ]
    },
    {
      id: 'manejo-de-errores-y-defensas',
      title: '03. Manejo de Errores de Formato',
      subtitle: 'Los modelos desobedecen: defensas en el backend',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Problemas Comunes de Formato',
            subtitle: 'Fallos en Runtime',
            icon: '🚨',
            badge: 'Riesgos',
            points: [
              'Envuelve el JSON en bloques de código markdown (```json ... ```).',
              'Añade texto conversacional de apertura: "Aquí tienes el JSON solicitado:".',
              'Falta escapar comillas dobles internas en strings largos.',
              'Inventa propiedades o campos adicionales fuera del schema tipado.'
            ]
          },
          right: {
            title: 'Defensas de Software en Código',
            subtitle: 'Capa de Sanitización & Validación',
            icon: '🛡️',
            badge: 'Defensas',
            active: true,
            points: [
              'Pre-procesamiento: Extracción resiliente entre la primera "{" y la última "}".',
              'Principio de Parseo: Parseable ≠ Válido (un JSON parseable puede violar tipos de negocio).',
              'Validación Estricta: Librerías como Zod o Pydantic rechazan y gatillan reintentos automáticos.'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Validación en Backend',
          message: 'Nunca confíes ciegamente en que el LLM devolverá un JSON impecable. Todo payload generado por IA debe pasar por una capa de validación de esquemas (Zod / JSON Schema) antes de llegar a la base de datos o lógica de negocio.'
        }
      ]
    },
    {
      id: 'del-concepto-a-la-practica',
      title: '04. Del Concepto a la Práctica: Módulo 02',
      subtitle: 'Experimentación y construcción de contratos de ingeniería',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos cubierto los tres pilares de Prompt Engineering: comportamiento reproducible frente a varianza, patrones de descomposición lógica (CoT), y generación de salidas estructuradas con validación determinista. Es hora de llevar estos conceptos a la práctica.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd2',
          title: 'Demo 02 — Diseñar la Instrucción',
          description: 'Comprueba cómo las instrucciones ambiguas rompen el pipeline de backend y cómo las restricciones y schemas aseguran el parseo en tiempo real.',
          path: '/academy/modules/m02-prompt-engineering/demo-engineer-instruction',
          actionLabel: 'Probar Demo 02'
        },
        {
          type: 'LAB_REF',
          labId: 'l2',
          title: 'Laboratorio 02 — Diseñar un Contrato de Instrucción para IA',
          description: 'Construye un contrato de instrucciones determinista para una tarea de modernización real. Diseña el prompt, schema y reglas de validación en tu entorno local.',
          path: '/academy/modules/m02-prompt-engineering/lab-02-engineer-instruction-contract',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 02'
        }
      ]
    }
  ]
};
