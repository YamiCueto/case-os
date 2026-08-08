import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-token-playground',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './token-playground.html',
  styleUrls: ['../../shared-presentation.css']
})
export class TokenPlayground {
  inputText = signal('La ingeniería de software aplicada a la Inteligencia Artificial.');

  // Simulador MUY rudimentario de tokenización (heurística básica por sílabas/palabras)
  // En un sistema real usaríamos la librería tiktoken de OpenAI o similar
  tokens = computed(() => {
    const text = this.inputText();
    if (!text) return [];
    
    // Regexp simple: separa por espacios, puntuación, y camelCase para simular BPE
    const rawPieces = text.match(/([a-zA-ZáéíóúÁÉÍÓÚñÑ]+|[0-9]+|[^\s\w]+|\s+)/g) || [];
    
    return rawPieces.map((piece, i) => ({
      text: piece,
      // Luminosidad 22% → superficies oscuras diferenciables sobre background dark
      // Saturación 60% → diferenciación funcional/pedagógica, no decorativa
      color: `hsl(${(i * 137.5) % 360}, 60%, 22%)`,
      isSpace: /^\s+$/.test(piece)
    }));
  });

  estimatedTokens = computed(() => {
    return this.tokens().length;
  });

  estimatedCost = computed(() => {
    // Estimación: $0.15 por 1M de tokens (precio muy barato de input)
    return ((this.estimatedTokens() / 1000000) * 0.15).toFixed(6);
  });
}
