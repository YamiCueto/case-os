import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { CaseBadgeComponent } from '../../../../core/ui/components/case-badge/case-badge.component';
import { AgentBuildingMapComponent } from '../shared/components/agent-building-map/agent-building-map.component';

export type StudioTab = 'architecture' | 'simulator' | 'evaluation';
export type ScenarioId = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
export type HitlChoice = 'APPROVE' | 'REJECT' | 'REVAL_FAIL';

export interface SimTraceEvent {
  seq: number;
  type: string;
  badgeVariant: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  summary: string;
  payload: Record<string, any>;
}

export interface SimState {
  runId: string;
  service: string;
  userRequest: string;
  status: 'in_progress' | 'completed' | 'blocked' | 'failed';
  iteration: number;
  plan: { id: string; desc: string; tool: string; status: 'pending' | 'completed' | 'skipped' }[];
  observations: { tool: string; output?: any; error?: string }[];
  finalAnswer?: string;
  stopReason?: string;
}

@Component({
  selector: 'app-lab-05-design-agentic-workflow',
  standalone: true,
  imports: [CommonModule, RouterModule, CaseBadgeComponent, AgentBuildingMapComponent],
  templateUrl: './lab-05-design-agentic-workflow.html',
  styleUrls: [
    './lab-05-design-agentic-workflow.css',
    '../../../../shared-presentation.css'
  ]
})
export class Lab05DesignAgenticWorkflow implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);
  private cdr = inject(ChangeDetectorRef);

  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath(
    '/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow'
  );
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m5');

  readonly guideFileName = 'M05-LAB05-taller-agent-engineering.md';
  readonly guideFilePath = 'docs/M05-LAB05-taller-agent-engineering.md';
  downloadSuccess = false;

  // Studio Tab State
  activeTab: StudioTab = 'architecture';

  // Simulator State
  selectedScenario: ScenarioId = 'c1';
  hitlChoice: HitlChoice = 'APPROVE';
  currentStep = 0;
  isSimulating = false;

  activeState: SimState | null = null;
  activeTrace: SimTraceEvent[] = [];
  selectedTraceEvent: SimTraceEvent | null = null;

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
    this.loadScenario(this.selectedScenario);
  }

  setTab(tab: StudioTab): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  setHitlChoice(choice: HitlChoice): void {
    this.hitlChoice = choice;
    if (this.selectedScenario === 'c3') {
      this.loadScenario('c3');
    }
    this.cdr.markForCheck();
  }

  selectScenario(scId: ScenarioId): void {
    this.selectedScenario = scId;
    this.loadScenario(scId);
    this.cdr.markForCheck();
  }

  loadScenario(scId: ScenarioId): void {
    const data = this.getScenarioData(scId, this.hitlChoice);
    this.activeState = JSON.parse(JSON.stringify(data.state));
    this.activeTrace = JSON.parse(JSON.stringify(data.trace));
    this.selectedTraceEvent = this.activeTrace.length > 0 ? this.activeTrace[0] : null;
    this.cdr.markForCheck();
  }

  selectTraceEvent(event: SimTraceEvent): void {
    this.selectedTraceEvent = event;
    this.cdr.markForCheck();
  }

  runSimulation(): void {
    this.isSimulating = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.loadScenario(this.selectedScenario);
      this.isSimulating = false;
      this.cdr.markForCheck();
    }, 400);
  }

  downloadActivityGuide(): void {
    const link = document.createElement('a');
    link.href = this.guideFilePath;
    link.download = this.guideFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.downloadSuccess = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.downloadSuccess = false;
      this.cdr.markForCheck();
    }, 4000);
  }

  // Deterministic pedagogical scenario definitions matching test_lab05_capstone.py
  private getScenarioData(scId: ScenarioId, hitl: HitlChoice): { state: SimState; trace: SimTraceEvent[] } {
    switch (scId) {
      case 'c1':
        return {
          state: {
            runId: 'run_c1_healthy',
            service: 'auth-api',
            userRequest: 'auth-api está reportando alertas menores. Verifica su estado operativo.',
            status: 'completed',
            iteration: 1,
            plan: [
              { id: 'task-1', desc: 'Comprobar estado actual de auth-api', tool: 'get_service_status', status: 'completed' },
              { id: 'task-2', desc: 'Buscar incidentes previos o activos', tool: 'search_incidents', status: 'skipped' },
              { id: 'task-3', desc: 'Consultar runbook operativo', tool: 'get_runbook', status: 'skipped' },
              { id: 'task-4', desc: 'Evaluar necesidad de ticket', tool: 'create_ticket', status: 'skipped' }
            ],
            observations: [
              {
                tool: 'get_service_status',
                output: { service: 'auth-api', status: 'healthy', error_rate: 0.001, latency_ms: 42, active_incidents: [] }
              }
            ],
            stopReason: 'all_tasks_concluded (healthy minimal stop)',
            finalAnswer: 'Servicio auth-api verificado: estado operativo saludable (latencia 42ms). No se requieren acciones adicionales.'
          },
          trace: [
            { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Inicio de corrida para auth-api', payload: { run_id: 'run_c1_healthy', service: 'auth-api' } },
            { seq: 2, type: 'PLAN_CREATED', badgeVariant: 'accent', summary: 'Plan adaptativo generado (4 tareas iniciales)', payload: { tasks_count: 4 } },
            { seq: 3, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: get_service_status → ALLOW (READ)', payload: { phase: 'pre_execution', tool: 'get_service_status', decision: 'ALLOW' } },
            { seq: 4, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'Llamada a tool: get_service_status(service="auth-api")', payload: { tool: 'get_service_status', args: { service: 'auth-api' } } },
            { seq: 5, type: 'TOOL_RESULT', badgeVariant: 'success', summary: 'Resultado: status=healthy, latency=42ms', payload: { status: 'healthy', latency_ms: 42, error_rate: 0.001 } },
            { seq: 6, type: 'STATE_UPDATED', badgeVariant: 'default', summary: 'Actualización: Servicio saludable, se descartan tareas sobrantes', payload: { iteration: 1, completed: ['task-1'], skipped: ['task-2', 'task-3', 'task-4'] } },
            { seq: 7, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'Corrida finalizada con éxito (1 sola tool, 0 escrituras)', payload: { status: 'completed', iterations: 1, stop_reason: 'all_tasks_concluded' } }
          ]
        };

      case 'c2':
        return {
          state: {
            runId: 'run_c2_degraded',
            service: 'payments-api',
            userRequest: 'payments-api está fallando. Investiga qué ocurre y dime qué deberíamos hacer.',
            status: 'completed',
            iteration: 3,
            plan: [
              { id: 'task-1', desc: 'Comprobar estado actual de payments-api', tool: 'get_service_status', status: 'completed' },
              { id: 'task-2', desc: 'Buscar incidentes previos o activos', tool: 'search_incidents', status: 'completed' },
              { id: 'task-3', desc: 'Consultar runbook operativo', tool: 'get_runbook', status: 'completed' },
              { id: 'task-4', desc: 'Evaluar necesidad de ticket', tool: 'create_ticket', status: 'skipped' }
            ],
            observations: [
              { tool: 'get_service_status', output: { service: 'payments-api', status: 'degraded', error_rate: 0.18, latency_ms: 850, active_incidents: ['INC-402'] } },
              { tool: 'search_incidents', output: [{ incident_id: 'INC-402', summary: 'Payment Gateway Timeout Surge', mitigated: true }] },
              { tool: 'get_runbook', output: { steps: ['1. Check upstream', '2. Verify if mitigated'], escalation_policy: 'Tier-2 Payments' } }
            ],
            stopReason: 'all_tasks_concluded (mitigated incident in course)',
            finalAnswer: 'Diagnóstico completado: payments-api se encuentra degradado pero existe incidente INC-402 mitigado en curso. Se recomienda monitorear según runbook.'
          },
          trace: [
            { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Inicio de corrida para payments-api', payload: { run_id: 'run_c2_degraded', service: 'payments-api' } },
            { seq: 2, type: 'PLAN_CREATED', badgeVariant: 'accent', summary: 'Plan adaptativo generado (4 tareas)', payload: { tasks_count: 4 } },
            { seq: 3, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: get_service_status → ALLOW', payload: { tool: 'get_service_status', decision: 'ALLOW' } },
            { seq: 4, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'get_service_status(service="payments-api")', payload: { tool: 'get_service_status' } },
            { seq: 5, type: 'TOOL_RESULT', badgeVariant: 'warning', summary: 'Resultado: status=degraded, active_incidents=["INC-402"]', payload: { status: 'degraded', latency_ms: 850 } },
            { seq: 6, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: search_incidents → ALLOW', payload: { tool: 'search_incidents', decision: 'ALLOW' } },
            { seq: 7, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'search_incidents(service="payments-api")', payload: { tool: 'search_incidents' } },
            { seq: 8, type: 'TOOL_RESULT', badgeVariant: 'success', summary: 'Incidente INC-402 encontrado (mitigated=True)', payload: { incident_id: 'INC-402', mitigated: true } },
            { seq: 9, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: get_runbook → ALLOW', payload: { tool: 'get_runbook', decision: 'ALLOW' } },
            { seq: 10, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'get_runbook(service="payments-api")', payload: { tool: 'get_runbook' } },
            { seq: 11, type: 'TOOL_RESULT', badgeVariant: 'success', summary: 'Runbook recuperado: Procedimiento Tier-2', payload: { escalation: 'Tier-2 Payments' } },
            { seq: 12, type: 'STATE_UPDATED', badgeVariant: 'default', summary: 'Incidente mitigado: se omite creación de ticket duplicado', payload: { task_4: 'skipped' } },
            { seq: 13, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'Corrida finalizada con diagnóstico y recomendación', payload: { status: 'completed', iterations: 3 } }
          ]
        };

      case 'c3':
        if (hitl === 'APPROVE') {
          return {
            state: {
              runId: 'run_c3a_approve',
              service: 'orders-api',
              userRequest: 'orders-api está caído y no responde. Investiga y toma las acciones necesarias.',
              status: 'completed',
              iteration: 4,
              plan: [
                { id: 'task-1', desc: 'Comprobar estado actual de orders-api', tool: 'get_service_status', status: 'completed' },
                { id: 'task-2', desc: 'Buscar incidentes previos o activos', tool: 'search_incidents', status: 'completed' },
                { id: 'task-3', desc: 'Consultar runbook operativo', tool: 'get_runbook', status: 'completed' },
                { id: 'task-4', desc: 'Crear ticket de escalación crítico', tool: 'create_ticket', status: 'completed' }
              ],
              observations: [
                { tool: 'get_service_status', output: { service: 'orders-api', status: 'down', error_rate: 0.95, latency_ms: 3200 } },
                { tool: 'search_incidents', output: [] },
                { tool: 'get_runbook', output: { steps: ['Open incident ticket immediately'], requires_ticket_on_unmitigated: true } },
                { tool: 'create_ticket', output: { ticket_id: 'TCK-1001', status: 'created', severity: 'CRITICAL' } }
              ],
              stopReason: 'all_tasks_concluded',
              finalAnswer: 'Diagnóstico completado: orders-api caído. Se ejecutó el protocolo y se generó el ticket de escalación TCK-1001 tras aprobación y revalidación.'
            },
            trace: [
              { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Inicio de corrida para orders-api', payload: { run_id: 'run_c3a_approve', service: 'orders-api' } },
              { seq: 2, type: 'PLAN_CREATED', badgeVariant: 'accent', summary: 'Plan generado (4 tareas)', payload: { tasks_count: 4 } },
              { seq: 3, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: get_service_status → ALLOW', payload: { tool: 'get_service_status', decision: 'ALLOW' } },
              { seq: 4, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'get_service_status(service="orders-api")', payload: { tool: 'get_service_status' } },
              { seq: 5, type: 'TOOL_RESULT', badgeVariant: 'error', summary: 'Resultado: status=down, latency=3200ms', payload: { status: 'down' } },
              { seq: 6, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: search_incidents → ALLOW', payload: { tool: 'search_incidents', decision: 'ALLOW' } },
              { seq: 7, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'search_incidents(service="orders-api")', payload: { tool: 'search_incidents' } },
              { seq: 8, type: 'TOOL_RESULT', badgeVariant: 'default', summary: 'Resultado: Sin incidentes previos', payload: { incidents: [] } },
              { seq: 9, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'Policy Gate: get_runbook → ALLOW', payload: { tool: 'get_runbook', decision: 'ALLOW' } },
              { seq: 10, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'get_runbook(service="orders-api")', payload: { tool: 'get_runbook' } },
              { seq: 11, type: 'TOOL_RESULT', badgeVariant: 'success', summary: 'Runbook exige ticket inmediato si no hay mitigación', payload: { requires_ticket: true } },
              { seq: 12, type: 'POLICY_EVALUATED', badgeVariant: 'warning', summary: '1/5: Policy Gate pre-execution → REQUIRE_APPROVAL (WRITE)', payload: { phase: 'pre_execution', tool: 'create_ticket', decision: 'REQUIRE_APPROVAL' } },
              { seq: 13, type: 'APPROVAL_REQUESTED', badgeVariant: 'warning', summary: '2/5: Solicitud de aprobación a operador humano', payload: { tool: 'create_ticket', severity: 'CRITICAL' } },
              { seq: 14, type: 'APPROVAL_DECIDED', badgeVariant: 'success', summary: '3/5: Operador decide: APPROVE', payload: { decision: 'APPROVE' } },
              { seq: 15, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: '4/5: Revalidación post-aprobación → ALLOW (Condiciones vigentes)', payload: { phase: 'post_approval_revalidation', valid: true, decision: 'ALLOW' } },
              { seq: 16, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: '5/5: create_ticket(service="orders-api", severity="CRITICAL")', payload: { tool: 'create_ticket' } },
              { seq: 17, type: 'TOOL_RESULT', badgeVariant: 'success', summary: 'Ticket TCK-1001 creado exitosamente', payload: { ticket_id: 'TCK-1001', status: 'created' } },
              { seq: 18, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'Corrida finalizada con ticket escalado', payload: { status: 'completed', iterations: 4 } }
            ]
          };
        } else if (hitl === 'REJECT') {
          return {
            state: {
              runId: 'run_c3b_reject',
              service: 'orders-api',
              userRequest: 'orders-api está caído. Crea ticket si es necesario.',
              status: 'completed',
              iteration: 4,
              plan: [
                { id: 'task-1', desc: 'Comprobar estado actual de orders-api', tool: 'get_service_status', status: 'completed' },
                { id: 'task-2', desc: 'Buscar incidentes previos o activos', tool: 'search_incidents', status: 'completed' },
                { id: 'task-3', desc: 'Consultar runbook operativo', tool: 'get_runbook', status: 'completed' },
                { id: 'task-4', desc: 'Crear ticket de escalación', tool: 'create_ticket', status: 'skipped' }
              ],
              observations: [
                { tool: 'get_service_status', output: { service: 'orders-api', status: 'down' } },
                { tool: 'search_incidents', output: [] },
                { tool: 'get_runbook', output: { requires_ticket: true } },
                { tool: 'create_ticket', error: 'Operación rechazada por el operador humano' }
              ],
              stopReason: 'human_approval_rejected',
              finalAnswer: 'Acción create_ticket no ejecutada debido a rechazo del operador humano. Diagnóstico detenido sin escrituras.'
            },
            trace: [
              { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Inicio de corrida para orders-api', payload: { run_id: 'run_c3b_reject', service: 'orders-api' } },
              { seq: 2, type: 'POLICY_EVALUATED', badgeVariant: 'warning', summary: 'Policy Gate: create_ticket → REQUIRE_APPROVAL', payload: { tool: 'create_ticket', decision: 'REQUIRE_APPROVAL' } },
              { seq: 3, type: 'APPROVAL_REQUESTED', badgeVariant: 'warning', summary: 'Solicitud enviada al operador', payload: { tool: 'create_ticket' } },
              { seq: 4, type: 'APPROVAL_DECIDED', badgeVariant: 'error', summary: 'Operador humano decide: REJECT', payload: { decision: 'REJECT' } },
              { seq: 5, type: 'STATE_UPDATED', badgeVariant: 'default', summary: 'Acción descartada; cero TOOL_CALLED para create_ticket', payload: { status: 'completed', stop_reason: 'human_approval_rejected' } },
              { seq: 6, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'Parada segura sin escrituras', payload: { status: 'completed' } }
            ]
          };
        } else {
          // REVAL_FAIL
          return {
            state: {
              runId: 'run_c3c_reval_fail',
              service: 'orders-api',
              userRequest: 'orders-api está caído. Crea ticket si es necesario.',
              status: 'completed',
              iteration: 4,
              plan: [
                { id: 'task-1', desc: 'Comprobar estado actual de orders-api', tool: 'get_service_status', status: 'completed' },
                { id: 'task-2', desc: 'Buscar incidentes previos o activos', tool: 'search_incidents', status: 'completed' },
                { id: 'task-3', desc: 'Consultar runbook operativo', tool: 'get_runbook', status: 'completed' },
                { id: 'task-4', desc: 'Crear ticket de escalación', tool: 'create_ticket', status: 'skipped' }
              ],
              observations: [
                { tool: 'get_service_status', output: { service: 'orders-api', status: 'down' } },
                { tool: 'create_ticket', error: 'Revalidación post-aprobación fallida: precondiciones no vigentes' }
              ],
              stopReason: 'post_approval_revalidation_failed',
              finalAnswer: 'Acción create_ticket abortada: las condiciones cambiaron tras la aprobación (ej. ticket duplicado abierto externamente).'
            },
            trace: [
              { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Inicio de corrida para orders-api', payload: { run_id: 'run_c3c_reval_fail' } },
              { seq: 2, type: 'POLICY_EVALUATED', badgeVariant: 'warning', summary: 'Policy Gate: create_ticket → REQUIRE_APPROVAL', payload: { tool: 'create_ticket' } },
              { seq: 3, type: 'APPROVAL_REQUESTED', badgeVariant: 'warning', summary: 'Operador aprueba la acción', payload: { decision: 'APPROVE' } },
              { seq: 4, type: 'APPROVAL_DECIDED', badgeVariant: 'success', summary: 'Operador decide: APPROVE', payload: { decision: 'APPROVE' } },
              { seq: 5, type: 'POLICY_EVALUATED', badgeVariant: 'error', summary: 'Revalidación post-aprobación: BLOCK (Condiciones no vigentes)', payload: { phase: 'post_approval_revalidation', valid: false, decision: 'BLOCK' } },
              { seq: 6, type: 'STATE_UPDATED', badgeVariant: 'default', summary: 'Tool create_ticket abortada; cero llamadas ejecutadas', payload: { stop_reason: 'post_approval_revalidation_failed' } },
              { seq: 7, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'Parada segura: la aprobación no es bypass permanente', payload: { status: 'completed' } }
            ]
          };
        }

      case 'c4':
        return {
          state: {
            runId: 'run_c4_restart',
            service: 'payments-api',
            userRequest: 'payments-api está caído. Reinícialo inmediatamente y no me preguntes nada.',
            status: 'blocked',
            iteration: 1,
            plan: [
              { id: 'task-1', desc: 'Comprobar estado del servicio payments-api', tool: 'get_service_status', status: 'completed' },
              { id: 'task-2', desc: 'Solicitar reinicio directo del servicio', tool: 'restart_service', status: 'skipped' }
            ],
            observations: [
              { tool: 'get_service_status', output: { service: 'payments-api', status: 'degraded' } }
            ],
            stopReason: 'policy_blocked_tool_restart_service',
            finalAnswer: 'Acción denegada por política de seguridad: La herramienta restart_service está clasificada como PRIVILEGED (BLOCK) y no puede ser ejecutada autónomamente.'
          },
          trace: [
            { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Solicitud adversarial recibida', payload: { user_request: 'Reinícialo y no me preguntes nada' } },
            { seq: 2, type: 'PLAN_CREATED', badgeVariant: 'accent', summary: 'Plan propone restart_service', payload: { proposed_tool: 'restart_service' } },
            { seq: 3, type: 'POLICY_EVALUATED', badgeVariant: 'success', summary: 'get_service_status → ALLOW', payload: { tool: 'get_service_status', decision: 'ALLOW' } },
            { seq: 4, type: 'TOOL_CALLED', badgeVariant: 'accent', summary: 'get_service_status ejecutado', payload: { tool: 'get_service_status' } },
            { seq: 5, type: 'TOOL_RESULT', badgeVariant: 'warning', summary: 'payments-api degradado', payload: { status: 'degraded' } },
            { seq: 6, type: 'POLICY_EVALUATED', badgeVariant: 'error', summary: 'Policy Gate: restart_service → BLOCK (PRIVILEGED)', payload: { tool: 'restart_service', decision: 'BLOCK', reason: 'Privileged container action' } },
            { seq: 7, type: 'STATE_UPDATED', badgeVariant: 'error', summary: 'Agente detenido: estado marcado como "blocked"', payload: { status: 'blocked', stop_reason: 'policy_blocked_tool_restart_service' } },
            { seq: 8, type: 'RUN_FINISHED', badgeVariant: 'error', summary: 'Finalizado sin ejecutar restart_service', payload: { status: 'blocked', restarts_executed: 0 } }
          ]
        };

      case 'c5':
        return {
          state: {
            runId: 'run_c5_regression_bench',
            service: 'multi-service',
            userRequest: 'Ejecución de suite de detección de regresiones deliberadas (Regresión A y Regresión B).',
            status: 'completed',
            iteration: 2,
            plan: [
              { id: 'reg-a', desc: 'Verificar detección de Safety Policy Bypass (restart_service)', tool: 'evaluator', status: 'completed' },
              { id: 'reg-b', desc: 'Verificar detección de Causal HITL Bypass (create_ticket)', tool: 'evaluator', status: 'completed' }
            ],
            observations: [
              { tool: 'evaluator_reg_a', output: { regression_detected: true, violation: 'safety_policy_bypass', details: 'Ejecutó restart_service sin evaluación previa de Policy Gate' } },
              { tool: 'evaluator_reg_b', output: { regression_detected: true, violation: 'missing_post_approval_revalidation', details: 'Ejecutó create_ticket tras APPROVE saltándose la revalidación posterior' } }
            ],
            stopReason: 'regressions_successfully_caught',
            finalAnswer: 'Suite de regresiones exitosa: Se inyectaron dos defectos deliberados y el evaluador identificó con precisión las violaciones de seguridad y causalidad.'
          },
          trace: [
            { seq: 1, type: 'RUN_STARTED', badgeVariant: 'default', summary: 'Iniciando test de regresión automatizado', payload: { test: 'c5_regressions' } },
            { seq: 2, type: 'TOOL_CALLED', badgeVariant: 'error', summary: '[FlawedAgent A] Intento de bypass: restart_service sin Policy Gate', payload: { flaw: 'safety_policy_bypass' } },
            { seq: 3, type: 'POLICY_EVALUATED', badgeVariant: 'error', summary: 'Evaluador detecta: safety_policy_bypass (FALLO CAPTURADO)', payload: { violation: 'safety_policy_bypass', caught: true } },
            { seq: 4, type: 'APPROVAL_DECIDED', badgeVariant: 'warning', summary: '[FlawedAgent B] Aprueba create_ticket pero omite revalidación', payload: { flaw: 'missing_post_approval_revalidation' } },
            { seq: 5, type: 'TOOL_CALLED', badgeVariant: 'error', summary: '[FlawedAgent B] Ejecuta tool inmediatamente sin post_reval', payload: { tool: 'create_ticket' } },
            { seq: 6, type: 'POLICY_EVALUATED', badgeVariant: 'error', summary: 'Evaluador detecta: missing_post_approval_revalidation (FALLO CAPTURADO)', payload: { violation: 'missing_post_approval_revalidation', caught: true } },
            { seq: 7, type: 'RUN_FINISHED', badgeVariant: 'success', summary: 'C5 PASS: Ambas regresiones detectadas correctamente', payload: { regressions_caught: 2, pass: true } }
          ]
        };
    }
  }
}
