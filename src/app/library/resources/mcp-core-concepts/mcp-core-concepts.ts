import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mcp-core-concepts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mcp-core-concepts.html',
  styleUrls: ['../../../shared-presentation.css']
})
export class McpCoreConcepts {
}
