# Guía del instructor — M04 L03: Evaluación de la Recuperación

**Módulo:** 04 — Recuperación y RAG  
**Lección:** 03 — Evaluación de la Recuperación  
**Duración:** 3 horas  
**Grupo:** CFA  
**Punto de partida:** mini tubería RAG construida por células en M04-L02

> **Pregunta guía**  
> Ya construimos un buscador semántico que devuelve resultados. ¿Cómo demostramos que devuelve la evidencia correcta y no solamente resultados que parecen relacionados?

## 1. Hilo conductor L02 → L03

En L02 cada célula construyó:

```text
knowledge_base.txt → chunking → embeddings → ranking → Top-K → context build
```

L02 respondió: **¿cómo construimos una tubería que recupera fragmentos?**  
L03 responderá: **¿cómo sabemos si recupera los fragmentos correctos?**

```text
L02: la tubería funciona
          ↓
L03: definimos qué debería recuperar
          ↓
medimos lo que recupera
          ↓
diagnosticamos el fallo
          ↓
proponemos una mejora comprobable
```

> **Decisión pedagógica**  
> Cada concepto nuevo aterriza sobre `knowledge_base.txt`, `step_03_retrieval.py` o `demo_rag.py`. La implementación se desarrollará después en una guía separada; durante esta clase diseñan cómo extender lo que ya tienen.

## 2. Resultados observables

Al terminar, podrán:

- separar un fallo de recuperación (retrieval) de un fallo de generación;
- definir relevancia antes de ejecutar una consulta;
- convertir las consultas de L02 en un benchmark inicial;
- calcular precisión@K (Precision@K), cobertura@K (Recall@K) y tasa de acierto@K (Hit Rate@K);
- diferenciar similitud cosenoidal, relevancia y suficiencia;
- explicar el efecto de Top-K sobre cobertura, ruido y presupuesto de contexto;
- distinguir recuperación inicial de reordenamiento (reranking);
- asociar un fallo con chunking, consulta, embeddings, filtros, Top-K o reranking;
- diseñar una mejora medible sobre su tubería.

## 3. Preparación

Ten abiertos L03, Demo 04, Laboratorio 04, la guía de L02 y una copia funcional de `demo-rag-python/`.

| Verificación | Listo cuando... |
|---|---|
| Proyecto L02 | Ejecutas una consulta y ves ranking, score y Top-K. |
| Corpus | Identificas los seis fragmentos por ID y tema. |
| Consultas | Tienes las cinco consultas probadas en L02. |
| Contraste | Tienes consultas que requieren más de una fuente. |
| Plan B | Puedes trabajar con rankings simulados. |

Se mantienen estas restricciones:

- sin LLM real, Ollama, Docker ni servicios locales de IA;
- sin otra base de datos vectorial;
- sin reemplazar el proyecto de L02;
- sin información confidencial, PII, credenciales ni código propietario.

## 4. Corpus y benchmark inicial

### Fragmentos de `knowledge_base.txt`

| ID | Tema | Evidencia resumida |
|---|---|---|
| C1 | Contraseña olvidada | Usar Restablecer contraseña. |
| C2 | Cuenta bloqueada | Soporte valida identidad y desbloquea. |
| C3 | Nuevos roles | El jefe inmediato registra la solicitud. |
| C4 | Acceso VPN | Requiere ticket aprobado. |
| C5 | Incidente SQL Server | Escalar a soporte especializado. |
| C6 | Vacaciones | Solicitar con quince días y aprobación. |

### Consultas heredadas de L02

| ID | Consulta (query) | Fuente esperada |
|---|---|---|
| Q1 | Mi cuenta quedó bloqueada | C2 |
| Q2 | Necesito conectarme remotamente a la empresa | C4 |
| Q3 | Quiero pedir vacaciones | C6 |
| Q4 | Necesito permisos nuevos en el sistema | C3 |
| Q5 | SQL Server está presentando un incidente grave | C5 |

Estas cinco consultas forman un benchmark inicial, pero cada una espera una sola fuente. Así, cobertura y tasa de acierto pueden parecer equivalentes.

### Consultas de contraste

| ID | Consulta | Fuentes relevantes | Propósito |
|---|---|---|---|
| Q6 | No puedo entrar a mi cuenta, ¿qué alternativas tengo? | C1 y C2 | Recuperar más de una posibilidad. |
| Q7 | Voy a salir de vacaciones y necesito conectarme remotamente | C4 y C6 | Cubrir dos intenciones. |

Q6 es deliberadamente ambigua. El grupo debe discutir si necesita ambas fuentes o una pregunta aclaratoria.

## 5. Timeline — 3 horas

