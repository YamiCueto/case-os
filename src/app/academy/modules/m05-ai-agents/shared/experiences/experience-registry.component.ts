import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpWhatIsAnAgentComponent } from '../../lesson-01-workflows/experiences/exp-what-is-an-agent/exp-what-is-an-agent.component';
import { ExpWhoControlsFlowComponent } from '../../lesson-01-workflows/experiences/exp-who-controls-flow/exp-who-controls-flow.component';
import { ExpAutonomyTradeoffsComponent } from '../../lesson-01-workflows/experiences/exp-autonomy-tradeoffs/exp-autonomy-tradeoffs.component';

import { ExpToolAnatomyComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-anatomy/exp-tool-anatomy.component';
import { ExpToolCallingInspectorComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-calling-inspector/exp-tool-calling-inspector.component';
import { ExpToolBoundaryComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-boundary/exp-tool-boundary.component';

import { ExpWhyAgentV1StopsComponent } from '../../lesson-03-agent-loop/experiences/exp-why-agent-v1-stops/exp-why-agent-v1-stops.component';
import { ExpAgentLoopInspectorComponent } from '../../lesson-03-agent-loop/experiences/exp-agent-loop-inspector/exp-agent-loop-inspector.component';
import { ExpStopConditionsComponent } from '../../lesson-03-agent-loop/experiences/exp-stop-conditions/exp-stop-conditions.component';

import { ExpExecutionStateInspectorComponent } from '../../lesson-04-state-memory/experiences/exp-execution-state-inspector/exp-execution-state-inspector.component';
import { ExpContextVsMemoryComponent } from '../../lesson-04-state-memory/experiences/exp-context-vs-memory/exp-context-vs-memory.component';
import { ExpMemoryPolicyMatrixComponent } from '../../lesson-04-state-memory/experiences/exp-memory-policy-matrix/exp-memory-policy-matrix.component';

import { ExpReactiveVsPlannedComponent } from '../../lesson-05-planning-task-decomposition/experiences/exp-reactive-vs-planned/exp-reactive-vs-planned.component';
import { ExpPlanInspectorComponent } from '../../lesson-05-planning-task-decomposition/experiences/exp-plan-inspector/exp-plan-inspector.component';
import { ExpReplanningSimulatorComponent } from '../../lesson-05-planning-task-decomposition/experiences/exp-replanning-simulator/exp-replanning-simulator.component';

import { ExpPermissionBoundaryComponent } from '../../lesson-06-guardrails-hitl/experiences/exp-permission-boundary/exp-permission-boundary.component';
import { ExpHumanApprovalGateComponent } from '../../lesson-06-guardrails-hitl/experiences/exp-human-approval-gate/exp-human-approval-gate.component';
import { ExpBudgetCircuitBreakerComponent } from '../../lesson-06-guardrails-hitl/experiences/exp-budget-circuit-breaker/exp-budget-circuit-breaker.component';

import { ExpTraceExplorerComponent } from '../../lesson-07-observability-evaluation/experiences/exp-trace-explorer/exp-trace-explorer.component';
import { ExpRunComparisonComponent } from '../../lesson-07-observability-evaluation/experiences/exp-run-comparison/exp-run-comparison.component';
import { ExpEvaluationLabComponent } from '../../lesson-07-observability-evaluation/experiences/exp-evaluation-lab/exp-evaluation-lab.component';

@Component({
  selector: 'app-experience-registry-m05',
  standalone: true,
  imports: [
    CommonModule,
    ExpWhatIsAnAgentComponent,
    ExpWhoControlsFlowComponent,
    ExpAutonomyTradeoffsComponent,
    ExpToolAnatomyComponent,
    ExpToolCallingInspectorComponent,
    ExpToolBoundaryComponent,
    ExpWhyAgentV1StopsComponent,
    ExpAgentLoopInspectorComponent,
    ExpStopConditionsComponent,
    ExpExecutionStateInspectorComponent,
    ExpContextVsMemoryComponent,
    ExpMemoryPolicyMatrixComponent,
    ExpReactiveVsPlannedComponent,
    ExpPlanInspectorComponent,
    ExpReplanningSimulatorComponent,
    ExpPermissionBoundaryComponent,
    ExpHumanApprovalGateComponent,
    ExpBudgetCircuitBreakerComponent,
    ExpTraceExplorerComponent,
    ExpRunComparisonComponent,
    ExpEvaluationLabComponent
  ],
  template: `
    @switch (experienceId) {
      @case ('what-is-an-agent') {
        <app-exp-what-is-an-agent></app-exp-what-is-an-agent>
      }
      @case ('who-controls-flow') {
        <app-exp-who-controls-flow></app-exp-who-controls-flow>
      }
      @case ('autonomy-tradeoffs') {
        <app-exp-autonomy-tradeoffs></app-exp-autonomy-tradeoffs>
      }
      @case ('tool-anatomy') {
        <app-exp-tool-anatomy></app-exp-tool-anatomy>
      }
      @case ('tool-calling-inspector') {
        <app-exp-tool-calling-inspector></app-exp-tool-calling-inspector>
      }
      @case ('tool-boundary') {
        <app-exp-tool-boundary></app-exp-tool-boundary>
      }
      @case ('why-agent-v1-stops') {
        <app-exp-why-agent-v1-stops></app-exp-why-agent-v1-stops>
      }
      @case ('agent-loop-inspector') {
        <app-exp-agent-loop-inspector></app-exp-agent-loop-inspector>
      }
      @case ('stop-conditions') {
        <app-exp-stop-conditions></app-exp-stop-conditions>
      }
      @case ('execution-state-inspector') {
        <app-exp-execution-state-inspector></app-exp-execution-state-inspector>
      }
      @case ('context-vs-memory') {
        <app-exp-context-vs-memory></app-exp-context-vs-memory>
      }
      @case ('memory-policy-matrix') {
        <app-exp-memory-policy-matrix></app-exp-memory-policy-matrix>
      }
      @case ('reactive-vs-planned') {
        <app-exp-reactive-vs-planned></app-exp-reactive-vs-planned>
      }
      @case ('plan-inspector') {
        <app-exp-plan-inspector></app-exp-plan-inspector>
      }
      @case ('replanning-simulator') {
        <app-exp-replanning-simulator></app-exp-replanning-simulator>
      }
      @case ('permission-boundary') {
        <app-exp-permission-boundary></app-exp-permission-boundary>
      }
      @case ('human-approval-gate') {
        <app-exp-human-approval-gate></app-exp-human-approval-gate>
      }
      @case ('budget-circuit-breaker') {
        <app-exp-budget-circuit-breaker></app-exp-budget-circuit-breaker>
      }
      @case ('trace-explorer') {
        <app-exp-trace-explorer></app-exp-trace-explorer>
      }
      @case ('run-comparison') {
        <app-exp-run-comparison></app-exp-run-comparison>
      }
      @case ('evaluation-lab') {
        <app-exp-evaluation-lab></app-exp-evaluation-lab>
      }
      @default {
        <div class="case-callout case-callout--error">
          Experience ID not found: {{ experienceId }}
        </div>
      }
    }
  `
})
export class ExperienceRegistryComponent {
  @Input() experienceId!: string;
}
