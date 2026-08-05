import { LabDefinition } from '../../core/models/lab.models';

export const LABS_CONFIG: LabDefinition[] = [
  {
    id: 'lab-001',
    slug: 'refactorizacion-codigo-legacy-ia',
    version: '1.0.0',
    status: 'PUBLISHED',
    type: 'GUIDED',
    difficulty: 'INTERMEDIATE',
    title: 'Refactorización de Código Legacy con IA',
    description: 'Aprende a utilizar LLMs para comprender, documentar y modernizar un procedimiento almacenado y una clase monolítica heredada.',
    estimatedTime: 45,
    technologies: ['Java', 'SQL', 'GenAI'],
    steps: [
      {
        id: 'step-1',
        title: 'Analizar el Stored Procedure',
        content: `En este primer paso, vamos a extraer la lógica de negocio de un SP complejo que no tiene documentación.
        
Utiliza el **Prompt de Análisis de SPs** para pedirle al modelo que te explique las reglas funcionales. Revisa la salida y compara si detectó correctamente las tablas afectadas.`,
        requiredResources: ['analisis-documentacion-stored-procedures'],
        optionalResources: ['context-engineering-roles-personas'],
        outputs: ['Documentación funcional en Markdown', 'Listado de tablas afectadas'],
        validationHints: ['Asegúrate de inyectar el rol de Data Architect en tu prompt inicial.']
      },
      {
        id: 'step-2',
        title: 'Generar los Tests de Regresión',
        content: `Antes de refactorizar la lógica hacia Spring Boot, necesitamos un arnés de pruebas para no romper nada.
        
Toma la explicación obtenida en el Paso 1 y utiliza el prompt de **Generación de Tests Unitarios** para crear la clase de prueba en JUnit 5.`,
        requiredResources: ['generacion-tests-unitarios-junit5'],
        outputs: ['Clase de test en Java (JUnit 5)']
      },
      {
        id: 'step-3',
        title: 'Migración a Spring Boot',
        content: `Ahora que tenemos los tests, vamos a migrar el código heredado a una estructura RESTful moderna.
        
Aplica la **Arquitectura Hexagonal** y utiliza el prompt de **Migración a Spring Boot** para generar el Controller y Service.`,
        requiredResources: ['migracion-vb6-spring-boot', 'arquitectura-hexagonal-spring-boot'],
        outputs: ['Controller.java', 'Service.java', 'Port.java']
      }
    ]
  },
  {
    id: 'lab-002',
    slug: 'code-review-asistido',
    version: '1.0.0',
    status: 'PUBLISHED',
    type: 'PRACTICE',
    difficulty: 'BEGINNER',
    title: 'Code Review Asistido por Inteligencia Artificial',
    description: 'Práctica para auditar Pull Requests complejos detectando vulnerabilidades, bad smells y violaciones a principios SOLID usando IAs generativas.',
    estimatedTime: 30,
    technologies: ['Git', 'GenAI', 'Clean Code'],
    steps: [
      {
        id: 'step-1',
        title: 'Inyección de Contexto DevSecOps',
        content: `El primer paso para un buen Code Review asistido es establecer la personalidad del revisor. 
        
Define el System Prompt utilizando la técnica de **Context Engineering** para que la IA actúe como un DevSecOps estricto.`,
        requiredResources: ['context-engineering-roles-personas'],
        outputs: ['System Prompt configurado']
      },
      {
        id: 'step-2',
        title: 'Aplicar el Checklist de Revisión',
        content: `Envía el código del Pull Request al modelo y valida sus sugerencias contra nuestro Checklist Corporativo. Recuerda que la IA suele inventar vulnerabilidades o sugerir refactors excesivos.`,
        requiredResources: ['checklist-code-review-asistido-ia'],
        outputs: ['Comentarios listos para GitHub/GitLab'],
        validationHints: ['Descarta sugerencias de "formato" (espacios, tabs). Enfócate en lógica y seguridad.']
      }
    ]
  }
];
