import { Router } from 'express';
import { pool } from '../db/pool.js';
import { signToken } from '../auth/jwt.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const { rows } = await pool.query('SELECT id, email, name, password_hash, role FROM users WHERE email=$1', [body.email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
    const token = signToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// Stateless logout (frontend debe borrar el token). Se deja por compatibilidad.
router.post('/logout', async (req, res) => {
  res.json({ ok: true });
});
