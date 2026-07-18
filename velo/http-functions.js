/**
 * Backend Velo para elementbyicono.com — pegar en:
 * Wix Editor → Dev Mode (Velo) → Backend → http-functions.js
 *
 * Requiere el secret AIRTABLE_TOKEN en el Secrets Manager de Wix
 * (Personal Access Token de Airtable con scope data.records:write
 * limitado a la base appm98LTQUyUNn9GL).
 *
 * Endpoint resultante:
 *   POST https://www.elementbyicono.com/_functions/submitLead
 */
import { ok, badRequest, serverError } from 'wix-http-functions';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

const BASE_ID = 'appm98LTQUyUNn9GL';
const TABLE = 'Leads';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// El frontend manda claves internas; Airtable espera los nombres de opción.
const PROFILE = { investor: 'Inversionista', buyer: 'Comprador', broker: 'Broker' };
const PAYMENT = { cash: 'Contado', plan: 'Plan de pagos' };
const RENTAL = { airbnb: 'Airbnb', long: 'Larga estancia' };
const CHANNEL = { whatsapp: 'WhatsApp', call: 'Llamada', email: 'Correo' };
const TYPOLOGY = {
  Estudios: 'Estudio',
  Studios: 'Estudio',
  '2 Recámaras': '2 Recámaras',
  '2 Bedrooms': '2 Recámaras',
  '3 Recámaras': '3 Recámaras',
  '3 Bedrooms': '3 Recámaras',
};

export async function post_submitLead(request) {
  try {
    const lead = await request.body.json();
    if (!lead.name || !(lead.phone || lead.email)) {
      return badRequest({ headers: CORS_HEADERS, body: { ok: false, error: 'missing fields' } });
    }

    const fields = {
      Nombre: String(lead.name).slice(0, 120),
      'Teléfono': String(lead.phone || '').slice(0, 30),
      Email: String(lead.email || '').slice(0, 120),
      Estatus: 'Nuevo',
      Fecha: new Date().toISOString(),
    };
    if (PROFILE[lead.profile]) fields['Perfil'] = PROFILE[lead.profile];
    if (TYPOLOGY[lead.typology]) fields['Tipología'] = TYPOLOGY[lead.typology];
    if (PAYMENT[lead.payment]) fields['Forma de pago'] = PAYMENT[lead.payment];
    if (RENTAL[lead.rentalMode]) fields['Modo renta'] = RENTAL[lead.rentalMode];
    if (CHANNEL[lead.channel]) fields['Canal preferido'] = CHANNEL[lead.channel];
    if (lead.years) fields['Horizonte (años)'] = Number(lead.years) || null;
    if (lead.netYield) fields['Rendimiento neto'] = String(lead.netYield).slice(0, 40);
    if (lead.roi) fields['ROI proyectado'] = String(lead.roi).slice(0, 40);
    if (lead.lang) fields['Idioma'] = String(lead.lang).toUpperCase() === 'EN' ? 'EN' : 'ES';
    if (lead.source) fields['Fuente'] = String(lead.source).slice(0, 30);

    const token = await getSecret('AIRTABLE_TOKEN');
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      // typecast crea la opción si llegara un valor de select no previsto,
      // en vez de rechazar el lead con 422.
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!res.ok) {
      return serverError({ headers: CORS_HEADERS, body: { ok: false } });
    }
    return ok({ headers: CORS_HEADERS, body: { ok: true } });
  } catch (e) {
    return serverError({ headers: CORS_HEADERS, body: { ok: false } });
  }
}

export function options_submitLead() {
  return ok({ headers: CORS_HEADERS });
}
