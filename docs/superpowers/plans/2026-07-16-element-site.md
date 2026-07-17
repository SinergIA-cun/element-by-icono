# ELEMENT by ICONO — Plan de implementación del sitio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sitio one-page de conversión para ELEMENT by ICONO (nivel Urbana Park) con calculadora de inversión, ES/EN, leads calificados a Airtable vía Velo, montado como embed full-viewport en el sitio Wix existente.

**Architecture:** Vite + vanilla JS/CSS (sin framework, bundle < 150kb gz). Lógica financiera como funciones puras testeadas con Vitest. Config única (`src/lib/config.js`) con todos los datos reales y supuestos. Leads: frontend → `POST https://www.elementbyicono.com/_functions/submitLead` (Velo) → Airtable. Deploy del bundle a GitHub Pages; iframe full-viewport en la home de Wix.

**Tech Stack:** Vite, Vitest, vanilla JS (ES modules), CSS custom properties, Velo (Wix), Airtable REST API, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-07-16-element-redesign-design.md`

---

## Estructura de archivos

```
element-by-icono/
├── index.html                     # shell + secciones (una <section> por componente)
├── package.json / vite.config.js
├── public/media/                  # assets de IG optimizados (webp/mp4)
├── src/
│   ├── main.js                    # bootstrap: i18n, render secciones, observers
│   ├── styles/
│   │   ├── tokens.css             # paleta navy/concreto/arena/dorado, tipografía, spacing
│   │   ├── typography.css
│   │   └── global.css             # reset, blueprint texture, reveals
│   ├── lib/
│   │   ├── config.js              # DATOS: precios, supuestos renta/plusvalía, FX, WhatsApp
│   │   ├── finance.js             # cálculo puro (TESTEADO)
│   │   ├── format.js              # moneda/números MXN-USD (TESTEADO)
│   │   ├── i18n.js                # diccionarios ES/EN + t() (TESTEADO)
│   │   └── leads.js               # submitLead() + buildWhatsAppUrl() (TESTEADO)
│   └── components/                # un dir por sección: hero, stats, location,
│       └── .../*.js + *.css       # typologies, calculator, gallery, timeline,
│                                  # track-record, faq, lead-form
├── velo/http-functions.js         # código para pegar en Velo (backend Wix)
├── tests/{finance,format,i18n,leads}.test.js
└── docs/wix-integration.md        # pasos manuales: secret, Velo, embed, SEO
```

---

### Task 1: Scaffold del proyecto

**Files:** Create: `package.json`, `vite.config.js`, `index.html`, `src/styles/tokens.css`, `src/styles/typography.css`, `src/styles/global.css`, `src/main.js`, `.gitignore`

- [ ] **Step 1:** `npm create vite@latest . -- --template vanilla` (en el repo existente; conservar `docs/` y `.git`), luego `npm i -D vitest`
- [ ] **Step 2:** Añadir a `package.json`: `"test": "vitest run"`, `"dev": "vite"`, `"build": "vite build"`. En `vite.config.js`: `base: './'` (rutas relativas para GitHub Pages).
- [ ] **Step 3:** Escribir `src/styles/tokens.css` con la paleta del spec:

```css
:root {
  /* Industrial Boutique — navy/concreto/arena/dorado (flyer oficial) */
  --ink: oklch(21% 0.045 260);        /* navy-tinta profundo */
  --ink-soft: oklch(28% 0.04 260);
  --concrete: oklch(88% 0.005 90);
  --sand: oklch(94% 0.02 85);
  --latte: oklch(80% 0.04 80);
  --gold: oklch(72% 0.11 85);         /* acento dorado CTAs/datos */
  --gold-deep: oklch(60% 0.12 80);
  --paper: oklch(97% 0.008 85);

  --text-hero: clamp(3rem, 1rem + 7vw, 7.5rem);
  --text-display: clamp(2rem, 1rem + 3.5vw, 4rem);
  --text-base: clamp(1rem, .95rem + .3vw, 1.125rem);
  --space-section: clamp(4.5rem, 3rem + 6vw, 11rem);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --dur: 600ms;
}
```

- [ ] **Step 4:** `typography.css`: cargar 2 familias vía `@font-face` self-hosted (descargar de Google Fonts: **Archivo Expanded** para display, **Inter** para cuerpo; `font-display: swap`; numerales tabulares `font-variant-numeric: tabular-nums` en `.num`). `global.css`: reset mínimo, `scroll-behavior: smooth`, clase `.reveal` (translateY+opacity, transición compositor-only), `@media (prefers-reduced-motion: reduce)` desactiva todo, textura blueprint como SVG inline data-URI de líneas finas al 4% de opacidad sobre secciones `--ink`.
- [ ] **Step 5:** `index.html`: `<main>` con 10 `<section>` semánticas vacías con ids (`hero`, `stats`, `location`, `typologies`, `calculator`, `gallery`, `timeline`, `track-record`, `faq`, `contact`), `lang="es"`, meta viewport. `src/main.js`: importar estilos, IntersectionObserver que añade `.revealed` a `.reveal`.
- [ ] **Step 6:** `npm run dev` → verificar en el Browser pane que carga sin errores de consola. Commit: `feat: scaffold Vite + design tokens Industrial Boutique`

### Task 2: Módulo financiero (TDD — el corazón de la calculadora)

**Files:** Create: `src/lib/finance.js`, `tests/finance.test.js`

- [ ] **Step 1:** Escribir tests que fallan:

```js
import { describe, test, expect } from 'vitest';
import { grossAnnualRent, netAnnualRent, netYield, projectedValue, totalRoi, paybackYears } from '../src/lib/finance.js';

