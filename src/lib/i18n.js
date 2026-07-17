export const dict = {
  es: {
    nav: {
      calculator: 'Simula tu inversión',
    },
    controls: {
      langLabel: 'Idioma',
      currencyLabel: 'Moneda',
    },
    hero: {
      eyebrow: 'Preventa Friends & Family — 6% de descuento por tiempo limitado',
      title: 'Una nueva forma de invertir en Cancún',
      sub: '28 departamentos boutique desde $2.1 MDP en el corazón de la ciudad. Entrega enero 2027.',
      ctaPrimary: 'Simula tu inversión',
      ctaSecondary: 'Hablar por WhatsApp',
      scroll: 'Desliza',
    },
    stats: {
      units: 'unidades boutique',
      delivery: 'entrega',
      deliveryValue: 'Ene 2027',
      discount: 'descuento en preventa',
      appreciation: 'plusvalía anual en la zona',
      appreciationNote: 'Fuente: SHF, Q. Roo',
    },
    location: {
      eyebrow: 'Ubicación',
      heading: 'En el corazón de todo',
      paragraph:
        'Cancún se mantiene en el top 3 de ciudades con mayor plusvalía en México. ELEMENT nace a una cuadra de la Av. Nader, la zona de mejores restaurantes y cafés del centro, con todo lo demás a minutos.',
      poi1Title: 'Av. Nader',
      poi1Meta: 'a 1 cuadra',
      poi2Title: 'Puerto Cancún y Plaza Las Américas',
      poi2Meta: 'a 3 min',
      poi3Title: 'Playas y Mercado 28',
      poi3Meta: 'a 5 min',
      poi4Title: 'Aeropuerto Internacional',
      poi4Meta: 'a 17 min',
      mapAria: 'Mapa esquemático de la ubicación de ELEMENT y puntos de interés cercanos',
      mapHere: 'ELEMENT',
    },
    typologies: {
      eyebrow: 'Tipologías',
      heading: 'Elige tu unidad',
      sub: 'Tres formatos pensados para rentar. Precios de preventa Friends & Family.',
      from: 'Desde',
      netRent: 'Renta neta est.',
      perYear: '/año',
      netYield: 'rend. neto',
      cta: 'Simular esta unidad',
      featured: 'La favorita de inversionistas',
      footnote: '*Estimación con supuestos de mercado citados; ver simulador.',
    },
  },
  en: {
    nav: {
      calculator: 'Run the numbers',
    },
    controls: {
      langLabel: 'Language',
      currencyLabel: 'Currency',
    },
    hero: {
      eyebrow: 'Friends & Family presale — 6% off for a limited time',
      title: 'A new way to invest in Cancún',
      sub: '28 boutique apartments from $2.1M MXN in the heart of the city. Delivery January 2027.',
      ctaPrimary: 'Run the numbers',
      ctaSecondary: 'Chat on WhatsApp',
      scroll: 'Scroll',
    },
    stats: {
      units: 'boutique units',
      delivery: 'delivery',
      deliveryValue: 'Jan 2027',
      discount: 'presale discount',
      appreciation: 'annual appreciation in the area',
      appreciationNote: 'Source: SHF, Q. Roo',
    },
    location: {
      eyebrow: 'Location',
      heading: 'In the heart of it all',
      paragraph:
        'Cancún remains among Mexico’s top 3 cities for property appreciation. ELEMENT sits one block from Av. Nader — downtown’s best dining and café district — with everything else just minutes away.',
      poi1Title: 'Av. Nader',
      poi1Meta: '1 block',
      poi2Title: 'Puerto Cancún & Plaza Las Américas',
      poi2Meta: '3 min',
      poi3Title: 'Beaches & Mercado 28',
      poi3Meta: '5 min',
      poi4Title: 'International Airport',
      poi4Meta: '17 min',
      mapAria: 'Schematic map of ELEMENT’s location and nearby points of interest',
      mapHere: 'ELEMENT',
    },
    typologies: {
      eyebrow: 'Floor plans',
      heading: 'Choose your unit',
      sub: 'Three rental-ready formats. Friends & Family presale pricing.',
      from: 'From',
      netRent: 'Est. net rent',
      perYear: '/yr',
      netYield: 'net yield',
      cta: 'Model this unit',
      featured: 'Investors’ favorite',
      footnote: '*Estimate based on the cited market assumptions; see the simulator.',
    },
  },
};

/** @returns {'es' | 'en'} */
export function getLang() {
  return lang;
}

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
