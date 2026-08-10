# Lab 07 — Map a Legacy Integration to MCP (Instructor Guide)

## Engineering Problem
Un equipo corporativo quiere que su IA analice datos de clientes desde una base de datos MySQL legacy (Core Financial App - CFA). Si usan una integración *ad-hoc*, crearán una deuda técnica inmensa. Si exponen la base de datos cruda al modelo a través de MCP sin *Least Privilege*, crearán una vulnerabilidad de seguridad crítica (exposición de contraseñas, purga de datos).

## Learning Objectives
- Diseñar la arquitectura de un Servidor MCP para envolver un sistema legacy.
- Categorizar capacidades estrictamente entre `Resources` y `Tools`.
- Implementar el principio de **Never Trust the Client** redactando contratos restrictivos.
- Diseñar flujos de **Failure & Recovery** (HITL) para llamadas destructivas.

## Scenario
El estudiante actúa como un Arquitecto de Backend de la CFA. El equipo de Front-End quiere usar Cursor para refactorizar interfaces, y el equipo de Business Intelligence quiere usar Claude Desktop para consultar reportes. Ambos necesitan que tú, el Arquitecto, les proveas un Servidor MCP que hable con el MySQL local de la empresa.

La base de datos contiene tablas sensibles: `users` (con hashes de passwords), `transactions` y `system_config`.

## Constraints
- **Trabajo local:** Creación de un documento de diseño `mcp-server-spec.md`.
- **Regla Estricta:** Prohibido crear un Tool genérico tipo `execute_query(sql)`. Todo debe estar explícitamente parametrizado.

## Starting Point
Crear un archivo `mcp-server-spec.md`. Deben diseñar qué capacidades expondrá su Servidor MCP rellenando el documento.

## Engineering Decision (El Núcleo del Lab)
El estudiante debe tomar decisiones arquitectónicas mapeando capacidades:

### 1. Resources (El Contexto Seguro)
¿Qué información de MySQL es seguro exponer como `Resource` (Solo lectura, inyectable como contexto)?
- *Respuesta esperada:* Un template `mysql://cfa/schema` que devuelve el DDL de las tablas, **excluyendo** explícitamente la tabla `users` (por tener datos PII o credenciales) y mostrando solo `transactions`.

### 2. Tools (La Frontera de Acción)
Deben diseñar los Contratos (JSON Schema) de las `Tools` necesarias para la tarea. La enseñanza principal de este lab es: **El agente no recibe acceso a MySQL. Recibe capacidades explícitamente diseñadas para interactuar con MySQL.**

Un límite como `limit=50` es solo una restricción (*Constraint*), no es evidencia suficiente de *Least Privilege*. Los estudiantes deben evaluar todo el espectro de seguridad.

**Tool 1: Lectura segura parametrizada**
- Nombre: `get_recent_transactions`
- Constraint: `limit=50`
- Justificación: No permitimos búsquedas abiertas ni SQL arbitrario.

**Tool 2: Acción con Side-Effect**
- Nombre: `flag_transaction_as_fraud`
- Authorization: Solo roles administradores.
- HITL (Human-in-the-Loop): Obligatorio.

### 3. Security Boundary (Never Trust the Client)
¿Dónde y cómo validas que el LLM no intente saltarse las reglas? El estudiante debe describir el pseudocódigo del backend del Servidor MCP.
*(Ej: "Aunque el LLM envíe 'limit=1000' en el JSON del Tool, mi backend forzará `limit = min(limit, 50)` antes de ir a MySQL").*

## Human-in-the-Loop
Para el Tool `flag_transaction_as_fraud`, el estudiante debe detallar la experiencia del usuario (Host). ¿El Servidor MCP requiere confirmación adicional? ¿La app cliente levantará un popup? El diseño debe asumir que el modelo propondrá bloquear transacciones legítimas (Falso Positivo) y un humano debe autorizar la firma final.

## Failure & Recovery
¿Qué pasa si la base de datos MySQL está caída cuando el Cliente MCP llama al Tool? 
- *Respuesta incorrecta:* El servidor MCP se cae (Crash).
- *Respuesta correcta:* El servidor MCP atrapa la excepción y devuelve un JSON al Cliente detallando: `"error": "DB unreachable. Do not retry automatically"`. Esto previene el bucle infinito del Agente que vimos en M05.

## Expected Artifact
Un documento `mcp-server-spec.md` que contenga una matriz obligatoria de decisión arquitectónica, similar a esta:

| Capability            | Primitive     | Exposure      | Privilege | Validation | HITL  |
| --------------------- | ------------- | ------------- | --------- | ---------- | ----- |
| consultar estado      | Resource/Tool | ALLOW         | READ      | Schema     | No    |
| consultar transacción | Tool          | ALLOW         | READ      | Schema     | No    |
| modificar estado      | Tool          | RESTRICT      | WRITE     | Policy     | Audit |
| operación financiera  | Tool          | RESTRICT      | WRITE     | Policy     | Yes   |
| SQL arbitrario        | Tool          | DO NOT EXPOSE | ADMIN     | —          | —     |
| `DROP TABLE`          | Tool          | DO NOT EXPOSE | ADMIN     | —          | —     |

Además, debe incluir el pseudocódigo de los *Guardrails* en el backend y el procedimiento de fallo para caídas de base de datos.

## Instructor Guidance
### Cómo iniciar el Lab:
"El protocolo MCP es ciego y tonto. Confía ciegamente en lo que el Servidor le diga. Si ustedes configuran mal el Servidor, la IA arrastrará esos errores a toda la empresa. Hoy van a envolver la base de datos MySQL de CFA. Sean paranoicos. Asuman que el modelo LLM que nos enviará peticiones está activamente intentando borrar los datos."

### Mientras trabajan:
Pregunta a los estudiantes que usen la tabla `system_config` en su diseño: "¿Si la IA altera un flag de configuración, cómo reviertes el cambio? MCP no tiene deshacer." Esto obligará a pensar en transacciones de base de datos (`BEGIN`, `ROLLBACK`) dentro del backend del Tool.

## Common Student Mistakes
- Exponer credenciales de BD en el Resource.
- Permitir inyección SQL indirecta (ej. un parámetro de Tool llamado `order_by` que no está validado contra una *allowlist* en el servidor).

## Review Checklist
Antes de cerrar la clase:
- [ ] ¿Quién descubrió que la validación estricta de tipos en el JSON Schema de la Tool previene el 90% de las inyecciones?
- [ ] ¿Están de acuerdo en que el Servidor MCP es una capa de seguridad backend clásica que no requiere Machine Learning para ser construida?

## Discussion Questions
Para cerrar el módulo de infraestructura:
- "Hemos construido un Servidor MCP local. El IDE de mi laptop puede hablar con mi base de datos de CFA de forma estandarizada. Todo el desarrollo (M01-M07) ha funcionado maravillosamente en `localhost`. Pero, ¿cómo llevamos este código generado y estas integraciones a un entorno real sin que Producción colapse?"

## Extension Exercise
*(Puente final hacia M08)*: Pregúntales por qué la evaluación (Testing) que hacíamos en software tradicional ya no es suficiente cuando los inputs (prompts) y outputs (JSONs/Código) dependen de la temperatura probabilística de un modelo en la nube.