const airbnb = { mode: 'airbnb', adr: 1500, occupancy: 0.65 };
const longTerm = { mode: 'long', monthlyRent: 16000 };
const costs = { maintenanceMonthly: 1800, adminPct: 0.20, propertyTaxAnnual: 3000 };

describe('grossAnnualRent', () => {
  test('airbnb = ADR × 365 × ocupación', () => {
    expect(grossAnnualRent(airbnb)).toBeCloseTo(1500 * 365 * 0.65);
  });
  test('larga estancia = renta × 12', () => {
    expect(grossAnnualRent(longTerm)).toBe(192000);
  });
});

describe('netAnnualRent', () => {
  test('resta administración, mantenimiento y predial', () => {
    const gross = grossAnnualRent(longTerm); // 192000
    // 192000 - 20% admin (38400) - 1800×12 (21600) - 3000 = 129000
    expect(netAnnualRent(gross, costs)).toBe(129000);
  });
  test('nunca regresa NaN con costos vacíos', () => {
    expect(netAnnualRent(100000, {})).toBe(100000);
  });
});

describe('projectedValue', () => {
  test('plusvalía compuesta', () => {
    expect(projectedValue(2100000, 0.08, 5)).toBeCloseTo(2100000 * 1.08 ** 5);
  });
});

describe('totalRoi', () => {
  test('(rentas acumuladas + plusvalía) / precio', () => {
    const roi = totalRoi({ price: 2100000, netAnnual: 129000, appreciationPct: 0.08, years: 5 });
    const expected = (129000 * 5 + (2100000 * 1.08 ** 5 - 2100000)) / 2100000;
    expect(roi).toBeCloseTo(expected);
  });
});

describe('paybackYears', () => {
  test('precio / renta neta anual', () => {
    expect(paybackYears(2100000, 129000)).toBeCloseTo(16.28, 1);
  });
  test('Infinity-safe: renta 0 regresa null', () => {
    expect(paybackYears(2100000, 0)).toBeNull();
  });
});

describe('netYield', () => {
  test('renta neta / precio', () => {
    expect(netYield(129000, 2100000)).toBeCloseTo(0.0614, 3);
  });
});
```

- [ ] **Step 2:** `npm test` → FAIL (módulo no existe)
- [ ] **Step 3:** Implementar `src/lib/finance.js`:

```js
export function grossAnnualRent(rental) {
  if (rental.mode === 'airbnb') return rental.adr * 365 * rental.occupancy;
  return rental.monthlyRent * 12;
}

export function netAnnualRent(gross, { maintenanceMonthly = 0, adminPct = 0, propertyTaxAnnual = 0 } = {}) {
  return gross - gross * adminPct - maintenanceMonthly * 12 - propertyTaxAnnual;
}

