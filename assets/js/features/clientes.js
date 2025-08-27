import { db, uid } from '../core/storage.js';
import { api } from '../core/api.js';

export function ClientesView() {
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
  </section>`;
}

export function bindClientesEvents(root) {
  const form = root.querySelector('#formCliente');
  const btnSubmit = root.querySelector('#btnClienteSubmit');
  const btnCancel = root.querySelector('#btnClienteCancel');
  function prefillIfEditParam(){
    const q = (location.hash.split('?')[1]||'');
    const params = new URLSearchParams(q);
    const editId = params.get('edit');
    if (!editId || !form) return;
    const c = db.get('clients', []).find(x => x.id === editId);
    if (!c) return;
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
  }
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
    // Sincronización remota (no bloqueante)
    try { api.clients.upsert({ id: data.id, ...updated }); } catch {}
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
    // Crear en backend si está configurado (no bloqueante)
    try { api.clients.create(item); } catch {}
      }
      location.hash = '#/clientes';
    });
  }
  btnCancel?.addEventListener('click', ()=>{ location.hash = '#/clientes'; });
  prefillIfEditParam();
}
