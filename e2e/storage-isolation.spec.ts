import { test, expect } from '@playwright/test';

test.describe('CASE OS — Service Integration & Storage Isolation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Esperar a que los servicios de Angular estén instanciados y expuestos
    await page.waitForFunction(() => (window as any).__caseServices !== undefined);
  });

  test('LocalStorageProvider.clear() executes real scoped clear without touching foreign keys', async ({ page }) => {
    // 1. Preparar claves en diferentes namespaces
    await page.evaluate(() => {
      localStorage.setItem('case_guest:lesson_1', JSON.stringify({ completed: true }));
      localStorage.setItem('case_u_user_abc:lesson_1', JSON.stringify({ completed: true }));
      localStorage.setItem('unrelated_app_key', 'keep_me');
    });

    // 2. Invocar el método real LocalStorageProvider.clear() bajo el namespace activo (invitado)
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.storage.clear();
    });

    // 3. Verificar que solo se eliminaron las claves del namespace activo
    const guestKey = await page.evaluate(() => localStorage.getItem('case_guest:lesson_1'));
    const userKey = await page.evaluate(() => localStorage.getItem('case_u_user_abc:lesson_1'));
    const unrelatedKey = await page.evaluate(() => localStorage.getItem('unrelated_app_key'));

    expect(guestKey).toBeNull();
    expect(userKey).not.toBeNull();
    expect(unrelatedKey).toBe('keep_me');
  });

  test('GuestClaimService preserves unconfirmed or failed lessons in guest storage', async ({ page }) => {
    // 1. Establecer lecciones de invitado en el almacenamiento
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.storage.setRaw('case_guest:completed_lessons', ['c1', 'non_existent_unit_999']);
    });

    // 2. Ejecutar la importación real mediante GuestClaimService
    const result = await page.evaluate(async () => {
      const services = (window as any).__caseServices;
      return await services.guestClaim.importGuestProgress();
    });

    // En modo local sin autenticación remota activa, la importación debe fallar de forma segura sin borrar datos
    expect(result.success).toBe(false);

    // 3. Verificar que los datos pendientes permanecen intactos en almacenamiento de invitado
    const remainingGuestLessons = await page.evaluate(() => {
      const services = (window as any).__caseServices;
      return services.guestClaim.getGuestLessons();
    });

    expect(remainingGuestLessons).toContain('c1');
    expect(remainingGuestLessons).toContain('non_existent_unit_999');
  });

  test('Multi-account isolation prevents data leakage between user sessions', async ({ page }) => {
    // 1. Simular sesión de Usuario A
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.namespace.setActiveUser('user_A');
      services.storage.set('custom_key', 'value_A');
    });

    // 2. Simular cambio a Usuario B
    await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.namespace.setActiveUser('user_B');
      services.storage.set('custom_key', 'value_B');
    });

    // 3. Verificar aislamiento de claves en localStorage
    const valA = await page.evaluate(() => localStorage.getItem('case_u_user_A:custom_key'));
    const valB = await page.evaluate(() => localStorage.getItem('case_u_user_B:custom_key'));

    expect(JSON.parse(valA || '""')).toBe('value_A');
    expect(JSON.parse(valB || '""')).toBe('value_B');
  });

  test('UserProgressService dynamically computes percentage against real catalog count', async ({ page }) => {
    const progressData = await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.userProgress.markLessonAsCompleted('c1');
      const prog = services.userProgress.getProgress()();
      const totalUnits = services.course.getTotalUnitsCount();
      return { prog, totalUnits };
    });

    expect(progressData.totalUnits).toBe(45);
    expect(progressData.prog.completedLessons).toContain('c1');
    // 1 de 45 = 2%
    expect(progressData.prog.completionPercentage).toBe(2);
  });

  test('SyncQueueService enqueues and stores offline tasks cleanly', async ({ page }) => {
    const queueState = await page.evaluate(() => {
      const services = (window as any).__caseServices;
      services.syncQueue.clearQueue();
      services.syncQueue.enqueue('unit_progress', 'c1', 'upsert', {
        lessonId: 'c1',
        declared_completed: true,
        declared_at: new Date().toISOString()
      });
      const items = services.syncQueue.getQueue();
      return { count: items.length, firstItem: items[0] };
    });

    expect(queueState.count).toBe(1);
    expect(queueState.firstItem.id).toBe('c1');
    expect(queueState.firstItem.entityType).toBe('unit_progress');
    expect(queueState.firstItem.status).toBe('pending');
  });

  test('TopBar renders authentication elements, branding, and local sync badge', async ({ page }) => {
    await expect(page.locator('.topbar__brand')).toBeVisible();
    await expect(page.locator('.topbar__sync-badge')).toBeVisible();
    await expect(page.locator('.topbar__login-btn')).toBeVisible();
  });
});
