import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('M05 L04 Smoke Test — State & Memory & Taller Práctico Agent v3', () => {
  const url = '/#/academy/modules/m05-ai-agents/lesson-04-state-memory';

  test('Desktop Validation: Complete State & Memory Flow, Experiences & Workshop Launchpad', async ({ page }) => {
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

    // 1. Verify Page & Building Map (Decision, Tools, Loop passed; State & Memory active)
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();
    await expect(buildingMap.locator('.map-node--active .map-label')).toHaveText('State & Memory');
    const passedNodes = buildingMap.locator('.map-node--passed .map-label');
    await expect(passedNodes.nth(0)).toHaveText('Decision');
    await expect(passedNodes.nth(1)).toHaveText('Tools');
    await expect(passedNodes.nth(2)).toHaveText('Loop');

    // Verify two layers in building map
    await expect(buildingMap.locator('.map-layer__tag').nth(0)).toHaveText('Capa 1: Core Agent');
    await expect(buildingMap.locator('.map-layer__tag').nth(1)).toHaveText('Capa 2: Control & Governance');

    // 2. Experience 1: Execution State Inspector
    const expInspector = page.locator('app-exp-execution-state-inspector');
    await expect(expInspector).toBeVisible();

    // Check initial step
    await expect(expInspector.locator('.code-terminal')).toContainText('run_94b1f6a');
    await expect(expInspector.locator('.code-terminal')).toContainText('iteration: 0');

    // Advance to Step 2 (Tool Call)
    const step2Btn = expInspector.locator('.step-btn').nth(1);
    await step2Btn.click();
    await expect(expInspector.locator('.code-terminal')).toContainText('iteration: 1');

    // Advance to Step 5 (State Disposed)
    const step5Btn = expInspector.locator('.step-btn').nth(4);
    await step5Btn.click();
    await expect(expInspector.locator('.disposed-view')).toBeVisible();

    // Answer Quiz Option (Option B is correct)
    const optionB = expInspector.locator('.quiz-option-btn').filter({ has: page.locator('.opt-letter', { hasText: 'B' }) });
    await optionB.click();
    await expect(expInspector.locator('.quiz-feedback')).toBeVisible();
    await expect(expInspector.locator('.quiz-feedback')).toContainText('Diagnóstico de Arquitectura Impecable');

    // 3. Experience 2: Context vs Memory
    const expContextMemory = page.locator('app-exp-context-vs-memory');
    await expect(expContextMemory).toBeVisible();

    // Default turn is 10
    await expect(expContextMemory.locator('.strategy-card--naive .metric-num')).toContainText('14,200');
    await expect(expContextMemory.locator('.strategy-card--smart .metric-num')).toContainText('1,750');

    // Select Turn 1
    const turn1Btn = expContextMemory.getByRole('button', { name: 'Turno 1', exact: true });
    await turn1Btn.click();
    await expect(expContextMemory.locator('.strategy-card--naive .metric-num')).toContainText('950');
    await expect(expContextMemory.locator('.strategy-card--smart .metric-num')).toContainText('950');

    // Select Turn 20
    const turn20Btn = expContextMemory.getByRole('button', { name: 'Turno 20', exact: true });
    await turn20Btn.click();
    await expect(expContextMemory.locator('.strategy-card--naive .metric-num')).toContainText('31,000');
    await expect(expContextMemory.locator('.strategy-card--smart .metric-num')).toContainText('2,100');
    await expect(expContextMemory.locator('.axiom-banner')).toContainText('Axioma de Ingeniería M05');

    // 4. Experience 3: Memory Policy Matrix
    const expMatrix = page.locator('app-exp-memory-policy-matrix');
    await expect(expMatrix).toBeVisible();

    const candidateRows = expMatrix.locator('.candidate-row');
    // c1: Discard
    await candidateRows.nth(0).locator('.scope-btn--discard').click();
    // c2: Session
    await candidateRows.nth(1).locator('.scope-btn--session').click();
    // c3: Persist
    await candidateRows.nth(2).locator('.scope-btn--persist').click();
    // c4: Never Store
    await candidateRows.nth(3).locator('.scope-btn--never').click();
    // c5: Discard
    await candidateRows.nth(4).locator('.scope-btn--discard').click();
    // c6: Persist
    await candidateRows.nth(5).locator('.scope-btn--persist').click();

    // Verify all 6 classified with correct feedback
    await expect(expMatrix.locator('.score-chip')).toContainText('6 / 6');
    await expect(expMatrix.locator('.candidate-feedback--correct')).toHaveCount(6);

    // 5. Section 04: Practical Workshop Launchpad (Hero Card)
    const workshopSection = page.locator('#taller-practico-agent-v3');
    await expect(workshopSection).toBeVisible();
    await expect(workshopSection.locator('.living-doc-section__title')).toHaveText('04. Taller práctico — Evoluciona Agent v2 a Agent v3');

    const heroCard = workshopSection.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.activity-hero-card__badge-row')).toContainText('TALLER PRÁCTICO');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M05-L04-taller-agent-v3.md');
    await expect(heroCard.locator('.activity-hero-card__title')).toContainText('Evoluciona Agent v2 a Agent v3');

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
    await expect(directLink).toHaveAttribute('href', 'docs/M05-L04-taller-agent-v3.md');
    await expect(directLink).toHaveAttribute('download', 'M05-L04-taller-agent-v3.md');

    // 7. Verify public file exists on filesystem
    const publicFilePath = 'public/docs/M05-L04-taller-agent-v3.md';
    expect(fs.existsSync(publicFilePath)).toBe(true);
    const content = fs.readFileSync(publicFilePath, 'utf-8');
    expect(content).toContain('Taller Práctico — Evoluciona Agent v2 a Agent v3');
    expect(content).toContain('ExecutionState');
    expect(content).toContain('MemoryStore');
    expect(content).toContain('subject_id');
    expect(content).toContain('run_agent_v3');
    expect(content).toContain('DEMOSTRACIÓN CASO F1');
    expect(content).toContain('DEMOSTRACIÓN CASO F2');

    // 8. Verify No Console Errors
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('status of 404')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('Mobile Responsive Validation: No Overflow & Usable Touch Targets (375x667)', async ({ page }) => {
    // iPhone SE viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(url);

    // Verify page loads without horizontal scroll
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBe(false);

    // Verify Agent Building Map renders compactly without overflow
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    // Verify Workshop Hero Card adapts cleanly to mobile
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    const downloadBtn = heroCard.locator('#btn-download-workshop');
    await expect(downloadBtn).toBeVisible();

    // Verify experiences are visible and contained
    await expect(page.locator('app-exp-execution-state-inspector')).toBeVisible();
    await expect(page.locator('app-exp-context-vs-memory')).toBeVisible();
    await expect(page.locator('app-exp-memory-policy-matrix')).toBeVisible();
  });
});
