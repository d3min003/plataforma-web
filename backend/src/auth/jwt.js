import jwt from 'jsonwebtoken';

const ISSUER = process.env.JWT_ISSUER || 'crm-backend';
const AUD = process.env.JWT_AUDIENCE || 'crm-frontend';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, {
    issuer: ISSUER,
    audience: AUD,
    expiresIn: EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET, {
    issuer: ISSUER,
    audience: AUD,
  });
}
