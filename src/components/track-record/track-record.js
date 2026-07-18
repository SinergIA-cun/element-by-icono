import './track-record.css';
import { t } from '../../lib/i18n.js';

const TOWER_GLYPH = `
  <svg viewBox="0 0 48 64" fill="none" aria-hidden="true">
    <rect x="8" y="6" width="32" height="52" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="12" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
    <rect x="26" y="12" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
    <rect x="14" y="26" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
    <rect x="26" y="26" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
    <rect x="14" y="40" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
    <rect x="26" y="40" width="8" height="8" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  const stats = [
    { value: t('track.stat1Value'), label: t('track.stat1Label') },
    { value: t('track.stat2Value'), label: t('track.stat2Label') },
    { value: t('track.stat3Value'), label: t('track.stat3Label') },
  ];

  el.innerHTML = `
    <div class="track blueprint">
      <div class="track__copy reveal">
        <p class="track__eyebrow">${t('track.eyebrow')}</p>
        <h2 class="track__heading">${t('track.heading')}</h2>
        <p class="track__paragraph">${t('track.paragraph')}</p>
        <dl class="track__stats">
          ${stats.map(
            (s) => `
            <div class="track__stat">
              <dt class="track__stat-label">${s.label}</dt>
              <dd class="track__stat-value num">${s.value}</dd>
            </div>`
          ).join('')}
        </dl>
      </div>
      <a class="track__card reveal" href="https://www.iconotowers.com" target="_blank" rel="noopener">
        <span class="track__card-glyph">${TOWER_GLYPH}</span>
        <span class="track__card-tag">${t('track.cardTag')}</span>
        <span class="track__card-name">${t('track.cardName')}</span>
        <span class="track__card-cta">${t('track.cardCta')} →</span>
      </a>
    </div>
  `;
}
