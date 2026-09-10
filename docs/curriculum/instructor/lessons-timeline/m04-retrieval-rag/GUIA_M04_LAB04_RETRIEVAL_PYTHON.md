# M04 · Laboratorio 04 — Diseñar y Evaluar una Estrategia de Recuperación con Python

## Guía de trabajo por células · CASE Academy

**Duración mínima:** 60 minutos  
**Duración recomendada:** 120 minutos  
**Modalidad:** trabajo local con Python y acompañamiento de Antigravity  
**Entregable:** `Retrieval Specification` + implementación ejecutable + benchmark de evaluación  

## 1. Misión

Cada célula diseñará una estrategia para recuperar fragmentos útiles desde documentos de procesos empresariales.

El propósito no es construir un chatbot ni evaluar la redacción de un LLM. El propósito es demostrar, con resultados medibles, que el sistema recupera la evidencia correcta antes de generar una respuesta.

```text
Documentos → Chunks → Índice → Consulta → Candidatos → Evaluación → Mejora
```

La regla central del laboratorio es:

> La recuperación genera candidatos. La Ingeniería de Contexto evalúa, selecciona, ensambla y valida el contexto final.

## 2. Límite de seguridad

Trabajen únicamente con información autorizada, pública, anonimizada o ficticia.

No incluyan:

- credenciales, tokens o secretos;
- datos personales o financieros reales;
- código o documentación propietaria no autorizada;
- nombres reales de clientes, empleados o proveedores;
- esquemas internos sensibles;
- incidentes que permitan identificar personas o sistemas reales.

Si una rutina real contiene información sensible, conserven su estructura y reemplacen nombres, valores, identificadores y datos por ejemplos ficticios.

## 3. Organización de las células

Se tienen las células definidas ya

## 4. Escenarios sugeridos

Cada célula puede escoger uno de estos problemas o adaptar una rutina propia:

1. Recuperar el procedimiento correcto para desbloqueo de usuarios, VPN e incidentes técnicos.
2. Consultar políticas de vacaciones, permisos, incapacidades y trabajo remoto.
3. Encontrar pasos y requisitos de vinculación de clientes ficticios.
4. Recuperar procedimientos de atención de solicitudes, quejas o reclamos.
5. Consultar documentación de APIs, códigos de error y procedimientos de soporte.
6. Encontrar reglas de aprobación dentro de un proceso ficticio de crédito o compras.

El problema debe necesitar recuperar evidencia desde varios documentos. Una sola página con una sola respuesta no permite evaluar una estrategia de recuperación.

## 5. Resultado esperado

Al finalizar, la célula debe poder demostrar:

- cómo construyó el corpus;
- cómo dividió los documentos;
- qué metadatos conservó;
- qué estrategia de búsqueda utilizó;
- cómo seleccionó Top-K;
- cuáles documentos eran relevantes para cada consulta;
- qué valores obtuvo en Precision@K, Recall@K y Hit Rate@K;
- en qué consultas falló;
- qué ajuste propone y por qué.

## 6. Estructura del proyecto

```text
lab04-retrieval/
├── data/
│   ├── documents.json
│   └── benchmark.json
├── src/
│   ├── chunking.py
│   ├── indexing.py
│   ├── retrieval.py
│   ├── evaluation.py
│   └── experiment.py
├── evidence/
│   ├── results.json
│   └── retrieval-specification.md
├── requirements.txt
└── README.md
```

## 7. Preparación local

Requisitos:

- Python 3.10 o superior;
- entorno virtual;
- modelo de embeddings permitido para ejecución local;
- documentos autorizados, anonimizados o ficticios.

Dependencias base sugeridas:

```text
sentence-transformers
scikit-learn
numpy
rank-bm25
```

Comandos de preparación:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Linux o macOS:

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

## 8. Desarrollo punto por punto desde la vista del Lab 04

### Punto 1 — Knowledge Source · Fuente de conocimiento

