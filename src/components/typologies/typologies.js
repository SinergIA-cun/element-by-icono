import './typologies.css';
import { t, getLang } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';
import { getCurrency } from '../../lib/state.js';
import { grossAnnualRent, netAnnualRent, netYield } from '../../lib/finance.js';
import { money, pct } from '../../lib/format.js';

const FEATURED_ID = '2br';

/**
 * Dispatch the calculator's typology preselect. The calculator (built later)
 * listens for this; here we also move the hash so the anchor scroll happens.
 */
function preselect(id) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('preselect-typology', { detail: id }));
  }
}

function cardMarkup(typo, currency) {
  const gross = grossAnnualRent({ mode: 'airbnb', ...typo.rental });
  const net = netAnnualRent(gross, CONFIG.costs);
  const yieldPct = pct(netYield(net, typo.priceFrom));
  const featured = typo.id === FEATURED_ID;

  return `
    <article class="typo-card${featured ? ' typo-card--featured' : ''} reveal" data-id="${typo.id}">
      ${featured ? `<span class="typo-card__tag">${t('typologies.featured')}</span>` : ''}
      <header class="typo-card__head">
        <h3 class="typo-card__name">${typo.name[getLang()]}</h3>
        <span class="typo-card__area num">${typo.m2} m²</span>
      </header>

      <div class="typo-card__price">
        <span class="typo-card__price-label">${t('typologies.from')}</span>
        <span class="typo-card__price-value num">${money(typo.priceFrom, currency, CONFIG.fxMxnUsd)}</span>
      </div>

      <div class="typo-card__rent">
        <span class="typo-card__rent-label">${t('typologies.netRent')}</span>
        <span class="typo-card__rent-row">
          <span class="typo-card__rent-value num">${money(net, currency, CONFIG.fxMxnUsd)}<span class="typo-card__rent-per">${t('typologies.perYear')}*</span></span>
          <span class="typo-card__yield num">${yieldPct}<span class="typo-card__yield-label">${t('typologies.netYield')}</span></span>
        </span>
      </div>

      <a class="typo-card__cta" href="#calculator" data-preselect="${typo.id}">
        ${t('typologies.cta')} <span aria-hidden="true">→</span>
      </a>
    </article>
  `;
}

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;
  const currency = getCurrency();

  el.innerHTML = `
    <div class="typologies">
      <header class="typologies__head reveal">
        <p class="typologies__eyebrow">${t('typologies.eyebrow')}</p>
        <h2 class="typologies__heading">${t('typologies.heading')}</h2>
        <p class="typologies__sub">${t('typologies.sub')}</p>
      </header>
      <div class="typologies__grid">
        ${CONFIG.typologies.map((typo) => cardMarkup(typo, currency)).join('')}
      </div>
      <p class="typologies__footnote">${t('typologies.footnote')}</p>
    </div>
  `;

  el.querySelectorAll('[data-preselect]').forEach((cta) => {
    cta.addEventListener('click', () => preselect(cta.dataset.preselect));
  });
}
