import { db, clearSession } from '../core/storage.js';

export function ConfigView(){
  return `
  <section class="card">
    <h2>Configuración</h2>
  <p class="small">Esta versión guarda los datos en tu navegador (localStorage). Puedes exportar tus datos.</p>
    <div class="row">
      <button class="btn" id="btnExport">Exportar datos</button>
      <button class="btn danger" id="btnReset">Borrar todo</button>
      <button class="btn secondary" id="btnLogout">Cerrar sesión</button>
    </div>
    <pre id="exportOut" class="card" style="margin-top:12px; white-space:pre-wrap"></pre>
  </section>`;
}

export function bindConfigEvents(root){
  const out = root.querySelector('#exportOut');
  const btnExport = root.querySelector('#btnExport');
  // import removed
  const btnReset = root.querySelector('#btnReset');
  const btnLogout = root.querySelector('#btnLogout');
  btnExport?.addEventListener('click', ()=>{
    const dump = {
      users: db.get('users', []),
      clients: db.get('clients', []),
      properties: db.get('properties', []),
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(dump, null, 2);
    out.textContent = json;
    const blob = new Blob([json], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'crm_export.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  // import functionality removed
  btnReset?.addEventListener('click', ()=>{
    if (confirm('Esto eliminará todos los datos locales. ¿Continuar?')){
      Object.keys(localStorage).forEach(k=>{ if(k.startsWith('crmInmo_v1:')) localStorage.removeItem(k); });
      location.reload();
    }
  });
  btnLogout?.addEventListener('click', ()=>{ clearSession(); location.hash = '#/login'; });
}
