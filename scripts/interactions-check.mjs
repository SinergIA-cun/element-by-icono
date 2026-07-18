// Chequeo de interacciones de las secciones finales (lightbox, FAQ, form, WA).
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:4340';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(1700);

await p.locator('#gallery .gallery__cell').first().click();
const lbOpen = await p.locator('#gallery dialog[open]').count();
await p.keyboard.press('Escape');
const lbClosed = await p.locator('#gallery dialog[open]').count();

await p.locator('#faq details summary').first().click();
const faqOpen = await p.locator('#faq details[open]').count();

await p.locator('#contact form button[type="submit"]').click();
await p.waitForTimeout(300);
const errShown = await p
  .locator('#contact .lead-form__error')
  .evaluateAll((els) => els.filter((e) => e.textContent.trim()).length);

const waCount = await p.locator('a[href*="wa.me/529983410834"]').count();
console.log(JSON.stringify({ lbOpen, lbClosed, faqOpen, errShown, waCount, pageErrors: errs.length }));
await b.close();
