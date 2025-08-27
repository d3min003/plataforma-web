// Capa API para integración opcional con "base-datos-central"
// - Headers requeridos: X-API-KEY, X-ORG-ID
// - Endpoints usados: POST /clients, GET /clients/:id, POST /batch/clients/import
// Mantiene el comportamiento offline-first: si no hay config válida, no hace llamadas remotas.

import { db } from './storage.js';

const KEYS = {
  base: 'crm.api.base',
  key: 'crm.api.key',
  org: 'crm.api.org'
};

function loadConfig(){
  return {
    base: (window.CRM_API_BASE || localStorage.getItem(KEYS.base) || '').toString(),
    apiKey: (window.CRM_API_KEY || localStorage.getItem(KEYS.key) || '').toString(),
    orgId: (window.CRM_ORG_ID || localStorage.getItem(KEYS.org) || '').toString()
  };
}

let config = loadConfig();
function enabled(){
  return !!(config.base && config.apiKey && config.orgId);
}

async function http(method, path, body){
  if (!enabled()) return null;
  const url = `${config.base}${path}`;
  try{
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': config.apiKey,
        'X-ORG-ID': config.orgId
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(await res.text().catch(()=>res.statusText));
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await res.json();
    return null;
  }catch(err){
    console.warn('[remote api] error', method, path, err?.message || err);
    return null;
  }
}

function splitName(full){
  const s = (full||'').trim().split(/\s+/);
  if (s.length === 0) return { first:'', last:'' };
  if (s.length === 1) return { first:s[0], last:'' };
  return { first: s[0], last: s.slice(1).join(' ') };
}

export const api = {
  configure(newCfg){
    config = {
      base: newCfg.base ?? config.base,
      apiKey: newCfg.apiKey ?? config.apiKey,
      orgId: newCfg.orgId ?? config.orgId
    };
    if (newCfg.base !== undefined) localStorage.setItem(KEYS.base, String(config.base||''));
    if (newCfg.apiKey !== undefined) localStorage.setItem(KEYS.key, String(config.apiKey||''));
    if (newCfg.orgId !== undefined) localStorage.setItem(KEYS.org, String(config.orgId||''));
  },
  isEnabled: enabled,
  clients: {
    // Crea en remoto y devuelve el objeto remoto (o null si falla). No altera UI si falla.
    async create(local){
      if (!enabled()) return null;
      const { first, last } = splitName(local.name || '');
      const payload = {
        organization_id: config.orgId,
        external_id: local.id || null,
        first_name: first,
        last_name: last,
        email: local.email || null,
        phone: local.phoneMobile || local.phone || null,
        attributes: {
          clientType: local.clientType,
          contactPreferred: local.contactPreferred,
          contactSource: local.contactSource,
          typeWanted: local.typeWanted || local.type,
          zone: local.zone,
          priceMin: local.priceMin ?? local.budgetMin,
          priceMax: local.priceMax ?? local.budgetMax,
          desiredFeatures: local.desiredFeatures,
          offerPropertyType: local.offerPropertyType,
          offerAddress: local.offerAddress,
          offerPriceEstimate: local.offerPriceEstimate,
          advisorAssigned: local.advisorAssigned,
          status: local.status,
          notes: local.notes
        }
      };
      const created = await http('POST', '/clients', payload);
      if (created && created.id){
        // Guarda el id remoto para referencia futura
        const arr = db.get('clients', []);
        const i = arr.findIndex(x=> String(x.id) === String(local.id));
        if (i>=0){
          arr[i] = { ...arr[i], remoteId: created.id };
          db.set('clients', arr);
        }
      }
      return created;
    },
    // Upsert vía import batch (acepta array JSON) — útil para updates
    async upsert(local){
      if (!enabled()) return null;
      const { first, last } = splitName(local.name || '');
      const row = {
        organization_id: config.orgId,
        external_id: local.id || null,
        first_name: first,
        last_name: last,
        email: local.email || null,
        phone: local.phoneMobile || local.phone || null,
        attributes: {
          clientType: local.clientType,
          contactPreferred: local.contactPreferred,
          contactSource: local.contactSource,
          typeWanted: local.typeWanted || local.type,
          zone: local.zone,
          priceMin: local.priceMin ?? local.budgetMin,
          priceMax: local.priceMax ?? local.budgetMax,
          desiredFeatures: local.desiredFeatures,
          offerPropertyType: local.offerPropertyType,
          offerAddress: local.offerAddress,
          offerPriceEstimate: local.offerPriceEstimate,
          advisorAssigned: local.advisorAssigned,
          status: local.status,
          notes: local.notes
        }
      };
      return await http('POST', '/batch/clients/import', [row]);
    },
    async get(id){
      if (!enabled()) return null;
      return await http('GET', `/clients/${encodeURIComponent(id)}`);
    }
  },
  // endpoints adicionales disponibles para futuro uso
  interactions: {
    async create(payload){
      if (!enabled()) return null;
      return await http('POST', '/interactions', payload);
    }
  },
  sales: {
    async create(payload){
      if (!enabled()) return null;
      return await http('POST', '/sales', payload);
    }
  },
  // Prueba de conectividad/autenticación sin efectos secundarios
  async test(){
    if (!enabled()) return { ok:false, reason:'not-configured' };
    const url = `${config.base}/clients/${encodeURIComponent('00000000-0000-0000-0000-000000000000')}`;
    try{
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': config.apiKey,
          'X-ORG-ID': config.orgId
        }
      });
      if (res.status === 401) return { ok:false, reason:'unauthorized' };
      if (res.status === 403) return { ok:false, reason:'forbidden' };
      if (res.status === 404) return { ok:true, reason:'not-found-ok' }; // ruta y auth válidas
      if (res.ok) return { ok:true, reason:'ok' };
      return { ok:false, reason:`http-${res.status}` };
    }catch(err){
      return { ok:false, reason:'network', error: String(err && err.message || err) };
    }
  }
};

// Config rápida opcional via globals (antes de app.js):
// window.CRM_API_BASE = 'http://localhost:3000';
// window.CRM_API_KEY = '...' // API_KEY_CRM o API_KEY_ADMIN
// window.CRM_ORG_ID = '...'  // UUID de la organización
