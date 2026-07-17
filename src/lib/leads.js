export const LEADS_ENDPOINT = 'https://www.elementbyicono.com/_functions/submitLead';

const MESSAGES = {
  es: {
    generic: (name) => `Hola, me interesa invertir en ELEMENT by ICONO. — ${name}`,
    simulation: (name, typology, netYieldPct) =>
      `Hola, simulé una inversión en ELEMENT: ${typology}, rendimiento neto ${netYieldPct}. Quiero más información. — ${name}`,
  },
  en: {
    generic: (name) => `Hi, I'm interested in investing in ELEMENT by ICONO. — ${name}`,
    simulation: (name, typology, netYieldPct) =>
      `Hi, I ran an investment simulation for ELEMENT: ${typology}, ${netYieldPct} net yield. I'd like more info. — ${name}`,
  },
};

export function buildWhatsAppUrl({ phone, name, typology, netYieldPct, lang = 'es' }) {
  const copy = MESSAGES[lang] || MESSAGES.es;
  const message = typology && netYieldPct
    ? copy.simulation(name, typology, netYieldPct)
    : copy.generic(name);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

async function postLead(lead) {
  const res = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error('Lead submission failed');
  return res;
}

export async function submitLead(lead) {
  try {
    await postLead(lead);
    return { ok: true };
  } catch {
    try {
      await postLead(lead);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
}
