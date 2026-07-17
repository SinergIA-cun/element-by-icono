import './stats.css';
import { t } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';

const COUNT_DURATION = 1400; // ms
const APPRECIATION_PCT = Math.round(CONFIG.appreciationPct * 100);

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Numbers-as-protagonist strip on --ink with blueprint texture.
 * @param {HTMLElement} el
 */
export function render(el) {
  if (!el) return;

  const items = [
    { value: 28, suffix: '', label: t('stats.units') },
    { text: t('stats.deliveryValue'), label: t('stats.delivery') },
    { value: 6, suffix: '%', label: t('stats.discount') },
    {
      value: APPRECIATION_PCT,
      prefix: '~',
      suffix: '%',
      label: t('stats.appreciation'),
      note: t('stats.appreciationNote'),
    },
  ];

  el.innerHTML = `
    <div class="stats blueprint">
      <ul class="stats__grid">
        ${items
          .map((item) => {
            const figure =
              item.text != null
                ? `<span class="stats__value">${item.text}</span>`
                : `<span class="stats__value num" data-count="${item.value}"${
                    item.prefix ? ` data-prefix="${item.prefix}"` : ''
                  }${item.suffix ? ` data-suffix="${item.suffix}"` : ''}>${
                    item.prefix || ''
                  }0${item.suffix || ''}</span>`;
            const note = item.note
              ? `<span class="stats__note">${item.note}</span>`
              : '';
            return `
              <li class="stats__item reveal">
                ${figure}
                <span class="stats__label">${item.label}</span>
                ${note}
              </li>`;
          })
          .join('')}
      </ul>
    </div>
  `;

  animateCounts(el);
}

function animateCounts(el) {
  const counters = el.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach((node) => {
      node.textContent =
        (node.dataset.prefix || '') + node.dataset.count + (node.dataset.suffix || '');
    });
    return;
  }

  const runCount = (node) => {
    const target = Number(node.dataset.count);
    const prefix = node.dataset.prefix || '';
    const suffix = node.dataset.suffix || '';
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      // easeOutExpo for a decelerating tick
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      node.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((node) => observer.observe(node));
}
