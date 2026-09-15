import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('M05 L03 Smoke Test — Agent Loop & Taller Práctico Agent v2', () => {
  const url = '/#/academy/modules/m05-ai-agents/lesson-03-agent-loop';

  test('Desktop Validation: Complete Agent Loop Flow, Experiences & Workshop Launchpad', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // 1. Verify Page & Building Map (Decision passed, Tools passed, Loop active)
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();
    await expect(buildingMap.locator('.map-node--active .map-label')).toHaveText('Loop');
    const passedNodes = buildingMap.locator('.map-node--passed .map-label');
    await expect(passedNodes.nth(0)).toHaveText('Decision');
    await expect(passedNodes.nth(1)).toHaveText('Tools');

    // 2. Experience 1: Why Agent v1 Stops
    const expWhyStops = page.locator('app-exp-why-agent-v1-stops');
    await expect(expWhyStops).toBeVisible();

    // Check trace timeline breakpoint
    await expect(expWhyStops.locator('.trace-step--broken')).toBeVisible();
    await expect(expWhyStops.locator('.code-line--fault')).toContainText('second_response.content');

    // Click on option D (Correct option)
    const optionD = expWhyStops.locator('.option-btn').filter({ has: page.locator('.option-letter', { hasText: 'D' }) });
    await optionD.click();
    await expect(expWhyStops.locator('.feedback-area')).toBeVisible();
    await expect(expWhyStops.locator('.feedback-area')).toContainText('Diagnóstico de Ingeniería Correcto');

    // 3. Experience 2: Agent Loop Inspector
    const expInspector = page.locator('app-exp-agent-loop-inspector');
    await expect(expInspector).toBeVisible();

    // Verify initial iteration (Iteration 1)
    await expect(expInspector.locator('.it-title')).toHaveText('Paso 1: Consultar Orden');
    await expect(expInspector.locator('.tool-name')).toHaveText('get_order_status');

    // Advance to Iteration 2
    const iter2Btn = expInspector.locator('.iteration-nav-btn').nth(1);
    await iter2Btn.click();
    await expect(expInspector.locator('.it-title')).toHaveText('Paso 2: Consultar Transportadora');
    await expect(expInspector.locator('.tool-name')).toHaveText('get_shipping_provider');

    // Advance to Iteration 3 (Final Answer)
    const nextStepBtn = expInspector.locator('.nav-step-btn--primary');
    await nextStepBtn.click();
    await expect(expInspector.locator('.it-title')).toHaveText('Paso 3: Síntesis Final');
    await expect(expInspector.locator('.final-text')).toBeVisible();

    // Toggle Raw Messages state inspector
    const toggleRawBtn = expInspector.locator('.toggle-raw-btn');
    await toggleRawBtn.click();
    await expect(expInspector.locator('.raw-messages-view')).toBeVisible();
    await expect(expInspector.locator('.raw-count')).toContainText('6 mensajes en contexto');

    // 4. Experience 3: Stop Conditions
    const expStop = page.locator('app-exp-stop-conditions');
    await expect(expStop).toBeVisible();

    // Select max_iterations = 1 (Should abort)
    const limit1Btn = expStop.locator('.limit-btn').filter({ has: page.locator('.limit-num', { hasText: '1' }) });
    await limit1Btn.click();
    await expect(expStop.locator('.sim-badge-group')).toContainText('ABORTADO POR RUNTIME');

    // Select max_iterations = 3 (Should succeed)
    const limit3Btn = expStop.locator('.limit-btn').filter({ has: page.locator('.limit-num', { hasText: '3' }) });
    await limit3Btn.click();
    await expect(expStop.locator('.sim-badge-group')).toContainText('FINAL ANSWER');

    // Select Looping/Failure scenario
    const loopingScenarioBtn = expStop.locator('.scenario-btn').filter({ hasText: 'Riesgo Crítico' });
    await loopingScenarioBtn.click();
    await expect(expStop.locator('.sim-badge-group')).toContainText('SALVAGUARDA ACTIVADA');

    // 5. Section 04: Practical Workshop Launchpad (Hero Card)
    const workshopSection = page.locator('#taller-practico-agent-v2');
    await expect(workshopSection).toBeVisible();
    await expect(workshopSection.locator('.living-doc-section__title')).toHaveText('04. Taller práctico — Evoluciona Agent v1 a Agent v2');

    const heroCard = workshopSection.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__badge-row')).toContainText('TALLER PRÁCTICO');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L03-taller-agent-v2.md');
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Evoluciona Agent v1 a Agent v2');

    // Verify technical pills
    const pills = heroCard.locator('.activity-hero-card__pills');
    await expect(pills).toContainText('Python 3.10+');
    await expect(pills).toContainText('Modo A: Sin API (Base)');
    await expect(pills).toContainText('Modo B: Proveedor Opcional');
    await expect(pills).toContainText('Grupos de estudio');
    await expect(pills).toContainText('60–75 min');

    // 6. Download Workshop Guide (.md)
    const downloadBtn = heroCard.locator('#btn-download-workshop');
    await expect(downloadBtn).toBeVisible();
    await downloadBtn.click();

    // Verify feedback alert
    const successAlert = heroCard.locator('.activity-hero-card__alert');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('Descarga iniciada con éxito');

    // Verify direct link
    const directLink = heroCard.locator('#btn-direct-download-workshop');
    await expect(directLink).toHaveAttribute('href', 'docs/M05-L03-taller-agent-v2.md');
    await expect(directLink).toHaveAttribute('download', 'M05-L03-taller-agent-v2.md');

    // 7. Verify public file actually exists on filesystem
    const publicFilePath = 'public/docs/M05-L03-taller-agent-v2.md';
    expect(fs.existsSync(publicFilePath)).toBe(true);
    const content = fs.readFileSync(publicFilePath, 'utf-8');
    expect(content).toContain('Taller Práctico — Evoluciona Agent v1 a Agent v2');
    expect(content).toContain('run_agent_v2');
    expect(content).toContain('max_iterations');

    // 8. Verify No Console Errors
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('status of 404')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('Mobile Responsive Validation: No Overflow & Usable Touch Targets', async ({ page }) => {
    // iPhone 14 Pro viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);

    // Verify page loads without horizontal scroll
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBe(false);

    // Verify Agent Building Map renders compactly
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    // Verify Workshop Hero Card adapts cleanly to mobile
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    const downloadBtn = heroCard.locator('#btn-download-workshop');
    await expect(downloadBtn).toBeVisible();

    // Verify experiences are visible and contained
    await expect(page.locator('app-exp-why-agent-v1-stops')).toBeVisible();
    await expect(page.locator('app-exp-agent-loop-inspector')).toBeVisible();
    await expect(page.locator('app-exp-stop-conditions')).toBeVisible();
  });
});
