import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase10-dev-fastapi',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase10-dev-fastapi.component.html',
  styleUrls: ['./clase10-dev-fastapi.component.css', '../shared-presentation.css']
})
export class Clase10DevFastapiComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'rag-architecture' },
    { type: 'spring-ai-setup' },
    { type: 'indexing-service' },
    { type: 'query-service' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  titleSlide = {
    icon: '🧠',
    title: 'Spring AI: RAG sobre Documentación Legacy',
    subtitle: 'Consulta Semántica de Manuales COBIS, VB6 y .NET con IA en Java',
    description: 'Implementa un motor de búsqueda semántica en Java 21 + Spring Boot 4.1.0 que permite a los ingenieros consultar documentación técnica del sistema legacy con lenguaje natural, usando Spring AI y embeddings.'
  };

  context = {
    title: '¿Por qué RAG para sistemas legacy?',
    scenario: {
      icon: '📚',
      text: 'Los sistemas COBIS, VB6 y .NET tienen décadas de manuales técnicos, especificaciones funcionales y documentación de stored procedures que nadie lee porque es difícil de buscar. Con RAG (Retrieval-Augmented Generation) en Java, cualquier ingeniero puede preguntar en español y obtener respuestas basadas en esos documentos reales.'
    },
    useCases: [
      {
        icon: '🔍',
        title: 'Consultar Manuales COBIS',
        description: '¿Qué hace el stored procedure sp_apertura_cuenta? → RAG busca en el manual COBIS y responde con el contexto exacto',
        color: 'blue'
      },
      {
        icon: '🔄',
        title: 'Documentación de Migración',
        description: '¿Qué campos tiene el formulario VB6 de Apertura de Cuentas? → RAG indexa los documentos funcionales y responde',
        color: 'orange'
      },
      {
        icon: '📋',
        title: 'Reglas de Negocio Legacy',
        description: '¿Cuál es la regla de validación de documentos en .NET? → RAG recupera el fragmento exacto del código documentado',
        color: 'green'
      },
      {
        icon: '🤝',
        title: 'Asistente de Migración',
        description: 'Chatbot que asiste al equipo durante la migración — responde sobre el sistema legacy que están reemplazando',
        color: 'purple'
      }
    ]
  };

  ragArchitecture = {
    title: 'Arquitectura RAG con Spring AI',
    explanation: 'RAG = Retrieval-Augmented Generation. En lugar de depender de la memoria del LLM (que no conoce tus manuales COBIS), primero se recuperan fragmentos relevantes de los documentos y se incluyen como contexto en el prompt.',
    flow: [
      { step: 1, label: 'Pregunta del usuario', icon: '💬', detail: '"¿Qué valida sp_apertura_cuenta?"' },
      { step: 2, label: 'Embedding de la pregunta', icon: '🔢', detail: 'Convertir texto → vector numérico' },
      { step: 3, label: 'Búsqueda vectorial', icon: '🔍', detail: 'Top-K fragmentos más similares en VectorStore' },
      { step: 4, label: 'Prompt aumentado', icon: '📝', detail: 'Pregunta + fragmentos como contexto al LLM' },
      { step: 5, label: 'Respuesta fundamentada', icon: '✅', detail: 'Solo información de los documentos reales' }
    ],
    components: [
      {
        name: 'DocumentReader',
        role: 'Lee PDFs, TXTs, Word de la documentación legacy',
        springAiClass: 'PagePdfDocumentReader, TextReader'
      },
      {
        name: 'TokenTextSplitter',
        role: 'Divide documentos en fragmentos de ~512 tokens',
        springAiClass: 'TokenTextSplitter'
      },
      {
        name: 'EmbeddingModel',
        role: 'Convierte texto a vectores numéricos',
        springAiClass: 'TransformersEmbeddingModel (local, sin API externa)'
      },
      {
        name: 'VectorStore',
        role: 'Almacena y busca vectores por similitud',
        springAiClass: 'SimpleVectorStore (dev) / PgVectorStore (prod)'
      },
      {
        name: 'ChatClient',
        role: 'Genera respuesta con el contexto recuperado',
        springAiClass: 'ChatClient.Builder + prompt template'
      }
    ]
  };

  springAiSetup = {
    title: 'Configuración Spring AI en Gradle',
    gradleSnippet: `// build.gradle.kts
plugins {
    id("org.springframework.boot") version "4.1.0"
    id("io.spring.dependency-management") version "1.1.7"
}

extra["springAiVersion"] = "1.0.0"

dependencies {
    // Spring AI BOM
    implementation(platform("org.springframework.ai:spring-ai-bom:\${property("springAiVersion")}"))

    // Chat con OpenAI (o Azure OpenAI si CFA tiene licencia)
    implementation("org.springframework.ai:spring-ai-openai-spring-boot-starter")

    // Embeddings locales (sin costo, sin API key — modelo en JAR)
    implementation("org.springframework.ai:spring-ai-transformers-spring-boot-starter")

    // VectorStore simple para desarrollo
    implementation("org.springframework.ai:spring-ai-core")

    // Lectura de PDFs (manuales legacy)
    implementation("org.springframework.ai:spring-ai-pdf-document-reader")

    implementation("org.springframework.boot:spring-boot-starter-web")
}`,
    applicationYml: `# application.yml
spring:
  threads:
    virtual:
      enabled: true   # Java 21 Virtual Threads

  ai:
    openai:
      api-key: \${OPENAI_API_KEY}
      chat:
        model: gpt-4o-mini
      embedding:
        model: text-embedding-3-small

    # VectorStore persistido en disco (desarrollo)
    vectorstore:
      simple:
        persist: true
        path: ./vectorstore/legacy-docs.json`
  };

  indexingService = {
    title: 'Servicio de Indexación de Documentos Legacy',
    description: 'Tomar los manuales COBIS, especificaciones VB6 y documentación .NET y convertirlos en vectores buscables',
    javaCode: `// LegacyDocIndexingService.java
@Service
public class LegacyDocIndexingService {

    private final VectorStore vectorStore;

    public LegacyDocIndexingService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    /**
     * Indexar manual COBIS (PDF o TXT)
     * Llamar una vez al desplegar, o cuando cambien los documentos
     */
    public void indexarManualCobis(Resource recurso, String nombreModulo) {
        // 1. Leer el documento
        var reader = new PagePdfDocumentReader(recurso,
            PdfDocumentReaderConfig.builder()
                .withPagesPerDocument(1)
                .build());

        List<Document> documentos = reader.get();

        // 2. Agregar metadatos para filtrar por módulo
        documentos.forEach(doc -> {
            doc.getMetadata().put("fuente", "Manual COBIS");
            doc.getMetadata().put("modulo", nombreModulo);
            doc.getMetadata().put("sistema", "COBIS");
        });

        // 3. Dividir en fragmentos (512 tokens ≈ buen balance precisión/contexto)
        var splitter = new TokenTextSplitter(512, 50, 5, 10000, true);
        List<Document> fragmentos = splitter.apply(documentos);

        // 4. Generar embeddings y guardar en VectorStore
        vectorStore.add(fragmentos);

        log.info("Indexados {} fragmentos del módulo COBIS: {}",
                 fragmentos.size(), nombreModulo);
    }

    // Mismo método funciona para documentos VB6 y .NET (TXT, Word, PDF)
    public void indexarDocumentacionLegacy(Resource recurso,
                                           String sistema,
                                           String modulo) {
        var reader = new TextReader(recurso);
        List<Document> docs = reader.get();

        docs.forEach(doc -> {
            doc.getMetadata().put("sistema", sistema);   // VB6 | .NET | COBIS
            doc.getMetadata().put("modulo", modulo);
        });

        vectorStore.add(new TokenTextSplitter().apply(docs));
    }
}`
  };

  queryService = {
    title: 'Servicio de Consulta Semántica',
    javaCode: `// LegacyKnowledgeService.java
@Service
public class LegacyKnowledgeService {

    private static final String PROMPT_RAG = """
        Eres el asistente técnico del equipo de migración de sistemas legacy.
        Responde ÚNICAMENTE usando la documentación proporcionada.
        Si la información no está en los documentos, responde:
        "No encontré información sobre esto en la documentación indexada."

        DOCUMENTACIÓN TÉCNICA RELEVANTE:
        {contexto}

        PREGUNTA DEL INGENIERO:
        {pregunta}

        Respuesta (cita el sistema y módulo fuente):
        """;

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public LegacyKnowledgeService(ChatClient.Builder builder,
                                   VectorStore vectorStore) {
        this.chatClient = builder.build();
        this.vectorStore = vectorStore;
    }

    public ConsultaResponse consultar(String pregunta, String sistemaFiltro) {
        // 1. Buscar fragmentos relevantes (similitud coseno)
        var filtro = Filter.expression(
            sistemaFiltro != null ? "sistema == '" + sistemaFiltro + "'" : "true"
        );

        List<Document> fragmentos = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(pregunta)
                .topK(5)
                .similarityThreshold(0.65)
                .filterExpression(filtro)
                .build()
        );

        if (fragmentos.isEmpty()) {
            return new ConsultaResponse(
                "No encontré documentación relevante para: " + pregunta,
                List.of(), pregunta
            );
        }

        // 2. Construir contexto con los fragmentos + sus fuentes
        String contexto = fragmentos.stream()
            .map(doc -> String.format("[%s - Módulo: %s]\\n%s",
                doc.getMetadata().get("sistema"),
                doc.getMetadata().get("modulo"),
                doc.getText()))
            .collect(Collectors.joining("\\n\\n---\\n\\n"));

        // 3. Llamar al LLM con contexto aumentado
        String respuesta = chatClient.prompt()
            .user(u -> u.text(PROMPT_RAG)
                .param("contexto", contexto)
                .param("pregunta", pregunta))
            .call()
            .content();

        List<String> fuentes = fragmentos.stream()
            .map(doc -> doc.getMetadata().get("sistema") + " / " +
                        doc.getMetadata().get("modulo"))
            .distinct().toList();

        return new ConsultaResponse(respuesta, fuentes, pregunta);
    }
}

// Java Record para la respuesta
public record ConsultaResponse(
    String respuesta,
    List<String> fuentesCitadas,
    String preguntaOriginal
) {}`
  };

  challenge = {
    title: 'Reto: Asistente de Migración Legacy',
    description: 'Implementa un endpoint REST en Spring Boot 4.1.0 que permita consultar documentación técnica de los sistemas legacy (COBIS/VB6/.NET) usando RAG con Spring AI.',
    requirements: [
      'build.gradle.kts con Spring AI 1.0.0 BOM + spring-ai-transformers (embeddings locales, sin API key)',
      'LegacyDocIndexingService que indexe archivos TXT/PDF con metadatos: sistema y modulo',
      'LegacyKnowledgeService.consultar(pregunta, sistemaFiltro) con SimpleVectorStore',
      'POST /api/legacy/consultar con record ConsultaRequest(pregunta, sistema) y ConsultaResponse',
      'CommandLineRunner que indexe al menos 3 archivos de documentación de ejemplo al arrancar',
      'Test de integración: indexar texto de prueba → consultar → verificar que la respuesta menciona el fragmento indexado'
    ],
    promptCopilot: [
      'ROL: Arquitecto Java 21 + Spring AI 1.0 especialista en RAG para documentación técnica legacy',
      'CONTEXTO: Queremos indexar manuales PDF/TXT de COBIS, VB6 y .NET para búsqueda semántica',
      'TAREA: Genera LegacyDocIndexingService con PagePdfDocumentReader, TokenTextSplitter y VectorStore.add()',
      'RESTRICCIONES: Spring Boot 4.1.0, Gradle Kotlin DSL, Java records para DTOs, Virtual Threads activados'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Embeddings y VectorStore',
      practices: [
        'Usar TransformersEmbeddingModel (local) en desarrollo — sin costo, sin API key',
        'SimpleVectorStore persistido en disco para dev, PgVectorStore con pgvector en producción',
        'Fragmentos de 400-600 tokens con overlap de 50 — balance entre precisión y contexto'
      ]
    },
    {
      category: 'Calidad de Respuestas',
      practices: [
        'similarityThreshold >= 0.65 — evita recuperar fragmentos irrelevantes',
        'topK=5 fragmentos máximo — más contexto no siempre mejora la respuesta',
        'Incluir metadatos (sistema, módulo, fuente) para que el LLM cite correctamente'
      ]
    },
    {
      category: 'Prompt Engineering para RAG',
      practices: [
        'Instruir al LLM a responder SOLO con la documentación — evitar alucinaciones',
        'Pedir citar la fuente (sistema + módulo) en cada respuesta',
        'Agregar fallback explícito: "si no está en los documentos, dilo claramente"'
      ]
    },
    {
      category: 'Indexación y Mantenimiento',
      practices: [
        'Indexar al arrancar con @EventListener(ApplicationReadyEvent.class)',
        'Guardar hash de cada documento para re-indexar solo cuando cambie',
        'Registrar cuántos fragmentos se indexaron por módulo en logs — facilita diagnóstico'
      ]
    }
  ];

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.previousSlide();
    if (event.key === 'ArrowRight') this.nextSlide();
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) this.currentSlide++;
  }

  previousSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
