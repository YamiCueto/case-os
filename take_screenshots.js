const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to local server...');
  await page.goto('http://localhost:4200/#/academy/modules/m04-retrieval-rag/lesson-02-pipeline');
  
  // Wait for the pipeline wrapper to be visible
  await page.waitForSelector('.exp-canvas-wrapper', { timeout: 10000 });
  
  // Scroll it into view
  const canvas = await page.locator('.exp-canvas-wrapper');
  await canvas.evaluate(node => node.scrollIntoView());
  
  console.log('Taking Idle screenshot...');
  await page.screenshot({ path: 'C:\\Users\\YAMI\\.gemini\\antigravity-ide\\brain\\34548461-0a3b-4983-bbd0-e845d73a6b2d\\scratch\\narrative_1_idle.png' });
  
  console.log('Clicking Run Pipeline...');
  await page.getByRole('button', { name: /Run Pipeline/i }).click();
  
  // Wait a bit to capture the Offline stage
  await page.waitForTimeout(1000);
  console.log('Taking Offline stage screenshot...');
  await page.screenshot({ path: 'C:\\Users\\YAMI\\.gemini\\antigravity-ide\\brain\\34548461-0a3b-4983-bbd0-e845d73a6b2d\\scratch\\narrative_2_offline.png' });

  // Wait a bit to capture Retrieval stage (around 3-4s into the animation)
  await page.waitForTimeout(3000);
  console.log('Taking Retrieval stage screenshot...');
  await page.screenshot({ path: 'C:\\Users\\YAMI\\.gemini\\antigravity-ide\\brain\\34548461-0a3b-4983-bbd0-e845d73a6b2d\\scratch\\narrative_3_retrieval.png' });

  // Wait for the animation to finish completely (around 8s total)
  await page.waitForTimeout(4000);
  console.log('Taking Completed stage screenshot...');
  await page.screenshot({ path: 'C:\\Users\\YAMI\\.gemini\\antigravity-ide\\brain\\34548461-0a3b-4983-bbd0-e845d73a6b2d\\scratch\\narrative_4_completed.png' });
  
  await browser.close();
  console.log('Done!');
})();
