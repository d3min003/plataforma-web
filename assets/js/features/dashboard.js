import { db } from '../core/storage.js';

export function DashboardView() {
  const properties = db.get('properties', []);
  const clients = db.get('clients', []);
  const k = {
    disponible: properties.filter(p=>p.status==='disponible').length,
    negociacion: properties.filter(p=>p.status==='negociacion').length,
    reservado: properties.filter(p=>p.status==='reservado').length,
    vendido: properties.filter(p=>p.status==='vendido').length,
  };
  const by = (status) => properties.filter(p=>p.status===status);
  const col = (label, key) => `
    <div class="column">
      <h4><span class="status-dot dot-${key}"></span>${label}</h4>
      <div class="dropzone" data-status="${key}">
        ${by(key).map(p=>`
          <div class="card-item" draggable="true" data-id="${p.id}">
            <div style="font-weight:600">${p.title}</div>
            <div class="small">$ ${Number(p.price||0).toLocaleString()} · ${p.neighborhood || p.city || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  return `
  <section class="grid" style="grid-template-columns: repeat(4, 1fr)">
    ${Object.entries(k).map(([name,val])=>`
      <div class="card kpi">
        <div>
          <div class="small">${name.toUpperCase()}</div>
          <div style="font-size:28px; font-weight:700">${val}</div>
        </div>
        <div class="badge">Inventario</div>
      </div>
    `).join('')}
    <div class="card" style="grid-column: span 2">
      <div class="kpi">
        <div>
          <div class="small">CLIENTES</div>
          <div style="font-size:28px; font-weight:700">${clients.length}</div>
        </div>
        <div class="badge">Base activa</div>
      </div>
      <p class="small">Total de clientes registrados en el navegador.</p>
    </div>
  </section>
  <section class="kanban" style="margin-top:16px">
    ${col('Disponible','disponible')}
    ${col('Negociación','negociacion')}
    ${col('Reservado','reservado')}
    ${col('Vendido','vendido')}
  </section>`;
}

export function bindDashboardEvents(root){
  let dragId = null;
  root.querySelectorAll('.card-item').forEach(el=>{
    el.addEventListener('dragstart', ()=>{
      dragId = el.getAttribute('data-id');
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', ()=>{ el.classList.remove('dragging'); });
  });
  root.querySelectorAll('.dropzone').forEach(zone=>{
    zone.addEventListener('dragover', (e)=>{ e.preventDefault(); });
    zone.addEventListener('drop', ()=>{
      if (!dragId) return;
      const status = zone.getAttribute('data-status');
      const arr = db.get('properties', []);
      const p = arr.find(x=>x.id===dragId);
      if (p) {
        p.status = status;
        db.set('properties', arr);
        location.hash = '#/dashboard';
      }
    });
  });
}
