# M04-L02 — Demo por Células: Construir una Mini Tubería RAG en Python

## Actividad práctica para CASE OS

**Módulo:** 04 — Recuperación y RAG  
**Lección:** 02 — La Tubería RAG  
**Modalidad:** trabajo por células  
**Duración sugerida:** 45–60 minutos  
**Lenguaje:** Python 3.10+  
**Dependencias:** `sentence-transformers`, `scikit-learn`

---

# 1. Propósito de la actividad

En la Lección 01 construimos progresivamente:

```text
Texto
  ↓
Embedding
  ↓
Vector
  ↓
Similitud coseno
  ↓
Ranking
  ↓
Top-K
```

Ahora vamos a continuar exactamente desde ese punto.

La meta de esta demo es que cada célula construya una mini tubería RAG local:

```text
Documento
  ↓
Chunking
  ↓
Embeddings
  ↓
Consulta
  ↓
Retrieval Top-K
  ↓
Context Build
  ↓
Respuesta simulada
```

La actividad NO usa todavía un LLM real.

El objetivo es entender que RAG no empieza en el LLM.

Empieza preparando y recuperando contexto útil.

---

# 2. Resultado esperado

Al terminar, cada célula debe poder mostrar funcionando:

1. Un documento dividido en chunks.
2. Embeddings generados para esos chunks.
3. Una consulta convertida en embedding.
4. Un ranking semántico de chunks.
5. Un Top-K.
6. Un contexto ensamblado a partir de los chunks recuperados.
7. Una explicación de qué parte del flujo pertenece a:
   - Offline / Ingestion
   - Online / Inference

---

# 3. Estructura del proyecto

Cada célula debe crear:

```text
demo-rag-python/
├── requirements.txt
├── data/
│   └── knowledge_base.txt
├── step_01_chunking.py
├── step_02_embeddings.py
├── step_03_retrieval.py
├── step_04_context_build.py
└── demo_rag.py
```

---

# 4. Preparación

## 4.1 Crear carpeta

```bash
mkdir demo-rag-python
cd demo-rag-python
```

## 4.2 Crear entorno virtual

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Linux/macOS:

```bash
python -m venv .venv
source .venv/bin/activate
```

## 4.3 Crear `requirements.txt`

```txt
sentence-transformers
scikit-learn
```

Instalar:

```bash
pip install -r requirements.txt
```

---

# 5. Dataset base de la actividad

Crear:

```text
data/knowledge_base.txt
```

Contenido:

```text
Los usuarios que olviden su contraseña deben utilizar la opción Restablecer contraseña del portal corporativo.

Si una cuenta queda bloqueada por múltiples intentos fallidos, el desbloqueo debe ser realizado por soporte después de validar la identidad del usuario.

Las solicitudes de nuevos roles deben ser registradas por el jefe inmediato en el sistema de accesos.

Para solicitar acceso VPN se requiere un ticket aprobado por el responsable del área.

Los incidentes críticos de base de datos SQL Server deben ser escalados al equipo de soporte especializado.

Las vacaciones deben ser solicitadas con mínimo quince días de anticipación y requieren aprobación del jefe inmediato.
```

---

# 6. Paso 1 — Chunking

Crear:

```text
step_01_chunking.py
```

Código:

```python
from pathlib import Path

text = Path("data/knowledge_base.txt").read_text(encoding="utf-8")

chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]

print("Chunks generados:", len(chunks))

for index, chunk in enumerate(chunks, start=1):
    print(f"\nCHUNK {index}")
    print(chunk)
```

Ejecutar:

```bash
python step_01_chunking.py
```

## Pregunta para la célula

> ¿Por qué estamos dividiendo el documento antes de generar embeddings?

## Concepto que conecta con la teoría

```text
Documento completo
       ↓
    Chunking
       ↓
Fragmentos con significado
```

Conclusión esperada:

> Queremos recuperar fragmentos concretos, no enviar siempre el documento completo.

---

# 7. Paso 2 — Embeddings por chunk

