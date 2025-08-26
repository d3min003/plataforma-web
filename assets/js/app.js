import { seedIfEmpty } from './core/storage.js';
import { register, startRouter } from './core/router.js';
import { DashboardView, bindDashboardEvents, ClientesView, bindClientesEvents, PropiedadesView, bindPropiedadesEvents, AsesoresView, bindAsesoresEvents } from './features/index.js';

seedIfEmpty();

const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// No login: nav always visible
register('#/dashboard', DashboardView, bindDashboardEvents);
register('#/clientes', ClientesView, bindClientesEvents);
register('#/propiedades', PropiedadesView, bindPropiedadesEvents);
register('#/asesores', AsesoresView, bindAsesoresEvents);

startRouter(document.getElementById('app'));

// Initial redirect to dashboard
if (!location.hash) location.hash = '#/dashboard';
