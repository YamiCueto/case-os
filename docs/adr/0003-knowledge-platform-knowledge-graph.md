# ADR 0003: Knowledge Platform - Knowledge Graph Architecture

## Contexto
El objetivo de la **Fase II** de CASE OS es evolucionar la plataforma de un simple orquestador de UI hacia un ecosistema de conocimiento unificado. Tradicionalmente, este tipo de problemas se resuelven implementando un **Search Engine** centralizado (por ejemplo, ElasticSearch o un motor RAG) que indexa los contenidos de la aplicación. 
Sin embargo, comenzar por un motor de búsqueda restringe la plataforma a un modelo basado puramente en queries y documentos aislados (árbol o lista plana). Para habilitar capacidades futuras avanzadas como un **Context Engine** y un **AI Provider Engine**, el sistema necesita comprender cómo las piezas de conocimiento se relacionan entre sí ("El curso A requiere el Prompt B", o "El Laboratorio C es recomendado por la Clase D").

## Decisión
Se decidió modelar la Knowledge Platform utilizando una arquitectura de **Knowledge Graph**, totalmente agnóstica de frameworks (sin Angular o RxJS) y compuesta por cuatro niveles de orquestación:

1. **KnowledgeNode:** La unidad fundamental e inmutable. En lugar de objetos de dominio, todo es un Nodo con `kind`, `metadata`, `capabilities` y `relations`.
2. **KnowledgeProvider:** El contrato de los Workspaces (ej. Academy, Library). Son dueños exclusivos del conocimiento y no delegan la verdad al Core.
3. **KnowledgeRegistry:** El orquestador central (único punto de entrada) que registra Providers y resuelve consultas sin indexar directamente la información.
4. **Knowledge Consumers:** Los motores (Search Engine, Context Engine, AI Engine) operarán exclusivamente sobre el Registry. El Search Engine ya no es el centro, es simplemente un consumidor más.

## Consecuencias

### Positivas
- **Cero Acoplamiento Horizontal:** Academy no necesita conocer Labs para que un AI Engine recomiende un Laboratorio al estudiar una lección de Academy.
- **Desarrollo Descentralizado:** Se pueden inyectar nuevos Workspaces o Providers (ej. un Provider RAG, un Provider estático) sin modificar el Core.
- **Preparación para IA:** Al exponer un modelo de grafo con semántica (`relations`, `capabilities`), el AI Engine tendrá contexto real, pasando de ser un "chat" a un "agente colaborativo".
- **Portabilidad:** Los contratos puros con `Promise` permiten ejecutar esta lógica en Web Workers, Servidores Node o Edge Functions.

### Negativas / Riesgos
- **Complejidad de Hidratación (Lazy Loading):** Al devolver DTOs (`SearchResult`) en lugar de datos completos, se introduce la necesidad de resolver asíncronamente los nodos cuando un motor necesita más contexto, requiriendo estrategias de caché eficientes en el futuro.
- **Abstracción Avanzada:** Exige un esfuerzo cognitivo inicial mayor para cualquier contribuidor nuevo al proyecto, quienes deben entender el paradigma de "todo es un nodo" en lugar del patrón tradicional de servicios CRUD.
