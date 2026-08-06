> [!WARNING]
> **Legacy Document:** Este documento pertenece a la etapa inicial del proyecto ('Curso IA Generativa') y no refleja la arquitectura actual de **CASE OS**.

# CASE Academy: Product Design Review & Backlog

## 1. Product Design Review

### 1. Â¿QuÃ© funcionalidades generan valor real para el estudiante?
El ingeniero de software valora la **inmediatez y la aplicabilidad**. El valor real no reside en consumir horas de video, sino en:
- **SoluciÃ³n de problemas en tiempo real:** Encontrar el prompt exacto o el patrÃ³n arquitectÃ³nico (ej. RAG con Spring Boot) en segundos.
- **Entornos seguros de experimentaciÃ³n (Labs):** Espacios donde puedan probar herramientas de IA sin configurar entornos locales complejos ni arriesgar datos del banco.
- **EstandarizaciÃ³n:** Entender *cÃ³mo* quiere el banco que se implemente la IA (Framework CASE), reduciendo la incertidumbre arquitectÃ³nica.

### 2. Â¿QuÃ© pantallas existen Ãºnicamente porque "se ven bien" pero no aportan aprendizaje?
- **Dashboards estÃ¡ticos o catÃ¡logos puros:** Un "Home" que solo es un menÃº glorificado aporta poco. Si el dashboard no sugiere la siguiente acciÃ³n, alerta sobre conceptos no dominados o provee acceso rÃ¡pido a herramientas diarias, es solo una pantalla de transiciÃ³n.
- **PÃ¡ginas de "PrÃ³ximamente" masivas:** Tener un roadmap visual es atractivo, pero generar secciones enteras (como Certificaciones o Laboratorios) sin contenido accionable genera fatiga y sensaciÃ³n de un producto incompleto.

### 3. Â¿QuÃ© funcionalidades usarÃ­a un estudiante todos los dÃ­as?
- **CASE Library:** Como motor de bÃºsqueda de snippets, arquitecturas y prompts verificados (el "StackOverflow interno" de GenIA).
- **AI Workspace:** Una interfaz integrada para probar prompts, formatear JSONs o generar tests usando el contexto del curso antes de llevarlo a su IDE.
- **Buscador Global (Omnibox):** Cmd+K / Ctrl+K para buscar cualquier concepto transversalmente en las 12 clases.

### 4. Â¿QuÃ© convertirÃ­a CASE Academy en una plataforma diferente a Udemy, Platzi o Coursera?
- **Enfoque "Job-to-be-done":** Plataformas como Udemy son pasivas (consumo de contenido). CASE Academy debe ser **activa** (herramienta de trabajo).
- **Contexto HÃ­per-Localizado:** Udemy enseÃ±a "Spring Boot con IA" genÃ©rico. CASE enseÃ±a "Spring Boot con IA adaptado a la infraestructura, seguridad y legacy (VB6) del banco".
- **FricciÃ³n Cero hacia la ImplementaciÃ³n:** Los conceptos se conectan directamente con herramientas del dÃ­a a dÃ­a (Stack BancoFiel) y guÃ­as de instalaciÃ³n directas.

### 5. Â¿QuÃ© herramientas utilizarÃ­a un Software Engineer mientras trabaja y no solamente mientras estudia?
- Repositorio colaborativo de Prompts.
- Evaluador de Prompts (Prompt Engineering Sandbox).
- GuÃ­as de migraciÃ³n y refactorizaciÃ³n interactivas.
- Generador de plantillas de arquitectura (ej. Serverless Angular / FastAPI).

---

## 2. Product Backlog (Priorizado)