Construyan entre 8 y 15 documentos cortos sobre el escenario seleccionado.

Cada documento debe tener como mínimo:

```json
{
  "id": "DOC-001",
  "title": "Solicitud de vacaciones",
  "area": "Talento Humano",
  "version": "2026.1",
  "allowed_roles": ["COLABORADOR"],
  "text": "Contenido autorizado o ficticio del procedimiento."
}
```

Validación:

- ¿Hay documentos suficientemente parecidos para producir confusión?
- ¿Existen reglas, excepciones y versiones diferentes?
- ¿El corpus permite formular consultas exactas y semánticas?

Evidencia: describir fuente, formato, tamaño y tratamiento de seguridad.

### Punto 2 — Retrieval Problem · Problema de recuperación

Redacten el problema en una frase:

```text
Cuando [tipo de usuario] pregunta [necesidad], el sistema debe recuperar [evidencia esperada] desde [fuente] respetando [restricciones].
```

Ejemplo:

```text
Cuando un analista consulta cómo atender un bloqueo de acceso, el sistema debe recuperar el procedimiento vigente y autorizado sin mezclarlo con instrucciones de VPN o restablecimiento de contraseña.
```

Definan también qué no resolverá el sistema.

### Punto 3 — Chunking Strategy · Estrategia de fragmentación

Implementen una primera estrategia de chunking.

Configuración inicial sugerida para experimentar:

```text
chunk_size = 300 tokens aproximados
overlap = 50 tokens aproximados
```

No presenten estos valores como universales. Deben compararlos contra al menos una segunda configuración.

Experimentos mínimos:

| Experimento | Chunk size | Overlap | Hipótesis |
|---|---:|---:|---|
| A | 150 | 0 | Mayor precisión, riesgo de cortar reglas. |
| B | 300 | 50 | Conserva contexto con redundancia moderada. |
| C | 600 | 100 | Mayor cobertura local, riesgo de mezclar temas. |

Validación:

- ¿Una regla quedó partida entre chunks?
- ¿Un chunk mezcla dos procesos diferentes?
- ¿El overlap conserva una idea o solo duplica contenido?
- ¿Cada chunk mantiene el identificador del documento original?

### Punto 4 — Metadata Strategy · Estrategia de metadatos

Cada chunk debe conservar:

```text
chunk_id
document_id
title
area
version
allowed_roles
position
text
```

La metadata debe permitir responder preguntas deterministas:

- ¿El documento está vigente?
- ¿El usuario tiene permiso para recuperarlo?
- ¿A qué proceso y documento pertenece el fragmento?
- ¿Cuál era su posición dentro del documento?

### Punto 5 — Search Strategy · Estrategia de búsqueda

Construyan primero una línea base semántica:

```text
Query → Embedding → Similitud cosenoidal → Ranking
```

Después comparen al menos una alternativa:

| Estrategia | Útil cuando |
|---|---|
| Semántica | La consulta expresa una idea con palabras diferentes. |
| Léxica | La consulta contiene identificadores, códigos o términos exactos. |
| Híbrida | Se necesitan significado y coincidencias exactas. |

Si combinan BM25 y búsqueda vectorial, no sumen directamente puntajes de escalas diferentes sin normalización. Pueden comparar rankings o utilizar Reciprocal Rank Fusion.

### Punto 6 — Top-K Policy · Política de candidatos

Ejecuten cada consulta con:

```text
K = 1
K = 3
K = 5
```

Registren:

- evidencia útil recuperada;
- evidencia útil omitida;
- falsos positivos;
- tokens aproximados recuperados;
- configuración elegida y justificación.

### Punto 7 — Reranking Rules · Reordenamiento

Definan una segunda etapa sobre los primeros candidatos.

Puede ser:

- un Cross-Encoder local;
- reglas por vigencia y versión;
- prioridad por área;
- eliminación de duplicados;
- una combinación explícita de criterios autorizados.

