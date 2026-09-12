# M04 · LAB 04 — Guía paso a paso en Google Colab
## Diseñar, ejecutar y evaluar una estrategia de Retrieval

**Duración sugerida:** 60–90 min<br>
**Nivel:** Advanced<br>
**Entregables:** Notebook de Colab + `benchmark.csv` + `retrieval-spec.md`

---

## 0. Objetivo del laboratorio

En este laboratorio vas a construir y evaluar un sistema pequeño de recuperación de información usando una fuente de conocimiento realista.

El objetivo **no es construir un chatbot** ni conectar todavía un agente.

El objetivo es demostrar, con evidencia, que una estrategia de recuperación:

1. recupera información relevante;
2. evita traer demasiado ruido;
3. puede detectar consultas sin evidencia suficiente;
4. permite justificar decisiones de chunking, metadata, Top-K y estrategia de búsqueda.

El flujo que construiremos será:

```text
Documentos
   ↓
Carga
   ↓
Chunking
   ↓
Metadata
   ↓
BM25 + Embeddings
   ↓
Hybrid Retrieval
   ↓
Top-K
   ↓
Threshold / Filters
   ↓
Benchmark
   ↓
Retrieval Specification
```

> **Principio del laboratorio:** Retrieval genera candidatos. No genera automáticamente el contexto final.

---

# 1. Límite de seguridad

No cargues en Google Colab documentación confidencial, credenciales, esquemas propietarios, contratos sensibles, PII, secretos comerciales ni información restringida por tu organización.

Para desarrollar el laboratorio puedes utilizar:

- documentación pública;
- documentación anonimizada;
- extractos sintéticos;
- información expresamente autorizada;
- una versión reducida y desensibilizada del corpus real.

Si tu organización no permite procesar la información en Colab, ejecuta exactamente el mismo laboratorio en Python dentro del entorno corporativo autorizado.

---

# 2. Elige tu fuente de conocimiento

Selecciona **una** fuente de conocimiento donde buscar manualmente archivo por archivo ya no sea práctico.

Ejemplos:

### Opción A — Documentación de APIs

- Swagger / OpenAPI
- especificaciones de endpoints
- contratos REST
- documentación de autenticación
- catálogos de errores

### Opción B — Diccionario de datos

- tablas
- columnas
- relaciones
- reglas de negocio
- convenciones de nombres

### Opción C — Políticas o manuales

- políticas de vacaciones
- políticas de seguridad
- procedimientos operativos
- manuales internos
- normativas

### Opción D — Incidentes o soporte

- tickets anonimizados
- incidentes técnicos
- soluciones conocidas
- errores frecuentes
- postmortems públicos o sintéticos

Para el laboratorio no necesitas miles de documentos.

Un corpus de **5 a 20 documentos** es suficiente para probar la estrategia.

---

# 3. Crea el notebook

Abre:

**https://colab.research.google.com/**

Selecciona:

```text
Archivo → Nuevo cuaderno
```

Renómbralo como:

```text
M04-LAB04-Retrieval-NombreEquipo.ipynb
```

---

# 4. Instala las dependencias

Ejecuta esta celda:

```python
!pip -q install sentence-transformers rank-bm25 pypdf
```

---

# 5. Importa las librerías

```python
import io
import json
import math
import re
from pathlib import Path

import numpy as np
import pandas as pd
from google.colab import files
from pypdf import PdfReader
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer
```

---

# 6. Carga tus documentos

Puedes cargar archivos:

```text
.txt
.md
.pdf
.json
.csv
```

Ejecuta:

```python
uploaded = files.upload()
```

Selecciona los archivos autorizados para el laboratorio.

---

# 7. Convierte los archivos en documentos

Ejecuta:

```python
def read_pdf(data):
    reader = PdfReader(io.BytesIO(data))
    return "\n".join(page.extract_text() or "" for page in reader.pages)

def read_json(data):
    obj = json.loads(data.decode("utf-8"))
    return json.dumps(obj, ensure_ascii=False, indent=2)

def read_csv(data):
    df = pd.read_csv(io.BytesIO(data))
    return df.to_csv(index=False)

def read_text(data):
    return data.decode("utf-8", errors="ignore")

def extract_text(filename, data):
    suffix = Path(filename).suffix.lower()

    if suffix == ".pdf":
        return read_pdf(data)

    if suffix == ".json":
        return read_json(data)

    if suffix == ".csv":
        return read_csv(data)

    return read_text(data)

documents = []

for filename, data in uploaded.items():
    text = extract_text(filename, data)

    documents.append({
        "document_id": filename,
        "title": Path(filename).stem,
        "content": text,
        "source_type": Path(filename).suffix.lower().replace(".", ""),
        "version": "current",
        "module": "general"
    })

len(documents)
```

