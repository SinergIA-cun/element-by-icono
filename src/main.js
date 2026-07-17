import './styles/tokens.css';
import './styles/typography.css';
import './styles/global.css';

import { setLang, detectLang } from './lib/i18n.js';
import { render as renderControls } from './components/controls/controls.js';
import { render as renderHero } from './components/hero/hero.js';
import { render as renderStats } from './components/stats/stats.js';
import { render as renderLocation } from './components/location/location.js';
import { render as renderTypologies } from './components/typologies/typologies.js';

const REVEAL_THRESHOLD = 0.15;

const MOUNTS = [
  { id: 'controls', render: renderControls },
  { id: 'hero', render: renderHero },
  { id: 'stats', render: renderStats },
  { id: 'location', render: renderLocation },
  { id: 'typologies', render: renderTypologies },
];

function initRevealObserver() {
  const revealEls = document.querySelectorAll('.reveal:not(.revealed)');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: REVEAL_THRESHOLD }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Red de seguridad: si el observer no actúa (iframe con frames throttled,
  // navegadores raros), nada puede quedarse invisible.
  const revealInViewport = () => {
    const pending = document.querySelectorAll('.reveal:not(.revealed)');
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('revealed');
    });
    if (!pending.length) window.removeEventListener('scroll', revealInViewport);
  };
  setTimeout(revealInViewport, 1200);
  window.addEventListener('scroll', revealInViewport, { passive: true });
}

/**
 * @param {{ animate?: boolean }} [options]
 *   animate=true (first load) uses the scroll-reveal observer; on a re-render
 *   (language/currency switch) we reveal immediately to avoid a content flash.
 */
function mountAll({ animate = true } = {}) {
  MOUNTS.forEach(({ id, render }) => {
    const el = document.getElementById(id);
    if (el) render(el);
  });

  if (animate) {
    initRevealObserver();
  } else {
    document
      .querySelectorAll('.reveal')
      .forEach((el) => el.classList.add('revealed'));
  }
}

setLang(detectLang());
mountAll({ animate: true });

// setLang and setCurrency dispatch these; re-render everything so copy, prices,
// and currency stay in sync across every section.
window.addEventListener('langchange', () => mountAll({ animate: false }));
window.addEventListener('currencychange', () => mountAll({ animate: false }));
