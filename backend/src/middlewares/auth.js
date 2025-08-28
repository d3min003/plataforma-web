import { verifyToken } from '../auth/jwt.js';

export function requireAuth(req, res, next) {
  const h = req.headers['authorization'] || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  if (!m) return res.status(401).json({ error: 'missing_bearer' });
  const token = m[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}
