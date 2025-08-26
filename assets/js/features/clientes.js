import { db, uid } from '../core/storage.js';

export function ClientesView() {
  const clients = db.get('clients', []);
  return `
  <section class="card">
    <h2>Clientes</h2>
    <form id="formCliente" class="grid" style="grid-template-columns: repeat(6, 1fr); align-items:end; gap:12px">
      <input type="hidden" name="id" />

      <div style="grid-column: span 6"><h3>Datos Generales</h3></div>
      <div style="grid-column: span 3">
        <label>Nombre completo</label>
        <input class="input" name="name" required />
      </div>
      <div style="grid-column: span 3">
        <label>Correo electrónico</label>
        <input class="input" name="email" type="email" />
      </div>
      <div style="grid-column: span 3">
        <label>Teléfono móvil</label>
        <input class="input" name="phoneMobile" />
      </div>
      <div style="grid-column: span 3">
        <label>Teléfono alternativo</label>
        <input class="input" name="phoneAlt" />
      </div>

      <div style="grid-column: span 6"><h3>Perfil del Cliente</h3></div>
      <div>
        <label>Tipo de cliente</label>
        <select class="input" name="clientType">
          <option>Comprador</option>
          <option>Vendedor</option>
          <option>Arrendador</option>
          <option>Arrendatario</option>
        </select>
      </div>
      <div>
        <label>Medio de contacto preferido</label>
        <select class="input" name="contactPreferred">
          <option>Teléfono</option>
          <option>WhatsApp</option>
          <option>Correo</option>
          <option>Otro</option>
        </select>
      </div>
      <div>
        <label>Fuente de contacto</label>
        <select class="input" name="contactSource">
          <option>Página web</option>
          <option>Redes sociales</option>
          <option>Referencia</option>
          <option>Otro</option>
        </select>
      </div>

      <div style="grid-column: span 6"><h3>Requerimientos (Comprador/Arrendatario)</h3></div>
      <div>
        <label>Tipo de propiedad buscada</label>
        <select class="input" name="typeWanted">
          <option>Casa</option>
          <option>Departamento</option>
          <option>Oficina</option>
          <option>Local</option>
          <option>Terreno</option>
        </select>
      </div>
      <div>
        <label>Zona de interés</label>
        <input class="input" name="zone" />
      </div>
      <div>
        <label>Rango de precio (mín)</label>
        <input class="input" name="priceMin" type="number" min="0" />
      </div>
      <div>
        <label>Rango de precio (máx)</label>
        <input class="input" name="priceMax" type="number" min="0" />
      </div>
      <div style="grid-column: span 6">
        <label>Características deseadas</label>
        <input class="input" name="desiredFeatures" placeholder="Ej: 3 recámaras, 2 baños, patio..." />
      </div>

      <div style="grid-column: span 6"><h3>Requerimientos (Vendedor/Arrendador)</h3></div>
      <div>
        <label>Propiedad a ofrecer</label>
        <select class="input" name="offerPropertyType">
          <option>Casa</option>
          <option>Departamento</option>
          <option>Oficina</option>
          <option>Local</option>
          <option>Terreno</option>
        </select>
      </div>
      <div style="grid-column: span 3">
        <label>Dirección</label>
        <input class="input" name="offerAddress" />
      </div>
      <div>
        <label>Precio estimado</label>
        <input class="input" name="offerPriceEstimate" type="number" min="0" />
      </div>

      <div style="grid-column: span 6"><h3>Seguimiento</h3></div>
      <div>
        <label>Asesor asignado</label>
        <input class="input" name="advisorAssigned" />
      </div>
      <div>
        <label>Estatus del cliente</label>
        <select class="input" name="status">
          <option>Nuevo</option>
          <option>En contacto</option>
          <option>En negociación</option>
          <option>Cerrado</option>
          <option>Perdido</option>
        </select>
      </div>
      <div style="grid-column: span 6">
        <label>Notas adicionales</label>
        <textarea class="input" name="notes" rows="2" placeholder="Notas relevantes, expectativas, citas..."></textarea>
      </div>

      <div style="grid-column: span 6">
        <button class="btn" type="submit" id="btnClienteSubmit">Guardar cliente</button>
        <button class="btn ghost" type="button" id="btnClienteCancel" style="display:none">Cancelar / Limpiar formulario</button>
      </div>
    </form>
  </section>
  <section class="card" style="margin-top:16px">
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
      <tbody id="tbClientes">
        ${clients.map(c => `
          <tr>
            <td>${c.name || ''}</td>
            <td>${c.clientType || ''}</td>
            <td>${c.status || 'Nuevo'}</td>
            <td>${c.contactPreferred || ''}</td>
            <td>${c.zone || ''}</td>
            <td>${(c.priceMin ?? c.budgetMin ?? 0)} - ${(c.priceMax ?? c.budgetMax ?? 0)}</td>
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
  // Filtering controls
  const $tb = root.querySelector('#tbClientes');
  const $q = root.querySelector('#cliSearch');
  const $type = root.querySelector('#cliType');
  const $status = root.querySelector('#cliStatus');
  const $contact = root.querySelector('#cliContact');
  const $min = root.querySelector('#cliBudgetMin');
  const $max = root.querySelector('#cliBudgetMax');
  const $clear = root.querySelector('#cliFiltersClear');

  function renderRows(rows){
    if (!$tb) return;
    $tb.innerHTML = rows.map(c=>`
      <tr>
        <td>${c.name || ''}</td>
        <td>${c.clientType || ''}</td>
        <td>${c.status || 'Nuevo'}</td>
        <td>${c.contactPreferred || ''}</td>
        <td>${c.zone || ''}</td>
        <td>${(c.priceMin ?? c.budgetMin ?? 0)} - ${(c.priceMax ?? c.budgetMax ?? 0)}</td>
        <td style="text-align:right">
          <button class="btn secondary" data-edit="${c.id}">Editar</button>
          <button class="btn danger" data-del="${c.id}">Borrar</button>
        </td>
      </tr>
    `).join('');
    // Rebind row buttons
    bindRowActions();
  }

  function applyFilters(){
    const all = db.get('clients', []);
    const q = ($q?.value || '').toLowerCase();
    const t = $type?.value || '';
    const st = $status?.value || '';
    const cp = $contact?.value || '';
    const fmin = Number($min?.value || '');
    const fmax = Number($max?.value || '');
    const hasMin = !Number.isNaN(fmin) && $min?.value !== '';
    const hasMax = !Number.isNaN(fmax) && $max?.value !== '';
    const rows = all.filter(c=>{
      const text = `${c.name||''} ${c.email||''} ${c.phoneMobile||c.phone||''} ${c.zone||''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (t && (c.clientType||'') !== t) return false;
      if (st && (c.status||'Nuevo') !== st) return false;
      if (cp && (c.contactPreferred||'') !== cp) return false;
      const cMin = Number(c.priceMin ?? c.budgetMin ?? 0);
      const cMax = Number(c.priceMax ?? c.budgetMax ?? 0);
      if (hasMin && cMax < fmin) return false; // no overlap
      if (hasMax && cMin > fmax) return false;
      return true;
    });
    renderRows(rows);
  }

  function clearFilters(){
    if ($q) $q.value = '';
    if ($type) $type.value = '';
    if ($status) $status.value = '';
    if ($contact) $contact.value = '';
    if ($min) $min.value = '';
    if ($max) $max.value = '';
    renderRows(db.get('clients', []));
  }

  function bindRowActions(){
    // Bind edit/delete buttons again after rerender
    root.querySelectorAll('[data-del]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (confirm('¿Eliminar cliente?')) {
          const id = btn.getAttribute('data-del');
          const left = db.get('clients', []).filter(c => c.id !== id);
          db.set('clients', left);
          applyFilters();
        }
      });
    });
    root.querySelectorAll('[data-edit]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-edit');
        const c = db.get('clients', []).find(x => x.id === id);
        if (!c || !form) return;
        form.name.value = c.name || '';
        form.email.value = c.email || '';
        form.phoneMobile.value = c.phoneMobile || c.phone || '';
        form.phoneAlt.value = c.phoneAlt || '';
        form.clientType.value = c.clientType || 'Comprador';
        form.contactPreferred.value = c.contactPreferred || 'Teléfono';
        form.contactSource.value = c.contactSource || 'Página web';
        form.typeWanted.value = c.typeWanted || c.type || 'Casa';
        form.zone.value = c.zone || '';
        form.priceMin.value = c.priceMin ?? c.budgetMin ?? '';
        form.priceMax.value = c.priceMax ?? c.budgetMax ?? '';
        form.desiredFeatures.value = c.desiredFeatures || '';
        form.offerPropertyType.value = c.offerPropertyType || 'Casa';
        form.offerAddress.value = c.offerAddress || '';
        form.offerPriceEstimate.value = c.offerPriceEstimate || '';
        form.advisorAssigned.value = c.advisorAssigned || '';
        form.status.value = c.status || 'Nuevo';
        form.notes.value = c.notes || '';
        form.id.value = c.id;
        btnSubmit.textContent = 'Guardar cambios';
        btnCancel.style.display = 'inline-block';
        form.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  }

  // Wire up filters
  $q?.addEventListener('input', applyFilters);
  $type?.addEventListener('change', applyFilters);
  $status?.addEventListener('change', applyFilters);
  $contact?.addEventListener('change', applyFilters);
  $min?.addEventListener('input', applyFilters);
  $max?.addEventListener('input', applyFilters);
  $clear?.addEventListener('click', clearFilters);
  if (form) {
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const isEdit = !!data.id;
      if (isEdit) {
        const updated = {
          name: data.name?.trim(),
          email: data.email?.trim(),
          phoneMobile: data.phoneMobile?.trim(),
          phoneAlt: data.phoneAlt?.trim(),
          clientType: data.clientType,
          contactPreferred: data.contactPreferred,
          contactSource: data.contactSource,
          typeWanted: data.typeWanted,
          zone: data.zone?.trim(),
          priceMin: Number(data.priceMin||0),
          priceMax: Number(data.priceMax||0),
          desiredFeatures: data.desiredFeatures?.trim(),
          offerPropertyType: data.offerPropertyType,
          offerAddress: data.offerAddress?.trim(),
          offerPriceEstimate: Number(data.offerPriceEstimate||0),
          advisorAssigned: data.advisorAssigned?.trim(),
          status: data.status,
          notes: data.notes?.trim(),
        };
        db.update('clients', data.id, updated);
      } else {
        const item = {
          id: uid('cli'),
          name: data.name?.trim(),
          email: data.email?.trim(),
          phoneMobile: data.phoneMobile?.trim(),
          phoneAlt: data.phoneAlt?.trim(),
          clientType: data.clientType,
          contactPreferred: data.contactPreferred,
          contactSource: data.contactSource,
          typeWanted: data.typeWanted,
          zone: data.zone?.trim(),
          priceMin: Number(data.priceMin||0),
          priceMax: Number(data.priceMax||0),
          desiredFeatures: data.desiredFeatures?.trim(),
          offerPropertyType: data.offerPropertyType,
          offerAddress: data.offerAddress?.trim(),
          offerPriceEstimate: Number(data.offerPriceEstimate||0),
          advisorAssigned: data.advisorAssigned?.trim(),
          status: data.status,
          notes: data.notes?.trim(),
        };
  const all = db.get('clients', []);
  all.push(item);
  db.set('clients', all);
      }
      location.hash = '#/clientes';
    });
  }
  btnCancel?.addEventListener('click', ()=>{ location.hash = '#/clientes'; });
  // Initial bind and render ensure filters apply to current data
  bindRowActions();
}
