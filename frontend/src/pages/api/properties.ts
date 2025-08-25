import type { NextApiRequest, NextApiResponse } from 'next';

type Property = { id: string; title: string; price: number; status: 'Available' | 'Sold' };
let properties: Property[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return res.status(200).json({ properties });
  if (req.method === 'POST') {
    const { title, price, status } = req.body || {};
    const id = Math.random().toString(36).slice(2, 9);
    const p: Property = { id, title, price: Number(price ?? 0), status: status || 'Available' };
    properties.push(p);
    return res.status(201).json(p);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
