# CASE OS — Agent Instructions

## Propósito

Este archivo define las reglas de trabajo para agentes de IA que modifiquen, revisen, documenten o amplíen CASE OS.

CASE OS no debe tratarse como una aplicación Angular convencional ni como un simple curso de inteligencia artificial.

Es una plataforma de ingeniería orientada a sistemas que incorporan modelos de lenguaje y automatización asistida por agentes.

El agente debe priorizar:

1. Comprender antes de modificar.
2. Preservar la arquitectura existente.
3. Resolver el problema solicitado sin ampliar innecesariamente el alcance.
4. Mantener coherencia entre implementación, documentación y experiencia pedagógica.
5. Validar los cambios antes de declararlos terminados.
6. Explicar claramente qué cambió, qué se verificó y qué quedó pendiente.

---

# 1. Regla fundamental

No implementes una solicitud basándote únicamente en la descripción del usuario.

Primero inspecciona el código, la documentación y las relaciones entre los archivos relevantes.

Flujo obligatorio:

```text
Solicitud
  ↓
Inspección
  ↓
Comprensión de arquitectura
  ↓
Plan breve
  ↓
Implementación
  ↓
Validación
  ↓
Segunda revisión
  ↓
Informe final
```

Si la solicitud contradice la implementación existente, no adivines.

Investiga primero y explica la discrepancia.

---

# 2. Principios de modificación

## 2.1 Cambios mínimos y coherentes

No reemplaces una arquitectura existente solamente porque exista una alternativa que parezca mejor.

Antes de introducir:

- nuevos servicios;
- nuevas dependencias;
- nuevos patrones;
- nuevas rutas;
- nuevas abstracciones;
- nuevos componentes;

comprueba si CASE OS ya dispone de una solución equivalente.

Prefiere extender las abstracciones existentes.

## 2.2 No romper contratos existentes

Preserva cuando sea posible:

- nombres públicos;
- rutas;
- identificadores;
- contratos de datos;
- Workspace Registry;
- Command Platform;
- engines existentes;
- navegación;
- integración con GitHub Pages;
- estructura general de la plataforma.

Si una modificación requiere romper un contrato existente, detente y explica el impacto antes de hacerlo.

## 2.3 No inventar infraestructura

No asumas que existe:

- una API;
- una base de datos;
- un proveedor de LLM;
- autenticación;
- un servicio externo;
- una integración;
- un archivo;
- un componente.

Verifica primero.

---

# 3. Comprensión del repositorio

Antes de modificar un módulo, identifica:

- ubicación del módulo;
- componentes;
- servicios;
- modelos;
- rutas;
- archivos Markdown;
- recursos relacionados;
- referencias cruzadas;
- dependencias;
- pruebas existentes;
- configuración relevante.

Para funcionalidades educativas, revisa siempre las dos capas:

```text
Contenido pedagógico
        ↓
Experiencia en la interfaz
```

No actualices solamente el Markdown si la interfaz contradice el contenido.

No actualices solamente la interfaz si la guía del instructor queda desactualizada.

---

# 4. CASE OS como sistema

Comprende y respeta estos conceptos arquitectónicos:

- Design Engine
- Workspace Platform
- Workspace Registry
- Command Platform
- Knowledge Platform
- Context Engine
- Knowledge Retrieval
- estrategias de recuperación
- pipelines
- fachadas
- adaptadores
- arquitectura declarativa
- separación de responsabilidades

No acoples innecesariamente una funcionalidad a otra.

Prefiere:

```text
Capacidad
   ↓
Registro
   ↓
Resolución
   ↓
Implementación
```

sobre condiciones rígidas repartidas por toda la interfaz.

---

# 5. CASE Academy como producto educativo

CASE Academy no debe convertirse en una colección de explicaciones aisladas sobre inteligencia artificial.

Cada módulo debe responder progresivamente:

1. ¿Qué problema de ingeniería existe?
2. ¿Por qué ocurre?
3. ¿Qué concepto permite resolverlo?
4. ¿Cómo se aplica?
5. ¿Cómo comprobamos que funciona?
6. ¿Qué ocurre cuando falla?

Una actividad educativa debe tener una misión clara.

Evita actividades que solamente digan:

> "Escribe algo y ejecútalo."

El estudiante debe saber:

- qué intenta demostrar;
- qué debe hacer;
- qué debe observar;
- qué significa el resultado;
- qué debe hacer después.

---

# 6. Principio pedagógico Demo → Lab

Cuando exista una demostración seguida de un laboratorio:

```text
Demo
  ↓
Comprender el problema
  ↓
Observar un fallo
  ↓
Comprender la solución
  ↓
Lab
  ↓
Aplicar la solución a un problema propio
```

