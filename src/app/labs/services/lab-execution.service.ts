import { Injectable, inject, signal, computed } from '@angular/core';
import { LabDefinition, LabExecution } from '../../core/models/lab.models';
import { LocalStorageProvider } from '../../core/storage/local-storage.provider';
import { StaticLabRepository } from '../../core/repositories/static-lab.repository';

@Injectable({
  providedIn: 'root'
})
export class LabExecutionService {
  private storage = inject(LocalStorageProvider);
  private repository = inject(StaticLabRepository);

  private readonly EXECUTION_PREFIX = 'case_lab_exec_';

  // Carga un Lab y su ejecución actual si existe
  loadExecution(labId: string): LabExecution {
    const key = this.EXECUTION_PREFIX + labId;
    let exec = this.storage.get<LabExecution>(key);
    
    if (!exec) {
      const lab = this.repository.getById(labId);
      exec = {
        labId,
        userId: 'local-user',
        status: 'NOT_STARTED',
        currentStepId: lab?.steps[0]?.id
      };
      this.saveExecution(exec);
    }
    
    return exec;
  }

  private saveExecution(exec: LabExecution) {
    this.storage.set(this.EXECUTION_PREFIX + exec.labId, exec);
  }

  startLab(labId: string): LabExecution {
    const exec = this.loadExecution(labId);
    if (exec.status === 'NOT_STARTED') {
      exec.status = 'IN_PROGRESS';
      exec.startedAt = new Date().toISOString();
      this.saveExecution(exec);
    }
    return exec;
  }

  goToStep(labId: string, stepId: string): LabExecution {
    const exec = this.loadExecution(labId);
    exec.currentStepId = stepId;
    this.saveExecution(exec);
    return exec;
  }

  completeLab(labId: string): LabExecution {
    const exec = this.loadExecution(labId);
    exec.status = 'COMPLETED';
    exec.completedAt = new Date().toISOString();
    this.saveExecution(exec);
    return exec;
  }
}
