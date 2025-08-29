// Test de conexión a PostgreSQL usando pg + dotenv
// Carga .env desde base-datos-central (o alternativas) y ejecuta una query simple.

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

function loadEnv() {
  const candidates = [
    process.env.CENTRAL_ENV_PATH,                                  // Ruta explícita (opcional)
    path.resolve(__dirname, '.env'),                               // .env en plataforma-web (opcional)
    path.resolve(__dirname, '../base-datos-central/.env'),         // repo hermano (recomendado)
    path.resolve(__dirname, 'backend/.env'),                       // backend local opcional
  ].filter(Boolean);

  let loadedFrom = null;
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        loadedFrom = p;
        break;
      }
    } catch (_) { /* noop */ }
  }
  // Fallback a variables del entorno del sistema si no hay archivo .env
  if (!loadedFrom) dotenv.config();
  return loadedFrom;
}

function checkRequired(vars) {
  const missing = vars.filter((v) => !process.env[v] || String(process.env[v]).trim() === '');
  return missing;
}

(async function main() {
  const loadedFrom = loadEnv();
  if (loadedFrom) {
    console.log(`ℹ️  Variables de entorno cargadas desde: ${loadedFrom}`);
  } else {
    console.log('ℹ️  Usando variables de entorno del sistema (no se encontró .env).');
  }

  const required = ['PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'];
  const missing = checkRequired(required);
  if (missing.length) {
    console.error(`❌ Faltan variables requeridas: ${missing.join(', ')}`);
    console.error('   Define estas variables en el .env de base-datos-central o exporta CENTRAL_ENV_PATH con su ruta.');
    process.exit(1);
  }

  const config = {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    connectionTimeoutMillis: Number(process.env.PGCONNECT_TIMEOUT) || 5000,
    idleTimeoutMillis: 10000,
    max: Number(process.env.PGPOOL_MAX) || 5,
  };

  // SSL opcional: habilítalo si tu servidor lo requiere (por ejemplo, PGSSLMODE=require)
  if ((process.env.PGSSL || '').toLowerCase() === 'require' || (process.env.PGSSLMODE || '').toLowerCase() === 'require') {
    config.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(config);

  try {
    const client = await pool.connect();
    try {
      const q = `SELECT NOW() AS now, current_user AS usr, version() AS ver;`;
      const { rows } = await client.query(q);
      const r = rows[0] || {};
      const now = r.now instanceof Date ? r.now.toISOString() : String(r.now);
      const verShort = String(r.ver || '').split('\n')[0];

      console.log(`✅ Conexión exitosa a ${config.host}:${config.port}/${config.database} como ${config.user}`);
      console.log(`   NOW: ${now} | current_user: ${r.usr}`);
      console.log(`   ${verShort}`);
      process.exit(0);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Error de conexión a PostgreSQL');
    console.error(`   Código: ${err.code || 'N/A'}`);
    console.error(`   Detalle: ${err.message || err}`);
    console.error('   Pistas:');
    console.error('   - Verifica que Docker/servicio de PostgreSQL esté corriendo y accesible (puerto 5432).');
    console.error('   - Revisa credenciales en el .env (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE).');
    console.error('   - Si requiere SSL, establece PGSSLMODE=require.');
    process.exit(1);
  } finally {
    await pool.end().catch(() => {});
  }
})();