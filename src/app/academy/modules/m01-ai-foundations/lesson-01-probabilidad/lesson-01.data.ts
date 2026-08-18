import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — De Código a Probabilidad (c1)
 * Módulo 01 — Fundamentos de IA
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c1',
  sections: [
    {
      id: 'paradigma-determinista-vs-probabilistico',
      title: '01. De Código a Probabilidad',
      subtitle: 'Entendiendo el cambio de paradigma en Ingeniería de Software',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'La transición hacia la Inteligencia Artificial no es un cambio de sintaxis; es un cambio fundamental en cómo pensamos sobre la computación.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Software Determinista',
            subtitle: 'Lógica Clásica',
            icon: '⚙️',
            badge: 'Tradicional',
            points: [
              'En el software tradicional, escribimos reglas explícitas. Si A entonces B.',
              'Para la misma entrada, el sistema siempre produce exactamente la misma salida.',
              'Reglas diseñadas e implementadas por humanos.',
              'Lógica explícita con ramificaciones (if/else).',
              '100% predecible, determinista y reproducible.'
            ]
          },
          right: {
            title: 'Modelos Probabilísticos (LLMs)',
            subtitle: 'Inferencia de Pesos',
            icon: '🎲',
            badge: 'Nuevo Paradigma',
            active: true,
            points: [
              'Un LLM no ejecuta reglas de negocio; calcula distribuciones de probabilidad.',
              'No sabe qué es "cierto"; predice qué token (palabra) es más probable que continúe la secuencia.',
              'Reglas y patrones inferidos a partir de los datos de entrenamiento.',
              'Lógica probabilística basada en pesos vectoriales.',
              'Salidas variables y adaptativas (incluso con la misma entrada según la temperatura).'
            ]
          }
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Cambio Mental Clave',
          message: 'No estamos llamando a una API tradicional que consulta una base de datos indexada. Estamos interactuando con un motor estadístico que genera ("alucina") texto de forma matemáticamente estructurada.'
        }
      ]
    },
    {
      id: 'entrenamiento-vs-inferencia',
      title: '02. Entrenamiento vs Inferencia',
      subtitle: '¿Dónde ocurre el aprendizaje y dónde opera el Ingeniero de Software?',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Es crítico diferenciar el ciclo de vida de un modelo para entender qué partes están bajo nuestro control como ingenieros y dónde se incurren los costos.'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Entrenamiento (Training)',
            subtitle: 'Fase de Creación',
            icon: '🏋️',
            badge: 'Fase 1',
            points: [
              'Fase donde el modelo "aprende": procesa terabytes de texto y ajusta billones de parámetros matemáticos.',
              'Requiere meses de cómputo intensivo y millones de dólares en clusters de GPUs.',
              'El Resultado: Un archivo binario inmutable (ej. 140GB).',
              'Modelo congelado: no aprende ni retiene datos de las consultas posteriores.',
              'Conocimiento estrictamente limitado a la fecha de corte (knowledge cutoff).'
            ]
          },
          right: {
            title: 'Inferencia (Inference)',
            subtitle: 'Producción & Runtime',
            icon: '🚀',
            badge: 'Fase 2 (Producción)',
            active: true,
            points: [
              'Proceso de ejecutar el modelo ya entrenado para responder a un prompt de entrada.',
              'Realiza millones de cálculos tensoriales con los parámetros congelados.',
              'Fase que controlas como Ingeniero de Software en arquitectura y llamadas de sistema.',
              'Consume memoria de GPU en tiempo de respuesta (latencia de tokens).',
              'Modelo de costos: se cobra por Token (entrada/salida), no por request HTTP simple.'
            ]
          }
        }
      ]
    },
    {
      id: 'parametros-y-orquestacion',
      title: '03. El Misterio de los Parámetros',
      subtitle: '¿Qué significa que un modelo tenga 8B o 70B de parámetros?',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Los parámetros son los pesos matemáticos en la red neuronal que determinan con qué intensidad se conectan los conceptos. Representan el "conocimiento comprimido" del modelo.'
        },
        {
          type: 'EXAMPLE',
          title: 'Dimensiones de Modelos en Ingeniería',
          content: [
            'Modelos Compactos (8B / 14B): Rápidos, económicos, ejecutables en servidores estándar o laptops locales. Ideales para clasificación, extracción estructurada, routers y pipelines RAG.',
            'Modelos Grandes (70B+ / Frontier): Mayor latencia y costo. Imprescindibles para razonamiento lógico profundo, síntesis arquitectónica y codificación compleja.'
          ],
          caption: 'La elección del tamaño del modelo define el costo, la latencia y la capacidad de razonamiento del sistema.'
        },
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Regla de Ingeniería',
          message: 'No utilices un modelo de frontera (70B+) para una tarea que puede resolver con precisión un modelo especializado de 8B. El verdadero talento del ingeniero de IA reside en orquestar modelos pequeños y rápidos, reservando los modelos pesados exclusivamente para razonamiento de alto orden.'
        },
        {
          type: 'DEMO_REF',
          demoId: 'd1',
          title: 'Demo 01 — Token Playground',
          description: 'Experimenta empíricamente cómo el texto se segmenta en tokens, la diferencia de costo por idioma y la mecánica fundamental de la inferencia.',
          path: '/academy/modules/m01-ai-foundations/demo-token-playground',
          actionLabel: 'Abrir Token Playground'
        }
      ]
    },
    {
      id: 'conclusion-y-aplicacion',
      title: '04. Conclusión & Key Insights',
      subtitle: 'De reglas estrictas a orquestación probabilística',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Principios Fundamentales para el Ingeniero',
          items: [
            'Los LLMs no son bases de datos deterministas; son motores de predicción estadística y razonamiento sobre texto.',
            'El modelo en producción (Inferencia) es inmutable y no aprende de las consultas de los usuarios.',
            'Para inyectar conocimiento corporativo nuevo o dinámico, usamos Contexto (RAG), no reentrenamiento.',
            'El rol del ingeniero evoluciona de escribir todas las reglas a diseñar el contexto, las restricciones y los pipelines de validación.'
          ]
        },
        {
          type: 'LAB_REF',
          labId: 'l1',
          title: 'Laboratorio 01 — Analizar una Rutina Legacy',
          description: 'Aplica el nuevo modelo mental en tu entorno local. Audita una rutina de código existente y elabora un Risk & Opportunity Assessment separando lógica determinista de oportunidades de IA.',
          path: '/academy/modules/m01-ai-foundations/lab-01-legacy-routine',
          duration: '60 min',
          actionLabel: 'Iniciar Laboratorio 01'
        }
      ]
    }
  ]
};
