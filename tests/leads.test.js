import { test, expect, vi } from 'vitest';
import { buildWhatsAppUrl, submitLead } from '../src/lib/leads.js';

test('WhatsApp URL con simulación precargada', () => {
  const url = buildWhatsAppUrl({ phone: '529983410834', name: 'Ana',
    typology: '2 Recámaras', netYieldPct: '6.1%', lang: 'es' });
  expect(url).toContain('https://wa.me/529983410834?text=');
  expect(decodeURIComponent(url)).toContain('2 Recámaras');
});

test('submitLead hace POST al endpoint Velo y regresa ok', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  const res = await submitLead({ name: 'Ana', phone: '998', profile: 'inversionista' });
  expect(fetch).toHaveBeenCalledWith('https://www.elementbyicono.com/_functions/submitLead',
    expect.objectContaining({ method: 'POST' }));
  expect(res.ok).toBe(true);
});

test('submitLead reintenta una vez y reporta error sin lanzar', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error('net'));
  const res = await submitLead({ name: 'Ana' });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(res.ok).toBe(false);
});
