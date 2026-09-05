# Demo de Embeddings con Python para Clase

## Objetivo de la demo

Construir una demostración sencilla y progresiva para explicar:

1. Qué es un embedding.
2. Cómo convertir texto en vectores.
3. Cómo comparar textos con similitud coseno.
4. Cómo hacer una búsqueda semántica.
5. Cómo recuperar los resultados Top-K.
6. Cómo conectar estos conceptos con RAG y bases de datos vectoriales.

La demo está diseñada para ejecutarse localmente en Python sin depender de una API externa.

---

# 1. Requisitos previos

## Software

Necesitas:

- Python 3.10 o superior.
- `pip`.
- Un editor como VS Code.
- Conexión a Internet la primera vez que se descargue el modelo.

Verifica Python:

```bash
python --version
```

Verifica pip:

```bash
pip --version
```

---

# 2. Crear el proyecto

Crea una carpeta:

```text
demo-embeddings-python/
```

Estructura recomendada:

```text
demo-embeddings-python/
├── README.md
├── requirements.txt
├── demo_01_embeddings.py
├── demo_02_similarity.py
├── demo_03_semantic_search.py
├── demo_04_top_k.py
└── demo_completa.py
```

Entra a la carpeta:

```bash
cd demo-embeddings-python
```

---

# 3. Crear un entorno virtual

## Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

## Linux / macOS

```bash
python -m venv .venv
source .venv/bin/activate
```

Cuando el entorno esté activo deberías ver algo parecido a:

```text
(.venv)
```

---

# 4. Crear `requirements.txt`

Crea:

```text
requirements.txt
```

Contenido:

```txt
sentence-transformers
scikit-learn
numpy
```

Instala:

```bash
pip install -r requirements.txt
```

---

# 5. Modelo de embeddings

Usaremos:

```text
all-MiniLM-L6-v2
```

Este modelo transforma frases en vectores numéricos de 384 dimensiones.

No necesitas explicar su arquitectura interna en esta clase.

La idea importante es:

```text
Texto
  ↓
Modelo de embeddings
  ↓
Vector numérico
```

---

# 6. Demo 01 — Convertir texto en embeddings

Crea:

```text
demo_01_embeddings.py
```

Código:

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

frases = [
    "Olvidé mi contraseña",
    "No puedo ingresar a mi cuenta",
    "Necesito restablecer mis credenciales",
    "Quiero comprar una motocicleta"
]

embeddings = model.encode(frases)

print("Cantidad de frases:", len(embeddings))
print("Dimensiones por embedding:", len(embeddings[0]))

print("\nPrimera frase:")
print(frases[0])

print("\nPrimeros 10 valores de su embedding:")
print(embeddings[0][:10])
```

Ejecuta:

```bash
python demo_01_embeddings.py
```

## Qué explicar en clase

Antes de ejecutar pregunta:

> ¿Cómo podría una máquina representar el significado de una frase?

Después muestra que:

```text
"Olvidé mi contraseña"
```

termina convertida en algo similar a:

```text
[-0.031, 0.084, -0.017, ...]
```

Aclara:

> No interpretamos cada número individualmente. Nos interesa que frases relacionadas produzcan representaciones que podamos comparar.

Conclusión:

```text
Texto
  ↓
Embedding
  ↓
Vector
```

---

# 7. Demo 02 — Similitud coseno

Crea:

```text
demo_02_similarity.py
```

Código:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

frases = [
    "Olvidé mi contraseña",
    "No puedo ingresar a mi cuenta",
    "Necesito restablecer mis credenciales",
    "Quiero comprar una motocicleta"
]

embeddings = model.encode(frases)

matriz = cosine_similarity(embeddings)

for i, frase in enumerate(frases):
    print(f"\n{frase}")

    for j, otra in enumerate(frases):
        print(
            f"  vs {otra}: {matriz[i][j]:.3f}"
        )
```

Ejecuta:

```bash
python demo_02_similarity.py
```

## Pregunta antes de ejecutar

