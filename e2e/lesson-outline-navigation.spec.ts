import { test, expect } from '@playwright/test';

const LESSONS = [
  // M01
  { id: 'm01-l01', module: 'M01', lesson: 'L01', path: '/#/academy/modules/m01-ai-foundations/lesson-01-probabilidad' },
  { id: 'm01-l02', module: 'M01', lesson: 'L02', path: '/#/academy/modules/m01-ai-foundations/lesson-02-inferencia' },
  { id: 'm01-l03', module: 'M01', lesson: 'L03', path: '/#/academy/modules/m01-ai-foundations/lesson-03-sistemas' },
  // M02
  { id: 'm02-l01', module: 'M02', lesson: 'L01', path: '/#/academy/modules/m02-prompt-engineering/lesson-01-reliable-behavior' },
  { id: 'm02-l02', module: 'M02', lesson: 'L02', path: '/#/academy/modules/m02-prompt-engineering/lesson-02-reasoning-patterns' },
  { id: 'm02-l03', module: 'M02', lesson: 'L03', path: '/#/academy/modules/m02-prompt-engineering/lesson-03-structured-outputs' },
  // M03
  { id: 'm03-l01', module: 'M03', lesson: 'L01', path: '/#/academy/modules/m03-context-engineering/lesson-01-anatomy' },
  { id: 'm03-l02', module: 'M03', lesson: 'L02', path: '/#/academy/modules/m03-context-engineering/lesson-02-assembly' },
  { id: 'm03-l03', module: 'M03', lesson: 'L03', path: '/#/academy/modules/m03-context-engineering/lesson-03-compression' },
  // M04
  { id: 'm04-l01', module: 'M04', lesson: 'L01', path: '/#/academy/modules/m04-retrieval-rag/lesson-01-embeddings' },
  { id: 'm04-l02', module: 'M04', lesson: 'L02', path: '/#/academy/modules/m04-retrieval-rag/lesson-02-pipeline' },
  { id: 'm04-l03', module: 'M04', lesson: 'L03', path: '/#/academy/modules/m04-retrieval-rag/lesson-03-evaluation' }
];

test.describe('Lesson Outline Internal Navigation — Regression Gate', () => {
  for (const item of LESSONS) {
    test(`[${item.module} ${item.lesson}] internal outline click scrolls to section and preserves Angular hash route`, async ({ page }) => {
      await page.goto(item.path);

      // 1. Outline must be rendered
      const outline = page.locator('app-lesson-outline .living-doc__outline');
      await expect(outline).toBeVisible({ timeout: 10000 });

      // 2. Must use semantic buttons, NOT raw href links that collide with HashLocationStrategy
      const rawHrefLinks = outline.locator('a[href^="#"]');
      await expect(rawHrefLinks).toHaveCount(0);

      const items = outline.locator('.living-doc__outline-link');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      const initialHash = await page.evaluate(() => window.location.hash);
      const expectedHash = item.path.replace('/', '');
      expect(initialHash).toBe(expectedHash);

      // 3. Click the last outline item to test significant scroll
      const lastButton = items.last();
      const lastButtonText = (await lastButton.textContent())?.trim() ?? '';
      await lastButton.click();

      // 4. Hash route MUST remain intact (no redirect to #/dashboard or #<section-id>)
      const postClickHash = await page.evaluate(() => window.location.hash);
      expect(postClickHash).toBe(expectedHash);
      expect(postClickHash).not.toBe('#/dashboard');

      // 5. Target section exists and is within viewport
      const sections = page.locator('.living-doc-section');
      const targetSection = sections.last();
      await expect(targetSection).toBeAttached();
      await expect(targetSection).toBeInViewport({ timeout: 7000 });

      // 6. Lesson view remains active
      await expect(page.locator('.living-doc')).toBeVisible();
    });
  }

  test('Keyboard accessibility: outline button triggers scroll via Enter key', async ({ page }) => {
    await page.goto('/#/academy/modules/m01-ai-foundations/lesson-01-probabilidad');
    const outline = page.locator('app-lesson-outline .living-doc__outline');
    await expect(outline).toBeVisible({ timeout: 10000 });

    const firstButton = outline.locator('.living-doc__outline-link').first();
    await firstButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForTimeout(400);

    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/academy/modules/m01-ai-foundations/lesson-01-probabilidad');
  });
});
