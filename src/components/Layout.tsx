import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <header style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <strong style={{ marginRight: 'auto' }}>Plataforma Web</strong>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/">Inicio</Link>
          <Link href="/leads">Leads</Link>
          <Link href="/properties">Propiedades</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
