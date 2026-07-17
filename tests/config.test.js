import { test, expect } from 'vitest';
import { CONFIG } from '../src/lib/config.js';

test('toda tipología tiene datos de renta completos', () => {
  for (const t of CONFIG.typologies) {
    expect(t.priceFrom).toBeGreaterThan(0);
    expect(t.rental.adr).toBeGreaterThan(0);
    expect(t.rental.occupancy).toBeGreaterThan(0);
    expect(t.rental.occupancy).toBeLessThanOrEqual(1);
    expect(t.rental.monthlyRent).toBeGreaterThan(0);
  }
});

test('supuestos globales presentes', () => {
  expect(CONFIG.appreciationPct).toBeGreaterThan(0);
  expect(CONFIG.appreciationPct).toBeLessThan(0.2);
  expect(CONFIG.costs.adminPct).toBeGreaterThan(0);
  expect(CONFIG.costs.adminPct).toBeLessThan(1);
});
