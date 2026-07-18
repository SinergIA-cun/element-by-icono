import './hero.css';
import { t, getLang } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';
import { buildWhatsAppUrl } from '../../lib/leads.js';

const WHATSAPP_ICON = `
  <svg class="hero__wa-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12.02 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.82 1.24h.01c5.5 0 9.96-4.46 9.96-9.96C21.99 6.46 17.52 2 12.02 2Zm5.83 14.06c-.25.7-1.44 1.34-1.98 1.38-.53.05-1.02.24-3.45-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.17-1.55-1.17-2.96 0-1.41.74-2.1 1-2.39.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17 0 .4-.06.62.48.25.6.83 2.06.9 2.21.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.33.07.11.07.66-.18 1.36Z" fill="currentColor"/>
  </svg>`;

/**
 * Full-viewport hero. Rooftop photo background, dark ink gradient on the left,
 * editorial left-aligned copy over it.
 * @param {HTMLElement} el
 */
export function render(el) {
  if (!el) return;
  const lang = getLang();
  const waUrl = buildWhatsAppUrl({ phone: CONFIG.whatsapp, name: '', lang });

  el.innerHTML = `
    <div class="hero">
      <img
        class="hero__bg"
        src="media/rooftop-terraza-crop-1600.webp"
        srcset="media/rooftop-terraza-crop-800.webp 800w, media/rooftop-terraza-crop-1600.webp 1600w"
        sizes="100vw"
        width="1080"
        height="945"
        alt=""
        fetchpriority="high"
        decoding="async"
      />
      <div class="hero__scrim" aria-hidden="true"></div>

      <div class="hero__inner">
        <p class="hero__eyebrow reveal">
          <span class="hero__eyebrow-dot" aria-hidden="true"></span>
          ${t('hero.eyebrow')}
        </p>
        <h1 class="hero__title reveal">${t('hero.title')}</h1>
        <p class="hero__sub reveal">${t('hero.sub')}</p>
        <div class="hero__actions reveal">
          <a class="hero__cta hero__cta--primary" href="#calculator">${t('hero.ctaPrimary')}</a>
          <a
            class="hero__cta hero__cta--ghost"
            href="${waUrl}"
            target="_blank"
            rel="noopener"
          >${WHATSAPP_ICON}<span>${t('hero.ctaSecondary')}</span></a>
        </div>
      </div>

      <a class="hero__scroll" href="#stats" aria-label="${t('hero.scroll')}">
        <span class="hero__scroll-label">${t('hero.scroll')}</span>
        <span class="hero__scroll-line" aria-hidden="true"></span>
      </a>
    </div>
  `;
}