export function netYield(netAnnual, price) {
  return netAnnual / price;
}

export function projectedValue(price, appreciationPct, years) {
  return price * (1 + appreciationPct) ** years;
}

export function totalRoi({ price, netAnnual, appreciationPct, years }) {
  const capitalGain = projectedValue(price, appreciationPct, years) - price;
  return (netAnnual * years + capitalGain) / price;
}

export function paybackYears(price, netAnnual) {
  if (netAnnual <= 0) return null;
  return price / netAnnual;
}
```

- [ ] **Step 4:** `npm test` → PASS (8 tests)
- [ ] **Step 5:** Commit: `feat: motor financiero de la calculadora con tests`

### Task 3: format.js + i18n.js (TDD)

**Files:** Create: `src/lib/format.js`, `src/lib/i18n.js`, `tests/format.test.js`, `tests/i18n.test.js`

- [ ] **Step 1:** Tests:

```js
// tests/format.test.js
import { test, expect } from 'vitest';
import { money, pct } from '../src/lib/format.js';
test('MXN sin decimales', () => expect(money(2100000, 'MXN')).toBe('$2,100,000'));
test('USD convierte con FX', () => expect(money(2100000, 'USD', 18.5)).toBe('US$113,514'));
test('pct una decimal', () => expect(pct(0.0614)).toBe('6.1%'));

// tests/i18n.test.js
import { test, expect } from 'vitest';
import { t, setLang, detectLang } from '../src/lib/i18n.js';
test('es por default', () => expect(t('nav.calculator')).toBe('Simula tu inversión'));
test('cambia a en', () => { setLang('en'); expect(t('nav.calculator')).toBe('Run the numbers'); setLang('es'); });
test('detectLang cae a es', () => expect(detectLang('fr-FR')).toBe('es'));
test('detectLang en-US → en', () => expect(detectLang('en-US')).toBe('en'));
test('key faltante regresa la key, no undefined', () => expect(t('nope.nope')).toBe('nope.nope'));
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** Implementar. `format.js`:

```js
export function money(amountMxn, currency = 'MXN', fx = 1) {
  if (currency === 'USD') {
    return 'US$' + Math.round(amountMxn / fx).toLocaleString('en-US');
  }
  return '$' + Math.round(amountMxn).toLocaleString('en-US');
}
export function pct(x) { return (x * 100).toFixed(1) + '%'; }
```

`i18n.js`: objeto `dict = { es: {...}, en: {...} }` con claves anidadas por sección (el copy completo se llena en Task 8); `t(key)` navega con `key.split('.')` y regresa la key si falta; `setLang(l)` guarda en módulo y `document.documentElement.lang`; `detectLang(navLang = navigator.language)` regresa `'en'` si empieza con `en`, si no `'es'`. Emitir evento `langchange` en `window` para que las secciones re-rendericen.
- [ ] **Step 4:** `npm test` → PASS. Commit: `feat: formato de moneda y i18n ES/EN`

### Task 4: Investigación de mercado + config.js

**Files:** Create: `src/lib/config.js`, `docs/market-research.md`

- [ ] **Step 1:** WebSearch (2-3 búsquedas): ADR y ocupación promedio Airbnb en Cancún centro 2025-2026 (AirDNA u otra fuente), plusvalía anual histórica de bienes raíces en Cancún/Quintana Roo, renta larga estancia de deptos nuevos en Cancún centro. Guardar hallazgos con URLs en `docs/market-research.md`.
- [ ] **Step 2:** Escribir `src/lib/config.js` — TODO dato vive aquí:

