import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-production-checklist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './production-checklist.html',
  styleUrls: ['../../../shared-presentation.css']
})
export class ProductionChecklist {
}
