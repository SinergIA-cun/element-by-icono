import './lead-form.css';
import { t, getLang } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';
import { submitLead, buildWhatsAppUrl } from '../../lib/leads.js';

const PHONE_MIN_DIGITS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value) {
  return (value || '').replace(/\D/g, '');
}

/** @param {{ name: string, phone: string, email: string }} values */
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = t('leadForm.errorName');
  if (digitsOnly(values.phone).length < PHONE_MIN_DIGITS) errors.phone = t('leadForm.errorPhone');
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) errors.email = t('leadForm.errorEmail');
  return errors;
}

function fieldMarkup(id, name, labelKey, type, required) {
  return `
    <div class="lead-form__field">
      <label for="${id}">${t(labelKey)}${required ? ' *' : ''}</label>
      <input id="${id}" name="${name}" type="${type}" aria-describedby="${id}-err" />
      <span class="lead-form__error" id="${id}-err" role="alert"></span>
    </div>`;
}

function formMarkup() {
  return `
    <form class="lead-form" novalidate>
      ${fieldMarkup('lf-name', 'name', 'leadForm.name', 'text', true)}
      ${fieldMarkup('lf-phone', 'phone', 'leadForm.phone', 'tel', true)}
      ${fieldMarkup('lf-email', 'email', 'leadForm.email', 'email', false)}
      <div class="lead-form__field">
        <label for="lf-profile">${t('leadForm.profile')}</label>
        <select id="lf-profile" name="profile">
          <option value="investor">${t('leadForm.profileInvestor')}</option>
          <option value="buyer">${t('leadForm.profileBuyer')}</option>
          <option value="broker">${t('leadForm.profileBroker')}</option>
        </select>
      </div>
      <div class="lead-form__field">
        <label for="lf-channel">${t('leadForm.channel')}</label>
        <select id="lf-channel" name="channel">
          <option value="whatsapp">${t('leadForm.channelWhatsapp')}</option>
          <option value="call">${t('leadForm.channelCall')}</option>
          <option value="email">${t('leadForm.channelEmail')}</option>
        </select>
      </div>
      <button class="lead-form__submit" type="submit">
        <span class="lead-form__submit-label">${t('leadForm.submit')}</span>
      </button>
    </form>`;
}

function clearErrors(form) {
  form.querySelectorAll('.lead-form__error').forEach((span) => {
    span.textContent = '';
  });
  form.querySelectorAll('[aria-invalid]').forEach((input) => input.removeAttribute('aria-invalid'));
}

function showErrors(form, errors) {
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements.namedItem(name);
    const errorSpan = form.querySelector(`#lf-${name}-err`);
    if (errorSpan) errorSpan.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
  });
  const firstField = form.elements.namedItem(Object.keys(errors)[0]);
  if (firstField) firstField.focus();
}

function setSubmitting(form, isSubmitting) {
  const button = form.querySelector('.lead-form__submit');
  const label = button.querySelector('.lead-form__submit-label');
  button.disabled = isSubmitting;
  button.classList.toggle('is-loading', isSubmitting);
  label.textContent = isSubmitting ? t('leadForm.sending') : t('leadForm.submit');
}

function resultMarkup({ variant, title, text, waLabel, waUrl }) {
  return `
    <div class="lead-form__result lead-form__result--${variant}">
      <p class="lead-form__result-title">${title}</p>
      <p class="lead-form__result-text">${text}</p>
      <a class="lead-form__wa-btn" href="${waUrl}" target="_blank" rel="noopener">${waLabel}</a>
    </div>`;
}

/**
 * Reusable lead-capture form: validates on submit, POSTs via submitLead(),
 * and always resolves to either a success state or a WhatsApp fallback so a
 * lead never dead-ends on a network failure.
 * @param {HTMLElement} el
 * @param {{ source: string, getSimulation?: () => (object|null) }} options
 */
export function render(el, { source, getSimulation } = {}) {
  if (!el) return;
  el.innerHTML = formMarkup();

  const form = el.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit(el, form, { source, getSimulation });
  });
}

async function handleSubmit(el, form, { source, getSimulation }) {
  const values = {
    name: form.elements.namedItem('name').value,
    phone: form.elements.namedItem('phone').value,
    email: form.elements.namedItem('email').value,
    profile: form.elements.namedItem('profile').value,
    channel: form.elements.namedItem('channel').value,
  };

  clearErrors(form);
  const errors = validate(values);
  if (Object.keys(errors).length) {
    showErrors(form, errors);
    return;
  }

  setSubmitting(form, true);

  const lang = getLang();
  const sim = typeof getSimulation === 'function' ? getSimulation() : null;
  const name = values.name.trim();

  const lead = {
    name,
    phone: values.phone.trim(),
    email: values.email.trim(),
    profile: values.profile,
    channel: values.channel,
    lang,
    source,
    ...(sim
      ? {
          typology: sim.typologyName,
          payment: sim.payment,
          rentalMode: sim.rentalMode,
          years: sim.years,
          netYield: sim.netYieldPct,
          roi: sim.roiPct,
        }
      : {}),
  };

  const waUrl = buildWhatsAppUrl({
    phone: CONFIG.whatsapp,
    name,
    typology: sim?.typologyName,
    netYieldPct: sim?.netYieldPct,
    lang,
  });

  const result = await submitLead(lead);

  if (result.ok) {
    el.innerHTML = resultMarkup({
      variant: 'success',
      title: t('leadForm.successTitle'),
      text: t('leadForm.successText'),
      waLabel: t('leadForm.whatsappCta'),
      waUrl,
    });
  } else {
    el.innerHTML = resultMarkup({
      variant: 'failure',
      title: t('leadForm.failureTitle'),
      text: t('leadForm.failureText'),
      waLabel: t('leadForm.whatsappFallback'),
      waUrl,
    });
  }
}
