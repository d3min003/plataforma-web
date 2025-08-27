// Simple login view guarded locally via session (localStorage)
import { getSession, setSession } from '../core/storage.js';

const USER = 'Corporativo_Diamante';
const PASS = 'CD2025/3$$';

export function LoginView() {
	const sess = getSession();
	if (sess) {
		// Already logged in
		location.hash = '#/dashboard';
		return '<p>Redirigiendo…</p>';
	}
	return `
		<section class="card" aria-labelledby="loginTitle">
			<h1 id="loginTitle">Iniciar sesión</h1>
			<form id="loginForm" class="form">
				<label for="loginUser">Usuario</label>
				<input id="loginUser" name="user" type="text" autocomplete="username" required placeholder="Usuario" />
				<label for="loginPass">Contraseña</label>
				<input id="loginPass" name="pass" type="password" autocomplete="current-password" required placeholder="Contraseña" />
				<button type="submit" class="btn primary" id="loginSubmit">Entrar</button>
			</form>
			<div id="loginError" role="alert" style="display:none; color:#b00020; margin-top:8px;">Credenciales inválidas</div>
			<p class="small" style="opacity:.7; margin-top:12px;">Demo: usuario <code>${USER}</code></p>
		</section>
	`;
}

export function bindLoginEvents(root) {
	const form = root.querySelector('#loginForm');
	const err = root.querySelector('#loginError');
	if (!form) return;
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const u = root.querySelector('#loginUser')?.value?.trim();
		const p = root.querySelector('#loginPass')?.value;
		if (u === USER && p === PASS) {
			setSession({
				user: { username: USER, name: 'Corporativo Diamante', role: 'admin' },
				loginAt: new Date().toISOString(),
			});
			// Navigate to dashboard
			location.hash = '#/dashboard';
			return;
		}
		if (err) err.style.display = '';
	});
}

export default { LoginView, bindLoginEvents };