Pregunta al grupo:

> ¿Cuál de estas frases debería parecerse más a "Olvidé mi contraseña"?

Resultados esperados:

- "No puedo ingresar a mi cuenta" debería tener similitud relativamente alta.
- "Necesito restablecer mis credenciales" debería tener similitud relativamente alta.
- "Quiero comprar una motocicleta" debería estar más lejos.

## Concepto para explicar

```text
Embedding
  ↓
Vector
  ↓
Cosine Similarity
  ↓
Score de similitud
```

La similitud coseno se puede entender como:

> Comparar la dirección de dos vectores.

No es necesario explicar la fórmula matemática completa.

---

# 8. Demo 03 — Búsqueda semántica

Crea:

```text
demo_03_semantic_search.py
```

Código:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

documentos = [
    "Guía para recuperar la contraseña de la cuenta",
    "Crédito para compra de vivienda",
    "Proceso para bloquear una tarjeta perdida",
    "Opciones para financiar estudios universitarios",
    "Catálogo de motocicletas nuevas"
]

doc_embeddings = model.encode(documentos)

consulta = "No recuerdo cómo entrar a mi cuenta"

query_embedding = model.encode([consulta])

scores = cosine_similarity(
    query_embedding,
    doc_embeddings
)[0]

ranking = sorted(
    zip(documentos, scores),
    key=lambda item: item[1],
    reverse=True
)

print("Consulta:")
print(consulta)

print("\nRanking semántico:")

for documento, score in ranking:
    print(f"{score:.3f} - {documento}")
```

Ejecuta:

```bash
python demo_03_semantic_search.py
```

## Qué observar

La consulta:

```text
No recuerdo cómo entrar a mi cuenta
```

no contiene necesariamente la palabra:

```text
contraseña
```

pero el buscador debería posicionar bien:

```text
Guía para recuperar la contraseña de la cuenta
```

## Qué explicar

Aquí puedes decir:

> La búsqueda no depende únicamente de coincidencias exactas de palabras. Estamos comparando la representación semántica de la consulta con la representación de cada documento.

Flujo:

```text
Consulta
  ↓
Embedding de consulta
  ↓
Comparación contra embeddings de documentos
  ↓
Similitud coseno
  ↓
Ranking
```

---

# 9. Demo 04 — Top-K Retrieval

Crea:

```text
demo_04_top_k.py
```

Código:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

documentos = [
    "Guía para recuperar la contraseña de la cuenta",
    "Crédito para compra de vivienda",
    "Proceso para bloquear una tarjeta perdida",
    "Opciones para financiar estudios universitarios",
    "Catálogo de motocicletas nuevas"
]

doc_embeddings = model.encode(documentos)

consulta = "Quiero pagar la universidad de mi hijo"

query_embedding = model.encode([consulta])

scores = cosine_similarity(
    query_embedding,
    doc_embeddings
)[0]

ranking = sorted(
    zip(documentos, scores),
    key=lambda item: item[1],
    reverse=True
)

top_k = 3

print("Consulta:")
print(consulta)

print(f"\nTop-{top_k} resultados:")

for documento, score in ranking[:top_k]:
    print(f"{score:.3f} - {documento}")
```

Ejecuta:

```bash
python demo_04_top_k.py
```

## Pregunta para el grupo

Antes de ejecutarlo:

> Si tenemos mil documentos, ¿necesitamos enviar los mil al LLM?

Respuesta esperada:

> No. Recuperamos solamente los candidatos más relevantes.

Explicación:

```text
Top-K = los K resultados con mejor score
```

Por ejemplo:

```text
Top-1
Top-3
Top-5
```

No significa que todos sean correctos.

Significa:

> Son los candidatos más prometedores según el ranking.

---

# 10. Demo completa para ejecutar en un solo archivo

Crea:

```text
demo_completa.py
```

Código:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

