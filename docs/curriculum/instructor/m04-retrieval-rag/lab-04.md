# Lab 04 — Build a Retrieval Strategy (Instructor Guide)

## Engineering Problem
Los ingenieros de software a menudo implementan herramientas complejas de bases de datos vectoriales sin medir primero si pueden encontrar el documento correcto para las preguntas de los usuarios. Desarrollan RAG "basado en vibras" (Vibes-based RAG) probándolo manualmente con 2 o 3 peticiones. Cuando el sistema falla en producción, no tienen forma de saber si fue culpa de la IA o de la base de datos.

## Learning Objectives
- Diseñar una Especificación de Búsqueda (*Retrieval Specification*) disociada de la base de datos vectorial concreta.
- Construir un micro-benchmark pedagógico (Golden Dataset de 5 *queries*) con *ground truth* para hacer visibles los fallos de retrieval.
- Aplicar la disciplina de evaluar *Precision* y *Recall* sin depender de un LLM.

## Scenario
El estudiante actúa como un Data Engineer/Search Engineer. Va a continuar con su proyecto (Lab 01-03). Ya tiene su *Context Manifest* (M03), el cual dicta qué piezas de información necesita el sistema. Su misión ahora es diseñar la arquitectura de cómo se generarán los candidatos para cubrir la necesidad más difícil de ese manifiesto, y cómo medirá matemáticamente el éxito antes de inyectarlo en el LLM.

## Constraints
- **Trabajo local:** Toda la documentación se genera en sus propios archivos de diseño.
- **Prohibido el Prompting:** Cero palabras mágicas. Están diseñando tuberías de búsqueda y *tests unitarios* para datos.
- **Independencia Tecnológica:** La especificación no debe decir "Usar Pinecone" o "Usar ChromaDB", sino "Usar búsqueda híbrida con BM25 y Embedding Model X".

## Starting Point
Crear un archivo `retrieval-spec.md` en su entorno local.

## Engineering Decision (El Núcleo del Lab)
El estudiante debe definir:
1. **La Estrategia de Chunking:** ¿Cómo partirá sus documentos de origen? (Ej. "Por encabezado H2 en Markdown, asegurando 15% de overlap").
2. **El Pipeline de Retrieval:** Definir en seudocódigo o diagrama las fases: ¿Búsqueda densa (vectores) + Búsqueda esparcida (BM25)? ¿Qué tamaño tendrá el `Top-K` inicial? ¿Habrá re-ranking cruzado (Cross-Encoder)? ¿Cuántos documentos sobreviven para el *Context Assembly* final?

## Autonomy Test
¿Puede otra persona leer la especificación, aplicarla en código (Python/TS), y el resultado será determinista? ¿O la especificación es vaga y ambigua?

## Tool Contract
El entregable principal es el **Benchmark Dataset (Test Suite)**.
Instrucciones para el estudiante:
1. Define 5 preguntas reales y difíciles que los usuarios harían a tu sistema.
2. Identifica en tu repositorio de conocimiento corporativo el documento/ID exacto que responde perfectamente cada pregunta (este es tu *Ground Truth*).
3. Diseña el formato de tu *test*: "Si ejecuto la Pregunta 1 con la estrategia X, y el Documento Y no aparece en el Top-5, mi Recall ha fallado y el Test falla."

## Guardrails
La advertencia crítica del instructor: "Si sus 5 preguntas de prueba son exactamente iguales a los títulos de sus documentos, están haciendo trampa. Los usuarios reales preguntan con errores, jergas y ambigüedades."

## Human-in-the-Loop
Intercambio de pares. El estudiante A lee las 5 preguntas del estudiante B, y le intenta hacer una pregunta que no esté cubierta (Edge Case). El estudiante B debe argumentar cómo su pipeline (ej. mediante Re-ranking) descartaría documentos irrelevantes para esa pregunta.

## Failure & Recovery
Si el pipeline diseñado es puramente "Búsqueda Vectorial K=3", el instructor debe señalar el fracaso probable: "Un 30% de las veces fallarás en Recall. Necesitas diseñar una red más grande (K=20) y luego filtrar (Select)."

## Expected Artifact
Un documento `retrieval-spec.md` que contenga:
1. **Chunking Strategy:** (Reglas de partición).
2. **Pipeline Architecture:** (Pasos desde la query hasta los candidatos finales seleccionados).
3. **Golden Dataset (Benchmark):** Una tabla con 5 filas: `[Query_Usuario] -> [Documento_Esperado_ID]`.

## Instructor Guidance
### Cómo iniciar el Lab:
"El Módulo 03 les enseñó qué inyectar. Hoy construirán la tubería que busca eso en la oscuridad. Recuerden nuestra Regla de Oro: Retrieval propone candidatos, no decide el contexto final. Queremos una red amplia (alto Recall) filtrada rigurosamente (alta Precisión) antes de dársela al LLM."

### Mientras trabajan:
Vigila a los que empiezan a escribir código Python de `langchain`. Detenlos. Diles: "Diseñen la arquitectura primero. Si no saben cómo van a medir el éxito (Golden Dataset), escribir código de Langchain solo les dará fallos más rápidos que no podrán depurar."

## Common Student Mistakes
- Asumir que "RAG" significa usar una librería en 3 líneas de código y confiar ciegamente en sus algoritmos por defecto de chunking por caracteres.
- Escribir pruebas evaluando la "respuesta del LLM" en lugar de evaluar si el "ID del documento correcto apareció en el Top-K".

## Review Checklist
Antes de cerrar la clase:
- [ ] ¿Quién incluyó una fase de "Re-ranking" o filtrado en su pipeline en lugar de mandar el Top-K crudo?
- [ ] ¿Alguien creó una pregunta en su benchmark que deliberadamente requiera dos documentos distintos para ser respondida? (Multi-hop retrieval).

## Discussion Questions
Para cerrar el Lab y preparar el siguiente módulo:
- "Han automatizado la generación de respuestas. Pero, ¿qué ocurre si el documento dice 'Para cancelar, presiona el botón X', y el usuario quiere que el sistema realmente *presione* ese botón por él? La búsqueda de conocimiento ya no alcanza. Necesitamos acción. Necesitamos agentes."

## Extension Exercise
*(Puente a M05)*: Pedirles que escriban un flujo lógico donde la IA decide por sí sola *cuándo* usar la herramienta de Retrieval, y *cuándo* usar una herramienta para consultar el clima.
