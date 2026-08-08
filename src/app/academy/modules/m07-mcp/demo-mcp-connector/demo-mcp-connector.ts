import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Capability {
  type: 'RESOURCE' | 'TOOL';
  name: string;
  description: string;
  isDangerous: boolean;
  status: 'EXPOSED' | 'RESTRICTED' | 'HIDDEN';
}

interface ServerDef {
  id: string;
  name: string;
  icon: string;
  url: string;
  capabilities: Capability[];
  connected: boolean;
}

@Component({
  selector: 'app-demo-mcp-connector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './demo-mcp-connector.html',
  styleUrls: ['../../../../shared-presentation.css']
})
export class DemoMcpConnector {
  architectureMode = signal<'LEGACY' | 'MCP'>('LEGACY');

  servers = signal<ServerDef[]>([
    {
      id: 'mysql-cfa',
      name: 'MySQL Local (CFA)',
      icon: '🐬',
      url: 'mcp://mysql.local',
      connected: false,
      capabilities: [
        { type: 'RESOURCE', name: 'mysql://localhost/cfa/schema', description: 'Esquema de la base de datos (Read-Only)', isDangerous: false, status: 'EXPOSED' },
        { type: 'RESOURCE', name: 'mysql://localhost/cfa/table/customers', description: 'Datos tabla Customers (Read-Only)', isDangerous: false, status: 'EXPOSED' },
        { type: 'TOOL', name: 'execute_sql(query)', description: 'Ejecutar query SQL arbitraria (Peligroso, superficie excesiva)', isDangerous: true, status: 'HIDDEN' },
        { type: 'TOOL', name: 'get_customer_status(customer_id)', description: 'Consultar estado específico de un cliente (Least Privilege)', isDangerous: false, status: 'EXPOSED' },
        { type: 'TOOL', name: 'delete_customer_record(customer_id)', description: 'Eliminar cliente (Requiere Human Approval)', isDangerous: true, status: 'RESTRICTED' }
      ]
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '🐙',
      url: 'mcp://github.internal',
      connected: false,
      capabilities: [
        { type: 'RESOURCE', name: 'github://repo/issues', description: 'Listado de issues activos', isDangerous: false, status: 'EXPOSED' },
        { type: 'TOOL', name: 'github_create_pr()', description: 'Crear un nuevo Pull Request', isDangerous: false, status: 'RESTRICTED' }
      ]
    }
  ]);

  pendingConnection = signal<ServerDef | null>(null);

  get availableResources() {
    return this.servers().filter(s => s.connected).flatMap(s => s.capabilities.filter(c => c.type === 'RESOURCE').map(c => ({...c, server: s.name})));
  }

  get availableTools() {
    return this.servers().filter(s => s.connected).flatMap(s => s.capabilities.filter(c => c.type === 'TOOL').map(c => ({...c, server: s.name})));
  }

  setMode(mode: 'LEGACY' | 'MCP') {
    this.architectureMode.set(mode);
    this.resetConnections();
  }

  initiateConnection(server: ServerDef) {
    if (this.architectureMode() === 'LEGACY') {
      alert(`[Legacy Mode]\nPara conectar ${server.name} al Agente, necesitas escribir un cliente REST customizado, manejar autenticación manualmente en tu script, y formatear los datos tú mismo. Cada integración es única y acopla al agente a la infraestructura.`);
    } else {
      this.pendingConnection.set(server);
    }
  }

  approveConnection() {
    const srv = this.pendingConnection();
    if (srv) {
      this.servers.update(arr => arr.map(s => s.id === srv.id ? { ...s, connected: true } : s));
    }
    this.pendingConnection.set(null);
  }

  cancelConnection() {
    this.pendingConnection.set(null);
  }

  resetConnections() {
    this.servers.update(arr => arr.map(s => ({ ...s, connected: false })));
    this.pendingConnection.set(null);
  }
}
