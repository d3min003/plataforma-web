// Capa API: abstrae acceso a datos (hoy localStorage, mañana backend/DB)
import { db, uid } from './storage.js';

export const api = {
  clients: {
    list() {
      return db.get('clients', []);
    },
    get(id) {
      const arr = db.get('clients', []);
      return arr.find(c => c.id === id) || null;
    },
    create(data) {
      const item = {
        id: data.id || uid('cli'),
        createdAt: data.createdAt || new Date().toISOString(),
        ...data,
      };
      const arr = db.get('clients', []);
      arr.push(item);
      db.set('clients', arr);
      return item;
    },
    update(id, patch) {
      return db.update('clients', id, patch);
    },
    remove(id) {
      return db.remove('clients', id);
    },
  },
  // Placeholders para futuras entidades
  properties: {
    list() { return db.get('properties', []); },
  },
  users: {
    list() { return db.get('users', []); },
  }
};

// Nota: Para backend real, reemplace estas funciones por fetch/axios a su API.
