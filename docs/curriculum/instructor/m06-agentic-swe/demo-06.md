# Demo 06 — The AI-Assisted Change (Instructor Guide)

## 1. Propósito de la Demo
Mostrar de forma visceral la dependencia del Agente de Código respecto a su contexto. Demostrar la ecuación central: **Mismo Problema + Contexto Diferente = Cambio Diferente**. Aterrizar M03 (Context Engineering) directamente sobre la manipulación de código real.

## 2. Ubicación en el Classroom Flow
- **Momento ideal:** Justo después de la Lesson 03 (Repository Context).
- **Duración sugerida:** 15 minutos.

## 3. Guía de Ejecución para el Instructor

### Paso 1: Introducción y Configuración
Explica a la clase el escenario: Tienes un *Issue* asignado en Jira que dice: *"El método de guardado de usuarios (UserService) está fallando silenciosamente cuando faltan datos obligatorios"*. Vamos a pedirle al sistema de IA que lo arregle usando la misma instrucción, pero variando el perímetro de contexto.

### Paso 2: Escenario A - Contexto Insuficiente
1. **Instruction:** *"Resuelve el issue de fallo silencioso en el UserService."*
2. **Context Boundary:** Solo proporcionas el archivo `UserService.java` abierto en el editor.
3. Ejecuta la generación.
4. **Lo que debes destacar (El Diff):** El sistema propone un cambio añadiendo bloques `try/catch` genéricos y haciendo `System.out.println` de los errores. 
5. Pregunta a la audiencia: *"Parece plausible, ¿no?"*. La IA asumió, ante la falta de contexto, que tu empresa maneja errores imprimiéndolos en consola. Esto es una implementación *plausible pero basada en supuestos erróneos*.

### Paso 3: Escenario B - Contexto Correcto
1. Revierte el código (*Rollback*).
2. **Instruction:** *"Resuelve el issue de fallo silencioso en el UserService."* (La misma instrucción).
3. **Context Boundary (Assembly):** Abres `UserService.java`, `UserRepository.java`, `UserDTO.java`, y el archivo global `GlobalExceptionHandler.java`.
4. Ejecuta la generación.
5. **Lo que debes destacar (El Diff):** La IA ahora analiza el entorno, ve el `GlobalExceptionHandler`, y en lugar de hacer un `try/catch` inútil, lanza una excepción customizada `throw new ValidationException(...)` que encaja perfectamente con la arquitectura existente.
6. El cambio es acotado, verificable y seguro. Hemos convertido M03 en un resultado tangible de código.

### Paso 4: Escenario C - Contexto Excesivo
1. Revierte el código.
2. **Instruction:** *"Resuelve el issue de fallo silencioso en el UserService."* (La misma instrucción).
3. **Context Boundary:** Mencionas la carpeta completa `/src/main/java` con miles de archivos. Le lanzas el repositorio entero.
4. Ejecuta la generación (suele tardar bastante).
5. **Lo que debes destacar (El Diff):** El sistema no solo arroja la excepción correcta, sino que decide reescribir toda la jerarquía de interfaces, actualizar anotaciones en 15 archivos que no tenían nada que ver con el *issue*, y refactorizar métodos auxiliares.
6. Muestra el desastre: Has sufrido un **Scope Expansion (Refactoring no solicitado)**. La ventana de atención se diluyó (*Lost in the Middle*) y el modelo intentó complacer patrones encontrados en otras partes remotas de la base de código.

## 4. Puntos de Discusión a provocar
- "Si un desarrollador junior usa el Escenario C, el código pasará los tests, pero el Diff tendrá 400 líneas. Cuando le pidan explicar en el Code Review humano por qué tocó 15 archivos, ¿qué va a responder?" (Respuesta esperada: "No sé, la IA lo hizo", revelando abdicación de la responsabilidad de ingeniería).
- "El Agente es como un gas: se expande hasta ocupar todo el contenedor de contexto que le proporciones. ¿De quién es la responsabilidad de diseñar el contenedor?"

## 5. Transición al Lab
"Han visto que pedirle a la IA 'que lo arregle' no es ingeniería. La ingeniería es diseñar el contenedor, definir las restricciones y auditar el cambio. En el *Real Engineering Lab 06*, ustedes van a estructurar un protocolo formal para que su equipo pueda hacer esto repetidamente sin volar el repositorio."
