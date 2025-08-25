import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory stores
const leads: Array<{ id: string; name: string; email: string }> = [];
const properties: Array<{ id: string; title: string; price: number; status: 'Available' | 'Sold' }> = [];

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/leads', (_req, res) => {
  res.json({ leads });
});

app.post('/leads', (req, res) => {
  const { name, email } = req.body || {};
  const id = Math.random().toString(36).slice(2, 9);
  const lead = { id, name, email };
  leads.push(lead);
  res.status(201).json(lead);
});

app.get('/properties', (_req, res) => {
  res.json({ properties });
});

app.post('/properties', (req, res) => {
  const { title, price, status } = req.body || {};
  const id = Math.random().toString(36).slice(2, 9);
  const p = { id, title, price: Number(price ?? 0), status: status || 'Available' } as const;
  properties.push(p as any);
  res.status(201).json(p);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
