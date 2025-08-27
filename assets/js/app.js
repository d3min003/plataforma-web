import { seedIfEmpty, getSession, clearSession } from './core/storage.js';
import { register, startRouter } from './core/router.js';
import { DashboardView, bindDashboardEvents, ClientesView, bindClientesEvents, PropiedadesView, bindPropiedadesEvents, AsesoresView, bindAsesoresEvents, LoginView, bindLoginEvents } from './features/index.js';

seedIfEmpty();

const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// Ensure hash set once before router to avoid double render
if (!location.hash) location.hash = '#/login';

// Toggle nav visibility by session
function updateNav() {
	const nav = document.querySelector('nav.nav');
	const logged = !!getSession();
	if (nav) {
		nav.style.display = logged ? 'flex' : 'none';
		nav.setAttribute('aria-hidden', logged ? 'false' : 'true');
	}
	const logoutBtn = document.getElementById('logout');
	if (logoutBtn) logoutBtn.style.display = logged ? '' : 'none';
}

// Basic logout handler if #logout is clicked (optional external button)
document.addEventListener('click', (e) => {
	const t = e.target;
	if (t && t.matches && t.matches('#logout')) {
		clearSession();
		updateNav();
		location.hash = '#/login';
	}
});

// Route registration (login + app)
register('#/login', LoginView, (root) => { bindLoginEvents(root); updateNav(); });
register('#/dashboard', () => {
	if (!getSession()) { location.hash = '#/login'; return '<p>Redirigiendo…</p>'; }
	return DashboardView();
}, (root) => { if (!getSession()) return; bindDashboardEvents(root); updateNav(); });
register('#/clientes', () => {
	if (!getSession()) { location.hash = '#/login'; return '<p>Redirigiendo…</p>'; }
	return ClientesView();
}, (root) => { if (!getSession()) return; bindClientesEvents(root); });
register('#/propiedades', () => {
	if (!getSession()) { location.hash = '#/login'; return '<p>Redirigiendo…</p>'; }
	return PropiedadesView();
}, (root) => { if (!getSession()) return; bindPropiedadesEvents(root); });
register('#/asesores', () => {
	if (!getSession()) { location.hash = '#/login'; return '<p>Redirigiendo…</p>'; }
	return AsesoresView();
}, (root) => { if (!getSession()) return; bindAsesoresEvents(root); });

updateNav();
startRouter(document.getElementById('app'));
