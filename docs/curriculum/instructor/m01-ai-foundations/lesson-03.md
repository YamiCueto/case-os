# Lesson 03 — Pensamiento de Sistemas 

## 1. Propósito de la clase
Enseñar a los ingenieros a dejar de ver al modelo como un "oráculo" independiente, y comenzar a verlo como un componente (un nodo) dentro de una arquitectura de software mayor. Preparar el terreno para la orquestación (Agentes y MCP).

## 2. Qué debe aprender el estudiante
- Diferenciar entre el "Modelo Crudo" y un "Sistema Orquestado".
- Entender que delegar una tarea no significa abandonar el control de calidad.
- Identificar en qué capa del sistema pertenece el comportamiento determinista y en qué capa el probabilístico.
- Conceptualizar el modelo como un "motor de razonamiento" y no como un almacén de datos.

## 3. Conceptos fundamentales

### 3.1 Modelo vs Sistema
El modelo (`gpt-4`, `claude-3`) es solo el archivo de pesos y la red neuronal. El *Sistema* (ChatGPT, GitHub Copilot, CASE OS) incluye la interfaz, las bases de datos vectoriales (RAG), las herramientas que puede ejecutar, y los filtros de seguridad. No diseñamos modelos; diseñamos sistemas alrededor de modelos.

#### Concept Analogy: Modelo vs Sistema
- **Analogía cotidiana:** Un motor de combustión vs un automóvil.
- **Mapeo:** El modelo es el motor (genera fuerza/texto). El sistema es el automóvil (volante, frenos, chasis, cinturón de seguridad).
- **Límite de la analogía:** Un motor físico obedece leyes inmutables de la termodinámica. El motor de IA tiene un comportamiento que puede variar ligeramente incluso con la misma "gasolina" (prompt).
- **Traducción técnica:** La red neuronal predictiva (modelo) vs la infraestructura de software que gestiona entradas, salidas, contexto y seguridad (sistema).
- **Ejemplo aplicado a SWE:** Instalar la librería de OpenAI en tu código no significa que tienes un sistema de IA; solo has comprado un motor y lo tienes en el suelo de tu garaje. Tienes que programar el coche.

### 3.2 Desacoplamiento de la Base de Datos
Un error grave es usar al modelo como base de datos (esperar que sepa hechos en sus pesos). La arquitectura correcta utiliza al modelo como procesador lógico (CPU) y delega los hechos a sistemas deterministas (Bases de Datos, APIs) para inyectarlos como contexto (M03 y M04).

### 3.3 Fronteras de Responsabilidad (Modelo como Componente)
En un sistema bien diseñado, el LLM toma una decisión semántica, devuelve la decisión en un formato estructurado (ej. JSON), y el código tradicional (TypeScript, Java) ejecuta la acción crítica (ej. `DELETE FROM table`). El LLM no toca la base de datos; el sistema lo hace bajo sus propias reglas.

#### Concept Analogy: Modelo como Componente
- **Analogía cotidiana:** Un consultor externo dando recomendaciones vs el gerente firmando un cheque.
- **Mapeo:** El modelo es el consultor (analiza, infiere, sugiere). El código determinista es el gerente (valida la regla corporativa y ejecuta la transacción).
- **Límite de la analogía:** El consultor tiene agencia y puede ejecutar cosas si le dan permiso por error humano. En software, nosotros debemos programar explícitamente los límites de red y ejecución.
- **Traducción técnica:** Aislamiento de capas lógicas donde el modelo actúa como un traductor semántico sin acceso directo de escritura a la persistencia.
- **Ejemplo aplicado a SWE:** En vez de darle al modelo acceso a tu base de datos SQL para borrar usuarios, le pides al modelo que devuelva `{"action": "delete", "userId": 123}`, y tu código Java verifica si el usuario actual tiene permisos antes de borrarlo.

## 4. Explicación para el instructor
Dibuja en la pizarra (o proyecta) un diagrama arquitectónico clásico: UI -> API -> DB. Pregunta dónde va el LLM. Muchos dirán "junto a la DB". Corrige esa visión: el LLM es un microservicio cognitivo. Puede estar entre la UI y la API para traducir lenguaje natural a JSON, o después de la DB para resumir datos. La clave es que interactúa mediante contratos estrictos.

## 5. Ejemplo técnico
En vez de pedirle al LLM: *"Lee este reporte y envíale un correo de alerta al gerente"*.
Arquitectura correcta:
1. LLM lee el reporte y retorna `{"severity": "HIGH", "summary": "..."}`.
2. Código backend lee el JSON, valida la severidad.
3. Código backend utiliza AWS SES o SendGrid para enviar el correo.

## 6. Ejemplo aplicado a Software Engineering
Migración de un código Legacy (ej. VB6 a C#). 
En un enfoque de "Modelo Crudo", pegas todo el código y esperas el C#.
En un enfoque de "Pensamiento de Sistemas", creas un pipeline:
1. Script extrae firmas de funciones VB6.
2. LLM documenta cada función.
3. Ingeniero revisa documentación.
4. LLM propone migración por cada función aislada basada en la documentación aprobada.
5. Tests (deterministas) verifican compilación.

## 7. Errores conceptuales frecuentes
- **"El modelo hizo X en la base de datos"**: Confundir el modelo con la herramienta que el sistema le permitió usar.
- **Micro-management del LLM**: Escribir prompts tan procedimentales (como si fueran código) que se anula la capacidad del modelo para inferir soluciones creativas.

## 8. Preguntas para el grupo
- "¿Si el modelo de OpenAI se cae hoy, qué pasa con el sistema que construimos? ¿Está la lógica acoplada al proveedor?"
- "Si delegamos refactorización de código al LLM, ¿quién es legalmente el autor de ese commit en la empresa?"

## 9. Mini ejercicio
Pide a los alumnos que esbocen (a alto nivel) cómo diseñarían un asistente para Customer Service. Tienen que identificar 3 componentes deterministas y 1 componente probabilístico. (Ej: DB de usuarios es determinista, API de envíos es determinista, Clasificador de enojo del cliente es probabilístico).

## 10. Demo relacionada
Refiere al grupo al material del Lab 01, donde la tarea explícita es aplicar este Pensamiento de Sistemas a una rutina legacy real: separar lo determinista de lo probabilístico.

## 11. Discusión
¿Cómo gestionamos el estado? Un LLM es `stateless` (sin estado) por definición (cada llamada de API es independiente). El "sistema" (el chat, el agente) es el que maneja la memoria y el historial. Todo el contexto debe ser enviado en cada llamada.

## 12. Takeaways
- Construimos Sistemas, no Modelos.
- Usa al LLM como CPU (razonamiento), no como Disco Duro (conocimiento).
- La responsabilidad final de la acción la tiene el código determinista, no el modelo.

## 13. Preparación para la siguiente clase
"Para que este motor de razonamiento nos sea útil en la ingeniería real, necesitamos que nos devuelva resultados predecibles y estructurados, no poemas. Eso lo lograremos en el Módulo 02, donde estudiaremos Ingeniería de Prompts como Contratos."
