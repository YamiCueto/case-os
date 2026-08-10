# Lesson 02 — Reasoning Patterns

## 1. Propósito de la clase
Enseñar cómo utilizar patrones estructurados (ejemplos y pensamiento paso a paso) para estabilizar el comportamiento del modelo cuando las instrucciones puras no son suficientes. Especial atención en NO enseñar *Chain of Thought* como un "razonamiento mágico", sino como un despliegue de cálculo intermedio probabilístico.

## 2. Qué debe aprender el estudiante
- Entender por qué un ejemplo (Few-Shot) reduce matemáticamente la ambigüedad mejor que un párrafo de instrucciones.
- Aplicar *Chain of Thought (CoT)* no para "hacer pensar" al modelo, sino para darle espacio de tokens donde calcular el resultado correcto.
- Reconocer los límites operativos de estos patrones (latencia, costo, token limits).

### 3.1 Few-Shot Alignment (Ejemplos)
El modelo es un motor estadístico de reconocimiento de patrones. Mostrarle el patrón deseado (Input A -> Output B) provee **evidencia adicional de cómo interpretar la tarea**, no una garantía de determinismo.

La progresión de un contrato robusto es:
- **Instruction:** define qué hacer.
- **Examples (Few-Shot):** muestran cómo interpretar la tarea.
- **Constraints:** reducen grados de libertad.
- **Schema:** hace verificable la forma del resultado.
- **Validation:** comprueba lo producido en el código fuente.

#### Concept Analogy: Few-Shot (Ejemplos)
- **Analogía cotidiana:** Contratar a un diseñador dándole un *moodboard* vs darle un manual de reglas de color.
- **Mapeo:** El manual de reglas es la instrucción larga (Zero-Shot). El moodboard (imágenes de referencia) es el Few-Shot.
- **Límite de la analogía:** Un diseñador humano extrae la "vibra" o el "estilo" general. El modelo extrae el patrón sintáctico exacto (si usas comillas dobles en el ejemplo, la probabilidad de usar comillas dobles en la salida se dispara). Aún así, los ejemplos son solo una gran influencia estadística, no reglas inmutables.
- **Traducción técnica:** Condicionamiento de la probabilidad previa (Priors) mediante patrones repetidos en el contexto.
- **Ejemplo aplicado a SWE:** Querer que un modelo convierta fechas de "DD/MM/YYYY" a "ISO8601". Escribir 3 reglas de conversión falla el 5% de las veces. Dar 3 ejemplos (`Input: 12/05/2020 -> Output: 2020-05-12T00:00:00Z`) proporciona evidencia clara del output deseado, aumentando la probabilidad de acierto casi al 100%, aunque sin asegurar determinismo físico.

### 3.2 Chain of Thought (CoT)
Obligar al modelo a desglosar los pasos intermedios antes de dar la respuesta final. 

#### Concept Analogy: Chain of Thought
- **Analogía cotidiana:** Obligar a un estudiante de matemáticas a escribir el desarrollo de la ecuación en la hoja antes de escribir el resultado final.
- **Mapeo:** Escribir el desarrollo en la hoja es generar los tokens de razonamiento (`<thinking>...`). El resultado final es la respuesta (`<answer>...`).
- **Límite de la analogía:** El estudiante razona mentalmente y luego escribe. El modelo *razona al escribir*. Si no genera los tokens intermedios, el "cálculo" no ocurre, porque su única forma de procesar es predecir la siguiente palabra basada en las anteriores.
- **Traducción técnica:** Extender el camino computacional (computational path) permitiendo que tokens intermedios condicionen la precisión de la predicción final.
- **Ejemplo aplicado a SWE:** Si le pides al LLM "Dime si este refactor introduce un bug", puede fallar. Si le dices "Lista las variables modificadas, analiza su scope, determina si hay colisión, y luego dime si hay bug", la probabilidad de acierto aumenta drásticamente.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Chain of Thought significa que el modelo está razonando lógicamente como un humano y dándose cuenta de sus propios errores"*.
**Consecuencia:** Confiará ciegamente en el output final porque "el modelo explicó su lógica perfectamente". La realidad es que el LLM puede generar una cadena de pensamiento plausible, llena de argumentos falsos, que justifica perfectamente un resultado erróneo (racionalización de la alucinación). 

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Si muestras un ejemplo claro o pides ir paso a paso, reduces las adivinanzas.
- **Mecanismo:** Cada token generado se convierte en contexto para el siguiente. CoT inyecta tokens correctos intermedios que actúan como escalones estadísticos hacia la respuesta correcta, en lugar de intentar un salto estadístico masivo de una sola predicción.
- **Consecuencia de ingeniería:** Intercambiamos latencia y costo (más tokens generados) por mayor precisión. Diseñamos sistemas que ocultan la "cadena de pensamiento" al usuario final y solo extraen el bloque de respuesta.

