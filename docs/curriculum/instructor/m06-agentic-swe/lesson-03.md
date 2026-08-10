# Lesson 03 — Repository Context

## 1. Propósito de la clase
Enseñar a los estudiantes que el "conocimiento" que un sistema de IA tiene sobre su base de código no es mágico. Es un ensamblaje de contexto dinámico (*Context Assembly*) que ocurre detrás de escena. Conectar directamente este mecanismo con lo aprendido en M03, demostrando que en el mundo del *Agentic Coding*, la construcción del *Context Manifest* se automatiza parcialmente, pero la responsabilidad del límite sigue siendo humana.

## 2. Qué debe aprender el estudiante
- Comprender que un modelo fundacional no sabe nada de su empresa; solo conoce lo que el sistema orquestador logra inyectarle en el prompt.
- Analizar cómo un asistente de programación asistida por IA ensambla el contexto a partir del grafo de dependencias de un repositorio.
- Reconocer los peligros del sub-contexto (el modelo alucina relaciones que no conoce) y del sobre-contexto (el modelo amplía el alcance de su refactorización innecesariamente).

## 3. Conceptos fundamentales

### 3.1 Ensamblaje Dinámico del Repositorio
En M03, el ingeniero diseñó el *Context Manifest* a mano. En M06, las herramientas AI-native automatizan esa tubería de extracción.

```text
Repository
    │
    ├── Target File (El archivo que tienes abierto)
    ├── Types (Las definiciones de TypeScript/Java)
    ├── Interfaces (Los contratos del framework)
    ├── Tests (Las pruebas unitarias asociadas)
    ├── Imports (Los archivos importados por el Target)
    ├── Related Modules (Componentes hermanos)
    └── Configuration (package.json, tsconfig.json)
            │
            ▼
     Context Assembly (Algoritmos heurísticos y de similitud)
            │
            ▼
           LLM (Prompt final inyectado)
```

#### Concept Analogy: Contratar a un Investigador Express
- **Analogía cotidiana:** Le pides a un analista muy rápido que te corrija un documento legal.
- **Mapeo:** 
  - Si le das solo la página 5 (Contexto insuficiente), el analista corregirá la gramática, pero cambiará términos que violan las definiciones de la página 1.
  - Si le das la página 5, pero además tu asistente personal (Context Assembly) corre a la estantería, saca las leyes citadas, los diccionarios de la empresa y los adjunta (Contexto Correcto), el analista hará un trabajo impecable.
  - Si le lanzas la biblioteca entera en la cabeza (Contexto Excesivo), el analista se abrumará, se confundirá de caso y tardará horas en darte una respuesta inútil.
- **Límite de la analogía:** Un humano eventualmente te dirá "Detente, esto es demasiada información" o "Falta el contrato original". El LLM no puede hacer eso de manera confiable; simplemente producirá el output más probable con lo que tenga, aunque esté fabricando (*alucinando*) funciones que no existen en tu repo.
- **Traducción técnica:** Resolución estática de dependencias (AST Analysis) combinada con Retrieval vectorial de fragmentos similares, inyectados secuencialmente en el token limit.
- **Ejemplo aplicado a SWE:** Un ingeniero abre `UserService.ts` y pide a la IA: "Crea el método de login". Si la herramienta no ensambla contexto, la IA creará un login desde cero (alucinación). Si la herramienta ensambla contexto, leerá los imports, descubrirá `AuthModule.ts`, lo incluirá silenciosamente en el prompt, y generará un login que *reutiliza* el sistema de autenticación de tu empresa.

