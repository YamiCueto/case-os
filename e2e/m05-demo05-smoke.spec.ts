import { test, expect } from '@playwright/test';

test.describe('M05 Demo 05 Smoke Test — El Bucle del Agente', () => {
  const url = '/#/academy/modules/m05-ai-agents/demo-agent-loop';

  test('Desktop Validation: State Panel, Trace, Tool Buttons, Side Effect Boundary, Final Answer', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // 1. Back link points to L03
    const backLink = page.locator('#back-to-lesson-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', expect.stringContaining('lesson-03-agent-loop'));

    // 2. Conceptual simulation notice is visible
    const simNotice = page.locator('#conceptual-simulation-notice');
    await expect(simNotice).toBeVisible();
    await expect(simNotice).toContainText('no ejecuta un LLM real');
    await expect(simNotice).toContainText('runtime');

    // 3. State panel renders goal and empty observations
    const statePanel = page.locator('#state-panel');
    await expect(statePanel).toBeVisible();
    await expect(statePanel.locator('#goal-text')).toContainText('Encontrar la política de reembolso de viajes');
    await expect(statePanel).toContainText('none yet');

    // 4. Iteration counter shows 1/5 initially
    await expect(page.locator('#iteration-counter')).toContainText('1/5');
    await expect(page.locator('#iteration-counter')).toContainText('ITERATION');

    // 5. DECISION label on iteration 1 (not "INTENT")
    const trace = page.locator('#execution-trace');
    await expect(trace).toBeVisible();
    await expect(trace.locator('#decision-1')).toContainText('searchKnowledge');

    // 6. Tool buttons are visible
    await expect(page.locator('#btn-search-knowledge')).toBeVisible();
    await expect(page.locator('#btn-calculate-math')).toBeVisible();
    await expect(page.locator('#btn-send-email')).toBeVisible();
    await expect(page.locator('#btn-final-answer')).toBeVisible();

    // 7. searchKnowledge generates an observation and state update
    await page.locator('#btn-search-knowledge').click();
    await expect(trace.locator('#action-1')).toContainText('searchKnowledge');
    await expect(trace.locator('#observation-1')).toContainText('Documento encontrado');
    await expect(trace.locator('#state-update-1')).toContainText('reimbursement_policy');

    // 8. Observation is added to the state panel
    await expect(statePanel.locator('#obs-chip-0')).toContainText('reimbursement_policy');

    // 9. Iteration counter advances to 2/5
    await expect(page.locator('#iteration-counter')).toContainText('2/5');

    // 10. DECISION for step 2 is visible in trace
    await expect(trace.locator('#decision-2')).toBeVisible();
    await expect(trace.locator('#decision-2')).toContainText('manager@empresa.com');

    // 11. sendEmail triggers External Side Effect Boundary
    await page.locator('#btn-send-email').click();
    const sideEffectPanel = page.locator('#side-effect-boundary');
    await expect(sideEffectPanel).toBeVisible();
    await expect(sideEffectPanel).toContainText('EXTERNAL SIDE EFFECT DETECTED');
    await expect(sideEffectPanel).toContainText('intención');
    await expect(sideEffectPanel).toContainText('autoridad');
    await expect(sideEffectPanel).toContainText('Guardrails');

    // 12. Confirm external effect
    await page.locator('#btn-confirm-side-effect').click();
    await expect(sideEffectPanel).not.toBeVisible();
    await expect(statePanel).toContainText('email: enviado');

    // 13. Return Final Answer → status SUCCESS
    await page.locator('#btn-final-answer').click();
    await expect(page.locator('#execution-terminated-success')).toBeVisible();
    await expect(page.locator('#execution-terminated-success')).toContainText('Goal Achieved');

    // 14. Lab 05 navigation link is present
    const lab05Link = page.locator('#link-to-lab05');
    await expect(lab05Link).toBeVisible();
    await expect(lab05Link).toContainText('Laboratorio 05');
    await expect(lab05Link).toHaveAttribute('href', expect.stringContaining('lab-05-design-agentic-workflow'));

    // 15. No critical console errors
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('status of 404')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('calculateMath shows irrelevant tool observation without breaking flow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    const trace = page.locator('#execution-trace');
    const statePanel = page.locator('#state-panel');

    // Use calculateMath as first action
    await page.locator('#btn-calculate-math').click();

    // Observation should mention goal not advancing
    await expect(trace.locator('#observation-1')).toContainText('no avanza');

    // Iteration advances (iteration consumed)
    await expect(page.locator('#iteration-counter')).toContainText('2/5');

    // State panel has irrelevant math result chip
    await expect(statePanel.locator('#obs-chip-0')).toContainText('math_result');
    await expect(statePanel.locator('#obs-chip-0')).toContainText('irrelevante');

    // Loop still RUNNING
    await expect(page.locator('.demo05-status-badge--running')).toBeVisible();
  });

  test('sendEmail without searchKnowledge first shows missing context error', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    const trace = page.locator('#execution-trace');

    // Try to send email without having searched
    await page.locator('#btn-send-email').click();

    // Should NOT show side effect boundary — instead shows error in trace
    await expect(page.locator('#side-effect-boundary')).not.toBeVisible();
    await expect(trace.locator('#observation-1')).toContainText('Error');
    await expect(trace.locator('#observation-1')).toContainText('política');
  });

  test('Cancel external side effect keeps loop running', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // Get policy first
    await page.locator('#btn-search-knowledge').click();

    // Trigger side effect boundary
    await page.locator('#btn-send-email').click();
    await expect(page.locator('#side-effect-boundary')).toBeVisible();

    // Cancel — loop should continue
    await page.locator('#btn-cancel-side-effect').click();
    await expect(page.locator('#side-effect-boundary')).not.toBeVisible();
    await expect(page.locator('.demo05-status-badge--running')).toBeVisible();
    await expect(page.locator('#iteration-counter')).toContainText('3/5');
  });

  test('MAX_ITERATIONS terminates the loop after 5 iterations', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // Use calculateMath 5 times to exhaust iterations without completing goal
    for (let i = 0; i < 5; i++) {
      const status = await page.locator('.demo05-status-badge').textContent();
      if (!status?.includes('RUNNING')) break;
      await page.locator('#btn-calculate-math').click();
    }

    // MAX_ITERATIONS notice should be visible
    await expect(page.locator('#max-iterations-notice')).toBeVisible();
    await expect(page.locator('#max-iterations-notice')).toContainText('MAX_ITERATIONS');
    await expect(page.locator('#execution-terminated-max')).toBeVisible();
    await expect(page.locator('.demo05-status-badge--failed')).toBeVisible();
  });

  test('Reset Simulation restores initial state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    // Do some actions
    await page.locator('#btn-search-knowledge').click();
    await expect(page.locator('#iteration-counter')).toContainText('2/5');

    // Complete the simulation
    await page.locator('#btn-send-email').click();
    await page.locator('#btn-confirm-side-effect').click();
    await page.locator('#btn-final-answer').click();

    // Reset
    const resetBtn = page.locator('#btn-reset-simulation');
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Back to initial state
    await expect(page.locator('#iteration-counter')).toContainText('1/5');
    await expect(page.locator('.demo05-status-badge--running')).toBeVisible();
    await expect(page.locator('#state-panel')).toContainText('none yet');
  });

  test('Mobile Responsive Validation: No horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);

    // No horizontal scroll
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBe(false);

    // Core elements visible on mobile
    await expect(page.locator('#conceptual-simulation-notice')).toBeVisible();
    await expect(page.locator('#state-panel')).toBeVisible();
    await expect(page.locator('#btn-search-knowledge')).toBeVisible();
    await expect(page.locator('#btn-final-answer')).toBeVisible();
    await expect(page.locator('#link-to-lab05')).toBeVisible();
  });

  test('Navigation to Lab 05 link is present and correct', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    const lab05Link = page.locator('#link-to-lab05');
    await expect(lab05Link).toBeVisible();
    await expect(lab05Link).toContainText('Laboratorio 05');

    // The takeaway text references the Capstone
    await expect(page.locator('.demo05-takeaway')).toContainText('Capstone');
    await expect(page.locator('.demo05-takeaway')).toContainText('construirás el agente');
  });
});
