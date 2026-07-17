import './styles/tokens.css';
import './styles/typography.css';
import './styles/global.css';

const REVEAL_THRESHOLD = 0.15;

function initRevealObserver() {
  const revealEls = document.querySelectorAll('.reveal');
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
}

initRevealObserver();