```js
// ÚNICO lugar donde se editan datos. [DATO PENDIENTE] = validar con ICONO.
export const CONFIG = {
  whatsapp: '529983410834',
  fxMxnUsd: 18.5,                    // editable; revisar al lanzar
  delivery: { es: 'Enero 2027', en: 'January 2027' },
  presale: { discountPct: 0.06, label: { es: 'Preventa Friends & Family', en: 'Friends & Family presale' } },
  appreciationPct: 0.08,             // ← de la investigación, citar fuente en market-research.md
  costs: {
    maintenanceMonthly: 1800,        // [DATO PENDIENTE] validar con ICONO
    adminPct: 0.20,                  // administración de rentas típica [DATO PENDIENTE]
    propertyTaxAnnual: 3000,         // predial aprox [DATO PENDIENTE]
  },
  typologies: [
    { id: 'studio', priceFrom: 2100000, m2: null /*[DATO PENDIENTE]*/, units: null,
      name: { es: 'Estudios', en: 'Studios' },
      rental: { adr: null, occupancy: null, monthlyRent: null } }, // ← investigación
    { id: '2br', priceFrom: 4200000, m2: null, units: null,
      name: { es: '2 Recámaras', en: '2 Bedrooms' },
      rental: { adr: null, occupancy: null, monthlyRent: null } },
    { id: '3br', priceFrom: 5000000, m2: null, units: null,
      name: { es: '3 Recámaras', en: '3 Bedrooms' },
      rental: { adr: null, occupancy: null, monthlyRent: null } },
  ],
};
```

Llenar `rental.*` y `appreciationPct` con los números investigados (por tipología: ADR estudio ≠ ADR 3 rec). Ningún `null` debe quedar donde la calculadora lo use — si no hay dato, poner supuesto investigado y marcarlo `// fuente: <url>`.
- [ ] **Step 3:** Commit: `feat: config con datos del flyer + supuestos de mercado citados`

### Task 5: Media de Instagram

**Files:** Create: `public/media/*`, `docs/media-credits.md`

- [ ] **Step 1:** Abrir https://www.instagram.com/elementbyicono/ en el Browser pane; identificar los 8-12 mejores posts (renders exteriores, interiores, avance de obra, video del rooftop). Si hay login-wall, intentar vista pública / embeds (`/p/<id>/embed/`).
- [ ] **Step 2:** Descargar las imágenes en máxima resolución disponible (URL `scontent` directa); videos: si no son descargables, anotar los permalinks en `docs/media-credits.md` para pedirlos al cliente.
- [ ] **Step 3:** Convertir a WebP (`cwebp -q 82`) en 2 tamaños (1600w, 800w). El flyer del cliente ya provisto también se recorta: render del edificio para hero fallback, 4 interiores para tipologías/galería.
- [ ] **Step 4:** Commit: `feat: media optimizada de Instagram y flyer`

### Task 6: Secciones hero + stats + location + typologies

**Files:** Create: `src/components/hero/*`, `src/components/stats/*`, `src/components/location/*`, `src/components/typologies/*`; Modify: `index.html`, `src/main.js`

Cada componente exporta `render(el)` y escucha `langchange`. Contenido (del spec y flyer):

- [ ] **Step 1: Hero.** Render del edificio full-bleed (imagen Task 5, `fetchpriority="high"`, dimensiones explícitas), overlay `--ink` con gradiente, eyebrow "Preventa Friends & Family — 6% de descuento por tiempo limitado" en `--gold`, H1 display "Una nueva forma de invertir en Cancún" (tracking apretado, `--text-hero`), sub "Departamentos boutique desde $2.1 MDP en el corazón de la ciudad", CTAs: primario dorado "Simula tu inversión" (`href="#calculator"`) + secundario ghost WhatsApp (usa `buildWhatsAppUrl` de Task 7). Toggle ES/EN y selector MXN/USD fijos en la esquina superior.
- [ ] **Step 2: Stats bar.** Franja `--ink` con textura blueprint: `28 unidades · Entrega enero 2027 · 6% descuento preventa · Rooftop con jacuzzi`. Números con contador animado (rAF, arranca al entrar al viewport, respeta reduced-motion).
- [ ] **Step 3: Location.** Grid asimétrico: mapa SVG estilizado propio (trazo blueprint sobre `--sand`: Av. Nader, Zona Hotelera, Puerto Cancún, Mercado 28, ADO, aeropuerto como puntos con distancia) + 4 cards de proximidad del flyer (1 cuadra Av. Nader / 3 min Puerto Cancún y Plaza Las Américas / <5 min playas y Mercado 28 / 17 min aeropuerto).
- [ ] **Step 4: Typologies.** 3 cards (datos de `CONFIG.typologies`): nombre, "desde $X" (respeta selector de moneda), m² si existe, renta neta estimada/año calculada con `finance.js` ("hasta ~$X/año neto*"), bullet de disponibilidad, CTA "Simular esta unidad" → `#calculator` con `?typology=id` (setea el select). Card de 2 Rec destacada (borde dorado, "La favorita de inversionistas").
- [ ] **Step 5:** Verificar en Browser pane (consola limpia, reveal al scroll, toggle idioma/moneda actualiza todo). Screenshot desktop + 375px. Commit: `feat: hero, stats, ubicación y tipologías`