Crear:

```text
step_02_embeddings.py
```

Código:

```python
from pathlib import Path
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

text = Path("data/knowledge_base.txt").read_text(encoding="utf-8")

chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]

embeddings = model.encode(chunks)

print("Cantidad de chunks:", len(chunks))
print("Dimensiones del embedding:", len(embeddings[0]))

for index, chunk in enumerate(chunks, start=1):
    print(f"\nCHUNK {index}")
    print(chunk)
    print("Primeros 5 valores:")
    print(embeddings[index - 1][:5])
```

Ejecutar:

```bash
python step_02_embeddings.py
```

## Conexión con la Lección 01

Esto ya lo hicieron antes:

```text
Texto
 ↓
Embedding
 ↓
Vector
```

La diferencia ahora es:

```text
Documento
 ↓
Chunks
 ↓
Embedding por chunk
```

---

# 8. Paso 3 — Retrieval semántico

Crear:

```text
step_03_retrieval.py
```

Código:

```python
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

text = Path("data/knowledge_base.txt").read_text(encoding="utf-8")

chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]

chunk_embeddings = model.encode(chunks)

query = "Mi usuario quedó bloqueado y no puedo entrar"

query_embedding = model.encode([query])

scores = cosine_similarity(
    query_embedding,
    chunk_embeddings
)[0]

ranking = sorted(
    zip(chunks, scores),
    key=lambda item: item[1],
    reverse=True
)

print("QUERY:")
print(query)

print("\nRANKING:")

for position, (chunk, score) in enumerate(ranking, start=1):
    print(f"\n{position}. Score: {score:.3f}")
    print(chunk)
```

Ejecutar:

```bash
python step_03_retrieval.py
```

## Pregunta para la célula

> ¿Qué chunk debería quedar primero y por qué?

## Conceptos que deben identificar

```text
Query
 ↓
Embedding de query
 ↓
Comparación con embeddings
 ↓
Cosine Similarity
 ↓
Ranking
```

Esto conecta directamente con la Lección 01.

---

# 9. Paso 4 — Top-K

Agregar al final de `step_03_retrieval.py`:

```python
top_k = 2

print(f"\nTOP-{top_k}:")

for position, (chunk, score) in enumerate(ranking[:top_k], start=1):
    print(f"\n{position}. Score: {score:.3f}")
    print(chunk)
```

## Pregunta

> ¿Qué pasa si usamos K = 1?

Luego:

> ¿Qué pasa si usamos K = 5?

La célula debe discutir:

```text
K pequeño
→ menos ruido
→ riesgo de dejar contexto útil afuera

K grande
→ más cobertura
→ más ruido y costo
```

---

# 10. Paso 5 — Context Build

Crear:

```text
step_04_context_build.py
```

Código:

```python
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

text = Path("data/knowledge_base.txt").read_text(encoding="utf-8")

chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]

chunk_embeddings = model.encode(chunks)

query = "Mi usuario quedó bloqueado y no puedo entrar"

query_embedding = model.encode([query])

scores = cosine_similarity(
    query_embedding,
    chunk_embeddings
)[0]

ranking = sorted(
    zip(chunks, scores),
    key=lambda item: item[1],
    reverse=True
)

top_k = 2
retrieved = ranking[:top_k]

context = "\n\n".join(
    f"[Fragmento {index}]\n{chunk}"
    for index, (chunk, score) in enumerate(retrieved, start=1)
)

prompt = (
    "INSTRUCCIÓN:\n"
    "Responde utilizando únicamente el contexto proporcionado.\n\n"
    f"CONTEXTO:\n{context}\n\n"
    f"PREGUNTA:\n{query}"
)

print(prompt)
```

Ejecutar:

```bash
python step_04_context_build.py
```

---

# 11. Momento clave de la actividad

Detenerse aquí.

Preguntar a todas las células:

> ¿Qué cambió respecto a la Lección 01?

Respuesta esperada:

En la Lección 01 terminábamos en:

```text
Top-K
```

