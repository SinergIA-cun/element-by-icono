// Currency UI state. Language lives in i18n.js; this mirrors that pattern for
// the MXN/USD toggle so any component can read the current currency and react
// to changes via the 'currencychange' window event.

let currency = 'MXN';

/** @returns {'MXN' | 'USD'} */
export function getCurrency() {
  return currency;
}

/** @param {'MXN' | 'USD'} next */
export function setCurrency(next) {
  if (next !== 'MXN' && next !== 'USD') return;
  if (next === currency) return;
  currency = next;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('currencychange', { detail: currency }));
  }
}
