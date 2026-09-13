import { test, expect } from '@playwright/test';

test.describe('Auth UI (Global Modal)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__caseServices !== undefined);
  });

  test('abre modal desde Iniciar sesión y cambia vistas', async ({ page }) => {
    // 1. Abrir modal desde "Iniciar sesión"
    await page.click('.topbar__login-btn');
    await expect(page.locator('.auth-modal-container')).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toHaveText('Iniciar sesión');

    // 2. Cambiar a SIGN_UP
    await page.click('button:has-text("Regístrate")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Crear cuenta');

    // 3. Cambiar a SIGN_IN
    await page.click('button:has-text("Inicia sesión")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Iniciar sesión');

    // 4. Cambiar a FORGOT_PASSWORD
    await page.click('button:has-text("¿Olvidaste tu contraseña?")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Recuperar contraseña');
  });

  test('cierre con ESC en estado normal', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await expect(page.locator('.auth-modal-container')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).not.toBeVisible();
  });

  test('bloqueo ESC/backdrop durante loading', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // Forzar authLoading = true via window.__caseServices
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      // Inyectamos estado de carga simulado
      services.supabase.authLoading.set(true);
    });

    // Intentar cerrar con ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // Intentar cerrar haciendo click en el backdrop
    await page.click('.auth-modal-backdrop', { position: { x: 5, y: 5 } });
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // Restaurar
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authLoading.set(false);
    });
  });

  test('bloqueo de cierre durante PASSWORD_RECOVERY y salida explícita', async ({ page }) => {
    // Simulamos que Supabase dispara isPasswordRecovery
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.isPasswordRecovery.set(true);
    });

    // El effect en AuthUiService debe haber abierto el modal
    await expect(page.locator('.auth-modal-container')).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toHaveText('Nueva contraseña');

    // Bloqueo ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // Salida explícita "Cancelar recuperación y cerrar sesión"
    await page.click('button:has-text("Cancelar recuperación y cerrar sesión")');
    // El método llamará a signOut y luego cerrará el modal.
    // Ojo: en un entorno mock offline, el signOut debe terminar limpiamente.
    await expect(page.locator('.auth-modal-container')).not.toBeVisible();
  });

  test('CHECK_EMAIL cuando signup devuelve session null', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await page.click('button:has-text("Regístrate")');

    // Espiar signUpWithEmail para forzar el retorno { data: { session: null } }
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.signUpWithEmail = async () => {
        return { data: { session: null }, error: null };
      };
    });

    // Llenar formulario y enviar
    await page.fill('#signup-name', 'Test');
    await page.fill('#signup-email', 'test@example.com');
    await page.fill('#signup-password', 'password123');
    await page.click('button:has-text("Crear cuenta")');

    await expect(page.locator('#auth-modal-title')).toHaveText('Revisa tu correo');
  });

  test('sanitización y limpieza de errores', async ({ page }) => {
    await page.click('.topbar__login-btn');

    // Inyectar un error crudo
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authError.set('invalid login credentials');
    });

    // Debe mostrarse el error sanitizado
    const errorLocator = page.locator('.auth-modal-error');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText('El correo electrónico o la contraseña son incorrectos');

    // Limpieza de error al cambiar de vista
    await page.click('button:has-text("Regístrate")');
    await expect(errorLocator).not.toBeVisible();
  });

  test('Google delega en SupabaseService', async ({ page }) => {
    await page.click('.topbar__login-btn');

    // Espiar signInWithGoogle
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      (window as any).__googleCalled = false;
      services.supabase.signInWithGoogle = async () => {
        (window as any).__googleCalled = true;
      };
    });

    await page.click('button.auth-btn--google');

    const called = await page.evaluate(() => (window as any).__googleCalled);
    expect(called).toBe(true);
  });
});