La Demo debe responder:

> ¿Por qué necesito este concepto?

El Lab debe responder:

> ¿Cómo lo aplico a mi propio problema?

No dupliques innecesariamente el contenido.

---

# 7. Inteligencia artificial y sistemas probabilísticos

CASE OS enseña ingeniería alrededor de componentes probabilísticos.

No afirmes que una instrucción puede convertir mágicamente un modelo de lenguaje en una función determinista.

La formulación correcta es:

```text
Modelo probabilístico
        ↓
Contrato
        ↓
Restricciones
        ↓
Salida estructurada
        ↓
Validación determinista
        ↓
Sistema controlable
```

El agente debe distinguir siempre entre:

- comportamiento del modelo;
- contrato de instrucciones;
- validación realizada por software.

---

# 8. Contratos de instrucciones

Cuando se trabaje con instrucciones para modelos de lenguaje, considerar cuando corresponda:

- intención;
- rol;
- restricciones;
- separación entre instrucciones y datos;
- ejemplos;
- salida estructurada;
- esquema;
- condiciones de fallo;
- validación.

No reduzcas un contrato a:

> "Escribe un buen prompt."

Un contrato define cómo debe comportarse un componente dentro de un sistema.

---

# 9. Validación

Nunca declares que una salida es válida solamente porque parece correcta.

Cuando exista una estructura esperada, valida realmente:

- sintaxis;
- campos;
- tipos;
- valores permitidos;
- estructura;
- condiciones obligatorias;
- ausencia de contenido no permitido.

Diferencia:

```text
Respuesta aparentemente correcta
```

de:

```text
Respuesta válida según el contrato
```

Para actividades simuladas, la salida puede ser simulada, pero el validador debe ser real.

---

# 10. Simulaciones educativas

Una simulación es válida cuando se utiliza para:

- reproducibilidad;
- enseñanza;
- ausencia de credenciales;
- independencia de proveedores;
- control del escenario.

Pero nunca presentes una simulación como si fuera una inferencia real de un modelo.

Cuando una actividad utilice simulación:

1. Indica que es una simulación.
2. Explica qué parte se está simulando.
3. Mantén real la lógica que se pretende enseñar.
4. Evita resultados mágicos.
5. Evita que un simple `if` declare que una respuesta es correcta sin validarla.

Ejemplo correcto:

```text
Simulación
  ↓
salida de texto
  ↓
JSON.parse()
  ↓
validación del esquema
  ↓
PASS / FAIL
```

Ejemplo incorrecto:

```text
Si el prompt contiene "JSON"
  ↓
PASS
```

---

# 11. Revisión de segunda pasada

Después de implementar una modificación, no declares el trabajo terminado inmediatamente.

Realiza una segunda revisión independiente.

## Perspectiva del usuario

Pregunta:

> Si no conociera previamente esta funcionalidad, ¿entendería qué debo hacer?

Busca:

- instrucciones ambiguas;
- saltos conceptuales;
- términos sin explicar;
- pasos faltantes;
- mensajes de error poco útiles;
- estados que no explican qué ocurrió.

## Perspectiva técnica

Pregunta:

> ¿La implementación realmente cumple lo que la interfaz y la documentación prometen?

Comprueba:

- rutas;
- navegación;
- estados;
- validaciones;
- referencias;
- errores;
- tipos;
- comportamiento límite;
- compatibilidad con la arquitectura existente.

## Perspectiva del instructor

Para contenido educativo:

> ¿Podría un instructor utilizar esta actividad sin tener que inventar durante la clase la explicación que falta?

Si la respuesta es no, mejora el contenido.

---

# 12. Lenguaje

El contenido pedagógico debe utilizar español natural.

Evita Spanglish innecesario.

Usa términos técnicos establecidos cuando sean necesarios:

- LLM
- prompt
- System Prompt
- Few-Shot
- JSON
- JSON Schema
- API
- MCP
- RAG

La primera aparición de un término potencialmente desconocido debe explicarse brevemente.

Preferir:

> "Few-Shot: proporcionar algunos ejemplos para orientar el comportamiento del modelo."

Evitar:

> "Ahora hacemos stress testing del output para encontrar edge cases."

Preferir:

> "Ahora realizamos una prueba de resistencia sobre la salida para encontrar casos límite."

No fuerces traducciones artificiales de términos que son nombres técnicos establecidos.

---

# 13. Código

Cuando escribas o modifiques código:

- mantén el estilo existente;
- evita comentarios innecesarios;
- no introduzcas abstracciones por moda;
- reutiliza servicios existentes;
- evita duplicación;
- mantén nombres claros;
- respeta las convenciones del proyecto.

