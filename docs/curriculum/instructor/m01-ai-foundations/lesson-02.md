# Lesson 02 — Inferencia y Alucinación

## 1. Propósito de la clase
Profundizar en las implicaciones del comportamiento probabilístico: la capacidad asombrosa del modelo para inferir conceptos implícitos, que trae consigo el costo inevitable de inventar (alucinar) información cuando la probabilidad lo guía hacia patrones plausibles pero falsos.

## 2. Qué debe aprender el estudiante
- Entender que **la alucinación es una consecuencia posible del mecanismo generativo cuando el modelo produce una continuación plausible sin disponer de evidencia suficiente**, no un defecto que podamos asumir que desaparecerá por completo.
- Identificar la diferencia entre un modelo base (que solo autocompleta) y un modelo instruido (RLHF) que intenta complacer al usuario.
- Aceptar que intentar reducir las alucinaciones a cero dentro del modelo es una batalla perdida; el control debe estar en la arquitectura del sistema.

## 3. Conceptos fundamentales

### 3.1 Inferencia Semántica
La ventaja de no tener reglas rígidas. El modelo puede deducir la intención, categorizar texto ambiguo o conectar conceptos aparentemente aislados porque su entrenamiento capturó las relaciones semánticas.

#### Concept Analogy: Inferencia
- **Analogía cotidiana:** Un sommelier probando un vino a ciegas.
- **Mapeo:** Sin ver la etiqueta (código explícito), el sommelier deduce la uva, región y año basado en miles de catas previas (datos de entrenamiento).
- **Límite de la analogía:** El sommelier tiene sentidos físicos y memoria biológica. El modelo solo aproxima distancias matemáticas entre vectores de palabras.
- **Traducción técnica:** Interpolación en un espacio latente de alta dimensionalidad.
- **Ejemplo aplicado a SWE:** Enviar un log de error incomprensible (sin regex previo) y que el modelo logre inferir que se trata de un timeout de red debido a cómo están estructuradas las trazas, algo que requeriría docenas de `if/else` en código tradicional.

### 3.2 Plausibilidad vs Veracidad (Alucinación)
El modelo no tiene un módulo de "verdad". Calcula qué secuencia de palabras es más probable (plausible) dados sus pesos de entrenamiento. Una mentira bien articulada y frecuente en internet puede tener mayor peso estadístico que una verdad compleja y poco documentada.

#### Concept Analogy: Alucinación
- **Analogía cotidiana:** Si le pides a un programador que complete una historia sobre un módulo sin darle acceso al repositorio, puede rellenar los huecos con suposiciones plausibles. El problema no es que "no sepa programar" o "esté loco"; el problema es que está trabajando con información incompleta y la orden de completar la tarea.
- **Mapeo:** El programador es el LLM. La historia sin repositorio es el prompt sin contexto. Rellenar huecos es la predicción del siguiente token.
- **Límite de la analogía:** El programador sabe que está mintiendo o suponiendo. El modelo no tiene noción de verdad o mentira, solo persigue la optimización de la probabilidad.
- **Traducción técnica:** Generación de una secuencia estadísticamente probable pero fácticamente incorrecta en el mundo real.
- **Ejemplo aplicado a SWE:** El modelo genera código usando una librería inventada `import AWS.MagicConnect` porque estadísticamente la secuencia de caracteres suena correcta para el dominio de AWS, rompiendo la compilación.

### 3.3 Tipos de Alucinación en Ingeniería
- **Fact check failure:** Inventar una API o dependencia que no existe.
- **Context hallucination:** Ignorar el código provisto y generar uno genérico basado en sus pesos.
- **Instruction drift:** Olvidar la instrucción original y dejarse llevar por el contexto reciente.

## 4. Explicación para el instructor
Usa la analogía del "Actor Improvisador de Hollywood". Es increíblemente rápido leyendo el ambiente y actuando, pero si le preguntas un hecho histórico que no sabe, no dirá "no lo sé" (a menos que haya sido fuertemente entrenado para ello), inventará una respuesta que suene exactamente como algo que diría su personaje.
Haz que los ingenieros entiendan que están contratando a un actor brillante, no a una base de datos relacional.

## 5. Ejemplo técnico
Mostrar cómo un modelo inventa parámetros de una API.
Pide al grupo que imagine generar código para conectarse a una API interna privativa que el modelo nunca vio. El modelo generará el código con un `import InternalLib`, `InternalLib.connect(apiKey)` porque estadísticamente *así es como lucen las APIs*. Es plausible, pero completamente inventado.

## 6. Ejemplo aplicado a Software Engineering
Si pides a un modelo que revise una base de código extensa buscando errores de seguridad (sin proveer todo el código adecuadamente), el modelo puede inventar que existe una inyección SQL en la clase `UserService` simplemente porque estadísticamente la inyección SQL es común en clases de usuarios.

## 7. Errores conceptuales frecuentes
- **"El modelo está dañado, se inventa cosas":** Es un error pensar que la alucinación es un defecto reparable. Si eliminas la capacidad de alucinar (asociación libre de conceptos), destruyes su capacidad de inferir, razonar semánticamente o ser creativo.
- **"Si uso un modelo más grande/caro, ya no alucina":** Los modelos grandes también alucinan, solo que mienten de manera mucho más articulada y convincente.

## 8. Preguntas para el grupo
- "Como ingenieros, si asumimos que un módulo de software fallará un 2% del tiempo de forma silenciosa, ¿qué patrones de diseño utilizamos para proteger el resto de la aplicación?" (Guiar hacia Circuit Breakers, Fallbacks, Validaciones de Esquema).
- "¿Cuándo es útil que el modelo alucine o invente datos?" (Ej: generación de mock data, tests, lluvia de ideas).

## 9. Mini ejercicio
Muestra en pantalla un texto que tiene una falla lógica sutil. Pregunta: ¿Cómo harían para forzar al modelo a admitir que "no tiene suficiente información" en vez de tratar de adivinar? (Esto abre la puerta a la ingeniería de instrucciones).

## 10. Demo relacionada
*(Se utilizará en conjunto con Lab 01)*. Muestra cómo al pedir algo muy específico y oscuro (fuera de sus datos de entrenamiento) el modelo produce un resultado sintácticamente perfecto pero funcionalmente inútil.

## 11. Discusión
La discusión debe girar hacia la **Supervisión (Guardrails)**. En la ingeniería tradicional el compilador es nuestro guardrail. En la IA, nosotros debemos construir los guardrails semánticos.

## 12. Takeaways
- La inferencia es el superpoder; la alucinación es el impuesto que pagamos por ese superpoder.
- La veracidad no proviene del modelo. La veracidad proviene del contexto (que aprenderemos a inyectar en M03 y M04).

## 13. Preparación para la siguiente clase
"Hasta ahora hemos analizado cómo funciona el modelo por dentro. Pero la ingeniería no ocurre en el vacío. En la próxima lección elevaremos la vista para entender cómo encaja este ente probabilístico dentro del ciclo de vida del software."