documentos = [
    "Guía para recuperar la contraseña de la cuenta",
    "Crédito para compra de vivienda",
    "Proceso para bloquear una tarjeta perdida",
    "Opciones para financiar estudios universitarios",
    "Catálogo de motocicletas nuevas",
    "Factura #100245 pendiente de pago",
    "Factura #100246 pendiente de pago"
]

print("Generando embeddings de documentos...")

doc_embeddings = model.encode(documentos)

print("Documentos indexados:", len(documentos))
print("Dimensiones:", len(doc_embeddings[0]))

while True:
    print("\n" + "=" * 60)

    consulta = input(
        "Escribe una consulta o 'salir': "
    ).strip()

    if consulta.lower() == "salir":
        break

    query_embedding = model.encode([consulta])

    scores = cosine_similarity(
        query_embedding,
        doc_embeddings
    )[0]

    ranking = sorted(
        zip(documentos, scores),
        key=lambda item: item[1],
        reverse=True
    )

    top_k = 3

    print(f"\nTop-{top_k} resultados:\n")

    for position, (documento, score) in enumerate(
        ranking[:top_k],
        start=1
    ):
        print(
            f"{position}. {score:.3f} - {documento}"
        )
```

Ejecuta:

```bash
python demo_completa.py
```

---

# 11. Consultas para probar en vivo

Prueba estas consultas frente al grupo.

## Caso 1 — Recuperación de cuenta

```text
No puedo entrar a mi cuenta
```

Pregunta:

> ¿Qué documento debería quedar primero?

---

## Caso 2 — Educación

```text
Quiero financiar la universidad de mi hijo
```

Resultado esperado:

```text
Opciones para financiar estudios universitarios
```

---

## Caso 3 — Motocicletas

```text
Estoy buscando una moto nueva
```

Resultado esperado:

```text
Catálogo de motocicletas nuevas
```

---

## Caso 4 — Tarjeta

```text
Perdí mi tarjeta
```

Resultado esperado:

```text
Proceso para bloquear una tarjeta perdida
```

---

# 12. Ejemplo importante: límite de la búsqueda semántica

Ahora prueba:

```text
Factura #100245
```

Tienes:

```text
Factura #100245 pendiente de pago
Factura #100246 pendiente de pago
```

Pregunta:

> ¿Queremos un documento semánticamente parecido o exactamente la factura 100245?

Respuesta:

> Exactamente la factura 100245.

Aquí explicas por qué la búsqueda semántica no reemplaza la búsqueda léxica.

Flujo conceptual:

```text
"quiero financiar mis estudios"
        ↓
búsqueda semántica

"Factura #100245"
        ↓
búsqueda léxica

"Error timeout SQL Server"
        ↓
posiblemente búsqueda híbrida
```

---

# 13. Conectar con búsqueda híbrida

Dibuja:

```text
                 Consulta
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
      BM25 / Léxico       Embeddings
          ↓                   ↓
     Ranking lexical     Ranking vectorial
          └─────────┬─────────┘
                    ↓
                   RRF
                    ↓
             Ranking híbrido
```

Explica:

> La búsqueda híbrida combina señales exactas y semánticas.

La parte léxica protege:

- IDs.
- códigos.
- referencias.
- nombres exactos.
- números de factura.
- códigos de error.

La parte semántica ayuda con:

- intención.
- paráfrasis.
- sinónimos.
- lenguaje natural.

---

# 14. Conectar con una base de datos vectorial

Aclara que en esta demo estamos haciendo:

```python
cosine_similarity(
    query_embedding,
    doc_embeddings
)
```

contra todos los documentos.

Eso funciona para una demo pequeña.

Pero si tienes:

```text
10 documentos
100 documentos
10.000 documentos
1.000.000 documentos
100.000.000 documentos
```

no quieres comparar siempre contra todo.

Ahí aparecen las bases vectoriales como:

- Qdrant.
- Pinecone.
- Weaviate.
- Milvus.
- pgvector.
- Elasticsearch con búsqueda vectorial.

---

# 15. Conectar con HNSW

Explica:

```text
Consulta
  ↓
Embedding
  ↓
