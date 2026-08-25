import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface TestCase {
  id: string;
  a: [number, number, number];
  b: [number, number, number];
  expected: number;
  result: number | null;
  passed: boolean | null;
  error: string | null;
}

@Component({
  selector: 'app-exp-cosine-similarity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-container">
      <div class="exp-header">
        <h3 class="exp-title">Midiendo la Similitud Coseno (3D)</h3>
        <p class="exp-subtitle">Experimenta visualmente en el espacio y luego implementa el algoritmo genérico en JavaScript.</p>
        <div class="exp-disclaimer">
          <span class="material-symbols-outlined exp-disclaimer-icon">info</span>
          <span><strong>Nota didáctica:</strong> Los embeddings reales viven en espacios de cientos o miles de dimensiones. Esta visualización 3D es una representación simplificada para comprender la geometría del ángulo.</span>
        </div>
      </div>

      <!-- VISUALIZER -->
      <div class="exp-visualizer">
        <div class="exp-canvas-wrapper">
          <div #canvasContainer class="exp-canvas" aria-label="Visualización 3D del ángulo entre dos vectores"></div>
          
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

        <div class="exp-metrics">
          <div class="exp-metric-card">
            <span class="exp-metric-label">Vector A (Fijo)</span>
            <span class="exp-metric-value text-blue">[{{ vectorA()[0].toFixed(2) }}, {{ vectorA()[1].toFixed(2) }}, {{ vectorA()[2].toFixed(2) }}]</span>
          </div>
          
          <div class="exp-metric-card">
            <span class="exp-metric-label">Vector B (Controlable)</span>
            <div class="exp-sliders">
              <div class="exp-slider-row">
                <label>X:</label>
                <input type="range" min="-1" max="1" step="0.05" [value]="vectorB()[0]" (input)="updateVectorB(0, $event)">
              </div>
              <div class="exp-slider-row">
                <label>Y:</label>
                <input type="range" min="-1" max="1" step="0.05" [value]="vectorB()[1]" (input)="updateVectorB(1, $event)">
              </div>
              <div class="exp-slider-row">
                <label>Z:</label>
                <input type="range" min="-1" max="1" step="0.05" [value]="vectorB()[2]" (input)="updateVectorB(2, $event)">
              </div>
            </div>
            <span class="exp-metric-value text-orange" style="font-size: 1rem; margin-top: 8px;">[{{ vectorB()[0].toFixed(2) }}, {{ vectorB()[1].toFixed(2) }}, {{ vectorB()[2].toFixed(2) }}]</span>
          </div>
          
          <div class="exp-metric-card">
            <span class="exp-metric-label">Ángulo (θ)</span>
            <span class="exp-metric-value">{{ angleDegrees().toFixed(0) }}°</span>
          </div>
          <div class="exp-metric-card highlight">
            <span class="exp-metric-label">Cosine Similarity</span>
            <span class="exp-metric-value huge">{{ cosineSim().toFixed(3) }}</span>
          </div>
        </div>
      </div>

      <!-- EDITOR -->
      <div class="exp-editor-section">
        <h4>Implementación en Código</h4>
        <p>Completa la función para calcular la similitud coseno. Recuerda la fórmula: <code>(A • B) / (||A|| * ||B||)</code></p>
        
        <div class="exp-editor-layout">
          <div class="exp-editor-wrapper" #editorContainer></div>
          
          <div class="exp-test-panel">
            <div class="exp-test-header">
              <h4>Pruebas (Tests)</h4>
              <button class="exp-btn exp-btn-primary" (click)="runCode()">Ejecutar Código</button>
            </div>
            
            <div class="exp-test-list">
              @for (test of tests(); track test.id) {
                <div class="exp-test-item" [ngClass]="{'passed': test.passed === true, 'failed': test.passed === false}">
                  <div class="exp-test-info">
                    <code>cosineSimilarity([{{ test.a }}], [{{ test.b }}])</code>
                    <span class="exp-test-expected">Esperado: {{ test.expected }}</span>
                  </div>
                  <div class="exp-test-status">
                    @if (test.passed === true) {
                      <span class="material-symbols-outlined text-green">check_circle</span>
                    } @else if (test.passed === false) {
                      <span class="material-symbols-outlined text-red">cancel</span>
                    } @else {
                      <span class="material-symbols-outlined text-gray">pending</span>
                    }
                  </div>
                  @if (test.error) {
                    <div class="exp-test-error">{{ test.error }}</div>
                  } @else if (test.result !== null) {
                    <div class="exp-test-result">Obtenido: {{ test.result.toFixed(4) }}</div>
                  }
                </div>
              }
            </div>

            @if (allTestsPassed()) {
              <div class="exp-success-alert">
                <span class="material-symbols-outlined">emoji_events</span>
                ¡Excelente! Tu implementación es correcta y funciona para N dimensiones.
              </div>
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
      gap: var(--case-space-6);
      padding: var(--case-space-6);
      background: var(--case-surface-2);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-lg);
    }
    .exp-title { margin: 0 0 4px 0; color: var(--case-text-primary); }
    .exp-subtitle { margin: 0; color: var(--case-text-secondary); }
    
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

    .exp-visualizer {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: var(--case-space-6);
      align-items: stretch;
      background: var(--case-surface-3);
      padding: var(--case-space-5);
      border-radius: var(--case-radius-lg);
      border: 1px solid var(--case-border);
    }
    @media (max-width: 768px) {
      .exp-visualizer { grid-template-columns: 1fr; }
    }

    .exp-canvas-wrapper {
      position: relative;
      background: var(--case-surface-1);
      border-radius: var(--case-radius-lg);
      border: 1px solid var(--case-border);
      overflow: hidden;
      aspect-ratio: 16/9;
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

    .exp-metrics {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .exp-metric-card {
      background: var(--case-surface-4);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .exp-metric-card.highlight {
      background: var(--case-color-info-bg);
      border-color: var(--case-color-info);
    }
    .exp-metric-label {
      font-size: 0.8rem;
      color: var(--case-text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .exp-metric-value {
      font-family: var(--case-font-mono);
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--case-text-primary);
    }
    .exp-metric-value.huge {
      font-size: 2rem;
      color: var(--case-color-info);
    }
    .text-blue { color: var(--case-color-info); }
    .text-orange { color: var(--case-color-warning); }
    
    .exp-sliders {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }
    .exp-slider-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--case-font-mono);
      font-size: 0.8rem;
      color: var(--case-text-secondary);
    }
    .exp-slider-row input[type=range] {
      flex: 1;
      cursor: pointer;
      accent-color: var(--case-color-warning);
    }

    .exp-editor-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .exp-editor-layout {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .exp-editor-layout { grid-template-columns: 1fr; }
    }
    .exp-editor-wrapper {
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      overflow: hidden;
      background: var(--case-surface-1);
    }
    ::ng-deep .cm-editor {
      height: 320px;
      font-size: 14px;
      font-family: var(--case-font-mono);
    }

    .exp-test-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--case-surface-3);
      padding: 16px;
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
    }
    .exp-test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .exp-test-header h4 { margin: 0; color: var(--case-text-primary); }
    .exp-btn {
      padding: 8px 16px;
      border-radius: var(--case-radius);
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: var(--case-transition);
    }
    .exp-btn-primary {
      background: var(--case-accent);
      color: var(--case-text-on-accent);
    }
    .exp-btn-primary:hover {
      background: var(--case-accent-hover);
    }
    .exp-test-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .exp-test-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4px;
      background: var(--case-surface-4);
      border: 1px solid var(--case-border);
      border-radius: var(--case-radius-md);
      padding: 12px;
    }
    .exp-test-item.passed { border-left: 4px solid var(--case-color-success); }
    .exp-test-item.failed { border-left: 4px solid var(--case-color-error); }
    
    .exp-test-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .exp-test-info code {
      font-size: 0.85rem;
      background: var(--case-surface-1);
      color: var(--case-text-primary);
      padding: 2px 4px;
      border-radius: var(--case-radius);
    }
    .exp-test-expected {
      font-size: 0.8rem;
      color: var(--case-text-secondary);
    }
    .exp-test-result {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: var(--case-text-primary);
      background: var(--case-surface-5);
      padding: 4px 8px;
      border-radius: var(--case-radius);
      margin-top: 4px;
    }
    .exp-test-error {
      grid-column: 1 / -1;
      font-size: 0.85rem;
      color: var(--case-color-error);
      background: var(--case-color-error-bg);
      padding: 4px 8px;
      border-radius: var(--case-radius);
      margin-top: 4px;
      white-space: pre-wrap;
    }
    
    .text-green { color: var(--case-color-success); }
    .text-red { color: var(--case-color-error); }
    .text-gray { color: var(--case-text-muted); }

    .exp-success-alert {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--case-color-success-bg);
      color: var(--case-color-success);
      padding: 12px;
      border-radius: var(--case-radius-md);
      font-weight: 600;
    }
  `]
})
export class ExpCosineSimilarityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  
  private editorView!: EditorView;

  // VISUALIZER STATE
  vectorA = signal<[number, number, number]>([0.8, 0.6, 0]);
  vectorB = signal<[number, number, number]>([0.2, 0.9, 0.4]); 

  // Computations
  dotProduct = computed(() => {
    const a = this.vectorA();
    const b = this.vectorB();
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  });

  magA = computed(() => {
    const a = this.vectorA();
    return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
  });

  magB = computed(() => {
    const b = this.vectorB();
    return Math.sqrt(b[0]*b[0] + b[1]*b[1] + b[2]*b[2]);
  });

  cosineSim = computed(() => {
    if (this.magA() === 0 || this.magB() === 0) return 0;
    return this.dotProduct() / (this.magA() * this.magB());
  });

  angleDegrees = computed(() => {
    const cos = Math.max(-1, Math.min(1, this.cosineSim()));
    return Math.acos(cos) * (180 / Math.PI);
  });

  // THREE.JS STATE
  webglError = signal<boolean>(false);
  isCameraReset = signal<boolean>(true);
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private resizeObserver!: ResizeObserver;
  
  private arrowA!: THREE.ArrowHelper;
  private arrowB!: THREE.ArrowHelper;
  private arcLine: THREE.Line | null = null;
  private bgColor = 0x0A0A0A; // --case-surface-1

  // EDITOR & TESTS STATE
  initialCode = `function cosineSimilarity(a, b) {
  // a y b son arrays de números de N dimensiones
  // Ejemplo 3D: a[0] es X, a[1] es Y, a[2] es Z
  
  // 1. Calcula el producto punto (A • B)
  // Tip: itera sobre los elementos y suma a[i] * b[i]
  
  // 2. Calcula la magnitud (norma euclidiana) de a y de b
  
  // 3. Retorna la similitud coseno
  
  return 0; // Reemplaza esto
}`;

  tests = signal<TestCase[]>([
    { id: 't1', a: [1, 0, 0], b: [1, 0, 0], expected: 1, result: null, passed: null, error: null },
    { id: 't2', a: [1, 0, 0], b: [0, 1, 0], expected: 0, result: null, passed: null, error: null },
    { id: 't3', a: [1, 0, 0], b: [-1, 0, 0], expected: -1, result: null, passed: null, error: null }
  ]);

  allTestsPassed = computed(() => {
    const t = this.tests();
    return t.length > 0 && t.every(test => test.passed === true);
  });

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.initEditor();
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJs();
    });
  }

  ngOnDestroy() {
    if (this.editorView) {
      this.editorView.destroy();
    }
    this.cleanupThreeJs();
  }

  // --- THREE.JS LOGIC ---
  private initThreeJs() {
    try {
      const container = this.canvasContainer.nativeElement;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.bgColor);

      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.set(2, 1.5, 3);

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

      // Ambient + Grid
      this.scene.add(new THREE.AmbientLight(0xffffff, 1));
      
      const gridHelper = new THREE.GridHelper(4, 10, 0x333333, 0x1a1a1a);
      this.scene.add(gridHelper);

      const axesHelper = new THREE.AxesHelper(2);
      const axesColors = axesHelper.geometry.attributes['color'];
      for (let i = 0; i < axesColors.count; i++) {
        axesColors.setXYZ(i, axesColors.getX(i)*0.2, axesColors.getY(i)*0.2, axesColors.getZ(i)*0.2);
      }
      this.scene.add(axesHelper);

      // Create Arrows
      const origin = new THREE.Vector3(0, 0, 0);
      this.arrowA = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), origin, 1, 0x3b82f6, 0.15, 0.1);
      this.arrowB = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), origin, 1, 0xf59e0b, 0.15, 0.1);
      
      this.scene.add(this.arrowA);
      this.scene.add(this.arrowB);

      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(container);

      // Initial visual sync
      this.updateVisualState();
    } catch (e) {
      this.ngZone.run(() => this.webglError.set(true));
      console.error('WebGL init error:', e);
    }
  }

  private updateVisualState() {
    if (!this.scene) return;

    const origin = new THREE.Vector3(0,0,0);
    const dirA = new THREE.Vector3(...this.vectorA());
    const lenA = dirA.length();
    
    if (lenA > 0.01) {
      this.arrowA.setDirection(dirA.clone().normalize());
      this.arrowA.setLength(lenA, 0.15, 0.1);
      this.arrowA.visible = true;
    } else {
      this.arrowA.visible = false;
    }
    
    const dirB = new THREE.Vector3(...this.vectorB());
    const lenB = dirB.length();
    
    if (lenB > 0.01) {
      this.arrowB.setDirection(dirB.clone().normalize());
      this.arrowB.setLength(lenB, 0.15, 0.1);
      this.arrowB.visible = true;
    } else {
      this.arrowB.visible = false;
    }
    
    // Draw Arc
    if (this.arcLine) {
       this.scene.remove(this.arcLine);
       this.arcLine.geometry.dispose();
       (this.arcLine.material as THREE.Material).dispose();
       this.arcLine = null;
    }
    
    if (lenA > 0.01 && lenB > 0.01) {
       const dA = dirA.clone().normalize();
       const dB = dirB.clone().normalize();
       const angle = dA.angleTo(dB);
       
       if (angle > 0.02) {
         const points = [];
         const segments = 24;
         let axis = new THREE.Vector3().crossVectors(dA, dB).normalize();
         if (axis.lengthSq() < 0.0001) {
           // Vectors are almost opposite and collinear, pick arbitrary perpendicular
           axis = Math.abs(dA.x) < 0.9 ? new THREE.Vector3(1,0,0).cross(dA).normalize() : new THREE.Vector3(0,1,0).cross(dA).normalize();
         }
         
         const radius = Math.min(lenA, lenB) * 0.4;
         for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const currentAngle = t * angle;
            const pt = dA.clone().applyAxisAngle(axis, currentAngle).multiplyScalar(radius);
            points.push(pt);
         }
         const geom = new THREE.BufferGeometry().setFromPoints(points);
         const mat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
         this.arcLine = new THREE.Line(geom, mat);
         this.scene.add(this.arcLine);
       }
    }
    
    this.renderScene();
  }

  updateVectorB(axisIndex: number, event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    const current = [...this.vectorB()] as [number, number, number];
    current[axisIndex] = val;
    this.vectorB.set(current);
    
    // Al actualizar el signal en zona angular, manualmente refrescamos el visualizador fuera de Angular
    this.ngZone.runOutsideAngular(() => {
      this.updateVisualState();
    });
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
    
    if (this.arcLine) {
      this.arcLine.geometry.dispose();
      (this.arcLine.material as THREE.Material).dispose();
    }

    if (this.arrowA) {
      this.arrowA.line.geometry.dispose();
      (this.arrowA.line.material as THREE.Material).dispose();
      this.arrowA.cone.geometry.dispose();
      (this.arrowA.cone.material as THREE.Material).dispose();
    }
    
    if (this.arrowB) {
      this.arrowB.line.geometry.dispose();
      (this.arrowB.line.material as THREE.Material).dispose();
      this.arrowB.cone.geometry.dispose();
      (this.arrowB.cone.material as THREE.Material).dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }

  // --- EDITOR LOGIC ---
  private initEditor() {
    const customTheme = EditorView.theme({
      "&": { backgroundColor: "transparent", color: "var(--case-text-primary)" },
      ".cm-gutters": { backgroundColor: "var(--case-surface-2)", color: "var(--case-text-secondary)", border: "none" }
    }, {dark: true});

    const state = EditorState.create({
      doc: this.initialCode,
      extensions: [
        basicSetup,
        javascript(),
        customTheme
      ]
    });

    this.editorView = new EditorView({
      state,
      parent: this.editorContainer.nativeElement
    });
  }

  runCode() {
    const studentCode = this.editorView.state.doc.toString();
    
    try {
      const wrapper = new Function('a', 'b', `
        ${studentCode}
        if (typeof cosineSimilarity !== 'function') {
          throw new Error('La función cosineSimilarity no está definida.');
        }
        return cosineSimilarity(a, b);
      `);

      const currentTests = this.tests().map(test => {
        try {
          const res = wrapper(test.a, test.b);
          
          if (typeof res !== 'number' || isNaN(res)) {
            return { ...test, result: null, passed: false, error: 'La función debe retornar un número válido.' };
          }

          const isPassed = Math.abs(res - test.expected) < 0.001;
          return { ...test, result: res, passed: isPassed, error: null };
          
        } catch (err: any) {
          return { ...test, result: null, passed: false, error: err.message || 'Error de ejecución' };
        }
      });

      this.tests.set(currentTests);

    } catch (syntaxError: any) {
      const currentTests = this.tests().map(test => ({
        ...test,
        result: null,
        passed: false,
        error: `Error de sintaxis: ${syntaxError.message}`
      }));
      this.tests.set(currentTests);
    }
  }
}
