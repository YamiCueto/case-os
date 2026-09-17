import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('M05 L06 Smoke Test — Guardrails & Human-in-the-Loop & Taller Práctico Agent v5', () => {

  test('Desktop Validation: Complete Guardrails Flow, Experiences & Workshop Launchpad', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navegación a la lección 06
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl');
    await page.waitForLoadState('networkidle');

    // 2. Verificación del Encabezado Técnico
    const mainTitle = page.locator('.living-doc-section__title').first();
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('El Problema Detonante: Capacidad no Implica Autoridad');

    // 3. Verificación de AgentBuildingMap con stage="guardrails"
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const statusPill = buildingMap.locator('.status-text');
    await expect(statusPill).toContainText('L06 · Agent v5 (Guardrails & HITL)');

    // 5 Nodos previos pasados (Decision, Tools, Loop, State & Memory, Planning)
    const passedNodes = buildingMap.locator('.map-node--passed');
    await expect(passedNodes).toHaveCount(5);

    // 1 Nodo activo (Guardrails & HITL)
    const activeNode = buildingMap.locator('.map-node--active');
    await expect(activeNode).toHaveCount(1);
    await expect(activeNode).toContainText('Guardrails & HITL');

    // 1 Nodo futuro (Observability & Eval)
    const futureNodes = buildingMap.locator('.map-node--future');
    await expect(futureNodes).toHaveCount(1);
    await expect(futureNodes).toContainText('Observability & Eval');

    // 4. Experiencia 01: Permission Boundary
    const exp1 = page.locator('app-exp-permission-boundary');
    await expect(exp1).toBeVisible();
    await expect(exp1.locator('.exp-title')).toContainText('Capacidad vs Autoridad: Tool Registry vs Tool Policy');

    // Alternar a vista de política
    const policyTab = exp1.locator('.mode-tab').nth(1);
    await policyTab.click();
    await expect(policyTab).toHaveClass(/mode-tab--active/);
    await expect(exp1.locator('.policy-table')).toBeVisible();

    // Alternar a vista de evaluador live
    const evalTab = exp1.locator('.mode-tab').nth(2);
    await evalTab.click();
    await expect(evalTab).toHaveClass(/mode-tab--active/);
    await expect(exp1.locator('.eval-result-card')).toBeVisible();

    // 5. Experiencia 02: Human Approval Gate
    const exp2 = page.locator('app-exp-human-approval-gate');
    await expect(exp2).toBeVisible();
    await expect(exp2.locator('.exp-title')).toContainText('Compuerta de Aprobación, Action Binding y Precondiciones');

    // Iniciar paso S3 (transfer_funds)
    const startS3Btn = exp2.locator('.btn-primary');
    await startS3Btn.click();
    await expect(exp2.locator('.proposal-card')).toBeVisible();
    await expect(exp2.locator('.runtime-status-bar')).toHaveAttribute('data-status', 'PAUSED_FOR_APPROVAL');

    // Probar sabotaje de mutación de argumentos (TOCTOU)
    const mutateBtn = exp2.locator('.btn-sim--mutate');
    await mutateBtn.click();
    await expect(exp2.locator('.runtime-status-bar')).toHaveAttribute('data-status', 'BLOCKED');
    await expect(exp2.locator('.banner-heading')).toContainText('FINGERPRINT_MISMATCH');

    // Reiniciar compuerta
    const resetGateBtn = exp2.locator('.btn-reset');
    await resetGateBtn.click();
    await expect(exp2.locator('.idle-placeholder')).toBeVisible();

    // Re-iniciar y Aprobar legítimamente
    await exp2.locator('.btn-primary').click();
    const approveBtn = exp2.locator('.btn-approve');
    await approveBtn.click();
    await expect(exp2.locator('.runtime-status-bar')).toHaveAttribute('data-status', 'RESUMED');
    await expect(exp2.locator('.consumed-badge--active')).toBeVisible();

    // Probar ataque de replay sobre la aprobación ya consumida
    const replayBtn = exp2.locator('.btn-replay');
    await replayBtn.click();
    await expect(exp2.locator('.banner-heading')).toContainText('APPROVAL_REPLAY_DETECTED');

    // 6. Experiencia 03: Budget Circuit Breaker
    const exp3 = page.locator('app-exp-budget-circuit-breaker');
    await expect(exp3).toBeVisible();
    await expect(exp3.locator('.exp-title')).toContainText('Control Operacional de Presupuestos y Disyuntores');

    // Verificar rotulado didáctico explícito
    await expect(exp3.locator('.didactic-badge-strip')).toContainText('SIMULACIÓN DIDÁCTICA / VALORES ILUSTRATIVOS');

    // Ejecutar iteración normal
    const normalStepBtn = exp3.locator('.btn-control--success');
    await normalStepBtn.click();
    await expect(exp3.locator('.log-table tbody tr')).toHaveCount(2);

    // Provocar exceso de presupuesto
    const overrunBtn = exp3.locator('.btn-control--danger');
    await overrunBtn.click();
    await expect(exp3.locator('.circuit-pill')).toHaveAttribute('data-circuit', 'OPEN');
    await expect(exp3.locator('.counter-val--term')).toContainText('budget_exceeded');

    // 7. Hero Card del Taller Práctico 06 y Descarga
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Taller: Evoluciona Agent v4 a Agent v5');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L06-taller-agent-v5.md');

    // Verificación de existencia del archivo público del taller 06
    const publicDocPath = path.resolve(process.cwd(), 'public/docs/M05-L06-taller-agent-v5.md');
    expect(fs.existsSync(publicDocPath)).toBe(true);

    const docContent = fs.readFileSync(publicDocPath, 'utf-8');
    expect(docContent).toContain('CASO H1');
    expect(docContent).toContain('CASO H2');
    expect(docContent).toContain('CASO H3');
    expect(docContent).toContain('CASO H4');
    expect(docContent).toContain('CASO H5a');
    expect(docContent).toContain('CASO H5b');
    expect(docContent).toContain('CASO H6');
    expect(docContent).toContain('PolicyEvaluator');
    expect(docContent).toContain('ActionProposal');
    expect(docContent).toContain('compute_action_fingerprint');
    expect(docContent).toContain('approval_replay_detected');
    expect(docContent).toContain('fingerprint_mismatch');
    expect(docContent).toContain('consumed_proposal_ids');

    // Cero errores de consola fatales
    const criticalErrors = consoleErrors.filter(err => !err.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('Mobile Responsiveness: 390x844 Viewport without Horizontal Overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-06-guardrails-hitl');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verificar que no hay desbordamiento horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // margen mínimo de tolerancia

    // Building Map y Hero Card visibles en móvil
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
  });

});
