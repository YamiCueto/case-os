# ADR 0004: Knowledge Registry - Provider Orchestration

## Contexto
Siguiendo la decisión de implementar un Knowledge Graph (ADR-0003), es imperativo centralizar el acceso a dicho ecosistema.
Sin embargo, un antipatrón común en plataformas de búsqueda y conocimiento es acoplar la recolección de datos (los `Providers`) con el procesamiento algorítmico (el `SearchEngine` o `RelevanceEngine`). Si un mismo componente registra los repositorios y además calcula el score y genera embeddings, el sistema se vuelve rígido y acoplado a un caso de uso particular (ej. búsqueda de texto libre).

## Decisión
Se decidió implementar el `KnowledgeRegistry` exclusivamente como un **coordinador** o directorio telefónico, siguiendo el patrón arquitectónico fundacional de CASE OS (`Contracts -> Registries -> Engines -> Presentation`).

El `KnowledgeRegistry`:
- **NO busca.**
- **NO indexa.**
- **NO calcula scores.**
- **NO genera embeddings.**
- Únicamente registra, gestiona el ciclo de vida (register, unregister, replace) y devuelve instancias de `KnowledgeProvider`.

Todo Engine consumidor (Search Engine, Context Engine, AI Provider Engine, Recommendation Engine) interactuará únicamente con el Registry para obtener los Providers y, a partir de ellos, ejecutar su lógica algorítmica específica.

Además, el núcleo del `KnowledgeRegistry` es implementado en **TypeScript puro**, totalmente agnóstico de frameworks (sin Angular o RxJS). Para la integración con CASE OS, se emplea un `KnowledgeRegistryAdapter` (`@Injectable`), asegurando que el Core pueda portarse intacto a Node.js o Web Workers.

## Consecuencias

### Positivas
- **Responsabilidad Única (SRP):** El Registry nunca cambiará si el algoritmo de búsqueda de texto cambia por búsqueda semántica (vectores).
- **Extensibilidad Inifinita:** El AI Engine podrá inyectarse al Registry para extraer el grafo de conocimiento independientemente del Search Engine.
- **Tolerancia a Fallos Descentralizada:** Los engines consumidores (ej. SearchEngine usando `Promise.allSettled()`) controlarán cómo manejar la falla de un Provider específico en lugar de que el Registry oculte o rompa toda la cadena.
- **Pureza de Dominio:** El modelo es reutilizable en cualquier entorno de ejecución de JavaScript.

### Negativas / Riesgos
- **Orquestación Delegada:** Obliga a los desarrolladores de Engines (Search, Context) a iterar sobre los Providers y paralelizar llamadas (`Promise.allSettled`) en lugar de llamar a un simple `registry.search()`.
- **Sobrecarga de Abstracción:** Exige mantener Adapters por cada entorno donde se quiera inyectar el Registry (ej. Angular Adapter, NestJS Adapter).
