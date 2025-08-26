import { seedIfEmpty, getSession } from './core/storage.js';
import { register, startRouter } from './core/router.js';
import { DashboardView, ClientesView, bindClientesEvents, PropiedadesView, bindPropiedadesEvents, PipelineView, bindPipelineEvents, AsesoresView, ConfigView, bindConfigEvents, LoginView, bindLoginEvents } from './features/index.js';

seedIfEmpty();

const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// Simple session gate: if no session, route to login and hide nav links
function updateNavVisibility(){
	const session = getSession();
	const nav = document.querySelector('.nav');
	if (nav) {
		nav.style.display = session ? 'flex' : 'none';
		nav.setAttribute('aria-hidden', session ? 'false' : 'true');
	}
}

register('#/login', LoginView, (root)=>{ bindLoginEvents(root); updateNavVisibility(); });
register('#/dashboard', DashboardView);
register('#/clientes', ClientesView, bindClientesEvents);
register('#/propiedades', PropiedadesView, bindPropiedadesEvents);
register('#/pipeline', PipelineView, bindPipelineEvents);
register('#/asesores', AsesoresView);
register('#/config', ConfigView, bindConfigEvents);

startRouter(document.getElementById('app'));

// Initial redirect by session
if (!getSession()) {
	location.hash = '#/login';
} else {
	updateNavVisibility();
}

addEventListener('hashchange', updateNavVisibility);
