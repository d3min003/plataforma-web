// Capa API: abstrae acceso a datos (localStorage + sincronización opcional con backend)
import { db, uid } from './storage.js';

const API_BASE = window.CRM_API_BASE || '';
const hasRemote = typeof API_BASE === 'string' && API_BASE.length > 0;

async function http(method, path, body){
  if (!hasRemote) return null;
  try{
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type':'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text().catch(()=>res.statusText));
    return await res.json().catch(()=>null);
  }catch(err){
    console.warn('API error', method, path, err?.message || err);
    return null;
  }
}

const isNumericId = (id)=> /^\d+$/.test(String(id));

export const api = {
  clients: {
    list(){
      const cur = db.get('clients', []);
      // Prefetch/sync en segundo plano si hay backend
      if (hasRemote && (!cur || cur.length===0)){
        http('GET','/clientes').then(data=>{ if (Array.isArray(data)) db.set('clients', data); });
      }
      return db.get('clients', []);
    },
    get(id){
      const arr = db.get('clients', []);
      const found = arr.find(c=> String(c.id) === String(id));
      if (!found && hasRemote){
        http('GET', `/clientes/${encodeURIComponent(id)}`).then(d=>{
          if (d){ const a = db.get('clients', []); if (!a.find(x=>String(x.id)===String(d.id))) { a.push(d); db.set('clients', a); } }
        });
      }
      return found || null;
    },
    create(data){
      // Persistencia local inmediata (optimista)
      const tempId = data.id || uid('cli');
      const localItem = { id: tempId, createdAt: new Date().toISOString(), ...data };
      const arr = db.get('clients', []); arr.push(localItem); db.set('clients', arr);

      // Sincronizar con backend (map mínimo según API base-datos-central)
      http('POST','/clientes', {
        name: data.name || '',
        email: data.email || null,
        phone: data.phoneMobile || data.phone || null,
        advisor_id: null,
      }).then(created=>{
        if (created && created.id){
          // Reemplazar tempId por id real
          const a = db.get('clients', []);
          const i = a.findIndex(x=> String(x.id)===String(tempId));
          if (i>=0) { a[i] = { ...a[i], id: created.id }; db.set('clients', a); }
        }
      });

      return localItem;
    },
    update(id, patch){
      const updated = db.update('clients', id, patch);
      if (hasRemote && isNumericId(id)){
        http('PUT', `/clientes/${encodeURIComponent(id)}`, {
          name: patch.name,
          email: patch.email,
          phone: patch.phoneMobile || patch.phone,
          advisor_id: null,
        });
      }
      return updated;
    },
    remove(id){
      const ok = db.remove('clients', id);
      if (hasRemote && isNumericId(id)){
        http('DELETE', `/clientes/${encodeURIComponent(id)}`);
      }
      return ok;
    },
  },
  properties: {
    list(){
      const cur = db.get('properties', []);
      if (hasRemote && (!cur || cur.length===0)){
        http('GET','/propiedades').then(d=>{ if (Array.isArray(d)) db.set('properties', d); });
      }
      return db.get('properties', []);
    },
  },
  users: {
    list(){ return db.get('users', []); },
  }
};

// Para usar backend central, define window.CRM_API_BASE = "https://tu-dominio-o-host:8080" antes de cargar app.js.
