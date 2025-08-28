import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';

export const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const u = req.user;
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});
