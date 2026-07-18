import './calculator.css';
import { t, getLang } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';
import { getCurrency } from '../../lib/state.js';
import {
  grossAnnualRent,
  netAnnualRent,
  netYield,
  projectedValue,
  totalRoi,
  paybackYears,
} from '../../lib/finance.js';
import { money, pct } from '../../lib/format.js';
import { render as renderLeadForm } from '../lead-form/lead-form.js';

const DEFAULT_TYPOLOGY_ID = '2br';
const YEAR_OPTIONS = [3, 5, 10];
const DEFAULT_YEARS = 5;

/**
 * Module-level selection state. Components here follow the same pattern as
 * lib/state.js: state lives outside render() so it survives the full
 * teardown/rebuild that main.js does on every langchange/currencychange.
 * @type {{ typologyId: string, payment: 'cash'|'plan', rentalMode: 'airbnb'|'long', years: number }}
 */
let selection = {
  typologyId: DEFAULT_TYPOLOGY_ID,
  payment: 'cash',
  rentalMode: 'airbnb',
  years: DEFAULT_YEARS,
};

let gateOpen = false;
let preselectListenerBound = false;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function getTypology(id) {
  return CONFIG.typologies.find((typo) => typo.id === id) || CONFIG.typologies[0];
}

function computeSimulation() {
  const typo = getTypology(selection.typologyId);
  const price =
    selection.payment === 'cash'
      ? typo.priceFrom * (1 - CONFIG.presale.discountPct)
      : typo.priceFrom;
  const rentalInput =
    selection.rentalMode === 'airbnb'
      ? { mode: 'airbnb', adr: typo.rental.adr, occupancy: typo.rental.occupancy }
      : { mode: 'long', monthlyRent: typo.rental.monthlyRent };

  const gross = grossAnnualRent(rentalInput);
  const net = netAnnualRent(gross, CONFIG.costs);
  const yieldPct = netYield(net, price);
  const projected = projectedValue(price, CONFIG.appreciationPct, selection.years);
  const roi = totalRoi({
    price,
    netAnnual: net,
    appreciationPct: CONFIG.appreciationPct,
    years: selection.years,
  });
  const payback = paybackYears(price, net);

  return { typo, price, gross, net, yieldPct, projected, roi, payback };
}

/** Shape lead-form.js's getSimulation() option expects. */
function simulationPayload() {
  const sim = computeSimulation();
  return {
    typologyName: sim.typo.name[getLang()],
    payment: selection.payment,
    rentalMode: selection.rentalMode,
    years: selection.years,
    netYieldPct: pct(sim.yieldPct),
    roiPct: pct(sim.roi),
  };
}

function typologyOptionsMarkup(currency) {
  return CONFIG.typologies
    .map((typo) => {
      const checked = typo.id === selection.typologyId;
      return `
        <label class="calc__seg-option${checked ? ' is-active' : ''}">
          <input type="radio" name="calc-typology" value="${typo.id}" ${checked ? 'checked' : ''} />
          <span class="calc__seg-name">${typo.name[getLang()]}</span>
          <span class="calc__seg-price num">${money(typo.priceFrom, currency, CONFIG.fxMxnUsd)}</span>
        </label>`;
    })
    .join('');
}

function pillOptionsMarkup(name, options, activeValue) {
  return options
    .map(
      (opt) => `
        <label class="calc__pill${opt.value === activeValue ? ' is-active' : ''}">
          <input type="radio" name="${name}" value="${opt.value}" ${opt.value === activeValue ? 'checked' : ''} />
          <span>${opt.label}</span>
        </label>`
    )
    .join('');
}

function horizonOptionsMarkup() {
  return YEAR_OPTIONS.map(
    (years) => `
      <label class="calc__seg-option${years === selection.years ? ' is-active' : ''}">
        <input type="radio" name="calc-years" value="${years}" ${years === selection.years ? 'checked' : ''} />
        <span class="calc__seg-name">${years} ${t('calculator.years')}</span>
      </label>`
  ).join('');
}

function resultsMarkup(currency) {
  const sim = computeSimulation();
  const paybackText =
    sim.payback == null ? t('calculator.paybackNone') : `${sim.payback.toFixed(1)} ${t('calculator.paybackUnit')}`;

  return `
    <div class="calc__results">
      <div class="calc__row">
        <span class="calc__row-label">${t('calculator.priceLabel')}</span>
        <span class="calc__row-value num" data-result="price">${money(sim.price, currency, CONFIG.fxMxnUsd)}</span>
      </div>

      <div class="calc__hero">
        <div class="calc__hero-main">
          <span class="calc__hero-label">${t('calculator.netRentLabel')}</span>
          <span class="calc__hero-value num" data-result="net">${money(sim.net, currency, CONFIG.fxMxnUsd)}</span>
        </div>
        <span class="calc__yield-badge num" data-result="yield">${pct(sim.yieldPct)} <em>${t('calculator.yieldLabel')}</em></span>
      </div>

      <div class="calc__row">
        <span class="calc__row-label">${t('calculator.projectedLabel')} ${selection.years} ${t('calculator.years')}</span>
        <span class="calc__row-value num" data-result="projected">${money(sim.projected, currency, CONFIG.fxMxnUsd)}</span>
      </div>

      <div class="calc__roi">
        <div class="calc__roi-block">
          <span class="calc__roi-label">${t('calculator.roiLabel')}</span>
          <span class="calc__roi-value num" data-result="roi">${pct(sim.roi)}</span>
        </div>
        <div class="calc__roi-block">
          <span class="calc__roi-label">${t('calculator.paybackLabel')}</span>
          <span class="calc__roi-value num" data-result="payback">${paybackText}</span>
        </div>
      </div>

      <p class="calc__breakdown" data-result="breakdown">
        ${t('calculator.breakdownGross')} ${money(sim.gross, currency, CONFIG.fxMxnUsd)}
        − ${t('calculator.breakdownAdmin')} ${pct(CONFIG.costs.adminPct)}
        − ${t('calculator.breakdownMaint')}
        − ${t('calculator.breakdownTax')}
      </p>

      <p class="calc__disclaimer">${t('calculator.disclaimer')}</p>
    </div>`;
}

