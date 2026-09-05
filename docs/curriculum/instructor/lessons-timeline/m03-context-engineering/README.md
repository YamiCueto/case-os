# M03 — Ingeniería de Contexto

Estas guías ayudan a impartir el módulo en vivo. La lectura de la app es el punto de partida; cada sesión se expande con preguntas, ejemplos visibles y práctica para durar aproximadamente dos horas.

## Idea central para el tutor

El cambio mental es pasar de «¿qué le escribo al modelo?» a «¿qué necesita saber el modelo para resolver esta tarea?». Un LLM no ve la pantalla, el usuario ni la base de datos: el sistema debe seleccionar y preparar esa información antes de cada llamada.

> **Contexto mínimo útil** = toda la información indispensable para la tarea, pero sin ruido, duplicados ni datos que no aportan.

## Ruta del módulo

```text
Fuentes disponibles
        ↓ seleccionar lo necesario
Contexto mínimo útil
        ↓ ordenar bajo un presupuesto
Payload ensamblado
        ↓ limpiar o resumir
Contexto compacto y verificable
        ↓
LLM
```

| Recurso | Para qué sirve en clase |
| --- | --- |
| [Lección 01 — Anatomía](lesson-01-anatomy.md) | Distinguir información disponible de información útil. |
| [Lección 02 — Ensamblaje](lesson-02-assembly-prioritization.md) | Priorizar relevancia, recencia y redundancia. |
| [Lección 03 — Compresión](lesson-03-compression-validation.md) | Preservar señal sin romper estructura ni presupuesto. |
| [Demo 03 — Diseñar el contexto](demo-03-engineer-context.md) | Elegir el conjunto correcto dentro de 100 unidades de presupuesto. |
| [Laboratorio 03 — Context Manifest](lab-03-minimum-useful-context.md) | Diseñar el contexto de una tarea real o simulada. |

## Recordatorios didácticos

- No anticipes bases vectoriales ni algoritmos de similitud: eso se aborda en M04.
- «Menos contexto» no es la regla. La regla es **mínimo útil**: si falta un dato crítico, la respuesta también puede fallar.
- El buen contexto mejora las condiciones de respuesta, pero no convierte al LLM en un sistema determinista. La salida sigue necesitando validación cuando corresponda.
- Para ejemplos corporativos, utiliza información ficticia, pública o aprobada. Nunca se suben secretos, PII ni código propietario a herramientas no autorizadas.

## Cierre hacia M04

Cuando el grupo ya sabe qué contexto necesita, formula la pregunta puente: «¿cómo encontramos esas piezas entre miles de documentos o archivos?». M04 responde esa pregunta mediante recuperación de información y RAG.
