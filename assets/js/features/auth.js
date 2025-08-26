import { db, setSession, hashPassword } from '../core/storage.js';

export function LoginView(){
  // Login-only screen; accounts are provisioned by admin. Optional users import (JSON)
  return `
  <section class="card" style="max-width:520px; margin:48px auto">
    <h2>Acceso</h2>
    <p class="small">Los usuarios y contraseñas son otorgados por administración. Usa tus credenciales asignadas.</p>

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
  </section>`;
}

export function bindLoginEvents(root){
  const form = root.querySelector('#formLogin');
  // no import users

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const users = db.get('users', []);
    const found = users.find(u => (u.email===data.user || u.username===data.user || u.name===data.user));
    if (!found) { alert('Usuario no encontrado'); return; }
    if (!found.salt || !found.hash) { alert('El usuario no tiene contraseña configurada. Carga usuarios válidos.'); return; }
    const h = hashPassword(String(data.pass||''), found.salt);
    if (h !== found.hash) { alert('Contraseña incorrecta'); return; }
    setSession({ user: { id: found.id, name: found.name, email: found.email, role: found.role || 'asesor' }, at: Date.now() });
    location.hash = '#/dashboard';
  });

  // removed import users
}