### Ã‰pica 1 â€” CASE Library (Repositorio de Prompts y Patrones)
- **Objetivo:** Crear una biblioteca indexada, filtrable y copiable de Prompts, snippets de cÃ³digo y arquitecturas verificadas.
- **Problema que resuelve:** Los ingenieros pierden tiempo re-descubriendo los mejores prompts para refactorizar VB6 o generar tests en JUnit.
- **Usuario beneficiado:** Desarrolladores que necesitan soluciones en menos de 1 minuto durante su jornada.
- **MVP:** Un grid/lista de tarjetas filtrable por tags (Angular, VB6, Spring Boot) con un botÃ³n "Copy to Clipboard".
- **EvoluciÃ³n futura:** IntegraciÃ³n con IDEs o posibilidad de que la comunidad aporte sus propios prompts.
- **Prioridad:** Alta (Genera adopciÃ³n diaria).
- **Esfuerzo:** Medio (Infraestructura de datos y UI de bÃºsqueda).
- **Dependencias:** ConfiguraciÃ³n de datos estÃ¡ticos de los recursos.

### Ã‰pica 2 â€” Search (Omnibox & BÃºsqueda Global)
- **Objetivo:** Implementar una barra de bÃºsqueda rÃ¡pida (Ctrl+K) que navegue por clases, library, framework y labs.
- **Problema que resuelve:** La navegaciÃ³n basada en clics es lenta para un usuario experto que sabe exactamente quÃ© concepto estÃ¡ buscando.
- **Usuario beneficiado:** Todos los usuarios.
- **MVP:** Un modal invocado por atajo de teclado que filtre en memoria un Ã­ndice pregenerado de las clases y recursos.
- **EvoluciÃ³n futura:** BÃºsqueda semÃ¡ntica usando embeddings.
- **Prioridad:** Alta (Reduce drÃ¡sticamente el "Time to Value").
- **Esfuerzo:** Medio.
- **Dependencias:** Ninguna (puede alimentarse del `course.config.ts`).

### Ã‰pica 3 â€” Learning Experience (Clases interactivas)
- **Objetivo:** Evolucionar las 12 clases actuales (legacy) para que dejen de ser contenido estÃ¡tico y pasen a ser lecciones con componentes interactivos.
- **Problema que resuelve:** El consumo pasivo retiene menos conocimiento.
- **Usuario beneficiado:** Ingenieros en fase de aprendizaje primario.
- **MVP:** Reemplazar el layout actual de las clases con un componente lector de Markdown/JSON que soporte bloques de cÃ³digo copiables y advertencias contextuales.
- **EvoluciÃ³n futura:** Quizzes in-line, validaciÃ³n de cÃ³digo.
- **Prioridad:** Media-Alta (ModernizaciÃ³n del core).
- **Esfuerzo:** Alto (MigraciÃ³n de contenido legacy).
- **Dependencias:** Ninguna adicional a la foundation ya construida.

### Ã‰pica 4 â€” CASE Framework (Methodology)
- **Objetivo:** Digitalizar la metodologÃ­a, estÃ¡ndares y reglas de decisiÃ³n para usar IA en proyectos reales del banco.
- **Problema que resuelve:** Falta de gobierno y estandarizaciÃ³n. Los devs no saben *cuÃ¡ndo* estÃ¡ permitido usar IA y *cuÃ¡ndo* no.
- **Usuario beneficiado:** Arquitectos, Tech Leads y Desarrolladores Senior.
- **MVP:** DocumentaciÃ³n estructurada tipo "Playbook" con Ã¡rboles de decisiÃ³n simples.
- **EvoluciÃ³n futura:** Evaluador interactivo ("Asistente de Arquitectura").
- **Prioridad:** Media.
- **Esfuerzo:** Bajo (Principalmente maquetaciÃ³n de contenido).
- **Dependencias:** N/A.

