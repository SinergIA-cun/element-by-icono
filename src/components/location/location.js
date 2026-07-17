import './location.css';
import { t } from '../../lib/i18n.js';

const PROXIMITY_ICONS = {
  pin: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="20" r="1.4" stroke="currentColor" stroke-width="1.5"/></svg>`,
  wave: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 14c1.5 0 1.5 1.5 3 1.5S10.5 14 12 14s1.5 1.5 3 1.5S19.5 14 21 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 18.5c1.5 0 1.5 1.5 3 1.5s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 10.5a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  plane: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15.5 3 10.2V7.6l2 .4 3 2 5-.6L11 3.5l2.2.4L17 9.7l3.4.7c.9.2 1.6.9 1.6 1.8v.3c0 .8-.6 1.4-1.4 1.3L21 15.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 19h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

/**
 * Schematic blueprint map — thin ink lines on sand, gold ELEMENT marker plus
 * four labelled POIs. Deliberately abstract, not a real map embed.
 */
function blueprintMap(labels) {
  return `
  <svg class="location__map" viewBox="0 0 480 480" role="img" aria-label="${labels.aria}">
    <defs>
      <pattern id="loc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" fill="none" stroke="var(--ink)" stroke-opacity="0.07" stroke-width="1"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="480" height="480" fill="url(#loc-grid)"/>

    <!-- primary avenues (Av. Nader diagonal + main cross streets) -->
    <line x1="40" y1="120" x2="440" y2="80" stroke="var(--ink)" stroke-opacity="0.5" stroke-width="3"/>
    <line x1="60" y1="440" x2="420" y2="40" stroke="var(--ink)" stroke-opacity="0.28" stroke-width="2"/>
    <line x1="0" y1="300" x2="480" y2="330" stroke="var(--ink)" stroke-opacity="0.28" stroke-width="2"/>
    <line x1="180" y1="0" x2="220" y2="480" stroke="var(--ink)" stroke-opacity="0.2" stroke-width="1.5"/>

    <!-- Av. Nader label along the primary avenue -->
    <text x="250" y="92" class="location__map-street" transform="rotate(-5 250 92)">AV. NADER</text>

    <!-- POI markers -->
    <g class="location__poi">
      <circle cx="150" cy="150" r="5" fill="var(--ink)"/>
      <text x="150" y="138" class="location__map-label" text-anchor="middle">${labels.p2}</text>
    </g>
    <g class="location__poi">
      <circle cx="360" cy="230" r="5" fill="var(--ink)"/>
      <text x="360" y="218" class="location__map-label" text-anchor="middle">${labels.p3}</text>
    </g>
    <g class="location__poi">
      <circle cx="300" cy="390" r="5" fill="var(--ink)"/>
      <text x="300" y="378" class="location__map-label" text-anchor="middle">${labels.p4}</text>
    </g>

    <!-- ELEMENT (gold, pulsing) -->
    <g class="location__here">
      <circle cx="235" cy="240" r="16" fill="var(--gold)" fill-opacity="0.18"/>
      <circle cx="235" cy="240" r="8" fill="var(--gold)" stroke="var(--paper)" stroke-width="2"/>
      <text x="235" y="222" class="location__map-here" text-anchor="middle">${labels.here}</text>
    </g>
  </svg>`;
}

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  const proximity = [
    { icon: PROXIMITY_ICONS.pin, title: t('location.poi1Title'), meta: t('location.poi1Meta') },
    { icon: PROXIMITY_ICONS.cart, title: t('location.poi2Title'), meta: t('location.poi2Meta') },
    { icon: PROXIMITY_ICONS.wave, title: t('location.poi3Title'), meta: t('location.poi3Meta') },
    { icon: PROXIMITY_ICONS.plane, title: t('location.poi4Title'), meta: t('location.poi4Meta') },
  ];

  const mapLabels = {
    aria: t('location.mapAria'),
    here: t('location.mapHere'),
    p2: 'PUERTO CANCÚN',
    p3: 'PLAYAS',
    p4: 'MERCADO 28',
  };

  el.innerHTML = `
    <div class="location">
      <div class="location__copy reveal">
        <p class="location__eyebrow">${t('location.eyebrow')}</p>
        <h2 class="location__heading">${t('location.heading')}</h2>
        <p class="location__lede">${t('location.paragraph')}</p>
        <ul class="location__list">
          ${proximity
            .map(
              (p) => `
            <li class="location__poi-item">
              <span class="location__poi-icon" aria-hidden="true">${p.icon}</span>
              <span class="location__poi-text">
                <span class="location__poi-title">${p.title}</span>
                <span class="location__poi-meta num">${p.meta}</span>
              </span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="location__map-wrap reveal">
        ${blueprintMap(mapLabels)}
      </div>
    </div>
  `;
}
