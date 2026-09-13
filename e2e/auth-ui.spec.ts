import { test, expect } from '@playwright/test';

test.describe('Auth UI (Global Modal)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__caseServices !== undefined);
  });

  test('abre modal desde Iniciar sesión y cambia vistas', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await expect(page.locator('.auth-modal-container')).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toHaveText('Iniciar sesión');

    await page.click('button:has-text("Regístrate")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Crear cuenta');

    await page.click('button:has-text("Inicia sesión")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Iniciar sesión');

    await page.click('button:has-text("¿Olvidaste tu contraseña?")');
    await expect(page.locator('#auth-modal-title')).toHaveText('Recuperar contraseña');
  });

  test('foco inicial, focus trap y restauración de foco al cerrar', async ({ page }) => {
    // 1. Abrir modal
    const loginBtn = page.locator('.topbar__login-btn');
    await loginBtn.focus(); // Fix for WebKit button focus
    await loginBtn.click();
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // 2. Verificar que el foco está en el primer input (el efecto focusFirstInput lo pone ahí)
    await expect(page.locator('#signin-email')).toBeFocused();

    // 3. Tab trap
    // Pulsar tab repetidas veces para llegar al final
    await page.locator('button:has-text("Regístrate")').focus();
    // Estando en el último, si pulsamos tab debe volver al primero focusable (el close button)
    await page.keyboard.press('Tab');
    await expect(page.locator('.auth-modal-close')).toBeFocused();

    // Shift+Tab trap
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('button:has-text("Regístrate")')).toBeFocused();

    // 4. Restauración de foco
    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).not.toBeVisible();
    if (test.info().project.name !== 'webkit') {
      await expect(page.locator('.topbar__login-btn')).toBeFocused();
    }
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

    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authLoading.set(true);
    });

    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    await page.click('.auth-modal-backdrop', { position: { x: 5, y: 5 } });
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authLoading.set(false);
    });
  });

  test('bloqueo de cierre durante PASSWORD_RECOVERY y salida explícita', async ({ page }) => {
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.isPasswordRecovery.set(true);
    });

    await expect(page.locator('.auth-modal-container')).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toHaveText('Nueva contraseña');

    await page.keyboard.press('Escape');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    await page.click('button:has-text("Cancelar recuperación y cerrar sesión")');
    await expect(page.locator('.auth-modal-container')).not.toBeVisible();
  });

  test('CHECK_EMAIL_CONFIRMATION cuando signup devuelve session null', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await page.click('button:has-text("Regístrate")');

    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.signUpWithEmail = async () => {
        return { data: { session: null }, error: null };
      };
    });

    await page.locator('#signup-name').fill('Test');
    await page.locator('#signup-email').fill('test@example.com');
    await page.locator('#signup-password').fill('password123');
    
    // Check if the button is enabled before clicking
    await expect(page.locator('button:has-text("Crear cuenta")')).toBeEnabled();
    await page.click('button:has-text("Crear cuenta")');

    await expect(page.locator('#auth-modal-title')).toHaveText('Revisa tu correo');
    await expect(page.locator('.auth-modal-desc')).toHaveText('Revisa tu correo para confirmar/activar tu cuenta.');
  });

  test('PASSWORD_RESET_EMAIL_SENT muestra copy correcto', async ({ page }) => {
    await page.click('.topbar__login-btn');
    await page.click('button:has-text("¿Olvidaste tu contraseña?")');

    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.resetPasswordForEmail = async () => {
        return { error: null };
      };
    });

    await page.fill('#forgot-email', 'test@example.com');
    await page.click('button:has-text("Enviar enlace de recuperación")');

    await expect(page.locator('#auth-modal-title')).toHaveText('Revisa tu correo');
    await expect(page.locator('.auth-modal-desc')).toHaveText('Si la solicitud es válida, revisa tu correo para continuar con el restablecimiento de contraseña.');
  });

  test('sanitización y limpieza de errores', async ({ page }) => {
    await page.click('.topbar__login-btn');

    // Mapeo normal
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authError.set('invalid login credentials');
    });
    const errorLocator = page.locator('.auth-modal-error');
    await expect(errorLocator).toContainText('El correo electrónico o la contraseña son incorrectos');

    // Mapeo que no revela enumeración de cuenta
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authError.set('user not found');
    });
    await expect(errorLocator).toContainText('El correo electrónico o la contraseña son incorrectos');

    // Mapeo sin hardcode de longitud
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.supabase.authError.set('Password should be at least 8 characters');
    });
    await expect(errorLocator).toContainText('La contraseña no cumple los requisitos configurados');

    // Limpieza de error al cambiar de vista
    await page.click('button:has-text("Regístrate")');
    await expect(errorLocator).not.toBeVisible();
  });

  test('Google delega en SupabaseService', async ({ page }) => {
    await page.click('.topbar__login-btn');
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

test.describe('Auth UI - Mobile Viewport', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('modal es visible y usable en mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__caseServices !== undefined);

    await page.click('.topbar__login-btn');
    await expect(page.locator('.auth-modal-container')).toBeVisible();

    // Comprobar que no hay overflow horizontal en el modal container (ancho no mayor a 360)
    const box = await page.locator('.auth-modal-container').boundingBox();
    expect(box?.width).toBeLessThanOrEqual(360);

    // Los CTAs y campos de entrada son visibles
    await expect(page.locator('button.auth-btn--google')).toBeVisible();
    await expect(page.locator('#signin-email')).toBeVisible();
    await expect(page.locator('.auth-modal-container button.auth-btn--primary')).toBeVisible();
  });
});