function gateMarkup() {
  if (gateOpen) {
    return `<div class="calc__gate" data-gate><div class="calc__lead-mount" data-lead-mount></div></div>`;
  }
  return `
    <div class="calc__gate" data-gate>
      <button type="button" class="calc__gate-cta" data-gate-open>${t('calculator.gateCta')}</button>
    </div>`;
}

function syncActiveClasses(form) {
  form.querySelectorAll('label.calc__seg-option, label.calc__pill').forEach((label) => {
    const input = label.querySelector('input');
    if (input) label.classList.toggle('is-active', input.checked);
  });
}

function tick(node) {
  if (!node || prefersReducedMotion()) return;
  node.classList.remove('calc__results--tick');
  // Force reflow so re-adding the class restarts the animation.
  void node.offsetWidth;
  node.classList.add('calc__results--tick');
}

function updateResults(el) {
  const panel = el.querySelector('.calc__panel');
  const current = panel && panel.querySelector('.calc__results');
  if (!current) return;
  current.outerHTML = resultsMarkup(getCurrency());
  tick(panel.querySelector('.calc__results'));
}

function mountLeadFormIfOpen(el) {
  if (!gateOpen) return;
  const mount = el.querySelector('[data-lead-mount]');
  if (!mount) return;
  renderLeadForm(mount, { source: 'calculator', getSimulation: simulationPayload });
}

function bindGate(el) {
  const openBtn = el.querySelector('[data-gate-open]');
  if (!openBtn) return;
  openBtn.addEventListener('click', () => {
    gateOpen = true;
    const gate = el.querySelector('[data-gate]');
    gate.innerHTML = `<div class="calc__lead-mount" data-lead-mount></div>`;
    mountLeadFormIfOpen(el);
  });
}

function bindForm(el) {
  const form = el.querySelector('[data-calc-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('change', (event) => {
    const input = event.target;
    if (input.name === 'calc-typology') selection = { ...selection, typologyId: input.value };
    else if (input.name === 'calc-payment') selection = { ...selection, payment: input.value };
    else if (input.name === 'calc-rental') selection = { ...selection, rentalMode: input.value };
    else if (input.name === 'calc-years') selection = { ...selection, years: Number(input.value) };
    else return;

    syncActiveClasses(form);
    updateResults(el);
  });
}

/**
 * The typologies section dispatches this on window when its "model this
 * unit" CTA is clicked. Registered once — el (the #calculator section node)
 * is stable across the app's lifetime, only its innerHTML is replaced on
 * every render() call, so a single closure over el stays valid.
 * @param {HTMLElement} el
 */
function bindPreselectListener(el) {
  if (preselectListenerBound || typeof window === 'undefined') return;
  preselectListenerBound = true;
  window.addEventListener('preselect-typology', (event) => {
    const id = event.detail;
    if (!CONFIG.typologies.some((typo) => typo.id === id)) return;
    selection = { ...selection, typologyId: id };
    render(el);
    // This re-render happens outside main.js's mount cycle, so no reveal
    // observer is watching the fresh .reveal nodes — show them immediately.
    el.querySelectorAll('.reveal').forEach((node) => node.classList.add('revealed'));
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });
}

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;
  const currency = getCurrency();

  el.innerHTML = `
    <div class="calc blueprint">
      <div class="calc__inner">
        <header class="calc__head reveal">
          <p class="calc__eyebrow">${t('calculator.eyebrow')}</p>
          <h2 class="calc__heading">${t('calculator.heading')}</h2>
        </header>

        <div class="calc__grid">
          <form class="calc__form reveal" data-calc-form>
            <fieldset class="calc__field">
              <legend class="calc__label">${t('calculator.typologyLabel')}</legend>
              <div class="calc__seg">${typologyOptionsMarkup(currency)}</div>
            </fieldset>

            <fieldset class="calc__field">
              <legend class="calc__label">${t('calculator.paymentLabel')}</legend>
              <div class="calc__pills">${pillOptionsMarkup(
                'calc-payment',
                [
                  { value: 'cash', label: t('calculator.paymentCash') },
                  { value: 'plan', label: t('calculator.paymentPlan') },
                ],
                selection.payment
              )}</div>
            </fieldset>

            <fieldset class="calc__field">
              <legend class="calc__label">${t('calculator.rentalLabel')}</legend>
              <div class="calc__pills">${pillOptionsMarkup(
                'calc-rental',
                [
                  { value: 'airbnb', label: t('calculator.rentalAirbnb') },
                  { value: 'long', label: t('calculator.rentalLong') },
                ],
                selection.rentalMode
              )}</div>
            </fieldset>

            <fieldset class="calc__field">
              <legend class="calc__label">${t('calculator.horizonLabel')}</legend>
              <div class="calc__seg calc__seg--compact">${horizonOptionsMarkup()}</div>
            </fieldset>
          </form>

          <div class="calc__panel reveal">
            ${resultsMarkup(currency)}
            ${gateMarkup()}
          </div>
        </div>
      </div>
    </div>
  `;

  bindForm(el);
  bindGate(el);
  mountLeadFormIfOpen(el);
  bindPreselectListener(el);
}
