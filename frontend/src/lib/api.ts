import { API_URL } from '@/lib/config';

export type Lead = { id: string; name: string; email: string };
export type Property = { id: string; title: string; price: number; status: 'Available' | 'Sold' };

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json() as Promise<{ status: string; timestamp: string }>;
}

export async function listLeads() {
  const res = await fetch(`${API_URL}/leads`);
  return (await res.json()) as { leads: Lead[] };
}

export async function createLead(payload: { name: string; email: string }) {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as Lead;
}

export async function listProperties() {
  const res = await fetch(`${API_URL}/properties`);
  return (await res.json()) as { properties: Property[] };
}

export async function createProperty(payload: { title: string; price: number; status?: 'Available' | 'Sold' }) {
  const res = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as Property;
}