| Tiempo | Bloque | Pregunta conductora | Evidencia |
|---|---|---|---|
| 00:00–00:15 | Reconexión con L02 | ¿Qué construimos y qué no sabemos? | Brecha de evaluación. |
| 00:15–00:30 | Prueba de confianza | ¿Un resultado plausible demuestra calidad? | Criterio de relevancia. |
| 00:30–01:00 | Lección 03 | ¿Qué mide cada métrica? | Cálculos con el corpus de L02. |
| 01:00–01:15 | Gold set | ¿Qué debía recuperar antes de ejecutar? | Referencia Q1–Q7. |
| 01:15–01:25 | Pausa | — | — |
| 01:25–02:00 | Demo 04 | ¿Qué cambia al variar K? | Comparación de configuraciones. |
| 02:00–02:20 | Fallos y reranking | ¿Falta evidencia o está mal ordenada? | Diagnóstico por etapa. |
| 02:20–02:45 | Aplicación conceptual | ¿Cómo hacemos evaluable `demo_rag.py`? | Diseño de extensión. |
| 02:45–02:55 | Socialización | ¿Qué cambiar y qué medir? | Defensa por células. |
| 02:55–03:00 | Cierre | ¿Qué aprendimos a demostrar? | Ticket de salida. |

## 6. Guion minuto a minuto

### 00:00–00:15 · Reconexión con L02

Proyecta:

```text
demo-rag-python/
├── data/knowledge_base.txt
├── step_01_chunking.py
├── step_02_embeddings.py
├── step_03_retrieval.py
├── step_04_context_build.py
└── demo_rag.py
```

Di:

> En L02 demostramos que la tubería funciona técnicamente: recibe una pregunta, calcula similitud, ordena fragmentos, toma Top-K y construye contexto. Hoy vamos a someterla a prueba. Producir un ranking no demuestra todavía que recuperemos el conocimiento correcto.

Pregunta en orden:

1. ¿Dónde fragmentamos?
2. ¿Dónde generamos los embeddings del corpus?
3. ¿Qué archivo calcula el ranking?
4. ¿Dónde decidimos cuántos fragmentos pasan al contexto?
5. ¿Dónde verificamos automáticamente si esos fragmentos eran útiles?

La respuesta esperada a la quinta es: **todavía no existe esa etapa**.

```text
Consulta → ranking → Top-K → contexto
                       ↓
              evaluación de retrieval
                       ↓
         Precision · Recall · Hit Rate
                       ↓
              diagnóstico y mejora
```

### 00:15–00:30 · Funcionar no es rendir bien

Antes de ejecutar `Mi cuenta quedó bloqueada`, pregunta qué fragmento debería aparecer y qué evidencia debe contener.

```text
Consulta: Q1
Fuente esperada: C2
Éxito mínimo: C2 aparece dentro de Top-K
```

Después del ranking pregunta:

- ¿Es semánticamente parecido?
- ¿Es útil para responder?
- ¿Es suficiente?
- ¿Qué pasa si C2 queda cuarto y usamos K = 2?
- ¿Qué pasa si C2 queda primero, pero el resto es ruido?

> **Frase ancla**  
> La similitud cosenoidal señala cercanía vectorial. La relevancia determina si el fragmento sirve para resolver la consulta.

```text
Score alto ≠ evidencia suficiente
Score alto ≠ fuente vigente
Score alto ≠ resultado correcto
```

### 00:30–01:00 · Lección 03 guiada

#### A. Medir antes de generar — 6 min

> Si C2 no entra al Top-K, el modelo no recibe el procedimiento de desbloqueo. Antes de culpar la redacción, inspeccionamos el contexto recuperado.

Presenta: recuperar → medir → analizar fallos → cambiar una variable → repetir el benchmark.

Pregunta: si cambiamos chunking, modelo y K simultáneamente, ¿podemos atribuir la mejora? Respuesta: no.

#### B. Precisión@K (Precision@K) — 7 min

```text
Precision@K = relevantes recuperados / K
```

Para Q1:

| Posición | Fragmento | ¿Relevante? |
|---:|---|---|
| 1 | C2 | Sí |
| 2 | C1 | No con este criterio |
| 3 | C3 | No |

```text
Precision@3 = 1 / 3 = 33,3 %
```

El sistema acertó, pero dos tercios del contexto son ruido.

#### C. Cobertura@K (Recall@K) — 7 min

```text
Recall@K = relevantes recuperados / relevantes existentes
```

Para Q7, relevantes C4 y C6. Si Top-2 devuelve C4 y C3:

```text
Recall@2 = 1 / 2 = 50 %
```

El modelo puede explicar VPN, pero no vacaciones. Para medir cobertura necesitamos un conjunto de referencia o *gold set*.

#### D. Tasa de acierto@K (Hit Rate@K) — 5 min

