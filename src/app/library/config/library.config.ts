import { KnowledgeResource } from '../../core/models/knowledge.models';

const NOW = new Date().toISOString();

export const LIBRARY_CONFIG: KnowledgeResource[] = [
  {
    id: 'res-001',
    slug: 'migracion-vb6-spring-boot',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Team',
    type: 'PROMPT',
    title: 'Migración VB6 a Spring Boot REST API',
    description: 'Prompt especializado para convertir lógica legacy escrita en Visual Basic 6 a controladores y servicios de Spring Boot 3.',
    difficulty: 'ADVANCED',
    technologies: ['VB6', 'Spring Boot', 'Java'],
    tags: ['Migración', 'Legacy', 'Refactoring'],
    keywords: ['legacy', 'visual basic', 'rest', 'api', 'modernization'],
    content: `Actúa como un Principal Software Engineer experto en modernización de sistemas legacy.

Tu objetivo es migrar el siguiente bloque de código Visual Basic 6 a una estructura RESTful moderna utilizando Java 21 y Spring Boot 3.

**Reglas de migración:**
1. Genera un \`@RestController\` para la exposición del endpoint.
2. Genera un \`@Service\` donde residirá la lógica de negocio.
3. Transforma los \`Recordset\` o accesos directos a BD en consultas JPA/Hibernate o \`JdbcTemplate\` según consideres óptimo.
4. Aplica manejo de excepciones moderno usando \`@ControllerAdvice\`.
5. Comenta cualquier lógica de VB6 (como \`On Error GoTo\`) explicando cómo se maneja en el nuevo paradigma.

**Código VB6 original:**
\`\`\`vb
[INSERTA TU CÓDIGO VB6 AQUÍ]
\`\`\`

Proporciona únicamente el código Java resultante y una breve explicación de las decisiones arquitectónicas tomadas.`
  },
  {
    id: 'res-002',
    slug: 'generacion-tests-unitarios-junit5',
    version: '1.1.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE QA Team',
    type: 'PROMPT',
    title: 'Generación de Tests Unitarios (JUnit 5 + Mockito)',
    description: 'Prompt estructurado para generar tests unitarios exhaustivos asegurando casos de borde, mocks correctos y alta cobertura.',
    difficulty: 'INTERMEDIATE',
    technologies: ['Java', 'JUnit 5', 'Mockito'],
    tags: ['Testing', 'TDD'],
    keywords: ['unit tests', 'pruebas unitarias', 'mocking', 'cobertura'],
    content: `Actúa como un QA Automation Engineer experto en TDD.

Analiza la siguiente clase Java y genera las pruebas unitarias correspondientes utilizando **JUnit 5** y **Mockito**.

**Requisitos para los tests:**
1. Sigue la estructura \`Given-When-Then\` (Arrange, Act, Assert).
2. Crea tests para el "Happy Path".
3. Crea tests para al menos 3 casos de borde o manejo de errores (ej. nulls, excepciones lanzadas por dependencias).
4. Utiliza \`@InjectMocks\` y \`@Mock\` adecuadamente.
5. Usa \`assertThrows\` para validar las excepciones.

**Clase a testear:**
\`\`\`java
[INSERTA TU CÓDIGO JAVA AQUÍ]
\`\`\`

Devuelve la clase de prueba lista para ser ejecutada.`
  },
  {
    id: 'res-003',
    slug: 'analisis-documentacion-stored-procedures',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Data Team',
    type: 'PROMPT',
    title: 'Análisis y Documentación de Stored Procedures',
    description: 'Instrucción para que el LLM lea un SP complejo (SQL Server / Oracle) y extraiga sus reglas de negocio en un formato legible para analistas.',
    difficulty: 'ADVANCED',
    technologies: ['SQL', 'Transact-SQL', 'PL/SQL'],
    tags: ['Documentación', 'Bases de Datos'],
    content: `Actúa como un Data Architect y Analista Funcional.

Analiza el siguiente Stored Procedure y extrae la documentación funcional y técnica. 
El objetivo es que un programador que no conoce SQL pueda entender las reglas de negocio que implementa para poder migrarlas a un microservicio.

**Entregables esperados:**
1. **Propósito general:** Un párrafo describiendo qué hace el SP.
2. **Entradas y Salidas:** Lista de parámetros (IN/OUT) y qué representan.
3. **Reglas de Negocio:** Una lista en viñetas detallando la lógica condicional (IF/ELSE, CASE) en lenguaje natural (ej. "Si el cliente tiene estado Inactivo, se rechaza la transacción").
4. **Tablas Afectadas:** Qué tablas reciben INSERT, UPDATE o DELETE.

**Stored Procedure:**
\`\`\`sql
[INSERTA TU SCRIPT SQL AQUÍ]
\`\`\`
`
  },
  {
    id: 'res-004',
    slug: 'scripts-migracion-flyway-plantilla',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE DevOps Team',
    type: 'TEMPLATE',
    title: 'Scripts de Migración Flyway (Plantilla)',
    description: 'Plantilla de prompt para traducir scripts DDL tradicionales a formatos versionados de Flyway respetando convenciones corporativas.',
    difficulty: 'BEGINNER',
    technologies: ['Flyway', 'SQL', 'Spring Boot'],
    tags: ['Bases de Datos', 'CI/CD'],
    content: `Transforma el siguiente script DDL (Creación/Modificación de tablas) en un script compatible con **Flyway**.

**Reglas:**
1. Nombra el archivo siguiendo la convención \`V[VERSION]__[DESCRIPCION].sql\`. Sugiere un nombre apropiado.
2. Asegúrate de incluir sentencias condicionales si es posible (ej. \`IF NOT EXISTS\`) aunque Flyway ya gestione el estado.
3. Si el script original contiene sentencias no soportadas en migraciones automáticas, indícalo.

**Script original:**
\`\`\`sql
[INSERTA TU SCRIPT AQUÍ]
\`\`\`
`
  },
  {
    id: 'res-005',
    slug: 'generador-especificacion-openapi-swagger',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Team',
    type: 'PROMPT',
    title: 'Generador de Especificación OpenAPI (Swagger)',
    description: 'Prompt para deducir y generar la especificación OpenAPI v3 a partir del código de un controlador o de una descripción funcional.',
    difficulty: 'INTERMEDIATE',
    technologies: ['OpenAPI', 'Swagger', 'YAML'],
    tags: ['API', 'Documentación'],
    content: `Actúa como un API Designer.

Genera una especificación **OpenAPI 3.0.x** en formato YAML basada en la descripción o el código de los endpoints que te proporciono a continuación.

**Requisitos:**
1. Define los esquemas (Schemas) en la sección \`components/schemas\` de forma modular.
2. Incluye códigos de respuesta exitosos (200, 201) y errores estándar (400, 401, 404, 500).
3. Añade descripciones claras (summary y description) para cada endpoint y propiedad.
4. Define la seguridad (ej. Bearer Token) si aplica.

**Contexto del API:**
\`\`\`text
[INSERTA LA DESCRIPCIÓN DE TUS ENDPOINTS O CÓDIGO DEL CONTROLLER AQUÍ]
\`\`\`
`
  },
  {
    id: 'res-006',
    slug: 'arquitectura-hexagonal-spring-boot',
    version: '2.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Architecture Board',
    type: 'ARCHITECTURE',
    title: 'Arquitectura Hexagonal en Spring Boot',
    description: 'Guía y estructura de carpetas sugerida para implementar Arquitectura Hexagonal (Ports and Adapters) en microservicios Java.',
    difficulty: 'EXPERT',
    technologies: ['Spring Boot', 'Java'],
    tags: ['Arquitectura', 'Clean Code'],
    aliases: ['Clean Architecture', 'Ports and Adapters'],
    content: `# Arquitectura Hexagonal en Spring Boot

La arquitectura hexagonal separa el dominio (lógica de negocio) de las dependencias externas (bases de datos, APIs web, mensajería).

## Estructura de Paquetes Recomendada

\`\`\`text
com.bancofiel.microservicio
├── domain
│   ├── model       (Entidades puras sin anotaciones de JPA)
│   ├── repository  (Puertos de Salida - Interfaces)
│   └── service     (Lógica de negocio, implementa Puertos de Entrada)
├── application
│   └── port
│       └── in      (Puertos de Entrada - Interfaces de casos de uso)
├── infrastructure
│   ├── adapter
│   │   ├── in
│   │   │   └── web (Controladores REST)
│   │   └── out
│   │       ├── db  (Implementación de repositorios, entidades JPA)
│   │       └── api (Clientes Feign/WebClient)
│   └── config      (Configuraciones de Spring, inyección de dependencias)
\`\`\`

## Principios Clave:
1. **El dominio no conoce a Spring:** Evita anotaciones como \`@Service\` o \`@Entity\` dentro de la carpeta \`domain\`.
2. **Inversión de Dependencias:** La infraestructura depende del dominio, nunca al revés.
3. **Mapeo Explícito:** Los datos que entran por los controladores deben mapearse a objetos de dominio antes de pasar al servicio. Los objetos de dominio deben mapearse a entidades JPA antes de guardarse.`
  },
  {
    id: 'res-007',
    slug: 'checklist-code-review-asistido-ia',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE QA Team',
    type: 'CHECKLIST',
    title: 'Checklist: Code Review Asistido por IA',
    description: 'Puntos clave a considerar cuando se utiliza un LLM para realizar un Code Review de un Pull Request.',
    difficulty: 'BEGINNER',
    technologies: ['Git', 'GitHub', 'GitLab'],
    tags: ['Code Review', 'Calidad'],
    content: `# Checklist para Code Review con IA

Cuando utilices GenAI para analizar un Pull Request, asegúrate de validar los siguientes aspectos:

- [ ] **Contexto inyectado:** ¿Le proporcionaste al LLM las reglas de estilo de tu equipo (linting, convenciones)?
- [ ] **Falsos positivos:** ¿Verificaste si las "vulnerabilidades" detectadas por la IA aplican a tu entorno real? (Las IAs suelen alucinar riesgos de seguridad que tu framework ya mitiga).
- [ ] **Lógica de negocio:** La IA es excelente para sintaxis, pero mala para contexto de negocio no explicitado. Revisa la lógica funcional manualmente.
- [ ] **Testing:** ¿Surgió alguna recomendación de prueba que falte? (Pide a la IA: *"¿Qué test unitario falta en este PR?"*).
- [ ] **Complejidad Ciclomática:** ¿La sugerencia de refactorización de la IA hace el código más legible o simplemente más "inteligente" e incomprensible?

**Prompt recomendado para Code Review:**
> "Actúa como un Senior Reviewer. Revisa el siguiente diff de código. Enfócate en: 1) Posibles NullPointerExceptions, 2) Fugas de memoria o conexiones no cerradas, 3) Violaciones a principios SOLID. No me des correcciones de estilo (espacios/tabs)."`
  },
  {
    id: 'res-008',
    slug: 'context-engineering-roles-personas',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Team',
    type: 'CONTEXT',
    title: 'Context Engineering: Roles y Personas',
    description: 'Plantillas de inicialización (System Prompts) para asignar roles efectivos a la IA según la tarea técnica.',
    difficulty: 'INTERMEDIATE',
    technologies: ['LLMs', 'Prompt Engineering'],
    tags: ['Contexto', 'Productividad'],
    content: `El secreto para obtener buen código de un LLM es asignar el rol correcto y las restricciones adecuadas desde el primer mensaje (System Prompt).

### 1. El Refactorizador Crítico
> "Actúa como un Staff Software Engineer obsesionado con el Clean Code y el rendimiento. Tu trabajo no es escribir código nuevo, sino criticar y refactorizar el código que te proporciono. Debes aplicar patrones de diseño de GoF si es apropiado, y reducir la complejidad ciclomática al mínimo."

### 2. El Experto en Seguridad (DevSecOps)
> "Actúa como un Ingeniero de Seguridad (DevSecOps) analizando código para una aplicación bancaria de Nivel 1. Busca específicamente vulnerabilidades de inyección (SQL, NoSQL, XSS), problemas de autenticación rota y exposición de datos sensibles. Devuelve el resultado en formato de reporte de auditoría."

### 3. El Explicador (Para Onboarding)
> "Actúa como un Mentor Técnico empático. Explícame el siguiente bloque de código paso a paso, como si yo fuera un desarrollador Junior que se acaba de unir al equipo. Usa analogías del mundo real si ayudan a entender conceptos abstractos."`
  }
];
