import { test, expect } from 'vitest';
import { money, pct } from '../src/lib/format.js';
test('MXN sin decimales', () => expect(money(2100000, 'MXN')).toBe('$2,100,000'));
test('USD convierte con FX', () => expect(money(2100000, 'USD', 18.5)).toBe('US$113,514'));
test('pct una decimal', () => expect(pct(0.0614)).toBe('6.1%'));