Ahora continuamos:

```text
Top-K
 ↓
Context Build
 ↓
Prompt listo para LLM
```

Frase importante:

> Retrieval encuentra candidatos. Context Build decide qué evidencia verá el modelo.

---

# 12. Demo completa

Crear:

```text
demo_rag.py
```

Código:

```python
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

MODEL_NAME = "all-MiniLM-L6-v2"
TOP_K = 2

model = SentenceTransformer(MODEL_NAME)

text = Path("data/knowledge_base.txt").read_text(encoding="utf-8")

chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]

print("=" * 60)
print("FASE OFFLINE / INGESTION")
print("=" * 60)

print("\n1. Documento cargado")

print("\n2. Chunking")
print("Chunks:", len(chunks))

print("\n3. Generando embeddings")

chunk_embeddings = model.encode(chunks)

print(
    "Embeddings:",
    len(chunk_embeddings),
    "x",
    len(chunk_embeddings[0])
)

print("\n4. Base vectorial simulada lista")

print("\n" + "=" * 60)
print("FASE ONLINE / INFERENCE")
print("=" * 60)

while True:
    query = input(
        "\nEscribe una pregunta o 'salir': "
    ).strip()

    if query.lower() == "salir":
        break

    print("\n5. Query recibida")
    print(query)

    query_embedding = model.encode([query])

    print("\n6. Retrieval")

    scores = cosine_similarity(
        query_embedding,
        chunk_embeddings
    )[0]

    ranking = sorted(
        zip(chunks, scores),
        key=lambda item: item[1],
        reverse=True
    )

    retrieved = ranking[:TOP_K]

    for position, (chunk, score) in enumerate(
        retrieved,
        start=1
    ):
        print(f"\nResultado {position}")
        print(f"Score: {score:.3f}")
        print(chunk)

    print("\n7. Context Build")

    context = "\n\n".join(
        f"[Fuente {position}]\n{chunk}"
        for position, (chunk, score) in enumerate(
            retrieved,
            start=1
        )
    )

    prompt = (
        "INSTRUCCIÓN:\n"
        "Responde utilizando únicamente el contexto proporcionado.\n\n"
        f"CONTEXTO:\n{context}\n\n"
        f"PREGUNTA:\n{query}"
    )

    print(prompt)

    print("=" * 60)
    print("8. LLM")
    print("En esta demo no invocamos todavía un LLM real.")
    print("El prompt anterior sería la entrada del modelo.")
```

Ejecutar:

```bash
python demo_rag.py
```

---

# 13. Consultas que cada célula debe probar

## Consulta 1

```text
Mi cuenta quedó bloqueada
```

Esperado: chunk de desbloqueo.

## Consulta 2

```text
Necesito conectarme remotamente a la empresa
```

Esperado: chunk de VPN.

## Consulta 3

```text
Quiero pedir vacaciones
```

Esperado: chunk de vacaciones.

## Consulta 4

```text
Necesito permisos nuevos en el sistema
```

Esperado: chunk de roles.

## Consulta 5

```text
SQL Server está presentando un incidente grave
```

Esperado: chunk de incidentes SQL Server.

---

# 14. Experimento obligatorio — romper el chunking

Cada célula debe modificar temporalmente el chunking.

Reemplazar:

```python
chunks = [
    chunk.strip()
    for chunk in text.split("\n\n")
    if chunk.strip()
]
```

por:

```python
chunks = [
    text[index:index + 40]
    for index in range(0, len(text), 40)
]
```

Ejecutar otra vez una consulta.

## Pregunta

> ¿Mejoró o empeoró el retrieval?

La célula debe observar que algunos fragmentos:

- quedan incompletos;
- pierden significado;
- pueden devolver peores resultados.

Conclusión:

> Chunking es parte de la calidad del retrieval.

---

# 15. Experimento obligatorio — cambiar Top-K

Probar:

```python
TOP_K = 1
```

Luego:

```python
TOP_K = 4
```

La célula debe registrar:

