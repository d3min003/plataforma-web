import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middlewares/auth.js';
import { z } from 'zod';

export const router = Router();

const NoteSchema = z.object({
  customerId: z.string().uuid(),
  text: z.string().min(1).max(2000)
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const customerId = req.query.customerId;
    const params = [];
    let sql = `SELECT n.id, n.customer_id as "customerId", n.text, n.created_at,
                      u.id as user_id, u.name as user_name
               FROM notes n
               JOIN users u ON u.id = n.user_id`;
    if (customerId) { sql += ' WHERE n.customer_id = $1'; params.push(customerId); }
    sql += ' ORDER BY n.created_at DESC LIMIT 500';
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const body = NoteSchema.parse(req.body);
    const userId = req.user.id;
    const { rows } = await pool.query(
      `INSERT INTO notes (customer_id, user_id, text)
       VALUES ($1,$2,$3)
       RETURNING id, customer_id as "customerId", text, created_at`,
      [body.customerId, userId, body.text]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});
