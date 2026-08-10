# Demo 08 — The Eval Pipeline (Instructor Guide)

## 1. Propósito de la Demo
Demostrar el concepto de **LLM-as-a-Judge** y hacer que la clase experimente el dolor y la necesidad de usar Datasets estructurados en lugar del obsoleto y peligroso *Eyeballing* (Evaluación visual manual). 

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Tras finalizar la Lesson 02 (Evaluation Hierarchy) y antes de la Lesson 03.
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Plantea a la clase el escenario: Tienen un Agente encargado de extraer la ciudad y el monto de un texto libre proporcionado por el usuario, devolviéndolo siempre en formato JSON. El contrato estricto es que debe usar la clave `amount` en USD.

Muestra un pequeño archivo Excel/CSV o JSON (El **Golden Dataset** micro):
1. `Input`: "Pagué 50 euros en Madrid" -> `Expected_Output`: `{"city": "Madrid", "amount": 54.5}` (Asumiendo tipo de cambio).
2. `Input`: "Gané 100 dólares en Tokio" -> `Expected_Output`: `{"city": "Tokio", "amount": 100}`

### Paso 2: El Fracaso del Código Determinista
1. Pide al modelo base que resuelva el caso 1 usando un prompt ingenuo.
2. La IA genera: `{"ciudad": "Madrid", "monto_usd": 54.5}`
3. Muestra cómo un test unitario determinista en Python que busque explícitamente `json_data["amount"]` arrojará un error `KeyError` (Fallo Duro), a pesar de que el modelo entendió la semántica correctamente. 
4. Reflexión: El código determinista es ciego a la semántica.

### Paso 3: El Peligro del LLM Juez Mal Configurado (False Pass)
1. Escribe un prompt para el **LLM-as-a-Judge** (El Evaluador): 
   *"Evalúa si la respuesta generada extrae los datos correctamente."*
2. Pasa la respuesta generada: `{"ciudad": "Madrid", "monto_usd": 54.5}` y el Ground Truth: `{"city": "Madrid", "amount": 54.5}`.
3. El LLM-as-a-Judge responderá: `"PUNTUACIÓN 1/1. La respuesta es correcta porque contiene la ciudad de Madrid y el monto convertido."`
4. **Lo que debes destacar (El Momento 'Aha!'):** ¡Alerta roja! El Juez acaba de conceder un **Falso Positivo (False Pass)**. El modelo extrajo bien la semántica, pero rompió el contrato de las claves JSON (`ciudad` vs `city`). Si este Eval pasa, la aplicación frontend en Producción colapsará cuando intente leer la variable `amount`. 

### Paso 4: El Juez Implacable (El Pipeline Correcto)
1. Corrige el Prompt del Juez (LLM-as-a-Judge):
   *"Eres un evaluador implacable. Debes verificar DOS cosas estrictamente: 1. Equivalencia semántica (¿Es el mismo monto y ciudad?). 2. Equivalencia de esquema (¿Usa exactamente las claves 'city' y 'amount'?). Devuelve 0 si falla cualquiera de las dos."*
2. Vuelve a correr el evaluador.
3. El LLM-as-a-Judge responderá: `"PUNTUACIÓN 0/1. Equivalencia semántica: SÍ. Equivalencia de esquema: NO (Usó 'ciudad' en lugar de 'city')."`
4. Concluye: Ahora sí tienen un guardián automatizado listo para Producción (Deployment Gate).

## 4. Puntos de Discusión a provocar
- "Si un ingeniero junior modifica el prompt para que el agente sea más rápido, pero rompe accidentalmente el esquema del JSON... ¿cómo nos enteraríamos en Producción si no tuviéramos este Juez automatizado?" (Respuesta: Nos enteraríamos cuando los clientes reporten que el botón de pago dejó de funcionar).
- "El LLM-as-a-Judge también es un LLM, por tanto, también alucina y tiene comportamiento probabilístico. ¿Cómo nos aseguramos de que el Juez es confiable a largo plazo?" (Respuesta: Evaluamos al evaluador. Mediante *Human Review* cruzado esporádico y *Golden Datasets* para el propio Juez).

## 5. Transición al Lab
"Probar dos cadenas de texto en pantalla es fácil. En el mundo real, necesitamos consolidar la seguridad (M07), las métricas operativas (Costos/Latencia) y los Evals de calidad en un documento único que frene o autorice un despliegue masivo. Eso es el Production Readiness Review. Vamos a redactarlo en el último Lab."
