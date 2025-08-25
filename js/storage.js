// Simple localStorage wrapper with namespacing and seed data
const NS = 'crmInmo_v1';

export const db = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`${NS}:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  },
  push(key, item) {
    const arr = db.get(key, []);
    arr.push(item);
    db.set(key, arr);
    return item;
  },
  update(key, id, patch) {
    const arr = db.get(key, []);
    const i = arr.findIndex(x => x.id === id);
    if (i >= 0) {
      arr[i] = { ...arr[i], ...patch, updatedAt: new Date().toISOString() };
      db.set(key, arr);
      return arr[i];
    }
    return null;
  },
  remove(key, id) {
    const arr = db.get(key, []);
    const out = arr.filter(x => x.id !== id);
    db.set(key, out);
    return out.length !== arr.length;
  }
};

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function seedIfEmpty() {
  if (!db.get('users')) {
    db.set('users', [
      { id: 'u_admin', name: 'Admin', role: 'admin', email: 'admin@example.com' },
      { id: 'u_asesor1', name: 'Ana Asesora', role: 'asesor', email: 'ana@example.com' },
      { id: 'u_asesor2', name: 'Luis Asesor', role: 'asesor', email: 'luis@example.com' },
    ]);
  }
  if (!db.get('clients')) {
    db.set('clients', [
      { id: uid('cli'), name: 'Carlos Pérez', email: 'carlos@example.com', phone: '+54 11 5555-1111', budgetMin: 80000, budgetMax: 120000, zone: 'Centro', type: 'Departamento', createdAt: new Date().toISOString() },
      { id: uid('cli'), name: 'María Ortiz', email: 'maria@example.com', phone: '+54 11 5555-2222', budgetMin: 150000, budgetMax: 250000, zone: 'Norte', type: 'Casa', createdAt: new Date().toISOString() },
    ]);
  }
  if (!db.get('properties')) {
    db.set('properties', [
      { id: uid('prop'), title: 'Depto 2 Amb - Centro', price: 110000, zone: 'Centro', address: 'Av. Siempreviva 123', type: 'Departamento', status: 'disponible', bedrooms: 1, baths: 1, m2: 45, createdAt: new Date().toISOString() },
      { id: uid('prop'), title: 'Casa 4 Amb - Norte', price: 230000, zone: 'Norte', address: 'Calle Arce 450', type: 'Casa', status: 'negociacion', bedrooms: 3, baths: 2, m2: 130, createdAt: new Date().toISOString() },
      { id: uid('prop'), title: 'PH 3 Amb - Oeste', price: 160000, zone: 'Oeste', address: 'Paso 900', type: 'PH', status: 'reservado', bedrooms: 2, baths: 1, m2: 80, createdAt: new Date().toISOString() },
    ]);
  }
}
