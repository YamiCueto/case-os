# Lesson 03 — Primitives

## 1. Propósito de la clase
Enseñar a distinguir arquitectónicamente las tres primitivas del Model Context Protocol: `Resources`, `Tools` y `Prompts`. El estudiante aprenderá la diferencia fundamental entre exponer datos estáticos al LLM y permitirle ejecutar acciones, cimentando la regla de oro: **Never Trust the Client**.

## 2. Qué debe aprender el estudiante
- Definir qué es un `Resource` (Lectura, Inyección de Contexto).
- Definir qué es un `Tool` (Ejecución, Efectos Secundarios, M05).
- Entender el rol de los `Prompts` dinámicos en el servidor.
- Aplicar *Least Privilege* separando las operaciones seguras (Resources) de las operaciones críticas (Tools).

## 3. Conceptos fundamentales

### 3.1 Las Tres Primitivas
El Servidor MCP se comunica con el Cliente mediante tres mecanismos clave:

1. **Resources (Recursos):** Datos expuestos por el Servidor que el Cliente puede "leer" para inyectar en el contexto de la IA. Similar a una petición `GET` en REST. Capacidad de exponer o consultar información.
   *Uso principal: Context Assembly (M03 y M06).*
   
2. **Tools (Herramientas):** Capacidad de solicitar una operación. El LLM propone (vía JSON) y el Servidor ejecuta. Similar a un `POST` en REST.
   *Uso principal: Agent Loops (M05).*

3. **Prompts:** Plantillas de texto predefinidas que el Servidor expone al Cliente.

#### Concept Analogy: La Biblioteca Corporativa
- **Analogía cotidiana:** Trabajar en los archivos del sótano de una empresa.
- **Mapeo:** 
  - **Resource:** El Catálogo de la biblioteca o una copia impresa de los balances. 
  - **Tool:** El Sello Oficial de la empresa. Si estampas el sello en un papel, creas un documento vinculante.
- **Límite de la analogía:** En la biblioteca física, leer un documento confidencial (Resource) que dejaste en la mesa es fácil. En MCP, la seguridad no viene del tipo de primitiva (`Resource` vs `Tool`), sino de la política que controla su exposición. Un `Resource` puede exponer PII (Personal Identifiable Information) y ser sumamente peligroso. Una `Tool` puede ser una operación inocua de lectura parametrizada. 

> **Regla Crítica:** La seguridad es igual a: **Capability + Privilege + Policy + Validation**.

### 3.2 La Frontera de Backend y "Never Trust the Client"
Nunca confíes en el Cliente. La enseñanza más importante de MCP es que **el modelo puede solicitar algo, pero no obtiene automáticamente el derecho a hacerlo**. La frontera técnica se ve así:

```text
MODEL
  │
  │ "quiero ejecutar..."
  ▼
TOOL REQUEST (JSON)
  │
  ▼
MCP SERVER (Backend)
  │
  ├── Schema validation
  ├── Authorization
  ├── Policy check
  ├── Scope restriction
  └── Audit
          │
          ▼
       DATABASE (MySQL CFA)
```

## 4. La Trampa de la Intuición (Intuición Equivocada)
> **¿Qué intuición equivocada podría llevarse un ingeniero si entiende mal este concepto?**
El ingeniero puede pensar: *"Para que la IA de mi empresa pueda entender mi base de datos, voy a crear un solo Tool llamado `ejecutar_query(sql_string)` y dejaré que el LLM decida qué tablas consultar."*
**Consecuencia:** Al exponer una herramienta genérica en lugar de Recursos específicos (ej. `Resource: mysql://cfa/schema`), el ingeniero le dio permisos de administrador de base de datos a un sistema probabilístico. Un error del modelo (o un Prompt Injection de un usuario final malicioso) purgará la base de datos corporativa.

