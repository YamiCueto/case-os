import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase11-dev-lambda-serverless',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase11-dev-lambda-serverless.component.html',
  styleUrls: ['./clase11-dev-lambda-serverless.component.css', '../shared-presentation.css']
})
export class Clase11DevLambdaServerlessComponent {
  currentSlide = 0;

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'signals-architecture' },
    { type: 'component-migration' },
    { type: 'reactive-forms' },
    { type: 'challenge' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  titleSlide = {
    icon: '🖥️',
    title: 'Angular 22: Migración de UI Legacy a Signals',
    subtitle: 'De Formularios VB6 y WinForms .NET a Componentes Angular Standalone',
    description: 'Aprende a migrar pantallas legacy (VB6 Forms, .NET WinForms, JSP) a componentes Angular 22 modernos usando Signals, formularios reactivos y GitHub Copilot como asistente de traducción.'
  };

  context = {
    title: '¿Por qué migrar la UI a Angular 22?',
    scenario: {
      icon: '🖼️',
      text: 'Los formularios VB6 y WinForms .NET son ventanas de escritorio que mezclan UI con lógica de negocio. Angular 22 los reemplaza con componentes standalone, reactivos y que consumen la REST API migrada en clases anteriores — manteniendo la misma experiencia para el usuario.'
    },
    legacyUiProblems: [
      {
        icon: '🟡',
        system: 'VB6 Forms',
        problems: [
          'UI + lógica de negocio en el mismo Form',
          'Validaciones en eventos (Change, LostFocus, Click)',
          'Binding manual: txtNombre.Text = rs("Nombre")',
          'Sin separación de responsabilidades'
        ]
      },
      {
        icon: '🔵',
        system: '.NET WinForms',
        problems: [
          'DataGridView con binding directo a DataSet',
          'Lógica en code-behind (Form1.cs)',
          'Validaciones en Validating events',
          'Dependencia fuerte de .NET Framework'
        ]
      },
      {
        icon: '🟠',
        system: 'COBIS UI',
        problems: [
          'Pantallas 4GL propietarias del sistema COBIS',
          'Parámetros de pantalla codificados numéricamente',
          'Sin posibilidad de personalización visual',
          'Atadas al servidor COBIS'
        ]
      }
    ],
    angularAdvantages: [
      { icon: '⚡', title: 'Signals (Angular 22)', description: 'Reactividad granular — la UI se actualiza solo en lo que cambió, sin Zone.js' },
      { icon: '🧩', title: 'Standalone Components', description: 'Sin NgModule — cada componente es independiente, fácil de generar con Copilot' },
      { icon: '📝', title: 'Reactive Forms + Validators', description: 'Reemplaza eventos VB6 (Change, LostFocus) con validators y valueChanges reactivos' },
      { icon: '🔗', title: 'HttpClient tipado', description: 'Consume la REST API Java directamente — reemplaza el binding a DataSet de .NET' }
    ]
  };

  signalsArchitecture = {
    title: 'Signals vs Variables VB6/.NET — Comparativa',
    comparisons: [
      {
        legacy: `' VB6: actualización manual
Private Sub ActualizarGrid()
    Dim i As Integer
    grdClientes.Rows = 0
    For i = 0 To UBound(arrClientes)
        grdClientes.AddItem arrClientes(i).nombre
    Next i
End Sub

' Se llama manualmente cada vez que cambia el array`,
        legacyLabel: 'VB6',
        modern: `// Angular 22: Signals — actualización automática
@Component({
  template: \`
    @for (c of clientes(); track c.id) {
      <tr><td>{{ c.nombre }}</td></tr>
    }
  \`
})
export class ClientesComponent {
  clientes = signal<Cliente[]>([]);

  // Al llamar clientes.set([...]), la tabla se actualiza sola
  cargar() {
    this.http.get<Cliente[]>('/api/clientes')
      .subscribe(data => this.clientes.set(data));
  }
}`,
        modernLabel: 'Angular 22 + Signals'
      },
      {
        legacy: `// .NET WinForms: DataGridView con DataSet
private void CargarClientes()
{
    var adapter = new SqlDataAdapter(
        "SELECT * FROM Clientes", conexion);
    var ds = new DataSet();
    adapter.Fill(ds, "Clientes");
    dataGridView1.DataSource = ds.Tables["Clientes"];
}

// Binding directo — mezcla UI con acceso a datos`,
        legacyLabel: '.NET WinForms',
        modern: `// Angular 22: Service + Signal — separación clara
@Injectable({ providedIn: 'root' })
export class ClienteService {
  clientes = signal<Cliente[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  cargar(pagina = 0) {
    this.cargando.set(true);
    this.http.get<Page<Cliente>>(\`/api/v1/clientes?page=\${pagina}\`)
      .subscribe({
        next: r => { this.clientes.set(r.content); this.cargando.set(false); },
        error: e => { this.error.set(e.message); this.cargando.set(false); }
      });
  }
}`,
        modernLabel: 'Angular 22 + Service Signal'
      }
    ]
  };

  componentMigration = {
    title: 'Proceso de Migración de Pantallas con Copilot',
    steps: [
      {
        number: 1,
        title: 'Describir la pantalla VB6/.NET a Copilot',
        description: 'Pegar el código del Form como contexto — Copilot lo analiza y propone el componente Angular',
        promptExample: `ROL: Eres experto Angular 22 migrando formularios VB6 a componentes standalone.
CONTEXTO: Este formulario VB6 tiene:
- txtNombre (TextBox) — obligatorio, max 100 chars
- cboTipoDoc (ComboBox) — valores: CC, CE, NIT, PA
- txtDocumento (TextBox) — pattern numérico 8-11 dígitos
- cmdGuardar (Button) — llama a GuardarCliente()
- cmdCancelar (Button) — cierra el form
TAREA: Genera componente Angular 22 standalone con:
1. Reactive Form equivalente con validators
2. Signals para estado (cargando, error)
3. Template con @if/@for (no *ngIf)
4. Método guardar() que llame POST /api/v1/clientes
RESTRICCIONES: Angular 22, standalone, sin NgModule, TypeScript strict`
      },
      {
        number: 2,
        title: 'Generar el componente con Copilot',
        description: 'Copilot genera el .ts + template. Revisar que los campos y validaciones sean equivalentes al form legacy',
        promptExample: 'Ahora genera el template HTML con Material Design o CSS puro — campos del form con labels claros y mensajes de error reactivos para cada validator'
      },
      {
        number: 3,
        title: 'Conectar con la REST API Java',
        description: 'Reemplazar el acceso directo a BD del VB6 por llamadas al endpoint Spring Boot',
        promptExample: 'Agrega ClienteService que use HttpClient para GET /api/v1/clientes (paginado) y POST /api/v1/clientes. Tipar con los records Java (ClienteRequest, ClienteResponse)'
      },
      {
        number: 4,
        title: 'Agregar ruta en app.routes.ts',
        description: 'Registrar el nuevo componente en el router con lazy loading',
        promptExample: 'Agrega la ruta /clientes con loadComponent para el nuevo ClientesComponent — sin NgModule, solo el componente standalone'
      }
    ]
  };

  reactiveForms = {
    title: 'Formularios Reactivos — Reemplazando Eventos VB6',
    equivalences: [
      { vb6: 'txtNombre.Text = ""  (limpiar campo)', angular: 'form.get("nombre")?.reset()' },
      { vb6: 'If txtNombre.Text = "" Then  (validar)', angular: 'Validators.required en FormControl' },
      { vb6: 'txtNombre_LostFocus()  (evento blur)', angular: 'valueChanges + | debounceTime' },
      { vb6: 'cmdGuardar_Click()  (submit)', angular: '(ngSubmit)="guardar()"' },
      { vb6: 'MsgBox "Error: " & err.Description', angular: 'error = signal("Error: " + e.message)' },
      { vb6: 'cboTipo.AddItem "CC" : cboTipo.AddItem "CE"', angular: 'options = [{value: "CC"}, {value: "CE"}]' }
    ],
    codeExample: `// Angular 22 — Equivalente al formulario VB6 de apertura de cuenta
@Component({
  selector: 'app-apertura-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="guardar()">

      <label>Nombre *</label>
      <input formControlName="nombre" placeholder="Ej: María García">
      @if (form.get('nombre')?.invalid && form.get('nombre')?.touched) {
        <span class="error">Nombre es obligatorio (máx 100 caracteres)</span>
      }

      <label>Tipo Documento *</label>
      <select formControlName="tipoDocumento">
        @for (opt of tiposDocumento; track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>

      <label>Documento *</label>
      <input formControlName="documento" pattern="[0-9]{8,11}">
      @if (form.get('documento')?.errors?.['pattern']) {
        <span class="error">Documento: 8 a 11 dígitos numéricos</span>
      }

      <button type="submit" [disabled]="form.invalid || guardando()">
        {{ guardando() ? 'Guardando...' : 'Guardar' }}
      </button>

      @if (errorMsg()) {
        <div class="error-global">{{ errorMsg() }}</div>
      }
    </form>
  \`
})
export class AperturaCuentaComponent {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  guardando = signal(false);
  errorMsg = signal<string | null>(null);

  tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PA', label: 'Pasaporte' }
  ];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    tipoDocumento: ['CC', Validators.required],
    documento: ['', [Validators.required, Validators.pattern(/^[0-9]{8,11}$/)]]
  });

  guardar() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.errorMsg.set(null);

    this.clienteService.crear(this.form.value as ClienteRequest).subscribe({
      next: () => { this.form.reset(); this.guardando.set(false); },
      error: e => { this.errorMsg.set(e.error?.message); this.guardando.set(false); }
    });
  }
}`
  };

  challenge = {
    title: 'Reto: Migrar Pantalla VB6 de Consulta de Clientes',
    description: 'Tienes el código VB6 de un formulario de consulta y gestión de clientes. Migrarlo a un componente Angular 22 standalone que consuma la REST API Java construida en clases anteriores.',
    legacyVb6Form: `' Form: frmConsultaClientes.frm
Private Sub Form_Load()
    Call CargarClientes
End Sub

Private Sub CargarClientes()
    Dim rs As ADODB.Recordset
    sql = "SELECT CodCliente, Nombre, NumDoc, Estado FROM Clientes WHERE Estado = 'A'"
    Set rs = cn.Execute(sql)

    grdClientes.Rows = 1  ' limpiar grid
    Do While Not rs.EOF
        grdClientes.AddItem rs("CodCliente") & Chr(9) & rs("Nombre") & _
                            Chr(9) & rs("NumDoc") & Chr(9) & rs("Estado")
        rs.MoveNext
    Loop
End Sub

Private Sub txtBuscar_Change()
    ' Filtrar en memoria — sin paginación
    Dim i As Integer
    For i = 1 To grdClientes.Rows - 1
        If InStr(LCase(grdClientes.TextMatrix(i, 1)), LCase(txtBuscar.Text)) = 0 Then
            grdClientes.RowHeight(i) = 0  ' ocultar fila
        End If
    Next i
End Sub

Private Sub cmdInactivar_Click()
    If grdClientes.RowSel < 1 Then
        MsgBox "Seleccione un cliente"
        Exit Sub
    End If
    Dim cod As Long
    cod = CLng(grdClientes.TextMatrix(grdClientes.RowSel, 0))
    cn.Execute "UPDATE Clientes SET Estado='I' WHERE CodCliente=" & cod
    Call CargarClientes
End Sub`,
    requirements: [
      'Componente ClientesListaComponent standalone con: signal clientes[], signal cargando, signal error',
      'Tabla con @for (no *ngFor) — columnas: código, nombre, documento, estado',
      'Input de búsqueda con computed signal clientesFiltrados() que filtre por nombre/documento',
      'Botón "Inactivar" por fila — llama PATCH /api/v1/clientes/{id}/inactivar',
      'Paginación: señales paginaActual, totalPaginas — botones anterior/siguiente',
      'ClienteService con HttpClient: cargar(pagina), inactivar(id) — con manejo de errores en signals',
      'Prompt completo de Copilot: incluir el código VB6 original como contexto'
    ],
    promptBase: [
      'ROL: Experto Angular 22 migrando formularios VB6 a componentes standalone con Signals',
      'CONTEXTO: Este formulario VB6 frmConsultaClientes tiene: grid de clientes, búsqueda por texto, botón inactivar. [PEGAR CÓDIGO VB6]',
      'TAREA: Genera ClientesListaComponent standalone con signals, @for, búsqueda con computed signal y paginación',
      'RESTRICCIONES: Angular 22, sin NgModule, sin *ngFor (usar @for), signals para estado, HttpClient tipado con los records de la API Java'
    ],
    timeEstimate: '50 minutos'
  };

  bestPractices = [
    {
      category: 'Signals en Angular 22',
      practices: [
        'signal() para estado mutable (datos, cargando, error)',
        'computed() para datos derivados (filtros, totales, paginación)',
        'effect() con moderación — preferir computed() cuando sea posible',
        'Nunca mutar un signal con .update() dentro de otro computed()'
      ]
    },
    {
      category: 'Estructura de Componentes',
      practices: [
        'Un componente por pantalla VB6 — no intentar migrar todo en uno',
        'Separar lista (ClientesListaComponent) de formulario (ClienteFormComponent)',
        'El Service tiene los signals — los componentes los inyectan con inject()',
        'Lazy loading en app.routes.ts — no importar directamente en AppComponent'
      ]
    },
    {
      category: 'Migración con Copilot',
      practices: [
        'Siempre pegar el código VB6/WinForms original en el contexto del prompt',
        'Especificar "Angular 22, usar @for y @if — no *ngFor ni *ngIf"',
        'Pedir "signals para estado — no Observable ni Subject"',
        'Generar primero el .ts, luego el template en un segundo prompt'
      ]
    },
    {
      category: 'Conexión con REST API Java',
      practices: [
        'Definir interfaces TypeScript que coincidan con los Java records del backend',
        'Centralizar la URL base en environment.ts — no hardcodear en servicios',
        'HttpErrorResponse: capturar y mapear a signal error con mensaje legible',
        'Agregar proxy.conf.json para evitar CORS en desarrollo local'
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