Inspecciona:

```python
pd.DataFrame([
    {
        "document_id": d["document_id"],
        "title": d["title"],
        "chars": len(d["content"])
    }
    for d in documents
])
```

---

# 8. Define la metadata

Antes de continuar, revisa cada documento y asigna metadata útil para tu problema.

Ejemplo:

```python
documents[0]["module"] = "authentication"
documents[0]["version"] = "v2"
```

Puedes crear campos como:

```text
module
version
document_type
environment
role
product
year
status
```

No agregues metadata porque "se ve bien".

Agrega metadata que después pueda ayudarte a **filtrar candidatos irrelevantes**.

---

# 9. Configura el modelo de embeddings y tokenizer

Utilizaremos un modelo liviano que funciona bien para el laboratorio:

```python
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
```

---

# 10. Implementa chunking por tokens

Comienza con:

```python
CHUNK_SIZE = 350
OVERLAP = 50
```

Ejecuta:

```python
def chunk_text(text, tokenizer, chunk_size=350, overlap=50):
    token_ids = tokenizer.encode(text, add_special_tokens=False)

    chunks = []
    start = 0

    while start < len(token_ids):
        end = min(start + chunk_size, len(token_ids))
        chunk_ids = token_ids[start:end]
        chunk_text_value = tokenizer.decode(chunk_ids, skip_special_tokens=True).strip()

        if chunk_text_value:
            chunks.append(chunk_text_value)

        if end == len(token_ids):
            break

        start = end - overlap

    return chunks
```

Ahora crea los chunks:

```python
chunks = []

for document in documents:
    parts = chunk_text(
        document["content"],
        tokenizer,
        CHUNK_SIZE,
        OVERLAP
    )

    for index, part in enumerate(parts):
        chunks.append({
            "chunk_id": f'{document["document_id"]}::c{index + 1}',
            "document_id": document["document_id"],
            "title": document["title"],
            "content": part,
            "module": document["module"],
            "version": document["version"],
            "source_type": document["source_type"]
        })

len(chunks)
```

Inspecciona:

```python
pd.DataFrame(chunks).head()
```

---

# 11. Pregunta de ingeniería: ¿tu chunking tiene sentido?

Antes de construir la búsqueda, inspecciona varios chunks.

```python
for chunk in chunks[:5]:
    print("=" * 80)
    print(chunk["chunk_id"])
    print(chunk["content"][:1000])
```

Pregúntate:

- ¿las reglas quedan partidas?
- ¿las excepciones aparecen separadas de la regla principal?
- ¿un chunk mezcla temas no relacionados?
- ¿el overlap conserva continuidad?
- ¿el chunk contiene suficiente evidencia para responder una pregunta?

Registra tu decisión en:

```text
3. Chunking Strategy
```

---

# 12. Construye el baseline léxico con BM25

Tokeniza el corpus:

```python
def lexical_tokens(text):
    return re.findall(r"\w+", text.lower())

tokenized_corpus = [
    lexical_tokens(chunk["content"])
    for chunk in chunks
]

bm25 = BM25Okapi(tokenized_corpus)
```

Función de búsqueda:

```python
def lexical_search(query, top_k=5):
    scores = bm25.get_scores(lexical_tokens(query))
    order = np.argsort(scores)[::-1][:top_k]

    results = []

    for index in order:
        result = dict(chunks[index])
        result["lexical_score"] = float(scores[index])
        results.append(result)

    return results
```

Prueba:

```python
query = "Escribe aquí una consulta real de tu dominio"

pd.DataFrame(
    lexical_search(query, top_k=5)
)[[
    "chunk_id",
    "document_id",
    "lexical_score",
    "content"
]]
```

---

# 13. Construye Semantic Search con embeddings

Genera embeddings para todos los chunks:

```python
chunk_embeddings = model.encode(
    [chunk["content"] for chunk in chunks],
    normalize_embeddings=True,
    show_progress_bar=True
)
```

Función de búsqueda:

```python
def semantic_search(query, top_k=5):
    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )[0]

    scores = chunk_embeddings @ query_embedding
    order = np.argsort(scores)[::-1][:top_k]

    results = []

    for index in order:
        result = dict(chunks[index])
        result["semantic_score"] = float(scores[index])
        results.append(result)

    return results
```

