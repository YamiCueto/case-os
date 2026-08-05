# ADR 0001: Main Layout Shell

## Contexto
A medida que la aplicación crece e incorpora diferentes módulos (Library, Labs, Framework, Agents), se detecta duplicación de código en elementos de navegación y cabeceras, y el estado general de la experiencia (ej. Sidebars) no persiste si navegamos entre distintos submódulos de Angular cambiando de pantalla completa.

## Decisión
Se implementará un componente **MainLayoutComponent** que funcionará como un Shell o contenedor superior (Layout). 
- Será un contenedor **puramente presentacional** (sin lógica de negocio).
- Única responsabilidad: Orquestar un \`Sidebar\`, un \`Header\` y un \`RouterOutlet\`.
- Todas las rutas principales de la plataforma se configurarán como \`children\` de este \`MainLayoutComponent\`.

## Consecuencias Positivas
- Componentización real de la navegación (Sidebar y Header compartidos transversalmente).
- Navegación instantánea (sin parpadeos del frame principal) al saltar entre módulos (ej. de Library a Labs).
- Centralización del estado de IU persistente (ej. Modo oscuro, estado colapsado del menú lateral).

## Consecuencias Negativas
- Mayor anidación en el \`app.routes.ts\`.
- Será necesario refactorizar la vista interna de las páginas para que no asuman el control total del \`height\` y \`width\` de la pantalla (el Shell determinará sus límites).
