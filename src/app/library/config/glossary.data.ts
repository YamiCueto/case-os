import { KnowledgeResource } from '../../core/models/knowledge.models';

const NOW = '2026-09-17T00:00:00.000Z';

/**
 * Catálogo canónico de conceptos y terminología de CASE Academy (M01–M05).
 * Alimentador principal de la proyección /library/glossary y motor de descubrimiento cruzado.
 */
export const GLOSSARY_RESOURCES: KnowledgeResource[] = [
  // =========================================================================
  // MÓDULO 01 — FUNDAMENTOS DE IA
  // =========================================================================
  {
    id: 'term-software-determinista',
    slug: 'software-determinista',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Software Determinista',
    description: 'Software tradicional basado en reglas explícitas (if/else) donde la misma entrada siempre produce exactamente la misma salida reproducible.',
    content: `### Software Determinista vs. Modelos Probabilísticos

En la ingeniería de software tradicional, escribimos reglas explícitas con ramificaciones estrictas (\`if / else\`). Para una misma entrada, el sistema siempre produce exactamente la misma salida sin variación.

#### Características Clave:
- **Lógica explícita:** Diseñada, escrita y depurada directamente por humanos.
- **Reproducibilidad:** 100% predecible y verificable con tests unitarios estándar.
- **Frontera de uso:** Toda lógica financiera, cálculos de saldo, autorizaciones transaccionales y validaciones de esquema deben permanecer deterministas.`,
    technologies: ['Software Engineering', 'Logic'],
    tags: ['M01', 'Fundamentos', 'Determinismo'],
    keywords: ['determinismo', 'reglas', 'if else', 'lógica clásica', 'predictibilidad'],
    aliases: ['Lógica Clásica', 'Sistema Determinista'],
    relatedIds: ['term-modelo-probabilistico', 'term-modelo-crudo-vs-sistema'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c1',
      lessonTitle: 'Lección 01 — De Código a Probabilidad',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad'
    }
  },
  {
    id: 'term-modelo-probabilistico',
    slug: 'modelo-probabilistico',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Modelo Probabilístico (LLM)',
    description: 'Motor estadístico entrenado que predice la distribución de probabilidad del siguiente token basándose en pesos vectoriales, sin ejecutar reglas lógicas fijas.',
    content: `### Modelos Probabilísticos (LLMs)

Un Large Language Model (LLM) no ejecuta código ni reglas de negocio. Su única función matemática fundamental es calcular qué token es más probable que continúe una secuencia de texto dada.

#### Principio Fundamental:
- **No es una base de datos indexada:** No "sabe" qué es cierto en términos factuales; predice continuaciones estadísticamente verosímiles a partir de sus datos de entrenamiento.
- **Salidas adaptativas:** Puede generar respuestas diferentes ante el mismo prompt según los parámetros de muestreo (\`temperature\`).
- **Enfoque CASE:** La ingeniería de software moderna consiste en envolver estos motores estadísticos en exoesqueletos de software determinista.`,
    technologies: ['LLM', 'AI', 'Transformers'],
    tags: ['M01', 'Fundamentos', 'Probabilidad'],
    keywords: ['probabilidad', 'estadística', 'pesos', 'red neuronal', 'generación'],
    aliases: ['LLM', 'Large Language Model', 'Modelo Estadístico'],
    relatedIds: ['term-software-determinista', 'term-token', 'term-inferencia'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c1',
      lessonTitle: 'Lección 01 — De Código a Probabilidad',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad'
    }
  },
  {
    id: 'term-entrenamiento',
    slug: 'entrenamiento-training',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Entrenamiento (Training)',
    description: 'Fase de creación donde el modelo procesa terabytes de texto y ajusta billones de parámetros matemáticos, generando un archivo binario inmutable con fecha de corte.',
    content: `### Entrenamiento (Training)

Fase computacionalmente intensiva donde la red neuronal aprende patrones, gramática, razonamiento y conocimiento general ajustando los valores de sus parámetros (pesos).

#### Propiedades Críticas para el Ingeniero:
- **Inmutabilidad:** Produce un artefacto congelado. El modelo en producción no aprende ni retiene datos de las consultas que recibe.
- **Fecha de corte (Knowledge Cutoff):** Desconoce eventos o código posterior a su ventana de entrenamiento.
- **Inyección de conocimiento fresco:** No se logra reentrenando el modelo en el día a día, sino inyectando contexto en tiempo de ejecución (RAG / Context Engineering).`,
    technologies: ['Machine Learning', 'GPUs'],
    tags: ['M01', 'Fundamentos', 'Training'],
    keywords: ['training', 'pesos', 'backpropagation', 'dataset', 'cutoff'],
    aliases: ['Training', 'Pre-entrenamiento'],
    relatedIds: ['term-inferencia', 'term-parametros', 'term-rag'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c1',
      lessonTitle: 'Lección 01 — De Código a Probabilidad',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad'
    }
  },
  {
    id: 'term-inferencia',
    slug: 'inferencia-inference',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Inferencia (Inference)',
    description: 'Proceso de ejecución del modelo en producción para responder a un prompt. Es la fase que controla el ingeniero de software en arquitectura y runtime.',
    content: `### Inferencia (Inference)

La inferencia es la fase operativa donde un modelo con pesos congelados recibe un payload de entrada (\`Input Tokens\`) y genera auto-regresivamente una respuesta (\`Output Tokens\`).

#### Consideraciones de Ingeniería (FinOps & Latencia):
- **Sin estado:** Cada llamada a la API es independiente y stateless.
- **Cómputo en GPU:** Los tokens de entrada se procesan en paralelo en una sola pasada matricial; los tokens de salida se generan secuencialmente, dictando la latencia visible.
- **Costos:** Se tarifica por millón de tokens procesados y generados, no por petición HTTP simple.`,
    technologies: ['Runtime', 'Cloud APIs', 'GPU'],
    tags: ['M01', 'Fundamentos', 'Inferencia'],
    keywords: ['inference', 'runtime', 'latencia', 'tokens', 'costos'],
    aliases: ['Inference', 'Runtime de inferencia'],
    relatedIds: ['term-entrenamiento', 'term-input-output-tokens', 'term-token'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c1',
      lessonTitle: 'Lección 01 — De Código a Probabilidad',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad'
    }
  },
  {
    id: 'term-parametros',
    slug: 'parametros-weights',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Parámetros (Weights)',
    description: 'Pesos numéricos dentro de la red neuronal que determinan la fuerza de conexión entre conceptos; representan el conocimiento comprimido del modelo.',
    content: `### Parámetros (Weights)

Los parámetros definen la capacidad de representación y razonamiento de un modelo de lenguaje.

#### Dimensionamiento en Ingeniería:
- **Modelos Compactos (8B / 14B):** Económicos, de baja latencia y ejecutables en servidores locales. Ideales para extracción estructurada, clasificación y routers.
- **Modelos Grandes / Frontera (70B+ / Frontier):** Mayor costo y latencia. Imprescindibles para razonamiento lógico profundo, síntesis arquitectónica y codificación compleja.
- **Regla de Oro:** No utilizar un modelo de frontera para una tarea que resuelve con precisión un modelo pequeño bien acotado.`,
    technologies: ['Deep Learning', 'Neural Networks'],
    tags: ['M01', 'Fundamentos', 'Pesos'],
    keywords: ['weights', '8B', '70B', 'frontera', 'tamaño de modelo'],
    aliases: ['Weights', 'Pesos Neuronales', 'Parámetros del Modelo'],
    relatedIds: ['term-entrenamiento', 'term-inferencia'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c1',
      lessonTitle: 'Lección 01 — De Código a Probabilidad',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-01-probabilidad'
    }
  },
  {
    id: 'term-token',
    slug: 'token',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Token',
    description: 'Unidad mínima y fundamental de cómputo en modelos de lenguaje. Fragmento de texto estadístico mapeado a un identificador numérico entero.',
    content: `### ¿Qué es un Token?

Los LLMs no procesan palabras completas ni letras aisladas: operan exclusivamente sobre secuencias de tokens. Un token suele corresponder a una sílaba, una palabra corta o un fragmento de código.

#### Reglas de Tokenización en CASE:
- En inglés, 1 token equivale aproximadamente a ¾ de una palabra (100 tokens ≈ 75 palabras).
- En español, código fuente y símbolos matemáticos, las palabras suelen dividirse en múltiples tokens, aumentando el costo y la latencia relativa.
- Cada token se mapea a un ID entero dentro del vocabulario estático del modelo antes de entrar a las operaciones matriciales de la GPU.`,
    technologies: ['Tokenizer', 'BPE', 'NLP'],
    tags: ['M01', 'Fundamentos', 'Tokens'],
    keywords: ['token', 'tokenización', 'subword', 'vocabulario', 'bpe'],
    aliases: ['Sub-palabra', 'Token ID'],
    relatedIds: ['term-ventana-contexto', 'term-input-output-tokens'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c2',
      lessonTitle: 'Lección 02 — Anatomía de la Inferencia',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-02-inferencia'
    }
  },
  {
    id: 'term-ventana-contexto',
    slug: 'ventana-de-contexto',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Ventana de Contexto (Context Window)',
    description: 'Límite máximo de tokens que el modelo puede procesar simultáneamente en una interacción (suma estricta de tokens de entrada más tokens de salida).',
    content: `### Ventana de Contexto (Context Window)

La ventana de contexto es la memoria de trabajo efímera de la inferencia. Todo lo que el modelo necesita para razonar debe caber dentro de este límite técnico.

#### Regla de Ingeniería:
- Superar el límite causa errores de API o recortes ciegos al inicio del historial.
- Aunque existan ventanas de 1M o 2M de tokens, inyectar payloads masivos incrementa exponencialmente los costos y degrada la atención (Attention Dilution).
- La Ingeniería de Contexto (M03) selecciona únicamente el contexto mínimo útil para evitar sobrecargar la ventana.`,
    technologies: ['Transformers', 'Attention'],
    tags: ['M01', 'Fundamentos', 'Contexto'],
    keywords: ['context window', 'tokens límite', 'atención', 'memoria de trabajo'],
    aliases: ['Context Window', 'Límite de Contexto'],
    relatedIds: ['term-token', 'term-presupuesto-tokens', 'term-dilucion-atencion'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c2',
      lessonTitle: 'Lección 02 — Anatomía de la Inferencia',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-02-inferencia'
    }
  },
  {
    id: 'term-temperatura',
    slug: 'temperatura-temperature',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Temperatura (Temperature)',
    description: 'Parámetro hiperdimensional que aplana o agudiza la distribución de probabilidad antes del muestreo (sampling) del siguiente token.',
    content: `### Temperatura y Sampling

Al predecir el siguiente token, el LLM calcula probabilidades para cada elemento de su vocabulario. La temperatura modula matemáticamente la función Softmax antes de seleccionar el resultado.

#### Espectro Operacional en CASE:
- **Baja (0.0 – 0.2):** El modelo casi siempre elige el token más probable (ArgMax). Respuestas consistentes, estructuradas y repetibles. Esencial para pipelines RAG, código y JSON estricto.
- **Alta (0.7 – 1.0+):** Suaviza las diferencias de probabilidad, permitiendo la elección de tokens menos probables. Genera respuestas divergentes y creativas.`,
    technologies: ['Sampling', 'Softmax'],
    tags: ['M01', 'Fundamentos', 'Sampling'],
    keywords: ['temperature', 'temperatura', 'sampling', 'argmax', 'determinismo'],
    aliases: ['Temperature', 'Parámetro de Muestreo'],
    relatedIds: ['term-modelo-probabilistico', 'term-comportamiento-confiable'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c2',
      lessonTitle: 'Lección 02 — Anatomía de la Inferencia',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-02-inferencia'
    }
  },
  {
    id: 'term-input-output-tokens',
    slug: 'input-tokens-vs-output-tokens',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Input Tokens vs Output Tokens',
    description: 'Separación económica y operacional: los tokens de entrada se procesan en paralelo a bajo costo; los de salida se generan secuencialmente y cuestan de 3x a 5x más.',
    content: `### Economía de la Inferencia (FinOps)

En las arquitecturas con LLMs comerciales, el cómputo se divide en dos dinámicas asimétricas:

1. **Input Tokens (Prompt):** Se procesan simultáneamente en la GPU en una sola pasada matricial. Menor costo por millón y menor tiempo por token.
2. **Output Tokens (Generación):** Se calculan de forma estrictamente auto-regresiva (un token detrás de otro). Cuestan de 3 a 5 veces más por millón y son los responsables directos de la latencia percibida por el usuario.

**Regla FinOps:** Diseñar prompts con salidas estructuradas y concisas (sin texto conversacional redundante) optimiza drásticamente costos y velocidad.`,
    technologies: ['FinOps', 'Cloud Costs'],
    tags: ['M01', 'Fundamentos', 'FinOps'],
    keywords: ['input tokens', 'output tokens', 'prompt tokens', 'completion tokens', 'costos'],
    aliases: ['Prompt Tokens vs Completion Tokens', 'Tokens de Entrada vs Salida'],
    relatedIds: ['term-token', 'term-inferencia', 'term-presupuesto-tokens'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c2',
      lessonTitle: 'Lección 02 — Anatomía de la Inferencia',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-02-inferencia'
    }
  },
  {
    id: 'term-modelo-crudo-vs-sistema',
    slug: 'modelo-crudo-vs-sistema-orquestado',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Modelo Crudo vs Sistema Orquestado',
    description: 'El modelo crudo es el cerebro predictivo sin estado ni acceso a red; el sistema es el exoesqueleto de software determinista que recupera datos, ejecuta herramientas y valida salidas.',
    content: `### El Axioma del Exoesqueleto de Software

Un modelo de lenguaje desnudo no puede operar en producción bancaria ni empresarial. Para resolver problemas de ingeniería, debe estar gobernado por un sistema determinista.

- **Modelo Crudo:** Conocimiento congelado a la fecha de corte. No tiene sockets, reloj de sistema ni conexión directa a bases de datos.
- **Sistema Orquestado (CASE OS):** Código en Python o TypeScript que inyecta contexto fresco (RAG), expone herramientas tipadas, valida respuestas con schemas deterministas e intercepta operaciones de riesgo mediante compuertas de políticas.`,
    technologies: ['Software Architecture', 'Orchestration'],
    tags: ['M01', 'Fundamentos', 'Arquitectura'],
    keywords: ['modelo crudo', 'sistema orquestado', 'exoesqueleto', 'software wrapper'],
    aliases: ['Exoesqueleto de Software', 'Raw Model vs System'],
    relatedIds: ['term-software-determinista', 'term-tool-calling', 'term-policy-gate'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c3',
      lessonTitle: 'Lección 03 — Modelos vs Sistemas',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-03-sistemas'
    }
  },
  {
    id: 'term-alucinacion',
    slug: 'alucinacion-hallucination',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'BEGINNER',
    title: 'Alucinación (Hallucination)',
    description: 'Propiedad intrínseca del motor de predicción estadística donde, ante la falta de evidencia en su contexto, genera información falsa que suena matemáticamente verosímil.',
    content: `### Mecánica de las Alucinaciones

Una alucinación no es un bug inesperado de programación: es la consecuencia natural de un modelo probabilístico obligado a predecir continuaciones de texto sin evidencia empírica en su contexto.

#### Defensas de Ingeniería en CASE:
1. **Grounding (RAG):** Inyectar la evidencia documental o de código directamente en el prompt antes de la inferencia.
2. **Citas Obligatorias:** Instruir al modelo a referenciar el ID exacto del documento recuperado.
3. **Instrucciones de Fallback:** "Si la respuesta no se encuentra en el contexto, responde 'Información no disponible'".
4. **Validación Determinista:** Schemas en backend (Zod / JSON Schema) que impiden que alucinaciones de formato rompan el código.`,
    technologies: ['Grounding', 'RAG'],
    tags: ['M01', 'Fundamentos', 'Seguridad'],
    keywords: ['hallucination', 'alucinación', 'confabulación', 'grounding', 'factualidad'],
    aliases: ['Hallucination', 'Confabulación Estadística'],
    relatedIds: ['term-rag', 'term-grounding', 'term-validación-determinista'],
    metadata: {
      moduleId: 'm1',
      moduleTitle: '01. Fundamentos de IA',
      lessonId: 'c3',
      lessonTitle: 'Lección 03 — Modelos vs Sistemas',
      academyRoute: '/academy/modules/m01-ai-foundations/lesson-03-sistemas'
    }
  },

  // =========================================================================
  // MÓDULO 02 — INGENIERÍA DE PROMPTS
  // =========================================================================
  {
    id: 'term-comportamiento-confiable',
    slug: 'comportamiento-confiable',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Comportamiento Confiable (Reliable Behavior)',
    description: 'Diseño de restricciones y contratos que reducen la desviación estándar de las respuestas del modelo, acorralando su variabilidad para consumo por software.',
    content: `### El Mito del "Prompt Perfecto"

La ingeniería de prompts no consiste en descubrir palabras mágicas para convertir al LLM en una función matemática estricta. Consiste en aceptar la variabilidad intrínseca del modelo y diseñar restricciones reproducibles.

#### Pilares del Comportamiento Confiable:
- Reducción deliberada de la varianza estadística mediante contratos claros de entrada y salida.
- Inyección de ejemplos de formato (\`Few-Shot\`).
- Instrucciones negativas taxativas (\`Negative Constraints\`).
- Validación determinista en el backend antes de usar cualquier dato generado.`,
    technologies: ['Prompt Engineering', 'Testing'],
    tags: ['M02', 'Prompts', 'Confiabilidad'],
    keywords: ['comportamiento confiable', 'reproducibilidad', 'constraints', 'desviación estándar'],
    aliases: ['Comportamiento Reproducible', 'Reliable Behavior'],
    relatedIds: ['term-few-shot', 'term-negative-constraints', 'term-validación-determinista'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c4',
      lessonTitle: 'Lección 01 — Comportamiento Confiable',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior'
    }
  },
  {
    id: 'term-zero-shot',
    slug: 'zero-shot-prompting',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Zero-Shot Prompting',
    description: 'Petición directa al modelo sin proveerle ejemplos previos de entrada/salida. Útil para tareas genéricas, pero vulnerable a desviaciones en contratos estrictos.',
    content: `### Zero-Shot Prompting

Consiste en describir una tarea únicamente mediante instrucciones conceptuales en lenguaje natural, esperando que el conocimiento preentrenado del modelo resuelva la estructura.

**Riesgo en producción:** El modelo suele agregar charla conversacional innecesaria ("¡Por supuesto! Aquí tienes tu JSON:") que rompe los parsers de backend. En sistemas críticos se prefiere Few-Shot o Schemas forzados.`,
    technologies: ['Prompting'],
    tags: ['M02', 'Prompts', 'Zero-Shot'],
    keywords: ['zero shot', 'instrucción directa', 'sin ejemplos'],
    aliases: ['Zero-Shot'],
    relatedIds: ['term-few-shot', 'term-salidas-estructuradas'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c4',
      lessonTitle: 'Lección 01 — Comportamiento Confiable',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior'
    }
  },
  {
    id: 'term-few-shot',
    slug: 'few-shot-prompting',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Few-Shot Prompting',
    description: 'Inclusión de ejemplos directos de entrada/salida dentro del prompt para alinear la distribución probabilística hacia el formato exacto requerido.',
    content: `### Few-Shot Prompting: Mostrando en lugar de explicando

Few-Shot Prompting es una de las técnicas de mayor impacto en ingeniería. Al ver pares de \`Input -> Output\` en el contexto, el modelo auto-regresivo completa el patrón sin introducir explicaciones ni saludos.

#### Recomendaciones:
- Incluir entre 2 y 4 ejemplos que cubran casos nominales y al menos un caso de borde o error.
- Mantener la sintaxis idéntica en todos los ejemplos para no confundir al tokenizador.`,
    technologies: ['Prompt Engineering', 'In-Context Learning'],
    tags: ['M02', 'Prompts', 'Few-Shot'],
    keywords: ['few shot', 'ejemplos', 'in-context learning', 'alineación'],
    aliases: ['Few-Shot', 'In-Context Learning'],
    relatedIds: ['term-zero-shot', 'term-salidas-estructuradas'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c4',
      lessonTitle: 'Lección 01 — Comportamiento Confiable',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior'
    }
  },
  {
    id: 'term-negative-constraints',
    slug: 'negative-constraints',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Negative Constraints',
    description: 'Restricciones explícitas sobre lo que el modelo NO debe hacer, anulando la tendencia conversacional de autocompletado antes de la generación.',
    content: `### Negative Constraints en Producción

Los LLMs tienden a justificar sus respuestas o añadir introducciones amables. En un flujo automatizado de backend, esto corrompe los serializadores JSON.

#### Comparativa:
- **Instrucción débil (Evitar):** *"Intenta no incluir texto antes del JSON."* (El modelo interpreta "incluir texto" como un patrón probabilístico activo).
- **Negative Constraint estricta (Usar):** *"WARNING: Return ONLY valid JSON. Do NOT include markdown backticks (\`\`\`json). Any text outside the braces will trigger a catastrophic parser failure."*`,
    technologies: ['Prompt Engineering', 'Guardrails'],
    tags: ['M02', 'Prompts', 'Restricciones'],
    keywords: ['negative constraints', 'restricciones negativas', 'prohibición', 'no markdown'],
    aliases: ['Restricciones Negativas', 'Negative Prompts'],
    relatedIds: ['term-comportamiento-confiable', 'term-salidas-estructuradas'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c4',
      lessonTitle: 'Lección 01 — Comportamiento Confiable',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior'
    }
  },
  {
    id: 'term-chain-of-thought',
    slug: 'chain-of-thought-cot',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Chain of Thought (CoT)',
    description: 'Patrón de razonamiento que fuerza al modelo a generar tokens intermedios de análisis paso a paso antes de emitir la conclusión final.',
    content: `### Chain of Thought (CoT)

Cuando se pide una conclusión directa sobre un problema complejo (Zero-Shot directo), el modelo debe predecir la respuesta sin espacio latente para descomponer la lógica. CoT resuelve esto obligándolo a "pensar paso a paso".

#### Mecánica de Software:
No es magia: al redactar los pasos analíticos intermedios, esos tokens se convierten en contexto visible para la predicción del veredicto final, elevando drásticamente el acierto lógico.

**Aviso FinOps:** CoT consume más tokens de salida (mayor latencia y costo). Usar exclusivamente para análisis, auditoría y síntesis lógica; jamás para transformaciones triviales de formato.`,
    technologies: ['Reasoning Patterns', 'NLP'],
    tags: ['M02', 'Prompts', 'CoT'],
    keywords: ['chain of thought', 'cot', 'paso a paso', 'razonamiento', 'step by step'],
    aliases: ['CoT', 'Razonamiento Paso a Paso'],
    relatedIds: ['term-least-to-most', 'term-plan-agentico'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c5',
      lessonTitle: 'Lección 02 — Patrones de Razonamiento',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns'
    }
  },
  {
    id: 'term-least-to-most',
    slug: 'least-to-most-prompting',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Least-to-Most Prompting',
    description: 'Técnica de descomposición donde el modelo genera primero un plan estructurado de sub-problemas antes de comenzar a emitir código o soluciones.',
    content: `### Descomposición de Problemas (Least-to-Most)

Aproximación de "divide y vencerás" para tareas masivas (ej. migrar un módulo legacy completo). Se instruye al modelo a generar la lista ordenada de sub-tareas sin código, permitiendo que el software orqueste la ejecución paso a paso.

Constituye el antecedente pedagógico directo del concepto formal de **Plan Agéntico** introducido en M05.`,
    technologies: ['Decomposition', 'Planning'],
    tags: ['M02', 'Prompts', 'Descomposición'],
    keywords: ['least to most', 'descomposición', 'plan de acción', 'subtareas'],
    aliases: ['Descomposición de Problemas', 'Structured Problem Solving'],
    relatedIds: ['term-chain-of-thought', 'term-plan-agentico'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c5',
      lessonTitle: 'Lección 02 — Patrones de Razonamiento',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns'
    }
  },
  {
    id: 'term-salidas-estructuradas',
    slug: 'salidas-estructuradas',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Salidas Estructuradas (Structured Outputs)',
    description: 'Generación forzada de respuestas bajo esquemas formales y tipados (JSON Schema / interfaces TypeScript) diseñadas para ser consumidas por software, no humanos.',
    content: `### El Puente entre Lenguaje Natural y Código

Los humanos leen prosa y Markdown; las aplicaciones de producción consumen estructuras de datos tipadas. Las salidas estructuradas eliminan la fragilidad de usar expresiones regulares para parsear texto de LLMs.

#### Pipeline Canónico de CASE:
1. Input del usuario (Lenguaje Natural).
2. Prompt con interfaz TypeScript / JSON Schema + Restricción Negativa.
3. El LLM emite el payload JSON estricto.
4. Validación Determinista en Backend (Zod / Pydantic).
5. Ejecución del código de negocio con seguridad de tipos.`,
    technologies: ['JSON Schema', 'TypeScript', 'Zod'],
    tags: ['M02', 'Prompts', 'Structured Outputs'],
    keywords: ['structured outputs', 'json', 'json schema', 'salidas estructuradas', 'tipado'],
    aliases: ['Structured Outputs', 'JSON Mode'],
    relatedIds: ['term-validación-determinista', 'term-tool-schema'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c6',
      lessonTitle: 'Lección 03 — Salidas Estructuradas',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-03-structured-outputs'
    }
  },
  {
    id: 'term-validación-determinista',
    slug: 'validacion-determinista',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Validación Determinista (Schema Validation)',
    description: 'Capa de software defensiva en el backend que verifica los tipos y reglas de negocio sobre la salida del LLM antes de aceptarla en el sistema.',
    content: `### El Principio: Parseable ≠ Válido

Un JSON generado por un LLM puede parsear correctamente con \`JSON.parse()\`, pero violar restricciones críticas de negocio (ej. un \`amount\` negativo o un estado no contemplado en el enum).

#### Regla de Oro de CASE:
Nunca confiar ciegamente en la salida del LLM. Todo payload generado por IA debe atravesar una capa de validación de esquemas (\`Zod\` en TypeScript o \`Pydantic\` en Python) antes de tocar la base de datos o lógica transaccional.`,
    technologies: ['Zod', 'Pydantic', 'Data Validation'],
    tags: ['M02', 'Prompts', 'Validación'],
    keywords: ['validación', 'schema validation', 'zod', 'pydantic', 'parseable'],
    aliases: ['Schema Validation', 'Validación en Backend'],
    relatedIds: ['term-salidas-estructuradas', 'term-software-determinista'],
    metadata: {
      moduleId: 'm2',
      moduleTitle: '02. Ingeniería de Prompts',
      lessonId: 'c6',
      lessonTitle: 'Lección 03 — Salidas Estructuradas',
      academyRoute: '/academy/modules/m02-prompt-engineering/lesson-03-structured-outputs'
    }
  },

  // =========================================================================
  // MÓDULO 03 — INGENIERÍA DE CONTEXTO
  // =========================================================================
  {
    id: 'term-context-engineering',
    slug: 'context-engineering',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Context Engineering (Ingeniería de Contexto)',
    description: 'Proceso arquitectónico de capturar el estado dinámico de la aplicación y transformarlo en texto estructurado antes de enviarlo a la API sin estado del LLM.',
    content: `### La Ilusión de Omnisciencia

Un LLM en producción es una API stateless que no conoce al usuario, la pantalla activa ni los registros de base de datos. 

Context Engineering no consiste en escribir prompts largos; es la disciplina arquitectónica de ensamblar, priorizar y comprimir la información viva del sistema para inyectarla en cada inferencia con máxima densidad de señal.`,
    technologies: ['Context Architecture', 'Stateless APIs'],
    tags: ['M03', 'Contexto', 'Ingeniería'],
    keywords: ['context engineering', 'ingeniería de contexto', 'stateless', 'inyección de contexto'],
    aliases: ['Ingeniería de Contexto'],
    relatedIds: ['term-seis-fuentes-contexto', 'term-contexto-disponible-vs-util'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c7',
      lessonTitle: 'Lección 01 — Anatomía del Contexto',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-01-anatomy'
    }
  },
  {
    id: 'term-seis-fuentes-contexto',
    slug: 'seis-fuentes-de-verdad-del-contexto',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Seis Fuentes de Verdad del Contexto',
    description: 'Taxonomía formal de CASE sobre los orígenes de información disponibles para componer un payload de contexto antes de la inferencia.',
    content: `### Taxonomía de Fuentes de Contexto en CASE Academy:

1. **Static Context:** Reglas de negocio fijas e instrucciones del sistema (System Prompt).
2. **User Context:** Perfil, permisos, roles y preferencias del usuario.
3. **Application State:** Datos y estado de la pantalla o flujo activo en la aplicación.
4. **Retrieved Context (RAG):** Fragmentos documentales recuperados dinámicamente de bases vectoriales.
5. **Tool Context:** Observaciones y respuestas devueltas por herramientas recién ejecutadas.
6. **Conversation Context:** Historial reciente de mensajes previos de la sesión.`,
    technologies: ['Architecture', 'Context Pipeline'],
    tags: ['M03', 'Contexto', 'Taxonomía'],
    keywords: ['fuentes de contexto', 'static context', 'application state', 'retrieved context'],
    aliases: ['Fuentes de Contexto', 'Taxonomía de Contexto'],
    relatedIds: ['term-context-engineering', 'term-criterios-priorizacion-contexto'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c7',
      lessonTitle: 'Lección 01 — Anatomía del Contexto',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-01-anatomy'
    }
  },
  {
    id: 'term-contexto-disponible-vs-util',
    slug: 'contexto-disponible-vs-util',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Contexto Disponible vs Contexto Útil',
    description: 'Disponible es todo lo que el backend puede consultar; Útil es la información estrictamente necesaria para resolver la tarea puntual sin diluir la atención.',
    content: `### El Síndrome de Diógenes en el Prompt

El error más común es concatenar todas las fuentes disponibles y enviarlas al modelo. Esto causa:
- **Sobrecosto de tokens y latencia.**
- **Dilución de atención:** El modelo se pierde entre datos irrelevantes y alucina.

**La Pregunta Fundamental:** *"Si le dieras esta misma información (y nada más) a un colega humano recién contratado... ¿podría resolver el problema?"* Si la respuesta es no, falta contexto útil; si se confunde con tanta basura, sobra contexto disponible.`,
    technologies: ['Information Density', 'Prompt Optimization'],
    tags: ['M03', 'Contexto', 'Optimización'],
    keywords: ['disponible vs útil', 'ruido', 'señal', 'minimum useful context'],
    aliases: ['Minimum Useful Context', 'Contexto Mínimo Útil'],
    relatedIds: ['term-dilucion-atencion', 'term-criterios-priorizacion-contexto'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c7',
      lessonTitle: 'Lección 01 — Anatomía del Contexto',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-01-anatomy'
    }
  },
  {
    id: 'term-dilucion-atencion',
    slug: 'dilucion-de-atencion-lost-in-the-middle',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Dilución de Atención (Lost in the Middle)',
    description: 'Fenómeno cognitivo en LLMs donde prestan máxima atención al inicio y final del prompt, degradando la retención de datos ubicados en el medio.',
    content: `### El Fenómeno "Lost in the Middle"

Los modelos de lenguaje no distribuyen su atención de forma homogénea en ventanas extensas. Tienden a recordar con alta fidelidad las directivas iniciales del sistema y los últimos mensajes del usuario, pero sufren colapso de atención en el contenido central.

**Implicación Arquitectónica:** Más contexto no equivale a mayor inteligencia; significa mayor distracción. La información decisiva debe priorizarse y ubicarse estratégicamente cerca de los extremos del payload.`,
    technologies: ['Attention Mechanism', 'Transformers'],
    tags: ['M03', 'Contexto', 'Atención'],
    keywords: ['lost in the middle', 'attention dilution', 'colapso de atención', 'degradación'],
    aliases: ['Lost in the Middle', 'Attention Dilution', 'Attention Collapse'],
    relatedIds: ['term-criterios-priorizacion-contexto', 'term-delimitadores-xml'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c8',
      lessonTitle: 'Lección 02 — Ensamblaje y Priorización',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-02-assembly'
    }
  },
  {
    id: 'term-criterios-priorizacion-contexto',
    slug: 'criterios-de-priorizacion-de-contexto',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Criterios de Priorización de Contexto (3R)',
    description: 'Los tres filtros deterministas antes de la serialización del payload: Relevancia (afinidad), Recencia (frescura secuencial) y Redundancia (no duplicación).',
    content: `### Los Tres Filtros de Priorización de Contexto:

1. **Relevancia (Relevance):** ¿Aporta esta información a la resolución del intent actual? Si el usuario pregunta por saldo, se descartan políticas generales.
2. **Recencia (Recency):** En historiales de interacción, los turnos más recientes tienen mayor peso que los antiguos.
3. **Redundancia (Redundancy):** Eliminar información estática repetida y estados inmutables duplicados a lo largo de los turnos.`,
    technologies: ['Context Filtering', 'Data Optimization'],
    tags: ['M03', 'Contexto', 'Priorización'],
    keywords: ['priorización', 'relevancia', 'recencia', 'redundancia', 'filtros 3r'],
    aliases: ['Filtros 3R', 'Priorización de Contexto'],
    relatedIds: ['term-contexto-disponible-vs-util', 'term-delimitadores-xml'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c8',
      lessonTitle: 'Lección 02 — Ensamblaje y Priorización',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-02-assembly'
    }
  },
  {
    id: 'term-delimitadores-xml',
    slug: 'delimitadores-xml-context-tags',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Delimitadores XML (Context Assembly Tags)',
    description: 'Etiquetas sintácticas estructuradas que compartimentan el payload inyectado, permitiendo al modelo desambiguar instrucciones, estado, datos RAG y peticiones del usuario.',
    content: `### Estructuración de Contexto mediante XML

Un payload ensamblado debe parecerse a un documento técnico tipado, no a una conversación plana. Los tags XML delimitan inequívocamente cada fuente:

\`\`\`xml
<system_instructions>
Actúa como agente de soporte nivel 2...
</system_instructions>

<application_state current_route="/billing">
user_plan: "enterprise"
</application_state>

<retrieved_knowledge>
[Documento 1: Política de reembolsos (Score: 0.94)]
</retrieved_knowledge>

<user_input>
Quiero solicitar un reembolso del cargo #502.
</user_input>
\`\`\`

**Seguridad:** Previene que un dato inyectado malicioso en \`<user_input>\` sea interpretado como una instrucción del sistema (\`Prompt Injection\`).`,
    technologies: ['XML', 'Prompt Architecture', 'Security'],
    tags: ['M03', 'Contexto', 'Assembly'],
    keywords: ['xml tags', 'delimitadores', 'context assembly', 'blindaje de prompt'],
    aliases: ['Delimitadores XML', 'Context Tags', 'Assembly Template'],
    relatedIds: ['term-criterios-priorizacion-contexto', 'term-presupuesto-tokens'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c8',
      lessonTitle: 'Lección 02 — Ensamblaje y Priorización',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-02-assembly'
    }
  },
  {
    id: 'term-presupuesto-tokens',
    slug: 'presupuesto-de-tokens-context-budget',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Presupuesto de Tokens (Context Budget)',
    description: 'Gestión técnica y financiera de la cuota de tokens asignada a cada componente del prompt antes de invocar la API del modelo.',
    content: `### Gestión del Presupuesto de Tokens

Comprimir no es truncar ciegamente; es destilar información para respetar los techos presupuestarios del sistema:

- **System Reserve:** Tokens reservados inmutables para el System Prompt y los Schemas de salida.
- **Dynamic Reserve:** Límite para RAG y estado de la aplicación.
- **Output Reserve:** Espacio indispensable asegurado para que el LLM pueda emitir su respuesta sin cortes súbitos de API.`,
    technologies: ['Token Budgeting', 'FinOps'],
    tags: ['M03', 'Contexto', 'Budget'],
    keywords: ['context budget', 'presupuesto de tokens', 'reserva de salida', 'token limit'],
    aliases: ['Context Budget', 'Presupuesto de Contexto'],
    relatedIds: ['term-truncamiento-vs-destilacion', 'term-ventana-contexto'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c9',
      lessonTitle: 'Lección 03 — Compresión y Validación',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-03-compression'
    }
  },
  {
    id: 'term-truncamiento-vs-destilacion',
    slug: 'truncamiento-vs-destilacion',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Truncamiento vs Destilación',
    description: 'Truncamiento es el corte ciego de caracteres que corrompe sintaxis; Destilación es la limpieza programática de boilerplate y síntesis de hechos.',
    content: `### "Truncar es para amateurs; destilar es para ingenieros"

- **Truncamiento (Evitar):** Cortar un string a los primeros 4,000 caracteres. Destruye estructuras JSON por la mitad, elimina tags de cierre XML y borra el input reciente del usuario al final del texto.
- **Destilación (Ideal):** Uso de software para remover campos \`null\`, descartar etiquetas HTML estériles (\`<div>\`, \`<style>\`), filtrar logs irrelevantes y resumir recursivamente mensajes antiguos de chat conservando entidades clave.`,
    technologies: ['Data Compression', 'Preprocessing'],
    tags: ['M03', 'Contexto', 'Compresión'],
    keywords: ['truncamiento', 'destilación', 'compresión de contexto', 'limpieza'],
    aliases: ['Truncation vs Distillation', 'Compresión de Contexto'],
    relatedIds: ['term-presupuesto-tokens', 'term-delimitadores-xml'],
    metadata: {
      moduleId: 'm3',
      moduleTitle: '03. Ingeniería de Contexto',
      lessonId: 'c9',
      lessonTitle: 'Lección 03 — Compresión y Validación',
      academyRoute: '/academy/modules/m03-context-engineering/lesson-03-compression'
    }
  },

  // =========================================================================
  // MÓDULO 04 — RECUPERACIÓN Y RAG
  // =========================================================================
  {
    id: 'term-busqueda-lexica-vs-semantica',
    slug: 'busqueda-lexica-vs-semantica',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Búsqueda Léxica vs Búsqueda Semántica',
    description: 'Léxica (BM25) busca coincidencias exactas de términos; Semántica proyecta significados en espacios vectoriales multidimensionales para capturar intenciones.',
    content: `### Palabras frente a Significado

- **Búsqueda Léxica (BM25 / Full-Text):** Excelente para buscar códigos de error específicos, identificadores de ticket ("INC-402") o sintaxis técnica exacta. Falla si el usuario usa sinónimos.
- **Búsqueda Semántica (Embeddings):** Transforma el texto en geometría. Identifica que "necesito un préstamo" y "solicitud de crédito personal" apuntan a la misma intención conceptual aunque no compartan ninguna palabra.`,
    technologies: ['BM25', 'Vector Search', 'Information Retrieval'],
    tags: ['M04', 'RAG', 'Búsqueda'],
    keywords: ['léxica', 'semántica', 'bm25', 'vector search', 'palabras clave'],
    aliases: ['Lexical vs Semantic Search', 'BM25 vs Vector Search'],
    relatedIds: ['term-embeddings', 'term-busqueda-hibrida-rrf'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-embeddings',
    slug: 'embeddings',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Embeddings (Representaciones Vectoriales)',
    description: 'Listas ordenadas de números (vectores densos) que permiten comparar matemáticamente el significado de textos en un espacio de muchas dimensiones.',
    content: `### ¿Qué es un Embedding?

Un embedding traduce lenguaje natural a un vector de números de punto flotante (ej. 1536 dimensiones en OpenAI o 384 en Sentence Transformers).

#### Axioma de M04:
Textos con significados afines tendrán vectores con orientaciones muy próximas en el espacio vectorial, permitiendo cuantificar su cercanía mediante cálculo de ángulos.`,
    technologies: ['Vectors', 'Embeddings', 'Linear Algebra'],
    tags: ['M04', 'RAG', 'Embeddings'],
    keywords: ['embeddings', 'vectores', 'representaciones vectoriales', 'espacio latente'],
    aliases: ['Representaciones Vectoriales', 'Vector Embeddings', 'Embeddings'],
    relatedIds: ['term-similitud-coseno', 'term-vector-database', 'term-top-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-similitud-coseno',
    slug: 'similitud-coseno',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Similitud Coseno (Cosine Similarity)',
    description: 'Métrica estándar de álgebra lineal que evalúa el coseno del ángulo entre dos vectores para cuantificar su proximidad semántica.',
    content: `### Similitud Coseno

Mide la orientación angular entre dos vectores independientemente de su magnitud:

- **Score 1.0:** Vectores paralelos en la misma dirección (Significado idéntico).
- **Score 0.0:** Vectores ortogonales a 90 grados (Significados completamente no relacionados).
- **Score -1.0:** Vectores opuestos (Significados diametralmente contrarios).

\`\`\`typescript
// Fórmula: dot(A, B) / (norm(A) * norm(B))
\`\`\``,
    technologies: ['Math', 'Linear Algebra'],
    tags: ['M04', 'RAG', 'Métricas'],
    keywords: ['cosine similarity', 'similitud coseno', 'ángulo vectorial', 'dot product'],
    aliases: ['Cosine Similarity', 'Similitud Angular'],
    relatedIds: ['term-embeddings', 'term-top-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-top-k',
    slug: 'top-k-retrieval',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Top-K (Recuperación Top-K)',
    description: 'Parámetro de búsqueda que define la cantidad máxima de candidatos más afines que se extraen de la base vectorial para una consulta dada.',
    content: `### El Parámetro Top-K

Dada una consulta vectorizada, el motor de búsqueda recupera los \`K\` fragmentos con mayor puntuación de similitud coseno.

#### El Dilema de Selección de K:
- Un K muy bajo (ej. K=1) maximiza la precisión pero arriesga no recuperar toda la evidencia necesaria (baja cobertura / recall).
- Un K muy alto (ej. K=20) garantiza cobertura pero satura la ventana de tokens con ruido irrelevante, disparando el costo y la probabilidad de colapso de atención.`,
    technologies: ['Vector Search', 'Information Retrieval'],
    tags: ['M04', 'RAG', 'Top-K'],
    keywords: ['top-k', 'k vecinos', 'ranking', 'candidatos'],
    aliases: ['Top-K', 'Top-K Retrieval'],
    relatedIds: ['term-embeddings', 'term-precision-at-k', 'term-recall-at-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-vector-database',
    slug: 'base-de-datos-vectorial',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Base de Datos Vectorial (Vector Database)',
    description: 'Sistema de almacenamiento optimizado para persistir representaciones vectoriales y metadatos, acelerando búsquedas de similitud a gran escala.',
    content: `### Bases de Datos Vectoriales

Sistemas de persistencia (como pgvector en PostgreSQL, Qdrant, Milvus) diseñados para indexar vectores y metadatos relacionales.

**Rol en el Sistema:** Guarda vectores y metadatos; no genera texto ni responde preguntas. Su único trabajo es responder con los candidatos más afines en milisegundos utilizando índices especializados (HNSW / IVFFlat).`,
    technologies: ['pgvector', 'PostgreSQL', 'Vector Storage'],
    tags: ['M04', 'RAG', 'Base de Datos'],
    keywords: ['vector database', 'base de datos vectorial', 'vector store', 'pgvector'],
    aliases: ['Vector Database', 'Vector Store', 'BBDD Vectorial'],
    relatedIds: ['term-embeddings', 'term-hnsw'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-hnsw',
    slug: 'hnsw-approximate-nearest-neighbors',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Índice HNSW (Approximate Nearest Neighbors)',
    description: 'Estructura de grafo navegable multicapa (Hierarchical Navigable Small World) que permite buscar vectores afines en tiempo sub-lineal a gran escala.',
    content: `### Búsqueda de Vecinos Aproximados (ANN) con HNSW

Comparar una consulta contra millones de vectores de forma exhaustiva (\`K-NN exacto\`) es inviable en tiempo real (complejidad O(N)). 

HNSW construye un grafo jerárquico multicapa similar a una lista de salto (Skip List): salta rápidamente en las capas superiores de baja densidad y refina el vecindario en las capas inferiores, devolviendo el Top-K en milisegundos con alta precisión.`,
    technologies: ['Graph Algorithms', 'ANN', 'HNSW'],
    tags: ['M04', 'RAG', 'Algoritmos'],
    keywords: ['hnsw', 'ann', 'grafos navegables', 'approximate nearest neighbors'],
    aliases: ['HNSW', 'Approximate Nearest Neighbors (ANN)'],
    relatedIds: ['term-vector-database', 'term-top-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-busqueda-hibrida-rrf',
    slug: 'busqueda-hibrida-rrf',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Búsqueda Híbrida & RRF (Reciprocal Rank Fusion)',
    description: 'Fusión ponderada de resultados de búsqueda por palabras clave (BM25) y búsqueda semántica (vectores) para maximizar la tasa de acierto.',
    content: `### Búsqueda Híbrida en Producción

La búsqueda semántica puede tropezar ante códigos exactos de error o IDs de cliente, mientras que la búsqueda léxica fracasa ante sinónimos.

La Búsqueda Híbrida ejecuta ambas consultas en paralelo y utiliza el algoritmo **Reciprocal Rank Fusion (RRF)** para combinar las posiciones ordinales de ambos rankings sin requerir normalización previa de puntajes de similitud.`,
    technologies: ['Hybrid Search', 'RRF', 'BM25'],
    tags: ['M04', 'RAG', 'Hybrid Search'],
    keywords: ['búsqueda híbrida', 'hybrid search', 'rrf', 'reciprocal rank fusion'],
    aliases: ['Hybrid Search', 'Búsqueda Híbrida', 'RRF'],
    relatedIds: ['term-busqueda-lexica-vs-semantica', 'term-reordenamiento-reranking'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c10',
      lessonTitle: 'Lección 01 — Embeddings y Bases de Datos Vectoriales',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-01-embeddings'
    }
  },
  {
    id: 'term-rag',
    slug: 'rag-retrieval-augmented-generation',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'RAG (Retrieval-Augmented Generation)',
    description: 'Tubería de software que recupera candidatos relevantes de una base de conocimiento y los inyecta como contexto estructurado en el LLM antes de la respuesta.',
    content: `### Tubería RAG (Retrieval-Augmented Generation)

RAG conecta la búsqueda de información con la capacidad de razonamiento del modelo de lenguaje:

1. **Fase Offline (Ingestión):** Documentos -> Chunking con Overlap -> Embeddings -> Indexación en Vector Database.
2. **Fase Online (Inferencia):** Consulta del usuario -> Vectorización -> Recuperación Top-K -> Context Assembly (XML/Markdown) -> Generación en LLM.

**Principio de CASE:** RAG no elimina la necesidad de Context Engineering; automatiza dinámicamente la selección de fuentes para inyectar evidencia fundamentada.`,
    technologies: ['RAG', 'Pipeline', 'Grounding'],
    tags: ['M04', 'RAG', 'Arquitectura'],
    keywords: ['rag', 'retrieval augmented generation', 'grounding', 'pipeline rag'],
    aliases: ['Tubería RAG', 'Generación Aumentada por Recuperación', 'RAG'],
    relatedIds: ['term-retrieval', 'term-chunking-overlap', 'term-alucinacion'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c11',
      lessonTitle: 'Lección 02 — La Tubería RAG',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-02-pipeline'
    }
  },
  {
    id: 'term-grounding',
    slug: 'grounding',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Grounding (Fundamentación)',
    description: 'Anclaje del modelo a evidencia externa verificable provista en el contexto, forzando respuestas basadas en hechos comprobados y reduciendo alucinaciones.',
    content: `### Grounding vs. Alucinación
El grounding es la técnica de ingeniería que vincula la respuesta generada por el LLM directamente con hechos y fragmentos recuperados en su contexto de trabajo.

#### Principios Clave en CASE OS:
- **Cero especulación:** Si la respuesta no está en el material inyectado, el modelo debe declarar explícitamente su ausencia.
- **Trazabilidad:** Cada afirmación debe poder rastrearse al fragmento fuente (chunk) o documento original.
- **Fundamentación determinista:** Combina retrieval semántico con esquemas de validación posterior.`,
    technologies: ['RAG', 'Grounding', 'Factual Verification'],
    tags: ['M04', 'RAG', 'Fundamentación'],
    keywords: ['grounding', 'fundamentación', 'evidencia', 'factualidad', 'anclaje'],
    aliases: ['Fundamentación', 'Grounding', 'Anclaje Factual'],
    relatedIds: ['term-rag', 'term-retrieval', 'term-alucinacion'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c11',
      lessonTitle: 'Lección 02 — La Tubería RAG',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-02-pipeline'
    }
  },
  {
    id: 'term-retrieval',
    slug: 'retrieval',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Retrieval',
    description: 'Fase de búsqueda y extracción de candidatos relevantes para responder una consulta. Recuperar candidatos no equivale a tener una respuesta final.',
    content: `### ¿Qué es Retrieval en CASE Academy?

El retrieval es el motor de búsqueda que extrae fragmentos candidatos de la base de datos vectorial antes de tocar al modelo generativo.

#### Regla de Oro:
Si la fase de retrieval recupera fragmentos irrelevantes o con ruido, inyectará distracciones en el contexto del LLM, provocando alucinaciones o degradación de la respuesta. La calidad de RAG está acotada por la calidad del retrieval.`,
    technologies: ['Information Retrieval', 'Vector Search'],
    tags: ['M04', 'RAG', 'Retrieval'],
    keywords: ['retrieval', 'recuperación', 'extracción de candidatos', 'query'],
    aliases: ['Recuperación', 'Búsqueda de Candidatos', 'Information Retrieval'],
    relatedIds: ['term-rag', 'term-top-k', 'term-precision-at-k', 'term-recall-at-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c11',
      lessonTitle: 'Lección 02 — La Tubería RAG',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-02-pipeline'
    }
  },
  {
    id: 'term-chunking-overlap',
    slug: 'chunking-y-overlap',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Chunking y Solapamiento (Overlap)',
    description: 'División de documentos extensos en fragmentos lógicos manejables (300–500 tokens) con un solapamiento (~50 tokens) para evitar cortes semánticos abruptos.',
    content: `### Fragmentación Estratégica (Chunking) y Solapamiento

Los documentos largos no pueden embeberse en un solo vector sin diluir su contenido específico.

- **Chunking:** Divide el documento en piezas cohesivas de tamaño controlado (300–500 tokens).
- **Overlap:** Conserva una ventana de solapamiento (~10-15% o 50 tokens) entre fragmentos contiguos para asegurar que oraciones o definiciones clave no queden truncadas entre dos vectores diferentes.`,
    technologies: ['Chunking', 'Preprocessing'],
    tags: ['M04', 'RAG', 'Ingestión'],
    keywords: ['chunking', 'overlap', 'fragmentación', 'solapamiento', 'segmentación'],
    aliases: ['Fragmentación', 'Chunking', 'Solapamiento de Fragmentos'],
    relatedIds: ['term-rag', 'term-embeddings'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c11',
      lessonTitle: 'Lección 02 — La Tubería RAG',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-02-pipeline'
    }
  },
  {
    id: 'term-precision-at-k',
    slug: 'precision-at-k',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Precision@K (Precisión)',
    description: 'Métrica de evaluación que calcula qué porcentaje de los documentos recuperados en el Top-K eran realmente útiles y relevantes para la consulta (calidad de señal).',
    content: `### Precision@K: Calidad de Señal

Mide el ruido inyectado al LLM:

$$\\text{Precision@K} = \\frac{\\text{Documentos Relevantes Recuperados}}{\\text{Total de Documentos Recuperados (K)}}$$

**Ejemplo Bancario:** Pides Top-5 candidatos. El buscador trae 5 fragmentos, pero solo 2 hablan de la política de reembolso solicitada. Precision = 2/5 = 40%. El 60% restante es ruido que distrae al modelo.`,
    technologies: ['Evaluation', 'Metrics'],
    tags: ['M04', 'RAG', 'Métricas'],
    keywords: ['precision', 'precision@k', 'precisión', 'calidad de señal'],
    aliases: ['Precisión@K', 'Precisión', 'Precision@K'],
    relatedIds: ['term-recall-at-k', 'term-hit-rate', 'term-retrieval'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c12',
      lessonTitle: 'Lección 03 — Evaluación de la Recuperación',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-03-evaluation'
    }
  },
  {
    id: 'term-recall-at-k',
    slug: 'recall-at-k',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Recall@K (Cobertura)',
    description: 'Métrica de evaluación que calcula qué porcentaje de todos los documentos relevantes existentes en la base de datos se lograron capturar en el Top-K.',
    content: `### Recall@K: Cobertura de Conocimiento

Mide la capacidad del buscador para no omitir evidencia factual:

$$\\text{Recall@K} = \\frac{\\text{Documentos Relevantes Recuperados}}{\\text{Total de Documentos Relevantes Existentes en BD}}$$

**Ejemplo:** En la base de datos existen 4 fragmentos normativos sobre límites de crédito. Tu búsqueda Top-5 logra traer 3 de ellos. Recall = 3/4 = 75%.`,
    technologies: ['Evaluation', 'Metrics'],
    tags: ['M04', 'RAG', 'Métricas'],
    keywords: ['recall', 'recall@k', 'cobertura', 'exhaustividad'],
    aliases: ['Cobertura@K', 'Cobertura', 'Exhaustividad', 'Recall@K'],
    relatedIds: ['term-precision-at-k', 'term-hit-rate', 'term-retrieval'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c12',
      lessonTitle: 'Lección 03 — Evaluación de la Recuperación',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-03-evaluation'
    }
  },
  {
    id: 'term-hit-rate',
    slug: 'hit-rate',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Hit Rate (Tasa de Acierto)',
    description: 'Métrica binaria para suites de evaluación continua: determina si al menos un documento relevante apareció dentro del Top-K recuperado.',
    content: `### Hit Rate (Tasa de Acierto)

Una métrica operativa directa: para un conjunto de preguntas de prueba (Golden Dataset), ¿en qué porcentaje de los casos el documento con la respuesta correcta estuvo presente en el Top-K?

$$\\text{Hit Rate} = \\begin{cases} 1 & \\text{si } \\text{Relevantes en Top-K} > 0 \\\\ 0 & \\text{en caso contrario} \\end{cases}$$`,
    technologies: ['Evaluation', 'CI/CD'],
    tags: ['M04', 'RAG', 'Métricas'],
    keywords: ['hit rate', 'tasa de acierto', 'evaluación binaria', 'golden dataset'],
    aliases: ['Hit Rate', 'Tasa de Acierto'],
    relatedIds: ['term-precision-at-k', 'term-recall-at-k'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c12',
      lessonTitle: 'Lección 03 — Evaluación de la Recuperación',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-03-evaluation'
    }
  },
  {
    id: 'term-reordenamiento-reranking',
    slug: 'reordenamiento-reranking',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Reordenamiento (Reranking)',
    description: 'Arquitectura de recuperación en dos etapas (Two-Stage Retrieval) donde un modelo Cross-Encoder reordena los primeros candidatos antes de inyectarlos al prompt.',
    content: `### Two-Stage Retrieval con Reranker

1. **Etapa 1 (Retrieval Rápido):** Búsqueda vectorial o híbrida extrae un conjunto amplio de candidatos (ej. Top-50) en milisegundos con modelos bi-encoder livianos.
2. **Etapa 2 (Reranking):** Un modelo Cross-Encoder calcula la afinidad semántica exacta entre la consulta y cada candidato, reordenando los 5 mejores para inyectarlos al LLM.

Permite alcanzar alto Recall sin sacrificar la Precision ni saturar la ventana de contexto.`,
    technologies: ['Cross-Encoder', 'Reranking', 'Two-Stage Retrieval'],
    tags: ['M04', 'RAG', 'Reranking'],
    keywords: ['reranking', 'reordenamiento', 'cross-encoder', 'two stage retrieval'],
    aliases: ['Reranking', 'Reordenamiento de Candidatos'],
    relatedIds: ['term-retrieval', 'term-top-k', 'term-hit-rate'],
    metadata: {
      moduleId: 'm4',
      moduleTitle: '04. Recuperación y RAG',
      lessonId: 'c12',
      lessonTitle: 'Lección 03 — Evaluación de la Recuperación',
      academyRoute: '/academy/modules/m04-retrieval-rag/lesson-03-evaluation'
    }
  },

  // =========================================================================
  // MÓDULO 05 — AGENTES DE IA
  // =========================================================================
  {
    id: 'term-least-autonomy-necessary',
    slug: 'least-autonomy-necessary',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Least Autonomy Necessary',
    description: 'Principio arquitectónico rector que exige construir sistemas con el nivel más bajo de autonomía que resuelva de forma robusta el caso de uso.',
    content: `### La Autonomía es un Costo Operacional

En ingeniería de agentes, dotar de autonomía introduce no-determinismo, costos variables de API y riesgos de seguridad.

#### Escalera de Autonomía de CASE:
1. **Flujo Determinista (Código Clásico):** Si la secuencia de pasos es fija, usar código tradicional. Cero autonomía agéntica.
2. **Model-Routed Workflow:** Usar el LLM únicamente para clasificar la intención y derivar el flujo a un camino determinista rígido.
3. **Agent Loop Completo:** Reservar el bucle iterativo de toma de decisiones exclusivamente para problemas abiertos que requieran investigación paso a paso.`,
    technologies: ['Agent Architecture', 'Control Theory'],
    tags: ['M05', 'Agentes', 'Filosofía'],
    keywords: ['least autonomy necessary', 'mínima autonomía', 'control de flujo', 'arquitectura agéntica'],
    aliases: ['Principio de Mínima Autonomía', 'Least Autonomy Necessary'],
    relatedIds: ['term-tool-using-workflow-vs-agent-loop', 'term-agent-loop'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c13',
      lessonTitle: 'Lección 01 — Flujos de Trabajo vs Agentes',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-01-workflows'
    }
  },
  {
    id: 'term-tool-using-workflow-vs-agent-loop',
    slug: 'tool-using-workflow-vs-agent-loop',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'INTERMEDIATE',
    title: 'Tool-Using Workflow vs Agent Loop',
    description: 'El workflow ejecuta una herramienta y termina sin realimentación; el Agent Loop reinyecta la observación al modelo para decidir iterativamente el siguiente paso.',
    content: `### La Frontera de la Agencialidad

- **Tool-Using Workflow (Agent v1):** El modelo emite una llamada a herramienta, el sistema la ejecuta en la CPU, entrega el resultado al usuario y termina. No hay bucle de realimentación ni adaptación a descubrimientos intermedios.
- **Agent Loop (Agent v2+):** El resultado de la herramienta regresa al modelo como una nueva observación. El modelo la evalúa y decide si necesita otra acción, una corrección de rumbo o si está listo para emitir su respuesta final.`,
    technologies: ['Agent Architecture', 'Workflows'],
    tags: ['M05', 'Agentes', 'Workflows'],
    keywords: ['workflow vs agent', 'agencialidad', 'tool using workflow', 'realimentación'],
    aliases: ['Workflow vs Agente', 'Flujo de Herramientas vs Bucle Agéntico'],
    relatedIds: ['term-least-autonomy-necessary', 'term-agent-loop', 'term-tool-calling'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c13',
      lessonTitle: 'Lección 01 — Flujos de Trabajo vs Agentes',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-01-workflows'
    }
  },
  {
    id: 'term-tool-calling',
    slug: 'tool-calling-llamada-de-herramientas',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Tool Calling (Llamada de Herramientas)',
    description: 'Protocolo de comunicación estructurada donde el modelo propone una invocación en JSON conforme a un schema y el software local ejecuta la función real en la CPU.',
    content: `### El Axioma Inviolable de Tool Calling

**"El Modelo Propone, el Software Ejecuta."**

Un LLM no tiene sockets de red, punteros de memoria ni credenciales de base de datos. Tool Calling (Function Calling) es un protocolo declarativo:
1. El runtime expone descripciones de funciones en formato JSON Schema.
2. Al detectar una necesidad operativa, el modelo emite un JSON estructurado solicitando ejecutar la tool.
3. El software local intercepta la solicitud, valida tipos y permisos, ejecuta la función en la CPU y le retorna la observación al modelo.`,
    technologies: ['Tool Calling', 'Function Calling', 'JSON Schema'],
    tags: ['M05', 'Agentes', 'Tools'],
    keywords: ['tool calling', 'function calling', 'llamada de herramientas', 'ejecución en cpu'],
    aliases: ['Llamada de Herramientas', 'Function Calling', 'Tool Calling'],
    relatedIds: ['term-tool-schema', 'term-secuencia-7-hops', 'term-tools-lectura-vs-side-effects'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c14',
      lessonTitle: 'Lección 02 — Llamada de Herramientas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-02-tool-calling'
    }
  },
  {
    id: 'term-tool-schema',
    slug: 'tool-schema',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Tool Schema',
    description: 'Especificación declarativa en JSON Schema que describe el nombre, propósito y tipos de parámetros de una función para guiar la inferencia probabilística del LLM.',
    content: `### Anatomía de un Tool Schema

El LLM utiliza el campo \`name\` para invocar la función, pero utiliza el campo \`description\` para **decidir cuándo** invocarla.

\`\`\`json
{
  "name": "get_service_status",
  "description": "Consulta el estado operativo, tasa de error y latencia de un microservicio interno.",
  "parameters": {
    "type": "object",
    "properties": {
      "service": {
        "type": "string",
        "enum": ["auth-api", "payments-api", "notifications-worker"]
      }
    },
    "required": ["service"]
  }
}
\`\`\`

Escribir descripciones precisas de herramientas es Prompt Engineering estricto (M02).`,
    technologies: ['JSON Schema', 'Tool Specification'],
    tags: ['M05', 'Agentes', 'Schemas'],
    keywords: ['tool schema', 'esquema de herramienta', 'json schema', 'parámetros'],
    aliases: ['Esquema de Herramienta', 'Tool Definition Schema'],
    relatedIds: ['term-tool-calling', 'term-salidas-estructuradas'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c14',
      lessonTitle: 'Lección 02 — Llamada de Herramientas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-02-tool-calling'
    }
  },
  {
    id: 'term-secuencia-7-hops',
    slug: 'secuencia-de-los-7-hops',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Secuencia de los 7 Hops',
    description: 'Secuencia canónica de control en un turno agéntico: USER → MODEL → TOOL SELECTED → ARGUMENTS → EXECUTION → TOOL RESULT → MODEL RESPONSE.',
    content: `### Trazabilidad de los 7 Hops Operacionales:

1. **USER:** El usuario formula una solicitud que requiere datos externos.
2. **MODEL:** El LLM evalúa el contexto frente a los Tool Schemas disponibles.
3. **TOOL SELECTED:** El modelo emite una señal de parada con el nombre de la tool.
4. **ARGUMENTS:** El modelo genera los parámetros en JSON según el schema.
5. **EXECUTION:** El runtime intercepta la llamada, valida y ejecuta la función real en la CPU.
6. **TOOL RESULT:** El output de la función se inyecta como mensaje de rol \`tool\`.
7. **MODEL RESPONSE:** El modelo sintetiza la observación y emite su respuesta final.`,
    technologies: ['Agent Lifecycle', 'Tracing'],
    tags: ['M05', 'Agentes', 'Lifecycle'],
    keywords: ['7 hops', 'ciclo de tool calling', 'hops agénticos', 'secuencia operacional'],
    aliases: ['7 Hops Operacionales', 'Ciclo de 7 Fases de Tool Calling'],
    relatedIds: ['term-tool-calling', 'term-agent-loop'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c14',
      lessonTitle: 'Lección 02 — Llamada de Herramientas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-02-tool-calling'
    }
  },
  {
    id: 'term-tools-lectura-vs-side-effects',
    slug: 'tools-de-lectura-vs-side-effects',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Tools de Lectura vs Side Effects',
    description: 'Lectura es de consulta e idempotente (bajo riesgo); Side Effects mutan bases de datos o disparan transacciones financieras (requieren validación y aprobación).',
    content: `### Frontera de Seguridad: El Prompt no es una Frontera

- **Tools de Lectura (Idempotentes):** Consultar saldo, verificar estado de servicio o leer incidentes. Si fallan o se reintentan, no alteran el estado del mundo.
- **Tools con Side Effects (Mutaciones):** Cancelar órdenes, ejecutar transferencias o reiniciar clusters. Modifican el mundo exterior y son irreversibles.

**Axioma de Seguridad de CASE:** Escribir en el system prompt *"nunca transfieras más de $1,000"* es una defensa frágil que colapsa ante prompt injection. Los límites transaccionales se codifican en software dentro del runtime determinista.`,
    technologies: ['Idempotency', 'Security', 'Transaction Boundary'],
    tags: ['M05', 'Agentes', 'Seguridad'],
    keywords: ['side effects', 'efectos colaterales', 'tools de lectura', 'idempotencia', 'mutaciones'],
    aliases: ['Read Tools vs Side Effect Tools', 'External Side Effect Boundary'],
    relatedIds: ['term-policy-gate', 'term-human-in-the-loop'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c14',
      lessonTitle: 'Lección 02 — Llamada de Herramientas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-02-tool-calling'
    }
  },
  {
    id: 'term-agent-loop',
    slug: 'agent-loop',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Agent Loop (El Bucle del Agente)',
    description: 'Bucle de control en software gobernado por el ciclo: Decision → Action → Observation → Next Decision. Cada vuelta es una llamada HTTP independiente gobernada por el runtime.',
    content: `### El Ciclo de Control del Agente

A diferencia de un script lineal, el Agent Loop (Agent v2+) permite resolver tareas complejas de múltiples pasos dependientes:

1. **Decision:** El modelo evalúa el contexto y propone una acción.
2. **Action:** El runtime ejecuta la herramienta autorizada en la CPU.
3. **Observation:** El resultado de la herramienta se inyecta en el historial de mensajes.
4. **Next Decision:** Se comanda una nueva inferencia para evaluar si la tarea concluyó o requiere más iteraciones.

**El Modelo No Queda Corriendo:** El LLM es una función matemática sin estado; el bucle \`while\` vive y es gobernado estrictamente por el runtime en Python o TypeScript.`,
    technologies: ['Agent Loop', 'ReAct', 'Control Loop'],
    tags: ['M05', 'Agentes', 'Bucle'],
    keywords: ['agent loop', 'bucle del agente', 'react loop', 'decision action observation'],
    aliases: ['Bucle del Agente', 'Agent Loop', 'ReAct Loop'],
    relatedIds: ['term-condiciones-parada', 'term-max-iterations', 'term-execution-state'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c15',
      lessonTitle: 'Lección 03 — El Bucle del Agente',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-03-agent-loop'
    }
  },
  {
    id: 'term-condiciones-parada',
    slug: 'condiciones-de-parada',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Condiciones de Parada (Stop Conditions)',
    description: 'Mecanismos deterministas de terminación: Terminación Normal (finish_reason="stop" / Final Answer) vs Terminación Forzada por software (max_iterations).',
    content: `### Terminación Normal vs Aborto Controlado

En ingeniería de software, un bucle sin condiciones de salida deterministas es un defecto crítico de diseño.

- **Terminación Normal (Semántica):** El modelo juzga que la evidencia acumulada es suficiente, emite \`finish_reason="stop"\` con la respuesta final en lenguaje natural y concluye limpiamente.
- **Terminación Forzada (Software):** El runtime impone límites duros (\`max_iterations\`, presupuesto de llamadas) para abortar ante errores cíclicos o herramientas que devuelven fallas continuas.`,
    technologies: ['Stop Conditions', 'Safeguards'],
    tags: ['M05', 'Agentes', 'Control'],
    keywords: ['stop conditions', 'condiciones de parada', 'final answer', 'aborto controlado'],
    aliases: ['Stop Conditions', 'Criterios de Parada'],
    relatedIds: ['term-max-iterations', 'term-agent-loop', 'term-budget-controller'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c15',
      lessonTitle: 'Lección 03 — El Bucle del Agente',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-03-agent-loop'
    }
  },
  {
    id: 'term-max-iterations',
    slug: 'max-iterations',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'MAX_ITERATIONS',
    description: 'Salvaguarda dura en software que impone un techo innegociable de vueltas al Agent Loop, previniendo bucles infinitos y desastres de costos.',
    content: `### La Regla de Oro de los Bucles Agénticos

Nunca ejecutar un Agent Loop sin el parámetro \`max_iterations\` codificado rígidamente en el software.

Un LLM está entrenado para intentar resolver siempre la tarea encomendada; ante un error repetitivo de red o credenciales en una herramienta, puede insistir en llamarla indefinidamente. La responsabilidad soberana de detener el bucle pertenece al código, jamás a la IA.`,
    technologies: ['Safeguards', 'FinOps', 'Runtime'],
    tags: ['M05', 'Agentes', 'Límites'],
    keywords: ['max_iterations', 'límite de iteraciones', 'bucle infinito', 'salvaguarda'],
    aliases: ['max_iterations', 'Límite Máximo de Iteraciones'],
    relatedIds: ['term-condiciones-parada', 'term-agent-loop', 'term-budget-controller'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c15',
      lessonTitle: 'Lección 03 — El Bucle del Agente',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-03-agent-loop'
    }
  },
  {
    id: 'term-execution-state',
    slug: 'execution-state',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Execution State (Estado de Ejecución)',
    description: 'Estructura transitoria en RAM (scratchpad) que mantiene las variables de trabajo mientras el bucle está activo (run_id, messages, iteration, last_observation).',
    content: `### Execution State en Agent v3+

Representa lo que vive **exclusivamente durante una corrida**:

- Alcance: Vinculado a un \`run_id\` específico dentro de una sesión.
- Atributos: \`run_id\`, \`session_id\`, \`subject_id\`, \`messages\`, \`iteration\`, \`last_observation\`, \`termination_reason\`.
- Ciclo de vida: Nace al iniciar \`run_agent()\` y queda elegible para recolección de basura al retornar la respuesta. No sobrevive a la siguiente consulta del usuario.`,
    technologies: ['State Management', 'Dataclasses'],
    tags: ['M05', 'Agentes', 'Estado'],
    keywords: ['execution state', 'estado de ejecución', 'scratchpad', 'run_id'],
    aliases: ['ExecutionState', 'Estado de Ejecución', 'Scratchpad'],
    relatedIds: ['term-memory-store', 'term-hydration-write-back'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l04',
      lessonTitle: 'Lección 04 — Estado y Memoria',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-04-state-memory'
    }
  },
  {
    id: 'term-memory-store',
    slug: 'memory-store',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Memory Store (Almacenamiento de Memoria)',
    description: 'Sistema de persistencia duradera que retiene hechos verificados a lo largo del tiempo: Session Memory (turnos de sesión) y Persistent Memory (hechos estables del subject).',
    content: `### Axiomas No Negociables de Memoria en CASE:

1. **Context Window ≠ Memory Store:** La ventana es lo que el modelo recibe hoy; la memoria es lo que la aplicación puede recuperar mañana.
2. **Chat History ≠ Memory System:** Acumular un array infinito de logs no es recordar; es inflar tokens ciegamente.
3. **Memory Store ≠ RAG Knowledge Base:** RAG recupera conocimiento documental corporativo (M04); la memoria recupera hechos derivados de la interacción previa con el subject.`,
    technologies: ['Persistence', 'Memory Systems'],
    tags: ['M05', 'Agentes', 'Memoria'],
    keywords: ['memory store', 'memoria de sesión', 'memoria persistente', 'continuidad'],
    aliases: ['MemoryStore', 'Memoria Agéntica', 'Almacenamiento de Memoria'],
    relatedIds: ['term-execution-state', 'term-aislamiento-subject-id', 'term-hydration-write-back'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l04',
      lessonTitle: 'Lección 04 — Estado y Memoria',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-04-state-memory'
    }
  },
  {
    id: 'term-aislamiento-subject-id',
    slug: 'aislamiento-por-subject-id',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Aislamiento por Subject ID (Memory Scope)',
    description: 'Principio de seguridad multi-tenant que exige vincular cada hecho memorizado a un subject_id explícito para impedir fugas y contaminación cruzada de datos.',
    content: `### Peligro Crítico: Fuga de Contexto entre Usuarios

Si el Usuario A (subject \`USR-101\`) consulta un saldo confidencial en la Sesión 1, y el Usuario B (subject \`USR-202\`) inicia la Sesión 2 preguntando *"¿cuál es mi saldo?"*, un MemoryStore mal diseñado sin partición por \`subject_id\` filtraría la información del Usuario A al Usuario B.

El alcance de memoria es un requisito inquebrantable de seguridad bancaria y corporativa.`,
    technologies: ['Multi-Tenancy', 'Security', 'Data Isolation'],
    tags: ['M05', 'Agentes', 'Seguridad'],
    keywords: ['subject_id', 'aislamiento', 'multi-tenant', 'contaminación cruzada', 'fuga de memoria'],
    aliases: ['Memory Scope', 'Aislamiento de Memoria por Subject'],
    relatedIds: ['term-memory-store', 'term-hydration-write-back'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l04',
      lessonTitle: 'Lección 04 — Estado y Memoria',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-04-state-memory'
    }
  },
  {
    id: 'term-hydration-write-back',
    slug: 'ciclo-hydration-y-write-back',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Ciclo Hydration & Write-Back',
    description: 'Flujo de ciclo de vida de memoria en software: Hydration (recupera hechos e inicializa el estado antes del bucle) y Write-Back (clasifica y persiste información tras la respuesta).',
    content: `### El Ciclo de Memoria en Agent v3:

1. **Hydration (Antes del Loop):** El software consulta el MemoryStore con \`session_id\` y \`subject_id\`, inyecta los hechos relevantes en el prompt y construye el \`ExecutionState\`.
2. **Agent Loop (Durante la Ejecución):** El modelo y las herramientas operan sobre las variables locales en RAM.
3. **Write-Back (Después del Loop):** Al emitirse la respuesta final, la función \`write_back()\` evalúa qué hechos nuevos merecen conservarse según la \`MemoryPolicy\` y actualiza el almacenamiento duradero.`,
    technologies: ['Lifecycle', 'State Management'],
    tags: ['M05', 'Agentes', 'Ciclo de Vida'],
    keywords: ['hydration', 'write-back', 'hydrate', 'ciclo de memoria'],
    aliases: ['Hydration y Write-Back', 'Ciclo de Vida de Memoria'],
    relatedIds: ['term-execution-state', 'term-memory-store'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l04',
      lessonTitle: 'Lección 04 — Estado y Memoria',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-04-state-memory'
    }
  },
  {
    id: 'term-plan-agentico',
    slug: 'plan-agentico',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Plan Agéntico (Plan)',
    description: 'Estructura de datos observable y tipada (Goal, Steps, Status, Executor, Depends_on) gobernada por software, contrapuesta a la prosa libre del LLM.',
    content: `### "El Plan es Datos, No Pensamiento Oculto"

Planificar en ingeniería agéntica no es pedirle al LLM *"muestra tu razonamiento interno"* en un párrafo de texto libre imposible de validar por código.

En Agent v4, el plan es un modelo formal tipado:
- **Goal:** Meta inmutable asignada por el usuario.
- **Steps:** Grafo topológico de pasos (\`PlanStep\`).
- **Dependencies:** Relaciones explícitas (\`depends_on\`) verificadas antes de cada ejecución.
- **Progreso Observable:** Estados unívocos (\`PENDING\`, \`IN_PROGRESS\`, \`COMPLETED\`, \`FAILED\`, \`SKIPPED\`).`,
    technologies: ['Planning', 'Graph Data Structures'],
    tags: ['M05', 'Agentes', 'Planificación'],
    keywords: ['plan agéntico', 'task decomposition', 'planstep', 'grafo de tareas'],
    aliases: ['Plan', 'Plan Agéntico', 'Task Decomposition'],
    relatedIds: ['term-step-executor', 'term-replanning-invariante-meta', 'term-no-executable-steps'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l05',
      lessonTitle: 'Lección 05 — Planificación y Descomposición de Tareas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition'
    }
  },
  {
    id: 'term-step-executor',
    slug: 'step-executor',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'StepExecutor',
    description: 'Clasificación ontológica del ejecutor de cada paso del plan: TOOL (APIs externas), RUNTIME (lógica determinista en CPU sin costo de tokens) y MODEL (inferencia LLM).',
    content: `### Diversidad de Ejecutores en el Plan

Un error común es asumir que todo paso en un plan equivale a invocar una herramienta externa (\`Tool Call\`). En Agent v4 distinguimos tres ejecutores:

1. **\`TOOL\`:** Llamadas a servicios externos, APIs y bases de datos que generan tráfico de red.
2. **\`RUNTIME\`:** Transformaciones algorítmicas, filtrados y cálculos matemáticos ejecutados directamente en la CPU por software determinista, a costo cero de tokens.
3. **\`MODEL\`:** Tareas de síntesis cualitativa, redacción o clasificación probabilística delegadas al LLM.`,
    technologies: ['Task Execution', 'Runtime Governance'],
    tags: ['M05', 'Agentes', 'Planificación'],
    keywords: ['stepexecutor', 'tool', 'runtime', 'model', 'ejecutor'],
    aliases: ['StepExecutor', 'Ejecutor de Paso'],
    relatedIds: ['term-plan-agentico', 'term-tool-calling'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l05',
      lessonTitle: 'Lección 05 — Planificación y Descomposición de Tareas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition'
    }
  },
  {
    id: 'term-replanning-invariante-meta',
    slug: 'replanning-e-invariante-de-meta',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Replanning & Invariante de Meta',
    description: 'Replanificación ante contingencias archivando un snapshot inmutable en plan_history. Invariante: puede alterar pasos y orden, pero JAMÁS la meta original asignada.',
    content: `### Invariante de Meta en Replanificación

Cuando un paso falla (ej. 503 Service Unavailable), el agente no borra el pasado ni arranca a ciegas:

- El runtime archiva la Revisión 1 inmutable en \`state.plan_history\`.
- Se genera la Revisión 2 incorporando una estrategia alternativa (paso de fallback).
- **Invariante Absoluta:** \`revision1.goal == revision2.goal\`. El modelo puede proponer caminos diferentes, pero el software impide que mute silenciosamente el objetivo establecido por el usuario.`,
    technologies: ['Replanning', 'Fault Tolerance'],
    tags: ['M05', 'Agentes', 'Gobernanza'],
    keywords: ['replanning', 'replanificación', 'invariante de meta', 'plan history'],
    aliases: ['Replanificación', 'Replanning', 'Invariante de Meta'],
    relatedIds: ['term-plan-agentico', 'term-no-executable-steps'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l05',
      lessonTitle: 'Lección 05 — Planificación y Descomposición de Tareas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition'
    }
  },
  {
    id: 'term-no-executable-steps',
    slug: 'no-executable-steps',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'no_executable_steps (Runtime Stall)',
    description: 'Detención segura del runtime cuando un paso falla irrecuperablemente y las tareas pendientes dependen de él sin alternativa válida de replanning.',
    content: `### Detención Controlada ante Bloqueos (Runtime Stall)

Si el paso S2 falla y los pasos S3 y S4 dependen estrictamente de su resultado, un agente sin gobernanza entraría en un bucle ciego de reintentos.

El runtime de Agent v4 analiza las dependencias topológicas, detecta la imposibilidad matemática de avanzar y finaliza controladamente con \`termination_reason="no_executable_steps"\`, emitiendo un diagnóstico preciso al usuario.`,
    technologies: ['Deadlock Detection', 'Safeguards'],
    tags: ['M05', 'Agentes', 'Gobernanza'],
    keywords: ['no_executable_steps', 'runtime stall', 'estancamiento', 'dependencias bloqueadas'],
    aliases: ['Runtime Stall', 'Sin Pasos Ejecutables'],
    relatedIds: ['term-plan-agentico', 'term-condiciones-parada'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l05',
      lessonTitle: 'Lección 05 — Planificación y Descomposición de Tareas',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition'
    }
  },
  {
    id: 'term-policy-gate',
    slug: 'policy-gate',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Policy Gate (Compuerta de Políticas)',
    description: 'Capa de software determinista en el runtime que intercepta propuestas de acción antes de su despacho para dictaminar si el agente tiene autoridad legítima.',
    content: `### "Capacidad no Implica Autoridad"

Que una herramienta esté implementada en el catálogo de software y sea lógicamente correcta según el plan, no significa que el agente esté autorizado a ejecutarla en ese instante.

El **Policy Gate** intercepta toda propuesta (\`ActionProposal\`) y aplica reglas de negocio antes de tocar la CPU:
- Valida límites de monto transaccional.
- Comprueba si el usuario tiene privilegios de ejecución.
- Dictamina de forma no ambigua: \`ALLOW\`, \`REQUIRE_APPROVAL\` o \`BLOCK\`.`,
    technologies: ['Policy Gate', 'Security', 'Authorization'],
    tags: ['M05', 'Agentes', 'Políticas'],
    keywords: ['policy gate', 'compuerta de políticas', 'autoridad', 'guardrails', 'seguridad'],
    aliases: ['Policy Gate', 'Compuerta de Políticas', 'PolicyEvaluator'],
    relatedIds: ['term-policy-decision', 'term-human-in-the-loop', 'term-action-proposal'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-policy-decision',
    slug: 'policy-decision',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'PolicyDecision (ALLOW / REQUIRE_APPROVAL / BLOCK)',
    description: 'Triada canónica de decisiones deterministas de gobernanza sobre acciones propuestas por el modelo.',
    content: `### La Triada Canónica de Políticas:

1. **\`ALLOW\`:** Operaciones de bajo riesgo o lectura que el software despacha de inmediato sin pausar la ejecución.
2. **\`REQUIRE_APPROVAL\`:** Acciones mutantes o de impacto financiero/operativo medio que pausan formalmente el agente (\`PAUSED_FOR_APPROVAL\`) a la espera de autorización humana.
3. **\`BLOCK\`:** Acciones estrictamente proscritas por arquitectura (ej. reiniciar cluster en producción). El software las cancela en seco sin compuerta ni opción de override humano.`,
    technologies: ['Authorization', 'Governance'],
    tags: ['M05', 'Agentes', 'Políticas'],
    keywords: ['allow', 'require_approval', 'block', 'policydecision', 'decisiones de política'],
    aliases: ['ALLOW / REQUIRE_APPROVAL / BLOCK', 'PolicyDecision'],
    relatedIds: ['term-policy-gate', 'term-human-in-the-loop'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-action-proposal',
    slug: 'action-proposal-y-fingerprint',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'ActionProposal & action_fingerprint',
    description: 'Artefacto inmutable que congela los parámetros de una acción que requiere aprobación humana, ligado mediante un hash criptográfico SHA-256.',
    content: `### Integridad Criptográfica de la Acción Aprobada

Cuando el Policy Gate dictamina \`REQUIRE_APPROVAL\`, se genera un objeto estructurado \`ActionProposal\`:

- Se congela un snapshot exacto de la herramienta y sus argumentos.
- Se genera un \`action_fingerprint\` calculando el digest SHA-256 sobre la serialización JSON determinista de los argumentos.
- **Protección contra mutación:** Si el modelo o un atacante altera los argumentos entre la aprobación y el despacho (ej. cambia \`$250,000\` a \`$900,000\`), el hash no coincide y el runtime aborta de inmediato.`,
    technologies: ['SHA-256', 'Cryptography', 'Action Binding'],
    tags: ['M05', 'Agentes', 'Seguridad'],
    keywords: ['actionproposal', 'action_fingerprint', 'sha-256', 'action binding', 'integridad'],
    aliases: ['ActionProposal', 'Action Binding', 'Huella Criptográfica SHA-256'],
    relatedIds: ['term-policy-gate', 'term-human-in-the-loop', 'term-revalidacion-toctou'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-human-in-the-loop',
    slug: 'human-in-the-loop-hitl',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Human-in-the-Loop (HITL)',
    description: 'Protocolo formal de supervisión humana donde el runtime transiciona a PAUSED_FOR_APPROVAL a la espera de un APPROVE (ejecuta una vez) o REJECT (cancela y replanifica).',
    content: `### Human-in-the-Loop Formal

En ingeniería agéntica, HITL no es un \`input("¿Seguro? Y/N")\` rústico en la terminal. Es una transición formal de máquina de estados:

- El agente pasa a \`PAUSED_FOR_APPROVAL\`.
- Expone la \`ActionProposal\` al supervisor humano con su huella criptográfica.
- **\`APPROVE\`:** Autoriza la ejecución bajo revalidación de precondiciones.
- **\`REJECT\`:** Deniega la acción; la herramienta NUNCA se ejecuta, se inyecta una observación de rechazo y el agente replanifica o culmina limpiamente.`,
    technologies: ['State Machine', 'HITL', 'Human Oversight'],
    tags: ['M05', 'Agentes', 'HITL'],
    keywords: ['hitl', 'human in the loop', 'aprobación humana', 'paused_for_approval'],
    aliases: ['HITL', 'Human-in-the-Loop', 'Aprobación Humana'],
    relatedIds: ['term-policy-gate', 'term-action-proposal', 'term-revalidacion-toctou'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-revalidacion-toctou',
    slug: 'revalidacion-post-approval-toctou',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Revalidación Post-Approval (Semántica TOCTOU)',
    description: 'Comprobación obligatoria de precondiciones y políticas justo antes de despachar una acción aprobada por humano, mitigando condiciones Time-of-Check to Time-of-Use.',
    content: `### Mitigación de Vulnerabilidades TOCTOU

El \`action_fingerprint\` verifica que los parámetros no fueron alterados, pero **no garantiza el estado del mundo exterior**.

Entre el momento en que el humano aprobó la acción y el momento en que se despacha, el saldo pudo haberse agotado o la cuenta pudo ser congelada judicialmente. 

Por tanto, el runtime **siempre revalida** las precondiciones del entorno justo antes de la llamada a la tool.`,
    technologies: ['Concurrency', 'Security', 'TOCTOU'],
    tags: ['M05', 'Agentes', 'Seguridad'],
    keywords: ['toctou', 'revalidación post-approval', 'condición de carrera', 'precondiciones'],
    aliases: ['TOCTOU', 'Revalidación Post-Approval'],
    relatedIds: ['term-human-in-the-loop', 'term-action-proposal', 'term-proteccion-anti-replay'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-proteccion-anti-replay',
    slug: 'proteccion-anti-replay',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Protección Anti-Replay (Consumed Single-Use)',
    description: 'Mecanismo que marca una aprobación humana como consumida (consumed=True) para interceptar cualquier intento de reutilizarla en turnos posteriores.',
    content: `### Aprobaciones Humanas de un Solo Uso

Una autorización humana nunca es un cheque en blanco. Una vez que la herramienta es despachada con éxito:

- El runtime marca el registro como \`consumed = True\` e incorpora el ID a \`consumed_proposal_ids\`.
- Si el modelo o un actor malicioso intenta reutilizar el mismo identificador de aprobación en un turno siguiente, el runtime intercepta el intento con \`approval_replay_detected\` y bloquea la operación.`,
    technologies: ['Security', 'Idempotency'],
    tags: ['M05', 'Agentes', 'Seguridad'],
    keywords: ['anti-replay', 'consumo único', 'approval replay', 'seguridad transaccional'],
    aliases: ['Anti-Replay', 'Aprobación de Uso Único'],
    relatedIds: ['term-human-in-the-loop', 'term-action-proposal'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-budget-controller',
    slug: 'budget-controller-y-circuit-breakers',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'BudgetController & Circuit Breakers',
    description: 'Disyuntores de software que imponen límites operativos de llamadas a herramientas, iteraciones y fallos consecutivos (termination_reason="budget_exceeded").',
    content: `### Disyuntores Operacionales (Circuit Breakers)

Incluso con un plan válido, un agente puede quedar atrapado en secuencias de fallos en cadena. El **BudgetController** actúa como fusible:

- Límite duro de iteraciones totales.
- Límite duro de llamadas acumuladas a herramientas.
- Disyuntor ante fallos consecutivos de tools.
- Si se excede cualquier umbral, aborta la ejecución con \`termination_reason="budget_exceeded"\`, protegiendo la infraestructura y el presupuesto.`,
    technologies: ['Circuit Breakers', 'FinOps', 'Resilience'],
    tags: ['M05', 'Agentes', 'Control'],
    keywords: ['budgetcontroller', 'circuit breakers', 'disyuntores', 'budget exceeded'],
    aliases: ['BudgetController', 'Disyuntores de Presupuesto', 'Circuit Breakers'],
    relatedIds: ['term-max-iterations', 'term-condiciones-parada'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l06',
      lessonTitle: 'Lección 06 — Guardrails & Human-in-the-Loop',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl'
    }
  },
  {
    id: 'term-structured-agent-tracing',
    slug: 'structured-agent-tracing',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Structured Agent Tracing',
    description: 'Modelado formal de la trayectoria del agente mediante TraceEvents tipados con timestamps ISO 8601, run_id y sequence_no monotónico para auditoría y evaluación.',
    content: `### "Tracing Agéntico ≠ Logging de Consola"

El logging libre (\`logger.info("Tool called")\`) produce texto para diagnóstico humano que no permite aserciones programáticas ni detección de regresiones.

El **Structured Agent Tracing** produce eventos tipados:
- \`run_id\`: Correlaciona todos los eventos de una corrida específica.
- \`sequence_no\`: Orden monotónico estricto que permite reconstruir la causalidad de decisiones.
- Permite verificar automáticamente: *¿Se llamó la tool solo después de que la política dictaminó ALLOW?*`,
    technologies: ['Observability', 'Tracing', 'Audit'],
    tags: ['M05', 'Agentes', 'Observabilidad'],
    keywords: ['structured agent tracing', 'traceevent', 'trazabilidad', 'observabilidad'],
    aliases: ['Tracing Agéntico', 'Trazabilidad Estructurada'],
    relatedIds: ['term-outcome-vs-trajectory', 'term-golden-cases-evaluador'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l07',
      lessonTitle: 'Lección 07 — Observabilidad y Evaluación Agéntica',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-07-observability-evaluation'
    }
  },
  {
    id: 'term-outcome-vs-trajectory',
    slug: 'outcome-vs-trajectory',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Outcome vs Trajectory (Resultado vs Trayectoria)',
    description: 'Las dos dimensiones independientes de evaluación agéntica: Outcome (qué resultado obtuvo) frente a Trajectory (cómo llegó a él: pasos, políticas y eficiencia).',
    content: `### La Paradoja de la Respuesta Final

Un agente que consulta 8 veces la misma base de datos, falla 3 veces y gasta 10× más tokens y latencia puede dar exactamente la misma respuesta final que un agente eficiente.

- **Evaluado solo por el Outcome:** Ambos agentes parecen idénticos.
- **Evaluado por la Trajectory:** El primero es un desastre operacional inaceptable en producción.
- Una evaluación rigurosa califica dimensiones independientes: Tasa de éxito de tarea, apego a políticas (cero violaciones toleradas) y eficiencia de pasos.`,
    technologies: ['Evaluation', 'Benchmarking'],
    tags: ['M05', 'Agentes', 'Evaluación'],
    keywords: ['outcome vs trajectory', 'paradoja de respuesta final', 'evaluación agéntica', 'trayectoria'],
    aliases: ['Resultado vs Trayectoria', 'Outcome vs Trajectory'],
    relatedIds: ['term-structured-agent-tracing', 'term-golden-cases-evaluador'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l07',
      lessonTitle: 'Lección 07 — Observabilidad y Evaluación Agéntica',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-07-observability-evaluation'
    }
  },
  {
    id: 'term-golden-cases-evaluador',
    slug: 'golden-cases-y-evaluador-determinista',
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: NOW,
    updatedAt: NOW,
    author: 'CASE Academy',
    type: 'CONCEPT',
    difficulty: 'ADVANCED',
    title: 'Golden Cases & Evaluador Determinista',
    description: 'Suite de pruebas de regresión automatizadas que ejecuta aserciones deterministas sobre la traza de eventos para certificar la seguridad y robustez del agente.',
    content: `### Certificación y Detección de Regresiones

El **AgentEvaluator** no evalúa el agente leyendo su respuesta con "subjective vibes". Ejecuta una batería de Golden Cases con aserciones deterministas de software:

- ¿Se emitió \`RUN_STARTED\` y concluyó con \`RUN_FINISHED\`?
- ¿El orden de \`TOOL_CALLED\` refleja la secuencia topológica del plan?
- ¿Toda acción mutante estuvo precedida por \`APPROVAL_REQUESTED\` y \`POLICY_EVALUATED\`?
- ¿Ante un veredicto de \`BLOCK\`, jamás se despachó la herramienta prohibida?

Permite certificar nuevas versiones en CI/CD con reportes legibles de regresión.`,
    technologies: ['Automated Testing', 'CI/CD', 'Golden Dataset'],
    tags: ['M05', 'Agentes', 'Testing'],
    keywords: ['golden cases', 'agentevaluator', 'aserciones deterministas', 'detección de regresiones'],
    aliases: ['Golden Cases', 'Evaluador Determinista', 'AgentEvaluator'],
    relatedIds: ['term-structured-agent-tracing', 'term-outcome-vs-trajectory'],
    metadata: {
      moduleId: 'm5',
      moduleTitle: '05. Agentes de IA',
      lessonId: 'c-m5-l07',
      lessonTitle: 'Lección 07 — Observabilidad y Evaluación Agéntica',
      academyRoute: '/academy/modules/m05-ai-agents/lesson-07-observability-evaluation'
    }
  }
];
