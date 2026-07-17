export const dict = {
  es: {
    nav: {
      calculator: 'Simula tu inversión',
    },
  },
  en: {
    nav: {
      calculator: 'Run the numbers',
    },
  },
};

let lang = 'es';

export function t(key) {
  const segments = key.split('.');
  let node = dict[lang];
  for (const segment of segments) {
    if (node == null || !Object.prototype.hasOwnProperty.call(node, segment)) {
      return key;
    }
    node = node[segment];
  }
  return typeof node === 'string' ? node : key;
}

export function setLang(l) {
  lang = l;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('langchange'));
  }
}

export function detectLang(navLang = (typeof navigator !== 'undefined' ? navigator.language : 'es')) {
  return navLang && navLang.startsWith('en') ? 'en' : 'es';
}
