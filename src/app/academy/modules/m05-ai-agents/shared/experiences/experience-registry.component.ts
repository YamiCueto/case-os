import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpWhatIsAnAgentComponent } from '../../lesson-01-workflows/experiences/exp-what-is-an-agent/exp-what-is-an-agent.component';
import { ExpWhoControlsFlowComponent } from '../../lesson-01-workflows/experiences/exp-who-controls-flow/exp-who-controls-flow.component';
import { ExpAutonomyTradeoffsComponent } from '../../lesson-01-workflows/experiences/exp-autonomy-tradeoffs/exp-autonomy-tradeoffs.component';

import { ExpToolAnatomyComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-anatomy/exp-tool-anatomy.component';
import { ExpToolCallingInspectorComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-calling-inspector/exp-tool-calling-inspector.component';
import { ExpToolBoundaryComponent } from '../../lesson-02-tool-calling/experiences/exp-tool-boundary/exp-tool-boundary.component';

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
    ExpToolBoundaryComponent
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
