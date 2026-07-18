import './timeline.css';
import { t } from '../../lib/i18n.js';

const PROGRESS_PCT = 30; // preventa en curso ≈ primer tercio del camino

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  const milestones = [
    { title: t('timeline.m1Title'), meta: t('timeline.m1Meta'), state: 'now' },
    { title: t('timeline.m2Title'), meta: t('timeline.m2Meta'), state: 'next' },
    { title: t('timeline.m3Title'), meta: t('timeline.m3Meta'), state: 'later' },
    { title: t('timeline.m4Title'), meta: t('timeline.m4Meta'), state: 'goal' },
  ];

  el.innerHTML = `
    <div class="timeline">
      <header class="timeline__head reveal">
        <p class="timeline__eyebrow">${t('timeline.eyebrow')}</p>
        <h2 class="timeline__heading">${t('timeline.heading')}</h2>
      </header>
      <ol class="timeline__track reveal">
        <div class="timeline__bar" aria-hidden="true">
          <div class="timeline__bar-fill" style="--progress: ${PROGRESS_PCT}%"></div>
        </div>
        ${milestones.map(
          (m) => `
          <li class="timeline__item timeline__item--${m.state}">
            <span class="timeline__dot" aria-hidden="true"></span>
            <span class="timeline__title">${m.title}</span>
            <span class="timeline__meta num">${m.meta}</span>
          </li>`
        ).join('')}
      </ol>
      <p class="timeline__note reveal">${t('timeline.note')}</p>
    </div>
  `;
}
