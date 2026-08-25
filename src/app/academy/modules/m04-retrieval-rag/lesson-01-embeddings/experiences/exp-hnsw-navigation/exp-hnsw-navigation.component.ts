import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface HnswNode3D {
  id: string;
  x: number;
  y: number; // Represents the hierarchical layer conceptually
  z: number;
  layer: number;
  edges: string[];
}

@Component({
  selector: 'app-exp-hnsw-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Simulación Conceptual: Índice HNSW en 3D</h3>
        <p class="exp-subtitle">Approximate Nearest Neighbors (ANN) — Navegación paso a paso en un grafo estructurado jerárquicamente.</p>
        
        <div class="exp-callout">
          <span class="material-symbols-outlined">lightbulb</span>
          <span>HNSW no compara la query contra todos los puntos. Entra por la capa superior y desciende por el grafo hacia la zona más prometedora. <strong>El eje vertical representa visualmente las capas jerárquicas de HNSW. No representa una dimensión adicional del embedding.</strong></span>
        </div>
      </div>

      <div class="exp-layout">
        <!-- Visualization -->
        <div class="exp-canvas-wrapper">
          <div #canvasContainer class="exp-canvas" aria-label="Visualización 3D de la navegación en el grafo HNSW"></div>
          
          <div class="exp-canvas-controls">
            @if (!isCameraReset()) {
              <button class="exp-btn-icon" (click)="resetCamera()" title="Restablecer vista" aria-label="Restablecer vista">
                <span class="material-symbols-outlined">restart_alt</span>
              </button>
            }
          </div>
          
          @if (webglError()) {
            <div class="exp-webgl-error">
              <span class="material-symbols-outlined">warning</span>
              <p>Tu navegador no soporta WebGL o está desactivado.</p>
            </div>
          }
        </div>

        <!-- Controls & Explanation -->
        <div class="exp-sidebar">
          
          <div class="exp-steps">
            <h4>Fase actual:</h4>
            
            <div class="exp-step-item" [class.active]="step() === 0" [class.done]="step() > 0">
              <div class="exp-step-icon"><span class="material-symbols-outlined">login</span></div>
              <div class="exp-step-text">
                <strong>Entry Point</strong>
                <span>Layer superior → navegación gruesa. Entramos al grafo por el nodo de la capa superior.</span>
              </div>
            </div>
            
            <div class="exp-step-item" [class.active]="step() === 1" [class.done]="step() > 1">
              <div class="exp-step-icon"><span class="material-symbols-outlined">search</span></div>
              <div class="exp-step-text">
                <strong>Candidate Search</strong>
                <span>Buscamos vecinos conectados que estén más cerca de la Query.</span>
              </div>
            </div>
            
            <div class="exp-step-item" [class.active]="step() === 2" [class.done]="step() > 2">
              <div class="exp-step-icon"><span class="material-symbols-outlined">zoom_in_map</span></div>
              <div class="exp-step-text">
                <strong>Nearest Region</strong>
                <span>Layer intermedia → refinamiento. Bajamos de capa al no encontrar grandes mejoras.</span>
              </div>
            </div>
            
            <div class="exp-step-item" [class.active]="step() === 3" [class.done]="step() > 3">
              <div class="exp-step-icon"><span class="material-symbols-outlined">check_circle</span></div>
              <div class="exp-step-text">
                <strong>Local Minimum Found</strong>
                <span>Layer inferior → búsqueda fina. ¡Encontramos los vecinos más cercanos aproximados (ANN)!</span>
              </div>
            </div>
          </div>

          <div class="exp-actions">
            @if (step() < 3) {
              <button class="exp-btn exp-btn-primary" (click)="nextStep()">
                Siguiente paso <span class="material-symbols-outlined" style="font-size: 18px">arrow_forward</span>
              </button>
            } @else {
              <button class="exp-btn exp-btn-secondary" (click)="reset()">
                <span class="material-symbols-outlined" style="font-size: 18px">restart_alt</span> Reiniciar simulación
              </button>
            }
          </div>

          <div class="exp-stats">
            <span class="exp-stat">Nodos en base de datos: <strong>{{ nodes.length }}</strong></span>
            <span class="exp-stat">Nodos comparados (ANN): <strong class="text-blue">{{ visitedNodes().length }}</strong></span>
            @if (step() === 3) {
              <span class="exp-stat-highlight text-green">¡Búsqueda resuelta comparando solo el {{ ((visitedNodes().length / nodes.length) * 100).toFixed(0) }}% de los datos!</span>
            }
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .exp-container {
      display: flex;
      flex-direction: column;
      gap: var(--case-space-4);
      padding: var(--case-space-6);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }
    .exp-title { margin: 0 0 4px 0; color: var(--case-text-primary); }
    .exp-subtitle { margin: 0; color: var(--case-text-secondary); font-size: 0.9rem; }

    .exp-callout {
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--case-color-info-bg);
      border: 1px solid var(--case-color-info);
      padding: var(--case-space-3) var(--case-space-4);
      border-radius: var(--case-radius-md);
      margin-top: var(--case-space-3);
      color: var(--case-text-primary);
      font-size: 0.9rem;
    }
    .exp-callout .material-symbols-outlined { color: var(--case-color-info); }

    .exp-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--case-space-6);
      margin-top: var(--case-space-4);
    }
    @media (max-width: 800px) {
      .exp-layout { grid-template-columns: 1fr; }
    }

    .exp-canvas-wrapper {
      position: relative;
      background: var(--case-surface-1);
      border-radius: var(--case-radius-lg);
      border: 1px solid var(--case-border);
      overflow: hidden;
      aspect-ratio: 1;
      display: flex;
    }
    .exp-canvas {
      width: 100%;
      height: 100%;
      outline: none;
    }
    .exp-canvas-controls {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .exp-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--case-radius);
      background: var(--case-surface-3);
      color: var(--case-text-primary);
      border: 1px solid var(--case-border);
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-btn-icon:hover {
      background: var(--case-surface-4);
      border-color: var(--case-border-strong);
    }

    .exp-webgl-error {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 32px;
      background: var(--case-surface-1);
      color: var(--case-color-warning);
    }

    .exp-sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .exp-steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .exp-steps h4 { margin: 0 0 8px 0; font-size: 1rem; color: var(--case-text-primary); }
    
    .exp-step-item {
      display: flex;
      gap: 12px;
      padding: var(--case-space-3);
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      opacity: 0.6;
      transition: var(--case-transition);
    }
    .exp-step-item.active {
      opacity: 1;
      background: var(--case-surface-4);
      border-color: var(--case-color-info);
      box-shadow: 0 0 0 1px var(--case-color-info);
    }
    .exp-step-item.done {
      opacity: 0.8;
      border-color: var(--case-border-strong);
    }
    .exp-step-icon {
      display: flex;
      align-items: flex-start;
      color: var(--case-text-secondary);
    }
    .active .exp-step-icon { color: var(--case-color-info); }
    .done .exp-step-icon { color: var(--case-color-success); }
    
    .exp-step-text {
      display: flex;
      flex-direction: column;
      font-size: 0.85rem;
      gap: 4px;
    }
    .exp-step-text strong { color: var(--case-text-primary); }
    .exp-step-text span { color: var(--case-text-secondary); }

    .exp-actions {
      display: flex;
    }
    .exp-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: var(--case-space-3);
      border-radius: var(--case-radius-md);
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: var(--case-transition);
    }
    .exp-btn-primary { background: var(--case-accent); color: var(--case-text-on-accent); }
    .exp-btn-primary:hover { background: var(--case-accent-hover); }
    .exp-btn-secondary { background: var(--case-surface-4); color: var(--case-text-primary); border: 1px solid var(--case-border); }
    .exp-btn-secondary:hover { background: var(--case-state-hover); }

    .exp-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: var(--case-space-4);
      background: var(--case-surface-3);
      border: 1px dashed var(--case-border);
      border-radius: var(--case-radius-md);
      font-size: 0.85rem;
      color: var(--case-text-secondary);
    }
    .exp-stat { display: flex; justify-content: space-between; }
    .exp-stat strong { color: var(--case-text-primary); }
    .exp-stat-highlight { 
      margin-top: 8px; 
      padding-top: 8px;
      border-top: 1px solid var(--case-border);
      font-weight: bold;
    }
    
    .text-blue { color: var(--case-color-info) !important; }
    .text-green { color: var(--case-color-success) !important; }
  `]
})
export class ExpHnswNavigationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;

  // Layers map to Y-axis coordinates for physical hierarchical representation
  // Layer 2: y = 0.8
  // Layer 1: y = 0.0
  // Layer 0: y = -0.8
  // Query Point is conceptually at the bottom layer.
  queryPoint = { x: 0.8, y: -0.8, z: -0.8 };

  nodes: HnswNode3D[] = [
    { id: 'entry', x: -0.7, y: 0.8, z: 0.7, layer: 2, edges: ['n1', 'n2'] },
    
    { id: 'n1', x: 0, y: 0.0, z: 0.4, layer: 1, edges: ['entry', 'n2', 'n3'] },
    { id: 'n2', x: -0.4, y: 0.0, z: 0, layer: 1, edges: ['entry', 'n1'] },
    
    { id: 'n3', x: 0.5, y: 0.0, z: -0.2, layer: 1, edges: ['n1', 'n4', 'n5'] },
    
    { id: 'n4', x: 0.7, y: -0.8, z: -0.6, layer: 0, edges: ['n3', 'n5', 'n6'] },
    { id: 'n5', x: 0.4, y: -0.8, z: -0.7, layer: 0, edges: ['n3', 'n4', 'n7'] },
    
    { id: 'n6', x: 0.85, y: -0.8, z: -0.75, layer: 0, edges: ['n4', 'n7'] },
    { id: 'n7', x: 0.75, y: -0.8, z: -0.85, layer: 0, edges: ['n5', 'n6'] },

    // Background noise nodes
    { id: 'b1', x: -0.6, y: -0.8, z: -0.5, layer: 0, edges: [] },
    { id: 'b2', x: -0.2, y: -0.8, z: -0.7, layer: 0, edges: [] },
    { id: 'b3', x: 0.8, y: -0.8, z: 0.6, layer: 0, edges: [] },
    { id: 'b4', x: 0.5, y: -0.8, z: 0.8, layer: 0, edges: [] },
    { id: 'b5', x: -0.1, y: -0.8, z: 0.8, layer: 0, edges: [] },
    { id: 'b6', x: 0.9, y: -0.8, z: 0.1, layer: 0, edges: [] },
    { id: 'b7', x: 0.9, y: -0.8, z: -0.4, layer: 0, edges: [] },
    { id: 'b8', x: 0.2, y: -0.8, z: -0.4, layer: 0, edges: [] },
  ];

  step = signal(0);
  
  visitedNodes = computed(() => {
    const s = this.step();
    if (s === 0) return ['entry'];
    if (s === 1) return ['entry', 'n1', 'n2'];
    if (s === 2) return ['entry', 'n1', 'n2', 'n3', 'n4', 'n5'];
    if (s === 3) return ['entry', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];
    return [];
  });

  visitedEdges = computed(() => {
    const s = this.step();
    const edges = [];
    if (s >= 1) edges.push('entry-n1', 'entry-n2');
    if (s >= 2) edges.push('n1-n3');
    if (s >= 3) edges.push('n3-n4', 'n4-n6', 'n4-n7');
    return edges;
  });

  currentStepNode = computed(() => {
    const s = this.step();
    if (s === 0) return 'entry';
    if (s === 1) return 'n1';
    if (s === 2) return 'n4';
    if (s === 3) return 'n6'; 
    return '';
  });

  getNode(id: string): HnswNode3D | undefined {
    return this.nodes.find(n => n.id === id);
  }

  isNodeVisited(id: string): boolean {
    return this.visitedNodes().includes(id);
  }

  isEdgeVisited(idA: string, idB: string): boolean {
    const key1 = `${idA}-${idB}`;
    const key2 = `${idB}-${idA}`;
    return this.visitedEdges().includes(key1) || this.visitedEdges().includes(key2);
  }

  // THREE.JS STATE
  webglError = signal<boolean>(false);
  isCameraReset = signal<boolean>(true);
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private resizeObserver!: ResizeObserver;
  
  private spheres: Map<string, THREE.Mesh> = new Map();
  private edgesGroup: THREE.Group = new THREE.Group();
  private queryMesh!: THREE.Mesh;
  private planesGroup: THREE.Group = new THREE.Group();
  private bgColor = 0x0A0A0A;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJs();
    });
  }

  ngOnDestroy() {
    this.cleanupThreeJs();
  }

  nextStep() {
    if (this.step() < 3) {
      this.step.set(this.step() + 1);
      this.ngZone.runOutsideAngular(() => {
        this.updateVisualState();
      });
    }
  }

  reset() {
    this.step.set(0);
    this.ngZone.runOutsideAngular(() => {
      this.updateVisualState();
    });
  }

  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.bgColor);

      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      // Position camera to naturally see the layers
      this.camera.position.set(2, 1.5, 3);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = false;
      this.controls.target.set(0, 0, 0);
      this.controls.addEventListener('change', () => {
        this.checkCameraPosition();
        this.renderScene();
      });

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 7);
      this.scene.add(dirLight);

      this.scene.add(this.edgesGroup);
      this.scene.add(this.planesGroup);

      // Draw subtle planes to indicate the layers (Layer 2, 1, 0)
      const planeGeo = new THREE.PlaneGeometry(3, 3);
      const planeMat = new THREE.MeshBasicMaterial({ 
        color: 0x333333, 
        transparent: true, 
        opacity: 0.1, 
        side: THREE.DoubleSide,
        depthWrite: false
      });
      [0.8, 0.0, -0.8].forEach((yPos) => {
        const p = new THREE.Mesh(planeGeo, planeMat);
        p.rotation.x = Math.PI / 2;
        p.position.y = yPos;
        this.planesGroup.add(p);
      });

      // Create Query Point
      const queryGeo = new THREE.SphereGeometry(0.08, 32, 32);
      const queryMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80 }); // warning
      this.queryMesh = new THREE.Mesh(queryGeo, queryMat);
      this.queryMesh.position.set(this.queryPoint.x, this.queryPoint.y, this.queryPoint.z);
      this.scene.add(this.queryMesh);

      // Create Data Points
      this.nodes.forEach(node => {
        // Base sizes on layer
        let radius = 0.04;
        if (node.layer === 2) radius = 0.08;
        if (node.layer === 1) radius = 0.06;

        const ptGeo = new THREE.SphereGeometry(radius, 16, 16);
        const ptMat = new THREE.MeshPhongMaterial({ color: 0x64748b });
        const mesh = new THREE.Mesh(ptGeo, ptMat);
        mesh.position.set(node.x, node.y, node.z);
        this.spheres.set(node.id, mesh);
        this.scene.add(mesh);
      });

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(container);

      // Initial state
      this.updateVisualState();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error('WebGL init error:', e);
    }
  }

  private updateVisualState() {
    if (!this.scene) return;

    const currentId = this.currentStepNode();

    // Clear edges
    while(this.edgesGroup.children.length > 0){
      const child = this.edgesGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.edgesGroup.remove(child);
    }

    // Update Nodes
    this.spheres.forEach((mesh, id) => {
      const mat = mesh.material as THREE.MeshPhongMaterial;
      const isCurrent = id === currentId;
      const isVisited = this.isNodeVisited(id);
      
      const nodeData = this.getNode(id)!;
      let baseScale = 1.0;

      if (isCurrent) {
        mat.color.setHex(0x3b82f6); // --case-color-info
        mat.opacity = 1;
        mat.transparent = false;
        mesh.scale.set(baseScale * 1.5, baseScale * 1.5, baseScale * 1.5);
      } else if (isVisited) {
        mat.color.setHex(0x3b82f6);
        mat.opacity = 0.7;
        mat.transparent = true;
        mesh.scale.set(baseScale * 1.1, baseScale * 1.1, baseScale * 1.1);
      } else {
        // Unvisited
        mat.color.setHex(0x1a1a1a);
        mat.opacity = 0.15;
        mat.transparent = true;
        mesh.scale.set(baseScale, baseScale, baseScale);
      }
    });

    // Draw Edges
    this.nodes.forEach(node => {
      node.edges.forEach(targetId => {
        // Only draw edge once
        if (node.id > targetId) return; 

        const targetNode = this.getNode(targetId);
        if (!targetNode) return;

        const visited = this.isEdgeVisited(node.id, targetId);
        
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(node.x, node.y, node.z),
          new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
        ]);

        const lineMat = new THREE.LineBasicMaterial({ 
          color: visited ? 0x3b82f6 : 0x333333,
          opacity: visited ? 0.9 : 0.2, 
          transparent: true,
          linewidth: visited ? 2 : 1 // Note: linewidth > 1 is not supported by most WebGL implementations, but kept for intent
        });

        const line = new THREE.Line(geom, lineMat);
        this.edgesGroup.add(line);
      });
    });

    this.renderScene();
  }

  private checkCameraPosition() {
    const isReset = 
      Math.abs(this.camera.position.x - 2) < 0.05 &&
      Math.abs(this.camera.position.y - 1.5) < 0.05 &&
      Math.abs(this.camera.position.z - 3) < 0.05;
      
    if (this.isCameraReset() !== isReset) {
      this.ngZone.run(() => this.isCameraReset.set(isReset));
    }
  }

  resetCamera() {
    this.ngZone.runOutsideAngular(() => {
      this.camera.position.set(2, 1.5, 3);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      this.checkCameraPosition();
      this.renderScene();
    });
  }

  private onResize() {
    if (!this.canvasContainer || !this.renderer) return;
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderScene();
  }

  private renderScene() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private cleanupThreeJs() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.controls) this.controls.dispose();
    
    if (this.queryMesh) {
      this.queryMesh.geometry.dispose();
      (this.queryMesh.material as THREE.Material).dispose();
    }

    this.planesGroup.children.forEach(child => {
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    });

    this.spheres.forEach(mesh => {
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
