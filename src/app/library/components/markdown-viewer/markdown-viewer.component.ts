import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked, Token } from 'marked';
import { CodeBlockComponent } from '../code-block/code-block.component';

export interface ParsedBlock {
  type: 'html' | 'code';
  content: string;
  language?: string;
}

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule, CodeBlockComponent],
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownViewerComponent implements OnChanges {
  @Input({ required: true }) markdown!: string | Record<string, string>;

  blocks = signal<ParsedBlock[]>([]);

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['markdown'] && this.markdown) {
      await this.parseMarkdown();
    }
  }

  private async parseMarkdown() {
    const rawContent = typeof this.markdown === 'string' ? this.markdown : (this.markdown['es'] || Object.values(this.markdown)[0] || '');
    
    // Configuramos marked para usar las opciones seguras básicas
    marked.use({
      gfm: true,
      breaks: true
    });

    const tokens = marked.lexer(rawContent);
    const parsedBlocks: ParsedBlock[] = [];

    let htmlBuffer = '';

    for (const token of tokens) {
      if (token.type === 'code') {
        // Si teníamos HTML acumulado, lo cerramos y pusheamos
        if (htmlBuffer.trim()) {
          parsedBlocks.push({ type: 'html', content: await marked.parse(htmlBuffer) });
          htmlBuffer = '';
        }
        // Pusheamos el bloque de código
        parsedBlocks.push({
          type: 'code',
          content: token.text,
          language: token.lang
        });
      } else {
        // Re-construimos el texto crudo para parsearlo como HTML después.
        htmlBuffer += token.raw;
      }
    }

    // Flushear lo que quede en el buffer
    if (htmlBuffer.trim()) {
      parsedBlocks.push({ type: 'html', content: await marked.parse(htmlBuffer) });
    }

    this.blocks.set(parsedBlocks);
  }
}
