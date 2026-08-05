# CASE Academy: Product Design Review & Backlog

## 1. Product Design Review

### 1. ¿Qué funcionalidades generan valor real para el estudiante?
El ingeniero de software valora la **inmediatez y la aplicabilidad**. El valor real no reside en consumir horas de video, sino en:
- **Solución de problemas en tiempo real:** Encontrar el prompt exacto o el patrón arquitectónico (ej. RAG con Spring Boot) en segundos.
- **Entornos seguros de experimentación (Labs):** Espacios donde puedan probar herramientas de IA sin configurar entornos locales complejos ni arriesgar datos del banco.
- **Estandarización:** Entender *cómo* quiere el banco que se implemente la IA (Framework CASE), reduciendo la incertidumbre arquitectónica.

### 2. ¿Qué pantallas existen únicamente porque "se ven bien" pero no aportan aprendizaje?
- **Dashboards estáticos o catálogos puros:** Un "Home" que solo es un menú glorificado aporta poco. Si el dashboard no sugiere la siguiente acción, alerta sobre conceptos no dominados o provee acceso rápido a herramientas diarias, es solo una pantalla de transición.
- **Páginas de "Próximamente" masivas:** Tener un roadmap visual es atractivo, pero generar secciones enteras (como Certificaciones o Laboratorios) sin contenido accionable genera fatiga y sensación de un producto incompleto.

### 3. ¿Qué funcionalidades usaría un estudiante todos los días?
- **CASE Library:** Como motor de búsqueda de snippets, arquitecturas y prompts verificados (el "StackOverflow interno" de GenIA).
- **AI Workspace:** Una interfaz integrada para probar prompts, formatear JSONs o generar tests usando el contexto del curso antes de llevarlo a su IDE.
- **Buscador Global (Omnibox):** Cmd+K / Ctrl+K para buscar cualquier concepto transversalmente en las 12 clases.

### 4. ¿Qué convertiría CASE Academy en una plataforma diferente a Udemy, Platzi o Coursera?
- **Enfoque "Job-to-be-done":** Plataformas como Udemy son pasivas (consumo de contenido). CASE Academy debe ser **activa** (herramienta de trabajo).
- **Contexto Híper-Localizado:** Udemy enseña "Spring Boot con IA" genérico. CASE enseña "Spring Boot con IA adaptado a la infraestructura, seguridad y legacy (VB6) del banco".
- **Fricción Cero hacia la Implementación:** Los conceptos se conectan directamente con herramientas del día a día (Stack BancoFiel) y guías de instalación directas.

### 5. ¿Qué herramientas utilizaría un Software Engineer mientras trabaja y no solamente mientras estudia?
- Repositorio colaborativo de Prompts.
- Evaluador de Prompts (Prompt Engineering Sandbox).
- Guías de migración y refactorización interactivas.
- Generador de plantillas de arquitectura (ej. Serverless Angular / FastAPI).

---

## 2. Product Backlog (Priorizado)

### Épica 1 — CASE Library (Repositorio de Prompts y Patrones)
- **Objetivo:** Crear una biblioteca indexada, filtrable y copiable de Prompts, snippets de código y arquitecturas verificadas.
- **Problema que resuelve:** Los ingenieros pierden tiempo re-descubriendo los mejores prompts para refactorizar VB6 o generar tests en JUnit.
- **Usuario beneficiado:** Desarrolladores que necesitan soluciones en menos de 1 minuto durante su jornada.
- **MVP:** Un grid/lista de tarjetas filtrable por tags (Angular, VB6, Spring Boot) con un botón "Copy to Clipboard".
- **Evolución futura:** Integración con IDEs o posibilidad de que la comunidad aporte sus propios prompts.
- **Prioridad:** Alta (Genera adopción diaria).
- **Esfuerzo:** Medio (Infraestructura de datos y UI de búsqueda).
- **Dependencias:** Configuración de datos estáticos de los recursos.

### Épica 2 — Search (Omnibox & Búsqueda Global)
- **Objetivo:** Implementar una barra de búsqueda rápida (Ctrl+K) que navegue por clases, library, framework y labs.
- **Problema que resuelve:** La navegación basada en clics es lenta para un usuario experto que sabe exactamente qué concepto está buscando.
- **Usuario beneficiado:** Todos los usuarios.
- **MVP:** Un modal invocado por atajo de teclado que filtre en memoria un índice pregenerado de las clases y recursos.
- **Evolución futura:** Búsqueda semántica usando embeddings.
- **Prioridad:** Alta (Reduce drásticamente el "Time to Value").
- **Esfuerzo:** Medio.
- **Dependencias:** Ninguna (puede alimentarse del `course.config.ts`).