### Ã‰pica 5 â€” Progress Tracking & Analytics
- **Objetivo:** Persistir el progreso real del estudiante y gamificar (sutilmente) el avance.
- **Problema que resuelve:** PÃ©rdida de contexto entre sesiones ("Â¿DÃ³nde me quedÃ©?") y falta de mÃ©tricas para Liderazgo.
- **Usuario beneficiado:** Estudiantes y Managers.
- **MVP:** Guardar el `UserProgress` en LocalStorage y reflejarlo en UI (barras de progreso, checkboxes en clases).
- **EvoluciÃ³n futura:** SincronizaciÃ³n con backend / LMS corporativo.
- **Prioridad:** Media.
- **Esfuerzo:** Bajo (ImplementaciÃ³n de LocalStorage sobre la interfaz existente).
- **Dependencias:** Finalizar la Ã‰pica 3 para saber exactamente cuÃ¡ndo una clase se marca "completada".

### Ã‰pica 6 â€” Labs (Sandboxes interactivos)
- **Objetivo:** Proveer entornos de prÃ¡ctica seguros sin salir de la plataforma.
- **Problema que resuelve:** La fricciÃ³n de instalar herramientas locales o gestionar credenciales API limita la experimentaciÃ³n.
- **Usuario beneficiado:** Todos los usuarios.
- **MVP:** Un entorno embebido (iframe o simulador mockeado) para interactuar con un LLM usando prompts predefinidos.
- **EvoluciÃ³n futura:** ConexiÃ³n real a la API de OpenAI/Azure a travÃ©s de un backend seguro.
- **Prioridad:** Baja (Para el MVP).
- **Esfuerzo:** Muy Alto.
- **Dependencias:** Backend seguro.

### Ã‰pica 7 â€” AI Workspace (Herramienta diaria)
- **Objetivo:** Proveer una utilidad dentro del SaaS donde el dev pueda pegar cÃ³digo legacy (ej. VB6) y aplicar los prompts de la Library en vivo.
- **Problema que resuelve:** Transforma el SaaS educativo en una herramienta de productividad diaria.
- **Usuario beneficiado:** Desarrolladores trabajando en proyectos activos.
- **MVP:** Interfaz de Chat/Editor aislada dentro de la plataforma conectada a un modelo bÃ¡sico.
- **EvoluciÃ³n futura:** IntegraciÃ³n de RAG con el cÃ³digo fuente del banco.
- **Prioridad:** Baja (A futuro).
- **Esfuerzo:** Muy Alto.
- **Dependencias:** Ã‰pica 6 (Infraestructura LLM).

---

## 3. Matriz de Impacto vs Esfuerzo

| Funcionalidad / Ã‰pica | Impacto | Esfuerzo | ClasificaciÃ³n |
| :--- | :--- | :--- | :--- |
| **Search (Omnibox)** | Alto | Medio | **Quick Win** / Alta prioridad |
| **CASE Library (Prompts)** | Alto | Medio | **Quick Win** / Alta prioridad |
| **Progress Tracking (Local)**| Medio | Bajo | **Quick Win** |
| **Learning Experience** | Alto | Alto | Proyecto Core |
| **CASE Framework** | Medio | Bajo | Mejora progresiva |
| **Labs** | Muy Alto | Muy Alto | Apuesta a largo plazo |
| **AI Workspace** | Muy Alto | Muy Alto | Apuesta a largo plazo |

---

## 4. Propuesta: Siguiente Ã‰pica a Implementar

**Se recomienda ejecutar la Ã‰pica 1: CASE Library**.

**JustificaciÃ³n:**
1. **Time-to-Value Inmediato:** Una biblioteca de Prompts (como un StackOverflow curado internamente) provee valor a un ingeniero *el mismo dÃ­a de su lanzamiento*.
2. **Mentalidad SaaS:** Transforma la percepciÃ³n del usuario de "estoy tomando un curso obligatorio" a "tengo una herramienta que me ahorra 2 horas al refactorizar cÃ³digo legado".
3. **Poco acoplamiento:** Se puede implementar en paralelo al contenido actual sin arriesgar el funcionamiento de las clases legacy.
4. **FÃ¡cil de alimentar:** Se puede inicializar con 20-30 prompts de alto impacto extraÃ­dos del propio temario del curso.