import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middlewares/auth.js';
import { z } from 'zod';

export const router = Router();

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  type: z.enum(['Comprador','Vendedor','Arrendador','Arrendatario']).optional().nullable(),
  status: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone, type, status, zone, notes, created_at FROM customers ORDER BY created_at DESC LIMIT 500');
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = CustomerSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO customers (name, email, phone, type, status, zone, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, name, email, phone, type, status, zone, notes, created_at`,
      [body.name, body.email||null, body.phone||null, body.type||null, body.status||null, body.zone||null, body.notes||null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});
