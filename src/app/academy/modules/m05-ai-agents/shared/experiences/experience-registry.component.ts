import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpWhatIsAnAgentComponent } from '../../lesson-01-workflows/experiences/exp-what-is-an-agent/exp-what-is-an-agent.component';
import { ExpWhoControlsFlowComponent } from '../../lesson-01-workflows/experiences/exp-who-controls-flow/exp-who-controls-flow.component';
import { ExpAutonomyTradeoffsComponent } from '../../lesson-01-workflows/experiences/exp-autonomy-tradeoffs/exp-autonomy-tradeoffs.component';

@Component({
  selector: 'app-experience-registry-m05',
  standalone: true,
  imports: [
    CommonModule,
    ExpWhatIsAnAgentComponent,
    ExpWhoControlsFlowComponent,
    ExpAutonomyTradeoffsComponent
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
