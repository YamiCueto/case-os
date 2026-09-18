import { test, expect } from '@playwright/test';

test.describe('CASE Library v2 & CASE Glossary — End-to-End Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Escuchar errores de consola no controlados
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });
  });

  test('Library Home (v2): Renders catalog, P0 resources, and navigates to Glossary', async ({ page }) => {
    await page.goto('/#/library');
    await page.waitForSelector('h1:has-text("CASE Library")');

    // 1. Validar badge v2.0 y descripción
    const badge = page.locator('text=v2.0');
    await expect(badge).toBeVisible();

    // 2. Botón a Glosario Canónico A-Z visible y navegable
    const glossaryBtn = page.locator('#btn-goto-glossary');
    await expect(glossaryBtn).toBeVisible();

    // 3. Recursos de ingeniería renderizados (incluyendo P0s)
    const cards = page.locator('app-resource-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Validar presencia de recurso P0 canónico en el catálogo
    const card = page.locator('app-resource-card', { hasText: 'Contrato de Gobernanza: Policy Gate & Human-in-the-Loop' });
    await expect(card).toBeVisible();

    // 4. Navegar a detalle de recurso mediante el botón Ver Recurso
    await card.locator('button:has-text("Ver Recurso")').click();
    await page.waitForURL('**/#/library/contrato-gobernanza-policy-gate-hitl');
    await expect(page.locator('h1:has-text("Contrato de Gobernanza: Policy Gate & Human-in-the-Loop")')).toBeVisible();

    // Validar CTA de la Academia y Recursos Relacionados
    const academyLink = page.locator('button:has-text("Aprender en Lección de la Academia")');
    await expect(academyLink).toBeVisible();

    const relatedSection = page.locator('text=Recursos y Conceptos Relacionados');
    await expect(relatedSection).toBeVisible();

    // 5. Volver a la biblioteca
    await page.click('button:has-text("Volver a la Biblioteca")');
    await page.waitForURL('**/#/library');
  });

  test('CASE Glossary: Renders canonical terms, search by Spanish alias discovers English term', async ({ page }) => {
    await page.goto('/#/library/glossary');
    await page.waitForSelector('h1:has-text("Glosario Canónico de IA")');

    // 1. Contador de conceptos
    const countBadge = page.locator('header .text-2xl.font-black.text-white');
    await expect(countBadge).toBeVisible();
    const countText = await countBadge.textContent();
    expect(parseInt(countText || '0', 10)).toBeGreaterThanOrEqual(40);

    // 2. Búsqueda por alias en español: "recuperación" descubre "Retrieval"
    const searchInput = page.locator('#glossary-search-input');
    await searchInput.fill('recuperación');
    await page.waitForTimeout(300); // debounce

    const retrievalTerm = page.locator('#term-retrieval');
    await expect(retrievalTerm).toBeVisible();
    await expect(retrievalTerm.locator('h3')).toContainText('Retrieval');
    await expect(retrievalTerm.getByText('Recuperación', { exact: true })).toBeVisible();

    // 3. Limpiar búsqueda
    const clearBtn = page.locator('#btn-clear-glossary-search');
    await clearBtn.click();
    await page.waitForTimeout(200);

    // 4. Búsqueda de término técnico agéntico: "HITL"
    await searchInput.fill('HITL');
    await page.waitForTimeout(300);

    const hitlTerm = page.locator('#term-human-in-the-loop-hitl');
    await expect(hitlTerm).toBeVisible();
    await expect(hitlTerm.locator('h3')).toContainText('Human-in-the-Loop (HITL)');
  });

  test('CASE Glossary: Module filters, A-Z index safe navigation, and deep-dive expansion', async ({ page }) => {
    await page.goto('/#/library/glossary');
    await page.waitForSelector('h1:has-text("Glosario Canónico de IA")');

    // 1. Filtro por M05 · Agentes de IA
    const m5Filter = page.locator('#filter-module-m5');
    await m5Filter.click();
    await page.waitForTimeout(200);

    // Validar que términos de M05 están visibles
    await expect(page.locator('#term-agent-loop')).toBeVisible();
    await expect(page.locator('#term-policy-gate')).toBeVisible();
    await expect(page.locator('#term-max-iterations')).toBeVisible();

    // 2. Navegación A–Z segura (sin colisión con HashRouter)
    const letterMBtn = page.locator('#btn-letter-M');
    await expect(letterMBtn).toBeEnabled();
    await letterMBtn.click();

    // Verificar que la URL sigue siendo #/library/glossary (NO #/M o #letter-M)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/library/glossary');
    expect(currentUrl).not.toContain('#letter-M');
    expect(currentUrl).not.toContain('/dashboard');

    // 3. Expandir explicación profunda
    const expandBtn = page.locator('#btn-expand-max-iterations');
    await expandBtn.click();

    const detailContent = page.locator('#term-max-iterations app-markdown-viewer');
    await expect(detailContent).toBeVisible();
    await expect(detailContent).toContainText('La Regla de Oro de los Bucles Agénticos');

    // 4. Navegación hacia la lección de la Academia desde el término
    const academyBtn = page.locator('#btn-academy-max-iterations');
    await expect(academyBtn).toBeVisible();
    await academyBtn.click();

    // Debe navegar fluidamente a M05 Lección 03
    await page.waitForURL('**/#/academy/modules/m05-ai-agents/lesson-03-agent-loop');
    await expect(page.locator('h1')).toContainText('El Bucle del Agente');
  });

  test('Responsive & Overflow Validation (390px mobile viewport)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 1. Validar Library Home en 390px
    await page.goto('/#/library');
    await page.waitForSelector('h1:has-text("CASE Library")');

    const libraryOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(libraryOverflow).toBe(false);

    // 2. Validar Glossary Home en 390px
    await page.goto('/#/library/glossary');
    await page.waitForSelector('h1:has-text("Glosario Canónico de IA")');

    const glossaryOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(glossaryOverflow).toBe(false);

    // Validar que el buscador y los filtros son interactuables en mobile
    const mobileInput = page.locator('#glossary-search-input');
    await expect(mobileInput).toBeVisible();
    await mobileInput.fill('token');
    await page.waitForTimeout(300);

    const tokenTerm = page.locator('#term-token');
    await expect(tokenTerm).toBeVisible();
  });

});
