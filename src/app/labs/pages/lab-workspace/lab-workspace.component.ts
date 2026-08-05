import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticLabRepository } from '../../../core/repositories/static-lab.repository';
import { LabExecutionService } from '../../services/lab-execution.service';
import { LibraryService } from '../../../library/services/library.service';
import { LabDefinition, LabExecution, LabStep } from '../../../core/models/lab.models';
import { KnowledgeResource } from '../../../core/models/knowledge.models';
import { MarkdownViewerComponent } from '../../../library/components/markdown-viewer/markdown-viewer.component';
import { ResourceCardComponent } from '../../../library/components/resource-card/resource-card.component';

@Component({
  selector: 'app-lab-workspace',
  standalone: true,
  imports: [CommonModule, MarkdownViewerComponent, ResourceCardComponent],
  templateUrl: './lab-workspace.component.html'
})
export class LabWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private labRepo = inject(StaticLabRepository);
  private execService = inject(LabExecutionService);
  private libraryService = inject(LibraryService);

  lab = signal<LabDefinition | null>(null);
  execution = signal<LabExecution | null>(null);
  
  // Paso Actual (Playbook)
  currentStepIndex = computed(() => {
    const l = this.lab();
    const e = this.execution();
    if (!l || !e || !e.currentStepId) return 0;
    const idx = l.steps.findIndex(s => s.id === e.currentStepId);
    return idx === -1 ? 0 : idx;
  });

  currentStep = computed<LabStep | null>(() => {
    const l = this.lab();
    return l ? l.steps[this.currentStepIndex()] : null;
  });

  // Recursos de Contexto (Context Panel)
  contextResources = computed<KnowledgeResource[]>(() => {
    const step = this.currentStep();
    if (!step || !step.requiredResources) return [];
    
    // Busca los recursos en el KnowledgeRepository (a través del orquestador LibraryService)
    return step.requiredResources
      .map(slug => this.libraryService.getBySlug(slug))
      .filter((r): r is KnowledgeResource => r !== undefined);
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const found = this.labRepo.getBySlug(slug);
        if (found) {
          this.lab.set(found);
          const exec = this.execService.startLab(found.id);
          this.execution.set(exec);
        } else {
          this.router.navigate(['/labs']);
        }
      }
    });
  }

  nextStep() {
    const l = this.lab();
    if (!l) return;
    const nextIdx = this.currentStepIndex() + 1;
    if (nextIdx < l.steps.length) {
      const nextId = l.steps[nextIdx].id;
      this.execution.set(this.execService.goToStep(l.id, nextId));
    } else {
      this.execution.set(this.execService.completeLab(l.id));
      // TODO: Mostrar pantalla de felicitaciones
    }
  }

  prevStep() {
    const l = this.lab();
    if (!l) return;
    const prevIdx = this.currentStepIndex() - 1;
    if (prevIdx >= 0) {
      const prevId = l.steps[prevIdx].id;
      this.execution.set(this.execService.goToStep(l.id, prevId));
    }
  }

  exitLab() {
    this.router.navigate(['/labs']);
  }
}
