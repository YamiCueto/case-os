import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('M05 L02 Smoke Test — Tool Calling & Taller Práctico Agent v1', () => {
  const url = '/#/academy/modules/m05-ai-agents/lesson-02-tool-calling';

  test('Desktop Validation: Complete Tool Calling Flow, Experiences & Workshop Launchpad', async ({ page }) => {
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

    // 1. Verify Page & Building Map (Decision passed, Tools active)
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();
    await expect(buildingMap.locator('.map-node--active .map-label')).toHaveText('Tools');
    await expect(buildingMap.locator('.map-node--passed .map-label')).toHaveText('Decision');

    // 2. Experience 1: Tool Anatomy
    const expAnatomy = page.locator('app-exp-tool-anatomy');
    await expect(expAnatomy).toBeVisible();
    
    // Toggle tab to Python
    const pythonTabBtn = expAnatomy.locator('button:has-text("Función en Python")');
    await pythonTabBtn.click();
    await expect(expAnatomy.locator('.python-view')).toBeVisible();

    // Toggle back to Schema
    const schemaTabBtn = expAnatomy.locator('button:has-text("Tool Schema")');
    await schemaTabBtn.click();
    await expect(expAnatomy.locator('.schema-view')).toBeVisible();

    // Click classification button in first item
    const readBtn = expAnatomy.locator('button:has-text("Lectura (Idempotente)")').first();
    await readBtn.click();
    await expect(expAnatomy.locator('.item-feedback').first()).toBeVisible();

    // 3. Experience 2: Tool Calling Inspector (Central Experience)
    const expInspector = page.locator('app-exp-tool-calling-inspector');
    await expect(expInspector).toBeVisible();

    // Verify initial step (USER)
    await expect(expInspector.locator('.phase-title')).toContainText('Paso 1: Emisión de la Petición');

    // Advance step with "Siguiente"
    const nextBtn = expInspector.locator('button:has-text("Siguiente →")');
    await nextBtn.click();
    await expect(expInspector.locator('.phase-title')).toContainText('Paso 2');

    // Click directly on Step 5 (EXECUTION)
    const step5Node = expInspector.locator('.step-node').nth(4);
    await step5Node.click();
    await expect(expInspector.locator('.phase-title')).toContainText('Paso 5: Ejecución Controlada en Runtime Python');
    await expect(expInspector.locator('.owner-pill--runtime')).toBeVisible();

    // Switch scenario to Cancellation (Side-Effect)
    const scenarioBtn = expInspector.locator('button:has-text("Cancelación con Side-Effect")');
    await scenarioBtn.click();
    await expect(expInspector.locator('.query-text')).toContainText('Cancela de inmediato mi orden ORD-8812');

    // 4. Experience 3: Tool Boundary Sandbox
    const expBoundary = page.locator('app-exp-tool-boundary');
    await expect(expBoundary).toBeVisible();

    // Switch to Schema Error case
    const schemaErrorBtn = expBoundary.locator('button:has-text("Caso 2: Argumento Malformado")');
    await schemaErrorBtn.click();
    await expect(expBoundary.locator('.validation-warning')).toBeVisible();
    await expect(expBoundary.locator('.validation-status-row')).toContainText('Error de validación');
    await expect(expBoundary.locator('.sandbox-header')).toContainText('Fallo de Schema');

    // 5. Section 04: Practical Workshop Launchpad (Hero Card)
    const workshopSection = page.locator('#taller-practico-agent-v1');
    await expect(workshopSection).toBeVisible();
    await expect(workshopSection.locator('.living-doc-section__title')).toHaveText('04. Taller práctico — Construye tu primer Agent v1');

    const heroCard = workshopSection.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__badge-row')).toContainText('TALLER PRÁCTICO');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L02-taller-agent-v1.md');
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Construye tu primer Agent v1');

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

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);

    expect(download.suggestedFilename()).toBe('M05-L02-taller-agent-v1.md');
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('# M05 · Taller Práctico — Construye tu primer Agent v1');
      expect(content).toContain('MockModelProvider');
      expect(content).toContain('TOOL_REGISTRY');
      expect(content).toContain('HOPS DE EJECUCION');
      expect(content).toContain('requirements-real-provider.txt');
    }

    // Success alert feedback
    const alertBox = heroCard.locator('.activity-hero-card__alert');
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText('Descarga iniciada con éxito');

    // Direct download link
    const directLink = heroCard.locator('#btn-direct-download-workshop');
    await expect(directLink).toBeVisible();
    await expect(directLink).toHaveAttribute('href', 'docs/M05-L02-taller-agent-v1.md');

    expect(consoleErrors).toEqual([]);
  });

  test('Mobile Validation: Responsive & Usable Layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);

    // Verify Page & Building Map
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    // Scroll to inspector and ensure stepper is scrollable/visible
    const expInspector = page.locator('app-exp-tool-calling-inspector');
    await expInspector.scrollIntoViewIfNeeded();
    await expect(expInspector).toBeVisible();

    const stepNodes = expInspector.locator('.step-node');
    await expect(stepNodes.first()).toBeVisible();

    // Advance one step on mobile
    const nextBtn = expInspector.locator('button:has-text("Siguiente →")');
    await nextBtn.click();
    await expect(expInspector.locator('.phase-title')).toContainText('Paso 2');

    // Scroll to Section 04 and verify workshop hero card
    const heroCard = page.locator('.activity-hero-card');
    await heroCard.scrollIntoViewIfNeeded();
    await expect(heroCard).toBeVisible();
    const downloadBtn = heroCard.locator('#btn-download-workshop');
    await expect(downloadBtn).toBeVisible();
  });

  test('Table of Contents Navigation: Jumps to Section 04 smoothly and preserves route', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // Jump to Section 02
    const outlineLink02 = page.locator('a.living-doc__outline-link:has-text("02. Tool Calling Inspector")');
    await expect(outlineLink02).toBeVisible();
    await outlineLink02.click();

    expect(page.url()).toContain('/#/academy/modules/m05-ai-agents/lesson-02-tool-calling');

    const targetHeading02 = page.locator('#ciclo-de-7-fases h2.living-doc-section__title');
    await expect(targetHeading02).toBeVisible();

    // Jump to Section 04 (Taller Práctico)
    const outlineLink04 = page.locator('a.living-doc__outline-link:has-text("04. Taller práctico")');
    await expect(outlineLink04).toBeVisible();
    await outlineLink04.click();

    expect(page.url()).toContain('/#/academy/modules/m05-ai-agents/lesson-02-tool-calling');

    const targetHeading04 = page.locator('#taller-practico-agent-v1 h2.living-doc-section__title');
    await expect(targetHeading04).toBeVisible();
    await expect(targetHeading04).toHaveText('04. Taller práctico — Construye tu primer Agent v1');
  });
});