### Task 7: leads.js (TDD) — envío y WhatsApp

**Files:** Create: `src/lib/leads.js`, `tests/leads.test.js`

- [ ] **Step 1:** Tests:

```js
import { test, expect, vi } from 'vitest';
import { buildWhatsAppUrl, submitLead } from '../src/lib/leads.js';

test('WhatsApp URL con simulación precargada', () => {
  const url = buildWhatsAppUrl({ phone: '529983410834', name: 'Ana',
    typology: '2 Recámaras', netYieldPct: '6.1%', lang: 'es' });
  expect(url).toContain('https://wa.me/529983410834?text=');
  expect(decodeURIComponent(url)).toContain('2 Recámaras');
});

test('submitLead hace POST al endpoint Velo y regresa ok', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  const res = await submitLead({ name: 'Ana', phone: '998', profile: 'inversionista' });
  expect(fetch).toHaveBeenCalledWith('https://www.elementbyicono.com/_functions/submitLead',
    expect.objectContaining({ method: 'POST' }));
  expect(res.ok).toBe(true);
});

test('submitLead reintenta una vez y reporta error sin lanzar', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error('net'));
  const res = await submitLead({ name: 'Ana' });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(res.ok).toBe(false);
});
```

- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** Implementar: `buildWhatsAppUrl` arma mensaje por idioma ("Hola, simulé una inversión en ELEMENT: {typology}, rendimiento neto {netYieldPct}. Quiero más información. — {name}"); `submitLead` → `fetch(ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lead)})`, 1 reintento en catch, siempre resuelve `{ok:boolean}`.
- [ ] **Step 4:** `npm test` → PASS. Commit: `feat: envío de leads con retry y deep-link WhatsApp`

### Task 8: Calculadora (UI + gate de conversión)

**Files:** Create: `src/components/calculator/calculator.js`, `src/components/calculator/calculator.css`, `src/components/lead-form/lead-form.js` (reusable)

- [ ] **Step 1:** UI en panel `--ink` con acentos dorados, layout 2 columnas (inputs | resultado): select tipología (desde CONFIG, precarga por `?typology=`), radio forma de pago (contado −6% F&F / plan de pagos), radio modo renta (Airbnb / larga estancia), slider horizonte (3/5/10 años). Todo `<form>` semántico con labels.
- [ ] **Step 2:** Al cambiar cualquier input → recalcular con `finance.js` y animar los outputs (numerales tabulares grandes): **rendimiento neto anual** ($ y %), **valor proyectado** al horizonte, **ROI total**, **payback**. Disclaimer visible: "Simulación informativa con supuestos de mercado; no constituye asesoría financiera ni garantía de rendimientos."
- [ ] **Step 3:** Gate: bajo el resultado, CTA dorado "Recibe tu simulación completa" abre `lead-form` inline (nombre, teléfono, email, perfil inversionista/comprador/broker, canal preferido). Al enviar: `submitLead({...form, ...simulación, lang, source:'calculator'})`; éxito → mensaje + botón "Continuar por WhatsApp" (`buildWhatsAppUrl` con la simulación); error → mensaje amigable + el mismo botón WhatsApp como fallback (el lead nunca se pierde).
- [ ] **Step 4:** Validación: teléfono ≥ 10 dígitos, email con patrón, nombre no vacío; errores inline por campo en el idioma activo; sin NaN visible nunca (si falta dato de config, la tipología muestra "—" y log de advertencia).
- [ ] **Step 5:** Probar en Browser pane los 3×2×2×3 caminos principales (tipología × pago × renta × horizonte spot-check), ambos idiomas y monedas. Screenshot. Commit: `feat: calculadora de inversión con gate de leads`

