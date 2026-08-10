# Lesson 01 — From Completion to Agents

## 1. Propósito de la clase
Mapear el ecosistema de herramientas de codificación asistida por IA no como una "carrera tecnológica" donde lo nuevo reemplaza a lo viejo, sino como un espectro de **autonomía de ingeniería**. El estudiante debe aprender a responder: *"¿Qué nivel de autonomía requiere este cambio específico de código?"*

## 2. Qué debe aprender el estudiante
- Identificar las 5 etapas evolutivas de la asistencia por IA en código: *Autocomplete → Chat → Code Generation → Repository-Aware Assistance → Agentic Software Engineering*.
- Comprender que una herramienta "más avanzada" (Agent) no es necesariamente la mejor opción para una tarea de baja incertidumbre (Least Autonomy Necessary).
- Aplicar el nivel correcto de delegación dependiendo del tamaño y riesgo del cambio (Scope of Change).

## 3. Conceptos fundamentales

### 3.1 El Espectro de Autonomía en Código
No debemos ver estas etapas como "mejoras" de un mismo producto, sino como diferentes clases de herramientas de software:
1. **Autocomplete (Tab-Completion):** Inferencia estática de 1 o 2 líneas. Cero autonomía. Útil para: "Escribe este mapper".
2. **Chat sobre código:** Conversación aislada sin contexto automático.
3. **Code Generation:** Capacidad de inyectar bloques grandes de código en el archivo actual.
4. **Repository-Aware Assistance:** El sistema conoce el proyecto, importa referencias y mantiene coherencia de tipos (M03 Context).
5. **Agentic Software Engineering:** El sistema lee, busca, infiere, modifica múltiples archivos, ejecuta tests, observa resultados y se auto-corrige (M05 Agent Loop). Útil para: "Investiga por qué este endpoint falla, modifica lo necesario y demuestra que la regresión está resuelta".

#### Concept Analogy: Escalar la Delegación
- **Analogía cotidiana:** Contratar ayuda para remodelar tu casa.
- **Mapeo:** 
  - *Autocomplete:* Le pides a alguien que te pase el martillo justo cuando extiendes la mano.
  - *Chat:* Llamas a un arquitecto para hacerle una consulta técnica sobre cimientos.
  - *Agentic SWE:* Le das las llaves de la casa a un contratista, le dices "Arregla la fuga de agua en el baño principal sin romper la tubería de gas", y te vas a trabajar esperando un reporte al final del día.
- **Límite de la analogía:** Si el contratista humano rompe la tubería, usará el sentido común para cerrar la llave de paso. El Agente de código, si no tiene un *Guardrail* estricto, seguirá intentando arreglar la fuga ignorando la explosión inminente. La IA no tiene sentido común, opera estrictamente bajo las restricciones que tú, como Arquitecto, diseñaste en su *Prompt Contract*.
- **Traducción técnica:** Transición de *Single-Turn Generation* a *Multi-Turn Tool-Calling Agent Loops* sobre un File System.
- **Ejemplo aplicado a SWE:** Para añadir un campo `fecha_nacimiento` a una clase de base de datos, un *Autocomplete* es la herramienta perfecta (rápido, determinista, barato). Usar un Agente Autónomo para esa misma tarea es una violación de *Least Autonomy Necessary*: es caro, lento y corre el riesgo de que el Agente decida "refactorizar" toda tu capa de datos sin que se lo pidas.