### 3.2 Límite de Contexto (Context Boundary)
El desarrollador debe guiar activamente este proceso de ensamblaje (ej. usando símbolos como `@` o arrastrando archivos) porque los algoritmos automáticos fallan al adivinar la intención abstracta.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Dado que uso un IDE moderno de IA (Cursor/GitHub Copilot), asumo que la IA ya ha 'leído y entendido' todo mi proyecto por defecto."*
**Consecuencia:** Pedirá tareas arquitectónicas complejas creyendo que el LLM tiene una vista de halcón. Como el LLM solo está viendo el puñado de archivos que la heurística del IDE logró ensamblar (a veces omitiendo archivos críticos de infraestructura), la IA propondrá refactorizaciones desastrosas que rompen el sistema de dependencias circulares, y el desarrollador las aceptará asumiendo que "la IA sabe lo que hace".

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Si entras a una habitación a ciegas y solo tocas la trompa de un elefante, pensarás que es una manguera. El contexto revela al elefante.
- **Mecanismo:** Las herramientas de IA parsan el Abstract Syntax Tree (AST) del código en tu editor, calculan *chunks*, y los concatenan basados en pesos (recencia, tabs abiertos, similitud vectorial). No hay entendimiento global, solo "candidatos ensamblados" (M04 + M03).
- **Consecuencia de ingeniería:** El ingeniero de software asume la responsabilidad de actuar como "curador del contexto". Antes de pedir un cambio, debe abrir los archivos relevantes y cerrar los irrelevantes para aumentar el *Signal-to-Noise Ratio* del ensamblador subyacente.

## 6. Ejemplo técnico
**El LLM no es un compilador:**
Si tu archivo `App.ts` depende de un paquete npm que acabas de instalar pero que no está mencionado explícitamente en el archivo actual ni en los imports recientes, el LLM *desconoce* su existencia hasta que fuercies la inyección de la documentación de esa librería.

## 7. Ejemplo aplicado a Software Engineering
Un programador junior pide a la IA que migre un componente de Vue 2 a Vue 3. La IA lo hace perfecto. Luego le pide que haga lo mismo con otro componente que usa librerías gráficas complejas. La IA falla estrepitosamente, porque el ingeniero no introdujo la guía de migración de gráficos en el perímetro de contexto. El humano debe saber *cuándo* aportar contexto externo.

## 8. Errores conceptuales frecuentes
- **"El modelo está re-entrenándose con mi código"**: Falso. Tu código solo vive en la memoria RAM temporal (Context Window) durante la inferencia. 
- **"Si menciono toda la carpeta `/src`, la respuesta será mejor"**: Error clásico de M03 (*Lost in the Middle*). Más contexto diluye la atención y causa que la IA modifique archivos que no debía tocar.

## 9. Preguntas para el grupo
- "Si están usando un Asistente de IA en su editor y le dicen 'Mejora el rendimiento de mi aplicación', ¿por qué fallará casi siempre?" (Respuesta: Falta un objetivo medible, restricciones y, sobre todo, no hay un *Context Boundary* definido. La IA no sabe qué parte del sistema mirar).
- "¿Por qué es peligroso dejar archivos antiguos o deprecados abiertos en el editor mientras usamos IA?" (Respuesta: El sistema los absorberá como contexto válido e inyectará código obsoleto).

## 10. Mini ejercicio
Muestra en pantalla un problema: *"Migrar el botón de pago a la nueva API de Stripe"*.
Pide al grupo que esbocen el árbol de dependencias que la herramienta de IA debería ensamblar forzosamente en el prompt antes de intentar tocar el botón (ej. `Checkout.tsx`, `StripeService.ts`, `PaymentInterfaces.ts`).

## 11. Demo relacionada
*(Demo 06 demostrará el impacto de alterar este contexto).*

## 12. Discusión
La diferencia entre un desarrollador que piensa que "la IA no sirve para mi proyecto complejo" y un desarrollador 10x es que el segundo entiende el límite de la ventana de contexto y sabe curarlo como un orfebre.

## 13. Preparación para la siguiente clase
"Toda esta teoría abstracta sobre contexto se resume en una frase dolorosamente real: Un mismo problema con diferente contexto produce un cambio de código totalmente distinto. Vamos a verlo en vivo en la Demo 06."
