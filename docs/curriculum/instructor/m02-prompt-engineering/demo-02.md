# Demo 02 — Diseñar la Instrucción (Guía del Instructor)

## 1. Propósito de la Demo
Esta demostración experimental y guiada tiene como objetivo mostrar a los estudiantes por qué una respuesta "correcta" para un ser humano no es necesariamente una respuesta válida para un programa de software. Enseña visualmente la diferencia entre enviar texto libre (conversacional) y diseñar un contrato de comportamiento estructurado para un sistema automatizado.

## 2. Ubicación en el Flujo de la Clase
- **Momento ideal:** Durante o inmediatamente después de la Lección 01 (Comportamiento Confiable).
- **Duración sugerida:** 15 minutos.
- **Contexto técnico:** Es importante que el instructor sepa que esta demostración **utiliza una simulación educativa local en TypeScript** para el comportamiento probabilístico del LLM (con el fin de no depender de claves de API en el entorno de demostración), pero **utiliza un validador real y determinista** para procesar la salida.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Abre la plataforma CASE Academy y navega a `Demo 02`. Explica a la clase la configuración del escenario: "Tenemos un código defectuoso que no valida si el nombre de un usuario existe antes de guardarlo en la base de datos. Queremos que el LLM lo detecte y se lo comunique a nuestro sistema".

Señala la nota sobre la **Simulación Educativa** para mantener la transparencia: "Vamos a observar el comportamiento esperado del LLM simulado localmente, pero pasándolo por un motor de validación estricto".

### Paso 2: Experimento 1 (Instrucción Simple)
1. Selecciona el **Experimento 1**.
2. Lee la instrucción por defecto: *"Analiza el siguiente código y dime qué está mal."*
3. Ejecuta la instrucción.
4. **Lo que debes destacar:** 
   - El modelo (simulado) responde en lenguaje natural ("He analizado el código..."). Para un humano, la respuesta es perfecta e identifica el problema.
   - Observen la sección de **Flujo de Validación**: falla estrepitosamente porque el sistema intenta procesar ese texto con `JSON.parse()`.
   - **Conclusión del Paso:** "El modelo respondió correctamente para una persona, pero nuestro software no puede consumir esta respuesta."

### Paso 3: Experimento 2 (Solicitar JSON)
1. Selecciona el **Experimento 2**.
2. Lee la nueva instrucción: *"Analiza el siguiente código y devuelve el resultado como JSON."*
3. Ejecuta la instrucción.
4. **Lo que debes destacar:** 
   - La salida ahora parece JSON, y probablemente tiene bloques de código Markdown (```json).
   - El validador vuelve a fallar (bien sea por el Markdown, o porque las propiedades del objeto JSON no son las esperadas).
   - **Conclusión del Paso:** "Pedir 'JSON' no significa definir la estructura que el sistema necesita. Si el JSON tiene las claves equivocadas o texto extra, la lógica de la aplicación seguirá fallando."

### Paso 4: Experimento 3 (Restricciones y Esquema)
1. Selecciona el **Experimento 3**.
2. Lee la instrucción, resaltando cómo ahora es un **contrato**: 
   - "devuelve estrictamente un objeto JSON"
   - "No utilices Markdown ni agregues explicaciones"
   - "El esquema debe ser: { status, severity, issue }"
3. Ejecuta la instrucción.
4. **Lo que debes destacar:** 
   - La salida ahora es únicamente el objeto JSON con las claves exactas.
   - El validador reporta una **VALIDACIÓN CORRECTA**.
   - **Conclusión del Paso:** "La única forma de integrar modelos probabilísticos en flujos de procesamiento tradicionales (pipelines) de forma predecible es acorralarlos con restricciones negativas y un esquema de salida explícito."

## 4. Puntos de Discusión a provocar
- "¿Notan cómo hemos convertido una 'conversación' en una definición de interfaz, casi como si declaráramos una función en el código?"
- "Si nuestro contrato exige que `severity` solo pueda ser 'LOW', 'MEDIUM' o 'HIGH', y el modelo nos devuelve 'CRITICAL', ¿de quién es la culpa si el sistema colapsa? ¿Del modelo o de nuestro validador por no anticipar variaciones?"
- "¿Por qué un caso límite (edge case) puede arruinar una automatización de miles de dólares si no lo consideramos en el contrato?"

## 5. Transición al Lab
"El objetivo no es conseguir una respuesta inteligente. El objetivo es conseguir una respuesta que nuestro software pueda consumir de forma predecible y segura. Ahora que saben por qué necesitamos un contrato, en el **Lab 02** ustedes van a construir uno para su propio problema real de ingeniería."
