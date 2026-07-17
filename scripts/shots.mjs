// Captura screenshots de verificación con Chromium headless real.
// Uso: node scripts/shots.mjs [urlBase] — default http://localhost:4340
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:4340';
const outDir = 'shots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const [name, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 375, height: 812 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600); // reveals + fallback
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log(`${name}: overflowX=${overflow}px errors=${errors.length}`);
  errors.slice(0, 5).forEach((e) => console.log('  ERR:', e.slice(0, 160)));
  await page.close();
}
await browser.close();