### Task 9: Gallery, timeline de obra, trayectoria, FAQ, cierre

**Files:** Create: `src/components/{gallery,timeline,track-record,faq}/*`, sección `#contact` con `lead-form` reusado

- [ ] **Step 1: Gallery.** Grid editorial (bento, alturas mixtas) con media de Task 5; lazy + dimensiones explícitas; lightbox simple sin librería.
- [ ] **Step 2: Timeline.** Horizontal con hitos: Preventa F&F (hoy) → construcción → **Entrega enero 2027**; fotos de avance si el IG las tiene; barra de progreso dorada.
- [ ] **Step 3: Track record.** ICONO +10 años; card de Icono Towers (screenshot/render + link iconotowers.com) como proyecto entregado.
- [ ] **Step 4: FAQ.** `<details>` estilizados, 6 preguntas (ES/EN): fideicomiso para extranjeros, escrituración en preventa, administración de rentas, planes de pago, qué incluye el mantenimiento, cómo se firma. Copy redactado completo en `i18n.js` (no lorem).
- [ ] **Step 5: Cierre.** Sección `--ink` full: "Quedan pocas unidades en preventa Friends & Family" + `lead-form` (source:'footer') + dirección (Crisantemos Lt. 18-01, SM 22, Cancún) + admin@elementbyicono.com + WhatsApp.
- [ ] **Step 6:** Copy completo ES/EN de TODAS las secciones en `i18n.js`; `npm test` (i18n sigue pasando). Screenshots 320/768/1440 de la página completa. Commit: `feat: galería, obra, trayectoria, FAQ y cierre`

### Task 10: Base Airtable "Element Leads"

**Files:** ninguno (MCP Airtable) + anotar IDs en `docs/wix-integration.md`

- [ ] **Step 1:** Vía MCP Airtable: `create_base` "Element Leads" en el workspace del usuario, tabla **Leads** con campos: Nombre (text), Teléfono (phone), Email (email), Perfil (select: Inversionista/Comprador/Broker), Tipología (select: Estudio/2 Rec/3 Rec), Forma de pago (select: Contado/Plan), Modo renta (select: Airbnb/Larga estancia), Horizonte (number), Rendimiento neto (text), ROI proyectado (text), Canal preferido (select: WhatsApp/Llamada/Correo), Idioma (select ES/EN), Fuente (select: calculator/footer/hero), Estatus (select: Nuevo/Contactado/Visita/Apartado/Descartado, default Nuevo), Fecha (createdTime).
- [ ] **Step 2:** Crear 1 registro de prueba vía MCP y borrarlo (valida esquema). Anotar `baseId`/`tableId` en `docs/wix-integration.md`. Commit del doc.

### Task 11: Velo backend

**Files:** Create: `velo/http-functions.js`, `docs/wix-integration.md` (pasos)

- [ ] **Step 1:** Escribir `velo/http-functions.js` completo:

```js
import { ok, badRequest, serverError } from 'wix-http-functions';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

const BASE_ID = 'appXXXX';   // ← Task 10
const TABLE = 'Leads';

export async function post_submitLead(request) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const lead = await request.body.json();
    if (!lead.name || !(lead.phone || lead.email)) {
      return badRequest({ headers, body: { ok: false, error: 'missing fields' } });
    }
    const token = await getSecret('AIRTABLE_TOKEN');
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        'Nombre': lead.name, 'Teléfono': lead.phone || '', 'Email': lead.email || '',
        'Perfil': lead.profile || '', 'Tipología': lead.typology || '',
        'Forma de pago': lead.payment || '', 'Modo renta': lead.rentalMode || '',
        'Horizonte': lead.years || null, 'Rendimiento neto': lead.netYield || '',
        'ROI proyectado': lead.roi || '', 'Canal preferido': lead.channel || '',
        'Idioma': (lead.lang || 'es').toUpperCase(), 'Fuente': lead.source || '',
      }}),
    });
    if (!res.ok) return serverError({ headers, body: { ok: false } });
    return ok({ headers, body: { ok: true } });
  } catch (e) {
    return serverError({ headers, body: { ok: false } });
  }
}

export function options_submitLead() {
  return ok({ headers: { 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type' } });
}
```