Vector DB
  ↓
Índice HNSW
  ↓
Approximate Nearest Neighbors
  ↓
Top-K
```

Frase para clase:

> Los embeddings definen la representación. HNSW ayuda a encontrar rápidamente vectores cercanos cuando la colección es grande.

No necesitas implementar HNSW en esta demo.

---

# 16. Conectar con RAG

Después de recuperar Top-K:

```text
Pregunta del usuario
        ↓
Embedding de consulta
        ↓
Búsqueda vectorial
        ↓
Top-K documentos
        ↓
Contexto
        ↓
LLM
        ↓
Respuesta
```

Puedes explicar:

> En RAG, el buscador no responde la pregunta. El buscador recupera información relevante que después se entrega al modelo como contexto.

---

# 17. Preguntas para hacer durante la demo

## Antes de embeddings

> ¿Cómo podemos hacer que una máquina compare dos frases aunque usen palabras diferentes?

## Después de mostrar el vector

> ¿Necesitamos entender qué significa cada número?

Respuesta:

> No.

## Antes de similitud coseno

> ¿Cómo sabemos qué vector está más cerca?

## Antes del ranking

> ¿Queremos todos los documentos o solamente los mejores candidatos?

## Antes de Top-K

> ¿Qué pasa si K es demasiado pequeño?

Posible respuesta:

> Podemos dejar información relevante por fuera.

## Luego

> ¿Qué pasa si K es demasiado grande?

Posible respuesta:

> Introducimos ruido.

## Antes del caso de factura

> ¿La búsqueda semántica debería decidir entre factura 100245 y 100246?

Respuesta:

> No necesariamente. Ahí importa la coincidencia exacta.

---

# 18. Orden recomendado para impartir la demo

Duración aproximada: 25 a 35 minutos.

## Minuto 0–5

Ejecutar:

```text
demo_01_embeddings.py
```

Objetivo:

> Entender texto → vector.

## Minuto 5–10

Ejecutar:

```text
demo_02_similarity.py
```

Objetivo:

> Entender comparación entre vectores.

## Minuto 10–18

Ejecutar:

```text
demo_03_semantic_search.py
```

Objetivo:

> Entender búsqueda semántica.

## Minuto 18–23

Ejecutar:

```text
demo_04_top_k.py
```

Objetivo:

> Entender Top-K.

## Minuto 23–30

Ejecutar:

```text
demo_completa.py
```

Permitir que los estudiantes propongan consultas.

## Minuto 30–35

Probar:

```text
Factura #100245
```

Cerrar explicando la necesidad de búsqueda híbrida.

---

# 19. Conceptos que deben llevarse

Al terminar la demo deberían poder explicar:

## Embedding

> Representación numérica de un contenido.

## Vector

> Lista de números producida por el modelo de embeddings.

## Similitud coseno

> Una forma de comparar vectores.

## Semantic Search

> Recuperación basada en cercanía semántica entre vectores.

## Ranking

> Orden de resultados según relevancia.

## Top-K

> Los K candidatos mejor posicionados.

## HNSW

> Índice diseñado para buscar vecinos cercanos eficientemente a gran escala.

## Vector Database

> Sistema especializado en almacenar, indexar y recuperar vectores.

## RAG

> Patrón donde recuperamos información antes de pedirle al LLM que responda.

---

# 20. Cierre sugerido para la clase

Puedes cerrar diciendo:

> “Hoy no usamos IA para generar texto. Usamos un modelo para representar significado. Convertimos frases en vectores, comparamos esos vectores y construimos un ranking. Esa capacidad de recuperar información por significado es una de las piezas fundamentales de los sistemas RAG.”

Luego dibuja:

```text
Texto
 ↓
Embedding
 ↓
Vector
 ↓
Índice / Vector DB
 ↓
Similarity Search
 ↓
Top-K
 ↓
Contexto
 ↓
LLM
```

Y termina con:

> “El embedding no responde preguntas. Nos ayuda a encontrar qué información podría servir para responderlas.”
