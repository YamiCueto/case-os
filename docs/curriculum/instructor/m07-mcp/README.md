# Module 07: Model Context Protocol (MCP)

## MODULE BRIEF

**Purpose**
Enseñar cómo estandarizar la conectividad entre sistemas probabilísticos (IA) y fuentes de datos deterministas (Corporativas) usando el Model Context Protocol (MCP). Desmitificar la integración ad-hoc mostrando que MCP es el "USB-C" para las aplicaciones de Inteligencia Artificial.

**Prerequisites**
Módulo 05 (AI Agents) y Módulo 06 (Agentic SWE). El estudiante ya sabe que un agente necesita herramientas, y que un LLM puede proponer ejecutar herramientas en un IDE. Ahora responderemos la pregunta: *"¿Cómo le doy a ese LLM acceso seguro a la base de datos MySQL de mi empresa sin reescribir la integración para cada IA nueva que salga?"*

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Articular el problema de integración $N \times M$ y por qué los estándares abiertos (como LSP y MCP) son la única solución escalable.
- Diferenciar los roles arquitectónicos de `Host`, `Client` y `Server` dentro del ecosistema MCP.
- Distinguir entre las primitivas de MCP: `Resources` (lectura estática) vs `Tools` (ejecución con efectos secundarios).
- Diseñar un Servidor MCP que aplique el principio de *Least Privilege* (Mínimo Privilegio) como frontera de seguridad.

**Suggested duration**
2 horas teóricas + 1.5 horas de Real Engineering Lab.

**Teaching strategy**
El enfoque debe ser 100% arquitectura de sistemas y seguridad. Un Servidor MCP no es "magia de IA", es simplemente un puente (middleware) con contratos tipados. El instructor debe insistir en la regla **Never Trust the Client**: el Servidor MCP debe proteger la base de datos subyacente asumiendo que cualquier agente LLM que haga la petición puede estar alucinando o comprometido por un *prompt injection*.

**Concept dependencies**
- **Context Assembly (M03 y M06)**: MCP Resources permite inyectar contexto de orígenes externos al IDE.
- **Tool Contracts (M05)**: MCP Tools estandariza el JSON Schema de las herramientas que estudiamos en M05.

**Curriculum Components**
- [Lesson 01: The N x M Problem](./lesson-01.md)
- [Lesson 02: MCP Architecture](./lesson-02.md)
- [Lesson 03: Primitives](./lesson-03.md)
- [Demo 07: The Universal Connector](./demo-07.md)
- [Lab 07: Map a Legacy Integration to MCP](./lab-07.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "Cambiamos el eje: dejamos de centrarnos en cómo trabaja el agente y empezamos a enseñar cómo el agente se conecta de forma estandarizada y segura con capacidades externas."
La IA produce el cambio o la intención; pero la responsabilidad de limitar el acceso, verificar la seguridad y aceptar el cambio pertenece a tu arquitectura clásica.

**El Caso de Estudio Principal (MySQL Local CFA)**
A lo largo de las demostraciones y el Lab, anclaremos la teoría en un escenario realista: exponer una base de datos MySQL corporativa local (ej. CFA - Core Financial App) a un Agente de IA. Convertiremos algo abstracto en un diseño tangible: `MySQL → Capacidad → MCP Resource/Tool → Contrato JSON → Least Privilege → HITL → Failure Recovery`.

**Common misconceptions (Errores comunes de estudiantes)**
- *“MCP es un framework de LLMs como LangChain.”* (Falso: MCP es un protocolo de transporte de mensajes estandarizado, agnóstico al modelo, similar a HTTP o LSP).
- *“El Servidor MCP se conecta a OpenAI.”* (Falso: El Servidor MCP solo expone capacidades a un Client local; es el Host (ej. Cursor/Claude Desktop) quien habla con el proveedor de IA).
- *“Si uso MCP, ya no necesito preocuparme por inyecciones SQL porque es seguro.”* (Falso y peligroso: MCP estandariza el transporte; la sanitización de inputs sigue siendo responsabilidad absoluta del desarrollador del Servidor MCP).

**Module transition (Hacia M08)**
Cierre vital para el arco narrativo del curso: 
> "Ahora tenemos Agentes de IA (M05) que pueden generar código en nuestro entorno (M06) e interactuar con nuestras bases de datos locales usando MCP (M07). Todo funciona increíblemente en la laptop del desarrollador. Pero, ¿qué pasa el viernes por la tarde cuando intentamos desplegar todo esto a Producción? M08 es donde la IA Generativa choca con la realidad del mundo empresarial: Compliance, SLAs, MLOps y Despliegues."
