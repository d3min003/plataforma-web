import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

type Lead = { id: string; name: string; email: string };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data.leads ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setName('');
        setEmail('');
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Leads</h1>
      <p>
        <Link href="/">Inicio</Link>
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <button disabled={loading}>{loading ? 'Guardando…' : 'Agregar lead'}</button>
      </form>
      <ul>
        {leads.map(l => (
          <li key={l.id}>
            {l.name} — {l.email}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
