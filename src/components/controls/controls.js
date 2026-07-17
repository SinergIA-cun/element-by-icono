import './controls.css';
import { t, setLang, getLang } from '../../lib/i18n.js';
import { setCurrency, getCurrency } from '../../lib/state.js';

const LANGS = ['es', 'en'];
const CURRENCIES = ['MXN', 'USD'];

/**
 * Fixed top-right pill: ES|EN language + MXN|USD currency toggles.
 * @param {HTMLElement} el
 */
export function render(el) {
  if (!el) return;
  const lang = getLang();
  const currency = getCurrency();

  el.innerHTML = `
    <div class="controls" role="group" aria-label="${t('controls.langLabel')} / ${t('controls.currencyLabel')}">
      <div class="controls__set" role="group" aria-label="${t('controls.langLabel')}">
        ${LANGS.map(
          (l) => `
          <button
            type="button"
            class="controls__btn${l === lang ? ' is-active' : ''}"
            data-lang="${l}"
            aria-pressed="${l === lang}"
          >${l.toUpperCase()}</button>`
        ).join('')}
      </div>
      <span class="controls__divider" aria-hidden="true"></span>
      <div class="controls__set" role="group" aria-label="${t('controls.currencyLabel')}">
        ${CURRENCIES.map(
          (c) => `
          <button
            type="button"
            class="controls__btn${c === currency ? ' is-active' : ''}"
            data-currency="${c}"
            aria-pressed="${c === currency}"
          >${c}</button>`
        ).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  el.querySelectorAll('[data-currency]').forEach((btn) => {
    btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
  });
}