Prueba la misma consulta:

```python
pd.DataFrame(
    semantic_search(query, top_k=5)
)[[
    "chunk_id",
    "document_id",
    "semantic_score",
    "content"
]]
```

---

# 14. Compara Lexical vs Semantic

Ejecuta:

```python
lexical = lexical_search(query, top_k=5)
semantic = semantic_search(query, top_k=5)

comparison = pd.DataFrame({
    "lexical": [x["chunk_id"] for x in lexical],
    "semantic": [x["chunk_id"] for x in semantic]
})

comparison
```

Ahora responde:

> ¿Ambas técnicas recuperan los mismos documentos?

> ¿BM25 funciona mejor con nombres exactos, IDs, tablas, códigos o términos técnicos?

> ¿Semantic Search funciona mejor cuando la consulta usa palabras diferentes a las del documento?

---

# 15. Construye Hybrid Search

Usaremos Reciprocal Rank Fusion.

```python
def reciprocal_rank_fusion(result_lists, k=60):
    scores = {}
    objects = {}

    for results in result_lists:
        for rank, result in enumerate(results, start=1):
            chunk_id = result["chunk_id"]
            scores[chunk_id] = scores.get(chunk_id, 0) + 1 / (k + rank)
            objects[chunk_id] = result

    ranked_ids = sorted(
        scores,
        key=scores.get,
        reverse=True
    )

    output = []

    for chunk_id in ranked_ids:
        result = dict(objects[chunk_id])
        result["hybrid_score"] = scores[chunk_id]
        output.append(result)

    return output
```

Ahora:

```python
def hybrid_search(query, top_k=5):
    lexical = lexical_search(query, top_k=max(top_k * 3, 10))
    semantic = semantic_search(query, top_k=max(top_k * 3, 10))

    fused = reciprocal_rank_fusion([lexical, semantic])

    return fused[:top_k]
```

Ejecuta:

```python
pd.DataFrame(
    hybrid_search(query, top_k=5)
)[[
    "chunk_id",
    "document_id",
    "hybrid_score",
    "content"
]]
```

---

# 16. Agrega Metadata Filtering

Ejemplo:

```python
def filter_chunks(module=None, version=None):
    selected = []

    for index, chunk in enumerate(chunks):
        if module is not None and chunk["module"] != module:
            continue

        if version is not None and chunk["version"] != version:
            continue

        selected.append(index)

    return selected
```

Ahora analiza:

```text
Query sin filtro
vs
Query con filtro de módulo
vs
Query con filtro de versión
```

La pregunta no es si filtrar "siempre mejora".

La pregunta es:

> ¿Qué metadata reduce ruido sin eliminar evidencia relevante?

---

# 17. Define tus cinco consultas de benchmark

Debes construir cinco consultas reales.

Usa este patrón:

```python
benchmark_queries = [
    {
        "query_id": "Q1",
        "type": "typical",
        "query": "Escribe una consulta típica",
        "expected_sources": ["archivo-a.pdf"]
    },
    {
        "query_id": "Q2",
        "type": "exact-term",
        "query": "Escribe una consulta con término técnico exacto",
        "expected_sources": ["archivo-b.md"]
    },
    {
        "query_id": "Q3",
        "type": "no-answer",
        "query": "Escribe una pregunta cuya respuesta NO exista",
        "expected_sources": []
    },
    {
        "query_id": "Q4",
        "type": "ambiguous",
        "query": "Escribe una consulta ambigua",
        "expected_sources": ["archivo-c.pdf"]
    },
    {
        "query_id": "Q5",
        "type": "multi-source",
        "query": "Escribe una consulta que necesite varias fuentes",
        "expected_sources": ["archivo-a.pdf", "archivo-d.pdf"]
    }
]
```

**Importante:** define `expected_sources` **antes de mirar los resultados**.

Eso será tu referencia de evaluación.

---

# 18. Calcula Precision@K

```python
def precision_at_k(retrieved_sources, expected_sources, k):
    retrieved = retrieved_sources[:k]

    if not retrieved:
        return 0.0

    relevant = sum(
        1 for source in retrieved
        if source in expected_sources
    )

    return relevant / len(retrieved)
```

---

# 19. Calcula Hit Rate por consulta

```python
def query_hit(retrieved_sources, expected_sources):
    if not expected_sources:
        return None

    return int(
        any(
            source in expected_sources
            for source in retrieved_sources
        )
    )
```

