import './contact.css';
import { t, getLang } from '../../lib/i18n.js';
import { CONFIG } from '../../lib/config.js';
import { buildWhatsAppUrl } from '../../lib/leads.js';
import { render as renderLeadForm } from '../lead-form/lead-form.js';

const WA_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.1 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 4.4c-.2 0-.5.1-.7.4-.2.2-.9.8-.9 2s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.1-.2 0-.4.1-.5l.9-1.1c.1-.2.1-.4 0-.6l-.8-2c-.2-.4-.4-.4-.6-.4h-.8Z"/></svg>`;

/** @param {HTMLElement} el */
export function render(el) {
  if (!el) return;

  const waUrl = buildWhatsAppUrl({ phone: CONFIG.whatsapp, name: '', lang: getLang() });

  el.innerHTML = `
    <div class="contact blueprint">
      <header class="contact__head reveal">
        <h2 class="contact__heading">${t('contact.heading')}</h2>
        <p class="contact__lede">${t('contact.lede')}</p>
      </header>
      <div class="contact__grid">
        <div class="contact__form reveal" id="contact-lead-form"></div>
        <aside class="contact__aside reveal">
          <a class="contact__wa" href="${waUrl}" target="_blank" rel="noopener">${WA_ICON} ${t('contact.waCta')}</a>
          <address class="contact__address">
            ${t('contact.address')}<br />
            <a href="mailto:admin@elementbyicono.com">admin@elementbyicono.com</a>
          </address>
          <p class="contact__wordmark" aria-hidden="true">ELEMENT<span>by ICONO</span></p>
        </aside>
      </div>
      <p class="contact__legal">${t('contact.legal')}</p>
    </div>
  `;

  renderLeadForm(el.querySelector('#contact-lead-form'), {
    source: 'footer',
    getSimulation: () => null,
  });
}
