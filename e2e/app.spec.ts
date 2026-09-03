import { test, expect } from '@playwright/test';

test('Smoke Test: Application Loads and shows Academy', async ({ page }) => {
  // Navigate to root
  await page.goto('/');

  // Wait for the application shell to load
  // Navigate to M04 L02
  await page.goto('/#/academy/modules/m04-retrieval-rag/lesson-02-pipeline');

  // Verify that the pipeline explorer is visible
  await expect(page.locator('.exp-canvas-wrapper').first()).toBeVisible({ timeout: 15000 });
});
