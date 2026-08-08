import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FileNode {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-ai-coder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ai-coder.html',
  styleUrls: ['./ai-coder.css']
})
export class AiCoderLab {
  files = signal<FileNode[]>([
    { name: 'auth.component.ts', selected: false },
    { name: 'auth.service.ts', selected: false },
    { name: 'utils.ts', selected: false },
    { name: 'package.json', selected: false },
    { name: 'README.md', selected: false }
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
        this.patchMessage.set('Agregada validación de UI en auth.component.ts para mostrar mensaje genérico si falla el login. (El agente no pudo ver auth.service.ts, por lo que no arregló la llamada HTTP real).');
      } else if (selectedFiles.length === 2 && selectedFiles.includes('auth.component.ts') && selectedFiles.includes('auth.service.ts')) {
        this.contextType.set('CORRECT');
        this.patchMessage.set('Agregado encodeURIComponent(email) en auth.service.ts antes de hacer el POST. Actualizado auth.component.ts para manejar el nuevo formato.');
      } else if (selectedFiles.length > 2) {
        this.contextType.set('EXCESSIVE');
        this.patchMessage.set('Refactorización masiva de Utils, AuthComponent y AuthService. Agregadas dependencias sugeridas basadas en package.json. (El agente se distrajo con información irrelevante y propuso cambios drásticos).');
      } else {
        this.contextType.set('INSUFFICIENT');
        this.patchMessage.set('El agente alucinó una librería externa para manejar la autenticación porque no tenía el contexto de cómo lo hace actualmente tu app.');
      }
      this.status.set('VERIFYING');
    }, 1500);
  }

  runTests() {
    if (this.contextType() === 'INSUFFICIENT') {
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