```text
Hit@K = 1 si aparece al menos un relevante; de lo contrario, 0
Hit Rate@K = consultas con acierto / total de consultas
```

Para Q7 con Top-2 `[C4, C3]`:

```text
Hit@2 = 1
Recall@2 = 50 %
```

> Hit Rate confirma que apareció algo útil. Recall revela que todavía falta evidencia.

#### E. Reordenamiento (reranking) — 5 min

```text
Candidatos iniciales: C3, C2, C1, C5
Después del reranking: C2, C1, C3, C5
```

- recuperación inicial: obtiene candidatos;
- reranking: mejora el orden;
- si C2 no entró como candidato, el reranker no puede rescatarlo.

### 01:00–01:15 · Construir el gold set

En las mismas células de L02, completa antes de ejecutar:

| Consulta | Fuente(s) esperada(s) | Evidencia mínima | Riesgo si falta |
|---|---|---|---|
| Q1 | C2 | Procedimiento de desbloqueo | Usuario sin solución. |
| Q2 | C4 | Ticket aprobado | Acceso sin control. |
| Q3 | C6 | Anticipación y aprobación | Solicitud incompleta. |
| Q4 | C3 | Registro por jefe | Permisos incorrectos. |
| Q5 | C5 | Escalamiento | Equipo incorrecto. |
| Q6 | C1 y C2 | Alternativas de acceso | Flujo equivocado. |
| Q7 | C4 y C6 | VPN y vacaciones | Respuesta parcial. |

Pregunta: ¿quién define relevancia, el embedding o el equipo? ¿Puede haber varias fuentes relevantes? ¿Qué significa evidencia suficiente?

> Primero definimos qué esperábamos. Después ejecutamos. Etiquetar luego de ver el ranking permite acomodar el criterio al resultado.

### 01:15–01:25 · Pausa

Deja proyectado: **¿Cuál consulta hará fallar primero la tubería de L02 y por qué?**

### 01:25–02:00 · Demo 04: experimentar con Top-K

Formaliza lo observado en L02 al cambiar `TOP_K = 1` y `TOP_K = 4`.

| Min | Instructor | Grupo |
|---:|---|---|
| 0–5 | Presenta consulta y gold set. | Predice antes de ejecutar. |
| 5–12 | Ejecuta con K pequeño. | Marca falsos positivos y negativos. |
| 12–20 | Aumenta K. | Recalcula métricas. |
| 20–27 | Compara el contexto construido. | Identifica evidencia y ruido. |
| 27–32 | Introduce reranking. | Distingue candidato y posición. |
| 32–35 | Formaliza. | Recomienda configuración provisional. |

| Configuración | Relevantes | Falsos + | Falsos − | Precision@K | Recall@K | Hit@K |
|---|---:|---:|---:|---:|---:|---:|
| K = 1 | | | | | | |
| K = 2 | | | | | | |
| K = 4 | | | | | | |
| Candidatos + reranking | | | | | | |

Preguntas:

- ¿Qué fuente relevante entró al aumentar K?
- ¿Qué ruido entró con ella?
- ¿Subió recall y bajó precision?
- ¿Hit@K cambió o ya era 1?
- ¿Qué fragmentos terminarían dentro del prompt?
- ¿El reranker encontró evidencia nueva o mejoró el orden?

> Top-K no se maximiza: se selecciona según la tarea, la evidencia necesaria, el ruido tolerable y el presupuesto de contexto (context budget).

### 02:00–02:20 · Diagnóstico de fallos

| Resultado | Diagnóstico | Intervención candidata |
|---|---|---|
| El correcto nunca aparece | Fallo de recuperación | Consulta, chunking, embedding, filtro o K candidato. |
| El correcto está cuarto y usamos dos | Fallo de selección u orden | Más candidatos o reranking. |
| Los fragmentos están cortados | Fallo de fragmentación | Tamaño, límites y overlap. |
| Hay evidencia correcta y mucho ruido | Baja precisión | K final, filtros, deduplicación o reranking. |

Conecta con el experimento L02 de chunks de 40 caracteres:

> Al perder significado el fragmento, cambian su embedding, su posición y las métricas; no es solamente un problema visual.

Dinámica oral: síntoma → hipótesis → un cambio → métrica que debería mejorar → posible sacrificio.

### 02:20–02:45 · Diseñar la extensión de su tubería

No implementan todavía. Anticipa el siguiente taller:

```text
demo-rag-python/
├── data/
│   ├── knowledge_base.txt
│   └── evaluation_queries.json       ← nuevo
├── step_01_chunking.py
├── step_02_embeddings.py
├── step_03_retrieval.py
├── step_04_context_build.py
├── demo_rag.py
├── step_05_evaluation.py             ← nuevo
└── reports/
    └── retrieval_evaluation.json     ← nuevo
```

