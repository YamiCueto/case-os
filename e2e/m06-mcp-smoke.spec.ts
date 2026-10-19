import { test, expect } from '@playwright/test';

test.describe('M06 Model Context Protocol (MCP) — E2E Smoke & Playgrounds', () => {

  test('L01 — ¿Qué es MCP?: Renderiza y ejecuta el Simulador de Arquitectura', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // Header y título
    await expect(page.locator('h1, .living-doc-header__title').first()).toBeVisible();
    await expect(page.locator('text=¿Qué es MCP y por qué necesitamos utilizarlo?').first()).toBeVisible();

    // Playground: Simulador de Arquitectura
    const simSection = page.locator('#architecture-simulator');
    await simSection.scrollIntoViewIfNeeded();
    await expect(simSection).toBeVisible();

    // Cambiar de Servidor en el selector
    const serverSelect = page.locator('#server-select');
    await serverSelect.selectOption('filesystem');
    await expect(page.locator('#op-select')).toBeVisible();

    // Avanzar paso en la simulación
    const nextBtn = page.locator('#btn-sim-next');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verificar que el paso esté activo o se actualice
    await expect(page.locator('.step-indicator').first()).toBeVisible();
  });

  test('L02 — Servidores Útiles: Renderiza catálogo y ejecuta Playground Explorador', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-02-servidores-utiles');

    // Catálogo de servidores
    await expect(page.locator('#server-github')).toBeVisible();
    await expect(page.locator('#server-filesystem')).toBeVisible();
    await expect(page.locator('#server-playwright')).toBeVisible();

    // Playground: Explorador de Servidores (#servers-explorer)
    const explorerSection = page.locator('#servers-explorer');
    await explorerSection.scrollIntoViewIfNeeded();
    await expect(explorerSection).toBeVisible();

    // Seleccionar pestaña de Playwright MCP (#tab-server-playwright)
    const srvPlaywrightBtn = page.locator('#tab-server-playwright');
    await srvPlaywrightBtn.click();
    await expect(page.locator('text=Playwright MCP Server').first()).toBeVisible();

    // Ejecutar simulación educativa
    const simBtn = page.locator('#btn-run-mcp-sim');
    await simBtn.click();

    // Verificar resultado JSON-RPC
    const resultBox = page.locator('.sim-result-panel');
    await expect(resultBox).toBeVisible({ timeout: 5000 });
    await expect(resultBox.locator('text=tools/call').first()).toBeVisible();
  });

  test('L03 — Configuración Práctica: Inspector de Tool Calling y Compuerta HITL', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-03-configuracion-practica');

    // Playground: Tool Calling Inspector
    const inspectorSection = page.locator('#tool-calling-inspector');
    await inspectorSection.scrollIntoViewIfNeeded();
    await expect(inspectorSection).toBeVisible();

    // Seleccionar escenario de HITL (#btn-scenario-scenario-hitl)
    const hitlScenarioBtn = page.locator('#btn-scenario-scenario-hitl');
    await hitlScenarioBtn.click();

    // Comprobar que requiere aprobación humana
    const hitlGate = page.locator('.hitl-banner');
    await expect(hitlGate).toBeVisible();

    // Aprobar operación
    const approveBtn = page.locator('#btn-hitl-approve');
    await approveBtn.click();
    await expect(page.locator('text=APPROVED').first()).toBeVisible();
  });

  test('L04 — Agentes con MCP: Orquestador Agéntico Multi-MCP', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-04-agentes-mcp');

    // Playground: Orquestador (#multi-mcp-orchestrator)
    const orchestratorSection = page.locator('#multi-mcp-orchestrator');
    await orchestratorSection.scrollIntoViewIfNeeded();
    await expect(orchestratorSection).toBeVisible();

    // Paso 1 activo (Linear MCP)
    await expect(page.locator('.srv-label:has-text("Linear MCP")').first()).toBeVisible();

    // Avanzar pasos del agente (#btn-agent-next)
    const nextAgentBtn = page.locator('#btn-agent-next');
    await nextAgentBtn.click(); // Paso 2: Filesystem MCP
    await expect(page.locator('.srv-label:has-text("Filesystem MCP")').first()).toBeVisible();

    await nextAgentBtn.click(); // Paso 3: HITL Gate
    const approveActionBtn = page.locator('#btn-agent-approve');
    if (await approveActionBtn.isVisible()) {
      await approveActionBtn.click();
    }
  });

  test('LAB 06 — Capstone MCP y Cierre de Capacitaciones', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lab-06-integracion-mcp');

    // Hero y Alternativas
    await expect(page.locator('text=Laboratorio 06 — Construcción de una Integración MCP').first()).toBeVisible();
    await expect(page.locator('#card-alt-mysql')).toBeVisible();
    await expect(page.locator('#card-alt-github')).toBeVisible();

    // Seleccionar Alternativa C (Playwright MCP)
    const cardPlaywright = page.locator('#card-alt-playwright');
    await cardPlaywright.click();
    await expect(cardPlaywright).toHaveClass(/alt-card--selected/);

    // Checklist de entregables
    const markAllBtn = page.locator('#btn-mark-lab-complete');
    await markAllBtn.scrollIntoViewIfNeeded();
    await markAllBtn.click();
    await expect(page.locator('text=7 / 7 Completados').first()).toBeVisible();

    // Sección de cierre definitivo
    const closureSection = page.locator('.closure-section');
    await expect(closureSection).toBeVisible();
    await expect(closureSection.locator('text=CIERRE DEFINITIVO DEL PROGRAMA · 24 DE OCTUBRE DE 2026').first()).toBeVisible();
    await expect(closureSection.locator('#btn-return-academy-home')).toBeVisible();
  });

  test('L01 — Playground Único: Simulador de Arquitectura, Fronteras de Seguridad e Inspección de Nodos', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // 1. Verificar que NO existe la visualización 3D duplicada
    await expect(page.locator('#mcp-architecture-3d-experience')).toHaveCount(0);
    await expect(page.locator('#three-canvas-container')).toHaveCount(0);

    // 2. Verificar presencia del Playground Único
    const simSection = page.locator('#architecture-simulator');
    await simSection.scrollIntoViewIfNeeded();
    await expect(simSection).toBeVisible();

    // 3. Verificar las Fronteras de Seguridad en los Nodos del Diagrama
    await expect(page.locator('#node-btn-HOST .node-boundary')).toHaveText('Frontera App');
    await expect(page.locator('#node-btn-LLM .node-boundary')).toHaveText('Capa Cognitiva');
    await expect(page.locator('#node-btn-CLIENT .node-boundary')).toHaveText('Protocolo 1:1');
    await expect(page.locator('#node-btn-SERVER .node-boundary')).toHaveText('Sandbox Aislado');
    await expect(page.locator('#node-btn-EXTERNAL .node-boundary')).toHaveText('Infraestructura');

    // 4. Panel de Inspección de Nodo Interactivo
    const inspectorPanel = page.locator('#panel-node-inspector');
    await expect(inspectorPanel).toBeVisible();

    // Clic en MCP Host -> Muestra rol, frontera y compuerta HITL
    await page.locator('#node-btn-HOST').click();
    await expect(inspectorPanel.locator('.inspector-name')).toHaveText('MCP Host');
    await expect(inspectorPanel.locator('.inspector-boundary-badge')).toContainText('Frontera de Aplicación');
    await expect(inspectorPanel.locator('.sec-box-text')).toContainText('árbitro supremo de seguridad');

    // Clic en MCP Server -> Muestra sandbox y Least Privilege
    await page.locator('#node-btn-SERVER').click();
    await expect(inspectorPanel.locator('.inspector-name')).toHaveText('MCP Server');
    await expect(inspectorPanel.locator('.inspector-boundary-badge')).toContainText('Frontera de Seguridad');

    // Resetear foco para seguir paso activo
    const resetFocusBtn = page.locator('#btn-reset-node-focus');
    await expect(resetFocusBtn).toBeVisible();
    await resetFocusBtn.click();
    await expect(resetFocusBtn).not.toBeVisible();

    // 5. Inspección de Transporte Activo (stdio vs Streamable HTTP)
    const serverSelect = page.locator('#server-select');
    await serverSelect.selectOption('filesystem');
    const transportBadge = page.locator('.transport-badge');
    await expect(transportBadge).toHaveText('stdio');

    await serverSelect.selectOption('supabase');
    await expect(transportBadge).toHaveText('Streamable HTTP');
    await expect(page.locator('.security-hint')).toContainText('TLS/HTTPS');

    // 6. Ciclo de pasos y Payload
    await serverSelect.selectOption('github');
    const nextBtn = page.locator('#btn-sim-next');
    await nextBtn.click(); // Paso 2
    await nextBtn.click(); // Paso 3
    await expect(page.locator('.payload-code')).toBeVisible();
  });

  test('Guía del Instructor — Protección por contraseña (soyelprofe), rechazo y desbloqueo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // Limpiar almacenamiento previo para garantizar prueba desde cero
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await page.reload();

    // Botón de apertura de guía
    const openGuideBtn = page.locator('#btn-open-instructor-drawer');
    await expect(openGuideBtn).toBeVisible();

    // 1. Primer clic: NO debe abrir el drawer directamente, sino el modal de contraseña
    await openGuideBtn.click();
    const authModal = page.locator('.auth-modal');
    await expect(authModal).toBeVisible();
    await expect(page.locator('#auth-modal-title')).toContainText('Acceso a la Guía del Instructor');

    // 2. Ingresar contraseña incorrecta -> Rechazo con mensaje discreto
    const pwdInput = page.locator('#instructor-password-input');
    await pwdInput.fill('clavefalsa123');
    await page.locator('#btn-submit-instructor-password').click();

    const errorMsg = page.locator('#instructor-auth-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Contraseña de instructor incorrecta');
    await expect(authModal).toBeVisible(); // No debe cerrarse

    // 3. Ingresar contraseña correcta: "soyelprofe"
    await pwdInput.fill('soyelprofe');
    await page.locator('#btn-submit-instructor-password').click();

    // El modal debe desaparecer
    await expect(authModal).not.toBeVisible();
  });

  test('Vista Standalone Instructor (Doble Monitor) — Bloqueo directo y navegación desbloqueada', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Acceso directo sin autenticar -> Muestra modal/pantalla de bloqueo
    await page.goto('/#/academy/instructor-view/c-m6-l01');
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await page.reload();

    const authModal = page.locator('.auth-modal');
    await expect(authModal).toBeVisible();

    // Desbloquear con soyelprofe
    await page.locator('#instructor-password-input').fill('soyelprofe');
    await page.locator('#btn-submit-instructor-password').click();

    // Ahora se renderiza la vista completa
    const container = page.locator('.instructor-standalone-view');
    await expect(container).toBeVisible();
    await expect(page.locator('.badge-role')).toContainText('MONITOR DEDICADO');
    await expect(page.locator('.popout-header__title')).toContainText('¿Qué es MCP y por qué necesitamos utilizarlo?');

    // Stepper navegable
    await expect(page.locator('.stepper-track')).toBeVisible();

    // Bloque 1 activo con guion en 16.5px
    const scriptEl = page.locator('.script-quote').first();
    await expect(scriptEl).toBeVisible();
    const fontSize = await scriptEl.evaluate((el) => window.getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16);

    // Cambiar de lección a L02 desde el selector
    const lessonSelect = page.locator('#select-unit-popout');
    await lessonSelect.selectOption('c-m6-l02');
    await expect(page.locator('.popout-header__title')).toContainText('servidores MCP más útiles');

    // Cambiar de lección a Lab 06
    await lessonSelect.selectOption('c-m6-lab');
    await expect(page.locator('.popout-header__title')).toContainText('LAB 06');

    // 4. Probar botón de bloqueo: #btn-lock-instructor-popout
    const lockBtn = page.locator('#btn-lock-instructor-popout');
    await expect(lockBtn).toBeVisible();
    await lockBtn.click();

    // Debe volver a mostrar la pantalla de bloqueo
    await expect(page.locator('.auth-modal')).toBeVisible();
  });

  test('Validación Responsive Mobile (390x844) en M06', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // Verificar que el contenido principal y el simulador unificado sean visibles sin desbordamiento
    await expect(page.locator('#architecture-simulator')).toBeVisible();
    await expect(page.locator('#mcp-architecture-3d-experience')).toHaveCount(0);
    await expect(page.locator('#btn-open-instructor-drawer')).toBeVisible();
    await page.goto('/#/academy/modules/m06-mcp/lab-06-integracion-mcp');
    await expect(page.locator('.closure-section')).toBeVisible();
  });

  test('Cierre de Lecciones M06 (L01–L04) — Antipatrones colapsables, preguntas ocultas/revelables y navegación', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // ── L01 ──
    await page.goto('/#/academy/modules/m06-mcp/lesson-01-que-es-mcp');

    // 1. Antipatrones / Errores comunes
    const pitfallsSec = page.locator('#common-pitfalls');
    await pitfallsSec.scrollIntoViewIfNeeded();
    await expect(pitfallsSec).toBeVisible();

    // Solución 0 oculta inicialmente
    await expect(page.locator('#pitfall-solution-0')).not.toBeVisible();

    // Revelar solución 0
    const togglePitfall0 = page.locator('#btn-toggle-pitfall-0');
    await togglePitfall0.click();
    await expect(page.locator('#pitfall-solution-0')).toBeVisible();
    await expect(page.locator('#pitfall-solution-0')).toContainText('BUENA PRÁCTICA');

    // Ocultar de nuevo solución 0
    await togglePitfall0.click();
    await expect(page.locator('#pitfall-solution-0')).not.toBeVisible();

    // Expandir todas y colapsar
    await page.locator('#btn-expand-all-solutions').click();
    await expect(page.locator('#pitfall-solution-0')).toBeVisible();
    await page.locator('#btn-collapse-all-solutions').click();
    await expect(page.locator('#pitfall-solution-0')).not.toBeVisible();

    // 2. Preguntas al Grupo (Comprobación Socrática)
    const questionsSec = page.locator('#group-questions');
    await questionsSec.scrollIntoViewIfNeeded();
    await expect(questionsSec).toBeVisible();

    // Respuesta 0 oculta inicialmente
    await expect(page.locator('#answer-box-0')).not.toBeVisible();

    // Revelar respuesta 0
    const revealAns0 = page.locator('#btn-reveal-answer-0');
    await revealAns0.click();
    await expect(page.locator('#answer-box-0')).toBeVisible();
    await expect(page.locator('#answer-box-0')).toContainText('RESPUESTA TÉCNICA ESPERADA');

    // Ocultar de nuevo respuesta 0
    await revealAns0.click();
    await expect(page.locator('#answer-box-0')).not.toBeVisible();

    // Mostrar todas las respuestas y ocultar todas
    await page.locator('#btn-show-all-answers').click();
    await expect(page.locator('#answer-box-0')).toBeVisible();
    await page.locator('#btn-hide-all-answers').click();
    await expect(page.locator('#answer-box-0')).not.toBeVisible();

    // 3. Síntesis y Continuidad
    const synthesisSec = page.locator('#synthesis');
    await synthesisSec.scrollIntoViewIfNeeded();
    await expect(synthesisSec).toBeVisible();
    await expect(page.locator('.synthesis-card__summary')).toBeVisible();
    await expect(page.locator('.next-step-bridge')).toBeVisible();

    // 4. Finalización y Navegación
    const completionBox = page.locator('#lesson-completion-box');
    await completionBox.scrollIntoViewIfNeeded();
    await expect(completionBox).toBeVisible();

    // Marcar como completada
    const markBtn = page.locator('#btn-mark-completed');
    if (await markBtn.isVisible()) {
      await markBtn.click();
    }
    await expect(page.locator('text=LECCIÓN COMPLETADA').first()).toBeVisible();

    // Botón de índice
    await expect(page.locator('#btn-course-index')).toBeVisible();

    // Navegar a siguiente lección (L02)
    const nextLessonBtn = page.locator('#btn-next-lesson');
    await expect(nextLessonBtn).toBeVisible();
    await nextLessonBtn.click();

    // ── L02 ──
    await expect(page).toHaveURL(/.*lesson-02-servidores-utiles/);
    const l02Pitfalls = page.locator('#common-pitfalls');
    await l02Pitfalls.scrollIntoViewIfNeeded();
    await expect(l02Pitfalls).toBeVisible();

    // Probar revelación en L02
    await expect(page.locator('#answer-box-0')).not.toBeVisible();
    await page.locator('#btn-reveal-answer-0').click();
    await expect(page.locator('#answer-box-0')).toBeVisible();

    // Navegar a L03
    await page.locator('#btn-next-lesson').click();

    // ── L03 ──
    await expect(page).toHaveURL(/.*lesson-03-configuracion-practica/);
    await expect(page.locator('#common-pitfalls')).toBeVisible();
    await expect(page.locator('#group-questions')).toBeVisible();
    await expect(page.locator('#answer-box-0')).not.toBeVisible();
    await page.locator('#btn-reveal-answer-0').click();
    await expect(page.locator('#answer-box-0')).toBeVisible();

    // Navegar a L04
    await page.locator('#btn-next-lesson').click();

    // ── L04 ──
    await expect(page).toHaveURL(/.*lesson-04-agentes-mcp/);
    await expect(page.locator('#common-pitfalls')).toBeVisible();
    await expect(page.locator('#group-questions')).toBeVisible();
    await expect(page.locator('#synthesis')).toBeVisible();
    await expect(page.locator('#answer-box-0')).not.toBeVisible();
    await page.locator('#btn-reveal-answer-0').click();
    await expect(page.locator('#answer-box-0')).toBeVisible();
    await page.locator('#btn-reveal-answer-0').click();
    await expect(page.locator('#answer-box-0')).not.toBeVisible();
  });

});



