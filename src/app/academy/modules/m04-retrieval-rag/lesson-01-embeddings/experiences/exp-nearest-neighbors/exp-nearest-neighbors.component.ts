import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface DataPoint3D {
  id: string;
  x: number;
  y: number;
  z: number;
  label: string;
}

@Component({
  selector: 'app-exp-nearest-neighbors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Top-K Retrieval (Vecinos Más Cercanos) en 3D</h3>
        <p class="exp-subtitle">Modifica K para recuperar los resultados semánticos más afines a la consulta central (Query).</p>
        <div class="exp-disclaimer">
          <span class="material-symbols-outlined exp-disclaimer-icon">info</span>
          <span><strong>Nota didáctica:</strong> Los embeddings reales pueden tener cientos o miles de dimensiones y la métrica de similitud depende del sistema. En sistemas reales, K es el número de vectores que se recuperan ordenados por similitud respecto a la consulta.</span>
        </div>
      </div>

      <div class="exp-layout">
        <!-- Visualization -->
        <div class="exp-canvas-wrapper">
          <div #canvasContainer class="exp-canvas" aria-label="Visualización 3D de vecinos más cercanos"></div>
          
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

        <!-- Controls and Results -->
        <div class="exp-sidebar">
          <div class="exp-control-card">
            <h4>Control de Top-K</h4>
            <p class="exp-control-desc">¿Cuántos vecinos quieres recuperar?</p>
            
            <div class="exp-k-buttons">
              @for (val of [1, 3, 5, 10]; track val) {
                <button 
                  class="exp-btn" 
                  [class.active]="k() === val"
                  (click)="updateK(val)">
                  K = {{ val }}
                </button>
              }
            </div>
          </div>

          <div class="exp-results-card">
            <h4>Resultados (Top-{{ k() }})</h4>
            <ul class="exp-results-list">
              @for (neighbor of currentNeighbors(); track neighbor.id; let i = $index) {
                <li class="exp-result-item">
                  <span class="exp-result-rank">{{ i + 1 }}</span>
                  <div style="display: flex; flex-direction: column;">
                    <span class="exp-result-label">{{ neighbor.label }}</span>
                    <span class="exp-result-dist">Distancia relativa en esta representación 3D: {{ neighbor.dist.toFixed(3) }}</span>
                  </div>
                </li>
              }
            </ul>
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
    
    .exp-disclaimer {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-top: 12px;
      padding: 12px;
      background: var(--case-color-info-bg);
      border-left: 4px solid var(--case-color-info);
      border-radius: var(--case-radius);
      color: var(--case-text-primary);
      font-size: 0.85rem;
    }
    .exp-disclaimer-icon { font-size: 1.2rem; color: var(--case-color-info); }

    .exp-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: var(--case-space-6);
      margin-top: var(--case-space-4);
    }
    @media (max-width: 768px) {
      .exp-layout { grid-template-columns: 1fr; }
    }

    .exp-canvas-wrapper {
      position: relative;
      background: var(--case-surface-1);
      border-radius: var(--case-radius-lg);
      border: 1px solid var(--case-border);
      overflow: hidden;
      aspect-ratio: 4/3;
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
      gap: 16px;
    }
    .exp-control-card, .exp-results-card {
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      padding: var(--case-space-4);
    }
    .exp-control-card h4, .exp-results-card h4 {
      margin: 0 0 8px 0;
      color: var(--case-text-primary);
    }
    .exp-control-desc {
      font-size: 0.85rem;
      color: var(--case-text-secondary);
      margin-bottom: 12px;
    }
    
    .exp-k-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .exp-btn {
      padding: 8px 16px;
      border: 1px solid var(--case-border);
      background: var(--case-surface-4);
      border-radius: var(--case-radius);
      cursor: pointer;
      font-weight: 600;
      color: var(--case-text-primary);
      transition: var(--case-transition);
    }
    .exp-btn:hover { background: var(--case-surface-5); }
    .exp-btn.active {
      background: var(--case-color-info-bg);
      color: var(--case-color-info);
      border-color: var(--case-color-info);
    }

    .exp-results-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .exp-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: var(--case-surface-4);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius);
    }
    .exp-result-rank {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      background: var(--case-color-info-bg);
      color: var(--case-color-info);
      border-radius: var(--case-radius-pill);
      font-weight: bold;
      font-size: 0.75rem;
    }
    .exp-result-label {
      color: var(--case-text-primary);
      font-size: 0.85rem;
      font-weight: 500;
    }
    .exp-result-dist {
      color: var(--case-text-secondary);
      font-size: 0.75rem;
      font-family: var(--case-font-mono);
    }
  `]
})
export class ExpNearestNeighborsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;

  queryPoint = { x: 0, y: 0, z: 0 };
  
  points: DataPoint3D[] = [
    { id: '1', x: 0.2, y: 0.3, z: 0.1, label: 'Ahorro programado' },
    { id: '2', x: 0.4, y: -0.2, z: 0.3, label: 'Cuenta de ahorros' },
    { id: '3', x: -0.3, y: 0.4, z: 0.2, label: 'CDT' },
    { id: '4', x: -0.5, y: 0.5, z: -0.1, label: 'Inversión' },
    { id: '5', x: -0.4, y: -0.4, z: 0.3, label: 'Préstamo' },
    { id: '6', x: -0.6, y: -0.2, z: -0.5, label: 'Crédito educativo' },
    { id: '7', x: 0.6, y: 0.6, z: 0.4, label: 'Tarjeta de crédito' },
    { id: '8', x: 0.7, y: 0.3, z: 0.6, label: 'Seguro de vida' },
    { id: '9', x: 0.3, y: 0.7, z: -0.3, label: 'Microcrédito' },
    { id: '10', x: -0.7, y: -0.6, z: 0.2, label: 'Compra de cartera' },
    { id: '11', x: -0.8, y: 0.8, z: -0.4, label: 'Línea de atención' },
    { id: '12', x: 0.8, y: -0.7, z: 0.5, label: 'Sucursales' },
    { id: '13', x: 0.9, y: -0.3, z: -0.6, label: 'Actualizar datos' },
    { id: '14', x: -0.9, y: -0.2, z: -0.8, label: 'Factura 1020' },
    { id: '15', x: 0.2, y: -0.8, z: -0.7, label: 'Extracto bancario' },
  ];

  k = signal(3);

  currentNeighbors = computed(() => {
    const withDist = this.points.map(p => {
      const dx = p.x - this.queryPoint.x;
      const dy = p.y - this.queryPoint.y;
      const dz = p.z - this.queryPoint.z;
      return { ...p, dist: Math.sqrt(dx*dx + dy*dy + dz*dz) };
    });
    return withDist.sort((a, b) => a.dist - b.dist).slice(0, this.k());
  });

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
  private bgColor = 0x0A0A0A; // --case-surface-1

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJs();
    });
  }

  ngOnDestroy() {
    this.cleanupThreeJs();
  }

  updateK(val: number) {
    this.k.set(val);
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
      this.camera.position.set(1.5, 1.5, 2.5);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = false;
      this.controls.addEventListener('change', () => {
        this.checkCameraPosition();
        this.renderScene();
      });

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 7);
      this.scene.add(dirLight);

      this.scene.add(this.edgesGroup);

      // Sutil axes helper
      const axesHelper = new THREE.AxesHelper(1.5);
      const axesColors = axesHelper.geometry.attributes['color'];
      for (let i = 0; i < axesColors.count; i++) {
        axesColors.setXYZ(i, axesColors.getX(i)*0.15, axesColors.getY(i)*0.15, axesColors.getZ(i)*0.15);
      }
      this.scene.add(axesHelper);

      // Create Query Point
      const queryGeo = new THREE.SphereGeometry(0.08, 32, 32);
      const queryMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80 }); // --case-color-warning
      this.queryMesh = new THREE.Mesh(queryGeo, queryMat);
      this.queryMesh.position.set(this.queryPoint.x, this.queryPoint.y, this.queryPoint.z);
      this.scene.add(this.queryMesh);

      // Create Data Points
      const ptGeo = new THREE.SphereGeometry(0.05, 16, 16);
      this.points.forEach(p => {
        const ptMat = new THREE.MeshPhongMaterial({ color: 0x64748b });
        const mesh = new THREE.Mesh(ptGeo, ptMat);
        mesh.position.set(p.x, p.y, p.z);
        this.spheres.set(p.id, mesh);
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

    const neighbors = this.currentNeighbors();
    const neighborIds = new Set(neighbors.map(n => n.id));

    // Clear edges
    while(this.edgesGroup.children.length > 0){
      const child = this.edgesGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.edgesGroup.remove(child);
    }

    this.spheres.forEach((mesh, id) => {
      const mat = mesh.material as THREE.MeshPhongMaterial;
      if (neighborIds.has(id)) {
        // High priority neighbor
        mat.color.setHex(0x3b82f6); // --case-color-info
        mat.opacity = 1;
        mat.transparent = false;
        mesh.scale.set(1.4, 1.4, 1.4);
        
        // Draw edge to query
        const p = this.points.find(pt => pt.id === id);
        if (p) {
          const geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(this.queryPoint.x, this.queryPoint.y, this.queryPoint.z),
            new THREE.Vector3(p.x, p.y, p.z)
          ]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, opacity: 0.6, transparent: true });
          const line = new THREE.Line(geom, lineMat);
          this.edgesGroup.add(line);
        }
      } else {
        // Attenuated rest
        mat.color.setHex(0x1a1a1a);
        mat.opacity = 0.15;
        mat.transparent = true;
        mesh.scale.set(0.7, 0.7, 0.7);
      }
    });

    this.renderScene();
  }

  private checkCameraPosition() {
    const isReset = 
      Math.abs(this.camera.position.x - 1.5) < 0.05 &&
      Math.abs(this.camera.position.y - 1.5) < 0.05 &&
      Math.abs(this.camera.position.z - 2.5) < 0.05;
      
    if (this.isCameraReset() !== isReset) {
      this.ngZone.run(() => this.isCameraReset.set(isReset));
    }
  }

  resetCamera() {
    this.ngZone.runOutsideAngular(() => {
      this.camera.position.set(1.5, 1.5, 2.5);
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
