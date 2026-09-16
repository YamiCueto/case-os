import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('M05 L05 Smoke Test — Planning & Task Decomposition & Taller Práctico Agent v4', () => {

  test('Desktop Validation: Complete Planning Flow, Experiences & Workshop Launchpad', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Navegación a la lección 05
    await page.goto('/#/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition');
    await page.waitForLoadState('networkidle');

    // 2. Verificación del Encabezado Técnico
    const mainTitle = page.locator('.living-doc-section__title').first();
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('El Problema Detonante: La Ceguera del Agente Reactivo');

    // 3. Verificación de AgentBuildingMap con stage="planning"
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const statusPill = buildingMap.locator('.status-text');
    await expect(statusPill).toContainText('L05 · Agent v4 (Planning)');

    // Nodos previos pasados (Decision, Tools, Loop, State & Memory)
    const passedNodes = buildingMap.locator('.map-node--passed');
    await expect(passedNodes).toHaveCount(4);

    // Nodo activo (Planning)
    const activeNode = buildingMap.locator('.map-node--active');
    await expect(activeNode).toHaveCount(1);
    await expect(activeNode).toContainText('Planning');

    // Nodos futuros (Guardrails, Observability)
    const futureNodes = buildingMap.locator('.map-node--future');
    await expect(futureNodes).toHaveCount(2);

    // 4. Experiencia 01: Reactive vs Planned
    const exp1 = page.locator('app-exp-reactive-vs-planned');
    await expect(exp1).toBeVisible();
    await expect(exp1.locator('.exp-title')).toContainText('Agente Reactivo vs Agente Planificador');

    // Alternar a modo planificador
    const plannedBtn = exp1.locator('.mode-btn').nth(1);
    await plannedBtn.click();
    await expect(plannedBtn).toHaveClass(/mode-btn--active/);
    await expect(exp1.locator('.board-pill--planned')).toBeVisible();

    // 5. Experiencia 02: Plan Inspector
    const exp2 = page.locator('app-exp-plan-inspector');
    await expect(exp2).toBeVisible();
    await expect(exp2.locator('.exp-title')).toContainText('El Plan como Estado Observable de Software');

    // Avanzar siguiente paso interactivo
    const stepBtn = exp2.locator('.btn-step');
    await expect(stepBtn).toContainText('Ejecutar Paso [S1]');
    await stepBtn.click();
    await page.waitForTimeout(600);

    const s1Card = exp2.locator('.plan-step-card').first();
    await expect(s1Card).toHaveAttribute('data-status', 'completed');
    await expect(s1Card.locator('.obs-code')).toBeVisible();

    // 6. Experiencia 03: Replanning Simulator
    const exp3 = page.locator('app-exp-replanning-simulator');
    await expect(exp3).toBeVisible();
    await expect(exp3.locator('.exp-title')).toContainText('Simulador de Replanning y Conservación de Historia');

    // Disparar contingencia (fallo 503 en S2)
    const triggerBtn = exp3.locator('.btn-action--trigger');
    await triggerBtn.click();
    await expect(exp3.locator('.decision-group')).toBeVisible();

    // Replanificar con software
    const replanBtn = exp3.locator('.btn-choice--primary');
    await replanBtn.click();
    await expect(exp3.locator('.revision-tabs')).toBeVisible();
    await expect(exp3.locator('.conclusion-success')).toBeVisible();

    // 7. Hero Card del Taller Práctico 05 y Descarga
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Taller: Evoluciona Agent v3 a Agent v4');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L05-taller-agent-v4.md');

    // Verificación de existencia del archivo público del taller 05
    const publicDocPath = path.resolve(process.cwd(), 'public/docs/M05-L05-taller-agent-v4.md');
    expect(fs.existsSync(publicDocPath)).toBe(true);

    const docContent = fs.readFileSync(publicDocPath, 'utf-8');
    expect(docContent).toContain('CASO G1');
    expect(docContent).toContain('CASO G2');
    expect(docContent).toContain('CASO G3');
    expect(docContent).toContain('StepExecutor');
    expect(docContent).toContain('no_executable_steps');
    expect(docContent).toContain('assert rev1.goal == rev2.goal');
    expect(docContent).toContain('PlanValidationError');
    expect(docContent).toContain('skip_reason');
    expect(docContent).toContain('StallMockPlanner');
  });

  test('Mobile Responsive Validation: No Overflow & Usable Touch Targets (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/#/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition');
    await page.waitForLoadState('networkidle');

    // Verificar que no haya overflow horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    // Verificar visibilidad de títulos clave
    const title = page.locator('.living-doc-section__title').first();
    await expect(title).toBeVisible();

    // Verificar que los botones del selector sean tocables
    const modeBtns = page.locator('app-exp-reactive-vs-planned .mode-btn');
    const firstBtn = modeBtns.first();
    await expect(firstBtn).toBeVisible();
    const box = await firstBtn.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('Table of Contents Navigation: Jumps to Section 04 smoothly and preserves route', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/#/academy/modules/m05-ai-agents/lesson-05-planning-task-decomposition');
    await page.waitForLoadState('networkidle');

    const outlineLink = page.locator('app-lesson-outline a[href*="taller-agent-v4"]');
    if (await outlineLink.count() > 0) {
      await outlineLink.first().click();
      await page.waitForTimeout(300);
      const targetSection = page.locator('#taller-agent-v4');
      await expect(targetSection).toBeVisible();
    }
  });

});