### 3.2 La Autonomía Aumenta el Riesgo
Heredando la regla de M05: **La autonomía que aprendimos en el módulo anterior ahora entra en un entorno donde los efectos secundarios son código real.** Si un agente genera un bucle infinito en M05, perdemos dinero de API. Si un agente genera un bucle infinito en M06, podría corromper el árbol git, borrar archivos de configuración o introducir vulnerabilidades silenciosas.

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Dado que tengo un Agente de código ultra potente, le pediré absolutamente todos los cambios, desde formatear una línea hasta escribir un microservicio entero."*
**Consecuencia:** Pérdida masiva de productividad. Para cambios triviales, el programador pasará 2 minutos escribiendo un *Prompt* detallado para un agente, esperará 30 segundos de inferencia, y pasará 1 minuto revisando el diff, cuando podría haber presionado `TAB` en 2 segundos. Peor aún, el agente de contexto amplio (Repository-Aware) escaneará innecesariamente medio proyecto para cambiar una coma.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** No usas una grúa industrial para clavar un clavo en la pared.
- **Mecanismo:** Un Autocomplete usa modelos pequeños, ultra rápidos y con ventana de contexto microscópica (Fill-in-the-Middle). Un Agente usa LLMs masivos, consume miles de tokens inyectando contexto de múltiples archivos, y realiza llamadas a herramientas (File System, Bash).
- **Consecuencia de ingeniería:** El ingeniero maduro elige la herramienta (el nivel de autonomía) acorde al radio de explosión (Blast Radius) del cambio requerido.

## 6. Ejemplo técnico
**Malo (Agente para tarea trivial):**
```bash
> Agente, por favor, en el archivo user.ts, cambia el console.log('hola') por console.error('hola').
[Agente analiza 5 archivos, consume 4000 tokens, tarda 8 segundos].
```

**Bueno (Agente para tarea autónoma justificada):**
```bash
> Agente, los tests de integración en `payment.spec.ts` están fallando con Timeout desde ayer. Rastrea qué cambió en el commit anterior, encuentra el cuello de botella, proponme un parche y ejecuta los tests de nuevo.
[Agente opera un Agent Loop, justifica el gasto computacional].
```

## 7. Ejemplo aplicado a Software Engineering
Un Tech Lead impone reglas en su equipo:
- Fix de sintaxis o boilerplate: `Copilot/Autocomplete`.
- Duda sobre una librería nueva: `Chat window`.
- Cambio transversal de API que afecta 15 archivos: `Agent`.

## 8. Errores conceptuales frecuentes
- **"El Agente entiende el negocio"**: No, el Agente solo entiende los tokens presentes en el IDE en ese instante temporal. Si la lógica de negocio está en Jira o en la cabeza del PM, el Agente alucinará una implementación técnicamente correcta pero comercialmente inútil.
- **"Las herramientas viejas van a desaparecer"**: Falso. El autocompletado y el *Agent Loop* coexistirán, del mismo modo que caminar y volar en avión coexisten. Son para distancias diferentes.

## 9. Preguntas para el grupo
- "Tienen que actualizar la versión de React en el `package.json`. ¿Llamarían a un Agente o lo harían a mano? ¿Por qué?"
- "¿Qué riesgos de seguridad ven al otorgarle a una herramienta de Autocompletado acceso de lectura/escritura a todo su repositorio?" (Respuesta: Menor riesgo porque el humano aprueba línea a línea; a diferencia de un Agente que puede hacer 50 *file writes* en un ciclo).

## 10. Mini ejercicio
Muestra 3 requerimientos de código en la pantalla:
1. Crear getters/setters para una clase Java.
2. Identificar por qué un script de Python causa fuga de memoria (OOM).
3. Escribir una expresión regular (Regex) para validar pasaportes europeos.
Pide a los estudiantes que vinculen cada tarea con la etapa evolutiva óptima (Autocomplete, Chat, Agent) justificando el *trade-off* de autonomía.

## 11. Demo relacionada
*(Las diferencias prácticas se verán en el flujo general de M06).*

## 12. Discusión
La transición hacia *Agentic SWE* no elimina el trabajo humano, sino que redefine qué parte del trabajo aporta valor. Si el agente es quien "tipea", nuestro valor ya no está en la velocidad de tecleo, sino en la calidad de nuestra dirección.

## 13. Preparación para la siguiente clase
"Si nosotros ya no somos los tipógrafos principales, ¿cuál es nuestro rol? ¿Cómo evitamos perder el control sobre el código base? En la próxima lección, redefiniremos nuestra profesión: pasaremos de ser generadores de sintaxis a ser diseñadores del cambio y verificadores implacables."
