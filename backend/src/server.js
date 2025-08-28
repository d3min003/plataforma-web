import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { router as authRouter } from './routes/auth.js';
import { router as userRouter } from './routes/user.js';
import { router as customersRouter } from './routes/customers.js';
import { router as notesRouter } from './routes/notes.js';
import { errorHandler } from './utils/error.js';

const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS for Vercel frontend
const origin = process.env.CORS_ORIGIN?.split(',').map(s=>s.trim()).filter(Boolean) || [];
app.use(cors({ origin, credentials: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Basic rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Health
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/customers', customersRouter);
app.use('/api/notes', notesRouter);

// Error handler
app.use(errorHandler);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`[server] listening on :${port}`);
});
