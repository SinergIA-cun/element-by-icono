import { test, expect } from 'vitest';
import { t, setLang, detectLang } from '../src/lib/i18n.js';
test('es por default', () => expect(t('nav.calculator')).toBe('Simula tu inversión'));
test('cambia a en', () => { setLang('en'); expect(t('nav.calculator')).toBe('Run the numbers'); setLang('es'); });
test('detectLang cae a es', () => expect(detectLang('fr-FR')).toBe('es'));
test('detectLang en-US → en', () => expect(detectLang('en-US')).toBe('en'));
test('key faltante regresa la key, no undefined', () => expect(t('nope.nope')).toBe('nope.nope'));
