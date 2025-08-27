import { db } from '../core/storage.js';

export function DashboardView() {
  const properties = db.get('properties', []);
  const clients = db.get('clients', []);
  const users = db.get('users', []).filter(u=>u.role!=='admin');
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
  </section>

  <section class="card" style="margin-top:16px">
    <h3>Clientes</h3>
    <div class="row" style="gap:8px; align-items:end; margin-bottom:8px">
      <div style="flex:2">
        <label>Búsqueda</label>
        <input id="cliSearch" class="input" placeholder="Buscar (nombre, email, teléfono, zona)" />
      </div>
      <div>
        <label>Tipo</label>
        <select id="cliType" class="input">
          <option value="">Todos</option>
          <option>Comprador</option>
          <option>Vendedor</option>
          <option>Arrendador</option>
          <option>Arrendatario</option>
        </select>
      </div>
      <div>
        <label>Estatus</label>
        <select id="cliStatus" class="input">
          <option value="">Todos</option>
          <option>Nuevo</option>
          <option>En contacto</option>
          <option>En negociación</option>
          <option>Cerrado</option>
          <option>Perdido</option>
        </select>
      </div>
      <div>
        <label>Contacto</label>
        <select id="cliContact" class="input">
          <option value="">Todos</option>
          <option>Teléfono</option>
          <option>WhatsApp</option>
          <option>Correo</option>
          <option>Otro</option>
        </select>
      </div>
      <div>
        <label>Presupuesto mín.</label>
        <input id="cliBudgetMin" class="input" type="number" min="0" />
      </div>
      <div>
        <label>Presupuesto máx.</label>
        <input id="cliBudgetMax" class="input" type="number" min="0" />
      </div>
      <div>
        <button id="cliFiltersClear" class="btn ghost" type="button">Limpiar</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th><th>Tipo cliente</th><th>Estatus</th><th>Contacto</th><th>Zona</th><th>Rango</th><th></th>
        </tr>
      </thead>
      <tbody id="tbClientes"></tbody>
    </table>
  </section>

  <section class="card" style="margin-top:16px">
    <h3>Propiedades</h3>
    <div class="row" style="gap:8px; align-items:end; margin-bottom:8px">
      <div style="flex:2">
        <label>Búsqueda</label>
        <input id="propSearch" class="input" placeholder="Buscar (título, zona, ciudad, propietario)" />
      </div>
      <div>
        <label>Tipo</label>
        <select id="propType" class="input">
          <option value="">Todos</option>
          <option>Casa</option>
          <option>Departamento</option>
          <option>Terreno</option>
          <option>Oficina</option>
          <option>Local</option>
        </select>
      </div>
      <div>
        <label>Estado</label>
        <select id="propStatus" class="input">
          <option value="">Todos</option>
          <option value="disponible">disponible</option>
          <option value="negociacion">negociacion</option>
          <option value="reservado">reservado</option>
          <option value="vendido">vendido</option>
        </select>
      </div>
      <div>
        <label>Precio mín.</label>
        <input id="propPriceMin" class="input" type="number" min="0" />
      </div>
      <div>
        <label>Precio máx.</label>
        <input id="propPriceMax" class="input" type="number" min="0" />
      </div>
      <div>
        <button id="propFiltersClear" class="btn ghost" type="button">Limpiar</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Título</th><th>Precio</th><th>Ubicación</th><th>Tipo</th><th>Estado</th><th></th>
        </tr>
      </thead>
      <tbody id="tbPropiedades"></tbody>
    </table>
  </section>

  <section class="card" style="margin-top:16px">
    <h3>Asesores</h3>
    <div class="row" style="gap:8px; align-items:end; margin-bottom:8px">
      <div style="flex:2">
        <label>Búsqueda</label>
        <input id="usrSearch" class="input" placeholder="Buscar (nombre, email, usuario)" />
      </div>
      <div>
        <button id="usrFiltersClear" class="btn ghost" type="button">Limpiar</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th><th>Email</th><th>Usuario</th><th>Rol</th><th></th>
        </tr>
      </thead>
      <tbody id="tbAsesores"></tbody>
    </table>
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

  // Clientes filters/listing
  const $cliTb = root.querySelector('#tbClientes');
  const $cliQ = root.querySelector('#cliSearch');
  const $cliType = root.querySelector('#cliType');
  const $cliStatus = root.querySelector('#cliStatus');
  const $cliContact = root.querySelector('#cliContact');
  const $cliMin = root.querySelector('#cliBudgetMin');
  const $cliMax = root.querySelector('#cliBudgetMax');
  const $cliClear = root.querySelector('#cliFiltersClear');
  function renderClientes(rows){
    if (!$cliTb) return;
    $cliTb.innerHTML = rows.map(c=>`
      <tr>
        <td>${c.name||''}</td>
        <td>${c.clientType||''}</td>
        <td>${c.status||'Nuevo'}</td>
        <td>${c.contactPreferred||''}</td>
        <td>${c.zone||''}</td>
        <td>${(c.priceMin??c.budgetMin??0)} - ${(c.priceMax??c.budgetMax??0)}</td>
        <td style="text-align:right">
          <button class="btn secondary" data-edit-cli="${c.id}">Editar</button>
          <button class="btn danger" data-del-cli="${c.id}">Borrar</button>
        </td>
      </tr>
    `).join('');
    // bind
    root.querySelectorAll('[data-del-cli]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-del-cli');
        if (confirm('¿Eliminar cliente?')){
          const left = db.get('clients', []).filter(x=>x.id!==id);
          db.set('clients', left);
          applyClientes();
        }
      });
    });
    root.querySelectorAll('[data-edit-cli]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-edit-cli');
        location.hash = `#/clientes?edit=${encodeURIComponent(id)}`;
      });
    });
  }
  function applyClientes(){
    const all = db.get('clients', []);
    const q = ($cliQ?.value||'').toLowerCase();
    const t = $cliType?.value||'';
    const st = $cliStatus?.value||'';
    const cp = $cliContact?.value||'';
    const fmin = Number($cliMin?.value||'');
    const fmax = Number($cliMax?.value||'');
    const hasMin = !Number.isNaN(fmin) && $cliMin?.value!=='';
    const hasMax = !Number.isNaN(fmax) && $cliMax?.value!=='';
    const rows = all.filter(c=>{
      const text = `${c.name||''} ${c.email||''} ${c.phoneMobile||c.phone||''} ${c.zone||''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (t && (c.clientType||'')!==t) return false;
      if (st && (c.status||'Nuevo')!==st) return false;
      if (cp && (c.contactPreferred||'')!==cp) return false;
      const cMin = Number(c.priceMin??c.budgetMin??0);
      const cMax = Number(c.priceMax??c.budgetMax??0);
      if (hasMin && cMax < fmin) return false;
      if (hasMax && cMin > fmax) return false;
      return true;
    });
    renderClientes(rows);
  }
  $cliQ?.addEventListener('input', applyClientes);
  $cliType?.addEventListener('change', applyClientes);
  $cliStatus?.addEventListener('change', applyClientes);
  $cliContact?.addEventListener('change', applyClientes);
  $cliMin?.addEventListener('input', applyClientes);
  $cliMax?.addEventListener('input', applyClientes);
  $cliClear?.addEventListener('click', ()=>{ if($cliQ) $cliQ.value=''; if($cliType) $cliType.value=''; if($cliStatus) $cliStatus.value=''; if($cliContact) $cliContact.value=''; if($cliMin) $cliMin.value=''; if($cliMax) $cliMax.value=''; applyClientes(); });
  applyClientes();

  // Propiedades filters/listing
  const $pTb = root.querySelector('#tbPropiedades');
  const $pQ = root.querySelector('#propSearch');
  const $pType = root.querySelector('#propType');
  const $pStatus = root.querySelector('#propStatus');
  const $pMin = root.querySelector('#propPriceMin');
  const $pMax = root.querySelector('#propPriceMax');
  const $pClear = root.querySelector('#propFiltersClear');
  function renderProps(rows){
    if (!$pTb) return;
    $pTb.innerHTML = rows.map(p=>`
      <tr>
        <td>${p.title||''}</td>
        <td>$ ${Number(p.price||0).toLocaleString()} ${p.currency||''}</td>
        <td>${p.neighborhood||p.city||p.zone||''}</td>
        <td>${p.type||''}</td>
        <td><span class="badge">${p.status||'disponible'}</span></td>
        <td style="text-align:right">
          <button class="btn secondary" data-edit-prop="${p.id}">Editar</button>
          <button class="btn danger" data-del-prop="${p.id}">Borrar</button>
        </td>
      </tr>
    `).join('');
    root.querySelectorAll('[data-del-prop]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-del-prop');
        if (confirm('¿Eliminar propiedad?')){
          const arr = db.get('properties', []).filter(x=>x.id!==id);
          db.set('properties', arr);
          applyProps();
        }
      });
    });
    root.querySelectorAll('[data-edit-prop]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-edit-prop');
        location.hash = `#/propiedades?edit=${encodeURIComponent(id)}`;
      });
    });
  }
  function applyProps(){
    const all = db.get('properties', []);
    const q = ($pQ?.value||'').toLowerCase();
    const t = $pType?.value||'';
    const st = $pStatus?.value||'';
    const fmin = Number($pMin?.value||'');
    const fmax = Number($pMax?.value||'');
    const hasMin = !Number.isNaN(fmin) && $pMin?.value!=='';
    const hasMax = !Number.isNaN(fmax) && $pMax?.value!=='';
    const rows = all.filter(p=>{
      const text = `${p.title||''} ${p.neighborhood||''} ${p.city||''} ${p.ownerName||''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (t && (p.type||'')!==t) return false;
      if (st && (p.status||'')!==st) return false;
      const price = Number(p.price||0);
      if (hasMin && price < fmin) return false;
      if (hasMax && price > fmax) return false;
      return true;
    });
    renderProps(rows);
  }
  $pQ?.addEventListener('input', applyProps);
  $pType?.addEventListener('change', applyProps);
  $pStatus?.addEventListener('change', applyProps);
  $pMin?.addEventListener('input', applyProps);
  $pMax?.addEventListener('input', applyProps);
  $pClear?.addEventListener('click', ()=>{ if($pQ) $pQ.value=''; if($pType) $pType.value=''; if($pStatus) $pStatus.value=''; if($pMin) $pMin.value=''; if($pMax) $pMax.value=''; applyProps(); });
  applyProps();

  // Asesores filters/listing
  const $uTb = root.querySelector('#tbAsesores');
  const $uQ = root.querySelector('#usrSearch');
  const $uClear = root.querySelector('#usrFiltersClear');
  function renderUsers(rows){
    if (!$uTb) return;
    $uTb.innerHTML = rows.map(u=>`
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.username}</td>
        <td><span class="badge">${u.role}</span></td>
        <td style="text-align:right">
          <button class="btn danger" data-del-usr="${u.id}">Borrar</button>
        </td>
      </tr>
    `).join('');
    root.querySelectorAll('[data-del-usr]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-del-usr');
        const arr = db.get('users', []).filter(x=>x.id!==id || x.role==='admin');
        db.set('users', arr);
        applyUsers();
      });
    });
  }
  function applyUsers(){
    const q = ($uQ?.value||'').toLowerCase();
    const all = db.get('users', []).filter(u=>u.role!=='admin');
    const rows = all.filter(u=>`${u.name} ${u.email} ${u.username}`.toLowerCase().includes(q));
    renderUsers(rows);
  }
  $uQ?.addEventListener('input', applyUsers);
  $uClear?.addEventListener('click', ()=>{ if($uQ) $uQ.value=''; applyUsers(); });
  applyUsers();
}
