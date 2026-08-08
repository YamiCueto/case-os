import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContextItem {
  id: string;
  label: string;
  description: string;
  size: number;
  selected: boolean;
  isRequired: boolean;
}

@Component({
  selector: 'app-demo-engineer-context',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './demo-engineer-context.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoEngineerContext {
  maxBudget = 100;

  items = signal<ContextItem[]>([
    { id: 'user', label: 'User & Auth State', description: 'Rol, permisos e ID de usuario activo', size: 10, selected: false, isRequired: true },
    { id: 'app', label: 'Application State', description: 'Pantalla activa: "Factura #552 (Pendiente)"', size: 15, selected: false, isRequired: true },
    { id: 'history', label: 'Historial Completo (50 msgs)', description: 'Basura histórica no relacionada', size: 55, selected: false, isRequired: false },
    { id: 'history_recent', label: 'Historial Reciente (2 msgs)', description: 'Última pregunta: "¿Puedo cancelar esta?"', size: 15, selected: false, isRequired: true },
    { id: 'rag', label: 'Regla de Negocio / Policy', description: 'Política de cancelación de facturas', size: 30, selected: false, isRequired: true },
    { id: 'noise', label: 'Promociones / Marketing', description: 'Detalles de la campaña comercial activa', size: 25, selected: false, isRequired: false }
  ]);

  currentUsage = computed(() => {
    return this.items().filter(i => i.selected).reduce((acc, curr) => acc + curr.size, 0);
  });

  budgetExceeded = computed(() => this.currentUsage() > this.maxBudget);

  progressWidth = computed(() => {
    const p = (this.currentUsage() / this.maxBudget) * 100;
    return p > 100 ? 100 : p;
  });

  isSuccess = computed(() => {
    if (this.budgetExceeded()) return false;
    const requiredSelected = this.items().filter(i => i.isRequired && i.selected).length;
    const totalRequired = this.items().filter(i => i.isRequired).length;
    const noisySelected = this.items().filter(i => !i.isRequired && i.selected).length;
    return requiredSelected === totalRequired && noisySelected === 0;
  });

  toggleSelection(item: ContextItem) {
    this.items.update(currentItems => {
      return currentItems.map(i => {
        if (i.id === item.id) {
          return { ...i, selected: !i.selected };
        }
        return i;
      });
    });
  }
}
