import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MemoryScope = 'DISCARD' | 'SESSION' | 'PERSIST' | 'NEVER_STORE';

interface PolicyCandidate {
  id: string;
  label: string;
  description: string;
  correctScope: MemoryScope;
  userScope?: MemoryScope;
  feedback: string;
}

@Component({
  selector: 'app-exp-memory-policy-matrix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-policy" role="region" aria-label="Simulador Memory Policy Matrix">
      <!-- Header -->
      <div class="exp-header">
        <div class="exp-header__title-group">
          <span class="material-symbols-outlined exp-header__icon" aria-hidden="true">policy</span>
          <div>
            <div class="exp-header__title">Memory Policy Matrix</div>
            <div class="exp-header__subtitle">Clasificación de ciclo de vida: Discard, Session, Persist y Never Store</div>
          </div>
        </div>
        <div class="score-chip">
          Clasificados: <strong>{{ getCompletedCount() }} / {{ candidates.length }}</strong>
        </div>
      </div>

      <p class="policy-intro">
        En Agent Engineering, <strong>la memoria no consiste en guardar todo</strong>. Cada dato generado en runtime debe someterse a una política de ciclo de vida explícita antes de tocar almacenamiento. Clasifica los siguientes elementos en su política correcta:
      </p>

      <!-- Lista de Candidatos -->
      <div class="candidates-list">
        @for (item of candidates; track item.id) {
          <div class="candidate-row" [class.candidate-row--classified]="item.userScope !== undefined">
            <div class="candidate-info">
              <span class="candidate-label">{{ item.label }}</span>
              <span class="candidate-desc">{{ item.description }}</span>
            </div>

            <div class="scope-selector">
              <button
                type="button"
                class="scope-btn scope-btn--discard"
                [class.scope-btn--selected]="item.userScope === 'DISCARD'"
                (click)="setScope(item, 'DISCARD')"
              >
                Discard
              </button>
              <button
                type="button"
                class="scope-btn scope-btn--session"
                [class.scope-btn--selected]="item.userScope === 'SESSION'"
                (click)="setScope(item, 'SESSION')"
              >
                Session
              </button>
              <button
                type="button"
                class="scope-btn scope-btn--persist"
                [class.scope-btn--selected]="item.userScope === 'PERSIST'"
                (click)="setScope(item, 'PERSIST')"
              >
                Persist
              </button>
              <button
                type="button"
                class="scope-btn scope-btn--never"
                [class.scope-btn--selected]="item.userScope === 'NEVER_STORE'"
                (click)="setScope(item, 'NEVER_STORE')"
              >
                Never Store
              </button>
            </div>

            @if (item.userScope) {
              <div
                class="candidate-feedback"
                [class.candidate-feedback--correct]="item.userScope === item.correctScope"
                [class.candidate-feedback--wrong]="item.userScope !== item.correctScope"
              >
                <span class="material-symbols-outlined feedback-icon" aria-hidden="true">
                  {{ item.userScope === item.correctScope ? 'check_circle' : 'cancel' }}
                </span>
                <span>{{ item.feedback }}</span>
              </div>
            }
          </div>
        }
      </div>

      <!-- Resumen de Política -->
      <div class="policy-legend">
        <div class="legend-card legend-card--discard">
          <div class="legend-title">DISCARD</div>
          <div class="legend-desc">Datos efímeros de trabajo. Mueren con la función.</div>
        </div>
        <div class="legend-card legend-card--session">
          <div class="legend-title">SESSION</div>
          <div class="legend-desc">Contexto de la conversación activa. Muere al cerrar sesión.</div>
        </div>
        <div class="legend-card legend-card--persist">
          <div class="legend-title">PERSIST</div>
          <div class="legend-desc">Preferencias estables asociadas al <code>subject_id</code>.</div>
        </div>
        <div class="legend-card legend-card--never">
          <div class="legend-title">NEVER STORE</div>
          <div class="legend-desc">Secretos, contraseñas o tokens. Bloqueo estricto de seguridad.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exp-policy {
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border, #282a36);
      border-radius: var(--case-radius-lg, 12px);
      padding: var(--case-space-5, 20px);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .exp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--case-border-subtle, #232530);
    }

    .exp-header__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .exp-header__icon {
      font-size: 1.6rem;
      color: var(--case-color-warning, #f59e0b);
    }

    .exp-header__title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--case-text-primary, #f8f8f2);
    }

    .exp-header__subtitle {
      font-size: 0.8rem;
      color: var(--case-text-muted, #71717a);
    }

    .score-chip {
      font-size: 0.78rem;
      font-family: var(--case-font-mono, monospace);
      color: var(--case-text-secondary, #a1a1aa);
      background: var(--case-surface-2, #181920);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--case-border, #282a36);
    }

    .score-chip strong {
      color: var(--case-color-success, #10b981);
    }

    .policy-intro {
      font-size: 0.85rem;
      color: var(--case-text-secondary, #a1a1aa);
      margin: 0;
      line-height: 1.4;
    }

    .candidates-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .candidate-row {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s ease;
    }

    .candidate-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .candidate-label {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--case-text-primary, #ffffff);
    }

    .candidate-desc {
      font-size: 0.78rem;
      color: var(--case-text-muted, #71717a);
    }

    .scope-selector {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .scope-btn {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      cursor: pointer;
      background: var(--case-surface-1, #13141c);
      border: 1px solid var(--case-border, #282a36);
      color: var(--case-text-secondary, #a1a1aa);
      transition: all 0.2s ease;
    }

    .scope-btn:hover {
      color: #ffffff;
      background: var(--case-surface-3, #21222c);
    }

    .scope-btn--discard.scope-btn--selected {
      background: rgba(148, 163, 184, 0.2);
      border-color: #94a3b8;
      color: #cbd5e1;
    }

    .scope-btn--session.scope-btn--selected {
      background: rgba(56, 189, 248, 0.2);
      border-color: #38bdf8;
      color: #38bdf8;
    }

    .scope-btn--persist.scope-btn--selected {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      color: #10b981;
    }

    .scope-btn--never.scope-btn--selected {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      color: #ef4444;
    }

    .candidate-feedback {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      line-height: 1.35;
    }

    .candidate-feedback--correct {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
    }

    .candidate-feedback--wrong {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .feedback-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .policy-legend {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 8px;
    }

    @media (max-width: 800px) {
      .policy-legend {
        grid-template-columns: 1fr 1fr;
      }
    }

    .legend-card {
      background: var(--case-surface-2, #181920);
      border: 1px solid var(--case-border, #282a36);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .legend-title {
      font-size: 0.72rem;
      font-weight: 700;
      font-family: var(--case-font-mono, monospace);
    }

    .legend-card--discard .legend-title { color: #94a3b8; }
    .legend-card--session .legend-title { color: #38bdf8; }
    .legend-card--persist .legend-title { color: #10b981; }
    .legend-card--never .legend-title { color: #ef4444; }

    .legend-desc {
      font-size: 0.7rem;
      color: var(--case-text-muted, #71717a);
      line-height: 1.3;
    }
  `]
})
export class ExpMemoryPolicyMatrixComponent {
  readonly candidates: PolicyCandidate[] = [
    {
      id: 'c1',
      label: 'Observación intermedia de base de datos (12KB JSON)',
      description: 'El resultado detallado de la consulta SQL ejecutada por la herramienta en la vuelta 1.',
      correctScope: 'DISCARD',
      feedback: 'Correcto. La observación cruda solo se necesita dentro de la corrida para que el modelo sintetice. Debe descartarse al finalizar el turno para no desbordar tokens en turnos futuros.'
    },
    {
      id: 'c2',
      label: 'Identificador del cliente en diálogo ("C-17")',
      description: 'El código del cliente consultado en el Turno 1 sobre el cual versará el Turno 2.',
      correctScope: 'SESSION',
      feedback: 'Correcto. Permite resolver preguntas de seguimiento como "¿y qué plan tiene?" sin obligar al usuario a repetir "C-17". Pertenece a la sesión activa.'
    },
    {
      id: 'c3',
      label: 'Preferencia explícita del usuario: "Formato de moneda USD y español"',
      description: 'Preferencia configurada explícitamente por el usuario para todas sus interacciones.',
      correctScope: 'PERSIST',
      feedback: 'Correcto. Es una preferencia estable y autorizada ligada al subject_id que debe sobrevivir reinicios del agente y aplicarse a sesiones futuras.'
    },
    {
      id: 'c4',
      label: 'API Key del proveedor de pagos o Token Bearer JWT',
      description: 'Credencial de autenticación recibida en los argumentos de una función.',
      correctScope: 'NEVER_STORE',
      feedback: 'Correcto. Regla de oro de seguridad: secretos, tokens de acceso y contraseñas NUNCA deben persistirse en un MemoryStore de texto ni inyectarse en el historial.'
    },
    {
      id: 'c5',
      label: 'Stack trace de error por conexión caída en intento 1',
      description: 'El volcado técnico de excepción devuelto por el runtime antes de reintentar la llamada.',
      correctScope: 'DISCARD',
      feedback: 'Correcto. Es información de depuración transitoria; persistirla en la memoria del usuario solo intoxicaría el contexto con errores superados.'
    },
    {
      id: 'c6',
      label: 'Dirección de despacho habitual confirmada por el usuario',
      description: 'Sede logística favorita aprobada por el subject para agilizar envíos recurrentes.',
      correctScope: 'PERSIST',
      feedback: 'Correcto. Hecho operativo de interacción autorizado que ahorra pasos repetitivos en futuras sesiones del mismo subject_id.'
    }
  ];

  setScope(item: PolicyCandidate, scope: MemoryScope): void {
    item.userScope = scope;
  }

  getCompletedCount(): number {
    return this.candidates.filter(c => c.userScope !== undefined).length;
  }
}