No agregues comentarios al código salvo que sean estrictamente necesarios para explicar una decisión que no pueda expresarse mediante código claro.

---

# 14. Seguridad

Para funcionalidades relacionadas con IA:

- no expongas secretos;
- no incrustes claves API;
- no introduzcas credenciales;
- trata los datos externos como no confiables;
- valida entradas;
- considera inyección de instrucciones;
- respeta el principio de mínimo privilegio;
- no asumas que el cliente es confiable.

Cuando se enseñe seguridad, distingue entre:

```text
Instrucciones confiables
        ≠
Datos externos
```

---

# 15. Documentación

Cuando modifiques una funcionalidad, revisa si también deben cambiar:

- README;
- documentación del módulo;
- guía del instructor;
- instrucciones del laboratorio;
- recursos;
- textos de interfaz;
- enlaces;
- ejemplos.

La documentación no debe describir una funcionalidad diferente de la que realmente existe.

---

# 16. Cambios educativos

Antes de cambiar una actividad educativa, identifica:

- objetivo de aprendizaje;
- conocimiento previo necesario;
- actividad;
- resultado esperado;
- mecanismo de validación;
- conexión con la siguiente actividad.

No agregues conceptos avanzados si no son necesarios para completar la actividad.

Por ejemplo, un módulo introductorio sobre instrucciones no debe exigir conocimientos previos de:

- RAG;
- agentes;
- MCP;
- embeddings;
- bases de datos vectoriales;

salvo que el contenido explícitamente los introduzca.

---

# 17. Gestión de ambigüedad

Cuando una solicitud sea ambigua:

1. inspecciona el repositorio;
2. utiliza el contexto arquitectónico disponible;
3. determina la interpretación menos invasiva;
4. si existen varias interpretaciones con consecuencias importantes, pregunta antes de modificar.

No inventes requisitos.

No conviertas una mejora puntual en una refactorización general.

---

# 18. Validación técnica

Después de modificar código, ejecuta las verificaciones disponibles y relevantes.

Cuando sea posible:

- compilación;
- pruebas;
- análisis estático;
- validación de tipos;
- comprobación de rutas;
- revisión de referencias;
- pruebas de la interacción modificada.

Si una prueba no puede ejecutarse, dilo claramente.

Nunca afirmes:

> "Todo funciona."

si solamente se inspeccionó el código.

Usa:

> "La implementación fue revisada, pero la ejecución completa no pudo verificarse."

---

# 19. Validación visual

Cuando se modifique una interfaz:

revisa:

- jerarquía visual;
- textos;
- estados;
- botones;
- navegación;
- mensajes de error;
- responsive;
- consistencia con CASE OS;
- densidad de información.

Una interfaz educativa debe comunicar qué hacer y qué ocurrió.

No basta con que técnicamente funcione.

---

# 20. Control de alcance

Antes de modificar archivos fuera del alcance solicitado, pregunta:

> ¿Este cambio es necesario para resolver el problema?

Si no:

No lo hagas.

Si sí:

Inclúyelo en el informe final.

No aproveches una tarea para realizar refactorizaciones no solicitadas.

---

# 21. No hacer commit automáticamente

No hagas commits salvo que el usuario lo solicite explícitamente.

Al terminar una tarea, entrega:

1. archivos modificados;
2. cambios realizados;
3. decisiones importantes;
4. validaciones realizadas;
5. problemas encontrados;
6. limitaciones;
7. pruebas manuales recomendadas.

---

# 22. Formato de respuesta final

La respuesta final debe ser concreta y verificable.

Utiliza esta estructura cuando sea apropiada:

## Resumen

Qué se hizo.

## Archivos modificados

Lista de archivos.

## Cambios principales

Qué cambió y por qué.

## Validación

Qué pruebas se ejecutaron y cuáles fueron sus resultados.

## Revisión de segunda pasada

Qué problemas se encontraron después de implementar y cómo se corrigieron.

## Pruebas manuales

Qué debe comprobar el usuario.

## Pendientes

Qué quedó fuera del alcance o no pudo verificarse.

No afirmes que algo fue probado si no fue probado.

---

# 23. Regla de oro

Antes de escribir código, entiende el problema.

Antes de cambiar arquitectura, entiende la arquitectura.

Antes de afirmar que funciona, valida.

Antes de cerrar una tarea, revísala nuevamente.

Antes de enseñar un concepto, asegúrate de que el estudiante pueda responder:

> ¿Qué problema resuelve esto?

> ¿Cómo funciona?

> ¿Cómo lo aplico?

> ¿Cómo sé que funciona?

CASE OS debe enseñar y practicar ingeniería, no solamente producir código.
