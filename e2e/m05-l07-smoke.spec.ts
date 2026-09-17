import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('M05 L07 Smoke Test — Observabilidad & Evaluación Agéntica & Taller Práctico Agent v6', () => {

  test('Desktop Validation: Complete Observability Flow, Experiences & Workshop Launchpad', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navegación a la lección 07
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-07-observability-evaluation');
    await page.waitForLoadState('networkidle');

    // 2. Verificación del encabezado técnico
    const mainTitle = page.locator('.living-doc-section__title').first();
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('El Problema: El Agente Gobernado Que Nadie Puede Auditar');

    // 3. Verificación de AgentBuildingMap con stage="observability"
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const statusPill = buildingMap.locator('.status-text');
    await expect(statusPill).toContainText('L07 · Agent v6 (Observability & Eval)');

    // 6 Nodos previos pasados (Decision, Tools, Loop, State & Memory, Planning, Guardrails & HITL)
    const passedNodes = buildingMap.locator('.map-node--passed');
    await expect(passedNodes).toHaveCount(6);

    // 1 Nodo activo (Observability & Eval)
    const activeNode = buildingMap.locator('.map-node--active');
    await expect(activeNode).toHaveCount(1);
    await expect(activeNode).toContainText('Observability & Eval');

    // 4. Experiencia 01: Trace Explorer
    const exp1 = page.locator('app-exp-trace-explorer');
    await expect(exp1).toBeVisible();
    await expect(exp1.locator('.exp-title')).toContainText('Anatomía Temporal de una Corrida Agéntica');

    // Verificar filtro por MODEL
    const modelFilter = exp1.locator('#filter-tab-model');
    await modelFilter.click();
    await expect(modelFilter).toHaveClass(/filter-tab--active/);

    // Verificar timeline visible
    const timelineBody = exp1.locator('.timeline-body');
    await expect(timelineBody).toBeVisible();

    // Click en un evento TOOL_CALLED para abrir el inspector
    const toolFilter = exp1.locator('#filter-tab-tool');
    await toolFilter.click();
    const firstToolRow = exp1.locator('.timeline-row').first();
    await firstToolRow.click();
    await expect(exp1.locator('#event-inspector-panel')).toBeVisible();

    // Verificar run_id en el inspector
    const runIdField = exp1.locator('.run-id-highlight');
    await expect(runIdField).toBeVisible();
    await expect(runIdField).toContainText('run-abc-9f3e2d');

    // Verificar sequence_no en inspector
    const seqField = exp1.locator('.seq-highlight');
    await expect(seqField).toBeVisible();

    // Verificar correlation banner
    const corrBanner = exp1.locator('.correlation-banner');
    await expect(corrBanner).toBeVisible();
    await expect(corrBanner).toContainText('run_id');

    // 5. Experiencia 02: Run Comparison
    const exp2 = page.locator('app-exp-run-comparison');
    await expect(exp2).toBeVisible();
    await expect(exp2.locator('.exp-title')).toContainText('Outcome vs Trajectory');

    // Verificar disclaimer de simulación
    await expect(exp2.locator('#sim-disclaimer')).toContainText('SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS');

    // Verificar respuesta final compartida visible
    const sharedOutcome = exp2.locator('.shared-outcome');
    await expect(sharedOutcome).toBeVisible();

    // Navegar a la pestaña de Timeline
    const timelineTab = exp2.locator('#tab-timeline');
    await timelineTab.click();
    await expect(timelineTab).toHaveClass(/view-tab--active/);
    await expect(exp2.locator('.timeline-compare')).toBeVisible();

    // Navegar a la pestaña de Veredicto
    const verdictTab = exp2.locator('#tab-verdict');
    await verdictTab.click();
    await expect(verdictTab).toHaveClass(/view-tab--active/);
    await expect(exp2.locator('#verdict-run-a')).toBeVisible();
    await expect(exp2.locator('#verdict-run-b')).toBeVisible();

    // 6. Experiencia 03: Evaluation Lab
    const exp3 = page.locator('app-exp-evaluation-lab');
    await expect(exp3).toBeVisible();
    await expect(exp3.locator('.exp-title')).toContainText('Golden Cases y Evaluación Determinista');

    // Verificar 5 Golden Cases en estado pending
    const caseCards = exp3.locator('.case-card');
    await expect(caseCards).toHaveCount(5);

    // Ejecutar suite de evaluación
    const runSuiteBtn = exp3.locator('#btn-run-evaluation-suite');
    await expect(runSuiteBtn).toBeVisible();
    await runSuiteBtn.click();

    // Esperar que la suite termine (5 casos × 500ms + 300ms + margen)
    await page.waitForTimeout(4000);

    // Scroll para asegurar que el summary panel esté en viewport
    await page.locator('app-exp-evaluation-lab').locator('.suite-header').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verificar que el resumen de suite aparece con PASS
    const suiteSummary = exp3.locator('#suite-summary-panel');
    await expect(suiteSummary).toBeVisible({ timeout: 8000 });

    // Al menos un caso expandible con métricas
    const firstCase = exp3.locator('.case-card').first();
    await firstCase.click();
    await expect(exp3.locator('.metrics-grid').first()).toBeVisible();

    // 7. Hero Card del Taller Práctico 07 y Descarga
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Taller: Evoluciona Agent v5 a Agent v6');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L07-taller-agent-v6.md');

    // Verificar existencia del archivo público del taller 07
    const publicDocPath = path.resolve(process.cwd(), 'public/docs/M05-L07-taller-agent-v6.md');
    expect(fs.existsSync(publicDocPath)).toBe(true);

    const docContent = fs.readFileSync(publicDocPath, 'utf-8');
    expect(docContent).toContain('CASO I1');
    expect(docContent).toContain('CASO I2');
    expect(docContent).toContain('CASO I3');
    expect(docContent).toContain('CASO I4');
    expect(docContent).toContain('CASO I5');
    expect(docContent).toContain('TraceEvent');
    expect(docContent).toContain('InMemoryTraceCollector');
    expect(docContent).toContain('sequence_no');
    expect(docContent).toContain('RunSummary');
    expect(docContent).toContain('from_events');
    expect(docContent).toContain('EvaluationCase');
    expect(docContent).toContain('AgentEvaluator');
    expect(docContent).toContain('post_approval_revalidation');
    expect(docContent).toContain('SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS');

    // Verificar botón de descarga
    const downloadBtn = page.locator('#btn-download-workshop-l07');
    await expect(downloadBtn).toBeVisible();

    // Cero errores de consola fatales
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('404') &&
      !err.toLowerCase().includes('warning')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('Mobile Responsiveness: 390x844 Viewport without Horizontal Overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-07-observability-evaluation');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verificar que no hay desbordamiento horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    // Building Map y Experiences visibles en móvil
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const exp1 = page.locator('app-exp-trace-explorer');
    await expect(exp1).toBeVisible();

    const exp3 = page.locator('app-exp-evaluation-lab');
    await expect(exp3).toBeVisible();

    // Hero Card visible en móvil
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
  });

  test('AgentBuildingMap stage=observability: 6 passed, 1 active, 0 future nodes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-07-observability-evaluation');
    await page.waitForLoadState('networkidle');

    const buildingMap = page.locator('app-agent-building-map').first();

    // L07 es el último stage: todos los nodos anteriores deben estar passed
    // (Decision, Tools, Loop, State & Memory, Planning, Guardrails & HITL) = 6 passed
    const passedNodes = buildingMap.locator('.map-node--passed');
    await expect(passedNodes).toHaveCount(6);

    // 1 activo (Observability & Eval)
    const activeNodes = buildingMap.locator('.map-node--active');
    await expect(activeNodes).toHaveCount(1);
    await expect(activeNodes).toContainText('Observability & Eval');

    // 0 futuros (L07 es el último stage del mapa)
    const futureNodes = buildingMap.locator('.map-node--future');
    await expect(futureNodes).toHaveCount(0);
  });

});