Comparen el ranking antes y después. No es suficiente afirmar que el reordenamiento mejora: deben mostrar al menos una consulta donde cambió una posición relevante.

### Punto 8 — Evaluation Benchmark · Referencia de evaluación

Construyan cinco consultas:

| Tipo | Propósito |
|---|---|
| Típica | Representa la consulta más frecuente. |
| Semántica | Usa palabras diferentes a las del documento. |
| Exacta | Contiene un código, nombre o identificador. |
| Ambigua o multitema | Puede recuperar candidatos de procesos cercanos. |
| Sin respuesta | La evidencia correcta no existe en el corpus. |

Para cada consulta definan antes de ejecutar:

```json
{
  "id": "Q1",
  "query": "¿Cómo solicito días libres para un viaje?",
  "relevant_document_ids": ["DOC-001", "DOC-004"],
  "allowed_role": "COLABORADOR",
  "type": "semantic"
}
```

Los documentos relevantes son la verdad de referencia. No deben decidirse después de observar el ranking.

### Punto 9 — Precision@K Target · Calidad de señal

```text
Precision@K = relevantes recuperados dentro de K / K
```

Implementación mínima:

```python
def precision_at_k(retrieved_ids, relevant_ids, k):
    selected = retrieved_ids[:k]
    if not selected:
        return 0.0
    hits = len(set(selected) & set(relevant_ids))
    return hits / len(selected)
```

Definan un objetivo justificable, por ejemplo:

```text
Precision@3 >= 0.67
```

### Punto 10 — Recall@K y Hit Rate@K · Cobertura

```text
Recall@K = relevantes recuperados dentro de K / relevantes existentes
Hit Rate@K = 1 si apareció al menos un relevante; 0 si no apareció ninguno
```

```python
def recall_at_k(retrieved_ids, relevant_ids, k):
    if not relevant_ids:
        return None
    selected = retrieved_ids[:k]
    hits = len(set(selected) & set(relevant_ids))
    return hits / len(set(relevant_ids))


def hit_at_k(retrieved_ids, relevant_ids, k):
    selected = retrieved_ids[:k]
    return int(bool(set(selected) & set(relevant_ids)))
```

Para una consulta sin respuesta, Recall y Hit Rate no describen correctamente la abstención. Evalúen por separado si el sistema evitó devolver evidencia falsa mediante un umbral de similitud.

### Punto 11 — Failure Cases · Casos de fallo

Clasifiquen cada fallo:

| Fallo | Evidencia observable | Ajuste candidato |
|---|---|---|
| Omisión | Un relevante no aparece en Top-K. | Aumentar cobertura, revisar chunking o búsqueda híbrida. |
| Ruido | Aparecen candidatos irrelevantes. | Reducir K, aplicar threshold, filtros o reranking. |
| Fragmentación | La respuesta está dividida o incompleta. | Ajustar tamaño, overlap o límites semánticos. |
| Desactualización | Se recupera una versión anterior. | Filtrar metadata por vigencia. |
| Acceso indebido | Aparece un chunk no autorizado. | Aplicar filtros de permisos antes de construir contexto. |
| No-match forzado | La consulta sin respuesta recibe candidatos. | Introducir umbral y abstención. |

### Punto 12 — Context Integration · Integración con el contexto

El resultado del laboratorio debe terminar en candidatos estructurados, no en una respuesta inventada.

```text
Consulta
  + instrucciones
  + chunks seleccionados
  + fuentes
  + restricciones
  = contexto candidato para un LLM
```

Antes de ensamblar:

- eliminar duplicados;
- validar relevancia;
- validar vigencia;
- validar permisos;
- respetar el presupuesto de contexto;
- conservar trazabilidad hacia la fuente.

### Punto 13 — Security Constraints · Restricciones de seguridad

Demuestren al menos una consulta con dos roles distintos.

Resultado esperado:

```text
Misma consulta + distinto rol → conjunto autorizado de candidatos diferente
```

