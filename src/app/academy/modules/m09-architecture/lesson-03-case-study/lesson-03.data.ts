import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Caso de Estudio CASE OS (c27)
 * Módulo 09 — Arquitectura de IA
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c27',
  sections: [
    {
      id: 'case-os-caso-de-estudio-intro',
      title: '01. CASE OS: Un Caso de Estudio de Arquitectura Modular',
      subtitle: 'Evaluando trade-offs arquitectónicos y decisiones deliberadas',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'CASE OS no es la plataforma definitiva: es una implementación real de los principios de diseño modular que hemos aprendido. Lo más valioso de estudiar CASE OS no es memorizar su código, sino entender por qué se tomaron ciertas decisiones técnicas y qué se decidió NO construir.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Principio Maestro de Evaluación Arquitectónica',
          message: 'Una buena arquitectura se define tanto por lo que construye como por lo que elige explícitamente NO construir para evitar complejidad innecesaria.'
        }
      ]
    },
    {
      id: 'lo-que-si-construimos-case-os',
      title: '02. Lo que SÍ construimos en CASE OS',
      subtitle: 'Aislamiento de componentes para blindar contra Vendor Lock-in',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Los 3 Componentes Desacoplados de CASE OS',
          items: [
            '1. Engines (Ruteo de Modelos): Capa de abstracción sobre llamadas a LLMs. Si un proveedor cambia su API, solo se actualiza su Engine; el resto del sistema permanece inalterado.',
            '2. Registries (Herramientas & Demos): Registro modular de herramientas y simulaciones independientes del modelo de inferencia.',
            '3. Context Builders (Memoria & Contenido): El pipeline de ensamblaje de contexto opera como un middleware inyector desacoplado del renderer.'
          ]
        }
      ]
    },
    {
      id: 'lo-que-no-construimos-trade-offs',
      title: '03. Lo que NO construimos: Arquitectura Mínima Necesaria',
      subtitle: 'Decisiones conscientes para evitar sobreingeniería y feature creep',
      blocks: [
        {
          type: 'COMPARISON',
          left: {
            title: 'Decisiones Conscientes de Omisión',
            subtitle: 'Por qué se descartaron',
            icon: '🛑',
            badge: 'Deliberate Trade-offs',
            points: [
              'NO construimos un CMS: El contenido curricular es determinista y estático; una base de datos habría añadido latencia y complejidad innecesaria.',
              'NO implementamos MCP real con sockets: Los laboratorios son entornos simulados sin sistemas remotos; una emulación local es 100% fiel pedagógicamente.',
              'NO agregamos motores en runtime: La capa de proveedores está congelada para evitar consumo de API keys y costos innecesarios.',
              'NO construimos un Eval Registry cloud: Se simula localmente en el cliente para garantizar costo $0 y cero latencia de red.'
            ]
          },
          right: {
            title: 'El Beneficio de la Simplicidad',
            subtitle: 'Resultado en Producción',
            icon: '⚡',
            badge: '100% Client-Side SPA',
            active: true,
            points: [
              'Despliegue directo en GitHub Pages sin costes de infraestructura backend.',
              'Cero exposición de secretos o API keys para los estudiantes.',
              'Tiempo de carga ultrarrápido con hash routing y compilación limpia.',
              'Mantenibilidad absoluta del código a largo plazo.'
            ]
          }
        }
      ]
    },
    {
      id: 'prueba-final-architecture-blueprint',
      title: '04. La Prueba Final: The Architecture Blueprint',
      subtitle: 'El rol del Arquitecto de Sistemas de Inteligencia Artificial',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Has completado el recorrido completo de CASE Academy: desde los fundamentos probabilísticos de M01 hasta la gobernanza arquitectónica de M09. Ahora es momento de demostrar tu criterio en el laboratorio final.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd9',
          title: 'Demo 09 — Arquitectura bajo Demanda',
          description: 'Interactúa con el constructor arquitectónico: selecciona componentes según requerimientos de negocio reales y evalúa el impacto de la sobreingeniería vs la solución mínima necesaria.',
          path: '/academy/modules/m09-architecture/demo-architecture-builder',
          actionLabel: 'Probar Demo 09'
        },
        {
          type: 'LAB_REF',
          labId: 'l9',
          title: 'Laboratorio 09 — Plano de Arquitectura de Modernización con IA',
          description: 'Diseña el blueprint de modernización definiendo migration boundaries, componentes necesarios y políticas de aislamiento para certificar tu dominio como Arquitecto de Sistemas GenAI.',
          path: '/academy/modules/m09-architecture/lab-09-architecture-blueprint',
          duration: '90 min',
          actionLabel: 'Iniciar Laboratorio 09'
        }
      ]
    }
  ]
};