## 6. Ejemplo técnico
**Zero-Shot (Falla en cálculos):**
`Calcula el impacto en latencia de sumar 3 servicios, si el primero tarda 10ms, el segundo el doble del primero, y el tercero el promedio de los dos primeros.`
*(El modelo falla intentando generar la respuesta final de inmediato).*

**CoT + Few-Shot (Contrato Robusto):**
```text
Sigue estos pasos en un bloque <scratchpad>:
1. Lista los valores conocidos.
2. Calcula los valores dependientes.
3. Suma el total.
Luego entrega solo el número final en <result>.
```

## 7. Ejemplo aplicado a Software Engineering
Diseñar un bot de Code Review. Si el bot simplemente da "Aprobado/Rechazado", sufre alucinaciones altas. Si la arquitectura obliga al bot a emitir un JSON con `{"analysis_steps": ["..."], "final_decision": "..."}`, la etapa de `analysis_steps` actúa como CoT y estabiliza drásticamente la `final_decision`.

## 8. Errores conceptuales frecuentes
- **"Más ejemplos (Few-Shot) siempre es mejor"**: No. Si das ejemplos contradictorios o con errores tipográficos sutiles, el modelo aprenderá el error estadísticamente. Calidad > Cantidad.
- **"El modelo corrigió su pensamiento"**: No. El modelo no "retrocede" (sin frameworks avanzados tipo Tree of Thoughts). Simplemente sigue generando texto que parece una corrección.

## 9. Preguntas para el grupo
- "Sabiendo que Chain of Thought multiplica el consumo de tokens (y por ende el costo y la latencia), ¿en qué tipo de features de su producto jamás lo usarían?" (Ej: Autocomplete en tiempo real).
- "¿Por qué un ejemplo 'Zero-Shot' es más peligroso para un pipeline de datos que un 'Few-Shot'?"

## 10. Mini ejercicio
Pide al grupo que tome una tarea de clasificación (ej: "Clasificar el riesgo de un despliegue") y redacten un prompt usando *Few-Shot*. Tienen que inventar 2 ejemplos donde quede clarísimo el formato de entrada y salida esperado.

## 11. Demo relacionada
*(Se puede usar Demo 02 para comparar en vivo cómo falla una petición matemática sin CoT vs con CoT).*

## 12. Discusión
CoT y Few-Shot no son "magia". Son manipulaciones explícitas de la ventana de contexto para forzar la estadística a nuestro favor. La ingeniería consiste en saber cuándo el costo de esta manipulación vale la pena frente a escribir código tradicional.

## 13. Preparación para la siguiente clase
"Ya logramos que el modelo razone mejor y entienda nuestros patrones. Pero si todo lo devuelve como texto libre mezclado con su razonamiento, nuestro código de backend explotará al intentar hacer un `JSON.parse`. En la lección 3 forzaremos la salida a un esquema estricto y la validaremos."
