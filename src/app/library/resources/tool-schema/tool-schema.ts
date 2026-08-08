import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tool-schema',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tool-schema.html',
  styleUrls: ['../../../shared-presentation.css']
})
export class ToolSchema {
}
