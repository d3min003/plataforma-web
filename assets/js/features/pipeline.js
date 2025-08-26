import { db } from '../core/storage.js';

export function PipelineView() {
  const props = db.get('properties', []);
  const by = (status) => props.filter(p=>p.status===status);
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
  <section class="kanban">
    ${col('Disponible','disponible')}
    ${col('Negociación','negociacion')}
    ${col('Reservado','reservado')}
    ${col('Vendido','vendido')}
  </section>`;
}

export function bindPipelineEvents(root){
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
        location.hash = '#/pipeline';
      }
    });
  });
}
