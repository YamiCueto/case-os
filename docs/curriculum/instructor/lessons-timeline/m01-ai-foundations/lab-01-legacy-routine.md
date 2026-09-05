# M01-LAB01 — Analizar una Rutina Legacy

## Guía de tutor

**Duración sugerida en vivo:** aproximadamente 2 horas  
**Objetivo:** que el estudiante separe una rutina real entre lógica que debe seguir determinista y oportunidades donde un LLM podría asistir bajo supervisión humana.

## Regla de seguridad

> Nunca subir código propietario, credenciales, secretos, PII o información confidencial a una herramienta de IA que no esté autorizada por la organización.

El laboratorio ocurre en el IDE y en las herramientas corporativas autorizadas del estudiante. CASE Academy no requiere subir un repositorio privado.

## Resultado esperado

Un **Risk & Opportunity Assessment** local que incluya:

- Rutina seleccionada y propósito.
- Entradas, salidas, reglas y efectos secundarios.
- Lógica que debe conservarse determinista.
- Oportunidades probabilísticas posibles.
- Riesgos, supuestos de la IA y decisión humana.

## Antes de iniciar

Pide que seleccionen una rutina con decisiones reales: validación, cálculo, procesamiento de datos externos o reglas de negocio. Evita un CRUD trivial y evita código confidencial en una herramienta no autorizada.

Frase de apertura:

> “No venimos a pedirle a la IA que reescriba código. Venimos a entender una rutina y decidir con criterio qué parte, si alguna, podría asistirse con IA.”

## Timeline del laboratorio

| Tiempo | Actividad | Rol del tutor |
|---|---|---|
| 17:00–17:15 | Contexto y límite de seguridad | Confirmar herramienta autorizada y objetivo de análisis. |
| 17:15–17:30 | Seleccionar rutina | Evitar CRUDs o rutinas demasiado grandes. |
| 17:30–17:50 | Entender la rutina | Documentar entradas, salidas, reglas y efectos secundarios. |
| 17:50–18:10 | Clasificar | Usar la actividad visual o una tabla local. |
| 18:10–18:20 | Pausa y revisión entre pares | Comprobar que la frontera propuesta tiene sentido. |
| 18:20–18:40 | Análisis con IA autorizada | Usar contrato de análisis, sin cambios de código. |
| 18:40–18:55 | Verificación humana | Detectar supuestos, alucinaciones y riesgos. |
| 18:55–19:00 | Cierre | Compartir una decisión y su justificación. |

## Clasificación: cómo guiarla

### Debe permanecer determinista

- Cálculos fiscales o financieros.
- Validación de saldos, permisos y esquemas.
- Reglas reguladas.
- Escrituras, transferencias o borrados.

### Puede ser oportunidad probabilística

- Extraer información de texto variable o PDFs no estandarizados.
- Clasificar intención o tema.
- Resumir un caso para revisión humana.
- Explicar código o generar documentación inicial.

Pregunta clave:

> “Si esta salida fuera incorrecta una vez de cada cien, ¿qué daño ocurriría y quién podría detenerlo?”

## Actividad visual de CASE Academy

La plataforma propone cuatro elementos:

| Elemento | Discusión esperada |
|---|---|
| Cálculo de impuestos locales | Determinista. |
| Extracción de datos de PDF adjunto | Posible oportunidad probabilística si el formato varía; validar resultados. |
| Validación de saldo en cuenta | Determinista. |
| Categorización del motivo del gasto | Posible oportunidad probabilística, con revisión según riesgo. |

No presentes las categorías como leyes absolutas: el riesgo, el contexto y la validación cambian la decisión.

## Contrato para usar IA autorizada

El estudiante puede usar un prompt como:

```text
Analiza esta rutina. Identifica entradas, salidas, dependencias,
reglas de negocio y posibles efectos secundarios.
No generes ni modifiques código. Indica explícitamente qué información
no puedes confirmar a partir del contexto recibido.
```

Después pregunta:

> “¿La herramienta inventó una dependencia, una regla o un framework que no estaba en el código?”

## Errores comunes y corrección

- **“Mejora este código” como primer prompt:** detener y volver a análisis.
- **Delegar una regla financiera al modelo:** preguntar por el costo de un error.
- **Tratar Regex como probabilístico:** Regex sigue siendo determinista; lo probabilístico ayuda cuando la variabilidad semántica supera una regla mantenible.
- **Aceptar el análisis sin comprobarlo:** pedir evidencia en el código fuente.

## Cierre

> “La buena integración de IA comienza con una frontera clara. El modelo puede ayudar a interpretar, extraer o explicar; el sistema y el humano conservan la responsabilidad sobre reglas y acciones.”

### Puesta en común final

Cada estudiante comparte en un minuto: la rutina elegida, una regla que no delegaría, una oportunidad de IA y la defensa que exigiría antes de usarla. Esto convierte el laboratorio en aprendizaje colectivo, incluso si no todos pueden mostrar código.

## Checklist de salida

- [ ] La rutina fue autorizada para analizarse.
- [ ] Se documentaron entradas, salidas y efectos secundarios.
- [ ] Se separaron decisiones deterministas y oportunidades probabilísticas.
- [ ] La IA recibió un contrato de análisis, no de reescritura.
- [ ] Se revisaron supuestos o posibles alucinaciones.
