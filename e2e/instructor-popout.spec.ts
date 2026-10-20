import { test, expect } from '@playwright/test';

test.describe('Modo Instructor — Ventana Independiente (Popout) y Rutas', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('Localhost: Desbloqueo con contraseña y apertura de popout L01–L04 con pathname y hash correctos', async ({ page }) => {
    // 1. Iniciar en L01 con almacenamiento limpio
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await page.reload();

    const openGuideBtn = page.locator('#btn-open-instructor-drawer');
    await expect(openGuideBtn).toBeVisible();

    // 2. Clic en botón solicita contraseña
    await openGuideBtn.click();
    const authModal = page.locator('.auth-modal');
    await expect(authModal).toBeVisible();

    // 3. Ingresar contraseña correcta y esperar a que se abra la ventana emergente de L01
    await page.locator('#instructor-password-input').fill('soyelprofe');
    const [popupL01] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btn-submit-instructor-password').click(),
    ]);

    await popupL01.waitForLoadState('domcontentloaded');
    const urlL01 = new URL(popupL01.url());
    expect(urlL01.pathname).toBe('/');
    expect(urlL01.hash).toBe('#/academy/instructor-view/c-m6-l01');

    // Comprobar que en la ventana emergente se conserva el desbloqueo y muestra la lección L01
    await expect(popupL01.locator('.instructor-standalone-view')).toBeVisible();
    await expect(popupL01.locator('.popout-header__title')).toContainText('¿Qué es MCP y por qué necesitamos utilizarlo?');
    await popupL01.close();

    // 4. L02 — Al estar ya desbloqueado, el clic abre directamente la ventana emergente de L02
    await page.goto('/#/academy/modules/m06-mcp/lesson-02-servidores-utiles');
    const [popupL02] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btn-open-instructor-drawer').click(),
    ]);
    await popupL02.waitForLoadState('domcontentloaded');
    const urlL02 = new URL(popupL02.url());
    expect(urlL02.pathname).toBe('/');
    expect(urlL02.hash).toBe('#/academy/instructor-view/c-m6-l02');
    await expect(popupL02.locator('.instructor-standalone-view')).toBeVisible();
    await expect(popupL02.locator('.popout-header__title')).toContainText('servidores MCP más útiles');
    await popupL02.close();

    // 5. L03 — Apertura directa de popout para L03
    await page.goto('/#/academy/modules/m06-mcp/lesson-03-configuracion-practica');
    const [popupL03] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btn-open-instructor-drawer').click(),
    ]);
    await popupL03.waitForLoadState('domcontentloaded');
    const urlL03 = new URL(popupL03.url());
    expect(urlL03.pathname).toBe('/');
    expect(urlL03.hash).toBe('#/academy/instructor-view/c-m6-l03');
    await expect(popupL03.locator('.instructor-standalone-view')).toBeVisible();
    await expect(popupL03.locator('.popout-header__title')).toContainText(/Configuración y utilización práctica/i);
    await popupL03.close();

    // 6. L04 — Apertura directa de popout para L04
    await page.goto('/#/academy/modules/m06-mcp/lesson-04-agentes-mcp');
    const [popupL04] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btn-open-instructor-drawer').click(),
    ]);
    await popupL04.waitForLoadState('domcontentloaded');
    const urlL04 = new URL(popupL04.url());
    expect(urlL04.pathname).toBe('/');
    expect(urlL04.hash).toBe('#/academy/instructor-view/c-m6-l04');
    await expect(popupL04.locator('.instructor-standalone-view')).toBeVisible();
    await expect(popupL04.locator('.popout-header__title')).toContainText('L04 — MCP integrado con agentes de IA');
    await popupL04.close();
  });

  test('GitHub Pages: Respeta baseURI bajo /curso-ia-generativa/ verificando pathname y hash', async ({ page }) => {
    // Desbloquear sesión previa antes de cargar la página
    await page.addInitScript(() => {
      localStorage.setItem('case_os_instructor_unlocked', 'true');
      sessionStorage.setItem('case_os_instructor_unlocked', 'true');
    });

    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // Simular baseURI de GitHub Pages (/curso-ia-generativa/)
    await page.evaluate(() => {
      let baseTag = document.querySelector('base');
      if (!baseTag) {
        baseTag = document.createElement('base');
        document.head.prepend(baseTag);
      }
      baseTag.setAttribute('href', '/curso-ia-generativa/');
    });

    // Validar que document.baseURI se actualizó con el subdirectorio de despliegue
    const baseUri = await page.evaluate(() => document.baseURI);
    expect(baseUri).toContain('/curso-ia-generativa/');

    // Abrir popout y capturar la ventana emergente
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#btn-open-instructor-drawer').click(),
    ]);

    const url = new URL(popup.url());
    expect(url.pathname).toBe('/curso-ia-generativa/');
    expect(url.hash).toBe('#/academy/instructor-view/c-m6-l01');
    await popup.close();
  });
});
