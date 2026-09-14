import { test, expect } from '@playwright/test';

test.describe('M05 L01 Smoke Test', () => {
  const url = '/#/academy/modules/m05-ai-agents/lesson-01-workflows';

  test('Desktop Validation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    
    // Wait for the page to load
    await expect(page.locator('app-agent-building-map').first()).toBeVisible();

    // Test Experience 1 (Taxonomy)
    const exp1 = page.locator('app-exp-what-is-an-agent');
    await expect(exp1).toBeVisible();
    const llmBtn = exp1.locator('button:has-text("LLM Call")').first();
    await llmBtn.click();
    await expect(exp1.locator('.scenario-feedback').first()).toBeVisible();

    // Test Experience 2 (Flow Control)
    const exp2 = page.locator('app-exp-who-controls-flow');
    await expect(exp2).toBeVisible();
    const detBtn = exp2.locator('button:has-text("Ejecutar Reglas IF-ELSE")');
    await detBtn.click();
    await expect(exp2.locator('.node--error')).toBeVisible({ timeout: 5000 });
    
    const modelBtn = exp2.locator('button:has-text("Enrutar con LLM")');
    await modelBtn.click();
    await expect(exp2.locator('.node--success')).toBeVisible({ timeout: 5000 });

    // Test Experience 3 (Trade-offs)
    const exp3 = page.locator('app-exp-autonomy-tradeoffs');
    await expect(exp3).toBeVisible();
    
    // Change slider value
    const slider = exp3.locator('input[type="range"]');
    await slider.fill('2'); // Move to Agent Loop
    
    // Verify changes (predictability should drop)
    await expect(exp3.locator('text=Agent Loop').first()).toBeVisible();
  });

  test('Mobile Validation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    
    // Wait for the page to load
    await expect(page.locator('app-agent-building-map').first()).toBeVisible();

    const exp2 = page.locator('app-exp-who-controls-flow');
    await exp2.scrollIntoViewIfNeeded();
    await expect(exp2).toBeVisible();
  });

  test('Table of Contents Navigation: Scrolls smoothly to section without breaking hash route', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);

    const outlineLink = page.locator('a.living-doc__outline-link:has-text("02. ¿Quién controla el flujo?")');
    await expect(outlineLink).toBeVisible();
    await outlineLink.click();

    // Verify URL was not broken by hash navigation
    expect(page.url()).toContain('/#/academy/modules/m05-ai-agents/lesson-01-workflows');

    // Verify target section heading is visible and positioned below the header
    const targetHeading = page.locator('#control-de-flujo h2.living-doc-section__title');
    await expect(targetHeading).toBeVisible();

    // Topbar is 40px; heading should settle below the topbar (> 40px) and within the upper part of viewport (< 300px)
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
