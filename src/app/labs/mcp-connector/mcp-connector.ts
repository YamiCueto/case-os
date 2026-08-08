import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Capability {
  type: 'RESOURCE' | 'TOOL';
  name: string;
  description: string;
  permissionRequired: boolean;
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
  selector: 'app-mcp-connector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mcp-connector.html',
  styleUrls: ['./mcp-connector.css']
})
export class McpConnectorLab {
  architectureMode = signal<'LEGACY' | 'MCP'>('LEGACY');

  servers = signal<ServerDef[]>([
    {
      id: 'github',
      name: 'GitHub',
      icon: '🐙',
      url: 'mcp://github.internal',
      connected: false,
      capabilities: [
        { type: 'RESOURCE', name: 'github://repo/issues', description: 'Listado de issues activos (Read-Only)', permissionRequired: false },
        { type: 'TOOL', name: 'github_create_pr', description: 'Crear un nuevo Pull Request', permissionRequired: true }
      ]
    },
    {
      id: 'jira',
      name: 'Jira',
      icon: '🎫',
      url: 'mcp://jira.corp',
      connected: false,
      capabilities: [
        { type: 'RESOURCE', name: 'jira://board/sprint-active', description: 'Estado del sprint actual', permissionRequired: false },
        { type: 'TOOL', name: 'jira_transition_issue', description: 'Cambiar estado de un ticket', permissionRequired: true }
      ]
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: '🐘',
      url: 'mcp://db.prod',
      connected: false,
      capabilities: [
        { type: 'RESOURCE', name: 'postgres://schema/public', description: 'Esquema de la base de datos', permissionRequired: false },
        { type: 'TOOL', name: 'postgres_execute_query', description: 'Ejecutar query SQL arbitraria', permissionRequired: true }
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
      alert(`[Legacy Mode]\nPara conectar ${server.name} necesitas escribir un cliente REST customizado, manejar OAuth, programar el polling de webhooks y formatear los datos al prompt del agente. (Aprox. 500 líneas de código).`);
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
