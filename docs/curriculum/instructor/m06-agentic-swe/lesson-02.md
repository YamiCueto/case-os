# Lesson 02 — Human-Agent Collaboration

## 1. Propósito de la clase
Transformar la mentalidad del estudiante: el humano deja de ser solamente productor de código (tipógrafo) y pasa a ser **diseñador del cambio y verificador**. Enseñar que la responsabilidad absoluta sobre el objetivo, las restricciones, la verificación y la aceptación del código modificado recae sobre el ingeniero, no sobre el Agente.

## 2. Qué debe aprender el estudiante
- Interiorizar el ciclo de colaboración moderno: **Baseline → Context → Change → Diff → Verification → Human Acceptance → Rollback**.
- Redactar instrucciones a la IA no como "deseos mágicos", sino como especificaciones técnicas estrictas (Objetivo, Restricciones, Criterios de Aceptación).
- Adoptar la disciplina del **Paquete de Evidencia (Evidence Package)**: No basta con que el código "se vea bien", hay que probar que funciona y que no rompió nada.

## 3. Conceptos fundamentales

### 3.1 El Ciclo de Diseño del Cambio
El trabajo del programador se desplaza hacia los extremos del flujo (Especificación y Revisión), dejando el centro (Generación) a la IA.

```text
ENGINEER
   │
   ├── Goal (Objetivo)
   ├── Constraints (Restricciones)
   ├── Context Boundary (Límite de contexto)
   └── Acceptance Criteria (Criterios de Aceptación)
          │
          ▼
       AI SYSTEM
          │
          ├── Analyze
          ├── Generate
          └── Modify
          │
          ▼
        DIFF
          │
          ▼
     VERIFICATION (Tests, Lints)
          │
          ▼
    HUMAN REVIEW
          │
      ┌───┴───┐
    ACCEPT   REJECT (Rollback)
```

#### Concept Analogy: Contratar a un Ingeniero Extremadamente Rápido
- **Analogía cotidiana:** Contratar a un ingeniero *freelance* súper rápido que trabaja en remoto pero que no conoce en absoluto tu empresa ni sus convenciones.
- **Mapeo:** El agente es el *freelance*. Puede escribir 1000 líneas por segundo. Pero si le dices "Haz una pantalla de Login", lo hará en React clásico aunque tu empresa use Angular, y usará la paleta de colores de Bootstrap porque no conoce tu sistema de diseño. Necesitas darle contexto, restricciones rígidas ("Usa Angular, usa los tokens de diseño de la carpeta `/styles`") y revisarle el código (Diff) antes de hacer *merge*.
- **Límite de la analogía:** Un *freelance* humano podría preguntarte si está confundido, o deducir intenciones tácitas basándose en su experiencia pasada en otras empresas. El agente de IA no tiene intuición. Es un sistema probabilístico. Si omites una restricción, el agente "alucinará" la ruta más probable estadísticamente, que casi siempre es la incorrecta para tu arquitectura específica.
- **Traducción técnica:** Inversión de control en el ciclo de desarrollo (Inversion of Control). El IDE actúa como orquestador de *tool calls*, pero el humano actúa como orquestador de *estado* (Git).
- **Ejemplo aplicado a SWE:** En vez de escribir el `for-loop` a mano, el ingeniero invierte 5 minutos escribiendo un *prompt* detallado que lista dependencias prohibidas. El agente demora 10 segundos en escribir el `for-loop`. El ingeniero invierte otros 5 minutos corriendo tests unitarios y leyendo el `git diff` antes de aceptar el cambio.

### 3.2 El Paquete de Evidencia (Evidence Package)
El artefacto que certifica que el humano hizo su trabajo como verificador. "El código compila" ya no es suficiente.

