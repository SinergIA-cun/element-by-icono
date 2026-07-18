import './faq.css';
import { t } from '../../lib/i18n.js';

const QUESTION_COUNT = 6;

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  const items = Array.from({ length: QUESTION_COUNT }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  el.innerHTML = `
    <div class="faq">
      <header class="faq__head reveal">
        <p class="faq__eyebrow">${t('faq.eyebrow')}</p>
        <h2 class="faq__heading">${t('faq.heading')}</h2>
      </header>
      <div class="faq__list reveal">
        ${items.map(
          (item) => `
          <details class="faq__item">
            <summary class="faq__q">
              ${item.q}
              <span class="faq__chevron" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </summary>
            <p class="faq__a">${item.a}</p>
          </details>`
        ).join('')}
      </div>
    </div>
  `;
}