## 5. Explicación para el instructor (Intuición → Mecanismo → Consecuencia)
- **Intuición:** Las herramientas (Tools) son botones peligrosos, ponles tapas de seguridad. Los recursos (Resources) son ventanas de vidrio, déjalas descubiertas.
- **Mecanismo:** El protocolo MCP define listas explícitas (`resources/list`, `tools/list`) que el Cliente solicita al iniciar. Los Clientes deciden cuándo llamar a un Tool (basado en la respuesta del LLM), pero son los usuarios (a través de la UI) quienes suelen decidir cuándo adjuntar un Resource al contexto.
- **Consecuencia de ingeniería:** La arquitectura MCP empuja la lógica pesada hacia el backend (Server), protegiendo la CFA.

## 6. Ejemplo técnico
**Exponiendo un Resource (Python MCP SDK):**
```python
@mcp.resource("mysql://cfa/schema")
def get_db_schema() -> str:
    # Seguro, solo lectura, estático.
    return "TABLE users (id INT, email VARCHAR); TABLE txs (amount DECIMAL);"
```

**Exponiendo un Tool Peligroso pero Acotado:**
```python
@mcp.tool()
def query_user_transactions(user_id: int, limit: int = 10) -> str:
    # Se impone Least Privilege: solo puede buscar txs, y hay un límite forzado por el tipado.
    if limit > 100: raise ValueError("Limit exceeded")
    return execute_safe_query("SELECT * FROM txs WHERE user_id=? LIMIT ?", (user_id, limit))
```

## 7. Ejemplo aplicado a Software Engineering
Un programador está investigando un bug en la Core Financial App (M06 Agentic SWE). Su IDE (Cursor) es un MCP Client conectado al MCP Server de la base de datos local de desarrollo.
1. Abre un ticket de JIRA, el agente ensambla contexto leyendo el `Resource: jira://ticket/123`.
2. El agente propone un Tool Call `query_user_transactions(user_id=88)`.
3. El Servidor MCP verifica que `user_id` es un entero válido y ejecuta el SQL.
4. El agente recibe el resultado (Observation) y propone un *Diff* en el código fuente.

## 8. Errores conceptuales frecuentes
- **"El Agente decide qué es Resource y qué es Tool"**: Falso. El Arquitecto del Servidor MCP es quien define y categoriza estas capacidades.
- **"Los Prompts del Servidor controlan el *System Prompt* del Agente"**: No, los Prompts en MCP son simplemente atajos de texto para el usuario (ej. un comando `/resume-ticket` en Claude Desktop), no un *System Prompt* de override.

## 9. Preguntas para el grupo
- "¿Por qué usar `execute_sql` como Tool es una violación del principio de Least Privilege?"
- "Si queremos que la IA conozca los precios de nuestros productos, ¿debemos construir un Resource o un Tool? ¿Por qué?" (Respuesta: Resource, porque la lectura no tiene efectos colaterales y la IA no necesita iterar para consumirlo).

## 10. Mini ejercicio
Muestra 4 escenarios:
1. Buscar el clima en París.
2. Leer el manual de usuario de la cafetera.
3. Reiniciar el servidor de pruebas.
4. Listar las carpetas del escritorio.
Pide a los alumnos clasificar cada uno como **Resource** o **Tool**, justificando si implican un efecto secundario o simple lectura determinista.

## 11. Demo relacionada
*(Se mostrará en la Demo 07).*

## 12. Discusión
En MCP, la seguridad es determinista. El LLM puede alucinar todo lo que quiera, pero si el Tool que construiste exige un UUID válido y rechaza caracteres extraños, la aplicación es impenetrable. El error humano ya no está en el *prompting*, está en la construcción de los validadores del Tool.

## 13. Preparación para la siguiente clase
"Tanta teoría puede parecer confusa hasta que vemos al Cliente y al Servidor hablarse por primera vez. En la Demo 07, iniciaremos un Servidor MCP local para MySQL y veremos cómo la aplicación de IA 'descubre' mágicamente nuestra base de datos."
