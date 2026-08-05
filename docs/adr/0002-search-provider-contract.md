# ADR 0002: Search Provider Contract

## Contexto
Actualmente, el sistema soporta la búsqueda de recursos estáticos en la Library a través de un \`SearchEngine\`. Con la incorporación de los \`Labs\` y otros módulos futuros, requerimos una caja de búsqueda global (Omnibox). Inicialmente, la idea era que el \`GlobalSearchService\` importara y ejecutara consultas contra \`LibraryService\` y \`LabService\`.

## Decisión
Se descarta la dependencia directa entre servicios de negocio. Se establece un contrato de inversión de dependencias a través de una interfaz \`SearchProvider\`.
- Cualquier módulo que desee ser buscable debe inyectar (proveer) una implementación de \`SearchProvider\`.
- El \`GlobalSearchService\` simplemente itera sobre todos los proveedores inyectados (\`@Inject(SEARCH_PROVIDERS)\`) y unifica los resultados bajo una misma interfaz \`SearchResult\`.

## Consecuencias Positivas
- Desacoplamiento extremo: El buscador global no tiene conocimiento de la existencia de Labs o Library.
- Fácil extensibilidad: Si mañana se lanza "Agents", solo deben registrar su \`AgentSearchProvider\` sin tocar el buscador global.
- Cumple el principio Abierto/Cerrado (OCP de SOLID).

## Consecuencias Negativas
- Aumento de la complejidad en la configuración de dependencias (uso de \`InjectionToken\` multiplataforma en Angular).
- Los resultados deben someterse a normalización, perdiendo campos altamente específicos durante la vista resumen de búsqueda.
