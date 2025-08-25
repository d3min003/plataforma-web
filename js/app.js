import { seedIfEmpty } from './storage.js';
import { register, startRouter } from './router.js';
import { DashboardView, ClientesView, bindClientesEvents, PropiedadesView, bindPropiedadesEvents, PipelineView, bindPipelineEvents, AsesoresView, ConfigView, bindConfigEvents } from './views.js';

seedIfEmpty();

document.getElementById('year').textContent = String(new Date().getFullYear());

register('#/dashboard', DashboardView);
register('#/clientes', ClientesView, bindClientesEvents);
register('#/propiedades', PropiedadesView, bindPropiedadesEvents);
register('#/pipeline', PipelineView, bindPipelineEvents);
register('#/asesores', AsesoresView);
register('#/config', ConfigView, bindConfigEvents);

startRouter(document.getElementById('app'));
