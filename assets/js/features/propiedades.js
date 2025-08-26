import { db, uid } from '../core/storage.js';

export function PropiedadesView() {
  const props = db.get('properties', []);
  return `
  <section class="card">
    <h2>Propiedades</h2>
    <form id="formProp" class="grid" style="grid-template-columns: repeat(6, 1fr); align-items:end; gap:12px">
      <input type="hidden" name="id" />

      <div style="grid-column: span 6"><h3>Información General</h3></div>
      <div style="grid-column: span 3">
        <label>Título / Nombre de la propiedad</label>
        <input class="input" name="title" required />
      </div>
      <div style="grid-column: span 2">
        <label>Tipo de propiedad</label>
        <select class="input" name="type">
          <option>Casa</option>
          <option>Departamento</option>
          <option>Terreno</option>
          <option>Oficina</option>
          <option>Local</option>
        </select>
      </div>
      

      <div style="grid-column: span 6"><h3>Ubicación</h3></div>
      <div style="grid-column: span 3">
        <label>Dirección completa</label>
        <input class="input" name="address" />
      </div>
      <div style="grid-column: span 3">
        <label>Colonia / Barrio</label>
        <input class="input" name="neighborhood" />
      </div>
      <div>
        <label>Ciudad</label>
        <input class="input" name="city" />
      </div>
      <div>
        <label>Estado / Provincia</label>
        <input class="input" name="state" />
      </div>
      <div>
        <label>Código postal</label>
        <input class="input" name="postalCode" />
      </div>

      <div style="grid-column: span 6"><h3>Características</h3></div>
      <div>
        <label>Número de habitaciones</label>
        <input class="input" name="bedrooms" type="number" min="0" />
      </div>
      <div>
        <label>Número de baños</label>
        <input class="input" name="baths" type="number" min="0" />
      </div>
      <div>
        <label>Metros cuadrados construidos</label>
        <input class="input" name="builtM2" type="number" min="0" />
      </div>
      <div>
        <label>Metros cuadrados de terreno</label>
        <input class="input" name="landM2" type="number" min="0" />
      </div>
      <div>
        <label>Estacionamientos</label>
        <input class="input" name="parking" type="number" min="0" />
      </div>
      <div>
        <label>Edad de la propiedad (años)</label>
        <input class="input" name="ageYears" type="number" min="0" />
      </div>

      <div style="grid-column: span 6"><h3>Información financiera</h3></div>
      <div>
        <label>Precio de venta / renta</label>
        <input class="input" name="price" type="number" min="0" />
      </div>
      <div>
        <label>Moneda</label>
        <select class="input" name="currency">
          <option>MXN</option>
          <option>USD</option>
          <option>Otro</option>
        </select>
      </div>
      <div>
        <label>Tipo de operación</label>
        <select class="input" name="operation">
          <option>Venta</option>
          <option>Renta</option>
        </select>
      </div>

      <div style="grid-column: span 6"><h3>Documentación y contacto</h3></div>
      <div>
        <label>Estado legal / situación</label>
        <select class="input" name="legalStatus">
          <option>Libre</option>
          <option>Hipotecada</option>
          <option>En trámite</option>
        </select>
      </div>
      <div>
        <label>Nombre del propietario / contacto</label>
        <input class="input" name="ownerName" />
      </div>
      <div style="grid-column: span 2">
        <label>Teléfono / correo del contacto</label>
        <input class="input" name="contactInfo" />
      </div>

      <div style="grid-column: span 6"><h3>Estado del pipeline</h3></div>
      <div>
        <label>Estado</label>
        <select class="input" name="status">
          <option value="disponible">disponible</option>
          <option value="negociacion">negociacion</option>
          <option value="reservado">reservado</option>
          <option value="vendido">vendido</option>
        </select>
      </div>

      <div style="grid-column: span 6">
        <button class="btn" type="submit" id="btnPropSubmit">Guardar propiedad</button>
        <button class="btn ghost" type="button" id="btnPropCancel">Cancelar / Limpiar formulario</button>
      </div>
    </form>
  </section>
  <section class="card" style="margin-top:16px">
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
      <tbody id="tbPropiedades">
        ${props.map(p => `
          <tr>
            <td>${p.title || ''}</td>
            <td>$ ${Number(p.price||0).toLocaleString()} ${p.currency || ''}</td>
            <td>${p.neighborhood || p.city || p.zone || ''}</td>
            <td>${p.type || ''}</td>
            <td><span class="badge">${p.status || 'disponible'}</span></td>
            <td style="text-align:right">
              <button class="btn secondary" data-edit-prop="${p.id}">Editar</button>
              <button class="btn secondary" data-move="${p.id}">Mover</button>
              <button class="btn danger" data-del="${p.id}">Borrar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>`;
}

export function bindPropiedadesEvents(root) {
  const form = root.querySelector('#formProp');
  const btnSubmit = root.querySelector('#btnPropSubmit');
  const btnCancel = root.querySelector('#btnPropCancel');
  // Filters
  const $tb = root.querySelector('#tbPropiedades');
  const $q = root.querySelector('#propSearch');
  const $type = root.querySelector('#propType');
  const $status = root.querySelector('#propStatus');
  const $min = root.querySelector('#propPriceMin');
  const $max = root.querySelector('#propPriceMax');
  const $clear = root.querySelector('#propFiltersClear');

  function renderRows(rows){
    if (!$tb) return;
    $tb.innerHTML = rows.map(p=>`
      <tr>
        <td>${p.title || ''}</td>
        <td>$ ${Number(p.price||0).toLocaleString()} ${p.currency || ''}</td>
        <td>${p.neighborhood || p.city || p.zone || ''}</td>
        <td>${p.type || ''}</td>
        <td><span class="badge">${p.status || 'disponible'}</span></td>
        <td style="text-align:right">
          <button class="btn secondary" data-edit-prop="${p.id}">Editar</button>
          <button class="btn secondary" data-move="${p.id}">Mover</button>
          <button class="btn danger" data-del="${p.id}">Borrar</button>
        </td>
      </tr>
    `).join('');
    bindRowActions();
  }

  function applyFilters(){
    const all = db.get('properties', []);
    const q = ($q?.value || '').toLowerCase();
    const t = $type?.value || '';
    const st = $status?.value || '';
    const fmin = Number($min?.value || '');
    const fmax = Number($max?.value || '');
    const hasMin = !Number.isNaN(fmin) && $min?.value !== '';
    const hasMax = !Number.isNaN(fmax) && $max?.value !== '';
    const rows = all.filter(p=>{
      const text = `${p.title||''} ${p.neighborhood||''} ${p.city||''} ${p.ownerName||''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (t && (p.type||'') !== t) return false;
      if (st && (p.status||'') !== st) return false;
      const price = Number(p.price||0);
      if (hasMin && price < fmin) return false;
      if (hasMax && price > fmax) return false;
      return true;
    });
    renderRows(rows);
  }

  function clearFilters(){
    if ($q) $q.value = '';
    if ($type) $type.value = '';
    if ($status) $status.value = '';
    if ($min) $min.value = '';
    if ($max) $max.value = '';
    renderRows(db.get('properties', []));
  }

  function bindRowActions(){
    root.querySelectorAll('[data-del]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (confirm('¿Eliminar propiedad?')) {
          const id = btn.getAttribute('data-del');
          const arr = db.get('properties', []).filter(p=>p.id!==id);
          db.set('properties', arr);
          applyFilters();
        }
      });
    });
    root.querySelectorAll('[data-move]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-move');
        const arr = db.get('properties', []);
        const p = arr.find(x=>x.id===id);
        const order = ['disponible','negociacion','reservado','vendido'];
        const next = order[(order.indexOf(p.status)+1)%order.length];
        p.status = next;
        db.set('properties', arr);
        applyFilters();
      });
    });
    root.querySelectorAll('[data-edit-prop]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-edit-prop');
        const p = db.get('properties', []).find(x=>x.id===id);
        if (!p || !form) return;
        form.id.value = p.id;
        form.title.value = p.title || '';
        form.price.value = p.price || '';
        form.currency.value = p.currency || 'MXN';
        form.operation.value = p.operation || 'Venta';
        form.address.value = p.address || '';
        form.neighborhood.value = p.neighborhood || '';
        form.city.value = p.city || '';
        form.state.value = p.state || '';
        form.postalCode.value = p.postalCode || '';
        form.type.value = p.type || 'Casa';
        form.status.value = p.status || 'disponible';
        form.bedrooms.value = p.bedrooms || '';
        form.baths.value = p.baths || '';
        form.builtM2.value = p.builtM2 || '';
        form.landM2.value = p.landM2 || '';
        form.parking.value = p.parking || '';
        form.ageYears.value = p.ageYears || '';
        form.legalStatus.value = p.legalStatus || 'Libre';
        form.ownerName.value = p.ownerName || '';
        form.contactInfo.value = p.contactInfo || '';
        btnSubmit.textContent = 'Guardar cambios';
        const bc = btnCancel; if (bc) bc.style.display = 'inline-block';
        form.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  }

  // Wire up filters
  $q?.addEventListener('input', applyFilters);
  $type?.addEventListener('change', applyFilters);
  $status?.addEventListener('change', applyFilters);
  $min?.addEventListener('input', applyFilters);
  $max?.addEventListener('input', applyFilters);
  $clear?.addEventListener('click', clearFilters);
  function clearPropForm(){
    if (!form) return;
    form.reset();
    form.id.value = '';
    btnSubmit.textContent = 'Guardar propiedad';
  }
  if (form) {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const isEdit = !!data.id;
      if (isEdit) {
        db.update('properties', data.id, {
          title: data.title?.trim(),
          price: Number(data.price||0),
          currency: data.currency,
          operation: data.operation,
          address: data.address?.trim(),
          neighborhood: data.neighborhood?.trim(),
          city: data.city?.trim(),
          state: data.state?.trim(),
          postalCode: data.postalCode?.trim(),
          zone: (data.neighborhood?.trim() || data.city?.trim() || ''),
          type: data.type,
          status: data.status,
          bedrooms: Number(data.bedrooms||0),
          baths: Number(data.baths||0),
          builtM2: Number(data.builtM2||0),
          landM2: Number(data.landM2||0),
          parking: Number(data.parking||0),
          ageYears: Number(data.ageYears||0),
          legalStatus: data.legalStatus,
          ownerName: data.ownerName?.trim(),
          contactInfo: data.contactInfo?.trim(),
        });
      } else {
        const item = {
          id: uid('prop'),
          title: data.title?.trim(),
          price: Number(data.price||0),
          currency: data.currency,
          operation: data.operation,
          address: data.address?.trim(),
          neighborhood: data.neighborhood?.trim(),
          city: data.city?.trim(),
          state: data.state?.trim(),
          postalCode: data.postalCode?.trim(),
          zone: (data.neighborhood?.trim() || data.city?.trim() || ''),
          type: data.type,
          status: data.status,
          bedrooms: Number(data.bedrooms||0),
          baths: Number(data.baths||0),
          builtM2: Number(data.builtM2||0),
          landM2: Number(data.landM2||0),
          parking: Number(data.parking||0),
          ageYears: Number(data.ageYears||0),
          legalStatus: data.legalStatus,
          ownerName: data.ownerName?.trim(),
          contactInfo: data.contactInfo?.trim(),
          createdAt: new Date().toISOString(),
        };
        const arr = db.get('properties', []);
        arr.push(item);
        db.set('properties', arr);
      }
      location.hash = '#/propiedades';
    });
  }
  btnCancel?.addEventListener('click', ()=>{ clearPropForm(); });
  root.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (confirm('¿Eliminar propiedad?')) {
        const id = btn.getAttribute('data-del');
        const arr = db.get('properties', []).filter(p=>p.id!==id);
        db.set('properties', arr);
        location.hash = '#/propiedades';
      }
    });
  });
  root.querySelectorAll('[data-move]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-move');
      const arr = db.get('properties', []);
      const p = arr.find(x=>x.id===id);
      const order = ['disponible','negociacion','reservado','vendido'];
      const next = order[(order.indexOf(p.status)+1)%order.length];
      p.status = next;
      db.set('properties', arr);
      location.hash = '#/propiedades';
    });
  });
  root.querySelectorAll('[data-edit-prop]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-edit-prop');
      const p = db.get('properties', []).find(x=>x.id===id);
      if (!p || !form) return;
      form.id.value = p.id;
      form.title.value = p.title || '';
      form.price.value = p.price || '';
      form.currency.value = p.currency || 'MXN';
      form.operation.value = p.operation || 'Venta';
      form.address.value = p.address || '';
      form.neighborhood.value = p.neighborhood || '';
      form.city.value = p.city || '';
      form.state.value = p.state || '';
      form.postalCode.value = p.postalCode || '';
      form.type.value = p.type || 'Casa';
      form.status.value = p.status || 'disponible';
      form.bedrooms.value = p.bedrooms || '';
      form.baths.value = p.baths || '';
      form.builtM2.value = p.builtM2 || '';
      form.landM2.value = p.landM2 || '';
      form.parking.value = p.parking || '';
      form.ageYears.value = p.ageYears || '';
      form.legalStatus.value = p.legalStatus || 'Libre';
      form.ownerName.value = p.ownerName || '';
      form.contactInfo.value = p.contactInfo || '';
      btnSubmit.textContent = 'Guardar cambios';
      const bc = btnCancel; if (bc) bc.style.display = 'inline-block';
      form.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}
