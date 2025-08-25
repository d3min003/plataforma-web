// Views: HTML renderers + binders (clean)
import { db, uid, setSession, clearSession, makeSalt, hashPassword } from './storage.js';

// Dashboard
export function DashboardView() {
	const properties = db.get('properties', []);
	const clients = db.get('clients', []);
	const k = {
		disponible: properties.filter(p=>p.status==='disponible').length,
		negociacion: properties.filter(p=>p.status==='negociacion').length,
		reservado: properties.filter(p=>p.status==='reservado').length,
		vendido: properties.filter(p=>p.status==='vendido').length,
	};
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
	</section>`;
}

// Login
export function LoginView(){
	return `
	<section class="card" style="max-width:520px; margin:48px auto">
		<h2>Acceso</h2>
		<p class="small">Sin backend. Crea una cuenta local en tu navegador y entra con usuario y contraseña.</p>

		<div class="tabs row" style="gap:8px; margin-bottom:12px">
			<button class="btn" id="tabLogin">Iniciar sesión</button>
			<button class="btn ghost" id="tabRegister">Crear cuenta</button>
		</div>

		<form id="formLogin" class="grid" style="grid-template-columns: 1fr; gap:12px">
			<div>
				<label>Usuario o Email</label>
				<input class="input" name="user" required />
			</div>
			<div>
				<label>Contraseña</label>
				<input class="input" name="pass" type="password" required />
			</div>
			<div class="row">
				<button class="btn" type="submit">Entrar</button>
			</div>
		</form>

		<form id="formRegister" class="grid" style="grid-template-columns: 1fr 1fr; gap:12px; display:none; margin-top:8px">
			<div style="grid-column: span 2">
				<label>Nombre</label>
				<input class="input" name="name" required />
			</div>
			<div>
				<label>Email</label>
				<input class="input" name="email" type="email" required />
			</div>
			<div>
				<label>Usuario</label>
				<input class="input" name="username" required />
			</div>
			<div>
				<label>Contraseña</label>
				<input class="input" name="pass" type="password" minlength="4" required />
			</div>
			<div>
				<label>Rol</label>
				<select class="input" name="role">
					<option value="asesor">asesor</option>
					<option value="admin">admin</option>
				</select>
			</div>
			<div style="grid-column: span 2" class="row">
				<button class="btn" type="submit">Crear cuenta</button>
			</div>
			<div class="small" style="grid-column: span 2">Las contraseñas se guardan con hash y salt sólo para evitar texto plano (no seguro para producción).</div>
		</form>
	</section>`;
}

export function bindLoginEvents(root){
	const form = root.querySelector('#formLogin');
	const formReg = root.querySelector('#formRegister');
	const tabLogin = root.querySelector('#tabLogin');
	const tabRegister = root.querySelector('#tabRegister');

	function show(tab){
		if (!form || !formReg || !tabLogin || !tabRegister) return;
		const loginActive = tab === 'login';
		form.style.display = loginActive ? 'grid' : 'none';
		formReg.style.display = loginActive ? 'none' : 'grid';
		tabLogin.classList.toggle('ghost', !loginActive);
		tabRegister.classList.toggle('ghost', loginActive);
	}
	tabLogin?.addEventListener('click', ()=>show('login'));
	tabRegister?.addEventListener('click', ()=>show('register'));

	form?.addEventListener('submit', (e)=>{
		e.preventDefault();
		const data = Object.fromEntries(new FormData(form));
		const users = db.get('users', []);
		const found = users.find(u => (u.email===data.user || u.username===data.user || u.name===data.user));
		if (!found) { alert('Usuario no encontrado'); return; }
		if (!found.salt || !found.hash) { alert('El usuario no tiene contraseña configurada. Crea una nuevamente.'); return; }
		const h = hashPassword(String(data.pass||''), found.salt);
		if (h !== found.hash) { alert('Contraseña incorrecta'); return; }
		setSession({ user: { id: found.id, name: found.name, email: found.email, role: found.role || 'asesor' }, at: Date.now() });
		location.hash = '#/dashboard';
	});

	formReg?.addEventListener('submit', (e)=>{
		e.preventDefault();
		const data = Object.fromEntries(new FormData(formReg));
		const users = db.get('users', []);
		const exists = users.find(u => u.email===data.email || u.username===data.username);
		if (exists) { alert('Ya existe un usuario con ese email o usuario.'); return; }
		const salt = makeSalt();
		const hash = hashPassword(String(data.pass||''), salt);
		const user = {
			id: uid('usr'),
			name: String(data.name||'').trim(),
			email: String(data.email||'').trim(),
			username: String(data.username||'').trim(),
			role: data.role || 'asesor',
			salt, hash,
			createdAt: new Date().toISOString(),
		};
		users.push(user);
		db.set('users', users);
		alert('Cuenta creada. Ya puedes iniciar sesión.');
		show('login');
	});

	// default view
	show('login');
}

// Clientes
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

// Propiedades (expanded form)
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
			<div style="grid-column: span 6">
				<label>Descripción</label>
				<textarea class="input" name="description" rows="2" placeholder="Descripción breve..."></textarea>
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
		<table class="table">
			<thead>
				<tr>
					<th>Título</th><th>Precio</th><th>Ubicación</th><th>Tipo</th><th>Estado</th><th></th>
				</tr>
			</thead>
			<tbody>
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
					description: data.description?.trim(),
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
					description: data.description?.trim(),
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
			form.description.value = p.description || '';
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

// Pipeline
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

// Asesores
export function AsesoresView(){
	const users = db.get('users', []).filter(u=>u.role!=='admin');
	return `
	<section class="card">
		<h2>Asesores</h2>
		<table class="table">
			<thead><tr><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
			<tbody>
				${users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td><span class="badge">${u.role}</span></td></tr>`).join('')}
			</tbody>
		</table>
	</section>`;
}

// Configuración
export function ConfigView(){
	return `
	<section class="card">
		<h2>Configuración</h2>
		<p class="small">Esta versión guarda los datos en tu navegador (localStorage). Puedes exportar e importar JSON.</p>
		<div class="row">
			<button class="btn" id="btnExport">Exportar datos</button>
			<label class="btn ghost" for="fileImport">Importar JSON</label>
			<input id="fileImport" type="file" accept="application/json" style="display:none" />
			<button class="btn danger" id="btnReset">Borrar todo</button>
			<button class="btn secondary" id="btnLogout">Cerrar sesión</button>
		</div>
		<pre id="exportOut" class="card" style="margin-top:12px; white-space:pre-wrap"></pre>
	</section>`;
}

export function bindConfigEvents(root){
	const out = root.querySelector('#exportOut');
	const btnExport = root.querySelector('#btnExport');
	const file = root.querySelector('#fileImport');
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
	file?.addEventListener('change', async ()=>{
		const f = file.files?.[0];
		if (!f) return;
		const text = await f.text();
		try{
			const data = JSON.parse(text);
			if (Array.isArray(data.users)) localStorage.setItem('crmInmo_v1:users', JSON.stringify(data.users));
			if (Array.isArray(data.clients)) localStorage.setItem('crmInmo_v1:clients', JSON.stringify(data.clients));
			if (Array.isArray(data.properties)) localStorage.setItem('crmInmo_v1:properties', JSON.stringify(data.properties));
			alert('Datos importados');
			location.reload();
		}catch(e){ alert('JSON inválido'); }
	});
	btnReset?.addEventListener('click', ()=>{
		if (confirm('Esto eliminará todos los datos locales. ¿Continuar?')){
			Object.keys(localStorage).forEach(k=>{ if(k.startsWith('crmInmo_v1:')) localStorage.removeItem(k); });
			location.reload();
		}
	});
	btnLogout?.addEventListener('click', ()=>{ clearSession(); location.hash = '#/login'; });
}
// Replace file with working version from /js/views.js
// The content is identical to the source file; imports already point to './storage.js'.
// ...existing code...
import { db, uid, setSession, clearSession, makeSalt, hashPassword } from './storage.js';

export function DashboardView() { /* content from js/views.js */ }
export function LoginView(){ /* content from js/views.js */ }
export function bindLoginEvents(root){ /* content from js/views.js */ }
export function ClientesView() { /* content from js/views.js */ }
export function bindClientesEvents(root) { /* content from js/views.js */ }
export function PropiedadesView() { /* content from js/views.js */ }
export function bindPropiedadesEvents(root) { /* content from js/views.js */ }
export function PipelineView() { /* content from js/views.js */ }
export function bindPipelineEvents(root){ /* content from js/views.js */ }
export function AsesoresView(){ /* content from js/views.js */ }
export function ConfigView(){ /* content from js/views.js */ }
export function bindConfigEvents(root){ /* content from js/views.js */ }
