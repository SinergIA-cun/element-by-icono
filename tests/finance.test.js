import { describe, test, expect } from 'vitest';
import { grossAnnualRent, netAnnualRent, netYield, projectedValue, totalRoi, paybackYears } from '../src/lib/finance.js';

const airbnb = { mode: 'airbnb', adr: 1500, occupancy: 0.65 };
const longTerm = { mode: 'long', monthlyRent: 16000 };
const costs = { maintenanceMonthly: 1800, adminPct: 0.20, propertyTaxAnnual: 3000 };

describe('grossAnnualRent', () => {
  test('airbnb = ADR × 365 × ocupación', () => {
    expect(grossAnnualRent(airbnb)).toBeCloseTo(1500 * 365 * 0.65);
  });
  test('larga estancia = renta × 12', () => {
    expect(grossAnnualRent(longTerm)).toBe(192000);
  });
});

describe('netAnnualRent', () => {
  test('resta administración, mantenimiento y predial', () => {
    const gross = grossAnnualRent(longTerm); // 192000
    // 192000 - 20% admin (38400) - 1800×12 (21600) - 3000 = 129000
    expect(netAnnualRent(gross, costs)).toBe(129000);
  });
  test('nunca regresa NaN con costos vacíos', () => {
    expect(netAnnualRent(100000, {})).toBe(100000);
  });
});

describe('projectedValue', () => {
  test('plusvalía compuesta', () => {
    expect(projectedValue(2100000, 0.08, 5)).toBeCloseTo(2100000 * 1.08 ** 5);
  });
});

describe('totalRoi', () => {
  test('(rentas acumuladas + plusvalía) / precio', () => {
    const roi = totalRoi({ price: 2100000, netAnnual: 129000, appreciationPct: 0.08, years: 5 });
    const expected = (129000 * 5 + (2100000 * 1.08 ** 5 - 2100000)) / 2100000;
    expect(roi).toBeCloseTo(expected);
  });
});

describe('paybackYears', () => {
  test('precio / renta neta anual', () => {
    expect(paybackYears(2100000, 129000)).toBeCloseTo(16.28, 1);
  });
  test('Infinity-safe: renta 0 regresa null', () => {
    expect(paybackYears(2100000, 0)).toBeNull();
  });
});

describe('netYield', () => {
  test('renta neta / precio', () => {
    expect(netYield(129000, 2100000)).toBeCloseTo(0.0614, 3);
  });
});
