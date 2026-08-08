import { Injectable, inject, computed, Signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { NavigationContextService } from '../../services/navigation-context.service';
import { LIBRARY_CONFIG } from '../../../library/config/library.config';
import { LABS_CONFIG } from '../../../labs/config/labs.config';
import { LabDefinition } from '../../models/lab.models';
import { BreadcrumbItem } from '../../ui/components/case-breadcrumb/case-breadcrumb.component';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Workspace Manifest & Registry
 * Sprint 5 — Workspace Consolidation
 *
 * This is the OS layer of CASE.
 * Defines the contract for all Workspaces in the platform.
 * Contains ZERO logic about how to render; only defines structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExplorerItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  depth?: number;
  isActive?: boolean;
  isLocked?: boolean;
}

export interface ExplorerSection {
  id: string;
  title?: string;
  items: ExplorerItem[];
  collapsible?: boolean;
}

export interface ExplorerConfig {
  sections: ExplorerSection[];
}

export type BreadcrumbResolver = () => BreadcrumbItem[];

export interface WorkspaceMetadata {
  enabled: boolean;
  comingSoon?: boolean;
  experimental?: boolean;
  hidden?: boolean;
}

export interface WorkspaceCapabilities {
  explorer?: boolean;
  search?: boolean;
  commandPalette?: boolean;
  recentActivity?: boolean;
  notifications?: boolean;
}

export interface WorkspaceFeatures {
  aiAssistant?: boolean;
  projects?: boolean;
  multiplayer?: boolean;
}

export interface WorkspaceAppearance {
  accent?: string;
  icon?: string;
  badge?: string;
  logo?: string;
}

export interface WorkspaceAction {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  command?: string;
  primary?: boolean;
}

export interface WorkspaceDefinition {
  id: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  metadata: WorkspaceMetadata;
  
  // Future-proofing contracts (Sprint 6)
  capabilities?: WorkspaceCapabilities;
  features?: WorkspaceFeatures;
  appearance?: WorkspaceAppearance;
  primaryAction?: WorkspaceAction;
  secondaryActions?: WorkspaceAction[];

  explorerConfig?: () => ExplorerConfig;
  breadcrumbResolver?: BreadcrumbResolver;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LIBRARY_TYPE_ICON: Record<string, string> = {
  PROMPT:       'format_quote',
  TEMPLATE:     'description',
  ARCHITECTURE: 'account_tree',
  CHECKLIST:    'checklist',
  CONTEXT:      'psychology',
};

const LIBRARY_TYPE_LABEL: Record<string, string> = {
  PROMPT:       'Prompts',
  TEMPLATE:     'Templates',
  ARCHITECTURE: 'Arquitecturas',
  CHECKLIST:    'Checklists',
  CONTEXT:      'Contexto & Roles',
};

function resolveLabIcon(lab: LabDefinition): string {
  const techs = (lab.technologies ?? []).map(t => t.toLowerCase());
  if (techs.some(t => ['java', 'spring', 'python', 'fastapi', 'node'].includes(t))) return 'dns';
  if (techs.some(t => ['angular', 'react', 'typescript'].includes(t)))               return 'web';
  if (techs.some(t => ['docker', 'ci/cd', 'devops', 'git'].includes(t)))             return 'deployed_code';
  if (techs.some(t => ['genai', 'llm', 'openai', 'llms'].includes(t)))               return 'auto_awesome';
  return 'terminal';
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class WorkspaceRegistryService {
  private router        = inject(Router);
  private courseService = inject(CourseService);
  private navContext    = inject(NavigationContextService);

  // ── Reactive URL ──────────────────────────────────────────────────────────
  private currentUrl: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url || '/' },
  );

  // ── Workspace Definitions ─────────────────────────────────────────────────
  // Single Source of Truth for the entire Platform.

