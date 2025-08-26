import { seedIfEmpty, getSession, clearSession } from './core/storage.js';
import { register, startRouter } from './core/router.js';
import { DashboardView, bindDashboardEvents, ClientesView, bindClientesEvents, PropiedadesView, bindPropiedadesEvents, AsesoresView, bindAsesoresEvents, LoginView, bindLoginEvents } from './features/index.js';

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
register('#/dashboard', DashboardView, bindDashboardEvents);
register('#/clientes', ClientesView, bindClientesEvents);
register('#/propiedades', PropiedadesView, bindPropiedadesEvents);
register('#/asesores', AsesoresView, bindAsesoresEvents);

// Logout link (handled globally)
document.addEventListener('click', (e)=>{
	const a = e.target.closest('a[href="#/logout"]');
	if (a) {
		e.preventDefault();
		clearSession();
		location.hash = '#/login';
	}
});

startRouter(document.getElementById('app'));

// Initial redirect by session
if (!getSession()) {
	location.hash = '#/login';
} else {
	updateNavVisibility();
}

addEventListener('hashchange', updateNavVisibility);