---

# 20. Evalúa Hybrid Retrieval

```python
TOP_K = 5

rows = []

for item in benchmark_queries:
    results = hybrid_search(
        item["query"],
        top_k=TOP_K
    )

    retrieved_sources = [
        result["document_id"]
        for result in results
    ]

    precision = precision_at_k(
        retrieved_sources,
        item["expected_sources"],
        TOP_K
    )

    hit = query_hit(
        retrieved_sources,
        item["expected_sources"]
    )

    rows.append({
        "query_id": item["query_id"],
        "type": item["type"],
        "query": item["query"],
        "expected_sources": ", ".join(item["expected_sources"]),
        "retrieved_sources": ", ".join(retrieved_sources),
        "top_k": TOP_K,
        "precision_at_k": precision,
        "hit": hit
    })

benchmark_df = pd.DataFrame(rows)

benchmark_df
```

---

# 21. El caso especial: consulta sin respuesta

Una base vectorial siempre intentará devolver algo.

Por eso Q3 es fundamental.

Calcula la mejor similitud semántica:

```python
def best_semantic_score(query):
    result = semantic_search(query, top_k=1)

    if not result:
        return 0.0

    return result[0]["semantic_score"]
```

Prueba:

```python
q3 = benchmark_queries[2]["query"]

best_semantic_score(q3)
```

Define una hipótesis inicial:

```python
SEMANTIC_THRESHOLD = 0.45
```

No asumas que `0.45` es un valor universal.

Debes calibrarlo con tu corpus.

```python
def has_sufficient_evidence(query, threshold=0.45):
    return best_semantic_score(query) >= threshold
```

Ejecuta:

```python
for item in benchmark_queries:
    print(
        item["query_id"],
        best_semantic_score(item["query"]),
        has_sufficient_evidence(
            item["query"],
            SEMANTIC_THRESHOLD
        )
    )
```

La decisión correcta para Q3 debería poder convertirse en:

```text
NO HAY EVIDENCIA SUFICIENTE
```

en lugar de enviar ruido al modelo.

---

# 22. Compara Top-K

Prueba:

```python
for k in [2, 3, 5, 10]:
    print("=" * 80)
    print("TOP-K =", k)

    for item in benchmark_queries:
        results = hybrid_search(
            item["query"],
            top_k=k
        )

        sources = [
            result["document_id"]
            for result in results
        ]

        print(
            item["query_id"],
            sources
        )
```

Ahora responde:

- ¿con `K=2` pierdes fuentes necesarias?
- ¿con `K=10` introduces demasiado ruido?
- ¿qué valor representa el mejor compromiso?

Registra tu decisión en:

```text
6. Top-K Policy
```

---

# 23. Compara diferentes tamaños de chunk

Repite el experimento con al menos dos configuraciones adicionales.

Ejemplo:

```text
A → 200 tokens / overlap 30
B → 350 tokens / overlap 50
C → 600 tokens / overlap 80
```

Para cada configuración registra:

```text
Precision@K
Hit Rate
cantidad de chunks
calidad cualitativa del contexto recuperado
```

No existe un tamaño correcto universal.

Tu benchmark debe ayudarte a justificar la configuración seleccionada.

---

# 24. Exporta benchmark.csv

```python
benchmark_df.to_csv(
    "benchmark.csv",
    index=False
)

files.download("benchmark.csv")
```

---

# 25. Genera tu Retrieval Specification

Ejecuta:

```python
retrieval_spec = """# Retrieval Specification

## 1. Knowledge Source

## 2. Retrieval Problem

## 3. Chunking Strategy

## 4. Metadata Strategy

## 5. Search Strategy

## 6. Top-K Policy

## 7. Reranking Rules

## 8. Evaluation Benchmark

## 9. Precision@K Target

## 10. Recall / Hit Rate

## 11. Failure Cases

## 12. Context Integration

## 13. Security Constraints

## 14. Acceptance Criteria
"""

Path("retrieval-spec.md").write_text(
    retrieval_spec,
    encoding="utf-8"
)

files.download("retrieval-spec.md")
```

Completa las 14 secciones con las decisiones obtenidas durante el experimento.

---

# 26. Qué debe contener cada sección

## 1. Knowledge Source

Describe:

- qué documentos utilizaste;
- cuántos;
- formato;
- dominio;
- restricciones.

---

## 2. Retrieval Problem

Describe qué tipo de preguntas quieres resolver.

