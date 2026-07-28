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

  // Title Slide
  titleSlide = {
    icon: '⚡',
    title: 'Microservicio Python con FastAPI',
    subtitle: 'API REST de Alto Performance',
    description: 'Aprende a crear APIs modernas con Python usando FastAPI, Pydantic y async/await para máximo rendimiento.'
  };

  // Context
  context = {
    title: 'Contexto: ¿Por qué FastAPI?',
    scenario: {
      icon: '🚀',
      text: 'Necesitamos una API para procesamiento de scoring crediticio con cálculos intensivos y alta concurrencia.'
    },
    reasons: [
      {
        icon: '⚡',
        title: 'Performance',
        description: 'FastAPI es uno de los frameworks más rápidos de Python, comparable con Node.js y Go',
        color: 'blue'
      },
      {
        icon: '📝',
        title: 'Type Safety',
        description: 'Pydantic proporciona validación automática y documentación basada en tipos Python',
        color: 'green'
      },
      {
        icon: '🔄',
        title: 'Async/Await',
        description: 'Soporte nativo para operaciones asíncronas, ideal para I/O intensivo',
        color: 'purple'
      },
      {
        icon: '📚',
        title: 'Auto Documentation',
        description: 'Swagger UI y ReDoc generados automáticamente desde el código',
        color: 'orange'
      }
    ]
  };

  // Setup
  setup = {
    title: 'Instalación y Setup',
    installation: {
      titulo: 'Instalación de Dependencias',
      code: `# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\\Scripts\\activate

# Activar entorno (Linux/Mac)
source venv/bin/activate

# Instalar FastAPI y dependencias
pip install fastapi uvicorn[standard] pydantic sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart

# Crear requirements.txt
pip freeze > requirements.txt`
    },
    structure: {
      titulo: 'Estructura del Proyecto',
      code: `scoring-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point FastAPI
│   ├── models/
│   │   ├── __init__.py
│   │   ├── solicitud.py     # SQLAlchemy models
│   │   └── scoring.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── solicitud.py     # Pydantic schemas
│   │   └── scoring.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── scoring_service.py  # Business logic
│   ├── routers/
│   │   ├── __init__.py
│   │   └── scoring.py       # API endpoints
│   └── database.py          # DB connection
├── tests/
│   ├── __init__.py
│   └── test_scoring.py
├── requirements.txt
└── README.md`
    },
    runCommand: {
      titulo: 'Ejecutar el Servidor',
      code: `# Modo desarrollo con auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Acceder a la documentación
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc`
    }
  };

  // Pydantic Models
  pydanticModels = {
    title: 'Pydantic Schemas para Validación',
    description: 'Pydantic proporciona validación de datos automática y generación de documentación',
    input: {
      titulo: 'Schema de Entrada',
      code: `# app/schemas/solicitud.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from decimal import Decimal
from datetime import date

class SolicitudPrestamoInput(BaseModel):
    """Schema para crear solicitud de préstamo"""

    cliente_id: int = Field(..., description="ID del cliente", gt=0)
    monto_solicitado: Decimal = Field(
        ...,
        description="Monto del préstamo solicitado",
        gt=0,
        le=1000000
    )
    plazo_meses: int = Field(
        ...,
        description="Plazo en meses",
        ge=6,
        le=60
    )
    ingresos_mensuales: Decimal = Field(
        ...,
        description="Ingresos mensuales del cliente",
        gt=0
    )
    deudas_actuales: Decimal = Field(
        default=0,
        description="Total de deudas actuales",
        ge=0
    )
    antiguedad_laboral_meses: int = Field(
        ...,
        description="Meses en empleo actual",
        ge=0
    )
    historial_crediticio: str = Field(
        ...,
        description="Historial: EXCELENTE, BUENO, REGULAR, MALO",
        regex="^(EXCELENTE|BUENO|REGULAR|MALO)$"
    )

    @validator('plazo_meses')
    def validar_plazo(cls, v, values):
        """Validar que el plazo sea múltiplo de 6"""
        if v % 6 != 0:
            raise ValueError('El plazo debe ser múltiplo de 6 meses')
        return v

    @validator('monto_solicitado')
    def validar_monto_vs_ingresos(cls, v, values):
        """Validar que la cuota no supere 40% de ingresos"""
        if 'ingresos_mensuales' in values and 'plazo_meses' in values:
            cuota_estimada = v / values['plazo_meses']
            if cuota_estimada > values['ingresos_mensuales'] * Decimal('0.4'):
                raise ValueError('La cuota estimada supera 40% de ingresos')
        return v

    class Config:
        schema_extra = {
            "example": {
                "cliente_id": 12345,
                "monto_solicitado": 50000,
                "plazo_meses": 24,
                "ingresos_mensuales": 8000,
                "deudas_actuales": 15000,
                "antiguedad_laboral_meses": 36,
                "historial_crediticio": "BUENO"
            }
        }`
    },
    output: {
      titulo: 'Schema de Salida',
      code: `# app/schemas/scoring.py
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

class NivelRiesgo(str, Enum):
    """Niveles de riesgo crediticio"""
    BAJO = "BAJO"
    MEDIO = "MEDIO"
    ALTO = "ALTO"
    MUY_ALTO = "MUY_ALTO"

class DecisionCredito(str, Enum):
    """Decisión del sistema"""
    APROBADO = "APROBADO"
    REVISION_MANUAL = "REVISION_MANUAL"
    RECHAZADO = "RECHAZADO"

class ScoringResultOutput(BaseModel):
    """Schema de respuesta con resultado del scoring"""

    solicitud_id: int = Field(..., description="ID de la solicitud")
    score: int = Field(
        ...,
        description="Score crediticio (300-850)",
        ge=300,
        le=850
    )
    nivel_riesgo: NivelRiesgo = Field(..., description="Nivel de riesgo")
    decision: DecisionCredito = Field(..., description="Decisión automática")
    monto_aprobado: Decimal = Field(
        ...,
        description="Monto máximo aprobado",
        ge=0
    )
    tasa_interes: Decimal = Field(
        ...,
        description="Tasa de interés anual (%)",
        ge=0
    )
    observaciones: List[str] = Field(
        default=[],
        description="Observaciones del análisis"
    )
    fecha_evaluacion: datetime = Field(
        default_factory=datetime.now,
        description="Fecha de evaluación"
    )

    # Detalles del cálculo
    detalles: Optional[dict] = Field(
        None,
        description="Detalles del cálculo de scoring"
    )

    class Config:
        schema_extra = {
            "example": {
                "solicitud_id": 1,
                "score": 720,
                "nivel_riesgo": "MEDIO",
                "decision": "APROBADO",
                "monto_aprobado": 45000,
                "tasa_interes": 18.5,
                "observaciones": [
                    "Score dentro del rango aceptable",
                    "Relación deuda/ingreso: 35%"
                ],
                "fecha_evaluacion": "2024-01-15T10:30:00",
                "detalles": {
                    "puntos_ingresos": 150,
                    "puntos_historial": 200,
                    "puntos_deuda": 180,
                    "puntos_estabilidad": 190
                }
            }
        }`
    }
  };

  // Service Layer
  serviceLayer = {
    title: 'Service Layer: Lógica de Negocio',
    description: 'Implementación del algoritmo de scoring y reglas de decisión',
    algorithm: {
      titulo: 'Algoritmo de Scoring',
      code: `# app/services/scoring_service.py
from decimal import Decimal
from typing import Tuple, List, Dict
from app.schemas.solicitud import SolicitudPrestamoInput
from app.schemas.scoring import (
    ScoringResultOutput,
    NivelRiesgo,
    DecisionCredito
)

class ScoringService:
    """Servicio de cálculo de scoring crediticio"""

    # Constantes para el cálculo
    SCORE_MIN = 300
    SCORE_MAX = 850

    # Umbrales de decisión
    SCORE_APROBACION_DIRECTA = 700
    SCORE_REVISION_MANUAL = 600

    # Tasas de interés por nivel de riesgo
    TASAS_INTERES = {
        NivelRiesgo.BAJO: Decimal("12.5"),
        NivelRiesgo.MEDIO: Decimal("18.5"),
        NivelRiesgo.ALTO: Decimal("24.5"),
        NivelRiesgo.MUY_ALTO: Decimal("30.0")
    }

    def calcular_scoring(
        self,
        solicitud: SolicitudPrestamoInput
    ) -> ScoringResultOutput:
        """
        Calcula el scoring crediticio basado en múltiples factores

        Args:
            solicitud: Datos de la solicitud de préstamo

        Returns:
            ScoringResultOutput con resultado del análisis
        """
        # Calcular componentes del score
        puntos_ingresos = self._calcular_puntos_ingresos(
            solicitud.ingresos_mensuales
        )
        puntos_historial = self._calcular_puntos_historial(
            solicitud.historial_crediticio
        )
        puntos_deuda = self._calcular_puntos_deuda(
            solicitud.ingresos_mensuales,
            solicitud.deudas_actuales
        )
        puntos_estabilidad = self._calcular_puntos_estabilidad(
            solicitud.antiguedad_laboral_meses
        )

        # Score total (suma ponderada)
        score = int(
            puntos_ingresos * 0.25 +
            puntos_historial * 0.35 +
            puntos_deuda * 0.25 +
            puntos_estabilidad * 0.15
        )

        # Ajustar al rango permitido
        score = max(self.SCORE_MIN, min(self.SCORE_MAX, score))

        # Determinar nivel de riesgo
        nivel_riesgo = self._determinar_nivel_riesgo(score)

        # Tomar decisión
        decision = self._tomar_decision(score, solicitud)

        # Calcular monto aprobado
        monto_aprobado = self._calcular_monto_aprobado(
            solicitud.monto_solicitado,
            score,
            solicitud.ingresos_mensuales
        )

        # Tasa de interés según riesgo
        tasa_interes = self.TASAS_INTERES[nivel_riesgo]

        # Generar observaciones
        observaciones = self._generar_observaciones(
            solicitud,
            score,
            nivel_riesgo
        )

        return ScoringResultOutput(
            solicitud_id=0,  # Se asignará al guardar
            score=score,
            nivel_riesgo=nivel_riesgo,
            decision=decision,
            monto_aprobado=monto_aprobado,
            tasa_interes=tasa_interes,
            observaciones=observaciones,
            detalles={
                "puntos_ingresos": puntos_ingresos,
                "puntos_historial": puntos_historial,
                "puntos_deuda": puntos_deuda,
                "puntos_estabilidad": puntos_estabilidad
            }
        )`
    },
    helpers: {
      titulo: 'Métodos Helper del Algoritmo',
      code: `    def _calcular_puntos_ingresos(
        self,
        ingresos: Decimal
    ) -> int:
        """Calcula puntos basados en nivel de ingresos"""
        if ingresos >= 15000:
            return 250
        elif ingresos >= 10000:
            return 200
        elif ingresos >= 7000:
            return 150
        elif ingresos >= 5000:
            return 100
        else:
            return 50

    def _calcular_puntos_historial(self, historial: str) -> int:
        """Calcula puntos por historial crediticio"""
        puntos_historial = {
            "EXCELENTE": 250,
            "BUENO": 200,
            "REGULAR": 120,
            "MALO": 50
        }
        return puntos_historial.get(historial, 0)

    def _calcular_puntos_deuda(
        self,
        ingresos: Decimal,
        deudas: Decimal
    ) -> int:
        """Calcula puntos por relación deuda/ingreso"""
        if ingresos == 0:
            return 0

        ratio_deuda = float(deudas / ingresos)

        if ratio_deuda <= 0.2:
            return 250
        elif ratio_deuda <= 0.35:
            return 200
        elif ratio_deuda <= 0.5:
            return 150
        elif ratio_deuda <= 0.7:
            return 100
        else:
            return 50

    def _calcular_puntos_estabilidad(
        self,
        meses_empleo: int
    ) -> int:
        """Calcula puntos por estabilidad laboral"""
        if meses_empleo >= 60:
            return 250
        elif meses_empleo >= 36:
            return 200
        elif meses_empleo >= 24:
            return 150
        elif meses_empleo >= 12:
            return 100
        else:
            return 50

    def _determinar_nivel_riesgo(self, score: int) -> NivelRiesgo:
        """Determina nivel de riesgo según score"""
        if score >= 750:
            return NivelRiesgo.BAJO
        elif score >= 650:
            return NivelRiesgo.MEDIO
        elif score >= 550:
            return NivelRiesgo.ALTO
        else:
            return NivelRiesgo.MUY_ALTO

    def _tomar_decision(
        self,
        score: int,
        solicitud: SolicitudPrestamoInput
    ) -> DecisionCredito:
        """Toma decisión de crédito basada en score y otros factores"""
        # Rechazo automático
        if score < self.SCORE_REVISION_MANUAL:
            return DecisionCredito.RECHAZADO

        # Aprobación automática
        if score >= self.SCORE_APROBACION_DIRECTA:
            ratio_deuda = float(
                solicitud.deudas_actuales /
                solicitud.ingresos_mensuales
            )
            if ratio_deuda <= 0.4:
                return DecisionCredito.APROBADO

        # Revisión manual
        return DecisionCredito.REVISION_MANUAL`
    }
  };

  // API Endpoints
  apiEndpoints = {
    title: 'API Endpoints con FastAPI',
    description: 'Definición de rutas REST con documentación automática',
    mainFile: {
      titulo: 'Main Application',
      code: `# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scoring

app = FastAPI(
    title="Scoring Crediticio API",
    description="API para evaluación de scoring crediticio en tiempo real",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para frontend Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(
    scoring.router,
    prefix="/api/scoring",
    tags=["Scoring Crediticio"]
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Scoring API is running",
        "docs": "/docs"
    }`
    },
    router: {
      titulo: 'Router con Endpoints',
      code: `# app/routers/scoring.py
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.solicitud import SolicitudPrestamoInput
from app.schemas.scoring import ScoringResultOutput
from app.services.scoring_service import ScoringService
from loguru import logger

router = APIRouter()
scoring_service = ScoringService()

@router.post(
    "/calcular",
    response_model=ScoringResultOutput,
    status_code=status.HTTP_201_CREATED,
    summary="Calcular Scoring Crediticio",
    description="Evalúa una solicitud de préstamo y retorna scoring, nivel de riesgo y decisión"
)
async def calcular_scoring(
    solicitud: SolicitudPrestamoInput
):
    """
    Calcula el scoring crediticio para una solicitud de préstamo

    - **cliente_id**: ID del cliente solicitante
    - **monto_solicitado**: Monto del préstamo (min: 1, max: 1,000,000)
    - **plazo_meses**: Plazo en meses (múltiplo de 6, entre 6 y 60)
    - **ingresos_mensuales**: Ingresos mensuales del cliente
    - **deudas_actuales**: Total de deudas actuales
    - **antiguedad_laboral_meses**: Meses en empleo actual
    - **historial_crediticio**: EXCELENTE | BUENO | REGULAR | MALO
    """
    try:
        logger.info(f"Calculando scoring para cliente {solicitud.cliente_id}")

        # Calcular scoring
        resultado = scoring_service.calcular_scoring(solicitud)

        # Aquí se guardaría en base de datos
        # resultado.solicitud_id = db_solicitud.id

        logger.info(
            f"Scoring calculado: {resultado.score}, "
            f"Decisión: {resultado.decision}"
        )

        return resultado

    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error al calcular scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al calcular scoring"
        )

@router.get(
    "/{solicitud_id}",
    response_model=ScoringResultOutput,
    summary="Consultar Resultado de Scoring"
)
async def obtener_scoring(solicitud_id: int):
    """Obtiene el resultado de scoring de una solicitud específica"""
    # Aquí se consultaría la base de datos
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Endpoint en desarrollo"
    )`
    }
  };

  // Testing
  testing = {
    title: 'Testing con Pytest',
    description: 'Suite de tests unitarios y de integración',
    unitTests: {
      titulo: 'Tests Unitarios del Servicio',
      code: `# tests/test_scoring_service.py
import pytest
from decimal import Decimal
from app.services.scoring_service import ScoringService
from app.schemas.solicitud import SolicitudPrestamoInput
from app.schemas.scoring import NivelRiesgo, DecisionCredito

class TestScoringService:
    """Tests del servicio de scoring"""

    @pytest.fixture
    def scoring_service(self):
        """Fixture del servicio"""
        return ScoringService()

    @pytest.fixture
    def solicitud_excelente(self):
        """Solicitud con perfil excelente"""
        return SolicitudPrestamoInput(
            cliente_id=1,
            monto_solicitado=Decimal("50000"),
            plazo_meses=24,
            ingresos_mensuales=Decimal("15000"),
            deudas_actuales=Decimal("5000"),
            antiguedad_laboral_meses=60,
            historial_crediticio="EXCELENTE"
        )

    def test_scoring_perfil_excelente(
        self,
        scoring_service,
        solicitud_excelente
    ):
        """Test scoring con perfil excelente"""
        resultado = scoring_service.calcular_scoring(solicitud_excelente)

        assert resultado.score >= 750
        assert resultado.nivel_riesgo == NivelRiesgo.BAJO
        assert resultado.decision == DecisionCredito.APROBADO
        assert resultado.monto_aprobado > 0
        assert resultado.tasa_interes == Decimal("12.5")

    def test_scoring_alto_endeudamiento(self, scoring_service):
        """Test con alto nivel de deudas"""
        solicitud = SolicitudPrestamoInput(
            cliente_id=2,
            monto_solicitado=Decimal("30000"),
            plazo_meses=18,
            ingresos_mensuales=Decimal("5000"),
            deudas_actuales=Decimal("8000"),  # 160% de ingresos
            antiguedad_laboral_meses=12,
            historial_crediticio="REGULAR"
        )

        resultado = scoring_service.calcular_scoring(solicitud)

        assert resultado.score < 700
        assert resultado.nivel_riesgo in [
            NivelRiesgo.ALTO,
            NivelRiesgo.MUY_ALTO
        ]
        assert resultado.decision != DecisionCredito.APROBADO

    def test_validacion_plazo_invalido(self):
        """Test validación de plazo no múltiplo de 6"""
        with pytest.raises(ValueError, match="múltiplo de 6"):
            SolicitudPrestamoInput(
                cliente_id=3,
                monto_solicitado=Decimal("20000"),
                plazo_meses=15,  # No es múltiplo de 6
                ingresos_mensuales=Decimal("8000"),
                deudas_actuales=Decimal("2000"),
                antiguedad_laboral_meses=24,
                historial_crediticio="BUENO"
            )`
    },
    integrationTests: {
      titulo: 'Tests de Integración con API',
      code: `# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestScoringAPI:
    """Tests de integración de la API"""

    def test_health_check(self):
        """Test del endpoint raíz"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_calcular_scoring_exitoso(self):
        """Test cálculo de scoring exitoso"""
        payload = {
            "cliente_id": 12345,
            "monto_solicitado": 50000,
            "plazo_meses": 24,
            "ingresos_mensuales": 10000,
            "deudas_actuales": 15000,
            "antiguedad_laboral_meses": 36,
            "historial_crediticio": "BUENO"
        }

        response = client.post("/api/scoring/calcular", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert "score" in data
        assert 300 <= data["score"] <= 850
        assert "decision" in data
        assert "monto_aprobado" in data

    def test_validacion_monto_negativo(self):
        """Test validación de monto negativo"""
        payload = {
            "cliente_id": 12345,
            "monto_solicitado": -1000,  # Inválido
            "plazo_meses": 24,
            "ingresos_mensuales": 10000,
            "deudas_actuales": 0,
            "antiguedad_laboral_meses": 36,
            "historial_crediticio": "BUENO"
        }

        response = client.post("/api/scoring/calcular", json=payload)
        assert response.status_code == 422  # Validation error

    def test_historial_invalido(self):
        """Test con historial crediticio inválido"""
        payload = {
            "cliente_id": 12345,
            "monto_solicitado": 50000,
            "plazo_meses": 24,
            "ingresos_mensuales": 10000,
            "deudas_actuales": 15000,
            "antiguedad_laboral_meses": 36,
            "historial_crediticio": "INVALIDO"  # No permitido
        }

        response = client.post("/api/scoring/calcular", json=payload)
        assert response.status_code == 422`
    }
  };

  // Best Practices
  bestPractices = {
    title: 'Best Practices FastAPI',
    practices: [
      {
        icon: '🎯',
        categoria: 'Type Hints',
        good: [
          'Usar type hints en todas las funciones',
          'Aprovechar Pydantic para validación automática',
          'Definir Enums para valores constantes',
          'Documentar con docstrings'
        ],
        bad: [
          'Usar tipos genéricos como dict o list',
          'Omitir validaciones de entrada',
          'Dejar parámetros sin tipo',
          'No documentar endpoints'
        ]
      },
      {
        icon: '⚡',
        categoria: 'Async/Await',
        good: [
          'Usar async para operaciones I/O (DB, HTTP)',
          'Mantener funciones CPU-bound como sync',
          'Usar await con clients asíncronos',
          'Configurar connection pools'
        ],
        bad: [
          'Usar async sin necesidad',
          'Bloquear event loop con operaciones síncronas',
          'Olvidar await en llamadas async',
          'No manejar timeouts'
        ]
      },
      {
        icon: '🔒',
        categoria: 'Seguridad',
        good: [
          'Validar todo input con Pydantic',
          'Usar OAuth2 para autenticación',
          'Sanitizar datos sensibles en logs',
          'Implementar rate limiting'
        ],
        bad: [
          'Confiar en datos sin validar',
          'Exponer secrets en código',
          'Logs con información sensible',
          'No limitar requests'
        ]
      }
    ]
  };

  // Summary
  summary = {
    title: 'Resumen: FastAPI en Producción',
    achievements: [
      'API REST moderna con Python',
      'Validación automática con Pydantic',
      'Documentación generada automáticamente',
      'Alta performance con async/await',
      'Tests completos con pytest'
    ],
    features: [
      {
        icon: '⚡',
        title: 'Performance',
        description: 'Una de las APIs Python más rápidas'
      },
      {
        icon: '📝',
        title: 'Type Safety',
        description: 'Validación y documentación automática'
      },
      {
        icon: '🧪',
        title: 'Testing',
        description: 'Fácil de testear con TestClient'
      }
    ],
    nextSteps: [
      'Integrar con base de datos (SQLAlchemy)',
      'Implementar autenticación JWT',
      'Agregar caché con Redis',
      'Deploy con Docker + Kubernetes',
      'Monitoring con Prometheus'
    ]
  };

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'setup' },
    { type: 'pydantic-models' },
    { type: 'service-layer' },
    { type: 'api-endpoints' },
    { type: 'testing' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
}
