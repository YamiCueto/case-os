import { test, expect } from '@playwright/test';

test.describe('M05 L01 Smoke Test & Visual Evidence', () => {
  const artifactsDir = 'c:\\Users\\YAMI\\.gemini\\antigravity-ide\\brain\\35cbd6c4-744d-436c-83d3-efd4d7ac25ef';
  const url = 'http://localhost:4201/#/academy/modules/m05-ai-agents/lesson-01-workflows';

  test('Desktop Validation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    
    // Wait for the page to load
    await expect(page.locator('app-agent-building-map').first()).toBeVisible();
    
    // Take Desktop Full Page Screenshot
    await page.screenshot({ path: `${artifactsDir}\\desktop_full.png`, fullPage: true });

    // Test Experience 1 (Taxonomy)
    const exp1 = page.locator('app-exp-what-is-an-agent');
    await expect(exp1).toBeVisible();
    const llmBtn = exp1.locator('button:has-text("LLM Call")').first();
    await llmBtn.click();
    await expect(exp1.locator('.scenario-feedback').first()).toBeVisible();
    
    // Take Desktop Experience 1 Screenshot
    await exp1.screenshot({ path: `${artifactsDir}\\desktop_exp1.png` });

    // Test Experience 2 (Flow Control)
    const exp2 = page.locator('app-exp-who-controls-flow');
    await expect(exp2).toBeVisible();
    const detBtn = exp2.locator('button:has-text("Ejecutar Reglas IF-ELSE")');
    await detBtn.click();
    await expect(exp2.locator('.node--error')).toBeVisible({ timeout: 5000 });
    
    const modelBtn = exp2.locator('button:has-text("Enrutar con LLM")');
    await modelBtn.click();
    await expect(exp2.locator('.node--success')).toBeVisible({ timeout: 5000 });

    // Take Desktop Experience 2 Screenshot
    await exp2.screenshot({ path: `${artifactsDir}\\desktop_exp2.png` });

    // Test Experience 3 (Trade-offs)
    const exp3 = page.locator('app-exp-autonomy-tradeoffs');
    await expect(exp3).toBeVisible();
    
    // Take Desktop Experience 3 Screenshot
    await exp3.screenshot({ path: `${artifactsDir}\\desktop_exp3.png` });
    
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
    
    // Take Mobile Full Page Screenshot
    await page.screenshot({ path: `${artifactsDir}\\mobile_full.png`, fullPage: true });

    const exp2 = page.locator('app-exp-who-controls-flow');
    await exp2.scrollIntoViewIfNeeded();
    await exp2.screenshot({ path: `${artifactsDir}\\mobile_exp2.png` });
  });
});
