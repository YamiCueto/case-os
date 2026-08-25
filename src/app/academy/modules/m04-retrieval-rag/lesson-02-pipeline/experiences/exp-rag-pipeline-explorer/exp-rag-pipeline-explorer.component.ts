import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface PipelineNode {
  id: string;
  label: string;
  type: 'ingestion' | 'inference';
  position: THREE.Vector3;
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
}

@Component({
  selector: 'app-exp-rag-pipeline-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">RAG Pipeline Explorer</h3>
        <p class="exp-subtitle">Flujo interactivo de Retrieval-Augmented Generation</p>
        
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
            <input type="range" min="1" max="5" [ngModel]="topK()" (ngModelChange)="topK.set(+$event)" class="control-slider">
          </div>
        </div>
      </div>

      <div class="exp-layout">
        <div class="exp-canvas-wrapper">
          <div #canvasContainer class="exp-canvas" aria-label="Espacio 3D interactivo mostrando el pipeline RAG."></div>
          
          <div class="exp-canvas-controls">
            @if (!isCameraReset()) {
              <button class="exp-btn-icon" (click)="resetCamera()" title="Restablecer vista" aria-label="Restablecer vista">
                <span class="material-symbols-outlined">center_focus_strong</span>
              </button>
            }
          </div>
          
          @if (webglError()) {
            <div class="exp-webgl-error">
              <span class="material-symbols-outlined">warning</span>
              <p>WebGL no está disponible.</p>
            </div>
          }
        </div>

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

              @if (selectedNodeData()!.id === 'retrieval' || selectedNodeData()!.id === 'context') {
                <div class="retrieval-simulation">
                  <p class="simulation-note"><strong>Simulación Didáctica:</strong> Mostrando Top-{{ topK() }} candidate chunks (Cosine Similarity Mock)</p>
                  <ul class="chunk-list">
                    @for (chunk of mockChunks | slice:0:topK(); track $index) {
                      <li class="chunk-item" [class.chunk-signal]="chunk.isSignal" [class.chunk-noise]="!chunk.isSignal">
                        <span class="material-symbols-outlined chunk-icon">
                          {{ chunk.isSignal ? 'check_circle' : 'cancel' }}
                        </span>
                        <div class="chunk-text">
                          <span class="chunk-status">{{ chunk.isSignal ? 'Signal (Relevant)' : 'Noise (Irrelevant)' }}</span>
                          <span class="chunk-score">Score: {{ chunk.score }}</span>
                        </div>
                      </li>
                    }
                  </ul>
                  @if (selectedNodeData()!.id === 'context' && !mockChunks[topK()-1].isSignal) {
                    <div class="tradeoff-card tradeoff-card--danger" style="margin-top: 12px;">
                      Al inyectar Noise (ruido) en el Contexto, aumentamos drásticamente la probabilidad de que el LLM alucine.
                    </div>
                  }
                </div>
              }
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

  // State
  pipelineState = signal<'idle' | 'running' | 'completed'>('idle');
  selectedNodeId = signal<string | null>(null);
  topK = signal<number>(3);
  webglError = signal<boolean>(false);
  isCameraReset = signal<boolean>(true);

  // Mock data for Top-K simulation
  readonly mockChunks = [
    { isSignal: true, score: 0.89 },
    { isSignal: true, score: 0.82 },
    { isSignal: false, score: 0.65 }, // Noise starts appearing
    { isSignal: false, score: 0.58 },
    { isSignal: false, score: 0.41 }
  ];

  // Pipeline Nodes
  readonly nodes: PipelineNode[] = [
    // Ingestion (Offline)
    { id: 'docs', label: 'Documents', type: 'ingestion', position: new THREE.Vector3(-4, 2, -2), icon: 'description', description: 'Biblioteca de conocimiento original.', input: 'PDFs, Confluence, repositorios', process: 'Extracción de texto plano', output: 'Raw text documents', concepts: 'ETL, Data Sources' },
    { id: 'chunking', label: 'Chunking', type: 'ingestion', position: new THREE.Vector3(-1.5, 2, -2), icon: 'cut', description: 'Fragmentación del texto en piezas digeribles.', input: 'Raw text', process: 'Split por tokens/caracteres con overlap', output: 'Chunks de texto', concepts: 'Chunk Size, Overlap' },
    { id: 'embedding_off', label: 'Embedding', type: 'ingestion', position: new THREE.Vector3(1.5, 2, -2), icon: 'transform', description: 'Vectorización de cada chunk.', input: 'Text Chunks', process: 'Paso por modelo de embedding', output: 'Vectores densos', concepts: 'Vector Space, Dimensions' },
    { id: 'vectordb', label: 'Vector DB', type: 'ingestion', position: new THREE.Vector3(4, 2, -2), icon: 'database', description: 'Almacenamiento indexado de vectores y metadata.', input: 'Vectores + Metadata', process: 'Indexación HNSW/IVF', output: 'Índice buscable', concepts: 'ANN, Indexes, Metadata' },
    
    // Inference (Online)
    { id: 'query', label: 'Query', type: 'inference', position: new THREE.Vector3(-4, -1, 2), icon: 'search', description: 'Pregunta del usuario en tiempo real.', input: 'User Input', process: 'Recepción del prompt', output: 'Raw string query', concepts: 'Intent, User Prompt' },
    { id: 'embedding_on', label: 'Embedding', type: 'inference', position: new THREE.Vector3(-1.5, -1, 2), icon: 'transform', description: 'Vectorización de la pregunta (mismo modelo).', input: 'Raw string query', process: 'Paso por modelo de embedding', output: 'Query Vector', concepts: 'Symmetry' },
    { id: 'retrieval', label: 'Retrieval', type: 'inference', position: new THREE.Vector3(1, -1, 2), icon: 'radar', description: 'Búsqueda de los chunks más similares.', input: 'Query Vector', process: 'Cosine Similarity / ANN Search en Vector DB', output: 'Top-K candidate chunks', concepts: 'Similarity, Top-K' },
    { id: 'context', label: 'Context Build', type: 'inference', position: new THREE.Vector3(3.5, -1, 2), icon: 'construction', description: 'Ensamblaje del prompt inyectando los chunks.', input: 'Top-K chunks + Query', process: 'Prompt Formatting', output: 'Structured Prompt', concepts: 'Context Engineering' },
    { id: 'llm', label: 'LLM Generation', type: 'inference', position: new THREE.Vector3(6, -1, 2), icon: 'smart_toy', description: 'Generación de la respuesta fundamentada.', input: 'Structured Prompt', process: 'Inferencia causal', output: 'Final Response', concepts: 'Grounded Generation' }
  ];

  selectedNodeData = computed(() => {
    return this.nodes.find(n => n.id === this.selectedNodeId()) || null;
  });

  // Three.js State
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  private nodeMeshes: Map<string, THREE.Mesh> = new Map();
  private edgesGroup = new THREE.Group();
  private particlesGroup = new THREE.Group();
  private particles: Particle[] = [];
  
  private hoveredId: string | null = null;
  private resizeObserver!: ResizeObserver;
  private animationFrameId: number | null = null;
  
  private colors = {
    ingestion: 0x3b82f6, // blue
    inference: 0x10b981, // green
    bg: 0x0A0A0A,
    nodeBg: 0x1e293b,
    highlight: 0xf59e0b,
    edge: 0x334155,
    particle: 0x60a5fa
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

  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.colors.bg);

      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.set(1, 1, 12);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(5, 10, 5);
      this.scene.add(dirLight);

      this.scene.add(this.edgesGroup);
      this.scene.add(this.particlesGroup);

      this.createNodes();
      this.createEdges();

      container.addEventListener('pointermove', this.onPointerMove.bind(this));
      container.addEventListener('click', this.onClick.bind(this));

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(container);

      this.animate();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error(e);
    }
  }

  private createNodes() {
    const geometry = new THREE.BoxGeometry(1.2, 0.8, 0.2);
    
    this.nodes.forEach(node => {
      // Create canvas texture for text
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#1e293b'; // Base node color
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = node.type === 'ingestion' ? '#60a5fa' : '#34d399';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        map: texture
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      mesh.userData = { id: node.id, type: node.type, texture, canvas, ctx };
      
      this.nodeMeshes.set(node.id, mesh);
      this.scene.add(mesh);
    });
  }

  private createEdges() {
    const material = new THREE.LineBasicMaterial({ color: this.colors.edge, linewidth: 2 });
    
    // Ingestion flow
    this.addEdge('docs', 'chunking', material);
    this.addEdge('chunking', 'embedding_off', material);
    this.addEdge('embedding_off', 'vectordb', material);
    
    // Inference flow
    this.addEdge('query', 'embedding_on', material);
    this.addEdge('embedding_on', 'retrieval', material);
    this.addEdge('retrieval', 'context', material);
    this.addEdge('context', 'llm', material);
    
    // Cross flow
    this.addEdge('vectordb', 'retrieval', material, true);
  }

  private addEdge(fromId: string, toId: string, material: THREE.Material, dashed = false) {
    const from = this.nodeMeshes.get(fromId)!.position;
    const to = this.nodeMeshes.get(toId)!.position;
    
    const points = [from, to];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    let lineMat = material;
    const line = new THREE.Line(geometry, lineMat);
    if (dashed) {
      line.material = new THREE.LineDashedMaterial({ color: this.colors.edge, dashSize: 0.2, gapSize: 0.1 });
      line.computeLineDistances();
    }
    
    this.edgesGroup.add(line);
  }

  private updateNodeVisuals() {
    const selectedId = this.selectedNodeId();
    
    this.nodeMeshes.forEach((mesh, id) => {
      const isSelected = id === selectedId;
      const isHovered = id === this.hoveredId;
      
      mesh.scale.setScalar(isSelected ? 1.15 : (isHovered ? 1.05 : 1.0));
      
      // Update canvas texture outline
      const ud = mesh.userData;
      const ctx = ud['ctx'] as CanvasRenderingContext2D;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 256, 128);
      
      if (isSelected) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, 256, 128);
      } else if (isHovered) {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, 256, 128);
      }
      
      ctx.fillStyle = ud['type'] === 'ingestion' ? '#60a5fa' : '#34d399';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.nodes.find(n => n.id === id)!.label, 128, 64);
      
      const texture = ud['texture'] as THREE.CanvasTexture;
      texture.needsUpdate = true;
    });
  }

  private onPointerMove(event: PointerEvent) {
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.nodeMeshes.values()));

    let newHover = intersects.length > 0 ? intersects[0].object.userData['id'] : null;

    if (newHover !== this.hoveredId) {
      this.hoveredId = newHover;
      document.body.style.cursor = this.hoveredId ? 'pointer' : 'default';
      this.updateNodeVisuals();
    }
  }

  private onClick() {
    this.ngZone.run(() => {
      this.selectedNodeId.set(this.hoveredId);
      this.updateNodeVisuals();
    });
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

  private startSimulation() {
    this.clearParticles();
    // Simulate flow: Query -> Embed -> Retrieval -> Context -> LLM
    this.spawnParticle('query', 'embedding_on', 0);
    this.spawnParticle('embedding_on', 'retrieval', 1000);
    
    // Cross flow from Vector DB
    this.spawnParticle('vectordb', 'retrieval', 1500);
    
    // Chunks going to context
    this.spawnParticle('retrieval', 'context', 2500);
    this.spawnParticle('context', 'llm', 3500);
    
    setTimeout(() => {
      this.ngZone.run(() => {
        if (this.pipelineState() === 'running') {
          this.pipelineState.set('completed');
          this.selectedNodeId.set('llm');
          this.updateNodeVisuals();
        }
      });
    }, 4500);
  }

  private spawnParticle(fromId: string, toId: string, delay: number) {
    setTimeout(() => {
      if (this.pipelineState() !== 'running') return;
      
      const from = this.nodeMeshes.get(fromId)!.position;
      const to = this.nodeMeshes.get(toId)!.position;
      
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfde047 }) // yellow glow
      );
      mesh.position.copy(from);
      
      this.particlesGroup.add(mesh);
      this.particles.push({
        mesh,
        start: from.clone(),
        end: to.clone(),
        progress: 0,
        speed: 0.02
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
    this.controls.update();
    
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
    this.checkCameraPosition();
  }

  private checkCameraPosition() {
    const isReset = 
      Math.abs(this.camera.position.x - 1) < 0.1 &&
      Math.abs(this.camera.position.y - 1) < 0.1 &&
      Math.abs(this.camera.position.z - 12) < 0.1;
      
    if (this.isCameraReset() !== isReset) {
      this.ngZone.run(() => this.isCameraReset.set(isReset));
    }
  }

  resetCamera() {
    this.camera.position.set(1, 1, 12);
    this.controls.target.set(0, 0, 0);
  }

  private onResize() {
    if (!this.canvasContainer || !this.renderer) return;
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private cleanupThreeJs() {
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.controls) this.controls.dispose();
    
    this.clearParticles();
    
    this.nodeMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) mesh.material.dispose();
      if (mesh.userData['texture']) mesh.userData['texture'].dispose();
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
