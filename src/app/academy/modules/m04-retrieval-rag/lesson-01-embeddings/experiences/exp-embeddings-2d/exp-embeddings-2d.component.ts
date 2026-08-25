import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface EmbeddingPoint3D {
  id: string;
  x: number;
  y: number;
  z: number;
  text: string;
  concept: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-exp-embeddings-2d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Explorador de Embeddings 3D</h3>
        <p class="exp-subtitle">Visualización espacial de conceptos financieros mediante vectores.</p>
        
        <div class="exp-disclaimer">
          <span class="material-symbols-outlined exp-disclaimer-icon">info</span>
          <span><strong>Nota didáctica:</strong> Los embeddings reales viven en espacios de cientos o miles de dimensiones. Esta visualización 3D es una representación didáctica de las relaciones espaciales (proximidad semántica) entre vectores.</span>
        </div>
      </div>

      <div class="exp-layout">
        <!-- 3D Canvas -->
        <div class="exp-canvas-wrapper">
          <div #canvasContainer class="exp-canvas" aria-label="Espacio 3D interactivo mostrando los conceptos como puntos en el espacio vectorial."></div>
          
          <div class="exp-canvas-controls">
            @if (!isCameraReset()) {
              <button class="exp-btn-icon" (click)="resetCamera()" title="Restablecer vista" aria-label="Restablecer vista">
                <span class="material-symbols-outlined">restart_alt</span>
              </button>
            }
          </div>
          
          <!-- WebGL Fallback -->
          @if (webglError()) {
            <div class="exp-webgl-error">
              <span class="material-symbols-outlined">warning</span>
              <p>Tu navegador no soporta WebGL o está desactivado. No podemos mostrar la vista 3D.</p>
            </div>
          }
        </div>

        <!-- Info Panel -->
        <div class="exp-info-panel">
          @if (selectedPoint()) {
            <div class="exp-info-card">
              <span class="exp-badge" [style.background]="getBadgeBg(selectedPoint()!.concept)" [style.color]="getBadgeColor(selectedPoint()!.concept)">
                {{ selectedPoint()!.category }}
              </span>
              <h4 style="margin: 8px 0;">{{ selectedPoint()!.text }}</h4>
              <p class="exp-info-text">{{ selectedPoint()!.description }}</p>
              
              <div class="exp-neighbors-list">
                <span class="exp-neighbors-label">Vecinos más cercanos (Semántica similar):</span>
                <ul>
                  @for (n of currentNeighbors(); track n.id) {
                    <li>
                      <div class="exp-neighbor-title">"{{ n.text }}"</div>
                      <div class="exp-neighbor-dist">Distancia en esta representación 3D: {{ n.distance }}</div>
                    </li>
                  }
                </ul>
              </div>
            </div>
          } @else {
            <div class="exp-empty-state">
              <span class="material-symbols-outlined">360</span>
              <h4>Explora el espacio</h4>
              <p>Rota, haz zoom y selecciona un concepto.</p>
              <p class="exp-subtext">Selecciona un punto para descubrir sus vecinos semánticos. En esta representación simplificada, los conceptos relacionados aparecen próximos entre sí.</p>
            </div>
          }
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
      margin-top: var(--case-space-3);
      padding: var(--case-space-3);
      background: var(--case-color-info-bg);
      border-left: 4px solid var(--case-color-info);
      border-radius: var(--case-radius);
      color: var(--case-text-primary);
      font-size: 0.85rem;
    }
    .exp-disclaimer-icon {
      font-size: 1.2rem;
      color: var(--case-color-info);
    }

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

    .exp-info-panel {
      display: flex;
      flex-direction: column;
    }
    .exp-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: var(--case-space-8);
      background: var(--case-surface-1);
      border-radius: var(--case-radius-lg);
      border: 1px dashed var(--case-border);
    }
    .exp-empty-state h4 { color: var(--case-text-primary); margin: 0 0 8px 0; }
    .exp-empty-state p { color: var(--case-text-secondary); margin: 0; font-size: 0.95rem; }
    .exp-empty-state .exp-subtext { color: var(--case-text-muted); font-size: 0.85rem; margin-top: 12px; }
    .exp-empty-state span { font-size: 3rem; margin-bottom: 16px; opacity: 0.5; color: var(--case-text-muted); }
    
    .exp-info-card {
      background: var(--case-surface-3);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
      padding: var(--case-space-5);
    }
    .exp-badge {
      display: inline-block;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: var(--case-radius-pill);
      font-weight: bold;
    }
    .exp-info-card h4 { color: var(--case-text-primary); font-size: 1.1rem; }
    .exp-info-text {
      font-style: italic;
      color: var(--case-text-secondary);
      font-size: 0.9rem;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .exp-neighbors-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .exp-neighbors-label { font-weight: 600; font-size: 0.85rem; color: var(--case-text-primary); }
    .exp-neighbors-list ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .exp-neighbors-list li { 
      background: var(--case-surface-4);
      padding: 8px 12px;
      border-radius: var(--case-radius-md);
      border: 1px solid var(--case-border);
    }
    .exp-neighbor-title { font-size: 0.9rem; font-weight: 500; color: var(--case-text-primary); margin-bottom: 2px; }
    .exp-neighbor-dist { font-size: 0.75rem; color: var(--case-text-secondary); font-family: var(--case-font-mono); }
  `]
})
export class ExpEmbeddings2dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasContainer!: ElementRef<HTMLDivElement>;

  points: EmbeddingPoint3D[] = [
    // Savings cluster
    { id: 'p1', x: 0.8, y: 0.7, z: 0.5, text: 'Quiero ahorrar para el futuro', concept: 'savings', category: 'Ahorro', description: 'Intención orientada a la acumulación y preservación de capital a largo plazo.' },
    { id: 'p2', x: 0.75, y: 0.85, z: 0.6, text: 'Guardar plata todos los meses', concept: 'savings', category: 'Ahorro', description: 'Comportamiento financiero recurrente (ahorro programado).' },
    { id: 'p3', x: 0.85, y: 0.75, z: 0.4, text: 'Cuenta de ahorros programado', concept: 'savings', category: 'Ahorro', description: 'Producto específico de captación de fondos.' },
    
    // Credit cluster
    { id: 'p4', x: -0.6, y: 0.8, z: -0.5, text: 'Necesito un préstamo urgente', concept: 'credit', category: 'Crédito', description: 'Intención de liquidez inmediata con posible urgencia.' },
    { id: 'p5', x: -0.7, y: 0.7, z: -0.6, text: 'Financiación para mi negocio', concept: 'credit', category: 'Crédito', description: 'Necesidad de capital de trabajo para microempresa o PYME.' },
    { id: 'p6', x: -0.5, y: 0.85, z: -0.4, text: 'Solicitar tarjeta de crédito', concept: 'credit', category: 'Crédito', description: 'Instrumento de financiación de consumo rotativo.' },
    
    // Housing cluster
    { id: 'p7', x: -0.8, y: -0.6, z: 0.8, text: 'Comprar casa propia', concept: 'housing', category: 'Vivienda', description: 'Objetivo de adquisición de un activo inmobiliario familiar.' },
    { id: 'p8', x: -0.7, y: -0.7, z: 0.7, text: 'Crédito hipotecario', concept: 'housing', category: 'Vivienda', description: 'Producto financiero respaldado por garantía real (inmueble).' },
    
    // Support cluster
    { id: 'p9', x: 0.6, y: -0.8, z: -0.8, text: 'Olvidé mi clave', concept: 'support', category: 'Soporte', description: 'Problema operativo de acceso a canales digitales.' },
    { id: 'p10', x: 0.5, y: -0.7, z: -0.7, text: 'Número de atención al cliente', concept: 'support', category: 'Soporte', description: 'Búsqueda de canal de comunicación sincrónico con un agente.' },
    { id: 'p11', x: 0.7, y: -0.6, z: -0.9, text: 'Horarios de la sucursal', concept: 'support', category: 'Soporte', description: 'Consulta de información operativa sobre canales físicos.' },
  ];

  selectedId = signal<string | null>(null);
  webglError = signal<boolean>(false);
  isCameraReset = signal<boolean>(true);

  selectedPoint = computed(() => {
    return this.points.find(p => p.id === this.selectedId()) || null;
  });

  currentNeighbors = computed(() => {
    const selected = this.selectedPoint();
    if (!selected) return [];
    
    return this.points
      .filter(p => p.concept === selected.concept && p.id !== selected.id)
      .map(p => {
        const dist = Math.sqrt(
          Math.pow(p.x - selected.x, 2) + 
          Math.pow(p.y - selected.y, 2) + 
          Math.pow(p.z - selected.z, 2)
        );
        return { ...p, distance: dist.toFixed(2) };
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  });

  // Three.js State
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  private spheres: Map<string, THREE.Mesh> = new Map();
  private edgesGroup: THREE.Group = new THREE.Group();
  private pointsGroup: THREE.Group = new THREE.Group();
  
  private hoveredId: string | null = null;
  private resizeObserver!: ResizeObserver;
  private boundOnPointerMove = this.onPointerMove.bind(this);
  private boundOnClick = this.onClick.bind(this);

  // Colors mapping directly to CASE OS semantics
  private colors: Record<string, number> = {
    'savings': 0x10b981, // green
    'credit': 0xf59e0b,  // orange
    'housing': 0x8b5cf6, // purple
    'support': 0x3b82f6  // blue
  };
  private unselectedColor = 0x64748b;
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

  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.bgColor);

      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.set(2, 2, 3);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // Damping disabled para forzar rendering bajo demanda estricto
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

      this.scene.add(this.pointsGroup);
      this.scene.add(this.edgesGroup);

      // Axis Helper - muy sutil para no sugerir dimensiones semánticas reales
      const axesHelper = new THREE.AxesHelper(1.5);
      const axesColors = axesHelper.geometry.attributes['color'];
      for (let i = 0; i < axesColors.count; i++) {
        axesColors.setXYZ(i, axesColors.getX(i)*0.15, axesColors.getY(i)*0.15, axesColors.getZ(i)*0.15);
      }
      this.scene.add(axesHelper);

      this.createPoints();

      // Interactions
      container.addEventListener('pointermove', this.boundOnPointerMove);
      container.addEventListener('click', this.boundOnClick);

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(container);

      // Initial Render
      this.renderScene();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error('WebGL init error:', e);
    }
  }

  private createPoints() {
    const geometry = new THREE.SphereGeometry(0.06, 32, 32);
    
    this.points.forEach(p => {
      const material = new THREE.MeshPhongMaterial({ 
        color: this.colors[p.concept] || this.unselectedColor,
        shininess: 60
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(p.x, p.y, p.z);
      sphere.userData = { id: p.id, concept: p.concept, baseColor: this.colors[p.concept] || this.unselectedColor };
      
      this.spheres.set(p.id, sphere);
      this.pointsGroup.add(sphere);
    });
  }

  private onPointerMove(event: PointerEvent) {
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.pointsGroup.children);

    let newHover: string | null = null;
    if (intersects.length > 0) {
      newHover = intersects[0].object.userData['id'];
    }

    if (newHover !== this.hoveredId) {
      if (this.hoveredId) {
        const oldObj = this.spheres.get(this.hoveredId);
        if (oldObj && this.selectedId() !== this.hoveredId) {
          oldObj.scale.set(1, 1, 1);
        }
      }
      
      this.hoveredId = newHover;
      if (this.hoveredId) {
        document.body.style.cursor = 'pointer';
        const newObj = this.spheres.get(this.hoveredId);
        if (newObj) {
          newObj.scale.set(1.3, 1.3, 1.3);
        }
      } else {
        document.body.style.cursor = 'default';
      }
      
      this.renderScene();
    }
  }

  private onClick(event: MouseEvent) {
    if (this.hoveredId) {
      this.ngZone.run(() => {
        this.selectedId.set(this.hoveredId);
        this.updateVisualState();
      });
    } else {
      this.ngZone.run(() => {
        this.selectedId.set(null);
        this.updateVisualState();
      });
    }
  }

  private updateVisualState() {
    const selId = this.selectedId();
    const selPoint = this.points.find(p => p.id === selId);
    
    // Clear edges
    while(this.edgesGroup.children.length > 0){ 
      const child = this.edgesGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.edgesGroup.remove(child);
    }

    this.spheres.forEach((sphere, id) => {
      const mat = sphere.material as THREE.MeshPhongMaterial;
      
      if (!selId) {
        // Ningún nodo seleccionado: estado limpio original
        mat.color.setHex(sphere.userData['baseColor']);
        mat.opacity = 1;
        mat.transparent = false;
        sphere.scale.set(1, 1, 1);
      } else {
        if (id === selId) {
          // Nodo seleccionado: máxima jerarquía
          mat.color.setHex(sphere.userData['baseColor']);
          mat.opacity = 1;
          mat.transparent = false;
          sphere.scale.set(1.8, 1.8, 1.8);
        } else if (selPoint && sphere.userData['concept'] === selPoint.concept) {
          // Vecinos: segunda jerarquía
          mat.color.setHex(sphere.userData['baseColor']);
          mat.opacity = 0.9;
          mat.transparent = true;
          sphere.scale.set(1.1, 1.1, 1.1);
          
          const neighborPoint = this.points.find(p => p.id === id);
          if (neighborPoint) {
            this.drawEdge(selPoint, neighborPoint, sphere.userData['baseColor']);
          }
        } else {
          // Nodos no relacionados: atenuados casi invisibles
          mat.color.setHex(0x1a1a1a);
          mat.opacity = 0.15;
          mat.transparent = true;
          sphere.scale.set(0.6, 0.6, 0.6);
        }
      }
    });

    this.renderScene();
  }

  private drawEdge(p1: EmbeddingPoint3D, p2: EmbeddingPoint3D, colorHex: number) {
    const points = [];
    points.push(new THREE.Vector3(p1.x, p1.y, p1.z));
    points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: colorHex, 
      transparent: true, 
      opacity: 0.5
    });
    
    const line = new THREE.Line(geometry, material);
    this.edgesGroup.add(line);
  }

  private checkCameraPosition() {
    const isReset = 
      Math.abs(this.camera.position.x - 2) < 0.05 &&
      Math.abs(this.camera.position.y - 2) < 0.05 &&
      Math.abs(this.camera.position.z - 3) < 0.05;
      
    if (this.isCameraReset() !== isReset) {
      this.ngZone.run(() => this.isCameraReset.set(isReset));
    }
  }

  resetCamera() {
    this.ngZone.runOutsideAngular(() => {
      this.camera.position.set(2, 2, 3);
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
    
    if (this.canvasContainer?.nativeElement) {
      this.canvasContainer.nativeElement.removeEventListener('pointermove', this.boundOnPointerMove);
      this.canvasContainer.nativeElement.removeEventListener('click', this.boundOnClick);
    }

    if (this.controls) {
      this.controls.dispose();
    }
    
    this.spheres.forEach(sphere => {
      if (sphere.geometry) sphere.geometry.dispose();
      if (sphere.material) (sphere.material as THREE.Material).dispose();
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

  // Helpers for Badges
  getBadgeBg(concept: string): string {
    const map: Record<string, string> = {
      'savings': 'rgba(16, 185, 129, 0.1)',
      'credit': 'rgba(245, 158, 11, 0.1)',
      'housing': 'rgba(139, 92, 246, 0.1)',
      'support': 'rgba(59, 130, 246, 0.1)'
    };
    return map[concept] || 'rgba(100, 116, 139, 0.1)';
  }

  getBadgeColor(concept: string): string {
    const map: Record<string, string> = {
      'savings': '#10b981',
      'credit': '#f59e0b',
      'housing': '#8b5cf6',
      'support': '#3b82f6'
    };
    return map[concept] || '#64748b';
  }
}
