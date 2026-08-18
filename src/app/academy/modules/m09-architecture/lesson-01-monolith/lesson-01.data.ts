import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — La Trampa del Monolito (c25)
 * Módulo 09 — Arquitectura de IA
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c25',
  sections: [
    {
      id: 'trampa-del-monolito-intro',
      title: '01. La Trampa del Monolito: El Modelo es una Dependencia',
      subtitle: 'El error arquitectónico de construir el sistema alrededor de un SDK propietario',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'A lo largo de Academy hemos visto cómo una simple llamada a un LLM creció hasta incorporar RAG, Tools, Agentes, MCP y Seguridad. El error de arquitectura más común en equipos nuevos es construir todo este sistema fuertemente acoplado al SDK de un proveedor específico.'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El Riesgo del Monolito Acoplado',
          message: 'Cuando el modelo, las herramientas, la memoria, la evaluación y la UI están entremezclados en una sola base de código dependiente de un SDK particular, el sistema se vuelve imposible de testear, imposible de operar y víctima de Vendor Lock-in absoluto.'
        }
      ]
    },
    {
      id: 'problema-del-acoplamiento-total',
      title: '02. El Problema del Acoplamiento Total',
      subtitle: 'Por qué las arquitecturas centralizadas en el proveedor colapsan',
      blocks: [
        {
          type: 'CODE',
          filename: 'tightly-coupled-ai-monolith.txt',
          language: 'text',
          code: `Model SDK (OpenAI / Anthropic)
  ├── Hardcoded Prompts
  ├── Direct Tool Definitions
  ├── Proprietary Context Retrieval
  ├── In-line Evaluations
  └── Direct UI Rendering
───────────────────────────────────
= EVERYTHING TIED TO ONE VENDOR`
        },
        {
          type: 'PARAGRAPH',
          text: 'Si sale un mejor modelo de la competencia o el proveedor cambia sus políticas de precios y deprecaciones, un sistema acoplado requiere reescribir la aplicación entera.'
        }
      ]
    },
    {
      id: 'modelo-como-dependencia-intercambiable',
      title: '03. El Modelo como Dependencia: Invirtiendo la Jerarquía',
      subtitle: 'De aplicaciones centradas en el modelo a sistemas orientados a capacidades',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Mentalidad Principiante',
            subtitle: 'Aplicación = Wrapper del Modelo',
            icon: '⚠️',
            badge: 'High Lock-in',
            points: [
              '"Mi aplicación es un wrapper alrededor de GPT-4".',
              'Lógica de negocio mezclada con llamadas de red al LLM.',
              'Incompatibilidad con entornos locales u offline.',
              'Imposibilidad de realizar Unit Tests reproducibles.'
            ]
          },
          right: {
            title: 'Mentalidad Empresarial',
            subtitle: 'Aplicación = Plataforma Modular',
            icon: '🏗️',
            badge: 'Decoupled & Testable',
            active: true,
            points: [
              '"Mi aplicación tiene un motor de razonamiento intercambiable".',
              'Lógica de negocio protegida por contratos e interfaces limpias.',
              'Soporte multi-proveedor y fallback automático.',
              'Testabilidad unitaria mediante mocks deterministas.'
            ]
          }
        }
      ]
    },
    {
      id: 'separacion-de-responsabilidades-conclusion',
      title: '04. Separation of Concerns: Diseño Basado en Componentes',
      subtitle: 'Fronteras independientes para Modelo, Memoria, Acción y Seguridad',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'La Plataforma Abstraída',
          message: 'Un sistema de IA moderno debe tratar al Modelo (LLM), la Memoria (RAG), la Acción (Tools) y la Seguridad (Evaluation) como servicios independientes con contratos claros. El Vendor Lock-in es solo una consecuencia: la verdadera ganancia es la testabilidad, la mantenibilidad y la escalabilidad.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios de Desacoplamiento Arquitectónico',
          items: [
            'El modelo de IA es una pieza de infraestructura intercambiable (un commodity).',
            'La propiedad intelectual y el valor real residen en la arquitectura, los datos, los contratos y los protocolos de evaluación.',
            'Ninguna interfaz de usuario debe depender directamente de estructuras de datos propietarias de un LLM.'
          ]
        }
      ]
    }
  ]
};
