import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';

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
}

interface Particle {
  mesh: THREE.Mesh;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
  speed: number;
  type: 'default' | 'signal' | 'noise' | 'context';
  onComplete?: () => void;
}

interface TopKChunk {
  id: number;
  isSignal: boolean;
  score: number;
  label: string;
  active: boolean; // if false, it's filtered out by current Top-K
  rendered: boolean; // controls sequential appearance
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
          
          <!-- THREE.js Background Underlay -->
          <div #canvasContainer class="exp-canvas" aria-hidden="true"></div>
          
          <!-- DOM UI Overlay Layer -->
          <div class="pipeline-zones">
            
            <!-- Ingestion Phase -->
            <div class="zone-row offline-zone">
              <div class="zone-title"><strong>OFFLINE</strong> / INGESTION</div>
              <div class="nodes-grid">
                @for (node of ingestionNodes; track node.id) {
                  <div class="node-wrapper">
                    <div 
                      [id]="'node-' + node.id" 
                      class="html-node html-node--ingestion" 
                      [class.html-node--selected]="selectedNodeId() === node.id"
                      [class.html-node--processing]="nodeStates()[node.id] === 'processing'"
                      [class.html-node--completed]="nodeStates()[node.id] === 'completed'"
                      (click)="selectNode(node.id)"
                    >
                      <span class="material-symbols-outlined html-node-icon">{{ node.icon }}</span>
                      <span class="html-node-label">{{ node.label }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Inference Phase -->
            <div class="zone-row online-zone">
              <div class="zone-title"><strong>ONLINE</strong> / INFERENCE</div>
              <div class="nodes-grid">
                @for (node of inferenceNodes; track node.id) {
                  <div class="node-wrapper">
                    <div 
                      [id]="'node-' + node.id" 
                      class="html-node html-node--inference" 
                      [class.html-node--selected]="selectedNodeId() === node.id"
                      [class.html-node--processing]="nodeStates()[node.id] === 'processing'"
                      [class.html-node--completed]="nodeStates()[node.id] === 'completed'"
                      (click)="selectNode(node.id)"
                    >
                      <span class="material-symbols-outlined html-node-icon">{{ node.icon }}</span>
                      <span class="html-node-label">{{ node.label }}</span>
                    </div>

                    @if (node.id === 'llm') {
                      <div class="final-response-bubble" [class.final-response-bubble--visible]="pipelineState() === 'completed'">
                        El LLM recibió contexto recuperado y filtrado.
                      </div>
                    }

                    <!-- Top-K Panel strictly anchored to Retrieval node via DOM hierarchy -->
                    @if (node.id === 'retrieval') {
                      <div class="topk-panel" [class.topk-panel--visible]="showTopKPanel()">
                        <div class="topk-header">Candidate Chunks (Top-{{ topK() }})</div>
                        <ul class="topk-list">
                          @for (chunk of mockChunks; track chunk.id) {
                            <li class="topk-item" 
                                [class.topk-item--signal]="chunk.isSignal" 
                                [class.topk-item--noise]="!chunk.isSignal" 
                                [class.topk-item--visible]="chunk.rendered"
                                [style.display]="chunk.active ? 'flex' : 'none'">
                              <span class="material-symbols-outlined">{{ chunk.isSignal ? 'check_circle' : 'cancel' }}</span>
                              <span>{{ chunk.label }}</span>
                            </li>
                          }
                        </ul>
                        @if (hasNoiseInTopK()) {
                          <div class="topk-warning">⚠️ Riesgo de alucinación</div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
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
  nodeStates = signal<Record<string, 'processing' | 'completed'>>({});
  topK = signal<number>(3);
  webglError = signal<boolean>(false);

  // Top-K Mock Data
  mockChunks: TopKChunk[] = [
    { id: 1, isSignal: true, score: 0.89, label: 'Signal (0.89)', active: true, rendered: false },
    { id: 2, isSignal: true, score: 0.82, label: 'Signal (0.82)', active: true, rendered: false },
    { id: 3, isSignal: false, score: 0.65, label: 'Noise (0.65)', active: true, rendered: false },
    { id: 4, isSignal: false, score: 0.58, label: 'Noise (0.58)', active: false, rendered: false },
    { id: 5, isSignal: false, score: 0.41, label: 'Noise (0.41)', active: false, rendered: false }
  ];

  showTopKPanel = computed(() => {
    return this.pipelineState() === 'running' || this.selectedNodeId() === 'retrieval' || this.selectedNodeId() === 'context';
  });

  hasNoiseInTopK = computed(() => {
    return this.mockChunks.some(c => c.active && c.rendered && !c.isSignal);
  });

  // Pipeline Nodes Configuration
  readonly nodes: PipelineNode[] = [
    { id: 'docs', label: 'Documents', type: 'ingestion', icon: 'description', description: 'Biblioteca de conocimiento original.', input: 'PDFs, Confluence, repositorios', process: 'Extracción de texto plano', output: 'Raw text documents', concepts: 'ETL, Data Sources' },
    { id: 'chunking', label: 'Chunking', type: 'ingestion', icon: 'cut', description: 'Fragmentación del texto en piezas digeribles.', input: 'Raw text', process: 'Split por tokens/caracteres con overlap', output: 'Chunks de texto', concepts: 'Chunk Size, Overlap' },
    { id: 'embedding_off', label: 'Embedding', type: 'ingestion', icon: 'transform', description: 'Vectorización de cada chunk.', input: 'Text Chunks', process: 'Paso por modelo de embedding', output: 'Vectores densos', concepts: 'Vector Space, Dimensions' },
    { id: 'vectordb', label: 'Vector DB', type: 'ingestion', icon: 'database', description: 'Almacenamiento indexado de vectores y metadata.', input: 'Vectores + Metadata', process: 'Indexación HNSW/IVF', output: 'Índice buscable', concepts: 'ANN, Indexes, Metadata' },
    
    { id: 'query', label: 'Query', type: 'inference', icon: 'search', description: 'Pregunta del usuario en tiempo real.', input: 'User Input', process: 'Recepción del prompt', output: 'Raw string query', concepts: 'Intent, User Prompt' },
    { id: 'retrieval', label: 'Retrieval', type: 'inference', icon: 'radar', description: 'Búsqueda vectorial. (Incluye vectorización del Query).', input: 'Query (Raw)', process: 'Vectorización + Cosine Similarity Search', output: 'Top-K candidate chunks', concepts: 'Similarity, Top-K' },
    { id: 'context', label: 'Context Build', type: 'inference', icon: 'construction', description: 'Ensamblaje del prompt inyectando los chunks recuperados.', input: 'Top-K chunks + Query', process: 'Prompt Formatting', output: 'Structured Prompt', concepts: 'Context Engineering' },
    { id: 'llm', label: 'LLM', type: 'inference', icon: 'smart_toy', description: 'Generación de la respuesta fundamentada.', input: 'Structured Prompt', process: 'Inferencia causal', output: 'Final Response', concepts: 'Grounded Generation' }
  ];

  get ingestionNodes() { return this.nodes.filter(n => n.type === 'ingestion'); }
  get inferenceNodes() { return this.nodes.filter(n => n.type === 'inference'); }

  selectedNodeData = computed(() => {
    return this.nodes.find(n => n.id === this.selectedNodeId()) || null;
  });

  // Three.js State
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  
  private nodeMeshes: Map<string, THREE.Mesh> = new Map();
  private edgesGroup = new THREE.Group();
  private particlesGroup = new THREE.Group();
  private particles: Particle[] = [];
  
  private resizeObserver!: ResizeObserver;
  private animationFrameId: number | null = null;
  private currentSimId = 0;
  
  private colors = {
    edge: 0x475569, // slate-600
    particle: 0xf59e0b // amber-500
  };

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJs();
    });
    
    // Give DOM a tick to layout before first projection sync
    setTimeout(() => {
      this.syncThreeJsToDom();
    }, 50);
  }

  ngOnDestroy() {
    this.cleanupThreeJs();
  }

  onTopKChange(val: number) {
    if (this.pipelineState() === 'running') {
      this.resetPipeline();
    }
    this.topK.set(val);
    this.mockChunks = this.mockChunks.map(c => ({
      ...c,
      active: c.id <= val,
      rendered: false
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
      this.resetPipeline();
    }
  }

  resetPipeline() {
    this.currentSimId++;
    this.pipelineState.set('idle');
    this.nodeStates.set({});
    this.mockChunks = this.mockChunks.map(c => ({...c, rendered: false}));
    this.clearParticles();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.scene = new THREE.Scene();

      // 1:1 Pixel Mapping Camera
      this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 100);
      this.camera.position.set(0, 0, 10);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.scene.add(this.edgesGroup);
      this.scene.add(this.particlesGroup);

      this.createNodeAnchors();

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.canvasWrapper.nativeElement);

      this.animate();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error(e);
    }
  }

  private createNodeAnchors() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    
    this.nodes.forEach(node => {
      const mesh = new THREE.Mesh(geometry, material);
      this.nodeMeshes.set(node.id, mesh);
      this.scene.add(mesh);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.syncThreeJsToDom();
  }

  private onResize() {
    if (!this.canvasWrapper || !this.renderer) return;
    const width = this.canvasWrapper.nativeElement.clientWidth;
    const height = this.canvasWrapper.nativeElement.clientHeight;
    
    this.renderer.setSize(width, height);
    
    // Update camera to match new pixel dimensions
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();

    this.syncThreeJsToDom();
  }

  private syncThreeJsToDom() {
    if (!this.canvasContainer) return;
    
    const canvasRect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const cxOffset = canvasRect.left + canvasRect.width / 2;
    const cyOffset = canvasRect.top + canvasRect.height / 2;

    this.nodes.forEach(node => {
      const el = document.getElementById('node-' + node.id);
      const mesh = this.nodeMeshes.get(node.id);
      
      if (el && mesh) {
        const rect = el.getBoundingClientRect();
        
        // Center of the DOM element
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;
        
        // Map to Three.js coordinates (0,0 is center of canvas)
        const x = elCx - cxOffset;
        const y = -(elCy - cyOffset); // Invert Y for WebGL
        
        mesh.position.set(x, y, 0);
      }
    });

    this.rebuildEdges();
  }

  private rebuildEdges() {
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
    const dashedMat = new THREE.LineDashedMaterial({ color: this.colors.edge, dashSize: 10, gapSize: 5 });
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

  private async startSimulation() {
    this.clearParticles();
    
    this.currentSimId++;
    const simId = this.currentSimId;
    
    this.nodeStates.set({});
    this.mockChunks = this.mockChunks.map(c => ({...c, rendered: false}));

    const checkAbort = () => this.currentSimId !== simId || this.pipelineState() !== 'running';
    const speed = 0.015;

    // Etapa 1: Preparación (Offline)
    const offlineNodes = ['docs', 'chunking', 'embedding_off', 'vectordb'];
    for (let i = 0; i < offlineNodes.length; i++) {
      const node = offlineNodes[i];
      this.nodeStates.update(s => ({...s, [node]: 'processing'}));
      if (i > 0) {
        this.spawnParticleAsync(offlineNodes[i - 1], node, speed); // don't await, let it flow
      }
      await this.delay(350);
      if (checkAbort()) return;
      this.nodeStates.update(s => ({...s, [node]: 'completed'}));
    }
    
    // Apagar los nodos offline para cambiar el foco
    this.nodeStates.update(s => {
      const newState = { ...s };
      offlineNodes.forEach(n => delete newState[n]);
      return newState;
    });
    
    await this.delay(400);
    if (checkAbort()) return;

    // Etapa 2: Query
    this.nodeStates.update(s => ({...s, query: 'processing'}));
    // Simulate user query entering the system
    this.spawnParticleAsync('query', 'query', speed, 'default', true); // generic spawn for effect
    await this.delay(600);
    if (checkAbort()) return;

    // Etapa 3: Vectorización y Retrieval
    const p1 = this.spawnParticleAsync('query', 'retrieval', speed);
    await p1;
    if (checkAbort()) return;
    
    this.nodeStates.update(s => {
      const ns = {...s}; delete ns['query']; ns['retrieval'] = 'processing'; return ns;
    });
    await this.delay(500);
    if (checkAbort()) return;

    // Etapa 4: Candidate Chunks
    const activeChunks = this.mockChunks.filter(c => c.active);
    for (const chunk of activeChunks) {
      const idx = this.mockChunks.findIndex(c => c.id === chunk.id);
      if (idx !== -1) {
        this.mockChunks[idx].rendered = true;
        this.mockChunks = [...this.mockChunks]; // force change detection
      }
      await this.delay(350);
      if (checkAbort()) return;
    }

    await this.delay(600);
    if (checkAbort()) return;

    // Etapa 5: Signal vs Noise
    const particlePromises = [];
    for (const chunk of activeChunks) {
      if (chunk.isSignal) {
        particlePromises.push(this.spawnParticleAsync('retrieval', 'context', speed, 'signal'));
      } else {
        particlePromises.push(this.spawnParticleAsync('retrieval', 'discard', speed, 'noise'));
      }
      await this.delay(200); // slight stagger
    }
    
    await Promise.all(particlePromises);
    if (checkAbort()) return;
    
    // Etapa 6: Context Build
    this.nodeStates.update(s => {
      const ns = {...s}; delete ns['retrieval']; ns['context'] = 'processing'; return ns;
    });
    await this.delay(800);
    if (checkAbort()) return;

    // Etapa 7: LLM
    const p3 = this.spawnParticleAsync('context', 'llm', speed, 'context');
    await p3;
    if (checkAbort()) return;

    this.nodeStates.update(s => {
      const ns = {...s}; delete ns['context']; ns['llm'] = 'processing'; return ns;
    });
    await this.delay(600);
    if (checkAbort()) return;

    // Etapa 8: Completed
    this.nodeStates.update(s => {
      const ns = {...s}; ns['llm'] = 'completed'; return ns;
    });
    
    this.pipelineState.set('completed');
    this.selectedNodeId.set('llm');
  }

  private spawnParticleAsync(fromId: string, toId: string | 'discard', speed: number, type: 'default' | 'signal' | 'noise' | 'context' = 'default', fromOutside = false): Promise<void> {
    return new Promise(resolve => {
      let fromVec: THREE.Vector3;
      let toVec: THREE.Vector3;
      
      const fromMesh = this.nodeMeshes.get(fromId);
      if (!fromMesh) { resolve(); return; }
      fromVec = fromMesh.position.clone();

      if (fromOutside) {
        toVec = fromVec.clone();
        fromVec.y += 80;
      } else if (toId === 'discard') {
        toVec = fromVec.clone();
        toVec.y -= 80; // Go down visually to discard
      } else {
        const toMesh = this.nodeMeshes.get(toId);
        if (!toMesh) { resolve(); return; }
        toVec = toMesh.position.clone();
      }
      
      let color = this.colors.particle;
      if (type === 'signal') color = 0x34d399; // Emerald
      if (type === 'noise') color = 0xf87171; // Rose
      if (type === 'context') color = 0x60a5fa; // Blue

      const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(6, 32), material);
      mesh.position.copy(fromVec);
      
      this.particlesGroup.add(mesh);
      this.particles.push({
        mesh,
        start: fromVec,
        end: toVec,
        progress: 0,
        speed: speed,
        type: type,
        onComplete: () => {
          resolve();
        }
      });
    });
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
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;
      
      if (p.type === 'noise') {
        // Fade out noise particle as it falls
        (p.mesh.material as THREE.Material).opacity = 1 - p.progress;
      }
      
      if (p.progress >= 1) {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particlesGroup.remove(p.mesh);
        if (p.onComplete) p.onComplete();
        this.particles.splice(i, 1);
      } else {
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      }
    }

    this.renderer.render(this.scene, this.camera);
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