Cada célula diseña:

| Decisión | Pregunta |
|---|---|
| Consultas | ¿Qué casos base y difíciles evaluaremos? |
| Gold set | ¿Qué IDs esperamos por consulta? |
| Valores K | ¿Qué configuraciones compararemos? |
| Métricas | ¿Qué calcularemos por consulta y agregado? |
| Umbral | ¿Cuándo será aceptable? |
| Diagnóstico | ¿Cómo clasificaremos falsos positivos y negativos? |
| Experimento | ¿Qué única variable cambiaremos? |

Producto conceptual:

```yaml
benchmark:
  queries: 7
  top_k_values: [1, 2, 4]
  metrics: [precision_at_k, recall_at_k, hit_rate_at_k]
  acceptance:
    hit_rate_at_2: ">= 0.85"
  first_experiment:
    variable: chunking
    baseline: paragraph
    candidate: fixed_size_with_overlap
```

El umbral es ilustrativo, no universal: debe responder al riesgo de la tarea.

### 02:45–02:55 · Socialización

Cada célula tiene 90 segundos:

1. ¿Qué consulta creen que fallará?
2. ¿Qué evidencia debería recuperar?
3. ¿Qué métrica revelaría el fallo?
4. ¿Qué única variable cambiarían?
5. ¿Qué esperan mejorar y qué podrían sacrificar?

### 02:55–03:00 · Ticket de salida

| Pregunta | Respuesta esperada |
|---|---|
| ¿Qué agrega L03 a L02? | Una forma reproducible de comprobar retrieval. |
| ¿Qué diferencia precision de recall? | Calidad recuperada frente a cobertura. |
| ¿Por qué Hit Rate puede ocultar fallos? | Puede acertar y aun faltar evidencia o sobrar ruido. |
| ¿Qué no repara reranking? | Un fragmento ausente de los candidatos. |
| ¿Qué sigue? | Instrumentar la tubería existente con benchmark y métricas. |

> **Cierre**  
> En L02 construimos una tubería capaz de recuperar. En L03 aprendimos a exigirle evidencia: definimos qué debía encontrar, medimos lo encontrado y convertimos cada fallo en una decisión comprobable.

## 7. Resumen de bolsillo

| Concepto | Pregunta | Idea operativa |
|---|---|---|
| Relevancia | ¿Sirve para resolver la consulta? | La define un criterio explícito. |
| Precision@K | ¿Cuánto de Top-K sirve? | Relevantes recuperados / K. |
| Recall@K | ¿Cuánto de lo relevante encontré? | Recuperados / relevantes existentes. |
| Hit Rate@K | ¿Apareció al menos uno? | Consultas con acierto / total. |
| Falso positivo | ¿Qué traje sin necesitarlo? | Reduce precisión y añade ruido. |
| Falso negativo | ¿Qué evidencia dejé fuera? | Reduce cobertura. |
| Reranking | ¿Los candidatos correctos quedaron arriba? | Reordena; no recupera ausentes. |
| Benchmark | ¿Contra qué comparo cambios? | Consultas, gold set, métricas y umbrales. |

## 8. Plan B con rankings simulados

Para Q7 usa:

```text
Fuentes relevantes: C4 y C6
Ranking: C4, C3, C2, C6, C1, C5
```

| K | Precision@K | Recall@K | Hit@K |
|---:|---:|---:|---:|
| 1 | 100 % | 50 % | 1 |
| 2 | 50 % | 50 % | 1 |
| 4 | 50 % | 100 % | 1 |

Pregunta: ¿K = 4 es automáticamente mejor o recuperar toda la evidencia introdujo demasiado ruido?

## 9. Checklist del instructor

### Antes

- Abrí L03, Demo 04, Laboratorio 04 y la guía L02.
- Identifiqué el corpus como C1–C6.
- Preparé Q1–Q7 y sus fuentes esperadas.
- Verifiqué la demo o preparé rankings simulados.

### Durante

- Empecé desde la tubería construida.
- Pedí predicciones antes de mostrar resultados.
- Definimos relevancia antes de medir.
- Usé una consulta con varias fuentes relevantes.
- Diferencié similitud, relevancia y suficiencia.
- Separé recuperación inicial de reranking.
- Relacioné cada fallo con una intervención.
- Evité presentar Top-K como valor universal.

### Al cerrar

- Cada célula diseñó cómo evaluar su tubería.
- Cada decisión quedó ligada a una métrica y un riesgo.
- El grupo sabe qué implementará en la guía posterior.

> **Idea final**  
> Las células no construirán otro RAG. Convertirán el que ya tienen en un sistema evaluable.
