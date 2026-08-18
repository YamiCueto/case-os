import { LessonDocument } from '../../../models/lesson-document.models';

/**
 * Contenido pedagógico estructurado para la Lección 01 — La Brecha de Producción (c22)
 * Módulo 08 — IA en Producción
 */
export const LESSON_01_DOCUMENT: LessonDocument = {
  lessonId: 'c22',
  sections: [
    {
      id: 'el-production-gap-intro',
      title: '01. El Production Gap: De la Demo a la Realidad',
      subtitle: '¿Cómo demostramos que un sistema de IA merece estar en producción?',
      blocks: [
        {
          type: 'PARAGRAPH',
          lead: true,
          text: 'Hasta ahora hemos aprendido qué puede construir la Inteligencia Artificial (Agentes, RAG, Tools). A partir de este momento, el enfoque cambia radicalmente a: ¿Cómo demostramos que un sistema de IA merece estar en producción?'
        },
        {
          type: 'CALLOUT',
          variant: 'warning',
          title: 'La Cruda Realidad de Producción',
          message: 'Un prototipo de IA no está listo para producción porque "funciona bien en una demo de 5 minutos". Está listo cuando podemos medir sistemáticamente, detectar y controlar sus fallos en el 100% de los casos.'
        }
      ]
    },
    {
      id: 'problema-de-las-vibras',
      title: '02. El Problema de las "Vibras" (Vibes-based Evaluation)',
      subtitle: 'Por qué la inspección visual informal es peligrosa a escala',
      blocks: [
        {
          type: 'KEY_INSIGHTS',
          title: 'Limitaciones de la Evaluación por Vibras',
          items: [
            '1. Es subjetiva e irrepetible: dos ingenieros juzgarán el mismo output con criterios dispares.',
            '2. No escala: imposible auditar manualmente miles de consultas diarias de usuarios.',
            '3. No detecta regresiones: cambiar un modelo o editar el prompt puede romper casos límite silenciosamente.'
          ]
        }
      ]
    },
    {
      id: 'evaluacion-es-software-transicion',
      title: '03. La Evaluación es Software: La Transición a la Ingeniería',
      subtitle: 'Tratar las pruebas de IA como una disciplina de software rigurosa',
      blocks: [
        {
          type: 'PARAGRAPH',
          text: 'Para cerrar la brecha hacia producción, debemos tratar la evaluación como una práctica rigurosa de Ingeniería de Software. La transición de mentalidad se formaliza así:'
        },
        {
          type: 'COMPARISON',
          left: {
            title: 'Antes: Evaluación por Vibras',
            subtitle: 'Inspección Informal',
            icon: '👀',
            badge: 'Unreliable',
            points: [
              '"Esta respuesta parece buena".',
              'Evaluación ad-hoc en Playground manual.',
              'Cero métricas numéricas comparables.',
              'Ceguera total ante regresiones silenciosas.'
            ]
          },
          right: {
            title: 'Después: Evaluación como Software',
            subtitle: 'Ingeniería Sistemática',
            icon: '🎯',
            badge: 'Production Grade',
            active: true,
            points: [
              'Definimos contractualmente qué significa "buena".',
              'Medimos numéricamente con métricas reproducibles.',
              'Comparamos sistemáticamente contra una línea base (Baseline).',
              'Detectamos regresiones automáticamente en CI/CD.'
            ]
          }
        }
      ]
    },
    {
      id: 'hacia-el-determinismo-conclusion',
      title: '04. Hacia el Determinismo: Sistematizar la Incertidumbre',
      subtitle: 'Un principio fundamental de la ingeniería de sistemas GenAI',
      blocks: [
        {
          type: 'CALLOUT',
          variant: 'rule',
          title: 'Principio de Evaluación en Producción',
          message: 'Los Modelos de Lenguaje son probabilísticos y no deterministas por naturaleza. No podemos hacer determinista al modelo, pero SÍ podemos hacer sistemático el proceso mediante el cual evaluamos su comportamiento.'
        },
        {
          type: 'KEY_INSIGHTS',
          title: 'Invariantes de Ingeniería en M08',
          items: [
            'La evaluación en producción sustituye la intuición humana por suites de pruebas automatizadas.',
            'Toda modificación a prompts o modelos debe ejecutarse contra suites de evaluación antes de desplegarse.',
            'La fiabilidad del sistema surge del arnés de ingeniería que rodea al modelo probabilístico.'
          ]
        }
      ]
    }
  ]
};
