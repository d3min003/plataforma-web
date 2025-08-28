import 'dotenv/config';
import { pool } from '../db/pool.js';
import bcrypt from 'bcryptjs';

async function main(){
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';
  const pass = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (rows.length) { console.log('Admin already exists'); process.exit(0); }
  const hash = await bcrypt.hash(pass, 10);
  const res = await pool.query('INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id', [email, name, hash, 'admin']);
  console.log('Admin created', res.rows[0].id);
  process.exit(0);
}

main().catch(err=>{ console.error(err); process.exit(1); });
