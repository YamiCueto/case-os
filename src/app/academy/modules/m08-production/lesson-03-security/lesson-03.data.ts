import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 03 — Seguridad y Restricciones (c24)
 * Módulo 08 — IA en Producción
 */
export const LESSON_03_DOCUMENT: LessonDocument = {
  lessonId: 'c24',
  sections: [
    {
      id: 'seguridad-y-boundaries-intro',
      title: '01. Security & Boundaries: El Modelo no es un Firewall',
      subtitle: 'La falsa sensación de seguridad de las directivas en prompts',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Es común creer que si le decimos al modelo "No ejecutes comandos destructivos" en el System Prompt, estamos protegidos. Esto es falso. El LLM NO ES una frontera de seguridad: es un motor probabilístico y susceptible al Prompt Injection.'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'El LLM no es una Frontera de Seguridad',
          message: 'Asumir que el modelo rechazará inputs maliciosos solo porque se lo pediste en las instrucciones es una vulnerabilidad crítica. La seguridad en aplicaciones GenAI se basa en asumir que el modelo será engañado y proteger rigurosamente sus periferias mediante software determinista.'
        }
      ]
    },
    {
      id: 'diseno-de-fronteras-reales',
      title: '02. El Diseño de Fronteras: Aislando al Agente',
      subtitle: 'Defensa en profundidad en el flujo de ejecución',
      blocks: [
        {
          type: 'CODE',
          filename: 'security-boundaries-flow.txt',
          language: 'text',
          code: `Untrusted User Input
      │
      ▼
Context Boundary (Enmascaramiento de PII, validación de permisos de datos)
      │
      ▼
    Model (Motor probabilístico — NO es un firewall)
      │
      ▼
Tool Boundary (Validación de esquema, Sandboxing, Human-in-the-Loop)
      │
      ▼
  MCP Server / DB (Sistema Real de Producción)`
        },
        {
          type: 'PARAGRAPH',
          text: '¿Qué pasa si el modelo recibe una instrucción maliciosa y tiene una herramienta con permisos reales de escritura (Mutation Risk)? Si la Tool Boundary no exige Human Approval estricto, los datos de producción pueden ser comprometidos o destruidos.'
        }
      ]
    },
    {
      id: 'restricciones-operativas-multidimensionales',
      title: '03. Restricciones Operativas: Ingeniería Multidimensional',
      subtitle: 'El equilibrio entre Calidad, Seguridad, Latencia, Costo y Fiabilidad',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Las 5 Dimensiones de Producción (Q-S-L-C-R)',
          items: [
            '1. Quality (Calidad): Precisión del output medida a través de la Jerarquía de Evaluación y Golden Datasets.',
            '2. Security (Seguridad): Aislamiento con Context Boundaries, Tool Boundaries y Human-in-the-Loop para operaciones de mutación.',
            '3. Latency (Latencia): Usar modelos rápidos o caché para tareas sencillas; no penalizar al usuario con llamadas pesadas innecesarias.',
            '4. Cost (Costo / FinOps): Modelado riguroso del consumo de tokens y presupuesto operativo por invocación.',
            '5. Reliability (Fiabilidad): Estrategias de Fallback y degradación elegante ante caídas de proveedores cloud.'
          ]
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Ley de las Restricciones del Sistema',
          message: 'No existe "la mejor respuesta" en el vacío. Existe únicamente "la mejor respuesta dentro de las restricciones del sistema" (Quality + Security + Latency + Cost + Reliability).'
        }
      ]
    },
    {
      id: 'practica-tuberia-evaluacion-m08',
      title: '04. Práctica: La Tubería de Evaluación & Production Readiness',
      subtitle: 'Experimentación interactiva y diseño del protocolo de producción',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Hemos establecido la transición de las vibras a la ingeniería, el embudo jerárquico de 5 capas, los Golden Datasets y las fronteras de seguridad en profundidad. Es momento de pasar a la práctica interactiva.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd8',
          title: 'Demo 08 — La Tubería de Evaluación',
          description: 'Experimenta con la jerarquía de evaluación en acción: combina checks deterministas con LLM-as-a-judge y analiza cómo evitar False Passes en producción.',
          path: '/academy/modules/m08-production/demo-eval-pipeline',
          actionLabel: 'Probar Demo 08'
        },
        {
          type: 'LAB_REF',
          labId: 'l8',
          title: 'Laboratorio 08 — Diseñar un Protocolo de IA en Producción',
          description: 'Diseña un Production Readiness Review evaluando boundaries, constraints y protocolos de evaluación para certificar un sistema antes de su despliegue.',
          path: '/academy/modules/m08-production/lab-08-production-ai-protocol',
          duration: '90 min',
          actionLabel: 'Iniciar Laboratorio 08'
        }
      ]
    }
  ]
};
