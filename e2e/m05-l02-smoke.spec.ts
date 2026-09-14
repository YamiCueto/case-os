import { test, expect } from '@playwright/test';

test.describe('M05 L02 Smoke Test — Tool Calling (Agent v1)', () => {
  const url = '/#/academy/modules/m05-ai-agents/lesson-02-tool-calling';

  test('Desktop Validation: Complete Tool Calling Flow & Experiences', async ({ page }) => {
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
  });

  test('Table of Contents Navigation: Jumps to section smoothly and preserves route', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    const outlineLink = page.locator('a.living-doc__outline-link:has-text("02. Tool Calling Inspector")');
    await expect(outlineLink).toBeVisible();
    await outlineLink.click();

    // Verify URL stays on lesson
    expect(page.url()).toContain('/#/academy/modules/m05-ai-agents/lesson-02-tool-calling');

    const targetHeading = page.locator('#ciclo-de-7-fases h2.living-doc-section__title');
    await expect(targetHeading).toBeVisible();

    await expect.poll(async () => {
      const box = await targetHeading.boundingBox();
      return box ? box.y : null;
    }, { timeout: 5000 }).toBeLessThan(300);

    await expect.poll(async () => {
      const box = await targetHeading.boundingBox();
      return box ? box.y : null;
    }, { timeout: 5000 }).toBeGreaterThan(40);
  });
});

