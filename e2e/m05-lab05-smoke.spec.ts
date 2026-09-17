import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('M05 Lab 05 Smoke Test — Agent Engineering Capstone & Downloadable Workshop', () => {

  test('Desktop Validation: Complete Capstone Studio, Convergence Map, Scenarios C1-C5 & Workshop Download', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1280, height: 800 });

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // 1. Navegación a Lab 05
    await page.goto('/#/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow');
    await page.waitForLoadState('networkidle');

    // 2. Verificación de chips de contexto
    const chipCapstone = page.locator('.chip-capstone');
    await expect(chipCapstone).toBeVisible();
    await expect(chipCapstone).toContainText('LAB 05 · AGENT CAPSTONE');

    // 3. Verificación de AgentBuildingMap en modo Capstone
    const buildingMap = page.locator('app-agent-building-map').first();
    await expect(buildingMap).toBeVisible();

    const statusPill = buildingMap.locator('.status-text');
    await expect(statusPill).toContainText('CAPSTONE · Agent Engineering Capstone');

    // Todos los 7 nodos anteriores deben estar marcados como passed
    const passedNodes = buildingMap.locator('.map-node--passed');
    await expect(passedNodes).toHaveCount(7);

    // 4. Verificación de Convergence Banner
    const convergenceBanner = page.locator('.convergence-banner');
    await expect(convergenceBanner).toBeVisible();
    await expect(convergenceBanner.locator('.convergence-banner__title')).toContainText('Agent Engineering Capstone');
    await expect(convergenceBanner).toContainText('FUNDAMENTO PREVIO');
    await expect(convergenceBanner).toContainText('L01 · Decision / Autonomy');
    await expect(convergenceBanner).toContainText('EVOLUCIÓN DIDÁCTICA');
    await expect(convergenceBanner.locator('.target-card')).toContainText('AGENT ENGINEERING CAPSTONE');

    // 5. Pestaña 1: Arquitectura & Contratos
    const tabArch = page.locator('#tab-architecture');
    await expect(tabArch).toBeVisible();
    await expect(tabArch).toHaveClass(/studio-tab-btn--active/);

    // Verificar las 3 tarjetas de política (ALLOW, REQUIRE_APPROVAL, BLOCK)
    const policyAllow = page.locator('.policy-card--allow');
    await expect(policyAllow).toBeVisible();
    await expect(policyAllow).toContainText('READ → ALLOW');
    await expect(policyAllow).toContainText('get_service_status');

    const policyApproval = page.locator('.policy-card--approval');
    await expect(policyApproval).toBeVisible();
    await expect(policyApproval).toContainText('WRITE → REQUIRE_APPROVAL');
    await expect(policyApproval).toContainText('create_ticket');

    const policyBlock = page.locator('.policy-card--block');
    await expect(policyBlock).toBeVisible();
    await expect(policyBlock).toContainText('PRIVILEGED → BLOCK');
    await expect(policyBlock).toContainText('restart_service');

    // 6. Pestaña 2: Simulador de Escenarios (C1–C5)
    const tabSim = page.locator('#tab-simulator');
    await tabSim.click();
    await expect(tabSim).toHaveClass(/studio-tab-btn--active/);

    // Verificar botones de escenario
    const scC1 = page.locator('#scenario-c1');
    const scC2 = page.locator('#scenario-c2');
    const scC3 = page.locator('#scenario-c3');
    const scC4 = page.locator('#scenario-c4');
    const scC5 = page.locator('#scenario-c5');
    await expect(scC1).toBeVisible();
    await expect(scC2).toBeVisible();
    await expect(scC3).toBeVisible();
    await expect(scC4).toBeVisible();
    await expect(scC5).toBeVisible();

    // C1: Verificar estado inicial saludable
    await expect(page.locator('.state-inspector-card')).toContainText('auth-api');
    await expect(page.locator('.timeline-container')).toBeVisible();

    // Seleccionar C2 (Degraded)
    await scC2.click();
    await expect(page.locator('.state-inspector-card')).toContainText('payments-api');
    await expect(page.locator('.state-inspector-card')).toContainText('INC-402');

    // Seleccionar C3 (HITL)
    await scC3.click();
    const hitlPanel = page.locator('.hitl-interactive-panel');
    await expect(hitlPanel).toBeVisible();

    // Probar Subcaso C3b (REJECT)
    const btnReject = page.locator('#hitl-reject');
    await btnReject.click();
    await expect(btnReject).toHaveClass(/hitl-opt-btn--active/);
    await expect(page.locator('.state-inspector-card')).toContainText('human_approval_rejected');

    // Probar Subcaso C3c (REVAL_FAIL)
    const btnRevalFail = page.locator('#hitl-reval-fail');
    await btnRevalFail.click();
    await expect(btnRevalFail).toHaveClass(/hitl-opt-btn--active/);
    await expect(page.locator('.state-inspector-card')).toContainText('post_approval_revalidation_failed');

    // Volver a C3a (APPROVE)
    const btnApprove = page.locator('#hitl-approve');
    await btnApprove.click();
    await expect(btnApprove).toHaveClass(/hitl-opt-btn--active/);
    await expect(page.locator('.state-inspector-card')).toContainText('TCK-1001');

    // Seleccionar C4 (Forbidden restart)
    await scC4.click();
    await expect(page.locator('.state-inspector-card')).toContainText('policy_blocked_tool_restart_service');

    // Seleccionar C5 (Regression suite)
    await scC5.click();
    await expect(page.locator('.state-inspector-card')).toContainText('safety_policy_bypass');
    await expect(page.locator('.state-inspector-card')).toContainText('missing_post_approval_revalidation');

    // Inspector de Evento en Timeline
    const firstTimelineEntry = page.locator('.timeline-entry').first();
    await firstTimelineEntry.click();
    const inspectorPanel = page.locator('#event-inspector-panel');
    await expect(inspectorPanel).toBeVisible();

    // 7. Pestaña 3: Evaluación & Launchpad
    const tabEval = page.locator('#tab-evaluation');
    await tabEval.click();
    await expect(tabEval).toHaveClass(/studio-tab-btn--active/);

    // Verificar tabla de evaluación de casos
    const benchmarkTable = page.locator('.benchmark-table');
    await expect(benchmarkTable).toBeVisible();
    await expect(benchmarkTable).toContainText('C1');
    await expect(benchmarkTable).toContainText('C2');
    await expect(benchmarkTable).toContainText('C3');
    await expect(benchmarkTable).toContainText('C4');
    await expect(benchmarkTable).toContainText('C5');

    const passBadges = benchmarkTable.locator('.verdict-pass');
    await expect(passBadges).toHaveCount(5);

    // 8. Verificar tarjeta de descarga del taller y Colab CTA
    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    await expect(heroCard).toContainText('M05-LAB05-taller-agent-engineering.md');
    await expect(heroCard).toContainText('LAB 05: Agent Engineering Capstone en Python');

    const colabBtn = page.locator('#btn-open-colab');
    await expect(colabBtn).toBeVisible();
    await expect(colabBtn).toHaveAttribute('href', 'https://colab.research.google.com/');

    // 9. Descarga real del archivo y validación de contenido
    const downloadBtn = page.locator('#btn-download-lab');
    await expect(downloadBtn).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);

    expect(download.suggestedFilename()).toBe('M05-LAB05-taller-agent-engineering.md');
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('# Taller Lab 05 — Agent Engineering Capstone');
      expect(content).toContain('get_service_status');
      expect(content).toContain('create_ticket');
      expect(content).toContain('restart_service');
      expect(content).toContain('TODO 1');
      expect(content).toContain('TODO 6');
      expect(content.length).toBeGreaterThan(15000);
    }

    // Alerta de éxito de descarga
    const alertBox = heroCard.locator('.activity-hero-card__alert');
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText('Descarga iniciada con éxito');

    // 10. Verificación de ausencia de errores no controlados y ausencia de rutas absolutas
    const pageText = await page.innerText('body');
    expect(pageText).not.toContain('C:\\Users\\');
    expect(pageText).not.toContain('C:/Users/');

    const realErrors = consoleErrors.filter(e => !e.includes('favicon.ico'));
    expect(realErrors).toEqual([]);
  });

  test('Mobile Responsive Validation: Layout adapts cleanly without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/#/academy/modules/m05-ai-agents/lab-05-design-agentic-workflow');
    await page.waitForLoadState('networkidle');

    // Header y chips
    const chipCapstone = page.locator('.chip-capstone');
    await expect(chipCapstone).toBeVisible();

    // Map
    const buildingMap = page.locator('app-agent-building-map');
    await expect(buildingMap).toBeVisible();

    // Tabs
    const tabSim = page.locator('#tab-simulator');
    await expect(tabSim).toBeVisible();
    await tabSim.click();

    // Botones de escenario
    const scC1 = page.locator('#scenario-c1');
    await expect(scC1).toBeVisible();

    // Tab de evaluación
    const tabEval = page.locator('#tab-evaluation');
    await tabEval.click();

    const heroCard = page.locator('.activity-hero-card');
    await expect(heroCard).toBeVisible();
    const downloadBtn = page.locator('#btn-download-lab');
    await expect(downloadBtn).toBeVisible();

    // Verificación de ausencia de scroll horizontal desbordado
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('Navigation Flow: Access from /labs home card to Lab 05 and footer back navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Iniciar en /labs
    await page.goto('/#/labs');
    await page.waitForLoadState('networkidle');

    const lab05Card = page.locator('#lab-05-card');
    await expect(lab05Card).toBeVisible();
    await expect(lab05Card).toContainText('Laboratorio 05 — Agent Engineering Capstone');

    await lab05Card.click();
    await expect(page).toHaveURL(/.*lab-05-design-agentic-workflow/);

    // Footer back link to lesson 07
    const backBtn = page.locator('a[routerlink*="lesson-07-observability-evaluation"]').first();
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/.*lesson-07-observability-evaluation/);
  });

});