La similitud semántica nunca debe sobrepasar una regla de acceso.

### Punto 14 — Acceptance Criteria · Criterios de aceptación

La célula debe establecer umbrales antes de declarar éxito.

Ejemplo:

```text
Precision@3 promedio >= 0.67
Recall@3 promedio >= 0.80
Hit Rate@3 >= 0.80
0 chunks no autorizados recuperados
100% de consultas sin respuesta detectadas correctamente
Trazabilidad de todos los chunks hacia su documento
```

Los valores son una referencia. Cada equipo debe justificar sus propios umbrales según el riesgo del escenario.

## 9. Uso de Antigravity durante el laboratorio

Antigravity puede ayudar a construir el proyecto, pero cada célula conserva la responsabilidad sobre las decisiones y la evidencia.

Flujo recomendado:

1. Entregar al agente únicamente el punto actual, la estructura esperada y el criterio de aceptación.
2. Pedirle inspeccionar los archivos existentes antes de proponer cambios.
3. Ejecutar y validar el resultado antes de avanzar.
4. Registrar qué decisión tomó la célula y qué parte implementó el agente.
5. No permitir que el agente invente documentos relevantes ni métricas esperadas después del experimento.

Prompt inicial sugerido:

```text
Actúa como asistente de implementación para un laboratorio educativo de recuperación de información.

Trabajaremos una fase a la vez. Antes de modificar archivos, inspecciona el proyecto y resume el estado actual. Implementa únicamente la fase que te indique. Usa Python 3.10+, ejecución local y datos ficticios o autorizados. No agregues servicios externos ni credenciales.

En cada fase debes entregar:
1. archivos modificados;
2. comando exacto de ejecución;
3. salida esperada;
4. validación realizada;
5. decisión que aún debe tomar el equipo.

No declares que la recuperación funciona sin ejecutar el benchmark definido por la célula.
```

Prompts por fase:

```text
Fase 1: implementa la carga y validación de documents.json. Rechaza documentos sin id, text, version o allowed_roles.
```

```text
Fase 2: implementa chunking configurable preservando document_id, chunk_id, position y metadata. Permite comparar dos configuraciones.
```

```text
Fase 3: genera embeddings locales para cada chunk y construye el ranking por similitud cosenoidal.
```

```text
Fase 4: implementa Top-K y filtros deterministas de metadata y permisos. Los filtros de seguridad deben aplicarse antes de ensamblar contexto.
```

```text
Fase 5: carga benchmark.json y calcula Precision@K, Recall@K y Hit Rate@K por consulta y como promedio. Trata las consultas sin respuesta como casos de abstención separados.
```

```text
Fase 6: ejecuta una comparación controlada entre dos estrategias cambiando una sola variable. Exporta resultados.json sin alterar la verdad de referencia.
```

## 10. Experimento obligatorio

Cada célula comparará dos configuraciones modificando una sola variable:

```text
Configuración A → ejecutar benchmark → registrar métricas
Configuración B → ejecutar benchmark → registrar métricas
Comparar → identificar fallo → justificar siguiente ajuste
```

Variables permitidas:

- chunk size;
- overlap;
- estrategia semántica frente a híbrida;
- Top-K;
- threshold;
- filtro de metadata;
- reranking.

No cambien varias variables simultáneamente porque no podrán explicar cuál produjo el efecto.

## 11. Entregable final

### A. Proyecto ejecutable

```text
lab04-retrieval/
```

Debe ejecutarse con un comando documentado y producir los resultados del benchmark.

### B. Retrieval Specification

El archivo `evidence/retrieval-specification.md` debe responder las 14 secciones del Lab 04.

### C. Evidencia experimental

```json
{
  "experiment": "A_vs_B",
  "controlled_variable": "top_k",
  "configuration_a": {},
  "configuration_b": {},
  "query_results": [],
  "aggregate_metrics": {},
  "observed_failure": "",
  "decision": ""
}
```

