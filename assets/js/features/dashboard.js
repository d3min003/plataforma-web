import { db } from '../core/storage.js';

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
