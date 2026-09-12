import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('CASE Academy — M04 LAB 04 Downloadable Guide E2E Validation', () => {
  test('LAB 04 renders guide card, initiates real download, supports Colab CTA, and handles responsive layout', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // 1. Cargar LAB 04
    await page.goto('/#/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy');
    await page.waitForLoadState('networkidle');

    // 2. Verificar que la tarjeta de la guía esté visible
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible({ timeout: 10000 });

    // 3. Verificar textos, badges y metadatos
    await expect(heroCard.locator('.activity-hero-card__badge-row')).toContainText('GUÍA DE LABORATORIO');
    await expect(heroCard.locator('.activity-hero-card__filename')).toContainText('M04-LAB04-guia-colab-retrieval.md');
    await expect(heroCard.locator('.activity-hero-card__filesize')).toContainText('20.8 KB');
    await expect(heroCard.locator('.activity-hero-card__title')).toHaveText('LAB 04: Retrieval Engineering en Google Colab');
    await expect(heroCard.locator('.activity-hero-card__desc')).toContainText('Construye, compara y evalúa una estrategia real de recuperación');

    // 4. Verificar pills de tecnologías
    const pills = heroCard.locator('.activity-hero-card__pills');
    await expect(pills).toContainText('Google Colab');
    await expect(pills).toContainText('Python');
    await expect(pills).toContainText('BM25');
    await expect(pills).toContainText('Sentence Transformers');
    await expect(pills).toContainText('Hybrid Search');
    await expect(pills).toContainText('60–90 min');

    // 5. Verificar CTA Secundario: Abrir Google Colab
    const colabBtn = page.locator('#btn-open-colab');
    await expect(colabBtn).toBeVisible();
    await expect(colabBtn).toHaveAttribute('href', 'https://colab.research.google.com/');
    await expect(colabBtn).toHaveAttribute('target', '_blank');
    await expect(colabBtn).toHaveAttribute('rel', 'noopener noreferrer');

    // 6. Verificar CTA Principal: Descarga real de la guía
    const downloadBtn = page.locator('#btn-download-lab');
    await expect(downloadBtn).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);

    expect(download.suggestedFilename()).toBe('M04-LAB04-guia-colab-retrieval.md');

    // Validar el contenido descargado
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('# M04 · LAB 04 — Guía paso a paso en Google Colab');
      expect(content).toContain('Diseñar, ejecutar y evaluar una estrategia de Retrieval');
      expect(content).toContain('BM25');
      expect(content).toContain('sentence-transformers');
      expect(content.length).toBeGreaterThan(20000);
    }

    // 7. Verificar alerta de éxito tras la descarga
    const alertBox = heroCard.locator('.activity-hero-card__alert');
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText('Descarga iniciada con éxito');
    await expect(alertBox).toContainText('M04-LAB04-guia-colab-retrieval.md');

    // 8. Capturar screenshot en Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: 'e2e-lab04-desktop.png', fullPage: false });

    // 9. Validar comportamiento Responsive en Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    const menuToggle = page.locator('.topbar__mobile-menu button');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await page.waitForTimeout(400);
    }
    await expect(heroCard).toBeVisible();
    await heroCard.scrollIntoViewIfNeeded();
    await expect(downloadBtn).toBeVisible();
    await expect(colabBtn).toBeVisible();
    await page.screenshot({ path: 'e2e-lab04-mobile.png', fullPage: false });

    // Restaurar viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // 10. Validar navegación (volver a Demo 04 y regresar a Lab 04)
    const backBtn = page.locator('a[routerlink*="demo-build-retrieval"]').first();
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/.*demo-build-retrieval/);

    await page.goto('/#/academy/modules/m04-retrieval-rag/lab-04-build-retrieval-strategy');
    await expect(heroCard).toBeVisible();

    // 11. Verificar que no haya rutas locales de Windows ni información sensible
    const pageText = await page.innerText('body');
    expect(pageText).not.toContain('C:\\Users\\');
    expect(pageText).not.toContain('C:/Users/');

    // 12. Verificar que no hubo errores de consola no controlados
    const realErrors = consoleErrors.filter(e => !e.includes('favicon.ico'));
    expect(realErrors).toEqual([]);
  });
});
