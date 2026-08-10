# Lesson 01 — Anatomy of Context

## 1. Propósito de la clase
Establecer el concepto de **Minimum Useful Context** (Contexto Mínimo Útil). Enseñar a los ingenieros que el éxito de un sistema de IA no radica en inyectar toda la información disponible, sino en seleccionar únicamente la información indispensable para resolver la tarea en curso.

## 2. Qué debe aprender el estudiante
- Diferenciar entre contexto "relevante" (habla del tema) y contexto "necesario" (indispensable para tomar la decisión).
- Comprender que el contexto en IA corporativa no es solo texto estático, sino un estado dinámico que ensambla el backend (perfil del usuario, fecha actual, logs recientes, resultados de base de datos).
- Reconocer las seis fuentes de contexto (User Input, System State, Environmental Data, Knowledge Base, Execution History, Tool Outputs).

## 3. Conceptos fundamentales

### 3.1 Minimum Useful Context (Contexto Mínimo Útil)
El principio de diseño que dicta que el prompt (contrato) debe recibir la menor cantidad de tokens de contexto posibles que aún garanticen una ejecución correcta y sin alucinaciones de la tarea.

#### Concept Analogy: Minimum Useful Context
- **Analogía cotidiana:** El expediente de un caso judicial entregado a un juez para que dicte sentencia sobre una multa de tránsito.
- **Mapeo:** El LLM es el juez. La tarea es decidir la multa. El Minimum Useful Context es la foto de la infracción y la ley específica vigente.
- **Límite de la analogía:** Un juez humano puede hojear rápidamente documentos irrelevantes sin confundirse. El LLM, al procesar probabilísticamente, puede usar fragmentos del texto irrelevante para diluir su atención o "alucinar" conexiones que no existen.
- **Traducción técnica:** Maximizar la densidad de señal (*Signal-to-Noise ratio*) en la ventana de contexto.
- **Ejemplo aplicado a SWE:** Si vas a pedirle al modelo que escriba un test unitario para la función `calculateDiscount()`, pasarle toda la clase `PaymentProcessor.ts` de 2000 líneas añade riesgo y costo. Pasarle solo la firma de la función `calculateDiscount` y la interfaz del `User` es el Minimum Useful Context.

### 3.2 Relevancia vs Necesidad
Un archivo puede estar altamente relacionado con el tema (Relevante), pero no ser útil para la acción específica que el modelo debe ejecutar (Innecesario).

#### Concept Analogy: Relevante vs Necesario
- **Analogía cotidiana:** Llevar un manual de supervivencia en la nieve (Relevante para "supervivencia") a una excursión en el desierto (Innecesario para la tarea).
- **Mapeo:** El manual de supervivencia es el documento recuperado por una búsqueda semántica. El desierto es el problema real del usuario.
- **Límite de la analogía:** En el mundo físico, el manual solo pesa en tu mochila. En el LLM, el modelo podría intentar aplicar técnicas de nieve (generar código incorrecto) porque la información está presente en su "memoria de trabajo".
- **Traducción técnica:** Poda de contexto (Context Pruning) post-retrieval.
- **Ejemplo aplicado a SWE:** Un usuario pregunta por un bug en la versión 3.0. Recuperas la documentación de la versión 1.0 y 2.0. Son "relevantes" semánticamente (hablan del mismo módulo), pero son "innecesarias" e introducirán código obsoleto en la respuesta.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Si el modelo necesita información de la base de código, entonces debemos entregarle todos los archivos relacionados con el módulo para asegurarnos de que no le falte nada."*
**Consecuencia:** Inyectarás archivos indirectamente relacionados, código desactualizado, e información sensible. Esto satura el *Token Budget*, multiplica la latencia y la factura de la API, y aumenta drásticamente la probabilidad de que el modelo use una función deprecada que venía en un archivo secundario, arruinando el resultado.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Si me das mucha información mezclada, tardo más en leerla y me cuesta encontrar el dato clave.
- **Mecanismo:** La atención del Transformer (Self-Attention) calcula la relación de cada token con todos los demás. Si añades 10,000 tokens de ruido (código irrelevante), el mecanismo matemático dispersa los pesos de atención, diluyendo la importancia de los 50 tokens que realmente importaban.
- **Consecuencia de ingeniería:** La inyección de contexto exige una capa arquitectónica previa al LLM encargada exclusivamente de filtrar, truncar y componer solo lo estrictamente necesario (el *Context Manifest*).

## 6. Ejemplo técnico
**Malo (Contexto Máximo):**
`Input: <user_question> <entire_database_dump> <full_api_documentation>`

**Bueno (Minimum Useful Context):**
```xml
<context>
  <user_tier>premium</user_tier>
  <current_date>2023-10-27</current_date>
  <relevant_function_signature>function process(id: string): boolean</relevant_function_signature>
</context>
<question>...</question>
```

## 7. Ejemplo aplicado a Software Engineering
Un agente de soporte técnico (LLM) que atiende a un usuario autenticado. En lugar de pedirle al usuario que describa su problema, el código backend intercepta la petición, busca en la base de datos el historial del usuario, sus últimos 3 clicks (System State) y lo empaqueta como contexto invisible. El modelo responde perfectamente sin necesidad de "más información".

## 8. Errores conceptuales frecuentes
- **"El LLM tiene memoria"**: El modelo base no tiene memoria. El "contexto" es la memoria de trabajo que tú, como arquitecto, inyectas en cada transacción HTTP.
- **"El RAG (Retrieval) solucionará el contexto"**: RAG solo recupera candidatos. Context Engineering determina cómo se ensamblan esos candidatos con el estado del sistema.

## 9. Preguntas para el grupo
- "Piensen en la última vez que un modelo generó código con una versión de librería equivocada. ¿Fue culpa del modelo, o fue culpa del contexto (no se inyectó el `package.json` actual)?"
- "¿Cuáles son los riesgos de seguridad si inyectamos 'todo lo relevante' en el prompt sin un filtro determinista previo?"

## 10. Mini ejercicio
Pide al grupo que esbocen qué piezas de información (Context Manifest) necesitaría inyectarse en el prompt para que un LLM responda correctamente a un cliente de e-commerce que pregunta: *"¿Dónde está el pedido que hice ayer?"* (Respuestas esperadas: User_ID, Order_Status, Shipping_Tracking_URL, Current_Date).

## 11. Demo relacionada
*(Se utilizará Demo 03 más adelante)*.

## 12. Discusión
Cambiar el paradigma: de "Escribir Prompts" a "Diseñar Contextos". Un ingeniero de IA invierte el 10% de su tiempo escribiendo la instrucción (M02) y el 90% programando las tuberías de datos para llenar el contexto (M03 y M04).

## 13. Preparación para la siguiente clase
"Ahora que sabemos que solo debemos usar el contexto mínimo útil, surge un problema físico: la información compite por el espacio. En la siguiente clase veremos cómo ensamblar este rompecabezas, priorizar la información y decidir qué descartar cuando nos quedamos sin espacio (Token Budget)."