### Épica 3 — Learning Experience (Clases interactivas)
- **Objetivo:** Evolucionar las 12 clases actuales (legacy) para que dejen de ser contenido estático y pasen a ser lecciones con componentes interactivos.
- **Problema que resuelve:** El consumo pasivo retiene menos conocimiento.
- **Usuario beneficiado:** Ingenieros en fase de aprendizaje primario.
- **MVP:** Reemplazar el layout actual de las clases con un componente lector de Markdown/JSON que soporte bloques de código copiables y advertencias contextuales.
- **Evolución futura:** Quizzes in-line, validación de código.
- **Prioridad:** Media-Alta (Modernización del core).
- **Esfuerzo:** Alto (Migración de contenido legacy).
- **Dependencias:** Ninguna adicional a la foundation ya construida.

### Épica 4 — CASE Framework (Methodology)
- **Objetivo:** Digitalizar la metodología, estándares y reglas de decisión para usar IA en proyectos reales del banco.
- **Problema que resuelve:** Falta de gobierno y estandarización. Los devs no saben *cuándo* está permitido usar IA y *cuándo* no.
- **Usuario beneficiado:** Arquitectos, Tech Leads y Desarrolladores Senior.
- **MVP:** Documentación estructurada tipo "Playbook" con árboles de decisión simples.
- **Evolución futura:** Evaluador interactivo ("Asistente de Arquitectura").
- **Prioridad:** Media.
- **Esfuerzo:** Bajo (Principalmente maquetación de contenido).
- **Dependencias:** N/A.

### Épica 5 — Progress Tracking & Analytics
- **Objetivo:** Persistir el progreso real del estudiante y gamificar (sutilmente) el avance.
- **Problema que resuelve:** Pérdida de contexto entre sesiones ("¿Dónde me quedé?") y falta de métricas para Liderazgo.
- **Usuario beneficiado:** Estudiantes y Managers.
- **MVP:** Guardar el `UserProgress` en LocalStorage y reflejarlo en UI (barras de progreso, checkboxes en clases).
- **Evolución futura:** Sincronización con backend / LMS corporativo.
- **Prioridad:** Media.
- **Esfuerzo:** Bajo (Implementación de LocalStorage sobre la interfaz existente).
- **Dependencias:** Finalizar la Épica 3 para saber exactamente cuándo una clase se marca "completada".

### Épica 6 — Labs (Sandboxes interactivos)
- **Objetivo:** Proveer entornos de práctica seguros sin salir de la plataforma.
- **Problema que resuelve:** La fricción de instalar herramientas locales o gestionar credenciales API limita la experimentación.
- **Usuario beneficiado:** Todos los usuarios.
- **MVP:** Un entorno embebido (iframe o simulador mockeado) para interactuar con un LLM usando prompts predefinidos.
- **Evolución futura:** Conexión real a la API de OpenAI/Azure a través de un backend seguro.
- **Prioridad:** Baja (Para el MVP).
- **Esfuerzo:** Muy Alto.
- **Dependencias:** Backend seguro.

### Épica 7 — AI Workspace (Herramienta diaria)
- **Objetivo:** Proveer una utilidad dentro del SaaS donde el dev pueda pegar código legacy (ej. VB6) y aplicar los prompts de la Library en vivo.
- **Problema que resuelve:** Transforma el SaaS educativo en una herramienta de productividad diaria.
- **Usuario beneficiado:** Desarrolladores trabajando en proyectos activos.
- **MVP:** Interfaz de Chat/Editor aislada dentro de la plataforma conectada a un modelo básico.
- **Evolución futura:** Integración de RAG con el código fuente del banco.
- **Prioridad:** Baja (A futuro).
- **Esfuerzo:** Muy Alto.
- **Dependencias:** Épica 6 (Infraestructura LLM).

---

## 3. Matriz de Impacto vs Esfuerzo

| Funcionalidad / Épica | Impacto | Esfuerzo | Clasificación |
| :--- | :--- | :--- | :--- |
| **Search (Omnibox)** | Alto | Medio | **Quick Win** / Alta prioridad |
| **CASE Library (Prompts)** | Alto | Medio | **Quick Win** / Alta prioridad |
| **Progress Tracking (Local)**| Medio | Bajo | **Quick Win** |
| **Learning Experience** | Alto | Alto | Proyecto Core |
| **CASE Framework** | Medio | Bajo | Mejora progresiva |
| **Labs** | Muy Alto | Muy Alto | Apuesta a largo plazo |
| **AI Workspace** | Muy Alto | Muy Alto | Apuesta a largo plazo |

---

## 4. Propuesta: Siguiente Épica a Implementar

**Se recomienda ejecutar la Épica 1: CASE Library**.

**Justificación:**
1. **Time-to-Value Inmediato:** Una biblioteca de Prompts (como un StackOverflow curado internamente) provee valor a un ingeniero *el mismo día de su lanzamiento*.
2. **Mentalidad SaaS:** Transforma la percepción del usuario de "estoy tomando un curso obligatorio" a "tengo una herramienta que me ahorra 2 horas al refactorizar código legado".
3. **Poco acoplamiento:** Se puede implementar en paralelo al contenido actual sin arriesgar el funcionamiento de las clases legacy.
4. **Fácil de alimentar:** Se puede inicializar con 20-30 prompts de alto impacto extraídos del propio temario del curso.