```text
TOP_K = 1
Ventaja:
Riesgo:

TOP_K = 4
Ventaja:
Riesgo:
```

---

# 16. Experimento opcional — metadata

Modificar los chunks para usar diccionarios:

```python
chunks = [
    {
        "text": "Si una cuenta queda bloqueada por múltiples intentos fallidos, soporte debe validar la identidad y ejecutar el desbloqueo.",
        "area": "soporte"
    },
    {
        "text": "Las vacaciones deben solicitarse con mínimo quince días de anticipación.",
        "area": "recursos-humanos"
    }
]
```

Pregunta:

> ¿Qué ventaja tendría filtrar por área antes de hacer retrieval?

Conclusión:

```text
Metadata
→ filtros
→ menos ruido
→ control
```

---

# 17. Mapa conceptual final

Cada célula debe poder explicar este flujo:

```text
                    OFFLINE

Documento
   ↓
Chunking
   ↓
Chunks
   ↓
Embeddings
   ↓
Vector Store


                    ONLINE

Pregunta
   ↓
Embedding Query
   ↓
Retrieval
   ↓
Top-K
   ↓
Context Build
   ↓
LLM
   ↓
Respuesta
```

---

# 18. Conexión explícita L01 → L02

## Lección 01

```text
Texto
 ↓
Embedding
 ↓
Vector
 ↓
Similarity
 ↓
Top-K
```

## Lección 02

Partimos exactamente desde ahí:

```text
Top-K
 ↓
Context Build
 ↓
LLM
```

Pero además descubrimos que antes del embedding del documento existe:

```text
Documento
 ↓
Chunking
 ↓
Embedding
```

Entonces el pipeline completo queda:

```text
Documento
 ↓
Chunking
 ↓
Embedding
 ↓
Vector Store
        ↑
        │
Query → Embedding
        │
        ↓
     Retrieval
        ↓
      Top-K
        ↓
 Context Build
        ↓
       LLM
```

---

# 19. Entregable por célula

Cada célula debe entregar la carpeta:

```text
demo-rag-python/
```

con los archivos funcionando.

Además debe responder:

```md
# Informe corto de la célula

## 1. ¿Qué hace el chunking?

## 2. ¿Qué relación tiene con embeddings?

## 3. ¿Qué es retrieval?

## 4. ¿Qué significa Top-K?

## 5. ¿Qué es Context Build?

## 6. ¿Qué pertenece a Offline?

## 7. ¿Qué pertenece a Online?

## 8. ¿Qué ocurrió cuando rompieron el chunking?

## 9. ¿Qué ocurrió al cambiar Top-K?

## 10. ¿Qué mejorarían para convertir esta demo en un RAG real?
```

---

# 20. Criterios de éxito

La célula completa la actividad si puede demostrar:

- el documento se divide;
- los chunks se vectorizan;
- la query se vectoriza;
- se calcula similitud;
- se obtiene ranking;
- se selecciona Top-K;
- se construye contexto;
- pueden explicar Offline vs Online;
- pueden mostrar por qué un chunking malo deteriora retrieval;
- pueden explicar por qué Top-K no debe maximizarse sin criterio.

---

# 21. Reto opcional — usar una rutina propia

Cada célula puede reemplazar `knowledge_base.txt` por contenido relacionado con su propia rutina:

- soporte;
- vinculación;
- captación;
- canales no presenciales;
- otra rutina de trabajo.

No usar:

- información confidencial;
- credenciales;
- PII;
- código propietario;
- datos sensibles.

---

# 22. Cierre para mostrar en CASE OS

> En la Lección 01 aprendimos a representar y recuperar información por significado.

> En esta actividad convertimos ese retrieval en la primera mitad de una tubería RAG real: preparamos documentos, construimos chunks, generamos embeddings, recuperamos Top-K y ensamblamos el contexto que recibiría un LLM.

Idea final:

```text
RAG no empieza con el LLM.

RAG empieza con la calidad del conocimiento que preparamos
y con la calidad del contexto que recuperamos.
```
