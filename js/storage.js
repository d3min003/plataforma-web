// Simple localStorage wrapper with namespacing and optional minimal seeding (no demo data)
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
  if (!db.get('users')) db.set('users', []);
  if (!db.get('clients')) db.set('clients', []);
  if (!db.get('properties')) db.set('properties', []);
}

// Session helpers
export function getSession() {
  return db.get('session', null);
}
export function setSession(session) {
  db.set('session', session);
}
export function clearSession() {
  localStorage.removeItem(`${NS}:session`);
}

// Simple, non-cryptographic hashing (FNV-1a 32-bit) for passwords with salt.
// Note: This is only to avoid storing plaintext in localStorage; it is NOT secure.
export function makeSalt(len = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

export function hashPassword(password, salt) {
  const str = `${salt}:${password}`;
  let h = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // 32-bit FNV prime multiplication with overflow
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // Convert to unsigned 32-bit and hex
  return (h >>> 0).toString(16).padStart(8, '0');
}
