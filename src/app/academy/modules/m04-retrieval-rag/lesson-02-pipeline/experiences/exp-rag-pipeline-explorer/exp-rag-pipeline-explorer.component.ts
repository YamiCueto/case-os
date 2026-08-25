import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface PipelineNode {
  id: string;
  label: string;
  type: 'ingestion' | 'inference';
  description: string;
  input: string;
  process: string;
  output: string;
  concepts: string;
  icon: string;
  // Layout logic
  hPos: THREE.Vector3; // Horizontal position (Desktop)
  vPos: THREE.Vector3; // Vertical position (Mobile)
}

interface Particle {
  mesh: THREE.Mesh;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
  speed: number;
}

interface TopKChunk {
  id: number;
  isSignal: boolean;
  score: number;
  label: string;
  active: boolean; // if false, it's filtered out by current Top-K
}

@Component({
  selector: 'app-exp-rag-pipeline-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <div>
          <h3 class="exp-title">Explorador del RAG Pipeline</h3>
          <p class="exp-subtitle">Observa cómo Retrieval convierte una consulta en contexto para el LLM.</p>
        </div>
        
        <div class="exp-controls">
          <button 
            class="case-button" 
            [class.case-button--primary]="pipelineState() === 'idle' || pipelineState() === 'completed'"
            [class.case-button--secondary]="pipelineState() === 'running'"
            (click)="togglePipeline()"
          >
            <span class="material-symbols-outlined">{{ pipelineState() === 'running' ? 'stop' : 'play_arrow' }}</span>
            {{ pipelineState() === 'running' ? 'Stop Simulation' : 'Run Pipeline' }}
          </button>
          
          <button class="case-button case-button--secondary" (click)="resetPipeline()" [disabled]="pipelineState() === 'idle'">
            <span class="material-symbols-outlined">restart_alt</span> Reset
          </button>

          <div class="control-group">
            <label class="control-label">
              Top-K: <span class="control-value">{{ topK() }}</span>
            </label>
            <input type="range" min="1" max="5" [ngModel]="topK()" (ngModelChange)="onTopKChange($event)" class="control-slider">
          </div>
        </div>
      </div>

      <div class="exp-layout">
        <!-- Visualization Area -->
        <div class="exp-canvas-wrapper" #canvasWrapper>
          <div #canvasContainer class="exp-canvas" aria-label="Espacio 3D interactivo mostrando el pipeline RAG."></div>
          
          <!-- HTML Overlays -->
          <div class="html-overlay-container">
            <!-- Zone Labels -->
            <div id="zone-offline" class="zone-label zone-offline">
              <strong>OFFLINE</strong> / INGESTION
            </div>
            <div id="zone-online" class="zone-label zone-online">
              <strong>ONLINE</strong> / INFERENCE
            </div>

            <!-- Nodes -->
            @for (node of nodes; track node.id) {
              <div 
                [id]="'node-' + node.id" 
                class="html-node" 
                [class.html-node--ingestion]="node.type === 'ingestion'"
                [class.html-node--inference]="node.type === 'inference'"
                [class.html-node--selected]="selectedNodeId() === node.id"
                (click)="selectNode(node.id)"
              >
                <span class="material-symbols-outlined html-node-icon">{{ node.icon }}</span>
                <span class="html-node-label">{{ node.label }}</span>
              </div>
            }

            <!-- Top-K Visualization Panel (Floating near Retrieval/Context) -->
            <div id="topk-panel" class="topk-panel" [class.topk-panel--visible]="showTopKPanel()">
              <div class="topk-header">Candidate Chunks (Top-{{ topK() }})</div>
              <ul class="topk-list">
                @for (chunk of mockChunks; track chunk.id) {
                  <li class="topk-item" [class.topk-item--signal]="chunk.isSignal" [class.topk-item--noise]="!chunk.isSignal" [style.display]="chunk.active ? 'flex' : 'none'">
                    <span class="material-symbols-outlined">{{ chunk.isSignal ? 'check_circle' : 'cancel' }}</span>
                    <span>{{ chunk.label }}</span>
                  </li>
                }
              </ul>
              @if (hasNoiseInTopK()) {
                <div class="topk-warning">⚠️ Riesgo de alucinación</div>
              }
            </div>
          </div>
          
          @if (webglError()) {
            <div class="exp-webgl-error">
              <span class="material-symbols-outlined">warning</span>
              <p>WebGL no está disponible.</p>
            </div>
          }
        </div>

        <!-- Secondary Info Panel -->
        <div class="exp-info-panel">
          @if (selectedNodeData()) {
            <div class="exp-info-card">
              <span class="exp-badge" [class.exp-badge--ingestion]="selectedNodeData()!.type === 'ingestion'" [class.exp-badge--inference]="selectedNodeData()!.type === 'inference'">
                {{ selectedNodeData()!.type | uppercase }}
              </span>
              <h4 class="node-title">
                <span class="material-symbols-outlined">{{ selectedNodeData()!.icon }}</span>
                {{ selectedNodeData()!.label }}
              </h4>
              <p class="node-description">{{ selectedNodeData()!.description }}</p>
              
              <div class="node-details">
                <div class="detail-row">
                  <strong>Input:</strong> <span>{{ selectedNodeData()!.input }}</span>
                </div>
                <div class="detail-row">
                  <strong>Process:</strong> <span>{{ selectedNodeData()!.process }}</span>
                </div>
                <div class="detail-row">
                  <strong>Output:</strong> <span>{{ selectedNodeData()!.output }}</span>
                </div>
                <div class="detail-row concepts-row">
                  <strong>Concepts:</strong> <span>{{ selectedNodeData()!.concepts }}</span>
                </div>
              </div>
            </div>
          } @else {
            <div class="exp-empty-state">
              <span class="material-symbols-outlined">touch_app</span>
              <h4>Explora el Pipeline</h4>
              <p>Selecciona cualquier nodo para ver sus detalles de ingeniería.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./exp-rag-pipeline-explorer.component.css']
})
export class ExpRagPipelineExplorerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasWrapper', { static: false }) canvasWrapper!: ElementRef<HTMLDivElement>;

  // State
  pipelineState = signal<'idle' | 'running' | 'completed'>('idle');
  selectedNodeId = signal<string | null>(null);
  topK = signal<number>(3);
  webglError = signal<boolean>(false);
  isMobileLayout = false;

  // Top-K Mock Data (Simulación didáctica)
  mockChunks: TopKChunk[] = [
    { id: 1, isSignal: true, score: 0.89, label: 'Signal (0.89)', active: true },
    { id: 2, isSignal: true, score: 0.82, label: 'Signal (0.82)', active: true },
    { id: 3, isSignal: false, score: 0.65, label: 'Noise (0.65)', active: true },
    { id: 4, isSignal: false, score: 0.58, label: 'Noise (0.58)', active: false },
    { id: 5, isSignal: false, score: 0.41, label: 'Noise (0.41)', active: false }
  ];

  showTopKPanel = computed(() => {
    return this.pipelineState() === 'running' || this.selectedNodeId() === 'retrieval' || this.selectedNodeId() === 'context';
  });

  hasNoiseInTopK = computed(() => {
    return this.mockChunks.some(c => c.active && !c.isSignal);
  });

  // Pipeline Nodes (8 nodes total based on constraints)
  readonly nodes: PipelineNode[] = [
    // Ingestion (Offline)
    { id: 'docs', label: 'Documents', type: 'ingestion', hPos: new THREE.Vector3(-4.5, 2, 0), vPos: new THREE.Vector3(0, 7.5, 0), icon: 'description', description: 'Biblioteca de conocimiento original.', input: 'PDFs, Confluence, repositorios', process: 'Extracción de texto plano', output: 'Raw text documents', concepts: 'ETL, Data Sources' },
    { id: 'chunking', label: 'Chunking', type: 'ingestion', hPos: new THREE.Vector3(-1.5, 2, 0), vPos: new THREE.Vector3(0, 5, 0), icon: 'cut', description: 'Fragmentación del texto en piezas digeribles.', input: 'Raw text', process: 'Split por tokens/caracteres con overlap', output: 'Chunks de texto', concepts: 'Chunk Size, Overlap' },
    { id: 'embedding_off', label: 'Embedding', type: 'ingestion', hPos: new THREE.Vector3(1.5, 2, 0), vPos: new THREE.Vector3(0, 2.5, 0), icon: 'transform', description: 'Vectorización de cada chunk.', input: 'Text Chunks', process: 'Paso por modelo de embedding', output: 'Vectores densos', concepts: 'Vector Space, Dimensions' },
    { id: 'vectordb', label: 'Vector DB', type: 'ingestion', hPos: new THREE.Vector3(4.5, 2, 0), vPos: new THREE.Vector3(0, 0, 0), icon: 'database', description: 'Almacenamiento indexado de vectores y metadata.', input: 'Vectores + Metadata', process: 'Indexación HNSW/IVF', output: 'Índice buscable', concepts: 'ANN, Indexes, Metadata' },
    
    // Inference (Online)
    { id: 'query', label: 'Query', type: 'inference', hPos: new THREE.Vector3(-4.5, -2, 0), vPos: new THREE.Vector3(0, -3.5, 0), icon: 'search', description: 'Pregunta del usuario en tiempo real.', input: 'User Input', process: 'Recepción del prompt', output: 'Raw string query', concepts: 'Intent, User Prompt' },
    // Embedding removed as independent node per user request. Retrieval will assume query vectorization conceptually.
    { id: 'retrieval', label: 'Retrieval', type: 'inference', hPos: new THREE.Vector3(-1.5, -2, 0), vPos: new THREE.Vector3(0, -6, 0), icon: 'radar', description: 'Búsqueda vectorial. (Incluye vectorización del Query).', input: 'Query (Raw)', process: 'Vectorización + Cosine Similarity Search', output: 'Top-K candidate chunks', concepts: 'Similarity, Top-K' },
    { id: 'context', label: 'Context Build', type: 'inference', hPos: new THREE.Vector3(1.5, -2, 0), vPos: new THREE.Vector3(0, -8.5, 0), icon: 'construction', description: 'Ensamblaje del prompt inyectando los chunks recuperados.', input: 'Top-K chunks + Query', process: 'Prompt Formatting', output: 'Structured Prompt', concepts: 'Context Engineering' },
    { id: 'llm', label: 'LLM', type: 'inference', hPos: new THREE.Vector3(4.5, -2, 0), vPos: new THREE.Vector3(0, -11, 0), icon: 'smart_toy', description: 'Generación de la respuesta fundamentada.', input: 'Structured Prompt', process: 'Inferencia causal', output: 'Final Response', concepts: 'Grounded Generation' }
  ];

  selectedNodeData = computed(() => {
    return this.nodes.find(n => n.id === this.selectedNodeId()) || null;
  });

  // Three.js State
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera; // Usar ortográfica mejora layout UI 2D
  private renderer!: THREE.WebGLRenderer;
  
  private nodeMeshes: Map<string, THREE.Mesh> = new Map();
  private edgesGroup = new THREE.Group();
  private particlesGroup = new THREE.Group();
  private bgGroup = new THREE.Group();
  private particles: Particle[] = [];
  
  private resizeObserver!: ResizeObserver;
  private animationFrameId: number | null = null;
  
  private colors = {
    edge: 0x475569, // slate-600
    edgeHighlight: 0x94a3b8, // slate-400
    particle: 0xf59e0b // amber-500
  };

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJs();
    });
  }

  ngOnDestroy() {
    this.cleanupThreeJs();
  }

  onTopKChange(val: number) {
    this.topK.set(val);
    this.mockChunks = this.mockChunks.map(c => ({
      ...c,
      active: c.id <= val
    }));
  }

  selectNode(id: string) {
    this.selectedNodeId.set(id);
  }

  togglePipeline() {
    const state = this.pipelineState();
    if (state === 'idle' || state === 'completed') {
      this.pipelineState.set('running');
      this.startSimulation();
    } else {
      this.pipelineState.set('idle');
      this.clearParticles();
    }
  }

  resetPipeline() {
    this.pipelineState.set('idle');
    this.clearParticles();
  }

  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.scene = new THREE.Scene();

      // Orthographic camera makes mapping 3D to 2D screen much more predictable
      const aspect = width / height;
      const viewSize = 12; // Base view size
      this.camera = new THREE.OrthographicCamera(
        -viewSize * aspect / 2, viewSize * aspect / 2,
        viewSize / 2, -viewSize / 2,
        0.1, 100
      );
      this.camera.position.set(0, 0, 10);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.scene.add(this.bgGroup);
      this.scene.add(this.edgesGroup);
      this.scene.add(this.particlesGroup);

      this.createNodeAnchors();
      this.updateLayout(width, height); // Creates edges too

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(container);

      this.animate();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error(e);
    }
  }

  private createNodeAnchors() {
    // Invisible meshes used purely for anchoring 3D lines and particles
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    
    this.nodes.forEach(node => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: node.id };
      this.nodeMeshes.set(node.id, mesh);
      this.scene.add(mesh);
    });
  }

  private updateLayout(width: number, height: number) {
    this.isMobileLayout = window.innerWidth <= 1024;
    
    const aspect = width / height;
    
    if (this.isMobileLayout) {
      // Vertical layout: Lock the vertical view size
      const viewSizeHeight = 24; 
      this.camera.top = viewSizeHeight / 2;
      this.camera.bottom = -viewSizeHeight / 2;
      this.camera.left = -viewSizeHeight * aspect / 2;
      this.camera.right = viewSizeHeight * aspect / 2;
    } else {
      // Horizontal layout: Lock the horizontal view size
      const viewSizeWidth = 14; // Gives enough space for 9 units of nodes + padding
      this.camera.left = -viewSizeWidth / 2;
      this.camera.right = viewSizeWidth / 2;
      this.camera.top = (viewSizeWidth / aspect) / 2;
      this.camera.bottom = -(viewSizeWidth / aspect) / 2;
    }
    this.camera.updateProjectionMatrix();

    // Position meshes based on current layout mode
    this.nodes.forEach(node => {
      const mesh = this.nodeMeshes.get(node.id)!;
      const pos = this.isMobileLayout ? node.vPos : node.hPos;
      mesh.position.copy(pos);
    });

    this.rebuildEdges();
    this.updateHtmlOverlayPositions();
  }

  private rebuildEdges() {
    // Clear edges
    while(this.edgesGroup.children.length > 0){ 
      const child = this.edgesGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.edgesGroup.remove(child);
    }

    const material = new THREE.LineBasicMaterial({ color: this.colors.edge, linewidth: 2 });
    
    // Ingestion flow
    this.addEdge('docs', 'chunking', material);
    this.addEdge('chunking', 'embedding_off', material);
    this.addEdge('embedding_off', 'vectordb', material);
    
    // Inference flow
    this.addEdge('query', 'retrieval', material);
    this.addEdge('retrieval', 'context', material);
    this.addEdge('context', 'llm', material);
    
    // Cross flow (Vector DB to Retrieval)
    const dashedMat = new THREE.LineDashedMaterial({ color: this.colors.edge, dashSize: 0.3, gapSize: 0.15 });
    this.addEdge('vectordb', 'retrieval', dashedMat, true);
  }

  private addEdge(fromId: string, toId: string, material: THREE.Material, isDashed = false) {
    const from = this.nodeMeshes.get(fromId)!.position;
    const to = this.nodeMeshes.get(toId)!.position;
    
    const points = [from, to];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    if (isDashed) {
      line.computeLineDistances();
    }
    this.edgesGroup.add(line);
  }

  private startSimulation() {
    this.clearParticles();
    
    const speed = this.isMobileLayout ? 0.015 : 0.01;
    
    // Offline / Ingestion Part
    this.spawnParticle('docs', 'chunking', 0, speed);
    this.spawnParticle('chunking', 'embedding_off', 1000, speed);
    this.spawnParticle('embedding_off', 'vectordb', 2000, speed);
    
    // Online / Inference Part
    this.spawnParticle('query', 'retrieval', 3500, speed);
    
    // Cross flow (Knowledge injected)
    this.spawnParticle('vectordb', 'retrieval', 4500, speed);
    
    // Chunks going to context
    this.spawnParticle('retrieval', 'context', 6000, speed);
    this.spawnParticle('context', 'llm', 7500, speed);
    
    setTimeout(() => {
      this.ngZone.run(() => {
        if (this.pipelineState() === 'running') {
          this.pipelineState.set('completed');
          this.selectedNodeId.set('llm');
        }
      });
    }, 8500);
  }

  private spawnParticle(fromId: string, toId: string, delay: number, speed: number) {
    setTimeout(() => {
      if (this.pipelineState() !== 'running') return;
      
      const from = this.nodeMeshes.get(fromId)!.position;
      const to = this.nodeMeshes.get(toId)!.position;
      
      const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 32),
        new THREE.MeshBasicMaterial({ color: this.colors.particle })
      );
      mesh.position.copy(from);
      
      this.particlesGroup.add(mesh);
      this.particles.push({
        mesh,
        start: from.clone(),
        end: to.clone(),
        progress: 0,
        speed: speed
      });
    }, delay);
  }

  private clearParticles() {
    this.particles.forEach(p => {
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
      this.particlesGroup.remove(p.mesh);
    });
    this.particles = [];
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // Animate particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;
      
      if (p.progress >= 1) {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particlesGroup.remove(p.mesh);
        this.particles.splice(i, 1);
      } else {
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      }
    }

    this.renderer.render(this.scene, this.camera);
    
    // Sync HTML Overlays
    this.updateHtmlOverlayPositions();
  }

  private updateHtmlOverlayPositions() {
    if (!this.canvasWrapper) return;
    const width = this.canvasWrapper.nativeElement.clientWidth;
    const height = this.canvasWrapper.nativeElement.clientHeight;

    this.nodes.forEach(node => {
      const mesh = this.nodeMeshes.get(node.id);
      if (!mesh) return;

      mesh.updateMatrixWorld();
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(mesh.matrixWorld);
      vector.project(this.camera);
      
      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (vector.y * -0.5 + 0.5) * height;

      const el = document.getElementById('node-' + node.id);
      if (el) {
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    });

    // Update Zone labels (approximate positions based on anchors)
    const offlineEl = document.getElementById('zone-offline');
    const onlineEl = document.getElementById('zone-online');
    
    if (this.isMobileLayout) {
      if (offlineEl) {
        const offVec = new THREE.Vector3(0, 9, 0).project(this.camera);
        offlineEl.style.transform = `translate(${(offVec.x*0.5+0.5)*width}px, ${(offVec.y*-0.5+0.5)*height}px) translate(-50%, -50%)`;
      }
      if (onlineEl) {
        const onVec = new THREE.Vector3(0, -1.5, 0).project(this.camera);
        onlineEl.style.transform = `translate(${(onVec.x*0.5+0.5)*width}px, ${(onVec.y*-0.5+0.5)*height}px) translate(-50%, -50%)`;
      }
    } else {
      if (offlineEl) {
        const offVec = new THREE.Vector3(0, 3.5, 0).project(this.camera);
        offlineEl.style.transform = `translate(${(offVec.x*0.5+0.5)*width}px, ${(offVec.y*-0.5+0.5)*height}px) translate(-50%, -50%)`;
      }
      if (onlineEl) {
        const onVec = new THREE.Vector3(0, -0.5, 0).project(this.camera);
        onlineEl.style.transform = `translate(${(onVec.x*0.5+0.5)*width}px, ${(onVec.y*-0.5+0.5)*height}px) translate(-50%, -50%)`;
      }
    }

    // Position Top-K Panel
    const topkEl = document.getElementById('topk-panel');
    if (topkEl) {
      const retrievalVec = this.nodeMeshes.get('retrieval')!.position.clone();
      const contextVec = this.nodeMeshes.get('context')!.position.clone();
      
      // Place it between Retrieval and Context
      const midVec = new THREE.Vector3().lerpVectors(retrievalVec, contextVec, 0.5);
      
      if (this.isMobileLayout) {
        // Offset right
        midVec.x += 2.5; 
      } else {
        // Offset down
        midVec.y -= 1.5;
      }
      
      midVec.project(this.camera);
      const px = (midVec.x * 0.5 + 0.5) * width;
      const py = (midVec.y * -0.5 + 0.5) * height;
      
      topkEl.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    }
  }

  private onResize() {
    if (!this.canvasWrapper || !this.renderer) return;
    const width = this.canvasWrapper.nativeElement.clientWidth;
    const height = this.canvasWrapper.nativeElement.clientHeight;
    
    this.renderer.setSize(width, height);
    this.updateLayout(width, height);
  }

  private cleanupThreeJs() {
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    
    this.clearParticles();
    
    this.nodeMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    
    this.edgesGroup.children.forEach(child => {
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
