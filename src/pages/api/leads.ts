import type { NextApiRequest, NextApiResponse } from 'next';

let leads: Array<{ id: string; name: string; email: string }> = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ leads });
  }
  if (req.method === 'POST') {
    const { name, email } = req.body || {};
    const id = Math.random().toString(36).slice(2, 9);
    const lead = { id, name, email };
    leads.push(lead);
    return res.status(201).json(lead);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
