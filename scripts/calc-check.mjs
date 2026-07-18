// Verificación interactiva de la calculadora (throwaway-ish; útil en Task 13).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const base = process.argv[2] || 'http://localhost:4340';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(1700);
await page.locator('#calculator').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: 'shots/calc-desktop.png' });

// Estado por default (2br) — leer resultados
const grab = async () =>
  page.evaluate(() => {
    const el = document.querySelector('#calculator');
    return el.innerText.replace(/\n{2,}/g, '\n').slice(0, 1200);
  });
console.log('--- DEFAULT ---');
console.log(await grab());

// Cambiar a studio + larga estancia + 10 años
await page.locator('#calculator input[name="calc-typology"][value="studio"]').click({ force: true });
await page.waitForTimeout(200);
await page.locator('#calculator input[value="long"]').click({ force: true }).catch(() => {});
await page.waitForTimeout(200);
console.log('--- STUDIO/LONG ---');
console.log((await grab()).slice(0, 600));

// Abrir el gate y probar validación
const gateBtn = page.locator('#calculator button, #calculator a').filter({ hasText: /projection|simulaci/i }).first();
await gateBtn.click();
await page.waitForTimeout(400);
await page.screenshot({ path: 'shots/calc-gate.png' });
const submit = page.locator('#calculator form button[type="submit"]').first();
await submit.click();
await page.waitForTimeout(400);
await page.screenshot({ path: 'shots/calc-validation.png' });

// Llenar válido → submitLead fallará (endpoint no existe) → fallback WhatsApp
await page.locator('#calculator form #lf-name').fill('Prueba Claude');
await page.locator('#calculator form #lf-phone').fill('9981234567');
await submit.click();
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/calc-fallback.png' });
const waHref = await page
  .locator('#calculator a[href*="wa.me"]')
  .first()
  .getAttribute('href')
  .catch(() => null);
console.log('WA fallback href:', waHref ? waHref.slice(0, 110) : 'NOT FOUND');
console.log('console errors:', errors.length, errors.slice(0, 3));

// Mobile shot
const m = await browser.newPage({ viewport: { width: 375, height: 812 } });
await m.goto(base, { waitUntil: 'networkidle' });
await m.waitForTimeout(1700);
await m.locator('#calculator').scrollIntoViewIfNeeded();
await m.waitForTimeout(500);
await m.screenshot({ path: 'shots/calc-mobile.png' });
await browser.close();
