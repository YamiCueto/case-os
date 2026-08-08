import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FileNode {
  name: string;
  selected: boolean;
  type: 'component' | 'service' | 'utils' | 'config' | 'doc';
}

@Component({
  selector: 'app-demo-ai-coder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-ai-coder.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoAiCoder {
  files = signal<FileNode[]>([
    { name: 'auth.component.ts', selected: false, type: 'component' },
    { name: 'auth.service.ts', selected: false, type: 'service' },
    { name: 'utils.ts', selected: false, type: 'utils' },
    { name: 'package.json', selected: false, type: 'config' },
    { name: 'README.md', selected: false, type: 'doc' }
  ]);

  status = signal<'SELECTING' | 'GENERATING' | 'VERIFYING' | 'REVIEWING' | 'SUCCESS'>('SELECTING');
  
  patchMessage = signal('');
  testResult = signal<'PENDING' | 'PASS' | 'FAIL'>('PENDING');
  contextType = signal<'INSUFFICIENT' | 'CORRECT' | 'EXCESSIVE' | null>(null);

  toggleFile(index: number) {
    if (this.status() !== 'SELECTING') return;
    this.files.update(fs => {
      fs[index].selected = !fs[index].selected;
      return [...fs];
    });
  }

  generatePatch() {
    const selectedFiles = this.files().filter(f => f.selected).map(f => f.name);
    
    if (selectedFiles.length === 0) {
      alert("Selecciona al menos un archivo para el contexto.");
      return;
    }

    this.status.set('GENERATING');
    this.testResult.set('PENDING');

    setTimeout(() => {
      if (selectedFiles.length === 1 && selectedFiles.includes('auth.component.ts')) {
        this.contextType.set('INSUFFICIENT');
        this.patchMessage.set('Result: Missing dependency / Incorrect assumption.\n\nAI modified auth.component.ts but assumed a non-existent HTTP method in auth.service.ts because it was excluded from context. The component will compile but fail at runtime.');
      } else if (selectedFiles.length === 2 && selectedFiles.includes('auth.component.ts') && selectedFiles.includes('auth.service.ts')) {
        this.contextType.set('CORRECT');
        this.patchMessage.set('Result: Relevant dependencies / Scoped change.\n\nAI successfully updated auth.service.ts to handle the new format, and properly wired the response in auth.component.ts. Diff is verifiable and clean.');
      } else if (selectedFiles.length > 2) {
        this.contextType.set('EXCESSIVE');
        this.patchMessage.set('Result: Scope expansion / Unrequested refactoring.\n\nAI updated auth logic, but also hallucinated a massive refactor of utils.ts and attempted to bump dependencies in package.json. Risk of breaking existing tests is high.');
      } else {
        this.contextType.set('INSUFFICIENT');
        this.patchMessage.set('Result: Hallucinated implementation.\n\nAI invented a completely new authentication library because it lacked the actual component/service context.');
      }
      this.status.set('VERIFYING');
    }, 1500);
  }

  runTests() {
    if (this.contextType() === 'INSUFFICIENT' || this.contextType() === 'EXCESSIVE') {
      this.testResult.set('FAIL');
      setTimeout(() => {
        this.status.set('SELECTING');
      }, 3000);
    } else {
      this.testResult.set('PASS');
      this.status.set('REVIEWING');
    }
  }

  approve() {
    this.status.set('SUCCESS');
  }

  reject() {
    this.status.set('SELECTING');
    this.patchMessage.set('');
    this.testResult.set('PENDING');
  }

  resetLab() {
    this.files.update(fs => fs.map(f => ({ ...f, selected: false })));
    this.status.set('SELECTING');
    this.patchMessage.set('');
    this.testResult.set('PENDING');
    this.contextType.set(null);
  }
}
