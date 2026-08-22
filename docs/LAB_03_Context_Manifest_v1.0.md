# LAB 03 — CONTEXT MANIFEST v1.0

## Module 03 · Ingeniería de Contexto

**Objetivo:** diseñar el Minimum Useful Context necesario para que un agente pueda comprender y trabajar sobre una rutina o problema real del proyecto.

> **Importante:** en este laboratorio no ejecutaremos agentes. Primero diseñaremos y justificaremos el contexto que posteriormente podría recibir un agente.

---

## 1. TASK

### ¿Qué problema real vamos a resolver?

Define claramente la rutina, proceso o problema seleccionado.

Incluye:
- ¿Qué estamos analizando o desarrollando?
- ¿Cuál es el objetivo?
- ¿Cuál es el alcance?
- ¿Qué queda fuera del alcance?

**Pregunta clave:**

> ¿Qué queremos que un agente pueda comprender, analizar o realizar con este contexto?

---

## 2. REQUIRED CONTEXT

### ¿Qué información necesita el agente?

Identifica los artefactos necesarios para comprender y trabajar sobre la tarea.

Aplica los tres filtros:

- **Relevance:** ¿Esta información es necesaria para resolver la tarea?
- **Recency:** ¿Esta información representa el estado o versión que debemos considerar?
- **Redundancy:** ¿Esta información ya está representada en otro artefacto?

Para cada elemento:

```text
Artefacto:
¿Por qué es necesario?
¿Qué información aporta?
Relevance:
Recency:
Redundancy:
```

**Pregunta clave:**

> Si eliminamos este elemento, ¿qué información necesaria perdería el agente?

---

## 3. EXCLUDED CONTEXT

### ¿Qué información decidimos NO incluir?

Identifica información relacionada con la tarea que no es necesaria para resolverla.

Para cada exclusión:

```text
Artefacto:
¿Por qué no es necesario?
¿Qué ruido o redundancia introduce?
```

**Pregunta clave:**

> ¿Qué parece relacionado, pero realmente no necesitamos enviar?

> **Excluir también es una decisión de ingeniería.**

---

## 4. DEPENDENCIES

### ¿Qué relaciones debemos preservar?

Identifica las dependencias necesarias para comprender correctamente la tarea.

Pueden existir relaciones entre:
- componentes
- servicios
- clases
- rutinas
- tablas
- stored procedures
- APIs
- DTOs
- contratos
- procesos

Puedes representarlas mediante un pequeño diagrama:

```text
Rutina
   ↓
Servicio
   ↓
Stored Procedure
   ↓
Tabla
```

**Pregunta clave:**

> ¿De qué depende nuestra rutina y qué otros componentes dependen de ella?

---

## 5. ASSEMBLY

### ¿Cómo vamos a organizar el contexto seleccionado?

Construye el Context Payload utilizando una estructura clara y delimitada.

Ejemplo:

```xml
<task>
...
</task>

<application_context>
...
</application_context>

<source_context>
...
</source_context>

<dependencies>
...
</dependencies>

<constraints>
...
</constraints>

<user_input>
...
</user_input>
```

**Pregunta clave:**

> ¿Cómo organizamos la información para que el agente pueda distinguir claramente instrucciones, datos, código, dependencias y restricciones?

Recuerda:

> **SELECT responde qué entra. ASSEMBLY responde cómo entra.**

---

## 6. CONTEXT HYPOTHESIS

### ¿Qué debería poder hacer el agente con este contexto?

Formula una hipótesis concreta.

Ejemplo:

> “Con este contexto, el agente debería poder reconstruir el flujo de la rutina, identificar sus reglas de negocio y determinar qué elementos deben preservarse durante la modernización.”

**Pregunta clave:**

> Si entregamos exactamente este contexto, ¿qué esperamos que el agente pueda comprender o resolver?

---

## 7. VALIDATION

### ¿Cómo comprobaremos que el contexto fue suficiente?

Define la evidencia técnica que permitiría validar posteriormente el resultado.

Puede incluir:
- coincidencia con el comportamiento real
- reglas de negocio
- contratos
- dependencias
- compilación
- pruebas existentes
- resultados esperados

**Pregunta clave:**

> ¿Qué evidencia técnica demostraría que nuestra comprensión del problema y sus dependencias es correcta?

---

## 8. CONTEXT GAPS

### ¿Qué información podría faltar?

En esta etapa, si todavía no se ha ejecutado el agente:

```text
Pendiente de validación mediante ejecución futura.
```

Posteriormente, esta sección permitirá registrar las brechas descubiertas.

Ejemplo:

> El agente necesitaba conocer una dependencia que no estaba incluida en el manifest.

**Pregunta clave:**

> ¿Qué información faltante podría provocar que el agente tenga que asumir, inventar o interpretar incorrectamente algo?

---

# Entregable final

Cada grupo debe entregar un único `Context Manifest v1.0` correspondiente a su problema o rutina real:

```text
CONTEXT MANIFEST v1.0

1. TASK
2. REQUIRED CONTEXT
   ├── Relevance
   ├── Recency
   └── Redundancy
3. EXCLUDED CONTEXT
4. DEPENDENCIES
5. ASSEMBLY
6. CONTEXT HYPOTHESIS
7. VALIDATION
8. CONTEXT GAPS
```

## Regla fundamental

> **Cada elemento incluido debe tener una razón.**  
> **Cada elemento excluido debe tener una razón.**  
> **Cada decisión debe poder defenderse.**

**Resultado esperado:** un contexto mínimo, suficiente, estructurado y justificable para una tarea real de ingeniería.