Ejemplo:

```text
El sistema debe recuperar reglas y excepciones de políticas operativas
aunque el usuario utilice terminología diferente a la documentación.
```

---

## 3. Chunking Strategy

Incluye:

```text
Chunk size
Overlap
Separadores
Pruebas realizadas
Configuración elegida
Razón
```

Evita:

```text
Elegimos 500 tokens porque es recomendado.
```

Prefiere:

```text
Evaluamos 200, 350 y 600 tokens.
350 mantuvo las reglas completas y obtuvo mejor Precision@5
sin incrementar significativamente el ruido.
```

---

## 4. Metadata Strategy

Explica:

```text
Qué metadata existe
Qué filtros utilizaste
Qué problema resuelve cada filtro
```

---

## 5. Search Strategy

Indica:

```text
Lexical
Semantic
Hybrid
```

y justifica con evidencia.

---

## 6. Top-K Policy

Indica:

```text
Valores evaluados
Valor elegido
Trade-off precisión / cobertura
```

---

## 7. Reranking Rules

Si no implementaste reranking, explica:

```text
Cuándo sería necesario
Qué candidatos reordenaría
Qué señal utilizarías
```

---

## 8. Evaluation Benchmark

Incluye las cinco consultas:

```text
Q1 típica
Q2 término exacto
Q3 sin respuesta
Q4 ambigua
Q5 multi-fuente
```

---

## 9. Precision@K Target

Define un criterio.

Ejemplo:

```text
Precision@5 >= 0.70
```

Debe ser coherente con tu caso.

---

## 10. Recall / Hit Rate

Define el nivel mínimo de cobertura requerido.

Ejemplo:

```text
Hit Rate >= 0.80
```

---

## 11. Failure Cases

Describe qué hará el sistema cuando:

```text
No existe respuesta
Hay baja similitud
Hay demasiados resultados
Hay conflicto entre fuentes
La versión correcta no aparece
```

---

## 12. Context Integration

Explica qué ocurrirá después del retrieval.

Ejemplo:

```text
Retrieve
→ Metadata Filter
→ Rerank
→ Deduplicate
→ Validate
→ Assemble Context
```

---

## 13. Security Constraints

Incluye:

```text
Permisos
Roles
Documentos restringidos
Información sensible
Infraestructura autorizada
```

---

## 14. Acceptance Criteria

Define cuándo tu estrategia puede considerarse válida.

Ejemplo:

```text
PASS si:

Precision@5 >= 0.70
Hit Rate >= 0.80
Q3 se rechaza por falta de evidencia
No se recuperan documentos fuera del rol permitido
```

---

# 27. Qué debes entregar

Al finalizar entrega exactamente:

```text
1. M04-LAB04-Retrieval-NombreEquipo.ipynb

2. benchmark.csv

3. retrieval-spec.md
```

---

# 28. Criterio de evaluación

No se evaluará quién utilizó la base vectorial más sofisticada.

Se evaluará si puedes demostrar:

- qué fuente indexaste;
- cómo construiste los chunks;
- qué metadata utilizaste;
- por qué elegiste lexical, semantic o hybrid;
- qué Top-K funciona mejor;
- qué ocurre cuando no existe respuesta;
- qué Precision@K obtuviste;
- qué Hit Rate obtuviste;
- cuáles son tus casos de fallo;
- cuál es tu criterio de aceptación.

---

# 29. Resultado esperado

Al terminar deberías poder defender una conclusión como:

> Probamos recuperación léxica, semántica e híbrida sobre cinco consultas de benchmark. La estrategia híbrida redujo falsos positivos en términos técnicos y mantuvo cobertura en preguntas conceptuales. Elegimos Top-K 5 y chunks de 350 tokens con overlap de 50 porque obtuvieron el mejor equilibrio entre Precision@K, Hit Rate y conservación del contexto. Añadimos un threshold para evitar construir contexto cuando no existe evidencia suficiente.

Eso es **Retrieval Engineering**.

---

# 30. Puente hacia M05

En este laboratorio tú decidiste:

```text
qué buscar
cómo buscar
cuándo rechazar resultados
qué estrategia utilizar
```

En M05 cambiaremos la pregunta:

> ¿Qué ocurre cuando una IA debe decidir autónomamente cuándo ejecutar retrieval, qué herramienta utilizar y qué hacer cuando los resultados son insuficientes?

Ese será el paso de:

```text
Retrieval Pipeline
```

a:

```text
Agentic Retrieval
```