  readonly workspaces = computed<WorkspaceDefinition[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'grid_view',
      route: '/dashboard',
      order: 10,
      metadata: { enabled: true },
      capabilities: { recentActivity: true, search: true },
      breadcrumbResolver: () => [
        { label: 'Engineering Workspace', path: '/dashboard', icon: 'terminal' }
      ]
    },
    {
      id: 'academy',
      label: 'Academy',
      icon: 'school',
      route: '/academy/home',
      order: 20,
      metadata: { enabled: true },
      capabilities: { explorer: true, recentActivity: true },
      primaryAction: {
        id: 'academy-continue',
        label: 'Continuar curso',
        icon: 'play_arrow',
        route: '/academy/home',
        primary: true
      },
      explorerConfig: () => {
        const modules = this.courseService.getModules();
        const context = this.navContext.getContext()();
        const activeLessonId = context?.currentLesson?.id ?? null;

        return {
          sections: modules.map(mod => ({
            id: mod.id,
            title: mod.title,
            collapsible: true,
            items: mod.lessons.map(lesson => ({
              id: lesson.id,
              label: lesson.title,
              path: lesson.path,
              icon: 'article',
              depth: 1,
              isActive: lesson.id === activeLessonId,
              isLocked: mod.state === 'LOCKED' || mod.state === 'COMING_SOON',
            })),
          }))
        };
      },
      breadcrumbResolver: () => {
        const context = this.navContext.getContext()();
        const crumbs: BreadcrumbItem[] = [
          { label: 'Academy', path: '/academy/home', icon: 'school' }
        ];
        if (context?.module) {
          crumbs.push({ label: context.module.title, path: `/academy/home` });
        }
        if (context?.currentLesson) {
          crumbs.push({ label: context.currentLesson.title, path: context.currentLesson.path });
        }
        return crumbs;
      }
    },
    {
      id: 'library',
      label: 'Library',
      icon: 'library_books',
      route: '/library',
      order: 30,
      metadata: { enabled: true },
      capabilities: { explorer: true, search: true },
      primaryAction: {
        id: 'library-new',
        label: 'Nuevo recurso',
        icon: 'add',
        route: '/library',
        primary: true
      },
      explorerConfig: () => {
        const byType = new Map<string, typeof LIBRARY_CONFIG>();
        for (const resource of LIBRARY_CONFIG) {
          if (!byType.has(resource.type)) byType.set(resource.type, []);
          byType.get(resource.type)!.push(resource);
        }

        const sections: ExplorerSection[] = [];
        sections.push({
          id: 'library-home',
          items: [{ id: 'library-all', label: 'Todos los Recursos', path: '/library', icon: 'library_books' }],
        });

        for (const [type, resources] of byType) {
          sections.push({
            id: `library-${type.toLowerCase()}`,
            title: LIBRARY_TYPE_LABEL[type] ?? type,
            items: resources.map(r => ({
              id: r.id,
              label: String(r.title),
              path: `/library/${r.slug}`,
              icon: LIBRARY_TYPE_ICON[type] ?? 'description',
              depth: 1,
            })),
          });
        }
        return { sections };
      },
      breadcrumbResolver: () => {
        const url = this.currentUrl();
        const isResource = url.startsWith('/library/') && url.length > 9;
        
        const crumbs: BreadcrumbItem[] = [
          { label: 'Library', path: '/library', icon: 'library_books' }
        ];

        if (isResource) {
          const slug = url.split('/').pop()?.split('?')[0];
          const resource = LIBRARY_CONFIG.find(r => r.slug === slug);
          if (resource) {
            const typeLabel = LIBRARY_TYPE_LABEL[resource.type] ?? resource.type;
            crumbs.push({ label: typeLabel, path: '/library' });
            crumbs.push({ label: String(resource.title), path: url });
          }
        }
        return crumbs;
      }
    },
    {
      id: 'labs',
      label: 'Labs',
      icon: 'science',
      route: '/labs',
      order: 40,
      metadata: { enabled: true },
      capabilities: { explorer: true, search: true },
      primaryAction: {
        id: 'labs-new',
        label: 'Nuevo laboratorio',
        icon: 'add',
        route: '/labs',
        primary: true
      },
      explorerConfig: () => {
        return {
          sections: [
            {
              id: 'labs-home',
              items: [{ id: 'labs-all', label: 'CASE Labs', path: '/labs', icon: 'science' }],
            },
            {
              id: 'labs-real-engineering',
              title: 'Real Engineering Labs',
              items: [
                {
                  id: 'lab-01',
                  label: 'Lab 01 — Analyze a Legacy Routine',
                  path: '/academy/modules/m01-ai-foundations/lab-01-legacy-routine',
                  icon: 'terminal',
                  depth: 1,
                },
              ],
            },
          ]
        };
      },
      breadcrumbResolver: () => {
        const url = this.currentUrl();
        const isLab01 = url.startsWith('/academy/modules/m01-ai-foundations/lab-01-legacy-routine');

        const crumbs: BreadcrumbItem[] = [
          { label: 'Labs', path: '/labs', icon: 'science' }
        ];

        if (isLab01) {
          crumbs.push({ label: 'Lab 01 — Analyze a Legacy Routine', path: url });
        }
        return crumbs;
      }
    },
    {
      id: 'framework',
      label: 'Framework',
      icon: 'account_tree',
      route: '/framework',
      order: 50,
      metadata: { enabled: false, comingSoon: true }
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: 'smart_toy',
      route: '/agents',
      order: 60,
      metadata: { enabled: false, comingSoon: true }
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'folder_open',
      route: '/projects',
      order: 70,
      metadata: { enabled: false, comingSoon: true }
    }
  ]);

  // ── Active State ──────────────────────────────────────────────────────────

  readonly activeWorkspace = computed<WorkspaceDefinition | null>(() => {
    const url = this.currentUrl();
    const ws = this.workspaces();
    
    // Exact or prefix matching routing
    if (!url || url === '/') return ws.find(w => w.id === 'dashboard') || null;
    
    // Find matching workspace by route
    for (const workspace of ws) {
      if (workspace.route !== '/' && url.startsWith(workspace.route.split('/home')[0])) {
        return workspace;
      }
    }
    
    // Fallback specific matching
    if (url.startsWith('/clase') || url.startsWith('/plan-dev')) {
      return ws.find(w => w.id === 'academy') || null;
    }
    
    return ws.find(w => w.id === 'dashboard') || null;
  });

  // ── Public API (Consumers) ────────────────────────────────────────────────

  readonly explorerConfig = computed<{ icon: string, label: string, config: ExplorerConfig } | null>(() => {
    const active = this.activeWorkspace();
    if (!active || !active.explorerConfig) return null;
    return {
      icon: active.icon,
      label: active.label,
      config: active.explorerConfig()
    };
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const active = this.activeWorkspace();
    if (active && active.breadcrumbResolver) {
      return active.breadcrumbResolver();
    }
    // Fallback breadcrumb
    return [{ label: active?.label ?? 'Workspace', path: active?.route ?? '/dashboard', icon: active?.icon ?? 'terminal' }];
  });
}
