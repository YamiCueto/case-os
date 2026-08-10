# Module 01: AI Foundations

## MODULE BRIEF

**Purpose**
Desmitificar el funcionamiento de los Modelos de Lenguaje Grande (LLMs) para ingenieros de software, trasladando su comprensión del campo de la "magia/marketing" al campo de la probabilidad y la ingeniería de sistemas. Establecer el fundamento filosófico del curso: la IA no elimina la ingeniería, la reubica.

**Prerequisites**
Ninguno tecnológico específico de IA. Se asume experiencia previa en desarrollo de software, arquitectura o análisis de sistemas (Seniority Mid-Senior).

**Learning outcomes**
Al finalizar este módulo, el estudiante será capaz de:
- Explicar qué es un token y cómo la predicción del siguiente token genera comportamiento.
- Distinguir de forma inequívoca entre lógica determinista (código tradicional) y comportamiento probabilístico (modelos).
- Identificar los riesgos de inferencia y alucinación en un caso de uso real.
- Analizar una rutina legacy y diseñar una frontera de integración de IA segura.

**Suggested duration**
2 horas teóricas + 1 hora de Real Engineering Lab.

**Teaching strategy**
Contraste constante. A lo largo del módulo, el instructor debe comparar cómo resolvemos un problema en software tradicional (ej. `if/else`, bases de datos, APIs de contratos estrictos) frente a cómo se comporta un modelo (probabilidad, aproximación semántica, falta de estado explícito). 

**Concept dependencies**
Ninguna. Este módulo es la base del curso.

**Curriculum Components**
- [Lesson 01: De Código a Probabilidad](./lesson-01.md)
- [Lesson 02: Inferencia y Alucinación](./lesson-02.md)
- [Lesson 03: Pensamiento de Sistemas](./lesson-03.md)
- [Demo 01: Token Playground](./demo-01.md)
- [Lab 01: Analyze a Legacy Routine](./lab-01.md)

---

## Instructor Notes

**El Tema Central (Qué enfatizar)**
> "La IA no reemplaza el razonamiento de ingeniería; cambia dónde y cómo debemos ejercerlo."
Este es el momento de plantear el problema fundamental de la industria hoy: tratar a la IA como una caja negra mágica. Tu trabajo es abrir la caja negra y mostrar probabilidad pura.

**Qué NO explicar todavía**
- No expliques RAG, embeddings ni bases de datos vectoriales. Eso pertenece a M03 y M04.
- No entres en detalles de cómo hacer un buen prompt. Solo muestra que las instrucciones guían la probabilidad. Prompt Engineering es M02.
- Evita debates sobre AGI o la consciencia de los modelos. Mantén la clase estrictamente en el dominio de la ingeniería de software pragmática.

**Common misconceptions (Errores comunes)**
- *El modelo "piensa" o "busca en internet".* (Falso: calcula probabilidades de secuencias de tokens).
- *El modelo "sabe" cosas con certeza.* (Falso: asocia patrones frecuentes).

**Intervenciones si el grupo está pasivo**
- "En sus proyectos actuales, ¿qué proceso de negocio colapsaría si el sistema de pronto diera una respuesta con un 5% de error impredecible?"
- "¿Por qué no podemos simplemente poner un `try-catch` a una alucinación?"

**Module transition (Hacia M02)**
Cierra el módulo evidenciando un problema: "Hemos visto que el modelo es puramente probabilístico. Eso significa que por defecto es caótico. ¿Cómo construimos software corporativo sobre una base caótica? Necesitamos contratos. En la siguiente clase (M02) aprenderemos a forzar al modelo a comportarse de manera determinista mediante Prompt Engineering avanzado."