Debe responder a preguntas como:
- ¿Cumple el objetivo original?
- ¿Cambió solamente lo permitido?
- ¿Introdujo nuevas dependencias no deseadas?
- ¿Alteró comportamientos no solicitados? (Refactorings furtivos).
- ¿Pasaron los tests existentes y los nuevos?
- ¿Entiendo cada línea del Diff? ¿Sé revertirlo?

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Dado que el agente de IA escribió el código y pasaron los tests automáticos, el código está listo para producción. No necesito leer lo que generó porque confío en la IA."*
**Consecuencia:** El Agente introdujo un *Memory Leak* sutil, añadió una dependencia con una licencia Open Source restrictiva (GPL), o usó un patrón arquitectónico obsoleto. El ingeniero lo aceptó ciegamente y 6 meses después, cuando el sistema colapse, el ingeniero no sabrá cómo arreglarlo porque el código es, efectivamente, "Alien Code" (código que nadie en la empresa entiende).

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Si le mandas a alguien a pintar tu casa de "un color bonito", no te quejes si pinta de rosa brillante. Especificar cuesta trabajo, pero ahorra rehacerlo.
- **Mecanismo:** El LLM optimiza por probabilidad, no por precisión arquitectónica. Su inclinación natural es agradar al usuario (sycophancy) produciendo código de la forma más común presente en sus datos de entrenamiento, ignorando las convenciones raras de tu equipo.
- **Consecuencia de ingeniería:** Pasamos de enseñar "Sintaxis de Lenguajes" a enseñar "Revisión Crítica de Código" (Code Review). La lectura de `diffs` y el diseño de `Tests Unitarios` se vuelven las habilidades supremas del siglo XXI.

## 6. Ejemplo técnico
**Especificación Débil (El Agente Tipera lo que quiera):**
"Arregla el bug de la tabla de usuarios." (El agente podría borrar columnas o cambiar el ORM entero).

**Especificación Fuerte (Human-Agent Collaboration):**
"**Goal**: Resolver el N+1 query problem en el dashboard de usuarios. **Constraints**: No usar nuevas librerías, mantener compatibilidad con TypeORM v0.2. **Context**: Revisa `UserController.ts` y `UserRepository.ts`. **Acceptance**: El tiempo de respuesta del endpoint debe caer bajo 200ms y los 14 tests de integración actuales deben pasar sin modificaciones."

## 7. Ejemplo aplicado a Software Engineering
Al recibir el Diff, el ingeniero nota que el Agente resolvió el problema del N+1, pero en el proceso reformateó las fechas a `MM-DD-YYYY` cuando todo el sistema usa `ISO 8601`. Gracias a la fase de **Human Review**, el ingeniero detecta este *Refactoring no solicitado* y presiona `REJECT`, instruyendo al agente a que limite el *scope* estrictamente a la query de base de datos.

## 8. Errores conceptuales frecuentes
- **"Programar es solo escribir código"**: Programar es tomar decisiones y asegurar calidad. Escribir código era solo el subproducto mecánico. Al automatizar la mecánica, queda al descubierto el núcleo de la ingeniería.
- **"El Agente es mi co-worker"**: No, el Agente es una herramienta. Tratarlo como humano (esperar que tenga "sentido de pertenencia" por la calidad del proyecto) lleva a relajar los controles de verificación.

## 9. Preguntas para el grupo
- "Si un Agente introduce una vulnerabilidad SQL Injection en producción, ¿de quién es la culpa legal y ética? ¿De OpenAI, de Microsoft (IDE), del Agente, o tuya?"
- "¿Cuánto tiempo deberíamos invertir en leer un Diff generado por IA comparado con leer un PR de un compañero humano junior?" (Respuesta: Igual o más tiempo, porque la IA puede equivocarse con absoluta confianza).

## 10. Mini ejercicio
Proyecta un fragmento de código con un requerimiento difuso: "Haz que este botón sea más grande". Pide al grupo que rescriba ese requerimiento usando las cuatro partes críticas: *Goal, Constraints, Context Boundary, Acceptance Criteria*.

## 11. Demo relacionada
*(Se mostrará en la Demo 06).*

## 12. Discusión
Estamos viviendo la transición de "Programadores Artesanales" a "Operadores de Sistemas de Software". De la misma forma que un piloto moderno no mueve los alerones con cables mecánicos (Fly-by-wire), los ingenieros modernos no teclean bucles `while`, operan interfaces de alto nivel (Agentes).

## 13. Preparación para la siguiente clase
"Para que el agente pueda proponer un cambio decente, necesita contexto. En M03 aprendimos a construir el contexto manualmente. Mañana veremos cómo las herramientas de programación AI-native automatizan el ensamblaje de este contexto conectando los hilos invisibles de nuestro repositorio."
