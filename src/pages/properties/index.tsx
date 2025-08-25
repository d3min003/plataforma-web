import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

type Property = { id: string; title: string; price: number; status: 'Available' | 'Sold' };

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data.properties ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price, status: 'Available' }),
      });
      if (res.ok) {
        setTitle('');
        setPrice(0);
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Propiedades</h1>
      <p>
        <Link href="/">Inicio</Link>
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Precio" value={price} onChange={e => setPrice(Number(e.target.value))} type="number" min={0} required />
        <button disabled={loading}>{loading ? 'Guardando…' : 'Agregar propiedad'}</button>
      </form>
      <ul>
        {properties.map(p => (
          <li key={p.id}>
            {p.title} — ${'{'}p.price{'}'} — {p.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