### D. Presentación de cinco minutos

Cada célula debe mostrar:

1. problema y corpus;
2. estrategia seleccionada;
3. una consulta exitosa;
4. una consulta que falló;
5. métricas antes y después;
6. siguiente ajuste propuesto.

---

# Taller de clase para L03 — El Tribunal del Retrieval

## Propósito

Afianzar Precision@K, Recall@K, Hit Rate@K, Top-K, threshold y reranking mediante una comparación controlada de estrategias.

**Duración:** 55 minutos  
**Modalidad:** seis células  
**Entrada:** mismo corpus y benchmark para todos  
**Salida:** veredicto técnico respaldado por métricas  

## Preparación del tutor

Entrega a todas las células:

- un corpus ficticio de 10 a 15 documentos;
- cinco consultas;
- verdad de referencia por consulta;
- resultados ordenados de dos estrategias, A y B;
- una plantilla para calcular métricas.

Las cinco consultas deben incluir:

1. una consulta típica;
2. una consulta semántica;
3. un identificador exacto;
4. una consulta ambigua;
5. una consulta sin respuesta.

## Desarrollo

### 0–8 min · Predicción

Cada célula recibe dos configuraciones sin métricas visibles:

```text
Estrategia A: búsqueda semántica, K=2, sin reranking
Estrategia B: búsqueda híbrida, K=5, con filtro de vigencia
```

La célula predice cuál tendrá mayor precisión, cobertura, costo y riesgo de ruido.

### 8–23 min · Cálculo

Para cada consulta calculan:

```text
Precision@K
Recall@K
Hit@K
Falsos positivos
Evidencia omitida
```

Para la consulta sin respuesta registran:

```text
¿El sistema se abstuvo?
¿Recuperó ruido?
¿Qué threshold habría evitado el falso match?
```

### 23–35 min · Diagnóstico

Cada célula selecciona el peor caso y clasifica el fallo:

```text
chunking
estrategia de búsqueda
Top-K
metadata
threshold
reranking
permisos
```

Después propone un solo ajuste y formula una hipótesis verificable.

Ejemplo:

```text
Si aplicamos búsqueda híbrida para consultas con códigos exactos, aumentará Hit Rate@3 sin reducir Precision@3 en las consultas semánticas.
```

### 35–45 min · Segunda ejecución

Ejecutan la configuración ajustada o reciben del tutor el ranking correspondiente. Recalculan las métricas y determinan si la hipótesis fue aceptada o rechazada.

### 45–55 min · Tribunal técnico

Cada célula dispone de 90 segundos para presentar:

1. estrategia seleccionada;
2. métrica que mejoró;
3. métrica o costo que empeoró;
4. fallo que permanece;
5. decisión final: aprobar, ajustar o rechazar.

## Preguntas a Responder por las Células

- ¿La estrategia recuperó evidencia o solo obtuvo puntajes altos?
- ¿Qué relevante quedó fuera de Top-K?
- ¿Cuánto ruido entraría al contexto?
- ¿Qué ocurre si aumentamos K?
- ¿El reranking cambió realmente el orden útil?
- ¿Cómo se comportó la consulta sin respuesta?
- ¿Un documento relevante pero no autorizado debe contar como éxito?
- ¿Qué métrica representa mejor el riesgo de este proceso?

## Criterio de éxito del taller

La célula aprueba si puede:

- calcular correctamente las tres métricas;
- explicar el equilibrio entre precisión y cobertura;
- detectar al menos un falso positivo y una omisión;
- tratar el no-match sin forzar una respuesta;
- distinguir ranking, selección y ensamblaje;
- proponer un ajuste basado en evidencia.

## Frase de cierre para todos

> Un puntaje de similitud no demuestra que el sistema encontró la evidencia correcta. Un sistema de recuperación se valida contra preguntas representativas, una verdad de referencia y métricas explícitas. Solo después de superar ese control tiene sentido entregar sus candidatos a un LLM.
