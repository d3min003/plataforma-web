import { db, uid, makeSalt, hashPassword } from '../core/storage.js';

export function AsesoresView(){
  const users = db.get('users', []).filter(u=>u.role!=='admin');
  return `
  <section class="card">
    <h2>Asesores</h2>
    <form id="formAsesor" class="grid" style="grid-template-columns: repeat(6, 1fr); align-items:end; gap:12px">
      <div style="grid-column: span 2">
        <label>Nombre</label>
        <input class="input" name="name" required />
      </div>
      <div style="grid-column: span 2">
        <label>Email</label>
        <input class="input" name="email" type="email" required />
      </div>
      <div style="grid-column: span 2">
        <label>Usuario</label>
        <input class="input" name="username" required />
      </div>
      <div style="grid-column: span 2">
        <label>Contraseña</label>
        <input class="input" name="password" type="password" required />
      </div>
      <div>
        <label>Rol</label>
        <select class="input" name="role">
          <option value="asesor">asesor</option>
        </select>
      </div>
      <div>
        <button class="btn" type="submit">Agregar asesor</button>
      </div>
    </form>
  </section>
  <section class="card" style="margin-top:16px">
    <table class="table">
      <thead><tr><th>Nombre</th><th>Email</th><th>Usuario</th><th>Rol</th><th></th></tr></thead>
      <tbody>
        ${users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.username}</td><td><span class="badge">${u.role}</span></td><td style="text-align:right"><button class="btn danger" data-del="${u.id}">Borrar</button></td></tr>`).join('')}
      </tbody>
    </table>
  </section>`;
}

export function bindAsesoresEvents(root){
  const form = root.querySelector('#formAsesor');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const users = db.get('users', []);
    const exists = users.some(u=>u.username===data.username || u.email===data.email);
    if (exists) { alert('Usuario o email ya existe.'); return; }
    const salt = makeSalt();
    const hash = hashPassword(String(data.password||''), salt);
    users.push({ id: uid('usr'), name: data.name?.trim(), email: data.email?.trim(), username: data.username?.trim(), role: 'asesor', salt, hash, createdAt: new Date().toISOString() });
    db.set('users', users);
    location.hash = '#/asesores';
  });
  root.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-del');
      const arr = db.get('users', []).filter(u=>u.id!==id || u.role==='admin');
      db.set('users', arr);
      location.hash = '#/asesores';
    });
  });
}
