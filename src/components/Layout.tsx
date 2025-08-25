import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <strong>Plataforma Web</strong>
      </header>
      <main>{children}</main>
    </div>
  );
}
