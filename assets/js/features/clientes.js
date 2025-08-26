import { db, uid } from '../core/storage.js';

export function ClientesView() {
  const clients = db.get('clients', []);
  return `
  <section class="card">
    <h2>Clientes</h2>
    <form id="formCliente" class="grid" style="grid-template-columns: repeat(6, 1fr); align-items:end; gap:12px">
      <input type="hidden" name="id" />
      <div>
        <label>Nombre</label>
        <input class="input" name="name" required />
      </div>
      <div>
        <label>Email</label>
        <input class="input" name="email" type="email" />
      </div>
      <div>
        <label>Teléfono</label>
        <input class="input" name="phone" />
      </div>
      <div>
        <label>Presupuesto Min</label>
        <input class="input" name="budgetMin" type="number" min="0" />
      </div>
      <div>
        <label>Presupuesto Max</label>
        <input class="input" name="budgetMax" type="number" min="0" />
      </div>
      <div>
        <label>Zona</label>
        <input class="input" name="zone" />
      </div>
      <div style="grid-column: span 2">
        <label>Tipo</label>
        <select class="input" name="type">
          <option>Departamento</option>
          <option>Casa</option>
          <option>PH</option>
          <option>Terreno</option>
        </select>
      </div>
      <div>
        <button class="btn" type="submit" id="btnClienteSubmit">Agregar</button>
        <button class="btn ghost" type="button" id="btnClienteCancel" style="display:none">Cancelar</button>
      </div>
    </form>
  </section>
  <section class="card" style="margin-top:16px">
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Presupuesto</th><th>Zona</th><th>Tipo</th><th></th>
        </tr>
      </thead>
      <tbody>
        ${clients.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.email || ''}</td>
            <td>${c.phone || ''}</td>
            <td>${c.budgetMin || 0} - ${c.budgetMax || 0}</td>
            <td>${c.zone || ''}</td>
            <td>${c.type || ''}</td>
            <td style="text-align:right">
              <button class="btn secondary" data-edit="${c.id}">Editar</button>
              <button class="btn danger" data-del="${c.id}">Borrar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>`;
}

export function bindClientesEvents(root) {
  const form = root.querySelector('#formCliente');
  const btnSubmit = root.querySelector('#btnClienteSubmit');
  const btnCancel = root.querySelector('#btnClienteCancel');
  if (form) {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const isEdit = !!data.id;
      if (isEdit) {
        const updated = {
          name: data.name?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim(),
          budgetMin: Number(data.budgetMin||0),
          budgetMax: Number(data.budgetMax||0),
          zone: data.zone?.trim(),
          type: data.type,
        };
        db.update('clients', data.id, updated);
      } else {
        const item = {
          id: uid('cli'),
          name: data.name?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim(),
          budgetMin: Number(data.budgetMin||0),
          budgetMax: Number(data.budgetMax||0),
          zone: data.zone?.trim(),
          type: data.type,
          createdAt: new Date().toISOString(),
        };
        const clients = db.get('clients', []);
        clients.push(item);
        db.set('clients', clients);
      }
      location.hash = '#/clientes';
    });
  }
  btnCancel?.addEventListener('click', ()=>{ location.hash = '#/clientes'; });
  root.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (confirm('¿Eliminar cliente?')) {
        const id = btn.getAttribute('data-del');
        const arr = db.get('clients', []).filter(c=>c.id!==id);
        db.set('clients', arr);
        location.hash = '#/clientes';
      }
    });
  });
  root.querySelectorAll('[data-edit]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-edit');
      const c = db.get('clients', []).find(x=>x.id===id);
      if (!c || !form) return;
      form.name.value = c.name || '';
      form.email.value = c.email || '';
      form.phone.value = c.phone || '';
      form.budgetMin.value = c.budgetMin || '';
      form.budgetMax.value = c.budgetMax || '';
      form.zone.value = c.zone || '';
      form.type.value = c.type || 'Departamento';
      form.id.value = c.id;
      btnSubmit.textContent = 'Guardar cambios';
      btnCancel.style.display = 'inline-block';
      form.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}
