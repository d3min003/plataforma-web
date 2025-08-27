import { db, uid } from '../core/storage.js';

export function PropiedadesView() {
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
        <button class="btn ghost" type="button" id="btnPropCancel" style="display:none">Cancelar / Limpiar formulario</button>
      </div>
    </form>
  </section>`;
}

export function bindPropiedadesEvents(root) {
  const form = root.querySelector('#formProp');
  const btnSubmit = root.querySelector('#btnPropSubmit');
  const btnCancel = root.querySelector('#btnPropCancel');
  function prefillIfEditParam(){
    const q = (location.hash.split('?')[1]||'');
    const params = new URLSearchParams(q);
    const editId = params.get('edit');
    if (!editId || !form) return;
    const p = db.get('properties', []).find(x=>x.id===editId);
    if (!p) return;
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
    if (btnCancel) btnCancel.style.display = 'inline-block';
    form.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // Wire up filters
  function clearPropForm(){
    if (!form) return;
    form.reset();
    form.id.value = '';
    btnSubmit.textContent = 'Guardar propiedad';
  if (btnCancel) btnCancel.style.display = 'none';
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
      const hadEdit = (location.hash.includes('?edit='));
      if (hadEdit) {
        location.hash = '#/propiedades';
      } else {
        if (form) { form.reset(); form.id.value=''; }
        btnSubmit.textContent = 'Guardar propiedad';
        if (btnCancel) btnCancel.style.display = 'none';
      }
    });
  }
  btnCancel?.addEventListener('click', ()=>{ clearPropForm(); });
  prefillIfEditParam();
}
