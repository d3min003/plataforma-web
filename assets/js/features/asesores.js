import { db } from '../core/storage.js';

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