- [ ] **Step 2:** Documentar en `docs/wix-integration.md`: (1) crear Personal Access Token de Airtable con scope `data.records:write` solo a esa base; (2) en Wix: Ajustes → Secrets Manager → secret `AIRTABLE_TOKEN`; (3) pegar `http-functions.js` en Velo (Dev Mode → Backend); (4) publicar. Este paso es manual en el editor Wix — o con credenciales del usuario vía navegador, guiado.
- [ ] **Step 3:** Probar: `curl -X POST https://www.elementbyicono.com/_functions/submitLead -H 'Content-Type: application/json' -d '{"name":"Test Claude","phone":"0000000000","source":"test"}'` → `{"ok":true}` y registro visible en Airtable (borrarlo después). Commit: `feat: backend Velo submitLead → Airtable`

### Task 12: Build, deploy y montaje en Wix

**Files:** Create: `.github/workflows/deploy.yml`, Modify: `docs/wix-integration.md`

- [ ] **Step 1:** `npm run build` → verificar presupuesto: JS < 150kb gz, CSS < 30kb (`ls -lh dist/assets`).
- [ ] **Step 2:** `gh repo create element-by-icono --public --source . --push` (el contenido ya es público en el sitio). Workflow `deploy.yml` estándar de Pages (build + `actions/deploy-pages`). Verificar URL `https://<user>.github.io/element-by-icono/` carga.
- [ ] **Step 3:** Montaje en Wix (manual guiado o con credenciales): en la home del editor, borrar secciones actuales, insertar **Embed → Custom Element/iframe** apuntando a la URL de Pages, full-width, alto 100vh, sin scroll del padre (el iframe scrollea). Documentar cada clic en `docs/wix-integration.md`.
- [ ] **Step 4:** SEO de la página Wix (vía MCP o editor): title "ELEMENT by ICONO — Departamentos en preventa en el centro de Cancún desde $2.1 MDP", meta description con plusvalía/entrega enero 2027, OG image = render del edificio. Bloque de texto indexable arriba/abajo del embed con el resumen del desarrollo.
- [ ] **Step 5:** Publicar Wix y verificar https://www.elementbyicono.com/ sirve el sitio nuevo. Commit: `feat: deploy GitHub Pages + integración Wix`

### Task 13: Verificación final

- [ ] **Step 1:** `npm test` → todo verde. Browser pane sobre el dominio real: consola sin errores, red sin 4xx/5xx.
- [ ] **Step 2:** Responsive: screenshots 320/375/768/1024/1440 — sin overflow horizontal en ninguno.
- [ ] **Step 3:** E2E del lead real: simular en la calculadora → enviar formulario → verificar registro en Airtable vía MCP (marcar Estatus "Descartado"/test) → botón WhatsApp abre wa.me con el mensaje correcto.
- [ ] **Step 4:** Lighthouse sobre el dominio (esperable: el shell Wix penaliza algo; documentar score del bundle propio vs. página completa). Verificar `prefers-reduced-motion`, navegación por teclado del form y la calculadora, contraste AA de dorado sobre navy.
- [ ] **Step 5:** Ambos idiomas y monedas end-to-end. Commit final: `chore: verificación final y ajustes`

---

## Self-review del plan

- **Cobertura del spec:** 10 secciones (Tasks 6, 8, 9) ✓ · calculadora con gate (8) ✓ · Airtable+Velo+WhatsApp (7, 10, 11) ✓ · ES/EN + MXN/USD (3, 6, 8, 9) ✓ · media IG (5) ✓ · SEO mitigación (12) ✓ · testing (2, 3, 7, 13) ✓ · manejo de errores (7 retry, 8 validación/fallback) ✓
- **Placeholders:** los `[DATO PENDIENTE]` de config.js son *contenido del producto* (sistema acordado con el usuario), no huecos del plan.
- **Consistencia de tipos:** `finance.js` firmas usadas en Task 8 coinciden con Task 2; campos del lead en Task 7/8 coinciden con columnas de Task 10 y mapeo de Task 11 ✓
