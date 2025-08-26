// Minimal compatibility shim for legacy imports
// Re-export modular feature views so older imports keep working.
export { DashboardView, bindDashboardEvents } from './features/dashboard.js';
export { ClientesView, bindClientesEvents } from './features/clientes.js';
export { PropiedadesView, bindPropiedadesEvents } from './features/propiedades.js';
export { AsesoresView, bindAsesoresEvents } from './features/asesores.js';

// Legacy placeholders retained only if needed elsewhere
