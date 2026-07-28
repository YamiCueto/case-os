import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InstallationGuide {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  estimatedTime: string;
  prerequisites: string[];
  steps: InstallationStep[];
  verification: string[];
  troubleshooting: TroubleshootingItem[];
  officialDocs: string;
  relatedClasses: string[];
}

interface InstallationStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  platform?: 'Windows' | 'macOS' | 'Linux' | 'Todos';
  notes?: string[];
}

interface TroubleshootingItem {
  problem: string;
  solution: string;
}

@Component({
  selector: 'app-installation-guides',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installation-guides.component.html',
  styleUrls: ['./installation-guides.component.css']
})
export class InstallationGuidesComponent {
  showGuides = false;
  expandedCategories: Set<string> = new Set();
  selectedGuide: InstallationGuide | null = null;

  guides: InstallationGuide[] = [
    {
      id: 'vscode',
      name: 'Visual Studio Code',
      icon: '💻',
      category: 'Editores',
      description: 'Editor de código principal del curso con extensiones esenciales',
      difficulty: 'Fácil',
      estimatedTime: '10-15 min',
      prerequisites: ['Ninguno'],
      steps: [
        {
          stepNumber: 1,
          title: 'Descargar VS Code',
          description: 'Descarga el instalador oficial desde la página de Visual Studio Code',
          commands: [],
          platform: 'Todos',
          notes: ['Disponible para Windows, macOS y Linux', 'Descarga la versión estable (Stable)']
        },
        {
          stepNumber: 2,
          title: 'Instalar VS Code',
          description: 'Ejecuta el instalador y sigue el asistente',
          platform: 'Windows',
          notes: [
            'Marca "Add to PATH" durante instalación',
            'Marca "Register Code as an editor for supported file types"',
            'Marca "Add Open with Code action to context menu"'
          ]
        },
        {
          stepNumber: 3,
          title: 'Instalar extensiones esenciales',
          description: 'Abre VS Code y ve a la pestaña Extensions (Ctrl+Shift+X)',
          commands: [],
          notes: [
            'GitHub Copilot (si tienes suscripción)',
            'Python (ms-python.python)',
            'Extension Pack for Java',
            'Angular Language Service',
            'Prettier - Code formatter',
            'GitLens'
          ]
        }
      ],
      verification: [
        'Abre terminal en VS Code (Ctrl+`)',
        'Ejecuta: code --version',
        'Verifica que las extensiones estén instaladas en Extensions tab'
      ],
      troubleshooting: [
        {
          problem: 'VS Code no abre desde terminal',
          solution: 'Reinstala agregando VS Code al PATH o usa "Shell Command: Install code command in PATH" desde Command Palette (Ctrl+Shift+P)'
        }
      ],
      officialDocs: 'https://code.visualstudio.com/docs/setup/setup-overview',
      relatedClasses: ['Todas las clases']
    },
    {
      id: 'python',
      name: 'Python 3.12+',
      icon: '🐍',
      category: 'Lenguajes',
      description: 'Lenguaje para microservicios RAG, FastAPI y bases de datos vectoriales',
      difficulty: 'Fácil',
      estimatedTime: '15-20 min',
      prerequisites: ['Ninguno'],
      steps: [
        {
          stepNumber: 1,
          title: 'Descargar Python',
          description: 'Descarga Python 3.12 o superior desde python.org',
          platform: 'Windows',
          notes: [
            'Descarga el instalador Windows x86-64 executable installer',
            'Versión recomendada: Python 3.12'
          ]
        },
        {
          stepNumber: 2,
          title: 'Instalar Python',
          description: 'Ejecuta el instalador con opciones importantes',
          platform: 'Windows',
          commands: [],
          notes: [
            '⚠️ IMPORTANTE: Marca "Add Python to PATH"',
            'Selecciona "Install Now" o "Customize installation"',
            'En Customize: marca "pip", "tcl/tk", "Python test suite"'
          ]
        },
        {
          stepNumber: 3,
          title: 'Verificar instalación',
          description: 'Abre CMD o PowerShell y verifica',
          commands: [
            'python --version',
            'pip --version'
          ],
          platform: 'Windows',
          notes: ['Deberías ver Python 3.12+ y pip instalados']
        },
        {
          stepNumber: 4,
          title: 'Actualizar pip',
          description: 'Actualiza el gestor de paquetes pip',
          commands: [
            'python -m pip install --upgrade pip'
          ],
          platform: 'Todos'
        },
        {
          stepNumber: 5,
          title: 'Instalar librerías RAG del curso',
          description: 'Instala las dependencias principales que usaremos para IA y FastAPI',
          commands: [
            'pip install fastapi uvicorn pydantic',
            'pip install langchain langchain-community chromadb pgvector',
            'pip install pytest requests'
          ],
          notes: [
            'FastAPI + Uvicorn: para APIs REST (Clase 10)',
            'ChromaDB / PgVector: para almacenamiento vectorial RAG (Clase 10)',
            'Pytest: para testing unitario'
          ]
        }
      ],
      verification: [
        'python --version → debe mostrar 3.12+',
        'pip list → debe listar paquetes instalados',
        'python -c "import fastapi; print(fastapi.__version__)"'
      ],
      troubleshooting: [
        {
          problem: '"python" no se reconoce como comando',
          solution: 'Agrega Python al PATH manualmente: Panel de Control → Sistema → Variables de entorno → PATH → Agregar ruta de instalación de Python (ej: C:\\Python312)'
        },
        {
          problem: 'pip install falla con SSL error',
          solution: 'Usa: pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org <paquete>'
        }
      ],
      officialDocs: 'https://docs.python.org/3/using/windows.html',
      relatedClasses: ['Clase 10', 'Clase 12']
    },
    {
      id: 'java',
      name: 'Java 21+ (OpenJDK)',
      icon: '☕',
      category: 'Lenguajes',
      description: 'JDK 21 LTS con Virtual Threads para desarrollo backend con Spring Boot 3.4+',
      difficulty: 'Intermedio',
      estimatedTime: '20-25 min',
      prerequisites: ['Ninguno'],
      steps: [
        {
          stepNumber: 1,
          title: 'Descargar OpenJDK',
          description: 'Descarga OpenJDK 21 LTS desde Adoptium (Eclipse Temurin)',
          platform: 'Windows',
          notes: [
            'Visita: https://adoptium.net/',
            'Selecciona: Java 21 LTS',
            'Elige: Windows x64 (.msi installer)'
          ]
        },
        {
          stepNumber: 2,
          title: 'Instalar JDK',
          description: 'Ejecuta el instalador MSI',
          platform: 'Windows',
          notes: [
            'Marca "Set JAVA_HOME variable"',
            'Marca "Add to PATH"',
            'Ruta por defecto: C:\\Program Files\\Eclipse Adoptium\\jdk-21...'
          ]
        },
        {
          stepNumber: 3,
          title: 'Verificar instalación',
          description: 'Abre CMD y verifica Java',
          commands: [
            'java -version',
            'javac -version',
            'echo %JAVA_HOME%'
          ],
          platform: 'Windows',
          notes: ['Deberías ver Java version 21.x.x']
        }
      ],
      verification: [
        'java -version → debe mostrar 21.x',
        'javac -version → debe mostrar 17.x',
        'echo %JAVA_HOME% → debe mostrar ruta JDK'
      ],
      troubleshooting: [
        {
          problem: 'JAVA_HOME no está configurado',
          solution: 'Variables de entorno → Nueva variable de sistema: JAVA_HOME = C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x'
        },
        {
          problem: 'Múltiples versiones de Java instaladas',
          solution: 'Asegúrate que JAVA_HOME apunte a Java 17 y que su bin esté primero en PATH'
        }
      ],
      officialDocs: 'https://adoptium.net/installation/',
      relatedClasses: ['Clase 6', 'Clase 9']
    },
    {
      id: 'nodejs',
      name: 'Node.js 18+ y npm',
      icon: '🟢',
      category: 'Lenguajes',
      description: 'Runtime de JavaScript para Angular y herramientas frontend',
      difficulty: 'Fácil',
      estimatedTime: '10-15 min',
      prerequisites: ['Ninguno'],
      steps: [
        {
          stepNumber: 1,
          title: 'Descargar Node.js',
          description: 'Descarga Node.js LTS desde nodejs.org',
          platform: 'Windows',
          notes: [
            'Descarga versión LTS (Long Term Support)',
            'Actualmente: Node.js 20.x LTS',
            'Incluye npm automáticamente'
          ]
        },
        {
          stepNumber: 2,
          title: 'Instalar Node.js',
          description: 'Ejecuta el instalador MSI',
          platform: 'Windows',
          notes: [
            'Acepta todas las opciones por defecto',
            'Marca "Automatically install necessary tools" (instala herramientas Python/Visual Studio Build Tools si es necesario)'
          ]
        },
        {
          stepNumber: 3,
          title: 'Verificar instalación',
          description: 'Abre CMD y verifica',
          commands: [
            'node --version',
            'npm --version'
          ],
          notes: ['Node debe ser 18+ y npm 9+']
        },
        {
          stepNumber: 4,
          title: 'Instalar Angular CLI',
          description: 'Instala la herramienta de línea de comandos de Angular',
          commands: [
            'npm install -g @angular/cli'
          ],
          notes: [
            'Flag -g instala globalmente',
            'Esto instala el comando "ng"',
            'Puede tomar 2-3 minutos'
          ]
        },
        {
          stepNumber: 5,
          title: 'Verificar Angular CLI',
          description: 'Verifica que Angular esté instalado',
          commands: [
            'ng version'
          ],
          notes: ['Deberías ver Angular CLI 18.x']
        }
      ],
      verification: [
        'node --version → 18+',
        'npm --version → 9+',
        'ng version → Angular CLI 18+'
      ],
      troubleshooting: [
        {
          problem: 'npm install -g falla con permisos',
          solution: 'Ejecuta CMD como Administrador y vuelve a intentar'
        },
        {
          problem: 'ng no se reconoce después de instalar',
          solution: 'Cierra y reabre terminal. Si persiste, verifica que npm global folder esté en PATH: npm config get prefix'
        }
      ],
      officialDocs: 'https://nodejs.org/en/docs/',
      relatedClasses: ['Clase 7', 'Clase 8', 'Clase 9', 'Clase 12']
    },
    {
      id: 'git',
      name: 'Git y GitHub',
      icon: '🔀',
      category: 'Herramientas',
      description: 'Control de versiones y colaboración',
      difficulty: 'Fácil',
      estimatedTime: '15 min',
      prerequisites: ['Ninguno'],
      steps: [
        {
          stepNumber: 1,
          title: 'Descargar Git',
          description: 'Descarga Git desde git-scm.com',
          platform: 'Windows',
          notes: ['Descarga Git for Windows (64-bit)']
        },
        {
          stepNumber: 2,
          title: 'Instalar Git',
          description: 'Ejecuta instalador con opciones recomendadas',
          platform: 'Windows',
          notes: [
            'Editor por defecto: Visual Studio Code',
            'PATH: "Git from the command line and also from 3rd-party software"',
            'Line endings: "Checkout Windows-style, commit Unix-style"'
          ]
        },
        {
          stepNumber: 3,
          title: 'Configurar Git',
          description: 'Configura tu identidad para commits',
          commands: [
            'git config --global user.name "Tu Nombre"',
            'git config --global user.email "tu@email.com"'
          ],
          notes: ['Usa el email de tu cuenta de GitHub']
        },
        {
          stepNumber: 4,
          title: 'Crear cuenta GitHub',
          description: 'Si no tienes cuenta, créala en github.com',
          notes: [
            'Visita: https://github.com/signup',
            'Elige un username profesional',
            'Verifica tu email'
          ]
        },
        {
          stepNumber: 5,
          title: 'Configurar SSH (opcional pero recomendado)',
          description: 'Genera clave SSH para autenticación sin contraseña',
          commands: [
            'ssh-keygen -t ed25519 -C "tu@email.com"',
            'cat ~/.ssh/id_ed25519.pub'
          ],
          notes: [
            'Copia la clave pública',
            'En GitHub: Settings → SSH Keys → New SSH Key → pega la clave'
          ]
        }
      ],
      verification: [
        'git --version',
        'git config --global --list',
        'ssh -T git@github.com (si configuraste SSH)'
      ],
      troubleshooting: [
        {
          problem: 'Permission denied al hacer push',
          solution: 'Configura SSH o usa Personal Access Token en lugar de contraseña'
        },
        {
          problem: 'Git Bash no abre',
          solution: 'Reinstala Git marcando "Add Git Bash Here context menu"'
        }
      ],
      officialDocs: 'https://git-scm.com/doc',
      relatedClasses: ['Todas las clases']
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      icon: '🤖',
      category: 'IA & Asistentes',
      description: 'IA asistente de código integrada en VS Code',
      difficulty: 'Fácil',
      estimatedTime: '10 min',
      prerequisites: ['Visual Studio Code instalado', 'Cuenta de GitHub'],
      steps: [
        {
          stepNumber: 1,
          title: 'Suscribirse a GitHub Copilot',
          description: 'Obtén suscripción de Copilot',
          notes: [
            'Visita: https://github.com/features/copilot',
            'Click en "Start free trial" o "Buy now"',
            'Costo: $10/mes o $100/año',
            'GRATIS para: Estudiantes verificados, profesores, maintainers de proyectos open source populares'
          ]
        },
        {
          stepNumber: 2,
          title: 'Instalar extensión en VS Code',
          description: 'Abre VS Code → Extensions (Ctrl+Shift+X)',
          notes: [
            'Busca: "GitHub Copilot"',
            'Click en Install',
            'También instala: "GitHub Copilot Chat" (para chat integrado)'
          ]
        },
        {
          stepNumber: 3,
          title: 'Autenticarse con GitHub',
          description: 'La extensión pedirá autenticación',
          notes: [
            'Click en "Sign in to GitHub"',
            'Se abrirá navegador',
            'Autoriza VS Code',
            'Vuelve a VS Code'
          ]
        },
        {
          stepNumber: 4,
          title: 'Probar Copilot',
          description: 'Crea archivo test.py y escribe comentario',
          commands: [
            '# Función que calcula el factorial de un número'
          ],
          notes: [
            'Presiona Enter',
            'Copilot sugerirá código en gris',
            'Presiona Tab para aceptar',
            'Alt+] para ver siguiente sugerencia'
          ]
        }
      ],
      verification: [
        'Icono de Copilot en barra de estado (abajo derecha)',
        'Status: Ready',
        'Probar sugerencias escribiendo comentarios'
      ],
      troubleshooting: [
        {
          problem: 'Copilot no muestra sugerencias',
          solution: 'Verifica que el icono esté activo. Click derecho → Check status. Asegúrate que tu suscripción esté activa en github.com/settings/copilot'
        },
        {
          problem: 'Sugerencias muy lentas',
          solution: 'Verifica conexión a internet. Copilot requiere conectividad constante.'
        }
      ],
      officialDocs: 'https://docs.github.com/en/copilot',
      relatedClasses: ['Todas las clases (recomendado)']
    }
  ];

  get categories(): string[] {
    return [...new Set(this.guides.map(g => g.category))];
  }

  getGuidesByCategory(category: string): InstallationGuide[] {
    return this.guides.filter(g => g.category === category);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Editores': 'from-slate-500 to-slate-600',
      'IA & Asistentes': 'from-violet-500 to-purple-600',
      'Lenguajes': 'from-blue-500 to-cyan-600',
      'Herramientas': 'from-green-500 to-emerald-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  }

  getDifficultyColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      'Fácil': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  }

  toggleGuides(): void {
    this.showGuides = !this.showGuides;
    if (!this.showGuides) {
      this.selectedGuide = null;
    }
  }

  toggleCategory(category: string, event: Event): void {
    event.stopPropagation();
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.clear();
      this.expandedCategories.add(category);
    }
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  selectGuide(guide: InstallationGuide, event: Event): void {
    event.stopPropagation();
    this.selectedGuide = guide;
  }

  closeGuideDetail(): void {
    this.selectedGuide = null;
  }

  expandAllCategories(): void {
    this.categories.forEach(cat => this.expandedCategories.add(cat));
  }

  collapseAllCategories(): void {
    this.expandedCategories.clear();
  }
}
