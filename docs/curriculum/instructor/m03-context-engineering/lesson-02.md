# Lesson 02 — Assembly & Prioritization

## 1. Propósito de la clase
Enseñar a los ingenieros a orquestar el ensamblaje de contexto dinámico bajo restricciones estrictas (límites de tokens). Aprender a priorizar la información en base a su relevancia, recencia y redundancia, asegurando que el modelo reciba la combinación más potente de datos para resolver la tarea.

## 2. Qué debe aprender el estudiante
- Entender que no todo el contexto tiene el mismo peso; debe haber una jerarquía de prioridades.
- Aplicar criterios para decidir qué información entra a la ventana de contexto y qué se descarta cuando el espacio es limitado.
- Comprender que ensamblar contexto es una tarea arquitectónica determinista (código tradicional) que ocurre antes de llamar a la IA probabilística.

## 3. Conceptos fundamentales

### 3.1 Assembly & Prioritization
La ventana de contexto de un LLM es finita (ej. 8K, 128K tokens) y cada token cuesta dinero y tiempo (latencia). El ingeniero debe diseñar un algoritmo de ensamblaje que ordene los datos desde lo más crítico hasta lo opcional.

#### Concept Analogy: Equipaje para un viaje (Assembly)
- **Analogía cotidiana:** Preparar la maleta para un viaje con un límite estricto de peso (20 kg).
- **Mapeo:** 
  - **Viaje / Destino** = La tarea o instrucción específica (System Prompt).
  - **Clima / Actividad** = Las restricciones del contrato (Constraints).
  - **Objetos necesarios** = El contexto relevante (Minimum Useful Context).
  - **Objetos redundantes** = Ruido o contexto repetido.
  - **Peso máximo** = El presupuesto de tokens (*Token Budget*).
  - **Olvidar algo importante** = *Context Gap* (Falta de conocimiento clave que causará alucinación).
  - **Llevar demasiadas cosas** = *Context Overload* (Coste, lentitud y distracción).
- **Límite de la analogía:** En un viaje físico, llevar una prenda de más solo te cuesta cargarla. En el LLM, inyectar "objetos redundantes" reduce el porcentaje de atención que el modelo le presta a los "objetos necesarios", degradando el rendimiento de la tarea completa.
- **Traducción técnica:** Jerarquización y truncamiento (*truncation*) determinista del payload JSON antes del envío a la API.
- **Ejemplo aplicado a SWE:** Un bot analiza código. Tienes 5 archivos candidatos. La jerarquía debe ser: 1) El archivo modificado, 2) Archivos importados directamente, 3) Documentación general. Si el límite es excedido, cortas la documentación general primero, nunca el archivo modificado. Crucial: **Un objeto (archivo) puede ser indispensable en otro viaje, pero completamente irrelevante para este viaje.**

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Si tengo un modelo con ventana gigante de 1 Millón de tokens, ya no necesito priorizar ni ensamblar contexto. Simplemente le envío toda la base de datos."*
**Consecuencia:** Costos masivos e innecesarios por cada petición (Time To First Token elevadísimo). Además, incluso los modelos de ventana larga son susceptibles a distraerse con ruido periférico. El diseño de ingeniería excelente exige eficiencia computacional, independientemente del límite máximo del hardware.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Empacamos lo más importante primero, y si queda espacio, metemos los 'por si acaso'.
- **Mecanismo:** El ensamblaje de contexto se programa en el backend tradicional usando reglas heurísticas (ej. ordenar documentos por `cosine_similarity` y luego por `timestamp`). El truncamiento ocurre cortando el array de strings antes de alcanzar el `max_tokens`.
- **Consecuencia de ingeniería:** Tu aplicación requiere una capa de orquestación (un *Context Assembler*) encargada de calcular el costo en tokens de cada bloque de información y tomar decisiones algorítmicas de descarte antes de ejecutar la llamada al modelo.

## 6. Ejemplo técnico
**Lógica de Ensamblaje en Pseudocódigo:**
```python
budget = 4000_tokens
context_blocks = []

# Prioridad 1: Estado del Sistema (Indispensable)
context_blocks.add(get_user_state(), budget)

# Prioridad 2: Error Logs (Altamente Relevante)
context_blocks.add(get_recent_errors(), budget - current_tokens)

# Prioridad 3: Documentación (Opcional, se trunca si no cabe)
context_blocks.add(search_docs(), budget - current_tokens)
```

## 7. Ejemplo aplicado a Software Engineering
Al generar un resumen de un *Pull Request*, el sistema primero inyecta el `diff` de código. Luego, evalúa el presupuesto. Si sobra espacio, inyecta los tickets de Jira asociados. Si aún sobra, inyecta conversaciones de Slack. Si el `diff` es gigantesco, descarta Slack y Jira para asegurar que la tarea principal no se rompa.

## 8. Errores conceptuales frecuentes
- **"El orden no importa"**: A veces el orden en que se inyecta el contexto sí importa. Los modelos prestan más atención al principio y al final del prompt (efecto de primacía y recencia).
- **"El Retrieval (búsqueda semántica) es suficiente"**: Una búsqueda semántica puede devolver un documento súper relevante de hace 5 años. La priorización por *recencia* es crucial para descartar información obsoleta.

## 9. Preguntas para el grupo
- "Si están construyendo un asistente de soporte técnico, ¿qué tiene mayor prioridad: el manual del producto, o los 3 comandos que el usuario acaba de escribir en su terminal?"
- "¿Por qué depender de una ventana de contexto de 1 Millón de tokens no es una solución escalable para una aplicación con 10,000 usuarios activos simultáneos?"

## 10. Mini ejercicio
Muestra en pantalla 5 bloques de contexto disponibles para un "Asistente de revisión de código". Pide a los ingenieros que los ordenen de mayor a menor prioridad si solo tienen presupuesto para 2 bloques. 
(Ej: 1. `git diff` actual, 2. Errores del Linter, 3. Historial de commits del usuario, 4. Reglas de estilo globales, 5. Documentación de React).

## 11. Demo relacionada
*(Demo 03 en la siguiente clase ilustrará los límites).*

## 12. Discusión
La gestión de contexto es una variante de *Resource Management* (Gestión de Recursos), un problema clásico de ingeniería de software. Estamos decidiendo cómo asignar memoria caché limitada (tokens) a la CPU probabilística (LLM).

## 13. Preparación para la siguiente clase
"Hemos aprendido a seleccionar y priorizar. Pero, ¿qué pasa cuando la información prioritaria que sí o sí necesitamos meter sigue siendo demasiado grande? Mañana veremos técnicas de compresión y validación del contexto."
